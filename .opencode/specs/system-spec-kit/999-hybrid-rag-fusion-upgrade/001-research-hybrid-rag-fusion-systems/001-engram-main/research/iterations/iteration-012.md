### Finding 3: We should build a lightweight personal sync policy plane with per-project enrollment, ack state, leases, and backoff
- **Source**: [external/internal/store/store.go#L171](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L171), [external/internal/store/store.go#L1860](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1860), [external/internal/store/store.go#L1988](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1988), [external/internal/store/store.go#L2036](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L2036), [external/internal/store/store.go#L2137](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L2137), [shared-memory.ts#L232](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L232)
- **What it does**: Engram tracks `last_acked_seq`, `last_pulled_seq`, lease owner/until, failure count, backoff, and enrolled projects. Sync is not “all or nothing”; it has a small operational state machine and explicit project-level eligibility.
- **Why it matters for us**: Public’s shared-memory subsystem is governance-heavy and collaboration-oriented. That is good, but it does not solve the simpler problem of “sync only these personal memory scopes to my other machine, with retries and conflict-safe workers.” That missing middle layer is a real feature gap.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 4: We should build full-fidelity snapshot export/import for cold backup and air-gapped migration
- **Source**: [external/internal/store/store.go#L1671](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1671), [external/internal/store/store.go#L1743](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1743), [README.md#L846](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L846), [README.md#L924](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L924)
- **What it does**: Engram’s `Export()` and `Import()` serialize and restore sessions, observations, and prompts together in one transaction, carrying over timestamps, `topic_key`, `revision_count`, `duplicate_count`, and tombstone state. This is a cold-migration surface, not just a live sync loop.
- **Why it matters for us**: Public checkpoints are rollback primitives inside one installation, and shared-memory spaces are live collaboration surfaces. Neither is the same as a user-controlled “export my memory corpus / import it elsewhere” workflow for migration, backup, archival testing, or air-gapped recovery.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 5: We should build a pluggable continuity transport layer instead of coupling portability to one backend
- **Source**: [external/internal/sync/transport.go#L10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go#L10), [external/internal/sync/sync.go#L100](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go#L100), [external/internal/sync/sync.go#L123](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go#L123), [shared-memory.ts#L245](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L245)
- **What it does**: Engram explicitly separates sync logic from transport I/O. The same `Syncer` can write to the filesystem or a remote transport because manifest/chunk operations are abstracted behind `ReadManifest`, `WriteManifest`, `WriteChunk`, and `ReadChunk`.
- **Why it matters for us**: If Public adds portable memory movement, we should not hard-code it to shared-memory DB tables or one filesystem format. A transport boundary would let the same exported continuity model support local folders, git-backed repos, object storage, or later hosted sync without redesigning the memory layer again.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [research/iterations/iteration-009.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-009.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/sync/sync.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go)
- [external/internal/sync/transport.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go)
- [external/internal/project/detect.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go)
- [external/internal/project/similar.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go)
- [mcp_server/tools/memory-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts)
- [mcp_server/tools/lifecycle-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts)
- [mcp_server/handlers/session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [mcp_server/handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [mcp_server/handlers/shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts)
- [mcp_server/handlers/memory-index-alias.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts)
- [mcp_server/lib/storage/mutation-ledger.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts)
- [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md)

## Assessment
- New information ratio: 0.81
- Questions addressed: Q7, Q8, Q9, Q10
- Questions answered: Q7, Q8, Q9, Q10

## Reflection
- What worked: tracing `sync.go`, `transport.go`, `Import()`, `ApplyPulledMutation()`, and the `sync_id` paths directly surfaced feature gaps that the earlier session/topic-key work had not fully explored.
- What did not work: CocoIndex was unavailable again, so this iteration stayed on `rg` plus direct file reads; the workspace is read-only, so I did not update the phase folder or run `generate-context.js`.

## Recommended Next Focus
Trace Engram’s Obsidian export and sync-facing plugin surfaces next, then compare them against Public’s current handover/reporting artifacts to decide whether we should add a human-browsable memory export layer on top of the new portability features above.

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
# Iteration 012: GAP ANALYSIS - REFACTORS

## Focus
GAP ANALYSIS - REFACTORS: Should we refactor or change direction on any existing features? Architecture changes?

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
I’m treating this as a read-only deep-research pass on Engram’s actual source, focused on refactors or direction changes for Spec Kit Memory. I’ll first pull the relevant prior memory breadcrumbs, then read the governing repo instructions and trace the Engram code paths you called out before synthesizing only the new gap-analysis findings.
exec
/bin/zsh -lc 'rg -n "engram|hybrid-rag-fusion|001-engram-main|topic_key|sync_id|transport" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
554:- symptom: `follow_on_tool_use` stays zero while other events emit; cause: non-search tool has no session-id propagation path; fix: choose a tool that accepts session id or add transport/schema-based session propagation before expecting this event [Task 2]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1652:- Pre-query guard failures should be wrapped in MCP envelope `E021` before handler query execution so transport contracts stay stable across `memory_list`, `memory_stats`, and `memory_health` [Task 5]
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc 'pwd && test -f /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md && echo CLAUDE_OK && test -f /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md && echo EXT_AGENTS_OK' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
CLAUDE_OK
EXT_AGENTS_OK

codex
I found only light prior memory signal for this spec family, mostly around hybrid-rag review workflow rather than Engram-specific architecture. I’m moving into source tracing now: repo instructions first, then Engram’s MCP/store/sync paths, and after that I’ll compare those against our current memory stack for refactor-level recommendations only.
exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '2008,2026p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings

## Task 1: Run three-agent ultra-think review for 023 documentation drift and severity-ranked findings

### rollout_summary_files

- rollout_summaries/2026-03-04T10-42-27-LKfV-hybrid_rag_fusion_refinement_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/04/rollout-2026-03-04T11-42-27-019cb871-1f3b-70b3-89f4-407b0a5dcacb.jsonl, updated_at=2026-03-04T10:51:24+00:00, thread_id=019cb871-1f3b-70b3-89f4-407b0a5dcacb)

### keywords

- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]

## User preferences

- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

## Reusable knowledge


codex
I’ve got the governing instructions loaded. Next I’m tracing the concrete Engram surfaces that could justify a direction change for us: MCP profile wiring, session lifecycle, topic hygiene, project scoping, and plugin-facing sync behavior, then I’ll line them up against our current shared-memory and session-recovery architecture.
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

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
CocoIndex didn’t give me a usable result here, so I’m falling back to targeted `rg` plus direct source reads, exactly as the brief allows. I’m pulling the MCP registrations and the store/search/session implementations next so the recommendations stay code-backed rather than README-backed.
exec
/bin/zsh -lc 'rg -n "ProfileAgent|ProfileAdmin|ResolveTools|shouldRegister|mem_search|mem_save|mem_context|mem_session_summary|mem_session_start|mem_session_end|mem_suggest_topic_key|mem_capture_passive|project|merge|enroll|plugin|obsidian" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
11://	engram mcp --tools=admin      → 4 tools for TUI/CLI (delete, stats, timeline, merge)
13://	engram mcp --tools=mem_save,mem_search → individual tool names
21:	projectpkg "github.com/Gentleman-Programming/engram/internal/project"
29:	DefaultProject string // Auto-detected project name, used when LLM sends empty project
41://   mem_save, mem_search, mem_context, mem_session_summary,
42://   mem_session_start, mem_session_end, mem_get_observation,
43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
46://   mem_update, mem_delete, mem_stats, mem_timeline, mem_merge_projects
50:// ProfileAgent contains the tool names that AI agents need.
53:var ProfileAgent = map[string]bool{
54:	"mem_save":              true, // proactive save — referenced 17 times across protocols
55:	"mem_search":            true, // search past memories — referenced 6 times
56:	"mem_context":           true, // recent context from previous sessions — referenced 10 times
57:	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
58:	"mem_session_start":     true, // register session start
59:	"mem_session_end":       true, // mark session completed
61:	"mem_suggest_topic_key": true, // stable topic key for upserts — referenced 3 times
62:	"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
63:	"mem_save_prompt":       true, // save user prompts
67:// ProfileAdmin contains tools for TUI, dashboards, and manual curation
69:var ProfileAdmin = map[string]bool{
73:	"mem_merge_projects": true, // destructive curation tool — not for agent use
78:	"agent": ProfileAgent,
79:	"admin": ProfileAdmin,
82:// ResolveTools takes a comma-separated string of profile names and/or
85:func ResolveTools(input string) map[string]bool {
127:  mem_save — save decisions, bugs, discoveries, conventions PROACTIVELY (do not wait to be asked)
128:  mem_search — find past work, decisions, or context from previous sessions
129:  mem_context — get recent session history (call at session start or after compaction)
130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
132:  mem_save_prompt — save user prompt for context
135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
136:  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
138:PROACTIVE SAVE RULE: Call mem_save immediately after ANY decision, bug fix, discovery, or convention — not just when asked.`
147:// default project detection and optional tool allowlist.
160:// shouldRegister returns true if the tool should be registered given the
162:func shouldRegister(name string, allowlist map[string]bool) bool {
170:	// ─── mem_search (profile: agent, core — always in context) ─────────
171:	if shouldRegister("mem_search", allowlist) {
173:			mcp.NewTool("mem_search",
187:				mcp.WithString("project",
188:					mcp.Description("Filter by project name"),
191:					mcp.Description("Filter by scope: project (default) or personal"),
201:	// ─── mem_save (profile: agent, core — always in context) ───────────
202:	if shouldRegister("mem_save", allowlist) {
204:			mcp.NewTool("mem_save",
248:					mcp.Description("Session ID to associate with (default: manual-save-{project})"),
250:				mcp.WithString("project",
254:					mcp.Description("Scope for this observation: project (default) or personal"),
257:					mcp.Description("Optional topic identifier for upserts (e.g. architecture/auth-model). Reuses and updates the latest observation in same project+scope."),
265:	if shouldRegister("mem_update", allowlist) {
288:				mcp.WithString("project",
289:					mcp.Description("New project value"),
292:					mcp.Description("New scope: project or personal"),
302:	// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
303:	if shouldRegister("mem_suggest_topic_key", allowlist) {
305:			mcp.NewTool("mem_suggest_topic_key",
306:				mcp.WithDescription("Suggest a stable topic_key for memory upserts. Use this before mem_save when you want evolving topics (like architecture decisions) to update a single observation over time."),
328:	if shouldRegister("mem_delete", allowlist) {
350:	// ─── mem_save_prompt (profile: agent, eager) ────────────────────────
351:	if shouldRegister("mem_save_prompt", allowlist) {
353:			mcp.NewTool("mem_save_prompt",
365:					mcp.Description("Session ID to associate with (default: manual-save-{project})"),
367:				mcp.WithString("project",
375:	// ─── mem_context (profile: agent, core — always in context) ────────
376:	if shouldRegister("mem_context", allowlist) {
378:			mcp.NewTool("mem_context",
385:				mcp.WithString("project",
386:					mcp.Description("Filter by project (omit for all projects)"),
389:					mcp.Description("Filter observations by scope: project (default) or personal"),
400:	if shouldRegister("mem_stats", allowlist) {
403:				mcp.WithDescription("Show memory system statistics — total sessions, observations, and projects tracked."),
416:	if shouldRegister("mem_timeline", allowlist) {
419:				mcp.WithDescription("Show chronological context around a specific observation. Use after mem_search to drill into the timeline of events surrounding a search result. This is the progressive disclosure pattern: search first, then timeline to understand context."),
428:					mcp.Description("The observation ID to center the timeline on (from mem_search results)"),
442:	if shouldRegister("mem_get_observation", allowlist) {
445:				mcp.WithDescription("Get the full content of a specific observation by ID. Use when you need the complete, untruncated content of an observation found via mem_search or mem_timeline."),
460:	// ─── mem_session_summary (profile: agent, core — always in context) ─
461:	if shouldRegister("mem_session_summary", allowlist) {
463:			mcp.NewTool("mem_session_summary",
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
629:		project, _ := req.GetArguments()["project"].(string)
633:		// Apply default project when LLM sends empty
634:		if project == "" {
635:			project = cfg.DefaultProject
637:		// Normalize project name
638:		project, _ = store.NormalizeProject(project)
642:			Project: project,
658:			projectDisplay := ""
660:				projectDisplay = fmt.Sprintf(" | project: %s", *r.Project)
670:				r.CreatedAt, projectDisplay, r.Scope)
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
799:		if v, ok := req.GetArguments()["project"].(string); ok {
855:		project, _ := req.GetArguments()["project"].(string)
857:		// Apply default project when LLM sends empty
858:		if project == "" {
859:			project = cfg.DefaultProject
861:		project, _ = store.NormalizeProject(project)
864:			sessionID = defaultSessionID(project)
868:		s.CreateSession(sessionID, project, "")
873:			Project:   project,
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
925:		var projects string
927:			projects = strings.Join(stats.Projects, ", ")
929:			projects = "none yet"
933:			stats.TotalSessions, stats.TotalObservations, stats.TotalPrompts, projects)
1003:		project := ""
1005:			project = fmt.Sprintf("\nProject: %s", *obs.Project)
1022:			obs.SessionID, project+scope+topic, toolName+duplicateMeta+revisionMeta,
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
1067:		project, _ := req.GetArguments()["project"].(string)
1070:		// Apply default project when LLM sends empty
1071:		if project == "" {
1072:			project = cfg.DefaultProject
1074:		project, _ = store.NormalizeProject(project)
1076:		if err := s.CreateSession(id, project, directory); err != nil {
1080:		return mcp.NewToolResultText(fmt.Sprintf("Session %q started for project %q", id, project)), nil
1101:		project, _ := req.GetArguments()["project"].(string)
1104:		// Apply default project when LLM sends empty
1105:		if project == "" {
1106:			project = cfg.DefaultProject
1108:		project, _ = store.NormalizeProject(project)
1115:			sessionID = defaultSessionID(project)
1116:			_ = s.CreateSession(sessionID, project, "")
1126:			Project:   project,
1158:			return mcp.NewToolResultError("at least one source project name is required in 'from'"), nil
1177:// defaultSessionID returns a project-scoped default session ID.
1178:// If project is non-empty: "manual-save-{project}"
1179:// If project is empty: "manual-save"
1180:func defaultSessionID(project string) string {
1181:	if project == "" {
1184:	return "manual-save-" + project

exec
/bin/zsh -lc "rg -n \"CreateSession|EndSession|FormatContext|AddObservation|Search\\(|SuggestTopicKey|sanitizeFTS|duplicate_count|revision_count|deleted_at|topic_key|project_name|project_scope|merge|similar|prompts_fts|observations_fts|DeleteObservation|ListProjects|GetRecentSessions\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
48:	TopicKey       *string `json:"topic_key,omitempty"`
49:	RevisionCount  int     `json:"revision_count"`
50:	DuplicateCount int     `json:"duplicate_count"`
54:	DeletedAt      *string `json:"deleted_at,omitempty"`
87:	TopicKey       *string `json:"topic_key,omitempty"`
88:	RevisionCount  int     `json:"revision_count"`
89:	DuplicateCount int     `json:"duplicate_count"`
93:	DeletedAt      *string `json:"deleted_at,omitempty"`
112:type AddObservationParams struct {
120:	TopicKey  string `json:"topic_key,omitempty"`
129:	TopicKey *string `json:"topic_key,omitempty"`
217:	TopicKey   *string `json:"topic_key,omitempty"`
219:	DeletedAt  *string `json:"deleted_at,omitempty"`
460:			topic_key  TEXT,
462:			revision_count INTEGER NOT NULL DEFAULT 1,
463:			duplicate_count INTEGER NOT NULL DEFAULT 1,
467:			deleted_at TEXT,
476:		CREATE VIRTUAL TABLE IF NOT EXISTS observations_fts USING fts5(
482:			topic_key,
501:		CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
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
1186:	ftsQuery := sanitizeFTS(query)
1190:		FROM prompts_fts fts
1192:		WHERE prompts_fts MATCH ?
1226:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1227:		 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
1284:			     topic_key = ?,
1286:			     revision_count = revision_count + 1,
1288:			 WHERE id = ? AND deleted_at IS NULL`,
1313:func (s *Store) DeleteObservation(id int64, hardDelete bool) error {
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
1525:		FROM observations_fts fts
1527:		WHERE observations_fts MATCH ? AND o.deleted_at IS NULL
1592:	s.db.QueryRow("SELECT COUNT(*) FROM observations WHERE deleted_at IS NULL").Scan(&stats.TotalObservations)
1595:	rows, err := s.queryItHook(s.db, "SELECT project FROM observations WHERE project IS NOT NULL AND deleted_at IS NULL GROUP BY project ORDER BY MAX(created_at) DESC")
1613:func (s *Store) FormatContext(project, scope string) (string, error) {
1699:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1769:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
2124:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2125:		 FROM observations WHERE sync_id = ? AND deleted_at IS NULL ORDER BY id DESC LIMIT 1`,
2290:		 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
2318:// ListProjectsWithStats returns all projects with aggregated counts.
2320:func (s *Store) ListProjectsWithStats() ([]ProjectStats, error) {
2325:		 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
2434:// for the given project name. Used by handleSave for the similar-project
2435:// warning instead of the heavier ListProjectsWithStats.
2439:		`SELECT COUNT(*) FROM observations WHERE project = ? AND deleted_at IS NULL`,
2449:	SourcesMerged       []string `json:"sources_merged"`
2476:				return fmt.Errorf("merge observations %q → %q: %w", src, canonical, err)
2483:				return fmt.Errorf("merge sessions %q → %q: %w", src, canonical, err)
2490:				return fmt.Errorf("merge prompts %q → %q: %w", src, canonical, err)
2497:		// Enqueue sync mutations so cloud sync picks up the merged records.
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
3125:		DROP TABLE IF EXISTS observations_fts;
3126:		CREATE VIRTUAL TABLE observations_fts USING fts5(
3132:			topic_key,
3136:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
3137:		SELECT id, title, content, tool_name, type, project, topic_key
3139:		WHERE deleted_at IS NULL;
3198:// SuggestTopicKey generates a stable topic key suggestion from type/title/content.
3201:func SuggestTopicKey(typ, title, content string) string {
3382:// sanitizeFTS wraps each word in quotes so FTS5 doesn't choke on special chars.
3384:func sanitizeFTS(query string) string {
3504:			   AND deleted_at IS NULL
3521:		_, err = s.AddObservation(AddObservationParams{

exec
/bin/zsh -lc 'rg -n "Normalize|Detect|Similar|project|scope|workspace|root|obsidian|manifest|sync" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/*.go /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/*.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:1:package project
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:52:// ─── FindSimilar unit tests ──────────────────────────────────────────────────
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:54:func TestFindSimilar_CaseInsensitiveAndSubstring(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:56:	matches := FindSimilar("engram", existing, 3)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:73:func TestFindSimilar_TiandaGroup(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:75:	matches := FindSimilar("tianda", existing, 3)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:115:func TestFindSimilar_ExcludesExactMatch(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:117:	matches := FindSimilar("engram", existing, 3)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:124:func TestFindSimilar_NothingSimilar(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:126:	matches := FindSimilar("abc", existing, 1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:133:func TestFindSimilar_LevenshteinHit(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:135:	matches := FindSimilar("engram", existing, 2)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:151:func TestFindSimilar_LevenshteinBeyondMaxDistance(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:154:	matches := FindSimilar("engram", existing, 2)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:161:func TestFindSimilar_OrderingCaseFirst(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:168:	matches := FindSimilar("engram", existing, 2)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:185:func TestFindSimilar_EmptyExisting(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:186:	matches := FindSimilar("engram", []string{}, 3)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:192:func TestFindSimilar_ZeroMaxDistance(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:197:	matches := FindSimilar("engram", existing, 0)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:1:package sync
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:14:		t.Fatalf("read missing manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:17:		t.Fatalf("expected empty v1 manifest, got %+v", m)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:33:		t.Fatalf("write manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:38:		t.Fatalf("read manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:53:	if err := os.WriteFile(filepath.Join(dir, "manifest.json"), []byte("{bad"), 0o644); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:60:		t.Fatal("expected error for invalid manifest JSON")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:65:	// syncDir is a regular file, not a directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:74:		t.Fatal("expected error when syncDir is a file")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:121:		t.Fatal("expected error writing chunk to non-directory syncDir")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:148:			{"id": "s1", "project": "proj", "directory": "/tmp", "started_at": "2025-01-01 00:00:00"},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:151:			{"id": 1, "session_id": "s1", "type": "decision", "title": "test", "content": "data", "scope": "project", "created_at": "2025-01-01 00:00:00", "updated_at": "2025-01-01 00:00:00"},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:189:	if ft.syncDir != dir {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:190:		t.Fatalf("syncDir mismatch: got %q want %q", ft.syncDir, dir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:199:		t.Fatal("expected non-nil syncer")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:211:		t.Fatal("expected non-nil syncer")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:213:	if sy.syncDir != dir {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:214:		t.Fatalf("syncDir mismatch: got %q want %q", sy.syncDir, dir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go:1:package project
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go:8:// ProjectMatch represents a project name that is similar to a query string.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go:10:	Name      string // The existing project name
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go:15:// FindSimilar finds projects similar to the given name from a list of existing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go:16:// project names. Similarity is determined by three criteria:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go:26:func FindSimilar(name string, existing []string, maxDistance int) []ProjectMatch {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:1:package sync
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:10:// Transport defines how chunks are read and written during sync.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:14:	// ReadManifest returns the manifest (chunk index).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:15:	// Returns an empty manifest if none exists yet.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:18:	// WriteManifest persists the manifest.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:38:	syncDir string // Path to .engram/ directory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:41:// NewFileTransport creates a FileTransport rooted at the given sync directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:42:func NewFileTransport(syncDir string) *FileTransport {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:43:	return &FileTransport{syncDir: syncDir}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:46:// ReadManifest reads the manifest.json from the sync directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:47:// Returns an empty manifest (Version=1) if the file does not exist.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:49:	path := filepath.Join(ft.syncDir, "manifest.json")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:55:		return nil, fmt.Errorf("read manifest: %w", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:60:		return nil, fmt.Errorf("parse manifest: %w", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:65:// WriteManifest writes the manifest to manifest.json in the sync directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:67:	path := filepath.Join(ft.syncDir, "manifest.json")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:70:		return fmt.Errorf("marshal manifest: %w", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:77:	chunksDir := filepath.Join(ft.syncDir, "chunks")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:88:	chunksDir := filepath.Join(ft.syncDir, "chunks")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:1:// Package project provides utilities for detecting and normalizing project names.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:6:package project
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:16:// DetectProject detects the project name for a given directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:17:// Priority: git remote origin repo name → git root basename → dir basename.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:19:func DetectProject(dir string) string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:43:// normalize applies canonical project name rules: lowercase + trim whitespace.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:44:// It mirrors the normalization applied by the store layer so that DetectProject
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:45:// always returns a value that is consistent with stored project names.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:54:// detectFromGitRemote attempts to determine the project name from the git
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:70:// detectFromGitRoot returns the basename of the git repository root.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:82:	root := strings.TrimSpace(string(out))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:83:	if root == "" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:86:	return filepath.Base(root)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:1:// Package sync implements git-friendly memory synchronization for Engram.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:4:// JSONL chunks with a manifest index. This design:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:6://   - Avoids git merge conflicts (each sync creates a NEW chunk, never modifies old ones)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:14://	├── manifest.json          ← index of all chunks (small, mergeable)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:20:package sync
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:63:// ChunkEntry describes a single chunk in the manifest.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:80:// SyncResult is returned after a sync operation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:86:	IsEmpty              bool   `json:"is_empty"` // true if nothing new to sync
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:103:	syncDir   string    // Path to .engram/ in the project repo (kept for backward compat)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:107:// New creates a Syncer with a FileTransport rooted at syncDir.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:109:func New(s *store.Store, syncDir string) *Syncer {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:112:		syncDir:   syncDir,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:113:		transport: NewFileTransport(syncDir),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:119:func NewLocal(s *store.Store, syncDir string) *Syncer {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:120:	return New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:124:// This is used for remote (cloud) sync where chunks travel over HTTP.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:135:// It reads the manifest to know what's already exported, then creates
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:137:func (sy *Syncer) Export(createdBy string, project string) (*SyncResult, error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:138:	// Pre-flight: ensure the sync directory structure exists for filesystem transports.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:140:	// first check in Export, before manifest reading.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:141:	if sy.syncDir != "" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:142:		chunksDir := filepath.Join(sy.syncDir, "chunks")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:148:	// Read current manifest (or create empty one)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:149:	manifest, err := sy.readManifest()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:154:	// Get known chunk IDs from the store's sync tracking
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:157:		return nil, fmt.Errorf("get synced chunks: %w", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:160:	// Also consider chunks in the manifest as known
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:161:	for _, c := range manifest.Chunks {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:171:	// Filter by project if specified
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:172:	if project != "" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:173:		data = filterByProject(data, project)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:177:	lastChunkTime := sy.lastChunkTime(manifest)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:202:	// Build manifest entry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:217:	// Update manifest
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:218:	manifest.Chunks = append(manifest.Chunks, entry)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:220:	if err := sy.writeManifest(manifest); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:221:		return nil, fmt.Errorf("write manifest: %w", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:224:	// Record this chunk as synced in the local DB
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:226:		return nil, fmt.Errorf("record synced chunk: %w", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:239:// Import reads the manifest and imports any chunks not yet in the local DB.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:241:	manifest, err := sy.readManifest()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:246:	if len(manifest.Chunks) == 0 {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:253:		return nil, fmt.Errorf("get synced chunks: %w", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:258:	for _, entry := range manifest.Chunks {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:306:// Status returns information about what would be synced.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:308:	manifest, err := sy.readManifest()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:318:	remoteChunks = len(manifest.Chunks)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:321:	for _, entry := range manifest.Chunks {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:357:// If lastChunkTime is empty, returns everything (first sync).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:362:		// First sync — everything is new
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:370:	// Normalize: DB times are "2006-01-02 15:04:05", manifest times are RFC3339.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:395:func filterByProject(data *store.ExportData, project string) *store.ExportData {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:401:	// Step 1: index sessions that match by their own project
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:404:		if s.Project == project {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:409:	// Step 2: observations — match by own project OR by session
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:413:		if !match && o.Project != nil && *o.Project == project {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:422:	// Step 3: prompts — match by own project OR by session
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:425:		if !match && p.Project == project {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:514:// ManifestSummary returns a human-readable summary of the manifest.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:517:		return "No chunks synced yet."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:1:package project
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:51:			url:  "git@gitlab.com:group/subgroup/my-project",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:52:			want: "my-project",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:71:// ─── DetectProject integration tests ─────────────────────────────────────────
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:89:func TestDetectProject_GitRemote(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:100:	got := DetectProject(dir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:102:		t.Errorf("DetectProject with remote = %q; want %q", got, "my-cool-repo")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:106:func TestDetectProject_GitRemote_HTTPS(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:116:	got := DetectProject(dir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:118:		t.Errorf("DetectProject HTTPS remote = %q; want %q", got, "engram")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:122:func TestDetectProject_GitRootNoRemote(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:125:	// No remote configured — should fall back to basename of git root
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:127:	got := DetectProject(dir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:129:	// Normalize to lowercase to match DetectProject output
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:132:		t.Errorf("DetectProject no-remote = %q; want %q", got, wantLower)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:136:func TestDetectProject_NonGitDir(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:140:	got := DetectProject(dir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:143:		t.Errorf("DetectProject non-git = %q; want %q", got, want)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:147:func TestDetectProject_EmptyDir_NoPanic(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:151:			t.Errorf("DetectProject panicked: %v", r)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:154:	got := DetectProject("")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:157:		t.Error("DetectProject(\"\") returned empty string")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:161:func TestDetectProject_NormalizedLowercase(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:162:	// DetectProject must always return lowercase names.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:170:	got := DetectProject(upper)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:171:	if got != "myproject" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:172:		t.Errorf("DetectProject uppercase dir = %q; want %q", got, "myproject")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:176:func TestDetectProject_GitRemoteCasing(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:187:	got := DetectProject(dir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:189:		t.Errorf("DetectProject uppercase remote name = %q; want %q", got, "myrepo")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:1:package sync
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:49:		Title:     "project observation",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:50:		Content:   "project scoped content",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:52:		Scope:     "project",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:61:		Content:   "other scoped content",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:63:		Scope:     "project",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:80:		t.Fatalf("marshal manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:83:		t.Fatalf("mkdir sync dir: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:85:	if err := os.WriteFile(filepath.Join(dir, "manifest.json"), data, 0o644); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:86:		t.Fatalf("write manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:133:	syncDir := filepath.Join(t.TempDir(), ".engram")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:134:	sy := New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:137:		t.Fatal("expected non-nil syncer")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:142:	if sy.syncDir != syncDir {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:143:		t.Fatalf("sync dir mismatch: got %q want %q", sy.syncDir, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:151:	syncDir := filepath.Join(t.TempDir(), ".engram")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:152:	exporter := New(srcStore, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:165:	chunkPath := filepath.Join(syncDir, "chunks", exportResult.ChunkID+".jsonl.gz")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:170:	manifest, err := exporter.readManifest()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:172:		t.Fatalf("read manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:174:	if len(manifest.Chunks) != 1 || manifest.Chunks[0].ID != exportResult.ChunkID {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:175:		t.Fatalf("unexpected manifest after export: %+v", manifest.Chunks)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:187:	importer := New(dstStore, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:231:	t.Run("invalid manifest", func(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:233:		syncDir := t.TempDir()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:234:		if err := os.WriteFile(filepath.Join(syncDir, "manifest.json"), []byte("not-json"), 0o644); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:235:			t.Fatalf("write invalid manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:238:		sy := New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:239:		if _, err := sy.Export("alice", ""); err == nil || !strings.Contains(err.Error(), "parse manifest") {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:240:			t.Fatalf("expected parse manifest error, got %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:244:	t.Run("get synced chunks", func(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:246:		syncDir := t.TempDir()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:251:		sy := New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:252:		if _, err := sy.Export("alice", ""); err == nil || !strings.Contains(err.Error(), "get synced chunks") {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:253:			t.Fatalf("expected get synced chunks error, got %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:274:		writeManifestFile(t, sy.syncDir, &Manifest{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:336:	t.Run("write manifest error", func(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:340:		syncDir := t.TempDir()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:345:			return nil, errors.New("forced manifest marshal failure")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:348:		sy := New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:349:		if _, err := sy.Export("alice", ""); err == nil || !strings.Contains(err.Error(), "write manifest") {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:350:			t.Fatalf("expected write manifest error, got %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:354:	t.Run("record synced chunk error", func(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:364:		if _, err := sy.Export("alice", ""); err == nil || !strings.Contains(err.Error(), "record synced chunk") {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:365:			t.Fatalf("expected record synced chunk error, got %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:371:	t.Run("read manifest error", func(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:373:		syncDir := t.TempDir()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:374:		if err := os.WriteFile(filepath.Join(syncDir, "manifest.json"), []byte("{bad"), 0o644); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:375:			t.Fatalf("write invalid manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:378:		sy := New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:379:		if _, err := sy.Import(); err == nil || !strings.Contains(err.Error(), "parse manifest") {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:380:			t.Fatalf("expected parse manifest error, got %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:384:	t.Run("empty manifest", func(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:399:		syncDir := t.TempDir()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:400:		writeManifestFile(t, syncDir, &Manifest{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:405:		sy := New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:417:		syncDir := t.TempDir()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:419:		writeManifestFile(t, syncDir, &Manifest{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:424:		chunksDir := filepath.Join(syncDir, "chunks")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:432:		sy := New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:440:		syncDir := t.TempDir()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:442:		writeManifestFile(t, syncDir, &Manifest{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:454:				Scope:     "project",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:464:		chunksDir := filepath.Join(syncDir, "chunks")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:472:		sy := New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:478:	t.Run("get synced chunks", func(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:480:		syncDir := t.TempDir()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:481:		writeManifestFile(t, syncDir, &Manifest{Version: 1, Chunks: []ChunkEntry{{ID: "c1", CreatedAt: time.Now().UTC().Format(time.RFC3339)}}})
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:486:		sy := New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:487:		if _, err := sy.Import(); err == nil || !strings.Contains(err.Error(), "get synced chunks") {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:488:			t.Fatalf("expected get synced chunks error, got %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:495:		syncDir := t.TempDir()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:497:		writeManifestFile(t, syncDir, &Manifest{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:509:		chunksDir := filepath.Join(syncDir, "chunks")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:521:		sy := New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:529:	syncDir := t.TempDir()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:530:	sy := New(nil, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:534:		t.Fatalf("read missing manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:537:		t.Fatalf("unexpected default manifest: %+v", missing)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:545:		t.Fatalf("write manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:550:		t.Fatalf("read manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:553:		t.Fatalf("manifest roundtrip mismatch: %+v", got)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:556:	if err := os.WriteFile(filepath.Join(syncDir, "manifest.json"), []byte("{"), 0o644); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:557:		t.Fatalf("write invalid manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:559:	if _, err := sy.readManifest(); err == nil || !strings.Contains(err.Error(), "parse manifest") {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:560:		t.Fatalf("expected parse manifest error, got %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:565:		t.Fatalf("write non-dir sync path: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:568:	if _, err := syBad.readManifest(); err == nil || !strings.Contains(err.Error(), "read manifest") {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:569:		t.Fatalf("expected read manifest error, got %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:572:		t.Fatal("expected write manifest error for non-directory sync path")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:575:	t.Run("marshal manifest error", func(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:582:			return nil, errors.New("forced manifest marshal error")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:585:		if err := sy.writeManifest(&Manifest{Version: 1}); err == nil || !strings.Contains(err.Error(), "marshal manifest") {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:586:			t.Fatalf("expected marshal manifest error, got %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:592:	t.Run("read manifest error", func(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:594:		syncDir := t.TempDir()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:595:		if err := os.WriteFile(filepath.Join(syncDir, "manifest.json"), []byte("not-json"), 0o644); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:596:			t.Fatalf("write invalid manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:599:		sy := New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:601:			t.Fatal("expected status to fail on invalid manifest")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:606:	syncDir := t.TempDir()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:607:	sy := New(s, syncDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:613:		t.Fatalf("write manifest: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:616:		t.Fatalf("record synced chunk: %v", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:653:	projectOnly := filterByProject(data, "proj-a")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:654:	if len(projectOnly.Sessions) != 1 || projectOnly.Sessions[0].ID != "s1" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:655:		t.Fatalf("unexpected filtered sessions: %+v", projectOnly.Sessions)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:657:	if len(projectOnly.Observations) != 1 || projectOnly.Observations[0].SessionID != "s1" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:658:		t.Fatalf("unexpected filtered observations: %+v", projectOnly.Observations)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:660:	if len(projectOnly.Prompts) != 1 || projectOnly.Prompts[0].SessionID != "s1" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:661:		t.Fatalf("unexpected filtered prompts: %+v", projectOnly.Prompts)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:667:		t.Fatalf("expected first sync to include all data, got %+v", all)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:709:			// obs with own project but session has empty project — included via entity project
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:711:			// obs with own project but session has different project — included via entity project
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:713:			// obs with nil project in non-matching session — excluded
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:719:			// prompt with own project but session has empty project — included via entity project
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:721:			// prompt with wrong project in non-matching session — excluded
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:742:		t.Error("observation 4 (nil project, non-matching session) should be excluded")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:757:		t.Error("prompt 3 (wrong project, non-matching session) should be excluded")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:862:	t.Run("manifest summary", func(t *testing.T) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:864:		if empty != "No chunks synced yet." {

exec
/bin/zsh -lc 'rg -n "memory_context|memory_search|memory_match_triggers|session_bootstrap|session_resume|task_preflight|task_postflight|shared_memory|shared_space|checkpoint|memory_save|memory_quick_search|memory_health|memory_stats" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/*.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/*.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "alias|normalize|divergent|project|scope|shared space|sessionId|working_memory|dedup|resume|bootstrap|causal|trigger|memory_index" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/*.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/*.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:48:  'task_preflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:49:  'task_postflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:56:  'shared_space_upsert',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:57:  'shared_space_membership_set',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:  'shared_memory_status',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:59:  'shared_memory_enable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:69:    case 'task_preflight':             return handleTaskPreflight(parseArgs<PreflightArgs>(validateToolArgs('task_preflight', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:70:    case 'task_postflight':            return handleTaskPostflight(parseArgs<PostflightArgs>(validateToolArgs('task_postflight', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:77:    case 'shared_space_upsert':        return handleSharedSpaceUpsert(parseArgs<SharedSpaceUpsertArgs>(validateToolArgs('shared_space_upsert', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:78:    case 'shared_space_membership_set': return handleSharedSpaceMembershipSet(parseArgs<SharedSpaceMembershipArgs>(validateToolArgs('shared_space_membership_set', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:79:    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:80:    case 'shared_memory_enable':       return handleSharedMemoryEnable(parseArgs<Record<string, unknown>>(validateToolArgs('shared_memory_enable', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:8:import * as checkpointTools from './checkpoint-tools.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:12:export { contextTools, memoryTools, causalTools, checkpointTools, lifecycleTools, codeGraphTools };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:21:  checkpointTools,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:4:// Dispatch for L5 checkpoint tools: create, list, restore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:25:  'checkpoint_create',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:26:  'checkpoint_list',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:27:  'checkpoint_restore',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:28:  'checkpoint_delete',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:34:    case 'checkpoint_create':  return handleCheckpointCreate(parseArgs<CheckpointCreateArgs>(validateToolArgs('checkpoint_create', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:35:    case 'checkpoint_list':    return handleCheckpointList(parseArgs<CheckpointListArgs>(validateToolArgs('checkpoint_list', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:36:    case 'checkpoint_restore': return handleCheckpointRestore(parseArgs<CheckpointRestoreArgs>(validateToolArgs('checkpoint_restore', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:37:    case 'checkpoint_delete':  return handleCheckpointDelete(parseArgs<CheckpointDeleteArgs>(validateToolArgs('checkpoint_delete', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:9:import * as checkpoints from '../lib/storage/checkpoints.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:28:// Feature catalog: Checkpoint creation (checkpoint_create)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:29:// Feature catalog: Checkpoint listing (checkpoint_list)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:30:// Feature catalog: Checkpoint restore (checkpoint_restore)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:31:// Feature catalog: Checkpoint deletion (checkpoint_delete)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:256:function checkpointMatchesScope(rawMetadata: unknown, scope: CheckpointScopeArgs): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:275:function checkpointScopeDetails(scope: CheckpointScopeArgs): Record<string, string> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:293:  tool: 'checkpoint_create' | 'checkpoint_list' | 'checkpoint_restore' | 'checkpoint_delete',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:300:      reason: 'checkpoint_scope_tenant_required',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:303:      hint: 'Retry with tenantId included for governed checkpoint access.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:312:/** Handle checkpoint_create tool — snapshots the current memory state for rollback.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:314: * @returns MCP response with checkpoint metadata
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:322:    return createCheckpointScopeValidationError('checkpoint_create');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:333:  const result = checkpoints.createCheckpoint({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:342:      tool: 'checkpoint_create',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:350:        hint: 'Verify database availability and retry checkpoint_create.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:351:        actions: ['Run checkpoint_list() to confirm checkpoint state before destructive operations'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:358:    tool: 'checkpoint_create',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:362:      checkpoint: result
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:365:      `Restore with: checkpoint_restore({ name: "${name}" })`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:366:      `Delete with: checkpoint_delete({ name: "${name}", confirmName: "${name}" })`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:376:/** Handle checkpoint_list tool - returns available checkpoints filtered by spec folder */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:383:    return createCheckpointScopeValidationError('checkpoint_list');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:394:  const results = checkpoints.listCheckpoints(spec_folder ?? null, limit, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:396:    ? results.filter((checkpoint) => checkpointMatchesScope(checkpoint.metadata, scope))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:400:    ? `Found ${filteredResults.length} checkpoint(s)`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:401:    : 'No checkpoints found';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:404:    tool: 'checkpoint_list',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:408:      checkpoints: filteredResults
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:411:      ? ['Create a checkpoint with checkpoint_create({ name: "my-checkpoint" })']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:421:/** Handle checkpoint_restore tool - restores memory state from a named checkpoint */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:424:  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:427:      tool: 'checkpoint_restore',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:434:        hint: 'Retry checkpoint_restore after the active restore maintenance window completes.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:446:    return createCheckpointScopeValidationError('checkpoint_restore');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:454:    const checkpoint = checkpoints.getCheckpoint(name, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:455:    if (checkpoint && !checkpointMatchesScope(checkpoint.metadata, scope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:457:        tool: 'checkpoint_restore',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:462:          scope: checkpointScopeDetails(scope),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:465:          hint: 'Retry with matching scope values or omit optional scope parameters if you intend to access an unscoped checkpoint.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:466:          actions: ['Use checkpoint_list() with the same scope parameters to discover accessible checkpoints'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:473:  const result = checkpoints.restoreCheckpoint(name, clear_existing, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:479:  // T102 FIX: Rebuild search indexes after checkpoint restore
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:495:      console.error('[T102] Index rebuild after checkpoint restore failed:', toErrorMessage(rebuildErr));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:501:      tool: 'checkpoint_restore',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:512:        hint: 'Use checkpoint_list() to confirm checkpoint name and retry.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:513:        actions: ['Inspect checkpoint integrity', 'Create a fresh checkpoint before retrying restore'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:521:      tool: 'checkpoint_restore',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:546:      tool: 'checkpoint_restore',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:565:    tool: 'checkpoint_restore',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:582:/** Handle checkpoint_delete tool - permanently removes a named checkpoint */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:589:    return createCheckpointScopeValidationError('checkpoint_delete');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:599:    throw new Error('confirmName must exactly match name to delete checkpoint');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:603:    const checkpoint = checkpoints.getCheckpoint(name, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:604:    if (checkpoint && !checkpointMatchesScope(checkpoint.metadata, scope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:606:        tool: 'checkpoint_delete',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:611:          scope: checkpointScopeDetails(scope),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:614:          hint: 'Retry with matching scope values or omit optional scope parameters if you intend to access an unscoped checkpoint.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:615:          actions: ['Use checkpoint_list() with the same scope parameters to discover accessible checkpoints'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:622:  const success: boolean = checkpoints.deleteCheckpoint(name, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:629:    tool: 'checkpoint_delete',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:634:      checkpointName: name,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:639:      : ['Use checkpoint_list() to see available checkpoints'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:811:const handle_checkpoint_create = handleCheckpointCreate;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:812:const handle_checkpoint_list = handleCheckpointList;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:813:const handle_checkpoint_restore = handleCheckpointRestore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:814:const handle_checkpoint_delete = handleCheckpointDelete;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:818:  handle_checkpoint_create,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:819:  handle_checkpoint_list,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:820:  handle_checkpoint_restore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:821:  handle_checkpoint_delete,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:19:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:11:import * as checkpoints from '../lib/storage/checkpoints.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:82:  let checkpointName: string | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:165:        const checkpoint = checkpoints.createCheckpoint({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:169:            reason: 'auto-checkpoint before bulk delete',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:174:        if (checkpoint) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:175:          checkpointName = checkpoint.name;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:176:          console.error(`[memory-delete] Created checkpoint: ${checkpointName}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:178:          console.warn('[memory-delete] Checkpoint creation returned no checkpoint; proceeding without rollback.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:179:          checkpointName = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:183:        console.error(`[memory-delete] Failed to create checkpoint: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:184:        // Confirm is always true here (validated at function entry) — safe to proceed without checkpoint.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:186:        checkpointName = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:228:            checkpoint: checkpointName,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:264:  if (checkpointName) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:265:    hints.push(`Restore with: checkpoint_restore({ name: "${checkpointName}" })`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:278:  if (checkpointName) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:279:    data.checkpoint = checkpointName;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:280:    data.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:62:  'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:63:  'memory_quick_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:65:  'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:67:  'memory_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:68:  'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:79:    case 'memory_quick_search': {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:80:      // E3: Delegate to memory_search with sensible defaults
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:81:      const validated = validateToolArgs('memory_quick_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:97:      return relabelResponseTool(response, 'memory_quick_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:100:    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:102:    case 'memory_stats':          return handleMemoryStats(parseArgs<StatsArgs>(validateToolArgs('memory_stats', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:103:    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:215:/** Arguments for checkpoint creation requests. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:226:/** Arguments for checkpoint listing requests. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:236:/** Arguments for checkpoint restore requests. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:246:/** Arguments for checkpoint deletion requests. */
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
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:28:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:613:    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:618:      tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:628:    actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:9:import * as checkpoints from '../lib/storage/checkpoints.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:44:  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:55:        hint: 'Retry memory_bulk_delete after checkpoint_restore maintenance completes.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:141:  // Create auto-checkpoint before bulk deletion (unless explicitly skipped)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:142:  let checkpointName: string | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:148:      const checkpoint = checkpoints.createCheckpoint({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:152:          reason: `auto-checkpoint before bulk delete of ${affectedCount} "${tier}" memories`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:159:      if (!checkpoint) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:160:        const checkpointError = `Checkpoint creation failed before deleting ${tier} memories`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:162:          throw new Error(`${checkpointError}. Aborting high-safety bulk delete.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:164:        console.warn(`[memory-bulk-delete] ${checkpointError}. Proceeding without rollback.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:166:        checkpointName = checkpoint.name;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:167:        console.error(`[memory-bulk-delete] Created checkpoint: ${checkpointName}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:171:      console.error(`[memory-bulk-delete] Failed to create checkpoint: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:172:      // High-safety tiers require a valid checkpoint.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:174:        throw new Error(`Failed to create mandatory checkpoint for "${tier}" tier: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:177:      checkpointName = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:253:      checkpoint: checkpointName,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:280:  if (checkpointName) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:281:    hints.push(`Restore with: checkpoint_restore({ name: "${checkpointName}" })`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:300:  if (checkpointName) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:301:    data.checkpoint = checkpointName;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:302:    data.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:32:import * as checkpoints from '../lib/storage/checkpoints.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:103:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:105:// Feature catalog: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:945:            actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:972:        actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1078:/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1082:  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1086:      tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1093:        hint: 'Retry memory_save after checkpoint_restore maintenance completes.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1151:      action: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1174:        action: 'memory_save_shared_space',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1181:        reason: access.reason ?? 'shared_space_denied',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1183:      throw new Error(`Shared-memory save denied: ${access.reason ?? 'shared_space_denied'}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1213:      tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1310:            tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1316:              actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1345:        tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1441:        tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1447:          actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1462:        action: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1470:        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1478:          WHERE shared_space_id = ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1490:            actor: provenanceActor ?? 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1703:        'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1789:const handle_memory_save = handleMemorySave;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1796:  handle_memory_save,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
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
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:11:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:41:/** Arguments for the memory_stats handler. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:73:type CheckpointsModule = typeof import('./checkpoints.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:91:let checkpointsModule: Promise<CheckpointsModule> | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:158:  if (!checkpointsModule) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:159:    checkpointsModule = loadHandlerModule<CheckpointsModule>('checkpoints');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:161:  return checkpointsModule;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:233:export const handle_memory_save = lazyFunction(getMemorySaveModule, 'handle_memory_save');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:266:export const handle_memory_stats = lazyFunction(getMemoryCrudModule, 'handle_memory_stats');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:267:export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:288:export const handle_checkpoint_create = lazyFunction(getCheckpointsModule, 'handle_checkpoint_create');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:289:export const handle_checkpoint_list = lazyFunction(getCheckpointsModule, 'handle_checkpoint_list');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:290:export const handle_checkpoint_restore = lazyFunction(getCheckpointsModule, 'handle_checkpoint_restore');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:291:export const handle_checkpoint_delete = lazyFunction(getCheckpointsModule, 'handle_checkpoint_delete');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:298:export const handle_task_preflight = lazyFunction(getSessionLearningModule, 'handle_task_preflight');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:299:export const handle_task_postflight = lazyFunction(getSessionLearningModule, 'handle_task_postflight');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:341:export const checkpoints = lazyModule(getCheckpointsModule);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:23:// Feature catalog: System statistics (memory_stats)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:30:/** Handle memory_stats tool -- returns memory system statistics and folder rankings. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:40:      tool: 'memory_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:51:      tool: 'memory_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:70:      tool: 'memory_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:80:      tool: 'memory_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:89:      tool: 'memory_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:98:      tool: 'memory_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:107:      tool: 'memory_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:116:      tool: 'memory_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:159:      tool: 'memory_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:283:      tool: 'memory_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:302:    tool: 'memory_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:15:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:19:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:300:          SELECT id, spec_folder, tenant_id, user_id, agent_id, shared_space_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:308:          shared_space_id?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:320:          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:17:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:103:        if (!matchesScopedValue(sharedSpaceId, r.shared_space_id)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:297:      actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:303:      recordHistory(nextMemoryId, 'ADD', null, parsed.title ?? parsed.filePath, 'mcp:memory_save');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:304:      recordHistory(memoryId, 'UPDATE', previous.title, parsed.title ?? parsed.filePath, 'mcp:memory_save');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:13:// Feature catalog: System statistics (memory_stats)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:35:const handle_memory_stats = handleMemoryStats;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:44:  handle_memory_stats,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
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
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:31:type SharedSpaceAdminTool = 'shared_space_upsert' | 'shared_space_membership_set';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:32:type SharedAdminTool = SharedSpaceAdminTool | 'shared_memory_enable';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:108:        details: { reason: 'shared_memory_admin_unconfigured' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:123:        details: { reason: 'shared_memory_admin_ambiguous' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:214:  if (args.tool !== 'shared_memory_enable' && normalizedTenantId.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:221:        reason: 'shared_space_tenant_required',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:239:        reason: 'shared_memory_trusted_binding_required',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:291:    action: 'shared_space_admin',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:310:    case 'shared_space_not_found':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:312:    case 'shared_space_create_admin_required':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:314:    case 'shared_space_tenant_mismatch':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:316:    case 'shared_space_owner_required':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:317:      return tool === 'shared_space_membership_set'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:320:    case 'shared_space_editor_required':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:322:    case 'shared_space_membership_required':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:324:    case 'shared_space_kill_switch':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:326:    case 'shared_space_rollout_disabled':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:328:    case 'shared_space_tenant_required':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:336:  return reason === 'shared_space_membership_required'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:337:    ? 'shared_space_owner_required'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:349:    code: reason === 'shared_space_not_found' ? 'E_NOT_FOUND' : 'E_AUTHORIZATION',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:352:      hint: reason === 'shared_space_not_found'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:353:        ? 'Create the space first with shared_space_upsert.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:354:        : reason === 'shared_space_create_admin_required'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:363:    tool: 'shared_memory_enable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:385:    details: { reason: 'shared_memory_internal_error' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:421:    FROM shared_space_members m
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:422:    JOIN shared_spaces s ON s.space_id = m.space_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:454:        tool: 'shared_space_upsert',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:461:      tool: 'shared_space_upsert',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:472:        FROM shared_spaces
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:490:            const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:505:              msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:511:        const reason = 'shared_space_create_admin_required';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:526:          msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:566:        FROM shared_spaces
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:598:      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:602:      tool: 'shared_space_upsert',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:621:      'shared_space_upsert',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:645:        tool: 'shared_space_membership_set',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:652:      tool: 'shared_space_membership_set',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:665:        const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:684:          console.error(`[shared-memory] Failed to record shared_space_admin audit: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:687:          'shared_space_membership_set',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:689:          getSharedSpaceAccessErrorMessage('shared_space_membership_set', args.spaceId, reason),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:720:      tool: 'shared_space_membership_set',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:738:      'shared_space_membership_set',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:805:      tool: 'shared_memory_enable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:811:        'shared_memory_enable_admin_required',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:823:        .get('shared_memory_enabled') as { value: string } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:834:        tool: 'shared_memory_enable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:850:      tool: 'shared_memory_enable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:866:      'shared_memory_enable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:21:import * as checkpoints from '../lib/storage/checkpoints.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:150:  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:157:        hint: 'Retry memory_index_scan after checkpoint_restore maintenance completes.',
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
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:15:// Feature catalog: Post-task learning measurement (task_postflight)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:300:/** Handle task_preflight tool - captures baseline knowledge scores before a task begins */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:370:        tool: 'task_preflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:420:      tool: 'task_preflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:441:          ? `Call task_postflight with taskId: "${taskId}", sessionId: "${normalizedSessionId}" after completing the task`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:442:          : `Call task_postflight with taskId: "${taskId}" after completing the task`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:457:/** Handle task_postflight tool - measures learning by comparing post-task scores to baseline */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:537:        ? `No preflight record found for spec_folder="${spec_folder}" and task_id="${taskId}". Call task_preflight first.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:538:        : `No preflight record found for spec_folder="${spec_folder}", task_id="${taskId}", session_id="${normalizedSessionId}". Call task_preflight first.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:607:      tool: 'task_postflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:836:      hints.push('Call task_postflight to complete learning measurement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:872:const handle_task_preflight = handleTaskPreflight;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:873:const handle_task_postflight = handleTaskPostflight;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:878:  handle_task_preflight,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:879:  handle_task_postflight,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',

 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:19:} from './causal-edges.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:20:import type { CausalEdge } from './causal-edges.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:133:    FROM memory_index m
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:195:    FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:286: * (via causal edges) to surface the full context for resolution.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:297:    // Expand cluster via causal edges (1-hop neighbors)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:301:          SELECT CAST(target_id AS INTEGER) as neighbor_id FROM causal_edges WHERE source_id = ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:303:          SELECT CAST(source_id AS INTEGER) as neighbor_id FROM causal_edges WHERE target_id = ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:346:        SELECT id, strength, last_accessed, created_by FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:370:        SELECT id, strength, last_accessed, created_by FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:454:        SELECT source_id AS node_id FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:456:        SELECT target_id AS node_id FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:9:// - similarity in [0.75, 0.88): CONFLICT (supersede prior memory via causal 'supersedes' edge)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:11:// Note: cosine similarity, normalized [0,1]. Thresholds defined by MERGE_THRESHOLD and CONFLICT_THRESHOLD constants.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:18:import * as causalEdges from './causal-edges.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:20:import { clear_search_cache } from '../search/vector-index-aliases.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:60:  triggerPhrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:93:  causalEdgeId: number | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:223:    const memoryIndexColumns = getTableColumns(db, 'memory_index');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:225:    const existingRow = db.prepare('SELECT * FROM memory_index WHERE id = ?').get(existingMemory.id) as Record<string, unknown> | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:257:      const currentRow = db.prepare('SELECT * FROM memory_index WHERE id = ?').get(existingMemory.id) as Record<string, unknown> | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:278:      const mergedTriggerPhrases = buildMergedTriggerPhrases(currentRow, newMemory.triggerPhrases);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:285:        trigger_phrases: mergedTriggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:291:        UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:303:        trigger_phrases: mergedTriggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:320:        INSERT INTO memory_index (${insertColumns.join(', ')})
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:346:      // Create supersedes causal edge
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:348:        INSERT OR IGNORE INTO causal_edges (source_id, target_id, relation, strength, extracted_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:465: * - Create a 'supersedes' causal edge from new -> existing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:482:    // Add causal 'supersedes' edge only when caller provides a distinct new ID.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:495:          UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:508:        edgeId = causalEdges.insertEdge(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:526:          UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:547:      causalEdgeId: edgeId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:676:            // instead of raw DELETE to clean lineage, projections, and graph residue.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:773:    db.exec('ALTER TABLE memory_index ADD COLUMN bm25_repair_needed INTEGER DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:797:      UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:854:  triggerPhrases?: string[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:856:  if (Array.isArray(triggerPhrases)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:857:    return JSON.stringify(triggerPhrases);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:859:  const existingValue = existingRow.trigger_phrases;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:37:function normalizeAccessCount(accessCount: number): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:157:      UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:204:  const safeAccessCount = normalizeAccessCount(accessCount);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:228:  const safeAccessCount = normalizeAccessCount(accessCount);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:4:// Provides append-first lineage transitions, active projection reads,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:24:// Feature catalog: Lineage state active projection and asOf resolution
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:71:  projection: ActiveProjectionRow | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:139:  projectionMismatches: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:176:  const row = database.prepare('SELECT * FROM memory_index WHERE id = ?').get(memoryId) as MemoryIndexRow | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:178:    throw new Error(`Memory ${memoryId} not found in memory_index`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:183:function normalizeTimestamp(value?: string | null): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:199:function normalizeScopeValue(value: unknown): string | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:208:  const scopeTuple = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:209:    ['tenant', normalizeScopeValue(row.tenant_id)],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:210:    ['user', normalizeScopeValue(row.user_id)],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:211:    ['agent', normalizeScopeValue(row.agent_id)],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:212:    ['session', normalizeScopeValue(row.session_id)],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:213:    ['shared_space', normalizeScopeValue(row.shared_space_id)],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:216:  if (scopeTuple.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:220:  const scopeHash = createHash('sha256')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:221:    .update(JSON.stringify(scopeTuple), 'utf8')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:225:  return `scope-sha256:${scopeHash}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:234:  scopePrefix: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:241:    scopePrefix: parts.scopePrefix,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:258:  const scopePrefix = buildScopePrefix(row);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:266:      scopePrefix,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:272:  if (!scopePrefix) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:275:  return `${row.spec_folder}::${scopePrefix}::${canonicalPath}::${anchorId}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:290:    FROM active_memory_projection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:316:  const projection = getActiveProjection(database, logicalKey);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:324:  return { logicalKey, projection, rows };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:407:  // Evict any stale projection row that maps a *different* logical_key to the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:411:    'DELETE FROM active_memory_projection WHERE active_memory_id = ? AND logical_key != ?',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:414:    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:431:    UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:457:    INSERT INTO memory_index (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:462:      trigger_phrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:482:    JSON.stringify(parsed.triggerPhrases),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:529:        trigger_phrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:616:    ?? normalizeTimestamp(row.created_at ?? row.updated_at);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:643:    upsertActiveProjection(database, logicalKey, memoryId, memoryId, normalizeTimestamp(row.updated_at ?? validFrom));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:678:    // A1/B14: Wrap predecessor UPDATE + lineage INSERT + projection UPSERT in a transaction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:686:      const validFrom = options.validFrom ?? normalizeTimestamp(row.updated_at ?? row.created_at);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:833:  const projection = getActiveProjection(database, buildLogicalKey(memoryRow));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:834:  return projection?.logical_key ?? buildLogicalKey(memoryRow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:872:  const { logicalKey, projection, rows } = lineage;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:911:  const activeVersion = projection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:912:    ? rows.find((row) => row.memory_id === projection.active_memory_id) ?? null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:918:    activeMemoryId: projection?.active_memory_id ?? activeVersion?.memory_id ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:948:  const { projection, rows } = lineage;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:953:  const row = projection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:954:    ? rows.find((candidate) => candidate.memory_id === projection.active_memory_id) ?? null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:988: * Validate lineage chains and active projections for structural drift.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:991: * @returns Integrity report describing missing predecessors and projection drift.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:998:  const projectionMismatches: string[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1027:  const projectionMismatch = database.prepare(`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1029:    FROM active_memory_projection p
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1036:  for (const issue of projectionMismatch) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1037:    projectionMismatches.push(issue.logical_key);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1038:    issues.push(`Active projection ${issue.logical_key} points to non-active memory ${issue.active_memory_id}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1042:    database.prepare('SELECT COUNT(*) AS total FROM active_memory_projection').get() as { total: number }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1055:    projectionMismatches,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1076:    FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1105:        ?? normalizeTimestamp(row.created_at ?? row.updated_at);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1107:        ? normalizeTimestamp(successor.created_at ?? successor.updated_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1146:          ?? normalizeTimestamp(row.created_at ?? row.updated_at);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1148:          ? normalizeTimestamp(successor.created_at ?? successor.updated_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1200:        normalizeTimestamp(latest.updated_at ?? latest.created_at),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1218: * Resolve the active projection row for the lineage that owns a memory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1222: * @returns Active projection row when one exists.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1232:  return lineage.projection;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1335: * @returns Lightweight write-path timing and final projection details.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:15: * Keys align to the guarded `memory_index` columns below.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:70: * Build and execute a dynamic `UPDATE memory_index SET ... WHERE id = ?`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:106:    UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:12:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:92:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:111:  const normalizedQueryId = queryId.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:112:  if (normalizedQueryId.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:116:  if (/\s/.test(normalizedQueryId)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:117:    return normalizedQueryId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:120:  const consumptionMatch = normalizedQueryId.match(/^(?:consumption:)?(\d+)$/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:226:function hasCheckpointScope(scope: CheckpointScopeArgs): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:228:    scope.tenantId !== undefined
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:229:    || scope.userId !== undefined
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:230:    || scope.agentId !== undefined
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:231:    || scope.sharedSpaceId !== undefined
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:235:function requiresCheckpointTenant(scope: CheckpointScopeArgs): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:236:  return scope.tenantId === undefined && (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:237:    scope.userId !== undefined
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:238:    || scope.agentId !== undefined
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:239:    || scope.sharedSpaceId !== undefined
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:245:  scope: CheckpointScopeArgs,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:249:    ...(scope.tenantId !== undefined ? { tenantId: scope.tenantId } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:250:    ...(scope.userId !== undefined ? { userId: scope.userId } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:251:    ...(scope.agentId !== undefined ? { agentId: scope.agentId } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:252:    ...(scope.sharedSpaceId !== undefined ? { sharedSpaceId: scope.sharedSpaceId } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:256:function checkpointMatchesScope(rawMetadata: unknown, scope: CheckpointScopeArgs): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:259:    const expected = scope[field];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:275:function checkpointScopeDetails(scope: CheckpointScopeArgs): Record<string, string> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:277:  if (scope.tenantId !== undefined) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:278:    details.tenantId = scope.tenantId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:280:  if (scope.userId !== undefined) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:281:    details.userId = scope.userId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:283:  if (scope.agentId !== undefined) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:284:    details.agentId = scope.agentId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:286:  if (scope.sharedSpaceId !== undefined) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:287:    details.sharedSpaceId = scope.sharedSpaceId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:300:      reason: 'checkpoint_scope_tenant_required',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:320:  const scope = validateCheckpointScope(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:321:  if (requiresCheckpointTenant(scope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:336:    metadata: mergeCheckpointScopeMetadata(metadata, scope),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:337:    scope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:381:  const scope = validateCheckpointScope(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:382:  if (requiresCheckpointTenant(scope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:394:  const results = checkpoints.listCheckpoints(spec_folder ?? null, limit, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:395:  const filteredResults = hasCheckpointScope(scope)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:396:    ? results.filter((checkpoint) => checkpointMatchesScope(checkpoint.metadata, scope))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:444:  const scope = validateCheckpointScope(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:445:  if (requiresCheckpointTenant(scope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:453:  if (hasCheckpointScope(scope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:454:    const checkpoint = checkpoints.getCheckpoint(name, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:455:    if (checkpoint && !checkpointMatchesScope(checkpoint.metadata, scope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:458:        error: `Checkpoint "${name}" scope mismatch`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:462:          scope: checkpointScopeDetails(scope),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:465:          hint: 'Retry with matching scope values or omit optional scope parameters if you intend to access an unscoped checkpoint.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:466:          actions: ['Use checkpoint_list() with the same scope parameters to discover accessible checkpoints'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:473:  const result = checkpoints.restoreCheckpoint(name, clear_existing, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:492:      triggerMatcher.refreshTriggerCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:537:          'Retry with a narrower scope or clearExisting=true if you intend to replace current state',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:587:  const scope = validateCheckpointScope(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:588:  if (requiresCheckpointTenant(scope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:602:  if (hasCheckpointScope(scope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:603:    const checkpoint = checkpoints.getCheckpoint(name, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:604:    if (checkpoint && !checkpointMatchesScope(checkpoint.metadata, scope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:607:        error: `Checkpoint "${name}" scope mismatch`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:611:          scope: checkpointScopeDetails(scope),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:614:          hint: 'Retry with matching scope values or omit optional scope parameters if you intend to access an unscoped checkpoint.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:615:          actions: ['Use checkpoint_list() with the same scope parameters to discover accessible checkpoints'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:622:  const success: boolean = checkpoints.deleteCheckpoint(name, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:661:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:677:  const normalizedQueryId = typeof queryId === 'string' && queryId.trim().length > 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:680:  const queryText = resolveValidationQueryText(database, normalizedQueryId ?? undefined);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:690:        queryId: normalizedQueryId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:741:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:745:    const normalizedTerms = Array.isArray(queryTerms)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:749:    if (typeof resultRank === 'number' && Number.isFinite(resultRank) && resultRank > 0 && normalizedTerms.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:750:      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:810:// Backward-compatible aliases (snake_case)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:79:    const columns = (db.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:120:          FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:127:          FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:205:          UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:210:          UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:290:          FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:295:          FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:351:            FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:356:            FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:102:    const hasMemoryIndexTable = hasTable(database, 'memory_index');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:123:        LEFT JOIN memory_index m ON m.id = h.memory_id;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:140:  if (hasTable(database, 'memory_index')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:144:        SELECT m.spec_folder FROM memory_index m WHERE m.id = memory_history.memory_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:147:        AND EXISTS (SELECT 1 FROM memory_index m WHERE m.id = memory_history.memory_id)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:161:    'SELECT spec_folder FROM memory_index WHERE id = ? LIMIT 1'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:186:function normalizeHistoryValue(value: unknown): string | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:210:function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:235:  const normalizedOverride = normalizeSpecFolder(override);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:236:  if (normalizedOverride) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:237:    setSpecFolderCache(memoryId, normalizedOverride);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:238:    return normalizedOverride;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:251:  const resolvedFromIndex = normalizeSpecFolder(row?.spec_folder ?? null);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:263:  const resolved = normalizeSpecFolder(historyRow?.spec_folder ?? null);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:316:  const prevValueText = normalizeHistoryValue(prevValue);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:317:  const newValueText = normalizeHistoryValue(newValue);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:318:  const normalizedActor = actor.trim() || 'system';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:334:    normalizedActor,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:421:             SELECT 1 FROM memory_index m
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:6:// SQLite triggers enforce immutability (no UPDATE/DELETE on ledger)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:52:  normalizedPath: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:62:  normalizedPath: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:71:  normalizedPath: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:241: * Verify that append-only triggers exist on the mutation_ledger table.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:242: * Returns true if both UPDATE and DELETE triggers are present.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:245:  const triggers = db.prepare(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:246:    "SELECT name FROM sqlite_master WHERE type = 'trigger' AND tbl_name = 'mutation_ledger'"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:249:  const names = triggers.map(t => t.name);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:258:const DIVERGENCE_RECONCILE_REASON = 'alias_divergence_auto_reconcile';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:259:const DIVERGENCE_RECONCILE_ESCALATION_REASON = 'alias_divergence_auto_reconcile_escalated';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:262:function normalizeMaxRetries(maxRetries?: number): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:269:function normalizePath(value: string): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:273:function normalizeVariants(variants?: string[]): string[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:283:    unique.add(normalizePath(variant));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:288:function getDivergenceReconcileAttemptCount(db: Database.Database, normalizedPath: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:289:  const targetPath = normalizePath(normalizedPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:301:      AND json_extract(decision_meta, '$.normalizedPath') = ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:307:function hasDivergenceEscalationEntry(db: Database.Database, normalizedPath: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:308:  const targetPath = normalizePath(normalizedPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:319:      AND json_extract(decision_meta, '$.normalizedPath') = ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:326:  normalizedPath: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:330:  const boundedMaxRetries = normalizeMaxRetries(maxRetries);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:336:    normalizedPath: normalizePath(normalizedPath),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:351:    normalizedPath: policy.normalizedPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:356:    variants: normalizeVariants(variants),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:366:  const normalizedPath = normalizePath(input.normalizedPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:367:  if (normalizedPath.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:368:    throw new Error('normalizedPath is required for divergence reconciliation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:371:  const maxRetries = normalizeMaxRetries(input.maxRetries);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:373:  const variants = normalizeVariants(input.variants);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:376:    const attemptsSoFar = getDivergenceReconcileAttemptCount(db, normalizedPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:377:    const policy = buildDivergenceReconcilePolicy(normalizedPath, attemptsSoFar, maxRetries);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:384:        new_hash: computeHash(`${normalizedPath}|attempt:${policy.nextAttempt}|max:${policy.maxRetries}`),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:387:          normalizedPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:407:    if (hasDivergenceEscalationEntry(db, normalizedPath)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:420:      new_hash: computeHash(`${normalizedPath}|escalated|attempts:${policy.attemptsSoFar}|max:${policy.maxRetries}`),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:423:        normalizedPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:4:// Feature catalog: Causal edge creation (memory_causal_link)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:35:  caused:       1.3,  // Strong causal link
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:36:  enabled:      1.1,  // Weak causal link
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:103:  edgeId?: number;          // T202: causal_edges.id for unlink workflow
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:146:    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:147:    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:168:    console.warn('[causal-edges] Database not initialized. Server may still be starting up.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:183:  // Fix #26 (FK check) deferred — test environments use synthetic IDs not in memory_index.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:184:  // Implementing FK validation would require seeding memory_index in 20+ causal edge tests.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:190:      console.warn(`[causal-edges] Edge bounds: node ${sourceId} has ${edgeCount} edges (max ${MAX_EDGES_PER_NODE}), rejecting auto edge`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:198:      console.warn('[causal-edges] insertEdge rejected non-finite strength');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:218:        SELECT id, strength FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:223:        INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:227:          evidence = COALESCE(excluded.evidence, causal_edges.evidence)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:231:        SELECT id FROM causal_edges WHERE source_id = ? AND target_id = ? AND relation = ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:250:    console.warn(`[causal-edges] insertEdge error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:296:    console.warn(`[causal-edges] insertEdgesBatch error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:310:    const edgeColumns = (database.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string }>)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:319:      INSERT OR IGNORE INTO causal_edges (${edgeColumns.join(', ')})
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:351:    console.warn(`[causal-edges] bulkInsertEdges error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:373:      SELECT * FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:382:        console.warn(`[causal-edges] touchEdgeAccess failed for edge ${edge.id}: ${e instanceof Error ? e.message : String(e)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:388:    console.warn(`[causal-edges] getEdgesFrom error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:398:      SELECT * FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:407:        console.warn(`[causal-edges] touchEdgeAccess failed for edge ${edge.id}: ${e instanceof Error ? e.message : String(e)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:413:    console.warn(`[causal-edges] getEdgesTo error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:423:      SELECT * FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:432:    console.warn(`[causal-edges] getAllEdges error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:521:        console.warn('[causal-edges] updateEdge rejected non-finite strength');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:543:          'SELECT strength FROM causal_edges WHERE id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:551:        `UPDATE causal_edges SET ${parts.join(', ')} WHERE id = ?`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:573:    console.warn(`[causal-edges] updateEdge error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:583:      'DELETE FROM causal_edges WHERE id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:591:    console.warn(`[causal-edges] deleteEdge error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:603:    DELETE FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:622:    const total = (db.prepare('SELECT COUNT(*) as count FROM causal_edges') as Database.Statement).get() as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:623:    const byRelation = (db.prepare('SELECT relation, COUNT(*) as count FROM causal_edges GROUP BY relation') as Database.Statement).all() as Array<{ relation: string; count: number }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:624:    const avgStrength = (db.prepare('SELECT AVG(strength) as avg FROM causal_edges') as Database.Statement).get() as { avg: number | null };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:625:    const sources = (db.prepare('SELECT COUNT(DISTINCT source_id) as count FROM causal_edges') as Database.Statement).get() as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:626:    const targets = (db.prepare('SELECT COUNT(DISTINCT target_id) as count FROM causal_edges') as Database.Statement).get() as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:642:    console.warn(`[causal-edges] getGraphStats error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:652:      SELECT ce.* FROM causal_edges ce
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:653:      WHERE NOT EXISTS (SELECT 1 FROM memory_index m WHERE CAST(m.id AS TEXT) = ce.source_id)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:654:        OR NOT EXISTS (SELECT 1 FROM memory_index m WHERE CAST(m.id AS TEXT) = ce.target_id)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:658:    console.warn(`[causal-edges] findOrphanedEdges error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:678:    console.warn(`[causal-edges] cleanupOrphanedEdges error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:688: * Create causal relationship chain between spec folder documents.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:692: * @param documentIds Map of document_type -> memory_index.id for documents in the same spec folder
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:763:    console.warn(`[causal-edges] getWeightHistory error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:776:        'SELECT strength FROM causal_edges WHERE id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:811:        'UPDATE causal_edges SET strength = ? WHERE id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:827:    console.warn(`[causal-edges] rollbackWeights error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:840:      SELECT COUNT(*) as count FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:846:    console.warn(`[causal-edges] countEdgesForNode error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:854:    "UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:862:      SELECT * FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:869:    console.warn(`[causal-edges] getStaleEdges error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:12:import * as causalEdges from '../lib/storage/causal-edges.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:17:// Feature catalog: Causal edge creation (memory_causal_link)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:18:// Feature catalog: Causal edge deletion (memory_causal_unlink)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:26:  relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:54:  normalizedReference: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:55:  normalizedLower: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:67:  caused_by: { relation: causalEdges.RELATION_TYPES.CAUSED, reverse: true },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:68:  supersedes: { relation: causalEdges.RELATION_TYPES.SUPERSEDES, reverse: false },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:69:  derived_from: { relation: causalEdges.RELATION_TYPES.DERIVED_FROM, reverse: false },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:70:  blocks: { relation: causalEdges.RELATION_TYPES.ENABLED, reverse: true },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:71:  related_to: { relation: causalEdges.RELATION_TYPES.SUPPORTS, reverse: false }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:94:  const normalizedReference = trimmed.replace(/\\/g, '/');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:95:  const normalizedLower = normalizedReference.toLowerCase();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:101:    normalizedReference,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:102:    normalizedLower,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:103:    escapedLike: escapeLikePattern(normalizedReference),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:105:    isSessionLike: normalizedLower.includes('session') || /^\d{4}-\d{2}-\d{2}/.test(normalizedReference),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:107:      normalizedLower.includes('specs/')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:108:      || normalizedLower.includes('memory/')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:109:      || normalizedReference.includes('/'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:113:function buildPathExactCandidates(normalizedReference: string): string[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:116:  const canonical = getCanonicalPathKey(normalizedReference);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:117:  const trimmedLeadingSlash = normalizedReference.replace(/^\/+/, '');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:119:  candidates.add(normalizedReference);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:122:  if (!normalizedReference.startsWith('/')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:123:    candidates.add(`/${normalizedReference}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:137:  const rows = database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name?: string }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:182:      FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:204:    for (const candidate of buildPathExactCandidates(ref.normalizedReference)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:218:        FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:225:        FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:263:      FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:291:      FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:299:      FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:306:    FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:340:/** Process causal link declarations from a memory file and insert edges into the graph */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:341:function processCausalLinks(database: BetterSqlite3.Database, memoryId: number, causalLinks: CausalLinks): CausalLinksResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:350:  if (!causalLinks || typeof causalLinks !== 'object') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:354:  // Initialize causal-edges module with database connection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:355:  causalEdges.init(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:359:  for (const references of Object.values(causalLinks)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:366:  for (const [link_type, references] of Object.entries(causalLinks)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:373:      console.warn(`[causal-links] Unknown link type: ${link_type}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:387:        console.warn(`[causal-links] Failed to resolve reference "${reference}": ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:402:        causalEdges.insertEdge(edgeSourceId, edgeTargetId, mapping.relation, 1.0, `Auto-extracted from ${link_type} in memory file`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:404:        console.error(`[causal-links] Inserted edge: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:408:          console.error(`[causal-links] Edge already exists: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:411:          console.warn(`[causal-links] Failed to insert edge: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:13:import * as causalEdges from '../lib/storage/causal-edges.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:60:      hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:61:      actions: ['Restart the MCP server', 'Call memory_index_scan()'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:94:    // T2-5 transaction wrapper — wraps single-delete path (memory delete, causal edge
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:115:        causalEdges.init(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:116:        causalEdges.deleteEdgesForMemory(String(numericId));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:149:          FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:191:    causalEdges.init(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:211:          causalEdges.deleteEdgesForMemory(String(memory.id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:250:        latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:44:  'trigger_phrases',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:101:    .prepare('PRAGMA table_info(memory_index)')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:107:      throw new Error(`Cannot downgrade: required v16 column "${col}" not found on memory_index`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:114:    CREATE TABLE memory_index (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:120:      trigger_phrases TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:167:    CREATE INDEX IF NOT EXISTS idx_spec_folder ON memory_index(spec_folder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:168:    CREATE INDEX IF NOT EXISTS idx_created_at ON memory_index(created_at);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:169:    CREATE INDEX IF NOT EXISTS idx_importance ON memory_index(importance_weight DESC);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:170:    CREATE INDEX IF NOT EXISTS idx_embedding_status ON memory_index(embedding_status);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:171:    CREATE INDEX IF NOT EXISTS idx_retry_eligible ON memory_index(embedding_status, retry_count, last_retry_at);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:173:    CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:174:    CREATE INDEX IF NOT EXISTS idx_access_importance ON memory_index(access_count DESC, importance_weight DESC);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:175:    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:176:    CREATE INDEX IF NOT EXISTS idx_channel ON memory_index(channel);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:178:    CREATE INDEX IF NOT EXISTS idx_file_path ON memory_index(file_path);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:179:    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:180:    CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:181:    CREATE INDEX IF NOT EXISTS idx_file_mtime ON memory_index(file_mtime_ms);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:182:    CREATE INDEX IF NOT EXISTS idx_document_type ON memory_index(document_type);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:183:    CREATE INDEX IF NOT EXISTS idx_doc_type_folder ON memory_index(document_type, spec_folder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:184:    CREATE INDEX IF NOT EXISTS idx_quality_score ON memory_index(quality_score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:186:    CREATE INDEX IF NOT EXISTS idx_stability ON memory_index(stability DESC);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:187:    CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:188:    CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:190:    CREATE INDEX IF NOT EXISTS idx_memory_type ON memory_index(memory_type);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:191:    CREATE INDEX IF NOT EXISTS idx_memory_type_decay ON memory_index(memory_type, half_life_days);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:194:      ON memory_index(embedding_status)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:198:      ON memory_index(spec_folder, embedding_status)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:206:      title, trigger_phrases, file_path, content_text,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:207:      content='memory_index', content_rowid='id'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:212:    CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:213:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:214:      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:219:    CREATE TRIGGER IF NOT EXISTS memory_fts_update AFTER UPDATE ON memory_index BEGIN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:220:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:221:      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:222:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:223:      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:228:    CREATE TRIGGER IF NOT EXISTS memory_fts_delete AFTER DELETE ON memory_index BEGIN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:229:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:230:      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:278:      database.exec(`ALTER TABLE memory_index RENAME TO memory_index_v16_backup`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:284:        INSERT INTO memory_index (${columnsCsv})
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:286:        FROM memory_index_v16_backup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:290:      database.exec(`DROP TABLE memory_index_v16_backup`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:306:  const row = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:66:type MemoryTriggersModule = typeof import('./memory-triggers.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:76:type CausalGraphModule = typeof import('./causal-graph.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:80:type SessionResumeModule = typeof import('./session-resume.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:81:type SessionBootstrapModule = typeof import('./session-bootstrap.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:94:let causalGraphModule: Promise<CausalGraphModule> | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:110:    memoryTriggersModule = loadHandlerModule<MemoryTriggersModule>('memory-triggers');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:179:  if (!causalGraphModule) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:180:    causalGraphModule = loadHandlerModule<CausalGraphModule>('causal-graph');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:182:  return causalGraphModule;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:208:    sessionResumeModule = loadHandlerModule<SessionResumeModule>('session-resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:215:    sessionBootstrapModule = loadHandlerModule<SessionBootstrapModule>('session-bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:224:// Memory triggers handlers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:275:export const handle_memory_index_scan = lazyFunction(getMemoryIndexModule, 'handle_memory_index_scan');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:314:export const handle_memory_causal_link = lazyFunction(getCausalGraphModule, 'handle_memory_causal_link');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:315:export const handle_memory_causal_stats = lazyFunction(getCausalGraphModule, 'handle_memory_causal_stats');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:316:export const handle_memory_causal_unlink = lazyFunction(getCausalGraphModule, 'handle_memory_causal_unlink');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:331:// Session resume handler
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:334:// Session bootstrap handler
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:20:  normalizeScopeContext,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:22:} from '../governance/scope-governance.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:27:import { deleteEdgesForMemory } from './causal-edges.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:41:function dedupeRowsById<T extends Record<string, unknown>>(rows: T[]): T[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:67:    'memory_index',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:70:    'working_memory',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:71:    'causal_edges',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:91:    'active_memory_projection',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:109:  'memory_index',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:112:  'working_memory',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:113:  'causal_edges',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:172:  scope?: ScopeContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:206:  causalEdges?: Array<Record<string, unknown>>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:311:  'memory_index', 'memory_fts', 'vec_memories', 'vec_metadata', 'causal_edges',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:315:  'working_memory', 'session_state', 'session_sent_memories', 'session_learning',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:318:  'active_memory_projection', 'auto_entities', 'community_assignments', 'degree_snapshots',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:320:  'learned_feedback_audit', 'learned_trigger_scores', 'learned_trigger_feedback',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:423:function checkpointMetadataMatchesScope(rawMetadata: unknown, scope: ScopeContext): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:424:  const normalizedScope = normalizeScopeContext(scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:425:  if (!hasScopeConstraints(normalizedScope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:431:    (normalizedScope.tenantId === undefined || metadata.tenantId === normalizedScope.tenantId)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:432:    && (normalizedScope.userId === undefined || metadata.userId === normalizedScope.userId)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:433:    && (normalizedScope.agentId === undefined || metadata.agentId === normalizedScope.agentId)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:434:    && (normalizedScope.sharedSpaceId === undefined || metadata.sharedSpaceId === normalizedScope.sharedSpaceId)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:450:  scope: ScopeContext = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:452:  normalizedScope: ScopeContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:456:  const normalizedScope = normalizeScopeContext(scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:457:  if (!hasScopeConstraints(normalizedScope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:459:      normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:465:  const allowedSharedSpaceIds = getAllowedSharedSpaceIds(database, normalizedScope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:467:    normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:469:    predicate: createScopeFilterPredicate<Record<string, unknown>>(normalizedScope, allowedSharedSpaceIds),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:476:  scope: ScopeContext = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:481:  normalizedScope: ScopeContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:483:  const { normalizedScope, allowedSharedSpaceIds, predicate } = getScopeFilterContext(database, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:485:    ? database.prepare('SELECT * FROM memory_index WHERE spec_folder = ?').all(specFolder) as Array<Record<string, unknown>>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:486:    : database.prepare('SELECT * FROM memory_index').all() as Array<Record<string, unknown>>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:493:    normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:500:  scope: ScopeContext = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:502:  return getScopedMemories(database, specFolder, scope).memoryIds;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:508:  scope: ScopeContext = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:513:  const normalizedScope = normalizeScopeContext(scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:521:  if (normalizedScope.tenantId && columns.has('tenant_id')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:523:    params.push(normalizedScope.tenantId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:525:  if (normalizedScope.userId && columns.has('user_id')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:527:    params.push(normalizedScope.userId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:529:  if (normalizedScope.agentId && columns.has('agent_id')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:531:    params.push(normalizedScope.agentId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:533:  if (normalizedScope.sharedSpaceId && columns.has('shared_space_id')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:535:    params.push(normalizedScope.sharedSpaceId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:596:  if (memoryIds.length === 0 || !tableExists(database, 'causal_edges')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:602:    return dedupeRowsById([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:606:          SELECT * FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:614:          SELECT * FROM causal_edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:626:  if (memoryIds.length === 0 || !tableExists(database, 'causal_edges')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:649:    scope?: ScopeContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:653:  const { specFolder, memoryIds, sharedSpaceIds, scope = {}, allowedSharedSpaceIds } = options;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:654:  const normalizedScope = normalizeScopeContext(scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:655:  const hasScope = hasScopeConstraints(normalizedScope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:656:  const scopePredicate = hasScope
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:657:    ? createScopeFilterPredicate<Record<string, unknown>>(normalizedScope, allowedSharedSpaceIds)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:660:  if (tableName === 'memory_index') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:663:        'SELECT * FROM memory_index WHERE spec_folder = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:665:      : database.prepare('SELECT * FROM memory_index').all() as Array<Record<string, unknown>>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:666:    return scopePredicate ? rows.filter((row) => scopePredicate(row)) : rows;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:681:      JOIN memory_index m ON m.id = v.rowid
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:690:  if (tableName === 'causal_edges') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:694:    return hasScope ? [] : database.prepare('SELECT * FROM causal_edges').all() as Array<Record<string, unknown>>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:707:    if (normalizedScope.tenantId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:710:      ).all(normalizedScope.tenantId) as Array<Record<string, unknown>>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:728:      return dedupeRowsById([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:772:    return dedupeRowsById([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:793:  if (!scopePredicate) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:798:    return allRows.filter((row) => scopePredicate(row));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:811:    scope?: ScopeContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:840:    tableSnapshots.memory_index = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:847:    tableSnapshots.working_memory = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:863:  if (Array.isArray(snapshot.causalEdges)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:864:    tableSnapshots.causal_edges = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:865:      columns: Object.keys(snapshot.causalEdges[0] ?? {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:866:      rows: snapshot.causalEdges,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:910:    scope?: ScopeContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:919:    scope = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:922:  const normalizedScope = normalizeScopeContext(scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:923:  const hasScope = hasScopeConstraints(normalizedScope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:934:  const { clauses: scopedClauses, params: scopedParams } = buildRestoreScopeDeleteWhere(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:937:    normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:940:  if (tableName === 'memory_index') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:941:    if (scopedClauses.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:942:      database.prepare(`DELETE FROM memory_index WHERE ${scopedClauses.join(' AND ')}`).run(...scopedParams);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:952:  if (tableName === 'causal_edges') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:992:  if (scopedClauses.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:993:    database.prepare(`DELETE FROM ${tableName} WHERE ${scopedClauses.join(' AND ')}`).run(...scopedParams);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1027:    scope?: ScopeContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1030:  const { checkpointSpecFolder, memoryIds, scope = {} } = options;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1031:  const hasScope = hasScopeConstraints(normalizeScopeContext(scope));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1072:    scope: ScopeContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1107:      CREATE TABLE IF NOT EXISTS working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1122:        FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1126:    const wmColumns = (database.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1129:      database.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1132:      database.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1135:      database.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1138:      database.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1141:      database.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1144:      database.exec('ALTER TABLE working_memory ADD COLUMN redaction_applied INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1193:  const hasMemoryParentId = tableHasColumn(database, 'memory_index', 'parent_id');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1262:function normalizeMemoryColumnValue(column: string, value: unknown): unknown {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1284:  if ((column === 'trigger_phrases' || column === 'quality_flags') && Array.isArray(value)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1295:  const tableColumns = new Set(getTableColumns(database, 'memory_index'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1316:    'trigger_phrases',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1416:    scope = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1424:        memoryIds: scopedMemoryIds,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1426:        normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1427:      } = getScopedMemories(database, specFolder, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1441:          memoryIds: scopedMemoryIds,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1443:          scope: normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1453:      const workingMemorySnapshot = tables.working_memory?.rows ?? [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1454:      const causalEdgesSnapshot = tables.causal_edges?.rows ?? [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1466:        causalEdges: causalEdgesSnapshot,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1487:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1488:          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1489:          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1490:          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1520:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1521:          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1522:          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1523:          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1542:  scope: ScopeContext = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1559:      .filter((row) => checkpointMetadataMatchesScope(row.metadata, scope))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1576:function getCheckpoint(nameOrId: string | number, scope: ScopeContext = {}): CheckpointEntry | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1585:    if (checkpoint && !checkpointMetadataMatchesScope(checkpoint.metadata, scope)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1599:  scope: ScopeContext = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1614:    const checkpoint = getCheckpoint(nameOrId, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1624:    const memorySnapshot = tableSnapshots.memory_index;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1634:    const { normalizedScope, allowedSharedSpaceIds } = getScopeFilterContext(database, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1636:      ? getCurrentScopedMemoryIds(database, checkpointSpecFolder, normalizedScope)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1637:      : getCurrentScopedMemoryIds(database, null, normalizedScope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1638:    const scopedMemoryIdsToReplace = Array.from(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1644:        getScopedMemories(database, null, normalizedScope).memories,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1651:    const edgeIds = getEdgeIds(tableSnapshots.causal_edges?.rows ?? []);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1672:      result.errors.push('No compatible memory_index columns found for restore');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1678:    // Merge mode: INSERT OR REPLACE triggers CASCADE DELETE on working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1679:    // Via the FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1683:          INSERT OR ${clearExisting ? 'REPLACE' : 'IGNORE'} INTO memory_index (${memoryRestoreColumns.join(', ')})
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1691:          UPDATE memory_index SET ${nonIdColumns.map(c => `${c} = ?`).join(', ')}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1696:    // Ensure working_memory table schema is ready BEFORE the transaction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1699:    if (tableSnapshots.working_memory) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1717:            memoryIds: scopedMemoryIdsToReplace,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1718:            scope: normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1727:                memoryIds: scopedMemoryIdsToReplace,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1730:                scope: normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1754:                SELECT id FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1785:                FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1819:            normalizeMemoryColumnValue(column, memory[column as keyof typeof memory])
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1825:          // Apply the snapshot values without triggering CASCADE deletes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1828:              normalizeMemoryColumnValue(column, memory[column as keyof typeof memory])
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1844:        if (tableName === 'memory_index') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1855:          // In merge mode, replace only the in-scope rows captured by the checkpoint.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1859:              memoryIds: scopedMemoryIdsToReplace,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1862:              scope: normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1873:          if (tableName === 'working_memory') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1883:      // Throw to trigger ROLLBACK — this undoes both the DELETEs and partial INSERTs,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1922:function deleteCheckpoint(nameOrId: string | number, scope: ScopeContext = {}): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1926:    const checkpoint = getCheckpoint(nameOrId, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:49:    triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:85:  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:151:      // T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:155:      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:159:            'SELECT title, content_text, trigger_phrases, file_path FROM memory_index WHERE id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:160:          ).get(id) as { title: string | null; content_text: string | null; trigger_phrases: string | null; file_path: string | null } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:208:          triggerPhrases: updateParams.triggerPhrases ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:236:        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:237:        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:249:      latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:263:    hints.push('Run memory_index_scan() to regenerate embeddings');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:75:function normalizeChannels(input?: string[]): AblationChannel[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:245:  const channels = normalizeChannels(args.channels as string[] | undefined);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:276:        triggerPhrases: channelFlags.useTrigger ? undefined : [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:12:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:17:import { normalizeContentForEmbedding } from '../lib/parsing/content-normalizer.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:35:  triggerPhrases: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:52:  triggerPhrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:90:  return cacheContentHash(normalizeContentForEmbedding(content));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:118:  db.prepare(`UPDATE memory_index SET ${setClause} WHERE id = ?`).run(...values, memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:177:      SELECT id FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:198:          SELECT id FROM memory_index WHERE parent_id = ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:226:        triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:293:          chunkEmbedding = await embeddings.generateDocumentEmbedding(normalizeContentForEmbedding(chunk.content));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:313:            triggerPhrases: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:327:            triggerPhrases: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:365:            trigger_phrases: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:407:            SELECT id FROM memory_index WHERE parent_id = ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:465:    triggerMatcher.clearCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:473:      triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:483:      SELECT id FROM memory_index WHERE parent_id = ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:497:        UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:504:        UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:537:          UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:577:      triggerMatcher.clearCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:584:        triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:601:        trigger_phrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:632:  // Otherwise stale trigger/tool-cache entries persist until next non-chunked save.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:633:  triggerMatcher.clearCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:641:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:21:import { handleMemoryMatchTriggers } from './memory-triggers.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:61:// Feature catalog: Dual-scope memory auto-surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:84:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:97:  resumed: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:99:  resumedContextCount: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:121:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:146:  resumed: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:155:  resumeHeuristicApplied: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:649:  // Quick: Fast trigger-based matching for reactive context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:652:    description: 'Fast trigger matching for real-time context (low latency)',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:653:    strategy: 'triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:674:  resume: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:677:    strategy: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:734:    sessionId: options.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:765:    sessionId: options.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:784:  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:787:    query: input || 'resume work continue session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:798:    anchors: resumeAnchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:799:    sessionId: options.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:810:    strategy: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:811:    mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:812:    resumeAnchors: resumeAnchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:827:  // Security: session scope derived from server context, not caller input
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:837:      resumed: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:846:  const resumed = trustedSession.trusted;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:847:  const priorMode = resumed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:850:  const counter = resumed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:857:    resumed,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:875:  const normalizedInput = args.input.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:883:  let resumeHeuristicApplied = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:886:    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedInput);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:894:    if (normalizedInput.length < 50 || /^(what|how|where|when|why)\s/i.test(normalizedInput)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:898:    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:900:      session.resumed ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:901:      session.priorMode === 'resume' ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:904:        normalizedInput.length <= 120 &&
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:905:        /\b(next(?:\s+steps?)?|status|state|blockers|where\b|left off|what changed)\b/i.test(normalizedInput)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:909:      effectiveMode = 'resume';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:910:      resumeHeuristicApplied = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:942:      resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:977:  const normalizedInput = args.input.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:981:      return executeQuickStrategy(normalizedInput, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:984:      return executeDeepStrategy(normalizedInput, args.intent || null, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:986:    case 'resume':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:987:      return executeResumeStrategy(normalizedInput, args.intent || null, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:991:      return executeFocusedStrategy(normalizedInput, args.intent || null, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1127:  const normalizedInput = input.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1142:  if (requested_mode !== 'resume') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1144:      const classification = classifyQueryIntent(normalizedInput);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1161:      // "code-graph-db.ts"). Falls back to first matched keyword, then normalizedInput.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1163:      const inputTokens = normalizedInput.split(/\s+/).filter(t => t.length >= 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1167:        normalizedInput;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1171:          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1186:          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1211:      query: normalizedInput,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1224:    resumed: resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1244:    resumed: resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1246:    resumedContextCount: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1257:    runtimeContextStats.tokenCount = estimateTokens(normalizedInput);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1301:    { ...args, input: normalizedInput },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1305:      resumed: resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1314:    resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1338:    resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1343:    queryHeuristicApplied: resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1347:  const discoveredFolder = maybeDiscoverSpecFolder(options, { ...args, input: normalizedInput });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1357:    currentTask: normalizedInput.slice(0, 500),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1369:      input: normalizedInput,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1425:  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434:  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1436:    if (resumeContextItems.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1437:      sessionLifecycle.resumedContextCount = resumeContextItems.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1461:    normalizedInput,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1497:        resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1525:        query_text: normalizedInput,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1605:// Backward-compatible aliases (snake_case)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:5:// Schema migration for the learned_triggers column.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:7:// ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:13:// Rollback: ALTER TABLE memory_index DROP COLUMN learned_triggers;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:22: * A single learned trigger entry stored in the learned_triggers JSON array.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:39:/** Column name for learned triggers (NOT in FTS5 index) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:40:export const LEARNED_TRIGGERS_COLUMN = 'learned_triggers';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:42:/** Default value for the learned_triggers column */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:50: * Add the learned_triggers column to memory_index if it does not already exist.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:53: * CRITICAL: This column is stored on memory_index only. It is NOT added to
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:55: *   title, trigger_phrases, file_path, content_text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:56: * learned_triggers is deliberately excluded to keep user-generated content
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:65:    const columns = db.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:73:      `ALTER TABLE memory_index ADD COLUMN ${LEARNED_TRIGGERS_COLUMN} TEXT DEFAULT '${LEARNED_TRIGGERS_DEFAULT}'`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:76:    console.warn('[learned-triggers-schema] Migration complete: learned_triggers column added');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:84:    console.error(`[learned-triggers-schema] Migration failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:94: * CRITICAL test: Verify that learned_triggers is NOT present in the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:99: *   title, trigger_phrases, file_path, content_text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:101: * If learned_triggers appears in FTS5, it means user-generated feedback
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:105: * @returns true if isolation is verified (learned_triggers NOT in FTS5)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:106: * @throws Error if learned_triggers IS found in FTS5 (critical violation)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:122:    // Check that learned_triggers does NOT appear in the FTS5 CREATE statement
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:123:    if (createSql.includes('learned_triggers')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:125:        'CRITICAL: learned_triggers found in FTS5 index (memory_fts). ' +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:126:        'This violates data isolation requirements. Learned triggers must ' +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:127:        'ONLY exist in the memory_index.learned_triggers column, never in FTS5.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:137:    console.error(`[learned-triggers-schema] FTS5 isolation check failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:147: * Drop the learned_triggers column from memory_index.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:156:    const columns = db.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:163:    db.exec(`ALTER TABLE memory_index DROP COLUMN ${LEARNED_TRIGGERS_COLUMN}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:164:    console.warn('[learned-triggers-schema] Rollback complete: learned_triggers column removed');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:168:    console.error(`[learned-triggers-schema] Rollback failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:178: * Parse the learned_triggers JSON column value into typed entries.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:181: * @returns Parsed array of learned trigger entries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:203: * Serialize learned trigger entries to JSON for storage.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:205: * @param entries - Array of learned trigger entries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:11:import * as causalEdges from '../lib/storage/causal-edges.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:80:  // Safety: refuse to bulk-delete constitutional or critical tiers without explicit specFolder scope
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:82:    throw new Error(`Bulk delete of "${tier}" tier requires specFolder scope for safety. Use memory_delete for individual deletions.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:108:        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:109:        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:116:  let countSql = 'SELECT COUNT(*) as count FROM memory_index WHERE importance_tier = ?';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:183:  // Fetch IDs for deletion (needed for causal edge cleanup and ledger)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:184:  let selectSql = 'SELECT id, content_hash, file_path, spec_folder FROM memory_index WHERE importance_tier = ?';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:208:  causalEdges.init(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:229:        // Clean up causal edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:231:        // Previously errors were caught and logged, leaving orphan causal edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:233:        causalEdges.deleteEdgesForMemory(String(memory.id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:268:        latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:291:  hints.push(`Run memory_index_scan({ force: true }) to re-index if needed`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:26:  triggerPhrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:52:  reportMode?: 'full' | 'divergent_aliases';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:87:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:93:  triggerCacheCleared: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:48: * Return `true` when the original path already has a committed `memory_index` row.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:282:    // This state and trigger recovery (e.g., re-index from DB or replay the write).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:16:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:22:import * as causalEdges from '../lib/storage/causal-edges.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:44:/** Redact absolute paths: keep only project-relative portion or basename. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:46:  const normalizedPath = toNormalizedPath(absolutePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:47:  if (normalizedPath.startsWith('.opencode/')) return normalizedPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:48:  if (normalizedPath.startsWith('specs/')) return normalizedPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:49:  const opencodeIdx = normalizedPath.indexOf('/.opencode/');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:50:  const specsIdx = normalizedPath.indexOf('/specs/');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:51:  if (opencodeIdx !== -1) return normalizedPath.slice(opencodeIdx + 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:52:  if (specsIdx !== -1) return normalizedPath.slice(specsIdx + 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:54:  const lastSlash = normalizedPath.lastIndexOf('/');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:55:  return lastSlash !== -1 ? normalizedPath.slice(lastSlash + 1) : normalizedPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:86:const DIVERGENT_ALIAS_REPORT_MODE = 'divergent_aliases';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:104:  normalizedPath: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:123:  const normalizedPath = toNormalizedPath(filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:124:  return normalizedPath
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:130:  const normalizedPath = toNormalizedPath(filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:132:    normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:133:    normalizedPath.includes(SPECS_SEGMENT) ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:134:    normalizedPath.startsWith('.opencode/specs/') ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:135:    normalizedPath.startsWith('specs/')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:139:function isDotOpencodeVariantPath(normalizedPath: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:140:  return normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) || normalizedPath.startsWith('.opencode/specs/');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:143:function isSpecsVariantPath(normalizedPath: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:144:  if (isDotOpencodeVariantPath(normalizedPath)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:147:  return normalizedPath.includes(SPECS_SEGMENT) || normalizedPath.startsWith('specs/');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:162:    const normalizedPath = toNormalizedPath(row.file_path);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:163:    const aliasKey = toSpecAliasKey(normalizedPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:164:    let bucket = buckets.get(aliasKey);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:173:      buckets.set(aliasKey, bucket);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:176:    if (isDotOpencodeVariantPath(normalizedPath)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:179:    if (isSpecsVariantPath(normalizedPath)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:183:    bucket.variants.set(normalizedPath, row.content_hash ?? null);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:193:  for (const [normalizedPath, bucket] of buckets.entries()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:206:      normalizedPath: redactPath(normalizedPath),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:214:  groups.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:298:  let aliasConflicts: ReturnType<typeof summarizeAliasConflicts> = summarizeAliasConflicts([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:299:  let aliasRows: AliasConflictDbRow[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:300:  let divergentAliasGroups: DivergentAliasGroup[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:304:      const countResult = database.prepare('SELECT COUNT(*) as count FROM memory_index')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:317:      const aliasSql = `
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:319:        FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:323:      aliasRows = (database.prepare(aliasSql).all(...params) as AliasConflictDbRow[])
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:325:      aliasConflicts = summarizeAliasConflicts(aliasRows);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:326:      divergentAliasGroups = getDivergentAliasGroups(aliasRows, safeLimit);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:334:        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:351:    if (aliasConflicts.divergentHashGroups === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:352:      hints.push('No divergent alias groups detected');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:354:    if (aliasConflicts.divergentHashGroups > divergentAliasGroups.length) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:355:      hints.push(`More divergent alias groups available: increase limit above ${safeLimit}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:360:      summary: `Divergent alias report: ${divergentAliasGroups.length} of ${aliasConflicts.divergentHashGroups} group(s)`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:368:        totalRowsScanned: aliasRows.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:369:        totalDivergentGroups: aliasConflicts.divergentHashGroups,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:370:        returnedGroups: divergentAliasGroups.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:371:        groups: divergentAliasGroups,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:421:    'trigger_cache_refresh',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:457:      const memoryCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:461:          `FTS5 index out of sync: memory_index has ${memoryCountRow.count} rows, memory_fts has ${ftsCountRow.count} rows. ` +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:462:          `Run memory_index_scan with force:true to rebuild FTS5 index.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:470:            triggerMatcher.refreshTriggerCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:471:            repair.actions.push('trigger_cache_refresh');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:477:              hints.push('Auto-repair completed: FTS5 index rebuilt and trigger cache refreshed.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:480:              const warning = `Post-repair mismatch persists: memory_index=${memoryCountRow.count}, memory_fts=${repairedFtsCountRow.count}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:502:  // Never invoked at runtime. Wire it into autoRepair so orphaned causal edges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:506:      // Fix F8 — ensure causal-edges DB init before orphan cleanup.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:507:      causalEdges.init(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:508:      const orphanResult = causalEdges.cleanupOrphanedEdges();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:512:        hints.push(`Auto-repair: removed ${orphanResult.deleted} orphaned causal edge(s)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:562:  if (aliasConflicts.groups > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:563:    hints.push(`Detected ${aliasConflicts.groups} specs/.opencode alias group(s)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:565:  if (aliasConflicts.divergentHashGroups > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:566:    hints.push(`${aliasConflicts.divergentHashGroups} alias group(s) have divergent content hashes`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:581:      aliasConflicts,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:17:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:68:          // Enforce optional specFolder scope before including a candidate file.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:70:            const normalizedSpecFolder = options.specFolder.replace(/\\/g, '/').replace(/\/+$/, '');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:73:              relativePath !== normalizedSpecFolder &&
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:74:              !relativePath.startsWith(`${normalizedSpecFolder}/`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:31:// Backward-compatible aliases (snake_case) — remove after all callers migrate to camelCase
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:21:  causalLinks?: Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:26:  triggers: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:57:function triggerPhrasesChanged(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:74:  triggers: 0.25,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:87: * Compute trigger phrase quality sub-score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:89: * Evaluates whether the memory metadata declares enough trigger phrases for
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:92: *   - 0 phrases  → score 0.0  (memory will never surface via trigger matching)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:97: *   to contain a `triggerPhrases` key whose value is an array of strings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:103:  const triggers = Array.isArray(metadata.triggerPhrases) ? metadata.triggerPhrases : [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:104:  const count = triggers.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:108:    issues.push('No trigger phrases found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:112:    issues.push(`Only ${count} trigger phrase(s) — 4+ recommended`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:262: *   - Unresolved/self causal references       → up to -0.25
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:326:  const causalLinks = metadata.causalLinks && typeof metadata.causalLinks === 'object'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:327:    ? metadata.causalLinks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:332:  const normalizedSelfTargets = new Set(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:338:  if (causalLinks) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:339:    const flattenedReferences = Object.values(causalLinks)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:345:      const selfReferences = flattenedReferences.filter(reference => normalizedSelfTargets.has(reference.toLowerCase()));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:356:        issues.push(`Self-referential causal links found: ${selfReferences.join(', ')}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:359:        issues.push(`Unresolved causal link references: ${unresolvedReferences.join(', ')}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:372: *   - triggers  × 0.25
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:381: *   through to `scoreTriggerPhrases`; must contain a `triggerPhrases` key
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:386: *   - `breakdown` — Per-dimension raw sub-scores (`triggers`, `anchors`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:389: *     in order: triggers → anchors → budget → coherence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:395:  const triggerResult = scoreTriggerPhrases(metadata);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:401:    triggerResult.score * QUALITY_WEIGHTS.triggers +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:409:      triggers: triggerResult.score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:415:      ...triggerResult.issues,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:427: * - Re-extract trigger phrases from content headings/title
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:442:  // Fix #1 : Re-extract trigger phrases if missing/insufficient
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:443:  const hasTriggerIssue = issues.some(i => /trigger phrase/i.test(i));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:445:    const existingTriggers = Array.isArray(fixedMetadata.triggerPhrases)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:446:      ? (fixedMetadata.triggerPhrases as string[])
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:451:      fixedMetadata.triggerPhrases = extracted;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:452:      fixed.push(`Re-extracted ${extracted.length} trigger phrases from content`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:474:    fixedContent = normalizeAnchors(fixedContent);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:482: * Extract trigger phrases from content by scanning headings and the title.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:492:  let triggers: string[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:494:  // Add title as a trigger if present
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:496:    triggers.push(title.trim().toLowerCase());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:499:  // Extract markdown headings as triggers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:504:    if (heading.length > 3 && heading.length < 80 && !triggers.includes(heading)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:505:      triggers.push(heading);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:510:  triggers = triggers.filter(t =>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:514:  return triggers.slice(0, 8); // Cap at 8 triggers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:521:function normalizeAnchors(content: string): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:577: * @param metadata - Parsed memory metadata (must include triggerPhrases)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:658:        fixedTriggerPhrases: triggerPhrasesChanged(metadata.triggerPhrases, currentMetadata.triggerPhrases)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:659:          ? currentMetadata.triggerPhrases as string[]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:684:    fixedTriggerPhrases: triggerPhrasesChanged(metadata.triggerPhrases, bestMetadata.triggerPhrases)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:685:      ? bestMetadata.triggerPhrases as string[]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:742:  normalizeAnchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:11:import * as causalEdges from '../lib/storage/causal-edges.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:12:import type { CausalChainNode, CausalEdge } from '../lib/storage/causal-edges.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:25:// Feature catalog: Causal graph statistics (memory_causal_stats)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:35:  id: number;               // T202: causal_edges.id for unlink workflow
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:103:  tool: 'memory_drift_why' | 'memory_causal_link' | 'memory_causal_stats' | 'memory_causal_unlink',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:338:/** Handle memory_drift_why tool - traces causal relationships for a given memory */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:378:    causalEdges.init(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:381:      const validRelations: string[] = Object.values(causalEdges.RELATION_TYPES) as string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:408:        const forwardTree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'forward');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:409:        const backwardTree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'backward');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:413:        const tree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'forward');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:416:        const tree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'backward');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:432:          FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:451:              FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:484:        summary: `No causal relationships found for memory ${memoryId}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:490:          'Use memory_causal_link to create relationships',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:504:      ? `Found ${combinedChain.total_edges} causal relationships (${relationSummary.join('; ')})`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:505:      : `Found ${combinedChain.total_edges} causal relationships`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:513:        `Traversal truncated after ${combinedChain.truncation_limit ?? causalEdges.MAX_EDGES_LIMIT} edges per node - results may be incomplete`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:557:/** Handle memory_causal_link tool - creates a causal edge between two memories */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:576:      tool: 'memory_causal_link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:581:        validRelations: Object.values(causalEdges.RELATION_TYPES) as string[]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:584:        hint: 'Provide all required parameters to create a causal link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:588:          `relation: One of ${Object.values(causalEdges.RELATION_TYPES).join(', ')}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:603:        tool: 'memory_causal_link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:607:        recovery: getRecoveryHint('memory_causal_link', 'E020'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:611:    causalEdges.init(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:613:    const validRelations = Object.values(causalEdges.RELATION_TYPES) as string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:616:        tool: 'memory_causal_link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:620:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_INVALID_RELATION),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:624:    const safeRelation = relation as causalEdges.RelationType;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:625:    const edge = causalEdges.insertEdge(String(sourceId), String(targetId), safeRelation, strength ?? 1.0, evidence ?? null);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:629:        tool: 'memory_causal_link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:633:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_GRAPH_ERROR),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:639:      tool: 'memory_causal_link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:640:      summary: `Created causal link: ${sourceId} --[${relation}]--> ${targetId}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:647:        'Use memory_causal_stats() to check overall graph coverage'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:653:      'memory_causal_link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:667:/** Handle memory_causal_stats tool - returns graph coverage and health metrics */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:678:        tool: 'memory_causal_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:682:        recovery: getRecoveryHint('memory_causal_stats', 'E020'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:686:    causalEdges.init(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:688:    const stats = causalEdges.getGraphStats();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:689:    const orphanedEdges: CausalEdge[] = causalEdges.findOrphanedEdges();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:692:    const totalMemories = (db.prepare('SELECT COUNT(*) as count FROM memory_index') as import('better-sqlite3').Statement).get() as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:698:        'SELECT DISTINCT source_id FROM causal_edges WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = source_id) UNION SELECT DISTINCT target_id FROM causal_edges WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = target_id)'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:705:      if (message.includes('no such table') && message.includes('causal_edges')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:706:        // New/partially initialized DB where causal edges table is absent.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:725:      hints.push(`Coverage ${coveragePercent}% below 60% target - add more causal links`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:731:      hints.push('No causal links exist yet - use memory_causal_link to create relationships');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:735:      tool: 'memory_causal_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:755:      'memory_causal_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:769:/** Handle memory_causal_unlink tool - deletes a causal edge by ID */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:776:      tool: 'memory_causal_unlink',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:784:          'Use memory_causal_stats() to see graph overview'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:799:        tool: 'memory_causal_unlink',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:803:        recovery: getRecoveryHint('memory_causal_unlink', 'E020'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:807:    causalEdges.init(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:809:    const result: { deleted: boolean } = { deleted: causalEdges.deleteEdge(edgeId) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:812:      ? `Deleted causal edge ${edgeId}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:821:      tool: 'memory_causal_unlink',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:829:      'memory_causal_unlink',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:851:// Backward-compatible aliases (snake_case)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:853:const handle_memory_causal_link = handleMemoryCausalLink;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:854:const handle_memory_causal_stats = handleMemoryCausalStats;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:855:const handle_memory_causal_unlink = handleMemoryCausalUnlink;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:859:  handle_memory_causal_link,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:860:  handle_memory_causal_stats,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:861:  handle_memory_causal_unlink,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:30:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:129: * @param args - Ingest arguments (paths, scope, options)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:173:  const normalizedPaths: string[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:209:    normalizedPaths.push(realPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:230:  const deduplicatedPaths: string[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:234:  for (const normalizedPath of normalizedPaths) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:235:    if (seenPaths.has(normalizedPath)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:240:    seenPaths.add(normalizedPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:241:    deduplicatedPaths.push(normalizedPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:244:  paths = deduplicatedPaths;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:271:        ? ['Duplicate input paths were deduplicated before queueing']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:33:      FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:62:      session_id: input.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:37:import * as causalEdges from '../lib/storage/causal-edges.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:54:} from '../lib/governance/scope-governance.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:81:import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:100:import { resolveMemoryReference } from './causal-links-processor.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:161:  const normalizedContent = content.toLowerCase();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:162:  const hasAnyStandardMarker = STANDARD_MEMORY_TEMPLATE_MARKERS.some((marker) => normalizedContent.includes(marker));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:185:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:189:    causalLinks: parsed.causalLinks,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:226:      const rejectScore = { total: 0, breakdown: { triggers: 0, anchors: 0, budget: 0, coherence: 0 }, issues: [`V-rule hard block: ${failedRuleIds.join(', ')}`] };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:243:          evidenceCounts: { primary: 0, support: 0, total: 0, semanticChars: 0, uniqueWords: 0, anchors: 0, triggerPhrases: 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:267:    parsed.triggerPhrases = qualityLoopResult.fixedTriggerPhrases;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:417:  causalEdges.init(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:421:  causalEdges.insertEdge(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:424:    causalEdges.RELATION_TYPES.SUPERSEDES,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:471:      FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:609:    scope?: MemoryScopeMatch;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:619:    scope = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:643:          triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:707:      scope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:721:      scope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:725:    // NOTE: Content-hash dedup (C5-1) moved inside BEGIN IMMEDIATE transaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:744:          triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:751:              tenantId: scope.tenantId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:752:              userId: scope.userId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:753:              agentId: scope.agentId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:754:              sessionId: scope.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:755:              sharedSpaceId: scope.sharedSpaceId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:800:    }, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:809:      database, parsed, embedding, force, validation.warnings, embeddingStatus, filePath, scope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:827:      scope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:908:    // A4 FIX: Wrap dedup-check + insert in a single transaction for DB-level
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:916:    // C5-1: Content-hash dedup check BEFORE the write transaction — reads are
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:922:    }, scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:934:        scope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:954:            scope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1013:    // POST-INSERT ENRICHMENT: causal links, entities, summaries, entity linking
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1014:    const { causalLinksResult, enrichmentStatus } = await runPostInsertEnrichment(database, id, parsed);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1028:      causalLinksResult,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1043:/** Parse, validate, and index a memory file with PE gating, FSRS scheduling, and causal links */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1050:    scope = {} as MemoryScopeMatch,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1071:    scope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1109:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1140:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1156:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1169:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1179:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1266:    tenantId: governanceDecision.normalized.tenantId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1267:    userId: governanceDecision.normalized.userId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1268:    agentId: governanceDecision.normalized.agentId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1269:    sessionId: governanceDecision.normalized.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1270:    sharedSpaceId: governanceDecision.normalized.sharedSpaceId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1436:      scope: saveScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1468:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1471:        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1477:          FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1500:      // (vec_memories, BM25 index, causal edges, projections, etc.)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1501:      // not just memory_index, to prevent orphaned search phantoms.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1727:        latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1786:// Backward-compatible aliases (snake_case) — only for symbols defined in this module
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:26:  triggerPhrases: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:53:  triggerPhrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:63:/** Find memories with similar embeddings for PE gating deduplication */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:65:  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null, sharedSpaceId = null } = options;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:79:    const scopedMatches: SimilarMemory[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:84:    while (scopedMatches.length < limit) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:101:        // H9 FIX: Filter by sessionId to prevent false duplicate/supersede decisions across sessions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:102:        if (!matchesScopedValue(sessionId, r.session_id)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:107:        scopedMatches.push({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:120:        if (scopedMatches.length >= limit) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:134:    return scopedMatches.slice(0, limit);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:149:      FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:174:      UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:211:      UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:231:/** Append a new immutable version and advance the active projection. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:242:    FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:252:      error: `Memory ${memoryId} not found in memory_index, update had no effect`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:265:      triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:290:      UPDATE memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:318:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:40:} from './memory-index-alias.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:48:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:109:  dedup: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:114:  aliasConflicts: AliasConflictSummary;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:148:/** Handle memory_index_scan tool - scans and indexes memory files with incremental support */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:153:      tool: 'memory_index_scan',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:157:        hint: 'Retry memory_index_scan after checkpoint_restore maintenance completes.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:176:      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:180:    console.warn('[memory_index_scan] Could not verify embedding dimension:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:195:      tool: 'memory_index_scan',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:242:  const dedupDuplicatesSkipped = mergedFiles.length - files.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:243:  if (dedupDuplicatesSkipped > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:244:    console.error(`[memory-index-scan] Canonical dedup skipped ${dedupDuplicatesSkipped} alias path(s) (${mergedFiles.length} -> ${files.length})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:259:          'SELECT spec_folder, file_path FROM memory_index WHERE id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:271:              'mcp:memory_index_scan',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:312:      tool: 'memory_index_scan',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:355:    dedup: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:358:      duplicatesSkipped: dedupDuplicatesSkipped,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:360:    aliasConflicts: { ...EMPTY_ALIAS_CONFLICT_SUMMARY },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:488:  // This is the ONLY place where scan-triggered mtime updates occur.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:506:  // Create causal chains between spec folder documents.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:534:        const { createSpecDocumentChain, init: initCausalEdges } = await import('../lib/storage/causal-edges.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:540:          FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:567:          console.error(`[memory-index-scan] Spec 126: Created ${chainsCreated} causal chain edges across ${foldersProcessed} spec folders`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:585:  results.aliasConflicts = detectAliasConflictsFromIndex();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:586:  results.divergenceReconcile = runDivergenceReconcileHooks(results.aliasConflicts);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:603:  if (results.dedup.duplicatesSkipped > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:604:    hints.push(`Canonical dedup skipped ${results.dedup.duplicatesSkipped} alias path(s)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:606:  if (results.aliasConflicts.groups > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:607:    hints.push(`Detected ${results.aliasConflicts.groups} specs/.opencode alias group(s); no automatic mutation performed`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:609:  if (results.aliasConflicts.divergentHashGroups > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:610:    hints.push(`${results.aliasConflicts.divergentHashGroups} alias group(s) have divergent content hashes`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:613:    hints.push(`Auto-reconcile scheduled for ${results.divergenceReconcile.retriesScheduled} divergent alias sample(s)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:631:    tool: 'memory_index_scan',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:645:              dedupSkipped: dedupDuplicatesSkipped,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:670:// Backward-compatible aliases (snake_case)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:671:const handle_memory_index_scan = handleMemoryIndexScan;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:676:const summarize_alias_conflicts = summarizeAliasConflicts;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:680:  handle_memory_index_scan,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:685:  summarize_alias_conflicts,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:99:      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:127:    const countSql = `SELECT COUNT(*) as count FROM memory_index ${whereClause}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:131:    const sql = `SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight, created_at, updated_at FROM memory_index ${whereClause} ORDER BY ${sortColumn} DESC LIMIT ? OFFSET ?`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:153:    triggerCount: safeJsonParseTyped<unknown[]>(row.trigger_phrases as string, 'array', []).length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:10:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:26:  normalizedPath: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:27:  hashState: 'identical' | 'divergent' | 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:35:  divergentHashGroups: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:48:  normalizedPath: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:73:  divergentHashGroups: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:98:  const normalizedPath = toNormalizedPath(filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:99:  return normalizedPath
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:104:function isDotOpencodeVariantPath(normalizedPath: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:105:  return normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) || normalizedPath.startsWith('.opencode/specs/');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:108:function isSpecsVariantPath(normalizedPath: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:109:  if (isDotOpencodeVariantPath(normalizedPath)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:112:  return normalizedPath.includes(SPECS_SEGMENT) || normalizedPath.startsWith('specs/');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:117:/** Build alias conflict buckets from index rows. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:125:    const normalizedPath = toNormalizedPath(row.file_path);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:126:    const aliasKey = toSpecAliasKey(normalizedPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:127:    let bucket = buckets.get(aliasKey);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:135:      buckets.set(aliasKey, bucket);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:138:    if (isDotOpencodeVariantPath(normalizedPath)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:141:    if (isSpecsVariantPath(normalizedPath)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:144:    bucket.variants.add(normalizedPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:163:  for (const [normalizedPath, bucket] of buckets.entries()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:183:      summary.divergentHashGroups++;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:184:      hashState = 'divergent';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:189:        normalizedPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:204:      FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:229:    FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:243:  for (const [normalizedPath, bucket] of buckets.entries()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:255:      normalizedPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:260:  return candidates.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:266:  aliasConflicts: AliasConflictSummary,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:270:  let reconcileCandidates: DivergenceReconcileCandidate[] = aliasConflicts.samples
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:271:    .filter(sample => sample.hashState === 'divergent')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:273:      normalizedPath: sample.normalizedPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:276:    .sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:278:  // Samples are intentionally capped; when summary says more divergent groups exist,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:280:  if (aliasConflicts.divergentHashGroups > reconcileCandidates.length) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:312:        normalizedPath: sample.normalizedPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:327:      summary.errors.push(`[${sample.normalizedPath}] ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:331:  summary.escalations.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:4:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:27:  let triggerCacheCleared = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:29:    triggerMatcher.clearCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:30:    triggerCacheCleared = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:34:      `[mutation-hooks] triggerMatcher.clearCache failed for operation="${operation}":`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:37:    errors.push(`triggerMatcher.clearCache: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:38:    triggerCacheCleared = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:99:    triggerCacheCleared,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:7:import { handleSessionResume } from './session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:8:import type { CachedSessionSummaryDecision } from './session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:46:  resume: Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:95:  resumeData: Record<string, unknown>,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:101:  if (resumeData.error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:169:  let resumeData: Record<string, unknown> = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:171:    const resumeResponse = await handleSessionResume({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:174:    resumeData = extractData(resumeResponse);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:175:    allHints.push(...extractHints(resumeData));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:178:    resumeData = { error: message };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:194:  // Phase 027: Structural bootstrap contract
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:202:  const cachedSummary = extractCachedSummary(resumeData);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:204:    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:214:  // Record bootstrap telemetry once for the composite call.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:216:  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:219:  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:224:  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:227:  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:228:  if (!resumeData.error && !resumeStructuralTrust) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:238:  const resumeWithTrust = resumeData.error
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:239:    ? resumeData
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:241:      resumeData,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:242:      resumeStructuralTrust,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:248:      key: 'resume-surface',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:250:      content: summarizeUnknown(resumeData),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:252:      certainty: resumeCertainty,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:280:      // which remains valid even when the remote resume surface fails closed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:289:      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:296:    kind: 'bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:299:      { label: 'resume', certainty: resumeCertainty },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:324:    resume: resumeWithTrust,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:331:      bootstrapPayload: payloadContract,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:332:      resumePayload,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:338:    // Keep advisory routing guidance out of nextActions so bootstrap and resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:339:    // remain the authoritative recovery owners for startup and deep resume flows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:52:      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:129:  let triggerCount = 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:136:    const totalResult = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:139:    dates = (database.prepare('SELECT MIN(created_at) as oldest, MAX(created_at) as newest FROM memory_index').get() || { oldest: null, newest: null }) as Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:141:    const triggerResult = database.prepare("SELECT SUM(json_array_length(trigger_phrases)) as count FROM memory_index WHERE trigger_phrases IS NOT NULL AND trigger_phrases != '[]'").get() as Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:142:    triggerCount = (triggerResult && typeof triggerResult.count === 'number') ? triggerResult.count : 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:145:      'SELECT importance_tier, COUNT(*) as count FROM memory_index GROUP BY importance_tier'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:152:      'SELECT MAX(updated_at) as last_indexed FROM memory_index'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:179:      const folderRows = database.prepare('SELECT spec_folder, COUNT(*) as count FROM memory_index GROUP BY spec_folder ORDER BY count DESC').all() as { spec_folder: string; count: number }[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:209:        FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:312:      totalTriggerPhrases: triggerCount,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:101:  // Phase 027: Structural bootstrap contract for health surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:120:    hints.push('Session has not been primed yet. Make any tool call to trigger auto-priming.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:65:import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:89:  deduplicateResults as deduplicateWithSessionState,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:145:  dedupStats: Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:194:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:324:function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:325:  const session = retrievalSessionStateManager.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450:function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:451:  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:454:      dedupStats: { enabled: false, sessionId: null }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:458:  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:461:    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:466:    dedupStats: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:467:      ...dedupStats,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:468:      sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:511:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:535:    tenantId: normalizedScope.tenantId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:536:    userId: normalizedScope.userId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:537:    agentId: normalizedScope.agentId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:538:    sessionId: normalizedScope.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:539:    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:551:    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:555:        error: 'Cursor is invalid, expired, or out of scope',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:586:  let normalizedQuery: string | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:589:      normalizedQuery = validateQuery(query);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:603:      normalizedQuery = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:607:  const hasValidQuery = normalizedQuery !== null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:609:  const effectiveQuery = normalizedQuery ?? (hasValidConcepts ? concepts.join(', ') : '');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:649:    normalizedQuery,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:670:    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery!);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:714:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:720:    normalizedQuery,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:724:    tenantId: normalizedScope.tenantId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:725:    userId: normalizedScope.userId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:726:    agentId: normalizedScope.agentId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:727:    sharedSpaceId: normalizedScope.sharedSpaceId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:744:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:781:      tenantId: normalizedScope.tenantId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:782:      userId: normalizedScope.userId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:783:      agentId: normalizedScope.agentId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784:      sharedSpaceId: normalizedScope.sharedSpaceId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:797:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:835:              FROM memory_index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:886:    if (sessionId && isSessionRetrievalStateEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:889:        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:892:        retrievalSessionStateManager.setAnchors(sessionId, anchors);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:895:      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:986:      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1006:      normalizedQuery,   // REQ-D5-001/D5-004: pass query for recovery + confidence context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1033:          { scopeKey: progressiveScopeKey },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1054:  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1063:      data.results = deduped.results as SessionAwareResult[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1064:      data.count = deduped.results.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1065:      data.sessionDedup = deduped.metadata;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1071:  // Apply session deduplication AFTER cache
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1072:  if (sessionId && enableDedup && sessionManager.isEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1079:        console.warn('[memory-search] Failed to parse cached response for dedup:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1086:    // P1-018 — Validate response shape before dedup. If the cached response
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1087:    // Doesn't have the expected data.results array, log a warning and skip dedup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1088:    // Rather than silently falling through to the un-deduped response.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1095:      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1097:      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1101:      const { results: dedupedResults } = applySessionDedup(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1103:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1108:      const dedupedCount = dedupedResults.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1109:      const filteredCount = originalCount - dedupedCount;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1116:      data.results = dedupedResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1117:      data.count = dedupedCount;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1119:      const dedupStats = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1121:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1123:        returnedCount: dedupedCount,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1129:      resultsData.dedupStats = dedupStats;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1132:        (resultsData.meta as Record<string, unknown>).dedupStats = dedupStats;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1146:  if (sessionId && isSessionRetrievalStateEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1159:        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1162:      data.sessionState = buildSessionStatePayload(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1208:        session_id: sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1275:            sessionId: sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1301:              const normalizedId = String(candidate).trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1302:              if (!normalizedId || normalizedId === 'undefined' || normalizedId === 'null') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1305:              return [normalizedId];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1313:        if (normalizedQuery) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1314:          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1373:// Backward-compatible aliases (snake_case)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:30:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:41:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:46:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:68:  sessionId: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:198:function normalizeSessionId(value: string | null | undefined): string | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:309:    sessionId: session_id = null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:334:  const normalizedSessionId = normalizeSessionId(session_id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:347:  ).get(spec_folder, taskId, normalizedSessionId, normalizedSessionId) as { id: number; phase: string } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:358:        normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:378:            sessionId: normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:407:      normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:428:          sessionId: normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:440:        normalizedSessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:441:          ? `Call task_postflight with taskId: "${taskId}", sessionId: "${normalizedSessionId}" after completing the task`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:467:    sessionId: session_id = null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:491:  const normalizedSessionId = normalizeSessionId(session_id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:500:  if (normalizedSessionId !== null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:502:    params.push(normalizedSessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:515:  if (normalizedSessionId === null && preflightCandidates.length > 1) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:518:      `Multiple open preflight records found for spec_folder="${spec_folder}" and task_id="${taskId}". Provide sessionId to disambiguate postflight.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:523:  if (normalizedSessionId === null && preflightCandidates.length === 0 && completeCandidates.length > 1) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:526:      `Multiple completed learning cycles found for spec_folder="${spec_folder}" and task_id="${taskId}". Provide sessionId to update the intended record.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:536:      normalizedSessionId === null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:538:        : `No preflight record found for spec_folder="${spec_folder}", task_id="${taskId}", session_id="${normalizedSessionId}". Call task_preflight first.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:539:      { specFolder: spec_folder, taskId: taskId, sessionId: normalizedSessionId }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:560:    interpretation = 'Knowledge regression detected - may indicate scope expansion or new complexities discovered';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:615:          sessionId: (preflightRecord.session_id as string | null) ?? normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:663:    sessionId: session_id,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:686:    const normalizedSessionId = normalizeSessionId(session_id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:693:    if (normalizedSessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:695:      params.push(normalizedSessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:719:        sessionId: (row.session_id as string | null) ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:777:      if (normalizedSessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:779:        summaryParams.push(normalizedSessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:871:// Backward-compatible aliases (snake_case)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:8:// Feature catalog: BM25 trigger phrase re-index gate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:24:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:41:// C2 FIX: Import DB access for scope filtering
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:95:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:111:  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:140:      'SELECT * FROM memory_index WHERE id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:158:  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:171:    console.warn('[memory-triggers] getTieredContent failed', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:207:  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:210:  let sessionId: string | undefined = rawSessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:229:    sessionId = trustedSession.effectiveSessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:243:  // Eval logger — capture trigger query at entry (fail-safe)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:249:      intent: 'trigger_match',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:254:  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:263:          scores: memoryIds.map(() => 1.0), // trigger matches are binary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:264:          fusionMethod: 'trigger',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:269:      /* eval logging must never break triggers handler */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:274:    sessionId &&
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:281:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:288:  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:289:  let results: TriggerMatch[] = triggerMatchResult.matches;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:291:  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:299:        const scopeRows = database.prepare(`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:301:          FROM memory_index WHERE id IN (${placeholders})
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:310:        const scopeMap = new Map(scopeRows.map(r => [r.id, r]));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:312:          const row = scopeMap.get(match.memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:314:          // H2 FIX: Require exact scope match — rows with NULL scope are excluded
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:315:          // when the caller specifies a scope, not silently passed through.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:324:    } catch (scopeErr: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:329:  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:330:    ? triggerMatchResult.stats.signals
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:332:  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:337:      summary: 'No matching trigger phrases found',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:339:        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:343:          sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:349:        'Ensure memories have trigger phrases defined',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:351:        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:370:        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:398:    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:450:        triggerPhrases: r.matchedPhrases
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:469:      sessionId: sessionId!,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:496:    : `Matched ${formattedResults.length} memories via trigger phrases`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:499:  if (!useCognitive && sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:510:  const _triggersResponse = createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:514:      matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:524:      triggerSignals: detectedSignals,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:529:  // Consumption instrumentation — log triggers event (fail-safe, never throws)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:536:        event_type: 'triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:540:        session_id: sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:544:  } catch (_error: unknown) { /* instrumentation must never cause triggers handler to fail */ }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:546:  // Eval logger — capture final trigger results at exit (fail-safe)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:547:  const triggerMemoryIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:548:  logFinalTriggerEval(triggerMemoryIds, latencyMs);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:550:  return _triggersResponse;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:561:// Backward-compatible aliases (snake_case)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4:// Phase 020: Composite MCP tool that merges memory resume context,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:81:    | 'scope_mismatch'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:82:    | 'unknown_scope';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:89:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:123:function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:300:  const expectedSpecFolder = normalizeSpecFolder(options.specFolder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:301:  const cachedSpecFolder = normalizeSpecFolder(candidate.lastSpecFolder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:306:        'unknown_scope',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:307:        'A target spec folder was requested, but the cached summary did not carry a scope anchor.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:314:        'scope_mismatch',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:315:        `Cached summary scope ${cachedSpecFolder} did not match requested scope ${expectedSpecFolder}.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:321:      'unknown_scope',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:322:      'Cached summary scope was unknown, so the consumer failed closed instead of guessing.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:360:      scope: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:405:  // Phase 024: Record bootstrap telemetry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:417:        mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:418:        profile: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:471:  // Phase 027: Structural bootstrap contract for resume surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:482:    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:511:      key: 'memory-resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:560:    kind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:591:      resumePayload: payloadContract,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:599:  // Phase 024 / Item 9: Record bootstrap telemetry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts:5:// Uses compiled JS output to avoid cross-project TypeScript rootDir issues.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:19:import { recordGovernanceAudit } from '../lib/governance/scope-governance.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:149:  const normalizedUserId = typeof args.actorUserId === 'string' ? args.actorUserId.trim() : '';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:150:  const normalizedAgentId = typeof args.actorAgentId === 'string' ? args.actorAgentId.trim() : '';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:151:  const hasBlankUser = userIdProvided && normalizedUserId.length === 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:152:  const hasBlankAgent = agentIdProvided && normalizedAgentId.length === 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:153:  const hasUser = normalizedUserId.length > 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:154:  const hasAgent = normalizedAgentId.length > 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:196:    ? { subjectType: 'user', subjectId: normalizedUserId }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:197:    : { subjectType: 'agent', subjectId: normalizedAgentId };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:212:  const normalizedTenantId = typeof tenantId === 'string' ? tenantId.trim() : '';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:214:  if (args.tool !== 'shared_memory_enable' && normalizedTenantId.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:216:      'Tenant scope is required for shared-memory admin mutations.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:219:        error: 'Tenant scope is required for shared-memory admin mutations.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:248:  // Shared-memory tools do not currently receive a server-minted sessionId or
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:313:      return `Only the configured shared-memory admin can create shared space "${spaceId}".`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:323:      return `Membership is required to manage shared space "${spaceId}".`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:329:      return 'Tenant scope is required to manage shared spaces.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:335:function normalizeOwnerAdminDenyReason(reason: string): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:355:          ? 'Authenticate as the configured shared-memory admin before creating a new shared space.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:356:        : 'Use the tenant owner identity for this shared space.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:415:  const normalizedTenantId = typeof tenantId === 'string' && tenantId.trim().length > 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:431:    normalizedTenantId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:432:    normalizedTenantId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:442: * @returns MCP success response describing the saved shared space.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:490:            const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:630: * Persist membership for a user or agent within a shared space.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:665:        const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:747: * Report rollout status and visible shared spaces for the requested scope.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:749: * @param args - Tenant, user, or agent scope to evaluate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:901:- **Spaces** — Named containers for shared memories, scoped to a tenant.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:911:| \`/memory:manage shared create <spaceId> <tenantId> <name>\` | Create or update a shared space; first creator becomes owner |

exec
/bin/zsh -lc 'rg -n "GenerateContext|generate-context|trigger phrases|sessionSummary|memory_save|context save|handover|resume|checklist|specFolder" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:62:| **Retrieval modes** | 5 | auto, quick, deep, focused, resume |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:85:The memory system exposes 47 MCP tools through 4 memory slash commands plus the borrowed recovery workflow in `/spec_kit:resume`. Think of commands as doors into the system. Each door opens access only to the tools it needs.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:93:| `/spec_kit:resume` | Continue or recover an interrupted spec-folder session through the broader memory/session recovery stack | Broad helper surface; primary chain uses 3 shared memory tools |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:189:  "tool": "memory_save",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:570:| `mode` | string | `auto` (default), `quick`, `deep`, `focused`, `resume` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:572:| `specFolder` | string | Narrow results to a specific spec folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:591:    "specFolder": "specs/005-auth",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:605:| `specFolder` | string | Scope resume to a specific spec folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:616:| `specFolder` | string | Scope bootstrap to a specific spec folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:630:| `specFolder` | string | Scope to a folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:649:    "specFolder": "specs/010-db-refactor",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:665:| `specFolder` | string | Scope to a folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:699:##### `memory_save`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:723:  "tool": "memory_save",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:743:| `specFolder` | string | Scope to a folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:771:| `specFolder` | string | Scope to a folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:795:| `id` | number | Memory ID to delete (use OR with specFolder) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:796:| `specFolder` | string | Delete all memories in folder (requires `confirm: true`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:797:| `confirm` | boolean | **Required when using specFolder** |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:809:| `triggerPhrases` | string[] | Updated trigger phrases |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:838:| `specFolder` | string | Scope deletion to a folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:853:| `specFolder` | string | Scope to a folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:864:| `specFolder` | string | Scope to a folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:954:| `specFolder` | string | **Required.** Spec folder for this task |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:972:| `specFolder` | string | **Required.** Must match the preflight call |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1099:| `specFolder` | string | Scope scan to a folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1113:| `specFolder` | string | **Required.** Spec folder to query |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1128:| `specFolder` | string | Associate imported files with a spec folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1330:    "specFolder": "specs/005-auth",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1354:  "tool": "memory_save",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1394:    "specFolder": "specs/022-hybrid-rag-fusion"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1407:    "specFolder": "specs/022-hybrid-rag-fusion",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1437:    "specFolder": "specs/022-hybrid-rag-fusion"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1461:    "specFolder": "specs/022-hybrid-rag-fusion",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1477:    "specFolder": "specs/022-hybrid-rag-fusion",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1543:| Test a save without committing | `memory_save` | Set `dryRun: true` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1581:{ "tool": "memory_save", "arguments": { "filePath": "/path/to/file.md", "dryRun": true } }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1721:**Q: What does the dryRun parameter do on memory_save?**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:62:Usage: node generate-context.js [options] <input>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:66:                    - JSON file mode: node generate-context.js data.json [spec-folder]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:75:  node generate-context.js /tmp/context-data.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:76:  node generate-context.js /tmp/context-data.json specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:77:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:78:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:79:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:88:  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:281:    for (const key of ['specFolder', 'spec_folder', 'SPEC_FOLDER']) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:338:    const specFolderArg = explicitTarget || payloadTarget;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:339:    if (!specFolderArg) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:340:        throw new Error(`${mode} requires a target spec folder via an explicit CLI override or payload specFolder`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:344:        specFolderArg,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:373:        return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:386:        specFolderArg: secondaryArg || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:392:    const specFolderArg = core_1.CONFIG.SPEC_FOLDER_ARG;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:393:    if (!specFolderArg)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:395:    const validation = isValidSpecFolder(specFolderArg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:402:    const inputBaseName = path.basename(specFolderArg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:414:    console.error(`\nError: Invalid spec folder format: ${specFolderArg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:421:            const matches = available.filter((n) => n.includes(path.basename(specFolderArg)) && core_1.SPEC_FOLDER_PATTERN.test(n));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:429:                const targetBase = path.basename(specFolderArg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:490:            console.error('[generate-context] Failed to list spec folders:', errMsg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:493:    console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:504:        core_1.CONFIG.SPEC_FOLDER_ARG = parsed.specFolderArg;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:508:            specFolderArg: core_1.CONFIG.SPEC_FOLDER_ARG ?? undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:546://# sourceMappingURL=generate-context.js.map

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '450,1105p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1458,1735p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I’ve confirmed the earlier sync/export findings are genuinely separate from another cluster of design choices: Engram also bakes in tool-profile partitioning, explicit project normalization/merge ergonomics, and a much narrower startup context formatter. I’m reading those pieces alongside our `session_resume`, `shared-memory`, `memory_search`, and lineage code now to decide which ones are real refactors versus things we should consciously reject.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3190,3415p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go | sed -n '1,220p'; echo '---'; nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   121	}
   122	
   123	// NewWithTransport creates a Syncer with a custom Transport implementation.
   124	// This is used for remote (cloud) sync where chunks travel over HTTP.
   125	func NewWithTransport(s *store.Store, transport Transport) *Syncer {
   126		return &Syncer{
   127			store:     s,
   128			transport: transport,
   129		}
   130	}
   131	
   132	// ─── Export (DB → chunks) ────────────────────────────────────────────────────
   133	
   134	// Export creates a new chunk with memories not yet in any chunk.
   135	// It reads the manifest to know what's already exported, then creates
   136	// a new chunk with only the new data.
   137	func (sy *Syncer) Export(createdBy string, project string) (*SyncResult, error) {
   138		// Pre-flight: ensure the sync directory structure exists for filesystem transports.
   139		// This preserves the original error ordering where "create chunks dir" was the
   140		// first check in Export, before manifest reading.
   141		if sy.syncDir != "" {
   142			chunksDir := filepath.Join(sy.syncDir, "chunks")
   143			if err := os.MkdirAll(chunksDir, 0755); err != nil {
   144				return nil, fmt.Errorf("create chunks dir: %w", err)
   145			}
   146		}
   147	
   148		// Read current manifest (or create empty one)
   149		manifest, err := sy.readManifest()
   150		if err != nil {
   151			return nil, err
   152		}
   153	
   154		// Get known chunk IDs from the store's sync tracking
   155		knownChunks, err := storeGetSynced(sy.store)
   156		if err != nil {
   157			return nil, fmt.Errorf("get synced chunks: %w", err)
   158		}
   159	
   160		// Also consider chunks in the manifest as known
   161		for _, c := range manifest.Chunks {
   162			knownChunks[c.ID] = true
   163		}
   164	
   165		// Export all data from DB
   166		data, err := storeExportData(sy.store)
   167		if err != nil {
   168			return nil, fmt.Errorf("export data: %w", err)
   169		}
   170	
   171		// Filter by project if specified
   172		if project != "" {
   173			data = filterByProject(data, project)
   174		}
   175	
   176		// Get the timestamp of the last chunk to filter "new" data
   177		lastChunkTime := sy.lastChunkTime(manifest)
   178	
   179		// Filter to only new data (created after last chunk)
   180		chunk := sy.filterNewData(data, lastChunkTime)
   181	
   182		// Nothing new to export
   183		if len(chunk.Sessions) == 0 && len(chunk.Observations) == 0 && len(chunk.Prompts) == 0 {
   184			return &SyncResult{IsEmpty: true}, nil
   185		}
   186	
   187		// Serialize and compress the chunk
   188		chunkJSON, err := jsonMarshalChunk(chunk)
   189		if err != nil {
   190			return nil, fmt.Errorf("marshal chunk: %w", err)
   191		}
   192	
   193		// Generate chunk ID from content hash
   194		hash := sha256.Sum256(chunkJSON)
   195		chunkID := hex.EncodeToString(hash[:])[:8]
   196	
   197		// Check if this exact chunk already exists
   198		if _, exists := knownChunks[chunkID]; exists {
   199			return &SyncResult{IsEmpty: true}, nil
   200		}
   201	
   202		// Build manifest entry
   203		entry := ChunkEntry{
   204			ID:        chunkID,
   205			CreatedBy: createdBy,
   206			CreatedAt: time.Now().UTC().Format(time.RFC3339),
   207			Sessions:  len(chunk.Sessions),
   208			Memories:  len(chunk.Observations),
   209			Prompts:   len(chunk.Prompts),
   210		}
   211	
   212		// Write chunk via transport
   213		if err := sy.transport.WriteChunk(chunkID, chunkJSON, entry); err != nil {
   214			return nil, fmt.Errorf("write chunk: %w", err)
   215		}
   216	
   217		// Update manifest
   218		manifest.Chunks = append(manifest.Chunks, entry)
   219	
   220		if err := sy.writeManifest(manifest); err != nil {

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
---
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
   151					cost = 0
   152				}
   153				del := prev[i] + 1
   154				ins := curr[i-1] + 1
   155				sub := prev[i-1] + cost
   156				curr[i] = minOf3(del, ins, sub)
   157			}
   158			prev, curr = curr, prev
   159		}
   160	
   161		return prev[la]
   162	}
   163	
   164	// minOf3 returns the smallest of three integers.
   165	func minOf3(a, b, c int) int {
   166		if b < a {
   167			a = b
   168		}
   169		if c < a {
   170			a = c
   171		}
   172		return a
   173	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '80,110p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    80	| **Access control** | None | Shared spaces with deny-by-default membership and kill switches |
    81	| **Evaluation** | Manual testing | Ablation studies, 12-metric computation (MRR, NDCG), synthetic ground truth corpus |
    82	
    83	### How You Use It
    84	
    85	The memory system exposes 47 MCP tools through 4 memory slash commands plus the borrowed recovery workflow in `/spec_kit:resume`. Think of commands as doors into the system. Each door opens access only to the tools it needs.
    86	
    87	| Command | What It Does | Tool Count |
    88	|---------|-------------|------------|
    89	| `/memory:search` | Search, retrieve and analyze knowledge | 13 tools |
    90	| `/memory:learn` | Create always-surface rules (constitutional memories) | 6 tools |
    91	| `/memory:manage` | Database maintenance, checkpoints, bulk ingestion, shared-memory spaces and memberships | 19 primary tools + 1 helper |
    92	| `/memory:save` | Save conversation context | 4 tools |
    93	| `/spec_kit:resume` | Continue or recover an interrupted spec-folder session through the broader memory/session recovery stack | Broad helper surface; primary chain uses 3 shared memory tools |
    94	
    95	### Requirements
    96	
    97	| Requirement | Minimum | Recommended |
    98	|-------------|---------|-------------|
    99	| Node.js | 18.x | 20.x LTS |
   100	| SQLite | Bundled | Bundled (better-sqlite3) |
   101	| Embedding API | None (HuggingFace local) | Voyage AI (`VOYAGE_API_KEY`) |
   102	| Memory | 512 MB | 1 GB+ |
   103	| Disk | 100 MB | 500 MB (grows with index size) |
   104	
   105	Module/runtime profile in this package:
   106	- `package.json` sets `"type": "module"` (ESM runtime output from `dist/`).
   107	- `tsconfig.json` uses `"module": "nodenext"` and `"moduleResolution": "nodenext"`.
   108	
   109	<!-- /ANCHOR:overview -->
   110	

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Tools
     3	// ───────────────────────────────────────────────────────────────
     4	// Dispatch for L2-L4 memory tools: search, triggers, save,
     5	// List, stats, health, delete, update, validate (T303).
     6	import {
     7	  handleMemorySearch,
     8	  handleMemoryMatchTriggers,
     9	  handleMemorySave,
    10	  handleMemoryList,
    11	  handleMemoryStats,
    12	  handleMemoryHealth,
    13	  handleMemoryDelete,
    14	  handleMemoryUpdate,
    15	  handleMemoryValidate,
    16	  handleMemoryBulkDelete,
    17	} from '../handlers/index.js';
    18	import { validateToolArgs } from '../schemas/tool-input-schemas.js';
    19	
    20	import { parseArgs } from './types.js';
    21	import type {
    22	  MCPResponse,
    23	  SearchArgs,
    24	  TriggerArgs,
    25	  SaveArgs,
    26	  ListArgs,
    27	  StatsArgs,
    28	  HealthArgs,
    29	  DeleteArgs,
    30	  UpdateArgs,
    31	  MemoryValidateArgs,
    32	  BulkDeleteArgs,
    33	} from './types.js';
    34	
    35	function relabelResponseTool(response: MCPResponse, toolName: string): MCPResponse {
    36	  const firstEntry = response?.content?.[0];
    37	  if (!firstEntry || firstEntry.type !== 'text' || typeof firstEntry.text !== 'string') {
    38	    return response;
    39	  }
    40	
    41	  try {
    42	    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
    43	    const meta = envelope.meta && typeof envelope.meta === 'object'
    44	      ? envelope.meta as Record<string, unknown>
    45	      : {};
    46	    envelope.meta = {
    47	      ...meta,
    48	      tool: toolName,
    49	    };
    50	
    51	    return {
    52	      ...response,
    53	      content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
    54	    };
    55	  } catch {
    56	    return response;
    57	  }
    58	}
    59	
    60	/** Tool names handled by this module */
    61	export const TOOL_NAMES = new Set([
    62	  'memory_search',
    63	  'memory_quick_search',
    64	  'memory_match_triggers',
    65	  'memory_save',
    66	  'memory_list',
    67	  'memory_stats',
    68	  'memory_health',
    69	  'memory_delete',
    70	  'memory_update',
    71	  'memory_validate',
    72	  'memory_bulk_delete',
    73	]);
    74	
    75	/** Dispatch a tool call. Returns null if tool name not handled. */
    76	export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
    77	  switch (name) {
    78	    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
    79	    case 'memory_quick_search': {
    80	      // E3: Delegate to memory_search with sensible defaults
    81	      const validated = validateToolArgs('memory_quick_search', args);
    82	      const quickArgs: SearchArgs = {
    83	        query: validated.query as string,
    84	        limit: typeof validated.limit === 'number' ? validated.limit : 10,
    85	        specFolder: validated.specFolder as string | undefined,
    86	        tenantId: validated.tenantId as string | undefined,
    87	        userId: validated.userId as string | undefined,
    88	        agentId: validated.agentId as string | undefined,
    89	        sharedSpaceId: validated.sharedSpaceId as string | undefined,
    90	        autoDetectIntent: true,
    91	        enableDedup: true,
    92	        includeContent: true,
    93	        includeConstitutional: true,
    94	        rerank: true,
    95	      };
    96	      const response = await handleMemorySearch(quickArgs);
    97	      return relabelResponseTool(response, 'memory_quick_search');
    98	    }
    99	    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
   100	    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
   101	    case 'memory_list':           return handleMemoryList(parseArgs<ListArgs>(validateToolArgs('memory_list', args)));
   102	    case 'memory_stats':          return handleMemoryStats(parseArgs<StatsArgs>(validateToolArgs('memory_stats', args)));
   103	    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
   104	    case 'memory_delete':         return handleMemoryDelete(parseArgs<DeleteArgs>(validateToolArgs('memory_delete', args)));
   105	    case 'memory_update':         return handleMemoryUpdate(parseArgs<UpdateArgs>(validateToolArgs('memory_update', args)));
   106	    case 'memory_validate':       return handleMemoryValidate(parseArgs<MemoryValidateArgs>(validateToolArgs('memory_validate', args)));
   107	    case 'memory_bulk_delete':    return handleMemoryBulkDelete(parseArgs<BulkDeleteArgs>(validateToolArgs('memory_bulk_delete', args)));
   108	    default: return null;
   109	  }
   110	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Lifecycle Tools
     3	// ───────────────────────────────────────────────────────────────
     4	// Dispatch for L6-L7 lifecycle tools: index_scan, preflight,
     5	// Postflight, learning_history (T303).
     6	import {
     7	  handleMemoryIndexScan,
     8	  handleMemoryIngestStart,
     9	  handleMemoryIngestStatus,
    10	  handleMemoryIngestCancel,
    11	  handleTaskPreflight,
    12	  handleTaskPostflight,
    13	  handleGetLearningHistory,
    14	  handleEvalRunAblation,
    15	  handleEvalReportingDashboard,
    16	  handleSharedMemoryEnable,
    17	  handleSharedMemoryStatus,
    18	  handleSharedSpaceMembershipSet,
    19	  handleSharedSpaceUpsert,
    20	  handleSessionHealth,
    21	  handleSessionResume,
    22	  handleSessionBootstrap,
    23	} from '../handlers/index.js';
    24	import { validateToolArgs } from '../schemas/tool-input-schemas.js';
    25	
    26	import { parseArgs } from './types.js';
    27	import type {
    28	  MCPResponse,
    29	  ScanArgs,
    30	  PreflightArgs,
    31	  PostflightArgs,
    32	  LearningHistoryArgs,
    33	  EvalRunAblationArgs,
    34	  EvalReportingDashboardArgs,
    35	  IngestStartArgs,
    36	  IngestStatusArgs,
    37	  IngestCancelArgs,
    38	  SharedSpaceMembershipArgs,
    39	  SharedSpaceUpsertArgs,
    40	  SharedMemoryStatusArgs,
    41	  SessionResumeArgs,
    42	  SessionBootstrapArgs,
    43	} from './types.js';
    44	
    45	/** Tool names handled by this module */
    46	export const TOOL_NAMES = new Set([
    47	  'memory_index_scan',
    48	  'task_preflight',
    49	  'task_postflight',
    50	  'memory_get_learning_history',
    51	  'memory_ingest_start',
    52	  'memory_ingest_status',
    53	  'memory_ingest_cancel',
    54	  'eval_run_ablation',
    55	  'eval_reporting_dashboard',
    56	  'shared_space_upsert',
    57	  'shared_space_membership_set',
    58	  'shared_memory_status',
    59	  'shared_memory_enable',
    60	  'session_health',
    61	  'session_resume',
    62	  'session_bootstrap',
    63	]);
    64	
    65	/** Dispatch a tool call. Returns null if tool name not handled. */
    66	export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
    67	  switch (name) {
    68	    case 'memory_index_scan':          return handleMemoryIndexScan(parseArgs<ScanArgs>(validateToolArgs('memory_index_scan', args)));
    69	    case 'task_preflight':             return handleTaskPreflight(parseArgs<PreflightArgs>(validateToolArgs('task_preflight', args)));
    70	    case 'task_postflight':            return handleTaskPostflight(parseArgs<PostflightArgs>(validateToolArgs('task_postflight', args)));
    71	    case 'memory_get_learning_history': return handleGetLearningHistory(parseArgs<LearningHistoryArgs>(validateToolArgs('memory_get_learning_history', args)));
    72	    case 'memory_ingest_start':        return handleMemoryIngestStart(parseArgs<IngestStartArgs>(validateToolArgs('memory_ingest_start', args)));
    73	    case 'memory_ingest_status':       return handleMemoryIngestStatus(parseArgs<IngestStatusArgs>(validateToolArgs('memory_ingest_status', args)));
    74	    case 'memory_ingest_cancel':       return handleMemoryIngestCancel(parseArgs<IngestCancelArgs>(validateToolArgs('memory_ingest_cancel', args)));
    75	    case 'eval_run_ablation':          return handleEvalRunAblation(parseArgs<EvalRunAblationArgs>(validateToolArgs('eval_run_ablation', args)));
    76	    case 'eval_reporting_dashboard':   return handleEvalReportingDashboard(parseArgs<EvalReportingDashboardArgs>(validateToolArgs('eval_reporting_dashboard', args)));
    77	    case 'shared_space_upsert':        return handleSharedSpaceUpsert(parseArgs<SharedSpaceUpsertArgs>(validateToolArgs('shared_space_upsert', args)));
    78	    case 'shared_space_membership_set': return handleSharedSpaceMembershipSet(parseArgs<SharedSpaceMembershipArgs>(validateToolArgs('shared_space_membership_set', args)));
    79	    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
    80	    case 'shared_memory_enable':       return handleSharedMemoryEnable(parseArgs<Record<string, unknown>>(validateToolArgs('shared_memory_enable', args)));
    81	    case 'session_health':             return handleSessionHealth();
    82	    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
    83	    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
    84	    default: return null;
    85	  }
    86	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '400,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '163,245p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts | sed -n '232,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   232	  if (!isTrustedCallerIdentityBindingEnabled()) {
   233	    throwSharedMemoryAuthError(
   234	      'Shared-memory admin mutations require trusted identity binding.',
   235	      createCallerAuthErrorResponse({
   236	        tool: args.tool,
   237	        error: 'Shared-memory admin mutations require trusted identity binding.',
   238	        code: 'E_AUTHORIZATION',
   239	        reason: 'shared_memory_trusted_binding_required',
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
   256	      && actor.subjectId === adminResult.actor.subjectId,
   257	  };
   258	}
   259	
   260	function buildActorScope(

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts | sed -n '199,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   199	function normalizeScopeValue(value: unknown): string | null {
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts | sed -n '828,838p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '288,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '482,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   482	/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
   483	 * @param args - Search arguments (query, concepts, mode, specFolder, etc.)
   484	 * @returns MCP response with ranked search results
   485	 */
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '398,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '330,345p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   330	        console.log(JSON.stringify({ error: 'VALIDATION_ERROR', message: 'Empty --json input' }));
   331	        process.exit(1);
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '515,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3394,3538p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '460,514p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
One more branch I’m checking before I lock the synthesis: whether Engram’s project-drift handling changes the recommendation around our scope model, or whether our existing strict scope hashing already makes that unnecessary. If it doesn’t clearly beat what we have, I’ll mark it as a reject or leave it out rather than force a feature.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '700,725p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '1150,1185p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1166			msg := fmt.Sprintf("Merged %d source(s) into %q:\n", len(result.SourcesMerged), result.Canonical)
  1167			msg += fmt.Sprintf("  Observations moved: %d\n", result.ObservationsUpdated)
  1168			msg += fmt.Sprintf("  Sessions moved:     %d\n", result.SessionsUpdated)
  1169			msg += fmt.Sprintf("  Prompts moved:      %d\n", result.PromptsUpdated)
  1170	
  1171			return mcp.NewToolResultText(msg), nil
  1172		}
  1173	}
  1174	
  1175	// ─── Helpers ─────────────────────────────────────────────────────────────────
  1176	
  1177	// defaultSessionID returns a project-scoped default session ID.
  1178	// If project is non-empty: "manual-save-{project}"
  1179	// If project is empty: "manual-save"
  1180	func defaultSessionID(project string) string {
  1181		if project == "" {
  1182			return "manual-save"
  1183		}
  1184		return "manual-save-" + project
  1185	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Memory Index Alias Conflict Helpers
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	/* ------- 1. DEPENDENCIES ------- */
     6	
     7	import { requireDb, toErrorMessage } from '../utils/index.js';
     8	import * as mutationLedger from '../lib/storage/mutation-ledger.js';
     9	
    10	// Feature catalog: Workspace scanning and indexing (memory_index_scan)
    11	
    12	
    13	/* ------- 2. TYPES ------- */
    14	
    15	const DOT_OPENCODE_SPECS_SEGMENT = '/.opencode/specs/';
    16	const SPECS_SEGMENT = '/specs/';
    17	const MAX_ALIAS_CONFLICT_SAMPLES = 5;
    18	const DIVERGENCE_RECONCILE_ACTOR = 'memory-index-scan';
    19	
    20	interface AliasConflictRow {
    21	  file_path: string;
    22	  content_hash: string | null;
    23	}
    24	
    25	interface AliasConflictSample {
    26	  normalizedPath: string;
    27	  hashState: 'identical' | 'divergent' | 'unknown';
    28	  variants: string[];
    29	}
    30	
    31	export interface AliasConflictSummary {
    32	  groups: number;
    33	  rows: number;
    34	  identicalHashGroups: number;
    35	  divergentHashGroups: number;
    36	  unknownHashGroups: number;
    37	  samples: AliasConflictSample[];
    38	}
    39	
    40	interface AliasConflictBucket {
    41	  hasDotOpencodeVariant: boolean;
    42	  hasSpecsVariant: boolean;
    43	  variants: Set<string>;
    44	  hashes: Set<string>;
    45	}
    46	
    47	interface DivergenceReconcileCandidate {
    48	  normalizedPath: string;
    49	  variants: string[];
    50	}
    51	
    52	export interface DivergenceReconcileSummary {
    53	  enabled: boolean;
    54	  candidates: number;
    55	  retriesScheduled: number;
    56	  escalated: number;
    57	  maxRetries: number;
    58	  escalations: mutationLedger.DivergenceEscalationPayload[];
    59	  errors: string[];
    60	}
    61	
    62	interface DivergenceReconcileHookOptions {
    63	  maxRetries?: number;
    64	  actor?: string;
    65	  requireDatabase?: typeof requireDb;
    66	  reconcileHook?: typeof mutationLedger.recordDivergenceReconcileHook;
    67	}
    68	
    69	export const EMPTY_ALIAS_CONFLICT_SUMMARY: AliasConflictSummary = {
    70	  groups: 0,
    71	  rows: 0,
    72	  identicalHashGroups: 0,
    73	  divergentHashGroups: 0,
    74	  unknownHashGroups: 0,
    75	  samples: [],
    76	};
    77	
    78	export function createDefaultDivergenceReconcileSummary(maxRetries?: number): DivergenceReconcileSummary {
    79	  const boundedMaxRetries = Number.isFinite(maxRetries) && (maxRetries ?? 0) > 0
    80	    ? Math.max(1, Math.floor(maxRetries as number))
    81	    : mutationLedger.DEFAULT_DIVERGENCE_RECONCILE_MAX_RETRIES;
    82	  return {
    83	    enabled: true,
    84	    candidates: 0,
    85	    retriesScheduled: 0,
    86	    escalated: 0,
    87	    maxRetries: boundedMaxRetries,
    88	    escalations: [],
    89	    errors: [],
    90	  };
    91	}
    92	
    93	function toNormalizedPath(filePath: string): string {
    94	  return filePath.replace(/\\/g, '/');
    95	}
    96	
    97	function toSpecAliasKey(filePath: string): string {
    98	  const normalizedPath = toNormalizedPath(filePath);
    99	  return normalizedPath
   100	    .replace(/\/\.opencode\/specs\//g, '/specs/')
   101	    .replace(/^\.opencode\/specs\//, 'specs/');
   102	}
   103	
   104	function isDotOpencodeVariantPath(normalizedPath: string): boolean {
   105	  return normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) || normalizedPath.startsWith('.opencode/specs/');
   106	}
   107	
   108	function isSpecsVariantPath(normalizedPath: string): boolean {
   109	  if (isDotOpencodeVariantPath(normalizedPath)) {
   110	    return false;
   111	  }
   112	  return normalizedPath.includes(SPECS_SEGMENT) || normalizedPath.startsWith('specs/');
   113	}
   114	
   115	/* ------- 3. ALIAS CONFLICT ANALYSIS ------- */
   116	
   117	/** Build alias conflict buckets from index rows. */
   118	function buildAliasBuckets(rows: AliasConflictRow[]): Map<string, AliasConflictBucket> {
   119	  const buckets = new Map<string, AliasConflictBucket>();
   120	  for (const row of rows) {
   121	    if (!row || typeof row.file_path !== 'string' || row.file_path.length === 0) {
   122	      continue;
   123	    }
   124	
   125	    const normalizedPath = toNormalizedPath(row.file_path);
   126	    const aliasKey = toSpecAliasKey(normalizedPath);
   127	    let bucket = buckets.get(aliasKey);
   128	    if (!bucket) {
   129	      bucket = {
   130	        hasDotOpencodeVariant: false,
   131	        hasSpecsVariant: false,
   132	        variants: new Set<string>(),
   133	        hashes: new Set<string>(),
   134	      };
   135	      buckets.set(aliasKey, bucket);
   136	    }
   137	
   138	    if (isDotOpencodeVariantPath(normalizedPath)) {
   139	      bucket.hasDotOpencodeVariant = true;
   140	    }
   141	    if (isSpecsVariantPath(normalizedPath)) {
   142	      bucket.hasSpecsVariant = true;
   143	    }
   144	    bucket.variants.add(normalizedPath);
   145	
   146	    if (typeof row.content_hash === 'string' && row.content_hash.trim().length > 0) {
   147	      bucket.hashes.add(row.content_hash.trim());
   148	    }
   149	  }
   150	  return buckets;
   151	}
   152	
   153	export function summarizeAliasConflicts(rows: AliasConflictRow[]): AliasConflictSummary {
   154	  if (!rows.length) {
   155	    return { ...EMPTY_ALIAS_CONFLICT_SUMMARY };
   156	  }
   157	
   158	  const sortedRows = [...rows].sort((a, b) => a.file_path.localeCompare(b.file_path));
   159	  const buckets = buildAliasBuckets(sortedRows);
   160	
   161	  const summary: AliasConflictSummary = { ...EMPTY_ALIAS_CONFLICT_SUMMARY, samples: [] };
   162	
   163	  for (const [normalizedPath, bucket] of buckets.entries()) {
   164	    if (!bucket.hasDotOpencodeVariant || !bucket.hasSpecsVariant) {
   165	      continue;
   166	    }
   167	
   168	    if (bucket.variants.size < 2) {
   169	      continue;
   170	    }
   171	
   172	    summary.groups++;
   173	    summary.rows += bucket.variants.size;
   174	
   175	    let hashState: AliasConflictSample['hashState'];
   176	    if (bucket.hashes.size === 0) {
   177	      summary.unknownHashGroups++;
   178	      hashState = 'unknown';
   179	    } else if (bucket.hashes.size === 1) {
   180	      summary.identicalHashGroups++;
   181	      hashState = 'identical';
   182	    } else {
   183	      summary.divergentHashGroups++;
   184	      hashState = 'divergent';
   185	    }
   186	
   187	    if (summary.samples.length < MAX_ALIAS_CONFLICT_SAMPLES) {
   188	      summary.samples.push({
   189	        normalizedPath,
   190	        hashState,
   191	        variants: Array.from(bucket.variants).sort(),
   192	      });
   193	    }
   194	  }
   195	
   196	  return summary;
   197	}
   198	
   199	export function detectAliasConflictsFromIndex(): AliasConflictSummary {
   200	  try {
   201	    const database = requireDb();
   202	    const rows = database.prepare(`
   203	      SELECT file_path, content_hash
   204	      FROM memory_index
   205	      WHERE parent_id IS NULL
   206	        AND (
   207	          file_path LIKE '%/.opencode/specs/%'
   208	          OR file_path LIKE '%/specs/%'
   209	          OR file_path LIKE '.opencode/specs/%'
   210	          OR file_path LIKE 'specs/%'
   211	        )
   212	      ORDER BY file_path ASC
   213	    `).all() as AliasConflictRow[];
   214	    return summarizeAliasConflicts(rows);
   215	  } catch (err: unknown) {
   216	    const message = toErrorMessage(err);
   217	    console.warn(`[memory-index-scan] Alias conflict detection skipped: ${message}`);
   218	    return { ...EMPTY_ALIAS_CONFLICT_SUMMARY };
   219	  }
   220	}
   221	
   222	function listDivergentAliasConflictCandidates(
   223	  options: { requireDatabase?: typeof requireDb } = {},
   224	): DivergenceReconcileCandidate[] {
   225	  const getDatabase = options.requireDatabase ?? requireDb;
   226	  const database = getDatabase();
   227	  const rows = database.prepare(`
   228	    SELECT file_path, content_hash
   229	    FROM memory_index
   230	    WHERE parent_id IS NULL
   231	      AND (
   232	        file_path LIKE '%/.opencode/specs/%'
   233	        OR file_path LIKE '%/specs/%'
   234	        OR file_path LIKE '.opencode/specs/%'
   235	        OR file_path LIKE 'specs/%'
   236	      )
   237	    ORDER BY file_path ASC
   238	  `).all() as AliasConflictRow[];
   239	
   240	  const buckets = buildAliasBuckets(rows);

codex
I’ve got enough code evidence for the main architecture calls. I’m doing one quick integrity check on the phase folder and existing research artifacts now so I can avoid recommending a refactor that the phase already captured, then I’ll finalize the iteration report.
exec
/bin/zsh -lc 'for f in spec.md plan.md tasks.md checklist.md decision-record.md research/research.md; do test -f "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/$f" && echo "$f:OK" || echo "$f:MISSING"; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
spec.md:MISSING
plan.md:MISSING
tasks.md:MISSING
checklist.md:MISSING
decision-record.md:MISSING
research/research.md:MISSING

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-009.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'bash /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1416ms:

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main
  Level:  1 (inferred)

───────────────────────────────────────────────────────────────


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh: line 406: cannot create temp file for here document: Operation not permitted

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 0

  RESULT: PASSED


codex
# Iteration 012: GAP ANALYSIS - REFACTORS

## Focus
GAP ANALYSIS - REFACTORS: Should we refactor or change direction on any existing features? Architecture changes?

## Findings
### Finding 1: Public should add an explicit agent-safe tool profile layer instead of relying only on command grouping
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L7), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L53), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L121), [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L85), [memory-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts#L61), [lifecycle-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts#L46)
- **What it does**: Engram has real MCP capability presets: `ProfileAgent`, `ProfileAdmin`, `ResolveTools()`, and core-vs-deferred guidance. Public has command “doors,” but its MCP surface is still a broad internal registry spread across modules rather than a formal runtime profile contract.
- **Why it matters for us**: This is now a refactor target, not just a docs problem. Public’s memory system has reached a size where “available somewhere behind a command” is not the same as “safe/default for agents.” We should expose narrower capability bundles such as `agent-core`, `resume-safe`, and `admin-governed`.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Shared-memory should stay a collaboration/governance subsystem, not become the base for personal continuity sync
- **Source**: [external/internal/sync/sync.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go#L100), [external/internal/sync/sync.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go#L123), [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L232), [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L245)
- **What it does**: Engram’s portability path is decoupled from admin identity flow: sync hangs off a separate `Syncer` plus transport boundary. Public’s shared-memory admin path explicitly requires trusted identity binding and also documents that it lacks a server-minted session principal.
- **Why it matters for us**: This deepens the earlier sync findings. The right refactor is not “extend shared spaces until they also do personal continuity.” That would cross wires between collaboration governance and portability. Shared-memory should remain collaboration-first, while future continuity/sync/export features should sit in a separate subsystem.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Public should add first-class session lifecycle primitives, while keeping `session_resume` and `session_bootstrap` as orchestration wrappers
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L460), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L515), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L542), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L754), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L770), [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md#L40), [lifecycle-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts#L46), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L409), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L168), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L338)
- **What it does**: Engram treats session start, end, and summary as first-class memory mutations backed by explicit store operations. Public’s current lifecycle emphasis is recovery orchestration and explicit save-to-spec-folder flows.
- **Why it matters for us**: We should not replace `session_resume` or `session_bootstrap`; those are stronger recovery aggregators than Engram has. But they are wrappers, not a lifecycle substrate. A small first-class session model would improve compaction survival, session summaries, and future hooks without weakening our broader bootstrap stack.
- **Recommendation**: prototype later
- **Impact**: high

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


hook: Stop
hook: Stop Completed
tokens used
193,878
# Iteration 012: GAP ANALYSIS - REFACTORS

## Focus
GAP ANALYSIS - REFACTORS: Should we refactor or change direction on any existing features? Architecture changes?

## Findings
### Finding 1: Public should add an explicit agent-safe tool profile layer instead of relying only on command grouping
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L7), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L53), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L121), [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L85), [memory-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts#L61), [lifecycle-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts#L46)
- **What it does**: Engram has real MCP capability presets: `ProfileAgent`, `ProfileAdmin`, `ResolveTools()`, and core-vs-deferred guidance. Public has command “doors,” but its MCP surface is still a broad internal registry spread across modules rather than a formal runtime profile contract.
- **Why it matters for us**: This is now a refactor target, not just a docs problem. Public’s memory system has reached a size where “available somewhere behind a command” is not the same as “safe/default for agents.” We should expose narrower capability bundles such as `agent-core`, `resume-safe`, and `admin-governed`.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Shared-memory should stay a collaboration/governance subsystem, not become the base for personal continuity sync
- **Source**: [external/internal/sync/sync.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go#L100), [external/internal/sync/sync.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go#L123), [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L232), [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L245)
- **What it does**: Engram’s portability path is decoupled from admin identity flow: sync hangs off a separate `Syncer` plus transport boundary. Public’s shared-memory admin path explicitly requires trusted identity binding and also documents that it lacks a server-minted session principal.
- **Why it matters for us**: This deepens the earlier sync findings. The right refactor is not “extend shared spaces until they also do personal continuity.” That would cross wires between collaboration governance and portability. Shared-memory should remain collaboration-first, while future continuity/sync/export features should sit in a separate subsystem.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Public should add first-class session lifecycle primitives, while keeping `session_resume` and `session_bootstrap` as orchestration wrappers
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L460), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L515), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L542), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L754), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L770), [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md#L40), [lifecycle-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts#L46), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L409), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L168), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L338)
- **What it does**: Engram treats session start, end, and summary as first-class memory mutations backed by explicit store operations. Public’s current lifecycle emphasis is recovery orchestration and explicit save-to-spec-folder flows.
- **Why it matters for us**: We should not replace `session_resume` or `session_bootstrap`; those are stronger recovery aggregators than Engram has. But they are wrappers, not a lifecycle substrate. A small first-class session model would improve compaction survival, session summaries, and future hooks without weakening our broader bootstrap stack.
- **Recommendation**: prototype later
- **Impact**: high

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
