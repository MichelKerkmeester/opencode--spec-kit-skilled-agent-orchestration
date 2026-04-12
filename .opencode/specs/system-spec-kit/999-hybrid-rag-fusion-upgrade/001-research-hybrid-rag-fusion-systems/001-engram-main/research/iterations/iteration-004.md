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
I’m treating this as a read-only deep research pass for iteration 004, focused narrowly on Engram’s session lifecycle and how it compares to Spec Kit Memory. I’ll read the governing instructions and the actual Engram source paths first, then trace session creation, upkeep, summarization, and resume behavior end to end before I synthesize the findings in your required format.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc 'rg -n "engram|hybrid-rag-fusion|session lifecycle|session_resume|generate-context" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
151:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse when patching memory render/reviewer behavior in this checkout and proving fixes through an end-to-end generate-context run
161:- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars
195:- 005-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
832:- read-only verification, session_bootstrap, session_resume minimal, code_graph_query, startup snapshot note, ensureCodeGraphReady, SELECTIVE_REINDEX_THRESHOLD=50
846:- `session_bootstrap`/`session_resume({ minimal: true })` should still expose freshness-aware graph state and the startup snapshot note; this is a contract-level verification target before deeper debugging [Task 3]
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

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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


codex
I’ve finished the instruction pass and I’m into the source trace now. Next I’m narrowing on the session codepaths themselves: where Engram creates sessions, stores prompts and summaries, formats resume context, and how the OpenCode plugin keeps that lifecycle alive between runs.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "rg -n \"CreateSession\\(|EndSession\\(|FormatContext\\(|mem_session_start|mem_session_end|mem_session_summary|ensureSession|session_id|summary|recent sessions|prompts|observations|sanitizeFTS|SuggestTopicKey\\(\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md:80:| `mem_session_summary` | End-of-session save |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md:86:| `mem_session_start` | Register session start |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md:87:| `mem_session_end` | Mark session complete |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md:139:| `engram projects prune` | Remove projects with 0 observations (`--dry-run`) |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:71:- **sessions** — `id` (TEXT PK), `project`, `directory`, `started_at`, `ended_at`, `summary`, `status`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:72:- **observations** — `id` (INTEGER PK AUTOINCREMENT), `session_id` (FK), `type`, `title`, `content`, `tool_name`, `project`, `scope`, `topic_key`, `normalized_hash`, `revision_count`, `duplicate_count`, `last_seen_at`, `created_at`, `updated_at`, `deleted_at`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:73:- **observations_fts** — FTS5 virtual table synced via triggers (`title`, `content`, `tool_name`, `type`, `project`)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:74:- **user_prompts** — `id` (INTEGER PK AUTOINCREMENT), `session_id` (FK), `content`, `project`, `created_at`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:75:- **prompts_fts** — FTS5 virtual table synced via triggers (`content`, `project`)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:103:engram projects prune     Remove projects with 0 observations [--dry-run]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:163:| **Dashboard** | Stats overview (sessions, observations, prompts, projects) + menu |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:166:| **Recent Observations** | Browse all observations, newest first |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:184:- **`(active)` badge** — shown next to sessions and observations from active (non-completed) sessions, sorted to the top of every list
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:200:- `AllObservations()` — All observations regardless of session status, active sorted first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:201:- `SessionObservations(sessionID)` — All observations for a specific session, chronological order
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:216:- `POST /sessions/{id}/end` — End session. Body: `{summary}`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:221:- `POST /observations` — Add observation. Body: `{session_id, type, title, content, tool_name?, project?, scope?, topic_key?}`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:222:- `GET /observations/recent` — Recent observations. Query: `?project=X&scope=project|personal&limit=N`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:223:- `GET /observations/{id}` — Get single observation by ID
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:224:- `PATCH /observations/{id}` — Update fields. Body: `{title?, content?, type?, project?, scope?, topic_key?}`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:225:- `DELETE /observations/{id}` — Delete observation (`?hard=true` for hard delete, soft delete by default)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:237:- `POST /prompts` — Save user prompt. Body: `{session_id, content, project?}`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:238:- `GET /prompts/recent` — Recent prompts. Query: `?project=X&limit=N`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:239:- `GET /prompts/search` — Search prompts. Query: `?q=QUERY&project=X&limit=N`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:267:Save structured observations. The tool description teaches agents the format:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:292:Save user prompts — records what the user asked so future sessions have context about user goals.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:296:Get recent memory context from previous sessions — shows sessions, prompts, and observations, with optional scope filtering for observations.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:300:Show memory system statistics — sessions, observations, prompts, projects.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:304:Progressive disclosure: after searching, drill into chronological context around a specific observation. Shows N observations before and after within the same session.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:310:### mem_session_summary
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:312:Save comprehensive end-of-session summary using OpenCode-style format:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:322:### mem_session_start
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:326:### mem_session_end
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:328:Mark a session as completed with optional summary.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:336:**Admin tool.** Merge multiple project name variants into a single canonical name. Accepts an array of source project names and a target canonical name. All observations, sessions, and prompts from the source projects are reassigned to the canonical project.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:415:- Reuse the same `topic_key` to update an evolving topic instead of creating new observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:432:Before ending a session or saying "done" / "listo" / "that's it", you MUST call `mem_session_summary` with this structure:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:458:When completing a task or subtask, include a `## Key Learnings:` section at the end of your response with numbered items. Engram will automatically extract and save these as observations.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:473:1. IMMEDIATELY call `mem_session_summary` with the compacted summary content — this persists what was done before compaction
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:493:1. `mem_search` — Find relevant observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:514:- `engram export` — JSON dump of all sessions, observations, prompts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:543:- Compressed: a chunk with 8 sessions + 10 observations = ~2KB
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:551:Instead of a separate LLM service, the agent itself compresses observations. The agent already has the model, context, and API key.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:564:- **Session summary** (`mem_session_summary`): OpenCode-style comprehensive summary
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:580:- **`mem_save`** — Agent saves structured observations after significant work (decisions, bugfixes, patterns)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:581:- **`mem_session_summary`** — Agent saves comprehensive end-of-session summaries
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:585:The plugin still counts tool calls per session (for session end summary stats) but doesn't persist them as observations.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:598:4. **Tracks tool count**: Counts tool calls per session (for session end stats), but does NOT persist raw tool observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:599:5. **Captures user prompts**: From `message.updated` events (>10 chars)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:606:The plugin uses `ensureSession()` — an idempotent function that creates the session in engram if it doesn't exist yet. This is called from every hook that receives a `sessionID`, not just `session.created`. This means:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:622:`mem_search`, `mem_save`, `mem_update`, `mem_delete`, `mem_suggest_topic_key`, `mem_save_prompt`, `mem_session_summary`, `mem_context`, `mem_stats`, `mem_timeline`, `mem_get_observation`, `mem_session_start`, `mem_session_end`, `mem_capture_passive`, `mem_merge_projects`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:675:7. **No raw auto-capture** — Raw tool calls (edit, bash, etc.) are noisy, pollute search results, and bloat the database. The agent saves curated summaries via `mem_save` and `mem_session_summary` instead. Shell history and git provide the raw audit trail.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/proposal.md:11:- **Markdown vault generation** — observations as notes with YAML frontmatter + wikilinks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/proposal.md:14:- **Incremental sync** — track last export timestamp, only write new/changed observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/proposal.md:39:- Writes markdown files: frontmatter (type, project, scope, topic_key, session_id, created_at) + content body + wikilinks section
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/proposal.md:40:- Wikilinks derived from: shared topic_key prefix → `[[topic-hub]]`, session_id → `[[session-hub]]`, project → folder
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/proposal.md:41:- Hub notes: `_sessions/{session-id}.md` lists all observations in that session; `_topics/{topic-prefix}.md` lists all observations sharing a topic_key prefix
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/proposal.md:65:| Large vaults (10k+ observations) slow Obsidian | Medium | Folder-per-project isolation, incremental sync, configurable project filter |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/proposal.md:66:| Topic-key wikilinks create orphan hub pages | Low | Only generate hub notes when ≥2 observations share a prefix |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:16:- `--limit <n>` (optional): cap exported observations at n (default: unlimited)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:17:- `--since <date>` (optional): export only observations created after this ISO-8601 date
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:25:- THEN export runs scoped to project "eng", max 100 observations, created after 2026-01-01
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:74:- A YAML frontmatter block containing: `type`, `project`, `scope`, `topic_key`, `session_id`, `created_at`, `tags`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:78:`topic_key` and `session_id` in frontmatter MAY be empty strings when the observation has no value.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:82:- GIVEN an observation with type="bugfix", project="eng", scope="project", topic_key="auth/jwt", session_id="abc123", created_at="2026-01-01T10:00:00Z", content="Fixed the bug"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:99:For each unique `session_id` among exported observations, the exporter MUST generate a hub note at `_sessions/{session-id}.md` listing all observations in that session as wikilinks.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:101:#### Scenario: Session with multiple observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:103:- GIVEN observations obs-1 and obs-2 both have session_id="sess-42"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:108:#### Scenario: Observation with no session_id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:110:- GIVEN an observation with no session_id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:119:A topic hub note at `_topics/{prefix}.md` MUST be generated **only when ≥2 exported observations share the same topic_key prefix** (the first segment of a `/`-delimited topic_key).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:123:#### Scenario: Two observations share a prefix → hub created
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:127:- THEN `_topics/sdd.md` is created listing both observations as wikilinks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:145:The exporter MUST persist the last-export timestamp in `{vault}/engram/.engram-sync-state.json`. On subsequent runs, it MUST only write observations created or updated after that timestamp.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:151:- THEN all matching observations are exported
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:167:- THEN observations since 2026-01-01 are exported (overriding the state file timestamp)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:175:#### Scenario: Two observations with identical content previews
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:190:- AND no observations have changed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:192:- THEN no files are written (no disk I/O for unchanged observations)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:473:- THEN each cycle exports only observations from project "engram"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md:479:- THEN observations since 2026-01-01 are exported
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_test.go:106:	if err := s.CreateSession(sessionID, project, "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_test.go:665:	// Seed observations for two projects
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_test.go:681:	// alpha has 2 observations, beta has 1 — alpha should appear first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:11: *   Uses `ensureSession()` before any DB write. This means sessions are
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:33:  "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:38:  "mem_session_start",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:39:  "mem_session_end",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:72:- Reuse the same \`topic_key\` to update an evolving topic instead of creating new observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:92:1. Call \`mem_session_summary\` with this structure:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:117:1. IMMEDIATELY call \`mem_session_summary\` with the compacted summary content — this persists what was done before compaction
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:221:  async function ensureSession(sessionId: string): Promise<void> {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:302:          await ensureSession(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:305:          // to ensureSession() are also suppressed for it.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:343:      // Also fallback to summary if parts yield nothing
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:344:      const fallback = !content && output.message.summary
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:345:        ? `${output.message.summary.title ?? ""}\n${output.message.summary.body ?? ""}`.trim()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:350:      // Only capture non-trivial prompts (>10 chars)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:352:        await ensureSession(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:353:        await engramFetch("/prompts", {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:356:            session_id: sessionId,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:376:        await ensureSession(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:384:          await engramFetch("/observations/passive", {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:387:              session_id: sessionId,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:418:    // compacted summary. This is our chance to:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:425:        await ensureSession(input.sessionID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:437:      // compacted summary to Engram. The new agent reads the compacted
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:438:      // summary and this instruction, then saves it as a session summary.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:442:        `You MUST include the following instruction at the TOP of the compacted summary:\n\n` +
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:443:        `"FIRST ACTION REQUIRED: Call mem_session_summary with the content of this compacted summary. ` +
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:31:- **Creates sessions** on-demand via `ensureSession()` (resilient to restarts/reconnects)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:34:- **Instructs the compressor** to tell the new agent to persist the compacted summary via `mem_session_summary`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:37:**No raw tool call recording** — the agent handles all memory via `mem_save` and `mem_session_summary`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:45:- **SESSION CLOSE**: Mandatory `mem_session_summary` before ending — "This is NOT optional. If you skip this, the next session starts blind."
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:111:1. Injects the previous session context + compacted summary
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:112:2. Tells the agent: "FIRST ACTION REQUIRED — call `mem_session_summary` with this content before doing anything else"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:118:- **Session close protocol** — mandatory `mem_session_summary` before ending
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:119:- **After compaction** — 3-step recovery: persist summary → load context → continue
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/memory-protocol/SKILL.md:51:1. Call `mem_session_summary`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/memory-protocol/SKILL.md:55:1. Save summary first.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md:126:        5. Append wikilinks: [[session-{session_id}]], [[topic-{prefix}]]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md:130:    → For each topic_key prefix with ≥2 observations:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md:132:    → For deleted observations (in state but not in export):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md:175:session_id: session-abc123
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md:204:session_id: session-abc123
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md:285:3. Filter observations:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md:297:5. For deleted observations:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md:342:        // 5. Show Notice with summary
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md:379:| `TestProjectFilter` | Only matching project observations exported |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md:389:    // 5. Add more observations → run Export() again
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md:397:- 3 projects, 5 sessions, 20 observations across types
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md:410:| Hub threshold | ≥2 observations | Always create | Prevents orphan hub clutter |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:4:// observations from AI coding sessions. This is the core of Engram —
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:35:	Summary   *string `json:"summary,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:41:	SessionID      string  `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:67:	Summary          *string `json:"summary,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:73:	TotalObservations int      `json:"total_observations"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:74:	TotalPrompts      int      `json:"total_prompts"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:80:	SessionID      string  `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:113:	SessionID string `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:135:	SessionID string `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:142:	SessionID string `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:205:	Summary   *string `json:"summary,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:210:	SessionID  string  `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:225:	SessionID string  `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:235:	Observations []Observation `json:"observations"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:236:	Prompts      []Prompt      `json:"prompts"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:276:// MaxObservationLength returns the configured maximum content length for observations.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:447:			summary    TEXT
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:450:			CREATE TABLE IF NOT EXISTS observations (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:453:				session_id TEXT    NOT NULL,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:468:			FOREIGN KEY (session_id) REFERENCES sessions(id)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:471:		CREATE INDEX IF NOT EXISTS idx_obs_session  ON observations(session_id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:472:		CREATE INDEX IF NOT EXISTS idx_obs_type     ON observations(type);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:473:		CREATE INDEX IF NOT EXISTS idx_obs_project  ON observations(project);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:474:		CREATE INDEX IF NOT EXISTS idx_obs_created  ON observations(created_at DESC);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:476:		CREATE VIRTUAL TABLE IF NOT EXISTS observations_fts USING fts5(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:483:			content='observations',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:487:			CREATE TABLE IF NOT EXISTS user_prompts (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:490:				session_id TEXT    NOT NULL,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:494:			FOREIGN KEY (session_id) REFERENCES sessions(id)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:497:		CREATE INDEX IF NOT EXISTS idx_prompts_session ON user_prompts(session_id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:498:		CREATE INDEX IF NOT EXISTS idx_prompts_project ON user_prompts(project);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:499:		CREATE INDEX IF NOT EXISTS idx_prompts_created ON user_prompts(created_at DESC);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:501:		CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:504:			content='user_prompts',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:559:		if err := s.addColumnIfNotExists("observations", c.name, c.definition); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:568:	if err := s.addColumnIfNotExists("user_prompts", "sync_id", "TEXT"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:573:		CREATE INDEX IF NOT EXISTS idx_obs_scope ON observations(scope);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:574:		CREATE INDEX IF NOT EXISTS idx_obs_sync_id ON observations(sync_id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:575:		CREATE INDEX IF NOT EXISTS idx_obs_topic ON observations(topic_key, project, scope, updated_at DESC);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:576:		CREATE INDEX IF NOT EXISTS idx_obs_deleted ON observations(deleted_at);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:577:		CREATE INDEX IF NOT EXISTS idx_obs_dedupe ON observations(normalized_hash, project, scope, type, title, created_at DESC);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:578:		CREATE INDEX IF NOT EXISTS idx_prompts_sync_id ON user_prompts(sync_id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:607:	if _, err := s.execHook(s.db, `UPDATE observations SET scope = 'project' WHERE scope IS NULL OR scope = ''`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:610:	if _, err := s.execHook(s.db, `UPDATE observations SET topic_key = NULL WHERE topic_key = ''`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:613:	if _, err := s.execHook(s.db, `UPDATE observations SET revision_count = 1 WHERE revision_count IS NULL OR revision_count < 1`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:616:	if _, err := s.execHook(s.db, `UPDATE observations SET duplicate_count = 1 WHERE duplicate_count IS NULL OR duplicate_count < 1`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:619:	if _, err := s.execHook(s.db, `UPDATE observations SET updated_at = created_at WHERE updated_at IS NULL OR updated_at = ''`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:622:	if _, err := s.execHook(s.db, `UPDATE observations SET sync_id = 'obs-' || lower(hex(randomblob(16))) WHERE sync_id IS NULL OR sync_id = ''`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:626:	if _, err := s.execHook(s.db, `UPDATE user_prompts SET project = '' WHERE project IS NULL`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:629:	if _, err := s.execHook(s.db, `UPDATE user_prompts SET sync_id = 'prompt-' || lower(hex(randomblob(16))) WHERE sync_id IS NULL OR sync_id = ''`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:644:			CREATE TRIGGER obs_fts_insert AFTER INSERT ON observations BEGIN
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:645:				INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:649:			CREATE TRIGGER obs_fts_delete AFTER DELETE ON observations BEGIN
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:650:				INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:654:			CREATE TRIGGER obs_fts_update AFTER UPDATE ON observations BEGIN
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:655:				INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:657:				INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:678:			CREATE TRIGGER prompt_fts_insert AFTER INSERT ON user_prompts BEGIN
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:679:				INSERT INTO prompts_fts(rowid, content, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:683:			CREATE TRIGGER prompt_fts_delete AFTER DELETE ON user_prompts BEGIN
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:684:				INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:688:			CREATE TRIGGER prompt_fts_update AFTER UPDATE ON user_prompts BEGIN
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:689:				INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:691:				INSERT INTO prompts_fts(rowid, content, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:705:	err := s.db.QueryRow("SELECT COUNT(*) FROM pragma_table_xinfo('observations_fts') WHERE name = 'topic_key'").Scan(&colCount)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:714:		DROP TABLE IF EXISTS observations_fts;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:715:		CREATE VIRTUAL TABLE observations_fts USING fts5(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:722:			content='observations',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:725:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:727:		FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:730:		CREATE TRIGGER obs_fts_insert AFTER INSERT ON observations BEGIN
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:731:			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:735:		CREATE TRIGGER obs_fts_delete AFTER DELETE ON observations BEGIN
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:736:			INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:740:		CREATE TRIGGER obs_fts_update AFTER UPDATE ON observations BEGIN
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:741:			INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:743:			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:754:func (s *Store) CreateSession(id, project, directory string) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:770:func (s *Store) EndSession(id string, summary string) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:773:			`UPDATE sessions SET ended_at = datetime('now'), summary = ? WHERE id = ?`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:774:			nullableString(summary), id,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:791:			`SELECT project, directory, ended_at, summary FROM sessions WHERE id = ?`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:809:		`SELECT id, project, directory, started_at, ended_at, summary FROM sessions WHERE id = ?`, id,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:827:		SELECT s.id, s.project, s.started_at, s.ended_at, s.summary,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:830:		LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:860:// AllSessions returns recent sessions ordered by most recent first (for TUI browsing).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:867:		SELECT s.id, s.project, s.started_at, s.ended_at, s.summary,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:870:		LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:900:// AllObservations returns recent observations ordered by most recent first (for TUI browsing).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:907:		SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:909:		FROM observations o
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:929:// SessionObservations returns all observations for a specific session.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:936:		SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:938:		FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:939:		WHERE session_id = ? AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:969:				`SELECT id FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:980:					`UPDATE observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1016:			`SELECT id FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1030:				`UPDATE observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1052:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1085:		SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1087:		FROM observations o
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1122:			`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1153:	query := `SELECT id, ifnull(sync_id, '') as sync_id, session_id, content, ifnull(project, '') as project, created_at FROM user_prompts`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1186:	ftsQuery := sanitizeFTS(query)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1189:		SELECT p.id, ifnull(p.sync_id, '') as sync_id, p.session_id, p.content, ifnull(p.project, '') as project, p.created_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1190:		FROM prompts_fts fts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1191:		JOIN user_prompts p ON p.id = fts.rowid
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1192:		WHERE prompts_fts MATCH ?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1206:		return nil, fmt.Errorf("search prompts: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1225:		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1227:		 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1278:			`UPDATE observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1325:			if _, err := s.execHook(tx, `DELETE FROM observations WHERE id = ?`, id); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1330:				`UPDATE observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1338:			if err := tx.QueryRow(`SELECT deleted_at FROM observations WHERE id = ?`, id).Scan(&deletedAt); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1355:// Given an observation ID, it returns N observations before and M after,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1377:		// Session might be missing for manual-save observations — non-fatal
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1381:	// 3. Get observations BEFORE the focus (same session, older, chronological order)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1383:		SELECT id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1385:		FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1386:		WHERE session_id = ? AND id < ? AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1415:	// 4. Get observations AFTER the focus (same session, newer, chronological order)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1417:		SELECT id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1419:		FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1420:		WHERE session_id = ? AND id > ? AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1445:	// 5. Count total observations in the session for context
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1448:		"SELECT COUNT(*) FROM observations WHERE session_id = ? AND deleted_at IS NULL", focus.SessionID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1477:			SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1479:			FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1519:	ftsQuery := sanitizeFTS(query)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1522:		SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1525:		FROM observations_fts fts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1526:		JOIN observations o ON o.id = fts.rowid
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1527:		WHERE observations_fts MATCH ? AND o.deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1592:	s.db.QueryRow("SELECT COUNT(*) FROM observations WHERE deleted_at IS NULL").Scan(&stats.TotalObservations)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1593:	s.db.QueryRow("SELECT COUNT(*) FROM user_prompts").Scan(&stats.TotalPrompts)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1595:	rows, err := s.queryItHook(s.db, "SELECT project FROM observations WHERE project IS NOT NULL AND deleted_at IS NULL GROUP BY project ORDER BY MAX(created_at) DESC")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613:func (s *Store) FormatContext(project, scope string) (string, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1619:	observations, err := s.RecentObservations(project, scope, s.cfg.MaxContextResults)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1624:	prompts, err := s.RecentPrompts(project, 10)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1629:	if len(sessions) == 0 && len(observations) == 0 && len(prompts) == 0 {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1639:			summary := ""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1641:				summary = fmt.Sprintf(": %s", truncate(*sess.Summary, 200))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1643:			fmt.Fprintf(&b, "- **%s** (%s)%s [%d observations]\n",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1644:				sess.Project, sess.StartedAt, summary, sess.ObservationCount)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1649:	if len(prompts) > 0 {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1651:		for _, p := range prompts {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1657:	if len(observations) > 0 {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1659:		for _, obs := range observations {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1679:		"SELECT id, project, directory, started_at, ended_at, summary FROM sessions ORDER BY started_at",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1698:		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1700:		 FROM observations ORDER BY id`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1703:		return nil, fmt.Errorf("export observations: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1723:		"SELECT id, ifnull(sync_id, '') as sync_id, session_id, content, ifnull(project, '') as project, created_at FROM user_prompts ORDER BY id",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1726:		return nil, fmt.Errorf("export prompts: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1755:			`INSERT OR IGNORE INTO sessions (id, project, directory, started_at, ended_at, summary)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1766:	// Import observations (use new IDs — AUTOINCREMENT)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1769:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1794:	// Import prompts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1797:			`INSERT INTO user_prompts (sync_id, session_id, content, project, created_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1816:	ObservationsImported int `json:"observations_imported"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1817:	PromptsImported      int `json:"prompts_imported"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2123:		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2125:		 FROM observations WHERE sync_id = ? AND deleted_at IS NULL ORDER BY id DESC LIMIT 1`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2216:	ObservationsUpdated int64 `json:"observations_updated"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2218:	PromptsUpdated      int64 `json:"prompts_updated"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2230:			SELECT 1 FROM observations WHERE project = ?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2234:			SELECT 1 FROM user_prompts WHERE project = ?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2248:		res, err := s.execHook(tx, `UPDATE observations SET project = ? WHERE project = ?`, newName, oldName)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2250:			return fmt.Errorf("migrate observations: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2260:		res, err = s.execHook(tx, `UPDATE user_prompts SET project = ? WHERE project = ?`, newName, oldName)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2262:			return fmt.Errorf("migrate prompts: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2279:// ProjectNameCount holds a project name and how many observations it has.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2285:// ListProjectNames returns all distinct project names from observations,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2289:		`SELECT DISTINCT project FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2324:		 FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2394:		 FROM user_prompts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2399:		return nil, fmt.Errorf("list projects prompts: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2433:// CountObservationsForProject returns the number of non-deleted observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2439:		`SELECT COUNT(*) FROM observations WHERE project = ? AND deleted_at IS NULL`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2450:	ObservationsUpdated int64    `json:"observations_updated"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2452:	PromptsUpdated      int64    `json:"prompts_updated"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2474:			res, err := s.execHook(tx, `UPDATE observations SET project = ? WHERE project = ?`, canonical, src)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2476:				return fmt.Errorf("merge observations %q → %q: %w", src, canonical, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2488:			res, err = s.execHook(tx, `UPDATE user_prompts SET project = ? WHERE project = ?`, canonical, src)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2490:				return fmt.Errorf("merge prompts %q → %q: %w", src, canonical, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2514:	PromptsDeleted  int64  `json:"prompts_deleted"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2517:// PruneProject removes all sessions and prompts for a project that has zero
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2518:// (non-deleted) observations. Returns an error if the project still has
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2519:// observations — the caller must verify first.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2525:	// Safety check: refuse to prune if observations exist.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2528:		return nil, fmt.Errorf("count observations: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2531:		return nil, fmt.Errorf("project %q still has %d observations — cannot prune", project, count)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2537:		res, err := s.execHook(tx, `DELETE FROM user_prompts WHERE project = ?`, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2539:			return fmt.Errorf("prune prompts: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2664:		SELECT id, project, directory, ended_at, summary
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2697:		SELECT sync_id, session_id, type, title, content, tool_name, project, scope, topic_key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2698:		FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2706:			  AND sm.entity_key = observations.sync_id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2731:		SELECT sync_id, session_id, content, project
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2732:		FROM user_prompts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2739:			  AND sm.entity_key = user_prompts.sync_id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2845:		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2847:		 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2857:	query := `SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2859:		 FROM observations WHERE sync_id = ?`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2888:		`INSERT INTO sessions (id, project, directory, ended_at, summary)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2894:		   summary = COALESCE(excluded.summary, sessions.summary)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2904:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, updated_at, deleted_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2914:		`UPDATE observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2915:		 SET session_id = ?, type = ?, title = ?, content = ?, tool_name = ?, project = ?, scope = ?, topic_key = ?, normalized_hash = ?, revision_count = revision_count + 1, updated_at = datetime('now'), deleted_at = NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2931:		_, err = s.execHook(tx, `DELETE FROM observations WHERE id = ?`, existing.ID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2940:		`UPDATE observations SET deleted_at = ?, updated_at = datetime('now') WHERE id = ?`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2948:	err := tx.QueryRow(`SELECT id FROM user_prompts WHERE sync_id = ? ORDER BY id DESC LIMIT 1`, payload.SyncID).Scan(&existingID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2951:			`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2960:		`UPDATE user_prompts SET session_id = ?, content = ?, project = ? WHERE id = ?`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3017:	rows, err := s.queryItHook(s.db, "PRAGMA table_info(observations)")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3050:		return fmt.Errorf("migrate legacy observations: begin tx: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3055:		CREATE TABLE observations_migrated (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3058:			session_id TEXT    NOT NULL,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3073:			FOREIGN KEY (session_id) REFERENCES sessions(id)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3076:		return fmt.Errorf("migrate legacy observations: create table: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3080:		INSERT INTO observations_migrated (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3081:			id, sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3092:			session_id,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3107:		FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3110:		return fmt.Errorf("migrate legacy observations: copy rows: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3113:	if _, err := s.execHook(tx, "DROP TABLE observations"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3114:		return fmt.Errorf("migrate legacy observations: drop old table: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3117:	if _, err := s.execHook(tx, "ALTER TABLE observations_migrated RENAME TO observations"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3118:		return fmt.Errorf("migrate legacy observations: rename table: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3125:		DROP TABLE IF EXISTS observations_fts;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3126:		CREATE VIRTUAL TABLE observations_fts USING fts5(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3133:			content='observations',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3136:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3138:		FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3141:		return fmt.Errorf("migrate legacy observations: rebuild fts: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3145:		return fmt.Errorf("migrate legacy observations: commit: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3201:func SuggestTopicKey(typ, title, content string) string {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3246:	case "session_summary":
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3382:// sanitizeFTS wraps each word in quotes so FTS5 doesn't choke on special chars.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3384:func sanitizeFTS(query string) string {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3398:	SessionID string `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3407:	Saved      int `json:"saved"`      // New observations created
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3481:// PassiveCapture extracts learnings from text and saves them as observations.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3482:// It deduplicates against existing observations using content hash matching.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3501:			`SELECT id FROM observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/skills/memory/SKILL.md:16:- `mem_save`, `mem_search`, `mem_context`, `mem_session_summary`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/skills/memory/SKILL.md:18:- `mem_session_start`, `mem_session_end`, `mem_save_prompt`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/skills/memory/SKILL.md:22:select:mcp__plugin_engram_engram__mem_save,mcp__plugin_engram_engram__mem_search,mcp__plugin_engram_engram__mem_context,mcp__plugin_engram_engram__mem_session_summary,mcp__plugin_engram_engram__mem_get_observation,mcp__plugin_engram_engram__mem_suggest_topic_key,mcp__plugin_engram_engram__mem_update,mcp__plugin_engram_engram__mem_session_start,mcp__plugin_engram_engram__mem_session_end,mcp__plugin_engram_engram__mem_save_prompt
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/skills/memory/SKILL.md:94:1. Call `mem_session_summary` with this structure:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/skills/memory/SKILL.md:119:1. IMMEDIATELY call `mem_session_summary` with the compacted summary content — this persists what was done before compaction
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:215:**For Copilot:** Create a `.instructions.md` file in the VS Code User `prompts/` folder and paste the Memory Protocol from [DOCS.md](../DOCS.md#memory-protocol-full-text).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:218:- macOS: `~/Library/Application Support/Code/User/prompts/engram-memory.instructions.md`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:219:- Linux: `~/.config/Code/User/prompts/engram-memory.instructions.md`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:220:- Windows: `%APPDATA%\Code\User\prompts\engram-memory.instructions.md`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:227:- **Session close** — mandatory `mem_session_summary` before ending
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:318:You have access to Engram persistent memory via MCP tools (mem_save, mem_search, mem_session_summary, etc.).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:332:You have access to Engram persistent memory via MCP tools (mem_save, mem_search, mem_session_summary, etc.).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:337:**For VS Code** (`Code/User/prompts/*.instructions.md` or custom instructions):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:340:You have access to Engram persistent memory via MCP tools (mem_save, mem_search, mem_session_summary, etc.).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:348:You have access to Engram persistent memory via MCP tools (mem_save, mem_search, mem_session_summary, etc.).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:372:This is the **nuclear option** — system prompts survive everything, including compaction.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-plugin/spec.md:65:- AND on success a notice "Synced N observations" is shown
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-plugin/spec.md:96:#### Scenario: Incremental sync — only new observations written
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-plugin/spec.md:101:- AND only observations created/updated after T1 are returned and written
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-plugin/spec.md:115:- Count of observations on last sync (e.g., "42 notes")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-plugin/spec.md:121:- GIVEN a sync completes successfully with 37 observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/COMPARISON.md:34:- `mem_session_summary` at session end: structured Goal/Discoveries/Accomplished/Files
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go:129:		return s.FormatContext(project, scope)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go:417:	if err := os.WriteFile(importFile, []byte(`{"version":"0.1.0","exported_at":"2026-01-01T00:00:00Z","sessions":[],"observations":[],"prompts":[]}`), 0644); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go:513:	if err := os.WriteFile(importFile, []byte(`{"version":"0.1.0","exported_at":"2026-01-01T00:00:00Z","sessions":[],"observations":[],"prompts":[]}`), 0644); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go:641:		"observations":[{"id":1,"session_id":"missing-session","type":"note","title":"x","content":"y","scope":"project","revision_count":1,"duplicate_count":1,"created_at":"2026-01-01 00:00:00","updated_at":"2026-01-01 00:00:00"}],
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go:642:		"prompts":[]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go:829:	t.Run("timeline prints session summary", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go:830:		summary := "this session has a non-empty summary"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go:835:				SessionInfo:  &store.Session{Project: "proj", StartedAt: "2026-01-01", Summary: &summary},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go:843:		if !strings.Contains(stdout, "Session: proj") || !strings.Contains(stdout, "non-empty summary") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go:844:			t.Fatalf("expected summary in timeline output, got: %q", stdout)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/archive-report.md:22:| Live smoke test | 1,731 observations + 277 hubs exported successfully |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:88:	storeFormatContext = func(s *store.Store, project, scope string) (string, error) { return s.FormatContext(project, scope) }
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:412:	s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:474:		summary := ""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:476:			summary = fmt.Sprintf(" — %s", truncate(*result.SessionInfo.Summary, 100))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:478:		fmt.Printf("Session: %s (%s)%s\n", result.SessionInfo.Project, result.SessionInfo.StartedAt, summary)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:479:		fmt.Printf("Total observations in session: %d\n\n", result.TotalInRange)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:529:	ctx, err := storeFormatContext(s, project, scope)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:966:		promptWord := "prompts"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:982:	Canonical string // suggested canonical (most observations)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:1059:		// Suggest the one with most observations as canonical
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:1338:		fmt.Printf("  Merged: %d obs, %d sessions, %d prompts\n\n",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:1362:	// Find projects with 0 observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:1375:	fmt.Printf("Found %d project(s) with 0 observations:\n\n", len(candidates))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:1377:		fmt.Printf("  [%d] %-30s %3d sessions  %3d prompts\n", i+1, ps.Name, ps.SessionCount, ps.PromptCount)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:1427:	fmt.Printf("\nPruned %d project(s): %d sessions, %d prompts removed.\n", len(selected), totalSessions, totalPrompts)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:1560:                       --limit         Cap exported observations at N (optional)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:1561:                       --since         Export only observations after this date, e.g. 2026-01-01 (optional)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:30:2. Agent calls mem_save with a structured summary:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:45:Session ends → Agent writes session summary (Goal/Discoveries/Accomplished/Files)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:61:| `mem_session_summary` | Save end-of-session summary |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:67:| `mem_session_start` | Register a session start |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:68:| `mem_session_end` | Mark a session as completed |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:94:- `mem_search`, `mem_context`, recent lists, and timeline ignore soft-deleted observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:174:engram projects prune     Remove projects with 0 observations [--dry-run]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/src/settings.ts:122:				"Only sync observations from this project. Leave empty to sync all projects."
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh:18:SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh:65:mem_save, mem_search, mem_context, mem_session_summary, mem_get_observation, mem_save_prompt
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh:67:Use ToolSearch for other tools: mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end, mem_stats, mem_delete, mem_timeline, mem_capture_passive
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh:92:Call `mem_session_summary` with: Goal, Discoveries, Accomplished, Next Steps, Relevant Files.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:71:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:115:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:159:	ctx, err := s.FormatContext("engram", "personal")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:174:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:264:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:316:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:347:		t.Fatalf("expected different topic keys to create different observations")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:350:	observations, err := s.AllObservations("engram", "project", 10)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:352:		t.Fatalf("all observations: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:354:	if len(observations) != 2 {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:355:		t.Fatalf("expected 2 observations, got %d", len(observations))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:375:			summary TEXT
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:377:		CREATE TABLE observations (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:379:			session_id TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:388:		INSERT INTO observations (id, session_id, type, title, content, project, created_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:413:		t.Fatalf("all observations after migration: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:416:		t.Fatalf("expected 3 migrated observations, got %d", len(obs))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:470:			summary TEXT
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:472:		CREATE TABLE user_prompts (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:474:			session_id TEXT NOT NULL,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:478:			FOREIGN KEY (session_id) REFERENCES sessions(id)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:481:		INSERT INTO user_prompts (session_id, content, project) VALUES ('s1', 'legacy prompt', 'engram');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:501:	if err := s.db.QueryRow("SELECT sync_id FROM user_prompts WHERE content = ?", "legacy prompt").Scan(&syncID); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:509:	rows, err := s.db.Query("PRAGMA table_info(user_prompts)")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:531:		t.Fatalf("expected user_prompts.sync_id column after migration")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:535:	if err := s.db.QueryRow("SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'idx_prompts_sync_id'").Scan(&indexName); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:538:	if indexName != "idx_prompts_sync_id" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:539:		t.Fatalf("expected idx_prompts_sync_id to exist, got %q", indexName)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:544:	got := SuggestTopicKey("Architecture", "  Auth Model  ", "ignored")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:549:	fallback := SuggestTopicKey("bugfix", "", "Fix nil panic in auth middleware on empty token")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:556:	bug := SuggestTopicKey("manual", "", "Fix regression in auth login flow")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:561:	arch := SuggestTopicKey("", "ADR: Split API gateway boundary", "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:570:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:621:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:627:		"INSERT INTO user_prompts (session_id, content, project) VALUES (?, ?, NULL)",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:635:	prompts, err := s.RecentPrompts("", 10)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:639:	if len(prompts) != 1 || prompts[0].Project != "" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:640:		t.Errorf("expected empty string for null project, got %q", prompts[0].Project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:667:		t.Error("exported prompts missing the test prompt")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:806:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:833:		t.Fatalf("all observations: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:836:		t.Fatalf("expected 2 observations, got %d", len(obs))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:851:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:872:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:936:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:939:	if err := s.CreateSession("s2", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:944:		`INSERT INTO observations (session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, created_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:951:		t.Fatalf("insert observations: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:982:		`INSERT INTO observations (session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, created_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1003:		t.Fatalf("recent sessions: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1006:		t.Fatalf("expected at least 2 recent sessions, got %d", len(recent))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1009:		t.Fatalf("expected s-older first in recent sessions, got %s", recent[0].ID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1016:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1043:		t.Fatalf("session observations: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1090:	if err := s.CreateSession("sync-session", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1128:	if err := s.EndSession("sync-session", "done"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1155:	if err := s.db.QueryRow("SELECT sync_id FROM observations WHERE id = ?", obsID).Scan(&observationSyncID); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1163:	if err := s.db.QueryRow("SELECT sync_id FROM user_prompts WHERE id = ?", promptID).Scan(&promptSyncID); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1312:		Payload:   `{"sync_id":"obs-remote-1","session_id":"remote-session","type":"decision","title":"Remote","content":"Pulled from cloud","project":"engram","scope":"project"}`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1322:	if err := s.db.QueryRow("SELECT COUNT(*) FROM observations WHERE sync_id = ?", "obs-remote-1").Scan(&rowCount); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1430:	if err := s.CreateSession("s-end", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1455:	if err := s.EndSession("s-end", "finished session"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1467:		t.Fatalf("expected summary to be stored, got %+v", sess.Summary)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1497:		{name: "type session summary", typ: "session_summary", want: "session"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1522:	if err := s.CreateSession("s-q", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1571:		t.Fatalf("recent prompts with project filter: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1579:		t.Fatalf("search prompts with project filter/default limit: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1593:	ctx, err := s.FormatContext("", "project")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1598:		t.Fatalf("expected prompts section in context output")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1635:	if err := s.CreateSession("s-edge", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1639:	if err := s.EndSession("missing", "ignored"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1643:	if err := s.EndSession("s-edge", ""); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1644:		t.Fatalf("end session with empty summary: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1655:		t.Fatalf("expected empty summary to persist as NULL, got %q", *sess.Summary)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1670:		`INSERT INTO observations (session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1717:			DROP TABLE IF EXISTS observations_fts;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1718:			DROP TABLE observations;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1719:			CREATE TABLE observations (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1720:				session_id TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1726:			t.Fatalf("recreate observations without id: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1735:		if got := SuggestTopicKey("decision", "decision", ""); got != "decision/general" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1738:		if got := SuggestTopicKey("bugfix", "bug-auth-panic", ""); got != "bug/auth-panic" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1741:		if got := SuggestTopicKey("manual", "!!!", "..."); got != "topic/general" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1758:		ctx, err := s.FormatContext("", "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1769:	t.Run("export fails when observations query fails", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1776:			DROP TABLE IF EXISTS observations_fts;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1777:			DROP TABLE observations;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1779:			t.Fatalf("drop observations: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1783:		if err == nil || !strings.Contains(err.Error(), "export observations") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1784:			t.Fatalf("expected observations export error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1788:	t.Run("export fails when prompts query fails", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1795:			DROP TABLE IF EXISTS prompts_fts;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1796:			DROP TABLE user_prompts;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1798:			t.Fatalf("drop prompts: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1802:		if err == nil || !strings.Contains(err.Error(), "export prompts") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1803:			t.Fatalf("expected prompts export error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1903:				summary TEXT
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1905:			CREATE TABLE user_prompts (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1907:				session_id TEXT NOT NULL,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1962:			DROP TABLE IF EXISTS observations_fts;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1963:			DROP TABLE observations;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1964:			CREATE TABLE observations (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1966:				session_id TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1972:			CREATE TABLE observations_migrated (id INTEGER PRIMARY KEY);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1988:			if strings.Contains(query, "UPDATE observations SET scope = 'project'") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2033:				DROP TABLE IF EXISTS observations_fts;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2034:				DROP TABLE observations;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2036:				CREATE TABLE observations (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2038:					session_id TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2054:				INSERT INTO observations (id, session_id, type, title, content, project, created_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2104:			if strings.Contains(query, "FROM observations") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2105:				return nil, errors.New("forced observations export query error")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2109:		if _, err := s.Export(); err == nil || !strings.Contains(err.Error(), "export observations") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2110:			t.Fatalf("expected observations export error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2114:			if strings.Contains(query, "FROM user_prompts") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2115:				return nil, errors.New("forced prompts export query error")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2119:		if _, err := s.Export(); err == nil || !strings.Contains(err.Error(), "export prompts") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2120:			t.Fatalf("expected prompts export error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2200:	t.Run("sessions and observations filters with default limits", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2202:		if err := s.CreateSession("s-p", "proj-a", "/tmp/proj-a"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2205:		if err := s.CreateSession("s-q", "proj-b", "/tmp/proj-b"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2217:			t.Fatalf("recent sessions filtered: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2233:			t.Fatalf("all observations defaults: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2241:			t.Fatalf("session observations default limit: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2249:			t.Fatalf("recent observations default limit: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2257:			t.Fatalf("recent prompts default limit: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2260:			t.Fatalf("expected zero prompts, got %d", len(recentPrompts))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2266:		if err := s.CreateSession("s-tl", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2296:		t.Run("recent sessions error", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2299:			if _, err := s.FormatContext("", ""); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2300:				t.Fatalf("expected format context to fail from recent sessions")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2304:		t.Run("recent observations error", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2306:			if err := s.CreateSession("s-ctx", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2309:			if _, err := s.db.Exec("DROP TABLE observations"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2310:				t.Fatalf("drop observations: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2312:			if _, err := s.FormatContext("", ""); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2313:				t.Fatalf("expected format context to fail from recent observations")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2317:		t.Run("recent prompts error", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2319:			if err := s.CreateSession("s-ctx2", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2322:			if _, err := s.db.Exec("DROP TABLE user_prompts"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2323:				t.Fatalf("drop prompts: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2325:			if _, err := s.FormatContext("", ""); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2326:				t.Fatalf("expected format context to fail from recent prompts")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2350:			"UPDATE observations SET topic_key = NULL",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2351:			"UPDATE observations SET revision_count = 1",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2352:			"UPDATE observations SET duplicate_count = 1",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2353:			"UPDATE observations SET updated_at = created_at",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2354:			"UPDATE user_prompts SET project = ''",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2389:				if strings.Contains(query, "PRAGMA table_info(observations)") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2407:				if strings.Contains(query, "PRAGMA table_info(observations)") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2423:		if err := s.CreateSession("s-e", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2472:		if err := s.CreateSession("s-u", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2492:			if strings.Contains(query, "UPDATE observations") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2524:		if err := s.CreateSession("s-iter", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2536:			t.Fatalf("expected recent sessions scan error")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2544:		setScanErr("FROM user_prompts")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2546:			t.Fatalf("expected recent prompts scan error")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2549:		setScanErr("FROM prompts_fts")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2551:			t.Fatalf("expected search prompts scan error")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2554:		setScanErr("FROM observations_fts")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2559:		setRowsErr("FROM observations_fts")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2574:		setScanErr("FROM observations ORDER BY id")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2576:			t.Fatalf("expected export observations scan error")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2579:		setRowsErr("FROM observations ORDER BY id")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2581:			t.Fatalf("expected export observations rows err")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2584:		setScanErr("FROM user_prompts ORDER BY id")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2586:			t.Fatalf("expected export prompts scan error")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2589:		setRowsErr("FROM user_prompts ORDER BY id")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2591:			t.Fatalf("expected export prompts rows err")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2612:		setRowsErr("PRAGMA table_info(observations)")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2617:		setScanErr("PRAGMA table_info(observations)")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2627:		if err := s.CreateSession("s-t2", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2712:		if err := s.CreateSession("s-c", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2721:			if strings.Contains(query, "FROM observations o") && strings.Contains(query, "WHERE o.deleted_at IS NULL") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2722:				return nil, errors.New("forced recent observations error")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2726:		if _, err := s.FormatContext("engram", "project"); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2727:			t.Fatalf("expected format context observations error")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2740:		if err := s.EndSession("s-c", "has summary"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2744:		ctx, err := s.FormatContext("engram", "project")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2746:			t.Fatalf("format context with summary: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2748:		if !strings.Contains(ctx, "has summary") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2749:			t.Fatalf("expected session summary included in context")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2761:		if _, err := s.queryObservations("SELECT id FROM observations"); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2764:		if err := s.addColumnIfNotExists("observations", "x", "TEXT"); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2776:			DROP TABLE IF EXISTS observations_fts;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2777:			DROP TABLE observations;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2779:			CREATE TABLE observations (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2781:				session_id TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2797:			INSERT INTO observations (id, session_id, type, title, content, project, created_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2803:		lateFail := []string{"INSERT INTO observations_migrated", "DROP TABLE observations", "RENAME TO observations", "CREATE VIRTUAL TABLE observations_fts"}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2811:					DROP TABLE IF EXISTS observations_fts;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2812:					DROP TABLE observations;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2814:					CREATE TABLE observations (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2816:						session_id TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2832:					INSERT INTO observations (id, session_id, type, title, content, project, created_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2859:	if err := s.CreateSession("sess-upsert", "", ""); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2865:	if err := s.CreateSession("sess-upsert", "projectA", "/tmp/a"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2885:	if err := s.CreateSession("sess-preserve", "projectA", "/tmp/a"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2890:	if err := s.CreateSession("sess-preserve", "projectB", "/tmp/b"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2911:		if err := s.CreateSession("sess-partial-1", "myproject", ""); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2915:		if err := s.CreateSession("sess-partial-1", "other", "/new/dir"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2931:		if err := s.CreateSession("sess-partial-2", "", "/existing/dir"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2934:		if err := s.CreateSession("sess-partial-2", "newproject", ""); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2950:		if err := s.CreateSession("sess-partial-3", "", ""); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2953:		if err := s.CreateSession("sess-partial-3", "", ""); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3054:		`INSERT INTO sessions (id, project, directory, ended_at, summary) VALUES (?, ?, ?, datetime('now'), ?)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3061:		`INSERT INTO observations (sync_id, session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3069:		`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3132:		`INSERT INTO observations (sync_id, session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3140:		`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3149:		DefaultSyncTargetKey, SyncEntityObservation, "obs-legacy", SyncOpUpsert, `{"sync_id":"obs-legacy","session_id":"legacy-session","project":"legacy-proj"}`, SyncSourceLocal, "legacy-proj",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3204:			summary TEXT
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3206:		CREATE TABLE observations (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3209:			session_id TEXT NOT NULL,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3224:			FOREIGN KEY (session_id) REFERENCES sessions(id)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3226:		CREATE TABLE user_prompts (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3229:			session_id TEXT NOT NULL,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3233:			FOREIGN KEY (session_id) REFERENCES sessions(id)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3265:		INSERT INTO sessions (id, project, directory, summary) VALUES ('legacy-session', 'legacy-proj', '/tmp/legacy', 'done');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3266:		INSERT INTO observations (sync_id, session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3268:		INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES ('prompt-legacy', 'legacy-session', 'Historical prompt', 'legacy-proj');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3497:	if err := s.CreateSession("proj-session", "my-project", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3607:	if err := s.CreateSession("enq-session", "enqueued-project", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3627:	if err := s.CreateSession("obs-enq", "obs-proj", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3658:	if err := s.CreateSession("prompt-enq", "prompt-proj", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3689:	if err := s.CreateSession("s-enrolled", "enrolled-proj", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3692:	if err := s.CreateSession("s-not-enrolled", "other-proj", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3728:	if err := s.CreateSession("s-no-enroll", "some-proj", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3748:	if err := s.CreateSession("skip-session", "skip-proj", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3778:	if err := s.CreateSession("s-enrolled", "enrolled", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3781:	if err := s.CreateSession("s-not-enrolled", "not-enrolled", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3818:	if err := s.CreateSession("global-session", "", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3844:	if err := s.CreateSession("global-session-2", "", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3882:	if err := s.CreateSession("mix-enrolled", "enrolled-mix", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3885:	if err := s.CreateSession("mix-global", "", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3888:	if err := s.CreateSession("mix-unenrolled", "unenrolled-mix", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3925:	s.CreateSession("s1", old, "/tmp/old")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3953:		t.Fatalf("expected 0 observations under old name, got %d", len(obs))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3986:	s.CreateSession("s1", old, "/tmp")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4050:	if err := s.CreateSession("s1", "engram", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4085:	if err := s.CreateSession("s1", "engram", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4119:	if err := s.CreateSession("s1", "engram", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4148:	if err := s.CreateSession("s-norm", "MyProject", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4164:	if err := s.CreateSession("s1", "alpha", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4167:	if err := s.CreateSession("s2", "beta", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4206:	if err := s.CreateSession("s1", "proj-a", "/work/a"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4209:	if err := s.CreateSession("s2", "proj-b", "/work/b"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4213:	// Add 3 observations to proj-a
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4260:			t.Errorf("proj-a: expected 3 observations, got %d", a.ObservationCount)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4277:		t.Errorf("expected proj-a first (most observations), got %q", stats[0].Name)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4288:	if err := s.CreateSession("s1", "engram", "/work"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4292:	// Add observations to each source
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4334:		t.Errorf("expected ≥4 observations under 'engram' after merge, got %d", len(obs))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4337:	// engram-memory should have 0 observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4343:		t.Errorf("expected 0 observations under 'engram-memory' after merge, got %d", len(obsMerged))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4356:		t.Errorf("expected 0 observations updated for nonexistent source, got %d", result.ObservationsUpdated)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4363:	if err := s.CreateSession("s1", "engram", "/work"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4388:		t.Errorf("expected 0 observations updated when sources equal canonical, got %d", result.ObservationsUpdated)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4398:	if err := s.CreateSession("s1", "alpha", "/work/alpha"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4402:	// No observations yet — count should be 0
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4411:	// Add two observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md:20:- Each session = a hub connecting its observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md:171:session_id: session-abc123
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md:201:**Topic hubs** (in `_topics/`) — one per `topic_key` prefix that has ≥2 observations. Groups related work across time. For example, all `sdd/obsidian-plugin/*` observations cluster under `_topics/sdd--obsidian-plugin.md`. Singletons don't get hubs (prevents orphan clutter).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md:216:| `--project <name>` | No | (all) | Export only observations from this project. |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md:217:| `--limit <n>` | No | 0 (no limit) | Maximum observations per source query. |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md:218:| `--since <date>` | No | (state file) | Export only observations updated after this date. Format: RFC3339 (`2026-04-06T14:30:00Z`) or `YYYY-MM-DD`. |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md:233:# Force a complete re-export (useful after pruning observations)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md:385:- **Dense petals around hubs** = observations belonging to that session/topic.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md:430:- The first run is full. Subsequent runs are incremental and fast (only writes changed observations).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md:442:- Does the graph layout feel right at your scale (100 / 1k / 10k+ observations)?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/src/main.ts:155:		const summary = parts.length > 0 ? parts.join(", ") : "nothing changed";
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/src/main.ts:156:		new Notice(`Engram: ${summary}`);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-stop.sh:11:SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/subagent-stop.sh:17:SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/subagent-stop.sh:26:curl -sf "${ENGRAM_URL}/observations/passive" \
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/subagent-stop.sh:34:    '{session_id: $sid, content: $content, project: $project, source: $source}')" \
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/post-compaction.sh:5:# the agent to persist the compacted summary via mem_session_summary.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/post-compaction.sh:16:SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/post-compaction.sh:41:mem_save, mem_search, mem_context, mem_session_summary, mem_get_observation, mem_save_prompt
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/post-compaction.sh:43:Use ToolSearch for other tools: mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end, mem_stats, mem_delete, mem_timeline, mem_capture_passive
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/post-compaction.sh:64:Call `mem_session_summary` with: Goal, Discoveries, Accomplished, Next Steps, Relevant Files.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/post-compaction.sh:71:printf "\n1. FIRST: Call mem_session_summary with the content of the compacted summary above. Use project: '%s'.\n" "$PROJECT"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/post-compaction.sh:73:printf "2. THEN: Call mem_context with project: '%s' to recover recent session history and observations.\n" "$PROJECT"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/proposal.md:59:| Too-frequent interval hammers SQLite | Low | Enforce `interval >= 1m`; incremental sync skips unchanged observations |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/issue-creation/SKILL.md:75:  --title "fix(store): duplicate observations on concurrent saves" \
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/issue-creation/SKILL.md:82:When two agents save observations concurrently, duplicates are created.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/issue-creation/SKILL.md:87:3. Query observations — duplicates appear
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/issue-creation/SKILL.md:93:Two identical observations exist with different IDs.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/issue-creation/SKILL.md:106:UNIQUE constraint failed: observations.title
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/user-prompt-submit.sh:23:SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/user-prompt-submit.sh:33:# State file lives in /tmp and is keyed by session_id (falls back to project+pid).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/user-prompt-submit.sh:54:  TOOL_MSG="CRITICAL FIRST ACTION — Execute this ToolSearch NOW before responding to the user:"$'\n'"select:mcp__plugin_engram_engram__mem_save,mcp__plugin_engram_engram__mem_search,mcp__plugin_engram_engram__mem_context,mcp__plugin_engram_engram__mem_session_summary,mcp__plugin_engram_engram__mem_get_observation,mcp__plugin_engram_engram__mem_save_prompt"$'\n\n'"After loading tools, call mem_context to check for prior session history before responding."
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/user-prompt-submit.sh:96:  "${ENGRAM_URL}/observations?project=${ENCODED_PROJECT}&limit=1&sort=created_at:desc" \
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/user-prompt-submit.sh:108:  # No observations yet — no nudge (session might just be starting)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/design.md:33:         │                    └── Exporter.Export() ──→ observations + hubs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:82:	payload := []byte(`{"sessions":[{"id":"s1"}],"observations":[],"prompts":[]}`)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:150:		"observations": []map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:151:			{"id": 1, "session_id": "s1", "type": "decision", "title": "test", "content": "data", "scope": "project", "created_at": "2025-01-01 00:00:00", "updated_at": "2025-01-01 00:00:00"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:153:		"prompts": []map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:154:			{"id": 1, "session_id": "s1", "content": "hello", "created_at": "2025-01-01 00:00:00"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:16:- `--limit <n>` (optional): cap exported observations at n (default: unlimited)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:17:- `--since <date>` (optional): export only observations created after this ISO-8601 date
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:25:- THEN export runs scoped to project "eng", max 100 observations, created after 2026-01-01
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:74:- A YAML frontmatter block containing: `type`, `project`, `scope`, `topic_key`, `session_id`, `created_at`, `tags`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:78:`topic_key` and `session_id` in frontmatter MAY be empty strings when the observation has no value.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:82:- GIVEN an observation with type="bugfix", project="eng", scope="project", topic_key="auth/jwt", session_id="abc123", created_at="2026-01-01T10:00:00Z", content="Fixed the bug"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:99:For each unique `session_id` among exported observations, the exporter MUST generate a hub note at `_sessions/{session-id}.md` listing all observations in that session as wikilinks.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:101:#### Scenario: Session with multiple observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:103:- GIVEN observations obs-1 and obs-2 both have session_id="sess-42"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:108:#### Scenario: Observation with no session_id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:110:- GIVEN an observation with no session_id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:119:A topic hub note at `_topics/{prefix}.md` MUST be generated **only when ≥2 exported observations share the same topic_key prefix** (the first segment of a `/`-delimited topic_key).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:123:#### Scenario: Two observations share a prefix → hub created
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:127:- THEN `_topics/sdd.md` is created listing both observations as wikilinks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:145:The exporter MUST persist the last-export timestamp in `{vault}/engram/.engram-sync-state.json`. On subsequent runs, it MUST only write observations created or updated after that timestamp.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:151:- THEN all matching observations are exported
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:167:- THEN observations since 2026-01-01 are exported (overriding the state file timestamp)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:175:#### Scenario: Two observations with identical content previews
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:190:- AND no observations have changed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md:192:- THEN no files are written (no disk I/O for unchanged observations)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-plugin/spec.md:65:- AND on success a notice "Synced N observations" is shown
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-plugin/spec.md:96:#### Scenario: Incremental sync — only new observations written
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-plugin/spec.md:101:- AND only observations created/updated after T1 are returned and written
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-plugin/spec.md:115:- Count of observations on last sync (e.g., "42 notes")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-plugin/spec.md:121:- GIVEN a sync completes successfully with 37 observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:69:	Memories  int    `json:"memories"`   // Number of observations in chunk
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:70:	Prompts   int    `json:"prompts"`    // Number of prompts in chunk
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:76:	Observations []store.Observation `json:"observations"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:77:	Prompts      []store.Prompt      `json:"prompts"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:84:	ObservationsExported int    `json:"observations_exported"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:85:	PromptsExported      int    `json:"prompts_exported"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:94:	ObservationsImported int `json:"observations_imported"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:95:	PromptsImported      int `json:"prompts_imported"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:409:	// Step 2: observations — match by own project OR by session
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:422:	// Step 3: prompts — match by own project OR by session
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:514:// ManifestSummary returns a human-readable summary of the manifest.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/specs/obsidian-export/spec.md:268:- THEN each cycle exports only observations from project "engram"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/specs/obsidian-export/spec.md:274:- THEN observations since 2026-01-01 are exported
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/pr-review-deep/SKILL.md:23:1. Read full diff, not only summary.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:39:	if err := s.CreateSession("s-proj", "proj-a", "/tmp/proj-a"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:42:	if err := s.CreateSession("s-other", "proj-b", "/tmp/proj-b"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:658:		t.Fatalf("unexpected filtered observations: %+v", projectOnly.Observations)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:661:		t.Fatalf("unexpected filtered prompts: %+v", projectOnly.Prompts)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:675:		t.Fatalf("unexpected new observations: %+v", newOnly.Observations)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:678:		t.Fatalf("unexpected new prompts: %+v", newOnly.Prompts)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:730:		t.Fatalf("expected 3 observations, got %d: %+v", len(result.Observations), result.Observations)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:747:		t.Fatalf("expected 2 prompts, got %d: %+v", len(result.Prompts), result.Prompts)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:754:		t.Error("expected prompts 1 and 2 to be included")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:780:		payload := []byte(`{"sessions":1,"observations":2}`)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:862:	t.Run("manifest summary", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:865:			t.Fatalf("unexpected empty summary: %q", empty)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:868:		summary := ManifestSummary(&Manifest{Chunks: []ChunkEntry{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:874:		if !strings.Contains(summary, "3 chunks") || !strings.Contains(summary, "6 memories") || !strings.Contains(summary, "4 sessions") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:875:			t.Fatalf("summary totals missing: %q", summary)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:877:		if !strings.Contains(summary, "alice (2 chunks), bob (1 chunks)") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:878:			t.Fatalf("summary contributors not sorted or counted: %q", summary)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/markdown.go:36:	fmt.Fprintf(&sb, "session_id: %s\n", obs.SessionID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/markdown.go:70:// Session wikilink: [[session-{session_id}]] (only when session_id != "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/hub_test.go:9:	t.Run("session hub contains backlinks for all observations", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/hub_test.go:58:	t.Run("topic hub with two observations lists both wikilinks", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/hub_test.go:130:		// REQ-EXPORT-05: Only create hub when ≥2 observations share the same prefix
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/hub_test.go:140:			t.Errorf("ShouldCreateTopicHub(3) must return true — ≥2 observations")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go:2452:	// b) isSubAgent gate: must guard ensureSession() call
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go:2454:		t.Fatalf("plugin must use isSubAgent flag to gate ensureSession()")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go:2462:	// Verify ensureSession itself guards against sub-agent sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go:2464:		t.Fatalf("ensureSession must check subAgentSessions before registering")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model.go:57:	observations []store.Observation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model.go:77:	observations []store.Observation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model.go:113:	// Recent observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model.go:196:		return recentObservationsMsg{observations: obs, err: err}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model.go:224:		return sessionObservationsMsg{observations: obs, err: err}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update_test.go:170:		t.Fatal("recent selection should load observations")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update_test.go:274:		t.Fatal("sessions enter should load selected session observations")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update_test.go:312:		t.Fatal("recent refresh should return observations command")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update_test.go:364:	updatedModel, _ = m.Update(recentObservationsMsg{observations: obsList})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update_test.go:367:		t.Fatal("recent observations should be updated")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update_test.go:416:	updatedModel, _ = m.Update(sessionObservationsMsg{observations: sessionObs})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update_test.go:419:		t.Fatal("session observations message should open session detail and reset cursor/scroll")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:82:	"mcp__plugin_engram_engram__mem_session_end",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:83:	"mcp__plugin_engram_engram__mem_session_start",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:84:	"mcp__plugin_engram_engram__mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:132:- Reuse the same topic_key to update an evolving topic instead of creating new observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:151:1. Call mem_session_summary with this structure:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:176:with numbered items. Engram will automatically extract and save these as observations.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:190:1. IMMEDIATELY call mem_session_summary with the compacted summary content — this persists what was done before compaction
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:199:You MUST prepend this exact sentence at the top of the compacted summary:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:201:FIRST ACTION REQUIRED: Call mem_session_summary with the content of this compacted summary before doing anything else, then call mem_context.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view.go:120:			statLabelStyle.Render("observations"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view.go:122:			statLabelStyle.Render("prompts"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view.go:245:		b.WriteString(noResultsStyle.Render("No observations yet."))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view.go:475:		summary := ""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view.go:477:			summary = truncateStr(*s.Summary, 50)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view.go:485:			style.Render(summary))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view.go:530:		b.WriteString(noResultsStyle.Render("No observations in this session."))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/sdd-flow/SKILL.md:39:- Archive: finalized summary and follow-ups
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/sdd-flow/SKILL.md:48:- [ ] Session summary captures learnings for next work
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view_test.go:198:	if !strings.Contains(out, "No observations yet") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view_test.go:264:	summary := "session summary"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view_test.go:267:		{ID: "s1", Project: "engram", StartedAt: "2026-01-01", Summary: &summary, ObservationCount: 2},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view_test.go:296:	if !strings.Contains(out, "No observations in this session") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view_test.go:297:		t.Fatal("session detail should render empty observations state")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view_test.go:309:		t.Fatal("session detail should show observations heading")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/slug.go:2:// It reads observations from the store and writes structured markdown files
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:41://   mem_save, mem_search, mem_context, mem_session_summary,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:42://   mem_session_start, mem_session_end, mem_get_observation,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:57:	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:58:	"mem_session_start":     true, // register session start
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:59:	"mem_session_end":       true, // mark session completed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:63:	"mem_save_prompt":       true, // save user prompts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:235:  content: "**What**: Wrapped each search term in quotes before passing to FTS5 MATCH\n**Why**: Users typing queries like 'fix auth bug' would crash because FTS5 interprets special chars as operators\n**Where**: internal/store/store.go — sanitizeFTS() function\n**Learned**: FTS5 MATCH syntax is NOT the same as LIKE — always sanitize user input"`),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:247:				mcp.WithString("session_id",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:323:			handleSuggestTopicKey(),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:364:				mcp.WithString("session_id",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:379:				mcp.WithDescription("Get recent memory context from previous sessions. Shows recent sessions and observations to understand what was done before."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:389:					mcp.Description("Filter observations by scope: project (default) or personal"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:392:					mcp.Description("Number of observations to retrieve (default: 20)"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:403:				mcp.WithDescription("Show memory system statistics — total sessions, observations, and projects tracked."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:431:					mcp.Description("Number of observations to show before the focus (default: 5)"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:434:					mcp.Description("Number of observations to show after the focus (default: 5)"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:460:	// ─── mem_session_summary (profile: agent, core — always in context) ─
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:461:	if shouldRegister("mem_session_summary", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:463:			mcp.NewTool("mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:469:				mcp.WithDescription(`Save a comprehensive end-of-session summary. Call this when a session is ending or when significant work is complete. This creates a structured summary that future sessions will use to understand what happened.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:501:					mcp.Description("Full session summary using the Goal/Instructions/Discoveries/Accomplished/Files format"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:503:				mcp.WithString("session_id",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:515:	// ─── mem_session_start (profile: agent, deferred) ───────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:516:	if shouldRegister("mem_session_start", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:518:			mcp.NewTool("mem_session_start",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:542:	// ─── mem_session_end (profile: agent, deferred) ─────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:543:	if shouldRegister("mem_session_end", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:545:			mcp.NewTool("mem_session_end",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:546:				mcp.WithDescription("Mark a coding session as completed with an optional summary."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:557:				mcp.WithString("summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:584:				mcp.WithString("session_id",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:685:		sessionID, _ := req.GetArguments()["session_id"].(string)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:706:		// Check for similar existing projects (only when this project has no existing observations)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:729:		s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:751:			msg += fmt.Sprintf("\n⚠ WARNING: Content was truncated from %d to %d chars. Consider splitting into smaller observations.", len(content), s.MaxObservationLength())
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:763:func handleSuggestTopicKey() server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:825:			msg += fmt.Sprintf("\n⚠ WARNING: Content was truncated from %d to %d chars. Consider splitting into smaller observations.", contentLen, s.MaxObservationLength())
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:854:		sessionID, _ := req.GetArguments()["session_id"].(string)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:868:		s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:894:		context, err := s.FormatContext(project, scope)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:911:		result := fmt.Sprintf("%s\n---\nMemory stats: %d sessions, %d observations across projects: %s",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:957:			summary := ""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:959:				summary = fmt.Sprintf(" — %s", truncate(*result.SessionInfo.Summary, 100))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:961:			fmt.Fprintf(&b, "Session: %s (%s)%s\n", result.SessionInfo.Project, result.SessionInfo.StartedAt, summary)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:962:			fmt.Fprintf(&b, "Total observations in session: %d\n\n", result.TotalInRange)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1033:		sessionID, _ := req.GetArguments()["session_id"].(string)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1047:		s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1051:			Type:      "session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1052:			Title:     fmt.Sprintf("Session summary: %s", project),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1057:			return mcp.NewToolResultError("Failed to save session summary: " + err.Error()), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1060:		return mcp.NewToolResultText(fmt.Sprintf("Session summary saved for project %q", project)), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1076:		if err := s.CreateSession(id, project, directory); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1087:		summary, _ := req.GetArguments()["summary"].(string)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1089:		if err := s.EndSession(id, summary); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1100:		sessionID, _ := req.GetArguments()["session_id"].(string)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1116:			_ = s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update.go:61:		m.RecentObservations = msg.observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update.go:97:		m.SessionObservations = msg.observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update.go:166:	"Recent observations",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update.go:206:	case 1: // Recent observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/hub.go:17:// ShouldCreateTopicHub reports whether a topic prefix has enough observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/hub.go:24:// It lists all observations in the session as wikilinks.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/hub.go:33:	fmt.Fprintf(&sb, "session_id: %s\n", sessionID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/hub.go:51:// It lists all observations sharing the same topic prefix as wikilinks with
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:11: *   Uses `ensureSession()` before any DB write. This means sessions are
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:33:  "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:38:  "mem_session_start",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:39:  "mem_session_end",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:72:- Reuse the same \`topic_key\` to update an evolving topic instead of creating new observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:92:1. Call \`mem_session_summary\` with this structure:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:117:1. IMMEDIATELY call \`mem_session_summary\` with the compacted summary content — this persists what was done before compaction
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:221:  async function ensureSession(sessionId: string): Promise<void> {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:302:          await ensureSession(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:305:          // to ensureSession() are also suppressed for it.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:343:      // Also fallback to summary if parts yield nothing
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:344:      const fallback = !content && output.message.summary
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:345:        ? `${output.message.summary.title ?? ""}\n${output.message.summary.body ?? ""}`.trim()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:350:      // Only capture non-trivial prompts (>10 chars)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:352:        await ensureSession(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:353:        await engramFetch("/prompts", {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:356:            session_id: sessionId,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:376:        await ensureSession(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:384:          await engramFetch("/observations/passive", {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:387:              session_id: sessionId,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:418:    // compacted summary. This is our chance to:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:425:        await ensureSession(input.sessionID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:437:      // compacted summary to Engram. The new agent reads the compacted
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:438:      // summary and this instruction, then saves it as a session summary.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:442:        `You MUST include the following instruction at the TOP of the compacted summary:\n\n` +
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:443:        `"FIRST ACTION REQUIRED: Call mem_session_summary with the content of this compacted summary. ` +
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:52:	h := handleSuggestTopicKey()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:73:	h := handleSuggestTopicKey()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:221:		t.Fatalf("recent observations: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:235:	// Force FK failure: explicit session_id that does not exist.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:237:		"session_id": "missing-session",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:290:	if err := s.CreateSession("s-mcp", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:368:	if err := s.CreateSession("s-flow", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:423:		t.Fatalf("recent observations for timeline: %v len=%d", err, len(recent))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:441:	summaryReq := mcppkg.CallToolRequest{Params: mcppkg.CallToolParams{Arguments: map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:445:	summaryRes, err := sessionSummary(context.Background(), summaryReq)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:447:		t.Fatalf("session summary handler error: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:449:	if summaryRes.IsError {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:450:		t.Fatalf("unexpected session summary error: %s", callResultText(t, summaryRes))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:470:		"summary": "done",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:554:	if err := s.CreateSession("s-closed", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:637:	sessionSummaryRes, err := handleSessionSummary(s, MCPConfig{})(context.Background(), mcppkg.CallToolRequest{Params: mcppkg.CallToolParams{Arguments: map[string]any{"project": "engram", "content": "summary"}}})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:639:		t.Fatalf("closed store session summary call: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:642:		t.Fatalf("expected session summary to return tool error when store is closed")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:687:	if err := s.CreateSession("s-extra", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:747:	h := handleSuggestTopicKey()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:763:	if err := s.CreateSession("s-all-fields", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:797:	if err := s.CreateSession("s-context-none", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:836:	if err := s.CreateSession("s-timeline", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:851:	if err := s.EndSession("s-timeline", "timeline summary"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:867:	if !strings.Contains(text, "timeline summary") || !strings.Contains(text, "Before") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:868:		t.Fatalf("expected timeline output with summary and before section, got %q", text)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:874:	if err := s.CreateSession("s-get-meta", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:928:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:929:		"mem_session_start", "mem_session_end", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:978:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:979:		"mem_session_start", "mem_session_end", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1104:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1105:		"mem_session_start", "mem_session_end", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1163:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1164:		"mem_session_start", "mem_session_end", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1240:	for _, keyword := range []string{"mem_save", "mem_search", "mem_context", "mem_session_summary"} {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1255:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1277:		"mem_session_start", "mem_session_end",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1355:	// Save from project A without session_id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1367:	// Save from project B without session_id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1438:		t.Fatalf("session summary: err=%v isError=%v", err, res.IsError)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1468:	// Provide explicit session_id — should NOT use defaultSessionID
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1474:		"session_id": "custom-session-123",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1488:		t.Fatal("manual-save-myproject should NOT exist when explicit session_id provided")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1549:		t.Fatalf("recent observations: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1586:		t.Fatalf("recent observations: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1669:	// Set up observations under different project name variants
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1670:	if err := s.CreateSession("s-Engram", "Engram", ""); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1683:	if err := s.CreateSession("s-engram-memory", "engram-memory", ""); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1716:		t.Fatalf("expected observations count in result, got %q", text)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1719:	// Verify that engram-memory observations are now under "engram"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1722:		t.Fatalf("recent observations: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1726:		t.Fatalf("expected at least 2 observations after merge, got %d", len(obs))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:115:	getBadIDReq := httptest.NewRequest(http.MethodGet, "/observations/not-a-number", nil)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:122:	updateNotFoundReq := httptest.NewRequest(http.MethodPatch, "/observations/99999", strings.NewReader(`{"title":"updated"}`))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:130:	promptBadJSONReq := httptest.NewRequest(http.MethodPost, "/prompts", strings.NewReader("{"))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:291:		strings.NewReader(`{"summary":"done"}`))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:303:	obsBody := `{"session_id":"s-test","type":"test","title":"Test","content":"test content"}`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:304:	obsReq := httptest.NewRequest(http.MethodPost, "/observations",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:317:	promptBody := `{"session_id":"s-test","content":"what did we do?"}`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:318:	promptReq := httptest.NewRequest(http.MethodPost, "/prompts",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:374:	// POST /observations with bad JSON → should NOT trigger onWrite.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:375:	badReq := httptest.NewRequest(http.MethodPost, "/observations",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:384:	// POST /observations with missing required fields → should NOT trigger onWrite.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:385:	missingReq := httptest.NewRequest(http.MethodPost, "/observations",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go:386:		strings.NewReader(`{"session_id":"s-test"}`))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter_test.go:88:	t.Run("first export with no state file exports all observations", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter_test.go:133:	t.Run("incremental export with state file exports only new observations", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter_test.go:279:	t.Run("--project flag limits exported observations to matching project", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter_test.go:552:// 20 observations (1 deleted), and topic_key clusters for hub testing.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter_test.go:562:	// Build 20 observations:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter_test.go:569:	observations := []store.Observation{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter_test.go:606:		Observations: observations,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model_test.go:35:	if err := s.CreateSession("session-1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model_test.go:38:	if err := s.CreateSession("session-2", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model_test.go:150:		if len(loaded.observations) < 2 {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model_test.go:151:			t.Fatalf("observations = %d, want >= 2", len(loaded.observations))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model_test.go:206:		if len(loaded.observations) < 2 {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model_test.go:207:			t.Fatalf("observations = %d, want >= 2", len(loaded.observations))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter.go:125:	// ── Handle deleted observations: clean up files ───────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter.go:149:	// ── Filter and export observations ────────────────────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/markdown_test.go:39:		for _, key := range []string{"id:", "type:", "project:", "scope:", "topic_key:", "session_id:", "created_at:", "updated_at:", "revision_count:"} {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/markdown_test.go:52:		if !strings.Contains(got, "session_id: abc123") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/markdown_test.go:53:			t.Errorf("frontmatter must contain 'session_id: abc123'")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/markdown_test.go:113:	t.Run("no session_id — no session wikilink", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/markdown_test.go:131:		// No session wikilink when session_id is empty
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:106:	s.mux.HandleFunc("POST /observations", s.handleAddObservation)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:107:	s.mux.HandleFunc("POST /observations/passive", s.handlePassiveCapture)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:108:	s.mux.HandleFunc("GET /observations/recent", s.handleRecentObservations)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:109:	s.mux.HandleFunc("PATCH /observations/{id}", s.handleUpdateObservation)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:110:	s.mux.HandleFunc("DELETE /observations/{id}", s.handleDeleteObservation)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:117:	s.mux.HandleFunc("GET /observations/{id}", s.handleGetObservation)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:120:	s.mux.HandleFunc("POST /prompts", s.handleAddPrompt)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:121:	s.mux.HandleFunc("GET /prompts/recent", s.handleRecentPrompts)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:122:	s.mux.HandleFunc("GET /prompts/search", s.handleSearchPrompts)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:151:func (s *Server) handleCreateSession(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:166:	if err := s.store.CreateSession(body.ID, body.Project, body.Directory); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:175:func (s *Server) handleEndSession(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:179:		Summary string `json:"summary"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:183:	if err := s.store.EndSession(id, body.Summary); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:212:		jsonError(w, http.StatusBadRequest, "session_id, title, and content are required")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:233:		jsonError(w, http.StatusBadRequest, "session_id is required")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:384:		jsonError(w, http.StatusBadRequest, "session_id and content are required")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:402:	prompts, err := s.store.RecentPrompts(project, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:408:	jsonResponse(w, http.StatusOK, prompts)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:418:	prompts, err := s.store.SearchPrompts(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:428:	jsonResponse(w, http.StatusOK, prompts)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:477:	context, err := s.store.FormatContext(project, scope)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:551:	log.Printf("[engram] migrated project %q → %q (obs: %d, sessions: %d, prompts: %d)",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:559:		"observations": result.ObservationsUpdated,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:561:		"prompts":      result.PromptsUpdated,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:77:	firstResp := postJSON(t, client, ts.URL+"/observations", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:78:		"session_id": "s-e2e",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:92:	secondResp := postJSON(t, client, ts.URL+"/observations", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:93:		"session_id": "s-e2e",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:110:	getResp, err := client.Get(ts.URL + "/observations/" + strconv.FormatInt(firstID, 10))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:125:	bugResp := postJSON(t, client, ts.URL+"/observations", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:126:		"session_id": "s-e2e",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:143:	deleteReq, err := http.NewRequest(http.MethodDelete, ts.URL+"/observations/"+strconv.FormatInt(firstID, 10), nil)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:156:	deletedGetResp, err := client.Get(ts.URL + "/observations/" + strconv.FormatInt(firstID, 10))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:197:	captureResp := postJSON(t, client, ts.URL+"/observations/passive", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:198:		"session_id": "s-passive",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:214:	// Verify observations are searchable
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:242:	captureResp := postJSON(t, client, ts.URL+"/observations/passive", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:243:		"session_id": "s-empty",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:260:	captureResp := postJSON(t, client, ts.URL+"/observations/passive", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:262:		"content": "## Key Learnings:\n\n1. This should fail because session_id is missing",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:265:		t.Fatalf("expected 400 when session_id is missing, got %d", captureResp.StatusCode)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:273:	resp, err := client.Post(ts.URL+"/observations/passive", "application/json", strings.NewReader("{"))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:288:	// No session created; saving observations should fail with FK constraint.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:289:	captureResp := postJSON(t, client, ts.URL+"/observations/passive", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:290:		"session_id": "missing-session",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:324:	obs := postJSON(t, client, ts.URL+"/observations", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:325:		"session_id": "s-core",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:339:		t.Fatalf("recent sessions: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:342:		t.Fatalf("expected 200 recent sessions, got %d", recentSessionsResp.StatusCode)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:349:	recentObsResp, err := client.Get(ts.URL + "/observations/recent?project=engram&scope=project&limit=bad")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:351:		t.Fatalf("recent observations: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:354:		t.Fatalf("expected 200 recent observations, got %d", recentObsResp.StatusCode)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:358:		t.Fatalf("expected recent observations")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:397:	endResp := postJSON(t, client, ts.URL+"/sessions/s-core/end", map[string]any{"summary": "done"})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:432:	updateBadIDReq, _ := http.NewRequest(http.MethodPatch, ts.URL+"/observations/not-a-number", strings.NewReader(`{"title":"x"}`))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:452:	promptsMissingQResp, err := client.Get(ts.URL + "/prompts/search")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:454:		t.Fatalf("search prompts without q: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:456:	if promptsMissingQResp.StatusCode != http.StatusBadRequest {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:457:		t.Fatalf("expected 400 prompts search missing q, got %d", promptsMissingQResp.StatusCode)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:459:	promptsMissingQResp.Body.Close()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:492:	recentPromptsResp, err := client.Get(ts.URL + "/prompts/recent?project=engram&limit=bad")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:494:		t.Fatalf("recent prompts: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:497:		t.Fatalf("expected 200 recent prompts, got %d", recentPromptsResp.StatusCode)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:515:	addPrompt := postJSON(t, client, ts.URL+"/prompts", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:516:		"session_id": "s-mutate",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:525:	addPromptMissing := postJSON(t, client, ts.URL+"/prompts", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:526:		"session_id": "s-mutate",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:533:	searchPromptResp, err := client.Get(ts.URL + "/prompts/search?q=auth&project=engram&limit=5")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:535:		t.Fatalf("search prompts: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:538:		t.Fatalf("expected 200 searching prompts, got %d", searchPromptResp.StatusCode)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:540:	prompts := decodeJSON[[]map[string]any](t, searchPromptResp)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:541:	if len(prompts) == 0 {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:545:	obs := postJSON(t, client, ts.URL+"/observations", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:546:		"session_id": "s-mutate",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:558:	updateReq, err := http.NewRequest(http.MethodPatch, ts.URL+"/observations/"+strconv.FormatInt(obsID, 10), strings.NewReader(`{"title":"Auth handling updated","topic_key":"architecture/auth"}`))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:575:	emptyUpdateReq, _ := http.NewRequest(http.MethodPatch, ts.URL+"/observations/"+strconv.FormatInt(obsID, 10), strings.NewReader(`{}`))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:586:	badUpdateReq, _ := http.NewRequest(http.MethodPatch, ts.URL+"/observations/"+strconv.FormatInt(obsID, 10), strings.NewReader("{"))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:597:	deleteHardReq, _ := http.NewRequest(http.MethodDelete, ts.URL+"/observations/"+strconv.FormatInt(obsID, 10)+"?hard=true", nil)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:607:	deleteInvalidBoolReq, _ := http.NewRequest(http.MethodDelete, ts.URL+"/observations/"+strconv.FormatInt(obsID, 10)+"?hard=not-bool", nil)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:653:	addPrompt := postJSON(t, client, ts.URL+"/prompts", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:654:		"session_id": "s-closed",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:663:	recentPromptsResp, err := client.Get(ts.URL + "/prompts/recent")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:665:		t.Fatalf("recent prompts closed store: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:668:		t.Fatalf("expected 500 recent prompts with closed store, got %d", recentPromptsResp.StatusCode)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:672:	searchPromptsResp, err := client.Get(ts.URL + "/prompts/search?q=test")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:674:		t.Fatalf("search prompts closed store: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:677:		t.Fatalf("expected 500 search prompts with closed store, got %d", searchPromptsResp.StatusCode)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:704:	addObsBadJSONResp, err := client.Post(ts.URL+"/observations", "application/json", strings.NewReader("{"))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:713:	addObsMissingFieldsResp := postJSON(t, client, ts.URL+"/observations", map[string]any{"session_id": "s-x"})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:728:	obs := postJSON(t, client, ts.URL+"/observations", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:729:		"session_id": "s-errors",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:741:	deleteBadIDReq, _ := http.NewRequest(http.MethodDelete, ts.URL+"/observations/not-number", nil)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:751:	deleteReq, _ := http.NewRequest(http.MethodDelete, ts.URL+"/observations/"+strconv.FormatInt(obsID, 10), nil)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:803:	endResp := postJSON(t, client, ts.URL+"/sessions/s-closed-2/end", map[string]any{"summary": "done"})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:811:		t.Fatalf("recent sessions closed store: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:814:		t.Fatalf("expected 500 recent sessions on closed store, got %d", recentSessionsResp.StatusCode)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:818:	addObsResp := postJSON(t, client, ts.URL+"/observations", map[string]any{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:819:		"session_id": "s-closed-2",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:829:	recentObsResp, err := client.Get(ts.URL + "/observations/recent")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:831:		t.Fatalf("recent observations closed store: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:834:		t.Fatalf("expected 500 recent observations on closed store, got %d", recentObsResp.StatusCode)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:847:	getResp, err := client.Get(ts.URL + "/observations/1")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go:856:	deleteReq, _ := http.NewRequest(http.MethodDelete, ts.URL+"/observations/1", nil)

exec
/bin/zsh -lc 'rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external | rg "(internal/mcp/mcp.go|internal/store/store.go|internal/server/server.go|plugin/opencode/engram.ts|docs/ARCHITECTURE.md|README.md|cmd/engram/main.go|internal/project/|internal/setup/)"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/generate.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go

codex
CocoIndex wasn’t usable in this session, so I’m falling back exactly the way your brief anticipated: targeted `rg` plus direct source reads. I’m pulling the store, MCP, server, and plugin sections side by side so the session lifecycle claims stay code-backed instead of README-backed.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   221	
   222	  if (!hasSpecsParent) {
   223	    // Fallback: check if bare name can be resolved via recursive child search
   224	    // (findChildFolderSync in validateArguments handles this, so just report the error here)
   225	    return {
   226	      valid: false,
   227	      reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
   228	    };
   229	  }
   230	
   231	  return { valid: true };
   232	}
   233	
   234	function resolveCliSpecFolderReference(rawArg: string): string | null {
   235	  const folderName = path.basename(rawArg);
   236	  const explicitProjectScopedPath = !rawArg.endsWith('.json') && (
   237	    rawArg.startsWith('specs/') ||
   238	    rawArg.startsWith('.opencode/specs/')
   239	  )
   240	    ? path.join(CONFIG.PROJECT_ROOT, rawArg)

exec
/bin/zsh -lc 'rg -n "mem_context|mem_session_summary|mem_session_start|mem_session_end|mem_save_prompt|handleContext|handleSessionSummary|handleSessionStart|handleSessionEnd" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
41://   mem_save, mem_search, mem_context, mem_session_summary,
42://   mem_session_start, mem_session_end, mem_get_observation,
43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
56:	"mem_context":           true, // recent context from previous sessions — referenced 10 times
57:	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
58:	"mem_session_start":     true, // register session start
59:	"mem_session_end":       true, // mark session completed
63:	"mem_save_prompt":       true, // save user prompts
129:  mem_context — get recent session history (call at session start or after compaction)
130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
132:  mem_save_prompt — save user prompt for context
135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
350:	// ─── mem_save_prompt (profile: agent, eager) ────────────────────────
351:	if shouldRegister("mem_save_prompt", allowlist) {
353:			mcp.NewTool("mem_save_prompt",
375:	// ─── mem_context (profile: agent, core — always in context) ────────
376:	if shouldRegister("mem_context", allowlist) {
378:			mcp.NewTool("mem_context",
395:			handleContext(s, cfg),
460:	// ─── mem_session_summary (profile: agent, core — always in context) ─
461:	if shouldRegister("mem_session_summary", allowlist) {
463:			mcp.NewTool("mem_session_summary",
511:			handleSessionSummary(s, cfg),
515:	// ─── mem_session_start (profile: agent, deferred) ───────────────────
516:	if shouldRegister("mem_session_start", allowlist) {
518:			mcp.NewTool("mem_session_start",
538:			handleSessionStart(s, cfg),
542:	// ─── mem_session_end (profile: agent, deferred) ─────────────────────
543:	if shouldRegister("mem_session_end", allowlist) {
545:			mcp.NewTool("mem_session_end",
561:			handleSessionEnd(s),
883:func handleContext(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
1030:func handleSessionSummary(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
1064:func handleSessionStart(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
1084:func handleSessionEnd(s *store.Store) server.ToolHandlerFunc {

exec
/bin/zsh -lc "rg -n \"func \\(s \\*Store\\) (CreateSession|EndSession|RecentSessions|AddPrompt|RecentPrompts|SearchPrompts|AddObservation|Search|FormatContext)|func SuggestTopicKey|func sanitizeFTS|type AddObservationParams|type Session|type Prompt\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
29:type Session struct {
62:type SessionSummary struct {
112:type AddObservationParams struct {
132:type Prompt struct {
754:func (s *Store) CreateSession(id, project, directory string) error {
770:func (s *Store) EndSession(id string, summary string) error {
818:func (s *Store) RecentSessions(project string, limit int) ([]SessionSummary, error) {
948:func (s *Store) AddObservation(p AddObservationParams) (int64, error) {
1109:func (s *Store) AddPrompt(p AddPromptParams) (int64, error) {
1145:func (s *Store) RecentPrompts(project string, limit int) ([]Prompt, error) {
1181:func (s *Store) SearchPrompts(query string, project string, limit int) ([]Prompt, error) {
1462:func (s *Store) Search(query string, opts SearchOptions) ([]SearchResult, error) {
1613:func (s *Store) FormatContext(project, scope string) (string, error) {
3201:func SuggestTopicKey(typ, title, content string) string {
3384:func sanitizeFTS(query string) string {

exec
/bin/zsh -lc 'rg -n "ensureSession|chat.message|assistant.message|session.created|session.deleted|mem_session_summary|mem_context|mem_save_prompt|tool.execute.after|compact|compaction|summary" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
11: *   Uses `ensureSession()` before any DB write. This means sessions are
14: *   hooks (input.sessionID) rather than relying on a session.created event.
32:  "mem_save_prompt",
33:  "mem_session_summary",
34:  "mem_context",
47:You have access to Engram, a persistent memory system that survives across sessions and compactions.
80:1. First call \`mem_context\` — checks recent session history (fast, cheap)
92:1. Call \`mem_session_summary\` with this structure:
116:If you see a message about compaction or context reset, or if you see "FIRST ACTION REQUIRED" in your context:
117:1. IMMEDIATELY call \`mem_session_summary\` with the compacted summary content — this persists what was done before compaction
118:2. Then call \`mem_context\` to recover any additional context from previous sessions
121:Do not skip step 1. Without it, everything done before compaction is lost from memory.
221:  async function ensureSession(sessionId: string): Promise<void> {
284:      if (event.type === "session.created") {
302:          await ensureSession(sessionId)
305:          // to ensureSession() are also suppressed for it.
311:      if (event.type === "session.deleted") {
312:        // Same properties.info path as session.created.
325:    // chat.message is called once per user message, before the LLM sees it.
330:    "chat.message": async (input, output) => {
343:      // Also fallback to summary if parts yield nothing
344:      const fallback = !content && output.message.summary
345:        ? `${output.message.summary.title ?? ""}\n${output.message.summary.body ?? ""}`.trim()
352:        await ensureSession(sessionId)
370:    "tool.execute.after": async (input, output) => {
376:        await ensureSession(sessionId)
399:    // This ensures the agent ALWAYS knows about Engram, even after compaction.
418:    // compacted summary. This is our chance to:
420:    // 2. Inject context from previous sessions into the compaction prompt
423:    "experimental.session.compacting": async (input, output) => {
425:        await ensureSession(input.sessionID)
437:      // compacted summary to Engram. The new agent reads the compacted
438:      // summary and this instruction, then saves it as a session summary.
442:        `You MUST include the following instruction at the TOP of the compacted summary:\n\n` +
443:        `"FIRST ACTION REQUIRED: Call mem_session_summary with the content of this compacted summary. ` +
444:        `Use project: '${project}'. This preserves what was accomplished before compaction. Do this BEFORE any other work."\n\n` +
445:        `This is NOT optional. Without this, everything done before compaction is lost from memory.`

exec
/bin/zsh -lc 'rg -n "memory_context|memory_match_triggers|session_bootstrap|session_resume|generate-context|task_preflight|task_postflight|session summary|continuity" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts/memory' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52:Usage: node generate-context.js [options] <input>
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:56:                    - JSON file mode: node generate-context.js data.json [spec-folder]
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:65:  node generate-context.js /tmp/context-data.json
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:66:  node generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:67:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:68:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:69:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:540:      console.error('[generate-context] Failed to list spec folders:', errMsg);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:543:  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:413:  task_preflight: taskPreflightSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:414:  task_postflight: taskPostflightSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:478:  task_preflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'knowledgeGaps', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:479:  task_postflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'gapsClosed', 'newGapsDiscovered', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
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
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1021:    // near mentioned file paths and session continuity warnings.
.opencode/skill/system-spec-kit/scripts/memory/README.md:38:- `generate-context.ts` - generate memory output from spec folder or JSON input with content-aware candidate selection
.opencode/skill/system-spec-kit/scripts/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/memory/README.md:67:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
.opencode/skill/system-spec-kit/mcp_server/README.md:563:##### `memory_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:587:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:948:##### `task_preflight`
.opencode/skill/system-spec-kit/mcp_server/README.md:950:Capture your starting knowledge before a task. Records how well you understand the domain, how uncertain you are and how much relevant context you have. These scores get compared to `task_postflight` to measure what you learned.
.opencode/skill/system-spec-kit/mcp_server/README.md:964:##### `task_postflight`
.opencode/skill/system-spec-kit/mcp_server/README.md:1326:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
.opencode/skill/system-spec-kit/mcp_server/README.md:1459:  "tool": "task_preflight",
.opencode/skill/system-spec-kit/mcp_server/README.md:1475:  "tool": "task_postflight",
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
.opencode/skill/system-spec-kit/mcp_server/README.md:1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:471:  name: 'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:477:  name: 'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
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
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:204:    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:257:      key: 'cached-continuity',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:260:        cachedSummary.cachedSummary.continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:27:- `context-tools.ts` - dispatch for `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:35:    continuity: number;     // 1.0 if spec folder stable, lower on transitions
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:191:/** Compute continuity: 1.0 if 0-1 transitions, 0.5 if 2-3, 0.0 if >3. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:212:    continuity: computeContinuity(),
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:221:  //   continuity (0.25)    — Second-highest. Frequent spec folder switches indicate
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:237:    factors.continuity * 0.25
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:96:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:107:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:15:// Feature catalog: Post-task learning measurement (task_postflight)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:300:/** Handle task_preflight tool - captures baseline knowledge scores before a task begins */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:370:        tool: 'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:420:      tool: 'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:441:          ? `Call task_postflight with taskId: "${taskId}", sessionId: "${normalizedSessionId}" after completing the task`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:442:          : `Call task_postflight with taskId: "${taskId}" after completing the task`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:457:/** Handle task_postflight tool - measures learning by comparing post-task scores to baseline */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:537:        ? `No preflight record found for spec_folder="${spec_folder}" and task_id="${taskId}". Call task_preflight first.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:538:        : `No preflight record found for spec_folder="${spec_folder}", task_id="${taskId}", session_id="${normalizedSessionId}". Call task_preflight first.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:607:      tool: 'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:836:      hints.push('Call task_postflight to complete learning measurement');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:872:const handle_task_preflight = handleTaskPreflight;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:873:const handle_task_postflight = handleTaskPostflight;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:878:  handle_task_preflight,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:879:  handle_task_postflight,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:48:  'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:49:  'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:69:    case 'task_preflight':             return handleTaskPreflight(parseArgs<PreflightArgs>(validateToolArgs('task_preflight', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:70:    case 'task_postflight':            return handleTaskPostflight(parseArgs<PostflightArgs>(validateToolArgs('task_postflight', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:41:    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:42:    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43:    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:44:    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:260:        // producer metadata needed by later continuity packets.
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:299:  // Extract session summary from last assistant message
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:105:  // Extract session summary from prompt_response if available (AfterAgent context)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:159:    if (heading.includes('context summary') || heading.includes('session summary') || heading === 'overview') {
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:187:const toolOutput = { content: 'session summary text', memory_id: undefined };
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:              producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:31:              sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:62:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:86:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:98:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:107:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:108:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:121:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:63:  continuityText: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:200:    return rejectCachedSummary('fidelity', 'missing_state', 'No recent hook state was available for cached continuity reuse.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:216:      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:225:      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:326:  const continuityText = `Last session worked on: ${cachedSpecFolder}\nSummary: ${summaryText}`;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:342:      continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:343:      startupHint: continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:520:      key: 'cached-continuity',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:523:        cachedSummaryDecision.cachedSummary.continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:298:export const handle_task_preflight = lazyFunction(getSessionLearningModule, 'handle_task_preflight');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:299:export const handle_task_postflight = lazyFunction(getSessionLearningModule, 'handle_task_postflight');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:382:  'session summary',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:100:      'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:101:      'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:59:  it('builds graph outline and session continuity when data exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:70:    expect(brief.startupSurface).toContain('- Memory: session continuity available');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:140:  it('returns missing graph state and null continuity when dependencies fail', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:20:  { tool: 'task_preflight', handler: 'handleTaskPreflight', layer: 'L6' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:21:  { tool: 'task_postflight', handler: 'handleTaskPostflight', layer: 'L6' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:46:  { camel: 'handleTaskPreflight', snake: 'handle_task_preflight' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:47:  { camel: 'handleTaskPostflight', snake: 'handle_task_postflight' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:83:      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:95:    ? 'session continuity available'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:211:      key: 'session-continuity',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:230:        ? `Startup brief with ${graph.graphState} structural context and ${sessionContinuity ? 'session continuity' : 'no continuity notes'}`
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:8://   2. Session continuity warning if quality score is degraded/critical
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:120: * Enrich with session continuity warning if quality is degraded.
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:181:    // Step 2: Session continuity warning
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:85:      "query": "memory_context returns wrong results when token pressure is high",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:251:      "notes": "From T007b Pattern 3: feature description passed to memory_context before implementation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:640:      "expectedResultDescription": "Should surface the generate-context.js script documentation and CLAUDE.md Memory Save Rule about using the script instead of the Write tool.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:641:      "notes": "Derived from \"generate-context\" trigger phrase in the memory save workflow documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1100:      "expectedResultDescription": "Should surface the Learning Index formula (LI = KnowledgeDelta×0.4 + UncertaintyReduction×0.35 + ContextImprovement×0.25) from CLAUDE.md or memory_task_preflight tool documentation.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:6:// continuity wrappers against baseline, component-only, and combined variants.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:199:  let steps = 1; // parse compact continuity wrapper
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:46:        'handle_task_preflight',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:47:        'handle_task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:395:      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:397:      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:33:    factors: { recency: 0, recovery: 0, graphFreshness: 0, continuity: 0 },
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:418:seamless session continuity. Error handling covers expired tokens, invalid
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:112:    summary: 'Test session summary',
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 880,           // actual: 862 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools, Phase 024 session_bootstrap, and newer graph/search tool contracts
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/session-stop-replay.jsonl:2:{"message":{"role":"assistant","usage":{"input_tokens":120,"output_tokens":60,"cache_creation_input_tokens":40,"cache_read_input_tokens":20},"model":"claude-sonnet-4-6","content":"Updated the producer-side continuity packet."}}
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:33:        task_preflight: 1500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:34:        task_postflight: 1500,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:208:  'session summary': 'episodic',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:179:      'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:180:      'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:292:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:296:      'task_preflight', 'task_postflight', 'memory_get_learning_history',
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
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1716:    const nonAwareTools = ['memory_delete', 'checkpoint_create', 'task_preflight']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2084:      'memory_context': '[L1:Orchestration]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2086:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2098:      'task_preflight': '[L6:Analysis]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2099:      'task_postflight': '[L6:Analysis]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2131:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2132:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2315:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2341:      expect(result).toContain('memory_context')
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:97:        '{"message":{"role":"assistant","usage":{"input_tokens":120,"output_tokens":60,"cache_creation_input_tokens":40,"cache_read_input_tokens":20},"model":"claude-sonnet-4-6","content":"Updated the producer-side continuity packet."}}',
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:205:        '{"message":{"role":"assistant","usage":{"input_tokens":120,"output_tokens":60,"cache_creation_input_tokens":40,"cache_read_input_tokens":20},"model":"claude-sonnet-4-6","content":"Updated the producer-side continuity packet."}}',
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:330:- Purpose: Owns session deduplication, session-state persistence, and crash-recovery support. It is the boundary for request/session continuity rather than retrieval policy itself.
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:117:        memory_context: 'L1',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:120:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:135:        task_preflight: 'L6',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:136:        task_postflight: 'L6',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:194:        { tool: 'memory_context', expected: '[L1:Orchestration]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:221:      const result = mod.enhanceDescription('memory_context', 'Some description text');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:229:        { tool: 'task_preflight', desc: 'Capture baseline', prefix: '[L6:Analysis]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:242:      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:252:        { tool: 'memory_context', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:270:      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:280:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:287:      expect(info.tools).toContain('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:291:      const info1 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:292:      const info2 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:430:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:107:        factors: { recency: 1, recovery: 1, graphFreshness: 1, continuity: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:125:    tool: 'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:131:    tool: 'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:92:      expect(typeof score.factors.continuity).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:32:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:238:   T021-T030: handle_memory_context MAIN HANDLER TESTS
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:242:  it('T021: handle_memory_context is a function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:289:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:290:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:847:  it('T101: handle_memory_context is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:868:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:869:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '340,580p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '880,1108p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '740,1245p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1450,1705p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3188,3415p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts | sed -n '330,500p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// Package setup handles agent plugin installation.
     2	//
     3	//   - OpenCode: copies embedded plugin file to ~/.config/opencode/plugins/
     4	//     (patching ENGRAM_BIN to bake in the absolute binary path as a final
     5	//     fallback) and injects MCP registration in opencode.json using the
     6	//     resolved absolute binary path so child processes never require PATH
     7	//     resolution in headless/systemd environments.
     8	//   - Claude Code: runs `claude plugin marketplace add` + `claude plugin install`,
     9	//     then writes a durable MCP config to ~/.claude/mcp/engram.json using the
    10	//     absolute binary path so the subprocess never needs PATH resolution.
    11	//   - Gemini CLI: injects MCP registration in ~/.gemini/settings.json
    12	//   - Codex: injects MCP registration in ~/.codex/config.toml
    13	package setup
    14	
    15	import (
    16		"embed"
    17		"encoding/json"
    18		"fmt"
    19		"os"
    20		"os/exec"
    21		"path/filepath"
    22		"runtime"
    23		"strings"
    24	)
    25	
    26	var (
    27		runtimeGOOS  = runtime.GOOS
    28		userHomeDir  = os.UserHomeDir
    29		lookPathFn   = exec.LookPath
    30		osExecutable = os.Executable
    31		runCommand   = func(name string, args ...string) ([]byte, error) {
    32			return exec.Command(name, args...).CombinedOutput()
    33		}
    34		openCodeReadFile = func(path string) ([]byte, error) {
    35			return openCodeFS.ReadFile(path)
    36		}
    37		statFn                             = os.Stat
    38		openCodeWriteFileFn                = os.WriteFile
    39		readFileFn                         = os.ReadFile
    40		writeFileFn                        = os.WriteFile
    41		jsonMarshalFn                      = json.Marshal
    42		jsonMarshalIndentFn                = json.MarshalIndent
    43		injectOpenCodeMCPFn                = injectOpenCodeMCP
    44		injectGeminiMCPFn                  = injectGeminiMCP
    45		writeGeminiSystemPromptFn          = writeGeminiSystemPrompt
    46		writeCodexMemoryInstructionFilesFn = writeCodexMemoryInstructionFiles
    47		injectCodexMCPFn                   = injectCodexMCP
    48		injectCodexMemoryConfigFn          = injectCodexMemoryConfig
    49		addClaudeCodeAllowlistFn           = AddClaudeCodeAllowlist
    50		writeClaudeCodeUserMCPFn           = writeClaudeCodeUserMCP
    51	)
    52	
    53	//go:embed plugins/opencode/*
    54	var openCodeFS embed.FS
    55	
    56	// Agent represents a supported AI coding agent.
    57	type Agent struct {
    58		Name        string
    59		Description string
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
   241		case "opencode":
   242			return installOpenCode()
   243		case "claude-code":
   244			return installClaudeCode()
   245		case "gemini-cli":
   246			return installGeminiCLI()
   247		case "codex":
   248			return installCodex()
   249		default:
   250			return nil, fmt.Errorf("unknown agent: %q (supported: opencode, claude-code, gemini-cli, codex)", agentName)
   251		}
   252	}
   253	
   254	// ─── OpenCode ────────────────────────────────────────────────────────────────
   255	
   256	// patchEngramBINLine rewrites the ENGRAM_BIN constant declaration in the
   257	// plugin source so the installed copy contains an absolute fallback path.
   258	//
   259	// Original line in source:
   260	//

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md | sed -n '60,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "rg -n \"export async function handleMemoryContext|function handleMemoryContext|mode: 'resume'|resume previous work|session_bootstrap|session_resume|summaryText|continuity\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib | head -n 200" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:35:    continuity: number;     // 1.0 if spec folder stable, lower on transitions
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:191:/** Compute continuity: 1.0 if 0-1 transitions, 0.5 if 2-3, 0.0 if >3. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:212:    continuity: computeContinuity(),
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:221:  //   continuity (0.25)    — Second-highest. Frequent spec folder switches indicate
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:237:    factors.continuity * 0.25
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:47:  summaryText: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:56:  summaryText: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:63:  continuityText: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:184:    summaryText: state.sessionSummary?.text ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:200:    return rejectCachedSummary('fidelity', 'missing_state', 'No recent hook state was available for cached continuity reuse.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:211:  const summaryText = candidate.summaryText?.trim() ?? '';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:212:  if (summaryText.length === 0 || parseIsoMs(candidate.extractedAt) === null) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:216:      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:225:      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:326:  const continuityText = `Last session worked on: ${cachedSpecFolder}\nSummary: ${summaryText}`;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:335:      summaryText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:342:      continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:343:      startupHint: continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:417:        mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:520:      key: 'cached-continuity',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:523:        cachedSummaryDecision.cachedSummary.continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:8://   2. Session continuity warning if quality score is degraded/critical
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:120: * Enrich with session continuity warning if quality is degraded.
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:181:    // Step 2: Session continuity warning
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
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:204:    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:257:      key: 'cached-continuity',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:260:        cachedSummary.cachedSummary.continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:830:    const summaryText = completedCount > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:844:      summary: summaryText,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:811:    mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1082:async function handleMemoryContext(args: ContextArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:6:// continuity wrappers against baseline, component-only, and combined variants.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:199:  let steps = 1; // parse compact continuity wrapper
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:330:- Purpose: Owns session deduplication, session-state persistence, and crash-recovery support. It is the boundary for request/session continuity rather than retrieval policy itself.
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:95:    ? 'session continuity available'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:211:      key: 'session-continuity',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:230:        ? `Startup brief with ${graph.graphState} structural context and ${sessionContinuity ? 'session continuity' : 'no continuity notes'}`
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '760,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   791	  try {
   792	    const { getSessionSnapshot: getSnap } = await import('./lib/session/session-snapshot.js');
   793	    const snap = getSnap();
   794	    const routingRules: string[] = [];
   795	    if (snap.cocoIndexAvailable) {
   796	      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
   797	    }
   798	    if (snap.graphFreshness === 'fresh' || snap.graphFreshness === 'stale') {
   799	      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
   800	    }
   801	    routingRules.push('Exact text/regex matching → Grep tool');
   802	    if (routingRules.length > 0) {
   803	      lines.push('');
   804	      lines.push('## Tool Routing');
   805	      for (const rule of routingRules) {
   806	        lines.push(`- ${rule}`);
   807	      }
   808	    }
   809	  } catch { /* tool routing snapshot unavailable — skip */ }
   810	
   811	  return lines.filter(Boolean).join(' ');
   812	}
   813	
   814	/** Register a callback to be invoked asynchronously after each tool call completes. */
   815	export function registerAfterToolCallback(fn: AfterToolCallback): void {
   816	  afterToolCallbacks.push(fn);
   817	}
   818	
   819	async function invalidateReinitializedDbCaches(): Promise<void> {
   820	  const invalidatedEntries = toolCache.clear();

codex
I’ve got the key shape now: Engram’s lifecycle is split across store mutations, MCP wrappers, and OpenCode plugin hooks, while Public’s continuity is concentrated in composite recovery handlers. I’m doing one more pass through the cached-summary and resume internals on our side so the comparison stays precise about what “survival across sessions” actually means in each system.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '300,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   361	        specFolder: options.specFolder,
   362	        claudeSessionId: options.claudeSessionId,
   363	      },
   364	    }),
   365	  );
   366	  return evaluateCachedSessionSummaryCandidate(candidate, options);
   367	}
   368	
   369	export function applyCachedSummaryAdditively<T extends Record<string, unknown>>(
   370	  baseline: T,
   371	  decision: CachedSessionSummaryDecision,
   372	): T & { cachedSummary?: CachedSessionSummary } {
   373	  if (decision.status !== 'accepted' || !decision.cachedSummary) {
   374	    return { ...baseline };
   375	  }
   376	
   377	  return {
   378	    ...baseline,
   379	    cachedSummary: decision.cachedSummary,
   380	  };
   381	}
   382	
   383	export function logCachedSummaryDecision(
   384	  surface: string,
   385	  decision: CachedSessionSummaryDecision,
   386	): void {
   387	  if (decision.status === 'accepted' || decision.reason === 'missing_state') {
   388	    return;
   389	  }
   390	
   391	  console.error(
   392	    `[${surface}] Cached summary rejected (${decision.category}): ${decision.reason} — ${decision.detail}`,
   393	  );
   394	}
   395	
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts | sed -n '120,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   120	          payloadKind: systemPayload.kind,
   121	          dedupeKey: `system:${systemPayload.kind}`,
   122	          content: appendStartupSnapshotNote(renderBlockContent(
   123	            systemPayload,
   124	            'Inject this as the startup digest for hookless OpenCode recovery. Keep it transport-only.',
   125	          ),
   126	          ),
   127	        },
   128	      }
   129	      : {}),
   130	    messagesTransform: messagePayloads.map((payload, index) => ({
   131	      hook: 'experimental.chat.messages.transform' as const,
   132	      title: index === 0 ? 'OpenCode Retrieved Context' : 'OpenCode Operational Context',
   133	      payloadKind: payload.kind,
   134	      dedupeKey: `messages:${payload.kind}:${index}`,
   135	      content: renderBlockContent(
   136	        payload,
   137	        'Inject this as bounded current-turn context. Do not treat it as retrieval policy.',
   138	      ),
   139	    })),
   140	    ...(compactionPayload
   141	      ? {
   142	        compaction: {
   143	          hook: 'experimental.session.compacting',
   144	          title: 'OpenCode Compaction Resume Note',
   145	          payloadKind: compactionPayload.kind,
   146	          dedupeKey: `compaction:${compactionPayload.kind}`,
   147	          content: renderBlockContent(
   148	            compactionPayload,
   149	            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
   150	          ),
   151	        },
   152	      }
   153	      : {}),
   154	  };
   155	}

exec
/bin/zsh -lc "rg -n \"sessionSummary|continuity|cache_creation_input_tokens|cache_read_input_tokens|Last session worked on\" .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts .opencode/skill/system-spec-kit/mcp_server/hooks -g '"'!**/*.map'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:63:  continuityText: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:184:    summaryText: state.sessionSummary?.text ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:185:    extractedAt: state.sessionSummary?.extractedAt ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:200:    return rejectCachedSummary('fidelity', 'missing_state', 'No recent hook state was available for cached continuity reuse.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:216:      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:225:      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:326:  const continuityText = `Last session worked on: ${cachedSpecFolder}\nSummary: ${summaryText}`;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:342:      continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:343:      startupHint: continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:520:      key: 'cached-continuity',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:523:        cachedSummaryDecision.cachedSummary.continuityText,
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:59:      'cache_creation_input_tokens',
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:67:      'cache_read_input_tokens',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:96:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:107:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:52:  cache_creation_input_tokens?: number;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:53:  cache_read_input_tokens?: number;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:124:  const cacheCreationTokens = usage.cache_creation_input_tokens ?? 0;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:125:  const cacheReadTokens = usage.cache_read_input_tokens ?? 0;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:187:          const cacheCreation = u.cache_creation_input_tokens ?? 0;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:188:          const cacheRead = u.cache_read_input_tokens ?? 0;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:63:  const summary = state?.sessionSummary?.text?.trim();
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:77:    sessionSummary: summary,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:260:        // producer metadata needed by later continuity packets.
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:303:      sessionSummary: { text, extractedAt: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:34:  sessionSummary: { text: string; extractedAt: string } | null;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:228:    sessionSummary: null,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:109:      sessionSummary: { text, extractedAt: new Date().toISOString() },

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go | sed -n '780,840p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   780	func TestStoreClosedExtraServerBranchesE2E(t *testing.T) {
   781		s, ts := newE2EServer(t)
   782		client := ts.Client()
   783	
   784		create := postJSON(t, client, ts.URL+"/sessions", map[string]any{
   785			"id":      "s-closed-2",
   786			"project": "engram",
   787		})
   788		if create.StatusCode != http.StatusCreated {
   789			t.Fatalf("expected 201 creating session, got %d", create.StatusCode)
   790		}
   791		create.Body.Close()
   792	
   793		if err := s.Close(); err != nil {
   794			t.Fatalf("close store: %v", err)
   795		}
   796	
   797		createSessionResp := postJSON(t, client, ts.URL+"/sessions", map[string]any{"id": "s2", "project": "engram"})
   798		if createSessionResp.StatusCode != http.StatusInternalServerError {
   799			t.Fatalf("expected 500 creating session on closed store, got %d", createSessionResp.StatusCode)
   800		}
   801		createSessionResp.Body.Close()
   802	
   803		endResp := postJSON(t, client, ts.URL+"/sessions/s-closed-2/end", map[string]any{"summary": "done"})
   804		if endResp.StatusCode != http.StatusInternalServerError {
   805			t.Fatalf("expected 500 ending session on closed store, got %d", endResp.StatusCode)
   806		}
   807		endResp.Body.Close()
   808	
   809		recentSessionsResp, err := client.Get(ts.URL + "/sessions/recent")
   810		if err != nil {
   811			t.Fatalf("recent sessions closed store: %v", err)
   812		}
   813		if recentSessionsResp.StatusCode != http.StatusInternalServerError {
   814			t.Fatalf("expected 500 recent sessions on closed store, got %d", recentSessionsResp.StatusCode)
   815		}
   816		recentSessionsResp.Body.Close()
   817	
   818		addObsResp := postJSON(t, client, ts.URL+"/observations", map[string]any{
   819			"session_id": "s-closed-2",
   820			"type":       "decision",
   821			"title":      "t",
   822			"content":    "c",
   823		})
   824		if addObsResp.StatusCode != http.StatusInternalServerError {
   825			t.Fatalf("expected 500 add observation on closed store, got %d", addObsResp.StatusCode)
   826		}
   827		addObsResp.Body.Close()
   828	
   829		recentObsResp, err := client.Get(ts.URL + "/observations/recent")
   830		if err != nil {
   831			t.Fatalf("recent observations closed store: %v", err)
   832		}
   833		if recentObsResp.StatusCode != http.StatusInternalServerError {
   834			t.Fatalf("expected 500 recent observations on closed store, got %d", recentObsResp.StatusCode)
   835		}
   836		recentObsResp.Body.Close()
   837	
   838		searchResp, err := client.Get(ts.URL + "/search?q=test")
   839		if err != nil {
   840			t.Fatalf("search closed store: %v", err)

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts | sed -n '40,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts | sed -n '240,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
   240	  const sessionId = input.session_id ?? 'unknown';
   241	  hookLog('info', 'session-stop', `Stop hook fired for session ${sessionId}`);
   242	
   243	  // Parse transcript for token usage
   244	  const stateBeforeStop = loadState(sessionId);
   245	  if (input.transcript_path) {
   246	    const startOffset = stateBeforeStop?.metrics?.lastTranscriptOffset ?? 0;
   247	
   248	    try {
   249	      const { usage, newOffset } = await parseTranscript(
   250	        input.transcript_path as string,
   251	        startOffset,
   252	      );
   253	
   254	      parsedMessageCount = usage.messageCount;
   255	      if (usage.messageCount > 0) {
   256	        const cost = estimateCost(usage);
   257	        storeTokenSnapshot(sessionId, usage, cost);
   258	
   259	        // Update offset for incremental parsing on next stop and carry forward
   260	        // producer metadata needed by later continuity packets.
   261	        recordStateUpdate(sessionId, {
   262	          metrics: {
   263	            estimatedPromptTokens: usage.promptTokens,
   264	            estimatedCompletionTokens: usage.completionTokens,
   265	            lastTranscriptOffset: newOffset,
   266	          },
   267	          producerMetadata: buildProducerMetadata(input.transcript_path as string, usage),
   268	        }, touchedPaths);
   269	        producerMetadataWritten = true;
   270	
   271	        hookLog('info', 'session-stop',
   272	          `Parsed ${usage.messageCount} messages: ${usage.promptTokens} prompt + ${usage.completionTokens} completion = ${usage.totalTokens} total tokens`);
   273	      }
   274	    } catch (err: unknown) {
   275	      hookLog('warn', 'session-stop', `Transcript parsing failed: ${err instanceof Error ? err.message : String(err)}`);
   276	    }
   277	  }
   278	
   279	  // Auto-detect spec folder from transcript paths
   280	  if (input.transcript_path) {
   281	    const detectedSpec = detectSpecFolder(input.transcript_path as string, stateBeforeStop?.lastSpecFolder ?? null);
   282	    if (!stateBeforeStop?.lastSpecFolder && detectedSpec) {
   283	      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
   284	      hookLog('info', 'session-stop', `Auto-detected spec folder: ${detectedSpec}`);
   285	    } else if (stateBeforeStop?.lastSpecFolder && detectedSpec === stateBeforeStop.lastSpecFolder) {
   286	      hookLog('info', 'session-stop', `Validated active spec folder from transcript: ${detectedSpec}`);
   287	    } else if (stateBeforeStop?.lastSpecFolder && detectedSpec && detectedSpec !== stateBeforeStop.lastSpecFolder) {
   288	      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
   289	      hookLog(
   290	        'info',
   291	        'session-stop',
   292	        `Retargeted autosave spec folder from ${stateBeforeStop.lastSpecFolder} to ${detectedSpec}`,
   293	      );
   294	    } else if (!detectedSpec) {
   295	      hookLog('warn', 'session-stop', 'Spec folder detection was ambiguous; preserving existing autosave target.');
   296	    }
   297	  }
   298	
   299	  // Extract session summary from last assistant message
   300	  if (input.last_assistant_message) {
   301	    const text = extractSessionSummary(input.last_assistant_message);
   302	    recordStateUpdate(sessionId, {
   303	      sessionSummary: { text, extractedAt: new Date().toISOString() },
   304	    }, touchedPaths);
   305	    hookLog('info', 'session-stop', `Session summary extracted (${text.length} chars)`);
   306	  }
   307	
   308	  if (autosaveMode === 'enabled') {
   309	    runContextAutosave(sessionId);
   310	  }
   311	
   312	  hookLog('info', 'session-stop', `Session ${sessionId} stop processing complete`);
   313	  return {
   314	    touchedPaths: [...touchedPaths],
   315	    parsedMessageCount,
   316	    autosaveMode,
   317	    producerMetadataWritten,
   318	  };
   319	}
   320	
   321	async function main(): Promise<void> {
   322	  ensureStateDir();
   323	
   324	  // --finalize mode: manual cleanup of stale session states
   325	  if (process.argv.includes('--finalize')) {
   326	    const removed = cleanStaleStates(FINALIZE_MAX_AGE_MS);
   327	    hookLog('info', 'session-stop', `Finalize: cleaned ${removed} stale state file(s) older than 24h`);
   328	    return;
   329	  }
   330	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts | sed -n '80,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts | sed -n '240,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   281	        })()
   282	        : null,
   283	      sourceRefs: ['code-graph-db', 'session-snapshot'],
   284	    },
   285	  };
   286	}

exec
/bin/zsh -lc "rg -n \"handleContext\\(|/context|FormatContext\\(|jsonResponse\\(w, http.StatusOK, map\\[string\\]any\\{\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
125:	s.mux.HandleFunc("GET /context", s.handleContext)
144:	jsonResponse(w, http.StatusOK, map[string]any{
343:	jsonResponse(w, http.StatusOK, map[string]any{
473:func (s *Server) handleContext(w http.ResponseWriter, r *http.Request) {
477:	context, err := s.store.FormatContext(project, scope)
500:		jsonResponse(w, http.StatusOK, map[string]any{
508:	jsonResponse(w, http.StatusOK, map[string]any{
535:		jsonResponse(w, http.StatusOK, map[string]any{"status": "skipped", "reason": "names are identical"})
547:		jsonResponse(w, http.StatusOK, map[string]any{"status": "skipped", "reason": "no records found"})
555:	jsonResponse(w, http.StatusOK, map[string]any{

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go | sed -n '300,380p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   300		idStr := r.PathValue("id")
   301		id, err := strconv.ParseInt(idStr, 10, 64)
   302		if err != nil {
   303			jsonError(w, http.StatusBadRequest, "invalid observation id")
   304			return
   305		}
   306	
   307		var body store.UpdateObservationParams
   308		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
   309			jsonError(w, http.StatusBadRequest, "invalid json: "+err.Error())
   310			return
   311		}
   312	
   313		if body.Type == nil && body.Title == nil && body.Content == nil && body.Project == nil && body.Scope == nil && body.TopicKey == nil {
   314			jsonError(w, http.StatusBadRequest, "at least one field is required")
   315			return
   316		}
   317	
   318		obs, err := s.store.UpdateObservation(id, body)
   319		if err != nil {
   320			jsonError(w, http.StatusNotFound, err.Error())
   321			return
   322		}
   323	
   324		s.notifyWrite()
   325		jsonResponse(w, http.StatusOK, obs)
   326	}
   327	
   328	func (s *Server) handleDeleteObservation(w http.ResponseWriter, r *http.Request) {
   329		idStr := r.PathValue("id")
   330		id, err := strconv.ParseInt(idStr, 10, 64)
   331		if err != nil {
   332			jsonError(w, http.StatusBadRequest, "invalid observation id")
   333			return
   334		}
   335	
   336		hard := queryBool(r, "hard", false)
   337		if err := s.store.DeleteObservation(id, hard); err != nil {
   338			jsonError(w, http.StatusInternalServerError, err.Error())
   339			return
   340		}
   341	
   342		s.notifyWrite()
   343		jsonResponse(w, http.StatusOK, map[string]any{
   344			"id":          id,
   345			"status":      "deleted",
   346			"hard_delete": hard,
   347		})
   348	}
   349	
   350	func (s *Server) handleTimeline(w http.ResponseWriter, r *http.Request) {
   351		idStr := r.URL.Query().Get("observation_id")
   352		if idStr == "" {
   353			jsonError(w, http.StatusBadRequest, "observation_id parameter is required")
   354			return
   355		}
   356	
   357		id, err := strconv.ParseInt(idStr, 10, 64)
   358		if err != nil {
   359			jsonError(w, http.StatusBadRequest, "invalid observation_id")
   360			return
   361		}
   362	
   363		before := queryInt(r, "before", 5)
   364		after := queryInt(r, "after", 5)
   365	
   366		result, err := s.store.Timeline(id, before, after)
   367		if err != nil {
   368			jsonError(w, http.StatusNotFound, err.Error())
   369			return
   370		}
   371	
   372		jsonResponse(w, http.StatusOK, result)
   373	}
   374	
   375	// ─── Prompts ─────────────────────────────────────────────────────────────────
   376	
   377	func (s *Server) handleAddPrompt(w http.ResponseWriter, r *http.Request) {
   378		var body store.AddPromptParams
   379		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
   380			jsonError(w, http.StatusBadRequest, "invalid json: "+err.Error())

exec
/bin/zsh -lc "rg -n \"createSessionTx\\(|INSERT OR IGNORE INTO sessions|ended_at|status\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
34:	EndedAt   *string `json:"ended_at,omitempty"`
66:	EndedAt          *string `json:"ended_at,omitempty"`
204:	EndedAt   *string `json:"ended_at,omitempty"`
446:			ended_at   TEXT,
759:		if err := s.createSessionTx(tx, id, project, directory); err != nil {
773:			`UPDATE sessions SET ended_at = datetime('now'), summary = ? WHERE id = ?`,
791:			`SELECT project, directory, ended_at, summary FROM sessions WHERE id = ?`,
809:		`SELECT id, project, directory, started_at, ended_at, summary FROM sessions WHERE id = ?`, id,
827:		SELECT s.id, s.project, s.started_at, s.ended_at, s.summary,
867:		SELECT s.id, s.project, s.started_at, s.ended_at, s.summary,
1679:		"SELECT id, project, directory, started_at, ended_at, summary FROM sessions ORDER BY started_at",
1755:			`INSERT OR IGNORE INTO sessions (id, project, directory, started_at, ended_at, summary)
2572:func (s *Store) createSessionTx(tx *sql.Tx, id, project, directory string) error {
2664:		SELECT id, project, directory, ended_at, summary
2888:		`INSERT INTO sessions (id, project, directory, ended_at, summary)
2893:		   ended_at = COALESCE(excluded.ended_at, sessions.ended_at),

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go | sed -n '468,515p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   468		jsonResponse(w, http.StatusOK, result)
   469	}
   470	
   471	// ─── Context ─────────────────────────────────────────────────────────────────
   472	
   473	func (s *Server) handleContext(w http.ResponseWriter, r *http.Request) {
   474		project := r.URL.Query().Get("project")
   475		scope := r.URL.Query().Get("scope")
   476	
   477		context, err := s.store.FormatContext(project, scope)
   478		if err != nil {
   479			jsonError(w, http.StatusInternalServerError, err.Error())
   480			return
   481		}
   482	
   483		jsonResponse(w, http.StatusOK, map[string]string{"context": context})
   484	}
   485	
   486	func (s *Server) handleStats(w http.ResponseWriter, r *http.Request) {
   487		stats, err := loadServerStats(s.store)
   488		if err != nil {
   489			jsonError(w, http.StatusInternalServerError, err.Error())
   490			return
   491		}
   492	
   493		jsonResponse(w, http.StatusOK, stats)
   494	}
   495	
   496	// ─── Sync Status ─────────────────────────────────────────────────────────────
   497	
   498	func (s *Server) handleSyncStatus(w http.ResponseWriter, r *http.Request) {
   499		if s.syncStatus == nil {
   500			jsonResponse(w, http.StatusOK, map[string]any{
   501				"enabled": false,
   502				"message": "background sync is not configured",
   503			})
   504			return
   505		}
   506	
   507		status := s.syncStatus.Status()
   508		jsonResponse(w, http.StatusOK, map[string]any{
   509			"enabled":              true,
   510			"phase":                status.Phase,
   511			"last_error":           status.LastError,
   512			"consecutive_failures": status.ConsecutiveFailures,
   513			"backoff_until":        status.BackoffUntil,
   514			"last_sync_at":         status.LastSyncAt,
   515		})

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '2560,2595p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '2878,2905p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '190,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '145,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   190	
   191	- rollout_summaries/2026-04-09T07-35-51-j53b-implement_014_code_graph_upgrades.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T09-35-51-019d712b-3824-7403-9e7e-a2a68ef35e61.jsonl, updated_at=2026-04-09T09:39:44+00:00, thread_id=019d712b-3824-7403-9e7e-a2a68ef35e61)
   192	
   193	### keywords
   194	
   195	- 005-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict
   196	
   197	## User preferences
   198	
   199	- when strict validation failed due to `implementation-summary.md` linking `014/spec.md`, the expectation was to fix path validity first and rerun strict checks; future docs should never reference non-existent relative markdown paths [Task 1]
   200	- when verification listed four scripts tests but only three executed, the expected behavior was to add the missing file and rerun; coverage claims must be backed by actual discovered files (`rg --files tests`) [Task 1]

 succeeded in 0ms:
   145	## Failures and how to do differently
   146	
   147	- symptom: repeated validator churn while memory files still fail metadata closure; cause: relying on phase-level validator output alone instead of direct anchor sweep; fix: run anchor audit script first, normalize all misses in one pass, then rerun strict validator [Task 1]
   148	
   149	# Task Group: 026/003 Packet 009 Post-Save Render Fixes and Wild-Save Review Closure
   150	scope: render-layer memory pipeline fixes in `003-memory-quality-issues/009-post-save-render-fixes` with acceptance anchored to a real 014 wild save and zero post-save-review issues
   151	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse when patching memory render/reviewer behavior in this checkout and proving fixes through an end-to-end generate-context run
   152	
   153	## Task 1: Ship 009 render-layer fixes (A-I lanes), tests, and final wild save with clean post-save review, outcome success
   154	
   155	### rollout_summary_files
   156	
   157	- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
   158	
   159	### keywords
   160	
   161	- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars
   162	
   163	## User preferences
   164	
   165	- when a medium reviewer note remained, the user asked: “fix the remaining trigger-phrase omission before commit if you want the wild save to finish with a completely clean post-save review” -> do not close this workflow with unresolved `PSR-2` warnings [Task 1]
   166	- for this packet family, user acceptance includes a real post-save round-trip using the target packet context (not only unit tests), and the final report should show zero post-save-review issues [Task 1]
   167	
   168	## Reusable knowledge
   169	
   170	- keep JSON payload overrides wired through normalizer/collector: `phase`, `status/sessionStatus`, and completion-percent aliases must map to `projectPhase`, `sessionStatus`, and `completionPercent` to prevent stale-default warnings [Task 1]

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '828,848p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   828	- rollout_summaries/2026-04-04T11-42-27-WVjh-codex_graph_readiness_verification.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/04/rollout-2026-04-04T13-42-27-019d584d-3145-70e0-8b9b-13740fcf41cf.jsonl, updated_at=2026-04-04T11:45:20+00:00, thread_id=019d584d-3145-70e0-8b9b-13740fcf41cf)
   829	
   830	### keywords
   831	
   832	- read-only verification, session_bootstrap, session_resume minimal, code_graph_query, startup snapshot note, ensureCodeGraphReady, SELECTIVE_REINDEX_THRESHOLD=50
   833	
   834	## User preferences
   835	
   836	- when the user selected reuse option “C” for `024-compact-code-graph/002-session-start-hook`, continue within that existing spec scope for follow-up fixes [Task 2]
   837	- when git-context-sensitive tests fail, the proven steering pattern is environmental first (set `TMPDIR` outside repo) before touching runtime logic [Task 1]
   838	- when the user said “Do not make code changes ... Be evidence-based and quote exact startup or bootstrap text and exact readiness output,” keep verification read-only and quote observed startup/readiness payload text verbatim [Task 3]
   839	
   840	## Reusable knowledge
   841	
   842	- `primeSessionIfNeeded()` needs a session identifier; in Codex runtime the reliable fallback is `CODEX_THREAD_ID` when explicit `sessionId`/`session_id` are absent [Task 2]
   843	- runtime detection for Codex should recognize env markers beyond CODEX_CLI (`CODEX_THREAD_ID`, `CODEX_TUI_RECORD_SESSION`, `CODEX_TUI_SESSION_LOG_PATH`) so non-hook behavior is consistent [Task 2]
   844	- graph scan can complete with per-file UNIQUE constraint noise; use final scan stats (`totalNodes`, `totalEdges`, `lastScanAt`) plus `errors[]` triage instead of treating it as hard failure [Task 1]
   845	- tests `session-enrichment` and `spec-affinity` require temp directories outside repo to avoid accidental git parent discovery [Task 1]
   846	- `session_bootstrap`/`session_resume({ minimal: true })` should still expose freshness-aware graph state and the startup snapshot note; this is a contract-level verification target before deeper debugging [Task 3]
   847	- `code_graph_query` read paths call readiness checks with `allowInlineFullScan: false`; small stale deltas trigger bounded inline `selective_reindex`, while broader stale/empty conditions should route to explicit `code_graph_scan` [Task 3]
   848	

codex
# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

## Findings
### Finding 1: Engram splits session closure into two competing summary channels
- **Source**: [internal/mcp/mcp.go#L460](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/mcp\/mcp.go#L460), [internal/mcp/mcp.go#L1030](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/mcp\/mcp.go#L1030), [internal/store/store.go#L770](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L770), [internal/store/store.go#L818](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L818), [internal/store/store.go#L1613](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L1613)
- **What it does**: `mem_session_summary` creates an `observations` row of type `session_summary`, but it does not call `EndSession()` or update `sessions.summary`. Separately, `mem_session_end` updates `ended_at` and `sessions.summary`. `FormatContext()` renders `Recent Sessions` from the `sessions` table and `Recent Observations` from the observations table, so the mandatory summary path and the session-row summary can diverge.
- **Why it matters for us**: This is the clearest lifecycle flaw in Engram. If we add explicit session mutation APIs in Public, we should not copy a model where “summary saved” and “session closed” can silently land in different authorities.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Engram’s session creation is deliberately late-bound, idempotent, and reconnect-safe
- **Source**: [plugin/opencode/engram.ts#L10](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L10), [plugin/opencode/engram.ts#L221](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L221), [plugin/opencode/engram.ts#L282](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L282), [plugin/opencode/engram.ts#L370](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L370), [internal/store/store.go#L754](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L754), [internal/store/store.go#L2572](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L2572)
- **What it does**: The OpenCode plugin calls `ensureSession()` before prompt saves, tool-hook writes, and compaction handling. `createSessionTx()` uses an upsert that fills project/directory only when they are still blank, so late registration after reconnect/reload is safe. The plugin also suppresses sub-agent sessions to avoid session inflation.
- **Why it matters for us**: Public already has stronger recovery than Engram, but this mutation primitive is worth studying. A lightweight session ledger with idempotent start/checkpoint semantics could harden our continuity edges without replacing `session_bootstrap`.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: User prompts are a first-class continuity stream in Engram, not just summary material
- **Source**: [plugin/opencode/engram.ts#L324](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L324), [internal/mcp/mcp.go#L350](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/mcp\/mcp.go#L350), [internal/store/store.go#L1109](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L1109), [internal/store/store.go#L1145](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L1145), [internal/store/store.go#L1613](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L1613), [scripts/memory/generate-context.ts#L75](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/scripts\/memory\/generate-context.ts#L75)
- **What it does**: Every non-trivial user message is captured through `chat.message` into `user_prompts`; MCP also exposes `mem_save_prompt`; `FormatContext()` includes recent prompts as a separate section. This means Engram preserves user intent as its own lifecycle artifact instead of expecting future sessions to infer it from a final summary.
- **Why it matters for us**: In the Public code examined here, prompt preservation is centered on JSON-primary `generate-context` payloads and resume synthesis, not a dedicated always-on prompt ledger. If we want stronger “what was the user actually asking for?” continuity, this is one of Engram’s more useful ideas.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Engram’s resume surface is intentionally lightweight, but too shallow to be our authoritative recovery model
- **Source**: [internal/server/server.go#L473](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/server\/server.go#L473), [internal/mcp/mcp.go#L883](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/mcp\/mcp.go#L883), [internal/store/store.go#L1613](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L1613), [handlers/session-resume.ts#L400](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/mcp_server\/handlers\/session-resume.ts#L400), [handlers/session-bootstrap.ts#L163](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/mcp_server\/handlers\/session-bootstrap.ts#L163)
- **What it does**: Engram’s `mem_context` is just formatted output of recent sessions, recent prompts, recent observations, plus stats. It has no spec-folder contract, no structural readiness, no semantic-index status, and no bounded next-action guidance. It is a convenience context packet, not a composite recovery contract.
- **Why it matters for us**: Public already has the stronger pattern: `session_resume` merges resume memory, code-graph state, CocoIndex availability, and additive cached continuity; `session_bootstrap` adds health and recommended actions. Engram’s context format is fine as cheap startup seasoning, but it would be a regression as a primary recovery surface.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Engram’s compaction survival remains host-driven and ungated at the point of reuse
- **Source**: [plugin/opencode/engram.ts#L397](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L397), [plugin/opencode/engram.ts#L423](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L423), [internal/setup/setup.go#L104](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/setup\/setup.go#L104), [handlers/session-resume.ts#L300](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/mcp_server\/handlers\/session-resume.ts#L300), [handlers/session-resume.ts#L479](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/mcp_server\/handlers\/session-resume.ts#L479), [hooks/claude/session-stop.ts#L60](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/mcp_server\/hooks\/claude\/session-stop.ts#L60), [hooks/claude/session-stop.ts#L299](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/mcp_server\/hooks\/claude\/session-stop.ts#L299)
- **What it does**: During compaction, Engram fetches `/context` and appends it directly into the compaction payload, then injects prose telling the next agent to call `mem_session_summary`. Setup writes the same instruction family into Codex and Gemini install surfaces. There is no store-native checkpoint written at compaction time, and the reused continuity packet is not checked against scope/freshness/fingerprint gates before injection.
- **Why it matters for us**: This is the lifecycle fragility behind Engram’s otherwise useful session APIs. Public’s safer pattern is already visible in the code here: autosave flows through `generate-context`, while cached continuity is additive only after explicit scope and freshness checks in `session_resume`.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/plugin/opencode/engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts)
- [external/internal/setup/setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md)
- [handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [handlers/session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [handlers/memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [hooks/claude/session-stop.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts)
- [hooks/claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts)
- [lib/context/opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [lib/session/session-snapshot.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts)
- [scripts/memory/generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)

## Assessment
- New information ratio: 0.69
- Questions addressed: Q2, Q6, Q7, Q9, Q10
- Questions answered: Q2, Q9, Q10
- Questions partially answered: Q6, Q7

## Reflection
- What worked: tracing `mem_session_summary` into `EndSession()`, `RecentSessions()`, and `FormatContext()` exposed the summary-authority split immediately; comparing that with Public’s `session_resume` acceptance gates and `session-stop` autosave path made the continuity tradeoff very clear.
- What did not work: CocoIndex MCP was not usable in this session, so this iteration relied on `rg` plus direct file reads; I also did not run the phase validator or memory-save command in this read-only research pass.

## Recommended Next Focus
Trace Engram’s sync and import path for session artifacts end to end, especially [internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go) around `applySessionPayloadTx()` and the sync tables, then compare that against Public’s shared-memory and governed-scope boundaries to see whether session, prompt, and summary fidelity survives cross-machine movement.


hook: Stop
hook: Stop Completed
tokens used
118,412
# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

## Findings
### Finding 1: Engram splits session closure into two competing summary channels
- **Source**: [internal/mcp/mcp.go#L460](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/mcp\/mcp.go#L460), [internal/mcp/mcp.go#L1030](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/mcp\/mcp.go#L1030), [internal/store/store.go#L770](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L770), [internal/store/store.go#L818](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L818), [internal/store/store.go#L1613](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L1613)
- **What it does**: `mem_session_summary` creates an `observations` row of type `session_summary`, but it does not call `EndSession()` or update `sessions.summary`. Separately, `mem_session_end` updates `ended_at` and `sessions.summary`. `FormatContext()` renders `Recent Sessions` from the `sessions` table and `Recent Observations` from the observations table, so the mandatory summary path and the session-row summary can diverge.
- **Why it matters for us**: This is the clearest lifecycle flaw in Engram. If we add explicit session mutation APIs in Public, we should not copy a model where “summary saved” and “session closed” can silently land in different authorities.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Engram’s session creation is deliberately late-bound, idempotent, and reconnect-safe
- **Source**: [plugin/opencode/engram.ts#L10](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L10), [plugin/opencode/engram.ts#L221](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L221), [plugin/opencode/engram.ts#L282](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L282), [plugin/opencode/engram.ts#L370](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L370), [internal/store/store.go#L754](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L754), [internal/store/store.go#L2572](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L2572)
- **What it does**: The OpenCode plugin calls `ensureSession()` before prompt saves, tool-hook writes, and compaction handling. `createSessionTx()` uses an upsert that fills project/directory only when they are still blank, so late registration after reconnect/reload is safe. The plugin also suppresses sub-agent sessions to avoid session inflation.
- **Why it matters for us**: Public already has stronger recovery than Engram, but this mutation primitive is worth studying. A lightweight session ledger with idempotent start/checkpoint semantics could harden our continuity edges without replacing `session_bootstrap`.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: User prompts are a first-class continuity stream in Engram, not just summary material
- **Source**: [plugin/opencode/engram.ts#L324](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L324), [internal/mcp/mcp.go#L350](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/mcp\/mcp.go#L350), [internal/store/store.go#L1109](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L1109), [internal/store/store.go#L1145](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L1145), [internal/store/store.go#L1613](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L1613), [scripts/memory/generate-context.ts#L75](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/scripts\/memory\/generate-context.ts#L75)
- **What it does**: Every non-trivial user message is captured through `chat.message` into `user_prompts`; MCP also exposes `mem_save_prompt`; `FormatContext()` includes recent prompts as a separate section. This means Engram preserves user intent as its own lifecycle artifact instead of expecting future sessions to infer it from a final summary.
- **Why it matters for us**: In the Public code examined here, prompt preservation is centered on JSON-primary `generate-context` payloads and resume synthesis, not a dedicated always-on prompt ledger. If we want stronger “what was the user actually asking for?” continuity, this is one of Engram’s more useful ideas.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Engram’s resume surface is intentionally lightweight, but too shallow to be our authoritative recovery model
- **Source**: [internal/server/server.go#L473](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/server\/server.go#L473), [internal/mcp/mcp.go#L883](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/mcp\/mcp.go#L883), [internal/store/store.go#L1613](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/store\/store.go#L1613), [handlers/session-resume.ts#L400](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/mcp_server\/handlers\/session-resume.ts#L400), [handlers/session-bootstrap.ts#L163](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/mcp_server\/handlers\/session-bootstrap.ts#L163)
- **What it does**: Engram’s `mem_context` is just formatted output of recent sessions, recent prompts, recent observations, plus stats. It has no spec-folder contract, no structural readiness, no semantic-index status, and no bounded next-action guidance. It is a convenience context packet, not a composite recovery contract.
- **Why it matters for us**: Public already has the stronger pattern: `session_resume` merges resume memory, code-graph state, CocoIndex availability, and additive cached continuity; `session_bootstrap` adds health and recommended actions. Engram’s context format is fine as cheap startup seasoning, but it would be a regression as a primary recovery surface.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Engram’s compaction survival remains host-driven and ungated at the point of reuse
- **Source**: [plugin/opencode/engram.ts#L397](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L397), [plugin/opencode/engram.ts#L423](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/plugin\/opencode\/engram.ts#L423), [internal/setup/setup.go#L104](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/specs\/system-spec-kit\/999-hybrid-rag-fusion-upgrade\/001-research-hybrid-rag-fusion-systems\/001-engram-main\/external\/internal\/setup\/setup.go#L104), [handlers/session-resume.ts#L300](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/mcp_server\/handlers\/session-resume.ts#L300), [handlers/session-resume.ts#L479](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/mcp_server\/handlers\/session-resume.ts#L479), [hooks/claude/session-stop.ts#L60](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/mcp_server\/hooks\/claude\/session-stop.ts#L60), [hooks/claude/session-stop.ts#L299](\/Users\/michelkerkmeester\/MEGA\/Development\/Code_Environment\/Public\/.opencode\/skill\/system-spec-kit\/mcp_server\/hooks\/claude\/session-stop.ts#L299)
- **What it does**: During compaction, Engram fetches `/context` and appends it directly into the compaction payload, then injects prose telling the next agent to call `mem_session_summary`. Setup writes the same instruction family into Codex and Gemini install surfaces. There is no store-native checkpoint written at compaction time, and the reused continuity packet is not checked against scope/freshness/fingerprint gates before injection.
- **Why it matters for us**: This is the lifecycle fragility behind Engram’s otherwise useful session APIs. Public’s safer pattern is already visible in the code here: autosave flows through `generate-context`, while cached continuity is additive only after explicit scope and freshness checks in `session_resume`.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/plugin/opencode/engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts)
- [external/internal/setup/setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md)
- [handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [handlers/session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [handlers/memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [hooks/claude/session-stop.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts)
- [hooks/claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts)
- [lib/context/opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [lib/session/session-snapshot.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts)
- [scripts/memory/generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)

## Assessment
- New information ratio: 0.69
- Questions addressed: Q2, Q6, Q7, Q9, Q10
- Questions answered: Q2, Q9, Q10
- Questions partially answered: Q6, Q7

## Reflection
- What worked: tracing `mem_session_summary` into `EndSession()`, `RecentSessions()`, and `FormatContext()` exposed the summary-authority split immediately; comparing that with Public’s `session_resume` acceptance gates and `session-stop` autosave path made the continuity tradeoff very clear.
- What did not work: CocoIndex MCP was not usable in this session, so this iteration relied on `rg` plus direct file reads; I also did not run the phase validator or memory-save command in this read-only research pass.

## Recommended Next Focus
Trace Engram’s sync and import path for session artifacts end to end, especially [internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go) around `applySessionPayloadTx()` and the sync tables, then compare that against Public’s shared-memory and governed-scope boundaries to see whether session, prompt, and summary fidelity survives cross-machine movement.
