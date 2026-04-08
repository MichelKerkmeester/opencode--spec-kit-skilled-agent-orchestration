---
title: "Feature Specification: 005-claudest Research Phase"
description: "Read-only 20-iteration research investigation of the Claudest external Claude Code plugin marketplace and the claude-memory plugin (FTS5/BM25 conversation recall, SessionStart context injection, extract-learnings consolidation, get-token-insights observability) to identify adopt/prototype/reject patterns and execution-ready follow-on packet contracts for Code_Environment/Public's Spec Kit Memory and Code Graph stack."
trigger_phrases:
  - "005-claudest research spec"
  - "005-claudest phase spec"
  - "Claudest claude-memory research"
  - "FTS5 BM25 cascade research"
importance_tier: critical
contextType: spec
---
# Feature Specification: 005-claudest Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 5 of `001-research-graph-context-systems` is a read-only audit of the Claudest external Claude Code plugin marketplace (`external/.claude-plugin/marketplace.json`) and its flagship `claude-memory` plugin to translate concrete patterns into actionable improvements for `Code_Environment/Public`. The plugin is studied at function level: the v3 SQLite schema with branch-aware BM25/FTS5 recall, the Stop/SessionStart hook chain that pre-computes branch summaries and injects them into the next session via `hookSpecificOutput.additionalContext`, the `extract-learnings` consolidation pipeline split between `memory-auditor` and `signal-discoverer`, and the `get-token-insights` skill that ingests Claude JSONL session logs into a relational analytics model with embedded HTML dashboard. The deliverable is an evidence-grounded `adopt now` / `prototype later` / `reject` matrix grounded in `external/plugins/...` file:line citations across 20 deep-research iterations, plus packet-ready briefs and an execution-ready follow-on packet roadmap for Public's FTS, analytics, SessionStart, and consolidation seams.

**Key Decisions**: Keep the original 12-iteration cli-codex lineage intact, then reopen the packet in `completed-continue` mode and extend it to 20 total iterations. Generation 1 (iters 1-12) answered the original charter and converted Q10 into a usable handoff package. Generation 2 (iters 13-20) translated those conclusions into implementation-facing contracts: FTS helper scope, forced-degrade tests, Stop-hook metadata patch, normalized analytics replay shape, SessionStart fast-path placement, verifier/discoverer split mapping, token-observability contracts, and a dependency-ordered packet roadmap.

**Critical Dependencies**: cli-codex CLI installed (verified `codex-cli 0.118.0`); `external/` accessible at the spec folder root containing the Claudest checkout; reducer script at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; memory script at `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-06 |
| **Branch** | `main` (research-only phase, no branch needed) |
| **Parent Spec** | `../spec.md` |
| **Predecessor Phase** | `../004-graphify/spec.md` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`Code_Environment/Public` already has Spec Kit Memory MCP (semantic search, intent-aware routing, importance tiers), Code Graph for structural queries, the `024/002` SessionStart hook for source-aware routing, and the `024/003` Stop hook for token snapshots and session summaries. But Public lacks (a) a runtime FTS capability cascade that degrades from FTS5/BM25 → FTS4 → LIKE rather than failing silently when the SQLite build varies, (b) a Stop-time pre-computed `context_summary` cached on per-session state for SessionStart fast-path injection, (c) an explicit auditor-vs-discoverer split in its consolidation flow, and (d) cross-session analytics-grade storage with cache-tier-aware pricing normalization. Without an evidence-grounded survey of how Claudest's `claude-memory` plugin actually implements these patterns at function level, any port would risk importing the wrong patterns or missing the load-bearing implementation nuances.

### Purpose

Produce an evidence-grounded `adopt now` / `prototype later` / `reject` matrix for Claudest patterns in `external/plugins/...`, with every recommendation cited by exact file:line ranges and labeled by evidence type (`source-proven` or `README-level`). Then convert the highest-priority adopt-now lanes into packet-ready implementation briefs that name the closest Public file surfaces, define forced-degrade verification matrices, and specify rollback plans. The matrix must distinguish portable patterns from subsystem dependencies that would force Public to import infrastructure it does not need.

---

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Claudest marketplace structure and discovery model in `external/.claude-plugin/marketplace.json` and per-plugin `external/plugins/*/.claude-plugin/plugin.json`.
- `claude-memory` v3 SQLite schema in `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py`.
- BM25/FTS5 → FTS4 → LIKE recall cascade in `external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py`.
- Chronological browsing in `external/plugins/claude-memory/skills/recall-conversations/scripts/recent_chats.py`.
- SessionStart context injection lifecycle in `external/plugins/claude-memory/hooks/hooks.json`, `hooks/memory-context.py`, `hooks/sync_current.py`, and `hooks/import_conversations.py`.
- Cached-summary fast path and deterministic Python summarizer in `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py`.
- `extract-learnings` consolidation flow in `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` plus `external/plugins/claude-memory/agents/memory-auditor.md` and `external/plugins/claude-memory/agents/signal-discoverer.md` agent contracts.
- `get-token-insights` ingestion in `external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py` and dashboard contract in `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html`.
- Memory hierarchy comparison: Claudest `CLAUDE.md → MEMORY.md → topic files` versus Public's Spec Kit Memory + `generate-context.js` model.
- Plugin versioning and auto-update implementation in marketplace + plugin manifests.
- Continuation charter (iters 8-12): Q10 synthesis matrix, sequencing against existing Public packets, smallest-safe-v1 slicing, packet-ready briefs (FTS cascade + normalized analytics), and uncertainty closeout against Public's `mcp_server/lib/search/sqlite-fts.ts` + `mcp_server/hooks/claude/session-stop.ts`.
- Completed-continue execution charter (iters 13-20): FTS helper contract, forced-degrade verification matrix, Stop-hook transcript identity/cache token patch, normalized analytics replay schema, SessionStart cached-summary placement, verifier/discoverer workflow split, token-observability JSON contracts, and dependency-ordered implementation roadmap.
- Cross-phase boundary with sibling phase `001-claude-optimization-settings` (which extracts Reddit-post audit patterns).

### Out of Scope

- Peripheral Claudest plugin deep dives (`claude-content`, etc.) unless they expose a marketplace-level pattern.
- Generic Claude Code usage tips unrelated to marketplace/memory/observability.
- Installing or executing live plugins or depending on `/plugin` runtime behavior.
- Rewriting `Code_Environment/Public` around Claudest's plugin runtime.
- Restating the audit findings of phase `001-claude-optimization-settings`.
- HTML/CSS/Chart.js presentation layer of `dashboard.html` (data contract only).

---

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements

| ID | Priority | Requirement |
|----|----------|-------------|
| REQ-001 | P0 | Trace Claudest discovery from `external/.claude-plugin/marketplace.json` through per-plugin manifests; classify what is source-proven vs README-only |
| REQ-002 | P0 | Map the v3 SQLite schema in `db.py` (projects/sessions/branches/messages/branch_messages/import_log + `branches_fts`/`messages_fts`) and explain why branch-level aggregation matters for BM25 ranking |
| REQ-003 | P0 | Trace `detect_fts_support()` and the FTS5/FTS4/LIKE cascade in `search_conversations.py` line by line |
| REQ-004 | P0 | Trace the SessionStart hook lifecycle (`hooks.json` → `memory-context.py` → `summarizer.py`) including session selection rules, cached-summary fast path, and `hookSpecificOutput.additionalContext` shape |
| REQ-005 | P0 | Document the `extract-learnings` four-phase consolidation flow and the explicit auditor-vs-discoverer split |
| REQ-006 | P0 | Compare Claudest MEMORY hierarchy against Public's Spec Kit Memory + `generate-context.js` model; identify complementary vs redundant overlaps |
| REQ-007 | P0 | Trace `get-token-insights` ingestion (`MODEL_PRICING`, `_turn_cost()`, `compute_session_analytics()`, cache-cliff detection) end to end |
| REQ-008 | P0 | Enumerate every `dashboard.html` data contract (`trends`, `skill_usage`, `agent_delegation`, `hook_performance`, `findings`, `recommendations`, etc.) without copying the HTML chrome |
| REQ-009 | P0 | Validate that auto-update behavior is `/plugin` runtime owned, not repo-metadata owned |
| REQ-010 | P0 | Synthesize Q10 as an explicit `adopt now` / `prototype later` / `reject` matrix grounded in source citations |
| REQ-011 | P1 | Continuation charter: stress-test sequencing against existing Public packets, define smallest safe v1 per adopt-now lane, write packet-ready briefs for FTS capability cascade + normalized analytics tables, and resolve all open implementation uncertainties against actual Public source |
| REQ-012 | P1 | Land the closeout: confirm whether Public has lower-level FTS capability probe than `memory_fts` table existence and whether `024/003` Stop-hook payload persists transcript identity for normalized replay |

---

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 18 questions (Q1-Q18) answered with source-cited findings across the 20-iteration two-generation run; original charter converged at iter 7 (composite 0.84) and later continuations closed every remaining ambiguity as a packet boundary, contract, or acceptance gate.
- All 5 continuation iterations (8-12) executed via cli-codex gpt-5.4 high in fast mode and produce packet-ready handoff content.
- All 8 completed-continue iterations (13-20) land execution-ready contracts and a dependency-ordered roadmap in `research/research.md` §19.
- Adoption matrix lives in `research/research.md` §13 (original) and §18 (continuation) with every row citing at least one `external/plugins/...` source.
- Two packet-ready briefs (FTS capability cascade + normalized analytics tables) live in `research/research.md` §18.4 with named Public file surfaces, forced-degrade matrices, and rollback plans.
- Cross-phase boundary with sibling phase `001-claude-optimization-settings` is bounded explicitly.
- Memory artifact saved with `critical` importance tier and clean trigger phrases.
- `validate.sh --strict` returns RESULT: PASSED.
- No edits made under `external/`.

---

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Risks

| ID | Risk | Mitigation |
|----|------|-----------|
| R-001 | Reducer overwrites analyst-owned strategy sections | Re-add Q1-Q18 summaries to KEY QUESTIONS and ANSWERED QUESTIONS sections after each reducer run |
| R-002 | Validator infers wrong level for research phase folder | Declare `<!-- SPECKIT_LEVEL: 3 -->` explicitly in spec.md |
| R-003 | README claims (e.g., auto-update flow) quoted as truth without source verification | Iter 1 explicitly distinguishes README-level vs source-proven evidence; auto-update flagged as `/plugin` runtime owned |
| R-004 | Continuation iterations duplicate iter 1-7 work | Reducer-managed `EXHAUSTED APPROACHES` section tracks blocked directions; iters 8-12 prompts include explicit avoid-list of synthesized topics |
| R-005 | Packet-ready briefs leak speculation past actual Public source | Iter 12 specifically resolves uncertainties by reading `mcp_server/lib/search/sqlite-fts.ts` and `mcp_server/hooks/claude/session-stop.ts` directly |

### Dependencies

- `external/` directory containing the Claudest checkout (already cloned at phase folder root).
- cli-codex CLI v0.118.0+ for iteration dispatch.
- Reducer script `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` for state file maintenance.
- Memory script `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` for memory artifact generation.
- Validator script `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` for spec compliance.
- Public packets `023/013` (FTS5 fix), `024/002` (SessionStart hook), `024/003` (Stop hook tracking), `022/008` (signal extraction) — referenced as substrate dependencies in the sequencing analysis.

---

## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Priority | Requirement |
|----|----------|-------------|
| NFR-001 | P0 | Every finding must cite exact `external/plugins/...` paths with line ranges; line numbers must be verified against actual source rather than guessed |
| NFR-002 | P0 | README claims must be flagged as `README-level` and cross-checked against source/fixtures before being used |
| NFR-003 | P0 | No edits under `external/`; the directory is read-only per phase charter |
| NFR-004 | P1 | cli-codex iterations must use `--model gpt-5.4 -c model_reasoning_effort="high" --full-auto --sandbox workspace-write` per the user-approved fast-mode configuration |
| NFR-005 | P1 | Iteration files must follow the standard finding template with Source, Evidence type, Recommendation labels in every finding |

---

## 8. EDGE CASES

- **Codex CLI sandbox=workspace-write succeeds where sandbox=read-only would have failed.** Unlike phase 002-codesight, this phase used `--sandbox workspace-write` per the user-approved delegation override in `deep-research-config.json`, so codex agents wrote iteration files directly without the stdout-extraction workaround.
- **README claim contradicts source.** When a README claim about plugin marketplace auto-update could not be reproduced from `external/.claude-plugin/marketplace.json` or `external/plugins/*/.claude-plugin/plugin.json`, the finding is labeled `README-level` and the reject recommendation is grounded in the absence of update metadata in the JSON manifests.
- **Plugin layer file does not exist.** When the plugin-local CLAUDE file under `external/plugins/claude-memory/` was requested for the memory hierarchy comparison but did not exist in the checkout, the finding documented the gap and reconstructed the layer model from the plugin README plus `external/plugins/claude-memory/skills/extract-learnings/SKILL.md`.
- **Convergence triggered before continuation request.** The original charter converged at iter 7 (composite 0.84) and emitted a `synthesis_complete` event. The user explicitly requested 5 more iterations to deepen the synthesis (matrix → sequencing → slicing → briefs → closeout), and a `continuation_requested` event captures the new max iterations (12).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score (1-10) | Rationale |
|-----------|--------------|-----------|
| Surface area | 7 | 1 marketplace manifest, 8 plugin manifests, ~10 claude-memory subsystem files, 1 token-insights skill, 5 hook scripts, comparison against 4 prior Public packets |
| Inter-module coupling | 6 | claude-memory recall + hooks + extract-learnings are coupled by the SQLite schema; get-token-insights is a separate skill |
| External dependencies | 2 | Claude Code `/plugin` runtime is referenced but not exercised; cli-codex is the only hard external CLI |
| Documentation discipline | 6 | README and source mostly agree; auto-update and a few hierarchy claims diverge in measurable ways |
| Total complexity | 6 | Mid-high; a 20-iteration, two-generation loop spans marketplace, hooks, analytics, consolidation, and Public integration seams, but still converges cleanly into a bounded packet train |

---

## 10. RISK MATRIX

| Risk ID | Likelihood | Impact | Mitigation status |
|---------|-----------|--------|-------------------|
| R-001 (reducer overwrite) | High | Low | Mitigated via post-reducer re-add of analyst sections |
| R-002 (wrong level inference) | High | Low | Mitigated via explicit `<!-- SPECKIT_LEVEL: 3 -->` |
| R-003 (README quoted as truth) | High | High | Mitigated via explicit `README-level` evidence labeling |
| R-004 (continuation duplicates iter 1-7) | Medium | Medium | Mitigated via avoid-list in continuation prompts and reducer-managed exhausted approaches |
| R-005 (briefs leak speculation) | Medium | High | Mitigated via iter 12 source-level uncertainty resolution against actual Public source files |

---

## 11. USER STORIES

### US-001: Researcher needs `adopt / prototype / reject` guidance for Claudest patterns

**As a** Code_Environment/Public maintainer planning the next FTS or analytics packet
**I want** an evidence-grounded matrix of Claudest's portable patterns and known infrastructure dependencies
**So that** I can adopt the high-leverage low-risk patterns without inheriting the marketplace runtime, the parallel MEMORY hierarchy, or the plugin-specific HTML/CSS/Chart.js dashboard chrome

**Acceptance**: research/research.md §13 and §18 contain the synthesis matrix where every row cites exact `external/plugins/...` line ranges and labels evidence type and recommendation tier.

### US-002: Researcher needs packet-ready implementation briefs

**As a** Code_Environment/Public maintainer about to open the first follow-on packet
**I want** named Public file surfaces, forced-degrade verification matrices, and rollback plans grounded in source
**So that** I can move directly from research to packet creation without re-deriving the implementation seam

**Acceptance**: research/research.md §18.4 contains Brief A (FTS capability cascade) and Brief B (normalized analytics tables), each with goal/non-goal/contract/forced-degrade matrix/rollback/risks/uncertainty resolution.

### US-003: Researcher needs to bound cross-phase overlap

**As a** Code_Environment/Public maintainer working across sibling research phases
**I want** explicit boundaries between `005-claudest` (implementation side) and `001-claude-optimization-settings` (Reddit-audit pattern side)
**So that** synthesis time across phases does not duplicate work or import overlapping conclusions

**Acceptance**: research/research.md §14 and §15 explicitly assign implementation-side analysis to 005, leaves audit-pattern analysis to 001, and notes shared substrates without duplicating findings.

### Acceptance Scenarios

**Scenario 1 (REQ-001/REQ-009 — Source-vs-README discipline)**
- **Given** the Claudest marketplace and per-plugin manifests are in scope
- **When** iteration 1 traces discovery and versioning
- **Then** the iteration file labels auto-update as `/plugin` runtime behavior with `README-level` evidence and labels per-plugin manifest contents as `source-proven`

**Scenario 2 (REQ-003 — FTS cascade trace)**
- **Given** `search_conversations.py` is in scope
- **When** iteration 2 traces the cascade
- **Then** the iteration file documents the FTS5 BM25 ranking branch, the FTS4 MATCH+recency branch, and the LIKE %term% branch with line citations and explicit query rewriting rules

**Scenario 3 (REQ-004 — SessionStart hook lifecycle)**
- **Given** `hooks.json`, `memory-context.py`, and `summarizer.py` are in scope
- **When** iteration 3 traces the lifecycle
- **Then** the iteration file documents the `select_sessions()` selection policy (`clear` vs `startup`), the cached-summary fast path with `_CANDIDATE_QUERY`, the `hookSpecificOutput.additionalContext` injection shape, and the deterministic Python summarizer

**Scenario 4 (REQ-010 — Q10 synthesis matrix)**
- **Given** all 7 original-charter iterations are complete and answered Q1-Q9
- **When** iteration 8 synthesizes Q10
- **Then** the iteration file produces a 9-track adopt/prototype/reject matrix with each track grounded in prior-iteration findings and applies the explicit simplification bonus for closing the last open question

**Scenario 5 (REQ-011 — Continuation charter dispatch)**
- **Given** the user requests "5 more iterations of /spec_kit:deep-research with gpt-5.4 high agents in fast mode through cli-codex"
- **When** the orchestrator dispatches iters 8-12
- **Then** all 5 iterations dispatch via cli-codex with `--full-auto --sandbox workspace-write` and produce iteration files with line-cited findings

**Scenario 6 (REQ-012 — Uncertainty closeout)**
- **Given** Brief A and Brief B contain implementation uncertainties about Public's lower-level FTS probe and `024/003` payload shape
- **When** iteration 12 reads Public's actual `mcp_server/lib/search/sqlite-fts.ts` and `mcp_server/hooks/claude/session-stop.ts`
- **Then** the iteration file reports exactly which fields exist, what is missing, and the precise code/spec changes needed for each upcoming packet

---

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None — all 18 questions (Q1-Q18) answered. See `research/research.md` §13 for the original synthesis, §18 for the first continuation (matrix → sequencing → slicing → briefs → closeout), and §19 for the execution-ready continuation roadmap.

---

## RELATED DOCUMENTS

- `research/research.md` — canonical synthesis (19 sections including continuation §18.1 through §18.5 and execution-ready roadmap §19)
- `research/iterations/iteration-001.md` through `research/iterations/iteration-020.md` — per-iteration findings
- `research/deep-research-strategy.md` — analyst + reducer strategy file
- `research/deep-research-dashboard.md` — reducer-generated dashboard
- `plan.md` — implementation plan
- `tasks.md` — task tracking
- `implementation-summary.md` — outcome summary
- `memory/06-04-26_19-56__completed-a-12-iteration-deep-research-audit-of.md` — generation-1 synthesis memory artifact (12-iteration snapshot, importance_tier=critical, indexed via Voyage 768-dim embeddings as memory #1845)
- `memory/08-04-26_08-18__extended-the-005-claudest-deep-research-packet.md` — generation-2 continuation memory artifact (20-iteration extension summary, persisted under the current write-only indexing policy)


<!-- /ANCHOR:questions -->
