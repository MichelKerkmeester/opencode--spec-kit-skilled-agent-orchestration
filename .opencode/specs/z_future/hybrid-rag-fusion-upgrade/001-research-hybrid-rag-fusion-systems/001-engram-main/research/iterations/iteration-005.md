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
I’m treating this as a read-only research pass on Engram’s search internals, with the comparison anchored against our current Spec Kit Memory stack. I’ll start by loading the governing instructions and the most relevant memory/context pointers, then trace the search code paths in `internal/mcp/` and `internal/store/` before I synthesize new findings for iteration 005.
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
/bin/zsh -lc 'rg -n "engram|hybrid-rag-fusion|search ranking|FTS5|topic_key|mem_search" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
1069:## Task 7: Verify and harden FTS5 ablation integrity (alignment guard + evaluation mode + parent-id normalization)
1087:- when user requested ablation verification, run `eval_run_ablation({ mode:"ablation", includeFormattedReport:true, storeResults:true })` through Codex MCP before declaring FTS5 outcomes [Task 7]
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

codex
I’ve loaded the repo and external instructions, and the next step is to trace the actual search code rather than the docs: FTS schema, `Search()`, term sanitization, topic-key shortcuts, and the MCP search handler wiring. I’m also going to check our own retrieval stack in parallel so the comparison stays concrete instead of drifting into generic “FTS vs vector” commentary.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | rg -n \"Search\\(|sanitizeFTS|topic_key|observations_fts|prompts_fts|bm25|rank|MATCH|duplicate_count|revision_count|deleted_at\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
48:    48		TopicKey       *string `json:"topic_key,omitempty"`
49:    49		RevisionCount  int     `json:"revision_count"`
50:    50		DuplicateCount int     `json:"duplicate_count"`
54:    54		DeletedAt      *string `json:"deleted_at,omitempty"`
59:    59		Rank float64 `json:"rank"`
87:    87		TopicKey       *string `json:"topic_key,omitempty"`
88:    88		RevisionCount  int     `json:"revision_count"`
89:    89		DuplicateCount int     `json:"duplicate_count"`
93:    93		DeletedAt      *string `json:"deleted_at,omitempty"`
120:   120		TopicKey  string `json:"topic_key,omitempty"`
129:   129		TopicKey *string `json:"topic_key,omitempty"`
217:   217		TopicKey   *string `json:"topic_key,omitempty"`
219:   219		DeletedAt  *string `json:"deleted_at,omitempty"`
460:   460				topic_key  TEXT,
462:   462				revision_count INTEGER NOT NULL DEFAULT 1,
463:   463				duplicate_count INTEGER NOT NULL DEFAULT 1,
467:   467				deleted_at TEXT,
476:   476			CREATE VIRTUAL TABLE IF NOT EXISTS observations_fts USING fts5(
482:   482				topic_key,
501:   501			CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
550:   550			{name: "topic_key", definition: "TEXT"},
552:   552			{name: "revision_count", definition: "INTEGER NOT NULL DEFAULT 1"},
553:   553			{name: "duplicate_count", definition: "INTEGER NOT NULL DEFAULT 1"},
556:   556			{name: "deleted_at", definition: "TEXT"},
575:   575			CREATE INDEX IF NOT EXISTS idx_obs_topic ON observations(topic_key, project, scope, updated_at DESC);
576:   576			CREATE INDEX IF NOT EXISTS idx_obs_deleted ON observations(deleted_at);
610:   610		if _, err := s.execHook(s.db, `UPDATE observations SET topic_key = NULL WHERE topic_key = ''`); err != nil {
613:   613		if _, err := s.execHook(s.db, `UPDATE observations SET revision_count = 1 WHERE revision_count IS NULL OR revision_count < 1`); err != nil {
616:   616		if _, err := s.execHook(s.db, `UPDATE observations SET duplicate_count = 1 WHERE duplicate_count IS NULL OR duplicate_count < 1`); err != nil {
645:   645					INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
646:   646					VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
650:   650					INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
651:   651					VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
655:   655					INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
656:   656					VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
657:   657					INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
658:   658					VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
679:   679					INSERT INTO prompts_fts(rowid, content, project)
684:   684					INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
689:   689					INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
691:   691					INSERT INTO prompts_fts(rowid, content, project)
705:   705		err := s.db.QueryRow("SELECT COUNT(*) FROM pragma_table_xinfo('observations_fts') WHERE name = 'topic_key'").Scan(&colCount)
714:   714			DROP TABLE IF EXISTS observations_fts;
715:   715			CREATE VIRTUAL TABLE observations_fts USING fts5(
721:   721				topic_key,
725:   725			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
726:   726			SELECT id, title, content, tool_name, type, project, topic_key
728:   728			WHERE deleted_at IS NULL;
731:   731				INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
732:   732				VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
736:   736				INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
737:   737				VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
741:   741				INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
742:   742				VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
743:   743				INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
744:   744				VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
747:   747			return fmt.Errorf("migrate fts topic_key: %w", err)
830:   830			LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
870:   870			LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
908:   908			       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
910:   910			WHERE o.deleted_at IS NULL
937:   937			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
939:   939			WHERE session_id = ? AND deleted_at IS NULL
970:   970					 WHERE topic_key = ?
973:   973					   AND deleted_at IS NULL
985:   985						     topic_key = ?,
987:   987						     revision_count = revision_count + 1,
1022:  1022				   AND deleted_at IS NULL
1031:  1031					 SET duplicate_count = duplicate_count + 1,
1052:  1052				`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
1086:  1086			       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
1088:  1088			WHERE o.deleted_at IS NULL
1186:  1186		ftsQuery := sanitizeFTS(query)
1190:  1190			FROM prompts_fts fts
1192:  1192			WHERE prompts_fts MATCH ?
1201:  1201		sql += " ORDER BY fts.rank LIMIT ?"
1226:  1226			        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1227:  1227			 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
1284:  1284				     topic_key = ?,
1286:  1286				     revision_count = revision_count + 1,
1288:  1288				 WHERE id = ? AND deleted_at IS NULL`,
1331:  1331					 SET deleted_at = datetime('now'),
1333:  1333					 WHERE id = ? AND deleted_at IS NULL`,
1338:  1338				if err := tx.QueryRow(`SELECT deleted_at FROM observations WHERE id = ?`, id).Scan(&deletedAt); err != nil {
1384:  1384			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1386:  1386			WHERE session_id = ? AND id < ? AND deleted_at IS NULL
1418:  1418			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1420:  1420			WHERE session_id = ? AND id > ? AND deleted_at IS NULL
1448:  1448			"SELECT COUNT(*) FROM observations WHERE session_id = ? AND deleted_at IS NULL", focus.SessionID,
1462:  1462	func (s *Store) Search(query string, opts SearchOptions) ([]SearchResult, error) {
1478:  1478				       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1480:  1480				WHERE topic_key = ? AND deleted_at IS NULL
1519:  1519		ftsQuery := sanitizeFTS(query)
1523:  1523			       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at,
1524:  1524			       fts.rank
1525:  1525			FROM observations_fts fts
1527:  1527			WHERE observations_fts MATCH ? AND o.deleted_at IS NULL
1546:  1546		sqlQ += " ORDER BY fts.rank LIMIT ?"
1592:  1592		s.db.QueryRow("SELECT COUNT(*) FROM observations WHERE deleted_at IS NULL").Scan(&stats.TotalObservations)
1595:  1595		rows, err := s.queryItHook(s.db, "SELECT project FROM observations WHERE project IS NOT NULL AND deleted_at IS NULL GROUP BY project ORDER BY MAX(created_at) DESC")
1699:  1699			        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1769:  1769				`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
2124:  2124			        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2125:  2125			 FROM observations WHERE sync_id = ? AND deleted_at IS NULL ORDER BY id DESC LIMIT 1`,
2290:  2290			 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
2325:  2325			 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
2439:  2439			`SELECT COUNT(*) FROM observations WHERE project = ? AND deleted_at IS NULL`,
2697:  2697			SELECT sync_id, session_id, type, title, content, tool_name, project, scope, topic_key
2700:  2700			  AND deleted_at IS NULL
2846:  2846			        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2847:  2847			 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
2858:  2858			        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2861:  2861			query += ` AND deleted_at IS NULL`
2904:  2904				`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, updated_at, deleted_at)
2915:  2915			 SET session_id = ?, type = ?, title = ?, content = ?, tool_name = ?, project = ?, scope = ?, topic_key = ?, normalized_hash = ?, revision_count = revision_count + 1, updated_at = datetime('now'), deleted_at = NULL
2940:  2940			`UPDATE observations SET deleted_at = ?, updated_at = datetime('now') WHERE id = ?`,
3065:  3065				topic_key  TEXT,
3067:  3067				revision_count INTEGER NOT NULL DEFAULT 1,
3068:  3068				duplicate_count INTEGER NOT NULL DEFAULT 1,
3072:  3072				deleted_at TEXT,
3082:  3082				scope, topic_key, normalized_hash, revision_count, duplicate_count,
3083:  3083				last_seen_at, created_at, updated_at, deleted_at
3099:  3099				NULLIF(topic_key, ''),
3101:  3101				CASE WHEN revision_count IS NULL OR revision_count < 1 THEN 1 ELSE revision_count END,
3102:  3102				CASE WHEN duplicate_count IS NULL OR duplicate_count < 1 THEN 1 ELSE duplicate_count END,
3106:  3106				deleted_at
3125:  3125			DROP TABLE IF EXISTS observations_fts;
3126:  3126			CREATE VIRTUAL TABLE observations_fts USING fts5(
3132:  3132				topic_key,
3136:  3136			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
3137:  3137			SELECT id, title, content, tool_name, type, project, topic_key
3139:  3139			WHERE deleted_at IS NULL;
3382:  3382	// sanitizeFTS wraps each word in quotes so FTS5 doesn't choke on special chars.
3384:  3384	func sanitizeFTS(query string) string {
3504:  3504				   AND deleted_at IS NULL

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | rg -n \"mem_search|Search\\(|ProfileAgent|ProfileAdmin|ResolveTools|shouldRegister|register|mem_suggest_topic_key|mem_capture_passive|mem_context\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13:    13	//	engram mcp --tools=mem_save,mem_search → individual tool names
41:    41	//   mem_save, mem_search, mem_context, mem_session_summary,
43:    43	//   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
48:    48	// "all" (default) — every tool registered.
50:    50	// ProfileAgent contains the tool names that AI agents need.
53:    53	var ProfileAgent = map[string]bool{
55:    55		"mem_search":            true, // search past memories — referenced 6 times
56:    56		"mem_context":           true, // recent context from previous sessions — referenced 10 times
58:    58		"mem_session_start":     true, // register session start
61:    61		"mem_suggest_topic_key": true, // stable topic key for upserts — referenced 3 times
62:    62		"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
67:    67	// ProfileAdmin contains tools for TUI, dashboards, and manual curation
69:    69	var ProfileAdmin = map[string]bool{
78:    78		"agent": ProfileAgent,
79:    79		"admin": ProfileAdmin,
82:    82	// ResolveTools takes a comma-separated string of profile names and/or
83:    83	// individual tool names and returns the set of tool names to register.
84:    84	// An empty input means "all" — every tool is registered.
85:    85	func ResolveTools(input string) map[string]bool {
88:    88			return nil // nil means register everything
116:   116	// NewServer creates an MCP server with ALL tools registered (backwards compatible).
128:   128	  mem_search — find past work, decisions, or context from previous sessions
129:   129	  mem_context — get recent session history (call at session start or after compaction)
135:   135	  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
136:   136	  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
140:   140	// NewServerWithTools creates an MCP server registering only the tools in
141:   141	// the allowlist. If allowlist is nil, all tools are registered.
156:   156		registerTools(srv, s, cfg, allowlist)
160:   160	// shouldRegister returns true if the tool should be registered given the
162:   162	func shouldRegister(name string, allowlist map[string]bool) bool {
169:   169	func registerTools(srv *server.MCPServer, s *store.Store, cfg MCPConfig, allowlist map[string]bool) {
170:   170		// ─── mem_search (profile: agent, core — always in context) ─────────
171:   171		if shouldRegister("mem_search", allowlist) {
173:   173				mcp.NewTool("mem_search",
197:   197				handleSearch(s, cfg),
202:   202		if shouldRegister("mem_save", allowlist) {
265:   265		if shouldRegister("mem_update", allowlist) {
302:   302		// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
303:   303		if shouldRegister("mem_suggest_topic_key", allowlist) {
305:   305				mcp.NewTool("mem_suggest_topic_key",
328:   328		if shouldRegister("mem_delete", allowlist) {
351:   351		if shouldRegister("mem_save_prompt", allowlist) {
375:   375		// ─── mem_context (profile: agent, core — always in context) ────────
376:   376		if shouldRegister("mem_context", allowlist) {
378:   378				mcp.NewTool("mem_context",
400:   400		if shouldRegister("mem_stats", allowlist) {
416:   416		if shouldRegister("mem_timeline", allowlist) {
419:   419					mcp.WithDescription("Show chronological context around a specific observation. Use after mem_search to drill into the timeline of events surrounding a search result. This is the progressive disclosure pattern: search first, then timeline to understand context."),
428:   428						mcp.Description("The observation ID to center the timeline on (from mem_search results)"),
442:   442		if shouldRegister("mem_get_observation", allowlist) {
445:   445					mcp.WithDescription("Get the full content of a specific observation by ID. Use when you need the complete, untruncated content of an observation found via mem_search or mem_timeline."),
461:   461		if shouldRegister("mem_session_summary", allowlist) {
516:   516		if shouldRegister("mem_session_start", allowlist) {
543:   543		if shouldRegister("mem_session_end", allowlist) {
565:   565		// ─── mem_capture_passive (profile: agent, deferred) ─────────────────
566:   566		if shouldRegister("mem_capture_passive", allowlist) {
568:   568				mcp.NewTool("mem_capture_passive",
599:   599		if shouldRegister("mem_merge_projects", allowlist) {
625:   625	func handleSearch(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
640:   640			results, err := s.Search(query, store.SearchOptions{

exec
/bin/zsh -lc 'nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | rg -n "memory_search|vector|embedding|fts|bm25|rerank|query|intent|causal|session|dedup|rrf|hybrid"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
9:     9	import * as sessionManager from '../lib/session/session-manager.js';
10:    10	import * as intentClassifier from '../lib/search/intent-classifier.js';
49:    49	import { trackQueryAndDetect, logResultCited } from '../lib/feedback/query-flow-tracker.js';
69:    69	} from '../lib/search/session-transition.js';
85:    85	} from '../lib/search/sqlite-fts.js';
86:    86	import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
89:    89	  deduplicateResults as deduplicateWithSessionState,
93:    93	} from '../lib/search/session-state.js';
96:    96	import type { IntentType, IntentWeights as IntentClassifierWeights } from '../lib/search/intent-classifier.js';
100:   100	// Feature catalog: Semantic and lexical search (memory_search)
145:   145	  dedupStats: Record<string, unknown>;
177:   177	  query?: string;
194:   194	  sessionId?: string;
196:   196	  intent?: string;
200:   200	  rerank?: boolean;
208:   208	  mode?: string; // "deep" mode enables query expansion for multi-query RAG
210:   210	  sessionTransition?: SessionTransitionTrace;
324:   324	function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
325:   325	  const session = retrievalSessionStateManager.getOrCreate(sessionId);
327:   327	    activeGoal: session.activeGoal,
328:   328	    seenResultIds: Array.from(session.seenResultIds),
329:   329	    openQuestions: [...session.openQuestions],
330:   330	    preferredAnchors: [...session.preferredAnchors],
340:   340	    tool: 'memory_search',
450:   450	function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
451:   451	  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
454:   454	      dedupStats: { enabled: false, sessionId: null }
458:   458	  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
461:   461	    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
466:   466	    dedupStats: {
467:   467	      ...dedupStats,
468:   468	      sessionId
482:   482	/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
483:   483	 * @param args - Search arguments (query, concepts, mode, specFolder, etc.)
494:   494	    query,
511:   511	    sessionId,
513:   513	    intent: explicitIntent,
517:   517	    rerank = true, // Enable reranking by default for better result quality
527:   527	    sessionTransition,
533:   533	  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
538:   538	    sessionId: normalizedScope.sessionId ?? null,
544:   544	  const hasQuery = typeof query === 'string' && query.trim().length > 0;
547:   547	    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.' }) }] };
554:   554	        tool: 'memory_search',
566:   566	      tool: 'memory_search',
585:   585	  // BUG-007: Validate query first with proper error handling
587:   587	  if (query !== undefined) {
589:   589	      normalizedQuery = validateQuery(query);
594:   594	          tool: 'memory_search',
597:   597	          details: { parameter: 'query' },
599:   599	            hint: 'Provide a valid query string or use concepts array instead'
613:   613	      tool: 'memory_search',
614:   614	      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
616:   616	      details: { parameter: 'query' },
618:   618	        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
625:   625	      tool: 'memory_search',
635:   635	  // Eval logger — capture query at pipeline entry (fail-safe)
640:   640	      query: effectiveQuery,
641:   641	      intent: explicitIntent ?? null,
644:   644	    _evalQueryId = evalEntry.queryId;
656:   656	  let intentConfidence = 0;
657:   657	  let intentWeights: IntentWeights | null = null;
660:   660	    if (intentClassifier.isValidIntent(explicitIntent)) {
662:   662	      intentConfidence = 1.0;
663:   663	      intentWeights = intentClassifier.getIntentWeights(explicitIntent);
665:   665	      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
670:   670	    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery!);
671:   671	    detectedIntent = classification.intent;
672:   672	    intentConfidence = classification.confidence;
673:   673	    intentWeights = intentClassifier.getIntentWeights(classification.intent as IntentType);
678:   678	      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
684:   684	  if (detectedIntent && intentConfidence < INTENT_CONFIDENCE_FLOOR && !explicitIntent) {
685:   685	    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
687:   687	    intentConfidence = 1.0;
688:   688	    intentWeights = intentClassifier.getIntentWeights('understand' as IntentType);
696:   696	      const autoProfile = intentClassifier.getProfileForIntent(detectedIntent as IntentType);
706:   706	  // Re-run artifact routing with detected intent for fallback coverage
714:   714	    sessionId,
742:   742	    rerank,
744:   744	    sessionId,
751:   751	  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
763:   763	    // Wait for embedding model only on cache miss
773:   773	      query: effectiveQuery,
777:   777	        : 'hybrid',
795:   795	      rerank,
797:   797	      sessionId,
803:   803	      intentConfidence,
804:   804	      intentWeights: toIntentWeightsConfig(intentWeights),
886:   886	    if (sessionId && isSessionRetrievalStateEnabled()) {
889:   889	        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
892:   892	        retrievalSessionStateManager.setAnchors(sessionId, anchors);
895:   895	      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
929:   929	      extraData.intent = {
931:   931	        confidence: intentConfidence,
932:   932	        description: intentClassifier.getIntentDescription(detectedIntent as IntentType),
933:   933	        weightsApplied: pipelineResult.metadata.stage2.intentWeightsApplied,
952:   952	    if (pipelineResult.metadata.stage3.rerankApplied) {
953:   953	      extraData.rerankMetadata = {
954:   954	        reranking_enabled: true,
955:   955	        reranking_requested: true,
956:   956	        reranking_applied: true,
985:   985	      session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
986:   986	      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
1006:  1006	      normalizedQuery,   // REQ-D5-001/D5-004: pass query for recovery + confidence context
1044:  1044	      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
1054:  1054	  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
1062:  1062	      const deduped = deduplicateWithSessionState(existingResults, sessionId);
1063:  1063	      data.results = deduped.results as SessionAwareResult[];
1064:  1064	      data.count = deduped.results.length;
1065:  1065	      data.sessionDedup = deduped.metadata;
1071:  1071	  // Apply session deduplication AFTER cache
1072:  1072	  if (sessionId && enableDedup && sessionManager.isEnabled()) {
1079:  1079	        console.warn('[memory-search] Failed to parse cached response for dedup:', message);
1086:  1086	    // P1-018 — Validate response shape before dedup. If the cached response
1087:  1087	    // Doesn't have the expected data.results array, log a warning and skip dedup
1088:  1088	    // Rather than silently falling through to the un-deduped response.
1095:  1095	      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
1097:  1097	      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
1101:  1101	      const { results: dedupedResults } = applySessionDedup(
1103:  1103	        sessionId,
1108:  1108	      const dedupedCount = dedupedResults.length;
1109:  1109	      const filteredCount = originalCount - dedupedCount;
1116:  1116	      data.results = dedupedResults;
1117:  1117	      data.count = dedupedCount;
1119:  1119	      const dedupStats = {
1121:  1121	        sessionId,
1123:  1123	        returnedCount: dedupedCount,
1129:  1129	      resultsData.dedupStats = dedupStats;
1132:  1132	        (resultsData.meta as Record<string, unknown>).dedupStats = dedupStats;
1146:  1146	  if (sessionId && isSessionRetrievalStateEnabled()) {
1159:  1159	        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
1162:  1162	      data.sessionState = buildSessionStatePayload(sessionId);
1172:  1172	  if (includeTrace && sessionTransition) {
1173:  1173	    responseToReturn = attachSessionTransitionTrace(responseToReturn, sessionTransition);
1178:  1178	    retrievalTelemetry.recordTransitionDiagnostics(telemetry, sessionTransition);
1204:  1204	        query_text: effectiveQuery || null,
1205:  1205	        intent: detectedIntent,
1208:  1208	        session_id: sessionId ?? null,
1231:  1231	        queryId: _evalQueryId,
1234:  1234	        fusionMethod: 'rrf',
1241:  1241	          queryId: _evalQueryId,
1268:  1268	          const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
1272:  1272	            queryId,
1275:  1275	            sessionId: sessionId ?? null,
1284:  1284	  // Shadow-only: emits query_reformulated, same_topic_requery, and result_cited events.
1310:  1310	        const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
1312:  1312	        // Track query flow — detects reformulations and same-topic re-queries
1314:  1314	          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
1319:  1319	          logResultCited(db, sessionId ?? null, queryId, shownIds);
1323:  1323	  } catch (_error: unknown) { /* query flow tracking must never break search */ }
1326:  1326	  // Phase C: effectiveProfile includes auto-routed profile from intent detection.
1374:  1374	const handle_memory_search = handleMemorySearch;
1377:  1377	  handle_memory_search,

codex
I’ve confirmed the Engram search hotspots and the Public entrypoint, and now I’m drilling into the scoring logic itself: the exact SQL, term sanitization, and whether ranking is just bare FTS order or wrapped with extra shortcuts and fusion. I’m also tracing where our side actually combines vector, lexical, rerank, and session-aware adjustments so the recommendations stay honest about what we already do better.
exec
/bin/zsh -lc "sed -n '1450,1565p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

	return &TimelineResult{
		Focus:        *focus,
		Before:       beforeEntries,
		After:        afterEntries,
		SessionInfo:  session,
		TotalInRange: totalInRange,
	}, nil
}

// ─── Search (FTS5) ───────────────────────────────────────────────────────────

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
/bin/zsh -lc "sed -n '3380,3415p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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


exec
/bin/zsh -lc "sed -n '169,245p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '625,690p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'rg -n "rrf|reciprocal rank fusion|vector search|embedding|cross-encoder|rerank|sqlite-fts|bm25|lexical" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:59:/** Partial embedding provider metadata — see shared/types.ts ProviderMetadata for the full shape. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:9:import { getIndex, isBm25Enabled } from './bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:10:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:13:import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:15:import { fts5Bm25Search } from './sqlite-fts.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:26:import { rerankLocal } from './local-reranker.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:62:import type { MMRCandidate } from '@spec-kit/shared/algorithms/mmr-reranker';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:63:import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:71:  embedding: Float32Array | number[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:118:   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:147:    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:241:/** Minimum MMR candidates required for diversity reranking to be worthwhile. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:303: * Initialize hybrid search with database, vector search, and optional graph search dependencies.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:305: * @param vectorFn - Optional vector search function for semantic similarity.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:324: * @returns Array of BM25-scored results tagged with source 'bm25'.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:326:function bm25Search(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:331:    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:394:        source: 'bm25',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:462:    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:463:    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:466:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:468:    return bm25Results.map(row => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:494:  const bm25Results = bm25Search(query, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:505:  for (const r of bm25Results) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:685:    allowed.add('bm25');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:689:  if (options.useBm25 === false) allowed.delete('bm25');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:708:    useBm25: allowedChannels.has('bm25'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:772:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:784:  const primaryExecution = await collectAndFuseHybridResults(query, embedding, primaryOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:787:    : await hybridSearch(query, embedding, primaryOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:806:    const retryExecution = await collectAndFuseHybridResults(query, embedding, retryOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:809:      : await hybridSearch(query, embedding, retryOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:826:    const retryExecution = await collectAndFuseHybridResults(query, embedding, retryOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:829:      : await hybridSearch(query, embedding, retryOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:855:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:872:  if (useVector && embedding && vectorSearchFn) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:874:      const vectorResults = vectorSearchFn(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:903:    const bm25Results = bm25Search(query, { limit, specFolder });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:904:    results.push(...bm25Results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:979:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:982:  const execution = await collectAndFuseHybridResults(query, embedding, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:991:  return hybridSearch(query, embedding, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:996:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1010:    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1055:    let bm25ChannelResults: HybridSearchResult[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1062:    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1064:        const vectorResults = vectorSearchFn(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1079:          const embeddingCandidate = toEmbeddingBufferView(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1080:            (result as Record<string, unknown>).embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1081:            ?? (result as Record<string, unknown>).embeddingBuffer
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1083:          if (embeddingCandidate) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1084:            vectorEmbeddingCache.set(result.id, embeddingCandidate);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1099:        // flooding top-K with noisy lexical matches despite its exact-match value.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1104:    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1105:    if (activeChannels.has('bm25')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1106:      bm25ChannelResults = bm25Search(query, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1107:      if (bm25ChannelResults.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1108:        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1110:        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1184:      ...bm25ChannelResults,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1234:      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1384:  // C138/T316: MMR reranking with request-scoped embedding cache.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1385:  // Reuse embeddings already returned by the vector channel when present and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1387:  let reranked: HybridSearchResult[] = fusedHybridResults.slice(0, limit);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1389:  // P1-5: Optional local GGUF reranking path (RERANKER_LOCAL=true).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1390:  // Preserve cross-encoder gate semantics: when SPECKIT_CROSS_ENCODER=false, skip reranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1391:  if (isCrossEncoderEnabled() && isLocalRerankerEnabled() && reranked.length >= MMR_MIN_CANDIDATES) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1392:    const localReranked = await rerankLocal(query, reranked, limit);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1393:    if (localReranked !== reranked) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1394:      reranked = localReranked as HybridSearchResult[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1399:    const numericIds = reranked
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1405:        const embeddingMap = new Map<number, Float32Array>(vectorEmbeddingCache);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1406:        const missingIds = numericIds.filter((id) => !embeddingMap.has(id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1411:            `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1412:          ) as Database.Statement).all(...missingIds) as Array<{ rowid: number; embedding: Buffer }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1415:            if (Buffer.isBuffer(row.embedding)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1416:              embeddingMap.set(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1418:                new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1425:        for (const r of reranked) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1426:          const emb = embeddingMap.get(r.id as number);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1431:              embedding: emb,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1440:          // FIX #6: Same fix as stage3-rerank FIX #5 — MMR can only diversify
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1441:          // rows that have embeddings. Non-embedded rows (lexical-only hits,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1445:          const nonEmbeddedRows = reranked.filter(r => !embeddedIdSet.has(r.id as number));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1446:          const rerankedById = new Map<string, HybridSearchResult>(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1447:            reranked.map((result) => [canonicalResultId(result.id), result])
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1451:            const existing = rerankedById.get(canonicalResultId(candidate.id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1465:          reranked = [...diversifiedRows, ...nonEmbeddedRows];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1469:        console.warn(`[hybrid-search] MMR embedding retrieval failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1475:  const topIds = reranked
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1485:        for (const result of reranked) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1491:            if ('rrfScore' in result) (result as Record<string, unknown>).rrfScore = boostedScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1498:      reranked.sort((a, b) => ((b.score as number) ?? 0) - ((a.score as number) ?? 0));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1506:  if (db && isFolderScoringEnabled() && reranked.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1508:      const numericIds = reranked
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1515:          const folderScores = computeFolderRelevanceScores(reranked, folderMap);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1520:          const twoPhaseResults = twoPhaseRetrieval(reranked, folderScores, folderMap, topK);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1521:          const postFolderResults = twoPhaseResults.length > 0 ? twoPhaseResults : reranked;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1522:          reranked = enrichResultsWithFolderScores(postFolderResults, folderScores, folderMap) as HybridSearchResult[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1536:        reranked.map(r => ({ ...r, id: r.id, score: r.score })),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1540:        reranked = truncationResult.results.map(r => r as HybridSearchResult);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1562:  if (reranked.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1563:    reranked = reranked.map((row): HybridSearchResult => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1597:  if (isContextHeadersEnabled() && reranked.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1600:      reranked = reranked.map((row) => injectContextualTree(row, descriptionCache));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1607:    reranked = applyResultLimit(reranked, options.limit);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1612:      ? reranked.length * CONTEXT_HEADER_TOKEN_OVERHEAD
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1621:    const budgeted = truncateToBudget(reranked, adjustedBudget, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1625:    reranked = budgeted.results;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1630:  if (reranked.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1631:    reranked = reranked.map((row): HybridSearchResult => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1648:  if (s4shadowMeta !== undefined && reranked.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1649:    Object.defineProperty(reranked, '_s4shadow', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1656:  if (s4attributionMeta !== undefined && reranked.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1657:    Object.defineProperty(reranked, '_s4attribution', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1667:  if (Object.keys(s3meta).length > 0 && reranked.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1668:    Object.defineProperty(reranked, '_s3meta', { value: s3meta, enumerable: false, configurable: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1671:  return reranked;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1677: * reranking, or post-processing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1680: * @param embedding - Optional embedding vector for semantic search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1686:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1691:    embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1718:  if (allowedChannels.has('bm25')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1719:    const bm25Fallback = collectCandidatesFromLists(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1720:      [{ source: 'bm25', results: bm25Search(query, options) }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1723:    if (bm25Fallback.length > 0) return bm25Fallback;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1737: * @param embedding - Optional embedding vector for semantic search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1743:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1748:    return searchWithFallbackTiered(query, embedding, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1757:    embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1777:  if (allowedChannels.has('bm25')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1778:    const bm25Results = bm25Search(query, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1779:    if (bm25Results.length > 0) return bm25Results;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1791: * requiring embeddings or text similarity. Pure SQL fallback.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2014: * Prevents structural placeholders from outranking stronger semantic/lexical hits.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2115: * @param embedding - Optional embedding vector for semantic search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2121:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2125:  const { stages } = await executeFallbackPlan(query, embedding, options, 'tiered');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2282:    'combined_lexical_score',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2467:  bm25Search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:37:const set_embedding_model_ready = setEmbeddingModelReady;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:38:const is_embedding_model_ready = isEmbeddingModelReady;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:46:  set_embedding_model_ready,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:47:  is_embedding_model_ready,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:13://   - R-007: Post-reranker stage in scoring pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:9:// query, embeds it, then uses the pseudo-document embedding as an
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:30:import * as embeddings from '../providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:57:/** HyDE result including the pseudo-document and its embedding. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:62:  embedding: Float32Array;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:69:  rrfScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:128: *   intentAdjustedScore (not in BaselineResult) → rrfScore → score → similarity/100
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:156:  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:157:    return Math.max(0, Math.min(1, result.rrfScore));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:286: *   3. Embed the pseudo-document via the embeddings provider.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:287: *   4. Cache { pseudoDocument, embedding } with 1-hour TTL.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:293: *   - LLM or embedding call fails
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:316:  // Cache hit — return stored pseudo-document + embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:328:    const embeddingRaw = await embeddings.generateQueryEmbedding(pseudoDocument);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:329:    if (!embeddingRaw) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:334:    const embedding = embeddingRaw instanceof Float32Array
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:335:      ? embeddingRaw
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:336:      : Float32Array.from(embeddingRaw as number[]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:338:    const result: HyDEResult = { pseudoDocument, embedding };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:353: * Run a vector-only search using the HyDE pseudo-document embedding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:361: * @param embedding - The pseudo-document embedding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:367:  embedding: Float32Array,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:371:  return vectorIndex.vectorSearch(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:412:    const candidates = vectorOnly(hydeResult.embedding, limit, specFolder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:5:// from concrete sub-modules (./dedup, ./embedding-pipeline, etc.).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:32:export type { EmbeddingResult } from './embedding-pipeline.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:36:} from './embedding-pipeline.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:8:import * as bm25Index from '../../lib/search/bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:146:  embedding: Float32Array | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:147:  embeddingFailureReason: string | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:151:  if (!embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:164:  const persistedEmbeddingFailureReason = sanitizeEmbeddingFailureMessage(embeddingFailureReason);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:180:    const memory_id: number = embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:187:          embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:231:    if (embedding && peDecision.action === predictionErrorGate.ACTION.CREATE_LINKED && peDecision.existingMemoryId != null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:265:    if (bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:267:        const bm25 = bm25Index.getIndex();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:268:        bm25.addDocument(String(memory_id), bm25Index.buildBm25DocumentText({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:274:      } catch (bm25_err: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:275:        const message = toErrorMessage(bm25_err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:276:        console.warn(embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:8:/** Supported embedding input shapes for vector search and mutation operations. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:47:  embedding_model?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:48:  embedding_generated_at?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:49:  embedding_status?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:107:  embedding: EmbeddingInput;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:123:  embedding?: EmbeddingInput;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:132:/** Controls vector search filtering and ranking behavior. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:168: * Converts an embedding vector into a binary buffer for sqlite-vec storage.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:169: * @param embedding - The embedding values to serialize.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:170: * @returns A binary buffer representing the embedding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:172:export function to_embedding_buffer(embedding: EmbeddingInput): Buffer {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:173:  if (embedding instanceof Float32Array) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:174:    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:176:  return Buffer.from(new Float32Array(embedding).buffer);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:7:import * as embeddings from '../../lib/providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:12:import { computeContentHash, lookupEmbedding, storeEmbedding } from '../../lib/cache/embedding-cache.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:18:// Feature catalog: Deferred lexical-only indexing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:23:  embedding: Float32Array | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:29:    embeddingBuffer: Buffer;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:125:  let embedding: Float32Array | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:126:  let embeddingStatus: 'success' | 'pending' = 'pending';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:127:  let embeddingFailureReason: string | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:128:  const modelId = embeddings.getModelName();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:129:  const embeddingDim = embeddings.getEmbeddingDimension();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:133:    const cachedBuf = lookupEmbedding(database, cacheKey, modelId, embeddingDim);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:135:      embedding = new Float32Array(new Uint8Array(cachedBuf).buffer);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:136:      embeddingStatus = 'success';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:139:      embeddingFailureReason = sanitizeEmbeddingFailureMessage('Deferred: async_embedding requested');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:140:      console.error(`[memory-save] T306: Async embedding mode - deferring embedding for ${path.basename(filePath)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:144:      // Check persistent embedding cache before calling provider
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:145:      const cachedBuf = lookupEmbedding(database, cacheKey, modelId, embeddingDim);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:148:        embedding = new Float32Array(new Uint8Array(cachedBuf).buffer);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:149:        embeddingStatus = 'success';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:152:        // Cache miss: normalize content then generate embedding via provider
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:153:        // S1: strip structural noise (frontmatter, anchors, HTML comments) before embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:154:        const weightedInput = embeddings.buildWeightedDocumentText(buildParsedMemoryWeightedSections(parsed));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:155:        embedding = await embeddings.generateDocumentEmbedding(weightedInput);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:156:        if (embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:157:          embeddingStatus = 'success';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:158:          const embBuf = Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:161:            embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:162:            status: embeddingStatus,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:163:            failureReason: embeddingFailureReason,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:167:              embeddingBuffer: embBuf,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:168:              dimensions: embedding.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:172:          embeddingFailureReason = sanitizeEmbeddingFailureMessage('Embedding generation returned null');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:173:          console.warn(`[memory-save] Embedding failed for ${path.basename(filePath)}: ${embeddingFailureReason}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:176:    } catch (embedding_error: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:178:      embeddingFailureReason = sanitizeAndLogEmbeddingFailure(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:180:        embedding_error,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:187:    embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:188:    status: embeddingStatus,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:189:    failureReason: embeddingFailureReason,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:206:    pendingCacheWrite.embeddingBuffer,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:64:  embeddingStatus?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:65:  embeddingFailureReason?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:120:  embeddingStatus?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:130:  asyncEmbedding?: boolean; // When true, embedding generation is deferred (non-blocking)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:153:  embedding_status?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:40:| `embedding-pipeline.ts`     | Embedding generation with persistent cache. Cache keys hash normalized content, matching the main and chunked embedding paths. Checks the embedding cache first, falls back to the provider, and stores new embeddings for future re-index. Async/deferred mode is opt-in. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:54:2. embedding      -- Generate or retrieve cached embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:69:- **Deferred Indexing** -- When embedding generation fails or async mode is explicitly requested, the memory is stored with `embedding_status = 'pending'` and remains searchable via BM25/FTS5. Normal watcher/ingest reindex cache misses still run the eager provider path.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:84:- `../../lib/search/bm25-index.ts` -- BM25 full-text index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:85:- `../../lib/providers/embeddings.ts` -- embedding provider interface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:16:  rrfScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:124:  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:125:    return result.rrfScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:174:          rrfScore: finalScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:8:import * as embeddings from '../../lib/providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:9:import * as bm25Index from '../../lib/search/bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:143:    const bm25 = bm25Index.getIndex();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:144:    const documentText = bm25Index.buildBm25DocumentText({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:151:    bm25.removeDocument(String(args.memoryId));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:152:    bm25.addDocument(String(args.memoryId), documentText);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:170:  embedding: Float32Array | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:179:  if (!force && isReconsolidationFlagEnabled() && embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:194:            embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:250:                  embedding: memory.embedding as Float32Array,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:275:                if (bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:277:                    const bm25 = bm25Index.getIndex();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:278:                    bm25.addDocument(String(id), bm25Index.buildBm25DocumentText({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:284:                  } catch (bm25Err: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:285:                    const message = toErrorMessage(bm25Err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:287:                    const bm25Warning = repairBm25Document({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:295:                    if (bm25Warning) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:296:                      reconWarnings.push(bm25Warning);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:309:              return embeddings.generateDocumentEmbedding(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:367:  // Runs independently of the TM-06 flag.  Requires embedding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:373:  if (!force && isAssistiveReconsolidationEnabled() && embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:375:      // Find the top similar memory using the existing vector search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:376:      const searchEmb = embedding instanceof Float32Array ? embedding : new Float32Array(embedding as number[]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:406:            if (bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:407:              bm25Index.getIndex().removeDocument(String(topId));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:151: * @param rrfScores - Array of Reciprocal Rank Fusion scores (any length).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:154:export function detectEvidenceGap(rrfScores: number[]): TRMResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:155:  if (rrfScores.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:159:  const finiteScores = rrfScores.filter((score) => Number.isFinite(score));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:39:  embedding_status: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:95:    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:220:  const existingStatus = existing?.embedding_status ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:227:  // row accumulation. If content AND metadata are identical, the embedding would
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:259:      'embedding_status IN (?, ?)',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:294:      console.error(`[memory-save] T054: Duplicate content detected (hash match id=${duplicateByHash.id}), skipping embedding`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:304:        message: `Duplicate content detected: identical to existing memory #${duplicateByHash.id} (${duplicateByHash.file_path}). Skipping embedding generation.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:7:import * as embeddings from '../../lib/providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:125:        (text: string) => embeddings.generateQueryEmbedding(text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:5:// Semantic query expansion using embedding similarity.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:30: * Result produced by embedding-based query expansion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:156: * Expand a query using embedding-based similarity to find semantically
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:168: *   a. Run a vector similarity search using the provided embedding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:174: * @param embedding - Pre-computed query embedding (Float32Array from the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:175: *                    embeddings provider). Must not be empty.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:183:  embedding: Float32Array,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:201:  // -- Guard 3: Valid embedding -----------------------------------------------
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:202:  if (!embedding || embedding.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:203:    console.warn('[embedding-expansion] Received empty embedding — skipping expansion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:212:    // Use the query embedding to find semantically similar memories.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:215:    const similarMemories = vectorIndex.vectorSearch(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:267:    // FTS and embedding re-encoding without requiring a separator token.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:277:    console.warn(`[embedding-expansion] Expansion failed, using original query: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:287: * Synchronous predicate that returns true when R12 embedding expansion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:298: * @returns True when embedding expansion should be applied.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:48:  embeddingStatus: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:54:  embeddingFailureReason: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:116:  embeddingStatus,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:122:  embeddingFailureReason,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:131:  } else if (embeddingStatus !== 'success') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:156:      embeddingStatus,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:173:    embeddingStatus,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:201:  if (embeddingStatus === 'pending' && embeddingFailureReason) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:203:    result.embeddingFailureReason = retryManager.sanitizeEmbeddingFailureMessage(embeddingFailureReason) ?? undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:207:  if (asyncEmbedding && embeddingStatus === 'pending') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:214:            console.warn(`[memory-save] T306: Immediate async embedding attempt failed for #${memoryId}: ${retryResult.error}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:219:          console.warn(`[memory-save] T306: Immediate async embedding attempt failed for #${memoryId}: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:390:  if (result.embeddingStatus) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:391:    response.embeddingStatus = result.embeddingStatus;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:392:    if (result.embeddingStatus === 'pending') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:394:      if (result.embeddingFailureReason) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:395:        response.embeddingFailureReason = retryManager.sanitizeEmbeddingFailureMessage(result.embeddingFailureReason);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:397:    } else if (result.embeddingStatus === 'partial') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:414:  if (result.embeddingStatus === 'pending') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:415:    hints.push('Memory will be fully indexed when embedding provider becomes available');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:417:      hints.push('Async embedding mode: immediate background attempt triggered, background retry manager as safety net');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:420:  if (result.embeddingStatus === 'partial') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:421:    hints.push('Large file indexed via chunking: parent record + individual chunk records with embeddings');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:439:  if (result.embeddingStatus === 'success') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:5:// Simple score-based reranking utility. Sorts results by score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:8:// For neural/ML-based reranking see cross-encoder.ts.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:36:export function rerankResults(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:30:  embedding: Float32Array | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:33:  embeddingStatus: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:41:  if (!force && embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:42:    candidates = findSimilarMemories(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:83:        reinforced.embeddingStatus = embeddingStatus;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:126:        if (!embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:128:            '[Memory Save] embedding unexpectedly null in UPDATE path, falling through to CREATE'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:132:        const updated = updateExistingMemory(existingId, parsed, embedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:136:        updated.embeddingStatus = embeddingStatus;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts:9:// Stored in the `encoding_intent` column alongside the embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:13:import * as embeddings from '../lib/providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:14:import * as bm25Index from '../lib/search/bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:40:/** Handle memory_update tool -- updates metadata fields and optionally regenerates embeddings. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:89:  let embeddingRegenerated = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:90:  let embeddingMarkedForReindex = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91:  let embeddingStatusNeedsPendingWrite = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:95:    console.error(`[memory-update] Title changed, regenerating embedding for memory ${id} [requestId=${requestId}]`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:100:      // This produces better semantic embeddings that capture the full memory context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:102:      const embeddingInput = contentText ? `${title}\n\n${contentText}` : title;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:103:      newEmbedding = await embeddings.generateDocumentEmbedding(embeddingInput);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:108:        embeddingStatusNeedsPendingWrite = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:109:        embeddingMarkedForReindex = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:121:      updateParams.embedding = newEmbedding;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:122:      embeddingRegenerated = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:123:    } else if (!embeddingMarkedForReindex) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:126:        embeddingStatusNeedsPendingWrite = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:127:        embeddingMarkedForReindex = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:131:          'Failed to regenerate embedding (null result), update rolled back. No changes were made.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:141:  const fields = Object.keys(updateParams).filter((key) => key !== 'id' && key !== 'embedding');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:145:      if (embeddingStatusNeedsPendingWrite) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:155:      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:157:          const bm25Idx = bm25Index.getIndex();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:162:            const text = bm25Index.buildBm25DocumentText(row);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:164:              bm25Idx.addDocument(String(id), text);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:168:          const bm25ErrMsg = e instanceof Error ? e.message : String(e);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:180:          if (isBm25InfraFailure(bm25ErrMsg)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:181:            console.warn(`[memory-crud-update] BM25 infrastructure unavailable, skipping re-index [requestId=${requestId}]: ${bm25ErrMsg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:183:            console.error(`[memory-crud-update] BM25 re-index failed, rolling back update [requestId=${requestId}]: ${bm25ErrMsg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:184:            throw new Error(`BM25 re-index failed: ${bm25ErrMsg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:216:          embeddingRegenerated,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:217:          embeddingMarkedForReindex,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:257:  const summary = embeddingMarkedForReindex
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:258:    ? `Memory ${id} updated (embedding pending re-index)`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:262:  if (embeddingMarkedForReindex) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:263:    hints.push('Run memory_index_scan() to regenerate embeddings');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:265:  if (embeddingRegenerated) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:276:    embeddingRegenerated,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:280:  if (embeddingMarkedForReindex) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:282:    data.embeddingStatus = 'pending';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:131: * T016: Lightweight deterministic embedding centroid classifier.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:133: * The model uses hashed bag-of-words embeddings so centroids can be built
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:279: * Compute a deterministic normalized embedding for text.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:282: * @returns Normalized Float32Array embedding vector
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:297: * @returns Map of intent types to their centroid embedding vectors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:367: * Score query-to-intent using centroid embeddings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:83: * Generate summary, compute embedding, store in memory_summaries.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:87: * 3. Call embeddingFn(summary) to get embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:89: * 5. Store embedding as Buffer (Float32Array -> Buffer)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:95: * @param embeddingFn - Async function to compute embedding vector
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:102:  embeddingFn: (text: string) => Promise<Float32Array | null>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:115:    const embedding = await embeddingFn(summary);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:116:    const embeddingBlob = embedding ? float32ToBuffer(embedding) : null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:122:        (memory_id, summary_text, summary_embedding, key_sentences, created_at, updated_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:130:      embeddingBlob,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:148: * Vector search on summary embeddings — parallel channel for stage1.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:150: * 1. SELECT id, memory_id, summary_embedding FROM memory_summaries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:151: *    WHERE summary_embedding IS NOT NULL
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:152: * 2. Compute cosine similarity between query embedding and each summary embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:171:      SELECT id, memory_id, summary_embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:173:      WHERE summary_embedding IS NOT NULL
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:175:    `).all(fetchCap) as Array<{ id: number; memory_id: number; summary_embedding: Buffer }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:180:      const storedEmbedding = bufferToFloat32(row.summary_embedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:195:      '[memory-summaries] Failed to query summary embeddings:',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:215:      WHERE embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:210:        WHERE embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:85:} from '../lib/search/sqlite-fts.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:86:import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:200:  rerank?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:362:  if (typeof data.lexicalPath !== 'string' && snapshot) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:363:    data.lexicalPath = snapshot.lexicalPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:517:    rerank = true, // Enable reranking by default for better result quality
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:742:    rerank,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:763:    // Wait for embedding model only on cache miss
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:795:      rerank,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:905:    const lexicalCapability = getLastLexicalCapabilitySnapshot();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:906:    if (lexicalCapability) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:908:        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:919:    if (lexicalCapability) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:920:      extraData.lexicalPath = lexicalCapability.lexicalPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:921:      extraData.fallbackState = lexicalCapability.fallbackState;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:952:    if (pipelineResult.metadata.stage3.rerankApplied) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:953:      extraData.rerankMetadata = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:954:        reranking_enabled: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:955:        reranking_requested: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:956:        reranking_applied: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1234:        fusionMethod: 'rrf',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:268:export const set_embedding_model_ready = lazyFunction(getMemoryCrudModule, 'set_embedding_model_ready');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:269:export const is_embedding_model_ready = lazyFunction(getMemoryCrudModule, 'is_embedding_model_ready');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:16:// Fields (score, rrfScore, similarity, intentAdjustedScore). It only
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:8:import * as embeddingsProvider from '../providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:14:import * as bm25Index from './bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:20:  to_embedding_buffer,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:26:  get_embedding_dim,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:132:type IndexMemoryDeferredParams = Omit<IndexMemoryParams, 'embedding'> & {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:140: * Indexes a memory with an embedding payload.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:143: * @throws {VectorIndexError} When embedding validation fails or the mutation cannot be applied.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:149: *   embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:165:    embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:175:  if (!embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:179:  const expected_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:180:  if (embedding.length !== expected_dim) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:181:    console.warn(`[vector-index] Embedding dimension mismatch: expected ${expected_dim}, got ${embedding.length}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:183:      `Embedding must be ${expected_dim} dimensions, got ${embedding.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:190:  const embedding_buffer = to_embedding_buffer(embedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:204:      embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:218:    const embedding_status = sqlite_vec ? 'success' : 'pending';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:223:        importance_weight, created_at, updated_at, embedding_model,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:224:        embedding_generated_at, embedding_status, encoding_intent, document_type, spec_level,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:229:      importanceWeight, now, now, embeddingsProvider.getModelName(), now, embedding_status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:242:        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:243:      `).run(row_id, embedding_buffer);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:258: * Indexes a memory record without storing an embedding yet.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:301:            embedding_status = 'pending',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:322:        importance_weight, created_at, updated_at, embedding_status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:334:    logger.info(`Deferred indexing: Memory ${Number(row_id)} saved without embedding (BM25/FTS5 searchable)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:343: * Updates stored memory metadata and embeddings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:346: * @throws {VectorIndexError} When embedding validation fails or the mutation transaction cannot complete.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:349: * const id = update_memory({ id: 42, title: 'Updated title', embedding });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:362:    embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:433:    if (embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:434:      updates.push('embedding_model = ?');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:435:      updates.push('embedding_generated_at = ?');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:437:      updates.push('embedding_status = ?');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:438:      values.push(embeddingsProvider.getModelName(), now, 'pending');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:453:    if (embedding && sqlite_vec) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:454:      const expected_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:455:      if (embedding.length !== expected_dim) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:456:        console.warn(`[vector-index] Embedding dimension mismatch in update: expected ${expected_dim}, got ${embedding.length}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:458:          `Embedding must be ${expected_dim} dimensions, got ${embedding.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:463:      const embedding_buffer = to_embedding_buffer(embedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:466:        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:467:      `).run(BigInt(id), embedding_buffer);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:469:      database.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('success', id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:551:      if (bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:552:        bm25Index.getIndex().removeDocument(String(id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:699:        if (bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:700:          const bm25 = bm25Index.getIndex();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:702:            bm25.removeDocument(String(id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:720: * Updates the embedding status for a memory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:722: * @param status - The new embedding status.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:725:export function update_embedding_status(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:732:    console.warn(`[vector-index] Invalid embedding status: ${status}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:739:      SET embedding_status = ?, updated_at = datetime('now')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:745:    console.warn(`[vector-index] Failed to update embedding status for ${id}: ${get_error_message(error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:787:export { update_embedding_status as updateEmbeddingStatus };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:7:import { sanitizeFTS5Query } from './bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:172:        -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:210:  // Pipeline (MMR reranking filters with typeof id === 'number').
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:12:  bm25Search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:15:import { generateQueryEmbedding } from '../lib/providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:44:import type { RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:149:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:154:  if (embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:155:    const vectorResults = vectorIndex.vectorSearch(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:177:  const bm25Results = bm25Search(query, { limit });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:178:  if (bm25Results.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:180:      source: 'bm25',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:181:      results: bm25Results.map((row) => ({ id: row.id })),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:268:      const embedding = await generateQueryEmbedding(query);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:281:      const results = await hybridSearchEnhanced(query, embedding, searchOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:369:    const embedding = await generateQueryEmbedding(query);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:370:    queryLists.push(buildRawFusionLists(db, graphSearchFn, query, embedding, limit));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:8:import * as embeddings from '../lib/providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:9:import * as bm25Index from '../lib/search/bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:16:import { lookupEmbedding, storeEmbedding, computeContentHash as cacheContentHash } from '../lib/cache/embedding-cache.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:55:  embeddingStatus?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:69:  embedding_status?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:96:  'file_mtime_ms', 'embedding_status', 'encoding_intent', 'document_type',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:142: * Creates a parent record (metadata only, no embedding) and child records
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:143: * (each with its own embedding) for each chunk.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:145: * Parent record: embedding_status='partial', content_text=summary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:146: * Child records: embedding_status='success'|'pending', parent_id=parent.id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:216:      // Create parent record (no embedding)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:228:        failureReason: 'Chunked parent: embedding in children',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:249:        embedding_status: 'partial',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:268:  const bm25FailedChunks: number[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:279:      // Persistent embedding cache (REQ-S2-001) avoids re-calling the embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:286:        const modelId = embeddings.getModelName();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:287:        const embeddingDim = embeddings.getEmbeddingDimension();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:288:        const cachedChunkBuf = lookupEmbedding(database, chunkHash, modelId, embeddingDim);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:293:          chunkEmbedding = await embeddings.generateDocumentEmbedding(normalizeContentForEmbedding(chunk.content));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:302:        console.warn(`[memory-save] Chunk ${i + 1} embedding failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:315:            embedding: chunkEmbedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:329:            failureReason: 'Chunk embedding failed',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:345:          embedding_status: chunkEmbeddingStatus,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:359:      if (bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:361:          const bm25 = bm25Index.getIndex();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:362:          bm25.addDocument(String(childId), bm25Index.buildBm25DocumentText({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:368:        } catch (bm25_err: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:369:          const message = toErrorMessage(bm25_err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:371:          bm25FailedChunks.push(childId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:444:    if (deletedChunkIds.length > 0 && bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:446:        const bm25 = bm25Index.getIndex();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:448:          bm25.removeDocument(String(deletedChunkId));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:450:      } catch (bm25Err: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:451:        const message = toErrorMessage(bm25Err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:456:    if (parentRolledBack && bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:458:        bm25Index.getIndex().removeDocument(String(parentId));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:459:      } catch (bm25Err: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:460:        const message = toErrorMessage(bm25Err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:476:      embeddingStatus: parentRolledBack ? 'failed' : 'pending',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:509:            embedding_status = 'partial',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:587:        embeddingStatus: 'pending',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:595:  if (bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:597:      const bm25 = bm25Index.getIndex();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:598:      bm25.addDocument(String(parentId), bm25Index.buildBm25DocumentText({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:604:    } catch (bm25_err: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:605:      const message = toErrorMessage(bm25_err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:644:    embeddingStatus: 'partial',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:646:      (bm25FailedChunks.length > 0 ? ` (${bm25FailedChunks.length} BM25 failures)` : ''),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:63:/** Find memories with similar embeddings for PE gating deduplication */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:67:  if (!embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:86:      const results = vectorIndex.vectorSearch(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:232:function updateExistingMemory(memoryId: number, parsed: ParsedMemory, embedding: Float32Array): IndexResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:267:      embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:15:import * as embeddings from '../lib/providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:301:  const embeddingRetry = getEmbeddingRetryStats();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:365:        embeddingRetry,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:378:  let providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:379:  let profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:409:      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:410:      providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:417:  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:418:  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:436:        embeddingRetry,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:574:      embeddingModelReady: isEmbeddingModelReady(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:583:      embeddingProvider: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:590:      embeddingRetry,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:23:import * as embeddings from '../lib/providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:174:    const profile: EmbeddingProfile | null = embeddings.getEmbeddingProfile();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:176:      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:180:    console.warn('[memory_index_scan] Could not verify embedding dimension:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:82:import { generateOrCacheEmbedding, persistPendingEmbeddingCacheWrite } from './save/embedding-pipeline.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:729:    const embeddingResult = await generateOrCacheEmbedding(database, parsed, filePath, asyncEmbedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:731:      embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:732:      status: embeddingStatus,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:733:      failureReason: embeddingFailureReason,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:735:    } = embeddingResult;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:737:    // -- the rollout: TM-04 Quality Gate (before PE gating, after embedding) --
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:746:          embedding: embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:747:          findSimilar: embedding ? (emb, gateOptions) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:809:      database, parsed, embedding, force, validation.warnings, embeddingStatus, filePath, scope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:826:      embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:942:            embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:943:            embeddingFailureReason,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:951:            embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:952:            embeddingFailureReason,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1020:      embeddingStatus,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1026:      embeddingFailureReason,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1629:          embeddingStatus: indexResult.embeddingStatus,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1743:  if (indexResult.embeddingStatus === 'pending') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1744:    hints.push('Memory will be fully indexed when embedding provider becomes available');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1746:  if (indexResult.embeddingStatus === 'partial') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1747:    hints.push('Large file indexed via chunking: parent record + individual chunk records with embeddings');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1764:    embeddingStatus: indexResult.embeddingStatus,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:22:// Anchor metadata here keeps Stage 3 (rerank) and Stage 4
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:6:// PURPOSE: Combine margin, multi-channel agreement, reranker support,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:69:  | 'reranker_boost'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:104:  rrfScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:109:  /** Reranker cross-encoder score if available. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:110:  rerankerScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:111:  /** Explicit reranker application marker from the pipeline. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:112:  rerankerApplied?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:113:  /** Score origin metadata for distinguishing real reranks from fallbacks. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:178:  const hasFiniteRerankerScore = typeof result.rerankerScore === 'number' && Number.isFinite(result.rerankerScore);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:181:  if (result.rerankerApplied === true) return true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:217: *   - Presence of a reranker score (20%)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:250:    const rerankerFactor = hasReranker ? 1.0 : 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:258:      WEIGHT_RERANKER * rerankerFactor +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:270:    if (hasReranker) drivers.push('reranker_boost');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:103:  rrfScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:356: * Resolve the primary numeric score from a result, checking score, rrfScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:361:  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore)) return result.rrfScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:376:    rrfScore: score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:639:      rrfScore: score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:9:import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:34:  | 'bm25_runtime_failure';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:37:  lexicalPath: LexicalPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:89:  return message.includes('bm25');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:101:        lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:107:      lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:119:        lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:126:        lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:131:      lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:137:    lexicalPath: 'fts5',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:149: * Uses SQLite FTS5's built-in bm25() ranking function with
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:197:    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:211:    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:226:      lexicalPath: 'fts5',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:234:          lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:239:            lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:240:            fallbackState: 'bm25_runtime_failure',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:244:              lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:248:              lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:249:              fallbackState: 'bm25_runtime_failure',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:252:    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:71:- `memory-crud-health.ts` surfaces embedding retry stats and FTS/index sync diagnostics as part of the health response.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:16:   * Higher = better lexical match. Not directly comparable to vector similarity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:51: * These weights are consumed by the FTS5 path in sqlite-fts.ts,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:323:    const queryTokens = normalizeLexicalQueryTokens(query).bm25;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:415:      console.warn(`[bm25-index] Failed to sync BM25 rows: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:465:      console.warn(`[bm25-index] Failed to schedule BM25 warmup: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:530: * @returns Sanitized query tokens safe to reuse for lexical search paths.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:562:  bm25: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:574:    bm25: sharedTokens
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:11:import * as bm25Index from '../lib/search/bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:488:      if (database && bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:489:        bm25Index.getIndex().rebuildFromDatabase(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:206: * The "score" used for tie-breaking is resolved from `score`, `rrfScore`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:212:export function mergeByFacetCoverage<T extends { id: number; score?: number; rrfScore?: number; similarity?: number }>(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:266:function resolveItemScore(item: { score?: number; rrfScore?: number; similarity?: number }): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:269:  if (typeof item.rrfScore === 'number' && Number.isFinite(item.rrfScore))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:270:    return Math.max(0, Math.min(1, item.rrfScore));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:9:  to_embedding_buffer,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:46:  update_embedding_status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:70:  generate_query_embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:151:  get_embedding_dim,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:152:  get_confirmed_embedding_dimension,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:153:  validate_embedding_dimension,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-types.ts:5: * Function signature for graph-based lexical search helpers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:17://     "summary": "Ranked first because semantic, reranker, decision-anchor agreed",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:33:  | 'lexical_match'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:38:  | 'reranker_support'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:103:  if (channelAttribution.includes('fts') || channelAttribution.includes('bm25')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:104:    signals.push('lexical_match');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:130:  // Reranker support: row has a rerankerScore distinct from stage2Score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:131:  const rerankerScore = typeof row.rerankerScore === 'number' ? row.rerankerScore : null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:133:  if (rerankerScore !== null && stage2Score !== null && rerankerScore !== stage2Score) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:134:    signals.push('reranker_support');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:173: * Prioritises: semantic/lexical first, then boosts, then meta.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:205:    if (signal === 'lexical_match') return 'keyword match';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:210:    if (signal === 'reranker_support') return 'reranker confirmation';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:268:  const hasFTS = channelAttribution.includes('fts') || channelAttribution.includes('bm25');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:132:  // A symlink inside the workspace pointing outside it would pass a lexical
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:68: * Graph-guided MMR diversity reranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:92: * Cross-encoder reranking gate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:176: * R12: Query expansion for embedding-based retrieval.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:197: * Records intent metadata (document, code, structured_data) alongside embeddings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:311: * P1-5: Local GGUF reranker gate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:4:// Feature catalog: Local GGUF reranker via node-llama-cpp
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:6:// Neural reranking via external APIs (Voyage rerank-2, Cohere
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:7:// Rerank-english-v3.0) or a local cross-encoder model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:14:// The filename "cross-encoder.ts" is ACCURATE.  All three
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:15:// Providers invoke real ML-based reranking — either cloud APIs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:16:// That run neural rerankers server-side (Voyage, Cohere) or a
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:17:// Local cross-encoder model.  The positional fallback is NOT a
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:38:    model: 'rerank-2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:39:    endpoint: 'https://api.voyageai.com/v1/rerank',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:46:    model: 'rerank-english-v3.0',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:47:    endpoint: 'https://api.cohere.ai/v1/rerank',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:54:    model: 'cross-encoder/ms-marco-MiniLM-L-6-v2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:55:    endpoint: 'http://localhost:8765/rerank',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:89:  rerankerScore: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:93:   *   'cross-encoder' — score from a neural reranker (Voyage / Cohere API or local model)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:96:  scoringMethod: 'cross-encoder' | 'fallback';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:187:    console.warn(`[cross-encoder] Circuit breaker OPEN for ${provider} after ${state.failures} consecutive failures. Cooldown: ${CIRCUIT_COOLDOWN_MS}ms`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:225:      const rerankerScore = r.rerankerScore * penalty;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:228:        rerankerScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:229:        score: rerankerScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:258:  return `rerank-${Math.abs(hash).toString(36)}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:265:async function rerankVoyage(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:273:  // P3-13: Build map of document ID → input position (pre-rerank rank)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:292:    throw new Error(`Voyage rerank failed: ${response.status} ${response.statusText}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:299:    rerankerScore: item.relevance_score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:303:    scoringMethod: 'cross-encoder' as const,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:304:  })).sort((a: RerankResult, b: RerankResult) => b.rerankerScore - a.rerankerScore);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:307:async function rerankCohere(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:315:  // P3-13: Build map of document ID → input position (pre-rerank rank)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:334:    throw new Error(`Cohere rerank failed: ${response.status} ${response.statusText}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:341:    rerankerScore: item.relevance_score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:345:    scoringMethod: 'cross-encoder' as const,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:346:  })).sort((a: RerankResult, b: RerankResult) => b.rerankerScore - a.rerankerScore);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:349:async function rerankLocal(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:355:  // P3-13: Build map of document ID → input position (pre-rerank rank)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:370:    throw new Error(`Local rerank failed: ${response.status} ${response.statusText}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:377:    rerankerScore: item.relevance_score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:381:    scoringMethod: 'cross-encoder' as const,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:382:  })).sort((a: RerankResult, b: RerankResult) => b.rerankerScore - a.rerankerScore);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:389:async function rerankResults(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:400:    // No reranker available — P3-16: use 'fallback' scoringMethod and distinct score range
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:403:      rerankerScore: 0.5 - (i / (documents.length * 2)),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:416:      rerankerScore: 0.5 - (i / (documents.length * 2)),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:441:        results = await rerankVoyage(query, documents);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:444:        results = await rerankCohere(query, documents);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:447:        results = await rerankLocal(query, documents);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:478:    console.warn(`[cross-encoder] Reranking failed (${provider}): ${msg} — falling back to positional scoring`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:482:      rerankerScore: 0.5 - (i / (documents.length * 2)),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:550:  rerankVoyage,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551:  rerankCohere,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:552:  rerankLocal,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:553:  rerankResults,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:4:// Optional local reranker for Stage 3. This module is fully gated by
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:9:// Dedicated evaluation suite because runtime reranking must stay provider-agnostic.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:20:// Feature catalog: Local GGUF reranker via node-llama-cpp
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:35:  rerankerScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:48:const DEFAULT_MODEL_RELATIVE_PATH = path.join('models', 'bge-reranker-v2-m3.Q4_K_M.gguf');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:207: * Feature-flag gate for local reranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:208: * This guard is intentionally strict: local reranking only runs when the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:235: * Local GGUF reranking entrypoint for Stage 3.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:239:export async function rerankLocal<T extends LocalRerankRow>(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:249:   * Internal guard for direct callers: rerankLocal re-checks eligibility even
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:259:  const rerankCandidates = candidates.slice(0, MAX_RERANK_CANDIDATES);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:260:  const rerankCount = Math.max(1, Math.min(topK, rerankCandidates.length));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:276:     * local GGUF reranking can be exercised without changing the default
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:280:     * `tests/reranker-eval-comparison.vitest.ts`, where benchmark protocol and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:283:    const reranked = await Promise.race([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:291:        const scored: Array<{ candidate: T; rerankScore: number }> = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:292:        for (const candidate of rerankCandidates.slice(0, rerankCount)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:305:          const rerankScore = await scorePrompt(context, boundedPrompt);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:306:          scored.push({ candidate, rerankScore });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:309:        scored.sort((a, b) => b.rerankScore - a.rerankScore);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:310:        const rerankedTop = scored.map((entry) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:312:          rerankerScore: entry.rerankScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:313:          score: entry.rerankScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:315:        const remainder = candidates.slice(rerankCount);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:318:          `[local-reranker] reranked=${rerankCount} total=${candidates.length} durationMs=${elapsed} model=${path.basename(modelPath)}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:320:        return [...rerankedTop, ...remainder];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:324:          reject(new Error(`local reranker timed out after ${RERANKER_TIMEOUT_MS}ms`));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:328:    return reranked;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:330:    console.warn(`[local-reranker] fallback to original ordering: ${toErrorMessage(error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:50:  rerank: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:133:  rerank,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:162:    rerank,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:10:// BM25/FTS5 (no embedding call) to ground the LLM prompt in real
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:24:import { fts5Bm25Search } from './sqlite-fts.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:91: * Uses FTS5 / BM25 keyword search only — no embedding call — to keep
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:102:  'embedding': 'embedding',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:103:  'embeddings': 'embedding',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:104:  'vector': 'embedding',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:105:  'vectors': 'embedding',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:106:  'representation': 'embedding',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:171: * nounPhrases('How does vector search indexing work?');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:3:description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:7:  - "vector search"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:12:> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:39:The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:42:- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:46:- **Reranking Pipeline**: Optional cross-encoder with length penalties
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:94:| BM25 | `bm25-index.ts` | Pure TypeScript keyword matching |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:95:| FTS5 | `sqlite-fts.ts` | SQLite FTS5 BM25 weighted scoring |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:115:**Stage 3 — Rerank + Aggregate** (`stage3-rerank.ts`):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:116:Cross-encoder reranking (optional, min 2 results) followed by MPAB chunk-to-memory aggregation. Aggregation formula: `parentScore = sMax + 0.3 * Sum(rest) / sqrt(N)` where `sMax` is the best chunk score and N is the remaining chunk count. Chunk ordering preserves `chunk_index` document order (B2 guarantee). `contentSource` metadata marks provenance (`reassembled_chunks` or `file_read_fallback`).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:141:- **MMR Diversity**: Maximal Marginal Relevance reranking reduces near-duplicate results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:177:- `lexicalPath`: the lane that actually ran for lexical retrieval. Current packet-owned values are `fts5` and `unavailable`. The wider response schema also allows `like`, but packet `010` does not claim that lane for this runtime seam.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:182:| `fallbackState` | Meaning | `lexicalPath` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:185:| `compile_probe_miss` | `PRAGMA compile_options` does not report FTS5 support, so lexical work cannot run for this request | `unavailable` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:188:| `bm25_runtime_failure` | The FTS5 table exists, but the `bm25(...)` ranking call fails at runtime | `unavailable` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:220:- **Voyage rerank-2**: API-based, max 100 docs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:221:- **Cohere rerank-english-v3.0**: API-based, max 100 docs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:222:- **Local GGUF path**: `node-llama-cpp` with `bge-reranker-v2-m3.Q4_K_M.gguf` when `RERANKER_LOCAL=true` and the runtime/model guards pass
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:246:| **TypeScript**       | `hybrid-search.ts`, `cross-encoder.ts`, `intent-classifier.ts`, `bm25-index.ts`             |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:248:| **TypeScript**       | `reranker.ts` (local reranking utility); `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts` relocated to `shared/algorithms/` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:291:| `cross-encoder.ts`         | ~433   | TypeScript | Reranking with Voyage/Cohere providers              |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:292:| `local-reranker.ts`        | -      | TypeScript | Local GGUF-based cross-encoder reranking fallback   |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:294:| `bm25-index.ts`            | ~280   | TypeScript | Pure TypeScript BM25 (REQ-028, v1.2.0)              |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:295:| `reranker.ts`              | -      | TypeScript | Score-based reranking utility (sort + truncate)     |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:311:| `sqlite-fts.ts`            | -      | TypeScript | SQLite FTS5 BM25 weighted scoring, extracted from hybrid-search for independent use |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:316:| `memory-summaries.ts`      | -      | TypeScript | Summary storage, embedding, and search channel for memory summaries (R8) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:323:| `embedding-expansion.ts`   | -      | TypeScript | Embedding-based query expansion for R12 multi-vector retrieval |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:353:**Relocated to `shared/algorithms/`**: `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts` -- these are now imported from `@spec-kit/shared/algorithms/`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:367:   bm25-index.ts -> BM25 search (keyword)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:375:   rrf-fusion.ts -> RRF with k=40, convergence bonus
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:383:   MMR diversity reranking -> Reduce near-duplicate results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:391:   cross-encoder.ts -> API or local reranker
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:413:| `ENABLE_BM25`            | `true`   | Enable BM25 lexical search (legacy compatibility gate) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:414:| `SPECKIT_CROSS_ENCODER`  | `true`   | Enable cross-encoder reranking gate |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:415:| `VOYAGE_API_KEY`         | _(unset)_| Select Voyage reranker provider when set |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:416:| `COHERE_API_KEY`         | _(unset)_| Select Cohere reranker provider when set |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:417:| `RERANKER_LOCAL`         | `false`  | Enable local GGUF reranker path |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:418:| `EMBEDDING_DIM`          | `768`    | Fallback embedding dimension        |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:425:| `SPECKIT_EMBEDDING_EXPANSION`| `true` | Enable R12 embedding-based query expansion |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:455:| v7      | `partial` embedding_status + `idx_embedding_pending` + `idx_fts_fallback` (REQ-031, T096) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:476:function toEmbeddingBuffer(embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:477:  return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:548:// 1. VOYAGE_API_KEY -> Voyage rerank-2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:597:| **Storage** | Summaries stored with embeddings in SQLite for vector search |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:600:| **Pipeline** | `generateAndStoreSummary()` combines TF-IDF extraction with embedding and persistence |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:607:| `querySummaryEmbeddings` | `(db, queryEmbedding, limit?) => SummarySearchResult[]` | Search summaries by embedding similarity |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:679:Same-path `unchanged` only applies to healthy existing rows (`success`, `pending`, `partial`), so unhealthy embedding states still re-enter indexing. Cross-path content-hash dedup accepts chunked parents only when the parent row is in valid `partial` state and ignores invalid parent rows marked `complete`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:706:**Embedding Cache Consistency** (`save/embedding-pipeline.ts` + chunking path):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:707:Embedding cache keys now hash normalized content in both the primary and chunked embedding paths, so equivalent normalized content shares cache entries.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:718:**Lexical Normalization + BM25 Document Text** (`bm25-index.ts`):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:719:`buildBm25DocumentText()` builds the canonical lexical document from title, content, trigger phrases, and folder metadata. `normalizeLexicalQueryTokens()` is shared by BM25 and SQLite FTS flows so lexical matching stays aligned across search channels.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:722:Watcher- and ingest-triggered reindex paths now use the normal synchronous embedding cache-miss flow. Deferred embeddings remain opt-in via `asyncEmbedding` or failure fallback.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:786:// - rrfScore: Combined score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:787:// - sources: ['vector', 'bm25', 'graph']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:788:// - vectorRank, bm25Rank, graphRank
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:813:import { rerankResults } from './cross-encoder';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:818:// Rerank top 20 with cross-encoder
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:819:const reranked = await rerankResults('user authentication', initial, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:820:  topK: 10,  // Return top 10 after reranking
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:833:import * as bm25Index from './bm25-index';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:836:if (bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:838:  const results = bm25Index.getIndex().search('authentication', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:872:- Guard clauses added for missing data, null embeddings, and edge cases (B4)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:906:| `@spec-kit/shared/embeddings` | Embeddings provider abstraction   |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:942:| REQ-008 | Length penalty for short content | cross-encoder.ts                |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:945:| REQ-013 | Cross-encoder reranking          | cross-encoder.ts                |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:946:| REQ-014 | BM25 hybrid search               | bm25-index.ts, hybrid-search.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:949:| REQ-028 | Pure TypeScript BM25             | bm25-index.ts                   |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:962:- `rrf-fusion.ts`, `adaptive-fusion.ts`, and `mmr-reranker.ts` relocated to `shared/algorithms/`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:46:  embedding: ['vector', 'representation'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:23:/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:24:type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:41:const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:65: * - moderate: 3 channels (vector + fts + bm25) — balanced
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:70:  moderate: ['vector', 'fts', 'bm25'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:71:  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:156:    ? enforceMinimumChannels([...channels, 'bm25'])
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:189:    keywords: ['research', 'investigation', 'analysis', 'findings', 'study', 'evaluation', 'search', 'retrieval', 'pipeline', 'indexing', 'embedding', 'vector', 'semantic'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:23:import { getStartupEmbeddingDimension } from '@spec-kit/shared/embeddings/factory';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:120:/** Default embedding dimension used by the vector index. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:124: * Gets the active embedding dimension for the current provider.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:125: * @returns The embedding dimension.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:127:export function get_embedding_dim(): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:132: * Waits for the embedding provider to report a stable dimension.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:134: * @returns A promise that resolves to the confirmed embedding dimension.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:136:export async function get_confirmed_embedding_dimension(timeout_ms = 5000): Promise<number> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:139:    const dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:164:function get_existing_embedding_dimension(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:186:      SELECT value FROM vec_metadata WHERE key = 'embedding_dim'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:226:function validate_embedding_dimension_for_connection(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:235:    const current_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:236:    const existing = get_existing_embedding_dimension(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:249:        `but the active embedding configuration resolves to ${current_dim}. Refusing to bootstrap because vector search would fail. ` +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:259:    return { valid: true, stored: null, current: get_embedding_dim(), reason: get_error_message(e) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:267:export function validate_embedding_dimension(): { valid: boolean; stored: number | null; current: number | null; reason?: string; warning?: string } {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:268:  return validate_embedding_dimension_for_connection(db, sqlite_vec_available_flag);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:564:        SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as complete,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:565:        SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:566:        SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:636:        AND m.embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:798:    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:810:  const preBootstrapDimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:819:  create_schema(new_db, { sqlite_vec_available: vec_available, get_embedding_dim });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:822:  const dimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:875:// Check if vector search is available (sqlite-vec loaded)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:877: * Reports whether sqlite-vec vector search is available.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:878: * @returns True when vector search is available.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:911:   * Searches indexed memories by embedding similarity.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:912:   * @param embedding - The query embedding to search with.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:916:   * @throws {VectorIndexError} When the embedding dimension is invalid or the store cannot initialize.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:922:  async search(embedding: EmbeddingInput, topK: number, options: VectorSearchOptions = {}): Promise<MemoryRow[]> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:926:    const expected_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:927:    if (!embedding || embedding.length !== expected_dim) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:929:        `Invalid embedding dimension: expected ${expected_dim}, got ${embedding?.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:946:    return vector_search(embedding, search_options, database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:950:   * Inserts or updates a memory row and its embedding metadata.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:952:   * @param embedding - The embedding to persist.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:955:   * @throws {VectorIndexError} When embedding validation fails or required metadata is missing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:958:   * const id = await store.upsert('ignored', embedding, { spec_folder: 'specs/001-demo', file_path: 'spec.md' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:961:  async upsert(_id: string, embedding: EmbeddingInput, metadata: JsonObject): Promise<number> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:965:    const expected_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:966:    if (!embedding || embedding.length !== expected_dim) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:968:        `Embedding dimension mismatch: expected ${expected_dim}, got ${embedding?.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:994:      embedding: embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1054:    return get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1079:    embedding: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1085:    return vector_search_enriched(embedding, undefined, options, database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1088:  async enhancedSearch(embedding: string, options: EnhancedSearchOptions = {}): Promise<EnrichedSearchResult[]> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1092:    return enhanced_search(embedding, undefined, options, database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1132:export { get_confirmed_embedding_dimension as getConfirmedEmbeddingDimension };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1133:export { get_embedding_dim as getEmbeddingDim };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1134:export { validate_embedding_dimension as validateEmbeddingDimension };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:14:import * as embeddingsProvider from '../providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:18:  to_embedding_buffer,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:24:  get_embedding_dim,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:113: * Gets memory counts grouped by embedding status.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:114: * @returns The counts for each embedding status.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:120:    SELECT m.embedding_status, COUNT(*) as count
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:123:    GROUP BY m.embedding_status
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:128:  for (const row of rows as Array<{ embedding_status: keyof typeof counts; count: number }>) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:129:    if (row.embedding_status in counts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:130:      counts[row.embedding_status] = row.count;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:159: * @param query_embedding - The query embedding to search with.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:169:  query_embedding: EmbeddingInput,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:190:  // M9 FIX: Validate embedding dimension before querying
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:191:  const expected_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:192:  if (!query_embedding || query_embedding.length !== expected_dim) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:194:      `Invalid embedding dimension: expected ${expected_dim}, got ${query_embedding?.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:199:  const query_buffer = to_embedding_buffer(query_embedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:221:  const where_clauses = ['m.embedding_status = \'success\''];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:263:      SELECT m.*, vec_distance_cosine(v.embedding, ?) as distance,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:309: * Searches indexed memories with multiple concept embeddings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:310: * @param concept_embeddings - The concept embeddings to search with.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:313: * @throws {VectorIndexError} When concept count or embedding dimensions are invalid, or when store initialization fails.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:320:  concept_embeddings: EmbeddingInput[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:331:  const concepts = concept_embeddings;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:336:  const expected_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:340:        `Invalid embedding dimension: expected ${expected_dim}, got ${emb?.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:348:  const concept_buffers = concepts.map(c => to_embedding_buffer(c));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:352:    `vec_distance_cosine(v.embedding, ?) as dist_${i}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:356:    `vec_distance_cosine(v.embedding, ?) <= ?`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:380:      WHERE m.embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:586: * Generates an embedding for a search query.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:588: * @returns A promise that resolves to the embedding, if generated.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:590:export async function generate_query_embedding(query: string): Promise<Float32Array | null> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:592:    console.warn('[vector-index] Empty query provided for embedding');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:597:    const embeddings = embeddingsProvider;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:598:    const embedding = await embeddings.generateQueryEmbedding(query.trim());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:599:    return embedding;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:601:    console.warn(`[vector-index] Query embedding failed: ${get_error_message(error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:697: * Runs enriched vector search for a text query.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:717:  const query_embedding = await generate_query_embedding(query);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:723:  if (query_embedding && sqlite_vec) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:724:    raw_results = vector_search(query_embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:781: * @param concepts - The concept queries or embeddings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:785: * @throws {VectorIndexError} When concept validation fails or the vector search pipeline cannot execute.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:804:  const concept_embeddings: EmbeddingInput[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:807:      const embedding = await generate_query_embedding(concept);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:808:      if (!embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:812:      concept_embeddings.push(embedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:814:      concept_embeddings.push(concept);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:824:  const raw_results = multi_concept_search(concept_embeddings, { limit, specFolder, minSimilarity });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1341:        WHERE m.embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1444:export { generate_query_embedding as generateQueryEmbedding };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:23:  generate_query_embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:340:    const embedding = await generate_query_embedding(content.substring(0, 1000));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:341:    if (!embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:342:      console.warn(`[vector-index] Could not generate embedding for memory ${new_memory_id}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:346:    const similar = vector_search(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:387: * This is a lightweight pre-filter, NOT a replacement for vector search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:15:import { initEmbeddingCache } from '../cache/embedding-cache.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:125:    embedding_status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:172:  const tableSql = getTableSql(database, 'embedding_cache');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:181:  if (!hasTable(database, 'embedding_cache')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:190:  logger.info('Migrating embedding_cache primary key to include dimensions');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:192:    ALTER TABLE embedding_cache RENAME TO embedding_cache_legacy_dimensions;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:196:    INSERT OR REPLACE INTO embedding_cache (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:199:      embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:207:      embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:211:    FROM embedding_cache_legacy_dimensions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:213:  database.exec('DROP TABLE embedding_cache_legacy_dimensions');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:408:// Added 'partial' embedding_status for deferred indexing (REQ-031, T096)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:581:      // V6 -> v7: Add 'partial' embedding_status for deferred indexing (REQ-031, T096)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:584:          CREATE INDEX IF NOT EXISTS idx_embedding_pending
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:585:          ON memory_index(embedding_status)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:586:          WHERE embedding_status IN ('pending', 'partial', 'retry')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:588:        logger.info('Migration v7: Created idx_embedding_pending partial index');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:590:        console.warn('[VectorIndex] Migration v7 warning (idx_embedding_pending):', get_error_message(e));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:596:          ON memory_index(spec_folder, embedding_status, importance_tier)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:597:          WHERE embedding_status IN ('pending', 'partial')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1011:            summary_embedding BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1136:       ON memory_index(embedding_status, id)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1137:       WHERE embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2071:      ON memory_index(embedding_status, id)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2072:      WHERE embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2266:  options: { sqlite_vec_available: boolean; get_embedding_dim: () => number }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2268:  const { sqlite_vec_available, get_embedding_dim } = options;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2291:    // the rollout (REQ-S2-001) — embedding cache table must exist before any
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2310:      embedding_model TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2311:      embedding_generated_at TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2312:      embedding_status TEXT DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2363:    const embedding_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2366:        embedding FLOAT[${embedding_dim}]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2377:      INSERT OR REPLACE INTO vec_metadata (key, value) VALUES ('embedding_dim', ?)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2378:    `).run(String(embedding_dim));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2379:    logger.info(`Created vec_memories table with dimension ${embedding_dim}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2420:  // the rollout (REQ-S2-001) — create embedding_cache table
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2428:    CREATE INDEX idx_embedding_status ON memory_index(embedding_status);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2429:    CREATE INDEX idx_retry_eligible ON memory_index(embedding_status, retry_count, last_retry_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2440:      ON memory_index(embedding_status, id)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2441:      WHERE embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2457:      embedding_status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:3:description: "Four-stage retrieval pipeline: candidate generation, fusion, reranking and filtering."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:10:  - "reranking"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:18:A four-stage retrieval pipeline that takes a search query through candidate generation, score fusion, reranking and final filtering to produce ranked memory results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:46:| `stage1-candidate-gen.ts` | Stage 1: Candidate Generation. Runs search channels (hybrid, vector, multi-concept), applies deep-mode query expansion (R6), embedding-based expansion (R12), summary embeddings (R8), constitutional memory injection, quality threshold filtering and tier/contextType filtering. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:48:| `stage3-rerank.ts` | Stage 3: Rerank + Aggregate. Applies cross-encoder reranking (remote or local GGUF), MMR diversity pruning and MPAB chunk collapse with parent document reassembly from the database. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:68:      |  cross-encoder reranking, MMR diversity, MPAB chunk collapse
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:79:- Optional R12 embedding expansion and R8 summary embedding channels.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:84:- The only stage where scoring modifications happen (except Stage 3 reranking).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:89:**Stage 3 - Rerank + Aggregate** (`stage3-rerank.ts`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:90:- Cross-encoder reranking via remote API or local GGUF model.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:105:1. **Single Scoring Point.** All score modifications happen in Stage 2 (fusion) or Stage 3 (reranking). Stage 4 must not change any score field.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:108:4. **Score Resolution Consistency.** All stages use the shared `resolveEffectiveScore()` function from `types.ts` with fallback chain: `intentAdjustedScore` > `rrfScore` > `score` > `similarity/100`, clamped to [0, 1].
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:114:- `mcp_server/lib/search/` - Parent search directory containing hybrid search, vector index, cross-encoder and other search modules consumed by the pipeline.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:117:- `@spec-kit/shared/algorithms/mmr-reranker.ts` - MMR algorithm used by Stage 3.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:42:// Stage 3 (rerank) MAY overwrite `score` with the reranked value and MUST
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:45:// The canonical reranker output is `rerankerScore`; `score` is synced to it
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:264: * intentAdjustedScore → rrfScore → score → similarity/100, all clamped to [0,1].
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:275:    rrfScore: clamped,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:288:    row.rrfScore = clamped;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:654: * current composite score (`score`, then `rrfScore`, then `similarity`).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:988:      // so rrfScore/intentAdjustedScore are not stale for subsequent steps.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1266:          rrfScore: row.rrfScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1299:  // Overall pipeline limit. Apply it here so Stage 3 reranks a pre-trimmed set.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:16://     - No score field (similarity, score, rrfScore, intentAdjustedScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:207: * A1 FIX: Previously used a different precedence order (rrfScore first) and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:12:// Input:  PipelineConfig (query, embedding, limits, flags, intent, session)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:15://     - results are scored by Stage 2, reranked by Stage 3, filtered by Stage 4
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:35:import { executeStage3 } from './stage3-rerank.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:131:      reranked: stage2Result.scored,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:133:        rerankApplied: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:152:        results: stage3Result.reranked as Stage4ReadonlyRow[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:165:      final: stage3Result.reranked as Stage4ReadonlyRow[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:7:// This stage avoids downstream fusion/reranking, but may apply temporal
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:12://   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:33://     - Generates query embeddings via the embeddings provider (external call)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:39:import * as embeddings from '../../providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:44:import { expandQueryWithEmbeddings, isExpansionActive } from '../embedding-expansion.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:82:/** Number of similar memories to mine for R12 embedding-based query expansion terms. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:354: * rule-based expansion is skipped — consistent with the R12 embedding-expansion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:463: * This stage does not apply Stage 2 fusion/reranking signals. Vector-channel
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:472:  // Fix #16: Cache embedding at function scope for reuse in constitutional injection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:581:    // Generate one embedding per concept
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:584:      const emb = await embeddings.generateQueryEmbedding(concept);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:587:          `[stage1-candidate-gen] Failed to generate embedding for concept: "${concept}"`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:605:    // Resolve the query embedding — either pre-computed in config or generate now
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:606:    // Fix #16 — Cache this embedding for reuse in constitutional injection path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:609:      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:613:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:661:                  const facetEmbedding = await embeddings.generateQueryEmbedding(q);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:663:                    console.warn('[stage1-candidate-gen] D2 facet embedding generation returned null');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:724:                const variantEmbedding = await embeddings.generateQueryEmbedding(variant);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:726:                  console.warn('[stage1-candidate-gen] Deep variant embedding generation returned null');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:784:      // We expand the query using embedding similarity to find related terms
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:822:              embeddings.generateQueryEmbedding(expanded.combinedQuery).then(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:825:                    console.warn('[stage1-candidate-gen] Expanded query embedding generation returned null');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:855:                channel: 'r12-embedding-expansion',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:864:            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:888:          // Fallback: pure vector search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:923:      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:926:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for vector search query');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:963:  // For vector search, tier/contextType were already passed to vectorSearch,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1011:  // In the current candidate set, fetch them separately via vector search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1012:  // They enter the pipeline here so all subsequent stages (scoring, reranking)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1026:      // Fix #16 — Reuse cached embedding instead of generating a new one
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1028:        cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1048:        // via vector search bypass the earlier governance/context gate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1080:  //   1. Retrieve top-3 seed results via fast BM25/FTS5 (no embedding call).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1096:          cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1103:              // Reuse cached embedding for original query (idx 0); generate fresh for variants
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1104:              const emb = idx === 0 ? reformEmbedding : await embeddings.generateQueryEmbedding(q);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1106:                console.warn('[stage1-candidate-gen] LLM reform embedding generation returned null');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1169:  //   - Run a vector-only search with the pseudo-document embedding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1216:  // Met (>5000 indexed), run a parallel search on summary embeddings and merge
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1217:  // Results. Pattern follows R12 embedding expansion: run in parallel, merge
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1224:          queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1279:                  channel: 'r8-summary-embeddings',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1345:                rrfScore: boostedScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:42:  rrfScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:61: * function uses the correct chain: intentAdjustedScore → rrfScore → score → similarity/100,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:67:  if (typeof row.rrfScore === 'number' && Number.isFinite(row.rrfScore))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:68:    return Math.max(0, Math.min(1, row.rrfScore));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:82:  'similarity' | 'score' | 'importance_weight' | 'rrfScore' | 'intentAdjustedScore' | 'attentionScore'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:144:  rerank: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:261: * Cross-encoder reranking, MMR diversity enforcement, MPAB chunk-to-memory aggregation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:270: * Stage 3 output containing reranked rows and reranking metadata.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:273:  reranked: PipelineRow[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:275:    rerankApplied: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:352: * Executor signature for Stage 3 reranking and aggregation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:371:  rrfScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:385:    rrfScore: r.rrfScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:419:    if (row.rrfScore !== snap.rrfScore) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:421:        `[Stage4Invariant] Score mutation detected: id=${snap.id} rrfScore changed from ${snap.rrfScore} to ${row.rrfScore}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:7:// 1. Cross-encoder reranking   — re-scores results via neural model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:17:// Output: Stage3Output { reranked: PipelineRow[], metadata }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:19://     - reranked is sorted descending by effective score after all steps
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:30:import * as crossEncoder from '../cross-encoder.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:31:import { rerankLocal } from '../local-reranker.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:34:import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:35:import type { MMRCandidate } from '@spec-kit/shared/algorithms/mmr-reranker';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49:/** Minimum number of results required before cross-encoder is worth invoking. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:58:/** Column order priority for assembling display text sent to cross-encoder. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:62: * Enforce non-negative score outputs at Stage 3 rerank boundaries.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:78: * Document format consumed by the cross-encoder reranker.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:79: * Matches the RerankDocument interface in cross-encoder.ts:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:116:type RerankProvider = 'cross-encoder' | 'local-gguf' | 'fallback-sort' | 'none';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:123: * Applies cross-encoder reranking (if enabled) and then collapses
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:125: * is intentional: cross-encoder scores are computed on the raw chunks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:130: * @returns Stage 3 output with reranked, aggregated results and metadata.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:137:  let rerankApplied = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:138:  let rerankProvider: RerankProvider = 'none';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:140:  // -- Step 1: Cross-encoder reranking ---------------------------
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:141:  const rerankStart = Date.now();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:146:  const rerankResult = await applyCrossEncoderReranking(config.query, results, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:147:    rerank: config.rerank,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:151:  results = rerankResult.rows;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:152:  rerankApplied = rerankResult.applied;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:153:  rerankProvider = rerankResult.provider;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:158:      'rerank',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:161:      Date.now() - rerankStart,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:162:      { rerankApplied, provider: rerankProvider }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:167:  // Gated behind SPECKIT_MMR feature flag. Retrieves embeddings from
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:180:          `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:181:        ) as Database.Statement).all(...numericIds) as Array<{ rowid: number; embedding: Buffer }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:183:        const embeddingMap = new Map<number, Float32Array>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:185:          if (Buffer.isBuffer(row.embedding)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:186:            embeddingMap.set(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:188:              new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:195:          const emb = embeddingMap.get(r.id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:201:              embedding: emb,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:213:          // FIX #5: MMR can only diversify rows that have embeddings. Non-embedded
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:214:          // rows (lexical-only hits, graph injections) must be preserved and merged
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:242:      console.warn(`[stage3-rerank] MMR diversity pruning failed: ${toErrorMessage(mmrErr)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:275:    rerankApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:276:    rerankProvider,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:282:    reranked: results,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:290: * Apply cross-encoder reranking to a list of pipeline results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:293: *   - The `rerank` option is not set
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:297: * On any reranker error, logs a warning and returns the original
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:303: * @returns Object with reranked rows, whether reranking was applied, and the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:304: * reranker path that executed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:310:    rerank: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:316:  if (!options.rerank || !isCrossEncoderEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:326:  // After reranking (the cross-encoder only knows about id + text + score).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:332:  // Local GGUF reranker path (P1-5): RERANKER_LOCAL=true
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:333:  // On any failure/unavailable precondition, rerankLocal returns original rows unchanged.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:336:      const localReranked = await rerankLocal(query, results, options.limit);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:343:        const rerankScoreRaw = row.rerankerScore ?? row.score;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:344:        const rerankScore = resolveRerankOutputScore(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:345:          rerankScoreRaw,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:353:          score: rerankScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:355:          rerankerScore: rerankScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:356:          // F2.02 fix: Sync all score aliases for local reranker path too.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:357:          rrfScore: rerankScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:358:          intentAdjustedScore: rerankScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:366:        `[stage3-rerank] Local reranking failed: ${toErrorMessage(err)} — returning original results`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:372:  // Map PipelineRow → RerankDocument (uses `content` field per cross-encoder interface)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:382:    // The cross-encoder module's internal RerankDocument but declared separately.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:383:    const reranked = await crossEncoder.rerankResults(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:385:      documents as unknown as Parameters<typeof crossEncoder.rerankResults>[1],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:393:    const rerankProvider: RerankProvider = reranked.some(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:397:      : 'cross-encoder';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:399:    // Re-map reranked results back to PipelineRow, preserving all original
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:400:    // Fields and updating only the score-related values from the reranker.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:401:    const rerankedRows: PipelineRow[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:402:    for (const rerankResult of reranked) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:403:      const original = rowMap.get(rerankResult.id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:405:        // Defensive: reranker returned an unknown id — skip it
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:408:      const rerankScore = resolveRerankOutputScore(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:409:        rerankResult.rerankerScore ?? rerankResult.score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:412:      rerankedRows.push({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:416:        score: rerankScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:418:        rerankerScore: rerankScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:420:        // the reranked value instead of stale Stage 2 values.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:421:        rrfScore: rerankScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:422:        intentAdjustedScore: rerankScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:427:    return { rows: rerankedRows, applied: true, provider: rerankProvider };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:429:    // Graceful degradation — return original results on any reranker failure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:431:      `[stage3-rerank] Cross-encoder reranking failed: ${toErrorMessage(err)} — returning original results`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:433:    return { rows: results, applied: false, provider: 'cross-encoder' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:438: * Resolve the content string used for cross-encoder scoring for a given row.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:443: * to the cross-encoder module.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:446: * @returns Content string for the cross-encoder.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:475: * @param results - Scored pipeline rows from (optionally reranked) Stage 3.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:577: * and rrfScore before raw score/similarity, matching Stage 2's
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:649:      rrfScore: parentScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:666:      `[stage3-rerank] MPAB DB reassembly failed for parent ${parentId}: ${toErrorMessage(err)} — using chunk fallback`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:693:    rrfScore: parentScore,

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
CocoIndex wasn’t usable in this session, so I’m falling back exactly the way the phase brief allows: targeted `rg` plus direct file reads. I’m using that fallback to inspect the actual SQL and ranking flow, including whether prompt FTS participates in search or stays isolated from the main retrieval path.
exec
/bin/zsh -lc 'nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | rg -n "SearchPrompts|prompts_fts|FormatContext|RecentPrompts|RecentSessions|SearchOptions|MaxSearchResults|NormalizeProject|normalizeScope"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
105:   105	type SearchOptions struct {
245:   245		MaxSearchResults     int
258:   258			MaxSearchResults:     20,
271:   271			MaxSearchResults:     20,
501:   501			CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
679:   679					INSERT INTO prompts_fts(rowid, content, project)
684:   684					INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
689:   689					INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
691:   691					INSERT INTO prompts_fts(rowid, content, project)
756:   756		project, _ = NormalizeProject(project)
818:   818	func (s *Store) RecentSessions(project string, limit int) ([]SessionSummary, error) {
820:   820		project, _ = NormalizeProject(project)
920:   920			args = append(args, normalizeScope(scope))
950:   950		p.Project, _ = NormalizeProject(p.Project)
959:   959		scope := normalizeScope(p.Scope)
1078:  1078		project, _ = NormalizeProject(project)
1098:  1098			args = append(args, normalizeScope(scope))
1111:  1111		p.Project, _ = NormalizeProject(p.Project)
1145:  1145	func (s *Store) RecentPrompts(project string, limit int) ([]Prompt, error) {
1147:  1147		project, _ = NormalizeProject(project)
1181:  1181	func (s *Store) SearchPrompts(query string, project string, limit int) ([]Prompt, error) {
1190:  1190			FROM prompts_fts fts
1192:  1192			WHERE prompts_fts MATCH ?
1268:  1268				project, _ = NormalizeProject(*p.Project)
1271:  1271				scope = normalizeScope(*p.Scope)
1462:  1462	func (s *Store) Search(query string, opts SearchOptions) ([]SearchResult, error) {
1464:  1464		opts.Project, _ = NormalizeProject(opts.Project)
1470:  1470		if limit > s.cfg.MaxSearchResults {
1471:  1471			limit = s.cfg.MaxSearchResults
1494:  1494				tkArgs = append(tkArgs, normalizeScope(opts.Scope))
1543:  1543			args = append(args, normalizeScope(opts.Scope))
1613:  1613	func (s *Store) FormatContext(project, scope string) (string, error) {
1614:  1614		sessions, err := s.RecentSessions(project, 5)
1624:  1624		prompts, err := s.RecentPrompts(project, 10)
1778:  1778				normalizeScope(obs.Scope),
2460:  2460		canonical, _ = NormalizeProject(canonical)
2469:  2469				src, _ = NormalizeProject(src)
2906:  2906				payload.SyncID, payload.SessionID, payload.Type, payload.Title, payload.Content, payload.ToolName, payload.Project, normalizeScope(payload.Scope), payload.TopicKey, hashNormalized(payload.Content),
2917:  2917			payload.SessionID, payload.Type, payload.Title, payload.Content, payload.ToolName, payload.Project, normalizeScope(payload.Scope), payload.TopicKey, hashNormalized(payload.Content), existing.ID,
3166:  3166	func normalizeScope(scope string) string {
3174:  3174	// NormalizeProject applies canonical project name normalization:
3179:  3179	func NormalizeProject(project string) (normalized string, warning string) {
3485:  3485		p.Project, _ = NormalizeProject(p.Project)

exec
/bin/zsh -lc "sed -n '1160,1225p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

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
}

func (s *Store) SearchPrompts(query string, project string, limit int) ([]Prompt, error) {
	if limit <= 0 {
		limit = 10
	}

	ftsQuery := sanitizeFTS(query)

	sql := `
		SELECT p.id, ifnull(p.sync_id, '') as sync_id, p.session_id, p.content, ifnull(p.project, '') as project, p.created_at
		FROM prompts_fts fts
		JOIN user_prompts p ON p.id = fts.rowid
		WHERE prompts_fts MATCH ?
	`
	args := []any{ftsQuery}

	if project != "" {
		sql += " AND p.project = ?"
		args = append(args, project)
	}

	sql += " ORDER BY fts.rank LIMIT ?"
	args = append(args, limit)

	rows, err := s.queryItHook(s.db, sql, args...)
	if err != nil {
		return nil, fmt.Errorf("search prompts: %w", err)
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
}

// ─── Get Single Observation ──────────────────────────────────────────────────

func (s *Store) GetObservation(id int64) (*Observation, error) {
	row := s.db.QueryRow(
		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,

exec
/bin/zsh -lc "sed -n '1600,1675p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

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

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Sqlite Fts
// ───────────────────────────────────────────────────────────────
// Feature catalog: Semantic and lexical search (memory_search)
// Weighted BM25 scoring for FTS5 full-text search.
// Extracted from hybrid-search.ts ftsSearch() for independent
// Testing and future delegation.

import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
import type Database from 'better-sqlite3';

// ───────────────────────────────────────────────────────────────
// 2. INTERFACES

// ───────────────────────────────────────────────────────────────
interface FtsBm25Result {
  id: number;
  fts_score: number;
  [key: string]: unknown;
}

interface FtsBm25Options {
  limit?: number;
  specFolder?: string;
  includeArchived?: boolean;
}

type LexicalPath = 'fts5' | 'like' | 'unavailable';
type FallbackState =
  | 'ok'
  | 'compile_probe_miss'
  | 'missing_table'
  | 'no_such_module_fts5'
  | 'bm25_runtime_failure';

interface LexicalCapabilitySnapshot {
  lexicalPath: LexicalPath;
  fallbackState: FallbackState;
}

let lastLexicalCapabilitySnapshot: LexicalCapabilitySnapshot | null = null;

function cloneLexicalCapabilitySnapshot(
  snapshot: LexicalCapabilitySnapshot | null
): LexicalCapabilitySnapshot | null {
  return snapshot ? { ...snapshot } : null;
}

function setLastLexicalCapabilitySnapshot(snapshot: LexicalCapabilitySnapshot): void {
  lastLexicalCapabilitySnapshot = { ...snapshot };
}

function getLastLexicalCapabilitySnapshot(): LexicalCapabilitySnapshot | null {
  return cloneLexicalCapabilitySnapshot(lastLexicalCapabilitySnapshot);
}

function resetLastLexicalCapabilitySnapshot(): void {
  lastLexicalCapabilitySnapshot = null;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function readCompileOptionValue(row: unknown): string | null {
  if (typeof row === 'string') {
    return row;
  }
  if (!row || typeof row !== 'object') {
    return null;
  }

  const record = row as Record<string, unknown>;
  const direct = record.compile_options;
  if (typeof direct === 'string') {
    return direct;
  }

  const firstString = Object.values(record).find((value) => typeof value === 'string');
  return typeof firstString === 'string' ? firstString : null;
}

function isNoSuchModuleFts5Error(error: unknown): boolean {
  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
}

function isBm25RuntimeFailure(error: unknown): boolean {
  const message = toErrorMessage(error).toLowerCase();
  return message.includes('bm25');
}

function probeFts5Capability(db: Database.Database): LexicalCapabilitySnapshot {
  try {
    const compileRows = (db.prepare('PRAGMA compile_options') as Database.Statement).all() as unknown[];
    const hasFts5CompileFlag = compileRows
      .map(readCompileOptionValue)
      .some((value) => typeof value === 'string' && value.toUpperCase().includes('ENABLE_FTS5'));

    if (!hasFts5CompileFlag) {
      return {
        lexicalPath: 'unavailable',
        fallbackState: 'compile_probe_miss',
      };
    }
  } catch {
    return {
      lexicalPath: 'unavailable',
      fallbackState: 'compile_probe_miss',
    };
  }

  try {
    const result = (db.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
    ) as Database.Statement).get() as { name: string } | undefined;

    if (!result) {
      return {
        lexicalPath: 'unavailable',
        fallbackState: 'missing_table',
      };
    }
  } catch (error: unknown) {
    if (isNoSuchModuleFts5Error(error)) {
      return {
        lexicalPath: 'unavailable',
        fallbackState: 'no_such_module_fts5',
      };
    }
    return {
      lexicalPath: 'unavailable',
      fallbackState: 'missing_table',
    };
  }

  return {
    lexicalPath: 'fts5',
    fallbackState: 'ok',
  };
}

// ───────────────────────────────────────────────────────────────
// 3. CORE FUNCTION

// ───────────────────────────────────────────────────────────────
/**
 * Execute a weighted BM25 FTS5 search against memory_fts.
 *
 * Uses SQLite FTS5's built-in bm25() ranking function with
 * per-column weights instead of the default `rank` pseudo-column.
 * This gives title matches 10x weight, trigger_phrases 5x, etc.
 *
 * @param db - SQLite database connection
 * @param query - Raw search query (will be sanitized)
 * @param options - Search options (limit, specFolder, includeArchived)
 * @returns Array of results with BM25 scores (higher = better)
 * @example
 * ```ts
 * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
 * ```
 */
function fts5Bm25Search(
  db: Database.Database,
  query: string,
  options: FtsBm25Options = {}
): FtsBm25Result[] {
  const { limit = 20, specFolder, includeArchived = false } = options;

  // Sanitize via shared tokenizer, then wrap each token in quotes and join with OR for recall
  const tokens = normalizeLexicalQueryTokens(query).fts;
  const sanitized = tokens
    .map(t => (t.startsWith('"') && t.endsWith('"')) ? t : `"${t}"`)
    .join(' OR ');

  if (!sanitized) {
    setLastLexicalCapabilitySnapshot(probeFts5Capability(db));
    return [];
  }

  const folderFilter = specFolder
    ? 'AND (m.spec_folder = ? OR m.spec_folder LIKE ? || "/%")'
    : '';
  const archivalFilter = !includeArchived
    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
    : '';
  const deprecatedTierFilter =
    "AND (m.importance_tier IS NULL OR m.importance_tier != 'deprecated')";

  const params: (string | number)[] = specFolder
    ? [sanitized, specFolder, specFolder, limit]
    : [sanitized, limit];

  // Bm25() returns negative scores (lower = better), so we negate
  // To produce positive scores where higher = better match.
  const [w0, w1, w2, w3] = BM25_FTS5_WEIGHTS;
  const sql = `
    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
    FROM memory_fts
    JOIN memory_index m ON m.id = memory_fts.rowid
    WHERE memory_fts MATCH ?
      ${folderFilter}
      ${archivalFilter}
      ${deprecatedTierFilter}
    ORDER BY fts_score DESC
    LIMIT ?
  `;

  const capability = probeFts5Capability(db);
  setLastLexicalCapabilitySnapshot(capability);
  if (capability.fallbackState !== 'ok') {
    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
    return [];
  }

  try {
    const rows = (db.prepare(sql) as Database.Statement).all(
      ...params
    ) as Array<Record<string, unknown>>;

    const normalizedRows = rows.map(row => ({
      ...row,
      id: row.id as number,
      fts_score: (row.fts_score as number) || 0,
    }));
    setLastLexicalCapabilitySnapshot({
      lexicalPath: 'fts5',
      fallbackState: 'ok',
    });
    return normalizedRows;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const failureSnapshot: LexicalCapabilitySnapshot = isNoSuchModuleFts5Error(error)
      ? {
          lexicalPath: 'unavailable',
          fallbackState: 'no_such_module_fts5',
        }
      : isBm25RuntimeFailure(error)
        ? {
            lexicalPath: 'unavailable',
            fallbackState: 'bm25_runtime_failure',
          }
        : msg.toLowerCase().includes('no such table: memory_fts')
          ? {
              lexicalPath: 'unavailable',
              fallbackState: 'missing_table',
            }
          : {
              lexicalPath: 'unavailable',
              fallbackState: 'bm25_runtime_failure',
            };
    setLastLexicalCapabilitySnapshot(failureSnapshot);
    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
    return [];
  }
}

/**
 * Check if the memory_fts FTS5 virtual table exists in the database.
 *
 * Used as a feature-detect before calling fts5Bm25Search, since FTS5

exec
/bin/zsh -lc "sed -n '1000,1165p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    const evaluationMode = options.evaluationMode === true;
    const lists: HybridFusionExecution['lists'] = [];

    // Pipeline metadata collector (populated by flag-gated stages)
    const s3meta: Sprint3PipelineMeta = {};

    // -- Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
    // When enabled, classifies query complexity and restricts channels to a
    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
    const routeResult = routeQuery(query, options.triggerPhrases);
    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
    const activeChannels = options.forceAllChannels
      ? new Set<ChannelName>(allPossibleChannels)
      : new Set<ChannelName>(routeResult.channels);

    // Respect explicit caller channel disables across both the primary route and
    // every fallback tier. useGraph=false also disables the dependent degree lane.
    const allowedChannels = getAllowedChannels(options);
    for (const channel of allPossibleChannels) {
      if (!allowedChannels.has(channel)) activeChannels.delete(channel);
    }

    const skippedChannels = allPossibleChannels.filter(ch => !activeChannels.has(ch));

    if (skippedChannels.length > 0) {
      s3meta.routing = {
        tier: routeResult.tier,
        channels: routeResult.channels,
        skippedChannels,
        featureFlagEnabled: isComplexityRouterEnabled(),
        confidence: routeResult.classification.confidence,
        features: routeResult.classification.features as Record<string, unknown>,
      };
    }

    // -- Stage E: Dynamic Token Budget (SPECKIT_DYNAMIC_TOKEN_BUDGET) --
    // Compute tier-aware budget early so it's available for downstream truncation.
    // When disabled, getDynamicTokenBudget returns the default 4000 budget with applied=false.
    const budgetResult = getDynamicTokenBudget(routeResult.tier);
    if (budgetResult.applied && !evaluationMode) {
      s3meta.tokenBudget = {
        tier: budgetResult.tier,
        budget: budgetResult.budget,
        applied: budgetResult.applied,
        featureFlagEnabled: isDynamicTokenBudgetEnabled(),
        configValues: DEFAULT_TOKEN_BUDGET_CONFIG as unknown as Record<string, number>,
        // headerOverhead and adjustedBudget are patched in below after they are computed
        headerOverhead: 0,
        adjustedBudget: budgetResult.budget,
      };
    }

    // Channel results collected independently, merged after all complete
    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
    let ftsChannelResults: HybridSearchResult[] = [];
    let bm25ChannelResults: HybridSearchResult[] = [];
    const vectorEmbeddingCache = new Map<number, Float32Array>();

    // All channels use synchronous better-sqlite3; sequential execution
    // Is correct — Promise.all adds overhead without parallelism.

    // Vector channel — gated by query-complexity routing
    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
      try {
        const vectorResults = vectorSearchFn(embedding, {
          limit: options.limit || DEFAULT_LIMIT,
          specFolder: options.specFolder,
          minSimilarity: options.minSimilarity || 0,
          includeConstitutional: false,
          includeArchived: options.includeArchived || false,
          includeEmbeddings: true,
        });
        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
          ...r,
          id: r.id as number | string,
          source: 'vector',
        }));
        for (const result of semanticResults) {
          if (typeof result.id !== 'number') continue;
          const embeddingCandidate = toEmbeddingBufferView(
            (result as Record<string, unknown>).embedding
            ?? (result as Record<string, unknown>).embeddingBuffer
          );
          if (embeddingCandidate) {
            vectorEmbeddingCache.set(result.id, embeddingCandidate);
          }
        }
        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
      } catch (_err: unknown) {
        // Non-critical — vector channel failure does not block pipeline
        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
      }
    }

    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
    if (activeChannels.has('fts')) {
      ftsChannelResults = ftsSearch(query, options);
      if (ftsChannelResults.length > 0) {
        // FTS weight reduced to 0.3 after ablation showed 0.8 was harmful,
        // flooding top-K with noisy lexical matches despite its exact-match value.
        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
      }
    }

    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
    if (activeChannels.has('bm25')) {
      bm25ChannelResults = bm25Search(query, options);
      if (bm25ChannelResults.length > 0) {
        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
        // Has less precise scoring than SQLite FTS5 BM25; kept for coverage breadth.
        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
      }
    }

    // Graph channel — gated by query-complexity routing
    const useGraph = (options.useGraph !== false) && activeChannels.has('graph');
    if (useGraph && graphSearchFn) {
      try {
        graphMetrics.totalQueries++; // counted only if channel executes
        const graphResults = graphSearchFn(query, {
          limit: options.limit || DEFAULT_LIMIT,
          specFolder: options.specFolder,
          intent: options.intent,
        });
        if (graphResults.length > 0) {
          graphMetrics.graphHits++;
          lists.push({ source: 'graph', results: graphResults.map((r: Record<string, unknown>) => ({
            ...r,
            id: r.id as number | string,
          })), weight: 0.5 });
        }
      } catch (_err: unknown) {
        // Non-critical — graph channel failure does not block pipeline
        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
      }
    }

    // Degree channel re-ranks based on causal-edge connectivity.
    // Graduated: default-ON. Set SPECKIT_DEGREE_BOOST=false to disable.
    // Degree channel — also gated by query-complexity routing
    if (activeChannels.has('degree') && db && isDegreeBoostEnabled()) {
      try {
        // Collect all numeric IDs from existing channels
        const allResultIds = new Set<number>();
        for (const list of lists) {
          for (const r of list.results) {
            const id = r.id;
            if (typeof id === 'number') allResultIds.add(id);
          }
        }

        if (allResultIds.size > 0) {
          const degreeScores = computeDegreeScores(db, Array.from(allResultIds));

          // Build a ranked list sorted by degree score (highest first)
          const degreeItems: Array<{ id: number; degreeScore: number }> = [];
          for (const [idStr, score] of degreeScores) {
            const numId = Number(idStr);
            if (score > 0 && !isNaN(numId)) {
              degreeItems.push({ id: numId, degreeScore: score });
            }
          }
          degreeItems.sort((a, b) => b.degreeScore - a.degreeScore);

          if (degreeItems.length > 0) {
            lists.push({

exec
/bin/zsh -lc "sed -n '1380,1468p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
codex
I’ve got the main contrast now: Engram’s search path is intentionally thin and predictable, while ours is a layered retrieval pipeline with channel routing, fusion, and reranking. I’m tightening the evidence around the Public side next, especially the precise lexical weighting and the reranker/MMR stages, so the final recommendations can cleanly separate “copy this” from “we already exceed this.”
exec
/bin/zsh -lc 'wc -l /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     723 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts

exec
/bin/zsh -lc "sed -n '130,245p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
 * @returns Stage 3 output with reranked, aggregated results and metadata.
 */
export async function executeStage3(input: Stage3Input): Promise<Stage3Output> {
  const stageStart = Date.now();
  const { scored, config } = input;

  let results = scored;
  let rerankApplied = false;
  let rerankProvider: RerankProvider = 'none';

  // -- Step 1: Cross-encoder reranking ---------------------------
  const rerankStart = Date.now();
  const beforeRerank = results.length;

  // Destructure { rows, applied } — dedicated boolean flag replaces
  // Fragile reference inequality check `results !== scored` (A1-P2-3)
  const rerankResult = await applyCrossEncoderReranking(config.query, results, {
    rerank: config.rerank,
    applyLengthPenalty: config.applyLengthPenalty,
    limit: config.limit,
  });
  results = rerankResult.rows;
  rerankApplied = rerankResult.applied;
  rerankProvider = rerankResult.provider;

  if (config.trace) {
    addTraceEntry(
      config.trace,
      'rerank',
      beforeRerank,
      results.length,
      Date.now() - rerankStart,
      { rerankApplied, provider: rerankProvider }
    );
  }

  // -- Step 2: MMR diversity pruning ----------------------------
  // Gated behind SPECKIT_MMR feature flag. Retrieves embeddings from
  // Vec_memories and applies Maximal Marginal Relevance to diversify
  // The result set, matching the V1 hybrid-search behavior.
  if (isMMREnabled() && results.length >= MMR_MIN_CANDIDATES) {
    try {
      const db = requireDb() as Database.Database;
      const numericIds = results
        .map(r => r.id)
        .filter((id): id is number => typeof id === 'number');

      if (numericIds.length >= MMR_MIN_CANDIDATES) {
        const placeholders = numericIds.map(() => '?').join(', ');
        const embRows = (db.prepare(
          `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
        ) as Database.Statement).all(...numericIds) as Array<{ rowid: number; embedding: Buffer }>;

        const embeddingMap = new Map<number, Float32Array>();
        for (const row of embRows) {
          if (Buffer.isBuffer(row.embedding)) {
            embeddingMap.set(
              row.rowid,
              new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
            );
          }
        }

        const mmrCandidates: MMRCandidate[] = [];
        for (const r of results) {
          const emb = embeddingMap.get(r.id);
          if (emb) {
            mmrCandidates.push({
              id: r.id,
              // Use effectiveScore() for consistent fallback chain
              score: floorScore(effectiveScore(r)),
              embedding: emb,
            });
          }
        }

        if (mmrCandidates.length >= MMR_MIN_CANDIDATES) {
          const originalPositionMap = new Map<number | string, number>();
          results.forEach((row, index) => originalPositionMap.set(row.id, index));
          const intent = config.detectedIntent ?? '';
          const mmrLambda = (INTENT_LAMBDA_MAP as Record<string, number>)[intent] ?? MMR_DEFAULT_LAMBDA;
          const diversified = applyMMR(mmrCandidates, { lambda: mmrLambda, limit: config.limit });

          // FIX #5: MMR can only diversify rows that have embeddings. Non-embedded
          // rows (lexical-only hits, graph injections) must be preserved and merged
          // back in their original relative order instead of being silently dropped.
          const embeddedIdSet = new Set(mmrCandidates.map(c => c.id));
          const nonEmbeddedRows = results.filter(r => !embeddedIdSet.has(r.id));

          // Rebuild PipelineRow[] from diversified candidates, preserving all original fields
          const rowMap = new Map<number | string, PipelineRow>();
          for (const r of results) rowMap.set(r.id, r);

          const diversifiedRows = diversified.map((candidate): PipelineRow => {
            const existing = rowMap.get(candidate.id);
            if (existing) return existing;
            return { id: candidate.id as number, score: candidate.score };
          });

          const positioned: Array<{ row: PipelineRow; pos: number }> = [];
          diversifiedRows.forEach((row, index) => positioned.push({ row, pos: index }));
          nonEmbeddedRows.forEach((row) => {
            const originalPosition = originalPositionMap.get(row.id) ?? results.length;
            positioned.push({ row, pos: originalPosition });
          });

          positioned.sort((left, right) => left.pos - right.pos);
          results = positioned.map(({ row }) => row);
        }
      }
    } catch (mmrErr: unknown) {
      // Non-critical — MMR failure does not block pipeline
      console.warn(`[stage3-rerank] MMR diversity pruning failed: ${toErrorMessage(mmrErr)}`);
    }
  }


exec
/bin/zsh -lc "sed -n '300,435p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
 * @param query       - The user's search query string.
 * @param results     - Pipeline rows from Stage 2 fusion.
 * @param options     - Rerank configuration flags.
 * @returns Object with reranked rows, whether reranking was applied, and the
 * reranker path that executed.
 */
async function applyCrossEncoderReranking(
  query: string,
  results: PipelineRow[],
  options: {
    rerank: boolean;
    applyLengthPenalty: boolean;
    limit: number;
  }
): Promise<{ rows: PipelineRow[]; applied: boolean; provider: RerankProvider }> {
  // Feature-flag guard
  if (!options.rerank || !isCrossEncoderEnabled()) {
    return { rows: results, applied: false, provider: 'none' };
  }

  // Minimum-document guard
  if (results.length < MIN_RESULTS_FOR_RERANK) {
    return { rows: results, applied: false, provider: 'none' };
  }

  // Build a lookup map so we can restore all original PipelineRow fields
  // After reranking (the cross-encoder only knows about id + text + score).
  const rowMap = new Map<string | number, PipelineRow>();
  for (const row of results) {
    rowMap.set(row.id, row);
  }

  // Local GGUF reranker path (P1-5): RERANKER_LOCAL=true
  // On any failure/unavailable precondition, rerankLocal returns original rows unchanged.
  if (isLocalRerankerEnabled()) {
    try {
      const localReranked = await rerankLocal(query, results, options.limit);
      if (localReranked === results) {
        return { rows: results, applied: false, provider: 'local-gguf' };
      }

      const localRows: PipelineRow[] = localReranked.map((row) => {
        const original = rowMap.get(row.id);
        const rerankScoreRaw = row.rerankerScore ?? row.score;
        const rerankScore = resolveRerankOutputScore(
          rerankScoreRaw,
          original ? effectiveScore(original) : 0,
        );

        return {
          ...(original ?? row),
          ...row,
          stage2Score: original?.score,
          score: rerankScore,
          similarity: original?.similarity ?? row.similarity,
          rerankerScore: rerankScore,
          // F2.02 fix: Sync all score aliases for local reranker path too.
          rrfScore: rerankScore,
          intentAdjustedScore: rerankScore,
          attentionScore: original?.attentionScore ?? row.attentionScore,
        };
      });

      return { rows: localRows, applied: true, provider: 'local-gguf' };
    } catch (err: unknown) {
      console.warn(
        `[stage3-rerank] Local reranking failed: ${toErrorMessage(err)} — returning original results`
      );
      return { rows: results, applied: false, provider: 'local-gguf' };
    }
  }

  // Map PipelineRow → RerankDocument (uses `content` field per cross-encoder interface)
  // P1-015: Use effectiveScore() for consistent fallback chain
  const documents: RerankDocument[] = results.map((row) => ({
    id: row.id,
    content: resolveDisplayText(row),
    score: floorScore(effectiveScore(row)),
  }));

  try {
    // Cast through unknown: our local RerankDocument is structurally equivalent to
    // The cross-encoder module's internal RerankDocument but declared separately.
    const reranked = await crossEncoder.rerankResults(
      query,
      documents as unknown as Parameters<typeof crossEncoder.rerankResults>[1],
      {
        limit: options.limit,
        useCache: true,
        applyLengthPenalty: options.applyLengthPenalty,
      }
    );

    const rerankProvider: RerankProvider = reranked.some(
      (result) => result.scoringMethod === 'fallback'
    )
      ? 'fallback-sort'
      : 'cross-encoder';

    // Re-map reranked results back to PipelineRow, preserving all original
    // Fields and updating only the score-related values from the reranker.
    const rerankedRows: PipelineRow[] = [];
    for (const rerankResult of reranked) {
      const original = rowMap.get(rerankResult.id);
      if (!original) {
        // Defensive: reranker returned an unknown id — skip it
        continue;
      }
      const rerankScore = resolveRerankOutputScore(
        rerankResult.rerankerScore ?? rerankResult.score,
        effectiveScore(original),
      );
      rerankedRows.push({
        ...original,
        // P1-015: Preserve Stage 2 composite score for auditability
        stage2Score: original.score,
        score: rerankScore,
        similarity: original.similarity,
        rerankerScore: rerankScore,
        // F2.02 fix: Sync all score aliases so resolveEffectiveScore() returns
        // the reranked value instead of stale Stage 2 values.
        rrfScore: rerankScore,
        intentAdjustedScore: rerankScore,
        attentionScore: original.attentionScore,
      });
    }

    return { rows: rerankedRows, applied: true, provider: rerankProvider };
  } catch (err: unknown) {
    // Graceful degradation — return original results on any reranker failure
    console.warn(
      `[stage3-rerank] Cross-encoder reranking failed: ${toErrorMessage(err)} — returning original results`
    );
    return { rows: results, applied: false, provider: 'cross-encoder' };
  }
}

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Hybrid Search
// ───────────────────────────────────────────────────────────────
// Combines vector, FTS, and BM25 search with fallback

// 1. IMPORTS

// Local
import { getIndex, isBm25Enabled } from './bm25-index.js';
import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import { getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
import { CO_ACTIVATION_CONFIG, spreadActivation } from '../cognitive/co-activation.js';
import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
import { INTENT_LAMBDA_MAP, classifyIntent } from './intent-classifier.js';
import { fts5Bm25Search } from './sqlite-fts.js';
import { DEGREE_CHANNEL_WEIGHT } from './graph-search-fn.js';
import {
  isMMREnabled,
  isCrossEncoderEnabled,
  isLocalRerankerEnabled,
  isSearchFallbackEnabled,
  isDocscoreAggregationEnabled,
  isDegreeBoostEnabled,
  isContextHeadersEnabled,
} from './search-flags.js';
import { rerankLocal } from './local-reranker.js';
import { computeDegreeScores } from './graph-search-fn.js';
import type { GraphSearchFn } from './search-types.js';

// Feature catalog: Hybrid search pipeline

export type { GraphSearchFn } from './search-types.js';

import { routeQuery } from './query-router.js';
import { isComplexityRouterEnabled } from './query-classifier.js';
import { enforceChannelRepresentation } from './channel-enforcement.js';
import {
  truncateByConfidence,
  isConfidenceTruncationEnabled,
  DEFAULT_MIN_RESULTS,
  GAP_THRESHOLD_MULTIPLIER,
} from './confidence-truncation.js';
import {
  getDynamicTokenBudget,
  isDynamicTokenBudgetEnabled,
  DEFAULT_TOKEN_BUDGET_CONFIG,
} from './dynamic-token-budget.js';
import { ensureDescriptionCache, getSpecsBasePaths } from './folder-discovery.js';
import {
  isFolderScoringEnabled,
  lookupFolders,
  computeFolderRelevanceScores,
  enrichResultsWithFolderScores,
  twoPhaseRetrieval,
} from './folder-relevance.js';

import { collapseAndReassembleChunkResults } from '../scoring/mpab-aggregation.js';

// Type-only
import type Database from 'better-sqlite3';
import type { SpreadResult } from '../cognitive/co-activation.js';
import type { MMRCandidate } from '@spec-kit/shared/algorithms/mmr-reranker';
import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { ChannelName } from './query-router.js';
import type { EnforcementResult } from './channel-enforcement.js';
import type { TruncationResult } from './confidence-truncation.js';

// 2. INTERFACES

type VectorSearchFn = (
  embedding: Float32Array | number[],
  options: Record<string, unknown>
) => Array<Record<string, unknown>>;

interface HybridSearchOptions {
  limit?: number;
  specFolder?: string;
  minSimilarity?: number;
  useBm25?: boolean;
  useFts?: boolean;
  useVector?: boolean;
  useGraph?: boolean;
  includeArchived?: boolean;
  includeContent?: boolean;
  /**
   * Evaluation-only mode.
   * When true, preserve the requested top-K window by bypassing confidence
   * truncation and token-budget truncation without changing live defaults.
   */
  evaluationMode?: boolean;
  /** Classified query intent for adaptive fusion weight selection (e.g. 'understand', 'fix_bug'). */
  intent?: string;
  /** Optional trigger phrases for query-classifier trigger-match routing path. */
  triggerPhrases?: string[];
  /**
   * Internal fallback override: when true, bypass complexity routing and
   * enable all retrieval channels for this search call.
   */
  forceAllChannels?: boolean;
  /**
   * Internal raw-candidate mode used by the Stage 1 pipeline.
   * When true, stop after channel collection and return pre-fusion candidates.
   */
  skipFusion?: boolean;
  /**
   * Internal pipeline handoff mode.
   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
   * apply the remaining pipeline scoring and aggregation steps.
   */
  stopAfterFusion?: boolean;
}

interface HybridSearchResult {
  id: number | string;
  /**
   * Normalized relevance score (0-1). Semantics depend on `source`:
   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
   * - `'graph'` — graph traversal relevance
   *
   * After hybrid merge, all source scores are min-max normalized to 0-1 within
   * their source group to ensure fair cross-method comparison (see P3-02 fix).
   */
  score: number;
  source: string;
  title?: string;
  [key: string]: unknown;
}

/** Non-enumerable shadow metadata attached to result arrays via Object.defineProperty. */
interface ShadowMetaArray {
  _s4shadow?: unknown;
  _s4attribution?: unknown;
  _degradation?: unknown;
}

/** Normalize a fused RRF result to the HybridSearchResult contract. */
function toHybridResult(result: FusionResult): HybridSearchResult {
  const sourceCandidate = (result as { source?: unknown }).source;
  const primarySource = result.sources[0] ?? 'hybrid';
  const scoreCandidate = (result as { score?: unknown }).score;

  return {
    ...result,
    id: result.id,
    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
    source: typeof sourceCandidate === 'string' ? sourceCandidate : primarySource,
  };
}

// 3. SPRINT 3 PIPELINE METADATA

/**
 * Optional metadata about pipeline stages attached to enhanced search results.
 * Only populated when the corresponding feature flags are enabled.
 */
interface Sprint3PipelineMeta {
  /** Query complexity routing result (SPECKIT_COMPLEXITY_ROUTER). */
  routing?: {
    tier: string;
    channels: string[];
    skippedChannels: string[];
    featureFlagEnabled: boolean;
    confidence: string;
    features: Record<string, unknown>;
  };
  /** Channel enforcement result (SPECKIT_CHANNEL_MIN_REP). */
  enforcement?: { applied: boolean; promotedCount: number; underRepresentedChannels: string[] };
  /** Confidence truncation result (SPECKIT_CONFIDENCE_TRUNCATION). */
  truncation?: {
    truncated: boolean;
    originalCount: number;
    truncatedCount: number;
    medianGap: number;
    cutoffGap: number;
    cutoffIndex: number;
    thresholdMultiplier: number;
    minResultsGuaranteed: number;
    featureFlagEnabled: boolean;
  };
  /** Dynamic token budget result (SPECKIT_DYNAMIC_TOKEN_BUDGET). */
  tokenBudget?: {
    tier: string;
    budget: number;
    applied: boolean;
    featureFlagEnabled: boolean;
    configValues: Record<string, number>;
    headerOverhead: number;
    adjustedBudget: number;
  };
}

// 4. PI-A2: DEGRADATION TYPES

/** Fallback tier in the 3-tier degradation chain. */
type FallbackTier = 1 | 2 | 3;

/** Why degradation was triggered at a given tier. */
interface DegradationTrigger {
  reason: 'low_quality' | 'insufficient_results' | 'both';
  topScore: number;
  resultCount: number;
  relativeGap?: number;
}

/** Record of a single degradation event during tiered fallback. */
interface DegradationEvent {
  tier: FallbackTier;
  trigger: DegradationTrigger;
  resultCountBefore: number;
  resultCountAfter: number;
}

/**
 * Absolute quality floor for degradation checks.
 *
 * Raw RRF scores are typically small decimals (often <0.05), so a
 * high fixed threshold causes false degradations. Use a conservative floor and
 * pair it with a relative-gap check to avoid score-scale coupling.

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Stage1 Candidate Gen
// ───────────────────────────────────────────────────────────────
// 4-stage retrieval pipeline architecture
//
// Responsibility: Execute search channels and collect raw candidate results.
// This stage avoids downstream fusion/reranking, but may apply temporal
// Contiguity to raw vector-channel hits before later pipeline stages.
// Results are collected from the appropriate search channel based on search type.
//
// Search channels handled:
//   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
//   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
//   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
// Suppressed when R15 classifies query as "simple" (mutual exclusion)
//   - hybrid: collectRawCandidates → falls back to vector on failure
//   - vector: Direct vectorSearch
//
// Post-channel operations:
//   - Constitutional memory injection (if not already present)
//   - Quality score filtering
//   - Tier and contextType filtering
//
// I/O CONTRACT:
// Input:  Stage1Input { config: PipelineConfig }
// Output: Stage1Output { candidates: PipelineRow[], metadata }
// Key invariants:
//     - candidates contains raw channel scores; vector hits may include an
//       optional temporal-contiguity boost applied before downstream fusion
//     - Constitutional rows are always present when includeConstitutional=true and no tier filter
//     - All rows pass qualityThreshold (if set) and tier/contextType filters
// Side effects:
//     - Generates query embeddings via the embeddings provider (external call)
//     - Reads from the vector index and FTS5 / BM25 index (DB reads only)
//
import type { Stage1Input, Stage1Output, PipelineRow } from './types.js';
import { resolveEffectiveScore } from './types.js';
import * as vectorIndex from '../vector-index.js';
import * as embeddings from '../../providers/embeddings.js';
import * as hybridSearch from '../hybrid-search.js';
import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
import { isMultiQueryEnabled, isEmbeddingExpansionEnabled, isMemorySummariesEnabled, isQueryDecompositionEnabled, isGraphConceptRoutingEnabled, isLlmReformulationEnabled, isHyDEEnabled, isQuerySurrogatesEnabled, isTemporalContiguityEnabled, isQueryConceptExpansionEnabled } from '../search-flags.js';
import { expandQuery } from '../query-expander.js';
import { expandQueryWithEmbeddings, isExpansionActive } from '../embedding-expansion.js';
import { querySummaryEmbeddings, checkScaleGate } from '../memory-summaries.js';
import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
import { requireDb } from '../../../utils/db-helpers.js';
import { filterRowsByScope, isScopeEnforcementEnabled } from '../../governance/scope-governance.js';
import { getAllowedSharedSpaceIds } from '../../collab/shared-spaces.js';
import { withTimeout } from '../../errors/core.js';
import { computeBackfillQualityScore } from '../../validation/save-quality-gate.js';
import {
  isMultiFacet,
  decompose,
  mergeByFacetCoverage as mergeFacetCoveragePools,
  MAX_FACETS,
} from '../query-decomposer.js';
import { routeQueryConcepts, nounPhrases, getConceptExpansionTerms } from '../entity-linker.js';
import { cheapSeedRetrieve, llm, fanout } from '../llm-reformulation.js';
import { runHyDE } from '../hyde.js';
import { matchSurrogates } from '../query-surrogates.js';
import { loadSurrogatesBatch } from '../surrogate-storage.js';

// Feature catalog: 4-stage pipeline architecture
// Feature catalog: Hybrid search pipeline


// -- Constants --

/** Maximum number of deep-mode query variants to generate (original + expanded). */
const MAX_DEEP_QUERY_VARIANTS = 3;

/** F1: Deep-mode expansion timeout — fall back to base query if variants take too long. */
const DEEP_EXPANSION_TIMEOUT_MS = 5000;

/** Minimum cosine similarity for multi-concept search. */
const MULTI_CONCEPT_MIN_SIMILARITY = 0.5;

/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
const CONSTITUTIONAL_INJECT_LIMIT = 5;

/** Number of similar memories to mine for R12 embedding-based query expansion terms. */
const DEFAULT_EXPANSION_CANDIDATE_LIMIT = 5;

/** D2: Timeout for facet decomposition parallel searches (ms). */
const DECOMPOSITION_TIMEOUT_MS = 5000;
const MAX_QUERY_DECOMPOSITION_FACETS = MAX_FACETS;

// -- Helper Functions --

/**
 * Filter results by a minimum quality score threshold.
 *
 * - If no threshold is provided or it is not a finite number, all results pass.
 * - Threshold is clamped to [0, 1].
 * - Rows with a missing or non-finite `quality_score` are treated as 0.
 *
 * @param results - Candidate rows to filter.
 * @param threshold - Minimum quality score in [0, 1] (inclusive).
 * @returns Filtered array; original array returned unchanged when no threshold applies.
 */
function filterByMinQualityScore(
  results: PipelineRow[],
  threshold?: number
): PipelineRow[] {
  if (typeof threshold !== 'number' || !Number.isFinite(threshold)) {
    return results;
  }

  const clampedThreshold = Math.max(0, Math.min(1, threshold));

  return results.filter((row) => {
    const rawScore = row.quality_score as number | undefined;
    const score =
      typeof rawScore === 'number' && Number.isFinite(rawScore) ? rawScore : 0;
    return score >= clampedThreshold;
  });
}

function backfillMissingQualityScores(results: PipelineRow[]): PipelineRow[] {
  return results.map((row) => {
    if (row.quality_score !== 0 && row.quality_score != null) {
      return row;
    }

    return {
      ...row,
      quality_score: computeBackfillQualityScore(row),
    };
  });
}

function applyArchiveFilter(
  results: PipelineRow[],
  includeArchived: boolean
): PipelineRow[] {
  if (includeArchived) return results;
  return results.filter((row) => {
    const archived = row.is_archived ?? row.isArchived;
    if (archived == null) return true;
    if (typeof archived === 'number') return archived === 0;
    if (typeof archived === 'boolean') return archived === false;
    return true;
  });
}

function applyFolderFilter(
  results: PipelineRow[],
  specFolder?: string
): PipelineRow[] {
  if (!specFolder) return results;
  return results.filter((row) => {
    const rowSpecFolder = row.spec_folder ?? row.specFolder;
    return rowSpecFolder === specFolder;
  });
}

function applyTierFilter(
  results: PipelineRow[],
  tier?: string
): PipelineRow[] {
  if (!tier) return results;
  return results.filter((row) => row.importance_tier === tier);
}

/**
 * Resolve the effective context type from a pipeline row.
 *
 * Rows may carry context type under either `contextType` (camelCase) or
 * `context_type` (snake_case). This function normalises the lookup.
 *
 * @param row - The pipeline row to inspect.
 * @returns The context type string, or `undefined` if absent.
 */
function resolveRowContextType(row: PipelineRow): string | undefined {
  if (typeof row.contextType === 'string' && row.contextType.length > 0) {
    return row.contextType;
  }
  if (typeof row.context_type === 'string' && row.context_type.length > 0) {
    return row.context_type;
  }
  return undefined;
}

function mergeStringLists(...values: unknown[]): string[] {
  const merged = new Set<string>();
  for (const value of values) {
    if (!Array.isArray(value)) {
      continue;
    }
    for (const entry of value) {
      if (typeof entry === 'string' && entry.length > 0) {
        merged.add(entry);
      }
    }
  }
  return Array.from(merged);
}

function readFiniteScoreMap(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const normalized: Record<string, number> = {};
  for (const [key, score] of Object.entries(value as Record<string, unknown>)) {
    if (typeof score === 'number' && Number.isFinite(score)) {
      normalized[key] = score;
    }
  }
  return normalized;
}

function mergeScoreMaps(...maps: Array<Record<string, number>>): Record<string, number> {
  const merged: Record<string, number> = {};
  for (const map of maps) {
    for (const [key, score] of Object.entries(map)) {
      if (!(key in merged) || score > merged[key]!) {
        merged[key] = score;
      }

exec
/bin/zsh -lc 'nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | rg -n "deep mode|query expansion|HyDE|summary embeddings|r8-summary-embeddings|fanout|decompose|surrogates|embedding expansion|multi-query|vectorSearchWithContiguity|expandQuery"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13:    13	//   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
14:    14	//   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
41:    41	import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
42:    42	import { isMultiQueryEnabled, isEmbeddingExpansionEnabled, isMemorySummariesEnabled, isQueryDecompositionEnabled, isGraphConceptRoutingEnabled, isLlmReformulationEnabled, isHyDEEnabled, isQuerySurrogatesEnabled, isTemporalContiguityEnabled, isQueryConceptExpansionEnabled } from '../search-flags.js';
43:    43	import { expandQuery } from '../query-expander.js';
44:    44	import { expandQueryWithEmbeddings, isExpansionActive } from '../embedding-expansion.js';
54:    54	  decompose,
57:    57	} from '../query-decomposer.js';
59:    59	import { cheapSeedRetrieve, llm, fanout } from '../llm-reformulation.js';
60:    60	import { runHyDE } from '../hyde.js';
61:    61	import { matchSurrogates } from '../query-surrogates.js';
82:    82	/** Number of similar memories to mine for R12 embedding-based query expansion terms. */
350:   350	 * additional variants are produced by `expandQuery`. If expansion fails or produces
365:   365	    const expanded = expandQuery(query);
400:   400	function decomposeQueryFacets(query: string): string[] {
420:   420	  const decomposedFacets = decompose(trimmed)
424:   424	  if (decomposedFacets.length === 0) {
428:   428	  return [...new Set(decomposedFacets)].slice(0, MAX_QUERY_DECOMPOSITION_FACETS);
437:   437	  const facets = decomposeQueryFacets(query).filter((facet) => facet !== normalizedQuery);
602:   602	  // -- Channel: Hybrid (with optional deep-mode query expansion) ---------------
620:   620	      // When enabled and the query is multi-faceted, decompose into up to 3
646:   646	            facets = decompose(query)
738:   738	            'Deep-mode query expansion',
759:   759	            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
781:   781	      // -- R12: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) --
803:   803	          const expanded = await expandQueryWithEmbeddings(query, expansionEmbedding, {
864:   864	            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
900:   900	              vectorSearchWithContiguity(
940:   940	        vectorSearchWithContiguity(
1092:  1092	      const allQueries = fanout([query, reform.abstract, ...reform.variants]);
1152:  1152	                fanoutCount: allQueries.length,
1164:  1164	  // -- D2 REQ-D2-004: HyDE Shadow Mode ----------------------------------------
1168:  1168	  //   - If so, generate a HyDE pseudo-document and embed it.
1176:  1176	  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
1178:  1178	      const rawHydeCandidates = await runHyDE(query, candidates, limit, specFolder);
1210:  1210	      console.warn(`[stage1-candidate-gen] D2 HyDE failed: ${hydeMsg}`);
1216:  1216	  // Met (>5000 indexed), run a parallel search on summary embeddings and merge
1217:  1217	  // Results. Pattern follows R12 embedding expansion: run in parallel, merge
1279:  1279	                  channel: 'r8-summary-embeddings',
1296:  1296	  // When SPECKIT_QUERY_SURROGATES is enabled, batch-load stored surrogates for
1321:  1321	            const surrogates = surrogateMap.get(row.id as number);
1322:  1322	            if (!surrogates) return row;
1325:  1325	              aliases: surrogates.aliases,
1326:  1326	              headings: surrogates.headings,
1327:  1327	              summary: surrogates.summary,
1328:  1328	              surrogateQuestions: surrogates.surrogateQuestions,
1329:  1329	              generatedAt: surrogates.generatedAt,
1357:  1357	              channel: 'd2-query-surrogates',
1358:  1358	              surrogatesLoaded: surrogateMap.size,
1422:  1422	  decomposeQueryFacets,

exec
/bin/zsh -lc "sed -n '1030,1288p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '930,1035p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
      limit,
      specFolder,
      tier,
      contextType,
      includeConstitutional: false, // Constitutional managed separately below
      includeArchived,
    }) as PipelineRow[];
    if (isTemporalContiguityEnabled()) {
      vectorResults = (
        vectorSearchWithContiguity(
          vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
          3600,
        ) as PipelineRow[] | null
      ) ?? vectorResults;
    }
    candidates = vectorResults;
  }

  // -- Unknown search type -----------------------------------------------------

  else {
    throw new Error(
      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
    );
  }

  // -- Tier and contextType filtering -----------------------------------------
  //
  // Applied after candidate collection but before constitutional injection so
  // Injected constitutional rows are evaluated by the same filters.
  // Exception: for hybrid search, tier/contextType are applied here because
  // SearchWithFallback does not accept these parameters directly.
  // For vector search, tier/contextType were already passed to vectorSearch,
  // So this is a no-op guard for those fields.

  if (tier) {
    candidates = candidates.filter((r) => r.importance_tier === tier);
  }

  if (contextType) {
    candidates = candidates.filter(
      (r) => resolveRowContextType(r) === contextType
    );
  }

  // P0 fix: sessionId is for dedup/state tracking, NOT a governance boundary.
  // Including it here caused all candidates to be filtered out when memory_context
  // passed an ephemeral sessionId, because memories don't have session-scoped access.
  const hasGovernanceScope = Boolean(
    tenantId
    || userId
    || agentId
    || sharedSpaceId
  );
  const shouldApplyScopeFiltering = hasGovernanceScope || isScopeEnforcementEnabled();
  const scopeFilter = {
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
  };
  let allowedSharedSpaceIds: Set<string> | undefined;

  if (shouldApplyScopeFiltering) {
    try {
      const db = requireDb();
      allowedSharedSpaceIds = getAllowedSharedSpaceIds(db, scopeFilter);
      candidates = filterRowsByScope(
        candidates,
        scopeFilter,
        allowedSharedSpaceIds,
      );
    } catch (_error: unknown) {
      candidates = filterRowsByScope(candidates, scopeFilter);
    }
  }

  // -- Constitutional Memory Injection ----------------------------------------
  //
  // If includeConstitutional is requested and no constitutional results exist
  // In the current candidate set, fetch them separately via vector search.
  // They enter the pipeline here so all subsequent stages (scoring, reranking)
  // Treat them uniformly. Constitutional tier boost is applied in Stage 2.
  //
  // Injection is skipped when:
  //   - includeConstitutional is false
  //   - A tier filter is active (caller explicitly requested a specific tier)
  //   - Constitutional results already exist in the candidate set

  if (includeConstitutional && !tier) {
    const existingConstitutional = candidates.filter(
      (r) => r.importance_tier === 'constitutional'
    );

    if (existingConstitutional.length === 0) {
      // Fix #16 — Reuse cached embedding instead of generating a new one
      const constitutionalEmbedding: Float32Array | number[] | null =
        cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));

      if (constitutionalEmbedding) {
        const constitutionalResults = vectorIndex.vectorSearch(
          constitutionalEmbedding,
          {
            limit: CONSTITUTIONAL_INJECT_LIMIT,
            specFolder,

 succeeded in 0ms:
      if (constitutionalEmbedding) {
        const constitutionalResults = vectorIndex.vectorSearch(
          constitutionalEmbedding,
          {
            limit: CONSTITUTIONAL_INJECT_LIMIT,
            specFolder,
            tier: 'constitutional',
            useDecay: false,
          }
        ) as PipelineRow[];

        // Only inject rows not already present
        const existingIds = new Set(candidates.map((r) => r.id));
        const uniqueConstitutional = constitutionalResults.filter(
          (r) => !existingIds.has(r.id)
        );

        // Re-apply filters after injection because constitutional rows fetched
        // via vector search bypass the earlier governance/context gate.
        const contextFilteredConstitutional = contextType
          ? uniqueConstitutional.filter((r) => resolveRowContextType(r) === contextType)
          : uniqueConstitutional;
        // H12 FIX: Use shouldApplyScopeFiltering (not just hasGovernanceScope)
        // to ensure constitutional injection respects global scope enforcement
        const filteredConstitutional = shouldApplyScopeFiltering
          ? filterRowsByScope(
            contextFilteredConstitutional,
            scopeFilter,
            allowedSharedSpaceIds,
          )
          : contextFilteredConstitutional;
        candidates = [...candidates, ...filteredConstitutional];
        constitutionalInjectedCount = filteredConstitutional.length;
      }
    }
  } else if (!includeConstitutional) {
    // Explicitly exclude constitutional results if flag is off
    candidates = candidates.filter(
      (r) => r.importance_tier !== 'constitutional'
    );
  }

  // -- Quality Score Filtering ------------------------------------------------

  candidates = backfillMissingQualityScores(candidates);
  candidates = filterByMinQualityScore(candidates, qualityThreshold);

  // -- D2 REQ-D2-003: Corpus-Grounded LLM Reformulation ----------------------
  //
  // When SPECKIT_LLM_REFORMULATION is enabled and mode === 'deep':
  //   1. Retrieve top-3 seed results via fast BM25/FTS5 (no embedding call).
  //   2. Ask the LLM to produce a step-back abstraction + corpus-grounded variants.
  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
  //   4. Deduplicate and merge into candidates.
  //
  // Budget: 1 LLM call per cache miss (0 on cache hit).
  // Fail-open: any error leaves candidates unchanged.

  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
    try {
      const seeds = cheapSeedRetrieve(query, { limit: 3 });
      const reform = await llm.rewrite({ q: query, seeds, mode: 'step_back+corpus' });
      const allQueries = fanout([query, reform.abstract, ...reform.variants]);

      if (allQueries.length > 1) {
        const reformEmbedding: Float32Array | number[] | null =
          cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));

        if (reformEmbedding) {
          // FIX #7: Use Promise.allSettled so one failing reformulation
          // branch does not discard results from all other branches.
          const reformSettledResults = await Promise.allSettled(
            allQueries.map(async (q, idx): Promise<PipelineRow[]> => {
              // Reuse cached embedding for original query (idx 0); generate fresh for variants
              const emb = idx === 0 ? reformEmbedding : await embeddings.generateQueryEmbedding(q);
              if (!emb) {
                console.warn('[stage1-candidate-gen] LLM reform embedding generation returned null');
                return [];
              }
              return hybridSearch.collectRawCandidates(
                q,
                emb,
                { limit, specFolder, includeArchived }
              ) as Promise<PipelineRow[]>;
            })
          );
          const reformResultSets = reformSettledResults.map((result, idx) => {
            if (result.status === 'fulfilled') return result.value;
            console.warn(`[stage1-candidate-gen] D2 LLM reform branch ${idx} rejected: ${result.reason}`);
            return [] as PipelineRow[];
          });

          if (reformResultSets.length > 0) {
            const filteredReformSets = reformResultSets.map((resultSet, index) => {
              let rows = shouldApplyScopeFiltering
                ? filterRowsByScope(resultSet, scopeFilter, allowedSharedSpaceIds)
                : resultSet;
              if (contextType) {
                rows = rows.filter((r) => resolveRowContextType(r) === contextType);
              }
              if (tier) {
                rows = applyTierFilter(rows, tier);
              }
              rows = backfillMissingQualityScores(rows);
              rows = filterByMinQualityScore(rows, qualityThreshold);
              return {
                label: allQueries[index] ?? `d2-reform-${index}`,
                rows,
              };
            });
            const reformMergedCount = filteredReformSets.reduce((sum, batch) => sum + batch.rows.length, 0);
            candidates = mergeCandidateBatches(filteredReformSets, {
              seedCandidates: candidates,
              seedLabel: query,
            });
            channelCount += allQueries.length - 1; // discount original (already counted)

            if (trace) {
              addTraceEntry(trace, 'candidate', allQueries.length - 1, reformMergedCount, 0, {
                channel: 'd2-llm-reformulation',
                abstract: reform.abstract,
                variantCount: reform.variants.length,
                fanoutCount: allQueries.length,
              });
            }
          }
        }
      }
    } catch (reformErr: unknown) {
      const reformMsg = reformErr instanceof Error ? reformErr.message : String(reformErr);
      console.warn(`[stage1-candidate-gen] D2 LLM reformulation failed: ${reformMsg}`);
    }
  }

  // -- D2 REQ-D2-004: HyDE Shadow Mode ----------------------------------------
  //
  // When SPECKIT_HYDE is enabled and mode === 'deep':
  //   - Check if the current baseline has low confidence.
  //   - If so, generate a HyDE pseudo-document and embed it.
  //   - Run a vector-only search with the pseudo-document embedding.
  //   - Shadow mode (SPECKIT_HYDE_ACTIVE=false): log results, do NOT merge.
  //   - Active mode (SPECKIT_HYDE_ACTIVE=true): merge into candidates.
  //
  // Budget: 1 LLM call per cache miss (shared cache with reformulation → ≤2 total).
  // Fail-open: any error leaves candidates unchanged.

  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
    try {
      const rawHydeCandidates = await runHyDE(query, candidates, limit, specFolder);
      const hydeCandidates = shouldApplyScopeFiltering
        ? filterRowsByScope(rawHydeCandidates, scopeFilter, allowedSharedSpaceIds)
        : rawHydeCandidates;
      if (hydeCandidates.length > 0) {
        let newHydeCandidates = hydeCandidates;
        // H11 FIX: Apply the same tier/context/quality filters as main candidates
        if (contextType) {
          newHydeCandidates = newHydeCandidates.filter((r) => resolveRowContextType(r) === contextType);
        }
        if (tier) {
          newHydeCandidates = applyTierFilter(newHydeCandidates, tier);
        }
        newHydeCandidates = backfillMissingQualityScores(newHydeCandidates);
        newHydeCandidates = filterByMinQualityScore(newHydeCandidates, qualityThreshold);
        candidates = mergeCandidateBatches([
          { label: 'hyde', rows: newHydeCandidates },
        ], {
          seedCandidates: candidates,
          seedLabel: query,
        });
        channelCount++;

        if (trace) {
          addTraceEntry(trace, 'candidate', 1, newHydeCandidates.length, 0, {
            channel: 'd2-hyde',
            hydeCandidates: newHydeCandidates.length,
          });
        }
      }
    } catch (hydeErr: unknown) {
      const hydeMsg = hydeErr instanceof Error ? hydeErr.message : String(hydeErr);
      console.warn(`[stage1-candidate-gen] D2 HyDE failed: ${hydeMsg}`);
    }
  }

  // -- R8: Summary Embedding Channel ---------------------------------------
  // When SPECKIT_MEMORY_SUMMARIES is enabled (default-ON) and scale gate is
  // Met (>5000 indexed), run a parallel search on summary embeddings and merge
  // Results. Pattern follows R12 embedding expansion: run in parallel, merge
  // + deduplicate by ID.
  if (isMemorySummariesEnabled()) {
    try {
      const db = requireDb();
      if (checkScaleGate(db)) {
        const summaryEmbedding: Float32Array | number[] | null =
          queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));

        if (summaryEmbedding) {
          const summaryResults = querySummaryEmbeddings(db, summaryEmbedding, limit);
          if (summaryResults.length > 0) {
            const existingIds = new Set(candidates.map((r) => String(r.id)));
            const newSummaryHits: PipelineRow[] = [];

            // F02-003: Batch-fetch instead of N+1 per-item queries
            const newSummaryIds = summaryResults
              .filter((sr) => !existingIds.has(String(sr.memoryId)))
              .map((sr) => sr.memoryId);

            if (newSummaryIds.length > 0) {
              const placeholders = newSummaryIds.map(() => '?').join(', ');
              const memRows = db.prepare(
                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
              ).all(...newSummaryIds) as PipelineRow[];

              const memRowMap = new Map(memRows.map((r) => [r.id, r]));
              for (const sr of summaryResults) {
                if (!existingIds.has(String(sr.memoryId))) {
                  const memRow = memRowMap.get(sr.memoryId);
                  if (memRow) {
                    newSummaryHits.push({
                      ...memRow,
                      similarity: sr.similarity * 100,
                      score: sr.similarity,
                    });
                    existingIds.add(String(sr.memoryId));
                  }
                }
              }
            }

            const archiveFilteredSummaryHits = applyArchiveFilter(newSummaryHits, includeArchived);
            const folderFilteredSummaryHits = applyFolderFilter(archiveFilteredSummaryHits, specFolder);
            const tierFilteredSummaryHits = applyTierFilter(folderFilteredSummaryHits, tier);
            const contextFilteredSummaryHits = contextType
              ? tierFilteredSummaryHits.filter((r) => resolveRowContextType(r) === contextType)
              : tierFilteredSummaryHits;
            const scopeFilteredSummaryHits = shouldApplyScopeFiltering
              ? filterRowsByScope(contextFilteredSummaryHits, scopeFilter, allowedSharedSpaceIds)
              : contextFilteredSummaryHits;

            // Apply the same quality threshold that other candidates go through
            const backfilledSummaryHits = backfillMissingQualityScores(scopeFilteredSummaryHits);
            const filteredSummaryHits = filterByMinQualityScore(backfilledSummaryHits, qualityThreshold);

            if (filteredSummaryHits.length > 0) {
              candidates = [...candidates, ...filteredSummaryHits];
              channelCount++;

              if (trace) {
                addTraceEntry(trace, 'candidate', 1, filteredSummaryHits.length, 0, {
                  channel: 'r8-summary-embeddings',
                  summaryHits: filteredSummaryHits.length,
                  preFilterCount: newSummaryHits.length,
                });
              }
            }
          }
        }
      }
    } catch (r8Err: unknown) {

exec
/bin/zsh -lc "sed -n '50,95p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '450,515p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
			CREATE TABLE IF NOT EXISTS observations (
				id         INTEGER PRIMARY KEY AUTOINCREMENT,
				sync_id    TEXT,
				session_id TEXT    NOT NULL,
			type       TEXT    NOT NULL,
			title      TEXT    NOT NULL,
			content    TEXT    NOT NULL,
			tool_name  TEXT,
			project    TEXT,
			scope      TEXT    NOT NULL DEFAULT 'project',
			topic_key  TEXT,
			normalized_hash TEXT,
			revision_count INTEGER NOT NULL DEFAULT 1,
			duplicate_count INTEGER NOT NULL DEFAULT 1,
			last_seen_at TEXT,
			created_at TEXT    NOT NULL DEFAULT (datetime('now')),
			updated_at TEXT    NOT NULL DEFAULT (datetime('now')),
			deleted_at TEXT,
			FOREIGN KEY (session_id) REFERENCES sessions(id)
		);

		CREATE INDEX IF NOT EXISTS idx_obs_session  ON observations(session_id);
		CREATE INDEX IF NOT EXISTS idx_obs_type     ON observations(type);
		CREATE INDEX IF NOT EXISTS idx_obs_project  ON observations(project);
		CREATE INDEX IF NOT EXISTS idx_obs_created  ON observations(created_at DESC);

		CREATE VIRTUAL TABLE IF NOT EXISTS observations_fts USING fts5(
			title,
			content,
			tool_name,
			type,
			project,
			topic_key,
			content='observations',
			content_rowid='id'
		);

			CREATE TABLE IF NOT EXISTS user_prompts (
				id         INTEGER PRIMARY KEY AUTOINCREMENT,
				sync_id    TEXT,
				session_id TEXT    NOT NULL,
			content    TEXT    NOT NULL,
			project    TEXT,
			created_at TEXT    NOT NULL DEFAULT (datetime('now')),
			FOREIGN KEY (session_id) REFERENCES sessions(id)
		);

		CREATE INDEX IF NOT EXISTS idx_prompts_session ON user_prompts(session_id);
		CREATE INDEX IF NOT EXISTS idx_prompts_project ON user_prompts(project);
		CREATE INDEX IF NOT EXISTS idx_prompts_created ON user_prompts(created_at DESC);

		CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
			content,
			project,
			content='user_prompts',
			content_rowid='id'
		);

			CREATE TABLE IF NOT EXISTS sync_chunks (
				chunk_id    TEXT PRIMARY KEY,
				imported_at TEXT NOT NULL DEFAULT (datetime('now'))
			);

			CREATE TABLE IF NOT EXISTS sync_state (
				target_key           TEXT PRIMARY KEY,
				lifecycle            TEXT NOT NULL DEFAULT 'idle',

codex
The evidence is pointing to two distinct themes: Engram improves retrieval quality mostly by constraining the data shape and query path, while our stack improves it by adding more channels and post-processing. I’m checking the observation-write side once more, because the search shortcuts only make sense if topic-key and duplicate counters are actually maintained the way the lookup path assumes.
exec
/bin/zsh -lc "sed -n '950,1058p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '300,360p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '565,600p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1998,2025p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1998	
  1999	## Failures and how to do differently
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

codex
I’ve got enough structure to draft the findings, but I’m doing one last pass to lock the exact line references so each claim is source-backed and easy to verify. That should let me keep the final write-up tight without sacrificing auditability.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '460,505p;950,1058p;1160,1225p;1462,1550p;1613,1658p;3382,3392p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '50,95p;169,200p;302,326p;565,592p;625,670p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts | sed -n '1,120p;146,225p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1,40p;1008,1112p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Hybrid Search
     3	// ───────────────────────────────────────────────────────────────
     4	// Combines vector, FTS, and BM25 search with fallback
     5	
     6	// 1. IMPORTS
     7	
     8	// Local
     9	import { getIndex, isBm25Enabled } from './bm25-index.js';
    10	import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
    11	import { getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
    12	import { CO_ACTIVATION_CONFIG, spreadActivation } from '../cognitive/co-activation.js';
    13	import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
    14	import { INTENT_LAMBDA_MAP, classifyIntent } from './intent-classifier.js';
    15	import { fts5Bm25Search } from './sqlite-fts.js';
    16	import { DEGREE_CHANNEL_WEIGHT } from './graph-search-fn.js';
    17	import {
    18	  isMMREnabled,
    19	  isCrossEncoderEnabled,
    20	  isLocalRerankerEnabled,
    21	  isSearchFallbackEnabled,
    22	  isDocscoreAggregationEnabled,
    23	  isDegreeBoostEnabled,
    24	  isContextHeadersEnabled,
    25	} from './search-flags.js';
    26	import { rerankLocal } from './local-reranker.js';
    27	import { computeDegreeScores } from './graph-search-fn.js';
    28	import type { GraphSearchFn } from './search-types.js';
    29	
    30	// Feature catalog: Hybrid search pipeline
    31	
    32	export type { GraphSearchFn } from './search-types.js';
    33	
    34	import { routeQuery } from './query-router.js';
    35	import { isComplexityRouterEnabled } from './query-classifier.js';
    36	import { enforceChannelRepresentation } from './channel-enforcement.js';
    37	import {
    38	  truncateByConfidence,
    39	  isConfidenceTruncationEnabled,
    40	  DEFAULT_MIN_RESULTS,
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '13,31p;1080,1219p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1080	  //   1. Retrieve top-3 seed results via fast BM25/FTS5 (no embedding call).
  1081	  //   2. Ask the LLM to produce a step-back abstraction + corpus-grounded variants.
  1082	  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
  1083	  //   4. Deduplicate and merge into candidates.
  1084	  //
  1085	  // Budget: 1 LLM call per cache miss (0 on cache hit).
  1086	  // Fail-open: any error leaves candidates unchanged.
  1087	
  1088	  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
  1089	    try {
  1090	      const seeds = cheapSeedRetrieve(query, { limit: 3 });
  1091	      const reform = await llm.rewrite({ q: query, seeds, mode: 'step_back+corpus' });
  1092	      const allQueries = fanout([query, reform.abstract, ...reform.variants]);
  1093	
  1094	      if (allQueries.length > 1) {
  1095	        const reformEmbedding: Float32Array | number[] | null =
  1096	          cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
  1097	
  1098	        if (reformEmbedding) {
  1099	          // FIX #7: Use Promise.allSettled so one failing reformulation
  1100	          // branch does not discard results from all other branches.
  1101	          const reformSettledResults = await Promise.allSettled(
  1102	            allQueries.map(async (q, idx): Promise<PipelineRow[]> => {
  1103	              // Reuse cached embedding for original query (idx 0); generate fresh for variants
  1104	              const emb = idx === 0 ? reformEmbedding : await embeddings.generateQueryEmbedding(q);
  1105	              if (!emb) {
  1106	                console.warn('[stage1-candidate-gen] LLM reform embedding generation returned null');
  1107	                return [];
  1108	              }
  1109	              return hybridSearch.collectRawCandidates(
  1110	                q,
  1111	                emb,
  1112	                { limit, specFolder, includeArchived }
  1113	              ) as Promise<PipelineRow[]>;
  1114	            })
  1115	          );
  1116	          const reformResultSets = reformSettledResults.map((result, idx) => {
  1117	            if (result.status === 'fulfilled') return result.value;
  1118	            console.warn(`[stage1-candidate-gen] D2 LLM reform branch ${idx} rejected: ${result.reason}`);
  1119	            return [] as PipelineRow[];
  1120	          });
  1121	
  1122	          if (reformResultSets.length > 0) {
  1123	            const filteredReformSets = reformResultSets.map((resultSet, index) => {
  1124	              let rows = shouldApplyScopeFiltering
  1125	                ? filterRowsByScope(resultSet, scopeFilter, allowedSharedSpaceIds)
  1126	                : resultSet;
  1127	              if (contextType) {
  1128	                rows = rows.filter((r) => resolveRowContextType(r) === contextType);
  1129	              }
  1130	              if (tier) {
  1131	                rows = applyTierFilter(rows, tier);
  1132	              }
  1133	              rows = backfillMissingQualityScores(rows);
  1134	              rows = filterByMinQualityScore(rows, qualityThreshold);
  1135	              return {
  1136	                label: allQueries[index] ?? `d2-reform-${index}`,
  1137	                rows,
  1138	              };
  1139	            });
  1140	            const reformMergedCount = filteredReformSets.reduce((sum, batch) => sum + batch.rows.length, 0);
  1141	            candidates = mergeCandidateBatches(filteredReformSets, {
  1142	              seedCandidates: candidates,
  1143	              seedLabel: query,
  1144	            });
  1145	            channelCount += allQueries.length - 1; // discount original (already counted)
  1146	
  1147	            if (trace) {
  1148	              addTraceEntry(trace, 'candidate', allQueries.length - 1, reformMergedCount, 0, {
  1149	                channel: 'd2-llm-reformulation',
  1150	                abstract: reform.abstract,
  1151	                variantCount: reform.variants.length,
  1152	                fanoutCount: allQueries.length,
  1153	              });
  1154	            }
  1155	          }
  1156	        }
  1157	      }
  1158	    } catch (reformErr: unknown) {
  1159	      const reformMsg = reformErr instanceof Error ? reformErr.message : String(reformErr);
  1160	      console.warn(`[stage1-candidate-gen] D2 LLM reformulation failed: ${reformMsg}`);
  1161	    }
  1162	  }
  1163	
  1164	  // -- D2 REQ-D2-004: HyDE Shadow Mode ----------------------------------------
  1165	  //
  1166	  // When SPECKIT_HYDE is enabled and mode === 'deep':
  1167	  //   - Check if the current baseline has low confidence.
  1168	  //   - If so, generate a HyDE pseudo-document and embed it.
  1169	  //   - Run a vector-only search with the pseudo-document embedding.
  1170	  //   - Shadow mode (SPECKIT_HYDE_ACTIVE=false): log results, do NOT merge.
  1171	  //   - Active mode (SPECKIT_HYDE_ACTIVE=true): merge into candidates.
  1172	  //
  1173	  // Budget: 1 LLM call per cache miss (shared cache with reformulation → ≤2 total).
  1174	  // Fail-open: any error leaves candidates unchanged.
  1175	
  1176	  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
  1177	    try {
  1178	      const rawHydeCandidates = await runHyDE(query, candidates, limit, specFolder);
  1179	      const hydeCandidates = shouldApplyScopeFiltering
  1180	        ? filterRowsByScope(rawHydeCandidates, scopeFilter, allowedSharedSpaceIds)
  1181	        : rawHydeCandidates;
  1182	      if (hydeCandidates.length > 0) {
  1183	        let newHydeCandidates = hydeCandidates;
  1184	        // H11 FIX: Apply the same tier/context/quality filters as main candidates
  1185	        if (contextType) {
  1186	          newHydeCandidates = newHydeCandidates.filter((r) => resolveRowContextType(r) === contextType);
  1187	        }
  1188	        if (tier) {
  1189	          newHydeCandidates = applyTierFilter(newHydeCandidates, tier);
  1190	        }
  1191	        newHydeCandidates = backfillMissingQualityScores(newHydeCandidates);
  1192	        newHydeCandidates = filterByMinQualityScore(newHydeCandidates, qualityThreshold);
  1193	        candidates = mergeCandidateBatches([
  1194	          { label: 'hyde', rows: newHydeCandidates },
  1195	        ], {
  1196	          seedCandidates: candidates,
  1197	          seedLabel: query,
  1198	        });
  1199	        channelCount++;
  1200	
  1201	        if (trace) {
  1202	          addTraceEntry(trace, 'candidate', 1, newHydeCandidates.length, 0, {
  1203	            channel: 'd2-hyde',
  1204	            hydeCandidates: newHydeCandidates.length,
  1205	          });
  1206	        }
  1207	      }
  1208	    } catch (hydeErr: unknown) {
  1209	      const hydeMsg = hydeErr instanceof Error ? hydeErr.message : String(hydeErr);
  1210	      console.warn(`[stage1-candidate-gen] D2 HyDE failed: ${hydeMsg}`);
  1211	    }
  1212	  }
  1213	
  1214	  // -- R8: Summary Embedding Channel ---------------------------------------
  1215	  // When SPECKIT_MEMORY_SUMMARIES is enabled (default-ON) and scale gate is
  1216	  // Met (>5000 indexed), run a parallel search on summary embeddings and merge
  1217	  // Results. Pattern follows R12 embedding expansion: run in parallel, merge
  1218	  // + deduplicate by ID.
  1219	  if (isMemorySummariesEnabled()) {

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts | sed -n '133,243p;310,433p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   310	    rerank: boolean;
   311	    applyLengthPenalty: boolean;
   312	    limit: number;
   313	  }
   314	): Promise<{ rows: PipelineRow[]; applied: boolean; provider: RerankProvider }> {
   315	  // Feature-flag guard
   316	  if (!options.rerank || !isCrossEncoderEnabled()) {
   317	    return { rows: results, applied: false, provider: 'none' };
   318	  }
   319	
   320	  // Minimum-document guard
   321	  if (results.length < MIN_RESULTS_FOR_RERANK) {
   322	    return { rows: results, applied: false, provider: 'none' };
   323	  }
   324	
   325	  // Build a lookup map so we can restore all original PipelineRow fields
   326	  // After reranking (the cross-encoder only knows about id + text + score).
   327	  const rowMap = new Map<string | number, PipelineRow>();
   328	  for (const row of results) {
   329	    rowMap.set(row.id, row);
   330	  }
   331	
   332	  // Local GGUF reranker path (P1-5): RERANKER_LOCAL=true
   333	  // On any failure/unavailable precondition, rerankLocal returns original rows unchanged.
   334	  if (isLocalRerankerEnabled()) {
   335	    try {
   336	      const localReranked = await rerankLocal(query, results, options.limit);
   337	      if (localReranked === results) {
   338	        return { rows: results, applied: false, provider: 'local-gguf' };
   339	      }
   340	
   341	      const localRows: PipelineRow[] = localReranked.map((row) => {
   342	        const original = rowMap.get(row.id);
   343	        const rerankScoreRaw = row.rerankerScore ?? row.score;
   344	        const rerankScore = resolveRerankOutputScore(
   345	          rerankScoreRaw,
   346	          original ? effectiveScore(original) : 0,
   347	        );
   348	
   349	        return {
   350	          ...(original ?? row),
   351	          ...row,
   352	          stage2Score: original?.score,
   353	          score: rerankScore,
   354	          similarity: original?.similarity ?? row.similarity,
   355	          rerankerScore: rerankScore,
   356	          // F2.02 fix: Sync all score aliases for local reranker path too.
   357	          rrfScore: rerankScore,
   358	          intentAdjustedScore: rerankScore,
   359	          attentionScore: original?.attentionScore ?? row.attentionScore,
   360	        };
   361	      });
   362	
   363	      return { rows: localRows, applied: true, provider: 'local-gguf' };
   364	    } catch (err: unknown) {
   365	      console.warn(
   366	        `[stage3-rerank] Local reranking failed: ${toErrorMessage(err)} — returning original results`
   367	      );
   368	      return { rows: results, applied: false, provider: 'local-gguf' };
   369	    }
   370	  }
   371	
   372	  // Map PipelineRow → RerankDocument (uses `content` field per cross-encoder interface)
   373	  // P1-015: Use effectiveScore() for consistent fallback chain
   374	  const documents: RerankDocument[] = results.map((row) => ({
   375	    id: row.id,
   376	    content: resolveDisplayText(row),
   377	    score: floorScore(effectiveScore(row)),
   378	  }));
   379	
   380	  try {
   381	    // Cast through unknown: our local RerankDocument is structurally equivalent to
   382	    // The cross-encoder module's internal RerankDocument but declared separately.
   383	    const reranked = await crossEncoder.rerankResults(
   384	      query,
   385	      documents as unknown as Parameters<typeof crossEncoder.rerankResults>[1],
   386	      {
   387	        limit: options.limit,
   388	        useCache: true,
   389	        applyLengthPenalty: options.applyLengthPenalty,
   390	      }
   391	    );
   392	
   393	    const rerankProvider: RerankProvider = reranked.some(
   394	      (result) => result.scoringMethod === 'fallback'
   395	    )
   396	      ? 'fallback-sort'
   397	      : 'cross-encoder';
   398	
   399	    // Re-map reranked results back to PipelineRow, preserving all original
   400	    // Fields and updating only the score-related values from the reranker.
   401	    const rerankedRows: PipelineRow[] = [];
   402	    for (const rerankResult of reranked) {
   403	      const original = rowMap.get(rerankResult.id);
   404	      if (!original) {
   405	        // Defensive: reranker returned an unknown id — skip it
   406	        continue;
   407	      }
   408	      const rerankScore = resolveRerankOutputScore(
   409	        rerankResult.rerankerScore ?? rerankResult.score,
   410	        effectiveScore(original),
   411	      );
   412	      rerankedRows.push({
   413	        ...original,
   414	        // P1-015: Preserve Stage 2 composite score for auditability
   415	        stage2Score: original.score,
   416	        score: rerankScore,
   417	        similarity: original.similarity,
   418	        rerankerScore: rerankScore,
   419	        // F2.02 fix: Sync all score aliases so resolveEffectiveScore() returns
   420	        // the reranked value instead of stale Stage 2 values.
   421	        rrfScore: rerankScore,
   422	        intentAdjustedScore: rerankScore,
   423	        attentionScore: original.attentionScore,
   424	      });
   425	    }
   426	
   427	    return { rows: rerankedRows, applied: true, provider: rerankProvider };
   428	  } catch (err: unknown) {
   429	    // Graceful degradation — return original results on any reranker failure
   430	    console.warn(
   431	      `[stage3-rerank] Cross-encoder reranking failed: ${toErrorMessage(err)} — returning original results`
   432	    );
   433	    return { rows: results, applied: false, provider: 'cross-encoder' };

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | rg -n \"fuseResultsMulti|getAdaptiveWeights|adaptive fusion|rrfScore|lists.push\\(|enforceChannelRepresentation|truncateByConfidence|fallback tier|degradation\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1160,1265p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
            }
          }
          degreeItems.sort((a, b) => b.degreeScore - a.degreeScore);

          if (degreeItems.length > 0) {
            lists.push({
              source: 'degree',
              results: degreeItems.map(item => ({
                id: item.id,
                degreeScore: item.degreeScore,
              })),
              weight: DEGREE_CHANNEL_WEIGHT,
            });
          }
        }
      } catch (_err: unknown) {
        // Non-critical — degree channel failure does not block pipeline
        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
      }
    }

    // Merge keyword results after all channels complete
    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
      ...ftsChannelResults,
      ...bm25ChannelResults,
    ];

    if (options.skipFusion) {
      return {
        evaluationMode,
        intent: options.intent || classifyIntent(query).intent,
        lists,
        routeResult,
        budgetResult,
        s3meta,
        vectorEmbeddingCache,
        fusedResults: collectCandidatesFromLists(
          lists.filter((list) => list.source !== 'degree'),
          options.limit ?? DEFAULT_LIMIT
        ),
      };
    }

    if (lists.length === 0) {
      return null;
    }

    // Track multi-source and graph-only results
    const sourceMap = new Map<string, Set<string>>();
    for (const list of lists) {
      for (const r of list.results) {
        const key = canonicalResultId(r.id);
        if (!sourceMap.has(key)) sourceMap.set(key, new Set());
        sourceMap.get(key)!.add(list.source); // non-null safe: has() guard above guarantees entry exists
      }
    }
    for (const [, sources] of sourceMap) {
      if (sources.size > 1) graphMetrics.multiSourceResults++;
      if (sources.size === 1 && sources.has('graph')) graphMetrics.graphOnlyResults++;
    }

    // C138/T315: Build weighted fusion lists once from lightweight adaptive
    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
    const intent = options.intent || classifyIntent(query).intent;
    const adaptiveEnabled = isAdaptiveFusionEnabled();
    const fusionWeights = adaptiveEnabled
      ? getAdaptiveWeights(intent)
      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
    const { semanticWeight, keywordWeight, graphWeight: adaptiveGraphWeight } = fusionWeights;
    const keywordFusionResults = keywordResults.map((result) => ({
      ...result,
      source: 'keyword',
    }));
    const fusionLists = lists
      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
      .map((list) => {
        if (list.source === 'vector') {
          return { ...list, weight: semanticWeight };
        }
        if (list.source === 'graph' && typeof adaptiveGraphWeight === 'number') {
          return { ...list, weight: adaptiveGraphWeight };
        }
        return { ...list };
      });

    if (keywordFusionResults.length > 0 && keywordWeight > 0) {
      fusionLists.push({
        source: 'keyword',
        results: keywordFusionResults,
        weight: keywordWeight,
      });
    }

    const fused = fuseResultsMulti(fusionLists);

    const fusedResults = fused.map(toHybridResult).map((row) => {
      const rowRecord = row as Record<string, unknown>;
      if (rowRecord.parentMemoryId !== undefined) return row;
      const normalizedParentMemoryId = rowRecord.parent_id ?? rowRecord.parentId;
      if (normalizedParentMemoryId === undefined) return row;
      return {
        ...row,
        parentMemoryId: normalizedParentMemoryId,
      };
    });


 succeeded in 0ms:
10:    10	import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
11:    11	import { getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
36:    36	import { enforceChannelRepresentation } from './channel-enforcement.js';
38:    38	  truncateByConfidence,
91:    91	  /** Classified query intent for adaptive fusion weight selection (e.g. 'understand', 'fix_bug'). */
135:   135	  _degradation?: unknown;
147:   147	    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
196:   196	/** Fallback tier in the 3-tier degradation chain. */
199:   199	/** Why degradation was triggered at a given tier. */
207:   207	/** Record of a single degradation event during tiered fallback. */
216:   216	 * Absolute quality floor for degradation checks.
219:   219	 * high fixed threshold causes false degradations. Use a conservative floor and
1016:  1016	    // every fallback tier. useGraph=false also disables the dependent degree lane.
1087:  1087	        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
1100:  1100	        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
1110:  1110	        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
1126:  1126	          lists.push({ source: 'graph', results: graphResults.map((r: Record<string, unknown>) => ({
1165:  1165	            lists.push({
1226:  1226	      ? getAdaptiveWeights(intent)
1253:  1253	    const fused = fuseResultsMulti(fusionLists);
1359:  1359	    const enforcementResult: EnforcementResult = enforceChannelRepresentation(
1382:  1382	  const degradationMeta = shadowMeta._degradation;
1491:  1491	            if ('rrfScore' in result) (result as Record<string, unknown>).rrfScore = boostedScore;
1535:  1535	      const truncationResult: TruncationResult = truncateByConfidence(
1575:  1575	          ...(degradationMeta !== undefined ? { degradation: degradationMeta } : {}),
2117:  2117	 * @returns Results with _degradation metadata attached as non-enumerable property.
2124:  2124	  const degradationEvents: DegradationEvent[] = [];
2135:  2135	    // Tier 1 passed quality thresholds — attach empty degradation metadata
2136:  2136	    Object.defineProperty(finalTier1, '_degradation', {
2137:  2137	      value: degradationEvents,
2147:  2147	  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
2151:  2151	  degradationEvents.push({
2163:  2163	    Object.defineProperty(finalTier2, '_degradation', {
2164:  2164	      value: degradationEvents,
2174:  2174	  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
2179:  2179	  degradationEvents.push({
2190:  2190	  Object.defineProperty(finalResults, '_degradation', {
2191:  2191	    value: degradationEvents,

exec
/bin/zsh -lc "sed -n '1265,1360p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

    return {
      evaluationMode,
      intent,
      lists,
      routeResult,
      budgetResult,
      s3meta,
      vectorEmbeddingCache,
      fusedResults,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
    return null;
  }
}

async function enrichFusedResults(
  query: string,
  execution: HybridFusionExecution,
  options: HybridSearchOptions = {},
  initialResults: HybridSearchResult[] = execution.fusedResults
): Promise<HybridSearchResult[]> {
  const {
    evaluationMode,
    intent,
    lists,
    routeResult,
    budgetResult,
    s3meta,
    vectorEmbeddingCache,
  } = execution;
  let fusedHybridResults = initialResults;
  const limit = options.limit || DEFAULT_LIMIT;

  // -- Aggregation stage: MPAB chunk-to-memory aggregation (after fusion, before state filter) --
  // When enabled, collapses chunk-level results back to their parent memory
  // Documents using MPAB scoring (sMax + 0.3 * sum(remaining) / sqrt(N)). This prevents
  // Multiple chunks from the same document dominating the result list.
  // MINOR-1 fix: isMpabEnabled() and isDocscoreAggregationEnabled() check the same env var
  if (isDocscoreAggregationEnabled()) {
    try {
      const chunkResults = fusedHybridResults.filter(
        r => (r as Record<string, unknown>).parentMemoryId != null && (r as Record<string, unknown>).chunkIndex != null
      );
      if (chunkResults.length > 0) {
        const nonChunkResults = fusedHybridResults.filter(
          r => (r as Record<string, unknown>).parentMemoryId == null || (r as Record<string, unknown>).chunkIndex == null
        );
        const collapsed = collapseAndReassembleChunkResults(
          chunkResults.map(r => ({
            id: r.id,
            parentMemoryId: (r as Record<string, unknown>).parentMemoryId as number | string,
            chunkIndex: (r as Record<string, unknown>).chunkIndex as number,
            score: r.score,
          }))
        );
        // Merge collapsed chunk results with non-chunk results
        fusedHybridResults = [
          ...collapsed.map(c => ({
            id: c.parentMemoryId,
            score: c.mpabScore,
            source: 'mpab' as string,
            _chunkHits: c._chunkHits,
          } as HybridSearchResult)),
          ...nonChunkResults,
        ];
      }
    } catch (_mpabErr: unknown) {
      // Non-critical — MPAB failure does not block pipeline
      const msg = _mpabErr instanceof Error ? _mpabErr.message : String(_mpabErr);
      console.error('[hybrid-search] MPAB error (non-fatal):', msg);
    }
  }

  // -- Stage C: Channel Enforcement (SPECKIT_CHANNEL_MIN_REP) --
  // Ensures every channel that returned results has at least one representative
  // In the top-k window. Prevents single-channel dominance in fusion output.
  // When disabled, passes results through unchanged.
  try {
    const channelResultSets = new Map<string, Array<{ id: number | string; score: number; [key: string]: unknown }>>();
    for (const list of lists) {
      channelResultSets.set(list.source, list.results.map(r => ({
        ...r,
        id: r.id,
        score: typeof (r as Record<string, unknown>).score === 'number'
          ? (r as Record<string, unknown>).score as number
          : typeof (r as Record<string, unknown>).similarity === 'number'
            ? ((r as Record<string, unknown>).similarity as number) / 100
            : 0,
      })));
    }

    const enforcementResult: EnforcementResult = enforceChannelRepresentation(
      fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),

exec
/bin/zsh -lc "sed -n '1218,1245p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      let finalMemoryIds: number[] = [];
      let finalScores: number[] = [];
      try {
        if (responseToReturn?.content?.[0]?.text) {
          const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
          const data = parsed?.data as Record<string, unknown> | undefined;
          const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
          finalMemoryIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
          finalScores = results.map(r => (r.score ?? r.similarity ?? 0) as number);
        }
      } catch (_error: unknown) { /* ignore parse errors */ }
      logFinalResult({
        evalRunId: _evalRunId,
        queryId: _evalQueryId,
        resultMemoryIds: finalMemoryIds,
        scores: finalScores,
        fusionMethod: 'rrf',
        latencyMs: Date.now() - _searchStartTime,
      });

      for (const payload of _evalChannelPayloads) {
        logChannelResult({
          evalRunId: _evalRunId,
          queryId: _evalQueryId,
          channel: payload.channel,
          resultMemoryIds: payload.resultMemoryIds,
          scores: payload.scores,
          hitCount: payload.resultMemoryIds.length,

codex
I’ve got the retrieval path locked. One useful angle still worth checking is whether Engram’s topic-key suggestion is doing real normalization work or just naming convenience, because that changes whether the direct topic-key search shortcut is actually a ranking feature or mostly a hygiene feature.
exec
/bin/zsh -lc "sed -n '2820,2898p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | rg -n "SuggestTopicKey|normalizeTopicKey|architecture/|decision/|bug/|session/"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
961:   961		topicKey := normalizeTopicKey(p.TopicKey)
1274:  1274				topicKey = normalizeTopicKey(*p.TopicKey)
1779:  1779				nullableString(normalizeTopicKey(derefString(obs.TopicKey))),
3198:  3198	// SuggestTopicKey generates a stable topic key suggestion from type/title/content.
3199:  3199	// It infers a topic family (e.g. architecture/*, bug/*) and then appends
3201:  3201	func SuggestTopicKey(typ, title, content string) string {
3303:  3303	func normalizeTopicKey(topic string) string {

 succeeded in 0ms:
		}
		if err := json.Unmarshal(data, &generic); err != nil || generic.Project == nil {
			return ""
		}
		return *generic.Project
	}
}

func decodeSyncPayload(payload []byte, dest any) error {
	trimmed := strings.TrimSpace(string(payload))
	if trimmed == "" {
		return fmt.Errorf("empty payload")
	}
	if trimmed[0] != '"' {
		return json.Unmarshal([]byte(trimmed), dest)
	}
	var encoded string
	if err := json.Unmarshal([]byte(trimmed), &encoded); err != nil {
		return err
	}
	return json.Unmarshal([]byte(encoded), dest)
}

func (s *Store) getObservationTx(tx *sql.Tx, id int64) (*Observation, error) {
	row := tx.QueryRow(
		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
		 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
	)
	var o Observation
	if err := row.Scan(&o.ID, &o.SyncID, &o.SessionID, &o.Type, &o.Title, &o.Content, &o.ToolName, &o.Project, &o.Scope, &o.TopicKey, &o.RevisionCount, &o.DuplicateCount, &o.LastSeenAt, &o.CreatedAt, &o.UpdatedAt, &o.DeletedAt); err != nil {
		return nil, err
	}
	return &o, nil
}

func (s *Store) getObservationBySyncIDTx(tx *sql.Tx, syncID string, includeDeleted bool) (*Observation, error) {
	query := `SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
		 FROM observations WHERE sync_id = ?`
	if !includeDeleted {
		query += ` AND deleted_at IS NULL`
	}
	query += ` ORDER BY id DESC LIMIT 1`
	row := tx.QueryRow(query, syncID)
	var o Observation
	if err := row.Scan(&o.ID, &o.SyncID, &o.SessionID, &o.Type, &o.Title, &o.Content, &o.ToolName, &o.Project, &o.Scope, &o.TopicKey, &o.RevisionCount, &o.DuplicateCount, &o.LastSeenAt, &o.CreatedAt, &o.UpdatedAt, &o.DeletedAt); err != nil {
		return nil, err
	}
	return &o, nil
}

func observationPayloadFromObservation(obs *Observation) syncObservationPayload {
	return syncObservationPayload{
		SyncID:    obs.SyncID,
		SessionID: obs.SessionID,
		Type:      obs.Type,
		Title:     obs.Title,
		Content:   obs.Content,
		ToolName:  obs.ToolName,
		Project:   obs.Project,
		Scope:     obs.Scope,
		TopicKey:  obs.TopicKey,
	}
}

func (s *Store) applySessionPayloadTx(tx *sql.Tx, payload syncSessionPayload) error {
	_, err := s.execHook(tx,
		`INSERT INTO sessions (id, project, directory, ended_at, summary)
		 VALUES (?, ?, ?, ?, ?)
		 ON CONFLICT(id) DO UPDATE SET
		   project = excluded.project,
		   directory = excluded.directory,
		   ended_at = COALESCE(excluded.ended_at, sessions.ended_at),
		   summary = COALESCE(excluded.summary, sessions.summary)`,
		payload.ID, payload.Project, payload.Directory, payload.EndedAt, payload.Summary,
	)
	return err
}

exec
/bin/zsh -lc "sed -n '3200,3255p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"SearchPrompts\\(|mem_save_prompt|RecentPrompts\\(|SearchPrompts\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md:84:| `mem_save_prompt` | Save user prompt |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:290:### mem_save_prompt
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md:622:`mem_search`, `mem_save`, `mem_update`, `mem_delete`, `mem_suggest_topic_key`, `mem_save_prompt`, `mem_session_summary`, `mem_context`, `mem_stats`, `mem_timeline`, `mem_get_observation`, `mem_session_start`, `mem_session_end`, `mem_capture_passive`, `mem_merge_projects`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:32:  "mem_save_prompt",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1145:func (s *Store) RecentPrompts(project string, limit int) ([]Prompt, error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1181:func (s *Store) SearchPrompts(query string, project string, limit int) ([]Prompt, error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1624:	prompts, err := s.RecentPrompts(project, 10)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/skills/memory/SKILL.md:18:- `mem_session_start`, `mem_session_end`, `mem_save_prompt`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/skills/memory/SKILL.md:22:select:mcp__plugin_engram_engram__mem_save,mcp__plugin_engram_engram__mem_search,mcp__plugin_engram_engram__mem_context,mcp__plugin_engram_engram__mem_session_summary,mcp__plugin_engram_engram__mem_get_observation,mcp__plugin_engram_engram__mem_suggest_topic_key,mcp__plugin_engram_engram__mem_update,mcp__plugin_engram_engram__mem_session_start,mcp__plugin_engram_engram__mem_session_end,mcp__plugin_engram_engram__mem_save_prompt
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:635:	prompts, err := s.RecentPrompts("", 10)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:643:	// 2. Test SearchPrompts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:644:	searchResult, err := s.SearchPrompts("null", "", 10)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:646:		t.Fatalf("SearchPrompts failed with null project: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1569:	recentPrompts, err := s.RecentPrompts("beta", 1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1577:	searchPrompts, err := s.SearchPrompts("prompt", "alpha", 0)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1618:	if _, err := s.SearchPrompts("x", "", 1); err == nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1619:		t.Fatalf("expected SearchPrompts error when db is closed")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2255:		recentPrompts, err := s.RecentPrompts("", 0)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2545:		if _, err := s.RecentPrompts("", 10); err == nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2550:		if _, err := s.SearchPrompts("prompt", "", 10); err == nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh:65:mem_save, mem_search, mem_context, mem_session_summary, mem_get_observation, mem_save_prompt
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/post-compaction.sh:41:mem_save, mem_search, mem_context, mem_session_summary, mem_get_observation, mem_save_prompt
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/user-prompt-submit.sh:54:  TOOL_MSG="CRITICAL FIRST ACTION — Execute this ToolSearch NOW before responding to the user:"$'\n'"select:mcp__plugin_engram_engram__mem_save,mcp__plugin_engram_engram__mem_search,mcp__plugin_engram_engram__mem_context,mcp__plugin_engram_engram__mem_session_summary,mcp__plugin_engram_engram__mem_get_observation,mcp__plugin_engram_engram__mem_save_prompt"$'\n\n'"After loading tools, call mem_context to check for prior session history before responding."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:80:	"mcp__plugin_engram_engram__mem_save_prompt",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:65:| `mem_save_prompt` | Save a user prompt for future context |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:32:  "mem_save_prompt",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:63:	"mem_save_prompt":       true, // save user prompts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:132:  mem_save_prompt — save user prompt for context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:350:	// ─── mem_save_prompt (profile: agent, eager) ────────────────────────
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:351:	if shouldRegister("mem_save_prompt", allowlist) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:353:			mcp.NewTool("mem_save_prompt",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:122:	s.mux.HandleFunc("GET /prompts/search", s.handleSearchPrompts)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:398:func (s *Server) handleRecentPrompts(w http.ResponseWriter, r *http.Request) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:402:	prompts, err := s.store.RecentPrompts(project, limit)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:411:func (s *Server) handleSearchPrompts(w http.ResponseWriter, r *http.Request) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:418:	prompts, err := s.store.SearchPrompts(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:930:		"mem_suggest_topic_key", "mem_capture_passive", "mem_save_prompt",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:980:		"mem_suggest_topic_key", "mem_capture_passive", "mem_save_prompt",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1106:		"mem_suggest_topic_key", "mem_capture_passive", "mem_save_prompt",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1165:		"mem_suggest_topic_key", "mem_capture_passive", "mem_save_prompt",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1256:		"mem_get_observation", "mem_save_prompt",

exec
/bin/zsh -lc 'rg -n "cheapSeedRetrieve|fts5Bm25Search|fuseResultsMulti|executeStage3|memory_search" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:  name: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:112:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:398:  memory_search: memorySearchSchema as unknown as ToolInputSchema,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:62:  'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:80:      // E3: Delegate to memory_search with sensible defaults
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:427:- `memory_search` (semantic search)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:465:- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:548:### memory_search: Semantic Search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:550:`memory_search()` runs vector-based similarity search across all indexed memories.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:416:      tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:709:    tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:758:    const fused = rrfFusion.fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:10:  - "memory_search"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:622:##### `memory_search`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:646:  "tool": "memory_search",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1539:| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1567:{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/README.md:40:- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:384:  it('C13: Response meta.tool is memory_search', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:388:    expect(envelope.meta.tool).toBe('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts:46:  fts5Bm25Search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:87:  'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:133:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:137:    expect(errorSpy.mock.calls.some((call) => String(call[0]).includes('[schema-validation] memory_search:'))).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:240:   4. memory_search LIMIT CONTRACT (schema + runtime alignment)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:243:describe('memory_search limit contract', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:246:      validateToolInputSchema('memory_search', { cursor: 'opaque-cursor-token' }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:252:      validateToolArgs('memory_search', { cursor: 'opaque-cursor-token' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:258:      validateToolInputSchema('memory_search', { concepts: ['alpha', 'beta'] }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:264:      validateToolInputSchema('memory_search', {}, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:270:      validateToolArgs('memory_search', { query: 'ab', limit: 100 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:276:      validateToolArgs('memory_search', { query: 'ab', limit: 101 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:282:      validateToolInputSchema('memory_search', { query: 'ab', limit: 101 }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:288:      validateToolArgs('memory_search', { concepts: ['solo'] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:292:  it('public schema rejects unknown memory_search parameters', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:294:      validateToolInputSchema('memory_search', { query: 'valid query', unexpected: true }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:300:      validateToolInputSchema('memory_search', { query: 'a' }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:304:  it('runtime rejects unknown memory_search parameters', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:306:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:310:  it('runtime accepts governed scope fields for memory_search', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:312:      validateToolArgs('memory_search', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:322:  it('public and runtime schemas accept response profiles for memory_search', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:329:      validateToolInputSchema('memory_search', args, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:331:    expect(validateToolArgs('memory_search', args)).toEqual(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:93:1. User queries memory_search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:59:    it('T516-2: handle_memory_search alias is exported', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:60:      expect(typeof handler.handle_memory_search).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/search.ts:16:  fts5Bm25Search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:5:import { fuseResults, fuseResultsMulti, fuseResultsCrossVariant, SOURCE_TYPES, DEFAULT_K } from '@spec-kit/shared/algorithms/rrf-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:40:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:63:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:86:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:102:    expect(fuseResultsMulti([])).toEqual([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:103:    expect(fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:117:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:145:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:167:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:186:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:202:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:214:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:232:  it('C138-CV2: single variant behaves like fuseResultsMulti', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:239:    const standard = fuseResultsMulti(variant0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:314:  it('C138-CV7: fuseResultsMulti honors explicit k=0', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:315:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:326:  it('C138-CV8: fuseResultsMulti rejects negative k', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:327:    expect(() => fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:351:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:360:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:370:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:379:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:482:describe('T059: autoDetectIntent Parameter (memory_search)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:7:  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:33:  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:26:  fuseResultsMulti,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:224:  describe('fuseResultsMulti with normalization', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:233:      const results = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:254:      const results = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:270:      const results = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:23:      tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:72:  fts5Bm25Search: vi.fn(() => []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:49:    toolPattern: /^(grep|memory_search)$/i,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:181:const key = generateCacheKey('memory_search', { query: 'test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:184:set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:196:  'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:312:    'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:82:      const key1 = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:83:      const key2 = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:88:      const key1 = generateCacheKey('memory_search', { query: 'auth' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:89:      const key2 = generateCacheKey('memory_search', { query: 'login' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:95:      const key1 = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:352:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:353:      const key2 = generateCacheKey('memory_search', { query: 'test2' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:355:      set(key1, 'value1', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:356:      set(key2, 'value2', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:358:      const invalidated = invalidateByTool('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:366:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:369:      set(key1, 'value1', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:380:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:383:      set(key1, 'value1', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:394:      const searchKey = generateCacheKey('memory_search', { query: 'test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:396:      set(searchKey, 'search_result', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:423:      const key = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:427:        'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:436:      expect(invalidateByTool('memory_search')).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:439:      const second = withCache('memory_search', args, async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:589:      const key = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:593:        'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:603:      const second = withCache('memory_search', args, async () => 'fresh-after-shutdown');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/api-public-surfaces.vitest.ts:11:    expect(searchApi.fts5Bm25Search).toBeTypeOf('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/api-public-surfaces.vitest.ts:21:    expect(publicApi.fts5Bm25Search).toBe(searchApi.fts5Bm25Search);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:10:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:15:import { fts5Bm25Search } from './sqlite-fts.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:466:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1253:    const fused = fuseResultsMulti(fusionLists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:133:    expect(matchRule('memory_search', 'spec.md error context')).not.toBeNull();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:386:          tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:          tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:132:const budget = getTokenBudget('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:139:const enhanced = enhanceDescription('memory_search', 'Search memories');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:107:  cheapSeedRetrieve: (...args: unknown[]) => mockCheapSeedRetrieve(...args),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:7:import { fuseResultsMulti, SOURCE_TYPES } from '@spec-kit/shared/algorithms/rrf-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:124:      const fused = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:150:      const fusedWith = fuseResultsMulti(withDegree);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:151:      const fusedWithout = fuseResultsMulti(withoutDegree);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:171:      const fused = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:186:      const fusedWithout = fuseResultsMulti(baseLists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:188:      const fusedAlso = fuseResultsMulti([...baseLists]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:203:      const fused = fuseResultsMulti(baseLists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:252:    it('Degree RankedList sorted by score feeds correctly into fuseResultsMulti', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:274:      const fused = fuseResultsMulti(degreeLists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:53:  memory_search: ERROR_CODES.SEARCH_FAILED,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:132:  return buildErrorResponse('memory_search', error, { query });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:142:const hint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:181:  it('T022: memory_search has tool-specific hints', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:182:    expect(TOOL_SPECIFIC_HINTS.memory_search).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:183:    expect(typeof TOOL_SPECIFIC_HINTS.memory_search).toBe('object');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:221:  it('T029: memory_search EMBEDDING_FAILED has contextual hint', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:224:      TOOL_SPECIFIC_HINTS.memory_search?.[ERROR_CODES.EMBEDDING_FAILED];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:244:    const searchHint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:246:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:301:      'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:315:    const hasSearch = hasSpecificHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:356:    const searchHints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:362:    const searchHints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:365:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:713:    const toolSpecific = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:718:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:725:    const allSearchHints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:694:  memory_search: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:12:    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: { tool: 'memory_search' } }) }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:415:      "query": "the memory_search tool returns stale results after index rebuild",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:19:        memory_search: 3500,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:41:    const result = validateToolArgs('memory_search', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:6:  fuseResultsMulti,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:18:type MultiFusedResult = ReturnType<typeof fuseResultsMulti>[number];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:66:    const fused = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:84:    const fused = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:123:  it('T028: Single-source has no convergence bonus via fuseResultsMulti', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:128:    const fused = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:134:  it('T029: fuseResultsMulti tracks sources correctly', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:150:    const fused = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:164:  it('T030: fuseResultsMulti() combines multiple sources', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:179:    const fused = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:198:    { name: 'fuseResultsMulti', value: fuseResultsMulti },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:19:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:210:    const fused = fuseResultsMulti([listA, listB]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:453:    const fused = fuseResultsMulti([listHighScores, listLowScores]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:37:    tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:177:  { tool: 'memory_search', handler: 'handleMemorySearch' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:160:      'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:292:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:927:        { id: 'call-1', params: { name: 'memory_search', arguments: {} } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:944:      expect(callArgs[0]).toBe('memory_search')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1054:              name: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1103:        memoryAwareTools: new Set<string>(['memory_search']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1113:        { id: 'call-5', params: { name: 'memory_search', arguments: { query: 'hook validation' } } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1563:      const response = errorsModule!.buildErrorResponse!('memory_search', testError, { query: 'test' })
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1581:      const hint = errorsModule!.getRecoveryHint!('memory_search', 'UNKNOWN_TOOL')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1622:    it('T28b: L2 budget = 3500 (memory_search)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1627:      expect(layerDefs!.getTokenBudget!('memory_search')).toBe(3500)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1703:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2085:      'memory_search': '[L2:Core]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2315:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2342:      expect(result).toContain('memory_search')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:37:  executeStage3: (...args: unknown[]) => mockStage3(...args as []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:6:  fts5Bm25Search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:88:  it('T3: fts5Bm25Search returns matching results', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:89:    const results = fts5Bm25Search(db, 'login');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:99:    const results = fts5Bm25Search(db, 'authentication');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:108:    const results = fts5Bm25Search(db, 'login', { specFolder: 'db-spec' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:115:    const results = fts5Bm25Search(db, 'archived');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:121:    const results = fts5Bm25Search(db, 'archived', { includeArchived: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:128:    const results = fts5Bm25Search(db, '');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:134:    const results = fts5Bm25Search(db, 'login', { limit: 1 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:140:    const results = fts5Bm25Search(db, 'login');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:148:    const results = fts5Bm25Search(db, 'login');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:155:    fts5Bm25Search(db, 'login');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:175:    const results = fts5Bm25Search(compileProbeMissDb, 'login');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:203:    expect(fts5Bm25Search(missingTableDb, 'login')).toEqual([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:237:    expect(fts5Bm25Search(noSuchModuleDb, 'login')).toEqual([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:269:    expect(fts5Bm25Search(bm25FailureDb, 'login')).toEqual([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:10:  fuseResultsMulti,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:37:  it('A1: fuseResultsMulti normalizes scores to [0,1] when SPECKIT_SCORE_NORMALIZATION=true', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:45:    const results = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:54:  it('A2: fuseResultsMulti returns raw (un-normalized) scores when normalization disabled', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:62:    const results = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:106:    const normalized = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:267:    const results = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:304:    const results = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:324:    // By fuseResultsMulti only when the flag is set; testing it directly verifies math
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:118:        memory_search: 'L2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:195:        { tool: 'memory_search', expected: '[L2:Core]' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:227:        { tool: 'memory_search', desc: 'Search memories', prefix: '[L2:Core]' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:253:        { tool: 'memory_search', expected: 3500 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:301:      const info = expectLayerInfo(mod.getLayerInfo('memory_search'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:430:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:304:  `).run(1, 'sess-1', 1, 0.9, now, later, 2, 1, 1, 'memory_search', 'call-1', 'rule-1', 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:40:import { executeStage3 } from '../lib/search/pipeline/stage3-rerank';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:142:    const result = await executeStage3({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:7:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:137: * 1. Fuses the input lists using `fuseResultsMulti` with that K
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:154:    fusedByK.set(k, fuseResultsMulti(lists, { k }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:622:    const fused = fuseResultsMulti(q.channels, { k });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:287:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:296:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:302:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:310:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:311:    expect(resp.meta.tool).toBe('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:318:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:328:  it('F7: Tool-specific hints included for memory_search + E001', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:330:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:353:    const err = createErrorWithHint('E040', 'fail', {}, 'memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:469:  it('K2: Has memory_search, checkpoint_restore, memory_save', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:470:    expect('memory_search' in TOOL_SPECIFIC_HINTS).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:476:    const searchHints = TOOL_SPECIFIC_HINTS['memory_search'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:492:  it('L1: Returns tool-specific hint for memory_search + E001', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:493:    const hint = getRecoveryHint('memory_search', 'E001');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:512:    const hint = getRecoveryHint('memory_search', 'E040');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:524:  it('M1: Returns true for known tool+code (memory_search, E001)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:525:    expect(hasSpecificHint('memory_search', 'E001')).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:543:    const hints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:550:    const hints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1:// TEST: memory_search per-channel eval logging (T056)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:106:describe('T056: memory_search emits per-channel eval rows', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:24:  fuseResultsMulti,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:273:    const fusedWithout = fuseResultsMulti(baseLists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:280:    const fusedWith = fuseResultsMulti(withDegree);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:300:    const fused = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:318:    const fused = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:353:    const fused = fuseResultsMulti(lists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:24:import { fts5Bm25Search } from './sqlite-fts.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:47:/** Options for cheapSeedRetrieve. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:102:export function cheapSeedRetrieve(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:110:    const rawResults = fts5Bm25Search(db, query, { limit });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:123:    console.warn(`[llm-reformulation] cheapSeedRetrieve failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:132:  it('returns null for memory_search', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:133:    const result = await autoSurfaceAtToolDispatch('memory_search', { query: 'some query' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:20:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:58:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:97:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:108:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:135:        tool: 'memory_search'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:143:        tool: 'memory_search'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:152:        tool: 'memory_search'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:186:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:206:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:254:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:312:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:352:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:363:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:373:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:384:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:409:        tool: 'memory_search'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:40:  fuseResultsMulti: vi.fn((lists: MockFusionInput[]) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:6:  fuseResultsMulti,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:97:    const fused = fuseResultsMulti([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:102:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:110:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:120:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:141:    const fused = fuseResultsMulti([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:147:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:161:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:174:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:184:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:194:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:208:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:222:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:233:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:250:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:273:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:287:    const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:226:      expect(HYBRID_SEARCH_SOURCE).toContain('fuseResultsMulti');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:235:      expect(typeof rrfFusion.fuseResultsMulti).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:239:      const fused = rrfFusion.fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:50:    const response = buildErrorResponse('memory_search', error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:68:    const response = buildErrorResponse('memory_search', error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:83:    const response = buildErrorResponse('memory_search', error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:30:  fuseResultsMulti,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:250:      const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:440:      const emptyMulti = fuseResultsMulti([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:605:      const fused = fuseResultsMulti([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:902:      meta: { tool: 'memory_search' }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:626:      expect(md).toContain('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:86:    expect(envelope.meta.tool).toBe('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:123:describe('memory_search UX hook integration', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:59:import { cheapSeedRetrieve, llm, fanout } from '../llm-reformulation.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1090:      const seeds = cheapSeedRetrieve(query, { limit: 3 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:159: * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:162:function fts5Bm25Search(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:260: * Used as a feature-detect before calling fts5Bm25Search, since FTS5
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:268: *   fts5Bm25Search(db, 'memory');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:282:  fts5Bm25Search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:132:export async function executeStage3(input: Stage3Input): Promise<Stage3Output> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:35:import { executeStage3 } from './stage3-rerank.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:118:      executeStage3({

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go | sed -n '116,126p;398,425p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1219,1288p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  if (isMemorySummariesEnabled()) {
    try {
      const db = requireDb();
      if (checkScaleGate(db)) {
        const summaryEmbedding: Float32Array | number[] | null =
          queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));

        if (summaryEmbedding) {
          const summaryResults = querySummaryEmbeddings(db, summaryEmbedding, limit);
          if (summaryResults.length > 0) {
            const existingIds = new Set(candidates.map((r) => String(r.id)));
            const newSummaryHits: PipelineRow[] = [];

            // F02-003: Batch-fetch instead of N+1 per-item queries
            const newSummaryIds = summaryResults
              .filter((sr) => !existingIds.has(String(sr.memoryId)))
              .map((sr) => sr.memoryId);

            if (newSummaryIds.length > 0) {
              const placeholders = newSummaryIds.map(() => '?').join(', ');
              const memRows = db.prepare(
                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
              ).all(...newSummaryIds) as PipelineRow[];

              const memRowMap = new Map(memRows.map((r) => [r.id, r]));
              for (const sr of summaryResults) {
                if (!existingIds.has(String(sr.memoryId))) {
                  const memRow = memRowMap.get(sr.memoryId);
                  if (memRow) {
                    newSummaryHits.push({
                      ...memRow,
                      similarity: sr.similarity * 100,
                      score: sr.similarity,
                    });
                    existingIds.add(String(sr.memoryId));
                  }
                }
              }
            }

            const archiveFilteredSummaryHits = applyArchiveFilter(newSummaryHits, includeArchived);
            const folderFilteredSummaryHits = applyFolderFilter(archiveFilteredSummaryHits, specFolder);
            const tierFilteredSummaryHits = applyTierFilter(folderFilteredSummaryHits, tier);
            const contextFilteredSummaryHits = contextType
              ? tierFilteredSummaryHits.filter((r) => resolveRowContextType(r) === contextType)
              : tierFilteredSummaryHits;
            const scopeFilteredSummaryHits = shouldApplyScopeFiltering
              ? filterRowsByScope(contextFilteredSummaryHits, scopeFilter, allowedSharedSpaceIds)
              : contextFilteredSummaryHits;

            // Apply the same quality threshold that other candidates go through
            const backfilledSummaryHits = backfillMissingQualityScores(scopeFilteredSummaryHits);
            const filteredSummaryHits = filterByMinQualityScore(backfilledSummaryHits, qualityThreshold);

            if (filteredSummaryHits.length > 0) {
              candidates = [...candidates, ...filteredSummaryHits];
              channelCount++;

              if (trace) {
                addTraceEntry(trace, 'candidate', 1, filteredSummaryHits.length, 0, {
                  channel: 'r8-summary-embeddings',
                  summaryHits: filteredSummaryHits.length,
                  preFilterCount: newSummaryHits.length,
                });
              }
            }
          }
        }
      }
    } catch (r8Err: unknown) {

codex
# Iteration 005: SEARCH MECHANISMS

## Focus
SEARCH MECHANISMS: FTS, vector, hybrid, ranking algorithms. Query processing, shortcuts, relevance scoring.

## Findings

### Finding 1: Engram’s real search shortcut is exact `topic_key` lookup, not smarter FTS ranking
- **Source**: [external/internal/store/store.go#L1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1462), [external/internal/store/store.go#L1475](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1475), [external/internal/store/store.go#L1512](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1512), [external/internal/mcp/mcp.go#L302](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L302), [external/internal/store/store.go#L3201](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3201)
- **What it does**: `Search()` checks for `/` in the query, runs a direct `WHERE topic_key = ?` lookup first, stamps those hits with `Rank = -1000`, and prepends them before the normal FTS5 pass. That only works because Engram also ships `mem_suggest_topic_key()` and generates normalized family keys like `architecture/...`, `bug/...`, and `decision/...`.
- **Why it matters for us**: This is more interesting than Engram’s FTS itself. Public already has stronger broad retrieval, but it does not have a first-class exact thread-key lane for “take me back to this evolving topic.” A stable thread key could improve repeated decision/refinement retrieval without replacing `memory_search`.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Engram keeps simple search usable by doing most relevance work at write time
- **Source**: [external/internal/store/store.go#L950](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L950), [external/internal/store/store.go#L966](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L966), [external/internal/store/store.go#L987](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L987), [external/internal/store/store.go#L1013](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1013), [external/internal/store/store.go#L1031](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1031)
- **What it does**: `AddObservation()` first upserts by `topic_key`, incrementing `revision_count`; if no topic hit exists, it runs a rolling-window duplicate check on `normalized_hash`, `type`, and `title`, incrementing `duplicate_count` instead of creating another row. Search is therefore querying a cleaner, more consolidated corpus.
- **Why it matters for us**: Engram’s ranking looks shallow because it assumes better corpus hygiene. Public’s richer retrieval stack compensates for noisier, more heterogeneous memory artifacts. The transferable idea is not “use raw FTS ranking,” but “make repeated refinements collapse into canonical memory threads before retrieval.”
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 3: Engram’s FTS query processing is safe and predictable, but too blunt for our primary retrieval model
- **Source**: [external/internal/store/store.go#L1518](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1518), [external/internal/store/store.go#L1524](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1524), [external/internal/store/store.go#L1546](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1546), [external/internal/store/store.go#L3384](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3384), [sqlite-fts.ts#L162](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L162), [sqlite-fts.ts#L169](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L169), [sqlite-fts.ts#L197](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L197)
- **What it does**: Engram sanitizes by splitting on whitespace, stripping quotes, wrapping each token in quotes, and joining with spaces before `MATCH`. It then orders by raw `fts.rank`. Public’s lexical lane is materially richer: token normalization, `OR` expansion for recall, weighted `bm25(memory_fts, ...)`, and explicit capability probing/fallback around FTS5 availability.
- **Why it matters for us**: Engram’s approach is a good anti-crash baseline, but it gives up too much control over term weighting and query intent. Copying it wholesale would be a regression from Public’s weighted lexical behavior and would throw away useful retrieval instrumentation.
- **Recommendation**: reject
- **Impact**: high

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


hook: Stop
hook: Stop Completed
tokens used
149,161
# Iteration 005: SEARCH MECHANISMS

## Focus
SEARCH MECHANISMS: FTS, vector, hybrid, ranking algorithms. Query processing, shortcuts, relevance scoring.

## Findings

### Finding 1: Engram’s real search shortcut is exact `topic_key` lookup, not smarter FTS ranking
- **Source**: [external/internal/store/store.go#L1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1462), [external/internal/store/store.go#L1475](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1475), [external/internal/store/store.go#L1512](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1512), [external/internal/mcp/mcp.go#L302](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L302), [external/internal/store/store.go#L3201](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3201)
- **What it does**: `Search()` checks for `/` in the query, runs a direct `WHERE topic_key = ?` lookup first, stamps those hits with `Rank = -1000`, and prepends them before the normal FTS5 pass. That only works because Engram also ships `mem_suggest_topic_key()` and generates normalized family keys like `architecture/...`, `bug/...`, and `decision/...`.
- **Why it matters for us**: This is more interesting than Engram’s FTS itself. Public already has stronger broad retrieval, but it does not have a first-class exact thread-key lane for “take me back to this evolving topic.” A stable thread key could improve repeated decision/refinement retrieval without replacing `memory_search`.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Engram keeps simple search usable by doing most relevance work at write time
- **Source**: [external/internal/store/store.go#L950](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L950), [external/internal/store/store.go#L966](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L966), [external/internal/store/store.go#L987](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L987), [external/internal/store/store.go#L1013](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1013), [external/internal/store/store.go#L1031](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1031)
- **What it does**: `AddObservation()` first upserts by `topic_key`, incrementing `revision_count`; if no topic hit exists, it runs a rolling-window duplicate check on `normalized_hash`, `type`, and `title`, incrementing `duplicate_count` instead of creating another row. Search is therefore querying a cleaner, more consolidated corpus.
- **Why it matters for us**: Engram’s ranking looks shallow because it assumes better corpus hygiene. Public’s richer retrieval stack compensates for noisier, more heterogeneous memory artifacts. The transferable idea is not “use raw FTS ranking,” but “make repeated refinements collapse into canonical memory threads before retrieval.”
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 3: Engram’s FTS query processing is safe and predictable, but too blunt for our primary retrieval model
- **Source**: [external/internal/store/store.go#L1518](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1518), [external/internal/store/store.go#L1524](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1524), [external/internal/store/store.go#L1546](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1546), [external/internal/store/store.go#L3384](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3384), [sqlite-fts.ts#L162](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L162), [sqlite-fts.ts#L169](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L169), [sqlite-fts.ts#L197](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L197)
- **What it does**: Engram sanitizes by splitting on whitespace, stripping quotes, wrapping each token in quotes, and joining with spaces before `MATCH`. It then orders by raw `fts.rank`. Public’s lexical lane is materially richer: token normalization, `OR` expansion for recall, weighted `bm25(memory_fts, ...)`, and explicit capability probing/fallback around FTS5 availability.
- **Why it matters for us**: Engram’s approach is a good anti-crash baseline, but it gives up too much control over term weighting and query intent. Copying it wholesale would be a regression from Public’s weighted lexical behavior and would throw away useful retrieval instrumentation.
- **Recommendation**: reject
- **Impact**: high

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
