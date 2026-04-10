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
# Iteration 005: SEARCH MECHANISMS

## Focus
SEARCH MECHANISMS: FTS, vector, hybrid, ranking algorithms. Query processing, shortcuts, relevance scoring.

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
I’m treating this as a read-only deep-research pass focused on Engram’s search mechanisms and how they compare to Spec Kit Memory. First I’m checking the scoped instructions and then tracing the actual search and ranking code paths in both repos so the findings stay source-backed instead of README-driven.
exec
/bin/zsh -lc "pwd && printf '\\n---\\n' && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

---
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
/bin/zsh -lc "rg -n \"engram|hybrid-rag|search mechanisms|FTS|topic_key|Search\\(|sanitizeFTS|FormatContext|memory_search|memory_context|memory_match_triggers\" /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
313:- 005-claudest, execution-ready lane, FTS helper forced-degrade matrix, stop-hook metadata patch, normalized analytics reader, cached-summary fast path, verifier discoverer split, token-insight contracts
383:- Claudest continuation is now an execution-ready sequence to preserve in order: FTS helper and forced-degrade tests -> stop-hook metadata patch -> normalized analytics reader -> cached-summary fast path -> verifier/discoverer split -> token-insight contracts [Task 3]
392:- follow-on phase train now implemented as: `026/005` measurement contract -> `026/006` trust-axis contract -> `026/007` detector floor -> `026/008` graph hint nudge -> `026/009` auditable publication -> `024/032` cached-summary consumer -> `024/033` optional FTS hardening -> `024/034` workflow/token-insight split [Task 8]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
547:- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1069:## Task 7: Verify and harden FTS5 ablation integrity (alignment guard + evaluation mode + parent-id normalization)
1087:- when user requested ablation verification, run `eval_run_ablation({ mode:"ablation", includeFormattedReport:true, storeResults:true })` through Codex MCP before declaring FTS5 outcomes [Task 7]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

codex
I’ve confirmed the external scope instructions and there isn’t much useful prior memory specific to this Engram search pass, so I’m leaning on direct source tracing. Next I’m reading the search and ranking paths in Engram alongside the matching Spec Kit Memory retrieval handlers so we can isolate what’s genuinely new versus what we already do better.
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
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Search
// ───────────────────────────────────────────────────────────────
/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES
──────────────────────────────────────────────────────────────── */

import * as toolCache from '../lib/cache/tool-cache.js';
import * as sessionManager from '../lib/session/session-manager.js';
import * as intentClassifier from '../lib/search/intent-classifier.js';
// TierClassifier, crossEncoder imports removed — only used by legacy V1 pipeline.
import { isSessionBoostEnabled, isCausalBoostEnabled, isCommunitySearchFallbackEnabled, isDualRetrievalEnabled, isIntentAutoProfileEnabled } from '../lib/search/search-flags.js';
import { searchCommunities } from '../lib/search/community-search.js';
// 4-stage pipeline architecture
import { executePipeline } from '../lib/search/pipeline/index.js';
import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline/index.js';
import type { IntentWeightsConfig } from '../lib/search/pipeline/types.js';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
// Artifact-class routing (spec/plan/tasks/checklist/memory)
import { getStrategyForQuery } from '../lib/search/artifact-routing.js';
// Chunk reassembly (extracted from this file)
import { collapseAndReassembleChunkResults } from '../lib/search/chunk-reassembly.js';
// Search utilities (extracted from this file)
import {
  filterByMinQualityScore,
  resolveQualityThreshold,
  buildCacheArgs,
  resolveRowContextType,
  resolveArtifactRoutingQuery,
  applyArtifactRouting,
} from '../lib/search/search-utils.js';
// CacheArgsInput used internally by buildCacheArgs (lib/search/search-utils.ts)
// Eval channel tracking (extracted from this file)
import {
  collectEvalChannelsFromRow,
  buildEvalChannelPayloads,
  summarizeGraphWalkDiagnostics,
} from '../lib/telemetry/eval-channel-tracking.js';
import type { EvalChannelPayload } from '../lib/telemetry/eval-channel-tracking.js';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
import {
  logFeedbackEvents,
  isImplicitFeedbackLogEnabled,
} from '../lib/feedback/feedback-ledger.js';
import type { FeedbackEvent } from '../lib/feedback/feedback-ledger.js';
import { trackQueryAndDetect, logResultCited } from '../lib/feedback/query-flow-tracker.js';

// Core utilities
import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core/index.js';
import { validateQuery, requireDb, toErrorMessage } from '../utils/index.js';

// Response envelope + formatters
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
import { formatSearchResults } from '../formatters/index.js';

// Shared handler types
import type { MCPResponse, IntentClassification } from './types.js';

// Retrieval trace contracts (C136-08)
import { createTrace } from '@spec-kit/shared/contracts/retrieval-trace';
import { buildAdaptiveShadowProposal } from '../lib/cognitive/adaptive-ranking.js';
import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
import {
  attachSessionTransitionTrace,
  type SessionTransitionTrace,
} from '../lib/search/session-transition.js';

// REQ-D5-003: Mode-Aware Response Shape
import {
  applyProfileToEnvelope,
  isResponseProfileEnabled,
} from '../lib/response/profile-formatters.js';
import {
  buildProgressiveResponse,
  extractSnippets,
  isProgressiveDisclosureEnabled,
  resolveCursor,
} from '../lib/search/progressive-disclosure.js';
import {
  getLastLexicalCapabilitySnapshot,
  resetLastLexicalCapabilitySnapshot,
} from '../lib/search/sqlite-fts.js';
import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
import { evaluatePublicationGate } from '../lib/context/publication-gate.js';
import {
  deduplicateResults as deduplicateWithSessionState,
  isSessionRetrievalStateEnabled,
  manager as retrievalSessionStateManager,
  refineForGoal,
} from '../lib/search/session-state.js';

// Type imports for casting
import type { IntentType, IntentWeights as IntentClassifierWeights } from '../lib/search/intent-classifier.js';
import type { RawSearchResult } from '../formatters/index.js';
// RoutingResult, WeightedResult — now used internally by lib/search/search-utils.ts

// Feature catalog: Semantic and lexical search (memory_search)
// Feature catalog: Hybrid search pipeline
// Feature catalog: 4-stage pipeline architecture
// Feature catalog: Quality-aware 3-tier search fallback


/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Internal search result row — enriched DB row used within this handler.
 * NOT the same as the canonical SearchResult in shared/types.ts.
 * Self-contained: uses local types instead of the deprecated MemoryRow/MemoryRecord shapes.
 * This can migrate to MemoryDbRow & Record<string, unknown> later without changing the handler contract.
 */
interface MemorySearchRow extends Record<string, unknown> {
  id: number;
  similarity?: number;
  importance_tier?: string;
  contextType?: string;
  context_type?: string;
  attentionScore?: number;
  retrievability?: number;
  stability?: number;
  last_review?: string | null;
  created_at?: string;
  last_accessed?: number;
  content?: string;
  memoryState?: string;
  file_path?: string;
  parent_id?: number | null;
  chunk_index?: number | null;
  chunk_label?: string | null;
  isChunk?: boolean;
  parentId?: number | null;
  chunkIndex?: number | null;
  chunkLabel?: string | null;
  chunkCount?: number | null;
  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
  precomputedContent?: string;
}

interface DedupResult {
  results: MemorySearchRow[];
  dedupStats: Record<string, unknown>;
}

interface SearchCachePayload {
  summary: string;
  data: Record<string, unknown>;
  hints: string[];
}

type SessionAwareResult = Record<string, unknown> & {
  id: number | string;
  score?: number;
  content?: string;
};

// ChunkReassemblyResult — now imported from lib/search/chunk-reassembly.ts

type IntentWeights = IntentClassifierWeights;

function toIntentWeightsConfig(weights: IntentWeights | null): IntentWeightsConfig | null {
  if (!weights) return null;
  return {
    similarity: weights.similarity,
    importance: weights.importance,
    recency: weights.recency,
  };
}

// EvalChannelPayload — now imported from lib/telemetry/eval-channel-tracking.ts

interface SearchArgs {
  cursor?: string;
  query?: string;
  concepts?: string[];
  specFolder?: string;
  folderBoost?: { folder: string; factor: number };
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
  tier?: string;
  contextType?: string;
  useDecay?: boolean;
  includeContiguity?: boolean;
  includeConstitutional?: boolean;
  includeContent?: boolean;
  anchors?: string[];
  bypassCache?: boolean;
  sessionId?: string;
  enableDedup?: boolean;
  intent?: string;
  autoDetectIntent?: boolean;
  minState?: string;
  applyStateLimits?: boolean;
  rerank?: boolean;
  applyLengthPenalty?: boolean;
  trackAccess?: boolean; // opt-in access tracking (default false)
  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
  enableSessionBoost?: boolean;
  enableCausalBoost?: boolean;
  minQualityScore?: number;
  min_quality_score?: number;
  mode?: string; // "deep" mode enables query expansion for multi-query RAG
  includeTrace?: boolean;
  sessionTransition?: SessionTransitionTrace;
  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
  profile?: string;
  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
  retrievalLevel?: 'local' | 'global' | 'auto';
}

// resolveRowContextType — now imported from lib/search/search-utils.ts
// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts

function attachTelemetryMeta(
  response: MCPResponse,
  telemetryPayload: Record<string, unknown>,
): MCPResponse {
  const firstEntry = response?.content?.[0];
  if (!firstEntry || typeof firstEntry.text !== 'string') {
    return response;
  }

  try {
    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
    const meta = envelope.meta && typeof envelope.meta === 'object'
      ? envelope.meta as Record<string, unknown>
      : {};
    envelope.meta = {
      ...meta,
      _telemetry: telemetryPayload,
    };

    return {
      ...response,
      content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
    };
  } catch (error: unknown) {
    const message = toErrorMessage(error);
    console.warn('[memory-search] Failed to attach telemetry payload:', message);
    return response;
  }
}

function extractResponseResults(response: MCPResponse): Array<Record<string, unknown>> {
  const firstEntry = response?.content?.[0];
  if (!firstEntry || typeof firstEntry.text !== 'string') {
    return [];
  }

  try {
    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
    const data = envelope.data && typeof envelope.data === 'object'
      ? envelope.data as Record<string, unknown>
      : null;

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "rg -n \"func \\(s \\*Store\\) (Search|AddObservation|FormatContext|SuggestTopicKey|CreateSession|EndSession|AddPrompt)|sanitizeFTS|observations_fts|prompts_fts|topic_key|bm25|rank MATCH|MATCH \\?\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
48:	TopicKey       *string `json:"topic_key,omitempty"`
87:	TopicKey       *string `json:"topic_key,omitempty"`
120:	TopicKey  string `json:"topic_key,omitempty"`
129:	TopicKey *string `json:"topic_key,omitempty"`
217:	TopicKey   *string `json:"topic_key,omitempty"`
460:			topic_key  TEXT,
476:		CREATE VIRTUAL TABLE IF NOT EXISTS observations_fts USING fts5(
482:			topic_key,
501:		CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
550:		{name: "topic_key", definition: "TEXT"},
575:		CREATE INDEX IF NOT EXISTS idx_obs_topic ON observations(topic_key, project, scope, updated_at DESC);
610:	if _, err := s.execHook(s.db, `UPDATE observations SET topic_key = NULL WHERE topic_key = ''`); err != nil {
645:				INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
646:				VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
650:				INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
651:				VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
655:				INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
656:				VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
657:				INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
658:				VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
679:				INSERT INTO prompts_fts(rowid, content, project)
684:				INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
689:				INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
691:				INSERT INTO prompts_fts(rowid, content, project)
705:	err := s.db.QueryRow("SELECT COUNT(*) FROM pragma_table_xinfo('observations_fts') WHERE name = 'topic_key'").Scan(&colCount)
714:		DROP TABLE IF EXISTS observations_fts;
715:		CREATE VIRTUAL TABLE observations_fts USING fts5(
721:			topic_key,
725:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
726:		SELECT id, title, content, tool_name, type, project, topic_key
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
908:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
937:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
948:func (s *Store) AddObservation(p AddObservationParams) (int64, error) {
970:				 WHERE topic_key = ?
985:					     topic_key = ?,
1052:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
1086:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
1109:func (s *Store) AddPrompt(p AddPromptParams) (int64, error) {
1181:func (s *Store) SearchPrompts(query string, project string, limit int) ([]Prompt, error) {
1186:	ftsQuery := sanitizeFTS(query)
1190:		FROM prompts_fts fts
1192:		WHERE prompts_fts MATCH ?
1226:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1284:			     topic_key = ?,
1384:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1418:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1462:func (s *Store) Search(query string, opts SearchOptions) ([]SearchResult, error) {
1478:			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1480:			WHERE topic_key = ? AND deleted_at IS NULL
1519:	ftsQuery := sanitizeFTS(query)
1523:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at,
1525:		FROM observations_fts fts
1527:		WHERE observations_fts MATCH ? AND o.deleted_at IS NULL
1613:func (s *Store) FormatContext(project, scope string) (string, error) {
1699:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1769:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
2124:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2697:		SELECT sync_id, session_id, type, title, content, tool_name, project, scope, topic_key
2846:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2858:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2904:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, updated_at, deleted_at)
2915:		 SET session_id = ?, type = ?, title = ?, content = ?, tool_name = ?, project = ?, scope = ?, topic_key = ?, normalized_hash = ?, revision_count = revision_count + 1, updated_at = datetime('now'), deleted_at = NULL
3065:			topic_key  TEXT,
3082:			scope, topic_key, normalized_hash, revision_count, duplicate_count,
3099:			NULLIF(topic_key, ''),
3125:		DROP TABLE IF EXISTS observations_fts;
3126:		CREATE VIRTUAL TABLE observations_fts USING fts5(
3132:			topic_key,
3136:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
3137:		SELECT id, title, content, tool_name, type, project, topic_key
3382:// sanitizeFTS wraps each word in quotes so FTS5 doesn't choke on special chars.
3384:func sanitizeFTS(query string) string {

exec
/bin/zsh -lc "rg -n \"executePipeline|dual retrieval|vector|fts|lexical|bm25|RRF|rrf|hybrid|sqlite-fts|MATCH|rerank|re-rank|rank\" .opencode/skill/system-spec-kit/mcp_server/lib/search -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "mem_search|mem_context|mem_save_prompt|mem_suggest_topic_key|mem_capture_passive|ResolveTools|shouldRegister|ProfileAgent|ProfileAdmin|serverInstructions" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13://	engram mcp --tools=mem_save,mem_search → individual tool names
41://   mem_save, mem_search, mem_context, mem_session_summary,
43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
50:// ProfileAgent contains the tool names that AI agents need.
53:var ProfileAgent = map[string]bool{
55:	"mem_search":            true, // search past memories — referenced 6 times
56:	"mem_context":           true, // recent context from previous sessions — referenced 10 times
61:	"mem_suggest_topic_key": true, // stable topic key for upserts — referenced 3 times
62:	"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
63:	"mem_save_prompt":       true, // save user prompts
67:// ProfileAdmin contains tools for TUI, dashboards, and manual curation
69:var ProfileAdmin = map[string]bool{
78:	"agent": ProfileAgent,
79:	"admin": ProfileAdmin,
82:// ResolveTools takes a comma-separated string of profile names and/or
85:func ResolveTools(input string) map[string]bool {
121:// serverInstructions tells MCP clients when to use Engram's tools.
124:const serverInstructions = `Engram provides persistent memory that survives across sessions and compactions.
128:  mem_search — find past work, decisions, or context from previous sessions
129:  mem_context — get recent session history (call at session start or after compaction)
132:  mem_save_prompt — save user prompt for context
135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
136:  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
153:		server.WithInstructions(serverInstructions),
160:// shouldRegister returns true if the tool should be registered given the
162:func shouldRegister(name string, allowlist map[string]bool) bool {
170:	// ─── mem_search (profile: agent, core — always in context) ─────────
171:	if shouldRegister("mem_search", allowlist) {
173:			mcp.NewTool("mem_search",
202:	if shouldRegister("mem_save", allowlist) {
265:	if shouldRegister("mem_update", allowlist) {
302:	// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
303:	if shouldRegister("mem_suggest_topic_key", allowlist) {
305:			mcp.NewTool("mem_suggest_topic_key",
328:	if shouldRegister("mem_delete", allowlist) {
350:	// ─── mem_save_prompt (profile: agent, eager) ────────────────────────
351:	if shouldRegister("mem_save_prompt", allowlist) {
353:			mcp.NewTool("mem_save_prompt",
375:	// ─── mem_context (profile: agent, core — always in context) ────────
376:	if shouldRegister("mem_context", allowlist) {
378:			mcp.NewTool("mem_context",
400:	if shouldRegister("mem_stats", allowlist) {
416:	if shouldRegister("mem_timeline", allowlist) {
419:				mcp.WithDescription("Show chronological context around a specific observation. Use after mem_search to drill into the timeline of events surrounding a search result. This is the progressive disclosure pattern: search first, then timeline to understand context."),
428:					mcp.Description("The observation ID to center the timeline on (from mem_search results)"),
442:	if shouldRegister("mem_get_observation", allowlist) {
445:				mcp.WithDescription("Get the full content of a specific observation by ID. Use when you need the complete, untruncated content of an observation found via mem_search or mem_timeline."),
461:	if shouldRegister("mem_session_summary", allowlist) {
516:	if shouldRegister("mem_session_start", allowlist) {
543:	if shouldRegister("mem_session_end", allowlist) {
565:	// ─── mem_capture_passive (profile: agent, deferred) ─────────────────
566:	if shouldRegister("mem_capture_passive", allowlist) {
568:			mcp.NewTool("mem_capture_passive",
599:	if shouldRegister("mem_merge_projects", allowlist) {

 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:4:// Combines vector, FTS, and BM25 search with fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:9:import { getIndex, isBm25Enabled } from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:10:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:13:import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:15:import { fts5Bm25Search } from './sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:20:  isLocalRerankerEnabled,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:26:import { rerankLocal } from './local-reranker.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:62:import type { MMRCandidate } from '@spec-kit/shared/algorithms/mmr-reranker';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:63:import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:107:   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:117:   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:118:   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:119:   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:122:   * After hybrid merge, all source scores are min-max normalized to 0-1 within
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:138:/** Normalize a fused RRF result to the HybridSearchResult contract. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:141:  const primarySource = result.sources[0] ?? 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:147:    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:218: * Raw RRF scores are typically small decimals (often <0.05), so a
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:234:/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:236:/** Secondary vector similarity floor for adaptive retry passes (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:238:/** Tier-2 vector similarity floor for quality-aware fallback (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:241:/** Minimum MMR candidates required for diversity reranking to be worthwhile. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:260:let vectorSearchFn: VectorSearchFn | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:303: * Initialize hybrid search with database, vector search, and optional graph search dependencies.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:305: * @param vectorFn - Optional vector search function for semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:310:  vectorFn: VectorSearchFn | null = null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:314:  vectorSearchFn = vectorFn;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:324: * @returns Array of BM25-scored results tagged with source 'bm25'.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:326:function bm25Search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:331:    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:394:        source: 'bm25',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:398:    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:425: * @returns True if the memory_fts table exists in the connected database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:429:    console.warn('[hybrid-search] db not initialized — isFtsAvailable returning false');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:435:      SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:448: * @returns Array of FTS-scored results tagged with source 'fts'.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:450:function ftsSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:455:    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:462:    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:463:    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:466:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:468:    return bm25Results.map(row => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:471:      score: row.fts_score || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:472:      source: 'fts',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:476:    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:493:  const ftsResults = ftsSearch(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:494:  const bm25Results = bm25Search(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:501:  for (const r of ftsResults) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:505:  for (const r of bm25Results) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:600:    source: typeof primary.source === 'string' ? primary.source : (sources[0] ?? 'hybrid'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:682:  const allowed = new Set<ChannelName>(['vector', 'fts', 'graph', 'degree']);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:685:    allowed.add('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:688:  if (options.useVector === false) allowed.delete('vector');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:689:  if (options.useBm25 === false) allowed.delete('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:690:  if (options.useFts === false) allowed.delete('fts');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:707:    useVector: allowedChannels.has('vector'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:708:    useBm25: allowedChannels.has('bm25'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:709:    useFts: allowedChannels.has('fts'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:742:  vectorEmbeddingCache: Map<number, Float32Array>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:787:    : await hybridSearch(query, embedding, primaryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:809:      : await hybridSearch(query, embedding, retryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:829:      : await hybridSearch(query, embedding, retryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:848: * Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:849: * Prefer hybridSearchEnhanced() or searchWithFallback() instead. This function uses naive per-source
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:850: * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:853:async function hybridSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:872:  if (useVector && embedding && vectorSearchFn) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:874:      const vectorResults = vectorSearchFn(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:881:      for (const r of vectorResults) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:886:          source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:891:      console.warn(`[hybrid-search] Vector search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:897:    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:898:    results.push(...ftsResults);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:903:    const bm25Results = bm25Search(query, { limit, specFolder });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:904:    results.push(...bm25Results);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:921:      console.warn(`[hybrid-search] Graph search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:926:  // Does not dominate others during final ranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:954:  // LIMITATION (P1-1): When a result appears in multiple sources (e.g., vector + fts),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:973: * Enhanced hybrid search with RRF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:977:async function hybridSearchEnhanced(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:991:  return hybridSearch(query, embedding, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1010:    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1054:    let ftsChannelResults: HybridSearchResult[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1055:    let bm25ChannelResults: HybridSearchResult[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1056:    const vectorEmbeddingCache = new Map<number, Float32Array>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1062:    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1064:        const vectorResults = vectorSearchFn(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1072:        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1075:          source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1084:            vectorEmbeddingCache.set(result.id, embeddingCandidate);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1087:        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1089:        // Non-critical — vector channel failure does not block pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1090:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1094:    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1095:    if (activeChannels.has('fts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1096:      ftsChannelResults = ftsSearch(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1097:      if (ftsChannelResults.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1099:        // flooding top-K with noisy lexical matches despite its exact-match value.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1100:        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1104:    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1105:    if (activeChannels.has('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1106:      bm25ChannelResults = bm25Search(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1107:      if (bm25ChannelResults.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1108:        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1110:        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1133:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1137:    // Degree channel re-ranks based on causal-edge connectivity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1154:          // Build a ranked list sorted by degree score (highest first)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1177:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1183:      ...ftsChannelResults,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1184:      ...bm25ChannelResults,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1195:        vectorEmbeddingCache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1222:    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1234:      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1236:        if (list.source === 'vector') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1273:      vectorEmbeddingCache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1278:    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1296:    vectorEmbeddingCache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1337:      console.error('[hybrid-search] MPAB error (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1360:      fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1375:    console.warn('[hybrid-search] channel enforcement failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1384:  // C138/T316: MMR reranking with request-scoped embedding cache.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1385:  // Reuse embeddings already returned by the vector channel when present and
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1387:  let reranked: HybridSearchResult[] = fusedHybridResults.slice(0, limit);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1389:  // P1-5: Optional local GGUF reranking path (RERANKER_LOCAL=true).
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1390:  // Preserve cross-encoder gate semantics: when SPECKIT_CROSS_ENCODER=false, skip reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1391:  if (isCrossEncoderEnabled() && isLocalRerankerEnabled() && reranked.length >= MMR_MIN_CANDIDATES) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1392:    const localReranked = await rerankLocal(query, reranked, limit);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1393:    if (localReranked !== reranked) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1394:      reranked = localReranked as HybridSearchResult[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1399:    const numericIds = reranked
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1405:        const embeddingMap = new Map<number, Float32Array>(vectorEmbeddingCache);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1425:        for (const r of reranked) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1440:          // FIX #6: Same fix as stage3-rerank FIX #5 — MMR can only diversify
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1441:          // rows that have embeddings. Non-embedded rows (lexical-only hits,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1445:          const nonEmbeddedRows = reranked.filter(r => !embeddedIdSet.has(r.id as number));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1446:          const rerankedById = new Map<string, HybridSearchResult>(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1447:            reranked.map((result) => [canonicalResultId(result.id), result])
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1451:            const existing = rerankedById.get(canonicalResultId(candidate.id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1459:              source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1465:          reranked = [...diversifiedRows, ...nonEmbeddedRows];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1469:        console.warn(`[hybrid-search] MMR embedding retrieval failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1475:  const topIds = reranked
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1485:        for (const result of reranked) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1491:            if ('rrfScore' in result) (result as Record<string, unknown>).rrfScore = boostedScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1497:      // Are promoted to their correct position in the ranking
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1498:      reranked.sort((a, b) => ((b.score as number) ?? 0) - ((a.score as number) ?? 0));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1500:      // Non-critical enrichment — co-activation failure does not affect core ranking
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1501:      console.warn('[hybrid-search] co-activation enrichment failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1506:  if (db && isFolderScoringEnabled() && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1508:      const numericIds = reranked
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1515:          const folderScores = computeFolderRelevanceScores(reranked, folderMap);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1520:          const twoPhaseResults = twoPhaseRetrieval(reranked, folderScores, folderMap, topK);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1521:          const postFolderResults = twoPhaseResults.length > 0 ? twoPhaseResults : reranked;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1522:          reranked = enrichResultsWithFolderScores(postFolderResults, folderScores, folderMap) as HybridSearchResult[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1531:  // Run after the ranking pipeline so later boosts/promotions can rescue
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1536:        reranked.map(r => ({ ...r, id: r.id, score: r.score })),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1540:        reranked = truncationResult.results.map(r => r as HybridSearchResult);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1555:      console.warn('[hybrid-search] confidence truncation failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1562:  if (reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1563:    reranked = reranked.map((row): HybridSearchResult => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1597:  if (isContextHeadersEnabled() && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1600:      reranked = reranked.map((row) => injectContextualTree(row, descriptionCache));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1607:    reranked = applyResultLimit(reranked, options.limit);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1612:      ? reranked.length * CONTEXT_HEADER_TOKEN_OVERHEAD
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1621:    const budgeted = truncateToBudget(reranked, adjustedBudget, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1623:      queryId: `hybrid-${Date.now()}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1625:    reranked = budgeted.results;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1630:  if (reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1631:    reranked = reranked.map((row): HybridSearchResult => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1648:  if (s4shadowMeta !== undefined && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1649:    Object.defineProperty(reranked, '_s4shadow', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1656:  if (s4attributionMeta !== undefined && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1657:    Object.defineProperty(reranked, '_s4attribution', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1667:  if (Object.keys(s3meta).length > 0 && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1668:    Object.defineProperty(reranked, '_s3meta', { value: s3meta, enumerable: false, configurable: true });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1671:  return reranked;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1677: * reranking, or post-processing.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1680: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1710:  if (allowedChannels.has('fts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1711:    const ftsFallback = collectCandidatesFromLists(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1712:      [{ source: 'fts', results: ftsSearch(query, options) }],
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1715:    if (ftsFallback.length > 0) return ftsFallback;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1718:  if (allowedChannels.has('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1719:    const bm25Fallback = collectCandidatesFromLists(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1720:      [{ source: 'bm25', results: bm25Search(query, options) }],
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1723:    if (bm25Fallback.length > 0) return bm25Fallback;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1726:  console.warn('[hybrid-search] Raw candidate collection returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1737: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1753:  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1754:  // The naive hybridSearch that merges raw scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1771:  if (allowedChannels.has('fts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1772:    const ftsResults = ftsSearch(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1773:    if (ftsResults.length > 0) return ftsResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1777:  if (allowedChannels.has('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1778:    const bm25Results = bm25Search(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1779:    if (bm25Results.length > 0) return bm25Results;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1782:  console.warn('[hybrid-search] All search methods returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1800:    console.warn('[hybrid-search] db not initialized — returning empty structuralSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1855:    console.warn(`[hybrid-search] Structural search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2009:/** Per-rank score decay for Tier-3 results, as a fraction of the top existing score. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2014: * Prevents structural placeholders from outranking stronger semantic/lexical hits.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2103: * TIER 1: hybridSearchEnhanced at minSimilarity=30
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2106: * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2115: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2147:  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2174:  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2282:    'combined_lexical_score',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2390:      `[hybrid-search] Token budget overflow (single-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2427:      `[hybrid-search] Token budget overflow (top-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2444:    `[hybrid-search] Token budget overflow: ${totalTokens} tokens > ${effectiveBudget} budget, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2467:  bm25Search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2472:  ftsSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2473:  hybridSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2474:  hybridSearchEnhanced,
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:253: * @param resultRank - The rank position of this result (1-based)
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:399:    // Do NOT touch memory_fts or any FTS5 table (Safeguard #1).
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:13://   - R-007: Post-reranker stage in scoring pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:45: * will not outrank a folder with 2 high-scoring results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:138: * - `folderRank`  — 1-based rank (1 = highest FolderScore)
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:160:  // Build folder rank lookup (1-based, descending by FolderScore)
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:161:  const rankedFolders = Array.from(folderScores.entries())
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:164:  for (let i = 0; i < rankedFolders.length; i++) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:165:    folderRankMap.set(rankedFolders[i][0], i + 1);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:177:    const rank = folderRankMap.get(folder);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:182:      folderRank: rank,
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:222:  const rankedFolders = Array.from(folderScores.entries())
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:227:  const topFolderSet = new Set(rankedFolders);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:31:import * as vectorIndex from './vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:61:  /** Embedding vector of the pseudo-document (Float32Array). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:69:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:128: *   intentAdjustedScore (not in BaselineResult) → rrfScore → score → similarity/100
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:156:  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:157:    return Math.max(0, Math.min(1, result.rrfScore));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:353: * Run a vector-only search using the HyDE pseudo-document embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:366:export function vectorOnly(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:371:  return vectorIndex.vectorSearch(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:412:    const candidates = vectorOnly(hydeResult.embedding, limit, specFolder);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:4:// SCHEMA_VERSION is now canonical in vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:8:/** Supported embedding input shapes for vector search and mutation operations. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:11:/** Stable error codes emitted by vector-index modules. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:23:/** Structured error used by vector-index query, mutation, and store helpers. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:75:/** Represents a vector-search memory row shared by query and store helpers. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:132:/** Controls vector search filtering and ranking behavior. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:146:  rank: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:168: * Converts an embedding vector into a binary buffer for sqlite-vec storage.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:232:// ValidateEmbeddingDimension are exported from vector-index-store.ts (canonical)
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:16:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:124:  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:125:    return result.rrfScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:174:          rrfScore: finalScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:177:          // store boosted ranking score separately
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:6:// On RRF scores to detect low-confidence retrieval and inject
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:32: * Summarises Z-score statistics for the RRF score distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:37:  /** Z-score of the top-ranked result relative to the distribution. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:39:  /** Arithmetic mean of all RRF scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:41:  /** Population standard deviation of all RRF scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:78:    basis: 'Z-score and absolute-threshold heuristics over ranked score distributions.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:144: * Detect evidence gaps in an RRF score distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:151: * @param rrfScores - Array of Reciprocal Rank Fusion scores (any length).
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:154:export function detectEvidenceGap(rrfScores: number[]): TRMResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:155:  if (rrfScores.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:159:  const finiteScores = rrfScores.filter((score) => Number.isFinite(score));
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:24: * Session attention boost for search result re-ranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:68: * Graph-guided MMR diversity reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:92: * Cross-encoder reranking gate.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:166: * T002b/A4: Negative-feedback confidence demotion in ranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:259: * Temporal contiguity boost on raw Stage 1 vector results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:283:/** Whether causal-edge degree-based re-ranking is enabled (SPECKIT_DEGREE_BOOST). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:311: * P1-5: Local GGUF reranker gate.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:315:export function isLocalRerankerEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:367: * Shadow-only — no ranking side effects.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:464: * Runs the learned linear ranker in parallel with manual weights.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:465: * Scores are computed but NOT used for ranking (shadow-only).
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:478: * Compares would-have-changed rankings vs live rankings on a holdout
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:479: * slice of queries. Shadow-only — no ranking side effects.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:521: * REQ-D1-003: Experimental per-intent RRF K selection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:522: * Default: TRUE (graduated). Set SPECKIT_RRF_K_EXPERIMENTAL=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:525:  return isFeatureEnabled('SPECKIT_RRF_K_EXPERIMENTAL');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:589: * Phase B T016: Query concept expansion for hybrid search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:634: * Phase D T036: Usage-weighted ranking signal.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:40:  /** N2a cap for RRF fusion overflow prevention. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:42:  /** N2b cap for RRF fusion overflow prevention. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:66:/** A single ranked item used in ablation measurement. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:180: * MRR@k = 1 / rank_of_first_relevant_item (within top k).
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:183: * @param rankedItems - Items in ranked order (index 0 = rank 1).
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:188:  rankedItems: AblationRankedItem[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:192:  const cutoff = Math.min(k, rankedItems.length);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:194:    const item = rankedItems[i];
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:207: *   IDCG@k = DCG of the ideal ranking (all relevant items first).
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:209: * Returns 0 if there are no relevant items or the ranked list is empty.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:211: * @param rankedItems - Items in ranked order (index 0 = rank 1).
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:216:  rankedItems: AblationRankedItem[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:220:  if (relevantIds.size === 0 || rankedItems.length === 0) return 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:222:  const cutoff = Math.min(k, rankedItems.length);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:227:    const item = rankedItems[i];
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:229:      dcg += 1 / Math.log2(i + 2); // i+2 because log2(1+1) for rank 1
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:233:  // IDCG@k --- ideal ranking places all relevant items first
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:493: * ranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:6:// TypeScript port of the vector index implementation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:26:import { IVectorStore } from '../interfaces/vector-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:35:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:39:} from './vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:46:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:82:/** Loaded search weight configuration for vector-index ranking (lazy-loaded). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:100:let _cached_queries: Awaited<typeof import('./vector-index-queries.js')> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:101:let _cached_mutations: Awaited<typeof import('./vector-index-mutations.js')> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:102:let _cached_aliases: Awaited<typeof import('./vector-index-aliases.js')> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:105:  return _cached_queries ??= await import('./vector-index-queries.js');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:109:  return _cached_mutations ??= await import('./vector-index-mutations.js');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:113:  return _cached_aliases ??= await import('./vector-index-aliases.js');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:120:/** Default embedding dimension used by the vector index. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:145:  console.warn('[vector-index] Using default dimension 768 after timeout');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:222:    reason: 'No stored vector dimension found for existing schema',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:248:      const warning = `EMBEDDING DIMENSION MISMATCH: Existing database stores ${existing.stored_dim}-dim vectors (${source_label}), ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:249:        `but the active embedding configuration resolves to ${current_dim}. Refusing to bootstrap because vector search would fail. ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:252:      console.error(`[vector-index] WARNING: ${warning}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:258:    console.warn('[vector-index] Dimension validation error:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:264: * Validates that stored vector dimensions match the provider.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:280:/** Default path for the vector-index database file. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:327:      console.warn(`[vector-index] Could not read file ${valid_path}: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:360:        console.warn('[vector-index] Blocked potential prototype pollution in JSON');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:367:    console.warn(`[vector-index] JSON parse error: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:413:        console.warn(`[vector-index] Database connection listener failed: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:425:    console.warn(`[vector-index] Could not set permissions on ${target_path}: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:499:    console.warn('[vector-index] Cache validation error:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:728:    console.warn(`[vector-index] interference score refresh failed for '${specFolder}': ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:737: * Initializes the vector-index database connection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:773:      console.error('[vector-index] FATAL: better-sqlite3 native module failed to load');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:774:      console.error(`[vector-index] ${errMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:775:      console.error(`[vector-index] Running: Node ${process.version} (MODULE_VERSION ${process.versions.modules})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:780:          console.error(`[vector-index] Marker recorded: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:785:      console.error('[vector-index] This usually means Node.js was updated without rebuilding native modules.');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:786:      console.error('[vector-index] Fix: Run \'bash scripts/setup/rebuild-native-modules.sh\' from the spec-kit root');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:787:      console.error('[vector-index] Or manually: npm rebuild better-sqlite3');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:797:    console.warn(`[vector-index] sqlite-vec extension not available: ${get_error_message(vec_error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:798:    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:799:    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:814:    console.error(`[vector-index] FATAL: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:825:    console.error(`[vector-index] FATAL: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:843: * Closes the shared vector-index database connection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:860: * Gets the active vector-index database path.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:868: * Gets the shared vector-index database connection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:875:// Check if vector search is available (sqlite-vec loaded)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:877: * Reports whether sqlite-vec vector search is available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:878: * @returns True when vector search is available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:880:export function is_vector_search_available(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:888:/** Implements the vector-store interface on top of SQLite. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:914:   * @param options - Optional ranking and filtering controls.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:945:    const { vector_search } = await getQueriesModule();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:946:    return vector_search(embedding, search_options, database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1084:    const { vector_search_enriched } = await getQueriesModule();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1085:    return vector_search_enriched(embedding, undefined, options, database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1114:    cleaned?: { vectors: number; chunks: number };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1137:export { is_vector_search_available as isVectorSearchAvailable };
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:26: * Compute cosine similarity between two vectors.
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:95: * @param embeddingFn - Async function to compute embedding vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:157: * @param queryEmbedding - Query vector to compare against stored summaries
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:168:    // Over-fetch by a factor so that after cosine ranking we can still return `limit` results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:137:    // Score and rank communities by query-term match
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:20:import * as vectorIndex from './vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:164: *   3. Embedding vector is invalid (zero-length or non-finite values).
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:168: *   a. Run a vector similarity search using the provided embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:215:    const similarMemories = vectorIndex.vectorSearch(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:2:// MODULE: Reranker
.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:5:// Simple score-based reranking utility. Sorts results by score
.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:8:// For neural/ML-based reranking see cross-encoder.ts.
.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:14:export interface RerankResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:20:export interface RerankOptions {
.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:29: * Rerank results by score (descending). Preserves all fields on
.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:36:export function rerankResults(
.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:37:  results: Array<RerankResult>,
.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:38:  options?: RerankOptions,
.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:39:): Array<RerankResult> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:2:// MODULE: Local Reranker
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:4:// Optional local reranker for Stage 3. This module is fully gated by
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:9:// Dedicated evaluation suite because runtime reranking must stay provider-agnostic.
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:20:// Feature catalog: Local GGUF reranker via node-llama-cpp
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:30:type LocalRerankRow = Record<string, unknown> & {
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:35:  rerankerScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:48:const DEFAULT_MODEL_RELATIVE_PATH = path.join('models', 'bge-reranker-v2-m3.Q4_K_M.gguf');
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:74:function resolveRowText(row: LocalRerankRow): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:207: * Feature-flag gate for local reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:208: * This guard is intentionally strict: local reranking only runs when the
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:212:export async function canUseLocalReranker(): Promise<boolean> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:235: * Local GGUF reranking entrypoint for Stage 3.
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:239:export async function rerankLocal<T extends LocalRerankRow>(
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:249:   * Internal guard for direct callers: rerankLocal re-checks eligibility even
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:251:   * original ranking when local execution is unavailable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:253:  const localEnabled = await canUseLocalReranker();
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:259:  const rerankCandidates = candidates.slice(0, MAX_RERANK_CANDIDATES);
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:260:  const rerankCount = Math.max(1, Math.min(topK, rerankCandidates.length));
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:276:     * local GGUF reranking can be exercised without changing the default
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:280:     * `tests/reranker-eval-comparison.vitest.ts`, where benchmark protocol and
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:283:    const reranked = await Promise.race([
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:291:        const scored: Array<{ candidate: T; rerankScore: number }> = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:292:        for (const candidate of rerankCandidates.slice(0, rerankCount)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:305:          const rerankScore = await scorePrompt(context, boundedPrompt);
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:306:          scored.push({ candidate, rerankScore });
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:309:        scored.sort((a, b) => b.rerankScore - a.rerankScore);
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:310:        const rerankedTop = scored.map((entry) => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:312:          rerankerScore: entry.rerankScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:313:          score: entry.rerankScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:315:        const remainder = candidates.slice(rerankCount);
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:318:          `[local-reranker] reranked=${rerankCount} total=${candidates.length} durationMs=${elapsed} model=${path.basename(modelPath)}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:320:        return [...rerankedTop, ...remainder];
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:324:          reject(new Error(`local reranker timed out after ${RERANKER_TIMEOUT_MS}ms`));
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:328:    return reranked;
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:330:    console.warn(`[local-reranker] fallback to original ordering: ${toErrorMessage(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:347:export async function disposeLocalReranker(): Promise<void> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:23:/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:24:type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:41:const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:47:const FALLBACK_CHANNELS: readonly ChannelName[] = ['vector', 'fts'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:64: * - simple:   2 channels (vector + fts) — fastest path
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:65: * - moderate: 3 channels (vector + fts + bm25) — balanced
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:69:  simple: ['vector', 'fts'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:70:  moderate: ['vector', 'fts', 'bm25'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:71:  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:81: * fallback channels (vector, fts) until the minimum is met.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:156:    ? enforceMinimumChannels([...channels, 'bm25'])
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:16:// Fields (score, rrfScore, similarity, intentAdjustedScore). It only
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:17://     "summary": "Ranked first because semantic, reranker, decision-anchor agreed",
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:19://     "channelContribution": { "vector": 0.44, "fts": 0.12, "graph": 0.06 }
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:33:  | 'lexical_match'
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:38:  | 'reranker_support'
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:45:  vector: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:46:  fts: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:103:  if (channelAttribution.includes('fts') || channelAttribution.includes('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:104:    signals.push('lexical_match');
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:130:  // Reranker support: row has a rerankerScore distinct from stage2Score
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:131:  const rerankerScore = typeof row.rerankerScore === 'number' ? row.rerankerScore : null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:133:  if (rerankerScore !== null && stage2Score !== null && rerankerScore !== stage2Score) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:134:    signals.push('reranker_support');
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:173: * Prioritises: semantic/lexical first, then boosts, then meta.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:193:function composeSummary(topSignals: SignalLabel[], rank: number): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:195:    return rank === 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:197:      : `Ranked #${rank + 1} by composite score`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:200:  const rankPhrase = rank === 0 ? 'Ranked first because' : `Ranked #${rank + 1} because`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:205:    if (signal === 'lexical_match') return 'keyword match';
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:210:    if (signal === 'reranker_support') return 'reranker confirmation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:221:    return `${rankPhrase} ${descriptions[0]}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:226:  return `${rankPhrase} ${rest.join(', ')} and ${last}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:232: * distribute the effective score across vector, fts, and graph channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:240:  const vectorScore = typeof row.vectorScore === 'number' && Number.isFinite(row.vectorScore)
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:241:    ? Math.max(0, Math.min(1, row.vectorScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:243:  const ftsScore = typeof row.ftsScore === 'number' && Number.isFinite(row.ftsScore)
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:244:    ? Math.max(0, Math.min(1, row.ftsScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:254:  if (vectorScore !== null && ftsScore !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:258:      vector: Math.round(vectorScore * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:259:      fts: Math.round(ftsScore * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:268:  const hasFTS = channelAttribution.includes('fts') || channelAttribution.includes('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:275:      vector: Math.round(remaining * 0.75 * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:276:      fts: Math.round(remaining * 0.25 * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:283:      vector: Math.round(effectiveScore * 0.78 * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:284:      fts: Math.round(effectiveScore * 0.22 * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:292:      vector: Math.round((effectiveScore - graphShare) * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:293:      fts: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:299:  return { vector: Math.round(effectiveScore * 100) / 100, fts: 0, graph: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:311: * @param rank    - Zero-based rank position (0 = first result)
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:317:  rank: number,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:322:  const summary = composeSummary(topSignals, rank);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:5:// Split from vector-index-store.ts — contains ALL mutation functions:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:14:import * as bm25Index from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:17:} from './vector-index-aliases.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:23:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:31:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:35:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:181:    console.warn(`[vector-index] Embedding dimension mismatch: expected ${expected_dim}, got ${embedding.length}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:436:      // H1 FIX: Set 'pending' until vector write is confirmed
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:456:        console.warn(`[vector-index] Embedding dimension mismatch in update: expected ${expected_dim}, got ${embedding.length}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:468:      // H1 FIX: Mark success only after vector write confirmed
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:551:      if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:552:        bm25Index.getIndex().removeDocument(String(id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:651:            console.warn(`[VectorIndex] Failed to delete vector for memory ${id}: ${get_error_message(vec_error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:672:        console.warn(`[vector-index] Failed to delete memory ${id}: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:699:        if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:700:          const bm25 = bm25Index.getIndex();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:702:            bm25.removeDocument(String(id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:710:    console.warn(`[vector-index] delete_memories transaction error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:732:    console.warn(`[vector-index] Invalid embedding status: ${status}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:745:    console.warn(`[vector-index] Failed to update embedding status for ${id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:762:    console.warn(`[vector-index] Invalid confidence value: ${confidence}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:775:    console.warn(`[vector-index] Failed to update confidence for ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:20:  rankedIntents: RankedIntent[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:282: * @returns Normalized Float32Array embedding vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:295: * Build one centroid vector per intent from seed phrases and keywords.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:297: * @returns Map of intent types to their centroid embedding vectors
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:332: * L2-normalize a vector in place.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:334: * @param vec - Float32Array vector to normalize
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:335: * @returns The same vector, normalized to unit length
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:351: * Dot product similarity for normalized vectors.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:353: * @param a - First vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:354: * @param b - Second vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:355: * @returns Dot product (cosine similarity for unit vectors)
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:386:    .filter((rankedIntent) => rankedIntent.score > 0)
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:411:      rankedIntents: [],
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:465:  const rankedIntents = buildRankedIntents(scores);
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:475:      rankedIntents,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:484:    rankedIntents,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:5:// Split from vector-index-store.ts — contains ALL query/search functions,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:6:// Content extraction, ranking, stats, cleanup, and integrity checks.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:21:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:32:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:33:import { delete_memory_from_database } from './vector-index-mutations.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:39:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:60: * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:158: * Searches indexed memories by vector similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:162: * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:165: * const rows = vector_search(queryEmbedding, { limit: 5, specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:168:export function vector_search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:175:    console.warn('[vector-index] Vector search unavailable - sqlite-vec not loaded');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:325:    console.warn('[vector-index] Multi-concept search unavailable - sqlite-vec not loaded');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:505:    console.warn('[vector-index] extract_tags: invalid content type, expected string');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:557:        console.warn('[vector-index-queries] Date parsing failed', { error: _e instanceof Error ? _e.message : String(_e) });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:592:    console.warn('[vector-index] Empty query provided for embedding');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:601:    console.warn(`[vector-index] Query embedding failed: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:624:    console.warn('[vector-index] keyword_search: invalid query, expected non-empty string');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:630:    console.warn('[vector-index] keyword_search: no valid search terms after tokenization');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:697: * Runs enriched vector search for a text query.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:702: * @throws {VectorIndexError} Propagates vector-store initialization failures from the underlying search pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:705: * const results = await vector_search_enriched('sqlite vec mismatch', 10, { specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:708:export async function vector_search_enriched(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:720:  let search_method = 'vector';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:724:    raw_results = vector_search(query_embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:730:    console.warn('[vector-index] Falling back to keyword search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:747:    const similarity = search_method === 'vector'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:752:      rank: i + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:769:    console.warn(`[vector-index] Enriched search took ${elapsed}ms (target <500ms)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:785: * @throws {VectorIndexError} When concept validation fails or the vector search pipeline cannot execute.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:788: * const results = await multi_concept_search_enriched(['sqlite', 'vector'], 10, { specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:809:        console.warn(`[vector-index] Failed to embed concept: "${concept}"`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:820:    console.warn('[vector-index] Falling back to keyword multi-concept search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:838:      rank: i + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:855:    console.warn(`[vector-index] Multi-concept search took ${elapsed}ms (target <500ms)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:876:    console.warn('[vector-index] multi_concept_keyword_search: empty concepts array');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:919:      rank: i + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:945:    console.warn('[vector-index] parse_quoted_terms: invalid query, expected non-empty string');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:968: * Applies smart ranking weights to enriched results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:969: * @param results - The results to rank.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:970: * @returns The ranked results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:972:export function apply_smart_ranking(results: EnrichedSearchResult[]): EnrichedSearchResult[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1084:    console.warn(`[vector-index] Failed to get related memories for ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1185:    console.warn(`[vector-index] find_cleanup_candidates error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1238:    console.warn(`[vector-index] get_memory_preview query error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1259:    console.warn('[vector-index] get_memory_preview file read warning', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1291: * Verifies vector-index consistency and optional cleanup results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1298:): { totalMemories: number; totalVectors: number; orphanedVectors: number; missingVectors: number; orphanedFiles: Array<{ id: number; file_path: string; reason: string }>; orphanedChunks: number; isConsistent: boolean; cleaned?: { vectors: number; chunks: number } } {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1302:  const find_orphaned_vector_ids = () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1304:      console.warn('[vector-index] find_orphaned_vector_ids: sqlite-vec not available');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1313:      console.warn('[vector-index] Could not query orphaned vectors:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1318:  const orphaned_vector_ids = find_orphaned_vector_ids();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1319:  const orphaned_vectors = orphaned_vector_ids.length;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1321:  let cleaned_vectors = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1322:  if (autoClean && orphaned_vectors > 0 && sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1323:    logger.info(`Auto-cleaning ${orphaned_vectors} orphaned vectors...`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1325:    for (const rowid of orphaned_vector_ids) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1328:        cleaned_vectors++;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1330:        console.warn(`[vector-index] Failed to clean orphaned vector ${rowid}: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1333:    logger.info(`Cleaned ${cleaned_vectors} orphaned vectors`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1338:  const missing_vectors = sqlite_vec
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1347:  const total_vectors = sqlite_vec
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1383:      console.warn('[vector-index] Could not query orphaned chunks:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1409:        console.warn(`[vector-index] Failed to clean orphaned chunk ${chunk.id}: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1419:    totalVectors: total_vectors,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1420:    orphanedVectors: autoClean ? orphaned_vectors - cleaned_vectors : orphaned_vectors,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1421:    missingVectors: missing_vectors,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1424:    isConsistent: (orphaned_vectors - cleaned_vectors) === 0 && missing_vectors === 0 && orphaned_files.length === 0 && effective_orphaned_chunks === 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1425:    cleaned: (autoClean && (cleaned_vectors > 0 || cleaned_chunks > 0))
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1426:      ? { vectors: cleaned_vectors, chunks: cleaned_chunks }
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1437:export { vector_search as vectorSearch };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1446:export { vector_search_enriched as vectorSearchEnriched };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1450:export { apply_smart_ranking as applySmartRanking };
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:71:const MIN_MATCH_THRESHOLD = 0.15;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:90: *   - Parenthetical abbreviations: "Reciprocal Rank Fusion (RRF)" → "RRF"
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:91: *   - Parenthetical definitions: "RRF (Reciprocal Rank Fusion)" → "Reciprocal Rank Fusion"
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:386:   10. QUERY-TIME MATCHING
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:466:      if (overlap >= MIN_MATCH_THRESHOLD) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:478:      if (overlap >= MIN_MATCH_THRESHOLD) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:491:    if (summaryScore >= MIN_MATCH_THRESHOLD) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:502:      if (overlap >= MIN_MATCH_THRESHOLD) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:541:  MIN_MATCH_THRESHOLD,
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:46:  embedding: ['vector', 'representation'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:24:import { fts5Bm25Search } from './sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:110:    const rawResults = fts5Bm25Search(db, query, { limit });
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:7:// Use inside the hybrid-search pipeline after RRF/RSF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:387: * This is a lightweight pre-filter, NOT a replacement for vector search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:8: * assumed normalized [0,1] scores, but raw RRF scores (~0.01-0.03) never exceeded that
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:9: * threshold, causing channel-representation promotion to silently reject ALL RRF results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:11: * compatible with both raw RRF scores and normalized [0,1] scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:77: * @param topK              - Ordered top-k results from RRF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:6:// Extracted from hybrid-search.ts ftsSearch() for independent
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:9:import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:18:  fts_score: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:28:type LexicalPath = 'fts5' | 'like' | 'unavailable';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:33:  | 'no_such_module_fts5'
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:34:  | 'bm25_runtime_failure';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:37:  lexicalPath: LexicalPath;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:84:  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:89:  return message.includes('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:101:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:107:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:114:      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:119:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:126:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:127:        fallbackState: 'no_such_module_fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:131:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:137:    lexicalPath: 'fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:147: * Execute a weighted BM25 FTS5 search against memory_fts.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:149: * Uses SQLite FTS5's built-in bm25() ranking function with
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:150: * per-column weights instead of the default `rank` pseudo-column.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:159: * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:162:function fts5Bm25Search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:170:  const tokens = normalizeLexicalQueryTokens(query).fts;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:197:    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:198:    FROM memory_fts
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:199:    JOIN memory_index m ON m.id = memory_fts.rowid
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:200:    WHERE memory_fts MATCH ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:204:    ORDER BY fts_score DESC
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:211:    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:223:      fts_score: (row.fts_score as number) || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:226:      lexicalPath: 'fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:234:          lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:235:          fallbackState: 'no_such_module_fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:239:            lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:240:            fallbackState: 'bm25_runtime_failure',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:242:        : msg.toLowerCase().includes('no such table: memory_fts')
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:244:              lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:248:              lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:249:              fallbackState: 'bm25_runtime_failure',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:252:    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:258: * Check if the memory_fts FTS5 virtual table exists in the database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:260: * Used as a feature-detect before calling fts5Bm25Search, since FTS5
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:264: * @returns true if memory_fts exists and is queryable
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:268: *   fts5Bm25Search(db, 'memory');
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:282:  fts5Bm25Search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:6:// - vector-index-types.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:7:// - vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:8:// - vector-index-mutations.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:9:// - vector-index-store.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:10:// - vector-index-queries.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:11:// - vector-index-aliases.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:14:export * from './vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:23:  /** Weight for semantic (vector) search component, 0-1 */
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:189:    keywords: ['research', 'investigation', 'analysis', 'findings', 'study', 'evaluation', 'search', 'retrieval', 'pipeline', 'indexing', 'embedding', 'vector', 'semantic'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts:35: * @param a - First ranked row.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts:36: * @param b - Second ranked row.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts:57: * Sort a result set with the deterministic ranking contract.
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:22:// Anchor metadata here keeps Stage 3 (rerank) and Stage 4
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:4:// Split from vector-index-store.ts — contains ALL schema creation,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:18:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:426:/** Current schema version for vector-index migrations. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:595:          CREATE INDEX IF NOT EXISTS idx_fts_fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:599:        logger.info('Migration v7: Created idx_fts_fallback index for deferred indexing');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:601:        console.warn('[VectorIndex] Migration v7 warning (idx_fts_fallback):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:747:        database.exec('DROP TRIGGER IF EXISTS memory_fts_insert');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:748:        database.exec('DROP TRIGGER IF EXISTS memory_fts_update');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:749:        database.exec('DROP TRIGGER IF EXISTS memory_fts_delete');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:751:        database.exec('DROP TABLE IF EXISTS memory_fts');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:753:          CREATE VIRTUAL TABLE memory_fts USING fts5(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:760:          CREATE TRIGGER memory_fts_insert AFTER INSERT ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:761:            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:766:          CREATE TRIGGER memory_fts_update AFTER UPDATE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:767:            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:769:            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:774:          CREATE TRIGGER memory_fts_delete AFTER DELETE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:775:            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:823:          database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1688:      console.warn('[vector-index] Migration: Added confidence column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1700:      console.warn('[vector-index] Migration: Added validation_count column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1712:      console.warn('[vector-index] Migration: Added importance_tier column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1721:      console.warn('[vector-index] Migration: Created idx_importance_tier index');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1732:      console.warn('[vector-index] Migration: Added context_type column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1744:      console.warn('[vector-index] Migration: Added content_hash column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1756:      console.warn('[vector-index] Migration: Added channel column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1768:      console.warn('[vector-index] Migration: Added session_id column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1780:      console.warn('[vector-index] Migration: Added base_importance column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1792:      console.warn('[vector-index] Migration: Added decay_half_life_days column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1804:      console.warn('[vector-index] Migration: Added is_pinned column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1816:      console.warn('[vector-index] Migration: Added last_accessed column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1828:      console.warn('[vector-index] Migration: Added expires_at column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1840:      console.warn('[vector-index] Migration: Added related_memories column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1852:      console.warn('[vector-index] Migration: Added stability column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1864:      console.warn('[vector-index] Migration: Added difficulty column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1876:      console.warn('[vector-index] Migration: Added last_review column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1888:      console.warn('[vector-index] Migration: Added review_count column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1910:      console.warn('[vector-index] Migration: Added canonical_file_path column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1929:    console.warn('[vector-index] Canonical path index warning:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1996: * Creates common indexes used by vector-index queries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2005:    console.warn('[vector-index] Failed to create index', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2022:    console.warn('[vector-index] Failed to create canonical path indexes', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2039:    console.warn('[vector-index] Failed to create index', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2050:    console.warn('[vector-index] Failed to create index', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2061:    console.warn('[vector-index] Failed to create index', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2079:    console.warn('[vector-index] Failed to create idx_trigger_cache_source', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2090:    console.warn('[vector-index] Failed to create idx_spec_folder_created_at', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2103:      console.warn('[vector-index] Failed to create idx_history_timestamp:', get_error_message(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2259: * Creates or upgrades the vector-index schema.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2384:    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2392:    CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2393:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2399:    CREATE TRIGGER IF NOT EXISTS memory_fts_update AFTER UPDATE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2400:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2402:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2408:    CREATE TRIGGER IF NOT EXISTS memory_fts_delete AFTER DELETE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2409:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2479:  console.warn('[vector-index] Schema created successfully');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:50:  rerank: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:133:  rerank,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:162:    rerank,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:15://     - results are scored by Stage 2, reranked by Stage 3, filtered by Stage 4
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:35:import { executeStage3 } from './stage3-rerank.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:51: * Stage 3: Rerank + Aggregate — falls back to unranked scored results
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:57:export async function executePipeline(config: PipelineConfig): Promise<PipelineResult> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:113:  // -- Stage 3: Rerank + Aggregate (falls back to unranked scored results) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:123:      'Stage 3: Rerank',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:128:    console.warn(`[pipeline] Stage 3 failed, returning unranked results: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:131:      reranked: stage2Result.scored,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:133:        rerankApplied: false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:152:        results: stage3Result.reranked as Stage4ReadonlyRow[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:165:      final: stage3Result.reranked as Stage4ReadonlyRow[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:11://     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:29:// 4.  Intent weights          — non-hybrid search post-scoring adjustment
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:37:// Internally (RRF / RSF fusion). Post-search intent weighting is
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:38:// Therefore ONLY applied for non-hybrid search types (vector,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:39:// Multi-concept). Applying it to hybrid results would double-count.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:42:// Stage 3 (rerank) MAY overwrite `score` with the reranked value and MUST
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:45:// The canonical reranker output is `rerankerScore`; `score` is synced to it
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:64:import { ensureAdaptiveTables, getAdaptiveMode } from '../../cognitive/adaptive-ranking.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:79:import { shadowScore, extractFeatureVector, loadModel } from '@spec-kit/shared/ranking/learned-combiner';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:80:import type { LearnedModel } from '@spec-kit/shared/ranking/learned-combiner';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:90:import { computeUsageBoost } from '../../graph/usage-ranking-signal.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:93:import { sortDeterministicRows } from './ranking-contract.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:223: * in ranking while preserving score stability.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:264: * intentAdjustedScore → rrfScore → score → similarity/100, all clamped to [0,1].
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:275:    rrfScore: clamped,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:278:    // must not be overwritten with the fusion/ranking score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:288:    row.rrfScore = clamped;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:291:    // must not be overwritten with the fusion/ranking score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:592: * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:593: * Hybrid search (RRF / RSF) already incorporates intent-weighted signals
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:594: * during fusion. Calling this on hybrid results would double-count intent.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:654: * current composite score (`score`, then `rrfScore`, then `similarity`).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:835:    console.warn(`[stage2-fusion] usage ranking failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:930: *   1.  Session boost      (hybrid only — working memory attention)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:932: *   2.  Causal boost       (hybrid only — graph-traversal amplification)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:937: *   4.  Intent weights     (non-hybrid only — G2 prevention)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:975:  const isHybrid = config.searchType === 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:978:  // Only for hybrid search type — session attention signals are most meaningful
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:979:  // When the full hybrid result set is available for ordering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:988:      // so rrfScore/intentAdjustedScore are not stale for subsequent steps.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1000:  // Uses computeRecencyScore (already imported but previously unused in hybrid path).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1031:  // Only for hybrid search type — causal graph traversal is seeded from the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1057:  // Appear in the co-activation graph. Matches V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1085:          // Are promoted to their correct position in the ranking
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1091:      // Non-critical enrichment — co-activation failure does not affect core ranking
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1173:  // -- 2d. Usage-weighted ranking (Phase D T034) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1180:      console.warn(`[stage2-fusion] usage ranking skipped (db unavailable): ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1210:  // G2 PREVENTION: Only apply for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1211:  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1258:  // REQ-D1-006: Runs the learned linear ranker in parallel with the manual combiner.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1259:  // Shadow-only — scores are logged for comparison but never affect live ranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1266:          rrfScore: row.rrfScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1299:  // Overall pipeline limit. Apply it here so Stage 3 reranks a pre-trimmed set.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:16:   * Higher = better lexical match. Not directly comparable to vector similarity
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:17:   * scores; use min-max normalization or RRF when combining with other methods.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:51: * These weights are consumed by the FTS5 path in sqlite-fts.ts,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:323:    const queryTokens = normalizeLexicalQueryTokens(query).bm25;
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:415:      console.warn(`[bm25-index] Failed to sync BM25 rows: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:465:      console.warn(`[bm25-index] Failed to schedule BM25 warmup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:530: * @returns Sanitized query tokens safe to reuse for lexical search paths.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:533: * sanitizeQueryTokens('title:memory AND vector');
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:534: * // ['title', 'memory', 'vector']
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:561:  fts: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:562:  bm25: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:573:    fts: [...sharedTokens, ...phraseToken],
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:574:    bm25: sharedTokens
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:4:// Feature catalog: Unified graph retrieval, deterministic ranking, explainability, and rollback
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:7:import { sanitizeFTS5Query } from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:35:/** Edge type weights for typed-degree computation (R4 5th RRF channel) */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:61:let ftsTableAvailabilityPerDb = new WeakMap<Database.Database, boolean>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:70:  const cached = ftsTableAvailabilityPerDb.get(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:77:      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:80:    ftsTableAvailabilityPerDb.set(database, available);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:83:    ftsTableAvailabilityPerDb.set(database, false);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:91: * Uses FTS5 full-text search (memory_fts table) instead of naive LIKE matching.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:150: * FTS5-backed causal edge query. Finds memory IDs via the memory_fts
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:165:  // 1) Materialize matched memory rowids once (no OR join against memory_fts)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:167:  // 3) Collapse duplicate edge hits in SQL (MAX fts_score per edge)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:172:        -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:173:      FROM memory_fts
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:174:      WHERE memory_fts MATCH ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:175:      ORDER BY fts_score DESC
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:179:      SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength, mm.fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:183:      SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength, mm.fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:194:        MAX(fts_score) AS fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:198:    SELECT id, source_id, target_id, relation, strength, fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:200:    ORDER BY (strength * fts_score) DESC
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:206:  ) as Array<CausalEdgeRow & { fts_score: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:209:  // Numeric IDs matching memory_index.id (INTEGER column) in the hybrid search
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:210:  // Pipeline (MMR reranking filters with typeof id === 'number').
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:216:    const ftsScore = typeof row.fts_score === 'number' && Number.isFinite(row.fts_score)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:217:      ? row.fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:219:    const score = edgeStrength * ftsScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:228:        ftsScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:243:        ftsScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:634:  ftsTableAvailabilityPerDb = new WeakMap<Database.Database, boolean>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:640:  ftsTableAvailabilityPerDb.delete(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:691:  // Typed-degree computation (R4 5th RRF channel)
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:206: * The "score" used for tie-breaking is resolved from `score`, `rrfScore`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:210: * @returns Merged, deduplicated, coverage-ranked result array.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:212:export function mergeByFacetCoverage<T extends { id: number; score?: number; rrfScore?: number; similarity?: number }>(
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:266:function resolveItemScore(item: { score?: number; rrfScore?: number; similarity?: number }): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:269:  if (typeof item.rrfScore === 'number' && Number.isFinite(item.rrfScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:270:    return Math.max(0, Math.min(1, item.rrfScore));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:5:// Split from vector-index-store.ts — contains LRUCache, query caching,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:6:// Learning from selections, and enhanced search with ranking+diversity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:13:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:17:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:19:  vector_search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:20:  vector_search_enriched,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:21:  apply_smart_ranking,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:24:} from './vector-index-queries.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:27:  rank: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:199:// Cached version of vector_search_enriched with LRU cache
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:219:  const results = await vector_search_enriched(query, limit, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:276:    console.warn(`[vector-index] learn_from_selection query error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:318:    console.warn(`[vector-index] learn_from_selection update error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:342:      console.warn(`[vector-index] Could not generate embedding for memory ${new_memory_id}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:346:    const similar = vector_search(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:365:    console.warn(`[vector-index] Failed to link related memories for ${new_memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:389:    console.warn(`[vector-index] Failed to record access for memory ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:399: * Runs enriched search with smart ranking and diversity controls.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:403: * @returns The ranked search results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:415:  const results = await vector_search_enriched(query, fetch_limit, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:420:  const ranked = apply_smart_ranking(results);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:423:  const diverse = options.noDiversity ? ranked : apply_diversity(ranked, diversity_factor);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:429:    console.warn(`[vector-index] Enhanced search took ${elapsed}ms (target <600ms)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:7:// This stage avoids downstream fusion/reranking, but may apply temporal
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:8:// Contiguity to raw vector-channel hits before later pipeline stages.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:14://   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:16://   - hybrid: collectRawCandidates → falls back to vector on failure
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:17://   - vector: Direct vectorSearch
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:28://     - candidates contains raw channel scores; vector hits may include an
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:34://     - Reads from the vector index and FTS5 / BM25 index (DB reads only)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:38:import * as vectorIndex from '../vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:40:import * as hybridSearch from '../hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:41:import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:79:/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:459: * and `config.mode`, then applies vector-channel temporal contiguity when
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:463: * This stage does not apply Stage 2 fusion/reranking signals. Vector-channel
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508:  // the query for the hybrid search channel, improving recall for alias-rich
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:513:  /** Effective query for hybrid search — may be expanded by concept routing. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:516:  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:594:    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:604:  else if (searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:613:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616:    // Deep mode: expand query into variants and run hybrid for each, then dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:621:      // sub-query facets and run hybrid search per facet. Results are merged
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:622:      // by facet coverage (items appearing in multiple facets rank higher).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:654:            // Run hybrid for the original query plus each facet, in parallel
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:666:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:729:                const variantResults = await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:759:            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:761:          // Fall through to single hybrid search below
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:763:          candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:770:        // ExpandQuery returned only the original; treat as standard hybrid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:772:        candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:811:              hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:828:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:864:            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:869:      // Standard hybrid search — runs when R12 is off, suppressed by R15,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:875:          const hybridResults = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:880:          candidates = hybridResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:881:        } catch (hybridErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:882:          const hybridMsg =
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:883:            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:885:            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:888:          // Fallback: pure vector search
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:890:          let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:899:            vectorResults = (
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:900:              vectorSearchWithContiguity(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:901:                vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:904:            ) ?? vectorResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:906:          candidates = vectorResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:910:              reason: hybridMsg,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:911:              channel: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:921:  else if (searchType === 'vector') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:926:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for vector search query');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:930:    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:939:      vectorResults = (
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:940:        vectorSearchWithContiguity(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:941:          vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:944:      ) ?? vectorResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:946:    candidates = vectorResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:953:      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:961:  // Exception: for hybrid search, tier/contextType are applied here because
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:963:  // For vector search, tier/contextType were already passed to vectorSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1011:  // In the current candidate set, fetch them separately via vector search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1012:  // They enter the pipeline here so all subsequent stages (scoring, reranking)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1031:        const constitutionalResults = vectorIndex.vectorSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1048:        // via vector search bypass the earlier governance/context gate.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1082:  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1088:  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1109:              return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1169:  //   - Run a vector-only search with the pseudo-document embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1176:  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1298:  // a surrogate match above MIN_MATCH_THRESHOLD receive a score boost (additive,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1299:  // capped at 0.15) to improve ranking for vocabulary-mismatched queries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1335:              // raw row.score. For vector-only rows with only `similarity`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1345:                rrfScore: boostedScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1391:  // P1 fix: activeChannels counts actual retrieval channels (vector, keyword/BM25),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1392:  // while channelCount counts parallel query variants. In hybrid mode both vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1394:  const activeChannels = searchType === 'hybrid' ? 2 : 1;
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:104:  'vector': 'embedding',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:105:  'vectors': 'embedding',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:141:  // Search quality / ranking domain (Phase B T015)
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:144:  'ranking': 'search',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:171: * nounPhrases('How does vector search indexing work?');
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:172: * // ['vector', 'search', 'indexing', 'work']
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-types.ts:5: * Function signature for graph-based lexical search helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:6:// PURPOSE: Combine margin, multi-channel agreement, reranker support,
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:24:// IMPORTANT: This module only models ranking confidence for retrieval ordering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:28:declare const rankingConfidenceBrand: unique symbol;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:54: * Branded ranking score for retrieval ordering only.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:59:  readonly [rankingConfidenceBrand]: 'RankingConfidenceValue';
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:69:  | 'reranker_boost'
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:103:  /** RRF fusion score (0–1). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:104:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:109:  /** Reranker cross-encoder score if available. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:110:  rerankerScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:111:  /** Explicit reranker application marker from the pipeline. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:112:  rerankerApplied?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:113:  /** Score origin metadata for distinguishing real reranks from fallbacks. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:177:function hasRerankerSignal(result: ScoredResult): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:178:  const hasFiniteRerankerScore = typeof result.rerankerScore === 'number' && Number.isFinite(result.rerankerScore);
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:179:  if (!hasFiniteRerankerScore) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:181:  if (result.rerankerApplied === true) return true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:212: * Compute per-result confidence for a ranked list of results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:217: *   - Presence of a reranker score (20%)
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:235:    const hasReranker = hasRerankerSignal(result);
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:250:    const rerankerFactor = hasReranker ? 1.0 : 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:258:      WEIGHT_RERANKER * rerankerFactor +
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:270:    if (hasReranker) drivers.push('reranker_boost');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:16://     - No score field (similarity, score, rrfScore, intentAdjustedScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:207: * A1 FIX: Previously used a different precedence order (rrfScore first) and
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts:12:export { executePipeline } from './orchestrator.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:2:// MODULE: Stage3 Rerank
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:7:// 1. Cross-encoder reranking   — re-scores results via neural model
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:12:// MPAB MUST remain AFTER RRF fusion (Stage 2).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:17:// Output: Stage3Output { reranked: PipelineRow[], metadata }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:19://     - reranked is sorted descending by effective score after all steps
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:31:import { rerankLocal } from '../local-reranker.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:32:import { isCrossEncoderEnabled, isMMREnabled, isLocalRerankerEnabled } from '../search-flags.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:34:import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:35:import type { MMRCandidate } from '@spec-kit/shared/algorithms/mmr-reranker';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:41:import { compareDeterministicRows, sortDeterministicRows } from './ranking-contract.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:62: * Enforce non-negative score outputs at Stage 3 rerank boundaries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:68:function resolveRerankOutputScore(raw: unknown, fallback: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:78: * Document format consumed by the cross-encoder reranker.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:79: * Matches the RerankDocument interface in cross-encoder.ts:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:82:interface RerankDocument {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:116:type RerankProvider = 'cross-encoder' | 'local-gguf' | 'fallback-sort' | 'none';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:121: * Execute Stage 3: Rerank + Aggregate.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:123: * Applies cross-encoder reranking (if enabled) and then collapses
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:130: * @returns Stage 3 output with reranked, aggregated results and metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:137:  let rerankApplied = false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:138:  let rerankProvider: RerankProvider = 'none';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:140:  // -- Step 1: Cross-encoder reranking ---------------------------
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:141:  const rerankStart = Date.now();
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:142:  const beforeRerank = results.length;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:146:  const rerankResult = await applyCrossEncoderReranking(config.query, results, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:147:    rerank: config.rerank,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:151:  results = rerankResult.rows;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:152:  rerankApplied = rerankResult.applied;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:153:  rerankProvider = rerankResult.provider;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:158:      'rerank',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:159:      beforeRerank,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:161:      Date.now() - rerankStart,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:162:      { rerankApplied, provider: rerankProvider }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:169:  // The result set, matching the V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:214:          // rows (lexical-only hits, graph injections) must be preserved and merged
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:242:      console.warn(`[stage3-rerank] MMR diversity pruning failed: ${toErrorMessage(mmrErr)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:248:  // MPAB must remain AFTER RRF (Stage 2 constraint). This step runs
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:261:      'final-rank',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:275:    rerankApplied,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:276:    rerankProvider,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:282:    reranked: results,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:287:// -- Internal: Cross-Encoder Reranking -------------------------
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:290: * Apply cross-encoder reranking to a list of pipeline results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:293: *   - The `rerank` option is not set
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:297: * On any reranker error, logs a warning and returns the original
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:302: * @param options     - Rerank configuration flags.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:303: * @returns Object with reranked rows, whether reranking was applied, and the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:304: * reranker path that executed.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:306:async function applyCrossEncoderReranking(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:310:    rerank: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:314:): Promise<{ rows: PipelineRow[]; applied: boolean; provider: RerankProvider }> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:316:  if (!options.rerank || !isCrossEncoderEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:326:  // After reranking (the cross-encoder only knows about id + text + score).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:332:  // Local GGUF reranker path (P1-5): RERANKER_LOCAL=true
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:333:  // On any failure/unavailable precondition, rerankLocal returns original rows unchanged.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:334:  if (isLocalRerankerEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:336:      const localReranked = await rerankLocal(query, results, options.limit);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:337:      if (localReranked === results) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:341:      const localRows: PipelineRow[] = localReranked.map((row) => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:343:        const rerankScoreRaw = row.rerankerScore ?? row.score;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:344:        const rerankScore = resolveRerankOutputScore(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:345:          rerankScoreRaw,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:353:          score: rerankScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:355:          rerankerScore: rerankScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:356:          // F2.02 fix: Sync all score aliases for local reranker path too.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:357:          rrfScore: rerankScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:358:          intentAdjustedScore: rerankScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:366:        `[stage3-rerank] Local reranking failed: ${toErrorMessage(err)} — returning original results`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:372:  // Map PipelineRow → RerankDocument (uses `content` field per cross-encoder interface)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:374:  const documents: RerankDocument[] = results.map((row) => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:381:    // Cast through unknown: our local RerankDocument is structurally equivalent to
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:382:    // The cross-encoder module's internal RerankDocument but declared separately.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:383:    const reranked = await crossEncoder.rerankResults(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:385:      documents as unknown as Parameters<typeof crossEncoder.rerankResults>[1],
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:393:    const rerankProvider: RerankProvider = reranked.some(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:399:    // Re-map reranked results back to PipelineRow, preserving all original
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:400:    // Fields and updating only the score-related values from the reranker.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:401:    const rerankedRows: PipelineRow[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:402:    for (const rerankResult of reranked) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:403:      const original = rowMap.get(rerankResult.id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:405:        // Defensive: reranker returned an unknown id — skip it
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:408:      const rerankScore = resolveRerankOutputScore(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:409:        rerankResult.rerankerScore ?? rerankResult.score,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:412:      rerankedRows.push({
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:416:        score: rerankScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:418:        rerankerScore: rerankScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:420:        // the reranked value instead of stale Stage 2 values.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:421:        rrfScore: rerankScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:422:        intentAdjustedScore: rerankScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:427:    return { rows: rerankedRows, applied: true, provider: rerankProvider };
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:429:    // Graceful degradation — return original results on any reranker failure
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:431:      `[stage3-rerank] Cross-encoder reranking failed: ${toErrorMessage(err)} — returning original results`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:442: * This value is placed into the `content` field of the RerankDocument sent
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:473: * RRF fusion (Stage 2). It is intentionally placed in Stage 3.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:475: * @param results - Scored pipeline rows from (optionally reranked) Stage 3.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:577: * and rrfScore before raw score/similarity, matching Stage 2's
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:649:      rrfScore: parentScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:666:      `[stage3-rerank] MPAB DB reassembly failed for parent ${parentId}: ${toErrorMessage(err)} — using chunk fallback`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:693:    rrfScore: parentScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:716:  applyCrossEncoderReranking,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:42:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:61: * function uses the correct chain: intentAdjustedScore → rrfScore → score → similarity/100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:67:  if (typeof row.rrfScore === 'number' && Number.isFinite(row.rrfScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:68:    return Math.max(0, Math.min(1, row.rrfScore));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:82:  'similarity' | 'score' | 'importance_weight' | 'rrfScore' | 'intentAdjustedScore' | 'attentionScore'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:122:  searchType: 'hybrid' | 'vector' | 'multi-concept';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:144:  rerank: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:206:    /** Actual retrieval channels active (vector=1, hybrid=2). Unlike channelCount which tracks query variants. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:224: * Single point for ALL scoring signals: RRF/RSF, causal boost, co-activation,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:260: * Stage 3: Rerank + Aggregate
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:261: * Cross-encoder reranking, MMR diversity enforcement, MPAB chunk-to-memory aggregation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:270: * Stage 3 output containing reranked rows and reranking metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:273:  reranked: PipelineRow[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:275:    rerankApplied: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:352: * Executor signature for Stage 3 reranking and aggregation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:371:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:385:    rrfScore: r.rrfScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:419:    if (row.rrfScore !== snap.rrfScore) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:421:        `[Stage4Invariant] Score mutation detected: id=${snap.id} rrfScore changed from ${snap.rrfScore} to ${row.rrfScore}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:7:// Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:75: * Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:13:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:20:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:38:} from './vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:56:} from './vector-index-mutations.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:63:  vector_search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:72:  vector_search_enriched,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:76:  apply_smart_ranking,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:88:  vectorSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:97:  vectorSearchEnriched,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:108:} from './vector-index-queries.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:126:} from './vector-index-aliases.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:154:  is_vector_search_available,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:161:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:165:  isVectorSearchAvailable as is_vector_search_available_alias,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:166:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:4:// Feature catalog: Local GGUF reranker via node-llama-cpp
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:6:// Neural reranking via external APIs (Voyage rerank-2, Cohere
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:7:// Rerank-english-v3.0) or a local cross-encoder model
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:15:// Providers invoke real ML-based reranking — either cloud APIs
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:16:// That run neural rerankers server-side (Voyage, Cohere) or a
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:38:    model: 'rerank-2',
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:39:    endpoint: 'https://api.voyageai.com/v1/rerank',
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:46:    model: 'rerank-english-v3.0',
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:47:    endpoint: 'https://api.cohere.ai/v1/rerank',
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:55:    endpoint: 'http://localhost:8765/rerank',
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:73:interface RerankDocument {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:80:interface RerankApiResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:85:interface RerankResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:89:  rerankerScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:93:   *   'cross-encoder' — score from a neural reranker (Voyage / Cohere API or local model)
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:100:interface RerankerStatus {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:115:const cache = new Map<string, { results: RerankResult[]; timestamp: number }>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:142:// Rerank APIs (Voyage, Cohere) are down. After FAILURE_THRESHOLD consecutive
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:219:  results: RerankResult[]
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:220:): RerankResult[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:225:      const rerankerScore = r.rerankerScore * penalty;
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:228:        rerankerScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:229:        score: rerankerScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:258:  return `rerank-${Math.abs(hash).toString(36)}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:265:async function rerankVoyage(
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:267:  documents: RerankDocument[]
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:268:): Promise<RerankResult[]> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:273:  // P3-13: Build map of document ID → input position (pre-rerank rank)
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:292:    throw new Error(`Voyage rerank failed: ${response.status} ${response.statusText}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:295:  const data = await response.json() as { data: RerankApiResult[] };
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:297:  return data.data.map((item: RerankApiResult) => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:299:    rerankerScore: item.relevance_score,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:304:  })).sort((a: RerankResult, b: RerankResult) => b.rerankerScore - a.rerankerScore);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:307:async function rerankCohere(
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:309:  documents: RerankDocument[]
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:310:): Promise<RerankResult[]> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:315:  // P3-13: Build map of document ID → input position (pre-rerank rank)
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:334:    throw new Error(`Cohere rerank failed: ${response.status} ${response.statusText}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:337:  const data = await response.json() as { results: RerankApiResult[] };
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:339:  return data.results.map((item: RerankApiResult) => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:341:    rerankerScore: item.relevance_score,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:346:  })).sort((a: RerankResult, b: RerankResult) => b.rerankerScore - a.rerankerScore);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:349:async function rerankLocal(
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:351:  documents: RerankDocument[]
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:352:): Promise<RerankResult[]> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:355:  // P3-13: Build map of document ID → input position (pre-rerank rank)
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:370:    throw new Error(`Local rerank failed: ${response.status} ${response.statusText}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:373:  const data = await response.json() as { results: RerankApiResult[] };
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:375:  return data.results.map((item: RerankApiResult) => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:377:    rerankerScore: item.relevance_score,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:382:  })).sort((a: RerankResult, b: RerankResult) => b.rerankerScore - a.rerankerScore);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:389:async function rerankResults(
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:391:  documents: RerankDocument[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:393:): Promise<RerankResult[]> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:400:    // No reranker available — P3-16: use 'fallback' scoringMethod and distinct score range
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:403:      rerankerScore: 0.5 - (i / (documents.length * 2)),
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:416:      rerankerScore: 0.5 - (i / (documents.length * 2)),
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:437:    let results: RerankResult[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:441:        results = await rerankVoyage(query, documents);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:444:        results = await rerankCohere(query, documents);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:447:        results = await rerankLocal(query, documents);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:478:    console.warn(`[cross-encoder] Reranking failed (${provider}): ${msg} — falling back to positional scoring`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:482:      rerankerScore: 0.5 - (i / (documents.length * 2)),
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:495:function isRerankerAvailable(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499:function getRerankerStatus(): RerankerStatus {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:549:  // Reranking
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:550:  rerankVoyage,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551:  rerankCohere,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:552:  rerankLocal,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:553:  rerankResults,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:556:  isRerankerAvailable,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:557:  getRerankerStatus,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:563:  RerankDocument,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:564:  RerankResult,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:565:  RerankerStatus,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:103:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:147: * connected to top-ranked results via causal edges.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:356: * Resolve the primary numeric score from a result, checking score, rrfScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:361:  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore)) return result.rrfScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:376:    rrfScore: score,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:519: * Apply causal graph boost to ranked search results, injecting
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:639:      rrfScore: score,

codex
The search surface split is clear now: Engram stays deliberately lexical with a few deterministic shortcuts, while Public has a much heavier multi-channel ranking stack. I’m drilling into the exact ranking functions next so the comparison lands on concrete mechanics like topic-key bypasses, FTS sanitization, BM25 weighting, RRF fusion, and reranking instead of vague “simple vs advanced” claims.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '940,1088p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1460,1568p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1610,1715p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3380,3418p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '448,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   448	 * @returns Array of FTS-scored results tagged with source 'fts'.
   449	 */
   450	function ftsSearch(
   451	  query: string,
   452	  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
   453	): HybridSearchResult[] {
   454	  if (!db || !isFtsAvailable()) {
   455	    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
   456	    return [];
   457	  }
   458	
   459	  const { limit = DEFAULT_LIMIT, specFolder, includeArchived = false } = options;
   460	
   461	  try {
   462	    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
   463	    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
   464	    // (title 10x, trigger_phrases 5x, file_path 2x, content 1x)
   465	    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
   466	    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
   467	
   468	    return bm25Results.map(row => ({
   469	      ...row,
   470	      id: row.id as number,
   471	      score: row.fts_score || 0,
   472	      source: 'fts',
   473	    }));
   474	  } catch (error: unknown) {
   475	    const msg = error instanceof Error ? error.message : String(error);
   476	    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
   477	    return [];
   478	  }
   479	}
   480	
   481	// 10. COMBINED LEXICAL SEARCH
   482	
   483	/**
   484	 * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
   485	 * @param query - The search query string.
   486	 * @param options - Optional limit, specFolder filter, and includeArchived flag.
   487	 * @returns Deduplicated array of merged results sorted by score descending.
   488	 */
   489	function combinedLexicalSearch(
   490	  query: string,
   491	  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
   492	): HybridSearchResult[] {
   493	  const ftsResults = ftsSearch(query, options);
   494	  const bm25Results = bm25Search(query, options);
   495	
   496	  // Merge by canonical ID, prefer FTS scores.
   497	  // CanonicalResultId() prevents duplicate rows when one channel emits
   498	  // Numeric IDs (42) and another emits string IDs ("42" or "mem:42").
   499	  const merged = new Map<string, HybridSearchResult>();
   500	
   501	  for (const r of ftsResults) {
   502	    merged.set(canonicalResultId(r.id), r);
   503	  }
   504	
   505	  for (const r of bm25Results) {
   506	    const canonicalId = canonicalResultId(r.id);
   507	    if (!merged.has(canonicalId)) {
   508	      merged.set(canonicalId, r);
   509	    }
   510	  }
   511	
   512	  return Array.from(merged.values())
   513	    .sort((a, b) => b.score - a.score)
   514	    .slice(0, options.limit || DEFAULT_LIMIT);
   515	}
   516	
   517	type RawChannelList = {
   518	  source: string;
   519	  results: Array<{ id: number | string; [key: string]: unknown }>;
   520	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1048,1120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1048	        adjustedBudget: budgetResult.budget,
  1049	      };
  1050	    }
  1051	
  1052	    // Channel results collected independently, merged after all complete
  1053	    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
  1054	    let ftsChannelResults: HybridSearchResult[] = [];
  1055	    let bm25ChannelResults: HybridSearchResult[] = [];
  1056	    const vectorEmbeddingCache = new Map<number, Float32Array>();
  1057	
  1058	    // All channels use synchronous better-sqlite3; sequential execution
  1059	    // Is correct — Promise.all adds overhead without parallelism.
  1060	
  1061	    // Vector channel — gated by query-complexity routing
  1062	    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
  1063	      try {
  1064	        const vectorResults = vectorSearchFn(embedding, {
  1065	          limit: options.limit || DEFAULT_LIMIT,
  1066	          specFolder: options.specFolder,
  1067	          minSimilarity: options.minSimilarity || 0,
  1068	          includeConstitutional: false,
  1069	          includeArchived: options.includeArchived || false,
  1070	          includeEmbeddings: true,
  1071	        });
  1072	        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
  1073	          ...r,
  1074	          id: r.id as number | string,
  1075	          source: 'vector',
  1076	        }));
  1077	        for (const result of semanticResults) {
  1078	          if (typeof result.id !== 'number') continue;
  1079	          const embeddingCandidate = toEmbeddingBufferView(
  1080	            (result as Record<string, unknown>).embedding
  1081	            ?? (result as Record<string, unknown>).embeddingBuffer
  1082	          );
  1083	          if (embeddingCandidate) {
  1084	            vectorEmbeddingCache.set(result.id, embeddingCandidate);
  1085	          }
  1086	        }
  1087	        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
  1088	      } catch (_err: unknown) {
  1089	        // Non-critical — vector channel failure does not block pipeline
  1090	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1091	      }
  1092	    }
  1093	
  1094	    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
  1095	    if (activeChannels.has('fts')) {
  1096	      ftsChannelResults = ftsSearch(query, options);
  1097	      if (ftsChannelResults.length > 0) {
  1098	        // FTS weight reduced to 0.3 after ablation showed 0.8 was harmful,
  1099	        // flooding top-K with noisy lexical matches despite its exact-match value.
  1100	        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
  1101	      }
  1102	    }
  1103	
  1104	    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
  1105	    if (activeChannels.has('bm25')) {
  1106	      bm25ChannelResults = bm25Search(query, options);
  1107	      if (bm25ChannelResults.length > 0) {
  1108	        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
  1109	        // Has less precise scoring than SQLite FTS5 BM25; kept for coverage breadth.
  1110	        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
  1111	      }
  1112	    }
  1113	
  1114	    // Graph channel — gated by query-complexity routing
  1115	    const useGraph = (options.useGraph !== false) && activeChannels.has('graph');
  1116	    if (useGraph && graphSearchFn) {
  1117	      try {
  1118	        graphMetrics.totalQueries++; // counted only if channel executes
  1119	        const graphResults = graphSearchFn(query, {
  1120	          limit: options.limit || DEFAULT_LIMIT,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1218,1470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1218	      if (sources.size === 1 && sources.has('graph')) graphMetrics.graphOnlyResults++;
  1219	    }
  1220	
  1221	    // C138/T315: Build weighted fusion lists once from lightweight adaptive
  1222	    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
  1223	    const intent = options.intent || classifyIntent(query).intent;
  1224	    const adaptiveEnabled = isAdaptiveFusionEnabled();
  1225	    const fusionWeights = adaptiveEnabled
  1226	      ? getAdaptiveWeights(intent)
  1227	      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
  1228	    const { semanticWeight, keywordWeight, graphWeight: adaptiveGraphWeight } = fusionWeights;
  1229	    const keywordFusionResults = keywordResults.map((result) => ({
  1230	      ...result,
  1231	      source: 'keyword',
  1232	    }));
  1233	    const fusionLists = lists
  1234	      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
  1235	      .map((list) => {
  1236	        if (list.source === 'vector') {
  1237	          return { ...list, weight: semanticWeight };
  1238	        }
  1239	        if (list.source === 'graph' && typeof adaptiveGraphWeight === 'number') {
  1240	          return { ...list, weight: adaptiveGraphWeight };
  1241	        }
  1242	        return { ...list };
  1243	      });
  1244	
  1245	    if (keywordFusionResults.length > 0 && keywordWeight > 0) {
  1246	      fusionLists.push({
  1247	        source: 'keyword',
  1248	        results: keywordFusionResults,
  1249	        weight: keywordWeight,
  1250	      });
  1251	    }
  1252	
  1253	    const fused = fuseResultsMulti(fusionLists);
  1254	
  1255	    const fusedResults = fused.map(toHybridResult).map((row) => {
  1256	      const rowRecord = row as Record<string, unknown>;
  1257	      if (rowRecord.parentMemoryId !== undefined) return row;
  1258	      const normalizedParentMemoryId = rowRecord.parent_id ?? rowRecord.parentId;
  1259	      if (normalizedParentMemoryId === undefined) return row;
  1260	      return {
  1261	        ...row,
  1262	        parentMemoryId: normalizedParentMemoryId,
  1263	      };
  1264	    });
  1265	
  1266	    return {
  1267	      evaluationMode,
  1268	      intent,
  1269	      lists,
  1270	      routeResult,
  1271	      budgetResult,
  1272	      s3meta,
  1273	      vectorEmbeddingCache,
  1274	      fusedResults,
  1275	    };
  1276	  } catch (error: unknown) {
  1277	    const msg = error instanceof Error ? error.message : String(error);
  1278	    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
  1279	    return null;
  1280	  }
  1281	}
  1282	
  1283	async function enrichFusedResults(
  1284	  query: string,
  1285	  execution: HybridFusionExecution,
  1286	  options: HybridSearchOptions = {},
  1287	  initialResults: HybridSearchResult[] = execution.fusedResults
  1288	): Promise<HybridSearchResult[]> {
  1289	  const {
  1290	    evaluationMode,
  1291	    intent,
  1292	    lists,
  1293	    routeResult,
  1294	    budgetResult,
  1295	    s3meta,
  1296	    vectorEmbeddingCache,
  1297	  } = execution;
  1298	  let fusedHybridResults = initialResults;
  1299	  const limit = options.limit || DEFAULT_LIMIT;
  1300	
  1301	  // -- Aggregation stage: MPAB chunk-to-memory aggregation (after fusion, before state filter) --
  1302	  // When enabled, collapses chunk-level results back to their parent memory
  1303	  // Documents using MPAB scoring (sMax + 0.3 * sum(remaining) / sqrt(N)). This prevents
  1304	  // Multiple chunks from the same document dominating the result list.
  1305	  // MINOR-1 fix: isMpabEnabled() and isDocscoreAggregationEnabled() check the same env var
  1306	  if (isDocscoreAggregationEnabled()) {
  1307	    try {
  1308	      const chunkResults = fusedHybridResults.filter(
  1309	        r => (r as Record<string, unknown>).parentMemoryId != null && (r as Record<string, unknown>).chunkIndex != null
  1310	      );
  1311	      if (chunkResults.length > 0) {
  1312	        const nonChunkResults = fusedHybridResults.filter(
  1313	          r => (r as Record<string, unknown>).parentMemoryId == null || (r as Record<string, unknown>).chunkIndex == null
  1314	        );
  1315	        const collapsed = collapseAndReassembleChunkResults(
  1316	          chunkResults.map(r => ({
  1317	            id: r.id,
  1318	            parentMemoryId: (r as Record<string, unknown>).parentMemoryId as number | string,
  1319	            chunkIndex: (r as Record<string, unknown>).chunkIndex as number,
  1320	            score: r.score,
  1321	          }))
  1322	        );
  1323	        // Merge collapsed chunk results with non-chunk results
  1324	        fusedHybridResults = [
  1325	          ...collapsed.map(c => ({
  1326	            id: c.parentMemoryId,
  1327	            score: c.mpabScore,
  1328	            source: 'mpab' as string,
  1329	            _chunkHits: c._chunkHits,
  1330	          } as HybridSearchResult)),
  1331	          ...nonChunkResults,
  1332	        ];
  1333	      }
  1334	    } catch (_mpabErr: unknown) {
  1335	      // Non-critical — MPAB failure does not block pipeline
  1336	      const msg = _mpabErr instanceof Error ? _mpabErr.message : String(_mpabErr);
  1337	      console.error('[hybrid-search] MPAB error (non-fatal):', msg);
  1338	    }
  1339	  }
  1340	
  1341	  // -- Stage C: Channel Enforcement (SPECKIT_CHANNEL_MIN_REP) --
  1342	  // Ensures every channel that returned results has at least one representative
  1343	  // In the top-k window. Prevents single-channel dominance in fusion output.
  1344	  // When disabled, passes results through unchanged.
  1345	  try {
  1346	    const channelResultSets = new Map<string, Array<{ id: number | string; score: number; [key: string]: unknown }>>();
  1347	    for (const list of lists) {
  1348	      channelResultSets.set(list.source, list.results.map(r => ({
  1349	        ...r,
  1350	        id: r.id,
  1351	        score: typeof (r as Record<string, unknown>).score === 'number'
  1352	          ? (r as Record<string, unknown>).score as number
  1353	          : typeof (r as Record<string, unknown>).similarity === 'number'
  1354	            ? ((r as Record<string, unknown>).similarity as number) / 100
  1355	            : 0,
  1356	      })));
  1357	    }
  1358	
  1359	    const enforcementResult: EnforcementResult = enforceChannelRepresentation(
  1360	      fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),
  1361	      channelResultSets,
  1362	      limit,
  1363	    );
  1364	
  1365	    if (enforcementResult.enforcement.applied) {
  1366	      fusedHybridResults = enforcementResult.results as HybridSearchResult[];
  1367	      s3meta.enforcement = {
  1368	        applied: true,
  1369	        promotedCount: enforcementResult.enforcement.promotedCount,
  1370	        underRepresentedChannels: enforcementResult.enforcement.underRepresentedChannels,
  1371	      };
  1372	    }
  1373	  } catch (err: unknown) {
  1374	    // Non-critical — enforcement failure does not block pipeline
  1375	    console.warn('[hybrid-search] channel enforcement failed:', err instanceof Error ? err.message : String(err));
  1376	  }
  1377	
  1378	  // Preserve non-enumerable eval metadata across later array reallocations.
  1379	  const shadowMeta = initialResults as HybridSearchResult[] & ShadowMetaArray;
  1380	  const s4shadowMeta = shadowMeta._s4shadow;
  1381	  const s4attributionMeta = shadowMeta._s4attribution;
  1382	  const degradationMeta = shadowMeta._degradation;
  1383	
  1384	  // C138/T316: MMR reranking with request-scoped embedding cache.
  1385	  // Reuse embeddings already returned by the vector channel when present and
  1386	  // only query vec_memories for missing IDs.
  1387	  let reranked: HybridSearchResult[] = fusedHybridResults.slice(0, limit);
  1388	
  1389	  // P1-5: Optional local GGUF reranking path (RERANKER_LOCAL=true).
  1390	  // Preserve cross-encoder gate semantics: when SPECKIT_CROSS_ENCODER=false, skip reranking.
  1391	  if (isCrossEncoderEnabled() && isLocalRerankerEnabled() && reranked.length >= MMR_MIN_CANDIDATES) {
  1392	    const localReranked = await rerankLocal(query, reranked, limit);
  1393	    if (localReranked !== reranked) {
  1394	      reranked = localReranked as HybridSearchResult[];
  1395	    }
  1396	  }
  1397	
  1398	  if (db && isMMREnabled()) {
  1399	    const numericIds = reranked
  1400	      .map(r => r.id)
  1401	      .filter((id): id is number => typeof id === 'number');
  1402	
  1403	    if (numericIds.length >= MMR_MIN_CANDIDATES) {
  1404	      try {
  1405	        const embeddingMap = new Map<number, Float32Array>(vectorEmbeddingCache);
  1406	        const missingIds = numericIds.filter((id) => !embeddingMap.has(id));
  1407	
  1408	        if (missingIds.length > 0) {
  1409	          const placeholders = missingIds.map(() => '?').join(', ');
  1410	          const embRows = (db.prepare(
  1411	            `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
  1412	          ) as Database.Statement).all(...missingIds) as Array<{ rowid: number; embedding: Buffer }>;
  1413	
  1414	          for (const row of embRows) {
  1415	            if (Buffer.isBuffer(row.embedding)) {
  1416	              embeddingMap.set(
  1417	                row.rowid,
  1418	                new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
  1419	              );
  1420	            }
  1421	          }
  1422	        }
  1423	
  1424	        const mmrCandidates: MMRCandidate[] = [];
  1425	        for (const r of reranked) {
  1426	          const emb = embeddingMap.get(r.id as number);
  1427	          if (emb) {
  1428	            mmrCandidates.push({
  1429	              id: r.id as number,
  1430	              score: (r.score as number) ?? 0,
  1431	              embedding: emb,
  1432	            });
  1433	          }
  1434	        }
  1435	
  1436	        if (mmrCandidates.length >= MMR_MIN_CANDIDATES) {
  1437	          const mmrLambda = INTENT_LAMBDA_MAP[intent] ?? MMR_DEFAULT_LAMBDA;
  1438	          const diversified = applyMMR(mmrCandidates, { lambda: mmrLambda, limit });
  1439	
  1440	          // FIX #6: Same fix as stage3-rerank FIX #5 — MMR can only diversify
  1441	          // rows that have embeddings. Non-embedded rows (lexical-only hits,
  1442	          // graph injections) must be preserved and merged back in their
  1443	          // original relative order instead of being silently dropped.
  1444	          const embeddedIdSet = new Set(mmrCandidates.map(c => c.id));
  1445	          const nonEmbeddedRows = reranked.filter(r => !embeddedIdSet.has(r.id as number));
  1446	          const rerankedById = new Map<string, HybridSearchResult>(
  1447	            reranked.map((result) => [canonicalResultId(result.id), result])
  1448	          );
  1449	
  1450	          const diversifiedRows = diversified.map((candidate): HybridSearchResult => {
  1451	            const existing = rerankedById.get(canonicalResultId(candidate.id));
  1452	            if (existing) {
  1453	              return existing;
  1454	            }
  1455	
  1456	            return {
  1457	              id: candidate.id,
  1458	              score: candidate.score,
  1459	              source: 'vector',
  1460	            };
  1461	          });
  1462	
  1463	          // Merge: diversified embedded rows first (MMR-ordered), then
  1464	          // non-embedded rows in their original relative order.
  1465	          reranked = [...diversifiedRows, ...nonEmbeddedRows];
  1466	        }
  1467	      } catch (embErr: unknown) {
  1468	        const msg = embErr instanceof Error ? embErr.message : String(embErr);
  1469	        console.warn(`[hybrid-search] MMR embedding retrieval failed: ${msg}`);
  1470	      }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Sqlite Fts
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Semantic and lexical search (memory_search)
     5	// Weighted BM25 scoring for FTS5 full-text search.
     6	// Extracted from hybrid-search.ts ftsSearch() for independent
     7	// Testing and future delegation.
     8	
     9	import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
    10	import type Database from 'better-sqlite3';
    11	
    12	// ───────────────────────────────────────────────────────────────
    13	// 2. INTERFACES
    14	
    15	// ───────────────────────────────────────────────────────────────
    16	interface FtsBm25Result {
    17	  id: number;
    18	  fts_score: number;
    19	  [key: string]: unknown;
    20	}
    21	
    22	interface FtsBm25Options {
    23	  limit?: number;
    24	  specFolder?: string;
    25	  includeArchived?: boolean;
    26	}
    27	
    28	type LexicalPath = 'fts5' | 'like' | 'unavailable';
    29	type FallbackState =
    30	  | 'ok'
    31	  | 'compile_probe_miss'
    32	  | 'missing_table'
    33	  | 'no_such_module_fts5'
    34	  | 'bm25_runtime_failure';
    35	
    36	interface LexicalCapabilitySnapshot {
    37	  lexicalPath: LexicalPath;
    38	  fallbackState: FallbackState;
    39	}
    40	
    41	let lastLexicalCapabilitySnapshot: LexicalCapabilitySnapshot | null = null;
    42	
    43	function cloneLexicalCapabilitySnapshot(
    44	  snapshot: LexicalCapabilitySnapshot | null
    45	): LexicalCapabilitySnapshot | null {
    46	  return snapshot ? { ...snapshot } : null;
    47	}
    48	
    49	function setLastLexicalCapabilitySnapshot(snapshot: LexicalCapabilitySnapshot): void {
    50	  lastLexicalCapabilitySnapshot = { ...snapshot };
    51	}
    52	
    53	function getLastLexicalCapabilitySnapshot(): LexicalCapabilitySnapshot | null {
    54	  return cloneLexicalCapabilitySnapshot(lastLexicalCapabilitySnapshot);
    55	}
    56	
    57	function resetLastLexicalCapabilitySnapshot(): void {
    58	  lastLexicalCapabilitySnapshot = null;
    59	}
    60	
    61	function toErrorMessage(error: unknown): string {
    62	  return error instanceof Error ? error.message : String(error);
    63	}
    64	
    65	function readCompileOptionValue(row: unknown): string | null {
    66	  if (typeof row === 'string') {
    67	    return row;
    68	  }
    69	  if (!row || typeof row !== 'object') {
    70	    return null;
    71	  }
    72	
    73	  const record = row as Record<string, unknown>;
    74	  const direct = record.compile_options;
    75	  if (typeof direct === 'string') {
    76	    return direct;
    77	  }
    78	
    79	  const firstString = Object.values(record).find((value) => typeof value === 'string');
    80	  return typeof firstString === 'string' ? firstString : null;
    81	}
    82	
    83	function isNoSuchModuleFts5Error(error: unknown): boolean {
    84	  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
    85	}
    86	
    87	function isBm25RuntimeFailure(error: unknown): boolean {
    88	  const message = toErrorMessage(error).toLowerCase();
    89	  return message.includes('bm25');
    90	}
    91	
    92	function probeFts5Capability(db: Database.Database): LexicalCapabilitySnapshot {
    93	  try {
    94	    const compileRows = (db.prepare('PRAGMA compile_options') as Database.Statement).all() as unknown[];
    95	    const hasFts5CompileFlag = compileRows
    96	      .map(readCompileOptionValue)
    97	      .some((value) => typeof value === 'string' && value.toUpperCase().includes('ENABLE_FTS5'));
    98	
    99	    if (!hasFts5CompileFlag) {
   100	      return {
   101	        lexicalPath: 'unavailable',
   102	        fallbackState: 'compile_probe_miss',
   103	      };
   104	    }
   105	  } catch {
   106	    return {
   107	      lexicalPath: 'unavailable',
   108	      fallbackState: 'compile_probe_miss',
   109	    };
   110	  }
   111	
   112	  try {
   113	    const result = (db.prepare(
   114	      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
   115	    ) as Database.Statement).get() as { name: string } | undefined;
   116	
   117	    if (!result) {
   118	      return {
   119	        lexicalPath: 'unavailable',
   120	        fallbackState: 'missing_table',
   121	      };
   122	    }
   123	  } catch (error: unknown) {
   124	    if (isNoSuchModuleFts5Error(error)) {
   125	      return {
   126	        lexicalPath: 'unavailable',
   127	        fallbackState: 'no_such_module_fts5',
   128	      };
   129	    }
   130	    return {
   131	      lexicalPath: 'unavailable',
   132	      fallbackState: 'missing_table',
   133	    };
   134	  }
   135	
   136	  return {
   137	    lexicalPath: 'fts5',
   138	    fallbackState: 'ok',
   139	  };
   140	}
   141	
   142	// ───────────────────────────────────────────────────────────────
   143	// 3. CORE FUNCTION
   144	
   145	// ───────────────────────────────────────────────────────────────
   146	/**
   147	 * Execute a weighted BM25 FTS5 search against memory_fts.
   148	 *
   149	 * Uses SQLite FTS5's built-in bm25() ranking function with
   150	 * per-column weights instead of the default `rank` pseudo-column.
   151	 * This gives title matches 10x weight, trigger_phrases 5x, etc.
   152	 *
   153	 * @param db - SQLite database connection
   154	 * @param query - Raw search query (will be sanitized)
   155	 * @param options - Search options (limit, specFolder, includeArchived)
   156	 * @returns Array of results with BM25 scores (higher = better)
   157	 * @example
   158	 * ```ts
   159	 * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
   160	 * ```
   161	 */
   162	function fts5Bm25Search(
   163	  db: Database.Database,
   164	  query: string,
   165	  options: FtsBm25Options = {}
   166	): FtsBm25Result[] {
   167	  const { limit = 20, specFolder, includeArchived = false } = options;
   168	
   169	  // Sanitize via shared tokenizer, then wrap each token in quotes and join with OR for recall
   170	  const tokens = normalizeLexicalQueryTokens(query).fts;
   171	  const sanitized = tokens
   172	    .map(t => (t.startsWith('"') && t.endsWith('"')) ? t : `"${t}"`)
   173	    .join(' OR ');
   174	
   175	  if (!sanitized) {
   176	    setLastLexicalCapabilitySnapshot(probeFts5Capability(db));
   177	    return [];
   178	  }
   179	
   180	  const folderFilter = specFolder
   181	    ? 'AND (m.spec_folder = ? OR m.spec_folder LIKE ? || "/%")'
   182	    : '';
   183	  const archivalFilter = !includeArchived
   184	    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
   185	    : '';
   186	  const deprecatedTierFilter =
   187	    "AND (m.importance_tier IS NULL OR m.importance_tier != 'deprecated')";
   188	
   189	  const params: (string | number)[] = specFolder
   190	    ? [sanitized, specFolder, specFolder, limit]
   191	    : [sanitized, limit];
   192	
   193	  // Bm25() returns negative scores (lower = better), so we negate
   194	  // To produce positive scores where higher = better match.
   195	  const [w0, w1, w2, w3] = BM25_FTS5_WEIGHTS;
   196	  const sql = `
   197	    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
   198	    FROM memory_fts
   199	    JOIN memory_index m ON m.id = memory_fts.rowid
   200	    WHERE memory_fts MATCH ?
   201	      ${folderFilter}
   202	      ${archivalFilter}
   203	      ${deprecatedTierFilter}
   204	    ORDER BY fts_score DESC
   205	    LIMIT ?
   206	  `;
   207	
   208	  const capability = probeFts5Capability(db);
   209	  setLastLexicalCapabilitySnapshot(capability);
   210	  if (capability.fallbackState !== 'ok') {
   211	    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
   212	    return [];
   213	  }
   214	
   215	  try {
   216	    const rows = (db.prepare(sql) as Database.Statement).all(
   217	      ...params
   218	    ) as Array<Record<string, unknown>>;
   219	
   220	    const normalizedRows = rows.map(row => ({
   221	      ...row,
   222	      id: row.id as number,
   223	      fts_score: (row.fts_score as number) || 0,
   224	    }));
   225	    setLastLexicalCapabilitySnapshot({
   226	      lexicalPath: 'fts5',
   227	      fallbackState: 'ok',
   228	    });
   229	    return normalizedRows;
   230	  } catch (error: unknown) {
   231	    const msg = error instanceof Error ? error.message : String(error);
   232	    const failureSnapshot: LexicalCapabilitySnapshot = isNoSuchModuleFts5Error(error)
   233	      ? {
   234	          lexicalPath: 'unavailable',
   235	          fallbackState: 'no_such_module_fts5',
   236	        }
   237	      : isBm25RuntimeFailure(error)
   238	        ? {
   239	            lexicalPath: 'unavailable',
   240	            fallbackState: 'bm25_runtime_failure',
   241	          }
   242	        : msg.toLowerCase().includes('no such table: memory_fts')
   243	          ? {
   244	              lexicalPath: 'unavailable',
   245	              fallbackState: 'missing_table',
   246	            }
   247	          : {
   248	              lexicalPath: 'unavailable',
   249	              fallbackState: 'bm25_runtime_failure',
   250	            };
   251	    setLastLexicalCapabilitySnapshot(failureSnapshot);
   252	    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
   253	    return [];
   254	  }
   255	}
   256	
   257	/**
   258	 * Check if the memory_fts FTS5 virtual table exists in the database.
   259	 *
   260	 * Used as a feature-detect before calling fts5Bm25Search, since FTS5
   261	 * may be absent on older SQLite builds or freshly-created databases.
   262	 *
   263	 * @param db - SQLite database connection to check
   264	 * @returns true if memory_fts exists and is queryable
   265	 * @example
   266	 * ```ts
   267	 * if (isFts5Available(db)) {
   268	 *   fts5Bm25Search(db, 'memory');
   269	 * }
   270	 * ```
   271	 */
   272	function isFts5Available(db: Database.Database): boolean {
   273	  return probeFts5Capability(db).fallbackState === 'ok';
   274	}
   275	
   276	// ───────────────────────────────────────────────────────────────
   277	// 4. EXPORTS
   278	
   279	// ───────────────────────────────────────────────────────────────
   280	export {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Bm25 Index
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: BM25 trigger phrase re-index gate
     5	import type Database from 'better-sqlite3';
     6	import { normalizeContentForBM25 } from '../parsing/content-normalizer.js';
     7	
     8	// ───────────────────────────────────────────────────────────────
     9	// 1. INTERFACES
    10	
    11	// ───────────────────────────────────────────────────────────────
    12	interface BM25SearchResult {
    13	  id: string;
    14	  /**
    15	   * BM25 term-frequency relevance score (unbounded, typically 0-25+).
    16	   * Higher = better lexical match. Not directly comparable to vector similarity
    17	   * scores; use min-max normalization or RRF when combining with other methods.
    18	   */
    19	  score: number;
    20	}
    21	
    22	interface BM25Stats {
    23	  documentCount: number;
    24	  termCount: number;
    25	  avgDocLength: number;
    26	}
    27	
    28	interface BM25DocumentSource {
    29	  title?: string | null;
    30	  content_text?: string | null;
    31	  trigger_phrases?: string | string[] | null;
    32	  file_path?: string | null;
    33	}
    34	
    35	/* ───────────────────────────────────────────────────────────────
    36	   1B. CONSTANTS & FEATURE FLAG
    37	   ──────────────────────────────────────────────────────────────── */
    38	
    39	const DEFAULT_K1 = 1.2;
    40	const DEFAULT_B = 0.75;
    41	const BM25_WARMUP_BATCH_SIZE = 250;
    42	const BM25_ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'experimental', 'fallback']);
    43	const BM25_DISABLED_VALUES = new Set(['0', 'false', 'no', 'off']);
    44	
    45	/**
    46	 * C138: Field weight multipliers for weighted BM25 scoring.
    47	 * When indexing a document composed of multiple fields, multiply
    48	 * each field's token scores by the appropriate weight before
    49	 * accumulating the total document score.
    50	 *
    51	 * These weights are consumed by the FTS5 path in sqlite-fts.ts,
    52	 * not the in-memory BM25 engine in this file. Exported for shared access.
    53	 *
    54	 * title:           10.0 — exact title matches are the strongest signal
    55	 * trigger_phrases:  5.0 — curated keywords next most important
    56	 * content_generic:  2.0 — generic textual content (file_path, tags, etc.)
    57	 * body:             1.0 — baseline weight for full body / content_text
    58	 */
    59	const BM25_FTS5_WEIGHTS = [10.0, 5.0, 2.0, 1.0] as const;
    60	
    61	const BM25_FIELD_WEIGHTS: Record<string, number> = {
    62	  title: BM25_FTS5_WEIGHTS[0],
    63	  trigger_phrases: BM25_FTS5_WEIGHTS[1],
    64	  content_generic: BM25_FTS5_WEIGHTS[2],
    65	  body: BM25_FTS5_WEIGHTS[3],
    66	};
    67	
    68	/**
    69	 * Check whether the in-memory BM25 index is enabled.
    70	 *
    71	 * @returns `true` when BM25 indexing/search is enabled for the current process.
    72	 * @example
    73	 * ```ts
    74	 * if (isBm25Enabled()) {
    75	 *   getIndex();
    76	 * }
    77	 * ```
    78	 */
    79	function isBm25Enabled(): boolean {
    80	  const value = process.env.ENABLE_BM25?.trim().toLowerCase();
    81	  if (!value) return true; // enabled by default
    82	  if (BM25_DISABLED_VALUES.has(value)) return false;
    83	  return BM25_ENABLED_VALUES.has(value);
    84	}
    85	
    86	// ───────────────────────────────────────────────────────────────
    87	// 2. HELPERS
    88	
    89	// ───────────────────────────────────────────────────────────────
    90	const STOP_WORDS = new Set([
    91	  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    92	  'of', 'with', 'by', 'from', 'is', 'it', 'as', 'was', 'are', 'be',
    93	  'has', 'had', 'have', 'been', 'were', 'will', 'would', 'could', 'should',
    94	  'may', 'might', 'can', 'this', 'that', 'these', 'those', 'not', 'no',
    95	  'do', 'does', 'did', 'so', 'if', 'then', 'than', 'too', 'very',
    96	]);
    97	
    98	/**
    99	 * Apply lightweight stemming to a token for BM25 indexing and matching.
   100	 *
   101	 * @param word - Token to stem.
   102	 * @returns A lowercased token with simple suffix normalization applied.
   103	 * @example
   104	 * ```ts
   105	 * simpleStem('running');
   106	 * // 'run'
   107	 * ```
   108	 */
   109	function simpleStem(word: string): string {
   110	  let stem = word.toLowerCase();
   111	  let suffixRemoved = false;
   112	  // Simple suffix removal
   113	  if (stem.endsWith('ing') && stem.length > 5) { stem = stem.slice(0, -3); suffixRemoved = true; }
   114	  else if (stem.endsWith('tion') && stem.length > 6) { stem = stem.slice(0, -4); suffixRemoved = true; }
   115	  else if (stem.endsWith('ed') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
   116	  else if (stem.endsWith('ly') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
   117	  else if (stem.endsWith('es') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
   118	  else if (stem.endsWith('s') && stem.length > 3) { stem = stem.slice(0, -1); suffixRemoved = true; }
   119	  // Only deduplicate doubled consonants when a suffix was actually removed.
   120	  // Without this guard, original double consonants are incorrectly stripped:
   121	  // "bass" -> "bas", "jazz" -> "jaz", "bill" -> "bil" etc.
   122	  // Handle doubled consonants after suffix
   123	  // Removal. "running"→"runn"→"run", "stopped"→"stopp"→"stop". Check if last two chars
   124	  // Are identical consonants and deduplicate.
   125	  if (suffixRemoved && stem.length >= 3) {
   126	    const last = stem[stem.length - 1];
   127	    if (last === stem[stem.length - 2] && !/[aeiou]/.test(last)) {
   128	      stem = stem.slice(0, -1);
   129	    }
   130	  }
   131	  return stem;
   132	}
   133	
   134	function splitLexicalFragments(text: string): string[] {
   135	  if (!text || typeof text !== 'string') return [];
   136	
   137	  return text
   138	    .toLowerCase()
   139	    .replace(/[^a-z0-9\s-_]/g, ' ')
   140	    .split(/\s+/)
   141	    .map(t => t.trim())
   142	    .filter(Boolean);
   143	}
   144	
   145	/**
   146	 * Tokenize raw text into normalized BM25 terms.
   147	 *
   148	 * @param text - Input text to tokenize.
   149	 * @returns Stemmed, lowercased, stop-word-filtered terms.
   150	 * @example
   151	 * ```ts
   152	 * tokenize('The memory indexing pipeline');
   153	 * // ['memory', 'index', 'pipeline']
   154	 * ```
   155	 */
   156	function tokenize(text: string): string[] {
   157	  return splitLexicalFragments(text)
   158	    .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
   159	    .map(simpleStem);
   160	}
   161	
   162	/**
   163	 * Count token frequency occurrences for BM25 scoring.
   164	 *
   165	 * @param tokens - Normalized tokens produced by {@link tokenize}.
   166	 * @returns A frequency map keyed by token text.
   167	 * @example
   168	 * ```ts
   169	 * getTermFrequencies(['memory', 'memory', 'search']).get('memory');
   170	 * // 2
   171	 * ```
   172	 */
   173	function getTermFrequencies(tokens: string[]): Map<string, number> {
   174	  const freq = new Map<string, number>();
   175	  for (const token of tokens) {
   176	    freq.set(token, (freq.get(token) || 0) + 1);
   177	  }
   178	  return freq;
   179	}
   180	
   181	function normalizeTriggerPhrasesForBM25(triggerPhrases: string | string[] | null | undefined): string {
   182	  if (Array.isArray(triggerPhrases)) {
   183	    return triggerPhrases
   184	      .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
   185	      .join(' ');
   186	  }
   187	
   188	  if (typeof triggerPhrases !== 'string') {
   189	    return '';
   190	  }
   191	
   192	  const trimmed = triggerPhrases.trim();
   193	  if (!trimmed) {
   194	    return '';
   195	  }
   196	
   197	  try {
   198	    const parsed = JSON.parse(trimmed) as unknown;
   199	    if (Array.isArray(parsed)) {
   200	      return parsed
   201	        .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
   202	        .join(' ');
   203	    }
   204	  } catch {
   205	    // Fall back to raw string when the database value is not JSON.
   206	  }
   207	
   208	  return trimmed;
   209	}
   210	
   211	function buildBm25DocumentText(row: BM25DocumentSource): string {
   212	  const textParts: string[] = [];
   213	
   214	  if (typeof row.title === 'string' && row.title.trim()) {
   215	    textParts.push(row.title.trim());
   216	  }
   217	
   218	  if (typeof row.content_text === 'string' && row.content_text.trim()) {
   219	    textParts.push(normalizeContentForBM25(row.content_text));
   220	  }
   221	
   222	  const triggerPhrases = normalizeTriggerPhrasesForBM25(row.trigger_phrases);
   223	  if (triggerPhrases) {
   224	    textParts.push(triggerPhrases);
   225	  }
   226	
   227	  if (typeof row.file_path === 'string' && row.file_path.trim()) {
   228	    textParts.push(row.file_path.trim());
   229	  }
   230	
   231	  return textParts.join(' ').trim();
   232	}
   233	
   234	// ───────────────────────────────────────────────────────────────
   235	// 3. BM25 INDEX CLASS
   236	
   237	// ───────────────────────────────────────────────────────────────
   238	class BM25Index {
   239	  private k1: number;
   240	  private b: number;
   241	  private documents: Map<string, { tokens: string[]; termFreq: Map<string, number> }>;
   242	  private documentFreq: Map<string, number>;
   243	  private totalDocLength: number;
   244	  private warmupHandle: ReturnType<typeof setTimeout> | null;
   245	  private warmupGeneration: number;
   246	
   247	  constructor(k1: number = DEFAULT_K1, b: number = DEFAULT_B) {
   248	    this.k1 = k1;
   249	    this.b = b;
   250	    this.documents = new Map();
   251	    this.documentFreq = new Map();
   252	    this.totalDocLength = 0;
   253	    this.warmupHandle = null;
   254	    this.warmupGeneration = 0;
   255	  }
   256	
   257	  addDocument(id: string, text: string): void {
   258	    const tokens = tokenize(text);
   259	    const termFreq = getTermFrequencies(tokens);
   260	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-retrieve.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-retrieve.ts: No such file or directory

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fuse.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fuse.ts: No such file or directory

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Vector Index Queries
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Hybrid search pipeline
     5	// Split from vector-index-store.ts — contains ALL query/search functions,
     6	// Content extraction, ranking, stats, cleanup, and integrity checks.
     7	
     8	import * as path from 'path';
     9	import * as fs from 'fs';
    10	import type Database from 'better-sqlite3';
    11	import { formatAgeString as format_age_string } from '../utils/format-helpers.js';
    12	import { createLogger } from '../utils/logger.js';
    13	import { recordHistory } from '../storage/history.js';
    14	import * as embeddingsProvider from '../providers/embeddings.js';
    15	import {
    16	  get_error_message,
    17	  parse_trigger_phrases,
    18	  to_embedding_buffer,
    19	  VectorIndexError,
    20	  VectorIndexErrorCode,
    21	} from './vector-index-types.js';
    22	import {
    23	  initialize_db,
    24	  get_embedding_dim,
    25	  get_constitutional_memories,
    26	  init_prepared_statements,
    27	  validate_file_path_local,
    28	  safe_read_file_async,
    29	  safe_parse_json,
    30	  search_weights,
    31	  sqlite_vec_available as get_sqlite_vec_available,
    32	} from './vector-index-store.js';
    33	import { delete_memory_from_database } from './vector-index-mutations.js';
    34	import type {
    35	  EmbeddingInput,
    36	  EnrichedSearchResult,
    37	  MemoryRow,
    38	  VectorSearchOptions,
    39	} from './vector-index-types.js';
    40	
    41	const logger = createLogger('VectorIndex');
    42	
    43	type RelatedMemoryLink = { id: number; similarity: number };
    44	type UsageStatsOptions = { sortBy?: string; order?: string; limit?: number };
    45	type CleanupOptions = {
    46	  maxAgeDays?: number;
    47	  maxAccessCount?: number;
    48	  maxConfidence?: number;
    49	  limit?: number;
    50	};
    51	
    52	/* ───────────────────────────────────────────────────────────────
    53	   SIMPLE QUERIES
    54	----------------------------------------------------------------*/
    55	
    56	/**
    57	 * Gets one indexed memory by identifier.
    58	 * @param id - The memory identifier.
    59	 * @returns The matching memory row, if found.
    60	 * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
    61	 * @example
    62	 * ```ts
    63	 * const memory = get_memory(42);
    64	 * ```
    65	 */
    66	export function get_memory(id: number, database: Database.Database = initialize_db()): MemoryRow | null {
    67	  const stmts = init_prepared_statements(database);
    68	  const row = stmts.get_by_id.get(id);
    69	
    70	  if (row) {
    71	    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
    72	    row.isConstitutional = row.importance_tier === 'constitutional';
    73	  }
    74	
    75	  return row || null;
    76	}
    77	
    78	/**
    79	 * Gets indexed memories for a spec folder.
    80	 * @param spec_folder - The spec folder to query.
    81	 * @returns The memory rows for the folder.
    82	 */
    83	export function get_memories_by_folder(
    84	  spec_folder: string,
    85	  database: Database.Database = initialize_db(),
    86	): MemoryRow[] {
    87	  const rows = database.prepare(`
    88	    SELECT m.*
    89	    FROM memory_index m
    90	    JOIN active_memory_projection p ON p.active_memory_id = m.id
    91	    WHERE m.spec_folder = ?
    92	    ORDER BY m.created_at DESC
    93	  `).all(spec_folder) as MemoryRow[];
    94	
    95	  return rows.map((row: MemoryRow) => {
    96	    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
    97	    row.isConstitutional = row.importance_tier === 'constitutional';
    98	    return row;
    99	  });
   100	}
   101	
   102	/**
   103	 * Gets the total number of indexed memories.
   104	 * @returns The total memory count.
   105	 */
   106	export function get_memory_count(database: Database.Database = initialize_db()): number {
   107	  const stmts = init_prepared_statements(database);
   108	  const result = stmts.count_all.get();
   109	  return result?.count ?? 0;
   110	}
   111	
   112	/**
   113	 * Gets memory counts grouped by embedding status.
   114	 * @returns The counts for each embedding status.
   115	 */
   116	export function get_status_counts(
   117	  database: Database.Database = initialize_db(),
   118	): { pending: number; success: number; failed: number; retry: number; partial: number } {
   119	  const rows = database.prepare(`
   120	    SELECT m.embedding_status, COUNT(*) as count
   121	    FROM memory_index m
   122	    JOIN active_memory_projection p ON p.active_memory_id = m.id
   123	    GROUP BY m.embedding_status
   124	  `).all();
   125	
   126	  // M7 FIX: Include 'partial' status in counts
   127	  const counts = { pending: 0, success: 0, failed: 0, retry: 0, partial: 0 };
   128	  for (const row of rows as Array<{ embedding_status: keyof typeof counts; count: number }>) {
   129	    if (row.embedding_status in counts) {
   130	      counts[row.embedding_status] = row.count;
   131	    }
   132	  }
   133	
   134	  return counts;
   135	}
   136	
   137	/**
   138	 * Gets summary counts for indexed memories.
   139	 * @returns The aggregate memory statistics.
   140	 */
   141	export function get_stats(
   142	  database: Database.Database = initialize_db(),
   143	): { total: number; pending: number; success: number; failed: number; retry: number; partial: number } {
   144	  const counts = get_status_counts(database);
   145	  const total = counts.pending + counts.success + counts.failed + counts.retry + counts.partial;
   146	
   147	  return {
   148	    total,
   149	    ...counts
   150	  };
   151	}
   152	
   153	/* ───────────────────────────────────────────────────────────────
   154	   VECTOR SEARCH
   155	----------------------------------------------------------------*/
   156	
   157	/**
   158	 * Searches indexed memories by vector similarity.
   159	 * @param query_embedding - The query embedding to search with.
   160	 * @param options - Search options.
   161	 * @returns The matching memory rows.
   162	 * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
   163	 * @example
   164	 * ```ts
   165	 * const rows = vector_search(queryEmbedding, { limit: 5, specFolder: 'specs/001-demo' });
   166	 * ```
   167	 */
   168	export function vector_search(
   169	  query_embedding: EmbeddingInput,
   170	  options: VectorSearchOptions = {},
   171	  database: Database.Database = initialize_db(),
   172	): MemoryRow[] {
   173	  const sqlite_vec = get_sqlite_vec_available();
   174	  if (!sqlite_vec) {
   175	    console.warn('[vector-index] Vector search unavailable - sqlite-vec not loaded');
   176	    return [];
   177	  }
   178	
   179	  const {
   180	    limit = 10,
   181	    specFolder = null,
   182	    minSimilarity = 0,
   183	    useDecay = true,
   184	    tier = null,
   185	    contextType = null,
   186	    includeConstitutional = true,
   187	    includeArchived = false
   188	  } = options;
   189	
   190	  // M9 FIX: Validate embedding dimension before querying
   191	  const expected_dim = get_embedding_dim();
   192	  if (!query_embedding || query_embedding.length !== expected_dim) {
   193	    throw new VectorIndexError(
   194	      `Invalid embedding dimension: expected ${expected_dim}, got ${query_embedding?.length}`,
   195	      VectorIndexErrorCode.EMBEDDING_VALIDATION,
   196	    );
   197	  }
   198	
   199	  const query_buffer = to_embedding_buffer(query_embedding);
   200	  const max_distance = 2 * (1 - minSimilarity / 100);
   201	
   202	  // ADR-004: FSRS-preferred decay with half-life fallback
   203	  const decay_expr = useDecay
   204	    ? `CASE
   205	         WHEN m.is_pinned = 1 THEN m.importance_weight
   206	         WHEN m.last_review IS NOT NULL AND m.review_count > 0 THEN
   207	           m.importance_weight * POWER(
   208	             1.0 + (19.0/81.0) * (julianday('now') - julianday(m.last_review)) / COALESCE(NULLIF(m.stability, 0), 1.0),
   209	             -0.5
   210	           )
   211	         ELSE m.importance_weight * POWER(0.5, (julianday('now') - julianday(m.updated_at)) / COALESCE(NULLIF(m.decay_half_life_days, 0), 90.0))
   212	       END`
   213	    : 'm.importance_weight';
   214	
   215	  let constitutional_results: MemoryRow[] = [];
   216	
   217	  if (includeConstitutional && tier !== 'constitutional') {
   218	    constitutional_results = get_constitutional_memories(database, specFolder, includeArchived);
   219	  }
   220	
   221	  const where_clauses = ['m.embedding_status = \'success\''];
   222	  const params: unknown[] = [query_buffer];
   223	
   224	  where_clauses.push('(m.expires_at IS NULL OR m.expires_at > datetime(\'now\'))');
   225	
   226	  if (!includeArchived) {
   227	    where_clauses.push('(m.is_archived IS NULL OR m.is_archived = 0)');
   228	  }
   229	  if (tier === 'deprecated') {
   230	    where_clauses.push('m.importance_tier = ?');
   231	    params.push('deprecated');
   232	  } else if (tier === 'constitutional') {
   233	    where_clauses.push('m.importance_tier = ?');
   234	    params.push('constitutional');
   235	  } else if (tier) {
   236	    where_clauses.push('m.importance_tier = ?');
   237	    params.push(tier);
   238	  } else {
   239	    where_clauses.push('(m.importance_tier IS NULL OR m.importance_tier NOT IN (\'deprecated\', \'constitutional\'))');
   240	  }

exec
/bin/zsh -lc 'ls .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
README.md
index.ts
orchestrator.ts
ranking-contract.ts
stage1-candidate-gen.ts
stage2-fusion.ts
stage2b-enrichment.ts
stage3-rerank.ts
stage4-filter.ts
types.ts

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '240,380p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   240	  }
   241	
   242	  if (specFolder) {
   243	    where_clauses.push('m.spec_folder = ?');
   244	    params.push(specFolder);
   245	  }
   246	
   247	  if (contextType) {
   248	    where_clauses.push('m.context_type = ?');
   249	    params.push(contextType);
   250	  }
   251	
   252	  // M8 FIX: If constitutional results already satisfy limit, return them directly
   253	  if (constitutional_results.length >= limit) {
   254	    return constitutional_results.slice(0, limit);
   255	  }
   256	  const adjusted_limit = Math.max(1, limit - constitutional_results.length);
   257	  params.push(max_distance, adjusted_limit);
   258	
   259	  const sql = `
   260	    SELECT sub.*,
   261	           ROUND((1 - sub.distance / 2) * 100, 2) as similarity
   262	    FROM (
   263	      SELECT m.*, vec_distance_cosine(v.embedding, ?) as distance,
   264	             ${decay_expr} as effective_importance
   265	      FROM memory_index m
   266	      JOIN active_memory_projection p ON p.active_memory_id = m.id
   267	      JOIN vec_memories v ON m.id = v.rowid
   268	      WHERE ${where_clauses.join(' AND ')}
   269	    ) sub
   270	    WHERE sub.distance <= ?
   271	    ORDER BY (sub.distance - (sub.effective_importance * 0.1)) ASC
   272	    LIMIT ?
   273	  `;
   274	
   275	  const rows = database.prepare(sql).all(...params);
   276	
   277	  const regular_results = (rows as MemoryRow[]).map((row: MemoryRow) => {
   278	    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
   279	    row.isConstitutional = row.importance_tier === 'constitutional';
   280	    return row;
   281	  });
   282	
   283	  return [...constitutional_results, ...regular_results];
   284	}
   285	
   286	/**
   287	 * Gets constitutional memories for prompt assembly.
   288	 * @param options - Retrieval options.
   289	 * @returns The constitutional memory rows.
   290	 */
   291	export function get_constitutional_memories_public(
   292	  options: { specFolder?: string | null; maxTokens?: number; includeArchived?: boolean } = {},
   293	  database: Database.Database = initialize_db(),
   294	): MemoryRow[] {
   295	  const { specFolder = null, maxTokens = 2000, includeArchived = false } = options;
   296	
   297	  let results = get_constitutional_memories(database, specFolder, includeArchived);
   298	
   299	  const TOKENS_PER_MEMORY = 100;
   300	  const max_count = Math.floor(maxTokens / TOKENS_PER_MEMORY);
   301	  if (results.length > max_count) {
   302	    results = results.slice(0, max_count);
   303	  }
   304	
   305	  return results;
   306	}
   307	
   308	/**
   309	 * Searches indexed memories with multiple concept embeddings.
   310	 * @param concept_embeddings - The concept embeddings to search with.
   311	 * @param options - Search options.
   312	 * @returns The matching memory rows.
   313	 * @throws {VectorIndexError} When concept count or embedding dimensions are invalid, or when store initialization fails.
   314	 * @example
   315	 * ```ts
   316	 * const rows = multi_concept_search([embA, embB], { limit: 8, specFolder: 'specs/001-demo' });
   317	 * ```
   318	 */
   319	export function multi_concept_search(
   320	  concept_embeddings: EmbeddingInput[],
   321	  options: { limit?: number; specFolder?: string | null; minSimilarity?: number; includeArchived?: boolean } = {}
   322	): MemoryRow[] {
   323	  const sqlite_vec = get_sqlite_vec_available();
   324	  if (!sqlite_vec) {
   325	    console.warn('[vector-index] Multi-concept search unavailable - sqlite-vec not loaded');
   326	    return [];
   327	  }
   328	
   329	  const database = initialize_db();
   330	
   331	  const concepts = concept_embeddings;
   332	  if (!Array.isArray(concepts) || concepts.length < 2 || concepts.length > 5) {
   333	    throw new VectorIndexError('Multi-concept search requires 2-5 concepts', VectorIndexErrorCode.QUERY_FAILED);
   334	  }
   335	
   336	  const expected_dim = get_embedding_dim();
   337	  for (const emb of concepts) {
   338	    if (!emb || emb.length !== expected_dim) {
   339	      throw new VectorIndexError(
   340	        `Invalid embedding dimension: expected ${expected_dim}, got ${emb?.length}`,
   341	        VectorIndexErrorCode.QUERY_FAILED,
   342	      );
   343	    }
   344	  }
   345	
   346	  const { limit = 10, specFolder = null, minSimilarity = 50, includeArchived = false } = options;
   347	
   348	  const concept_buffers = concepts.map(c => to_embedding_buffer(c));
   349	  const max_distance = 2 * (1 - minSimilarity / 100);
   350	
   351	  const distance_expressions = concept_buffers.map((_, i) =>
   352	    `vec_distance_cosine(v.embedding, ?) as dist_${i}`
   353	  ).join(', ');
   354	
   355	  const distance_filters = concept_buffers.map((_, _i) =>
   356	    `vec_distance_cosine(v.embedding, ?) <= ?`
   357	  ).join(' AND ');
   358	
   359	  const folder_filter = specFolder ? 'AND m.spec_folder = ?' : '';
   360	  const archival_filter = !includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : '';
   361	
   362	  const similarity_select = concept_buffers.map((_, i) =>
   363	    `ROUND((1 - sub.dist_${i} / 2) * 100, 2) as similarity_${i}`
   364	  ).join(', ');
   365	
   366	  const avg_distance_expr = concept_buffers.map((_, i) => `sub.dist_${i}`).join(' + ');
   367	
   368	  const sql = `
   369	    SELECT
   370	      sub.*,
   371	      ${similarity_select},
   372	      (${avg_distance_expr}) / ${concepts.length} as avg_distance
   373	    FROM (
   374	      SELECT
   375	        m.*,
   376	        ${distance_expressions}
   377	      FROM memory_index m
   378	      JOIN active_memory_projection p ON p.active_memory_id = m.id
   379	      JOIN vec_memories v ON m.id = v.rowid
   380	      WHERE m.embedding_status = 'success'

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-aggregate.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-aggregate.ts: No such file or directory

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Index
     3	// ───────────────────────────────────────────────────────────────
     4	// Public API for the 4-stage retrieval pipeline
     5	/**
     6	 * Execute the four-stage retrieval pipeline.
     7	 */
     8	
     9	// Feature catalog: 4-stage pipeline architecture
    10	// Feature catalog: 4-stage pipeline refactor
    11	
    12	export { executePipeline } from './orchestrator.js';
    13	/**
    14	 * Public pipeline data contracts.
    15	 */
    16	export type {
    17	  PipelineConfig,
    18	  PipelineResult,
    19	  PipelineRow,
    20	  Stage4ReadonlyRow,
    21	  Stage1Input,
    22	  Stage1Output,
    23	  Stage2Input,
    24	  Stage2Output,
    25	  Stage3Input,
    26	  Stage3Output,
    27	  Stage4Input,
    28	  Stage4Output,
    29	  ScoreSnapshot,
    30	  IntentWeightsConfig,
    31	  ArtifactRoutingConfig,
    32	} from './types.js';
    33	/**
    34	 * Score snapshot helpers for Stage 4 invariants.
    35	 */
    36	export { captureScoreSnapshot, verifyScoreInvariant } from './types.js';

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Stage1 Candidate Gen
     3	// ───────────────────────────────────────────────────────────────
     4	// 4-stage retrieval pipeline architecture
     5	//
     6	// Responsibility: Execute search channels and collect raw candidate results.
     7	// This stage avoids downstream fusion/reranking, but may apply temporal
     8	// Contiguity to raw vector-channel hits before later pipeline stages.
     9	// Results are collected from the appropriate search channel based on search type.
    10	//
    11	// Search channels handled:
    12	//   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
    13	//   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
    14	//   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
    15	// Suppressed when R15 classifies query as "simple" (mutual exclusion)
    16	//   - hybrid: collectRawCandidates → falls back to vector on failure
    17	//   - vector: Direct vectorSearch
    18	//
    19	// Post-channel operations:
    20	//   - Constitutional memory injection (if not already present)
    21	//   - Quality score filtering
    22	//   - Tier and contextType filtering
    23	//
    24	// I/O CONTRACT:
    25	// Input:  Stage1Input { config: PipelineConfig }
    26	// Output: Stage1Output { candidates: PipelineRow[], metadata }
    27	// Key invariants:
    28	//     - candidates contains raw channel scores; vector hits may include an
    29	//       optional temporal-contiguity boost applied before downstream fusion
    30	//     - Constitutional rows are always present when includeConstitutional=true and no tier filter
    31	//     - All rows pass qualityThreshold (if set) and tier/contextType filters
    32	// Side effects:
    33	//     - Generates query embeddings via the embeddings provider (external call)
    34	//     - Reads from the vector index and FTS5 / BM25 index (DB reads only)
    35	//
    36	import type { Stage1Input, Stage1Output, PipelineRow } from './types.js';
    37	import { resolveEffectiveScore } from './types.js';
    38	import * as vectorIndex from '../vector-index.js';
    39	import * as embeddings from '../../providers/embeddings.js';
    40	import * as hybridSearch from '../hybrid-search.js';
    41	import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
    42	import { isMultiQueryEnabled, isEmbeddingExpansionEnabled, isMemorySummariesEnabled, isQueryDecompositionEnabled, isGraphConceptRoutingEnabled, isLlmReformulationEnabled, isHyDEEnabled, isQuerySurrogatesEnabled, isTemporalContiguityEnabled, isQueryConceptExpansionEnabled } from '../search-flags.js';
    43	import { expandQuery } from '../query-expander.js';
    44	import { expandQueryWithEmbeddings, isExpansionActive } from '../embedding-expansion.js';
    45	import { querySummaryEmbeddings, checkScaleGate } from '../memory-summaries.js';
    46	import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
    47	import { requireDb } from '../../../utils/db-helpers.js';
    48	import { filterRowsByScope, isScopeEnforcementEnabled } from '../../governance/scope-governance.js';
    49	import { getAllowedSharedSpaceIds } from '../../collab/shared-spaces.js';
    50	import { withTimeout } from '../../errors/core.js';
    51	import { computeBackfillQualityScore } from '../../validation/save-quality-gate.js';
    52	import {
    53	  isMultiFacet,
    54	  decompose,
    55	  mergeByFacetCoverage as mergeFacetCoveragePools,
    56	  MAX_FACETS,
    57	} from '../query-decomposer.js';
    58	import { routeQueryConcepts, nounPhrases, getConceptExpansionTerms } from '../entity-linker.js';
    59	import { cheapSeedRetrieve, llm, fanout } from '../llm-reformulation.js';
    60	import { runHyDE } from '../hyde.js';
    61	import { matchSurrogates } from '../query-surrogates.js';
    62	import { loadSurrogatesBatch } from '../surrogate-storage.js';
    63	
    64	// Feature catalog: 4-stage pipeline architecture
    65	// Feature catalog: Hybrid search pipeline
    66	
    67	
    68	// -- Constants --
    69	
    70	/** Maximum number of deep-mode query variants to generate (original + expanded). */
    71	const MAX_DEEP_QUERY_VARIANTS = 3;
    72	
    73	/** F1: Deep-mode expansion timeout — fall back to base query if variants take too long. */
    74	const DEEP_EXPANSION_TIMEOUT_MS = 5000;
    75	
    76	/** Minimum cosine similarity for multi-concept search. */
    77	const MULTI_CONCEPT_MIN_SIMILARITY = 0.5;
    78	
    79	/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
    80	const CONSTITUTIONAL_INJECT_LIMIT = 5;
    81	
    82	/** Number of similar memories to mine for R12 embedding-based query expansion terms. */
    83	const DEFAULT_EXPANSION_CANDIDATE_LIMIT = 5;
    84	
    85	/** D2: Timeout for facet decomposition parallel searches (ms). */
    86	const DECOMPOSITION_TIMEOUT_MS = 5000;
    87	const MAX_QUERY_DECOMPOSITION_FACETS = MAX_FACETS;
    88	
    89	// -- Helper Functions --
    90	
    91	/**
    92	 * Filter results by a minimum quality score threshold.
    93	 *
    94	 * - If no threshold is provided or it is not a finite number, all results pass.
    95	 * - Threshold is clamped to [0, 1].
    96	 * - Rows with a missing or non-finite `quality_score` are treated as 0.
    97	 *
    98	 * @param results - Candidate rows to filter.
    99	 * @param threshold - Minimum quality score in [0, 1] (inclusive).
   100	 * @returns Filtered array; original array returned unchanged when no threshold applies.
   101	 */
   102	function filterByMinQualityScore(
   103	  results: PipelineRow[],
   104	  threshold?: number
   105	): PipelineRow[] {
   106	  if (typeof threshold !== 'number' || !Number.isFinite(threshold)) {
   107	    return results;
   108	  }
   109	
   110	  const clampedThreshold = Math.max(0, Math.min(1, threshold));
   111	
   112	  return results.filter((row) => {
   113	    const rawScore = row.quality_score as number | undefined;
   114	    const score =
   115	      typeof rawScore === 'number' && Number.isFinite(rawScore) ? rawScore : 0;
   116	    return score >= clampedThreshold;
   117	  });
   118	}
   119	
   120	function backfillMissingQualityScores(results: PipelineRow[]): PipelineRow[] {
   121	  return results.map((row) => {
   122	    if (row.quality_score !== 0 && row.quality_score != null) {
   123	      return row;
   124	    }
   125	
   126	    return {
   127	      ...row,
   128	      quality_score: computeBackfillQualityScore(row),
   129	    };
   130	  });
   131	}
   132	
   133	function applyArchiveFilter(
   134	  results: PipelineRow[],
   135	  includeArchived: boolean
   136	): PipelineRow[] {
   137	  if (includeArchived) return results;
   138	  return results.filter((row) => {
   139	    const archived = row.is_archived ?? row.isArchived;
   140	    if (archived == null) return true;
   141	    if (typeof archived === 'number') return archived === 0;
   142	    if (typeof archived === 'boolean') return archived === false;
   143	    return true;
   144	  });
   145	}
   146	
   147	function applyFolderFilter(
   148	  results: PipelineRow[],
   149	  specFolder?: string
   150	): PipelineRow[] {
   151	  if (!specFolder) return results;
   152	  return results.filter((row) => {
   153	    const rowSpecFolder = row.spec_folder ?? row.specFolder;
   154	    return rowSpecFolder === specFolder;
   155	  });
   156	}
   157	
   158	function applyTierFilter(
   159	  results: PipelineRow[],
   160	  tier?: string
   161	): PipelineRow[] {
   162	  if (!tier) return results;
   163	  return results.filter((row) => row.importance_tier === tier);
   164	}
   165	
   166	/**
   167	 * Resolve the effective context type from a pipeline row.
   168	 *
   169	 * Rows may carry context type under either `contextType` (camelCase) or
   170	 * `context_type` (snake_case). This function normalises the lookup.
   171	 *
   172	 * @param row - The pipeline row to inspect.
   173	 * @returns The context type string, or `undefined` if absent.
   174	 */
   175	function resolveRowContextType(row: PipelineRow): string | undefined {
   176	  if (typeof row.contextType === 'string' && row.contextType.length > 0) {
   177	    return row.contextType;
   178	  }
   179	  if (typeof row.context_type === 'string' && row.context_type.length > 0) {
   180	    return row.context_type;
   181	  }
   182	  return undefined;
   183	}
   184	
   185	function mergeStringLists(...values: unknown[]): string[] {
   186	  const merged = new Set<string>();
   187	  for (const value of values) {
   188	    if (!Array.isArray(value)) {
   189	      continue;
   190	    }
   191	    for (const entry of value) {
   192	      if (typeof entry === 'string' && entry.length > 0) {
   193	        merged.add(entry);
   194	      }
   195	    }
   196	  }
   197	  return Array.from(merged);
   198	}
   199	
   200	function readFiniteScoreMap(value: unknown): Record<string, number> {
   201	  if (!value || typeof value !== 'object' || Array.isArray(value)) {
   202	    return {};
   203	  }
   204	
   205	  const normalized: Record<string, number> = {};
   206	  for (const [key, score] of Object.entries(value as Record<string, unknown>)) {
   207	    if (typeof score === 'number' && Number.isFinite(score)) {
   208	      normalized[key] = score;
   209	    }
   210	  }
   211	  return normalized;
   212	}
   213	
   214	function mergeScoreMaps(...maps: Array<Record<string, number>>): Record<string, number> {
   215	  const merged: Record<string, number> = {};
   216	  for (const map of maps) {
   217	    for (const [key, score] of Object.entries(map)) {
   218	      if (!(key in merged) || score > merged[key]!) {
   219	        merged[key] = score;
   220	      }
   221	    }
   222	  }
   223	  return merged;
   224	}
   225	
   226	function getCandidateSources(row: PipelineRow): string[] {
   227	  const explicitSources = mergeStringLists(row.sources);
   228	  if (explicitSources.length > 0) {
   229	    return explicitSources;
   230	  }
   231	  return typeof row.source === 'string' && row.source.length > 0 ? [row.source] : [];
   232	}
   233	
   234	function getCandidateSourceScores(row: PipelineRow): Record<string, number> {
   235	  const sourceScores = readFiniteScoreMap(row.sourceScores);
   236	  if (Object.keys(sourceScores).length > 0) {
   237	    return sourceScores;
   238	  }
   239	
   240	  const resolvedScore = resolveEffectiveScore(row);
   241	  if (resolvedScore <= 0) {
   242	    return {};
   243	  }
   244	
   245	  const fallbackScores: Record<string, number> = {};
   246	  for (const source of getCandidateSources(row)) {
   247	    fallbackScores[source] = resolvedScore;
   248	  }
   249	  return fallbackScores;
   250	}
   251	
   252	function annotateBranchScore(row: PipelineRow, branchLabel: string): Record<string, number> {
   253	  const existingBranchScores = readFiniteScoreMap(row.stage1BranchScores);
   254	  const effectiveScore = resolveEffectiveScore(row);
   255	  if (branchLabel.length === 0 || !Number.isFinite(effectiveScore)) {
   256	    return existingBranchScores;
   257	  }
   258	  return mergeScoreMaps(existingBranchScores, { [branchLabel]: effectiveScore });
   259	}
   260	
   261	function mergeCandidateRows(
   262	  existing: PipelineRow | undefined,
   263	  incoming: PipelineRow,
   264	  branchLabel: string,
   265	): PipelineRow {
   266	  const incomingBranchScores = annotateBranchScore(incoming, branchLabel);
   267	  if (!existing) {
   268	    const sources = getCandidateSources(incoming);
   269	    const channelAttribution = mergeStringLists(incoming.channelAttribution, sources);
   270	    return {
   271	      ...incoming,
   272	      sources: sources.length > 0 ? sources : incoming.sources,
   273	      channelAttribution: channelAttribution.length > 0 ? channelAttribution : incoming.channelAttribution,
   274	      sourceScores: Object.keys(getCandidateSourceScores(incoming)).length > 0
   275	        ? getCandidateSourceScores(incoming)
   276	        : incoming.sourceScores,
   277	      stage1BranchScores: Object.keys(incomingBranchScores).length > 0 ? incomingBranchScores : undefined,
   278	      stage1BranchCount: Object.keys(incomingBranchScores).length || incoming.stage1BranchCount,
   279	      channelCount: sources.length > 0 ? sources.length : incoming.channelCount,
   280	    };
   281	  }
   282	
   283	  const existingScore = resolveEffectiveScore(existing);
   284	  const incomingScore = resolveEffectiveScore(incoming);
   285	  const primary = incomingScore > existingScore ? incoming : existing;
   286	  const secondary = primary === incoming ? existing : incoming;
   287	
   288	  const mergedSources = mergeStringLists(getCandidateSources(existing), getCandidateSources(incoming));
   289	  const mergedChannelAttribution = mergeStringLists(
   290	    existing.channelAttribution,
   291	    incoming.channelAttribution,
   292	    mergedSources,
   293	  );
   294	  const mergedSourceScores = mergeScoreMaps(
   295	    getCandidateSourceScores(existing),
   296	    getCandidateSourceScores(incoming),
   297	  );
   298	  const mergedBranchScores = mergeScoreMaps(
   299	    readFiniteScoreMap(existing.stage1BranchScores),
   300	    incomingBranchScores,
   301	  );
   302	
   303	  return {
   304	    ...secondary,
   305	    ...primary,
   306	    sources: mergedSources.length > 0 ? mergedSources : primary.sources,
   307	    source: typeof primary.source === 'string' && primary.source.length > 0
   308	      ? primary.source
   309	      : (mergedSources[0] ?? primary.source),
   310	    channelAttribution: mergedChannelAttribution.length > 0
   311	      ? mergedChannelAttribution
   312	      : primary.channelAttribution,
   313	    sourceScores: Object.keys(mergedSourceScores).length > 0
   314	      ? mergedSourceScores
   315	      : primary.sourceScores,
   316	    stage1BranchScores: Object.keys(mergedBranchScores).length > 0
   317	      ? mergedBranchScores
   318	      : primary.stage1BranchScores,
   319	    stage1BranchCount: Object.keys(mergedBranchScores).length || primary.stage1BranchCount,
   320	    channelCount: mergedSources.length > 0 ? mergedSources.length : primary.channelCount,
   321	  };
   322	}
   323	
   324	function mergeCandidateBatches(
   325	  batches: Array<{ label: string; rows: PipelineRow[] }>,
   326	  options: { seedCandidates?: PipelineRow[]; seedLabel?: string } = {},
   327	): PipelineRow[] {
   328	  const merged = new Map<string, PipelineRow>();
   329	  const seedLabel = options.seedLabel ?? '';
   330	
   331	  for (const row of options.seedCandidates ?? []) {
   332	    const key = String(row.id);
   333	    merged.set(key, mergeCandidateRows(merged.get(key), row, seedLabel));
   334	  }
   335	
   336	  for (const batch of batches) {
   337	    for (const row of batch.rows) {
   338	      const key = String(row.id);
   339	      merged.set(key, mergeCandidateRows(merged.get(key), row, batch.label));
   340	    }
   341	  }
   342	
   343	  return Array.from(merged.values());
   344	}
   345	
   346	/**
   347	 * Build deep-mode query variants using rule-based synonym expansion.
   348	 *
   349	 * The original query is always the first variant. Up to `MAX_DEEP_QUERY_VARIANTS - 1`
   350	 * additional variants are produced by `expandQuery`. If expansion fails or produces
   351	 * no new terms, the array contains only the original query.
   352	 *
   353	 * Simple-query bypass (038): When R15 classifies the query as "simple",
   354	 * rule-based expansion is skipped — consistent with the R12 embedding-expansion
   355	 * path's `isExpansionActive()` gate. Simple queries do not benefit from synonym
   356	 * expansion and the additional search channels add latency without recall gain.
   357	 *
   358	 * Duplicates are eliminated via `Set` deduplication before slicing.
   359	 *
   360	 * @param query - The original search query string.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Stage2 Fusion
     3	// ───────────────────────────────────────────────────────────────
     4	// the rollout (R6): 4-Stage Retrieval Pipeline
     5	//
     6	// I/O CONTRACT:
     7	// Input:  Stage2Input { candidates: PipelineRow[], config, stage1Metadata }
     8	// Output: Stage2Output { scored: PipelineRow[], metadata }
     9	// Key invariants:
    10	//     - Every score modification in the pipeline happens exactly once here
    11	//     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
    12	//     - scored is sorted descending by effective composite score on exit
    13	// Side effects:
    14	//     - FSRS write-back to memory_index (when trackAccess=true) — DB write
    15	//     - Learned trigger and negative-feedback reads from DB
    16	//
    17	// PURPOSE: Single point for ALL scoring signals. Intent weights are
    18	// Applied ONCE here only — this is the architectural guard against
    19	// The G2 double-weighting recurrence bug.
    20	//
    21	// SIGNAL APPLICATION ORDER (must not be reordered — 13 steps):
    22	// 1.  Session boost           — working-memory attention amplification
    23	// 1a. Recency fusion          — time-decay bonus for recent memories
    24	// 2.  Causal boost            — graph-traversal neighbor amplification
    25	// 2a. Co-activation spreading — spreading activation from top-N seeds
    26	// 2b. Community co-retrieval  — N2c inject community co-members
    27	// 2c. Graph signals           — N2a momentum + N2b causal depth
    28	// 3.  Testing effect          — FSRS strengthening write-back (trackAccess)
    29	// 4.  Intent weights          — non-hybrid search post-scoring adjustment
    30	// 5.  Artifact routing        — class-based weight boosts
    31	// 6.  Feedback signals        — learned trigger boosts + negative demotions
    32	// 7.  Artifact limiting       — result count cap from routing strategy
    33	// 8.  Anchor metadata         — extract named ANCHOR sections (annotation)
    34	// 9.  Validation metadata     — spec quality signals enrichment + quality scoring
    35	//
    36	// Hybrid search already applies intent-aware scoring
    37	// Internally (RRF / RSF fusion). Post-search intent weighting is
    38	// Therefore ONLY applied for non-hybrid search types (vector,
    39	// Multi-concept). Applying it to hybrid results would double-count.
    40	//
    41	// SCORE AUDIT CONTRACT: Stage 2 writes the fused `score` field (steps 1-7).
    42	// Stage 3 (rerank) MAY overwrite `score` with the reranked value and MUST
    43	// preserve the original in `stage2Score` for auditability (see F2.02 fix).
    44	// Stage 4 (filter) MUST NOT mutate any score fields — it is read-only.
    45	// The canonical reranker output is `rerankerScore`; `score` is synced to it
    46	// for downstream consumer compatibility.
    47	
    48	import type Database from 'better-sqlite3';
    49	import path from 'path';
    50	import { readFile } from 'fs/promises';
    51	
    52	import { resolveEffectiveScore } from './types.js';
    53	import type { Stage2Input, Stage2Output, PipelineRow, IntentWeightsConfig, ArtifactRoutingConfig } from './types.js';
    54	
    55	import * as sessionBoost from '../session-boost.js';
    56	import * as causalBoost from '../causal-boost.js';
    57	import {
    58	  isEnabled as isCoActivationEnabled,
    59	  spreadActivation,
    60	  getRelatedMemoryCounts,
    61	  resolveCoActivationBoostFactor,
    62	} from '../../cognitive/co-activation.js';
    63	import type { SpreadResult } from '../../cognitive/co-activation.js';
    64	import { ensureAdaptiveTables, getAdaptiveMode } from '../../cognitive/adaptive-ranking.js';
    65	import * as fsrsScheduler from '../../cognitive/fsrs-scheduler.js';
    66	import { queryLearnedTriggers } from '../learned-feedback.js';
    67	import { applyNegativeFeedback, getNegativeFeedbackStats } from '../../scoring/negative-feedback.js';
    68	import {
    69	  isNegativeFeedbackEnabled,
    70	  isCommunityDetectionEnabled,
    71	  isGraphCalibrationProfileEnabled,
    72	  isGraphSignalsEnabled,
    73	  isUsageRankingEnabled,
    74	  resolveGraphWalkRolloutState,
    75	  isLearnedStage2CombinerEnabled,
    76	  isResultProvenanceEnabled,
    77	} from '../search-flags.js';
    78	import { applyCalibrationProfile } from '../graph-calibration.js';
    79	import { shadowScore, extractFeatureVector, loadModel } from '@spec-kit/shared/ranking/learned-combiner';
    80	import type { LearnedModel } from '@spec-kit/shared/ranking/learned-combiner';
    81	import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
    82	import { requireDb } from '../../../utils/db-helpers.js';
    83	import { computeRecencyScore } from '../../scoring/folder-scoring.js';
    84	import { enrichResultsWithAnchorMetadata } from '../anchor-metadata.js';
    85	import { enrichResultsWithValidationMetadata } from '../validation-metadata.js';
    86	// B4: Stage 2b enrichment extracted for decomposition clarity
    87	import { executeStage2bEnrichment } from './stage2b-enrichment.js';
    88	import { applyCommunityBoost } from '../../graph/community-detection.js';
    89	import { applyGraphSignals } from '../../graph/graph-signals.js';
    90	import { computeUsageBoost } from '../../graph/usage-ranking-signal.js';
    91	import { ensureUsageColumn } from '../../graph/usage-tracking.js';
    92	import { isGraphUnifiedEnabled } from '../graph-flags.js';
    93	import { sortDeterministicRows } from './ranking-contract.js';
    94	
    95	// Feature catalog: 4-stage pipeline architecture
    96	// Feature catalog: MPAB chunk-to-memory aggregation
    97	
    98	
    99	// -- Internal type aliases --
   100	
   101	/** A row with a resolved numeric base score for internal use. */
   102	interface ScoredRow extends PipelineRow {
   103	  intentAdjustedScore?: number;
   104	}
   105	
   106	/** Result of the strengthenOnAccess FSRS write-back. */
   107	interface StrengthenResult {
   108	  stability: number;
   109	  difficulty: number;
   110	}
   111	
   112	interface ValidationMetadataLike {
   113	  qualityScore?: number;
   114	  specLevel?: number;
   115	  completionStatus?: 'complete' | 'partial' | 'unknown';
   116	  hasChecklist?: boolean;
   117	}
   118	
   119	// -- Constants --
   120	
   121	/** Number of top results used as seeds for co-activation spreading. */
   122	const SPREAD_ACTIVATION_TOP_N = 5;
   123	const DEFAULT_LEARNED_STAGE2_MODEL_RELATIVE_PATH = path.join('models', 'learned-stage2-combiner.json');
   124	
   125	/** Recency fusion weight — controls how much recency score contributes to the fused score.
   126	 *  Env-tunable via SPECKIT_RECENCY_FUSION_WEIGHT (default 0.07). */
   127	const RECENCY_FUSION_WEIGHT = parseFloat(process.env.SPECKIT_RECENCY_FUSION_WEIGHT || '') || 0.07;
   128	
   129	/** Recency fusion cap — maximum bonus a candidate can receive from recency fusion.
   130	 *  Env-tunable via SPECKIT_RECENCY_FUSION_CAP (default 0.10). */
   131	const RECENCY_FUSION_CAP = parseFloat(process.env.SPECKIT_RECENCY_FUSION_CAP || '') || 0.10;
   132	
   133	const MIN_VALIDATION_MULTIPLIER = 0.8;
   134	const MAX_VALIDATION_MULTIPLIER = 1.2;
   135	
   136	type LearnedStage2ModelCacheEntry = {
   137	  path: string;
   138	  model: LearnedModel | null;
   139	};
   140	
   141	let cachedLearnedStage2Model: LearnedStage2ModelCacheEntry | null = null;
   142	let learnedStage2ModelLoadPromise: Promise<LearnedStage2ModelCacheEntry> | null = null;
   143	let learnedStage2ModelLoadPromisePath: string | null = null;
   144	
   145	function clampMultiplier(value: number): number {
   146	  if (!Number.isFinite(value)) return 1;
   147	  if (value < MIN_VALIDATION_MULTIPLIER) return MIN_VALIDATION_MULTIPLIER;
   148	  if (value > MAX_VALIDATION_MULTIPLIER) return MAX_VALIDATION_MULTIPLIER;
   149	  return value;
   150	}
   151	
   152	function isShadowLearningModelLoadEnabled(): boolean {
   153	  return process.env.SPECKIT_SHADOW_LEARNING?.toLowerCase().trim() === 'true';
   154	}
   155	
   156	function resolveLearnedStage2ModelPath(): string {
   157	  const configured = process.env.SPECKIT_LEARNED_STAGE2_MODEL?.trim();
   158	  if (!configured) {
   159	    return path.resolve(process.cwd(), DEFAULT_LEARNED_STAGE2_MODEL_RELATIVE_PATH);
   160	  }
   161	  if (path.isAbsolute(configured)) {
   162	    return configured;
   163	  }
   164	  return path.resolve(process.cwd(), configured);
   165	}
   166	
   167	async function loadPersistedLearnedStage2Model(): Promise<LearnedModel | null> {
   168	  if (!isShadowLearningModelLoadEnabled()) {
   169	    return null;
   170	  }
   171	
   172	  const modelPath = resolveLearnedStage2ModelPath();
   173	  if (cachedLearnedStage2Model?.path === modelPath) {
   174	    return cachedLearnedStage2Model.model;
   175	  }
   176	
   177	  if (learnedStage2ModelLoadPromise && learnedStage2ModelLoadPromisePath === modelPath) {
   178	    return (await learnedStage2ModelLoadPromise).model;
   179	  }
   180	
   181	  if (learnedStage2ModelLoadPromisePath !== modelPath) {
   182	    learnedStage2ModelLoadPromise = null;
   183	    learnedStage2ModelLoadPromisePath = null;
   184	  }
   185	
   186	  learnedStage2ModelLoadPromisePath = modelPath;
   187	  learnedStage2ModelLoadPromise = (async (): Promise<LearnedStage2ModelCacheEntry> => {
   188	    try {
   189	      const json = await readFile(modelPath, 'utf8');
   190	      const model = loadModel(json);
   191	      if (!model) {
   192	        console.warn(`[stage2-fusion] learned stage2 model at ${modelPath} is invalid; shadow scoring will use manual-only fallback`);
   193	      }
   194	      const entry = { path: modelPath, model };
   195	      cachedLearnedStage2Model = entry;
   196	      return entry;
   197	    } catch (err: unknown) {
   198	      const entry = { path: modelPath, model: null };
   199	      cachedLearnedStage2Model = entry;
   200	
   201	      const code = typeof err === 'object' && err !== null && 'code' in err
   202	        ? String((err as { code?: unknown }).code)
   203	        : '';
   204	      if (code !== 'ENOENT') {
   205	        const message = err instanceof Error ? err.message : String(err);
   206	        console.warn(`[stage2-fusion] learned stage2 model load failed: ${message}`);
   207	      }
   208	      return entry;
   209	    } finally {
   210	      learnedStage2ModelLoadPromise = null;
   211	      learnedStage2ModelLoadPromisePath = null;
   212	    }
   213	  })();
   214	
   215	  return (await learnedStage2ModelLoadPromise).model;
   216	}
   217	
   218	/**
   219	 * Apply validation-signal scoring at the Stage 2 single scoring point.
   220	 *
   221	 * Uses quality metadata extracted from spec artifacts to apply a bounded
   222	 * multiplier over the current composite score. This keeps S3 integrated
   223	 * in ranking while preserving score stability.
   224	 */
   225	function applyValidationSignalScoring(results: PipelineRow[]): PipelineRow[] {
   226	  if (!Array.isArray(results) || results.length === 0) return results;
   227	
   228	  const adjusted = results.map((row) => {
   229	    const metadata = row.validationMetadata as ValidationMetadataLike | undefined;
   230	    if (!metadata || typeof metadata !== 'object') return row;
   231	
   232	    const baseScore = resolveBaseScore(row);
   233	    const quality = typeof metadata.qualityScore === 'number' && Number.isFinite(metadata.qualityScore)
   234	      ? Math.max(0, Math.min(1, metadata.qualityScore))
   235	      : 0.5;
   236	
   237	    const qualityFactor = 0.9 + (quality * 0.2); // [0.9, 1.1]
   238	    const specLevelBonus = typeof metadata.specLevel === 'number' && Number.isFinite(metadata.specLevel)
   239	      ? Math.max(0, Math.min(0.06, (metadata.specLevel - 1) * 0.02))
   240	      : 0;
   241	
   242	    const completionBonus = metadata.completionStatus === 'complete'
   243	      ? 0.04
   244	      : metadata.completionStatus === 'partial'
   245	        ? 0.015
   246	        : 0;
   247	
   248	    const checklistBonus = metadata.hasChecklist ? 0.01 : 0;
   249	    const multiplier = clampMultiplier(qualityFactor + specLevelBonus + completionBonus + checklistBonus);
   250	    const scored = Math.min(1, Math.max(0, baseScore * multiplier));
   251	
   252	    if (scored === baseScore) return row;
   253	    return withSyncedScoreAliases(row, scored);
   254	  });
   255	
   256	  return sortDeterministicRows(adjusted as Array<PipelineRow & { id: number }>);
   257	}
   258	
   259	// -- Internal helpers --
   260	
   261	/**
   262	 * Replaced with shared resolveEffectiveScore()
   263	 * from types.ts. The shared function uses the correct fallback chain:
   264	 * intentAdjustedScore → rrfScore → score → similarity/100, all clamped to [0,1].
   265	 * This alias ensures all call sites use the shared implementation.
   266	 */
   267	const resolveBaseScore = resolveEffectiveScore;
   268	
   269	function withSyncedScoreAliases(row: PipelineRow, score: number): PipelineRow {
   270	  // F2.03 fix: Clamp to [0,1] so downstream consumers never see raw boosted values > 1.
   271	  const clamped = Math.max(0, Math.min(1, score));
   272	  return {
   273	    ...row,
   274	    score: clamped,
   275	    rrfScore: clamped,
   276	    intentAdjustedScore: clamped,
   277	    // Preserve attentionScore — it is set by the attention-decay module and
   278	    // must not be overwritten with the fusion/ranking score.
   279	  };
   280	}
   281	
   282	function syncScoreAliasesInPlace(rows: PipelineRow[]): void {
   283	  for (const row of rows) {
   284	    if (typeof row.score !== 'number' || !Number.isFinite(row.score)) continue;
   285	    // F2.03 fix: Clamp to [0,1] during in-place sync.
   286	    const clamped = Math.max(0, Math.min(1, row.score));
   287	    row.score = clamped;
   288	    row.rrfScore = clamped;
   289	    row.intentAdjustedScore = clamped;
   290	    // Preserve attentionScore — it is set by the attention-decay module and
   291	    // must not be overwritten with the fusion/ranking score.
   292	  }
   293	}
   294	
   295	type GraphContributionKey = 'causalDelta' | 'coActivationDelta' | 'communityDelta' | 'graphSignalDelta';
   296	
   297	function withGraphContribution(
   298	  row: PipelineRow,
   299	  key: GraphContributionKey,
   300	  delta: number,
   301	  source: string,
   302	  injected: boolean = false,
   303	): PipelineRow {
   304	  const current = (row.graphContribution && typeof row.graphContribution === 'object')
   305	    ? row.graphContribution as Record<string, unknown>
   306	    : {};
   307	  const sources = Array.isArray(current.sources)
   308	    ? current.sources.filter((value): value is string => typeof value === 'string')
   309	    : [];
   310	  const nextSources = sources.includes(source) ? sources : [...sources, source];
   311	  const currentValue = typeof current[key] === 'number' && Number.isFinite(current[key]) ? current[key] : 0;
   312	  const totalDelta = ['causalDelta', 'coActivationDelta', 'communityDelta', 'graphSignalDelta']
   313	    .reduce((sum, field) => {
   314	      const existing = field === key ? currentValue + delta : current[field];
   315	      return sum + (typeof existing === 'number' && Number.isFinite(existing) ? existing : 0);
   316	    }, 0);
   317	  return {
   318	    ...row,
   319	    graphContribution: {
   320	      ...current,
   321	      [key]: currentValue + delta,
   322	      totalDelta,
   323	      sources: nextSources,
   324	      injected: current.injected === true || injected,
   325	    },
   326	  };
   327	}
   328	
   329	function countGraphContribution(rows: PipelineRow[], key: GraphContributionKey): number {
   330	  return rows.filter((row) => {
   331	    const graphContribution = row.graphContribution as Record<string, unknown> | undefined;
   332	    return typeof graphContribution?.[key] === 'number' && Math.abs(graphContribution[key] as number) > 0;
   333	  }).length;
   334	}
   335	
   336	function countGraphInjected(rows: PipelineRow[]): number {
   337	  return rows.filter((row) => {
   338	    const graphContribution = row.graphContribution as Record<string, unknown> | undefined;
   339	    return graphContribution?.injected === true;
   340	  }).length;

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Stage3 Rerank
     3	// ───────────────────────────────────────────────────────────────
     4	// 4-Stage Retrieval Pipeline: Stage 3 of 4
     5	//
     6	// Responsibilities (in execution order):
     7	// 1. Cross-encoder reranking   — re-scores results via neural model
     8	// 2. MMR diversity pruning     — maximal marginal relevance (SPECKIT_MMR flag)
     9	// 3. MPAB chunk collapse        — dedup chunks, reassemble parents
    10	//
    11	// Pipeline position constraint:
    12	// MPAB MUST remain AFTER RRF fusion (Stage 2).
    13	// Stage 3 is the only stage that may change scores after Stage 2.
    14	//
    15	// I/O CONTRACT:
    16	// Input:  Stage3Input { scored: PipelineRow[], config }
    17	// Output: Stage3Output { reranked: PipelineRow[], metadata }
    18	// Key invariants:
    19	//     - reranked is sorted descending by effective score after all steps
    20	//     - Chunk rows (parent_id != null) are collapsed; only parent rows exit
    21	//     - contentSource is set to 'reassembled_chunks' or 'file_read_fallback'
    22	// Side effects:
    23	//     - Cross-encoder model inference (external call, when SPECKIT_CROSS_ENCODER on)
    24	//     - DB reads to fetch parent content during MPAB reassembly
    25	//
    26	// Score changes: YES
    27	
    28	import { resolveEffectiveScore } from './types.js';
    29	import type { Stage3Input, Stage3Output, PipelineRow } from './types.js';
    30	import * as crossEncoder from '../cross-encoder.js';
    31	import { rerankLocal } from '../local-reranker.js';
    32	import { isCrossEncoderEnabled, isMMREnabled, isLocalRerankerEnabled } from '../search-flags.js';
    33	import { computeMPAB } from '../../scoring/mpab-aggregation.js';
    34	import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
    35	import type { MMRCandidate } from '@spec-kit/shared/algorithms/mmr-reranker';
    36	import { INTENT_LAMBDA_MAP } from '../intent-classifier.js';
    37	import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
    38	import { requireDb } from '../../../utils/index.js';
    39	import { toErrorMessage } from '../../../utils/index.js';
    40	import type Database from 'better-sqlite3';
    41	import { compareDeterministicRows, sortDeterministicRows } from './ranking-contract.js';
    42	
    43	// Feature catalog: 4-stage pipeline architecture
    44	// Feature catalog: Hybrid search pipeline
    45	
    46	
    47	// -- Constants --------------------------------------------------
    48	
    49	/** Minimum number of results required before cross-encoder is worth invoking. */
    50	const MIN_RESULTS_FOR_RERANK = 2;
    51	
    52	/** Minimum number of candidates required before MMR diversity pruning is worthwhile. */
    53	const MMR_MIN_CANDIDATES = 2;
    54	
    55	/** Fallback lambda (diversity vs relevance) when intent is not in INTENT_LAMBDA_MAP. */
    56	const MMR_DEFAULT_LAMBDA = 0.7;
    57	
    58	/** Column order priority for assembling display text sent to cross-encoder. */
    59	const TEXT_FIELD_PRIORITY = ['content', 'file_path'] as const;
    60	
    61	/**
    62	 * Enforce non-negative score outputs at Stage 3 rerank boundaries.
    63	 */
    64	function floorScore(value: number): number {
    65	  return Math.max(0, value);
    66	}
    67	
    68	function resolveRerankOutputScore(raw: unknown, fallback: number): number {
    69	  if (typeof raw === 'number' && Number.isFinite(raw)) {
    70	    return floorScore(raw);
    71	  }
    72	  return floorScore(fallback);
    73	}
    74	
    75	// -- Internal Interfaces ----------------------------------------
    76	
    77	/**
    78	 * Document format consumed by the cross-encoder reranker.
    79	 * Matches the RerankDocument interface in cross-encoder.ts:
    80	 *   { id: number | string; content: string; title?: string; [key: string]: unknown }
    81	 */
    82	interface RerankDocument {
    83	  id: string | number;
    84	  content: string;
    85	  score?: number;
    86	  [key: string]: unknown;
    87	}
    88	
    89	/**
    90	 * Aggregated statistics from the MPAB chunk-collapse pass.
    91	 */
    92	interface ChunkReassemblyStats {
    93	  /** Number of child chunk rows removed from the result set. */
    94	  collapsedChunkHits: number;
    95	  /** Number of distinct parent IDs encountered among chunk hits. */
    96	  chunkParents: number;
    97	  /** Number of parents whose content was successfully reassembled from DB. */
    98	  reassembled: number;
    99	  /** Number of parents that fell back to using best-chunk content. */
   100	  fallback: number;
   101	}
   102	
   103	/**
   104	 * Internal representation of a chunk group — all chunks belonging
   105	 * to a single parent, ready for collapse and reassembly.
   106	 */
   107	interface ChunkGroup {
   108	  parentId: number;
   109	  chunks: PipelineRow[];
   110	  /** The chunk with the highest similarity/score — the representative row. */
   111	  bestChunk: PipelineRow;
   112	  /** Parent-level score derived from all chunk scores with a best-chunk floor. */
   113	  parentScore: number;
   114	}
   115	
   116	type RerankProvider = 'cross-encoder' | 'local-gguf' | 'fallback-sort' | 'none';
   117	
   118	// -- Stage 3 Entry Point ----------------------------------------
   119	
   120	/**
   121	 * Execute Stage 3: Rerank + Aggregate.
   122	 *
   123	 * Applies cross-encoder reranking (if enabled) and then collapses
   124	 * chunked memory hits into their parent documents (MPAB). The order
   125	 * is intentional: cross-encoder scores are computed on the raw chunks
   126	 * (fine-grained text), then parent reassembly aggregates the results.
   127	 *
   128	 * @param input - Stage 3 input containing scored results from Stage 2
   129	 *   and the shared pipeline configuration.
   130	 * @returns Stage 3 output with reranked, aggregated results and metadata.
   131	 */
   132	export async function executeStage3(input: Stage3Input): Promise<Stage3Output> {
   133	  const stageStart = Date.now();
   134	  const { scored, config } = input;
   135	
   136	  let results = scored;
   137	  let rerankApplied = false;
   138	  let rerankProvider: RerankProvider = 'none';
   139	
   140	  // -- Step 1: Cross-encoder reranking ---------------------------
   141	  const rerankStart = Date.now();
   142	  const beforeRerank = results.length;
   143	
   144	  // Destructure { rows, applied } — dedicated boolean flag replaces
   145	  // Fragile reference inequality check `results !== scored` (A1-P2-3)
   146	  const rerankResult = await applyCrossEncoderReranking(config.query, results, {
   147	    rerank: config.rerank,
   148	    applyLengthPenalty: config.applyLengthPenalty,
   149	    limit: config.limit,
   150	  });
   151	  results = rerankResult.rows;
   152	  rerankApplied = rerankResult.applied;
   153	  rerankProvider = rerankResult.provider;
   154	
   155	  if (config.trace) {
   156	    addTraceEntry(
   157	      config.trace,
   158	      'rerank',
   159	      beforeRerank,
   160	      results.length,
   161	      Date.now() - rerankStart,
   162	      { rerankApplied, provider: rerankProvider }
   163	    );
   164	  }
   165	
   166	  // -- Step 2: MMR diversity pruning ----------------------------
   167	  // Gated behind SPECKIT_MMR feature flag. Retrieves embeddings from
   168	  // Vec_memories and applies Maximal Marginal Relevance to diversify
   169	  // The result set, matching the V1 hybrid-search behavior.
   170	  if (isMMREnabled() && results.length >= MMR_MIN_CANDIDATES) {
   171	    try {
   172	      const db = requireDb() as Database.Database;
   173	      const numericIds = results
   174	        .map(r => r.id)
   175	        .filter((id): id is number => typeof id === 'number');
   176	
   177	      if (numericIds.length >= MMR_MIN_CANDIDATES) {
   178	        const placeholders = numericIds.map(() => '?').join(', ');
   179	        const embRows = (db.prepare(
   180	          `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
   181	        ) as Database.Statement).all(...numericIds) as Array<{ rowid: number; embedding: Buffer }>;
   182	
   183	        const embeddingMap = new Map<number, Float32Array>();
   184	        for (const row of embRows) {
   185	          if (Buffer.isBuffer(row.embedding)) {
   186	            embeddingMap.set(
   187	              row.rowid,
   188	              new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
   189	            );
   190	          }
   191	        }
   192	
   193	        const mmrCandidates: MMRCandidate[] = [];
   194	        for (const r of results) {
   195	          const emb = embeddingMap.get(r.id);
   196	          if (emb) {
   197	            mmrCandidates.push({
   198	              id: r.id,
   199	              // Use effectiveScore() for consistent fallback chain
   200	              score: floorScore(effectiveScore(r)),
   201	              embedding: emb,
   202	            });
   203	          }
   204	        }
   205	
   206	        if (mmrCandidates.length >= MMR_MIN_CANDIDATES) {
   207	          const originalPositionMap = new Map<number | string, number>();
   208	          results.forEach((row, index) => originalPositionMap.set(row.id, index));
   209	          const intent = config.detectedIntent ?? '';
   210	          const mmrLambda = (INTENT_LAMBDA_MAP as Record<string, number>)[intent] ?? MMR_DEFAULT_LAMBDA;
   211	          const diversified = applyMMR(mmrCandidates, { lambda: mmrLambda, limit: config.limit });
   212	
   213	          // FIX #5: MMR can only diversify rows that have embeddings. Non-embedded
   214	          // rows (lexical-only hits, graph injections) must be preserved and merged
   215	          // back in their original relative order instead of being silently dropped.
   216	          const embeddedIdSet = new Set(mmrCandidates.map(c => c.id));
   217	          const nonEmbeddedRows = results.filter(r => !embeddedIdSet.has(r.id));
   218	
   219	          // Rebuild PipelineRow[] from diversified candidates, preserving all original fields
   220	          const rowMap = new Map<number | string, PipelineRow>();
   221	          for (const r of results) rowMap.set(r.id, r);
   222	
   223	          const diversifiedRows = diversified.map((candidate): PipelineRow => {
   224	            const existing = rowMap.get(candidate.id);
   225	            if (existing) return existing;
   226	            return { id: candidate.id as number, score: candidate.score };
   227	          });
   228	
   229	          const positioned: Array<{ row: PipelineRow; pos: number }> = [];
   230	          diversifiedRows.forEach((row, index) => positioned.push({ row, pos: index }));
   231	          nonEmbeddedRows.forEach((row) => {
   232	            const originalPosition = originalPositionMap.get(row.id) ?? results.length;
   233	            positioned.push({ row, pos: originalPosition });
   234	          });
   235	
   236	          positioned.sort((left, right) => left.pos - right.pos);
   237	          results = positioned.map(({ row }) => row);
   238	        }
   239	      }
   240	    } catch (mmrErr: unknown) {
   241	      // Non-critical — MMR failure does not block pipeline
   242	      console.warn(`[stage3-rerank] MMR diversity pruning failed: ${toErrorMessage(mmrErr)}`);
   243	    }
   244	  }
   245	
   246	  // -- Step 3: MPAB chunk collapse + parent reassembly -----------
   247	  //
   248	  // MPAB must remain AFTER RRF (Stage 2 constraint). This step runs
   249	  // Here in Stage 3 — never move it upstream.
   250	  const mpabStart = Date.now();
   251	  const beforeMpab = results.length;
   252	
   253	  const { results: aggregated, stats: chunkStats } =
   254	    await collapseAndReassembleChunkResults(results);
   255	
   256	  results = aggregated;
   257	
   258	  if (config.trace) {
   259	    addTraceEntry(
   260	      config.trace,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Orchestrator
     3	// ───────────────────────────────────────────────────────────────
     4	// 4-stage pipeline execution with per-stage error handling and timeouts.
     5	//
     6	// B1 FIX: Each stage is wrapped in try/catch with withTimeout().
     7	// Stage 1 is mandatory (throws on failure — no candidates = no results).
     8	// Stages 2-4 fall back to previous stage output with degraded metadata.
     9	// Timing is recorded for latency observability.
    10	//
    11	// I/O CONTRACT:
    12	// Input:  PipelineConfig (query, embedding, limits, flags, intent, session)
    13	// Output: PipelineResult { results: Stage4ReadonlyRow[], metadata, annotations, trace }
    14	// Key invariants:
    15	//     - results are scored by Stage 2, reranked by Stage 3, filtered by Stage 4
    16	//     - Score fields are frozen after Stage 3; Stage 4 output scores == Stage 3 output scores
    17	//     - Stage metadata for all four stages is included for observability
    18	//     - When a stage degrades, metadata.degraded = true and timing tracks each stage
    19	// Side effects:
    20	//     - Delegates to each stage; see individual stage modules for their side effects
    21	
    22	import type {
    23	  PipelineConfig,
    24	  PipelineResult,
    25	  Stage1Output,
    26	  Stage2Output,
    27	  Stage3Output,
    28	  Stage4Output,
    29	  Stage4ReadonlyRow,
    30	  SignalStatus,
    31	} from './types.js';
    32	
    33	import { executeStage1 } from './stage1-candidate-gen.js';
    34	import { executeStage2 } from './stage2-fusion.js';
    35	import { executeStage3 } from './stage3-rerank.js';
    36	import { executeStage4 } from './stage4-filter.js';
    37	import { MemoryError, withTimeout } from '../../errors/core.js';
    38	
    39	// Feature catalog: 4-stage pipeline architecture
    40	// Feature catalog: 4-stage pipeline refactor
    41	
    42	
    43	/** Per-stage timeout in milliseconds. */
    44	const STAGE_TIMEOUT_MS = 10_000;
    45	
    46	/**
    47	 * Execute the 4-stage retrieval pipeline with per-stage error handling.
    48	 *
    49	 * Stage 1: Candidate Generation — MANDATORY (throws on failure)
    50	 * Stage 2: Fusion + Signal Integration — falls back to unsorted candidates
    51	 * Stage 3: Rerank + Aggregate — falls back to unranked scored results
    52	 * Stage 4: Filter + Annotate — falls back to unfiltered results
    53	 *
    54	 * @param config Pipeline configuration derived from search args
    55	 * @returns Pipeline result with stage metadata and timing
    56	 */
    57	export async function executePipeline(config: PipelineConfig): Promise<PipelineResult> {
    58	  const timing: Record<string, number> = {};
    59	  const pipelineStart = Date.now();
    60	  let degraded = false;
    61	
    62	  // -- Stage 1: Candidate Generation (MANDATORY — no fallback possible) --
    63	  let stage1Result: Stage1Output;
    64	  try {
    65	    const t0 = Date.now();
    66	    stage1Result = await withTimeout(
    67	      executeStage1({ config }),
    68	      STAGE_TIMEOUT_MS,
    69	      'Stage 1: Candidate Generation',
    70	    );
    71	    timing.stage1 = Date.now() - t0;
    72	  } catch (err) {
    73	    throw new MemoryError(
    74	      'PIPELINE_STAGE1_FAILED',
    75	      `Candidate generation failed: ${err instanceof Error ? err.message : String(err)}`,
    76	      { cause: err instanceof Error ? err.message : String(err) },
    77	    );
    78	  }
    79	
    80	  // -- Stage 2: Fusion + Signal Integration (falls back to unsorted candidates) --
    81	  let stage2Result: Stage2Output;
    82	  try {
    83	    const t0 = Date.now();
    84	    stage2Result = await withTimeout(
    85	      executeStage2({
    86	        candidates: stage1Result.candidates,
    87	        config,
    88	        stage1Metadata: stage1Result.metadata,
    89	      }),
    90	      STAGE_TIMEOUT_MS,
    91	      'Stage 2: Fusion',
    92	    );
    93	    timing.stage2 = Date.now() - t0;
    94	  } catch (err) {
    95	    const msg = err instanceof Error ? err.message : String(err);
    96	    console.warn(`[pipeline] Stage 2 failed, returning unscored candidates: ${msg}`);
    97	    degraded = true;
    98	    stage2Result = {
    99	      scored: stage1Result.candidates,
   100	      metadata: {
   101	        sessionBoostApplied: 'failed' as SignalStatus,
   102	        causalBoostApplied: 'failed' as SignalStatus,
   103	        intentWeightsApplied: 'failed' as SignalStatus,
   104	        artifactRoutingApplied: 'failed' as SignalStatus,
   105	        feedbackSignalsApplied: 'failed' as SignalStatus,
   106	        qualityFiltered: 0,
   107	        durationMs: 0,
   108	      },
   109	    };
   110	    timing.stage2 = 0;
   111	  }
   112	
   113	  // -- Stage 3: Rerank + Aggregate (falls back to unranked scored results) --
   114	  let stage3Result: Stage3Output;
   115	  try {
   116	    const t0 = Date.now();
   117	    stage3Result = await withTimeout(
   118	      executeStage3({
   119	        scored: stage2Result.scored,
   120	        config,
   121	      }),
   122	      STAGE_TIMEOUT_MS,
   123	      'Stage 3: Rerank',
   124	    );
   125	    timing.stage3 = Date.now() - t0;
   126	  } catch (err) {
   127	    const msg = err instanceof Error ? err.message : String(err);
   128	    console.warn(`[pipeline] Stage 3 failed, returning unranked results: ${msg}`);
   129	    degraded = true;
   130	    stage3Result = {
   131	      reranked: stage2Result.scored,
   132	      metadata: {
   133	        rerankApplied: false,
   134	        chunkReassemblyStats: {
   135	          collapsedChunkHits: 0,
   136	          chunkParents: 0,
   137	          reassembled: 0,
   138	          fallback: 0,
   139	        },
   140	        durationMs: 0,
   141	      },
   142	    };
   143	    timing.stage3 = 0;
   144	  }
   145	
   146	  // -- Stage 4: Filter + Annotate (falls back to unfiltered results) --
   147	  let stage4Result: Stage4Output;
   148	  try {
   149	    const t0 = Date.now();
   150	    stage4Result = await withTimeout(
   151	      executeStage4({
   152	        results: stage3Result.reranked as Stage4ReadonlyRow[],
   153	        config,
   154	        stage1Metadata: { constitutionalInjected: stage1Result.metadata.constitutionalInjected },
   155	      }),
   156	      STAGE_TIMEOUT_MS,
   157	      'Stage 4: Filter',
   158	    );
   159	    timing.stage4 = Date.now() - t0;
   160	  } catch (err) {
   161	    const msg = err instanceof Error ? err.message : String(err);
   162	    console.warn(`[pipeline] Stage 4 failed, returning unfiltered results: ${msg}`);
   163	    degraded = true;
   164	    stage4Result = {
   165	      final: stage3Result.reranked as Stage4ReadonlyRow[],
   166	      metadata: {
   167	        stateFiltered: 0,
   168	        constitutionalInjected: stage1Result.metadata.constitutionalInjected,
   169	        evidenceGapDetected: false,
   170	        durationMs: 0,
   171	      },
   172	      annotations: {
   173	        stateStats: {},
   174	        featureFlags: {},
   175	      },
   176	    };
   177	    timing.stage4 = 0;
   178	  }
   179	
   180	  timing.total = Date.now() - pipelineStart;
   181	
   182	  return {
   183	    results: stage4Result.final,
   184	    metadata: {
   185	      stage1: stage1Result.metadata,
   186	      stage2: stage2Result.metadata,
   187	      stage3: stage3Result.metadata,
   188	      stage4: stage4Result.metadata,
   189	      timing,
   190	      degraded: degraded || undefined,
   191	    },
   192	    annotations: stage4Result.annotations,
   193	    trace: config.trace,
   194	  };
   195	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Triggers
     3	// ───────────────────────────────────────────────────────────────
     4	// Shared packages
     5	import { validateFilePath } from '@spec-kit/shared/utils/path-security';
     6	
     7	// Feature catalog: Trigger phrase matching (memory_match_triggers)
     8	// Feature catalog: BM25 trigger phrase re-index gate
     9	
    10	
    11	/* ───────────────────────────────────────────────────────────────
    12	   1. DEPENDENCIES
    13	──────────────────────────────────────────────────────────────── */
    14	
    15	// Core utilities
    16	import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
    17	import { toErrorMessage } from '../utils/index.js';
    18	import { createFilePathValidator } from '../utils/validators.js';
    19	
    20	// Formatters
    21	import { calculateTokenMetrics, type TokenMetrics } from '../formatters/index.js';
    22	
    23	// Lib modules
    24	import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
    25	import * as workingMemory from '../lib/cognitive/working-memory.js';
    26	import * as attentionDecay from '../lib/cognitive/attention-decay.js';
    27	import * as tierClassifier from '../lib/cognitive/tier-classifier.js';
    28	import type { TierInput, StateStats } from '../lib/cognitive/tier-classifier.js';
    29	import * as coActivation from '../lib/cognitive/co-activation.js';
    30	
    31	// REQ-019: Standardized Response Structure
    32	import { createMCPSuccessResponse, createMCPEmptyResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
    33	// T004: Consumption instrumentation
    34	import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
    35	
    36	// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
    37	import { logSearchQuery, logFinalResult } from '../lib/eval/eval-logger.js';
    38	
    39	// Shared handler types
    40	import type { MCPResponse } from './types.js';
    41	// C2 FIX: Import DB access for scope filtering
    42	import { initialize_db } from '../lib/search/vector-index-store.js';
    43	// T73: Import session manager for trusted session validation (IDOR prevention)
    44	import * as sessionManager from '../lib/session/session-manager.js';
    45	
    46	/* ───────────────────────────────────────────────────────────────
    47	   2. TYPES
    48	──────────────────────────────────────────────────────────────── */
    49	
    50	interface TriggerMatch {
    51	  memoryId: number;
    52	  specFolder: string;
    53	  filePath: string;
    54	  title: string | null;
    55	  matchedPhrases: string[];
    56	  importanceWeight: number;
    57	  [key: string]: unknown;
    58	}
    59	
    60	interface EnrichedTriggerMatch extends TriggerMatch {
    61	  attentionScore: number;
    62	  tier: string;
    63	  coActivated: boolean;
    64	}
    65	
    66	interface FormattedResult {
    67	  memoryId: number;
    68	  specFolder: string;
    69	  filePath: string;
    70	  title: string | null;
    71	  matchedPhrases: string[];
    72	  importanceWeight: number;
    73	  tier?: string;
    74	  attentionScore?: number;
    75	  content?: string;
    76	  coActivated?: boolean;
    77	  [key: string]: unknown;
    78	}
    79	
    80	interface DecayStats {
    81	  decayedCount: number;
    82	}
    83	
    84	interface CoActivatedMemory {
    85	  memoryId: number;
    86	}
    87	
    88	interface WorkingMemoryEntry {
    89	  memoryId: number;
    90	  attentionScore: number;
    91	}
    92	
    93	interface CognitiveStats {
    94	  enabled: boolean;
    95	  sessionId: string;
    96	  turnNumber: number;
    97	  decayApplied: number;
    98	  memoriesActivated: number;
    99	  coActivations: number;
   100	  tierDistribution: StateStats;
   101	  tokenMetrics: TokenMetrics;
   102	}
   103	
   104	interface TriggerArgs {
   105	  prompt: string;
   106	  specFolder?: string;
   107	  limit?: number;
   108	  session_id?: string;
   109	  turnNumber?: number;
   110	  include_cognitive?: boolean;
   111	  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
   112	  tenantId?: string;
   113	  userId?: string;
   114	  agentId?: string;
   115	  sharedSpaceId?: string;
   116	}
   117	
   118	/* ───────────────────────────────────────────────────────────────
   119	   2b. CONSTANTS
   120	──────────────────────────────────────────────────────────────── */
   121	
   122	/** Per-turn decay rate for attention scoring. */
   123	const TURN_DECAY_RATE = 0.98;
   124	const validateTieredFilePath = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);
   125	
   126	/* ───────────────────────────────────────────────────────────────
   127	   2c. HELPER FUNCTIONS
   128	──────────────────────────────────────────────────────────────── */
   129	
   130	/** Fetch full memory records required for FSRS tier classification. */
   131	function fetchMemoryRecords(memoryIds: number[]): Map<number, TierInput> {
   132	  const records = new Map<number, TierInput>();
   133	  if (memoryIds.length === 0) return records;
   134	
   135	  const db = attentionDecay.getDb();
   136	  if (!db) return records;
   137	
   138	  try {
   139	    const stmt = db.prepare(
   140	      'SELECT * FROM memory_index WHERE id = ?'
   141	    );
   142	    for (const id of memoryIds) {
   143	      const row = stmt.get(id) as TierInput | undefined;
   144	      if (row) {
   145	        records.set(row.id as number, row);
   146	      }
   147	    }
   148	  } catch (err: unknown) {
   149	    const message = toErrorMessage(err);
   150	    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
   151	  }
   152	
   153	  return records;
   154	}
   155	
   156	/** Get tiered content for a memory based on its tier state (HOT=full, WARM=summary, COLD=excluded) */
   157	async function getTieredContent(
   158	  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
   159	  tier: string
   160	): Promise<string> {
   161	  if (tier === 'COLD' || tier === 'DORMANT' || tier === 'ARCHIVED') return '';
   162	  try {
   163	    const fs = await import('fs');
   164	    const validatedPath = validateTieredFilePath(memoryInfo.filePath);
   165	    const canonicalPath = validateTieredFilePath(fs.realpathSync(validatedPath));
   166	    const content = fs.readFileSync(canonicalPath, 'utf-8');
   167	    if (tier === 'HOT') return content;
   168	    // WARM tier returns truncated summary
   169	    return content.substring(0, 150) + (content.length > 150 ? '...' : '');
   170	  } catch (_error: unknown) {
   171	    console.warn('[memory-triggers] getTieredContent failed', {
   172	      filePath: memoryInfo.filePath, // server-side only; safe to log
   173	      tier,
   174	      error: _error instanceof Error ? _error.message : String(_error),
   175	    });
   176	    return '';
   177	  }
   178	}
   179	
   180	/* ───────────────────────────────────────────────────────────────
   181	   3. MATCH TRIGGERS HANDLER
   182	──────────────────────────────────────────────────────────────── */
   183	
   184	/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
   185	async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
   186	  const {
   187	    prompt,
   188	    limit: rawLimit = 3,
   189	    session_id: rawSessionId,
   190	    turnNumber: rawTurnNumber = 1,
   191	    include_cognitive: includeCognitive = true
   192	  } = args;
   193	
   194	  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
   195	  if (!prompt || typeof prompt !== 'string') {
   196	    return createMCPErrorResponse({
   197	      tool: 'memory_match_triggers',
   198	      error: 'prompt is required and must be a string',
   199	      code: 'E_VALIDATION',
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

exec
/bin/zsh -lc "rg -n \"executePipeline\\(|searchType|mode === 'deep'|retrievalLevel|vector_search|multi_concept_search|hybridSearch|handleMemorySearch|hybrid\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:14://   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:16://   - hybrid: collectRawCandidates → falls back to vector on failure
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:40:import * as hybridSearch from '../hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:79:/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:458: * Selects and runs the appropriate search channel(s) based on `config.searchType`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:480:    searchType,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508:  // the query for the hybrid search channel, improving recall for alias-rich
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:513:  /** Effective query for hybrid search — may be expanded by concept routing. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:516:  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:569:  if (searchType === 'multi-concept' && Array.isArray(concepts) && concepts.length >= 2) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:604:  else if (searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:613:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616:    // Deep mode: expand query into variants and run hybrid for each, then dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:617:    if (mode === 'deep' && isMultiQueryEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:621:      // sub-query facets and run hybrid search per facet. Results are merged
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:654:            // Run hybrid for the original query plus each facet, in parallel
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:666:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:729:                const variantResults = await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:759:            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:761:          // Fall through to single hybrid search below
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:763:          candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:770:        // ExpandQuery returned only the original; treat as standard hybrid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:772:        candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:811:              hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:828:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:864:            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:869:      // Standard hybrid search — runs when R12 is off, suppressed by R15,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:875:          const hybridResults = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:880:          candidates = hybridResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:881:        } catch (hybridErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:882:          const hybridMsg =
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:883:            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:885:            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:910:              reason: hybridMsg,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:921:  else if (searchType === 'vector') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:953:      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:961:  // Exception: for hybrid search, tier/contextType are applied here because
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1079:  // When SPECKIT_LLM_REFORMULATION is enabled and mode === 'deep':
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1082:  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1088:  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1109:              return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1166:  // When SPECKIT_HYDE is enabled and mode === 'deep':
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1176:  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1382:        searchType,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1385:        deepExpansion: mode === 'deep' && isMultiQueryEnabled(),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1392:  // while channelCount counts parallel query variants. In hybrid mode both vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1394:  const activeChannels = searchType === 'hybrid' ? 2 : 1;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1399:      searchType,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:214:  retrievalLevel?: 'local' | 'global' | 'auto';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:486:async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:529:    retrievalLevel: retrievalLevel = 'auto',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:775:      searchType: (hasValidConcepts && concepts!.length >= 2)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:777:        : 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:809:    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:822:        (retrievalLevel === 'global') ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:823:        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:992:      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:999:      pipelineConfig.searchType,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1357:  handleMemorySearch,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '120,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '520,920p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   761	    responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
   762	  } else {
   763	    // Wait for embedding model only on cache miss
   764	    if (!isEmbeddingModelReady()) {
   765	      const modelReady = await waitForEmbeddingModel(30000);
   766	      if (!modelReady) {
   767	        throw new Error('Embedding model not ready after 30s timeout. Try again later.');
   768	      }
   769	    }
   770	
   771	    // V2 pipeline is the only path (legacy V1 removed from the runtime pipeline)
   772	    const pipelineConfig: PipelineConfig = {
   773	      query: effectiveQuery,
   774	      concepts: hasValidConcepts ? concepts : undefined,
   775	      searchType: (hasValidConcepts && concepts!.length >= 2)
   776	        ? 'multi-concept'
   777	        : 'hybrid',
   778	      mode,
   779	      limit,
   780	      specFolder,
   781	      tenantId: normalizedScope.tenantId,
   782	      userId: normalizedScope.userId,
   783	      agentId: normalizedScope.agentId,
   784	      sharedSpaceId: normalizedScope.sharedSpaceId,
   785	      tier,
   786	      contextType,
   787	      includeArchived,
   788	      includeConstitutional,
   789	      includeContent,
   790	      anchors,
   791	      qualityThreshold,
   792	      minState: minState ?? '',
   793	      applyStateLimits,
   794	      useDecay,
   795	      rerank,
   796	      applyLengthPenalty,
   797	      sessionId,
   798	      enableDedup,
   799	      enableSessionBoost,
   800	      enableCausalBoost,
   801	      trackAccess,
   802	      detectedIntent,
   803	      intentConfidence,
   804	      intentWeights: toIntentWeightsConfig(intentWeights),
   805	      artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
   806	      trace,
   807	    };
   808	
   809	    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
   810	    let resultsForFormatting = pipelineResult.results as unknown as SessionAwareResult[];
   811	
   812	    // Phase B T018/T019: Community search fallback — inject community members on weak results
   813	    let communityFallbackApplied = false;
   814	    const shouldRunCommunitySearch = (
   815	      isDualRetrievalEnabled() &&
   816	      isCommunitySearchFallbackEnabled() &&
   817	      effectiveQuery.length > 0 &&
   818	      (retrievalLevel === 'global' || retrievalLevel === 'auto')
   819	    );
   820	    if (shouldRunCommunitySearch) {
   821	      const isWeakResult = resultsForFormatting.length === 0 ||
   822	        (retrievalLevel === 'global') ||
   823	        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
   824	      if (isWeakResult) {
   825	        try {
   826	          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
   827	          if (communityResults.totalMemberIds.length > 0) {
   828	            // Fetch the actual memory rows for community member IDs
   829	            const memberIds = communityResults.totalMemberIds.slice(0, 20);
   830	            const placeholders = memberIds.map(() => '?').join(', ');
   831	            const db = requireDb();
   832	            const memberRows = db.prepare(`
   833	              SELECT id, title, similarity, content, file_path, importance_tier, context_type,
   834	                     quality_score, created_at
   835	              FROM memory_index
   836	              WHERE id IN (${placeholders})
   837	            `).all(...memberIds) as Array<Record<string, unknown> & { id: number }>;
   838	
   839	            if (memberRows.length > 0) {
   840	              // Mark community-sourced results and assign a base score
   841	              const communityRows = memberRows.map((row) => ({
   842	                ...row,
   843	                similarity: typeof row.similarity === 'number' ? row.similarity : 0.5,
   844	                score: 0.45,
   845	                _communityFallback: true,
   846	              }));
   847	              // Merge: append community results not already in pipeline results
   848	              const existingIds = new Set(resultsForFormatting.map((r) => (r as Record<string, unknown>).id as number));
   849	              const newRows = communityRows.filter((r) => !existingIds.has(r.id));
   850	              if (newRows.length > 0) {
   851	                resultsForFormatting = [...resultsForFormatting, ...newRows as unknown as SessionAwareResult[]];
   852	                communityFallbackApplied = true;
   853	              }
   854	            }
   855	          }
   856	        } catch (err: unknown) {
   857	          const msg = err instanceof Error ? err.message : String(err);
   858	          console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
   859	        }
   860	      }
   861	    }
   862	
   863	    // Fix 4 (RC1-B): Apply folder boost — multiply similarity for results matching discovered folder
   864	    if (folderBoost && folderBoost.folder && folderBoost.factor > 1) {
   865	      let boostedCount = 0;
   866	      for (const r of resultsForFormatting) {
   867	        const filePath = (r as Record<string, unknown>).file_path as string | undefined;
   868	        if (filePath && filePath.includes(folderBoost.folder)) {
   869	          const raw = (r as Record<string, unknown>);
   870	          if (typeof raw.similarity === 'number') {
   871	            raw.similarity = Math.min(raw.similarity * folderBoost.factor, 1.0);
   872	            boostedCount++;
   873	          }
   874	        }
   875	      }
   876	      // Re-sort by similarity after boosting
   877	      if (boostedCount > 0) {
   878	        resultsForFormatting.sort((a, b) => {
   879	          const sa = (a as Record<string, unknown>).similarity as number ?? 0;
   880	          const sb = (b as Record<string, unknown>).similarity as number ?? 0;
   881	          return sb - sa;
   882	        });
   883	      }
   884	    }
   885	
   886	    if (sessionId && isSessionRetrievalStateEnabled()) {
   887	      const activeGoal = effectiveQuery.trim().length > 0 ? effectiveQuery : null;
   888	      if (activeGoal) {
   889	        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
   890	      }
   891	      if (Array.isArray(anchors) && anchors.length > 0) {
   892	        retrievalSessionStateManager.setAnchors(sessionId, anchors);
   893	      }
   894	
   895	      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
   896	      resultsForFormatting = goalRefinement.results as SessionAwareResult[];
   897	      goalRefinementPayload = {
   898	        activeGoal: goalRefinement.metadata.activeGoal,
   899	        applied: goalRefinement.metadata.refined,
   900	        boostedCount: goalRefinement.metadata.boostedCount,
   901	      };
   902	    }
   903	
   904	    // Build extra data from pipeline metadata for response formatting
   905	    const lexicalCapability = getLastLexicalCapabilitySnapshot();
   906	    if (lexicalCapability) {
   907	      console.error(
   908	        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
   909	      );
   910	    }
   911	
   912	    const extraData: Record<string, unknown> = {
   913	      stateStats: pipelineResult.annotations.stateStats,
   914	      featureFlags: {
   915	        ...pipelineResult.annotations.featureFlags,
   916	      },
   917	      pipelineMetadata: pipelineResult.metadata,
   918	    };
   919	    if (lexicalCapability) {
   920	      extraData.lexicalPath = lexicalCapability.lexicalPath;

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '452,508p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"handleSearch\\(|Search\\(|FormatContext\\(|SearchPrompts\\(|sanitizeFTS\\(\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp -g '*.go'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:197:			handleSearch(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:235:  content: "**What**: Wrapped each search term in quotes before passing to FTS5 MATCH\n**Why**: Users typing queries like 'fix auth bug' would crash because FTS5 interprets special chars as operators\n**Where**: internal/store/store.go — sanitizeFTS() function\n**Learned**: FTS5 MATCH syntax is NOT the same as LIKE — always sanitize user input"`),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:625:func handleSearch(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:640:		results, err := s.Search(query, store.SearchOptions{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:894:		context, err := s.FormatContext(project, scope)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:306:	search := handleSearch(s, MCPConfig{})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:484:	search := handleSearch(s, MCPConfig{})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:573:	searchRes, err := handleSearch(s, MCPConfig{})(context.Background(), mcppkg.CallToolRequest{Params: mcppkg.CallToolParams{Arguments: map[string]any{"query": "title"}}})

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '680,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '860,1040p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '620,678p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3420,3505p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "func SuggestTopicKey|architecture/|bug/|decision/|session/" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
3199:// It infers a topic family (e.g. architecture/*, bug/*) and then appends
3201:func SuggestTopicKey(typ, title, content string) string {

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3505,3575p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  3546		case "read", "view":
  3547			return "file_read"
  3548		case "grep", "glob", "ls":
  3549			return "search"
  3550		default:
  3551			return "tool_use"
  3552		}
  3553	}
  3554	
  3555	// Now returns the current time formatted for SQLite.
  3556	func Now() string {
  3557		return time.Now().UTC().Format("2006-01-02 15:04:05")
  3558	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3190,3265p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3265,3348p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'rg -n "mem_session_summary|mem_session_start|mem_session_end|session lifecycle|end-of-session" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
41://   mem_save, mem_search, mem_context, mem_session_summary,
42://   mem_session_start, mem_session_end, mem_get_observation,
57:	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
58:	"mem_session_start":     true, // register session start
59:	"mem_session_end":       true, // mark session completed
130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
460:	// ─── mem_session_summary (profile: agent, core — always in context) ─
461:	if shouldRegister("mem_session_summary", allowlist) {
463:			mcp.NewTool("mem_session_summary",
469:				mcp.WithDescription(`Save a comprehensive end-of-session summary. Call this when a session is ending or when significant work is complete. This creates a structured summary that future sessions will use to understand what happened.
515:	// ─── mem_session_start (profile: agent, deferred) ───────────────────
516:	if shouldRegister("mem_session_start", allowlist) {
518:			mcp.NewTool("mem_session_start",
542:	// ─── mem_session_end (profile: agent, deferred) ─────────────────────
543:	if shouldRegister("mem_session_end", allowlist) {
545:			mcp.NewTool("mem_session_end",

exec
/bin/zsh -lc "rg -n \"trigger phrase|trigger_phrases|memory_match_triggers|topic_key|thread-key|revision_count|duplicate_count|deleted_at\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:8:// Feature catalog: BM25 trigger phrase re-index gate
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:337:      summary: 'No matching trigger phrases found',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:349:        'Ensure memories have trigger phrases defined',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:496:    : `Matched ${formattedResults.length} memories via trigger phrases`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:271:          trigger_phrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:147:      trigger_phrases: args.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:281:                      trigger_phrases: memory.triggerPhrases ?? [],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:40:  trigger_phrases: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:95:    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:139:    trigger_phrases: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:145:  const persistedTriggerPhrases = parseJsonStringArray(existing.trigger_phrases);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:141:    const triggerResult = database.prepare("SELECT SUM(json_array_length(trigger_phrases)) as count FROM memory_index WHERE trigger_phrases IS NOT NULL AND trigger_phrases != '[]'").get() as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:151:      // T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:159:            'SELECT title, content_text, trigger_phrases, file_path FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:160:          ).get(id) as { title: string | null; content_text: string | null; trigger_phrases: string | null; file_path: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:212:  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:219:  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:294:  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:365:            trigger_phrases: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:601:        trigger_phrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:87: * Compute trigger phrase quality sub-score.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:89: * Evaluates whether the memory metadata declares enough trigger phrases for
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:108:    issues.push('No trigger phrases found');
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:112:    issues.push(`Only ${count} trigger phrase(s) — 4+ recommended`);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:427: * - Re-extract trigger phrases from content headings/title
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:442:  // Fix #1 : Re-extract trigger phrases if missing/insufficient
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:443:  const hasTriggerIssue = issues.some(i => /trigger phrase/i.test(i));
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:452:      fixed.push(`Re-extracted ${extracted.length} trigger phrases from content`);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:482: * Extract trigger phrases from content by scanning headings and the title.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:131:    const sql = `SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight, created_at, updated_at FROM memory_index ${whereClause} ORDER BY ${sortColumn} DESC LIMIT ? OFFSET ?`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:153:    triggerCount: safeJsonParseTyped<unknown[]>(row.trigger_phrases as string, 'array', []).length,
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:49:        trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:31:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:36:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:49:    INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:113:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:185:      SELECT id, spec_folder, file_path, title, trigger_phrases, importance_tier
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:48:trigger_phrases:
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:378:        qualityFlags: ['No trigger phrases found'],
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:114:        trigger_phrases TEXT DEFAULT '[]',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:95:    { id: 403, content: 'Post-save review highlights title, trigger phrase, and importance tier issues. '.repeat(2) },
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:40:        trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:74:        trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:841:trigger_phrases: ["test trigger"]
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:16:    trigger_phrases: 'auth, login, session',
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts:38:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts:54:      INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts:133:      INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:32:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:71:    INSERT INTO memory_index (title, trigger_phrases, spec_folder, parent_id, importance_tier, is_archived)
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:266:trigger_phrases: [integration test, quality gate, validation]
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:365:            trigger_phrases TEXT DEFAULT '[]',
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:490:trigger_phrases: [implementation, quality gate, reconsolidation]
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:40:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:452:    it('T054-6f: Same-path unchanged does not short-circuit when trigger phrases changed', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:453:      const content = 'Existing same-path row with stale trigger phrases.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:457:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:483:      const content = 'Existing same-path row with stale trigger phrases.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:487:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:219:  it('classifies trigger phrase matches as simple regardless of length', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:221:      // "get learning history" has 3 terms and is a trigger phrase
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:480:  it('matches exact trigger phrase (case-insensitive)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:486:  it('does not match partial trigger phrase', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:491:  it('handles empty trigger phrase list', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:501:      // "get learning history" is a trigger phrase with exactly 3 terms
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:25:      trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:855:        trigger_phrases: '[]',
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:898:        trigger_phrases: '[]',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:44:  'trigger_phrases',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:120:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:206:      title, trigger_phrases, file_path, content_text,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:213:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:214:      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:220:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:221:      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:222:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:223:      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:229:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:230:      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:159:  // Normalize trigger phrases to array
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:323:  keywords: 'Matched keywords in title or trigger phrases',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:487: * Score trigger phrase quality (0-1).
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:489: * @param triggerPhrases - Array of trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:571:  trigger_phrases?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:580:  if ((Array.isArray(row.trigger_phrases) ? row.trigger_phrases.length : (row.trigger_phrases?.trim().length ?? 0)) > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:638:      reasons.push('No trigger phrases: add at least 1-2 trigger phrases');
.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:423:      'trigger_phrases: auth, login, oauth',
.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:459:    expect(result).not.toContain('trigger_phrases');
.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:290:  it('T21: routes trigger phrase match to simple tier', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1284:  if ((column === 'trigger_phrases' || column === 'quality_flags') && Array.isArray(value)) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1316:    'trigger_phrases',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:87:      trigger_phrases TEXT DEFAULT '[]',
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:105:      trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:135:    INSERT INTO memory_index (id, title, trigger_phrases, created_at, importance_tier, validation_count, confidence)
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:242:        trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:525:    const availableColumns = ['title', 'content_text', 'trigger_phrases', 'file_path']
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:462:      trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:529:        trigger_phrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:89:        trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:395:      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:397:      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:29: * structured fields (title, trigger_phrases, context_type, etc.), so
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:36:  trigger_phrases: string;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:120:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:126:    INSERT INTO memory_index (id, spec_folder, file_path, title, trigger_phrases, importance_weight, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:130:    insert.run(r.id, r.spec_folder, r.file_path, r.title, r.trigger_phrases, r.importance_weight, r.embedding_status ?? 'success');
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:229:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["alpha phrase","beta phrase"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:238:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["test regex"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:247:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["save context"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:261:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["phrase one","phrase two","phrase three","phrase four","phrase five"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:272:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["some phrase"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:293:    it('3.3.2 loads rows with valid trigger_phrases JSON', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:297:        { id: 1, spec_folder: 'specs/001', file_path: '/a.md', title: 'Test A', trigger_phrases: '["save context","memory"]', importance_weight: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:298:        { id: 2, spec_folder: 'specs/002', file_path: '/b.md', title: 'Test B', trigger_phrases: '["debug"]', importance_weight: 0.6 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:304:    it('3.3.3 skips rows with invalid JSON trigger_phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:308:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: 'NOT_JSON', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:309:        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T', trigger_phrases: '["valid"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:320:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["ab","abc","a"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:327:    it('3.3.4b filters single-word stopword trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:331:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["the","save context","debug"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:341:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["hello"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:346:        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T2', trigger_phrases: '["different"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:358:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["alpha"]', importance_weight: 0.5, embedding_status: 'success' },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:359:        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T', trigger_phrases: '["beta"]', importance_weight: 0.5, embedding_status: 'pending' },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:374:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["save context"]', importance_weight: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:387:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["save context","memory save"]', importance_weight: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:388:        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T2', trigger_phrases: '["other phrase"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:402:        { id: 1, spec_folder: 's', file_path: '/bad.md', title: 'Bad', trigger_phrases: 'NOT_JSON', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:403:        { id: 2, spec_folder: 's', file_path: '/good.md', title: 'Good', trigger_phrases: '["valid trigger"]', importance_weight: 0.7 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:445:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["alpha","beta"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:446:        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T', trigger_phrases: '["beta","gamma"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:460:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["Hello World"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:472:      { id: 1, spec_folder: 'specs/001', file_path: '/a.md', title: 'Memory A', trigger_phrases: '["save context","memory"]', importance_weight: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:473:      { id: 2, spec_folder: 'specs/002', file_path: '/b.md', title: 'Memory B', trigger_phrases: '["save context"]', importance_weight: 0.6 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:474:      { id: 3, spec_folder: 'specs/003', file_path: '/c.md', title: 'Memory C', trigger_phrases: '["different"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:522:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["old phrase"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:527:        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T2', trigger_phrases: '["new phrase"]', importance_weight: 0.7 },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:540:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["test"]', importance_weight: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:285:        trigger_phrases: mergedTriggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:303:        trigger_phrases: mergedTriggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:859:  const existingValue = existingRow.trigger_phrases;
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:19:  trigger_phrases: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:26:      if (sql.includes('SELECT id, title, content_text, trigger_phrases, file_path')) {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:394:        { id: 1, title: 'Memory System', content_text: 'Semantic search retrieval', trigger_phrases: 'memory,search', file_path: 'specs/001/spec.md' },
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:395:        { id: 2, title: 'Index Management', content_text: 'BM25 indexing pipeline', trigger_phrases: 'index,bm25', file_path: 'specs/002/spec.md' },
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:415:        { id: 10, title: 'Title Only', content_text: null, trigger_phrases: null, file_path: null },
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:416:        { id: 11, title: null, content_text: 'Content only text here', trigger_phrases: null, file_path: null },
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:436:        { id: 20, title: null, content_text: null, trigger_phrases: null, file_path: null },
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:437:        { id: 21, title: '', content_text: '', trigger_phrases: '', file_path: '' },
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:438:        { id: 22, title: 'Valid', content_text: 'Valid content here', trigger_phrases: null, file_path: null },
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:460:        { id: 100, title: 'Fresh', content_text: 'Fresh content only', trigger_phrases: null, file_path: null },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:50:        trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:95:          trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:157:// In-memory cache of trigger phrases for fast matching
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:177:  SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:180:    AND trigger_phrases IS NOT NULL
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:181:    AND trigger_phrases != '[]'
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:182:    AND trigger_phrases != ''
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:208:  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:306:/** Get or create a cached regex for a trigger phrase. @param phrase - The trigger phrase @returns Compiled RegExp */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:337:/** Load all trigger phrases from the index into memory */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:366:      trigger_phrases: string;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:377:        phrases = JSON.parse(row.trigger_phrases);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:380:        console.warn(`[trigger-matcher] Failed to parse trigger phrases for memory ${row.id}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:621:/** Match user prompt against trigger phrases using exact string matching */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:683:  logExecutionTime('match_trigger_phrases', elapsed, {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:694:/** Match trigger phrases with additional stats */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:725:/** Get all unique trigger phrases in the cache */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:763:/** Get memories by trigger phrase */
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:121:          'trigger_phrases:',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1061:    it('persists quality-loop trigger phrase fixes into downstream save inputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1116:        fixes: ['Re-extracted 4 trigger phrases from content'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1355:        fixes: ['Re-extracted 4 trigger phrases from content'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1403:        fixes: ['Re-extracted 4 trigger phrases from content'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1590:            'trigger_phrases:',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:55: *   title, trigger_phrases, file_path, content_text
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:99: *   title, trigger_phrases, file_path, content_text
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:3:// TF-IDF + N-gram hybrid trigger phrase extraction
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:100:    it('T515-03: no duplicate trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:307:        trigger_phrases: existingMemory?.trigger_phrases ?? '[]',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:881:      { id: 1, spec_folder: 'specs/001-test', file_path: '/test/mem1.md', title: 'Memory One', trigger_phrases: '["hello"]', importance_weight: 0.8, created_at: '2025-01-01', updated_at: '2025-06-01' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:882:      { id: 2, spec_folder: 'specs/001-test', file_path: '/test/mem2.md', title: null, trigger_phrases: null, importance_weight: 0.5, created_at: '2025-02-01', updated_at: '2025-05-01' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:894:      { id: 1, spec_folder: 'specs/test', file_path: '/p.md', title: null, trigger_phrases: null, importance_weight: 0.5, created_at: '2025-01-01', updated_at: '2025-01-01' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:913:    const rows = [{ id: 1, spec_folder: 's', file_path: 'f', title: 't', trigger_phrases: '[]', importance_weight: 0.5, created_at: 'c', updated_at: 'u' }];
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:940:      { id: 1, spec_folder: 's', file_path: 'f', title: 't', trigger_phrases: '["a","b","c"]', importance_weight: 0.5, created_at: 'c', updated_at: 'u' },
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:541:/** Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:547:  const inlineMatch = frontmatter.match(/(?:triggerPhrases|trigger_phrases):\s*\[([^\]]+)\]/i);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:567:      if (/^\s*(?:triggerPhrases|trigger_phrases):\s*$/i.test(line)) {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:29:      trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/phase2-integration.vitest.ts:28:        trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/phase2-integration.vitest.ts:56:      INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:47:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:140:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:438:          anchor_id TEXT, trigger_phrases TEXT, importance_weight REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:12:  trigger_phrases: string;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:106:    it('T501-01: exact match on trigger phrase', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:137:    it('T501-04: multi-word trigger phrase matches', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:265:    it('T501-13a: Unicode-aware boundaries match Cyrillic and CJK trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:277:          trigger_phrases: JSON.stringify(['Cafe\u0301 Mode', 'быстрый поиск', '情報検索']),
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:320:        trigger_phrases: JSON.stringify([`topic${index + 1} marker${index + 1}`]),
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:329:        trigger_phrases: JSON.stringify(['unicode trigger repair', 'candidate index optimization']),
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:348:        trigger_phrases: JSON.stringify([`background${index + 1} archive${index + 1}`]),
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:357:        trigger_phrases: JSON.stringify(['focused trigger benchmark']),
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:393:          trigger_phrases: JSON.stringify(['prepared statement cache']),
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:114:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:288:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1699:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1743:      expect(hooksModule!.extractContextHint!({ prompt: 'trigger phrase' })).toBe('trigger phrase')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2082:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:532:    it('getMemory returns correct memory with parsed trigger_phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:538:      expect(Array.isArray(mem!.trigger_phrases)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:539:      expect(mem!.trigger_phrases).toContain('alpha');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1391:    it('adds new terms from query to trigger_phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1396:      expect(mem?.trigger_phrases).toContain('vector');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1397:      expect(mem?.trigger_phrases).toContain('search');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1398:      expect(mem?.trigger_phrases).toContain('implementation');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1416:    it('does not re-add existing trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:26:        trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:39:        trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:49:      INSERT INTO memory_index (id, title, trigger_phrases, content_text, file_path, spec_folder, is_archived)
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:59:      INSERT INTO memory_fts (rowid, title, trigger_phrases, content_text, file_path)
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60:      SELECT id, title, trigger_phrases, content_text, file_path FROM memory_index;
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:82:    expect(FTS5_BM25_WEIGHTS[1]).toBe(5.0);  // trigger_phrases
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:190:        trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:122: * spec_folder with text similarity (based on title + trigger_phrases)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:145:    `SELECT m.title, m.trigger_phrases
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:150:  ).get(memoryId) as { title: string | null; trigger_phrases: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:154:  const targetText = [targetRow.title || '', targetRow.trigger_phrases || ''].join(' ').trim();
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:159:    `SELECT m.id, m.title, m.trigger_phrases
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:168:    trigger_phrases: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:173:    const siblingText = [sibling.title || '', sibling.trigger_phrases || ''].join(' ').trim();
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:210:    `SELECT m.id, m.spec_folder, m.title, m.trigger_phrases
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:219:    trigger_phrases: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:246:      `SELECT m.id, m.title, m.trigger_phrases
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:254:      trigger_phrases: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:260:      const text = [mem.title || '', mem.trigger_phrases || ''].join(' ').trim();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:23:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:45:      INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases, created_at)
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:72:      trigger_phrases: '["rule"]',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:105:          id, spec_folder, file_path, title, trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:615:      trigger_phrases: ['hybrid-search', 'bm25-sync'],
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:634:      trigger_phrases: string;
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:639:      [1, { id: 1, title: 'Auth doc', content_text: 'authentication search memory body', trigger_phrases: 'auth', file_path: 'specs/auth/1.md' }],
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:640:      [2, { id: 2, title: 'Cache doc', content_text: 'cache retrieval system body', trigger_phrases: 'cache', file_path: 'specs/cache/2.md' }],
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:703:          trigger_phrases: 'updated trigger phrase',
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:731:      buildBm25DocumentText: vi.fn((row: { title?: string | null; content_text?: string | null; trigger_phrases?: string | string[] | null; file_path?: string | null }) =>
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:735:          Array.isArray(row.trigger_phrases) ? row.trigger_phrases.join(' ') : (row.trigger_phrases ?? ''),
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:780:    await handleMemoryUpdate({ id: 42, triggerPhrases: ['updated trigger phrase'] });
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:792:        trigger_phrases: 'updated trigger phrase',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:29:        trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:489:          trigger_phrases: '[save, quality]',
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:501:          trigger_phrases: '[save, quality, gate, TM-04]',
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:548:          trigger_phrases: '[save, quality, gate]',
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:732:        trigger_phrases: '[save, quality, gate, TM-04]',
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:787:        trigger_phrases: '[save, quality, gate]',
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:815:        trigger_phrases: '[save, quality, gate]',
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:851:        trigger_phrases: '[save, quality, gate]',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:206:      trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:254:      trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:52:        trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:7:// - Quality score computation (trigger phrases, anchors, budget, coherence)
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:105:  it('returns 0 when no trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:109:    expect(result.issues[0]).toMatch(/no trigger phrases/i);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:112:  it('returns 0.5 for 1-3 trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:116:    expect(result.issues[0]).toMatch(/2 trigger phrase/i);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:119:  it('returns 1.0 for 4+ trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:363:  it('extracts title as trigger phrase', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:396:  it('re-extracts trigger phrases when missing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:399:    const result = attemptAutoFix(content, metadata, ['No trigger phrases found']);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:95:      ? `trigger_phrases: "${triggerPhrases.join(', ')}"`
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:97:        ? 'trigger_phrases: []'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:98:        : `trigger_phrases:\n${triggerPhrases.map(tp => `  - "${tp}"`).join('\n')}`;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:428:  it('auto-fix rescues missing trigger phrases from headings', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:430:    // Content with headings (for trigger extraction) but NO trigger phrases and NO anchors.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:442:    expect(result.fixes.some(f => /trigger phrase/i.test(f))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:691:  it('detects trigger_phrases as string instead of YAML list', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:696:    expect(result.violations.some(v => v.code === 'invalid_trigger_phrases')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:699:  it('accepts trigger_phrases as empty array []', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:704:    const triggerViolation = result.violations.find(v => v.code === 'invalid_trigger_phrases');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1055:    const content = `---\ntitle: "Anchor Stress Test"\ndescription: "test"\ntrigger_phrases:\n  - "anchor-stress"\nimportance_tier: "normal"\ncontextType: "implementation"\n---\n\n${anchors}`;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1066:  it('rejects emoji-only trigger phrases as non-semantic', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1141:  it('quality loop handles exactly 3 trigger phrases at boundary', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:264:    detail: 'Queries must be NOT derived from trigger phrases',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts:38:      id, spec_folder, file_path, title, trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:93:  /** Optional trigger phrases for query-classifier trigger-match routing path. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:464:    // (title 10x, trigger_phrases 5x, file_path 2x, content 1x)
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:22:        trigger_phrases: null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:43:      trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:196: * - Terms must NOT already exist as organic trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:201: * @param existingTriggers - Current trigger phrases already on the memory
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:277:      'SELECT created_at, trigger_phrases, learned_triggers FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:278:    ).get(memoryId) as { created_at?: string; trigger_phrases?: string; learned_triggers?: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:293:    if (memory.trigger_phrases) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:294:      if (Array.isArray(memory.trigger_phrases)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:295:        existingTriggers = memory.trigger_phrases;
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:298:          const parsed = JSON.parse(memory.trigger_phrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:299:          existingTriggers = Array.isArray(parsed) ? parsed : [memory.trigger_phrases];
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:301:          existingTriggers = memory.trigger_phrases.split(',').map((t: string) => t.trim());
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:137:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:204:      trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:260:      trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:293:      trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:39:        trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:177:    it('T500-06a: Inline YAML trigger phrases extracted', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:193:    it('T500-06b: Multi-line YAML trigger phrases extracted', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-denylist.vitest.ts:3:// Into learned relevance feedback trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:76: * Check if the query exactly matches any known trigger phrase (case-insensitive).
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:79: * @param triggerPhrases - Known trigger phrases to match against.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:80: * @returns True when the query matches a trigger phrase exactly.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:95: * @param hasTrigger    - Whether a trigger phrase matched.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:130: * - Simple: ≤3 terms OR trigger phrase match
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:140: * @param triggerPhrases - Optional array of known trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:11:  parse_trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:260: * Learns new trigger phrases from a selected result.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:263: * @returns True when trigger phrases were updated.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:270:  let memory: { trigger_phrases?: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:273:      'SELECT trigger_phrases FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:274:    ).get(selected_memory_id) as { trigger_phrases?: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:284:    existing = parse_trigger_phrases(memory.trigger_phrases || undefined);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:314:      'UPDATE memory_index SET trigger_phrases = ? WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:10:  parse_trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:151: * This gives title matches 10x weight, trigger_phrases 5x, etc.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:5:/** Maximum trigger phrases stored for each memory. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:42:  trigger_phrases?: string | string[] | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:81:  trigger_phrases?: string | string[] | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:180: * Parses trigger phrase storage into a normalized string array.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:181: * @param value - The stored trigger phrase payload.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:182: * @returns Parsed trigger phrases, or an empty array on invalid input.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:184:export function parse_trigger_phrases(value: string | string[] | null | undefined): string[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:4:// Feature catalog: BM25 trigger phrase re-index gate
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:31:  trigger_phrases?: string | string[] | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:55: * trigger_phrases:  5.0 — curated keywords next most important
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:63:  trigger_phrases: BM25_FTS5_WEIGHTS[1],
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:222:  const triggerPhrases = normalizeTriggerPhrasesForBM25(row.trigger_phrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:380:        `SELECT id, title, content_text, trigger_phrases, file_path
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:388:        trigger_phrases: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:754:            title, trigger_phrases, file_path, content_text,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:761:            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:762:            VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:767:            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:768:            VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:769:            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:770:            VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:775:            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:776:            VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1138:         AND trigger_phrases IS NOT NULL
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1139:         AND trigger_phrases != '[]'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1140:         AND trigger_phrases != ''`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2073:        AND trigger_phrases IS NOT NULL
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2074:        AND trigger_phrases != '[]'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2075:        AND trigger_phrases != ''
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2306:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2385:      title, trigger_phrases, file_path, content_text,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2393:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2394:      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2400:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2401:      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2402:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2403:      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2409:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2410:      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2442:        AND trigger_phrases IS NOT NULL
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2443:        AND trigger_phrases != '[]'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2444:        AND trigger_phrases != '';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:135: * @param triggerPhrases - Optional trigger phrases for simple-tier classification
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:5:// 100+ stop words that should never be learned as trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:57:   to serve as meaningful trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:76: * as trigger phrases. All terms stored in lowercase for case-insensitive matching.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:32:  parse_trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:651:      row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:981:      trigger_phrases?: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:992:      triggerPhrases: metadata_alias.trigger_phrases || metadata_alias.triggerPhrases || [],
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:236:      // D3-fix: trigger_phrases may be string[] (parsed) or string (raw JSON)
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:237:      const triggers = mem.trigger_phrases;
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:510:    SELECT id, spec_folder, file_path, title, importance_tier, trigger_phrases, created_at
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:17:  parse_trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:71:    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:96:    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:278:    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:400:    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:659:      parse_trigger_phrases(row.trigger_phrases).join(' '),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:670:        if (parse_trigger_phrases(row.trigger_phrases).join(' ').toLowerCase().includes(term)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:686:    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:222:        spec_folder, file_path, canonical_file_path, anchor_id, title, trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:298:            trigger_phrases = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:321:        spec_folder, file_path, canonical_file_path, anchor_id, title, trigger_phrases,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:393:      updates.push('trigger_phrases = ?');

codex
I’ve got enough raw code now to see a real contrast: Engram’s query path is intentionally small enough to reason about line by line, while Public’s retrieval stack layers routing, multiple lexical and semantic lanes, fusion, graph enrichment, and post-fusion reranking. I’m narrowing that into a handful of non-overlapping findings now, with each one anchored in a specific code path and framed as either a clean idea to borrow or something we should explicitly avoid copying.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '458,980p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   458	 * Selects and runs the appropriate search channel(s) based on `config.searchType`
   459	 * and `config.mode`, then applies vector-channel temporal contiguity when
   460	 * enabled, followed by constitutional injection, quality filtering, and
   461	 * tier/contextType filtering.
   462	 *
   463	 * This stage does not apply Stage 2 fusion/reranking signals. Vector-channel
   464	 * results may receive a temporal proximity boost before moving downstream.
   465	 *
   466	 * @param input - Stage 1 input containing the resolved pipeline configuration.
   467	 * @returns Stage 1 output with raw candidate rows and channel metadata.
   468	 */
   469	export async function executeStage1(input: Stage1Input): Promise<Stage1Output> {
   470	  const startTime = Date.now();
   471	  const { config } = input;
   472	  // Fix #16: Cache embedding at function scope for reuse in constitutional injection
   473	  let cachedEmbedding: Float32Array | number[] | null = null;
   474	  let constitutionalInjectedCount = 0;
   475	
   476	  const {
   477	    query,
   478	    queryEmbedding,
   479	    concepts,
   480	    searchType,
   481	    mode,
   482	    limit,
   483	    specFolder,
   484	    tenantId,
   485	    userId,
   486	    agentId,
   487	    sharedSpaceId,
   488	    tier,
   489	    contextType,
   490	    includeArchived,
   491	    includeConstitutional,
   492	    qualityThreshold,
   493	    trace,
   494	  } = config;
   495	
   496	  let candidates: PipelineRow[] = [];
   497	  let channelCount = 0;
   498	
   499	  // -- D2 REQ-D2-002: Graph Concept Routing -----------------------------------
   500	  //
   501	  // When SPECKIT_GRAPH_CONCEPT_ROUTING is enabled, extract noun phrases from
   502	  // the query and match them against the concept alias table. If concepts are
   503	  // matched, log them to the trace for downstream use (graph channel activation
   504	  // is surfaced via trace metadata; actual graph channel is handled in Stage 2).
   505	  //
   506	  // Phase B T016: When SPECKIT_QUERY_CONCEPT_EXPANSION is also enabled,
   507	  // matched concepts are reverse-mapped to their alias terms and appended to
   508	  // the query for the hybrid search channel, improving recall for alias-rich
   509	  // queries (e.g. "semantic search" → also searches "retrieval", "query", etc.).
   510	  //
   511	  // Fail-open: any error leaves candidates unchanged.
   512	
   513	  /** Effective query for hybrid search — may be expanded by concept routing. */
   514	  let effectiveQuery = query;
   515	
   516	  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
   517	    try {
   518	      let routingDb: Parameters<typeof routeQueryConcepts>[1];
   519	      try {
   520	        routingDb = requireDb();
   521	      } catch (_dbErr: unknown) {
   522	        routingDb = undefined;
   523	      }
   524	      const routing = routeQueryConcepts(query, routingDb);
   525	      if (routing.graphActivated && routing.concepts.length > 0) {
   526	        // Phase B T016: Expand query with concept alias terms
   527	        if (isQueryConceptExpansionEnabled()) {
   528	          try {
   529	            const originalTokens = nounPhrases(query);
   530	            const expansionTerms = getConceptExpansionTerms(
   531	              routing.concepts,
   532	              originalTokens,
   533	              5,
   534	            );
   535	            if (expansionTerms.length > 0) {
   536	              effectiveQuery = `${query} ${expansionTerms.join(' ')}`;
   537	              if (trace) {
   538	                addTraceEntry(trace, 'candidate', 0, 0, 0, {
   539	                  channel: 'd2-concept-expansion',
   540	                  originalQuery: query,
   541	                  expandedQuery: effectiveQuery,
   542	                  expansionTerms,
   543	                  matchedConcepts: routing.concepts,
   544	                });
   545	              }
   546	            }
   547	          } catch (expansionErr: unknown) {
   548	            const expansionMsg = expansionErr instanceof Error ? expansionErr.message : String(expansionErr);
   549	            console.warn(`[stage1-candidate-gen] D2 concept expansion failed (fail-open): ${expansionMsg}`);
   550	          }
   551	        }
   552	
   553	        if (trace) {
   554	          addTraceEntry(trace, 'candidate', 0, 0, 0, {
   555	            channel: 'd2-concept-routing',
   556	            matchedConcepts: routing.concepts,
   557	            graphActivated: true,
   558	          });
   559	        }
   560	      }
   561	    } catch (routingErr: unknown) {
   562	      const routingMsg = routingErr instanceof Error ? routingErr.message : String(routingErr);
   563	      console.warn(`[stage1-candidate-gen] D2 concept routing failed: ${routingMsg}`);
   564	    }
   565	  }
   566	
   567	  // -- Channel: Multi-Concept --------------------------------------------------
   568	
   569	  if (searchType === 'multi-concept' && Array.isArray(concepts) && concepts.length >= 2) {
   570	    // Validate concept list: 2-5 non-empty strings
   571	    if (concepts.length > 5) {
   572	      throw new Error('[stage1-candidate-gen] Maximum 5 concepts allowed for multi-concept search');
   573	    }
   574	
   575	    for (const concept of concepts) {
   576	      if (typeof concept !== 'string' || concept.trim().length === 0) {
   577	        throw new Error('[stage1-candidate-gen] Each concept must be a non-empty string');
   578	      }
   579	    }
   580	
   581	    // Generate one embedding per concept
   582	    const conceptEmbeddings: Float32Array[] = [];
   583	    for (const concept of concepts) {
   584	      const emb = await embeddings.generateQueryEmbedding(concept);
   585	      if (!emb) {
   586	        throw new Error(
   587	          `[stage1-candidate-gen] Failed to generate embedding for concept: "${concept}"`
   588	        );
   589	      }
   590	      conceptEmbeddings.push(emb);
   591	    }
   592	
   593	    channelCount = 1;
   594	    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
   595	      minSimilarity: MULTI_CONCEPT_MIN_SIMILARITY,
   596	      limit,
   597	      specFolder,
   598	      includeArchived,
   599	    }) as PipelineRow[];
   600	  }
   601	
   602	  // -- Channel: Hybrid (with optional deep-mode query expansion) ---------------
   603	  //
   604	  else if (searchType === 'hybrid') {
   605	    // Resolve the query embedding — either pre-computed in config or generate now
   606	    // Fix #16 — Cache this embedding for reuse in constitutional injection path
   607	    // To avoid a duplicate generateQueryEmbedding() call.
   608	    const effectiveEmbedding: Float32Array | number[] | null =
   609	      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
   610	    cachedEmbedding = effectiveEmbedding;
   611	
   612	    if (!effectiveEmbedding) {
   613	      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
   614	    }
   615	
   616	    // Deep mode: expand query into variants and run hybrid for each, then dedup
   617	    if (mode === 'deep' && isMultiQueryEnabled()) {
   618	      // -- D2 REQ-D2-001: Query Decomposition (SPECKIT_QUERY_DECOMPOSITION) ---
   619	      //
   620	      // When enabled and the query is multi-faceted, decompose into up to 3
   621	      // sub-query facets and run hybrid search per facet. Results are merged
   622	      // by facet coverage (items appearing in multiple facets rank higher).
   623	      //
   624	      // This block takes the place of the synonym-expansion path below when
   625	      // decomposition fires. If decomposition is disabled, not applicable, or
   626	      // fails, execution falls through to the existing expansion logic.
   627	
   628	      if (isQueryDecompositionEnabled() && isMultiFacet(query)) {
   629	        try {
   630	          const normalizedQuery = normalizeFacetText(query);
   631	          let facets: string[] = [];
   632	
   633	          try {
   634	            facets = buildQueryDecompositionPool(query, mode)
   635	              .filter((facet) => facet !== normalizedQuery)
   636	              .map(normalizeFacetText)
   637	              .filter((facet) => facet.length > 0);
   638	          } catch (facetErr: unknown) {
   639	            const facetMsg = facetErr instanceof Error ? facetErr.message : String(facetErr);
   640	            console.warn(
   641	              `[stage1-candidate-gen] D2 faceted query decomposition failed, falling back to basic decomposition: ${facetMsg}`
   642	            );
   643	          }
   644	
   645	          if (facets.length === 0) {
   646	            facets = decompose(query)
   647	              .map(normalizeFacetText)
   648	              .filter((facet) => facet.length > 0 && facet !== normalizedQuery);
   649	          }
   650	
   651	          facets = [...new Set(facets)].slice(0, MAX_QUERY_DECOMPOSITION_FACETS);
   652	
   653	          if (facets.length > 0) {
   654	            // Run hybrid for the original query plus each facet, in parallel
   655	            const allQueries = [query, ...facets];
   656	            // FIX #7: Use Promise.allSettled so one failing facet branch
   657	            // does not discard results from all other branches.
   658	            const facetSettledResults = await withTimeout(
   659	              Promise.allSettled(
   660	                allQueries.map(async (q): Promise<PipelineRow[]> => {
   661	                  const facetEmbedding = await embeddings.generateQueryEmbedding(q);
   662	                  if (!facetEmbedding) {
   663	                    console.warn('[stage1-candidate-gen] D2 facet embedding generation returned null');
   664	                    return [];
   665	                  }
   666	                  return hybridSearch.collectRawCandidates(
   667	                    q,
   668	                    facetEmbedding,
   669	                    { limit, specFolder, includeArchived }
   670	                  ) as Promise<PipelineRow[]>;
   671	                })
   672	              ),
   673	              DECOMPOSITION_TIMEOUT_MS,
   674	              'D2 facet decomposition',
   675	            );
   676	            const facetResultSets = facetSettledResults.map((result, idx) => {
   677	              if (result.status === 'fulfilled') return result.value;
   678	              console.warn(`[stage1-candidate-gen] D2 facet branch ${idx} rejected: ${result.reason}`);
   679	              return [] as PipelineRow[];
   680	            });
   681	
   682	            channelCount = allQueries.length;
   683	            const pools = allQueries.map((q, i) => ({
   684	              query: q,
   685	              results: facetResultSets[i] ?? [],
   686	            }));
   687	            candidates = mergeFacetCoveragePools(pools);
   688	
   689	            if (trace) {
   690	              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
   691	                channel: 'd2-query-decomposition',
   692	                originalQuery: query,
   693	                facets,
   694	                facetCount: facets.length,
   695	              });
   696	            }
   697	
   698	            // Skip the standard deep-mode expansion path below
   699	            // (jump to post-channel processing via the else-if chain)
   700	          }
   701	        } catch (decompErr: unknown) {
   702	          const decompMsg = decompErr instanceof Error ? decompErr.message : String(decompErr);
   703	          console.warn(
   704	            `[stage1-candidate-gen] D2 query decomposition failed, falling through to expansion: ${decompMsg}`
   705	          );
   706	          // Fall through to standard deep expansion path below (candidates is empty)
   707	        }
   708	      }
   709	
   710	      // Only run existing expansion logic when decomposition did not produce results
   711	      if (candidates.length === 0) {
   712	
   713	      const queryVariants = await buildDeepQueryVariants(query);
   714	
   715	      if (queryVariants.length > 1) {
   716	        try {
   717	          // F1: Wrap parallel variant searches with latency budget.
   718	          // If variants exceed DEEP_EXPANSION_TIMEOUT_MS, fall back to base query.
   719	          // FIX #7: Use Promise.allSettled so one failing variant does not
   720	          // discard results from all other variant branches.
   721	          const variantSettledResults = await withTimeout(
   722	            Promise.allSettled(
   723	              queryVariants.map(async (variant): Promise<PipelineRow[]> => {
   724	                const variantEmbedding = await embeddings.generateQueryEmbedding(variant);
   725	                if (!variantEmbedding) {
   726	                  console.warn('[stage1-candidate-gen] Deep variant embedding generation returned null');
   727	                  return [];
   728	                }
   729	                const variantResults = await hybridSearch.collectRawCandidates(
   730	                  variant,
   731	                  variantEmbedding,
   732	                  { limit, specFolder, includeArchived }
   733	                );
   734	                return variantResults as PipelineRow[];
   735	              })
   736	            ),
   737	            DEEP_EXPANSION_TIMEOUT_MS,
   738	            'Deep-mode query expansion',
   739	          );
   740	          const variantResultSets: PipelineRow[][] = variantSettledResults.map((result, idx) => {
   741	            if (result.status === 'fulfilled') return result.value;
   742	            console.warn(`[stage1-candidate-gen] Deep variant branch ${idx} rejected: ${result.reason}`);
   743	            return [] as PipelineRow[];
   744	          });
   745	
   746	          channelCount = queryVariants.length;
   747	
   748	          // Merge variant results, deduplicate by id, preserve first-occurrence order
   749	          candidates = mergeCandidateBatches(
   750	            variantResultSets.map((rows, index) => ({
   751	              label: queryVariants[index] ?? `deep-variant-${index}`,
   752	              rows,
   753	            })),
   754	          );
   755	        } catch (expandErr: unknown) {
   756	          const expandMsg =
   757	            expandErr instanceof Error ? expandErr.message : String(expandErr);
   758	          console.warn(
   759	            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
   760	          );
   761	          // Fall through to single hybrid search below
   762	          channelCount = 1;
   763	          candidates = (await hybridSearch.collectRawCandidates(
   764	            query,
   765	            effectiveEmbedding,
   766	            { limit, specFolder, includeArchived }
   767	          )) as PipelineRow[];
   768	        }
   769	      } else {
   770	        // ExpandQuery returned only the original; treat as standard hybrid
   771	        channelCount = 1;
   772	        candidates = (await hybridSearch.collectRawCandidates(
   773	          query,
   774	          effectiveEmbedding,
   775	          { limit, specFolder, includeArchived }
   776	        )) as PipelineRow[];
   777	      }
   778	
   779	      } // end: if (candidates.length === 0)
   780	    } else {
   781	      // -- R12: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) --
   782	      //
   783	      // When R12 is enabled and R15 does not classify the query as "simple",
   784	      // We expand the query using embedding similarity to find related terms
   785	      // From the memory index. The expanded query is used as an additional
   786	      // Hybrid search channel whose results are merged with the baseline.
   787	      //
   788	      // Mutual exclusion: isExpansionActive() returns false when R15 classifies
   789	      // The query as "simple", suppressing expansion with zero added latency.
   790	
   791	      let r12ExpansionApplied = false;
   792	
   793	      if (isEmbeddingExpansionEnabled() && isExpansionActive(query)) {
   794	        try {
   795	          // ExpandQueryWithEmbeddings requires a Float32Array; the effective
   796	          // Embedding may be a number[] when generated by some providers, so
   797	          // Convert if necessary before passing it in.
   798	          const expansionEmbedding: Float32Array =
   799	            effectiveEmbedding instanceof Float32Array
   800	              ? effectiveEmbedding
   801	              : Float32Array.from(effectiveEmbedding as number[]);
   802	
   803	          const expanded = await expandQueryWithEmbeddings(query, expansionEmbedding, {
   804	            limit: DEFAULT_EXPANSION_CANDIDATE_LIMIT,
   805	          });
   806	
   807	          // Only run an extra channel if the expansion actually produced new terms
   808	          if (expanded.expanded.length > 0 && expanded.combinedQuery !== query) {
   809	            // Run the baseline and the expanded query in parallel
   810	            const [baselineResults, expansionResults] = await Promise.all([
   811	              hybridSearch.collectRawCandidates(
   812	                query,
   813	                effectiveEmbedding,
   814	                { limit, specFolder, includeArchived }
   815	              ).catch((err: unknown): PipelineRow[] => {
   816	                console.warn(
   817	                  '[stage1-candidate-gen] Baseline candidate collection failed:',
   818	                  err instanceof Error ? err.message : String(err)
   819	                );
   820	                return [];
   821	              }),
   822	              embeddings.generateQueryEmbedding(expanded.combinedQuery).then(
   823	                async (expandedEmb): Promise<PipelineRow[]> => {
   824	                  if (!expandedEmb) {
   825	                    console.warn('[stage1-candidate-gen] Expanded query embedding generation returned null');
   826	                    return [];
   827	                  }
   828	                  return hybridSearch.collectRawCandidates(
   829	                    expanded.combinedQuery,
   830	                    expandedEmb,
   831	                    { limit, specFolder, includeArchived }
   832	                  ) as Promise<PipelineRow[]>;
   833	                }
   834	              ).catch((err: unknown): PipelineRow[] => {
   835	                console.warn(
   836	                  '[stage1-candidate-gen] Expansion candidate collection failed:',
   837	                  err instanceof Error ? err.message : String(err)
   838	                );
   839	                return [];
   840	              }),
   841	            ]);
   842	
   843	            channelCount = 2;
   844	            r12ExpansionApplied = true;
   845	
   846	            // Merge both result sets, deduplicate by id, baseline-first ordering
   847	            // So baseline scores dominate when the same memory appears in both.
   848	            candidates = mergeCandidateBatches([
   849	              { label: query, rows: baselineResults as PipelineRow[] },
   850	              { label: expanded.combinedQuery, rows: expansionResults as PipelineRow[] },
   851	            ]);
   852	
   853	            if (trace) {
   854	              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
   855	                channel: 'r12-embedding-expansion',
   856	                expandedTerms: expanded.expanded,
   857	                combinedQuery: expanded.combinedQuery,
   858	              });
   859	            }
   860	          }
   861	        } catch (r12Err: unknown) {
   862	          const r12Msg = r12Err instanceof Error ? r12Err.message : String(r12Err);
   863	          console.warn(
   864	            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
   865	          );
   866	        }
   867	      }
   868	
   869	      // Standard hybrid search — runs when R12 is off, suppressed by R15,
   870	      // Or produced no results (candidates still empty from the try block above).
   871	      // Phase B T016: Uses effectiveQuery (concept-expanded) for BM25 recall.
   872	      if (!r12ExpansionApplied) {
   873	        try {
   874	          channelCount = 1;
   875	          const hybridResults = (await hybridSearch.collectRawCandidates(
   876	            effectiveQuery,
   877	            effectiveEmbedding,
   878	            { limit, specFolder, includeArchived }
   879	          )) as PipelineRow[];
   880	          candidates = hybridResults;
   881	        } catch (hybridErr: unknown) {
   882	          const hybridMsg =
   883	            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
   884	          console.warn(
   885	            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
   886	          );
   887	
   888	          // Fallback: pure vector search
   889	          channelCount = 1;
   890	          let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
   891	            limit,
   892	            specFolder,
   893	            tier,
   894	            contextType,
   895	            includeConstitutional: false, // Constitutional managed separately below
   896	            includeArchived,
   897	          }) as PipelineRow[];
   898	          if (isTemporalContiguityEnabled()) {
   899	            vectorResults = (
   900	              vectorSearchWithContiguity(
   901	                vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
   902	                3600,
   903	              ) as PipelineRow[] | null
   904	            ) ?? vectorResults;
   905	          }
   906	          candidates = vectorResults;
   907	
   908	          if (trace) {
   909	            addTraceEntry(trace, 'fallback', 0, candidates.length, 0, {
   910	              reason: hybridMsg,
   911	              channel: 'vector',
   912	            });
   913	          }
   914	        }
   915	      }
   916	    }
   917	  }
   918	
   919	  // -- Channel: Vector ---------------------------------------------------------
   920	
   921	  else if (searchType === 'vector') {
   922	    const effectiveEmbedding: Float32Array | number[] | null =
   923	      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
   924	
   925	    if (!effectiveEmbedding) {
   926	      throw new Error('[stage1-candidate-gen] Failed to generate embedding for vector search query');
   927	    }
   928	
   929	    channelCount = 1;
   930	    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
   931	      limit,
   932	      specFolder,
   933	      tier,
   934	      contextType,
   935	      includeConstitutional: false, // Constitutional managed separately below
   936	      includeArchived,
   937	    }) as PipelineRow[];
   938	    if (isTemporalContiguityEnabled()) {
   939	      vectorResults = (
   940	        vectorSearchWithContiguity(
   941	          vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
   942	          3600,
   943	        ) as PipelineRow[] | null
   944	      ) ?? vectorResults;
   945	    }
   946	    candidates = vectorResults;
   947	  }
   948	
   949	  // -- Unknown search type -----------------------------------------------------
   950	
   951	  else {
   952	    throw new Error(
   953	      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
   954	    );
   955	  }
   956	
   957	  // -- Tier and contextType filtering -----------------------------------------
   958	  //
   959	  // Applied after candidate collection but before constitutional injection so
   960	  // Injected constitutional rows are evaluated by the same filters.
   961	  // Exception: for hybrid search, tier/contextType are applied here because
   962	  // SearchWithFallback does not accept these parameters directly.
   963	  // For vector search, tier/contextType were already passed to vectorSearch,
   964	  // So this is a no-op guard for those fields.
   965	
   966	  if (tier) {
   967	    candidates = candidates.filter((r) => r.importance_tier === tier);
   968	  }
   969	
   970	  if (contextType) {
   971	    candidates = candidates.filter(
   972	      (r) => resolveRowContextType(r) === contextType
   973	    );
   974	  }
   975	
   976	  // P0 fix: sessionId is for dedup/state tracking, NOT a governance boundary.
   977	  // Including it here caused all candidates to be filtered out when memory_context
   978	  // passed an ephemeral sessionId, because memories don't have session-scoped access.
   979	  const hasGovernanceScope = Boolean(
   980	    tenantId

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Query Classifier
     3	// ───────────────────────────────────────────────────────────────
     4	/* --- 1. TYPES & CONSTANTS --- */
     5	
     6	// Feature catalog: Query complexity router
     7	
     8	type QueryComplexityTier = 'simple' | 'moderate' | 'complex';
     9	
    10	interface ClassificationResult {
    11	  tier: QueryComplexityTier;
    12	  features: {
    13	    termCount: number;
    14	    charCount: number;
    15	    hasTriggerMatch: boolean;
    16	    stopWordRatio: number;
    17	  };
    18	  confidence: 'high' | 'medium' | 'low' | 'fallback';
    19	}
    20	
    21	/** Config-driven thresholds */
    22	const SIMPLE_TERM_THRESHOLD = 3;
    23	const COMPLEX_TERM_THRESHOLD = 8;
    24	
    25	/** Common English stop words for semantic complexity heuristic */
    26	const STOP_WORDS: ReadonlySet<string> = new Set([
    27	  'the', 'a', 'an', 'is', 'are', 'was', 'were',
    28	  'in', 'on', 'at', 'to', 'for', 'of',
    29	  'and', 'or', 'but', 'not',
    30	  'with', 'this', 'that', 'it',
    31	  'from', 'by', 'as', 'be',
    32	  'has', 'had', 'have',
    33	  'do', 'does', 'did',
    34	  'will', 'would', 'can', 'could', 'should', 'may', 'might',
    35	]);
    36	
    37	/* --- 2. FEATURE FLAG --- */
    38	
    39	/**
    40	 * Check if the complexity router feature flag is enabled.
    41	 * Default: TRUE (graduated). Set SPECKIT_COMPLEXITY_ROUTER=false to disable.
    42	 *
    43	 * @returns True when SPECKIT_COMPLEXITY_ROUTER is not explicitly disabled.
    44	 */
    45	function isComplexityRouterEnabled(): boolean {
    46	  const raw = process.env.SPECKIT_COMPLEXITY_ROUTER?.toLowerCase()?.trim();
    47	  return raw !== 'false';
    48	}
    49	
    50	/* --- 3. FEATURE EXTRACTION --- */
    51	
    52	/**
    53	 * Split query into terms by whitespace, filtering empty strings.
    54	 *
    55	 * @param query - Raw query string to tokenize.
    56	 * @returns Array of non-empty whitespace-delimited terms.
    57	 */
    58	function extractTerms(query: string): string[] {
    59	  return query.trim().split(/\s+/).filter(t => t.length > 0);
    60	}
    61	
    62	/**
    63	 * Calculate the ratio of stop words in the query terms.
    64	 * Returns 0 for empty term lists.
    65	 *
    66	 * @param terms - Array of query terms to analyse.
    67	 * @returns Ratio in [0, 1] of stop words to total terms.
    68	 */
    69	function calculateStopWordRatio(terms: string[]): number {
    70	  if (terms.length === 0) return 0;
    71	  const stopCount = terms.filter(t => STOP_WORDS.has(t.toLowerCase())).length;
    72	  return stopCount / terms.length;
    73	}
    74	
    75	/**
    76	 * Check if the query exactly matches any known trigger phrase (case-insensitive).
    77	 *
    78	 * @param query          - Raw query string to test.
    79	 * @param triggerPhrases - Known trigger phrases to match against.
    80	 * @returns True when the query matches a trigger phrase exactly.
    81	 */
    82	function hasTriggerMatch(query: string, triggerPhrases: string[]): boolean {
    83	  if (triggerPhrases.length === 0) return false;
    84	  const normalized = query.trim().toLowerCase();
    85	  return triggerPhrases.some(tp => tp.trim().toLowerCase() === normalized);
    86	}
    87	
    88	/* --- 4. CLASSIFICATION --- */
    89	
    90	/**
    91	 * Determine confidence label based on how clearly the query fits its tier.
    92	 *
    93	 * @param tier          - Classified complexity tier.
    94	 * @param termCount     - Number of query terms.
    95	 * @param hasTrigger    - Whether a trigger phrase matched.
    96	 * @param stopWordRatio - Ratio of stop words in query.
    97	 * @returns Confidence label: 'high', 'medium', or 'low'.
    98	 */
    99	function determineConfidence(
   100	  tier: QueryComplexityTier,
   101	  termCount: number,
   102	  hasTrigger: boolean,
   103	  stopWordRatio: number,
   104	): 'high' | 'medium' | 'low' {
   105	  if (tier === 'simple') {
   106	    // Trigger match is strongest simplicity signal — overrides term count
   107	    if (hasTrigger) return 'high';
   108	    if (termCount <= 2) return 'high';
   109	    return 'medium';
   110	  }
   111	
   112	  if (tier === 'complex') {
   113	    // High confidence: many terms and low stop-word ratio (content-rich)
   114	    if (termCount > 12) return 'high';
   115	    if (stopWordRatio < 0.3) return 'high';
   116	    return 'medium';
   117	  }
   118	
   119	  // Moderate tier: inherently less certain (between boundaries)
   120	  if (termCount === SIMPLE_TERM_THRESHOLD + 1 || termCount === COMPLEX_TERM_THRESHOLD) {
   121	    return 'low'; // Near boundary
   122	  }
   123	  return 'medium';
   124	}
   125	
   126	/**
   127	 * Classify a query's complexity into one of three tiers: simple, moderate, or complex.
   128	 *
   129	 * Classification boundaries:
   130	 * - Simple: ≤3 terms OR trigger phrase match
   131	 * - Complex: >8 terms AND no trigger match
   132	 * - Moderate: everything else (interior)
   133	 *
   134	 * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled (enabled by default,
   135	 * graduated), all queries classify as "complex" (safe fallback — full pipeline).
   136	 *
   137	 * On any error, returns "complex" (safe fallback per spec).
   138	 *
   139	 * @param query          - Raw user query string.
   140	 * @param triggerPhrases - Optional array of known trigger phrases.
   141	 * @returns ClassificationResult with tier, features, and confidence.
   142	 */
   143	function classifyQueryComplexity(
   144	  query: string,
   145	  triggerPhrases?: string[],
   146	): ClassificationResult {
   147	  // Safe fallback for any unexpected state
   148	  const FALLBACK: ClassificationResult = {
   149	    tier: 'complex',
   150	    features: { termCount: 0, charCount: 0, hasTriggerMatch: false, stopWordRatio: 0 },
   151	    confidence: 'fallback',
   152	  };
   153	
   154	  try {
   155	    // Feature flag gate: when disabled, always return complex
   156	    if (!isComplexityRouterEnabled()) {
   157	      return FALLBACK;
   158	    }
   159	
   160	    // Edge case: empty or whitespace-only queries → complex fallback
   161	    if (!query || typeof query !== 'string' || query.trim().length === 0) {
   162	      return FALLBACK;
   163	    }
   164	
   165	    const terms = extractTerms(query);
   166	    const termCount = terms.length;
   167	    const charCount = query.length;
   168	    const triggers = triggerPhrases ?? [];
   169	    const triggerMatch = hasTriggerMatch(query, triggers);
   170	    const stopWordRatio = calculateStopWordRatio(terms);
   171	
   172	    // Classification boundaries
   173	    let tier: QueryComplexityTier;
   174	
   175	    // TriggerMatch always forces simple tier regardless of term count
   176	    if (triggerMatch || termCount <= SIMPLE_TERM_THRESHOLD) {
   177	      tier = 'simple';
   178	    } else if (termCount > COMPLEX_TERM_THRESHOLD && !triggerMatch) {
   179	      tier = 'complex';
   180	    } else {
   181	      tier = 'moderate';
   182	    }
   183	
   184	    const confidence = determineConfidence(tier, termCount, triggerMatch, stopWordRatio);
   185	
   186	    return {
   187	      tier,
   188	      features: {
   189	        termCount,
   190	        charCount,
   191	        hasTriggerMatch: triggerMatch,
   192	        // Round to 3 decimals to avoid floating-point noise in debug output
   193	        stopWordRatio: Math.round(stopWordRatio * 1000) / 1000,
   194	      },
   195	      confidence,
   196	    };
   197	  } catch (_err: unknown) {
   198	    // Classification failure — return moderate default
   199	    return FALLBACK;
   200	  }
   201	}
   202	
   203	/* --- 5. EXPORTS --- */
   204	
   205	export {
   206	  // Types
   207	  type QueryComplexityTier,
   208	  type ClassificationResult,
   209	
   210	  // Constants
   211	  SIMPLE_TERM_THRESHOLD,
   212	  COMPLEX_TERM_THRESHOLD,
   213	  STOP_WORDS,
   214	
   215	  // Functions
   216	  classifyQueryComplexity,
   217	  isComplexityRouterEnabled,
   218	
   219	  // Internal helpers (exported for testing)
   220	  extractTerms,
   221	  calculateStopWordRatio,
   222	  hasTriggerMatch,
   223	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | sed -n '2370,2412p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2370	      CREATE TABLE IF NOT EXISTS vec_metadata (
  2371	        key TEXT PRIMARY KEY,
  2372	        value TEXT NOT NULL,
  2373	        created_at TEXT DEFAULT (datetime('now'))
  2374	      )
  2375	    `);
  2376	    database.prepare(`
  2377	      INSERT OR REPLACE INTO vec_metadata (key, value) VALUES ('embedding_dim', ?)
  2378	    `).run(String(embedding_dim));
  2379	    logger.info(`Created vec_memories table with dimension ${embedding_dim}`);
  2380	  }
  2381	
  2382	  // Create FTS5 virtual table (includes content_text for full-text search)
  2383	  database.exec(`
  2384	    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
  2385	      title, trigger_phrases, file_path, content_text,
  2386	      content='memory_index', content_rowid='id'
  2387	    )
  2388	  `);
  2389	
  2390	  // Create FTS5 sync triggers (includes content_text)
  2391	  database.exec(`
  2392	    CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
  2393	      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
  2394	      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
  2395	    END
  2396	  `);
  2397	
  2398	  database.exec(`
  2399	    CREATE TRIGGER IF NOT EXISTS memory_fts_update AFTER UPDATE ON memory_index BEGIN
  2400	      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
  2401	      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
  2402	      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
  2403	      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
  2404	    END
  2405	  `);
  2406	
  2407	  database.exec(`
  2408	    CREATE TRIGGER IF NOT EXISTS memory_fts_delete AFTER DELETE ON memory_index BEGIN
  2409	      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
  2410	      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
  2411	    END
  2412	  `);

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1080,1090p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1080	## User preferences
  1081	
  1082	- user required “log warning and continue instead of returning rejected” for warn-only Gates 1-3 and “do not modify ... memory-index.ts” -> keep scope tightly in `processPreparedMemory()` [Task 1]
  1083	- user required build + runtime verification (`npm run build`, forced scan/index evidence) before closeout [Task 1]
  1084	- when user asked “how to fix whilst keeping auto,” keep `EMBEDDINGS_PROVIDER=auto` and avoid hardcoded DB/env paths that force provider fallback [Task 4]
  1085	- when Desktop MCP was missing and user asked “add to user level codex config first,” apply `~/.codex/config.toml` feature/config edits before deeper probes [Task 6]
  1086	- when user then said “just tried but no luck. investigate deeper,” continue beyond one fix attempt into session metadata/log evidence [Task 6]
  1087	- when user requested ablation verification, run `eval_run_ablation({ mode:"ablation", includeFormattedReport:true, storeResults:true })` through Codex MCP before declaring FTS5 outcomes [Task 7]
  1088	- when user ordered ablation first and docs second, resolve Codex↔spec_kit_memory handshake blockers before documentation edits [Task 7]
  1089	
  1090	## Reusable knowledge

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1560,1608p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'rg -n "collectRawCandidates|query classifier|simple queries|activeChannels|keywordResults|fuseResultsMulti|adaptive weights" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
10:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
1008:    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
1011:    const activeChannels = options.forceAllChannels
1019:      if (!allowedChannels.has(channel)) activeChannels.delete(channel);
1022:    const skippedChannels = allPossibleChannels.filter(ch => !activeChannels.has(ch));
1062:    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
1095:    if (activeChannels.has('fts')) {
1105:    if (activeChannels.has('bm25')) {
1115:    const useGraph = (options.useGraph !== false) && activeChannels.has('graph');
1140:    if (activeChannels.has('degree') && db && isDegreeBoostEnabled()) {
1182:    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
1229:    const keywordFusionResults = keywordResults.map((result) => ({
1253:    const fused = fuseResultsMulti(fusionLists);
1684:async function collectRawCandidates(
2470:  collectRawCandidates,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '976,1050p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   976	 */
   977	async function hybridSearchEnhanced(
   978	  query: string,
   979	  embedding: Float32Array | number[] | null,
   980	  options: HybridSearchOptions = {}
   981	): Promise<HybridSearchResult[]> {
   982	  const execution = await collectAndFuseHybridResults(query, embedding, options);
   983	  if (execution) {
   984	    if (options.stopAfterFusion) {
   985	      return applyResultLimit(execution.fusedResults, options.limit);
   986	    }
   987	
   988	    return enrichFusedResults(query, execution, options);
   989	  }
   990	
   991	  return hybridSearch(query, embedding, options);
   992	}
   993	
   994	async function collectAndFuseHybridResults(
   995	  query: string,
   996	  embedding: Float32Array | number[] | null,
   997	  options: HybridSearchOptions = {}
   998	): Promise<HybridFusionExecution | null> {
   999	  try {
  1000	    const evaluationMode = options.evaluationMode === true;
  1001	    const lists: HybridFusionExecution['lists'] = [];
  1002	
  1003	    // Pipeline metadata collector (populated by flag-gated stages)
  1004	    const s3meta: Sprint3PipelineMeta = {};
  1005	
  1006	    // -- Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
  1007	    // When enabled, classifies query complexity and restricts channels to a
  1008	    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
  1009	    const routeResult = routeQuery(query, options.triggerPhrases);
  1010	    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
  1011	    const activeChannels = options.forceAllChannels
  1012	      ? new Set<ChannelName>(allPossibleChannels)
  1013	      : new Set<ChannelName>(routeResult.channels);
  1014	
  1015	    // Respect explicit caller channel disables across both the primary route and
  1016	    // every fallback tier. useGraph=false also disables the dependent degree lane.
  1017	    const allowedChannels = getAllowedChannels(options);
  1018	    for (const channel of allPossibleChannels) {
  1019	      if (!allowedChannels.has(channel)) activeChannels.delete(channel);
  1020	    }
  1021	
  1022	    const skippedChannels = allPossibleChannels.filter(ch => !activeChannels.has(ch));
  1023	
  1024	    if (skippedChannels.length > 0) {
  1025	      s3meta.routing = {
  1026	        tier: routeResult.tier,
  1027	        channels: routeResult.channels,
  1028	        skippedChannels,
  1029	        featureFlagEnabled: isComplexityRouterEnabled(),
  1030	        confidence: routeResult.classification.confidence,
  1031	        features: routeResult.classification.features as Record<string, unknown>,
  1032	      };
  1033	    }
  1034	
  1035	    // -- Stage E: Dynamic Token Budget (SPECKIT_DYNAMIC_TOKEN_BUDGET) --
  1036	    // Compute tier-aware budget early so it's available for downstream truncation.
  1037	    // When disabled, getDynamicTokenBudget returns the default 4000 budget with applied=false.
  1038	    const budgetResult = getDynamicTokenBudget(routeResult.tier);
  1039	    if (budgetResult.applied && !evaluationMode) {
  1040	      s3meta.tokenBudget = {
  1041	        tier: budgetResult.tier,
  1042	        budget: budgetResult.budget,
  1043	        applied: budgetResult.applied,
  1044	        featureFlagEnabled: isDynamicTokenBudgetEnabled(),
  1045	        configValues: DEFAULT_TOKEN_BUDGET_CONFIG as unknown as Record<string, number>,
  1046	        // headerOverhead and adjustedBudget are patched in below after they are computed
  1047	        headerOverhead: 0,
  1048	        adjustedBudget: budgetResult.budget,
  1049	      };
  1050	    }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1188,1260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1188	      return {
  1189	        evaluationMode,
  1190	        intent: options.intent || classifyIntent(query).intent,
  1191	        lists,
  1192	        routeResult,
  1193	        budgetResult,
  1194	        s3meta,
  1195	        vectorEmbeddingCache,
  1196	        fusedResults: collectCandidatesFromLists(
  1197	          lists.filter((list) => list.source !== 'degree'),
  1198	          options.limit ?? DEFAULT_LIMIT
  1199	        ),
  1200	      };
  1201	    }
  1202	
  1203	    if (lists.length === 0) {
  1204	      return null;
  1205	    }
  1206	
  1207	    // Track multi-source and graph-only results
  1208	    const sourceMap = new Map<string, Set<string>>();
  1209	    for (const list of lists) {
  1210	      for (const r of list.results) {
  1211	        const key = canonicalResultId(r.id);
  1212	        if (!sourceMap.has(key)) sourceMap.set(key, new Set());
  1213	        sourceMap.get(key)!.add(list.source); // non-null safe: has() guard above guarantees entry exists
  1214	      }
  1215	    }
  1216	    for (const [, sources] of sourceMap) {
  1217	      if (sources.size > 1) graphMetrics.multiSourceResults++;
  1218	      if (sources.size === 1 && sources.has('graph')) graphMetrics.graphOnlyResults++;
  1219	    }
  1220	
  1221	    // C138/T315: Build weighted fusion lists once from lightweight adaptive
  1222	    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
  1223	    const intent = options.intent || classifyIntent(query).intent;
  1224	    const adaptiveEnabled = isAdaptiveFusionEnabled();
  1225	    const fusionWeights = adaptiveEnabled
  1226	      ? getAdaptiveWeights(intent)
  1227	      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
  1228	    const { semanticWeight, keywordWeight, graphWeight: adaptiveGraphWeight } = fusionWeights;
  1229	    const keywordFusionResults = keywordResults.map((result) => ({
  1230	      ...result,
  1231	      source: 'keyword',
  1232	    }));
  1233	    const fusionLists = lists
  1234	      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
  1235	      .map((list) => {
  1236	        if (list.source === 'vector') {
  1237	          return { ...list, weight: semanticWeight };
  1238	        }
  1239	        if (list.source === 'graph' && typeof adaptiveGraphWeight === 'number') {
  1240	          return { ...list, weight: adaptiveGraphWeight };
  1241	        }
  1242	        return { ...list };
  1243	      });
  1244	
  1245	    if (keywordFusionResults.length > 0 && keywordWeight > 0) {
  1246	      fusionLists.push({
  1247	        source: 'keyword',
  1248	        results: keywordFusionResults,
  1249	        weight: keywordWeight,
  1250	      });
  1251	    }
  1252	
  1253	    const fused = fuseResultsMulti(fusionLists);
  1254	
  1255	    const fusedResults = fused.map(toHybridResult).map((row) => {
  1256	      const rowRecord = row as Record<string, unknown>;
  1257	      if (rowRecord.parentMemoryId !== undefined) return row;
  1258	      const normalizedParentMemoryId = rowRecord.parent_id ?? rowRecord.parentId;
  1259	      if (normalizedParentMemoryId === undefined) return row;
  1260	      return {

codex
I’ve mostly been on direct source reads so far because they’re the fastest way to verify the exact ranking logic, but I want one CocoIndex pass here to satisfy the semantic-search side of the comparison and see whether it helps on the Go subtree or just confirms that direct reads are the better route for this repo slice.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
# Iteration 005: SEARCH MECHANISMS

## Focus
SEARCH MECHANISMS: FTS, vector, hybrid, ranking algorithms. Query processing, shortcuts, relevance scoring.

## Findings
### Finding 1: Engram gives `topic_key` queries a deterministic fast path that bypasses normal FTS ranking
- **Source**: [store.go:1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1462), [store.go:3198](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3198)
- **What it does**: If the query contains `/`, `Search()` first checks `topic_key = ?`, orders exact matches by `updated_at DESC`, assigns them a sentinel `Rank = -1000`, prepends them ahead of FTS results, and deduplicates the final list. `SuggestTopicKey()` creates stable families like `architecture/...`, `bug/...`, `decision/...`, and `session/...`.
- **Why it matters for us**: Public has trigger phrases and hybrid retrieval, but it does not have a comparable exact thread-key retrieval shortcut for evolving decisions, incidents, or recurring session narratives.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Engram’s FTS query sanitization is intentionally blunt and safer than raw MATCH, but narrower than Public’s lexical lane
- **Source**: [store.go:1518](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1518), [store.go:3382](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3382), [sqlite-fts.ts:162](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L162)
- **What it does**: Engram turns `fix auth bug` into `"fix" "auth" "bug"` before `MATCH`, which prevents syntax blowups but keeps query logic very simple. Public normalizes lexical tokens, wraps them, joins them with `OR`, and runs weighted BM25 FTS5 over `title`, `trigger_phrases`, `file_path`, and `content_text`.
- **Why it matters for us**: Engram proves the value of always sanitizing user text before FTS, but Public already has a stronger lexical implementation for recall and field weighting.
- **Recommendation**: reject
- **Impact**: medium

### Finding 3: Engram’s search stack is easy to reason about because it is basically one lexical path, while Public’s ranking power comes from a much deeper fusion pipeline
- **Source**: [mcp.go:625](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L625), [store.go:1521](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1521), [memory-search.ts:771](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771), [hybrid-search.ts:1006](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1006), [stage3-rerank.ts:120](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L120)
- **What it does**: Engram runs exact topic-key match plus FTS and formats preview results. Public runs Stage 1 candidate generation, hybrid/vector/lexical collection, Stage 2 fusion with session/causal/feedback signals, then Stage 3 reranking with cross-encoder, MMR, and MPAB aggregation.
- **Why it matters for us**: Engram is weaker on recall and ranking quality, but much stronger on explainability. Public’s search is more capable, but much harder to debug mentally when a result looks wrong.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Public’s query-shape routing is a real advantage; Engram applies the same lexical recipe to every query
- **Source**: [query-classifier.ts:126](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts#L126), [hybrid-search.ts:1006](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1006), [stage1-candidate-gen.ts:616](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L616), [mcp.go:625](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L625)
- **What it does**: Public classifies queries as simple/moderate/complex, can suppress channels, uses deep-mode query expansion only when warranted, and falls back gracefully. Engram always runs the same `topic_key` shortcut plus FTS flow regardless of query shape.
- **Why it matters for us**: We should not simplify Public down to Engram’s fixed route. Our corpus, retrieval goals, and failure-handling needs justify route-aware search.
- **Recommendation**: reject
- **Impact**: medium

### Finding 5: Engram’s search quality depends heavily on write-time hygiene: revisions, duplicates, and soft deletes are first-class search signals
- **Source**: [store.go:948](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L948), [store.go:1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1462), [store.go:452](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L452)
- **What it does**: `AddObservation()` upserts by `topic_key`, increments `revision_count`, suppresses near-duplicate inserts via `normalized_hash` + time window by incrementing `duplicate_count`, and `Search()` excludes `deleted_at IS NOT NULL` in both exact and FTS paths. Those counters are exposed back to callers.
- **Why it matters for us**: Public already has dedup and archival filters, but it does not expose a similarly compact “this result is the latest revision of a stable thread” signal in retrieval results.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 6: Public is operationally safer than Engram when the lexical lane is unhealthy
- **Source**: [store.go:1549](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1549), [sqlite-fts.ts:92](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L92), [sqlite-fts.ts:208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L208), [memory-search.ts:904](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L904)
- **What it does**: Engram treats FTS as required and returns a search error if the lexical query fails. Public probes compile flags and table presence, records whether the lexical path is `fts5`, `like`, or unavailable, and fails open by returning empty lexical-lane results while preserving the rest of the retrieval pipeline.
- **Why it matters for us**: This is one area where Engram’s simplicity is a liability. Public’s fallback behavior is better suited to an always-on MCP memory surface.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [mcp_server/handlers/memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [mcp_server/handlers/memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [mcp_server/lib/search/sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts)
- [mcp_server/lib/search/bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts)
- [mcp_server/lib/search/hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
- [mcp_server/lib/search/pipeline/stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
- [mcp_server/lib/search/pipeline/stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
- [mcp_server/lib/search/pipeline/stage3-rerank.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts)
- [mcp_server/lib/search/query-classifier.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts)
- [mcp_server/lib/search/vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
- [mcp_server/lib/search/vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)

## Assessment
- New information ratio: 0.76
- Questions addressed: [3, 4, 5, 9]
- Questions answered: [4, 5, 9 fully; 3 partially]

## Reflection
- What worked: tracing `Search()`, `AddObservation()`, `SuggestTopicKey()`, and the MCP `mem_search` handler together made Engram’s search model much clearer than any top-level doc could; comparing that directly against Public’s `memory_search` pipeline, lexical helpers, and reranking stages exposed which differences are architectural versus just implementation detail.
- What did not work: the CocoIndex pass on this subtree did not complete, so I fell back to `rg`, `nl`, and direct file inspection for both Engram and Public. That was still enough for this iteration because the key ranking logic sits in a small number of source files.

## Recommended Next Focus
Trace search explainability and provenance next: how Engram’s compact result model plus `mem_get_observation`/`mem_timeline` compare with Public’s per-lane fusion metadata, lexical-path snapshots, and rerank stages, so we can decide whether the right follow-on is an exact `topic_key` fast path, a debug/diagnostic retrieval mode, or both.
hook: Stop
hook: Stop Completed
tokens used
193,679
# Iteration 005: SEARCH MECHANISMS

## Focus
SEARCH MECHANISMS: FTS, vector, hybrid, ranking algorithms. Query processing, shortcuts, relevance scoring.

## Findings
### Finding 1: Engram gives `topic_key` queries a deterministic fast path that bypasses normal FTS ranking
- **Source**: [store.go:1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1462), [store.go:3198](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3198)
- **What it does**: If the query contains `/`, `Search()` first checks `topic_key = ?`, orders exact matches by `updated_at DESC`, assigns them a sentinel `Rank = -1000`, prepends them ahead of FTS results, and deduplicates the final list. `SuggestTopicKey()` creates stable families like `architecture/...`, `bug/...`, `decision/...`, and `session/...`.
- **Why it matters for us**: Public has trigger phrases and hybrid retrieval, but it does not have a comparable exact thread-key retrieval shortcut for evolving decisions, incidents, or recurring session narratives.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Engram’s FTS query sanitization is intentionally blunt and safer than raw MATCH, but narrower than Public’s lexical lane
- **Source**: [store.go:1518](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1518), [store.go:3382](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3382), [sqlite-fts.ts:162](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L162)
- **What it does**: Engram turns `fix auth bug` into `"fix" "auth" "bug"` before `MATCH`, which prevents syntax blowups but keeps query logic very simple. Public normalizes lexical tokens, wraps them, joins them with `OR`, and runs weighted BM25 FTS5 over `title`, `trigger_phrases`, `file_path`, and `content_text`.
- **Why it matters for us**: Engram proves the value of always sanitizing user text before FTS, but Public already has a stronger lexical implementation for recall and field weighting.
- **Recommendation**: reject
- **Impact**: medium

### Finding 3: Engram’s search stack is easy to reason about because it is basically one lexical path, while Public’s ranking power comes from a much deeper fusion pipeline
- **Source**: [mcp.go:625](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L625), [store.go:1521](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1521), [memory-search.ts:771](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771), [hybrid-search.ts:1006](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1006), [stage3-rerank.ts:120](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L120)
- **What it does**: Engram runs exact topic-key match plus FTS and formats preview results. Public runs Stage 1 candidate generation, hybrid/vector/lexical collection, Stage 2 fusion with session/causal/feedback signals, then Stage 3 reranking with cross-encoder, MMR, and MPAB aggregation.
- **Why it matters for us**: Engram is weaker on recall and ranking quality, but much stronger on explainability. Public’s search is more capable, but much harder to debug mentally when a result looks wrong.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Public’s query-shape routing is a real advantage; Engram applies the same lexical recipe to every query
- **Source**: [query-classifier.ts:126](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts#L126), [hybrid-search.ts:1006](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1006), [stage1-candidate-gen.ts:616](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L616), [mcp.go:625](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L625)
- **What it does**: Public classifies queries as simple/moderate/complex, can suppress channels, uses deep-mode query expansion only when warranted, and falls back gracefully. Engram always runs the same `topic_key` shortcut plus FTS flow regardless of query shape.
- **Why it matters for us**: We should not simplify Public down to Engram’s fixed route. Our corpus, retrieval goals, and failure-handling needs justify route-aware search.
- **Recommendation**: reject
- **Impact**: medium

### Finding 5: Engram’s search quality depends heavily on write-time hygiene: revisions, duplicates, and soft deletes are first-class search signals
- **Source**: [store.go:948](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L948), [store.go:1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1462), [store.go:452](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L452)
- **What it does**: `AddObservation()` upserts by `topic_key`, increments `revision_count`, suppresses near-duplicate inserts via `normalized_hash` + time window by incrementing `duplicate_count`, and `Search()` excludes `deleted_at IS NOT NULL` in both exact and FTS paths. Those counters are exposed back to callers.
- **Why it matters for us**: Public already has dedup and archival filters, but it does not expose a similarly compact “this result is the latest revision of a stable thread” signal in retrieval results.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 6: Public is operationally safer than Engram when the lexical lane is unhealthy
- **Source**: [store.go:1549](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1549), [sqlite-fts.ts:92](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L92), [sqlite-fts.ts:208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L208), [memory-search.ts:904](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L904)
- **What it does**: Engram treats FTS as required and returns a search error if the lexical query fails. Public probes compile flags and table presence, records whether the lexical path is `fts5`, `like`, or unavailable, and fails open by returning empty lexical-lane results while preserving the rest of the retrieval pipeline.
- **Why it matters for us**: This is one area where Engram’s simplicity is a liability. Public’s fallback behavior is better suited to an always-on MCP memory surface.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [mcp_server/handlers/memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [mcp_server/handlers/memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [mcp_server/lib/search/sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts)
- [mcp_server/lib/search/bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts)
- [mcp_server/lib/search/hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
- [mcp_server/lib/search/pipeline/stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
- [mcp_server/lib/search/pipeline/stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
- [mcp_server/lib/search/pipeline/stage3-rerank.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts)
- [mcp_server/lib/search/query-classifier.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts)
- [mcp_server/lib/search/vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
- [mcp_server/lib/search/vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)

## Assessment
- New information ratio: 0.76
- Questions addressed: [3, 4, 5, 9]
- Questions answered: [4, 5, 9 fully; 3 partially]

## Reflection
- What worked: tracing `Search()`, `AddObservation()`, `SuggestTopicKey()`, and the MCP `mem_search` handler together made Engram’s search model much clearer than any top-level doc could; comparing that directly against Public’s `memory_search` pipeline, lexical helpers, and reranking stages exposed which differences are architectural versus just implementation detail.
- What did not work: the CocoIndex pass on this subtree did not complete, so I fell back to `rg`, `nl`, and direct file inspection for both Engram and Public. That was still enough for this iteration because the key ranking logic sits in a small number of source files.

## Recommended Next Focus
Trace search explainability and provenance next: how Engram’s compact result model plus `mem_get_observation`/`mem_timeline` compare with Public’s per-lane fusion metadata, lexical-path snapshots, and rerank stages, so we can decide whether the right follow-on is an exact `topic_key` fast path, a debug/diagnostic retrieval mode, or both.
