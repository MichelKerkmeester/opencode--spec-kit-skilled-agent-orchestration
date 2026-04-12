### Finding 3: Explicit `session_start` and `session_end` tools overlap with Public’s stronger trust model, so the value is real but the integration is expensive
- **Source**: [external/internal/mcp/mcp.go:515](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:515), [external/internal/mcp/mcp.go:1064](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1064), [external/internal/store/store.go:754](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:754), [external/internal/store/store.go:1613](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613), [session-manager.ts:385](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385), [memory-context.ts:821](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:821), [session-resume.ts:400](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400), [session-bootstrap.ts:163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163)
- **What it does**: Engram persists session rows explicitly and exposes start/end as first-class tools. Public already has richer session orchestration through trusted session IDs, `memory_context`, `session_resume`, and `session_bootstrap`.
- **Why it matters for us**: A lightweight open/close surface could help agent-agnostic integrations, but it would have to preserve Public’s identity binding, resume contracts, and bootstrap semantics. Integration difficulty is high because this touches tool schemas, trust enforcement, session persistence, and the existing resume UX.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Passive capture is worth adding only if we treat it as a new ingestion lane, not a shortcut around `generate-context`
- **Source**: [external/internal/mcp/mcp.go:565](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:565), [external/internal/store/store.go:3411](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3411), [external/internal/store/store.go:3483](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3483), [context-server.ts:1020](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1020), [markdown-evidence-builder.ts:159](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:159), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- **What it does**: Engram parses a trailing “Key Learnings” section, extracts bullets/numbered items, dedupes them by normalized hash, and saves each as a separate observation. Public currently has passive enrichment for hints and explicit learning/history tooling, but not a lightweight durable capture path from freeform output.
- **Why it matters for us**: This is useful for subagent or long-task closeout, but it should complement, not replace, spec-folder memory saves. Integration difficulty is medium-high because Public is markdown-first and would need transaction-safe capture, explicit provenance, and a clean relationship to `generate-context`.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 5: The cheapest immediate integration rule is not to copy Engram’s silent session auto-create behavior
- **Source**: [external/internal/mcp/mcp.go:728](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:728), [external/internal/mcp/mcp.go:867](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:867), [external/internal/mcp/mcp.go:1046](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1046), [external/internal/mcp/mcp.go:1114](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1114), [memory-context.ts:1229](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1229), [memory-triggers.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:207), [session-bootstrap.ts:168](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168)
- **What it does**: Engram’s `mem_save`, `mem_save_prompt`, `mem_session_summary`, and defaulted passive capture create sessions implicitly and ignore the `CreateSession()` error, while Public rejects bad session scope early and composes recovery through `session_bootstrap`.
- **Why it matters for us**: If we adopt profile splits, explicit session tools, or passive capture, this guardrail is the easiest win: keep Public’s fail-closed semantics and structured recovery. Integration difficulty is low because it is mostly handler policy and shared-helper reuse, not storage redesign.
- **Recommendation**: adopt now
- **Impact**: high

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [sk-deep-research/SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/store/store_test.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [markdown-evidence-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)

## Assessment
- New information ratio: 0.74
- Questions addressed: Q1, Q2, Q3, Q4, Q6, Q9, Q10
- Questions answered: Q1, Q2, Q3, Q4, Q6, Q9, Q10

## Reflection
- What worked: tracing Engram from MCP registration into store behavior, then mapping each candidate onto Public’s actual handlers, made the integration-cost calls much more reliable than architecture prose alone; the best contrast came from Public’s trusted-session and bootstrap surfaces.
- What did not work: CocoIndex cancelled again on the Go subtree, so this iteration relied on `rg` plus direct reads; the exact strict validator command still emitted `cannot create temp file for here document: Operation not permitted`, but it finished with `RESULT: PASSED`.

## Recommended Next Focus
Cross-check phases 003 and 004 for whether they already solve thread-keyed updates or lightweight ingestion better than Engram, then sketch a Public MVP that combines: profile-gated tool surfacing, optional `thread_key` metadata plus exact lookup, and a transactional passive-capture lane that preserves `session_bootstrap` and trusted-session semantics.

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
# Iteration 018: RISK ASSESSMENT

## Focus
RISK ASSESSMENT: What are the risks of adopting each recommended pattern? What could go wrong?

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
I’m treating this as a read-only research pass focused on iteration 18’s risk assessment. I’ll first load the governing local instructions and any relevant prior-memory pointers, then trace the Engram code paths and compare them directly against Public’s current memory stack.
exec
/bin/zsh -lc 'rg -n "engram|hybrid-rag-fusion|topic_key|passive capture|ProfileAgent|ProfileAdmin|session lifecycle" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "pwd && printf '\\n--- ROOT FILES ---\\n' && rg --files -g 'AGENTS.md' -g 'CLAUDE.md' . /Users/michelkerkmeester/.codex/memories | sed 's#"'^'"\\./##' | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

--- ROOT FILES ---
.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/external/opencode-lcm-master/AGENTS.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/e2e-artifacts/session-create-internal/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-github/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-omp/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-pi/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/007-relay-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/e2e/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop-electron/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/test/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md
.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
AGENTS.md
CLAUDE.md

codex
I’ve got the relevant memory hits and repo instruction files located. Next I’m loading the governing guidance plus the Engram-specific external instructions, then I’ll walk the MCP and store implementations end to end.
exec
/bin/zsh -lc "sed -n '1,240p' AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
Trigger: About to skip gates, or realized gates were skipped → STOP → STATE: "Before I proceed, I need to ask about documentation:" → ASK Gate 3 (A/B/C/D/E) → WAIT
- **Exception:** If the user already answered Gate 3 earlier in this conversation for the same task, do NOT re-ask. Reuse the existing answer and proceed.

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

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,240p' CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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


exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I’ve loaded the repo rules and the deep-research protocol. I’m treating `sk-deep-research` as the active workflow for this turn, but staying read-only and focused on a single iteration question: adoption risk by pattern.
exec
/bin/zsh -lc "printf '--- PHASE DOCS ---\\n' && rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main | rg '/(spec|plan|tasks|checklist|decision-record|implementation-summary)\\.md"'$|phase-research-prompt'"\\.md"'$|research/research'"\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
--- PHASE DOCS ---
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/tasks.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-plugin/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/tasks.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/specs/obsidian-export/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-plugin/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/phase-research-prompt.md

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1150ms:

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
The strict validator completed and still reported `RESULT: PASSED`, but it also emitted a sandbox-side temp-file warning from the script. I’m treating the pass as usable evidence and now drilling into the Engram MCP/store code plus Public counterparts for the risk analysis itself.
exec
/bin/zsh -lc "find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main -maxdepth 2 -type f \\( -name 'spec.md' -o -name 'plan.md' -o -name 'tasks.md' -o -name 'checklist.md' -o -name 'decision-record.md' -o -name 'implementation-summary.md' -o -name 'phase-research-prompt.md' -o -path '*/research/research.md' \\) | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/phase-research-prompt.md

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
CocoIndex cancelled again on both the Go subtree and the Public handlers, which matches the earlier note. I’m switching to targeted `rg` plus direct reads so the findings stay code-backed instead of speculative.
exec
/bin/zsh -lc "rg -n \"ProfileAgent|ProfileAdmin|ResolveTools|shouldRegister|mem_search|mem_save|mem_context|mem_session_summary|mem_session_start|mem_session_end|mem_suggest_topic_key|mem_capture_passive|CreateSession\\(|EndSession\\(|FormatContext\\(|SuggestTopicKey\\(|AddObservation\\(|sanitizeFTS\\(|Search\\(\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:754:func (s *Store) CreateSession(id, project, directory string) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:770:func (s *Store) EndSession(id string, summary string) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:948:func (s *Store) AddObservation(p AddObservationParams) (int64, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1186:	ftsQuery := sanitizeFTS(query)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1462:func (s *Store) Search(query string, opts SearchOptions) ([]SearchResult, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1519:	ftsQuery := sanitizeFTS(query)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613:func (s *Store) FormatContext(project, scope string) (string, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3201:func SuggestTopicKey(typ, title, content string) string {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3384:func sanitizeFTS(query string) string {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3521:		_, err = s.AddObservation(AddObservationParams{
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:197:			handleSearch(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:201:	// ─── mem_save (profile: agent, core — always in context) ───────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:202:	if shouldRegister("mem_save", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:204:			mcp.NewTool("mem_save",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:235:  content: "**What**: Wrapped each search term in quotes before passing to FTS5 MATCH\n**Why**: Users typing queries like 'fix auth bug' would crash because FTS5 interprets special chars as operators\n**Where**: internal/store/store.go — sanitizeFTS() function\n**Learned**: FTS5 MATCH syntax is NOT the same as LIKE — always sanitize user input"`),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:265:	if shouldRegister("mem_update", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:302:	// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:303:	if shouldRegister("mem_suggest_topic_key", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:305:			mcp.NewTool("mem_suggest_topic_key",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:306:				mcp.WithDescription("Suggest a stable topic_key for memory upserts. Use this before mem_save when you want evolving topics (like architecture decisions) to update a single observation over time."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:323:			handleSuggestTopicKey(),
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:599:	if shouldRegister("mem_merge_projects", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:625:func handleSearch(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:640:		results, err := s.Search(query, store.SearchOptions{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:729:		s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:733:		_, err := s.AddObservation(store.AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:763:func handleSuggestTopicKey() server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:868:		s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:894:		context, err := s.FormatContext(project, scope)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1047:		s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1049:		_, err := s.AddObservation(store.AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1076:		if err := s.CreateSession(id, project, directory); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1089:		if err := s.EndSession(id, summary); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1116:			_ = s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:71:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:75:	firstID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:87:	secondID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:115:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:119:	_, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:131:	_, err = s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:143:	projectResults, err := s.Search("regex", SearchOptions{Project: "engram", Scope: "project", Limit: 10})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:151:	personalResults, err := s.Search("regex", SearchOptions{Project: "engram", Scope: "personal", Limit: 10})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:159:	ctx, err := s.FormatContext("engram", "personal")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:174:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:178:	firstID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:190:	middleID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:202:	lastID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:237:	searchResults, err := s.Search("deleted", SearchOptions{Project: "engram", Limit: 10})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:264:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:268:	firstID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:281:	secondID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:316:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:320:	archID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:333:	bugID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:430:	results, err := s.Search("legacy", SearchOptions{Project: "engram", Limit: 10})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:438:	newID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:544:	got := SuggestTopicKey("Architecture", "  Auth Model  ", "ignored")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:549:	fallback := SuggestTopicKey("bugfix", "", "Fix nil panic in auth middleware on empty token")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:556:	bug := SuggestTopicKey("manual", "", "Fix regression in auth login flow")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:561:	arch := SuggestTopicKey("", "ADR: Split API gateway boundary", "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:570:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:574:	baseID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:587:	personalID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:600:	otherProjectID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:621:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:806:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:851:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:872:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:876:	// First: agent saves actively via mem_save
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:877:	_, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:936:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:939:	if err := s.CreateSession("s2", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1016:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1020:	_, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1090:	if err := s.CreateSession("sync-session", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1094:	obsID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1128:	if err := s.EndSession("sync-session", "done"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1430:	if err := s.CreateSession("s-end", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1434:	firstID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1444:	_, err = s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1455:	if err := s.EndSession("s-end", "finished session"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1522:	if err := s.CreateSession("s-q", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1527:	obsID, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1585:	searchResults, err := s.Search("title", SearchOptions{Scope: "project", Limit: 9999})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1593:	ctx, err := s.FormatContext("", "project")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1621:	if _, err := s.Search("x", SearchOptions{}); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1635:	if err := s.CreateSession("s-edge", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1639:	if err := s.EndSession("missing", "ignored"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1643:	if err := s.EndSession("s-edge", ""); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1735:		if got := SuggestTopicKey("decision", "decision", ""); got != "decision/general" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1738:		if got := SuggestTopicKey("bugfix", "bug-auth-panic", ""); got != "bug/auth-panic" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1741:		if got := SuggestTopicKey("manual", "!!!", "..."); got != "topic/general" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1758:		ctx, err := s.FormatContext("", "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2202:		if err := s.CreateSession("s-p", "proj-a", "/tmp/proj-a"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2205:		if err := s.CreateSession("s-q", "proj-b", "/tmp/proj-b"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2208:		if _, err := s.AddObservation(AddObservationParams{SessionID: "s-p", Type: "note", Title: "a", Content: "a", Project: "proj-a", Scope: "project"}); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2211:		if _, err := s.AddObservation(AddObservationParams{SessionID: "s-q", Type: "note", Title: "b", Content: "b", Project: "proj-b", Scope: "project"}); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2266:		if err := s.CreateSession("s-tl", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2270:		firstID, err := s.AddObservation(AddObservationParams{SessionID: "s-tl", Type: "note", Title: "1", Content: "one", Project: "engram"})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2274:		middleID, err := s.AddObservation(AddObservationParams{SessionID: "s-tl", Type: "note", Title: "2", Content: "two", Project: "engram"})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2278:		lastID, err := s.AddObservation(AddObservationParams{SessionID: "s-tl", Type: "note", Title: "3", Content: "three", Project: "engram"})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2299:			if _, err := s.FormatContext("", ""); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2306:			if err := s.CreateSession("s-ctx", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2312:			if _, err := s.FormatContext("", ""); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2319:			if err := s.CreateSession("s-ctx2", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2325:			if _, err := s.FormatContext("", ""); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2423:		if err := s.CreateSession("s-e", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2427:		if _, err := s.AddObservation(AddObservationParams{SessionID: "s-e", Type: "note", Title: "top", Content: "x", Project: "engram", TopicKey: "x"}); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2437:		if _, err := s.AddObservation(AddObservationParams{SessionID: "s-e", Type: "note", Title: "top", Content: "x", Project: "engram", TopicKey: "x"}); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2442:		if _, err := s.AddObservation(AddObservationParams{SessionID: "s-e", Type: "note", Title: "dup", Content: "dup content", Project: "engram"}); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2452:		if _, err := s.AddObservation(AddObservationParams{SessionID: "s-e", Type: "note", Title: "dup", Content: "dup content", Project: "engram"}); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2459:		if _, err := s.AddObservation(AddObservationParams{SessionID: "s-e", Type: "note", Title: "x", Content: "y", Project: "engram", TopicKey: "t"}); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2462:		if _, err := s.AddObservation(AddObservationParams{SessionID: "s-e", Type: "note", Title: "x", Content: "y", Project: "engram"}); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2472:		if err := s.CreateSession("s-u", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2475:		id, err := s.AddObservation(AddObservationParams{SessionID: "s-u", Type: "old", Title: "t", Content: "c", Project: "engram", TopicKey: "topic/key"})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2524:		if err := s.CreateSession("s-iter", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2527:		if _, err := s.AddObservation(AddObservationParams{SessionID: "s-iter", Type: "note", Title: "one", Content: "one", Project: "engram"}); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2555:		if _, err := s.Search("one", SearchOptions{}); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2560:		if _, err := s.Search("one", SearchOptions{}); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2627:		if err := s.CreateSession("s-t2", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2630:		first, _ := s.AddObservation(AddObservationParams{SessionID: "s-t2", Type: "decision", Title: "a", Content: "a", Project: "engram"})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2631:		_, _ = s.AddObservation(AddObservationParams{SessionID: "s-t2", Type: "decision", Title: "aa", Content: "aa", Project: "engram"})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2632:		focus, _ := s.AddObservation(AddObservationParams{SessionID: "s-t2", Type: "decision", Title: "b", Content: "b", Project: "engram"})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2633:		_, _ = s.AddObservation(AddObservationParams{SessionID: "s-t2", Type: "decision", Title: "c", Content: "c", Project: "engram"})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2635:		if _, err := s.Search("b", SearchOptions{Type: "decision", Project: "engram", Scope: "project", Limit: 5}); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2712:		if err := s.CreateSession("s-c", "engram", "/tmp/engram"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2715:		if _, err := s.AddObservation(AddObservationParams{SessionID: "s-c", Type: "note", Title: "n", Content: "n", Project: "engram"}); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2726:		if _, err := s.FormatContext("engram", "project"); err == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2740:		if err := s.EndSession("s-c", "has summary"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2744:		ctx, err := s.FormatContext("engram", "project")
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3497:	if err := s.CreateSession("proj-session", "my-project", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3501:	_, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3607:	if err := s.CreateSession("enq-session", "enqueued-project", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3627:	if err := s.CreateSession("obs-enq", "obs-proj", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3631:	_, err := s.AddObservation(AddObservationParams{
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3926:	s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3963:	results, _ := s.Search("test obs", SearchOptions{Project: new_, Limit: 10})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3986:	s.CreateSession("s1", old, "/tmp")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3987:	s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4050:	if err := s.CreateSession("s1", "engram", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4055:	id, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4085:	if err := s.CreateSession("s1", "engram", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4090:	_, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4103:	results, err := s.Search("normalize test", SearchOptions{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4119:	if err := s.CreateSession("s1", "engram", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4123:	_, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4148:	if err := s.CreateSession("s-norm", "MyProject", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4164:	if err := s.CreateSession("s1", "alpha", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4167:	if err := s.CreateSession("s2", "beta", "/tmp"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4172:		_, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4206:	if err := s.CreateSession("s1", "proj-a", "/work/a"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4209:	if err := s.CreateSession("s2", "proj-b", "/work/b"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4215:		_, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4229:	_, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4288:	if err := s.CreateSession("s1", "engram", "/work"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4295:			_, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4363:	if err := s.CreateSession("s1", "engram", "/work"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4368:	_, err := s.AddObservation(AddObservationParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4398:	if err := s.CreateSession("s1", "alpha", "/work/alpha"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4413:		if _, err := s.AddObservation(AddObservationParams{

exec
/bin/zsh -lc 'rg -n "session_bootstrap|session_resume|memory_context|memory_search|memory_match_triggers|generate-context|trusted session|sessionId|resolveSession|session_start|session_end|bootstrap|session-manager|memory_save|memory_validate|POST-SAVE|save/markdown-evidence-builder|context-server" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:113:import * as sessionManager from './lib/session/session-manager.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:258:  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:356:function resolveSessionTrackingId(
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:360:  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:361:    ? ((extra as { sessionId?: string }).sessionId ?? null)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:363:  const explicitSessionId = typeof args.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:364:    ? args.sessionId
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:378:// that lack an explicit sessionId param can still correlate with a prior search.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:391:        console.error(`[context-server] afterTool callback failed for '${tool}' (${callId}): ${message}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:782:  // Phase 027: Structural bootstrap guidance for non-hook runtimes
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:829:    console.error(`[context-server] Failed to clear trigger cache after DB reinit: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:833:    console.error(`[context-server] Cleared ${invalidatedEntries} tool-cache entries after DB reinitialization`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:842:  { name: 'context-server', version: '1.7.2' },
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:865:  const sessionTrackingId = resolveSessionTrackingId(args, _extra);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:906:      console.error(`[context-server] Session priming failed (non-fatal): ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:926:          console.error(`[context-server] Auto-surface failed (non-fatal): ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:934:        console.error(`[context-server] Tool-dispatch auto-surface failed (non-fatal): ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:939:      console.warn(`[context-server] Auto-surface precheck exceeded p95 target: ${autoSurfaceLatencyMs}ms`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1041:        console.warn(`[context-server] Passive enrichment failed (non-fatal): ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1128:      console.error(`[context-server] Failed to build MCP error envelope for '${name}': ${fallbackError}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1184:  console.error('[context-server] Checking for pending memory files...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1217:      console.error(`[context-server] Pending file recovery: ${recoveryResult.recovered} recovered, ${recoveryResult.failed} failed (${recoveryResult.found} total)`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1219:      console.error('[context-server] No pending memory files found');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1225:    console.error(`[context-server] Pending file recovery error: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1232:    console.error('[context-server] Startup scan already in progress, skipping');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1238:    console.error('[context-server] Waiting for embedding model to be ready...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1242:      console.error('[context-server] Startup scan skipped: embedding model not ready');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1243:      console.error('[context-server] Run memory_index_scan manually after model loads');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1250:    console.error('[context-server] Starting background scan for new memory files...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1282:      console.error('[context-server] No memory files found in workspace');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1286:    console.error(`[context-server] Found ${allFiles.length} memory files, checking for changes...`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1298:        console.error(`[context-server] Failed to index ${path.basename(filePath)}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1303:      console.error(`[context-server] Startup scan: ${indexed} new, ${updated} updated, ${unchanged} unchanged, ${failed} failed`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1305:      console.error(`[context-server] Startup scan: all ${unchanged} files up to date`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1325:      console.error(`[context-server] Atomicity metrics: ${metrics.totalAtomicWrites} successful, ${metrics.totalErrors} failed, ${metrics.totalRecoveries} recovered`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1329:    console.error(`[context-server] Startup scan error: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1360:  console.error(`[context-server] ${reason}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1402:    console.error(`[context-server] Shutdown deadline exceeded after ${SHUTDOWN_DEADLINE_MS}ms`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1485:    `[context-server] Detected runtime: ${detectedRuntime.runtime} (hookPolicy=${detectedRuntime.hookPolicy})`,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1495:    console.error('[context-server] Validating embedding API key...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1503:          console.warn('[context-server] ===== API KEY VALIDATION SKIPPED (network error) =====');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1504:          console.warn(`[context-server] Provider: ${validation.provider}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1505:          console.warn(`[context-server] Error: ${validation.error}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1507:            console.warn('[context-server] Recovery Actions:');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1509:              console.warn(`[context-server]   ${i + 1}. ${action}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1512:          console.warn('[context-server] Continuing startup — validation will occur on first use');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1514:          console.error('[context-server] ===== API KEY VALIDATION FAILED =====');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1515:          console.error(`[context-server] Provider: ${validation.provider}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1516:          console.error(`[context-server] Error: ${validation.error}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1517:          console.error(`[context-server] Error Code: ${validation.errorCode || 'E050'}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1519:            console.error('[context-server] Recovery Actions:');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1521:              console.error(`[context-server]   ${i + 1}. ${action}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1524:          console.error('[context-server] =====================================');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1525:          console.error('[context-server] FATAL: Cannot start MCP server with invalid API key');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1526:          console.error('[context-server] Set SPECKIT_SKIP_API_VALIDATION=true to bypass (not recommended)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1532:        console.warn(`[context-server] API key warning: ${validation.warning}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1536:        console.error(`[context-server] API key validated (provider: ${validation.provider})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1540:      console.error(`[context-server] API key validation error: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1541:      console.error('[context-server] Continuing startup - validation will occur on first use');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1544:    console.warn('[context-server] API key validation skipped (SPECKIT_SKIP_API_VALIDATION=true)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1553:  console.error('[context-server] Initializing database...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1556:  console.error('[context-server] Database initialized');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1557:  console.error('[context-server] Database path: ' + DATABASE_PATH);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1582:  console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1583:  console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1590:    console.error(`[context-server] Integrity check: ${report.totalMemories}/${report.totalMemories + report.missingVectors} valid entries`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1591:    if (report.orphanedVectors > 0) console.error(`[context-server] WARNING: ${report.orphanedVectors} orphaned entries detected`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1596:      console.error(`[context-server] ===== EMBEDDING DIMENSION MISMATCH =====`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1597:      console.error(`[context-server] ${dimValidation.warning}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1598:      console.error(`[context-server] =========================================`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1599:      console.error('[context-server] FATAL: Refusing to start with mismatched embedding dimensions');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1602:      console.error(`[context-server] Embedding dimension validated: ${dimValidation.stored}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1612:      console.error('[context-server] Scoring observability initialized');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1615:      console.warn('[context-server] Scoring observability init failed (non-fatal):', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1622:        console.error(`[context-server] Learned triggers ready (migrated=${migrated}, fts5Isolated=${isolated})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1625:        throw new Error(`[context-server] Learned feedback migration/isolation failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1637:      console.warn('[context-server] journal_mode was not WAL; forcing WAL mode');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1652:    console.error('[context-server] Startup health: memory_index=%d, active_memory_projection=%d', memoryCount, projectionCount);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1656:      console.error('[context-server] Auto-backfill triggered: %d rows seeded into active_memory_projection', result.seeded);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1660:      console.error('[context-server] WARNING: Database has 0 memories — search will return no results until memories are saved');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1685:          '[context-server] Scheduled graph refresh applied: dirty_nodes=%d, updated_edges=%d',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1691:        console.warn('[context-server] Scheduled graph refresh failed:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1694:    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1701:        console.error(`[context-server] BM25 index rebuilt from database: ${count} documents`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1704:        console.warn('[context-server] BM25 index rebuild failed:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1713:      console.error('[context-server] Cognitive memory modules initialized');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1714:      console.error(`[context-server] Working memory: ${workingMemory.isEnabled()}, Co-activation: ${coActivation.isEnabled()}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1717:      console.warn('[context-server] Cognitive modules partially failed:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1722:      console.error('[context-server] Extraction adapter initialized');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1725:      throw new Error(`[context-server] Extraction adapter startup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1734:        console.error(`[context-server] Archival manager initialized (background job started)`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1736:        console.error(`[context-server] Archival manager initialized (background job: not started)`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1740:      console.warn('[context-server] Archival manager failed:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1751:        console.error('[context-server] Background retry job started (interval: 5min, batch: 5)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1753:        console.error('[context-server] Background retry job already running or disabled');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1757:      console.warn('[context-server] Background retry job failed to start:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1766:        console.error('[context-server] Shadow feedback evaluation scheduler started');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1768:        console.error('[context-server] Shadow feedback evaluation scheduler not started (already running or disabled)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1772:      console.warn('[context-server] Shadow feedback evaluation scheduler failed to start:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1780:        console.error(`[context-server] Batch learning: ${batchResult.shadowApplied} shadow-applied, ${batchResult.skippedMinSupport} skipped (min-support), window=${Math.round((batchResult.runAt - batchResult.windowStart) / 86_400_000)}d`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1782:        console.error('[context-server] Batch learning: no eligible candidates in window (or flag disabled)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1786:      console.warn('[context-server] Batch learning failed (non-fatal):', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1793:        console.error(`[context-server] Session manager initialized (enabled: ${sessionManager.isEnabled()})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1799:          console.error(`[context-server] Crash recovery: marked ${recoveryResult.interruptedCount} sessions as interrupted`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1803:            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1807:        console.warn('[context-server] Session manager initialization returned:', sessionResult.error);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1811:      console.warn('[context-server] Session manager failed:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1822:        console.error(`[context-server] Ingest crash recovery reset ${ingestInit.resetCount} incomplete job(s) to queued`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1826:      console.warn('[context-server] Ingest queue init failed:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1858:          console.error(`[context-server] File watcher started for ${watchPaths.length} path(s)`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1860:          console.warn('[context-server] File watcher enabled, but no spec directories were found');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1864:        console.warn('[context-server] File watcher startup failed:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1869:    console.error('[context-server] Integrity check failed:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1882:      console.warn('[context-server] Dynamic instructions init failed (non-fatal):', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1888:  console.error('[context-server] Context MCP server running on stdio');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1897:  main().catch((err: unknown) => { console.error('[context-server] Fatal error:', err); process.exit(1); });
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:93:| `SPECKIT_SKIP_API_VALIDATION` | `false` | boolean | Skip API-level input validation. Opt-in: set `true` to enable. | `context-server.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:248:  // Shared-memory tools do not currently receive a server-minted sessionId or
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:11:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:87:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:43:// T73: Import session manager for trusted session validation (IDOR prevention)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:44:import * as sessionManager from '../lib/session/session-manager.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:95:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:207:  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
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
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:7:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:26:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:105:  const sessionId = normalizeScopeMatchValue(scope.sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:131:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:132:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:254:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:284:      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:291:          'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:22:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:10:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:11:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:18:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:20:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:112:| `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` | MCP entry script |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:229:ls mcp_server/dist/context-server.js
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:237:- [ ] `mcp_server/dist/context-server.js` exists
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:258:node mcp_server/dist/context-server.js
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:294:        ".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:334:        "/Users/YOUR_USERNAME/path/to/project/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:366:        ".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:391:ls -la .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:427:- `memory_search` (semantic search)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:429:- `memory_save` (index new memories)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:443:Run session bootstrap, then query the code graph for symbols in .opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:447:- the startup or bootstrap response reports freshness-aware graph status
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:465:- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:548:### memory_search: Semantic Search
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:550:`memory_search()` runs vector-based similarity search across all indexed memories.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:563:### memory_save: Index a Memory File
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:565:`memory_save()` indexes a single new or updated memory file into the database. For bulk indexing, use `memory_index_scan()` instead.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:667:node mcp_server/dist/context-server.js
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:873:   ls -la .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:944:node mcp_server/dist/context-server.js
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:980:| `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` | MCP server entry point |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1007:node mcp_server/dist/context-server.js
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1037:SMOKE TEST:   node mcp_server/dist/context-server.js
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1048:           memory_save, memory_index_scan, memory_stats
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:28:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:613:    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:618:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:628:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:8:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:9:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:10:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:134:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:180:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:92:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:481:  // Matches the startup rebuild sequence in context-server.ts (lines 776-791).
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648:/** Handle memory_validate tool - records user validation feedback to adjust confidence */
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:661:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:726:  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:741:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:780:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:815:const handle_memory_validate = handleMemoryValidate;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:822:  handle_memory_validate,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:101:  // Phase 027: Structural bootstrap contract for health surface
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:33:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:58:      sessionId: args.sessionId,
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
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:18:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:35:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:48:      sessionId: scope?.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:88:            reason: 'memory_save: reinforced existing memory via prediction-error gate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:93:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:99:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:140:          reason: 'memory_save: updated existing memory via prediction-error gate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:145:            tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:151:          actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:22:  ['session_id', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:60:    sessionId: normalizeScopeMatchValue(scope.sessionId),
.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
.opencode/skill/system-spec-kit/mcp_server/README.md:10:  - "memory_search"
.opencode/skill/system-spec-kit/mcp_server/README.md:129:node dist/context-server.js --help
.opencode/skill/system-spec-kit/mcp_server/README.md:145:        ".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
.opencode/skill/system-spec-kit/mcp_server/README.md:163:      "args": ["/absolute/path/to/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"],
.opencode/skill/system-spec-kit/mcp_server/README.md:189:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
.opencode/skill/system-spec-kit/mcp_server/README.md:563:##### `memory_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:578:| `sessionId` | string | Session ID for deduplication across turns |
.opencode/skill/system-spec-kit/mcp_server/README.md:587:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:616:| `specFolder` | string | Scope bootstrap to a specific spec folder |
.opencode/skill/system-spec-kit/mcp_server/README.md:622:##### `memory_search`
.opencode/skill/system-spec-kit/mcp_server/README.md:646:  "tool": "memory_search",
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:699:##### `memory_save`
.opencode/skill/system-spec-kit/mcp_server/README.md:712:| `sessionId` | string | Session attribution |
.opencode/skill/system-spec-kit/mcp_server/README.md:723:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:816:##### `memory_validate`
.opencode/skill/system-spec-kit/mcp_server/README.md:960:| `sessionId` | string | Session identifier |
.opencode/skill/system-spec-kit/mcp_server/README.md:1114:| `sessionId` | string | Filter by session |
.opencode/skill/system-spec-kit/mcp_server/README.md:1217:├── context-server.ts          # MCP entry point and runtime bootstrap
.opencode/skill/system-spec-kit/mcp_server/README.md:1244:| `context-server.ts` | Starts the MCP listener, performs runtime bootstrap, and registers all 47 tools. |
.opencode/skill/system-spec-kit/mcp_server/README.md:1326:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
.opencode/skill/system-spec-kit/mcp_server/README.md:1354:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
.opencode/skill/system-spec-kit/mcp_server/README.md:1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1539:| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1543:| Test a save without committing | `memory_save` | Set `dryRun: true` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1567:{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1581:{ "tool": "memory_save", "arguments": { "filePath": "/path/to/file.md", "dryRun": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1625:**What you see**: `node dist/context-server.js` exits with a module error or `MEMORY_DB_PATH`/database-path error.
.opencode/skill/system-spec-kit/mcp_server/README.md:1632:node --input-type=module -e "await import('./dist/context-server.js')" 2>&1 | head -20
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/README.md:1721:**Q: What does the dryRun parameter do on memory_save?**
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:91:import { buildParsedMemoryEvidenceSnapshot } from './save/markdown-evidence-builder.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:103:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:105:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:754:              sessionId: scope.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:945:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:972:        actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1078:/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1086:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1093:        hint: 'Retry memory_save after checkpoint_restore maintenance completes.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1109:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1140:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1151:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1156:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1169:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1174:        action: 'memory_save_shared_space',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1179:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1213:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1269:    sessionId: governanceDecision.normalized.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1310:            tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1316:              actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1345:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1441:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1447:          actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1462:        action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1468:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1490:            actor: provenanceActor ?? 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1703:        'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1789:const handle_memory_save = handleMemorySave;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1796:  handle_memory_save,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:36:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:124: * Result payload from reconsolidation pre-checks during memory_save.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:301:                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:322:            reason: `memory_save: reconsolidation ${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:329:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:335:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:29:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:5:// Extracted from context-server.ts for maintainability (T303).
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:  name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:75:      sessionId: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:82:        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:218:  name: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298:  name: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:312:      sessionId: { type: 'string', description: 'Optional session identifier for selection telemetry' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:473:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (e.g., "specs/003-memory/077-upgrade")' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (e.g., "T1", "T2", "implementation")' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current knowledge level (0-100): How well do you understand the task requirements and codebase context?' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current uncertainty level (0-100): How uncertain are you about the approach or implementation?' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current context completeness (0-100): How complete is your understanding of relevant context?' }, knowledgeGaps: { type: 'array', items: { type: 'string' }, description: 'List of identified knowledge gaps (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:479:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (must match preflight)' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (must match preflight)' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task knowledge level (0-100)' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task uncertainty level (0-100)' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task context completeness (0-100)' }, gapsClosed: { type: 'array', items: { type: 'string' }, description: 'List of knowledge gaps closed during task (optional)' }, newGapsDiscovered: { type: 'array', items: { type: 'string' }, description: 'List of new gaps discovered during task (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier. Required when multiple sessions share the same taskId and you need to target a specific learning cycle.' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:570:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:753:// Phase 024 / Item 7: Composite session bootstrap tool
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:770:      structuralContext: { type: 'object', description: 'Structural bootstrap contract (status, summary, recommendedAction); omitted when code graph is unavailable', properties: { status: { type: 'string', enum: ['ready', 'stale', 'missing'] }, summary: { type: 'string' }, recommendedAction: { type: 'string' } } },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:781:  description: '[L9:CoverageGraph] Idempotent upsert for coverage graph nodes and edges. Reducer writes graph deltas after each deep-loop iteration. Rejects self-loops, clamps weights to [0.0, 2.0], and merges metadata updates on repeated IDs. Requires specFolder, loopType, and sessionId for namespace isolation.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:787:      sessionId: { type: 'string', minLength: 1, description: 'Session identifier for namespace isolation (required)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:821:    required: ['specFolder', 'loopType', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:835:      sessionId: { type: 'string', description: 'Optional session filter' },
.opencode/skill/system-spec-kit/mcp_server/api/README.md:33:| `indexing.ts` | Runtime bootstrap, embedding warmup, memory index scan, and shutdown helpers |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:9:import * as sessionManager from '../lib/session/session-manager.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:194:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:324:function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:325:  const session = retrievalSessionStateManager.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450:function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:451:  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:454:      dedupStats: { enabled: false, sessionId: null }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:458:  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:461:    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:468:      sessionId
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:511:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:538:    sessionId: normalizedScope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:714:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:744:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:797:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:886:    if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:889:        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:892:        retrievalSessionStateManager.setAnchors(sessionId, anchors);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:895:      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:15:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:62:      session_id: input.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:27:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:24:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:36:- `checkpoints.ts` - Checkpoint lifecycle plus `memory_validate`.
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:28:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:79:    if (!args.sessionId || typeof args.sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:80:      return errorResponse('sessionId is required and must be a string');
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:112:        sessionId: args.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:172:              sessionId: args.sessionId,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:109:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:112:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:128:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:190:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:227:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:309:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:320:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:373:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:398:  memory_search: memorySearchSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:401:  memory_save: memorySaveSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:407:  memory_validate: memoryValidateSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472:  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:478:  task_preflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'knowledgeGaps', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:479:  task_postflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'gapsClosed', 'newGapsDiscovered', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:487:  memory_get_learning_history: ['specFolder', 'sessionId', 'limit', 'onlyComplete', 'includeSummary'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:5:// ARCH-1 exposes only the runtime bootstrap and indexing hooks needed
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:21:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:71:  /** Phase 027: Structural bootstrap contract for non-hook runtimes */
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:87:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:91:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:115:/** T018: Update last tool call timestamp (called from context-server dispatch). */
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:116:function recordToolCall(sessionId?: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:118:  if (typeof sessionId === 'string' && sessionId.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:119:    lastActiveSessionId = sessionId.trim();
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:132:function isSessionPrimed(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:133:  return primedSessionIds.has(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:137:function markSessionPrimed(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:138:  primedSessionIds.add(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:139:  lastActiveSessionId = sessionId;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:475:  // Phase 027: Structural bootstrap contract for auto-prime surface
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:492:  sessionId?: string,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:494:  // Derive a session key from explicit sessionId or tool args.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:495:  const effectiveSessionId = sessionId
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:496:    ?? (typeof toolArgs.sessionId === 'string' ? toolArgs.sessionId : null)
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:522:    // Phase 024 / Item 9: Record bootstrap telemetry for MCP auto-priming
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:560: * Reset priming state. When called with a sessionId, clears only that session.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:563:function resetSessionPrimed(sessionId?: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:564:  if (sessionId) {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:565:    primedSessionIds.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:31:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:144:      ? 'memory_save: updated indexed memory entry'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:145:      : 'memory_save: created new indexed memory entry',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:150:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:160:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:251:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:269:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:285:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:462:    tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:89:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:405:  // Phase 024: Record bootstrap telemetry
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:471:  // Phase 027: Structural bootstrap contract for resume surface
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:482:    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:599:  // Phase 024 / Item 9: Record bootstrap telemetry
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:65:  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null, sharedSpaceId = null } = options;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:101:        // H9 FIX: Filter by sessionId to prevent false duplicate/supersede decisions across sessions
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:102:        if (!matchesScopedValue(sessionId, r.session_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:297:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:303:      recordHistory(nextMemoryId, 'ADD', null, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:304:      recordHistory(memoryId, 'UPDATE', previous.title, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:81:type SessionBootstrapModule = typeof import('./session-bootstrap.js');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:215:    sessionBootstrapModule = loadHandlerModule<SessionBootstrapModule>('session-bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:233:export const handle_memory_save = lazyFunction(getMemorySaveModule, 'handle_memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:292:export const handle_memory_validate = lazyFunction(getCheckpointsModule, 'handle_memory_validate');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:334:// Session bootstrap handler
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:68:  sessionId: string = 'replay-session',
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:90:          session_id: sessionId,
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:99:        const statePath = getStatePath(sessionId);
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:101:        const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:67:    sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:85:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:124:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:153:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:204:    console.error('[session-manager] WARNING: init() called with null database');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:226:      console.warn(`[session-manager] Periodic cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:239:    console.warn(`[session-manager] Initial stale session cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:250:      console.warn(`[session-manager] Periodic stale session cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:277:function hasSessionStateRecord(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:283:    ).get(sessionId) as { 1?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:287:    console.warn(`[session-manager] hasSessionStateRecord failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:292:function hasSentMemoryRecord(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:298:    ).get(sessionId) as { 1?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:302:    console.warn(`[session-manager] hasSentMemoryRecord failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:307:function isTrackedSession(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:308:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:312:  const normalizedSessionId = sessionId.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:330:function getSessionIdentityRecord(sessionId: string): {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:344:  `).get(sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:406:      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:416:      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:426:      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:469:    console.error(`[session-manager] Schema creation failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:508:function shouldSendMemory(sessionId: string, memory: MemoryInput | number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:512:    console.warn(`[session-manager] Database not initialized. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} memory.`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:515:  if (!sessionId || typeof sessionId !== 'string') return true;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:526:    const exists = stmt.get(sessionId, hash);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:530:    console.warn(`[session-manager] shouldSendMemory check failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:536:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:542:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(memories)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:553:    console.warn(`[session-manager] Database not initialized for batch dedup. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} batch.`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:573:      const existingRows = existingStmt.all(sessionId) as { memory_hash: string }[];
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:580:          const insertResult = insertStmt.run(sessionId, hash, memory.id || null, now);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:594:        enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:623:    console.warn(`[session-manager] shouldSendMemoriesBatch failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:634:function markMemorySent(sessionId: string, memory: MemoryInput | number): MarkResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:637:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:638:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:653:      stmt.run(sessionId, hash, memoryId, new Date().toISOString());
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:655:      enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:661:    console.error(`[session-manager] markMemorySent failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:666:function markMemoriesSentBatch(sessionId: string, memories: MemoryInput[]): MarkBatchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:669:  if (!sessionId || !Array.isArray(memories) || memories.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:670:    return { success: false, markedCount: 0, error: 'Valid sessionId and memories array required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:685:        const result = insertStmt.run(sessionId, hash, memory.id || null, now);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:691:      enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:699:    console.error(`[session-manager] markMemoriesSentBatch failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:708:function enforceEntryLimit(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:709:  if (!db || !sessionId) return;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:715:    const row = countStmt.get(sessionId) as { count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:730:    deleteStmt.run(sessionId, sessionId, excess);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:733:    console.warn(`[session-manager] enforce_entry_limit failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:752:    console.error(`[session-manager] cleanup_expired_sessions failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:824:      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:831:    console.warn(`[session-manager] Stale cleanup had ${errors.length} error(s): ${errors.join('; ')}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:843:function clearSession(sessionId: string): CleanupResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:844:  if (!db || !sessionId) return { success: false, deletedCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:850:    const result = stmt.run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:854:      workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:857:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:863:    console.error(`[session-manager] clear_session failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:868:function getSessionStats(sessionId: string): SessionStats {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:869:  if (!db || !sessionId) return { totalSent: 0, oldestEntry: null, newestEntry: null };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:880:    const row = stmt.get(sessionId) as { total_sent: number; oldest_entry: string | null; newest_entry: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:889:    console.warn(`[session-manager] get_session_stats failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:898:function filterSearchResults(sessionId: string, results: MemoryInput[]): FilterResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:899:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:907:  const shouldSendMap = shouldSendMemoriesBatch(sessionId, results, true);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:938:function markResultsSent(sessionId: string, results: MemoryInput[]): MarkBatchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:939:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results) || results.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:943:  return markMemoriesSentBatch(sessionId, results);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1015:    console.error(`[session-manager] Session state schema creation failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1020:function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1022:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1023:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1057:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1074:    console.error(`[session-manager] save_session_state failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1079:function completeSession(sessionId: string): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1080:  if (!db || !sessionId) return { success: false, error: 'Database or sessionId not available' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1088:    stmt.run(new Date().toISOString(), sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1092:      workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1095:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1101:    console.error(`[session-manager] complete_session failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1121:    console.error(`[session-manager] reset_interrupted_sessions failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1126:function recoverState(sessionId: string, scope: SessionIdentityScope = {}): RecoverResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1128:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1129:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1143:    const row = stmt.get(sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1156:      return { success: false, error: `sessionId "${sessionId}" is bound to a different ${mismatch}` };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1160:      sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1182:      updateStmt.run(new Date().toISOString(), sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1188:    console.error(`[session-manager] recover_state failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1219:        sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1230:    console.error(`[session-manager] get_interrupted_sessions failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1241:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1262:    : sessionId
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1278:| **Session ID** | \`${sessionId || 'N/A'}\` |
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1324:function writeContinueSessionMd(sessionId: string, specFolderPath: string): CheckpointResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1325:  if (!sessionId || !specFolderPath) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1326:    return { success: false, error: 'sessionId and specFolderPath are required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1330:    const recoverResult = recoverState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1333:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1349:    console.error(`[session-manager] write_continue_session_md failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1355:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1359:  const saveResult = saveSessionState(sessionId, state);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1366:    return writeContinueSessionMd(sessionId, folderPath);
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
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:194:  // Phase 027: Structural bootstrap contract
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:204:    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:214:  // Record bootstrap telemetry once for the composite call.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:296:    kind: 'bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:331:      bootstrapPayload: payloadContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:338:    // Keep advisory routing guidance out of nextActions so bootstrap and resume
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:43:function handleCompact(sessionId: string): OutputSection[] {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:44:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:45:  const pendingCompactPrime = readCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:47:    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:58:    hookLog('warn', 'session-prime', `Rejecting stale compact cache for session ${sessionId} (cached at ${cachedAt})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:115:  const sessionId = typeof input.session_id === 'string' ? input.session_id : undefined;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:120:    claudeSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:177:function handleResume(sessionId: string): OutputSection[] {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:178:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:216:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:218:  hookLog('info', 'session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:225:      sections = handleCompact(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:233:      sections = handleResume(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:262:    clearCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:33:import * as sessionManager from '../lib/session/session-manager.js';
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:821:function resolveSessionLifecycle(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1228:  } = resolveSessionLifecycle(args, null);
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
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:33:- `shared_memory_enable` bootstraps the shared-memory subsystem and generates this README if it is missing.
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:41:| `shared_memory_enable` | First-run bootstrap and idempotent enablement |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:39:| Modules | 1 | `session-manager.ts` |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:63: session-manager.ts  # Session deduplication, crash recovery, state management (~28KB)
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:71:| `session-manager.ts` | Core session tracking, deduplication, state persistence, CONTINUE_SESSION.md |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:93:1. User queries memory_search
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:137:import { filterSearchResults, markResultsSent } from './session-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:140:const { filtered, dedupStats } = filterSearchResults(sessionId, results);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:146:markResultsSent(sessionId, filtered);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:152:import { init, resetInterruptedSessions, getInterruptedSessions } from './session-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:164:  console.log(`Session ${s.sessionId}: ${s.lastAction} in ${s.specFolder}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:171:import { checkpointSession, saveSessionState } from './session-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:174:saveSessionState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:183:checkpointSession(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:194:| Check if should send | `shouldSendMemory(sessionId, memory)` | Before returning single memory |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:195:| Batch check | `shouldSendMemoriesBatch(sessionId, memories)` | Before returning multiple memories |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:196:| Mark single sent | `markMemorySent(sessionId, memory)` | After returning a memory |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:197:| Mark batch sent | `markMemoriesSentBatch(sessionId, memories)` | After returning multiple memories |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:198:| Clear session | `clearSession(sessionId)` | On explicit session end |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:199:| Get session stats | `getSessionStats(sessionId)` | For debugging/logging |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:200:| Recover state | `recoverState(sessionId)` | On session resume |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:201:| Complete session | `completeSession(sessionId)` | On normal session end |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:220:import { getSessionStats, clearSession } from './session-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:223:const stats = getSessionStats(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:227:clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:238:import { getDb } from './session-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:247:console.log(`Using session: ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:261:import { isEnabled, getConfig, getSessionStats, getInterruptedSessions } from './session-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:268:console.log(getSessionStats(sessionId));
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:300:| `context-server.ts` | MCP server that uses session layer |
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:27:- `context-tools.ts` - dispatch for `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:40:- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:66:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:128:    claudeSessionId: typeof parsed.sessionId === 'string' ? parsed.sessionId : null,
.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:4:// Re-exports all tool dispatch modules for context-server (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:62:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:65:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:71:  'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:80:      // E3: Delegate to memory_search with sensible defaults
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:100:    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:106:    case 'memory_validate':       return handleMemoryValidate(parseArgs<MemoryValidateArgs>(validateToolArgs('memory_validate', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:34:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:62:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:126: * asserted by context-server.vitest.ts. */
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:145:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:159:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:210:/** Arguments for session bootstrap requests. */
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:264:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:276:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:282:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:6:// single object for buildServerInstructions() and agent bootstrap.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:206: * Phase 027: Build a structural bootstrap contract for a given surface.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:68:export function getStatePath(sessionId: string): string {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:69:  const safe = createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:83:export function loadState(sessionId: string): HookState | null {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:85:    const raw = readFileSync(getStatePath(sessionId), 'utf-8');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:170:export function saveState(sessionId: string, state: HookState): boolean {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:171:  const filePath = getStatePath(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:185:export function readCompactPrime(sessionId: string): HookState['pendingCompactPrime'] {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:186:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:191:export function clearCompactPrime(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:192:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:202:  if (!saveState(sessionId, nextState)) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:203:    hookLog('warn', 'state', `Failed to clear pending compact payload for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:212:export function readAndClearCompactPrime(sessionId: string): HookState['pendingCompactPrime'] {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:213:  const prime = readCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:215:    clearCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:221:export function updateState(sessionId: string, patch: Partial<HookState>): HookState {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:222:  const existing = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:225:    claudeSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:237:  if (!saveState(sessionId, state)) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:238:    hookLog('warn', 'state', `State update was not persisted for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:4:// Non-critical startup checks extracted from context-server.ts (T303).
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:93:        console.warn('[context-server] \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:94:        console.warn('[context-server] \u2551  WARNING: Native runtime changed since last install  \u2551');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:95:        console.warn('[context-server] \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:97:          `[context-server] \u2551  Installed: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion}, ${marker.platform}/${marker.arch})`.padEnd(88) + '\u2551'
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:100:          `[context-server] \u2551  Running:   Node ${runtime.nodeVersion} (MODULE_VERSION ${runtime.moduleVersion}, ${runtime.platform}/${runtime.arch})`.padEnd(88) + '\u2551'
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:102:        console.warn(`[context-server] \u2551  Mismatch:  ${reasonText}`.padEnd(88) + '\u2551');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:103:        console.warn('[context-server] \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:104:        console.warn('[context-server] \u2551  Native modules may crash. Run:                         \u2551');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:105:        console.warn('[context-server] \u2551  bash scripts/setup/rebuild-native-modules.sh           \u2551');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:106:        console.warn('[context-server] \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:109:          `[context-server] Node runtime check: OK (${runtime.nodeVersion}, MODULE_VERSION ${runtime.moduleVersion}, ${runtime.platform}/${runtime.arch})`
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:122:      console.warn('[context-server] Created .node-version-marker for future runtime checks');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:126:    console.warn(`[context-server] Node version check skipped: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:378:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:379:  hookLog('info', 'compact-inject', `PreCompact triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:393:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:408:    hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:416:  updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:424:  hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:15:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:44:  | 'bootstrap';
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:66:const sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:76:const bootstrapRecords: BootstrapRecord[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:115:    case 'bootstrap':
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:121:/** Phase 024 / Item 9: Record a bootstrap telemetry event. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:127:  bootstrapRecords.push({
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:135:/** Get all bootstrap records for diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:137:  return bootstrapRecords;
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:147:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:110:      // Flag-off wiring: pass null as graphFn (mirroring context-server.ts behaviour)
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:297:      // Simulate the wiring decision in context-server.ts:
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:128:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:129:  hookLog('info', 'gemini:compact-cache', `PreCompress triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:158:  updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:184:  hookLog('info', 'gemini:compact-cache', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:416:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:709:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:44:function handleCompact(sessionId: string): OutputSection[] {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:45:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:46:  const pendingCompactPrime = readCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:48:    hookLog('warn', 'gemini:session-prime', `No cached compact payload for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:143:function handleResume(sessionId: string): OutputSection[] {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:144:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:176:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:178:  hookLog('info', 'gemini:session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:187:      sections = handleCompact(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:195:      sections = handleResume(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:214:    clearCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:30:      sessionId: 'sess-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:38:      sessionId: 'sess-b',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:47:      sessionId: 'sess-b',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:76:  it('T081 requires sessionId when multiple open baselines share a task_id', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:83:      sessionId: 'sess-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:91:      sessionId: 'sess-b',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:101:      message: expect.stringContaining('Provide sessionId'),
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:112:      sessionId: 'repeat-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:120:      sessionId: 'repeat-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:129:      sessionId: 'repeat-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:137:      sessionId: 'repeat-session',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:41:    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:42:    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43:    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:44:    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60:function runContextAutosave(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:61:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:78:    observations: [`Auto-saved from Claude Stop hook for session ${sessionId}.`],
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:120:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:124:  updateState(sessionId, patch);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:125:  touchedPaths.add(getStatePath(sessionId));
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:177:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:181:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:184:  updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:240:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:241:  hookLog('info', 'session-stop', `Stop hook fired for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:244:  const stateBeforeStop = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:257:        storeTokenSnapshot(sessionId, usage, cost);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:261:        recordStateUpdate(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:283:      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:288:      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:302:    recordStateUpdate(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:309:    runContextAutosave(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:312:  hookLog('info', 'session-stop', `Session ${sessionId} stop processing complete`);
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:53:      const sessionId = 'ses/sion/../bad';
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:54:      const path = getStatePath(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:57:      expect(path).toContain(createHash('sha256').update(sessionId).digest('hex').slice(0, 16));
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:14:  function setScoreDirectly(sessionId: string, memoryId: number, score: number) {
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:18:    `).run(sessionId, memoryId, score);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:21:  function getScoreDirectly(sessionId: string, memoryId: number): number | null {
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:24:    ).get(sessionId, memoryId) as { attention_score: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:28:  function countEntries(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:31:    ).get(sessionId) as { count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:79:    const sessionId = 'decay-floor-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:82:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:88:      setScoreDirectly(sessionId, 1, 0.06);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:89:      wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:91:      const scoreAfter1 = getScoreDirectly(sessionId, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:100:        wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:103:      const scoreAfterMany = getScoreDirectly(sessionId, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:109:      const count = countEntries(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:115:    const sessionId = 'delete-threshold-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:118:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:122:      setScoreDirectly(sessionId, 2, 0.05);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:123:      wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:125:      const scoreAtFloor = getScoreDirectly(sessionId, 2);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:130:      setScoreDirectly(sessionId, 3, 0.005);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:131:      wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:133:      const scoreClamped = getScoreDirectly(sessionId, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:142:      const deleteSessionId = sessionId + '-delete-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:156:    const sessionId = 'floor-stability-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:159:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:163:      setScoreDirectly(sessionId, 4, 0.15);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:166:        wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:169:      const finalScore = getScoreDirectly(sessionId, 4);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:195:    const sessionId = 'mixed-scores-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:198:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:202:      setScoreDirectly(sessionId, 5, 0.8);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:203:      setScoreDirectly(sessionId, 6, 0.05);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:204:      setScoreDirectly(sessionId, 7, 0.005);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:205:      setScoreDirectly(sessionId, 8, 0.03);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:207:      wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:209:      const s5 = getScoreDirectly(sessionId, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:215:      const s6 = getScoreDirectly(sessionId, 6);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:220:      const s7 = getScoreDirectly(sessionId, 7);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:228:      const s8 = getScoreDirectly(sessionId, 8);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2287:        'Existing schema is not fully backward-compatible after bootstrap',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:93:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:94:  hookLog('info', 'gemini:session-stop', `SessionEnd hook fired for session ${sessionId} (reason: ${input.reason ?? 'unknown'})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:100:      updateState(sessionId, { lastSpecFolder: detectedSpec });
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:108:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:114:  hookLog('info', 'gemini:session-stop', `Session ${sessionId} stop processing complete`);
.opencode/skill/system-spec-kit/mcp_server/tests/lifecycle-shutdown.vitest.ts:38:    expect(errorSpy).toHaveBeenCalledWith('[context-server] test-step cleanup failed:', error.message);
.opencode/skill/system-spec-kit/mcp_server/tests/lifecycle-shutdown.vitest.ts:51:    expect(errorSpy).toHaveBeenCalledWith('[context-server] async-step cleanup failed:', error.message);
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:19:      producer: kind === 'bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:35:    const bootstrap = makePayload('bootstrap', 'bootstrap summary');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:40:      bootstrapPayload: bootstrap,
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:673:Processing steps applied during `memory_save` before a memory is persisted.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:930:- `context-server.ts`: MCP integration and API endpoints
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:34:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:37:  const pendingCompactPrime = readCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:57:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:75:  clearCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:77:  hookLog('info', 'gemini:compact-inject', `Injected ${rawOutput.length} chars for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:23:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:47:description: "Durable regression fixture for memory_save UX contract coverage."
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68:Continue validating the \`memory_save\` UX contract with a fixture that is rich enough to satisfy the durable-memory gate while still exercising duplicate no-op, deferred embedding, and post-mutation feedback behavior.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:85:| \`mcp_server/handlers/memory-save.ts\` | Coordinates duplicate detection, sufficiency evaluation, template validation, and post-mutation feedback for \`memory_save\`. |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:248:  it('memory_save success response exposes postMutationHooks contract fields and types', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:384:  it('C13: Response meta.tool is memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:388:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:52:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:135:  sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:164:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:274:| Full validation | `runPreflight()` | Before memory_save |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:293:| [../../context-server.ts](../../context-server.ts) | MCP server using validation |
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:23:import * as sessionManager from '../lib/session/session-manager.js';
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:80:  getSessionState: (sessionId: string) => MockSessionStateRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:155:            for (const [sessionId, row] of sessionState.entries()) {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:157:                sessionState.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:166:              sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:193:            const existing = sessionState.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:195:              session_id: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:209:            sessionState.set(sessionId, nextRow);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:214:            const [updatedAt, sessionId] = args as [string, string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:215:            const row = sessionState.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:238:            const [updatedAt, sessionId] = args as [string, string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:239:            const row = sessionState.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:257:            const [sessionId] = args as [string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:258:            return sessionState.has(sessionId) ? { 1: 1 } : undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:266:            const [sessionId] = args as [string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:267:            return cloneRow(sessionState.get(sessionId));
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:271:            const [sessionId] = args as [string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:272:            const row = sessionState.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:335:    getSessionState: (sessionId: string) => cloneRow(sessionState.get(sessionId)),
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:472:      expect(result.sessions.map((session) => session.sessionId).sort()).toEqual(['list-a', 'list-b']);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:504:        sessionId: 'session-123',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:523:        sessionId: 'session-with-data',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:705:        sessionId: 'recover-fields',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:788:      expect(result.sessions.map((session) => session.sessionId).sort()).toEqual(['recoverable-a', 'recoverable-b']);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:798:      expect(result.sessions.some((session) => session.sessionId === 'exclude-completed')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:812:      const session = result.sessions.find((entry) => entry.sessionId === 'field-check');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:815:        sessionId: 'field-check',
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:9:  const sessionId = 'test-snapshot-store';
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:12:  afterEach(() => { try { rmSync(getStatePath(sessionId)); } catch { /* ok */ } });
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:15:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:18:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:26:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:29:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:32:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:38:    updateState(sessionId, { lastSpecFolder: 'specs/test' });
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:39:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:42:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:482:describe('T059: autoDetectIntent Parameter (memory_search)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:5:import * as sessionManager from '../lib/session/session-manager';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:175:      const sessionId: string = 'test-session-T003';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:177:      const shouldSend: boolean = sessionManager.shouldSendMemory(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:182:      const sessionId: string = 'test-session-T003';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:183:      const shouldSend2: boolean = sessionManager.shouldSendMemory(sessionId, 999);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:195:      const sessionId: string = 'test-session-T004';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:198:      const firstCheck: boolean = sessionManager.shouldSendMemory(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:201:      const markResult: MarkResult = sessionManager.markMemorySent(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:204:      const secondCheck: boolean = sessionManager.shouldSendMemory(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:216:      const sessionId: string = 'test-session-T005';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:224:        const result: MarkResult = sessionManager.markMemorySent(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:231:        expect(sessionManager.shouldSendMemory(sessionId, memory)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:236:      `).get(sessionId) as { count: number };
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:280:      const sessionId: string = 'test-session-T007';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:290:      sessionManager.markMemorySent(sessionId, searchResults[1]); // 502
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:291:      sessionManager.markMemorySent(sessionId, searchResults[3]); // 504
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:293:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:308:      const sessionId: string = 'test-session-T007b';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:314:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, [
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:337:      const sessionId: string = 'test-session-T008';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:346:      sessionManager.markMemorySent(sessionId, searchResults[0]); // 601
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:347:      sessionManager.markMemorySent(sessionId, searchResults[1]); // 602
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:348:      sessionManager.markMemorySent(sessionId, searchResults[2]); // 603
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:350:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:359:      const sessionId: string = 'test-session-T008-zero';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:366:      const { dedupStats: noSavingsStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:307:      const id = mod.recordHistory(1, 'ADD', null, 'reconsolidation test', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:314:      expect(entry!.actor).toBe('mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:353:      'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:8:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:23:  sessionId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:36:function isEnabled(_sessionId?: string | null): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:44:function normalizeSessionId(sessionId: string | null | undefined): string | null {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:45:  if (typeof sessionId !== 'string') return null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:46:  const trimmed = sessionId.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:81:function getAttentionBoost(sessionId: string | null | undefined, memoryIds: number[]): Map<number, number> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:83:  if (!isEnabled(sessionId) || !db) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:87:  const normalizedSessionId = normalizeSessionId(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:139:  sessionId: string | null | undefined
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:141:  const normalizedSessionId = normalizeSessionId(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:145:    sessionId: normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:59:    it('T516-2: handle_memory_search alias is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:60:      expect(typeof handler.handle_memory_search).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:29:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:46:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:69:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:88:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:92:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:103:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:114:      sessionId: 'session-123',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:143:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:147:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:152:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:156:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:164:      sessionId: 'session-9',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:170:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:176:    expect(review.summary.byAction).toEqual({ memory_save: 2 });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:181:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:185:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:189:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:207:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:211:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:242:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:249:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:255:      sessionId: 'session-1',
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
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:34:function countSessionEntries(db: Database.Database, sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:36:    .get(sessionId) as CountRow;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:50:      const sessionId = 'stress-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:63:          const ok = workingMemory.setAttentionScore(sessionId, memoryId, score);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:66:          const currentCount = countSessionEntries(db, sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:71:      const finalCount = countSessionEntries(db, sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:77:    sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:107:    scope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:49:    toolPattern: /^(grep|memory_search)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:56:    toolPattern: /^(bash|memory_save|memory_update)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:158:function resolveSessionId(result: unknown): string {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:164:        meta?: { sessionLifecycle?: { effectiveSessionId?: string }; sessionId?: string };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:165:        data?: { sessionId?: string };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:171:      const fromMeta = parsed?.meta?.sessionId;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:175:      const fromData = parsed?.data?.sessionId;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:265:  const sessionId = resolveSessionId(result);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:267:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:976:  // P0 fix: sessionId is for dedup/state tracking, NOT a governance boundary.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:978:  // passed an ephemeral sessionId, because memories don't have session-scoped access.
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:72:    sessionId: 'sess-abc123',
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:18:    it('T209-2: setAttentionScore accepts (sessionId, memoryId, score) without throwing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:78:      const strictPattern = /workingMemory\.setAttentionScore\(\s*(?:session_id|sessionId)\s*(as\s+string)?\s*,\s*match\.memoryId\s*,\s*[\d.]+\s*\)/;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:79:      const relaxedPattern = /workingMemory\.setAttentionScore\([^)]*(?:session_id|sessionId)/;
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:              producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:31:              sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:62:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:66:import { handleSessionBootstrap } from '../handlers/session-bootstrap.js';
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:72:describe('session-bootstrap handler', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:85:    expect(parsed.data.payloadContract.kind).toBe('bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:86:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:98:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:103:  it('adds a structural hint when the bootstrap contract is stale', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:107:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:108:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:121:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:149:    || scope.sessionId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:161:    const sessionMatches = !scope.sessionId || row.session_id === scope.sessionId;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:380: * Called by the application bootstrap to wire in the actual refresh
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:604: * Set via `registerLlmBackfillFn()` in application bootstrap.
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:366:        metadata: { applied: false, enabled: true, sessionId: 'test-001', boostedCount: 0, maxBoostApplied: 0 },
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:376:    input.config.sessionId = 'test-001';
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:408:    input.config.sessionId = 'test-001';
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:14:      sessionId: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:43:  it('normalizes sessionId before filtering learning history queries', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:50:      sessionId: 'normalized-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:58:      sessionId: 'normalized-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:63:      sessionId: '  normalized-session  ',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:71:      sessionId: 'normalized-session',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:70:        'handle_memory_validate',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:148:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:88:        sessionId: 'sess-123',
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:141:        sessionId: 'sess-456',
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:155:      expect(sel.context.sessionId).toBe('sess-456');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:143:  it('auto-bootstraps the creator as owner when creating a shared space', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:167:  it('treats stale create conflicts as updates and bootstraps only one owner', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:240:  it('rolls back shared-space creation when owner bootstrap fails', async () => {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:88:  // SUITE: Summary stats respect sessionId filter
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:89:  describe('T503: Summary stats respect sessionId filter', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:90:    it('T503-01: sessionId stats filter — totalTasks=1', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:103:        sessionId: sessA,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:120:        sessionId: sessB,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:130:      // Query with sessionId = sessA
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:133:        sessionId: sessA,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:143:    it('T503-01b: sessionId records filter consistent', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:157:        sessionId: sessA,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:173:        sessionId: sessB,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:185:        sessionId: sessA,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:192:      const allMatch = data.learningHistory.every(row => row.sessionId === sessA);
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:197:    it('T503-01c: sessionId filter normalizes whitespace to match stored records', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:200:      const sessionId = uniqueId('sess-trimmed');
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:209:        sessionId: `  ${sessionId}  `,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:217:        sessionId: `  ${sessionId}  `,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:222:        sessionId: `  ${sessionId}  `,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:228:      expect(data.learningHistory[0].sessionId).toBe(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:292:  // SUITE: Combined sessionId + onlyComplete filters
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:293:  describe('T503: Combined sessionId + onlyComplete filters', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:306:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:323:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:329:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:353:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:369:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:374:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:980:  if (isHybrid && config.enableSessionBoost && config.sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:984:        config.sessionId
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:34:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:80:   * @param sessionId - Unique session identifier.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:83:  getOrCreate(sessionId: string): SessionState {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:86:    const existing = this.sessions.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:99:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:108:    this.sessions.set(sessionId, session);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:115:   * @param sessionId - Session to update.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:118:  updateGoal(sessionId: string, goal: string | null): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:119:    const session = this.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:127:   * @param sessionId - Session to update.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:130:  markSeen(sessionId: string, resultIds: Array<number | string>): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:131:    const session = this.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:141:   * @param sessionId - Session to update.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:144:  addQuestion(sessionId: string, question: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:145:    const session = this.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:153:   * @param sessionId - Session to update.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:156:  setAnchors(sessionId: string, anchors: string[]): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:157:    const session = this.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:165:   * @param sessionId - Session to remove.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:167:  clear(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:168:    this.sessions.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:238: * @param sessionId - Session ID for seen-result lookup.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:243:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:255:  const session = manager.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:328: * @param sessionId - Session ID for goal lookup.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:333:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:345:  const session = manager.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/context-server-error-envelope.vitest.ts:5:const sourcePath = path.resolve(__dirname, '../context-server.ts');
.opencode/skill/system-spec-kit/mcp_server/tests/context-server-error-envelope.vitest.ts:8:describe('context-server error envelope handling', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:133:    sessionId: undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:13:import * as sessionManager from '../lib/session/session-manager';
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:254:        sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:283:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:20:    { name: 'handleSessionBootstrap', kind: 'function', filePath: 'mcp_server/handlers/session-bootstrap.ts', callCount: 5 },
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:34:      text: 'Aligned structural bootstrap contract across auto-prime and session_* handlers.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:249:        `but the active embedding configuration resolves to ${current_dim}. Refusing to bootstrap because vector search would fail. ` +
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:386:  function getExtractedRow(database: TestDatabase, sessionId: string, memoryId: number): ExtractedRow | undefined {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:398:    `).get(sessionId, memoryId) as ExtractedRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:422:      const sessionId = 'wm-provenance-session';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:427:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:438:      const row = getExtractedRow(database, sessionId, memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:454:      const sessionId = 'wm-no-count-probe';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:467:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:476:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:492:      `).get(sessionId, memoryId) as { cnt: number };
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:504:      const sessionId = 'wm-provenance-update';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:509:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:520:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:534:      `).get(sessionId, memoryId) as { cnt: number };
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:537:      const row = getExtractedRow(database, sessionId, memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:555:      const sessionId = 'wm-provenance-checkpoint';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:560:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:574:      const removed = workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:581:      const restoredRow = getExtractedRow(database, sessionId, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:53:  memory_search: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:57:  memory_save: ERROR_CODES.MEMORY_SAVE_FAILED,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:7:  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:9:  { tool: 'memory_save', handler: 'handleMemorySave', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:15:  { tool: 'memory_validate', handler: 'handleMemoryValidate', layer: 'L4' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:33:  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:35:  { camel: 'handleMemorySave', snake: 'handle_memory_save' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:41:  { camel: 'handleMemoryValidate', snake: 'handle_memory_validate' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:132:  return buildErrorResponse('memory_search', error, { query });
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:142:const hint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:158:  'memory_save'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:184:| [../../context-server.ts](../../context-server.ts) | MCP server using error system |
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:57:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:72:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:86:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:98:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:265:  if (ns.sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:267:    params.push(ns.sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:313:    node.id, node.specFolder, node.loopType, node.sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:387:    edge.id, edge.specFolder, edge.loopType, edge.sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:462:    snapshot.specFolder, snapshot.loopType, snapshot.sessionId, snapshot.iteration,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:469:export function getLatestSnapshot(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot | null {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:471:  if (sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:476:    `).get(specFolder, loopType, sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:488:export function getSnapshots(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot[] {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:490:  if (sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:495:    `).all(specFolder, loopType, sessionId) as Record<string, unknown>[];
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:605:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:621:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:636:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:431:    ).run(0, 'bootstrap', '[]', Date.now() - 8 * 24 * 60 * 60 * 1000, 'test-setup', 0);
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:479:    // Force shadow mode by replacing the bootstrap entry with a recent timestamp.
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:483:    ).run(0, 'bootstrap', '[]', Date.now() - 1 * 24 * 60 * 60 * 1000, 'test-setup', 0);
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:558:    ).run(0, 'bootstrap', '[]', Date.now() - 1 * 24 * 60 * 60 * 1000, 'test-setup', 0);
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:9:  const sessionId = 'test-resume-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:12:  afterEach(() => { try { rmSync(getStatePath(sessionId)); } catch { /* ok */ } });
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:15:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:19:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:33:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:37:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:43:    updateState(sessionId, { lastSpecFolder: 'specs/a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:44:    updateState(sessionId, { lastSpecFolder: 'specs/b' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:45:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:46:    expect(state!.claudeSessionId).toBe(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:467:      'Start a new session with fresh sessionId',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:478:      'Omit sessionId to disable session deduplication'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:486:      'Start fresh with new sessionId',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:509:      'Use memory_save({ dryRun: true }) to validate first',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:513:    toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:542:    toolTip: 'memory_save({ force: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:549:      'Run memory_save({ dryRun: true }) for detailed validation report',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:554:    toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:694:  memory_search: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:742:  memory_save: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:747:        'Create the memory file before calling memory_save',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:770:      toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:108:- `context-server-error-envelope.vitest.ts`, `envelope.vitest.ts`, and `response-profile-formatters.vitest.ts` - serialized response and profile behavior.
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
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:4:// When wasUseful=false is recorded via memory_validate, reduce the
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:37:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:247:      selectionContext.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:309:        sessionId: row.session_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:88:    expect(session.sessionId).toBe('sess-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:502:    expect(session.sessionId).toBe('singleton-test');
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:5:// Active tests: directory structure, module line counts, context-server imports
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:7:// the export surface without bootstrapping a real database.
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:21:  'context-server.js': 1570,        // actual: 1566 — Main entry point wiring for tools, hooks, startup lifecycle, startup root discovery, session priming, remediation hooks, and current bootstrap/recovery contracts
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 880,           // actual: 862 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools, Phase 024 session_bootstrap, and newer graph/search tool contracts
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:31:  'hooks/memory-surface.js': 520,   // actual: 503 — Memory surface hooks with constitutional cache, auto-surface, attention-enriched hints, priming, session snapshots, and Phase 024 bootstrap telemetry
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:100:    'context-server.js',
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:155:    it(`Import: ${imp.label} found in context-server.js`, () => {
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:156:      const contextServerPath = path.join(MCP_SERVER_PATH, 'dist', 'context-server.js');
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:103:| `sessionId` | `string?` | Optional session identifier |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:160:| `createTrace(query, sessionId?, intent?)` | `RetrievalTrace` | New trace with auto-generated traceId |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:244:| Start trace | `createTrace(query, sessionId?)` | Beginning of a retrieval call |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:306:- Preserve the three axes distinctly through bootstrap or resume-facing payloads. Do not merge them into a single "graph trust" label during transport.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:311:- Current owner surfaces remain authoritative: shared payload sections, session bootstrap or resume consumers, and bridge-facing graph payloads.
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:19:        memory_search: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:20:        memory_save: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:27:        memory_validate: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:167:  // T205-C: Dispatch-Level Enforcement (context-server.ts)
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:172:        path.join(PROJECT_ROOT, 'context-server.ts'),
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:180:        path.join(PROJECT_ROOT, 'context-server.ts'),
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:190:        path.join(PROJECT_ROOT, 'context-server.ts'),
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:198:        path.join(PROJECT_ROOT, 'context-server.ts'),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:85:      "query": "memory_context returns wrong results when token pressure is high",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:251:      "notes": "From T007b Pattern 3: feature description passed to memory_context before implementation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:415:      "query": "the memory_search tool returns stale results after index rebuild",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:440:      "expectedResultDescription": "Should surface session-manager.ts, integration-session-dedup.vitest.ts, and any spec decisions about the deduplication design.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:640:      "expectedResultDescription": "Should surface the generate-context.js script documentation and CLAUDE.md Memory Save Rule about using the script instead of the Write tool.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:641:      "notes": "Derived from \"generate-context\" trigger phrase in the memory save workflow documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:835:      "query": "memory_save keeps failing with duplicate content hash error",
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:25:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:48:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:163:    sessionId: normalizeId(input.sessionId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:238:        sessionId: scope.sessionId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:251:  if (!scope.sessionId) issues.push('sessionId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:272:      sessionId: scope.sessionId ?? '',
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:294:    session_id: decision.normalized.sessionId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:305:      sessionId: decision.normalized.sessionId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:348:    scope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:372:    || scope.sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:421:  if (normalized.sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:423:    params.push(normalized.sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:444:    || normalized.sessionId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:492:      && matchesExactScope(row.session_id, normalized.sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:609:      sessionId: row.session_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:41:    const result = validateToolArgs('memory_search', {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:37:      kind: 'bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:458:describe('Eval run counter bootstrap across tables', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:459:  async function bootstrapAndGenerateNextId(
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:465:      `eval-logger-bootstrap-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:516:    const id = await bootstrapAndGenerateNextId(7, 12);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:521:    const id = await bootstrapAndGenerateNextId(15, 9);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:526:    const id = await bootstrapAndGenerateNextId(null, null);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:527:    // Counter bootstraps to 0, then returns incremented first run ID.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:66:  /** Per-query MRR@5 values for bootstrap CI computation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:69:  bootstrapCI?: BootstrapCIResult;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:287:   Uses bootstrap resampling to compute 95% CI for MRR@5.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:290:/** Result of bootstrap confidence interval computation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:300:  /** Number of bootstrap iterations. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:312: * Compute bootstrap 95% confidence interval for MRR@5.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:314: * Uses percentile bootstrap with 10,000 iterations (default).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:319: * @param iterations - Number of bootstrap iterations (default: 10000).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:328:  // Filter out NaN/Infinity values to prevent poisoning bootstrap means
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:361:  const bootstrapMeans: number[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:367:    bootstrapMeans.push(sum / n);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:371:  bootstrapMeans.sort((a, b) => a - b);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:376:  const ciLower = bootstrapMeans[lowerIdx];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:377:  const ciUpper = bootstrapMeans[upperIdx];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:525:  // Collect per-query MRR for bootstrap CI (REQ-S0-004)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:566:  // Compute bootstrap 95% CI for statistical significance (REQ-S0-004: p<0.05)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:567:  const bootstrapCI = computeBootstrapCI(perQueryMRR);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:575:    bootstrapCI,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:575:        sessionId: normalizedScope.sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:15:const SOURCE_FILE = path.join(SERVER_DIR, 'context-server.ts')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:160:      'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:163:      'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:170:      'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:213:    it('T11b: context-server uses TOOL_DEFINITIONS', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:262:    it('T15b: context-server imports scoring observability init', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:268:    it('T15c: context-server initializes scoring observability at startup', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:292:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:322:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:326:      expect(sourceCode).toMatch(/function\s+resolveSessionTrackingId\s*\(/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:406:      '../lib/session/session-manager',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:717:      vi.doMock('../lib/session/session-manager', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:728:          sessionId: null,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:747:            console.error(`[context-server] ${label} cleanup failed:`, msg)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:753:            console.error(`[context-server] ${label} cleanup failed:`, msg)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:819:      const module = await import('../context-server')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:827:          console.error('[context-server] Fatal error:', err);
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:927:        { id: 'call-1', params: { name: 'memory_search', arguments: {} } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:944:      expect(callArgs[0]).toBe('memory_search')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1054:              name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1055:              arguments: { query: 'recent issues', sessionId: 'sess-sticky-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1103:        memoryAwareTools: new Set<string>(['memory_search']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1113:        { id: 'call-5', params: { name: 'memory_search', arguments: { query: 'hook validation' } } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1123:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1131:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1144:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1157:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1164:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1177:          params: { name: 'memory_context', arguments: { input: 'focused retrieval context', mode: 'focused' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1429:        String(call?.[0] ?? '').includes('[context-server] toolCache cleanup failed:')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1447:        String(call?.[0] ?? '').includes('[context-server] fileWatcher cleanup failed:')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1563:      const response = errorsModule!.buildErrorResponse!('memory_search', testError, { query: 'test' })
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1581:      const hint = errorsModule!.getRecoveryHint!('memory_search', 'UNKNOWN_TOOL')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1614:    it('T28: L1 budget = 3500 (memory_context)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1619:      expect(layerDefs!.getTokenBudget!('memory_context')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1622:    it('T28b: L2 budget = 3500 (memory_search)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1627:      expect(layerDefs!.getTokenBudget!('memory_search')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1703:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1911:    it('T35: Server name is "context-server"', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1914:      expect(serverName![1]).toBe('context-server')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2084:      'memory_context': '[L1:Orchestration]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2085:      'memory_search': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2086:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2087:      'memory_save': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2093:      'memory_validate': '[L4:Mutation]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2131:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2132:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2260:      { module: './lib/session/session-manager.js', name: 'Session manager' },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2279:    // Local replica of DynamicMemoryStats (mirrors context-server.ts interface)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2315:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2341:      expect(result).toContain('memory_context')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2342:      expect(result).toContain('memory_search')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2343:      expect(result).toContain('memory_save')
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:67:    sessionId: 'sess-A',
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:218:      makeEvent({ memoryId: 'mem-A', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:219:      makeEvent({ memoryId: 'mem-A', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:220:      makeEvent({ memoryId: 'mem-B', sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:233:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:234:      makeEvent({ confidence: 'medium', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:235:      makeEvent({ confidence: 'weak',   sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:249:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:250:      makeEvent({ confidence: 'strong', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:251:      makeEvent({ confidence: 'medium', sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:261:      makeEvent({ confidence: 'strong', sessionId: `sess-${i}`, memoryId: 'mem-X' })
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:271:      makeEvent({ timestamp: 1000, sessionId: 'sess-in' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:272:      makeEvent({ timestamp: 5000, sessionId: 'sess-out' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:278:  it('treats distinct sessionIds as distinct sessions', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:281:      makeEvent({ sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:282:      makeEvent({ sessionId: 'sess-1' }), // same session, not counted twice
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:283:      makeEvent({ sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:292:      makeEvent({ memoryId: 'mem-low',  confidence: 'weak',   sessionId: 's1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:293:      makeEvent({ memoryId: 'mem-high', confidence: 'strong', sessionId: 's2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:532:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-A', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:533:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-B', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:534:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-C', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:554:      makeEvent({ memoryId: 'mem-weak', sessionId: 'sess-1', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:555:      makeEvent({ memoryId: 'mem-weak', sessionId: 'sess-2', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:574:      makeEvent({ memoryId: 'mem-ok', sessionId: 's1', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:575:      makeEvent({ memoryId: 'mem-ok', sessionId: 's2', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:576:      makeEvent({ memoryId: 'mem-ok', sessionId: 's3', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:578:      makeEvent({ memoryId: 'mem-skip', sessionId: 's4', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:593:      makeEvent({ sessionId: 'sess-1', timestamp: BASE_TS - 10_000 }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:594:      makeEvent({ sessionId: 'sess-2', timestamp: BASE_TS - 10_000 }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:595:      makeEvent({ sessionId: 'sess-3', timestamp: BASE_TS - 10_000 }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:613:      makeEvent({ sessionId: 'sX', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:614:      makeEvent({ sessionId: 'sY', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:615:      makeEvent({ sessionId: 'sZ', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:632:      makeEvent({ sessionId: 's1', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:633:      makeEvent({ sessionId: 's2', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:634:      makeEvent({ sessionId: 's3', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:538:    recordHistory(memoryId, 'ADD', null, parsed.title ?? filePath, params.actor ?? 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:816:      actor: params.actor ?? 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1:// TEST: memory_search per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:106:describe('T056: memory_search emits per-channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:117:        memory_context: 'L1',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:118:        memory_search: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:119:        memory_save: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:120:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:126:        memory_validate: 'L4',
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
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:77:    tools: ['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete']
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:161:  it('surfaces certainty fields in the shared bootstrap payload', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:224:    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:132:const budget = getTokenBudget('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:139:const enhanced = enhanceDescription('memory_search', 'Search memories');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:169:| `context-server.ts` | Uses layer definitions for tool organization |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:63:      console.warn('[eval-logger] generateEvalRunId bootstrap warning:', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:64:      // Keep _evalRunCounterInitialized=false so next call can retry bootstrap.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:29:- Eval database bootstrap and logging.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:44:| `eval-db.ts` | Eval database bootstrap and schema management |
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:36:    sessionId: 'sess-abc',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:217:      sessionId: 'session-XYZ',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:232:    logFeedbackEvent(db, makeEvent({ sessionId: null }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:327:  it('filters by sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:329:    logFeedbackEvent(db, makeEvent({ sessionId: 'sess-1' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:330:    logFeedbackEvent(db, makeEvent({ sessionId: 'sess-2' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:332:    const forSess1 = getFeedbackEvents(db, { sessionId: 'sess-1' });
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:48: * Example: `SPECKIT_PARSER=regex node context-server.js`
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:171:// (SKIPPED — session-manager.js has DB-dependent imports)
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:172:// Type note: skipped section covers dist/lib/session/session-manager.js
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:181:  it('T017-02: Handles minimal session state (only sessionId)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:185:  it('T017-03: Handles undefined sessionId gracefully', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:200:  it('T018-02: Displays sessionId in code format', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:262:  it('T020-05: specFolder takes precedence over sessionId for resume command', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:50:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:68:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:83:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:91:    expect(getDefaultErrorCodeForTool('memory_save')).toBe('E081');
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:189:  - `context-server.ts`
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:332:  - `session-manager.ts` — session-state lifecycle, dedup tracking, cleanup, and recovery helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:656:- `session/session-manager.ts -> cognitive/working-memory.ts`
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:26:  if (env.CLAUDE_CODE === '1' || env.CLAUDE_SESSION_ID || env.MCP_SERVER_NAME === 'context-server') {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:181:  it('T022: memory_search has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:182:    expect(TOOL_SPECIFIC_HINTS.memory_search).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:183:    expect(typeof TOOL_SPECIFIC_HINTS.memory_search).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:191:  it('T024: memory_save has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:192:    expect(TOOL_SPECIFIC_HINTS.memory_save).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:193:    expect(typeof TOOL_SPECIFIC_HINTS.memory_save).toBe('object');
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
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:86:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:29:    sessionId?: unknown;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:395:      sessionId: 'session-secret',
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:419:    expect(tracePayload.sessionId).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:37:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:49:    tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:87:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:177:  { tool: 'memory_search', handler: 'handleMemorySearch' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:178:  { tool: 'memory_save', handler: 'handleMemorySave' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:133:    expect(matchRule('memory_search', 'spec.md error context')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:135:    expect(matchRule('memory_save', 'git commit -m "x"')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:44:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:63:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:191:      event.sessionId ?? null
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:257:    if (opts.sessionId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:259:      params.push(opts.sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:9:import * as sessionManager from '../lib/session/session-manager';
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:109:function mockTrustedSession(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:111:    requestedSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:112:    effectiveSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:188:          sessionId: 'session-auto-resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:516:    it('T027k: missing sessionId generates ephemeral UUID scope', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:534:    it('T027ka: rejects caller sessionId when it is not server-managed', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:540:          sessionId: 'session-new',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:557:        'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:577:          sessionId: 'session-abc',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:626:          sessionId: 'session-trace',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:656:          sessionId: 'session-known',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:691:          sessionId: 'session-default-on',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:722:          sessionId: 'session-opt-out',
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:121:  it('records bootstrap telemetry for full resume requests', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:126:  it('skips bootstrap telemetry and includes sessionQuality in minimal mode', async () => {
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
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
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:140:describe('session bootstrap fail-closed trust handling', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:181:    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:181:const key = generateCacheKey('memory_search', { query: 'test' });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:184:set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:196:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:208:// After memory_save operation
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
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
.opencode/skill/system-spec-kit/mcp_server/tests/db-dimension-integrity.vitest.ts:161:      expect(() => initializeDb(dbPath)).toThrow(/EMBEDDING DIMENSION MISMATCH|Refusing to bootstrap/i);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:55:function evictStale(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:56:  const entries = sessionQueries.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:61:    sessionQueries.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:64:    sessionQueries.set(sessionId, fresh.slice(-MAX_QUERIES_PER_SESSION));
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:101:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:105:  const entries = sessionQueries.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:151: * @param sessionId - Session identifier (null = skip tracking)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:159:  sessionId: string | null,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:165:  if (!sessionId) return null;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:172:  evictStale(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:175:  const detection = detectFlow(sessionId, tokens, timestamp);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:178:  const entries = sessionQueries.get(sessionId) ?? [];
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:180:  sessionQueries.set(sessionId, entries.slice(-MAX_QUERIES_PER_SESSION));
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:192:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:207:  sessionId: string | null,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:222:      sessionId: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:233:  sessionId: string | null,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:236:  if (!sessionId) return;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:238:  const entries = sessionQueries.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:255:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:263:export function clearSession(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:264:  sessionQueries.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:270:export function getSessionQueryCount(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:271:  return sessionQueries.get(sessionId)?.length ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:312:    'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:196:    it('namespace matches sessionId format', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:39:        'handle_memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:680:        actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:687:          actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1248:          sessionId: 'session-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1261:          sessionId: 'session-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1317:          sessionId: 'session-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1334:          sessionId: 'session-p',
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:83:  bootstrapPayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:91:    args.bootstrapPayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:98:  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:16:    const { maybeStructuralNudge } = await import('../context-server.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:31:    const { maybeStructuralNudge } = await import('../context-server.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:45:    const { maybeStructuralNudge } = await import('../context-server.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:223:  it('keeps bootstrap and resume authoritative while surfacing the nudge separately', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:285:    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:202:            sessionId: 'sess-123',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:214:        expect(message.includes('sessionId')).not.toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:131:describe('session bootstrap trust preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:208:    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:34:    expect(trace.sessionId).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:38:  it('createTrace includes optional sessionId and intent', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:41:    expect(trace.sessionId).toBe('sess-123');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:236:      sessionId: 'session-id',
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:263:    expect(sanitizedRecord.sessionId).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:132:  it('returns null for memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:133:    const result = await autoSurfaceAtToolDispatch('memory_search', { query: 'some query' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:147:  it('returns null for memory_save', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:148:    const result = await autoSurfaceAtToolDispatch('memory_save', { filePath: '/some/path.md' });
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:11:  | 'bootstrap'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:81: *   const logger = createLogger('session-manager');
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:82: *   logger.warn('Cleanup failed', { sessionId: 'abc', elapsed: 42 });
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:83: *   // stderr: 'WARN  [session-manager] Cleanup failed {"sessionId":"abc","elapsed":42}'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:234:        sourceSurface: 'session_start',
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:92:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:102:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:110:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:227:function getOrCreateSession(sessionId: string | null = null): string {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:228:  if (sessionId) return sessionId;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:236:function clearSession(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:243:    ) as Database.Statement).run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:244:    sessionModeRegistry.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:279:function getWorkingMemory(sessionId: string): WorkingMemoryEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:289:    `) as Database.Statement).all(sessionId) as WorkingMemoryEntry[];
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:297:function getSessionMemories(sessionId: string): Array<Record<string, unknown>> {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:308:    `) as Database.Statement).all(sessionId) as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:316:function sessionExists(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:317:  return getLatestSessionEventCounter(sessionId) !== null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:320:function getSessionEventCounter(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:321:  const current = getLatestSessionEventCounter(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:346:    `) as Database.Statement).all(sessionId, safeFloor, safeLimit) as SessionPromptContextEntry[];
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:354:function getSessionInferredMode(sessionId: string): string | null {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:355:  const mode = sessionModeRegistry.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:359:function setSessionInferredMode(sessionId: string, mode: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:360:  const normalizedSessionId = sessionId.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:382:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:392:    const currentEventCounter = nextEventCounter(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:396:    ) as Database.Statement).get(sessionId, memoryId) as { id: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:407:      `) as Database.Statement).run(clampedScore, currentEventCounter, sessionId, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:410:      enforceMemoryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:415:      `) as Database.Statement).run(sessionId, memoryId, clampedScore, currentEventCounter);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:431:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:440:  if (!sessionId || !sourceTool || !sourceCallId || !extractionRuleId) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:447:    const currentEventCounter = nextEventCounter(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:475:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:489:    ) as Database.Statement).get(sessionId, memoryId) as { focus_count?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:491:      enforceMemoryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:502:function nextEventCounter(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:505:  const current = getLatestSessionEventCounter(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:519:function enforceMemoryLimit(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:525:    ) as Database.Statement).get(sessionId) as { count: number };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:539:    `) as Database.Statement).run(sessionId, excess);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:560:function batchUpdateScores(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:564:  if (!isFeatureEnabled('SPECKIT_EVENT_DECAY', sessionId)) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:569:    const currentEventCounter = getCurrentEventCounter(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:575:    `) as Database.Statement).all(sessionId) as Array<{
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:628:function getCurrentEventCounter(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:629:  const current = getLatestSessionEventCounter(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:637:function getLatestSessionEventCounter(sessionId: string): number | null {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:648:    `) as Database.Statement).get(sessionId) as { event_counter?: number | null };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:678:function getSessionStats(sessionId: string): SessionStats | null {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:693:    `) as Database.Statement).get(sessionId) as {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:704:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:127:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:160:      sessionId: undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:7:import * as sm from '../lib/session/session-manager';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:80:function insertSentRow(sessionId: string, hash: string, memoryId: number | null, sentAt: string): void {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:83:  ).run(sessionId, hash, memoryId, sentAt);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:232:    it('returns failure for empty sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:264:    it('empty sessionId returns zeros', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:334:    it('generates a server session when caller omits sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:430:    it('rejects empty sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:449:    it('fails for empty sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:506:        expect(state.sessionId).toBe('recover-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:539:    it('rejects empty sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:560:        const ids = r.sessions.map((s: InterruptedSession) => s.sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:564:        const s1 = r.sessions.find((s: InterruptedSession) => s.sessionId === 'int-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:577:      const ids = r.sessions.map((session: InterruptedSession) => session.sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:598:        sessionId: 'gen-md-1',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:619:      // Minimal input (only sessionId required)
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:620:      const md = sm.generateContinueSessionMd({ sessionId: 'gen-md-2' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:625:      // Without specFolder, should use sessionId-based resume command
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:626:      expect(md).toContain('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:23:    it('T531-1: sessionId parameter accepted by search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:28:            sessionId: 'dedup-session-001',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:35:        expect(getErrorMessage(error)).not.toContain('sessionId');
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:44:            sessionId: 'dedup-session-002',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:75:    it('T531-4: Search without sessionId accepted (no dedup)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:80:            // No sessionId — dedup should not activate
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:94:    it('T531-5: Default dedup behavior with sessionId', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:99:            sessionId: 'dedup-session-default',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:115:            sessionId: 'dedup-session-disabled',
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:34:      expect(metrics.sessionId).toMatch(/^sess_/);
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cleanup-helpers.ts:8:    console.error(`[context-server] ${label} cleanup failed:`, get_error_message(error));
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cleanup-helpers.ts:17:    console.error(`[context-server] ${label} cleanup failed:`, get_error_message(error));
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:6:import * as sm from '../lib/session/session-manager';
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:22:  function insertWorkingMemory(sessionId: string, memoryId: number, score: number = 0.8) {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:26:    `).run(sessionId, memoryId, score);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:29:  function countWorkingMemory(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:32:    ).get(sessionId) as { count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:105:      const sessionId = 'complete-test-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:108:      insertWorkingMemory(sessionId, 1, 0.9);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:109:      insertWorkingMemory(sessionId, 2, 0.7);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:110:      insertWorkingMemory(sessionId, 3, 0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:112:      const countBefore = countWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:116:      sm.saveSessionState(sessionId, { currentTask: 'testing' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:119:      const result = sm.completeSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:123:      const countAfter = countWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:127:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:128:      getTestDb().prepare('DELETE FROM session_state WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:134:      const sessionId = 'clear-test-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:137:      insertWorkingMemory(sessionId, 4, 0.8);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:138:      insertWorkingMemory(sessionId, 5, 0.6);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:140:      const countBefore = countWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:147:      `).run(sessionId, 'test-hash-123', 4);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:150:      const result = sm.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:154:      const countAfter = countWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:160:      ).get(sessionId) as { count: number };
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:164:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:165:      getTestDb().prepare('DELETE FROM session_sent_memories WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:12:    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: { tool: 'memory_search' } }) }],
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:32:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:238:   T021-T030: handle_memory_context MAIN HANDLER TESTS
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:242:  it('T021: handle_memory_context is a function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:289:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:290:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:847:  it('T101: handle_memory_context is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:868:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:869:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:902:      meta: { tool: 'memory_search' }
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:32:    sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:69:    params.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:99:    recordHistory(1, 'ADD', null, 'Version 1', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:103:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:113:    recordHistory(2, 'ADD', null, 'Version 2', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:118:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:95:vi.mock('../lib/session/session-manager', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:97:  filterSearchResults: vi.fn((_sessionId: string, results: unknown[]) => ({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:123:describe('memory_search UX hook integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:139:      sessionId: 'sess-ux-1',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:594:const sessionId = getOrCreateSession();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:595:// sessionId = 'wm-lxyz123-abc456'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:598:setAttentionScore(sessionId, memoryId, 1.0);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:601:const entries = getWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:605:const memories = getSessionMemories(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:608:const updated = batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:612:const stats = getSessionStats(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:613:// stats = { sessionId, totalEntries, avgAttention, maxAttention, minAttention, totalFocusEvents }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:616:clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:98:    vi.doMock('../lib/session/session-manager', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:304:  `).run(1, 'sess-1', 1, 0.9, now, later, 2, 1, 1, 'memory_search', 'call-1', 'rule-1', 0);
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:205:│   ├── session-manager.ts      # Session deduplication (~1050 lines)
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:331:| `session/session-manager.ts` | Session deduplication (~1050 lines) |

codex
I have the symbol map now. The next pass is narrowing onto the exact handler and store slices that explain failure modes: where Engram silently auto-creates sessions, where it upserts by topic key, and where Public deliberately fails closed or preserves bootstrap authority.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '50,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '460,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '720,1125p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '754,1188p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1462,1668p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3201,3528p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3521,3558p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "rg -n \"trusted|sessionId|assert.*session|reject|invalid session|bootstrap|resume|preservesAuthority|authoritative|session_bootstrap|session_resume|session quality|generateServerSession|getOrCreate|resume previous work|mode === 'resume'\" .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "Key Learnings|trigger_phrases|thread|metadata|evidence|save-context|POST-SAVE|quality review|sessionId|specFolder|importance|hints|artifacts|filesChanged" .opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"memory_match_triggers|memory_search|memory_context|session_bootstrap|session_resume|memory_save|memory_index_scan|memory_validate|memory_quick_search\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
257:  preservesAuthority: 'session_bootstrap';
323:    preservesAuthority: 'session_bootstrap',
752:    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
882:    if (name === 'memory_context' && args.mode === 'resume') {
912:      name === 'memory_context' && args.mode === 'resume';
964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
1243:      console.error('[context-server] Run memory_index_scan manually after model loads');

 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:4:// Pure parsing functions that extract structured evidence from
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:72:  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:78:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:79:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:88:  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:281:    for (const key of ['specFolder', 'spec_folder', 'SPEC_FOLDER']) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:338:    const specFolderArg = explicitTarget || payloadTarget;
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:339:    if (!specFolderArg) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:340:        throw new Error(`${mode} requires a target spec folder via an explicit CLI override or payload specFolder`);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:344:        specFolderArg,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:349:        sessionId: null,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:357:    let sessionId = null;
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:365:            sessionId = candidate.trim();
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:373:        return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:377:        return { ...structured, sessionId };
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:386:        specFolderArg: secondaryArg || null,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:388:        sessionId,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:392:    const specFolderArg = core_1.CONFIG.SPEC_FOLDER_ARG;
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:393:    if (!specFolderArg)
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:395:    const validation = isValidSpecFolder(specFolderArg);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:402:    const inputBaseName = path.basename(specFolderArg);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:414:    console.error(`\nError: Invalid spec folder format: ${specFolderArg}`);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:421:            const matches = available.filter((n) => n.includes(path.basename(specFolderArg)) && core_1.SPEC_FOLDER_PATTERN.test(n));
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:429:                const targetBase = path.basename(specFolderArg);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:504:        core_1.CONFIG.SPEC_FOLDER_ARG = parsed.specFolderArg;
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:508:            specFolderArg: core_1.CONFIG.SPEC_FOLDER_ARG ?? undefined,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:514:            sessionId: parsed.sessionId ?? undefined,

 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:115:// Phase 023: Context metrics — lightweight session quality tracking
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:258:  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:360:  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:361:    ? ((extra as { sessionId?: string }).sessionId ?? null)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:363:  const explicitSessionId = typeof args.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:364:    ? args.sessionId
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:378:// that lack an explicit sessionId param can still correlate with a prior search.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:782:  // Phase 027: Structural bootstrap guidance for non-hook runtimes
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1471:    `Unhandled rejection at: ${String(promise)} reason: ${reason instanceof Error ? reason.stack ?? reason.message : String(reason)}`,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1803:            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:67:    sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:85:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:124:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:153:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:168:  trusted: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:277:function hasSessionStateRecord(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:283:    ).get(sessionId) as { 1?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:292:function hasSentMemoryRecord(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:298:    ).get(sessionId) as { 1?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:307:function isTrackedSession(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:308:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:312:  const normalizedSessionId = sessionId.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:330:function getSessionIdentityRecord(sessionId: string): {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:344:  `).get(sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:397:      trusted: false,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:405:      trusted: false,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:406:      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:415:      trusted: false,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:416:      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:425:      trusted: false,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:426:      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:433:    trusted: true,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:508:function shouldSendMemory(sessionId: string, memory: MemoryInput | number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:515:  if (!sessionId || typeof sessionId !== 'string') return true;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:526:    const exists = stmt.get(sessionId, hash);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:536:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:542:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(memories)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:573:      const existingRows = existingStmt.all(sessionId) as { memory_hash: string }[];
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:580:          const insertResult = insertStmt.run(sessionId, hash, memory.id || null, now);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:594:        enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:634:function markMemorySent(sessionId: string, memory: MemoryInput | number): MarkResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:637:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:638:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:653:      stmt.run(sessionId, hash, memoryId, new Date().toISOString());
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:655:      enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:666:function markMemoriesSentBatch(sessionId: string, memories: MemoryInput[]): MarkBatchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:669:  if (!sessionId || !Array.isArray(memories) || memories.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:670:    return { success: false, markedCount: 0, error: 'Valid sessionId and memories array required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:685:        const result = insertStmt.run(sessionId, hash, memory.id || null, now);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:691:      enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:708:function enforceEntryLimit(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:709:  if (!db || !sessionId) return;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:715:    const row = countStmt.get(sessionId) as { count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:730:    deleteStmt.run(sessionId, sessionId, excess);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:843:function clearSession(sessionId: string): CleanupResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:844:  if (!db || !sessionId) return { success: false, deletedCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:850:    const result = stmt.run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:854:      workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:857:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:868:function getSessionStats(sessionId: string): SessionStats {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:869:  if (!db || !sessionId) return { totalSent: 0, oldestEntry: null, newestEntry: null };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:880:    const row = stmt.get(sessionId) as { total_sent: number; oldest_entry: string | null; newest_entry: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:898:function filterSearchResults(sessionId: string, results: MemoryInput[]): FilterResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:899:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:907:  const shouldSendMap = shouldSendMemoriesBatch(sessionId, results, true);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:938:function markResultsSent(sessionId: string, results: MemoryInput[]): MarkBatchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:939:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results) || results.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:943:  return markMemoriesSentBatch(sessionId, results);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1020:function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1022:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1023:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1057:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1079:function completeSession(sessionId: string): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1080:  if (!db || !sessionId) return { success: false, error: 'Database or sessionId not available' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1088:    stmt.run(new Date().toISOString(), sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1092:      workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1095:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1126:function recoverState(sessionId: string, scope: SessionIdentityScope = {}): RecoverResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1128:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1129:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1143:    const row = stmt.get(sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1156:      return { success: false, error: `sessionId "${sessionId}" is bound to a different ${mismatch}` };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1160:      sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1182:      updateStmt.run(new Date().toISOString(), sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1219:        sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1241:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1260:  const resumeCommand = specFolder
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1261:    ? `/spec_kit:resume ${specFolder}`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1262:    : sessionId
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1278:| **Session ID** | \`${sessionId || 'N/A'}\` |
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1304:${resumeCommand}
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1324:function writeContinueSessionMd(sessionId: string, specFolderPath: string): CheckpointResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1325:  if (!sessionId || !specFolderPath) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1326:    return { success: false, error: 'sessionId and specFolderPath are required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1330:    const recoverResult = recoverState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1333:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1355:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1359:  const saveResult = saveSessionState(sessionId, state);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1366:    return writeContinueSessionMd(sessionId, folderPath);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:84:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:97:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:99:  resumedContextCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:121:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:146:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:155:  resumeHeuristicApplied: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:674:  resume: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:677:    strategy: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:734:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:765:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:784:  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:787:    query: input || 'resume work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:798:    anchors: resumeAnchors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:799:    sessionId: options.sessionId,
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1142:  if (requested_mode !== 'resume') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1224:    resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1244:    resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1246:    resumedContextCount: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1305:      resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1314:    resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1338:    resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1343:    queryHeuristicApplied: resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1425:  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434:  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1436:    if (resumeContextItems.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1437:      sessionLifecycle.resumedContextCount = resumeContextItems.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1497:        resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4:// Phase 020: Composite MCP tool that merges memory resume context,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:68:  status: 'accepted' | 'rejected';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:89:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:160:function rejectCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:166:    status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:200:    return rejectCachedSummary('fidelity', 'missing_state', 'No recent hook state was available for cached continuity reuse.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:204:    return rejectCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:213:    return rejectCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:222:    return rejectCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:225:      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:245:    return rejectCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:257:    return rejectCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:274:    return rejectCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:285:    return rejectCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:293:    return rejectCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:304:      return rejectCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:312:      return rejectCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:319:    return rejectCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:392:    `[${surface}] Cached summary rejected (${decision.category}): ${decision.reason} — ${decision.detail}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:405:  // Phase 024: Record bootstrap telemetry
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:417:        mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:418:        profile: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:471:  // Phase 027: Structural bootstrap contract for resume surface
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:482:    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:511:      key: 'memory-resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:560:    kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:591:      resumePayload: payloadContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:599:  // Phase 024 / Item 9: Record bootstrap telemetry
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
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:194:  // Phase 027: Structural bootstrap contract
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:202:  const cachedSummary = extractCachedSummary(resumeData);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:204:    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:214:  // Record bootstrap telemetry once for the composite call.
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
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:296:    kind: 'bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:299:      { label: 'resume', certainty: resumeCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:324:    resume: resumeWithTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:331:      bootstrapPayload: payloadContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:332:      resumePayload,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:338:    // Keep advisory routing guidance out of nextActions so bootstrap and resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:339:    // remain the authoritative recovery owners for startup and deep resume flows.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '330,440p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   330	function getSessionIdentityRecord(sessionId: string): {
   331	  tenantId: string | null;
   332	  userId: string | null;
   333	  agentId: string | null;
   334	} | null {
   335	  if (!db || !hasTable('session_state')) {
   336	    return null;
   337	  }
   338	
   339	  const row = db.prepare(`
   340	    SELECT tenant_id, user_id, agent_id
   341	    FROM session_state
   342	    WHERE session_id = ?
   343	    LIMIT 1
   344	  `).get(sessionId) as Record<string, unknown> | undefined;
   345	
   346	  if (!row) {
   347	    return null;
   348	  }
   349	
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '780,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1220,1245p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '400,492p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '163,245p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '356,392p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   356	function resolveSessionTrackingId(
   357	  args: Record<string, unknown>,
   358	  extra: unknown,
   359	): string | undefined {
   360	  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
   361	    ? ((extra as { sessionId?: string }).sessionId ?? null)
   362	    : null;
   363	  const explicitSessionId = typeof args.sessionId === 'string'
   364	    ? args.sessionId
   365	    : typeof args.session_id === 'string'
   366	      ? args.session_id
   367	      : null;
   368	  const codexThreadId = typeof process.env.CODEX_THREAD_ID === 'string'
   369	    && process.env.CODEX_THREAD_ID.trim().length > 0
   370	    ? process.env.CODEX_THREAD_ID.trim()
   371	    : null;
   372	
   373	  return explicitSessionId ?? transportSessionId ?? codexThreadId ?? undefined;
   374	}
   375	
   376	// REQ-014: Sticky session for follow_on_tool_use correlation.
   377	// Stores the last resolved session ID so non-search tools (e.g. memory_stats)
   378	// that lack an explicit sessionId param can still correlate with a prior search.
   379	// Safe for stdio (single client). TTL in query-flow-tracker bounds staleness.
   380	let lastKnownSessionId: string | null = null;
   381	
   382	function runAfterToolCallbacks(tool: string, callId: string, result: unknown): void {
   383	  if (afterToolCallbacks.length === 0) {
   384	    return;
   385	  }
   386	
   387	  queueMicrotask(() => {
   388	    for (const callback of afterToolCallbacks) {
   389	      void callback(tool, callId, result).catch((error: unknown) => {
   390	        const message = error instanceof Error ? error.message : String(error);
   391	        console.error(`[context-server] afterTool callback failed for '${tool}' (${callId}): ${message}`);
   392	      });

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Markdown Evidence Builder
     3	// ───────────────────────────────────────────────────────────────
     4	// Pure parsing functions that extract structured evidence from
     5	// markdown memory files for the sufficiency evaluator.
     6	
     7	import type { MemoryEvidenceSnapshot } from '@spec-kit/shared/parsing/memory-sufficiency';
     8	import type { ParsedMemory } from './types.js';
     9	
    10	// Feature catalog: Memory indexing (memory_save)
    11	// Feature catalog: Dry-run preflight for memory_save
    12	
    13	const MARKDOWN_HEADING_RE = /^(#{2,6})\s+(.+?)\s*$/;
    14	const MARKDOWN_BULLET_RE = /^\s*(?:[-*]|\d+\.)\s+(.*)$/;
    15	
    16	function stripMarkdownDecorators(value: string): string {
    17	  return value
    18	    .replace(/`+/g, '')
    19	    .replace(/\*\*/g, '')
    20	    .replace(/\[(.*?)\]\((.*?)\)/g, '$1 $2')
    21	    .replace(/\s+/g, ' ')
    22	    .trim();
    23	}
    24	
    25	function extractMarkdownSections(content: string): Array<{ heading: string; body: string }> {
    26	  const sections: Array<{ heading: string; body: string }> = [];
    27	  const lines = content.split(/\r?\n/);
    28	  let currentHeading = '';
    29	  let currentBody: string[] = [];
    30	
    31	  const flush = (): void => {
    32	    const body = currentBody.join('\n').trim();
    33	    if (body.length > 0) {
    34	      sections.push({ heading: currentHeading, body });
    35	    }
    36	    currentBody = [];
    37	  };
    38	
    39	  for (const line of lines) {
    40	    const headingMatch = line.match(MARKDOWN_HEADING_RE);
    41	    if (headingMatch) {
    42	      flush();
    43	      currentHeading = stripMarkdownDecorators(headingMatch[2]);
    44	      continue;
    45	    }
    46	
    47	    currentBody.push(line);
    48	  }
    49	
    50	  flush();
    51	  return sections;
    52	}
    53	
    54	function extractMarkdownListItems(body: string): string[] {
    55	  return body
    56	    .split(/\r?\n/)
    57	    .map((line) => line.match(MARKDOWN_BULLET_RE)?.[1] ?? '')
    58	    .map(stripMarkdownDecorators)
    59	    .filter(Boolean);
    60	}
    61	
    62	function extractMarkdownTableFiles(body: string): Array<{ path?: string; description?: string }> {
    63	  const files: Array<{ path?: string; description?: string }> = [];
    64	
    65	  for (const line of body.split(/\r?\n/)) {
    66	    const trimmed = line.trim();
    67	    if (!trimmed.startsWith('|')) {
    68	      continue;
    69	    }
    70	    if (/^\|[:\-|\s]+\|?$/.test(trimmed)) {
    71	      continue;
    72	    }
    73	
    74	    const cells = trimmed
    75	      .split('|')
    76	      .slice(1, -1)
    77	      .map((cell) => stripMarkdownDecorators(cell));
    78	
    79	    if (cells.length < 2 || /^file$/i.test(cells[0])) {
    80	      continue;
    81	    }
    82	
    83	    files.push({
    84	      path: cells[0],
    85	      description: cells[1],
    86	    });
    87	  }
    88	
    89	  return files;
    90	}
    91	
    92	function buildParsedMemoryEvidenceSnapshot(
    93	  parsed: ParsedMemory,
    94	): MemoryEvidenceSnapshot {
    95	  const sections = extractMarkdownSections(parsed.content);
    96	  const files: Array<{ path?: string; description?: string }> = [];
    97	  const observations: Array<{ title?: string; narrative?: string }> = [];
    98	  const decisions: string[] = [];
    99	  const nextActions: string[] = [];
   100	  const blockers: string[] = [];
   101	  const outcomes: string[] = [];
   102	  const recentContext: Array<{ request?: string; learning?: string }> = [];
   103	
   104	  for (const section of sections) {
   105	    const heading = section.heading.toLowerCase();
   106	    const listItems = extractMarkdownListItems(section.body);
   107	
   108	    if (
   109	      heading.includes('key files')
   110	      || heading.includes('files changed')
   111	      || heading.includes('files and their roles')
   112	      || heading === 'files'
   113	    ) {
   114	      files.push(...extractMarkdownTableFiles(section.body));
   115	      continue;
   116	    }
   117	
   118	    if (/^(?:feature|implementation|observation|read|write|edit|bash|grep|glob|search|tool)\s*:/.test(heading)) {
   119	      observations.push({
   120	        title: section.heading,
   121	        narrative: stripMarkdownDecorators(section.body),
   122	      });
   123	      continue;
   124	    }
   125	
   126	    if (heading === 'decisions' || heading === 'key decisions' || /^decision\s+\d+:/i.test(section.heading)) {
   127	      decisions.push(...(listItems.length > 0 ? listItems : [stripMarkdownDecorators(section.body)]));
   128	      continue;
   129	    }
   130	
   131	    if (
   132	      heading.includes('next steps')
   133	      || heading === 'next action'
   134	      || heading.includes('pending work')
   135	      || heading.includes('follow-up actions')
   136	    ) {
   137	      nextActions.push(...(listItems.length > 0 ? listItems : [stripMarkdownDecorators(section.body)]));
   138	      continue;
   139	    }
   140	
   141	    if (heading.includes('blockers')) {
   142	      blockers.push(...(listItems.length > 0 ? listItems : [stripMarkdownDecorators(section.body)]));
   143	      continue;
   144	    }
   145	
   146	    if (heading.includes('key outcomes') || heading === 'outcomes' || heading === 'outcome' || heading === 'results') {
   147	      outcomes.push(...(listItems.length > 0 ? listItems : [stripMarkdownDecorators(section.body)]));
   148	      continue;
   149	    }
   150	
   151	    if (heading === 'implementation state') {
   152	      observations.push({
   153	        title: section.heading,
   154	        narrative: stripMarkdownDecorators(section.body),
   155	      });
   156	      continue;
   157	    }
   158	
   159	    if (heading.includes('context summary') || heading.includes('session summary') || heading === 'overview') {
   160	      recentContext.push({
   161	        request: section.heading,
   162	        learning: stripMarkdownDecorators(section.body),
   163	      });
   164	    }
   165	  }
   166	
   167	  return {
   168	    title: parsed.title,
   169	    content: parsed.content,
   170	    triggerPhrases: parsed.triggerPhrases,
   171	    files,
   172	    observations,
   173	    decisions,
   174	    nextActions,
   175	    blockers,
   176	    outcomes,
   177	    recentContext,
   178	  };
   179	}
   180	
   181	export {
   182	  MARKDOWN_HEADING_RE,
   183	  MARKDOWN_BULLET_RE,
   184	  stripMarkdownDecorators,
   185	  extractMarkdownSections,
   186	  extractMarkdownListItems,
   187	  extractMarkdownTableFiles,
   188	  buildParsedMemoryEvidenceSnapshot,
   189	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '62,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '332,346p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   332	    }
   333	    const payload = parseStructuredJson(rawJson ?? '', mode);
   334	    const explicitSpecFolderArg = args[mode === '--stdin' ? 1 : 2];
   335	    const explicitTarget = explicitSpecFolderArg ? resolveCliSpecFolderReference(explicitSpecFolderArg) || explicitSpecFolderArg : null;
   336	    const payloadTargetRaw = extractPayloadSpecFolder(payload);
   337	    const payloadTarget = payloadTargetRaw ? (resolveCliSpecFolderReference(payloadTargetRaw) || payloadTargetRaw) : null;
   338	    const specFolderArg = explicitTarget || payloadTarget;
   339	    if (!specFolderArg) {
   340	        throw new Error(`${mode} requires a target spec folder via an explicit CLI override or payload specFolder`);
   341	    }
   342	    return {
   343	        dataFile: null,
   344	        specFolderArg,
   345	        collectedData: {
   346	            ...payload,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '504,516p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   504	        core_1.CONFIG.SPEC_FOLDER_ARG = parsed.specFolderArg;
   505	        validateArguments();
   506	        await (0, workflow_1.runWorkflow)({
   507	            dataFile: parsed.collectedData ? undefined : core_1.CONFIG.DATA_FILE ?? undefined,
   508	            specFolderArg: core_1.CONFIG.SPEC_FOLDER_ARG ?? undefined,
   509	            collectedData: parsed.collectedData ?? undefined,
   510	            loadDataFn: parsed.collectedData
   511	                ? undefined
   512	                : () => (0, loaders_1.loadCollectedData)({}),
   513	            collectSessionDataFn: collect_session_data_1.collectSessionData,
   514	            sessionId: parsed.sessionId ?? undefined,
   515	        });
   516	    }

codex
I’ve got the core behavior mapped on both sides. I’m doing one more evidence pass through the Engram tests now, because the adoption risks hinge on the edge cases they codified: collisions, duplicate windows, session end on missing rows, and cross-project boundaries.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '60,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '1635,1750p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
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
  1666			_, _ = s.db.Exec("PRAGMA foreign_keys = ON")
  1667		}()
  1668	
  1669		res, err := s.db.Exec(
  1670			`INSERT INTO observations (session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
  1671			 VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, datetime('now'), datetime('now'))`,
  1672			"manual-save", "manual", "orphan", "orphan content", "engram", "project", hashNormalized("orphan content"),
  1673		)
  1674		if err != nil {
  1675			t.Fatalf("insert orphan observation: %v", err)
  1676		}
  1677		obsID, err := res.LastInsertId()
  1678		if err != nil {
  1679			t.Fatalf("last insert id: %v", err)
  1680		}
  1681	
  1682		timeline, err := s.Timeline(obsID, 1, 1)
  1683		if err != nil {
  1684			t.Fatalf("timeline: %v", err)
  1685		}
  1686		if timeline.SessionInfo != nil {
  1687			t.Fatalf("expected nil session info for missing session, got %+v", timeline.SessionInfo)
  1688		}
  1689		if timeline.TotalInRange != 1 {
  1690			t.Fatalf("expected total in range=1, got %d", timeline.TotalInRange)
  1691		}
  1692	}
  1693	
  1694	func TestQueryObservationsScanError(t *testing.T) {
  1695		s := newTestStore(t)
  1696	
  1697		if _, err := s.queryObservations("SELECT 1"); err == nil {
  1698			t.Fatalf("expected scan error for mismatched projection")
  1699		}
  1700	}
  1701	
  1702	func TestMigrationAndHelperEdgeBranches(t *testing.T) {
  1703		t.Run("migrate is idempotent with existing triggers", func(t *testing.T) {
  1704			s := newTestStore(t)
  1705			if err := s.migrate(); err != nil {
  1706				t.Fatalf("second migrate should succeed: %v", err)
  1707			}
  1708		})
  1709	
  1710		t.Run("legacy migrate skips table without id column", func(t *testing.T) {
  1711			s := newTestStore(t)
  1712	
  1713			if _, err := s.db.Exec(`
  1714				DROP TRIGGER IF EXISTS obs_fts_insert;
  1715				DROP TRIGGER IF EXISTS obs_fts_update;
  1716				DROP TRIGGER IF EXISTS obs_fts_delete;
  1717				DROP TABLE IF EXISTS observations_fts;
  1718				DROP TABLE observations;
  1719				CREATE TABLE observations (
  1720					session_id TEXT,
  1721					type TEXT,
  1722					title TEXT,
  1723					content TEXT
  1724				);
  1725			`); err != nil {
  1726				t.Fatalf("recreate observations without id: %v", err)
  1727			}
  1728	
  1729			if err := s.migrateLegacyObservationsTable(); err != nil {
  1730				t.Fatalf("legacy migrate should skip tables without id: %v", err)
  1731			}
  1732		})
  1733	
  1734		t.Run("topic helpers normalize edge cases", func(t *testing.T) {
  1735			if got := SuggestTopicKey("decision", "decision", ""); got != "decision/general" {
  1736				t.Fatalf("expected decision/general, got %q", got)
  1737			}
  1738			if got := SuggestTopicKey("bugfix", "bug-auth-panic", ""); got != "bug/auth-panic" {
  1739				t.Fatalf("expected bug/auth-panic, got %q", got)
  1740			}
  1741			if got := SuggestTopicKey("manual", "!!!", "..."); got != "topic/general" {
  1742				t.Fatalf("expected topic/general fallback, got %q", got)
  1743			}
  1744	
  1745			longSegment := normalizeTopicSegment(strings.Repeat("abc", 50))
  1746			if len(longSegment) != 100 {
  1747				t.Fatalf("expected topic segment truncation to 100, got %d", len(longSegment))
  1748			}
  1749	
  1750			longKey := normalizeTopicKey(strings.Repeat("k", 200))

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '2423,2538p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2423			if err := s.CreateSession("s-e", "engram", "/tmp/engram"); err != nil {
  2424				t.Fatalf("create session: %v", err)
  2425			}
  2426	
  2427			if _, err := s.AddObservation(AddObservationParams{SessionID: "s-e", Type: "note", Title: "top", Content: "x", Project: "engram", TopicKey: "x"}); err != nil {
  2428				t.Fatalf("seed topic observation: %v", err)
  2429			}
  2430			origExec := s.hooks.exec
  2431			s.hooks.exec = func(db execer, query string, args ...any) (sql.Result, error) {
  2432				if strings.Contains(query, "SET type = ?") {
  2433					return nil, errors.New("forced topic update error")
  2434				}
  2435				return origExec(db, query, args...)
  2436			}
  2437			if _, err := s.AddObservation(AddObservationParams{SessionID: "s-e", Type: "note", Title: "top", Content: "x", Project: "engram", TopicKey: "x"}); err == nil {
  2438				t.Fatalf("expected topic upsert exec error")
  2439			}
  2440	
  2441			s.hooks = defaultStoreHooks()
  2442			if _, err := s.AddObservation(AddObservationParams{SessionID: "s-e", Type: "note", Title: "dup", Content: "dup content", Project: "engram"}); err != nil {
  2443				t.Fatalf("seed dedupe observation: %v", err)
  2444			}
  2445			origExec = s.hooks.exec
  2446			s.hooks.exec = func(db execer, query string, args ...any) (sql.Result, error) {
  2447				if strings.Contains(query, "SET duplicate_count = duplicate_count + 1") {
  2448					return nil, errors.New("forced dedupe update error")
  2449				}
  2450				return origExec(db, query, args...)
  2451			}
  2452			if _, err := s.AddObservation(AddObservationParams{SessionID: "s-e", Type: "note", Title: "dup", Content: "dup content", Project: "engram"}); err == nil {
  2453				t.Fatalf("expected dedupe exec error")
  2454			}
  2455	
  2456			if err := s.Close(); err != nil {
  2457				t.Fatalf("close store: %v", err)
  2458			}
  2459			if _, err := s.AddObservation(AddObservationParams{SessionID: "s-e", Type: "note", Title: "x", Content: "y", Project: "engram", TopicKey: "t"}); err == nil {
  2460				t.Fatalf("expected topic query error on closed db")
  2461			}
  2462			if _, err := s.AddObservation(AddObservationParams{SessionID: "s-e", Type: "note", Title: "x", Content: "y", Project: "engram"}); err == nil {
  2463				t.Fatalf("expected dedupe query error on closed db")
  2464			}
  2465			if _, err := s.AddPrompt(AddPromptParams{SessionID: "s-e", Content: "x"}); err == nil {
  2466				t.Fatalf("expected add prompt error on closed db")
  2467			}
  2468		})
  2469	
  2470		t.Run("update observation remaining branches", func(t *testing.T) {
  2471			s := newTestStore(t)
  2472			if err := s.CreateSession("s-u", "engram", "/tmp/engram"); err != nil {
  2473				t.Fatalf("create session: %v", err)
  2474			}
  2475			id, err := s.AddObservation(AddObservationParams{SessionID: "s-u", Type: "old", Title: "t", Content: "c", Project: "engram", TopicKey: "topic/key"})
  2476			if err != nil {
  2477				t.Fatalf("seed observation: %v", err)
  2478			}
  2479	
  2480			if _, err := s.UpdateObservation(999999, UpdateObservationParams{}); err == nil {
  2481				t.Fatalf("expected update missing observation error")
  2482			}
  2483	
  2484			newType := "new-type"
  2485			longContent := strings.Repeat("z", s.cfg.MaxObservationLength+50)
  2486			if _, err := s.UpdateObservation(id, UpdateObservationParams{Type: &newType, Content: &longContent}); err != nil {
  2487				t.Fatalf("update with type+truncation: %v", err)
  2488			}
  2489	
  2490			origExec := s.hooks.exec
  2491			s.hooks.exec = func(db execer, query string, args ...any) (sql.Result, error) {
  2492				if strings.Contains(query, "UPDATE observations") {
  2493					return nil, errors.New("forced update exec error")
  2494				}
  2495				return origExec(db, query, args...)
  2496			}
  2497			if _, err := s.UpdateObservation(id, UpdateObservationParams{}); err == nil {
  2498				t.Fatalf("expected update exec error")
  2499			}
  2500		})
  2501	
  2502		t.Run("query iterator scan and rows.Err branches", func(t *testing.T) {
  2503			s := newTestStore(t)
  2504			origQueryIt := s.hooks.queryIt
  2505	
  2506			setScanErr := func(match string) {
  2507				s.hooks.queryIt = func(db queryer, query string, args ...any) (rowScanner, error) {
  2508					if strings.Contains(query, match) {
  2509						return &fakeRows{next: []bool{true, false}, scanErr: errors.New("forced scan error")}, nil
  2510					}
  2511					return origQueryIt(db, query, args...)
  2512				}
  2513			}
  2514	
  2515			setRowsErr := func(match string) {
  2516				s.hooks.queryIt = func(db queryer, query string, args ...any) (rowScanner, error) {
  2517					if strings.Contains(query, match) {
  2518						return &fakeRows{next: []bool{false}, err: errors.New("forced rows err")}, nil
  2519					}
  2520					return origQueryIt(db, query, args...)
  2521				}
  2522			}
  2523	
  2524			if err := s.CreateSession("s-iter", "engram", "/tmp/engram"); err != nil {
  2525				t.Fatalf("create session: %v", err)
  2526			}
  2527			if _, err := s.AddObservation(AddObservationParams{SessionID: "s-iter", Type: "note", Title: "one", Content: "one", Project: "engram"}); err != nil {
  2528				t.Fatalf("add observation: %v", err)
  2529			}
  2530			if _, err := s.AddPrompt(AddPromptParams{SessionID: "s-iter", Content: "prompt", Project: "engram"}); err != nil {
  2531				t.Fatalf("add prompt: %v", err)
  2532			}
  2533	
  2534			setScanErr("FROM sessions s")
  2535			if _, err := s.RecentSessions("", 10); err == nil {
  2536				t.Fatalf("expected recent sessions scan error")
  2537			}
  2538	

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '2859,2956p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2859		if err := s.CreateSession("sess-upsert", "", ""); err != nil {
  2860			t.Fatalf("create session: %v", err)
  2861		}
  2862	
  2863		// Second call with real project/directory should fill in the blanks.
  2864		// Project names are normalized to lowercase, so "projectA" becomes "projecta".
  2865		if err := s.CreateSession("sess-upsert", "projectA", "/tmp/a"); err != nil {
  2866			t.Fatalf("upsert session: %v", err)
  2867		}
  2868	
  2869		sess, err := s.GetSession("sess-upsert")
  2870		if err != nil {
  2871			t.Fatalf("get session: %v", err)
  2872		}
  2873		if sess.Project != "projecta" {
  2874			t.Fatalf("expected project=projecta after upsert (normalized), got %q", sess.Project)
  2875		}
  2876		if sess.Directory != "/tmp/a" {
  2877			t.Fatalf("expected directory=/tmp/a after upsert, got %q", sess.Directory)
  2878		}
  2879	}
  2880	
  2881	func TestCreateSessionDoesNotOverwriteExistingProject(t *testing.T) {
  2882		s := newTestStore(t)
  2883	
  2884		// Create session with project A (normalized to "projecta")
  2885		if err := s.CreateSession("sess-preserve", "projectA", "/tmp/a"); err != nil {
  2886			t.Fatalf("create session: %v", err)
  2887		}
  2888	
  2889		// Second call with project B should NOT overwrite
  2890		if err := s.CreateSession("sess-preserve", "projectB", "/tmp/b"); err != nil {
  2891			t.Fatalf("upsert session: %v", err)
  2892		}
  2893	
  2894		sess, err := s.GetSession("sess-preserve")
  2895		if err != nil {
  2896			t.Fatalf("get session: %v", err)
  2897		}
  2898		// Project names are normalized to lowercase, so "projectA" is stored as "projecta"
  2899		if sess.Project != "projecta" {
  2900			t.Fatalf("expected project=projecta (preserved, normalized), got %q", sess.Project)
  2901		}
  2902		if sess.Directory != "/tmp/a" {
  2903			t.Fatalf("expected directory=/tmp/a (preserved), got %q", sess.Directory)
  2904		}
  2905	}
  2906	
  2907	func TestCreateSessionPartialUpsert(t *testing.T) {
  2908		s := newTestStore(t)
  2909	
  2910		t.Run("fills directory when project already set", func(t *testing.T) {
  2911			if err := s.CreateSession("sess-partial-1", "myproject", ""); err != nil {
  2912				t.Fatalf("create: %v", err)
  2913			}
  2914			// Second call fills directory but project stays
  2915			if err := s.CreateSession("sess-partial-1", "other", "/new/dir"); err != nil {
  2916				t.Fatalf("upsert: %v", err)
  2917			}
  2918			sess, err := s.GetSession("sess-partial-1")
  2919			if err != nil {
  2920				t.Fatalf("get: %v", err)
  2921			}
  2922			if sess.Project != "myproject" {
  2923				t.Fatalf("project should be preserved, got %q", sess.Project)
  2924			}
  2925			if sess.Directory != "/new/dir" {
  2926				t.Fatalf("directory should be filled, got %q", sess.Directory)
  2927			}
  2928		})
  2929	
  2930		t.Run("fills project when directory already set", func(t *testing.T) {
  2931			if err := s.CreateSession("sess-partial-2", "", "/existing/dir"); err != nil {
  2932				t.Fatalf("create: %v", err)
  2933			}
  2934			if err := s.CreateSession("sess-partial-2", "newproject", ""); err != nil {
  2935				t.Fatalf("upsert: %v", err)
  2936			}
  2937			sess, err := s.GetSession("sess-partial-2")
  2938			if err != nil {
  2939				t.Fatalf("get: %v", err)
  2940			}
  2941			if sess.Project != "newproject" {
  2942				t.Fatalf("project should be filled, got %q", sess.Project)
  2943			}
  2944			if sess.Directory != "/existing/dir" {
  2945				t.Fatalf("directory should be preserved, got %q", sess.Directory)
  2946			}
  2947		})
  2948	
  2949		t.Run("both empty stays empty", func(t *testing.T) {
  2950			if err := s.CreateSession("sess-partial-3", "", ""); err != nil {
  2951				t.Fatalf("create: %v", err)
  2952			}
  2953			if err := s.CreateSession("sess-partial-3", "", ""); err != nil {
  2954				t.Fatalf("upsert: %v", err)
  2955			}
  2956			sess, err := s.GetSession("sess-partial-3")

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '748,790p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   748	  if (bm25Index.isBm25Enabled()) channels.push('bm25');
   749	  if (isGraphUnifiedEnabled()) channels.push('graph');
   750	  if (isDegreeBoostEnabled()) channels.push('degree');
   751	  const staleWarning = stats.staleCount > 10
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '452,468p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main -maxdepth 3 -type f | sort | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/.claude-plugin/marketplace.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/.github/PULL_REQUEST_TEMPLATE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/.github/dependabot.yml
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/.github/labels.yml
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/agent-save.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-dashboard.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-detail.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-recent.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-search.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/COMPARISON.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/INSTALLATION.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/intended-usage.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/go.mod
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/go.sum
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/setup.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/catalog.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/memory/.gitkeep
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/phase-research-prompt.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/.gitkeep
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-001.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-002.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-003.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-004.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-005.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-006.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-007.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-008.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-009.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-010.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-011.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-012.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-013.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-014.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-015.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-016.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-017.md

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-017.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
# Iteration 018: RISK ASSESSMENT

## Focus
RISK ASSESSMENT: What are the risks of adopting each recommended pattern? What could go wrong?

## Findings
### Finding 1: A static agent/admin profile split can drift faster than the tool surface it is trying to simplify
- **Source**: [external/internal/mcp/mcp.go:53](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L53), [external/internal/mcp/mcp.go:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L82), [external/internal/mcp/mcp.go:124](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L124), [context-server.ts:755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [context-server.ts:785](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L785)
- **What it does**: Engram hard-codes `ProfileAgent` and `ProfileAdmin`, then expands them through `ResolveTools()` and a core/deferred instruction block. Public instead centralizes guidance around key tools and recovery routing rather than profile-gated registration.
- **Why it matters for us**: If we add profile splits in Public, the main failure mode is configuration drift: MCP schema, wrappers, startup guidance, and docs can disagree about which tools belong in which profile. Over-pruning also risks hiding legitimate research or remediation tools from advanced agents.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 2: Thread-key metadata is safer than Engram-style mutable upserts, because the upsert path can erase chronology
- **Source**: [external/internal/store/store.go:948](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L948), [external/internal/store/store.go:966](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L966), [external/internal/store/store.go:3201](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3201), [external/internal/store/store_test.go:1735](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go#L1735), [external/internal/store/store_test.go:2427](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go#L2427), [markdown-evidence-builder.ts:92](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts#L92)
- **What it does**: Engram infers a `family/segment` topic key, then overwrites the latest matching observation inside project+scope while only incrementing `revision_count`. Tests cover fallback keys like `decision/general` and update-path failures, but there is no preserved per-revision payload.
- **Why it matters for us**: Public can safely add optional `thread_key` metadata for grouping, but copying Engram’s overwrite semantics would make revision history harder to audit and easier to corrupt through heuristic collisions or truncated keys.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Exact thread-key shortcuts are useful, but dangerous inside Public’s broader hybrid retrieval stack
- **Source**: [external/internal/store/store.go:1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1462), [external/internal/store/store.go:1474](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1474), [external/internal/store/store.go:1518](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1518), [context-server.ts:756](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L756)
- **What it does**: If a query contains `/`, Engram performs a direct `topic_key = ?` lookup, assigns rank `-1000`, prepends those rows, and only then appends FTS5 results. Public advertises multi-channel retrieval, including graph-aware search, rather than a single exact-key fast lane.
- **Why it matters for us**: Importing this literally would let slash-shaped queries bypass better semantic or graph evidence and could turn metadata syntax into an accidental ranking override. In Public, exact thread-key search should be an explicit filter or small boost, not an unconditional top-rank shortcut.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Explicit session lifecycle tools would compete with Public’s trust-bound resume contract
- **Source**: [external/internal/mcp/mcp.go:515](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L515), [external/internal/mcp/mcp.go:1064](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1064), [external/internal/store/store.go:754](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L754), [external/internal/store/store.go:770](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L770), [external/internal/store/store_test.go:1639](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go#L1639), [external/internal/store/store_test.go:2859](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go#L2859), [session-manager.ts:385](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L385), [memory-context.ts:1229](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1229), [session-bootstrap.ts:163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163)
- **What it does**: Engram exposes `mem_session_start` and `mem_session_end`, while `CreateSession()` supports partial upserts and `EndSession()` is a no-op for missing IDs. Public instead validates caller-supplied session IDs against server-managed identity before allowing resume behavior.
- **Why it matters for us**: A new start/end API in Public could create two competing authorities for session state: explicit tool calls and trusted bootstrap/resume flows. If they diverge, recovery gets harder, not easier.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 5: Passive capture’s biggest risk is not duplication, but turning low-confidence prose into durable memory
- **Source**: [external/internal/mcp/mcp.go:565](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L565), [external/internal/store/store.go:3411](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3411), [external/internal/store/store.go:3483](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3483), [generate-context.js:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85), [generate-context.js:338](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L338), [markdown-evidence-builder.ts:104](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts#L104)
- **What it does**: Engram extracts only the last matching “Key Learnings” section, accepts numbered/bulleted items above minimum thresholds, and saves them as `passive` observations with a truncated title and source tag. Public’s primary save path is JSON-first, spec-folder-bound, and later parsed back into structured evidence.
- **Why it matters for us**: If we add passive capture, the main failure mode is provenance dilution: summaries, guesses, or agent boilerplate can become durable memory without the stronger evidence framing that `generate-context.js` expects. This should be a side lane with explicit provenance and reviewability, not a shortcut around structured saves.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 6: The single most dangerous thing to copy from Engram is its permissive session auto-create behavior
- **Source**: [external/internal/mcp/mcp.go:728](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L728), [external/internal/mcp/mcp.go:867](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L867), [external/internal/mcp/mcp.go:1046](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1046), [external/internal/mcp/mcp.go:1114](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1114), [session-manager.ts:401](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L401), [memory-context.ts:1229](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1229), [session-resume.ts:479](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L479)
- **What it does**: `mem_save`, `mem_save_prompt`, and `mem_session_summary` call `CreateSession()` without checking the error, while passive capture creates a default session only when missing. Public instead rejects untrusted session reuse and keeps bootstrap/resume authoritative.
- **Why it matters for us**: Relaxing Public to this model would make session poisoning and orphaned continuity much more likely, especially once session identity also gates dedup, working memory, and recovery. This is the easiest place to regress startup trust.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/store/store_test.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [markdown-evidence-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- [iteration-017.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-017.md)

## Assessment
- New information ratio: 0.62
- Questions addressed: Q1, Q2, Q3, Q4, Q5, Q6, Q9, Q10
- Questions answered: Q1, Q2, Q3, Q4, Q5, Q6, Q9, Q10

## Reflection
- What worked: tracing from Engram tool registration into store behavior and then validating edge cases in `store_test.go` made the risk calls much firmer than architecture prose; comparing those paths directly to Public’s trusted-session and bootstrap handlers exposed where adoption would create authority conflicts.
- What did not work: CocoIndex cancelled again on both the Go subtree and the Public handlers, so this pass relied on `rg` plus direct reads; the exact strict validator command ended with `RESULT: PASSED` but still emitted `cannot create temp file for here document: Operation not permitted`; the phase folder still appears to be missing the requested Level 3 spec docs, so this iteration stayed read-only and report-only.

## Recommended Next Focus
Cross-check phases 003 and 004 specifically for safer designs around exact-key retrieval and lightweight ingestion, then sketch a Public MVP that keeps: metadata-only `thread_key`, explicit opt-in exact lookup, passive capture behind structured provenance, and strict preservation of `session_bootstrap` as the recovery authority.


hook: Stop
hook: Stop Completed
tokens used
121,220
# Iteration 018: RISK ASSESSMENT

## Focus
RISK ASSESSMENT: What are the risks of adopting each recommended pattern? What could go wrong?

## Findings
### Finding 1: A static agent/admin profile split can drift faster than the tool surface it is trying to simplify
- **Source**: [external/internal/mcp/mcp.go:53](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L53), [external/internal/mcp/mcp.go:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L82), [external/internal/mcp/mcp.go:124](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L124), [context-server.ts:755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [context-server.ts:785](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L785)
- **What it does**: Engram hard-codes `ProfileAgent` and `ProfileAdmin`, then expands them through `ResolveTools()` and a core/deferred instruction block. Public instead centralizes guidance around key tools and recovery routing rather than profile-gated registration.
- **Why it matters for us**: If we add profile splits in Public, the main failure mode is configuration drift: MCP schema, wrappers, startup guidance, and docs can disagree about which tools belong in which profile. Over-pruning also risks hiding legitimate research or remediation tools from advanced agents.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 2: Thread-key metadata is safer than Engram-style mutable upserts, because the upsert path can erase chronology
- **Source**: [external/internal/store/store.go:948](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L948), [external/internal/store/store.go:966](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L966), [external/internal/store/store.go:3201](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3201), [external/internal/store/store_test.go:1735](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go#L1735), [external/internal/store/store_test.go:2427](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go#L2427), [markdown-evidence-builder.ts:92](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts#L92)
- **What it does**: Engram infers a `family/segment` topic key, then overwrites the latest matching observation inside project+scope while only incrementing `revision_count`. Tests cover fallback keys like `decision/general` and update-path failures, but there is no preserved per-revision payload.
- **Why it matters for us**: Public can safely add optional `thread_key` metadata for grouping, but copying Engram’s overwrite semantics would make revision history harder to audit and easier to corrupt through heuristic collisions or truncated keys.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Exact thread-key shortcuts are useful, but dangerous inside Public’s broader hybrid retrieval stack
- **Source**: [external/internal/store/store.go:1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1462), [external/internal/store/store.go:1474](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1474), [external/internal/store/store.go:1518](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1518), [context-server.ts:756](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L756)
- **What it does**: If a query contains `/`, Engram performs a direct `topic_key = ?` lookup, assigns rank `-1000`, prepends those rows, and only then appends FTS5 results. Public advertises multi-channel retrieval, including graph-aware search, rather than a single exact-key fast lane.
- **Why it matters for us**: Importing this literally would let slash-shaped queries bypass better semantic or graph evidence and could turn metadata syntax into an accidental ranking override. In Public, exact thread-key search should be an explicit filter or small boost, not an unconditional top-rank shortcut.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Explicit session lifecycle tools would compete with Public’s trust-bound resume contract
- **Source**: [external/internal/mcp/mcp.go:515](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L515), [external/internal/mcp/mcp.go:1064](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1064), [external/internal/store/store.go:754](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L754), [external/internal/store/store.go:770](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L770), [external/internal/store/store_test.go:1639](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go#L1639), [external/internal/store/store_test.go:2859](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go#L2859), [session-manager.ts:385](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L385), [memory-context.ts:1229](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1229), [session-bootstrap.ts:163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163)
- **What it does**: Engram exposes `mem_session_start` and `mem_session_end`, while `CreateSession()` supports partial upserts and `EndSession()` is a no-op for missing IDs. Public instead validates caller-supplied session IDs against server-managed identity before allowing resume behavior.
- **Why it matters for us**: A new start/end API in Public could create two competing authorities for session state: explicit tool calls and trusted bootstrap/resume flows. If they diverge, recovery gets harder, not easier.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 5: Passive capture’s biggest risk is not duplication, but turning low-confidence prose into durable memory
- **Source**: [external/internal/mcp/mcp.go:565](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L565), [external/internal/store/store.go:3411](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3411), [external/internal/store/store.go:3483](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3483), [generate-context.js:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85), [generate-context.js:338](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L338), [markdown-evidence-builder.ts:104](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts#L104)
- **What it does**: Engram extracts only the last matching “Key Learnings” section, accepts numbered/bulleted items above minimum thresholds, and saves them as `passive` observations with a truncated title and source tag. Public’s primary save path is JSON-first, spec-folder-bound, and later parsed back into structured evidence.
- **Why it matters for us**: If we add passive capture, the main failure mode is provenance dilution: summaries, guesses, or agent boilerplate can become durable memory without the stronger evidence framing that `generate-context.js` expects. This should be a side lane with explicit provenance and reviewability, not a shortcut around structured saves.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 6: The single most dangerous thing to copy from Engram is its permissive session auto-create behavior
- **Source**: [external/internal/mcp/mcp.go:728](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L728), [external/internal/mcp/mcp.go:867](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L867), [external/internal/mcp/mcp.go:1046](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1046), [external/internal/mcp/mcp.go:1114](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1114), [session-manager.ts:401](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L401), [memory-context.ts:1229](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1229), [session-resume.ts:479](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L479)
- **What it does**: `mem_save`, `mem_save_prompt`, and `mem_session_summary` call `CreateSession()` without checking the error, while passive capture creates a default session only when missing. Public instead rejects untrusted session reuse and keeps bootstrap/resume authoritative.
- **Why it matters for us**: Relaxing Public to this model would make session poisoning and orphaned continuity much more likely, especially once session identity also gates dedup, working memory, and recovery. This is the easiest place to regress startup trust.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/store/store_test.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [markdown-evidence-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- [iteration-017.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-017.md)

## Assessment
- New information ratio: 0.62
- Questions addressed: Q1, Q2, Q3, Q4, Q5, Q6, Q9, Q10
- Questions answered: Q1, Q2, Q3, Q4, Q5, Q6, Q9, Q10

## Reflection
- What worked: tracing from Engram tool registration into store behavior and then validating edge cases in `store_test.go` made the risk calls much firmer than architecture prose; comparing those paths directly to Public’s trusted-session and bootstrap handlers exposed where adoption would create authority conflicts.
- What did not work: CocoIndex cancelled again on both the Go subtree and the Public handlers, so this pass relied on `rg` plus direct reads; the exact strict validator command ended with `RESULT: PASSED` but still emitted `cannot create temp file for here document: Operation not permitted`; the phase folder still appears to be missing the requested Level 3 spec docs, so this iteration stayed read-only and report-only.

## Recommended Next Focus
Cross-check phases 003 and 004 specifically for safer designs around exact-key retrieval and lightweight ingestion, then sketch a Public MVP that keeps: metadata-only `thread_key`, explicit opt-in exact lookup, passive capture behind structured provenance, and strict preservation of `session_bootstrap` as the recovery authority.
