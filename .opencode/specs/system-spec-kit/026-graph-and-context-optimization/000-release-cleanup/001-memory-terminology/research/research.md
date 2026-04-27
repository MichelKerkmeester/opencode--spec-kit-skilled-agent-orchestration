---
title: "Deep Research: Memory→Continuity Terminology Rename"
description: Compiled from 10 iterations of /spec_kit:deep-research (sessionId e3fb01be-3a22-481a-be85-76d57a297857). All 10 strategy.md key questions answered with primary-source citations; 0 fundamental contradictions; 5 implementation risks with concrete mitigations; STOP_ALLOWED.
sessionId: e3fb01be-3a22-481a-be85-76d57a297857
generation: 1
iterationsCompleted: 10
stopReason: converged
---

# Deep Research: Memory→Continuity Terminology Rename

## §1 Executive Summary

The system-spec-kit's "memory" vocabulary overloads six distinct concept layers and ~270+ identifiers, creates a future naming clash with Anthropic's Claude Memory tool, and confuses operators on first read of `/memory:save`. Ten autonomous research iterations converged on a **single `continuity_*` axis** rename, scoped via a **6-row layer-based contract** (L1 SQL tables stay; L2 markdown stays; L3 frontmatter renames in templates with parser-fallback for the 1,916-file corpus; L4 ladder phrase rewrites in 5 files; L5 21 MCP tools rename with **3-tier deprecation alias matrix** — T1 permanent / T2 2-release / T3 1-release; L6 cognitive subsystem carves out FSRS / Miller's-Law literature loanwords, with 5 conditional identifiers locked to L1=NO-ACTION). Implementation lands as a **linear 4-PR chain** (parser → tools → templates+glossary → triad+cognitive). Two HIGH-severity risks (parser atomicity across 6 sites; cross-repo `AGENTS_Barter.md` symlink) have concrete mitigations. The verdict is differentiated and defensible against the OSS ecosystem (LangChain dissolved, LlamaIndex avoids "memory", MCP-registry has reference `memory` server, Cursor + Letta partition differently).

## §2 Research Charter

- **Topic**: Memory terminology rename across system-spec-kit (six conflated concept layers, ~270 references, Anthropic Claude Memory clash)
- **Key questions (10)**: Q1 single vs per-layer naming, Q2 alias window length, Q3 rename surface (SQL or public-API only), Q4 `_memory.continuity` migration path, Q5 glossary contract, Q6 Anthropic positioning callout, Q7 FSRS / cognitive-science loanwords, Q8 concept-layer mapping, Q9 21-tool blast radius, Q10 OSS precedent
- **Non-goals**: behavior changes; schema changes (beyond table-name rename); retrieval-algorithm changes; renaming the parent 026 phase folder; rewriting historical `.opencode/specs/**` docs; choosing exact replacement strings during research (deferred to implementation phase)
- **Stop conditions**: 10 iterations cap; all 10 questions answered; composite convergence (rolling-avg newInfoRatio < 0.05 over 3+ evidence iters AND graph_decision STOP_ALLOWED); 3 consecutive stuck iterations trigger recovery

## §3 Concept Layer Mapping (6-layer model)

The "memory" token spans six distinct concept layers, verified against MCP-server / SQL-schema / template / runtime-config primary sources [iter-1 #6]:

| Layer | One-line definition | Current `memory_*` identifiers | Anthropic clash | Decision |
|---|---|---|---|---|
| **L1: Storage substrate** | SQLite + sqlite-vec + FTS5 + BM25 + causal graph + FSRS state | 8 SQL tables (`memory_index`, `memory_conflicts`, `memory_corrections`, `memory_fts`, `memory_summaries`, `memory_entities`, `memory_lineage`, `vec_memories`) + storage handlers in `mcp_server/lib/storage/` and `mcp_server/lib/search/` | Low (tables not user-facing) | NO-ACTION |
| **L2: Canonical spec-doc markdown** | spec/plan/tasks/implementation-summary/decision-record/handover docs at packet root | None — markdown files have no `memory_*` identifiers | None | NO-ACTION (prose label only) |
| **L3: Generated metadata + frontmatter** | description.json, graph-metadata.json, `_memory.continuity` YAML key | `_memory.continuity` YAML key in 9 templates + 1,916 existing files | Medium | RENAME (templates) + ALIAS (parser-fallback for corpus) |
| **L4: Session resume / recovery surfaces** | `/spec_kit:resume`, `session_bootstrap`, `session_health`, the `handover.md → _memory.continuity → spec docs` ladder | Verbatim ladder phrase in 5 templates | Low | RENAME (5 string-literal sites) |
| **L5: Hybrid retrieval pipeline + 21 MCP tools** | 5-channel fusion + CocoIndex bridge + 21 public `memory_*` tools | 21 MCP tools, 17 `memory-*.ts` handlers, 4 `/memory:*` slash commands, `references/memory/`, `scripts/dist/memory/` | High | RENAME with 3-tier alias matrix |
| **L6: Constitutional / always-surface rules** | `/memory:learn` slash command, never-decaying tier, 3.0× search boost; cognitive subsystem (FSRS, Miller's-Law, spreading activation) | `/memory:learn` (1 cmd) + 12 cognitive-science loanwords + 5 conditional identifiers | Medium (slash cmd); None (literature) | PARTIAL RENAME + CARVE-OUT |

## §4 Open Questions Resolution (Q1–Q10)

| Q | Verdict | Citation |
|---|---|---|
| **Q1** Single vs per-layer naming | **Single `continuity_*` axis** (per-layer split deferred to glossary footnote citing Cursor precedent) | iter-1 #7, iter-5 #4, iter-5 #7 |
| **Q2** Alias window length | **3-tier matrix**: T1 (4 tools) permanent; T2 (4 tools) 2-release; T3 (13 tools) 1-release | iter-2 #1, iter-2 #8 |
| **Q3** Rename SQL tables vs public-API only | **6-row scope-frozen contract**: L1 NO-ACTION; rename surface tier-stratified | iter-2 #9, iter-5 #8 |
| **Q4** `_memory.continuity` migration path | **Parser-fallback dominant** (5 const sites + 1 regex extractor; 1,916-file corpus covered without rewrite) | iter-3 #1–#5 |
| **Q5** Glossary contract | **Greenfield** `references/glossary.md` + `glossary-drift-lint.ts` validator + DR cross-linking | iter-3 #6, #7, #8 |
| **Q6** Anthropic positioning callout | **3 surfaces**: top README BRIEF + mcp_server README BALANCED + glossary §0 DEFENSIVE; balanced text mentions BOTH Anthropic Claude Memory AND MCP reference `memory` server | iter-4 #1–#4, iter-5 #3, iter-8 #1 |
| **Q7** FSRS / cognitive-science loanwords | **Structural carve-out** of `mcp_server/lib/cognitive/`: ~12 KEEP literature loanwords, ~5 CONDITIONAL (default KEEP, locked to L1=NO-ACTION), ~10 doc-line edits | iter-4 #5–#9, iter-8 #2 |
| **Q8** Concept-layer mapping | **6-layer model verified** against MCP-server primary sources | iter-1 #6 |
| **Q9** 21-tool blast radius | **21 public `memory_*` tools** (not 9 as spec.md claimed); bimodal distribution: 4 gateway tools dominate, 17 are operator-invisible | iter-1 #2, iter-2 #1 |
| **Q10** OSS precedent | **`continuity_*` differentiated and defensible**: ecosystem fragments along 3 axes (memory / storage / rules+context); no canonical layered taxonomy exists | iter-5 #1–#7 |

## §5 Vocabulary Decision

Single top-level `continuity_*` axis with per-layer suffixes:
- `continuity_save`, `continuity_search`, `continuity_context` (L5 retrieval/save tools)
- `continuity_resume` aliased to existing `session_resume` (L4)
- `_continuity:` frontmatter key (L3)
- `/continuity:save`, `/continuity:search`, `/continuity:learn`, `/continuity:manage` (L5 user surface)
- L2 spec-doc markdown stays prose-labeled "spec docs" (no code prefix)

**Glossary footnote** (iter-5 #4) cites Cursor's `rules`+`memories`+`context` 3-concept split as precedent for an *optional future per-layer split* (`rule_*` for L6 + `continuity_*` for L3-L5). Not part of MVP scope.

## §6 Alias Window Matrix (T1 / T2 / T3)

| Tier | Tool count | Tools | Alias window policy | Justification |
|---|---:|---|---|---|
| **T1 Gateway** | 4 | `memory_search`, `memory_context`, `memory_save`, `memory_index_scan` | **Permanent alias** — never remove | 367/259/172/125 file-level quotes including operator runbooks (handover.md), top-level rules (CLAUDE.md sync triad), and 16 agent definitions [iter-2 #1, #8] |
| **T2 Workflow** | 4 | `memory_match_triggers`, `memory_stats`, `memory_list`, `memory_health` | **2-release window**, deprecation warnings | Quoted in agent definitions and CLAUDE.md gate prose; `memory_match_triggers` has 12 top-doc hits across the triad |
| **T3 Internal** | 13 | causal × 3, ingest × 3, plus `memory_delete`, `memory_validate`, `memory_update`, `memory_bulk_delete`, `memory_drift_why`, `memory_quick_search`, `memory_get_learning_history` | **1-release window** | Zero operator-facing quotations; only rename cost is repo-internal skill-docs |

## §7 Rename Surface Contract (6-row Q3 table)

[Full contract in §3 above; load-bearing iter-5 #8.]

**Implementation-phase scope-freeze**: the 6-row table is the rename's frozen scope. The implementation phase MUST NOT extend to (a) any SQL table or column under `mcp_server/lib/storage/` or `mcp_server/lib/search/` (L1 NO-ACTION); (b) any of the 1,916 existing `_memory:` frontmatter files in `.opencode/specs/**` as a forced migration; (c) `opencode.json` or `.utcp_config.json` (zero tool-name quotes); (d) FSRS algorithmic constants or cognitive-science literature terms. Scope additions require explicit decision-record updates citing new evidence.

## §8 Migration Mechanics

**Parser-fallback** (HIGH feasibility — iter-3 #5):
- 5 hard-coded `'_memory.continuity'` constants in TS/JS source: `mcp_server/handlers/save/create-record.ts:23`, `mcp_server/dist/handlers/memory-search.js:49`, `mcp_server/dist/handlers/memory-save.js:67`, `mcp_server/dist/lib/parsing/trigger-matcher.js:64`, `mcp_server/dist/lib/routing/content-router.js:44`
- 1 regex-based extractor at `mcp_server/dist/lib/resume/resume-ladder.js:65-90` (highest-cost rename site)
- 1 yaml.load reader at `scripts/validation/continuity-freshness.ts:62-77` (pure JS property access; 6-line fallback change)
- NEW shared-constants module: `mcp_server/lib/parsing/continuity-anchor-constants.ts` exporting `LEGACY_CONTINUITY_ANCHOR_ID = '_memory.continuity'` and `CONTINUITY_ANCHOR_ID = '_continuity'`
- NEW telemetry channel: `mcp_server/lib/telemetry/legacy-memory-name-telemetry.ts`

**Migration corpus**: 1,916 `.md` files in `.opencode/specs/**` use `_memory:` frontmatter (5.7× the spec.md §3 estimate of ~501) — broken down: spec.md (344), implementation-summary.md (334), plan.md (334), tasks.md (334), checklist.md (282), decision-record.md (92), handover.md (11) [iter-3 #4]. Parser-fallback covers them without rewrite. Optional `npm run migrate:continuity-key` script for batch rewrite at a chosen later release.

## §9 Glossary Scaffolding

**Greenfield top-level** `.opencode/skill/system-spec-kit/references/glossary.md` (peer to `intake-contract.md`) with 6-section structure mirroring the 6 concept layers [iter-3 #8]:
- §0 PREAMBLE: defensive Anthropic + MCP reference server disambiguation
- §1 L1 Storage: documents `memory_index`, `memory_fts`, etc. as legacy infrastructure terms exempt from rename
- §2 L2 Spec-doc markdown: prose term "spec docs"
- §3 L3 Generated metadata: documents `_continuity:` + parser-fallback for legacy `_memory:` + mixed-mode warning
- §4 L4 Recovery surfaces: documents canonical ladder `handover.md → _continuity → spec docs`
- §5 L5 Retrieval pipeline + 21 tools: 21 `continuity_*` names + tier-stratified `memory_*` aliases
- §6 L6 Constitutional / cognitive carve-out: ~12 KEEP loanwords + ~5 CONDITIONAL identifiers BY NAME with line-paths + canary cross-link rule

**Validator**: `scripts/validation/glossary-drift-lint.ts` registered in `validator-registry.json`. Severity: warn for existing files, fail for new files. Special canary rule (per iter-6 R5) detects `memory_id` outside `cognitive/` AND `lib/storage/`.

**Decision-record integration**: each rename decision (one per layer) gets an entry in `glossary.md` §[layer] AND a corresponding entry in this packet's `decision-record.md`. The two docs cross-link.

## §10 Anthropic Disambiguation

Three surfaces, three calibrated tones (iter-4 #4 candidates expanded per iter-5 #3 + iter-8 #1):
- **(a) BRIEF** in top skill README §1: ~1 sentence
- **(b) BALANCED** in mcp_server README §1 (after "Switch from Claude to GPT to Gemini" anchor): mentions BOTH Anthropic Claude Memory tool AND the official MCP reference `memory` server at `github.com/modelcontextprotocol/servers/tree/main/src/memory`
- **(c) DEFENSIVE** in glossary §0 PREAMBLE: ~210w explicit non-inheritance + legacy-alias rule

NOT in: SKILL.md (internal AI-agent contract), INSTALL_GUIDE.md (out of scope), CLAUDE.md/AGENTS.md triad (wrong layer).

## §11 Cognitive Carve-Out

The `mcp_server/lib/cognitive/` subsystem implements FSRS v4, Miller's working-memory model (7±2 capacity at `working-memory.ts:29`), attention decay, spreading activation (Collins & Loftus 1975), prediction-error gating, and tier classification. Self-identifies as "the brain of the memory system" in `cognitive/README.md`. Because the academic literature uses `memory` as a precise technical term, the subsystem is **carved out** from the L1–L5 vocabulary contract.

**KEEP (~12 cognitive-science loanwords)** [iter-4 #6–#8, iter-8 #2]:
- `working_memory` SQL table; `WorkingMemoryConfigType`, `WORKING_MEMORY_CONFIG`, `WorkingMemoryEntry`, `getWorkingMemory`
- All `FSRS_*` constants; all "long-term memory" / "working memory" comments
- All Collins & Loftus 1975 spreading-activation terminology

**CONDITIONAL (5 identifiers default-keep, locked to L1=NO-ACTION)**:
1. `memory_id` FK column in `working-memory.ts:49,61,77,285,287,305`
2. `getSessionMemories` function in `working-memory.ts:297`
3. `memory` parameter in `attention-decay.ts:116,160-185,233,242`
4. `memory` parameter in `tier-classifier.ts:108,122,157,291,496`
5. `memory.related_memories` in `co-activation.ts:211,215`

**Cross-link canary** (iter-6 R5): `glossary-drift-lint.ts` rule fails on any `memory_id` reference outside `cognitive/` AND `lib/storage/`. If a future packet flips L1, the lint rule's allow-list move forces the 5 cognitive-side identifiers to flip in the same atomic change.

**RENAME doc-strings only** (~10 edits in 4 files): `fsrs-scheduler.ts`, `prediction-error-gate.ts`, `temporal-contiguity.ts`, `adaptive-ranking.ts` — JSDoc "Memory context_type" → "Continuity row context_type"; "for a new memory" → "for a new continuity row".

## §12 OSS Precedent

5-row precedent table (iter-5 #6):

| Project | Vocabulary | Layer structure | Verdict |
|---|---|---|---|
| LangChain (legacy 0.2) | `Conversation*Memory` flat suffix | Flat | DIFFERENTIATE |
| LangChain (current) | No top-level `memory` module; routed to LangGraph state + middleware | Dissolved | NEUTRAL (validation) |
| LlamaIndex | `*Store` suffix + `StorageContext`; explicitly no "memory" module | 5-store partition | NEUTRAL (validation) |
| MCP-server registry (official) | One server literally named `memory` | Single concept | DIFFERENTIATE — drives Q6 callout expansion |
| Cursor | `rules` + `memories` + `context` | 3-concept split | BORROW (per-layer split idea for glossary footnote) |
| Letta (formerly MemGPT) | `core/recall/archival` 3-tier with `memory` suffix | 3-tier | NEUTRAL (validation) |

**Verdict**: `continuity_*` differentiated and defensible. No surveyed project uses `continuity` as primary noun. The dominant ecosystem term ("memory") is contested and re-mapped per project — no canonical layered taxonomy to borrow.

## §13 Implementation Sequencing

**Linear 4-PR chain** (iter-7 #1–#8):

| PR | Scope verb | Files in scope (high-level) |
|---|---|---|
| **PR1** | Make codebase READ both keys safely; instrument legacy path | 5 const sites + 1 regex + 1 yaml + new shared-constants + new telemetry channel + dual-fixture parser test |
| **PR2** | Activate new vocabulary on user-facing surface; tier-stratified deprecation aliases on; turn telemetry on | 21 tool schema renames + 17 handler renames + 4 slash commands + 2 folder renames + alias activation |
| **PR3** | Lock new vocabulary in templates + contract docs; ship disambiguation layer | 9 Level-3 templates + greenfield `references/glossary.md` + `glossary-drift-lint.ts` + 3-surface Anthropic callouts + 5-file ladder rewrite + mixed-mode lint script |
| **PR4** | Update operator-facing rules layer; clarify cognitive doc-strings without renaming code | Synced top-doc triad coordinated edit (CLAUDE/AGENTS/Barter/fs-enterprises) + cross-repo pre-commit hook + ~10 cognitive JSDoc edits |

**Hard dependency chain**: PR2 ← PR1 (handlers consume PR1's shared constants); PR3 ← PR2 (glossary documents PR2's renamed tools); PR4 ← PR3 (triad cites glossary §5 terms).

**Atomicity constraints**: R1 (parser atomicity) bound to PR1; R2 (telemetry sequencing) bound to PR2; R4 (cross-repo symlink) bound to PR4.

## §14 Risk Register

| # | Risk | Severity | Likelihood | Mitigation | Owner |
|---|---|---|---|---|---|
| **R1** | Parser-fallback atomicity — 6 sites must land in single PR | **HIGH** | MEDIUM | Plan.md enumerates all 6 sites; regression test asserts dual-fixture equivalence | tasks.md / PR1 |
| **R2** | T1 telemetry must co-ship with rename (not split) | MEDIUM | MEDIUM | aliases + telemetry + new names in PR1+PR2 (not separate PR) | plan.md sequencing |
| **R3** | Templates-vs-corpus mixed-mode (1,916 files on parser-fallback while templates emit `_continuity:`) | MEDIUM | LOW | `npm run validate:continuity-frontmatter-mixed-mode` warns on mixed; glossary §3 documents | tasks.md + glossary |
| **R4** | Synced-triad cross-repo symlink — `AGENTS_Barter.md` is in separate Barter repo | **HIGH** | **HIGH** | Pre-commit hook enforces parity; commits in BOTH repos required | plan.md + sk-git |
| **R5** | Cognitive carve-out 5 conditional identifiers default-keep depends on L1=NO-ACTION | MEDIUM | LOW (now); HIGH (future L1-rename packet) | Glossary §6 lists 5 identifiers BY NAME; `glossary-drift-lint.ts` canary rule | glossary + DR + future-packet handover |

## §15 Edge Case Payloads

Five ready-to-paste micro-payloads from iter-9:
1. `LegacyMemoryNameTelemetry` event payload schema (TypeScript interface + example JSON)
2. PR1 dual-fixture parser test (legacy.md + new.md fixtures + Vitest assertions)
3. `glossary-drift-lint.ts` 4 typed regex rules (TOOL_NAME_DRIFT / MEMORY_ID_CANARY / FRONTMATTER_KEY_DRIFT / SLASH_COMMAND_DRIFT) with per-rule allowlists and severity matrix
4. Mixed-mode warning CLI output template (4 sub-modes: warn/info/error/skip)
5. `triad-parity-check.sh` 4 failure modes with sample CLI output (AGENTS-only / 3-of-4 cross-repo orphan / Barter-only / `--no-verify` audit-log warn-posture)

Full content in `iterations/iteration-009.md`.

## §16 Convergence Report

- Stop reason: **converged**
- Total iterations: 10
- Questions answered: 10/10 (Q1–Q10 all closed with primary-source citations)
- Last 3 iteration summaries: iter-8 (glossary content drafts, ratio 0.15) | iter-9 (edge case payloads, ratio 0.15) | iter-10 (synthesis prep + STOP, ratio 0.15)
- newInfoRatio trajectory: 0.85 → 0.71 → 0.65 → 0.65 → 0.45 → 0.30 → 0.20 → 0.15 → 0.15 → 0.15 (canonical exponential decay)
- Convergence threshold: 0.05
- Tool calls used across 10 iterations: ~85 (well under 12 × 10 = 120 budget cap)
- Contradictions across iter-1..iter-5: 0 (iter-6 contradiction matrix)
- Risks identified: 5 with concrete mitigations (iter-6 R1–R5)
- Composite stop signal: rolling avg over iter-7..iter-9 = 0.167; iter-10 = 0.15; question-coverage = 100%; STOP_ALLOWED

## §17 References

- **Iter-1**: spec.md §12 questions; concept-layer mapping; 21-tool inventory; Anthropic vocabulary; `_memory:` frontmatter in 9 templates; ladder phrase in 5 templates
- **Iter-2**: 21-tool tier matrix; CLAUDE.md/AGENTS.md/Barter/fs-enterprises line numbers; configs alias-neutral; manual_testing_playbook concentration
- **Iter-3**: 5 const sites + 1 regex extractor; js-yaml + plain JS property access; 1,916-file corpus; greenfield glossary precedent; zero existing vocabulary lint
- **Iter-4**: zero Anthropic mentions across 8 surfaces; 3-surface callout placement matrix; cognitive subsystem self-identification; per-identifier carve-out tables for `working-memory.ts` and `fsrs-scheduler.ts`
- **Iter-5**: LangChain dissolution; LlamaIndex `*Store` partition; MCP reference `memory` server; Cursor `.cursor/rules`; Letta 3-tier
- **Iter-6**: contradiction matrix (0); cross-row dependency audit; 5-risk register
- **Iter-7**: 4-PR sequencing plan with dependency graph + rollback matrix
- **Iter-8**: §0 PREAMBLE prose draft (~210w); §6 cognitive carve-out prose draft (~270w)
- **Iter-9**: 5 micro-payload drafts (telemetry / parser fixture / lint / mixed-mode / triad-parity)
- **Iter-10**: research.md outline + handover note + final STOP verdict

**External sources**:
- Anthropic Claude Memory tool: `https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/memory-tool`
- LangChain reference: `https://reference.langchain.com/python/langchain/`
- LlamaIndex storage: `https://developers.llamaindex.ai/python/framework/module_guides/storing/`
- MCP server registry: `https://github.com/modelcontextprotocol/servers/blob/main/README.md`
- Cursor `.cursor/rules` convention (knowledge-anchored)
- Letta `core/recall/archival` 3-tier model (knowledge-anchored)

**Primary-source code references**: `mcp_server/tool-schemas.ts:47-542`; `mcp_server/lib/search/vector-index-schema.ts:47-2445`; `mcp_server/lib/storage/schema-downgrade.ts:205`; `scripts/validation/continuity-freshness.ts:40-185`; `mcp_server/dist/lib/resume/resume-ladder.js:65-115`; `mcp_server/lib/cognitive/working-memory.ts:1-768`; `mcp_server/lib/cognitive/fsrs-scheduler.ts:1-504`; `mcp_server/lib/cognitive/README.md:1-80`; `templates/level_3/{spec,plan,tasks,checklist,decision-record,implementation-summary,README}.md`; `templates/{handover.md, README.md, core/README.md, level_3/README.md, changelog/README.md}`; `CLAUDE.md:141,164,170`; `AGENTS.md:141,164,170`; `AGENTS_Barter.md:181,213,219`; `AGENTS_example_fs_enterprises.md:160,193,199`.

---

## Convergence Report

- Stop reason: converged
- Total iterations: 10
- Questions answered: 10 / 10
- Remaining questions: 0
- Last 3 iteration summaries: iter-8 glossary content drafts (ratio 0.15) | iter-9 edge case content drafts (ratio 0.15) | iter-10 synthesis prep + STOP (ratio 0.15)
- Convergence threshold: 0.05

STATUS=OK PATH=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology
