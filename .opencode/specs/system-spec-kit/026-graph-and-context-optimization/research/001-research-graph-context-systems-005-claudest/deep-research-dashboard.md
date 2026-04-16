---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/deep-research-dashboard.md"]

---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Research the external repository at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external and identify concrete improvements for Code_Environment/Public, especially around Claude Code plugin marketplace structure, conversation memory with FTS5/BM25 ranking, automatic context injection on session start, learning extraction with batch-processing agents, and token-usage observability dashboards.
- Started: 2026-04-06T14:35:44Z
- Status: COMPLETE
- Iteration: 20 of 20
- Session ID: 2026-04-06T14-35-44Z-005-claudest-codex
- Parent Session: none
- Lifecycle Mode: completed-continue
- Generation: 2

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | marketplace discovery + versioning | marketplace | 0.95 | 4 | insight |
| 2 | claude-memory SQLite schema + recall cascade | memory | 0.84 | 4 | insight |
| 3 | SessionStart context injection flow | hooks | 0.82 | 4 | insight |
| 4 | extract-learnings consolidation + auditor vs discoverer | extraction | 0.79 | 4 | insight |
| 5 | get-token-insights ingestion + dashboard contract | observability | 0.82 | 4 | insight |
| 6 | dashboard contract + borrowable sections | observability | 0.71 | 4 | insight |
| 7 | memory hierarchy comparison | comparison | 0.68 | 4 | insight |
| 8 | Q10 synthesis matrix | synthesis | 0.38 | 9 | insight |
| 9 | Q10 sequencing + prerequisites | sequencing | 0.27 | 6 | insight |
| 10 | Smallest safe v1 per adopt-now lane | implementation-slicing | 0.24 | 8 | insight |
| 11 | Packet-ready briefs: FTS cascade + normalized analytics tables | implementation-brief | 0.31 | 9 | insight |
| 12 | Resolve FTS probe + 024/003 payload uncertainties; closeout | closeout | 0.36 | 7 | insight |
| 13 | FTS capability helper contract + caller migration plan | fts-contract | 0.44 | 6 | insight |
| 14 | forced-degrade FTS test matrix | fts-tests | 0.39 | 5 | insight |
| 15 | Stop-hook metadata patch for transcript identity + cache tokens | analytics-producer | 0.35 | 6 | insight |
| 16 | normalized analytics replay schema + idempotent join keys | analytics-reader | 0.33 | 6 | insight |
| 17 | SessionStart cached-summary fast path mapped onto Public startup/resume surfaces | startup-fast-path | 0.28 | 5 | insight |
| 18 | auditor-vs-discoverer split mapped to Public signal extraction and review surfaces | consolidation-split | 0.26 | 6 | insight |
| 19 | portable token-insight JSON contracts | observability-contracts | 0.23 | 5 | insight |
| 20 | dependency-ordered implementation roadmap + acceptance gates | roadmap | 0.18 | 8 | converged |

- iterationsCompleted: 20
- keyFindings: 162
- openQuestions: 0
- resolvedQuestions: 18

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 18/18
- [x] Q1: How does Claudest's plugin discovery model actually work from `external/.claude-plugin/marketplace.json` through per-plugin `external/plugins/*/.claude-plugin/plugin.json`, and what would a comparable marketplace layer mean for `Code_Environment/Public`?
- [x] Q2: What does the `claude-memory` SQLite schema actually store in `projects`, `sessions`, `branches`, `messages`, `branch_messages`, and FTS tables, and why is branch-level aggregation important for BM25-ranked recall? (files: `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py`)
- [x] Q3: How does automatic context injection work at SessionStart and clear time, including session selection rules, cached `context_summary` usage, fallback behavior, and the exact shape of injected context? (files: `external/plugins/claude-memory/hooks/hooks.json`, `hooks/memory-context.py`, `hooks/sync_current.py`, `skills/recall-conversations/scripts/memory_lib/summarizer.py`)
- [x] Q4: How does `recall-conversations` expose search and chronological browsing, and what does its BM25/FTS5 -> FTS4 -> `LIKE` cascade imply for portability and ranking quality? (files: `skills/recall-conversations/SKILL.md`, `scripts/search_conversations.py`, `scripts/recent_chats.py`)
- [x] Q5: How does `extract-learnings` move information from raw conversation recall into the memory hierarchy, and how do `memory-auditor` and `signal-discoverer` divide verification vs discovery work during consolidation mode? (files: `skills/extract-learnings/SKILL.md`, `memory-auditor.md`, `signal-discoverer.md`)
- [x] Q6: How does the memory hierarchy `CLAUDE.md -> repo CLAUDE.md -> MEMORY.md -> topic files` compare with `Code_Environment/Public`'s current Spec Kit Memory + `MEMORY.md` model? Where are the approaches complementary vs redundant?
- [x] Q7: How does `get-token-insights` parse raw JSONL files into analytics tables, normalize model pricing and cache tiers, and derive metrics like cache cliffs, skill usage, subagent usage, and hook latency? (files: `skills/get-token-insights/SKILL.md`, `scripts/ingest_token_data.py`, `templates/dashboard.html`)
- [x] Q8: What exactly does the HTML dashboard surface, and which dashboard sections or data contracts would be most valuable for `Code_Environment/Public` without copying the full presentation layer?
- [x] Q9: How do plugin versioning and auto-update work in practice, including root marketplace manifests, per-plugin manifests, and the `/plugin` marketplace auto-update flow? Preserve any version discrepancies between root and plugin-local manifests.
- [x] Q10: Which Claudest ideas are implementation-backed and ready to borrow (`adopt now`), which need prototyping because they depend on Claude-specific local JSONL formats or plugin runtime behavior (`prototype later`), and which should be rejected because Public already covers the capability another way (`reject`)?
- [x] Q11: What is the smallest accurate FTS capability helper contract Public should add before importing more of Claudest's recall cascade?
- [x] Q12: What forced-degrade test matrix proves the FTS portability lane without overstating current Public support?
- [x] Q13: What bounded Stop-hook metadata patch is required before normalized analytics can be made durable?
- [x] Q14: What reader-owned replay schema and idempotency keys best translate Claudest's analytics model into Public's current hook-state reality?
- [x] Q15: Where exactly should the cached-summary fast path land in Public's existing SessionStart and startup-brief surfaces?
- [x] Q16: How should Claudest's verifier/discoverer split be translated into Public's existing signal extraction and post-save review seams?
- [x] Q17: Which token-observability contracts are portable now once Public has a normalized reader, and which Claudest fields should stay presentation-only?
- [x] Q18: What is the dependency-ordered roadmap and acceptance-gate sequence for turning the Claudest research into Public implementation packets?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.26 -> 0.23 -> 0.18
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.18
- coverageBySources: {"other":146}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- The prompt suggested `external/plugins/get-token-insights/.claude-plugin/plugin.json` as an example comparison target, but that plugin folder does not exist in this checkout; I switched the comparison read to `external/plugins/claude-skills/.claude-plugin/plugin.json`. (iteration 1)
- Treating per-plugin `plugin.json` as the place where update behavior is configured; the inspected manifests only expose package metadata, not update controls. (iteration 1)
- None this iteration (iteration 2)
- None this iteration (iteration 2)
- None this iteration (iteration 3)
- The fallback path is not a special "last 3 exchanges" renderer in current source, even though `_build_fallback_context()` says that in its docstring; the implementation mirrors the same short-session/full render and long-session first-2 plus last-6 structure used by `render_context_summary()`. (iteration 3)
- `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` rules out the idea that consolidation writes raw recalled conversations directly into memory. The source inserts ranking, deduplication, target-layer selection, proposal review, and approval before execution. (iteration 4)
- No `skills/extract-learnings/scripts/` directory exists under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/extract-learnings/`, so there were no script-level consolidation helpers to inspect this iteration. (iteration 4)
- Copying `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html` wholesale into Code_Environment/Public. The reusable value is the data contract and derived metrics, not the specific HTML/CSS/Chart.js presentation layer. (iteration 5)
- Initial path resolution at repo root failed because `get-token-insights` lives under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/...`, not under a top-level `external/` directory in this checkout. (iteration 5)
- Borrowing the full `dashboard.html` presentation layer: inline CSS theme tokens, scanline overlay, fixed ticker, collapsible section behavior, Chart.js wiring, Google Fonts dependency, and the SVG-specific skill chart are not the durable value. They are transport and styling decisions, not the underlying contract. (iteration 6)
- None this iteration. (iteration 6)
- Reusing the "Skills to Consider Disabling" widget as-is. The useful part is still `skill_usage[].{skill,count,errors}`; the disable-table copy and threshold (`count <= 2`) is opinionated product policy, not a reusable observability primitive. (iteration 6)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/CLAUDE.md` does not exist, so the plugin-specific layer description had to be reconstructed from the plugin README and `extract-learnings` skill instead. (iteration 7)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/MEMORY.md` does not exist, so the Public-side comparison used `CLAUDE.md`, the `system-spec-kit` skill, and `generate-context.js` rather than a top-level repo memory file. (iteration 7)
- Treating a repo-root `MEMORY.md` as necessary for Public. The current model works without one because retrieval is MCP-backed and spec-folder-scoped rather than file-rooted. (iteration 7)
- Treating Claudest's hierarchy as a drop-in replacement for Public's memory stack. Public already has stronger retrieval, richer scoping, and explicit spec-folder context preservation. (iteration 7)
- No new dead ends in this iteration. This was a synthesis-only pass over iterations 1-7 plus the progressive synthesis document and findings registry. (iteration 8)
- Reopening the prior dead-end around repo-owned auto-update metadata. Iteration 1 already showed the manifests do not encode update policy, so the synthesis keeps that conclusion closed. [SOURCE: external/README.md] [SOURCE: external/.claude-plugin/marketplace.json] (iteration 8)
- Treating the nine-track matrix as nine independent imports. The evidence keeps splitting cleanly into "portable pattern" versus "requires missing infrastructure," so several tracks only make sense when scoped that way. [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py] [SOURCE: external/plugins/claude-memory/skills/extract-learnings/SKILL.md] (iteration 8)
- Designing the token dashboard contract before the ingestion shape exists. Public already has enough evidence to prototype ingestion first, so reversing that order would recreate the "copy the shell before the data contract" mistake iteration 8 explicitly rejected. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md] (iteration 9)
- No new technical dead ends. This pass was a sequencing synthesis over iteration 8 plus existing Public packet summaries, not a fresh source-discovery round. (iteration 9)
- Starting the next Public adoption pass with marketplace/versioning or the branch-ranked SQLite schema. Iteration 8 already classified those lanes as `prototype later`, and the consulted Public packets still do not provide the missing packaging or branch-graph prerequisites. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] (iteration 9)
- Treating SessionStart context injection as a recovery-system replacement. The safe lane is still augmentation of `session_bootstrap()` / `session_resume()` style flows, not importing Claude's hook-recency heuristic wholesale. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md] (iteration 9)
- No new dead ends. The main correction was narrowing the ingestion lane from "already unblocked" to "collection is unblocked, analytics-grade normalization still needs one follow-on spec." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-009.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] (iteration 10)
- Rewriting `024/003` to close the analytics gap. The smallest safe move is a follow-on normalized read model, not a producer rewrite. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] (iteration 10)
- Starting with the dashboard contract before ingestion lands. The stress test shows that this would lock in unstable fields too early. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-009.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] (iteration 10)
- Treating the SessionStart fast path as a replacement for Public recovery. The safe v1 remains augmentation only. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md] (iteration 10)
- Advancing the dashboard contract ahead of normalized ingestion. Iteration 10's sequencing still holds: the durable next packet is the read model first, not presentation fields. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/research.md:577-580] (iteration 11)
- No new path dead ends occurred after the earlier path correction; the only meaningful correction this iteration was narrowing the Claudest comparison from "fallback by error class" to "fallback by capability probe plus query branch." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:22-106] (iteration 11)
- Rewriting the `024/003` producer to close the analytics gap. The packet-ready boundary remains additive normalized tables plus a replay reader, not a producer migration. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:103-110] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138] (iteration 11)
- Treating the Claudest FTS lane as exception-driven tier hopping. The source is probe-first and query-branch-based today, so Public's exception-triggered degrade behavior should be treated as new hardening rather than back-attributed to Claudest. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:22-106] (iteration 11)
- Claiming that turn-level replay can be keyed from `lastTranscriptOffset` alone. The current parser emits only session-level `newOffset=fileSize`, not per-turn offsets. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123] (iteration 12)
- No new dead-end path was pursued in this final pass. The main correction was replacing the abstract "payload should be enough" assumption with a field-level check of what the Stop hook actually persists and what remains ephemeral. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:191-257] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] (iteration 12)
- Reusing the older brief's `fts4_match` lane as a default first-packet promise. Public does not currently create an FTS4-capable alternate table, so that would overstate what the first implementation can safely deliver. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412] (iteration 12)
- Treating `speckitSessionId` as the primary analytics join key. The Stop hook does not populate it today, so the reliable current key remains `claudeSessionId`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:162-180] (iteration 12)
- No new dead-end path occurred. The main correction was shrinking the vague "port Claudest fallback" story into one concrete helper contract and two concrete caller migrations. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:123-145] (iteration 13)
- Treating the helper as a broad rewrite of the whole search stack. The current evidence supports a narrow capability contract plus caller migration, not a lexical subsystem rewrite. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478] (iteration 13)
- Adding an FTS4 happy-path test to "prove portability." That would validate a lane the current schema does not support. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412] (iteration 14)
- No new dead-end path occurred. The correction was simply distinguishing helper-branch tests from schema-backed execution tests. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145] (iteration 14)
- No new dead-end path occurred. The main correction was refusing to treat ephemeral hook input as already durable state. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:12-22] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] (iteration 15)
- Rewriting `session-stop.ts` into the analytics reader. The current evidence supports a narrow metadata patch, not a producer-side normalization job. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:103-110] (iteration 15)
- No new dead-end path occurred. The main correction was separating replay checkpoint state from durable per-turn identity. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:209-216] (iteration 16)
- Using `lastTranscriptOffset` as the turn-level natural key. The parser never emits per-turn offsets today, so that would create false idempotency. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123] (iteration 16)
- No new dead-end path occurred. The correction was placement, not capability: the fast path belongs inside current source-aware routing, not beside it as a separate recovery system. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:186-206] (iteration 17)
- Replacing `session_bootstrap()` or `memory_context(...resume...)` with a hook-only recency heuristic. Public's existing recovery surfaces remain the source of truth. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md:73-76] (iteration 17)
- Building a brand-new memory-auditor framework before using the verification machinery Public already has. The split can start as a workflow contract over existing seams. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-360] (iteration 18)
- No new dead-end path occurred. The key correction was realizing that Public already owns both halves of the split, just under different names. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:35-54] (iteration 18)
- No new dead-end path occurred. The main correction was tying each contract to an explicit analytics-reader dependency instead of implying they are available immediately from hook state. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138] (iteration 19)
- Treating the dashboard shell as part of the adoption contract. Public should borrow field semantics and recommendation logic, not an embedded UI. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138] (iteration 19)
- No new dead-end path occurred. The key result was replacing "next good ideas" with a dependency-ordered packet train and concrete acceptance gates. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-015.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-016.md] (iteration 20)
- Reopening discovery before planning. The generation-2 work converted the remaining unknowns into packet boundaries and test gates, which means more research would mostly restate existing evidence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-013.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-019.md] (iteration 20)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
No further research iteration is recommended. The next action is implementation packet creation, starting with the FTS capability helper and forced-degrade tests. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-013.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-014.md]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
