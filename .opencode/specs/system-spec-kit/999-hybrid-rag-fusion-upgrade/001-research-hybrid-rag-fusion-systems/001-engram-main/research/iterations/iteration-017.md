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
# Iteration 017: INTEGRATION FEASIBILITY

## Focus
INTEGRATION FEASIBILITY: For top 5 adoption candidates, how hard would they be to integrate into Spec Kit Memory?

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
I’m treating this as a read-only deep-research pass over the Engram source and our Spec Kit Memory surfaces, with the goal of ranking the top adoption candidates by integration difficulty and fit. I’ll start by loading the relevant memory context, then read the governing instructions and trace the actual code paths in `external/internal/mcp` and `external/internal/store` before I synthesize the iteration findings.
exec
/bin/zsh -lc "pwd && printf '\\n---\\n' && sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

---
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
/bin/zsh -lc 'rg -n "engram|hybrid-rag-fusion|session lifecycle|topic_key|passive capture|tool profile|ProfileAgent|ProfileAdmin" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
I’ve loaded the repo and external instructions and confirmed this is a read-only iteration, so I’m staying inside source analysis and comparison only. Next I’m tracing the Engram MCP/store code paths that map closest to our adoption candidates, then I’ll compare those against the current Spec Kit Memory handlers to judge actual integration effort instead of just feature appeal.
exec
/bin/zsh -lc 'rg -n "CocoIndex|cancelled|memory_context|memory_search|memory_match_triggers|generate-context|session_bootstrap|code_graph|hybrid-rag-fusion" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
151:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse when patching memory render/reviewer behavior in this checkout and proving fixes through an end-to-end generate-context run
161:- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars
191:- rollout_summaries/2026-04-09T07-35-51-j53b-implement_014_code_graph_upgrades.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T09-35-51-019d712b-3824-7403-9e7e-a2a68ef35e61.jsonl, updated_at=2026-04-09T09:39:44+00:00, thread_id=019d712b-3824-7403-9e7e-a2a68ef35e61)
195:- 014-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
542:- follow_on_tool_use, resolveSessionTrackingId, logFollowOnToolUse, memory_stats schema, session_bootstrap, feedback_events sqlite3
547:- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
697:- rollout_summaries/2026-04-02T05-48-08-5Tzh-deep_review_024_compact_code_graph.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T07-48-08-019d4cbc-18da-7772-8fa1-4eb40c6a021f.jsonl, updated_at=2026-04-02T09:30:47+00:00, thread_id=019d4cbc-18da-7772-8fa1-4eb40c6a021f)
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
747:- rollout_summaries/2026-04-02T15-03-16-TyzB-changelog_024_compact_code_graph.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T17-03-16-019d4eb8-5687-7820-b943-28f8d97369cf.jsonl, updated_at=2026-04-02T15:17:25+00:00, thread_id=019d4eb8-5687-7820-b943-28f8d97369cf)
753:## Task 7: Add dedicated README section for CocoIndex + Compact Code Graph with packet references, outcome success
757:- rollout_summaries/2026-04-02T14-05-56-qyWY-cocoindex_compact_code_graph_readme_section.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T16-05-56-019d4e83-d8f5-7342-833e-98b3e0f731f0.jsonl, updated_at=2026-04-02T14:08:03+00:00, thread_id=019d4e83-d8f5-7342-833e-98b3e0f731f0)
761:- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
767:- rollout_summaries/2026-04-03T11-57-51-M8RC-code_graph_documentation_and_changelog_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-57-51-019d5334-f0f1-7730-8c5e-9ab6db1b631c.jsonl, updated_at=2026-04-04T15:43:31+00:00, thread_id=019d5334-f0f1-7730-8c5e-9ab6db1b631c)
780:- when updating changelog claims, keep wording pinned to implemented behavior evidence (bounded inline `selective_reindex` vs explicit operator `code_graph_scan`) [Task 8]
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
808:- rollout_summaries/2026-04-02T09-20-39-30Ww-compact_code_graph_session_start_injection_debug.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T11-20-39-019d4d7e-a9d9-7081-bf44-8615f401e064.jsonl, updated_at=2026-04-02T10:59:48+00:00, thread_id=019d4d7e-a9d9-7081-bf44-8615f401e064)
812:- code_graph_scan, 026-session-start-injection-debug, create.sh --phase, TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp, session-enrichment.vitest.ts, spec-affinity.vitest.ts
832:- read-only verification, session_bootstrap, session_resume minimal, code_graph_query, startup snapshot note, ensureCodeGraphReady, SELECTIVE_REINDEX_THRESHOLD=50
846:- `session_bootstrap`/`session_resume({ minimal: true })` should still expose freshness-aware graph state and the startup snapshot note; this is a contract-level verification target before deeper debugging [Task 3]
847:- `code_graph_query` read paths call readiness checks with `allowInlineFullScan: false`; small stale deltas trigger bounded inline `selective_reindex`, while broader stale/empty conditions should route to explicit `code_graph_scan` [Task 3]
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1455:- --recovery, RECOVERY_MODE_REQUIRED, allowRecovery, generate-context.ts, loadCollectedData, workflow.ts
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
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
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '220,520p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,320p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
}

// FallbackConfig returns a Config with the given DataDir and default values.
// Use this when DefaultConfig fails and you have resolved the home directory
// through alternative means.
func FallbackConfig(dataDir string) Config {
	return Config{
		DataDir:              dataDir,
		MaxObservationLength: 50000,
		MaxContextResults:    20,
		MaxSearchResults:     20,
		DedupeWindow:         15 * time.Minute,
	}
}

// MaxObservationLength returns the configured maximum content length for observations.
func (s *Store) MaxObservationLength() int {
	return s.cfg.MaxObservationLength
}

// ─── Store ───────────────────────────────────────────────────────────────────

type Store struct {
	db    *sql.DB
	cfg   Config
	hooks storeHooks
}

type execer interface {
	Exec(query string, args ...any) (sql.Result, error)
}

type queryer interface {
	Query(query string, args ...any) (*sql.Rows, error)
}

type rowScanner interface {
	Next() bool
	Scan(dest ...any) error
	Err() error
	Close() error
}

type sqlRowScanner struct {
	rows *sql.Rows
}

func (r sqlRowScanner) Next() bool {
	return r.rows.Next()
}

func (r sqlRowScanner) Scan(dest ...any) error {
	return r.rows.Scan(dest...)
}

func (r sqlRowScanner) Err() error {
	return r.rows.Err()
}

func (r sqlRowScanner) Close() error {

codex
I’ve got the MCP profile and store entry points loaded. I’m now cross-checking with semantic search so I can jump straight to the exact lifecycle, topic-key, and passive-capture implementations; if CocoIndex is weak on this Go subtree again, I’ll fall back to `rg` and direct reads and call that out in the report.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "rg -n \"func \\(s \\*Store\\) (CreateSession|EndSession|FormatContext|AddObservation|Search|SuggestTopicKey|PassiveCapture)|sanitizeFTS|topic_key|revision_count|duplicate_count|deleted_at|CreateSession\\(|EndSession\\(\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"mem_session_start|mem_session_end|mem_session_summary|mem_capture_passive|mem_suggest_topic_key|mem_context|mem_search|ResolveTools|ProfileAgent|ProfileAdmin|shouldRegister|WithDeferLoading|CreateSession\\(|EndSession\\(|FormatContext\\(\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13://	engram mcp --tools=mem_save,mem_search → individual tool names
41://   mem_save, mem_search, mem_context, mem_session_summary,
42://   mem_session_start, mem_session_end, mem_get_observation,
43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
50:// ProfileAgent contains the tool names that AI agents need.
53:var ProfileAgent = map[string]bool{
55:	"mem_search":            true, // search past memories — referenced 6 times
56:	"mem_context":           true, // recent context from previous sessions — referenced 10 times
57:	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
58:	"mem_session_start":     true, // register session start
59:	"mem_session_end":       true, // mark session completed
61:	"mem_suggest_topic_key": true, // stable topic key for upserts — referenced 3 times
62:	"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
67:// ProfileAdmin contains tools for TUI, dashboards, and manual curation
69:var ProfileAdmin = map[string]bool{
78:	"agent": ProfileAgent,
79:	"admin": ProfileAdmin,
82:// ResolveTools takes a comma-separated string of profile names and/or
85:func ResolveTools(input string) map[string]bool {
128:  mem_search — find past work, decisions, or context from previous sessions
129:  mem_context — get recent session history (call at session start or after compaction)
130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
136:  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
160:// shouldRegister returns true if the tool should be registered given the
162:func shouldRegister(name string, allowlist map[string]bool) bool {
170:	// ─── mem_search (profile: agent, core — always in context) ─────────
171:	if shouldRegister("mem_search", allowlist) {
173:			mcp.NewTool("mem_search",
202:	if shouldRegister("mem_save", allowlist) {
265:	if shouldRegister("mem_update", allowlist) {
269:				mcp.WithDeferLoading(true),
302:	// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
303:	if shouldRegister("mem_suggest_topic_key", allowlist) {
305:			mcp.NewTool("mem_suggest_topic_key",
307:				mcp.WithDeferLoading(true),
328:	if shouldRegister("mem_delete", allowlist) {
332:				mcp.WithDeferLoading(true),
351:	if shouldRegister("mem_save_prompt", allowlist) {
375:	// ─── mem_context (profile: agent, core — always in context) ────────
376:	if shouldRegister("mem_context", allowlist) {
378:			mcp.NewTool("mem_context",
400:	if shouldRegister("mem_stats", allowlist) {
404:				mcp.WithDeferLoading(true),
416:	if shouldRegister("mem_timeline", allowlist) {
419:				mcp.WithDescription("Show chronological context around a specific observation. Use after mem_search to drill into the timeline of events surrounding a search result. This is the progressive disclosure pattern: search first, then timeline to understand context."),
420:				mcp.WithDeferLoading(true),
428:					mcp.Description("The observation ID to center the timeline on (from mem_search results)"),
442:	if shouldRegister("mem_get_observation", allowlist) {
445:				mcp.WithDescription("Get the full content of a specific observation by ID. Use when you need the complete, untruncated content of an observation found via mem_search or mem_timeline."),
460:	// ─── mem_session_summary (profile: agent, core — always in context) ─
461:	if shouldRegister("mem_session_summary", allowlist) {
463:			mcp.NewTool("mem_session_summary",
515:	// ─── mem_session_start (profile: agent, deferred) ───────────────────
516:	if shouldRegister("mem_session_start", allowlist) {
518:			mcp.NewTool("mem_session_start",
520:				mcp.WithDeferLoading(true),
542:	// ─── mem_session_end (profile: agent, deferred) ─────────────────────
543:	if shouldRegister("mem_session_end", allowlist) {
545:			mcp.NewTool("mem_session_end",
547:				mcp.WithDeferLoading(true),
565:	// ─── mem_capture_passive (profile: agent, deferred) ─────────────────
566:	if shouldRegister("mem_capture_passive", allowlist) {
568:			mcp.NewTool("mem_capture_passive",
569:				mcp.WithDeferLoading(true),
599:	if shouldRegister("mem_merge_projects", allowlist) {
603:				mcp.WithDeferLoading(true),
729:		s.CreateSession(sessionID, project, "")
868:		s.CreateSession(sessionID, project, "")
894:		context, err := s.FormatContext(project, scope)
1047:		s.CreateSession(sessionID, project, "")
1076:		if err := s.CreateSession(id, project, directory); err != nil {
1089:		if err := s.EndSession(id, summary); err != nil {
1116:			_ = s.CreateSession(sessionID, project, "")

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
460:			topic_key  TEXT,
462:			revision_count INTEGER NOT NULL DEFAULT 1,
463:			duplicate_count INTEGER NOT NULL DEFAULT 1,
467:			deleted_at TEXT,
482:			topic_key,
550:		{name: "topic_key", definition: "TEXT"},
552:		{name: "revision_count", definition: "INTEGER NOT NULL DEFAULT 1"},
553:		{name: "duplicate_count", definition: "INTEGER NOT NULL DEFAULT 1"},
556:		{name: "deleted_at", definition: "TEXT"},
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
1527:		WHERE observations_fts MATCH ? AND o.deleted_at IS NULL
1592:	s.db.QueryRow("SELECT COUNT(*) FROM observations WHERE deleted_at IS NULL").Scan(&stats.TotalObservations)
1595:	rows, err := s.queryItHook(s.db, "SELECT project FROM observations WHERE project IS NOT NULL AND deleted_at IS NULL GROUP BY project ORDER BY MAX(created_at) DESC")
1613:func (s *Store) FormatContext(project, scope string) (string, error) {
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
2940:		`UPDATE observations SET deleted_at = ?, updated_at = datetime('now') WHERE id = ?`,
3065:			topic_key  TEXT,
3067:			revision_count INTEGER NOT NULL DEFAULT 1,
3068:			duplicate_count INTEGER NOT NULL DEFAULT 1,
3072:			deleted_at TEXT,
3082:			scope, topic_key, normalized_hash, revision_count, duplicate_count,
3083:			last_seen_at, created_at, updated_at, deleted_at
3099:			NULLIF(topic_key, ''),
3101:			CASE WHEN revision_count IS NULL OR revision_count < 1 THEN 1 ELSE revision_count END,
3102:			CASE WHEN duplicate_count IS NULL OR duplicate_count < 1 THEN 1 ELSE duplicate_count END,
3106:			deleted_at
3132:			topic_key,
3136:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
3137:		SELECT id, title, content, tool_name, type, project, topic_key
3139:		WHERE deleted_at IS NULL;
3382:// sanitizeFTS wraps each word in quotes so FTS5 doesn't choke on special chars.
3384:func sanitizeFTS(query string) string {
3483:func (s *Store) PassiveCapture(p PassiveCaptureParams) (*PassiveCaptureResult, error) {
3504:			   AND deleted_at IS NULL

exec
/bin/zsh -lc "rg -n \"memory_context|memory_search|memory_match_triggers|generate-context|task_preflight|task_postflight|session_bootstrap|session_resume|memory_health|memory_validate\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:93:1. User queries memory_search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.d.ts:23://# sourceMappingURL=generate-context.d.ts.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:49:    toolPattern: /^(grep|memory_search)$/i,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.d.ts.map:1:{"version":3,"file":"generate-context.d.ts","sourceRoot":"","sources":["../../memory/generate-context.ts"],"names":[],"mappings":"AA4BA,KAAK,uBAAuB,GAAG,MAAM,CAAC,MAAM,EAAE,OAAO,CAAC,GAAG;IAAE,OAAO,EAAE,MAAM,CAAA;CAAE,CAAC;AAE7E,UAAU,kBAAkB;IAC1B,QAAQ,EAAE,MAAM,GAAG,IAAI,CAAC;IACxB,aAAa,EAAE,MAAM,GAAG,IAAI,CAAC;IAC7B,aAAa,EAAE,uBAAuB,GAAG,IAAI,CAAC;IAC9C,SAAS,EAAE,MAAM,GAAG,IAAI,CAAC;CAC1B;AAKD,8DAA8D;AAC9D,MAAM,WAAW,oBAAoB;IACnC,KAAK,EAAE,OAAO,CAAC;IACf,MAAM,CAAC,EAAE,MAAM,CAAC;IAChB,OAAO,CAAC,EAAE,MAAM,CAAC;CAClB;AA4HD,iBAAS,iBAAiB,CAAC,UAAU,EAAE,MAAM,GAAG,oBAAoB,CA8DnE;AAqED,iBAAS,wBAAwB,CAAC,IAAI,EAAE,MAAM,CAAC,MAAM,EAAE,OAAO,CAAC,GAAG,MAAM,GAAG,IAAI,CAS9E;AAED,iBAAe,YAAY,CAAC,KAAK,GAAE,MAAM,CAAC,UAA0B,GAAG,OAAO,CAAC,MAAM,CAAC,CAUrF;AAuED,iBAAe,cAAc,CAC3B,IAAI,GAAE,MAAM,EAA0B,EACtC,WAAW,GAAE,CAAC,KAAK,CAAC,EAAE,MAAM,CAAC,UAAU,KAAK,OAAO,CAAC,MAAM,CAAgB,GACzE,OAAO,CAAC,kBAAkB,CAAC,CAyC7B;AAED,iBAAS,iBAAiB,IAAI,IAAI,CA0GjC;AAKD,iBAAe,IAAI,CACjB,IAAI,GAAE,MAAM,EAA0B,EACtC,WAAW,GAAE,CAAC,KAAK,CAAC,EAAE,MAAM,CAAC,UAAU,KAAK,OAAO,CAAC,MAAM,CAAgB,GACzE,OAAO,CAAC,IAAI,CAAC,CAiCf;AAiBD,OAAO,EACL,IAAI,EACJ,YAAY,EACZ,cAAc,EACd,iBAAiB,EACjB,iBAAiB,EACjB,wBAAwB,GACzB,CAAC"}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:9:// Feature catalog: Validation feedback (memory_validate)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js.map:1:{"version":3,"file":"generate-context.js","sourceRoot":"","sources":["../../memory/generate-context.ts"],"names":[],"mappings":";AAAA,kEAAkE;AAClE,2BAA2B;AAC3B,kEAAkE;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAylBhE,oBAAI;AACJ,oCAAY;AACZ,wCAAc;AACd,8CAAiB;AACjB,8CAAiB;AACjB,4DAAwB;AA5lB1B,kEAAkE;AAClE,sBAAsB;AACtB,kEAAkE;AAClE,2FAA2F;AAE3F,cAAc;AACd,2CAA6B;AAC7B,2CAA6B;AAE7B,mBAAmB;AACnB,wEAAwE;AACxE,kCAQiB;AACjB,+CAAsE;AACtE,wCAA+C;AAC/C,6EAAwE;AAqBxE,kEAAkE;AAClE,eAAe;AACf,kEAAkE;AAClE,MAAM,SAAS,GAAG;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;CA0EjB,CAAC;AAEF,IAAI,OAAO,CAAC,IAAI,CAAC,QAAQ,CAAC,QAAQ,CAAC,IAAI,OAAO,CAAC,IAAI,CAAC,QAAQ,CAAC,IAAI,CAAC,EAAE,CAAC;IACnE,OAAO,CAAC,GAAG,CAAC,SAAS,CAAC,CAAC;IACvB,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;AAClB,CAAC;AAED,sBAAsB;AACtB,IAAI,uBAAuB,GAAG,KAAK,CAAC;AACpC,IAAI,YAAY,GAAG,KAAK,CAAC;AAEzB,6DAA6D;AAC7D,SAAS,oBAAoB,CAAC,MAAc;IAC1C,IAAI,YAAY;QAAE,OAAO,CAAC,8BAA8B;IACxD,YAAY,GAAG,IAAI,CAAC;IAEpB,IAAI,iBAAiB,GAAG,KAAK,CAAC;IAC9B,IAAI,CAAC;QACH,IAAA,gCAAqB,GAAE,CAAC;IAC1B,CAAC;IAAC,OAAO,IAAa,EAAE,CAAC;QACvB,iBAAiB,GAAG,IAAI,CAAC;IAC3B,CAAC;IAED,OAAO,CAAC,KAAK,CAAC,uBAAuB,MAAM,sCAAsC,CAAC,CAAC;IACnF,OAAO,CAAC,IAAI,CAAC,iBAAiB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AAC1C,CAAC;AAED,SAAS,qBAAqB;IAC5B,IAAI,uBAAuB,EAAE,CAAC;QAC5B,OAAO;IACT,CAAC;IAED,OAAO,CAAC,EAAE,CAAC,SAAS,EAAE,GAAG,EAAE,CAAC,oBAAoB,CAAC,SAAS,CAAC,CAAC,CAAC;IAC7D,OAAO,CAAC,EAAE,CAAC,QAAQ,EAAE,GAAG,EAAE,CAAC,oBAAoB,CAAC,QAAQ,CAAC,CAAC,CAAC;IAE3D,uBAAuB,GAAG,IAAI,CAAC;AACjC,CAAC;AAED,kEAAkE;AAClE,4BAA4B;AAC5B,kEAAkE;AAClE,SAAS,wBAAwB,CAAC,eAAuB;IACvD,OAAO,IAAA,gCAAgB,EAAC,IAAI,CAAC,OAAO,CAAC,aAAM,CAAC,YAAY,EAAE,eAAe,CAAC,EAAE,IAAA,0BAAmB,GAAE,CAAC,KAAK,IAAI,CAAC;AAC9G,CAAC;AAED,SAAS,iBAAiB,CAAC,UAAkB;IAC3C,MAAM,UAAU,GAAG,IAAI,CAAC,QAAQ,CAAC,UAAU,CAAC,CAAC;IAE7C,kHAAkH;IAClH,MAAM,eAAe,GAAG,UAAU,CAAC,OAAO,CAAC,KAAK,EAAE,GAAG,CAAC,CAAC,OAAO,CAAC,MAAM,EAAE,EAAE,CAAC,CAAC;IAC3E,4DAA4D;IAC5D,MAAM,gBAAgB,GAAG,eAAe,CAAC,KAAK,CAAC,GAAG,CAAC,CAAC;IACpD,oEAAoE;IACpE,IAAI,gBAAgB,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC;QACjC,MAAM,OAAO,GAAG,gBAAgB,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC;QAC3C,IAAI,0BAAmB,CAAC,IAAI,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC;YACjF,uEAAuE;YACvE,MAAM,cAAc,GAAG,wBAAwB,CAAC,eAAe,CAAC,CAAC;YAEjE,IAAI,CAAC,cAAc,EAAE,CAAC;gBACpB,qFAAqF;gBACrF,KAAK,MAAM,QAAQ,IAAI,IAAA,0BAAmB,GAAE,EAAE,CAAC;oBAC7C,MAAM,SAAS,GAAG,IAAI,CAAC,IAAI,CAAC,QAAQ,EAAE,eAAe,CAAC,CAAC;oBACvD,IACE,CAAC,IAAI,CAAC,UAAU,CAAC,eAAe,CAAC;wBACjC,MAAM,CAAC,UAAU,CAAC,SAAS,CAAC;wBAC5B,IAAA,gCAAgB,EAAC,SAAS,EAAE,IAAA,0BAAmB,GAAE,CAAC,KAAK,IAAI,EAC3D,CAAC;wBACD,OAAO,EAAE,KAAK,EAAE,IAAI,EAAE,CAAC;oBACzB,CAAC;gBACH,CAAC;gBACD,OAAO;oBACL,KAAK,EAAE,KAAK;oBACZ,MAAM,EAAE,yDAAyD,UAAU,EAAE;iBAC9E,CAAC;YACJ,CAAC;YACD,OAAO,EAAE,KAAK,EAAE,IAAI,EAAE,CAAC;QACzB,CAAC;IACH,CAAC;IAED,IAAI,CAAC,0BAAmB,CAAC,IAAI,CAAC,UAAU,CAAC,EAAE,CAAC;QAC1C,IAAI,SAAS,CAAC,IAAI,CAAC,UAAU,CAAC,EAAE,CAAC;YAC/B,IAAI,OAAO,CAAC,IAAI,CAAC,UAAU,CAAC,EAAE,CAAC;gBAC7B,OAAO,EAAE,KAAK,EAAE,KAAK,EAAE,MAAM,EAAE,sCAAsC,EAAE,CAAC;YAC1E,CAAC;YACD,IAAI,GAAG,CAAC,IAAI,CAAC,UAAU,CAAC,EAAE,CAAC;gBACzB,OAAO,EAAE,KAAK,EAAE,KAAK,EAAE,MAAM,EAAE,sDAAsD,EAAE,CAAC;YAC1F,CAAC;YACD,IAAI,CAAC,QAAQ,CAAC,IAAI,CAAC,UAAU,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC;gBACxC,OAAO,EAAE,KAAK,EAAE,KAAK,EAAE,MAAM,EAAE,mEAAmE,EAAE,CAAC;YACvG,CAAC;QACH,CAAC;QACD,OAAO,EAAE,KAAK,EAAE,KAAK,EAAE,MAAM,EAAE,wDAAwD,EAAE,CAAC;IAC5F,CAAC;IAED,MAAM,cAAc,GAAG,wBAAwB,CAAC,eAAe,CAAC,CAAC;IAEjE,IAAI,CAAC,cAAc,EAAE,CAAC;QACpB,0EAA0E;QAC1E,yFAAyF;QACzF,OAAO;YACL,KAAK,EAAE,KAAK;YACZ,MAAM,EAAE,yDAAyD,UAAU,EAAE;SAC9E,CAAC;IACJ,CAAC;IAED,OAAO,EAAE,KAAK,EAAE,IAAI,EAAE,CAAC;AACzB,CAAC;AAED,SAAS,6BAA6B,CAAC,MAAc;IACnD,MAAM,UAAU,GAAG,IAAI,CAAC,QAAQ,CAAC,MAAM,CAAC,CAAC;IACzC,MAAM,yBAAyB,GAAG,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,IAAI,CAC7D,MAAM,CAAC,UAAU,CAAC,QAAQ,CAAC;QAC3B,MAAM,CAAC,UAAU,CAAC,kBAAkB,CAAC,CACtC;QACC,CAAC,CAAC,IAAI,CAAC,IAAI,CAAC,aAAM,CAAC,YAAY,EAAE,MAAM,CAAC;QACxC,CAAC,CAAC,IAAI,CAAC;IAET,IAAI,kBAAkB,GAAkB,IAAI,CAAC;IAC7C,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,EAAE,CAAC;QAC9B,IAAI,IAAI,CAAC,UAAU,CAAC,MAAM,CAAC,EAAE,CAAC;YAC5B,MAAM,gBAAgB,GAAG,MAAM,CAAC,OAAO,CAAC,MAAM,EAAE,EAAE,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,CAAC;YACnF,MAAM,WAAW,GAAG,gBAAgB,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC;YAC5C,MAAM,aAAa,GAAG,gBAAgB,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC;YAE9C,IACE,CAAC,WAAW,IAAI,0BAAmB,CAAC,IAAI,CAAC,WAAW,CAAC,CAAC;gBACtD,CAAC,aAAa,IAAI,WAAW,IAAI,0BAAmB,CAAC,IAAI,CAAC,aAAa,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,WAAW,CAAC,CAAC,EAClH,CAAC;gBACD,kBAAkB,GAAG,MAAM,CAAC;YAC9B,CAAC;QACH,CAAC;QAED,IAAI,OAAO,GAAG,MAAM,CAAC;QACrB,IAAI,OAAO,CAAC,UAAU,CAAC,kBAAkB,CAAC,EAAE,CAAC;YAC3C,OAAO,GAAG,OAAO,CAAC,KAAK,CAAC,kBAAkB,CAAC,MAAM,CAAC,CAAC;QACrD,CAAC;aAAM,IAAI,OAAO,CAAC,UAAU,CAAC,QAAQ,CAAC,EAAE,CAAC;YACxC,OAAO,GAAG,OAAO,CAAC,KAAK,CAAC,QAAQ,CAAC,MAAM,CAAC,CAAC;QAC3C,CAAC;QACD,OAAO,GAAG,OAAO,CAAC,OAAO,CAAC,MAAM,EAAE,EAAE,CAAC,CAAC;QAEtC,IAAI,CAAC,kBAAkB,IAAI,yBAAyB,IAAI,MAAM,CAAC,UAAU,CAAC,yBAAyB,CAAC,EAAE,CAAC;YACrG,kBAAkB,GAAG,yBAAyB,CAAC;QACjD,CAAC;QAED,MAAM,QAAQ,GAAG,OAAO,CAAC,KAAK,CAAC,GAAG,CAAC,CAAC;QACpC,IAAI,CAAC,kBAAkB,IAAI,QAAQ,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC;YAChD,KAAK,MAAM,QAAQ,IAAI,IAAA,0BAAmB,GAAE,EAAE,CAAC;gBAC7C,MAAM,SAAS,GAAG,IAAI,CAAC,IAAI,CAAC,QAAQ,EAAE,GAAG,QAAQ,CAAC,CAAC;gBACnD,IAAI,MAAM,CAAC,UAAU,CAAC,SAAS,CAAC,EAAE,CAAC;oBACjC,kBAAkB,GAAG,SAAS,CAAC;oBAC/B,MAAM;gBACR,CAAC;YACH,CAAC;YACD,IAAI,CAAC,kBAAkB,IAAI,0BAAmB,CAAC,IAAI,CAAC,QAAQ,CAAC,QAAQ,CAAC,MAAM,GAAG,CAAC,CAAC,CAAC,EAAE,CAAC;gBACnF,MAAM,SAAS,GAAG,IAAA,yBAAkB,GAAE,CAAC;gBACvC,IAAI,SAAS,EAAE,CAAC;oBACd,kBAAkB,GAAG,IAAI,CAAC,IAAI,CAAC,SAAS,EAAE,GAAG,QAAQ,CAAC,CAAC;gBACzD,CAAC;YACH,CAAC;QACH,CAAC;IACH,CAAC;IAED,IAAI,kBAAkB,EAAE,CAAC;QACvB,OAAO,kBAAkB,CAAC;IAC5B,CAAC;IAED,MAAM,gBAAgB,GAAG,CACvB,MAAM,CAAC,UAAU,CAAC,QAAQ,CAAC;QAC3B,MAAM,CAAC,UAAU,CAAC,kBAAkB,CAAC;QACrC,gCAAyB,CAAC,IAAI,CAAC,UAAU,CAAC,CAC3C,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,CAAC;IAE/B,OAAO,gBAAgB,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,IAAI,CAAC;AAC1C,CAAC;AAED,SAAS,wBAAwB,CAAC,IAA6B;IAC7D,KAAK,MAAM,GAAG,IAAI,CAAC,YAAY,EAAE,aAAa,EAAE,aAAa,CAAC,EAAE,CAAC;QAC/D,MAAM,KAAK,GAAG,IAAI,CAAC,GAAG,CAAC,CAAC;QACxB,IAAI,OAAO,KAAK,KAAK,QAAQ,IAAI,KAAK,CAAC,IAAI,EAAE,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC;YACzD,OAAO,KAAK,CAAC,IAAI,EAAE,CAAC;QACtB,CAAC;IACH,CAAC;IAED,OAAO,IAAI,CAAC;AACd,CAAC;AAED,KAAK,UAAU,YAAY,CAAC,QAA2B,OAAO,CAAC,KAAK;IAClE,OAAO,MAAM,IAAI,OAAO,CAAS,CAAC,OAAO,EAAE,MAAM,EAAE,EAAE;QACnD,IAAI,MAAM,GAAG,EAAE,CAAC;QAChB,KAAK,CAAC,WAAW,CAAC,MAAM,CAAC,CAAC;QAC1B,KAAK,CAAC,EAAE,CAAC,MAAM,EAAE,CAAC,KAAa,EAAE,EAAE;YACjC,MAAM,IAAI,KAAK,CAAC;QAClB,CAAC,CAAC,CAAC;QACH,KAAK,CAAC,EAAE,CAAC,KAAK,EAAE,GAAG,EAAE,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC;QACvC,KAAK,CAAC,EAAE,CAAC,OAAO,EAAE,MAAM,CAAC,CAAC;IAC5B,CAAC,CAAC,CAAC;AACL,CAAC;AAED,SAAS,mBAAmB,CAAC,OAAe,EAAE,WAAiC;IAC7E,IAAI,OAAO,CAAC,IAAI,EAAE,CAAC,MAAM,KAAK,CAAC,EAAE,CAAC;QAChC,MAAM,IAAI,KAAK,CAAC,GAAG,WAAW,mCAAmC,CAAC,CAAC;IACrE,CAAC;IAED,IAAI,MAAe,CAAC;IACpB,IAAI,CAAC;QACH,MAAM,GAAG,IAAI,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC;IAC/B,CAAC;IAAC,OAAO,KAAc,EAAE,CAAC;QACxB,MAAM,MAAM,GAAG,KAAK,YAAY,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;QACtE,MAAM,IAAI,KAAK,CAAC,6BAA6B,WAAW,KAAK,MAAM,EAAE,CAAC,CAAC;IACzE,CAAC;IAED,IAAI,OAAO,MAAM,KAAK,QAAQ,IAAI,MAAM,KAAK,IAAI,IAAI,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,EAAE,CAAC;QAC3E,MAAM,IAAI,KAAK,CAAC,GAAG,WAAW,iCAAiC,CAAC,CAAC;IACnE,CAAC;IAED,OAAO,MAAiC,CAAC;AAC3C,CAAC;AAED,KAAK,UAAU,4BAA4B,CACzC,IAA0B,EAC1B,IAAc,EACd,WAA2D;IAE3D,IAAI,IAAI,KAAK,SAAS,IAAI,OAAO,CAAC,KAAK,CAAC,KAAK,EAAE,CAAC;QAC9C,OAAO,CAAC,KAAK,CAAC,8BAA8B,CAAC,CAAC;QAC9C,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAClB,CAAC;IAED,MAAM,OAAO,GAAG,IAAI,KAAK,SAAS;QAChC,CAAC,CAAC,MAAM,WAAW,EAAE;QACrB,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAEZ,IAAI,IAAI,KAAK,QAAQ,IAAI,OAAO,KAAK,SAAS,EAAE,CAAC;QAC/C,MAAM,IAAI,KAAK,CAAC,gDAAgD,CAAC,CAAC;IACpE,CAAC;IAED,wDAAwD;IACxD,IAAI,IAAI,KAAK,QAAQ,IAAI,CAAC,OAAO,KAAK,SAAS,IAAI,OAAO,CAAC,IAAI,EAAE,CAAC,MAAM,KAAK,CAAC,CAAC,EAAE,CAAC;QAChF,OAAO,CAAC,GAAG,CAAC,IAAI,CAAC,SAAS,CAAC,EAAE,KAAK,EAAE,kBAAkB,EAAE,OAAO,EAAE,oBAAoB,EAAE,CAAC,CAAC,CAAC;QAC1F,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAClB,CAAC;IAED,MAAM,OAAO,GAAG,mBAAmB,CAAC,OAAO,IAAI,EAAE,EAAE,IAAI,CAAC,CAAC;IACzD,MAAM,qBAAqB,GAAG,IAAI,CAAC,IAAI,KAAK,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;IAC/D,MAAM,cAAc,GAAG,qBAAqB,CAAC,CAAC,CAAC,6BAA6B,CAAC,qBAAqB,CAAC,IAAI,qBAAqB,CAAC,CAAC,CAAC,IAAI,CAAC;IACpI,MAAM,gBAAgB,GAAG,wBAAwB,CAAC,OAAO,CAAC,CAAC;IAC3D,MAAM,aAAa,GAAG,gBAAgB,CAAC,CAAC,CAAC,CAAC,6BAA6B,CAAC,gBAAgB,CAAC,IAAI,gBAAgB,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC;IACtH,MAAM,aAAa,GAAG,cAAc,IAAI,aAAa,CAAC;IAEtD,IAAI,CAAC,aAAa,EAAE,CAAC;QACnB,MAAM,IAAI,KAAK,CAAC,GAAG,IAAI,mFAAmF,CAAC,CAAC;IAC9G,CAAC;IAED,OAAO;QACL,QAAQ,EAAE,IAAI;QACd,aAAa;QACb,aAAa,EAAE;YACb,GAAG,OAAO;YACV,OAAO,EAAE,MAAM;SAChB;QACD,SAAS,EAAE,IAAI;KAChB,CAAC;AACJ,CAAC;AAED,kEAAkE;AAClE,0BAA0B;AAC1B,kEAAkE;AAClE,KAAK,UAAU,cAAc,CAC3B,OAAiB,OAAO,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,EACtC,cAA8D,YAAY;IAE1E,kEAAkE;IAClE,IAAI,SAAS,GAAkB,IAAI,CAAC;IACpC,MAAM,YAAY,GAAa,EAAE,CAAC;IAClC,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,IAAI,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE,CAAC;QACrC,IAAI,IAAI,CAAC,CAAC,CAAC,KAAK,cAAc,EAAE,CAAC;YAC/B,MAAM,SAAS,GAAG,IAAI,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC;YAC9B,IAAI,CAAC,SAAS,IAAI,SAAS,CAAC,UAAU,CAAC,IAAI,CAAC,IAAI,SAAS,CAAC,IAAI,EAAE,CAAC,MAAM,KAAK,CAAC,EAAE,CAAC;gBAC9E,MAAM,IAAI,KAAK,CAAC,yCAAyC,CAAC,CAAC;YAC7D,CAAC;YACD,SAAS,GAAG,SAAS,CAAC,IAAI,EAAE,CAAC;YAC7B,CAAC,EAAE,CAAC,CAAC,iBAAiB;YACtB,SAAS;QACX,CAAC;QACD,YAAY,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC;IAC7B,CAAC;IAED,MAAM,CAAC,UAAU,EAAE,YAAY,CAAC,GAAG,YAAY,CAAC;IAChD,IAAI,CAAC,UAAU,EAAE,CAAC;QAChB,OAAO,EAAE,QAAQ,EAAE,IAAI,EAAE,aAAa,EAAE,IAAI,EAAE,aAAa,EAAE,IAAI,EAAE,SAAS,EAAE,CAAC;IACjF,CAAC;IAED,IAAI,UAAU,KAAK,SAAS,IAAI,UAAU,KAAK,QAAQ,EAAE,CAAC;QACxD,MAAM,UAAU,GAAG,MAAM,4BAA4B,CAAC,UAAU,EAAE,YAAY,EAAE,WAAW,CAAC,CAAC;QAC7F,OAAO,EAAE,GAAG,UAAU,EAAE,SAAS,EAAE,CAAC;IACtC,CAAC;IAED,MAAM,kBAAkB,GAAG,6BAA6B,CAAC,UAAU,CAAC,CAAC;IACrE,IAAI,kBAAkB,EAAE,CAAC;QACvB,MAAM,IAAI,KAAK,CACb,kDAAkD;YAClD,+DAA+D,CAChE,CAAC;IACJ,CAAC;IAED,OAAO;QACL,QAAQ,EAAE,UAAU;QACpB,aAAa,EAAE,YAAY,IAAI,IAAI;QACnC,aAAa,EAAE,IAAI;QACnB,SAAS;KACV,CAAC;AACJ,CAAC;AAED,SAAS,iBAAiB;IACxB,MAAM,aAAa,GAAG,aAAM,CAAC,eAAe,CAAC;IAC7C,IAAI,CAAC,aAAa;QAAE,OAAO;IAE3B,MAAM,UAAU,GAAG,iBAAiB,CAAC,aAAa,CAAC,CAAC;IAEpD,IAAI,UAAU,CAAC,OAAO,EAAE,CAAC;QACvB,OAAO,CAAC,IAAI,CAAC,eAAe,UAAU,CAAC,OAAO,EAAE,CAAC,CAAC;IACpD,CAAC;IAED,IAAI,UAAU,CAAC,KAAK;QAAE,OAAO;IAE7B,+EAA+E;IAC/E,MAAM,aAAa,GAAG,IAAI,CAAC,QAAQ,CAAC,aAAa,CAAC,CAAC;IACnD,IAAI,0BAAmB,CAAC,IAAI,CAAC,aAAa,CAAC,EAAE,CAAC;QAC5C,2EAA2E;QAC3E,sDAAsD;QACtD,MAAM,QAAQ,GAAG,IAAA,0BAAmB,EAAC,aAAa,CAAC,CAAC;QACpD,IAAI,QAAQ,EAAE,CAAC;YACb,OAAO,CAAC,KAAK,CAAC,6BAA6B,aAAa,OAAO,QAAQ,EAAE,CAAC,CAAC;YAC3E,aAAM,CAAC,eAAe,GAAG,QAAQ,CAAC;YAClC,OAAO;QACT,CAAC;QACD,2DAA2D;IAC7D,CAAC;IAED,OAAO,CAAC,KAAK,CAAC,wCAAwC,aAAa,EAAE,CAAC,CAAC;IACvE,OAAO,CAAC,KAAK,CAAC,cAAc,UAAU,CAAC,MAAM,EAAE,CAAC,CAAC;IACjD,OAAO,CAAC,KAAK,CAAC,yEAAyE,CAAC,CAAC;IAEzF,MAAM,QAAQ,GAAG,IAAA,yBAAkB,GAAE,IAAI,IAAI,CAAC,IAAI,CAAC,aAAM,CAAC,YAAY,EAAE,OAAO,CAAC,CAAC;IACjF,IAAI,MAAM,CAAC,UAAU,CAAC,QAAQ,CAAC,EAAE,CAAC;QAChC,IAAI,CAAC;YACH,MAAM,SAAS,GAAG,MAAM,CAAC,WAAW,CAAC,QAAQ,CAAC,CAAC;YAC/C,MAAM,OAAO,GAAG,SAAS,CAAC,MAAM,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,QAAQ,CAAC,aAAa,CAAC,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC;YAEjH,IAAI,OAAO,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC;gBACvB,OAAO,CAAC,KAAK,CAAC,eAAe,CAAC,CAAC;gBAC/B,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,OAAO,CAAC,KAAK,CAAC,OAAO,CAAC,EAAE,CAAC,CAAC,CAAC;YACpD,CAAC;iBAAM,CAAC;gBACN,+DAA+D;gBAC/D,IAAI,WAAW,GAAa,EAAE,CAAC;gBAC/B,MAAM,UAAU,GAAG,IAAI,CAAC,QAAQ,CAAC,aAAa,CAAC,CAAC;gBAEhD,KAAK,MAAM,QAAQ,IAAI,SAAS,EAAE,CAAC;oBACjC,MAAM,MAAM,GAAG,0BAAmB,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;oBAClD,MAAM,UAAU,GAAG,8BAAuB,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;oBAC1D,IAAI,CAAC,MAAM,IAAI,CAAC,UAAU;wBAAE,SAAS;oBACrC,MAAM,OAAO,GAAG,IAAI,CAAC,IAAI,CAAC,QAAQ,EAAE,QAAQ,CAAC,CAAC;oBAC9C,IAAI,CAAC;wBACH,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,CAAC,WAAW,EAAE;4BAAE,SAAS;wBACtD,MAAM,WAAW,GAAG,MAAM,CAAC,WAAW,CAAC,OAAO,CAAC,CAAC;wBAChD,kDAAkD;wBAClD,MAAM,YAAY,GAAG,WAAW,CAAC,MAAM,CACrC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,QAAQ,CAAC,UAAU,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,CAAC,CAAC,CAC7D,CAAC;wBACF,KAAK,MAAM,KAAK,IAAI,YAAY,EAAE,CAAC;4BACjC,WAAW,CAAC,IAAI,CAAC,GAAG,QAAQ,IAAI,KAAK,EAAE,CAAC,CAAC;wBAC3C,CAAC;wBACD,0EAA0E;wBAC1E,IAAI,UAAU,EAAE,CAAC;4BACf,KAAK,MAAM,QAAQ,IAAI,WAAW,EAAE,CAAC;gCACnC,IAAI,CAAC,0BAAmB,CAAC,IAAI,CAAC,QAAQ,CAAC;oCAAE,SAAS;gCAClD,MAAM,OAAO,GAAG,IAAI,CAAC,IAAI,CAAC,OAAO,EAAE,QAAQ,CAAC,CAAC;gCAC7C,IAAI,CAAC;oCACH,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,CAAC,WAAW,EAAE;wCAAE,SAAS;oCACtD,MAAM,aAAa,GAAG,MAAM,CAAC,WAAW,CAAC,OAAO,CAAC,CAAC;oCAClD,MAAM,SAAS,GAAG,aAAa,CAAC,MAAM,CACpC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,QAAQ,CAAC,UAAU,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,CAAC,CAAC,CAC7D,CAAC;oCACF,KAAK,MAAM,EAAE,IAAI,SAAS,EAAE,CAAC;wCAC3B,WAAW,CAAC,IAAI,CAAC,GAAG,QAAQ,IAAI,QAAQ,IAAI,EAAE,EAAE,CAAC,CAAC;oCACpD,CAAC;gCACH,CAAC;gCAAC,OAAO,MAAe,EAAE,CAAC;oCACzB,IAAI,MAAM,YAAY,KAAK,EAAE,CAAC;wCAC5B,0BAA0B;oCAC5B,CAAC;gCACH,CAAC;4BACH,CAAC;wBACH,CAAC;oBACH,CAAC;oBAAC,OAAO,MAAe,EAAE,CAAC;wBACzB,IAAI,MAAM,YAAY,KAAK,EAAE,CAAC;4BAC5B,0BAA0B;wBAC5B,CAAC;oBACH,CAAC;gBACH,CAAC;gBAED,IAAI,WAAW,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC;oBAC3B,OAAO,CAAC,KAAK,CAAC,+BAA+B,CAAC,CAAC;oBAC/C,WAAW,CAAC,OAAO,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,OAAO,CAAC,KAAK,CAAC,OAAO,CAAC,EAAE,CAAC,CAAC,CAAC;gBACxD,CAAC;qBAAM,CAAC;oBACN,MAAM,QAAQ,GAAG,SAAS,CAAC,MAAM,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,0BAAmB,CAAC,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,KAAK,CAAC,cAAc,CAAC,CAAC;yBACtE,IAAI,EAAE,CAAC,OAAO,EAAE,CAAC,KAAK,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC;oBACxD,IAAI,QAAQ,CAAC,MAAM,EAAE,CAAC;wBACpB,OAAO,CAAC,KAAK,CAAC,yBAAyB,CAAC,CAAC;wBACzC,QAAQ,CAAC,OAAO,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,OAAO,CAAC,KAAK,CAAC,OAAO,CAAC,EAAE,CAAC,CAAC,CAAC;oBACrD,CAAC;gBACH,CAAC;YACH,CAAC;QACH,CAAC;QAAC,OAAO,KAAc,EAAE,CAAC;YACxB,MAAM,MAAM,GAAG,KAAK,YAAY,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;YACtE,OAAO,CAAC,KAAK,CAAC,iDAAiD,EAAE,MAAM,CAAC,CAAC;QAC3E,CAAC;IACH,CAAC;IACD,OAAO,CAAC,KAAK,CAAC,sIAAsI,CAAC,CAAC;IACtJ,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;AAClB,CAAC;AAED,kEAAkE;AAClE,sBAAsB;AACtB,kEAAkE;AAClE,KAAK,UAAU,IAAI,CACjB,OAAiB,OAAO,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,EACtC,cAA8D,YAAY;IAE1E,OAAO,CAAC,KAAK,CAAC,4BAA4B,CAAC,CAAC;IAE5C,IAAI,CAAC;QACH,MAAM,MAAM,GAAG,MAAM,cAAc,CAAC,IAAI,EAAE,WAAW,CAAC,CAAC;QACvD,aAAM,CAAC,SAAS,GAAG,MAAM,CAAC,QAAQ,CAAC;QACnC,aAAM,CAAC,eAAe,GAAG,MAAM,CAAC,aAAa,CAAC;QAC9C,iBAAiB,EAAE,CAAC;QAEpB,MAAM,IAAA,sBAAW,EAAC;YAChB,QAAQ,EAAE,MAAM,CAAC,aAAa,CAAC,CAAC,CAAC,SAAS,CAAC,CAAC,CAAC,aAAM,CAAC,SAAS,IAAI,SAAS;YAC1E,aAAa,EAAE,aAAM,CAAC,eAAe,IAAI,SAAS;YAClD,aAAa,EAAE,MAAM,CAAC,aAAa,IAAI,SAAS;YAChD,UAAU,EAAE,MAAM,CAAC,aAAa;gBAC9B,CAAC,CAAC,SAAS;gBACX,CAAC,CAAC,GAAG,EAAE,CAAC,IAAA,2BAAiB,EAAC,EAAE,CAAC;YAC/B,oBAAoB,EAAE,yCAAkB;YACxC,SAAS,EAAE,MAAM,CAAC,SAAS,IAAI,SAAS;SACzC,CAAC,CAAC;IACL,CAAC;IAAC,OAAO,KAAc,EAAE,CAAC;QACxB,MAAM,MAAM,GAAG,KAAK,YAAY,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;QACtE,MAAM,UAAU,GAAG,iQAAiQ,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC;QAElS,IAAI,UAAU,EAAE,CAAC;YACf,OAAO,CAAC,KAAK,CAAC,YAAY,MAAM,EAAE,CAAC,CAAC;QACtC,CAAC;aAAM,CAAC;YACN,OAAO,CAAC,KAAK,CAAC,mBAAmB,EAAE,MAAM,CAAC,CAAC;YAC3C,IAAI,KAAK,YAAY,KAAK,EAAE,CAAC;gBAC3B,OAAO,CAAC,KAAK,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC;YAC7B,CAAC;QACH,CAAC;QACD,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAClB,CAAC;AACH,CAAC;AAED,kEAAkE;AAClE,aAAa;AACb,kEAAkE;AAClE,IAAI,OAAO,CAAC,IAAI,KAAK,MAAM,EAAE,CAAC;IAC5B,qBAAqB,EAAE,CAAC;IACxB,IAAI,EAAE,CAAC,KAAK,CAAC,CAAC,KAAc,EAAE,EAAE;QAC9B,MAAM,MAAM,GAAG,KAAK,YAAY,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;QACtE,OAAO,CAAC,KAAK,CAAC,gBAAgB,MAAM,EAAE,CAAC,CAAC;QACxC,IAAI,KAAK,YAAY,KAAK,EAAE,CAAC;YAC3B,OAAO,CAAC,KAAK,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC;QAC7B,CAAC;QACD,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAClB,CAAC,CAAC,CAAC;AACL,CAAC"}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:62:Usage: node generate-context.js [options] <input>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:66:                    - JSON file mode: node generate-context.js data.json [spec-folder]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:75:  node generate-context.js /tmp/context-data.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:76:  node generate-context.js /tmp/context-data.json specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:77:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:78:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:79:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:490:            console.error('[generate-context] Failed to list spec folders:', errMsg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:493:    console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:546://# sourceMappingURL=generate-context.js.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:4:// When wasUseful=false is recorded via memory_validate, reduce the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:20:// Feature catalog: Validation feedback (memory_validate)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:312:    'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:181:const key = generateCacheKey('memory_search', { query: 'test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:184:set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:196:  'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:27:// Feature catalog: Validation feedback (memory_validate)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:53:  memory_search: ERROR_CODES.SEARCH_FAILED,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:31:// Feature catalog: Validation feedback (memory_validate)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:132:  return buildErrorResponse('memory_search', error, { query });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:142:const hint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:267:export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:292:export const handle_memory_validate = lazyFunction(getCheckpointsModule, 'handle_memory_validate');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:298:export const handle_task_preflight = lazyFunction(getSessionLearningModule, 'handle_task_preflight');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:299:export const handle_task_postflight = lazyFunction(getSessionLearningModule, 'handle_task_postflight');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:138:// Default hint is "Run memory_health() for diagnostics".
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:149:      'Run memory_health() to check embedding system status'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:152:    toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:179:      'Run memory_health() to see current provider status'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:182:    toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:242:    toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:247:      'Run memory_health() to check database integrity',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:252:    toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:268:      'Contact support with schema version info from memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:271:    toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:276:      'Run memory_health() to assess damage',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:286:      'Run memory_health() to check database status',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:291:    toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:316:      'Use memory_health() to see current system limits'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:336:      'Check memory_health() for system status',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:340:    toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:345:      'Check embedding provider status with memory_health()',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:350:    toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:447:      'Run memory_health() to check system status'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:450:    toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:487:      'Check memory_health() for recovery options'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:490:    toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:529:      'Run memory_health() to check database status'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:532:    toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:659:      'Check memory_health() for system status',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:663:    toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:677:    'Run memory_health() for diagnostics',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:682:  toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:694:  memory_search: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:699:        'Check embedding provider status: memory_health()',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:734:        'Run memory_health() to verify database integrity'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:737:      toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:757:        'Check memory_health() for embedding provider status'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:760:      toolTip: 'memory_health()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:386:          tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:          tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:77:    tools: ['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:100:      'task_preflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:101:      'task_postflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:22:// Feature catalog: Validation feedback (memory_validate)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:132:const budget = getTokenBudget('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:139:const enhanced = enhanceDescription('memory_search', 'Search memories');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:85:      "query": "memory_context returns wrong results when token pressure is high",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:251:      "notes": "From T007b Pattern 3: feature description passed to memory_context before implementation."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:415:      "query": "the memory_search tool returns stale results after index rebuild",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:640:      "expectedResultDescription": "Should surface the generate-context.js script documentation and CLAUDE.md Memory Save Rule about using the script instead of the Write tool.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:641:      "notes": "Derived from \"generate-context\" trigger phrase in the memory save workflow documentation."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1100:      "expectedResultDescription": "Should surface the Learning Index formula (LI = KnowledgeDelta×0.4 + UncertaintyReduction×0.35 + ContextImprovement×0.25) from CLAUDE.md or memory_task_preflight tool documentation.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:29:// Feature catalog: Validation feedback (memory_validate)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:31:    surface: 'memory_health';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:88:      surface: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:100:      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:21:// Feature catalog: Validation feedback (memory_validate)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648:/** Handle memory_validate tool - records user validation feedback to adjust confidence */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:726:  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.

codex
CocoIndex cancelled again on this Go subtree, so I’m switching to the fallback path the brief allowed: targeted `rg` plus direct source reads. I’m pulling the exact Engram function bodies now, along with the matching Public session/retrieval/health handlers, so the integration-feasibility calls stay code-backed.
exec
/bin/zsh -lc "sed -n '740,860p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '948,1085p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '3380,3545p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1462,1708p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
		title := learning
		if len(title) > 60 {
			title = title[:60] + "..."
		}

		_, err = s.AddObservation(AddObservationParams{
			SessionID: p.SessionID,
			Type:      "passive",
			Title:     title,
			Content:   learning,
			Project:   p.Project,
			Scope:     "project",
			ToolName:  p.Source,
		})
		if err != nil {
			return result, fmt.Errorf("passive capture save: %w", err)
		}
		result.Saved++
	}

	return result, nil
}

// ClassifyTool returns the observation type for a given tool name.
func ClassifyTool(toolName string) string {
	switch toolName {
	case "write", "edit", "patch":
		return "file_change"
	case "bash":
		return "command"

 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '515,620p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "sed -n '700,1135p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1130,1315p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  // Classify query intent and optionally augment response with code
  // graph context for structural/hybrid queries. Entire block is
  // wrapped in try/catch — any failure silently falls through to
  // existing semantic logic.
  let queryIntentMetadata: {
    queryIntent: string;
    routedBackend: string;
    confidence: number;
    matchedKeywords?: string[];
  } | null = null;
  let graphContextResult: Record<string, unknown> | null = null;

  if (requested_mode !== 'resume') {
    try {
      const classification = classifyQueryIntent(normalizedInput);
      queryIntentMetadata = {
        queryIntent: classification.intent,
        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
          ? 'structural'
          : classification.intent === 'hybrid'
            ? 'hybrid'
            : 'semantic',
        confidence: classification.confidence,
        matchedKeywords: classification.matchedKeywords,
      };

      // F050: Extract a symbol-like token from the query instead of passing
      // raw prose to buildContext({ subject }). resolveSubjectToRef() matches
      // against code_nodes.name / fq_name, so prose never resolves.
      // Heuristic: pick the first token that looks like a code identifier
      // (contains uppercase, underscore, or dot — e.g. "buildContext", "fq_name",
      // "code-graph-db.ts"). Falls back to first matched keyword, then normalizedInput.
      const codeIdentifierPattern = /[A-Z_.]|^[a-z]+[A-Z]/;
      const inputTokens = normalizedInput.split(/\s+/).filter(t => t.length >= 2);
      const extractedSubject =
        inputTokens.find(t => codeIdentifierPattern.test(t)) ??
        (classification.matchedKeywords?.[0]) ??
        normalizedInput;

      if (classification.intent === 'structural' && classification.confidence > 0.65) {
        try {
          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
          if (cgResult.metadata.totalNodes > 0) {
            graphContextResult = {
              graphContext: cgResult.graphContext,
              textBrief: cgResult.textBrief,
              combinedSummary: cgResult.combinedSummary,
              nextActions: cgResult.nextActions,
              metadata: cgResult.metadata,
            };
          }
        } catch {
          // Code graph unavailable — fall through to semantic
        }
      } else if (classification.intent === 'hybrid') {
        try {
          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
          if (cgResult.metadata.totalNodes > 0) {
            graphContextResult = {
              graphContext: cgResult.graphContext,
              textBrief: cgResult.textBrief,
              combinedSummary: cgResult.combinedSummary,
              nextActions: cgResult.nextActions,
              metadata: cgResult.metadata,
            };
          }
        } catch {
          // Code graph unavailable — hybrid degrades to semantic-only
        }
      }
      // 'semantic' or low-confidence: no graph context, fall through
    } catch {
      // Classification failed — fall through to existing logic entirely
    }
  }

  // Eval logger — capture context query at entry (fail-safe)
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: normalizedInput,
      intent: explicit_intent ?? null,
      specFolder: spec_folder ?? null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch {
    // Intentional no-op — error deliberately discarded
  }

  const {
    requestedSessionId,
    effectiveSessionId,
    resumed: resumedSession,
    priorMode: previousState,
    counter: eventCounterStart,
    error: sessionScopeError,
  } = resolveSessionLifecycle(args, null);
  if (sessionScopeError) {
    return createMCPErrorResponse({
      tool: 'memory_context',
      error: sessionScopeError,
      code: 'E_SESSION_SCOPE',
      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
      recovery: {
        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
      },
    });
  }
  const sessionLifecycle: SessionLifecycleMetadata = {
    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
    requestedSessionId,
    effectiveSessionId,
    resumed: resumedSession,
    eventCounterStart,
    resumedContextCount: 0,
  };

  // Get layer info for response metadata
  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
  const tokenBudget = layerInfo?.tokenBudget ?? 2000;

  const runtimeContextStats: RuntimeContextStats = {
    tokenBudget,
  };
  try {
    runtimeContextStats.tokenCount = estimateTokens(normalizedInput);
  } catch {
    runtimeContextStats.tokenCount = undefined;
  }

  // Resolve token pressure (caller -> estimator -> unavailable)
  const pressurePolicyEnabled = isPressurePolicyEnabled(effectiveSessionId);
  const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);

  const pressurePolicy = pressurePolicyEnabled
    ? getPressureLevel(tokenUsage, runtimeContextStats)
    : {
        level: 'none' as const,
        ratio: null,
        source: 'unavailable' as const,
        warning: null,
      };
  if (pressurePolicy.warning) {
    console.warn(pressurePolicy.warning);
  }

  // Build options object for strategy executors
  const options: ContextOptions = {
    specFolder: spec_folder,
    tenantId: args.tenantId,
    userId: args.userId,
    agentId: args.agentId,
    sharedSpaceId: args.sharedSpaceId,
    limit,
    sessionId: effectiveSessionId,
    enableDedup: enableDedup,
    includeContent: include_content,
    includeTrace: (args as unknown as Record<string, unknown>).includeTrace === true, // CHK-040
    anchors,
    profile: args.profile,
  };

  const {
    effectiveMode,
    pressureOverrideApplied,
    pressureOverrideTargetMode,
    pressureWarning,
    intentClassification,
  } = resolveEffectiveMode(
    { ...args, input: normalizedInput },
    {
      requestedSessionId,
      effectiveSessionId,
      resumed: resumedSession,
      priorMode: previousState,
      counter: eventCounterStart,
    },
    pressurePolicy,
  );
  const {
    detectedIntent,
    intentConfidence,
    resumeHeuristicApplied,
    source: intentSource,

exec
/bin/zsh -lc "sed -n '180,360p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/* ───────────────────────────────────────────────────────────────
   3. MATCH TRIGGERS HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
  const {
    prompt,
    limit: rawLimit = 3,
    session_id: rawSessionId,
    turnNumber: rawTurnNumber = 1,
    include_cognitive: includeCognitive = true
  } = args;

  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
  if (!prompt || typeof prompt !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_match_triggers',
      error: 'prompt is required and must be a string',
      code: 'E_VALIDATION',
      details: { parameter: 'prompt' },
      recovery: {
        hint: 'Provide a non-empty string for the prompt parameter'
      }
    });
  }

  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
  // manager to prevent IDOR. Callers cannot read/write working memory for
  // arbitrary sessions — only server-minted or previously tracked sessions.
  let sessionId: string | undefined = rawSessionId;
  if (rawSessionId) {
    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
      tenantId: args.tenantId,
      userId: args.userId,
      agentId: args.agentId,
    });
    if (trustedSession.error) {
      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
      return createMCPErrorResponse({
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
      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      console.warn('[memory_match_triggers] Decay failed:', message);
    }
  }

  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
  let results: TriggerMatch[] = triggerMatchResult.matches;

  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
    try {
      const database = initialize_db();
      const memoryIds = results.map(r => r.memoryId);
      if (memoryIds.length > 0) {
        const placeholders = memoryIds.map(() => '?').join(',');
        const scopeRows = database.prepare(`
          SELECT id, spec_folder, tenant_id, user_id, agent_id, shared_space_id
          FROM memory_index WHERE id IN (${placeholders})
        `).all(...memoryIds) as Array<{
          id: number;
          spec_folder?: string;
          tenant_id?: string;
          user_id?: string;
          agent_id?: string;
          shared_space_id?: string;
        }>;
        const scopeMap = new Map(scopeRows.map(r => [r.id, r]));
        results = results.filter(match => {
          const row = scopeMap.get(match.memoryId);
          if (!row) return false;
          // H2 FIX: Require exact scope match — rows with NULL scope are excluded
          // when the caller specifies a scope, not silently passed through.
          if (specFolder && row.spec_folder !== specFolder) return false;
          if (tenantId && row.tenant_id !== tenantId) return false;
          if (userId && row.user_id !== userId) return false;
          if (agentId && row.agent_id !== agentId) return false;
          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
          return true;
        });
      }
    } catch (scopeErr: unknown) {
      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
      results = [];
    }
  }
  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
    ? triggerMatchResult.stats.signals
    : [];
  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;

  if (!results || results.length === 0) {
    const noMatchResponse = createMCPEmptyResponse({
      tool: 'memory_match_triggers',
      summary: 'No matching trigger phrases found',
      data: {
        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
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

exec
/bin/zsh -lc "sed -n '210,470p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      variants,
    });
  }

  groups.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
  return groups.slice(0, limit);
}

/* ───────────────────────────────────────────────────────────────
   CORE LOGIC
──────────────────────────────────────────────────────────────── */

/** Handle memory_health tool -- returns system health status and diagnostics. */
async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  // A7-P2-1: Generate requestId for incident correlation in error responses
  const requestId = randomUUID();
  try {
    await checkDatabaseUpdated();
  } catch (dbStateErr: unknown) {
    const message = toErrorMessage(dbStateErr);
    console.error(`[memory-health] Database refresh failed [requestId=${requestId}]: ${message}`);
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'Database refresh failed before diagnostics completed. Retry the request or restart the MCP server.',
      code: 'E021',
      details: { requestId },
      startTime,
    });
  }

  const {
    reportMode = 'full',
    limit: rawLimit = DEFAULT_DIVERGENT_ALIAS_LIMIT,
    specFolder,
    autoRepair = false,
    confirmed = false,
  } = args ?? {};

  if (reportMode !== 'full' && reportMode !== DIVERGENT_ALIAS_REPORT_MODE) {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: `Invalid reportMode: ${String(reportMode)}. Expected "full" or "${DIVERGENT_ALIAS_REPORT_MODE}"`,
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'specFolder must be a string',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (typeof autoRepair !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'autoRepair must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (typeof confirmed !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'confirmed must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (rawLimit !== undefined && (!Number.isFinite(rawLimit) || rawLimit <= 0)) {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'limit must be a positive number',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  const safeLimit = Math.max(1, Math.min(Math.floor(rawLimit || DEFAULT_DIVERGENT_ALIAS_LIMIT), MAX_DIVERGENT_ALIAS_LIMIT));

  const database = vectorIndex.getDb();
  let memoryCount = 0;
  let aliasConflicts: ReturnType<typeof summarizeAliasConflicts> = summarizeAliasConflicts([]);
  let aliasRows: AliasConflictDbRow[] = [];
  let divergentAliasGroups: DivergentAliasGroup[] = [];
  const embeddingRetry = getEmbeddingRetryStats();
  try {
    if (database) {
      const countResult = database.prepare('SELECT COUNT(*) as count FROM memory_index')
        .get() as Record<string, number> | undefined;
      memoryCount = countResult?.count ?? 0;

      const whereParts: string[] = [
        'parent_id IS NULL',
      ];
      const params: unknown[] = [];
      if (specFolder) {
        whereParts.push('spec_folder = ?');
        params.push(specFolder);
      }

      const aliasSql = `
        SELECT file_path, content_hash, spec_folder
        FROM memory_index
        WHERE ${whereParts.join(' AND ')}
      `;

      aliasRows = (database.prepare(aliasSql).all(...params) as AliasConflictDbRow[])
        .filter((row) => typeof row?.file_path === 'string' && isSpecsAliasPath(row.file_path));
      aliasConflicts = summarizeAliasConflicts(aliasRows);
      divergentAliasGroups = getDivergentAliasGroups(aliasRows, safeLimit);
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    if (message.includes('no such table')) {
      console.error(`[memory-health] Schema missing [requestId=${requestId}]:`, message);
      return createMCPErrorResponse({
        tool: 'memory_health',
        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
        code: 'E_SCHEMA_MISSING',
        details: { requestId },
        startTime,
      });
    }
    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);
  }

  if (reportMode === DIVERGENT_ALIAS_REPORT_MODE) {
    const hints: string[] = [];
    if (!database) {
      hints.push('Database not connected - restart MCP server');
    }
    if (autoRepair) {
      hints.push('autoRepair is only applied in reportMode="full"');
    }
    if (aliasConflicts.divergentHashGroups === 0) {
      hints.push('No divergent alias groups detected');
    }
    if (aliasConflicts.divergentHashGroups > divergentAliasGroups.length) {
      hints.push(`More divergent alias groups available: increase limit above ${safeLimit}`);
    }

    return createMCPSuccessResponse({
      tool: 'memory_health',
      summary: `Divergent alias report: ${divergentAliasGroups.length} of ${aliasConflicts.divergentHashGroups} group(s)`,
      data: {
        reportMode,
        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
        databaseConnected: !!database,
        embeddingRetry,
        specFolder: specFolder ?? null,
        limit: safeLimit,
        totalRowsScanned: aliasRows.length,
        totalDivergentGroups: aliasConflicts.divergentHashGroups,
        returnedGroups: divergentAliasGroups.length,
        groups: divergentAliasGroups,
      },
      hints,
      startTime,
    });
  }

  let providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
  let profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';

  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
  const hints: string[] = [];
  const repair = {
    requested: autoRepair,
    attempted: false,
    repaired: false,
    partialSuccess: false,
    actions: [] as string[],
    warnings: [] as string[],
    errors: [] as string[],
  };
  let successfulRepairCount = 0;
  let failedRepairCount = 0;

  const trackRepairOutcome = (succeeded: boolean): void => {
    repair.attempted = true;
    if (succeeded) {
      successfulRepairCount += 1;
      return;
    }
    failedRepairCount += 1;
  };

  if (!profile) {
    try {
      // Resolve the lazy profile so health reflects the active runtime provider
      // Rather than the legacy sync fallback defaults.
      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
      providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
    } catch (profileError: unknown) {
      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
    }
  }

  const providerName = profile?.provider ?? providerMetadata.provider;
  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
  const repairActions = [
    'fts_rebuild',
    'trigger_cache_refresh',
    'orphan_edges_cleanup',
    'orphan_vector_cleanup',
  ];

  if (autoRepair && !confirmed) {
    return createMCPSuccessResponse({
      tool: 'memory_health',
      summary: 'Confirmation required before auto-repair actions are executed',
      data: {
        status,
        reportMode,
        autoRepairRequested: true,
        needsConfirmation: true,
        actions: repairActions,
        embeddingRetry,
      },
      hints: [
        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
      ],
      startTime,
    });
  }

  if (!isEmbeddingModelReady()) {
    hints.push('Embedding model not ready - some operations may fail');
  }
  if (!database) {
    hints.push('Database not connected - restart MCP server');
  }
  if (!vectorIndex.isVectorSearchAvailable()) {
    hints.push('Vector search unavailable - fallback to BM25');
  }
  // FTS5 consistency check
  if (database) {
    try {
      const memoryCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
      const ftsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
      if (memoryCountRow.count !== ftsCountRow.count) {
        hints.push(
          `FTS5 index out of sync: memory_index has ${memoryCountRow.count} rows, memory_fts has ${ftsCountRow.count} rows. ` +
          `Run memory_index_scan with force:true to rebuild FTS5 index.`
        );

        if (autoRepair) {
          try {
            database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
            repair.actions.push('fts_rebuild');

            triggerMatcher.refreshTriggerCache();

exec
/bin/zsh -lc "sed -n '1200,1315p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
             context_summary, pending_work, updated_at,
             tenant_id, user_id, agent_id
      FROM session_state
      WHERE status = 'interrupted'
      ORDER BY updated_at DESC
    `);
    const rows = stmt.all() as Record<string, unknown>[];
    const filteredRows = rows.filter((row) => {
      const storedIdentity = {
        tenantId: normalizeIdentityValue(row.tenant_id),
        userId: normalizeIdentityValue(row.user_id),
        agentId: normalizeIdentityValue(row.agent_id),
      };
      return getIdentityMismatch(storedIdentity, scope) === null;
    });

    return {
      success: true,
      sessions: filteredRows.map((row) => ({
        sessionId: row.session_id as string,
        specFolder: (row.spec_folder as string) || null,
        currentTask: (row.current_task as string) || null,
        lastAction: (row.last_action as string) || null,
        contextSummary: (row.context_summary as string) || null,
        pendingWork: (row.pending_work as string) || null,
        updatedAt: row.updated_at as string,
      })),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] get_interrupted_sessions failed: ${message}`);
    return { success: false, sessions: [], error: message };
  }
}

/* ───────────────────────────────────────────────────────────────
   10. CONTINUE SESSION GENERATION
──────────────────────────────────────────────────────────────── */

function generateContinueSessionMd(sessionState: ContinueSessionInput): string {
  const {
    sessionId,
    specFolder,
    currentTask,
    lastAction,
    contextSummary,
    pendingWork,
    data,
  } = sessionState;

  const timestamp = new Date().toISOString();
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const resumeCommand = specFolder
    ? `/spec_kit:resume ${specFolder}`
    : sessionId
      ? `memory_search({ sessionId: "${sessionId}" })`
      : 'memory_search({ query: "last session" })';

  const content = `# CONTINUE SESSION

> **Generated:** ${dateStr}
> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
> **Pattern Source:** Adopted from seu-claude's CONTINUE_SESSION.md approach.

---

## Session State

| Field | Value |
|-------|-------|
| **Session ID** | \`${sessionId || 'N/A'}\` |
| **Spec Folder** | ${specFolder || 'N/A'} |
| **Current Task** | ${currentTask || 'N/A'} |
| **Last Action** | ${lastAction || 'N/A'} |
| **Status** | Active |
| **Updated** | ${timestamp} |

---

## Context Summary

${contextSummary || '_No context summary available._'}

---

## Pending Work

${pendingWork || '_No pending work recorded._'}

---

## Quick Resume

To continue this session, use:

\`\`\`
${resumeCommand}
\`\`\`

${data ? `
---

## Additional State Data

\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
` : ''}

exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Generate Context
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
exports.readAllStdin = readAllStdin;
exports.parseArguments = parseArguments;
exports.validateArguments = validateArguments;
exports.isValidSpecFolder = isValidSpecFolder;
exports.extractPayloadSpecFolder = extractPayloadSpecFolder;
// ───────────────────────────────────────────────────────────────
// 1. GENERATE CONTEXT
// ───────────────────────────────────────────────────────────────
// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
// Node stdlib
const path = __importStar(require("path"));
const fsSync = __importStar(require("fs"));
// Internal modules
const path_security_1 = require("@spec-kit/shared/utils/path-security");
const core_1 = require("../core");
const workflow_1 = require("../core/workflow");
const loaders_1 = require("../loaders");
const collect_session_data_1 = require("../extractors/collect-session-data");
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
function handleSignalShutdown(signal) {
    if (shuttingDown)
        return; // prevent re-entrant handling
    shuttingDown = true;
    let lockReleaseFailed = false;
    try {
        (0, workflow_1.releaseFilesystemLock)();
    }
    catch (_err) {
        lockReleaseFailed = true;
    }
    console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
    process.exit(lockReleaseFailed ? 1 : 0);
}
function installSignalHandlers() {
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
function isUnderApprovedSpecsRoot(normalizedInput) {
    return (0, path_security_1.validateFilePath)(path.resolve(core_1.CONFIG.PROJECT_ROOT, normalizedInput), (0, core_1.getSpecsDirectories)()) !== null;
}
function isValidSpecFolder(folderPath) {
    const folderName = path.basename(folderPath);
    // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
    const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
    // Extract the trailing portion that might be "parent/child"
    const trailingSegments = normalizedInput.split('/');
    // Check if the last two segments both match the spec folder pattern
    if (trailingSegments.length >= 2) {
        const lastTwo = trailingSegments.slice(-2);
        if (core_1.SPEC_FOLDER_PATTERN.test(lastTwo[0]) && core_1.SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
            // Both segments are valid spec folder names — valid nested spec folder
            const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
            if (!hasSpecsParent) {
                // Fallback: check if the path resolves to an existing directory under any specs root
                for (const specsDir of (0, core_1.getSpecsDirectories)()) {
                    const candidate = path.join(specsDir, normalizedInput);
                    if (!path.isAbsolute(normalizedInput) &&
                        fsSync.existsSync(candidate) &&
                        (0, path_security_1.validateFilePath)(candidate, (0, core_1.getSpecsDirectories)()) !== null) {
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
    if (!core_1.SPEC_FOLDER_PATTERN.test(folderName)) {
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
    if (!hasSpecsParent) {
        // Fallback: check if bare name can be resolved via recursive child search
        // (findChildFolderSync in validateArguments handles this, so just report the error here)
        return {
            valid: false,
            reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
        };
    }
    return { valid: true };
}
function resolveCliSpecFolderReference(rawArg) {
    const folderName = path.basename(rawArg);
    const explicitProjectScopedPath = !rawArg.endsWith('.json') && (rawArg.startsWith('specs/') ||
        rawArg.startsWith('.opencode/specs/'))
        ? path.join(core_1.CONFIG.PROJECT_ROOT, rawArg)
        : null;
    let resolvedNestedPath = null;
    if (!rawArg.endsWith('.json')) {
        if (path.isAbsolute(rawArg)) {
            const absoluteSegments = rawArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
            const lastSegment = absoluteSegments.at(-1);
            const parentSegment = absoluteSegments.at(-2);
            if ((lastSegment && core_1.SPEC_FOLDER_PATTERN.test(lastSegment)) ||
                (parentSegment && lastSegment && core_1.SPEC_FOLDER_PATTERN.test(parentSegment) && core_1.SPEC_FOLDER_PATTERN.test(lastSegment))) {

codex
The Public comparison points are lining up clearly: our session lifecycle is already server-trusted and fail-closed, while Engram’s big wins are more about surface design and lightweight thread semantics than core retrieval quality. I’m filling in the remaining evidence around topic-key suggestion and session bootstrap/resume so the top-5 ranking reflects true integration cost, not just architectural taste.
exec
/bin/zsh -lc 'rg -n "SuggestTopicKey|normalizeTopicKey|architecture/|bug/|decision/|session/|topic key" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:961:	topicKey := normalizeTopicKey(p.TopicKey)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1274:			topicKey = normalizeTopicKey(*p.TopicKey)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1779:			nullableString(normalizeTopicKey(derefString(obs.TopicKey))),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3198:// SuggestTopicKey generates a stable topic key suggestion from type/title/content.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3199:// It infers a topic family (e.g. architecture/*, bug/*) and then appends
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3201:func SuggestTopicKey(typ, title, content string) string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3303:func normalizeTopicKey(topic string) string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:306:		t.Fatalf("expected normalized topic key, got %v", obs.TopicKey)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:327:		TopicKey:  "architecture/auth",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:340:		TopicKey:  "bug/auth-nil-panic",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:347:		t.Fatalf("expected different topic keys to create different observations")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:543:func TestSuggestTopicKeyNormalizesDeterministically(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:544:	got := SuggestTopicKey("Architecture", "  Auth Model  ", "ignored")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:545:	if got != "architecture/auth-model" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:546:		t.Fatalf("expected architecture/auth-model, got %q", got)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:549:	fallback := SuggestTopicKey("bugfix", "", "Fix nil panic in auth middleware on empty token")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:550:	if fallback != "bug/fix-nil-panic-in-auth-middleware-on-empty" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:551:		t.Fatalf("unexpected fallback topic key: %q", fallback)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:555:func TestSuggestTopicKeyInfersFamilyFromTextWhenTypeIsGeneric(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:556:	bug := SuggestTopicKey("manual", "", "Fix regression in auth login flow")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:557:	if bug != "bug/fix-regression-in-auth-login-flow" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:561:	arch := SuggestTopicKey("", "ADR: Split API gateway boundary", "")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:562:	if arch != "architecture/adr-split-api-gateway-boundary" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:581:		TopicKey:  "architecture/auth-model",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:594:		TopicKey:  "architecture/auth-model",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:607:		TopicKey:  "architecture/auth-model",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1559:		t.Fatalf("expected nil topic key after empty update")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1735:		if got := SuggestTopicKey("decision", "decision", ""); got != "decision/general" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1736:			t.Fatalf("expected decision/general, got %q", got)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1738:		if got := SuggestTopicKey("bugfix", "bug-auth-panic", ""); got != "bug/auth-panic" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1739:			t.Fatalf("expected bug/auth-panic, got %q", got)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1741:		if got := SuggestTopicKey("manual", "!!!", "..."); got != "topic/general" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1750:		longKey := normalizeTopicKey(strings.Repeat("k", 200))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1752:			t.Fatalf("expected topic key truncation to 120, got %d", len(longKey))

exec
/bin/zsh -lc "rg -n \"session_bootstrap|session_resume|minimal|effectiveSessionId|resolveSessionLifecycle|E_SESSION_SCOPE|resume previous work|trusted session\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:167:  effectiveSessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:396:      effectiveSessionId: crypto.randomUUID(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:404:      effectiveSessionId: '',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:406:      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:414:      effectiveSessionId: '',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:416:      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:424:      effectiveSessionId: '',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:426:      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:432:    effectiveSessionId: normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1332:      const minimalState: ContinueSessionInput = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1336:      const content = generateContinueSessionMd(minimalState);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:173:// Save state immediately (minimal)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:43:// T73: Import session manager for trusted session validation (IDOR prevention)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:222:        code: 'E_SESSION_SCOPE',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:229:    sessionId = trustedSession.effectiveSessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:47:export type BootstrapCompleteness = 'full' | 'partial' | 'minimal';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:558:    interpretation = 'Execution-focused session - minimal new learning';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:90:  minimal?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:411:  if (args.minimal) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:412:    memoryResult = { skipped: true, reason: 'minimal mode' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:491:  if (args.minimal) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:499:  const memoryCertainty: SharedPayloadCertainty = args.minimal
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:600:  if (!args.minimal) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:96:  effectiveSessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:145:  effectiveSessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:821:function resolveSessionLifecycle(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:836:      effectiveSessionId: '',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:845:  const effectiveSessionId = trustedSession.effectiveSessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:848:    ? workingMemory.getSessionInferredMode(effectiveSessionId)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:851:    ? workingMemory.getSessionEventCounter(effectiveSessionId)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:856:    effectiveSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1223:    effectiveSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1228:  } = resolveSessionLifecycle(args, null);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1233:      code: 'E_SESSION_SCOPE',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1243:    effectiveSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1263:  const pressurePolicyEnabled = isPressurePolicyEnabled(effectiveSessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1264:  const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1304:      effectiveSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1352:  const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1361:      `[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1415:    workingMemory.setSessionInferredMode(effectiveSessionId, effectiveMode);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1530:        session_id: effectiveSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');

exec
/bin/zsh -lc "sed -n '3300,3395p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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


exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1151ms:

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
I also kicked off the exact strict validator from the prompt so I can report whether the phase packet is structurally ready or still has the same environment-specific validator quirk noted in the prior pass. While that runs, I’m reading the topic-key implementation and tests, because that’s one of the most likely candidates to be genuinely adoptable without fighting our existing retrieval stack.
exec
/bin/zsh -lc "sed -n '3190,3308p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
		n = strings.ReplaceAll(n, "__", "_")
	}
	if n == project {
		return n, ""
	}
	return n, fmt.Sprintf("⚠️ Project name normalized: %q → %q", project, n)
}

// SuggestTopicKey generates a stable topic key suggestion from type/title/content.
// It infers a topic family (e.g. architecture/*, bug/*) and then appends
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

exec
/bin/zsh -lc "sed -n '536,570p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
		t.Fatalf("query prompt sync index: %v", err)
	}
	if indexName != "idx_prompts_sync_id" {
		t.Fatalf("expected idx_prompts_sync_id to exist, got %q", indexName)
	}
}

func TestSuggestTopicKeyNormalizesDeterministically(t *testing.T) {
	got := SuggestTopicKey("Architecture", "  Auth Model  ", "ignored")
	if got != "architecture/auth-model" {
		t.Fatalf("expected architecture/auth-model, got %q", got)
	}

	fallback := SuggestTopicKey("bugfix", "", "Fix nil panic in auth middleware on empty token")
	if fallback != "bug/fix-nil-panic-in-auth-middleware-on-empty" {
		t.Fatalf("unexpected fallback topic key: %q", fallback)
	}
}

func TestSuggestTopicKeyInfersFamilyFromTextWhenTypeIsGeneric(t *testing.T) {
	bug := SuggestTopicKey("manual", "", "Fix regression in auth login flow")
	if bug != "bug/fix-regression-in-auth-login-flow" {
		t.Fatalf("expected bug family inference, got %q", bug)
	}

	arch := SuggestTopicKey("", "ADR: Split API gateway boundary", "")
	if arch != "architecture/adr-split-api-gateway-boundary" {
		t.Fatalf("expected architecture family inference, got %q", arch)
	}
}

func TestTopicKeyUpsertIsScopedByProjectAndScope(t *testing.T) {
	s := newTestStore(t)

	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {

exec
/bin/zsh -lc "sed -n '1728,1758p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

		if err := s.migrateLegacyObservationsTable(); err != nil {
			t.Fatalf("legacy migrate should skip tables without id: %v", err)
		}
	})

	t.Run("topic helpers normalize edge cases", func(t *testing.T) {
		if got := SuggestTopicKey("decision", "decision", ""); got != "decision/general" {
			t.Fatalf("expected decision/general, got %q", got)
		}
		if got := SuggestTopicKey("bugfix", "bug-auth-panic", ""); got != "bug/auth-panic" {
			t.Fatalf("expected bug/auth-panic, got %q", got)
		}
		if got := SuggestTopicKey("manual", "!!!", "..."); got != "topic/general" {
			t.Fatalf("expected topic/general fallback, got %q", got)
		}

		longSegment := normalizeTopicSegment(strings.Repeat("abc", 50))
		if len(longSegment) != 100 {
			t.Fatalf("expected topic segment truncation to 100, got %d", len(longSegment))
		}

		longKey := normalizeTopicKey(strings.Repeat("k", 200))
		if len(longKey) != 120 {
			t.Fatalf("expected topic key truncation to 120, got %d", len(longKey))
		}
	})

	t.Run("format context empty returns empty string", func(t *testing.T) {
		s := newTestStore(t)
		ctx, err := s.FormatContext("", "")

exec
/bin/zsh -lc "sed -n '390,535p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

  console.error(
    `[${surface}] Cached summary rejected (${decision.category}): ${decision.reason} — ${decision.detail}`,
  );
}

/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
  // F052: Record memory recovery metric for session_resume
  recordMetricEvent({ kind: 'memory_recovery' });

  // Phase 024: Record bootstrap telemetry
  const startMs = Date.now();
  const hints: string[] = [];

  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
  let memoryResult: Record<string, unknown> = {};
  if (args.minimal) {
    memoryResult = { skipped: true, reason: 'minimal mode' };
  } else {
    try {
      const mcpResponse = await handleMemoryContext({
        input: 'resume previous work continue session',
        mode: 'resume',
        profile: 'resume',
        specFolder: args.specFolder,
      });
      // Extract data from MCP envelope
      if (mcpResponse?.content?.[0]?.text) {
        try {
          const parsed = JSON.parse(mcpResponse.content[0].text);
          memoryResult = parsed?.data ?? parsed ?? {};
        } catch {
          memoryResult = { raw: mcpResponse.content[0].text };
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      memoryResult = { error: message };
      hints.push('Memory resume failed. Try memory_context manually.');
    }
  }

  // ── Sub-call 2: Code graph status ───────────────────────────
  let codeGraph: CodeGraphStatus = {
    status: 'error',
    lastScan: null,
    nodeCount: 0,
    edgeCount: 0,
    fileCount: 0,
  };
  try {
    const stats = graphDb.getStats();
    const freshness = getGraphFreshness(process.cwd());
    codeGraph = {
      status: freshness,
      lastScan: stats.lastScanTimestamp,
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
      fileCount: stats.totalFiles,
    };
    // Graph status hints deferred to structural contract (Phase 027)
    // — structural context hints at lines 128-130 provide preferred recovery path
  } catch {
    codeGraph = { status: 'error', lastScan: null, nodeCount: 0, edgeCount: 0, fileCount: 0 };
    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
  }

  // ── Sub-call 3: CocoIndex availability (F046/F051: shared helper) ──
  const cocoIndex: CocoIndexStatus = {
    available: isCocoIndexAvailable(),
    binaryPath: '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc',
  };
  if (!cocoIndex.available) {
    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
  }

  // Phase 027: Structural bootstrap contract for resume surface
  const structuralContext = buildStructuralBootstrapContract('session_resume');
  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
  }

  const structuralTrust = buildStructuralContextTrust(structuralContext);

  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
  const cachedSummaryDecision = getCachedSessionSummaryDecision({
    specFolder: args.specFolder,
    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
  });
  if (cachedSummaryDecision.status === 'accepted') {
    hints.push('Cached continuity summary accepted as additive resume context.');
  } else {
    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
  }

  let sessionQuality: SessionResumeResult['sessionQuality'];
  if (args.minimal) {
    try {
      sessionQuality = computeQualityScore().level;
    } catch {
      sessionQuality = 'unknown';
    }
  }

  const memoryCertainty: SharedPayloadCertainty = args.minimal
    ? 'defaulted'
    : memoryResult.error
      ? 'unknown'
      : 'estimated';
  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
  const codeGraphCertainty: SharedPayloadCertainty = codeGraph.status === 'error' ? 'unknown' : 'exact';
  const cocoIndexCertainty: SharedPayloadCertainty = 'exact';
  const structuralCertainty: SharedPayloadCertainty = 'exact';

  const payloadSections: SharedPayloadSection[] = [
    {
      key: 'memory-resume',
      title: 'Memory Resume',
      content: summarizeUnknown(memoryResult),
      source: 'memory',
      certainty: memoryCertainty,
    },
  ];
  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
    payloadSections.push({
      key: 'cached-continuity',
      title: 'Cached Continuity',
      content: [
        cachedSummaryDecision.cachedSummary.continuityText,
        `Cache tokens: create=${cachedSummaryDecision.cachedSummary.cacheCreationInputTokens}; read=${cachedSummaryDecision.cachedSummary.cacheReadInputTokens}`,
        `Transcript: ${cachedSummaryDecision.cachedSummary.transcriptFingerprint}`,
      ].join('\n'),
      source: 'session',
      certainty: cachedCertainty,
    });
  }
  payloadSections.push(
    {
      key: 'code-graph-status',
      title: 'Code Graph Status',
      content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,

exec
/bin/zsh -lc "sed -n '160,250p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '384,435p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

function resolveTrustedSession(
  requestedSessionId: string | null = null,
  scope: SessionIdentityScope = {},
): TrustedSessionResolution {
  const normalizedSessionId = typeof requestedSessionId === 'string' && requestedSessionId.trim().length > 0
    ? requestedSessionId.trim()
    : null;

  if (!normalizedSessionId) {
    return {
      requestedSessionId: null,
      effectiveSessionId: crypto.randomUUID(),
      trusted: false,
    };
  }

  if (!isTrackedSession(normalizedSessionId)) {
    return {
      requestedSessionId: normalizedSessionId,
      effectiveSessionId: '',
      trusted: false,
      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
    };
  }

  const storedIdentity = getSessionIdentityRecord(normalizedSessionId);
  if (!hasCorroboratedIdentity(storedIdentity)) {
    return {
      requestedSessionId: normalizedSessionId,
      effectiveSessionId: '',
      trusted: false,
      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
    };
  }

  const mismatch = getIdentityMismatch(storedIdentity, scope);
  if (mismatch) {
    return {
      requestedSessionId: normalizedSessionId,
      effectiveSessionId: '',
      trusted: false,
      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
    };
  }

  return {
    requestedSessionId: normalizedSessionId,
    effectiveSessionId: normalizedSessionId,
    trusted: true,
  };
}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '50,110p;120,170p;515,620p;720,1118p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '754,808p;948,1068p;1462,1565p;1613,1668p;3198,3308p;3382,3542p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '821,860p;1223,1455p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '184,336p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '222,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   222	/** Handle memory_health tool -- returns system health status and diagnostics. */
   223	async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse> {
   224	  const startTime = Date.now();
   225	  // A7-P2-1: Generate requestId for incident correlation in error responses
   226	  const requestId = randomUUID();
   227	  try {
   228	    await checkDatabaseUpdated();
   229	  } catch (dbStateErr: unknown) {
   230	    const message = toErrorMessage(dbStateErr);
   231	    console.error(`[memory-health] Database refresh failed [requestId=${requestId}]: ${message}`);
   232	    return createMCPErrorResponse({
   233	      tool: 'memory_health',
   234	      error: 'Database refresh failed before diagnostics completed. Retry the request or restart the MCP server.',
   235	      code: 'E021',
   236	      details: { requestId },
   237	      startTime,
   238	    });
   239	  }
   240	
   241	  const {
   242	    reportMode = 'full',
   243	    limit: rawLimit = DEFAULT_DIVERGENT_ALIAS_LIMIT,
   244	    specFolder,
   245	    autoRepair = false,
   246	    confirmed = false,
   247	  } = args ?? {};
   248	
   249	  if (reportMode !== 'full' && reportMode !== DIVERGENT_ALIAS_REPORT_MODE) {
   250	    return createMCPErrorResponse({
   251	      tool: 'memory_health',
   252	      error: `Invalid reportMode: ${String(reportMode)}. Expected "full" or "${DIVERGENT_ALIAS_REPORT_MODE}"`,
   253	      code: 'E_INVALID_INPUT',
   254	      details: { requestId },
   255	      startTime,
   256	    });
   257	  }
   258	  if (specFolder !== undefined && typeof specFolder !== 'string') {
   259	    return createMCPErrorResponse({
   260	      tool: 'memory_health',
   261	      error: 'specFolder must be a string',
   262	      code: 'E_INVALID_INPUT',
   263	      details: { requestId },
   264	      startTime,
   265	    });
   266	  }
   267	  if (typeof autoRepair !== 'boolean') {
   268	    return createMCPErrorResponse({
   269	      tool: 'memory_health',
   270	      error: 'autoRepair must be a boolean',
   271	      code: 'E_INVALID_INPUT',
   272	      details: { requestId },
   273	      startTime,
   274	    });
   275	  }
   276	  if (typeof confirmed !== 'boolean') {
   277	    return createMCPErrorResponse({
   278	      tool: 'memory_health',
   279	      error: 'confirmed must be a boolean',
   280	      code: 'E_INVALID_INPUT',
   281	      details: { requestId },
   282	      startTime,
   283	    });
   284	  }
   285	  if (rawLimit !== undefined && (!Number.isFinite(rawLimit) || rawLimit <= 0)) {
   286	    return createMCPErrorResponse({
   287	      tool: 'memory_health',
   288	      error: 'limit must be a positive number',
   289	      code: 'E_INVALID_INPUT',
   290	      details: { requestId },
   291	      startTime,
   292	    });
   293	  }
   294	  const safeLimit = Math.max(1, Math.min(Math.floor(rawLimit || DEFAULT_DIVERGENT_ALIAS_LIMIT), MAX_DIVERGENT_ALIAS_LIMIT));
   295	
   296	  const database = vectorIndex.getDb();
   297	  let memoryCount = 0;
   298	  let aliasConflicts: ReturnType<typeof summarizeAliasConflicts> = summarizeAliasConflicts([]);
   299	  let aliasRows: AliasConflictDbRow[] = [];
   300	  let divergentAliasGroups: DivergentAliasGroup[] = [];
   301	  const embeddingRetry = getEmbeddingRetryStats();
   302	  try {
   303	    if (database) {
   304	      const countResult = database.prepare('SELECT COUNT(*) as count FROM memory_index')
   305	        .get() as Record<string, number> | undefined;
   306	      memoryCount = countResult?.count ?? 0;
   307	
   308	      const whereParts: string[] = [
   309	        'parent_id IS NULL',
   310	      ];
   311	      const params: unknown[] = [];
   312	      if (specFolder) {
   313	        whereParts.push('spec_folder = ?');
   314	        params.push(specFolder);
   315	      }
   316	
   317	      const aliasSql = `
   318	        SELECT file_path, content_hash, spec_folder
   319	        FROM memory_index
   320	        WHERE ${whereParts.join(' AND ')}
   321	      `;
   322	
   323	      aliasRows = (database.prepare(aliasSql).all(...params) as AliasConflictDbRow[])
   324	        .filter((row) => typeof row?.file_path === 'string' && isSpecsAliasPath(row.file_path));
   325	      aliasConflicts = summarizeAliasConflicts(aliasRows);
   326	      divergentAliasGroups = getDivergentAliasGroups(aliasRows, safeLimit);
   327	    }
   328	  } catch (err: unknown) {
   329	    const message = toErrorMessage(err);
   330	    if (message.includes('no such table')) {
   331	      console.error(`[memory-health] Schema missing [requestId=${requestId}]:`, message);
   332	      return createMCPErrorResponse({
   333	        tool: 'memory_health',
   334	        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
   335	        code: 'E_SCHEMA_MISSING',
   336	        details: { requestId },
   337	        startTime,
   338	      });
   339	    }
   340	    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);
   341	  }
   342	
   343	  if (reportMode === DIVERGENT_ALIAS_REPORT_MODE) {
   344	    const hints: string[] = [];
   345	    if (!database) {
   346	      hints.push('Database not connected - restart MCP server');
   347	    }
   348	    if (autoRepair) {
   349	      hints.push('autoRepair is only applied in reportMode="full"');
   350	    }
   351	    if (aliasConflicts.divergentHashGroups === 0) {
   352	      hints.push('No divergent alias groups detected');
   353	    }
   354	    if (aliasConflicts.divergentHashGroups > divergentAliasGroups.length) {
   355	      hints.push(`More divergent alias groups available: increase limit above ${safeLimit}`);
   356	    }
   357	
   358	    return createMCPSuccessResponse({
   359	      tool: 'memory_health',
   360	      summary: `Divergent alias report: ${divergentAliasGroups.length} of ${aliasConflicts.divergentHashGroups} group(s)`,
   361	      data: {
   362	        reportMode,
   363	        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
   364	        databaseConnected: !!database,
   365	        embeddingRetry,
   366	        specFolder: specFolder ?? null,
   367	        limit: safeLimit,
   368	        totalRowsScanned: aliasRows.length,
   369	        totalDivergentGroups: aliasConflicts.divergentHashGroups,
   370	        returnedGroups: divergentAliasGroups.length,
   371	        groups: divergentAliasGroups,
   372	      },
   373	      hints,
   374	      startTime,
   375	    });
   376	  }
   377	
   378	  let providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
   379	  let profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
   380	  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';
   381	
   382	  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
   383	  const hints: string[] = [];
   384	  const repair = {
   385	    requested: autoRepair,
   386	    attempted: false,
   387	    repaired: false,
   388	    partialSuccess: false,
   389	    actions: [] as string[],
   390	    warnings: [] as string[],
   391	    errors: [] as string[],
   392	  };
   393	  let successfulRepairCount = 0;
   394	  let failedRepairCount = 0;
   395	
   396	  const trackRepairOutcome = (succeeded: boolean): void => {
   397	    repair.attempted = true;
   398	    if (succeeded) {
   399	      successfulRepairCount += 1;
   400	      return;
   401	    }
   402	    failedRepairCount += 1;
   403	  };
   404	
   405	  if (!profile) {
   406	    try {
   407	      // Resolve the lazy profile so health reflects the active runtime provider
   408	      // Rather than the legacy sync fallback defaults.
   409	      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
   410	      providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
   411	    } catch (profileError: unknown) {
   412	      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
   413	    }
   414	  }
   415	
   416	  const providerName = profile?.provider ?? providerMetadata.provider;
   417	  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
   418	  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
   419	  const repairActions = [
   420	    'fts_rebuild',
   421	    'trigger_cache_refresh',
   422	    'orphan_edges_cleanup',
   423	    'orphan_vector_cleanup',
   424	  ];
   425	
   426	  if (autoRepair && !confirmed) {
   427	    return createMCPSuccessResponse({
   428	      tool: 'memory_health',
   429	      summary: 'Confirmation required before auto-repair actions are executed',
   430	      data: {
   431	        status,
   432	        reportMode,
   433	        autoRepairRequested: true,
   434	        needsConfirmation: true,
   435	        actions: repairActions,
   436	        embeddingRetry,
   437	      },
   438	      hints: [
   439	        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
   440	      ],
   441	      startTime,
   442	    });
   443	  }
   444	
   445	  if (!isEmbeddingModelReady()) {
   446	    hints.push('Embedding model not ready - some operations may fail');
   447	  }
   448	  if (!database) {
   449	    hints.push('Database not connected - restart MCP server');
   450	  }
   451	  if (!vectorIndex.isVectorSearchAvailable()) {
   452	    hints.push('Vector search unavailable - fallback to BM25');
   453	  }
   454	  // FTS5 consistency check
   455	  if (database) {
   456	    try {
   457	      const memoryCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
   458	      const ftsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
   459	      if (memoryCountRow.count !== ftsCountRow.count) {
   460	        hints.push(
   461	          `FTS5 index out of sync: memory_index has ${memoryCountRow.count} rows, memory_fts has ${ftsCountRow.count} rows. ` +
   462	          `Run memory_index_scan with force:true to rebuild FTS5 index.`
   463	        );
   464	
   465	        if (autoRepair) {
   466	          try {
   467	            database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
   468	            repair.actions.push('fts_rebuild');
   469	
   470	            triggerMatcher.refreshTriggerCache();

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '400,535p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '163,250p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '384,435p;1252,1270p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1252	    weekday: 'long',
  1253	    year: 'numeric',
  1254	    month: 'long',
  1255	    day: 'numeric',
  1256	    hour: '2-digit',
  1257	    minute: '2-digit',
  1258	  });
  1259	
  1260	  const resumeCommand = specFolder
  1261	    ? `/spec_kit:resume ${specFolder}`
  1262	    : sessionId
  1263	      ? `memory_search({ sessionId: "${sessionId}" })`
  1264	      : 'memory_search({ query: "last session" })';
  1265	
  1266	  const content = `# CONTINUE SESSION
  1267	
  1268	> **Generated:** ${dateStr}
  1269	> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
  1270	> **Pattern Source:** Adopted from seu-claude's CONTINUE_SESSION.md approach.

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '145,166p;540,550p;780,788p;832,847p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   540	### keywords
   541	
   542	- follow_on_tool_use, resolveSessionTrackingId, logFollowOnToolUse, memory_stats schema, session_bootstrap, feedback_events sqlite3
   543	
   544	## Reusable knowledge
   545	
   546	- `follow_on_tool_use` depends on a session id that matches the in-memory search session cache; if a non-search tool call lacks/does not inherit that session id, the follow-on event will not emit [Task 2]
   547	- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
   548	- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
   549	- build/test/doc passes can still be misleading if live workers are stale; restart/runtime pickup must be treated as a separate verification gate [Task 1]
   550	
   780	- when updating changelog claims, keep wording pinned to implemented behavior evidence (bounded inline `selective_reindex` vs explicit operator `code_graph_scan`) [Task 8]
   781	
   782	## Reusable knowledge
   783	
   784	- canonical validation gates for packet readiness here were `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --recursive --strict` plus `TMPDIR=... npm run check:full` and `npm run build` evidence capture [Task 1][Task 2]
   785	- for strict validator compliance, checklist lines need explicit `[EVIDENCE: ...]` and level-template headers/section numbers must remain exact (`## 1. METADATA`, `## 2. PROBLEM & PURPOSE`, etc.) [Task 3]
   786	- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
   787	- hook path truth is `mcp_server/hooks/claude/*.ts` and compiled `mcp_server/dist/hooks/claude/*.js`; avoid stale `scripts/hooks/claude/` references [Task 4]
   788	- changelog truth-sync for 023 needed root + per-phase consistency: add missing phase 013 entry and avoid overstating rerun verification for 010/011/012 while strict validation remains green [Task 5]
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

exec
/bin/zsh -lc "rg -n \"passive|learning(s)?|session_summary|trigger phrases|topic_key|thread key|revision_count|duplicate_count\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:130:import { runBatchLearning } from './lib/feedback/batch-learning.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1024:        const { runPassiveEnrichment } = await import('./lib/enrichment/passive-enrichment.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1775:    // REQ-D4-004: Batch feedback learning — runs one cycle at startup (shadow-only, no live ranking mutations).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1780:        console.error(`[context-server] Batch learning: ${batchResult.shadowApplied} shadow-applied, ${batchResult.skippedMinSupport} skipped (min-support), window=${Math.round((batchResult.runAt - batchResult.windowStart) / 86_400_000)}d`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1782:        console.error('[context-server] Batch learning: no eligible candidates in window (or flag disabled)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1786:      console.warn('[context-server] Batch learning failed (non-fatal):', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:71:9. [Feedback and Learning](#9-feedback-and-learning)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:238:<!-- ANCHOR:feedback-learning -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:248:| `SPECKIT_BATCH_LEARNED_FEEDBACK` | `true` | boolean | Weekly batch feedback learning pipeline (REQ-D4-004). Graduated ON. | `lib/search/search-flags.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:249:| `SPECKIT_RELATIONS` | `true` | boolean | Relational learning from correction events. Graduated ON. | `lib/learning/corrections.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:256:<!-- /ANCHOR:feedback-learning -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:337:      summary: 'No matching trigger phrases found',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:349:        'Ensure memories have trigger phrases defined',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:496:    : `Matched ${formattedResults.length} memories via trigger phrases`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:92:  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:151:      // T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:5:Complete installation and configuration guide for the Spec Kit Memory MCP server. This guide enables AI-powered context retrieval and conversation memory across your project. The system indexes markdown documentation from spec folders and constitutional rules to surface relevant information during AI interactions. It provides 43 tools covering semantic search, trigger-based memory surfacing, intent-aware context loading, causal relationship tracking, shared memory spaces, session learning, evaluation, validation, and bounded structural code-graph indexing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:102:  const recentContext: Array<{ request?: string; learning?: string }> = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:162:        learning: stripMarkdownDecorators(section.body),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:809:| `triggerPhrases` | string[] | Updated trigger phrases |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1107:##### `memory_get_learning_history`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1109:View learning records (preflight/postflight pairs) for a spec folder. Shows how the Learning Index changed over time.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1263:| L6 | Analysis | 10 | 1,200 | Trace decisions, measure learning, run evaluations |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:37:- `session-learning.ts` - Task preflight, postflight, and learning history handlers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:422:  memory_get_learning_history: memoryGetLearningHistorySchema as unknown as ToolInputSchema,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:487:  memory_get_learning_history: ['specFolder', 'sessionId', 'limit', 'onlyComplete', 'includeSummary'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:15:// Feature catalog: Post-task learning measurement (task_postflight)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:16:// Feature catalog: Learning history (memory_get_learning_history)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:83:  learningIndex: number | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:106:  learningHistory: LearningHistoryRow[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:130:  CREATE TABLE IF NOT EXISTS session_learning (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:149:    learning_index REAL,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:161:  CREATE INDEX IF NOT EXISTS idx_session_learning_spec_folder
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:162:  ON session_learning(spec_folder)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:166:  CREATE INDEX IF NOT EXISTS idx_session_learning_task_lookup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:167:  ON session_learning(spec_folder, task_id, session_id, phase, updated_at, id)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:186:  'learning_index',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:210:    WHERE type = 'table' AND name = 'session_learning'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:217:  const tempTableName = 'session_learning_legacy_migration';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:221:    database.exec(`ALTER TABLE session_learning RENAME TO ${tempTableName}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:224:      INSERT INTO session_learning (${SESSION_LEARNING_COLUMNS})
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:240:      'Failed to migrate session_learning schema',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:246:/** Initialize the session_learning table schema if not already created */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:258:    console.error('[session-learning] Schema initialized');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:261:    console.error('[session-learning] Schema initialization failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:264:      'Failed to initialize session_learning schema',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:340:     FROM session_learning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:351:      UPDATE session_learning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:367:      console.error(`[session-learning] Preflight updated (existing): spec=${spec_folder}, task=${taskId}, id=${existing.id}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:398:    INSERT INTO session_learning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:417:    console.error(`[session-learning] Preflight recorded: spec=${spec_folder}, task=${taskId}, id=${recordId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:448:    console.error('[session-learning] Failed to insert preflight record:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:457:/** Handle task_postflight tool - measures learning by comparing post-task scores to baseline */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:495:    FROM session_learning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:526:      `Multiple completed learning cycles found for spec_folder="${spec_folder}" and task_id="${taskId}". Provide sessionId to update the intended record.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:547:  const learningIndex = (deltaKnowledge * 0.4) + (deltaUncertainty * 0.35) + (deltaContext * 0.25);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:548:  const learningIndexRounded = Math.round(learningIndex * 100) / 100;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:551:  if (learningIndexRounded >= 40) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:552:    interpretation = 'Significant learning session - substantial knowledge gains';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:553:  } else if (learningIndexRounded >= 15) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:554:    interpretation = 'Moderate learning session - meaningful progress';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:555:  } else if (learningIndexRounded >= 5) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:556:    interpretation = 'Incremental learning - some progress made';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:557:  } else if (learningIndexRounded >= 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:558:    interpretation = 'Execution-focused session - minimal new learning';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:568:      UPDATE session_learning SET
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:576:        learning_index = ?,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:589:      learningIndexRounded,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:597:    console.error(`[session-learning] Postflight recorded: spec=${spec_folder}, task=${taskId}, LI=${learningIndexRounded}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:608:      summary: `Learning measured: LI=${learningIndexRounded} (${interpretation.split(' - ')[0]})`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:631:          learningIndex: learningIndexRounded,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:650:    console.error('[session-learning] Failed to update postflight record:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:659:/** Handle memory_get_learning_history tool - retrieves learning records with optional summary stats */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:688:      SELECT * FROM session_learning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:707:    const learningHistory: LearningHistoryRow[] = rows.map((row: Record<string, unknown>) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:746:          learningIndex: (row.learning_index as number | null) ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:766:          AVG(CASE WHEN phase = 'complete' THEN learning_index END) as avg_learning_index,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:767:          MAX(CASE WHEN phase = 'complete' THEN learning_index END) as max_learning_index,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:768:          MIN(CASE WHEN phase = 'complete' THEN learning_index END) as min_learning_index,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:772:        FROM session_learning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:791:        averageLearningIndex: stats.avg_learning_index !== null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:792:          ? Math.round((stats.avg_learning_index as number) * 100) / 100
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:794:        maxLearningIndex: stats.max_learning_index !== null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:795:          ? Math.round((stats.max_learning_index as number) * 100) / 100
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:797:        minLearningIndex: stats.min_learning_index !== null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:798:          ? Math.round((stats.min_learning_index as number) * 100) / 100
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:811:      if (stats.avg_learning_index !== null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:812:        const avgLI = stats.avg_learning_index as number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:814:          summary.interpretation = 'Strong learning trend - significant knowledge gains across tasks';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:816:          summary.interpretation = 'Positive learning trend - moderate knowledge improvement';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:818:          summary.interpretation = 'Slight learning trend - minor improvements detected';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:829:    const completedCount = learningHistory.filter(h => h.phase === 'complete').length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:831:      ? `Learning history: ${learningHistory.length} records (${completedCount} complete)`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:832:      : `Learning history: ${learningHistory.length} preflight records`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:835:    if (completedCount === 0 && learningHistory.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:836:      hints.push('Call task_postflight to complete learning measurement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:843:      tool: 'memory_get_learning_history',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:847:        count: learningHistory.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:848:        learningHistory: learningHistory,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:855:    console.error('[session-learning] Failed to get learning history:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:856:    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Failed to retrieve learning history', { originalError: message });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:874:const handle_get_learning_history = handleGetLearningHistory;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:880:  handle_get_learning_history,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:279:/** Arguments for learning history requests. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:89: * Evaluates whether the memory metadata declares enough trigger phrases for
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:108:    issues.push('No trigger phrases found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:427: * - Re-extract trigger phrases from content headings/title
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:442:  // Fix #1 : Re-extract trigger phrases if missing/insufficient
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:452:      fixed.push(`Re-extracted ${extracted.length} trigger phrases from content`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:482: * Extract trigger phrases from content by scanning headings and the title.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/README.md:30:- `checkpoint-tools.ts` - dispatch for checkpoints and learning-history style lifecycle helpers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:5:// Postflight, learning_history (T303).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:50:  'memory_get_learning_history',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:71:    case 'memory_get_learning_history': return handleGetLearningHistory(parseArgs<LearningHistoryArgs>(validateToolArgs('memory_get_learning_history', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:766: *   - session_learning records (permanent, never cleaned)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:9:import * as learningHandlerModule from '../handlers/session-learning';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:57:      expect(learningHandlerModule).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:124:      if (learningHandlerModule?.handleTaskPreflight) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:126:          name: 'learning-preflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:127:          run: () => learningHandlerModule.handleTaskPreflight({} as Parameters<typeof learningHandlerModule.handleTaskPreflight>[0]),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:395:        qualityFlags: ['No trigger phrases found'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:452:    it('T054-6f: Same-path unchanged does not short-circuit when trigger phrases changed', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:453:      const content = 'Existing same-path row with stale trigger phrases.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:483:      const content = 'Existing same-path row with stale trigger phrases.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:74:type SessionLearningModule = typeof import('./session-learning.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:166:    sessionLearningModule = loadHandlerModule<SessionLearningModule>('session-learning');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:294:// Session learning handlers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:300:export const handle_get_learning_history = lazyFunction(getSessionLearningModule, 'handle_get_learning_history');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:5:import * as handler from '../handlers/session-learning';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:13:    learningHistory: Array<{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:28:describe('Session learning history normalization', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:43:  it('normalizes sessionId before filtering learning history queries', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:69:    expect(envelope.data.learningHistory).toHaveLength(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:70:    expect(envelope.data.learningHistory[0]).toMatchObject({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:35:  'get learning history',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:221:      // "get learning history" has 3 terms and is a trigger phrase
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:222:      const result = classifyQueryComplexity('get learning history', TRIGGER_PHRASES);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:501:      // "get learning history" is a trigger phrase with exactly 3 terms
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:502:      const result = classifyQueryComplexity('get learning history', TRIGGER_PHRASES);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:489: * @param triggerPhrases - Array of trigger phrases
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:638:      reasons.push('No trigger phrases: add at least 1-2 trigger phrases');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:4:import * as handler from '../handlers/session-learning';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:7:import type { LearningHistoryPayload, LearningHistoryRow } from '../handlers/session-learning';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:18:  return 'learningHistory' in value;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:190:      expect(data?.learningHistory).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:192:      const allMatch = data.learningHistory.every(row => row.sessionId === sessA);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:194:      expect(data.learningHistory.length).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:227:      expect(data.learningHistory).toHaveLength(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:228:      expect(data.learningHistory[0].sessionId).toBe(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:273:      const allComplete = data.learningHistory.every(row => row.phase === 'complete');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:336:      expect(data.learningHistory.length).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:337:      expect(data.learningHistory[0].phase).toBe('complete');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:398:      expect(data.learningHistory.length).toBeLessThanOrEqual(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:412:      expect(data.learningHistory).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:413:      expect(Array.isArray(data.learningHistory)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:429:        FROM session_learning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:435:      const actualOrder = data.learningHistory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:443:      const actualTimestamps = data.learningHistory.map((row) => (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:465:      expect(data.learningHistory).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:467:      expect(data.learningHistory.length).toBeLessThanOrEqual(10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:6:import * as handler from '../handlers/session-learning';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:48:        'handle_get_learning_history',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:146:      // Set up an in-memory DB with a completed learning record
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:149:        CREATE TABLE IF NOT EXISTS session_learning (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:165:          learning_index REAL,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:175:        "INSERT INTO session_learning (spec_folder, task_id, phase, pre_knowledge_score, pre_uncertainty_score, pre_context_score) VALUES (?, ?, 'complete', 50, 30, 40)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:195:          FROM session_learning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:263:    // The LI formula (session-learning.ts:356):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:286:    it('T012-LI2: Maximum LI for perfect learning (0->100 on all)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:326:    it('T012-LI9: Realistic scenario — moderate learning improvement', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:333:    it('T012-LI10: Knowledge-dominant learning (weight 0.4 has highest impact)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:29:  { tool: 'memory_get_learning_history', handler: 'handleGetLearningHistory', layer: 'L7' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:48:  { camel: 'handleGetLearningHistory', snake: 'handle_get_learning_history' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1123:        fixes: ['Re-extracted 4 trigger phrases from content'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1362:        fixes: ['Re-extracted 4 trigger phrases from content'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1410:        fixes: ['Re-extracted 4 trigger phrases from content'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:219:  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:294:  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:472:  description: '[L6:Analysis] Capture epistemic baseline before task execution. Call at the start of implementation work to record knowledge, uncertainty, and context scores for learning measurement. Token Budget: 1200.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:478:  description: '[L6:Analysis] Capture epistemic state after task execution and calculate learning delta. Call after completing implementation work. Calculates Learning Index: LI = (KnowledgeDelta x 0.4) + (UncertaintyReduction x 0.35) + (ContextImprovement x 0.25). Token Budget: 1200.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:479:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (must match preflight)' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (must match preflight)' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task knowledge level (0-100)' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task uncertainty level (0-100)' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task context completeness (0-100)' }, gapsClosed: { type: 'array', items: { type: 'string' }, description: 'List of knowledge gaps closed during task (optional)' }, newGapsDiscovered: { type: 'array', items: { type: 'string' }, description: 'List of new gaps discovered during task (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier. Required when multiple sessions share the same taskId and you need to target a specific learning cycle.' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:568:  name: 'memory_get_learning_history',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:569:  description: '[L7:Maintenance] Get learning history (PREFLIGHT/POSTFLIGHT records) for a spec folder. Shows knowledge improvement deltas and Learning Index trends. Use to analyze learning patterns across tasks within a spec. Token Budget: 1000.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:570:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:157:// In-memory cache of trigger phrases for fast matching
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:208:  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:337:/** Load all trigger phrases from the index into memory */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:380:        console.warn(`[trigger-matcher] Failed to parse trigger phrases for memory ${row.id}: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:621:/** Match user prompt against trigger phrases using exact string matching */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:694:/** Match trigger phrases with additional stats */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:725:/** Get all unique trigger phrases in the cache */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:181:- Purpose: Owns implicit-feedback capture, shadow-feedback evaluation, ranking-comparison metrics, and batch-learning helpers used to measure learned-signal quality without mutating live rankings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:185:  - `batch-learning.ts` — weekly aggregation and shadow-apply cycle for learned feedback.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:225:### `learning/`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:230:  - `index.ts` — explicit barrel export for the learning surface.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:231:  - `README.md` — learning/corrections overview and examples.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:453:| `learning` | `05--lifecycle`, `11--scoring-and-calibration` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:476:| `05--lifecycle` | `cognitive`, `learning`, `session`, `storage` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:482:| `11--scoring-and-calibration` | `cognitive`, `config`, `feedback`, `learning`, `manage`, `scoring`, `search`, `telemetry` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:588:- `learning`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:619:- `learning`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:5:import * as handler from '../handlers/session-learning';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:8:describe('Session-learning regressions', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:52:      FROM session_learning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:58:      FROM session_learning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:105:  it('T082 preserves multiple completed learning cycles for the same task', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:142:      FROM session_learning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:37:| `memory-parser.ts` | Parses titles, trigger phrases, tiers, document type, causal links, anchors, and content hashes from markdown files |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:541:/** Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:188:      'memory_get_learning_history',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:296:      'task_preflight', 'task_postflight', 'memory_get_learning_history',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:409:      '../lib/feedback/batch-learning',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:738:      vi.doMock('../lib/feedback/batch-learning', () => ({ runBatchLearning: vi.fn(async () => ({ processed: 0 })) }))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2107:      'memory_get_learning_history': '[L7:Maintenance]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-learning-history.vitest.ts:3:import * as learningHandler from '../handlers/session-learning';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-learning-history.vitest.ts:5:type PreflightArgs = Parameters<typeof learningHandler.handleTaskPreflight>[0];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-learning-history.vitest.ts:6:type PostflightArgs = Parameters<typeof learningHandler.handleTaskPostflight>[0];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-learning-history.vitest.ts:7:type LearningHistoryArgs = Parameters<typeof learningHandler.handleGetLearningHistory>[0];

exec
/bin/zsh -lc "rg -n \"duplicate_count|revision_count|topic_key|thread\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/memory | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
rg: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/memory: No such file or directory (os error 2)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:56:      process.env.CODEX_THREAD_ID = 'thread-123';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:100:  it('threads the nudge into metadata for ready structural queries without changing the routed backend', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:124:        'thread synchronization', 'mutex locking', 'semaphore counting',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:984:Trace the causal chain for a memory. Answers "why was this decision made?" by following links between memories. Think of it like pulling on a thread: you start with one decision and follow the connections back to the events that caused it.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts:92:      process.env.CODEX_THREAD_ID = 'fixture-codex-thread';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-cache.ts:15://   - Thread-safety is not required (Node.js single-threaded event loop)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tests/fixtures/runtime-fixtures.js:77:            process.env.CODEX_THREAD_ID = 'fixture-codex-thread';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/llm-cache.js:15://   - Thread-safety is not required (Node.js single-threaded event loop)

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md | sed -n '1,20p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Spec Kit Memory MCP Server: Installation Guide
     2	
     3	> MCP Server v1.7.2 | 2026-03-15
     4	
     5	Complete installation and configuration guide for the Spec Kit Memory MCP server. This guide enables AI-powered context retrieval and conversation memory across your project. The system indexes markdown documentation from spec folders and constitutional rules to surface relevant information during AI interactions. It provides 43 tools covering semantic search, trigger-based memory surfacing, intent-aware context loading, causal relationship tracking, shared memory spaces, session learning, evaluation, validation, and bounded structural code-graph indexing.
     6	
     7	> **Part of OpenCode Installation.** See the [Master Installation Guide](../README.md) for complete setup.
     8	
     9	---
    10	
    11	## 1. AI-FIRST INSTALL GUIDE
    12	
    13	Copy and paste this prompt to your AI assistant to get installation help:
    14	
    15	```
    16	I want to install Spec Kit Memory MCP server from .opencode/skill/system-spec-kit/mcp_server
    17	
    18	Please help me:
    19	1. Verify I have Node.js >=18 and npm installed
    20	2. Install dependencies and build the MCP server

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1018,1038p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts | sed -n '96,172p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I have enough code-level evidence to synthesize the ranking now. I’m doing one last pass through the memory registry so the final write-up can accurately note the prior Public recovery conventions I reused here, especially around `session_bootstrap` and `generate-context`, and then I’ll package the findings in the exact iteration format you asked for.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '532,540p;772,780p;826,834p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   532	- query-flow-tracker, memory-search-ux-hooks.vitest.ts, feedback-ledger.vitest.ts, includeContent, search_shown, stale dist restart
   533	
   534	## Task 2: Verify live runtime event emission and root-cause missing `follow_on_tool_use`, outcome success
   535	
   536	### rollout_summary_files
   537	
   538	- rollout_summaries/2026-04-03T13-51-22-gNkZ-feedback_signal_runtime_check.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T15-51-22-019d539c-dc76-7bc1-b0f6-c2297641ecb9.jsonl, updated_at=2026-04-03T14:27:14+00:00, thread_id=019d539c-dc76-7bc1-b0f6-c2297641ecb9)
   539	
   540	### keywords
   772	
   773	## User preferences
   774	
   775	- when the user said “Re-use /.../024-compact-code-graph/006-documentation-alignment,” continue under the specified existing spec folder instead of opening a new packet [Task 4]
   776	- when the user asked for deep review “make sure everything works as expected ... check the feature catalog and manual testing playbook, and all commands, agents and readmes,” treat it as full-spectrum audit + runtime/doc parity, not a narrow fix pass [Task 1][Task 2]
   777	- when user asked to “use max sub agents” for packet changelog synthesis, parallelize phase evidence gathering but keep output scoped to the requested packet `scratch/` folder [Task 6]
   778	- when user asked for README work, they specified “proper dedicated section ... reference 024-compact-code-graph ... re-use 006-documentation-alignment” -> preserve that wording/terminology and include those exact packet references [Task 7]
   779	- when refining README wording, the user asked for “current reality” language, plain English, and no “no longer” phrasing or internal spec-folder references in runtime-state descriptions [Task 8]
   780	- when updating changelog claims, keep wording pinned to implemented behavior evidence (bounded inline `selective_reindex` vs explicit operator `code_graph_scan`) [Task 8]
   826	### rollout_summary_files
   827	
   828	- rollout_summaries/2026-04-04T11-42-27-WVjh-codex_graph_readiness_verification.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/04/rollout-2026-04-04T13-42-27-019d584d-3145-70e0-8b9b-13740fcf41cf.jsonl, updated_at=2026-04-04T11:45:20+00:00, thread_id=019d584d-3145-70e0-8b9b-13740fcf41cf)
   829	
   830	### keywords
   831	
   832	- read-only verification, session_bootstrap, session_resume minimal, code_graph_query, startup snapshot note, ensureCodeGraphReady, SELECTIVE_REINDEX_THRESHOLD=50
   833	
   834	## User preferences

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
# Iteration 017: INTEGRATION FEASIBILITY

## Focus
INTEGRATION FEASIBILITY: For top 5 adoption candidates, how hard would they be to integrate into Spec Kit Memory?

## Findings

### Finding 1: Engram’s profile-gated MCP surface is a good fit, but only as a wrapper/schema layer
- **Source**: [external/internal/mcp/mcp.go:53](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:53), [external/internal/mcp/mcp.go:69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:69), [external/internal/mcp/mcp.go:124](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:124), [external/internal/mcp/mcp.go:515](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:515), [INSTALL_GUIDE.md:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:5)
- **What it does**: Engram hard-codes `ProfileAgent` and `ProfileAdmin`, resolves allowlists via `ResolveTools()`, and combines that with eager core tools plus `WithDeferLoading(true)` for secondary tools. The split is operational, not storage-level.
- **Why it matters for us**: Public exposes 43 tools today, so a profile layer could reduce prompt noise fast. Integration difficulty is medium: mostly MCP registration, schema/docs, and wrapper guidance, with no DB migration.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Topic-key threading is the cleanest hygiene feature to borrow, but as metadata-first rather than live-row upsert
- **Source**: [external/internal/store/store.go:948](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:948), [external/internal/store/store.go:1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1462), [external/internal/store/store.go:3198](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3198), [external/internal/store/store_test.go:543](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:543), [external/internal/store/store_test.go:1733](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1733), [markdown-evidence-builder.ts:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:102)
- **What it does**: `SuggestTopicKey()` infers families like `architecture/` and `bug/`, `AddObservation()` upserts by `topic_key` within project+scope while incrementing `revision_count`, and `Search()` gives exact `topic_key` hits priority before FTS.
- **Why it matters for us**: Public has strong retrieval, but its save path is still file/section-oriented rather than thread-oriented. Integration difficulty is medium if we start with optional `thread_key` metadata in generated memory artifacts plus indexed lookup; full Engram-style mutable upserts would be much harder and should stay out of the first cut.
- **Recommendation**: adopt now
- **Impact**: high

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


hook: Stop
hook: Stop Completed
tokens used
129,803
# Iteration 017: INTEGRATION FEASIBILITY

## Focus
INTEGRATION FEASIBILITY: For top 5 adoption candidates, how hard would they be to integrate into Spec Kit Memory?

## Findings

### Finding 1: Engram’s profile-gated MCP surface is a good fit, but only as a wrapper/schema layer
- **Source**: [external/internal/mcp/mcp.go:53](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:53), [external/internal/mcp/mcp.go:69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:69), [external/internal/mcp/mcp.go:124](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:124), [external/internal/mcp/mcp.go:515](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:515), [INSTALL_GUIDE.md:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:5)
- **What it does**: Engram hard-codes `ProfileAgent` and `ProfileAdmin`, resolves allowlists via `ResolveTools()`, and combines that with eager core tools plus `WithDeferLoading(true)` for secondary tools. The split is operational, not storage-level.
- **Why it matters for us**: Public exposes 43 tools today, so a profile layer could reduce prompt noise fast. Integration difficulty is medium: mostly MCP registration, schema/docs, and wrapper guidance, with no DB migration.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Topic-key threading is the cleanest hygiene feature to borrow, but as metadata-first rather than live-row upsert
- **Source**: [external/internal/store/store.go:948](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:948), [external/internal/store/store.go:1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1462), [external/internal/store/store.go:3198](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3198), [external/internal/store/store_test.go:543](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:543), [external/internal/store/store_test.go:1733](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:1733), [markdown-evidence-builder.ts:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:102)
- **What it does**: `SuggestTopicKey()` infers families like `architecture/` and `bug/`, `AddObservation()` upserts by `topic_key` within project+scope while incrementing `revision_count`, and `Search()` gives exact `topic_key` hits priority before FTS.
- **Why it matters for us**: Public has strong retrieval, but its save path is still file/section-oriented rather than thread-oriented. Integration difficulty is medium if we start with optional `thread_key` metadata in generated memory artifacts plus indexed lookup; full Engram-style mutable upserts would be much harder and should stay out of the first cut.
- **Recommendation**: adopt now
- **Impact**: high

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
