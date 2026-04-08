---
title: Deep Research Strategy - 005-claudest
description: Runtime strategy file tracking deep research on the Claudest external repo (marketplace, claude-memory, get-token-insights) for applicability to Code_Environment/Public.
---

# Deep Research Strategy - Session Tracking (005-claudest)

Session for phase `005-claudest` deep research. Generation 1 ran through `cli-codex` (`gpt-5.4`, reasoning effort `high`, `--full-auto`/fast mode). Generation 2 is a completed-continue continuation executed in the active Codex workspace session to extend the packet from 12 to 20 total iterations while staying inside the same spec-folder scope.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Drive iterative deep research across the `external/` Claudest checkout, tracing marketplace structure, the `claude-memory` plugin (FTS5/BM25 recall, automatic SessionStart injection, learning-extraction agents), and the `get-token-insights` observability dashboard, and translating each into concrete recommendations for `Code_Environment/Public`.

### Usage

- **Init:** This file was populated from `scratch/phase-research-prompt.md` §6 research questions, §7 Do's, §8 Don'ts, §10 Scope Boundaries, and §11 Deliverables.
- **Per iteration:** `cli-codex` reads Next Focus, investigates with read-only inspection of `external/`, and writes evidence into `research/iterations/iteration-NNN.md`. The reducer then refreshes sections 7-11.
- **Mutability:** Mutable for analyst-owned sections; machine-owned sections rewritten by reducer.
- **Protection:** Shared state with explicit ownership boundaries.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Research the external Claudest repo at `005-claudest/external/` and identify concrete improvements for `Code_Environment/Public`, especially around: (1) Claude Code plugin marketplace structure, (2) conversation memory with FTS5/BM25 ranking, (3) automatic context injection on session start, (4) learning extraction with batch-processing agents (memory-auditor, signal-discoverer), and (5) token-usage observability dashboards (get-token-insights).

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
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

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Deep analysis of peripheral plugins unless they expose a marketplace-level architecture pattern (explicit out-of-scope: `claude-content` deep dive).
- Generic Claude Code usage tips unrelated to marketplace/memory/observability.
- Installing or executing live plugins or depending on `/plugin` runtime behavior.
- Rewriting `Code_Environment/Public` around Claudest's exact plugin runtime.
- Duplicating work from sibling phase `001-claude-optimization-settings` (which extracts Reddit-post audit patterns). This phase examines the implementation.
- Describing `Code_Environment/Public` as "lacking memory" - compare against current Spec Kit Memory + `generate-context.js` + `MEMORY.md` baseline instead.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- All 18 key questions answered with source-backed evidence.
- `research/research.md` has at least 5 evidence-backed findings, each citing exact `external/plugins/` or `external/.claude-plugin/` paths.
- Every finding has a recommendation label (`adopt now` | `prototype later` | `reject`).
- Cross-phase overlap with `001-claude-optimization-settings` is explicitly resolved.
- Convergence composite score > 0.60 (weighted vote: rolling-average, MAD noise floor, question coverage >= 0.85).
- Max iterations = 20 reached.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: How does Claudest's plugin discovery model actually work from `external/.claude-plugin/marketplace.json` through per-plugin `external/plugins/*/.claude-plugin/plugin.json`, and what would a comparable marketplace layer mean for `Code_Environment/Public`?
- Q2: What does the `claude-memory` SQLite schema actually store in `projects`, `sessions`, `branches`, `messages`, `branch_messages`, and FTS tables, and why is branch-level aggregation important for BM25-ranked recall? (files: `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py`)
- Q3: How does automatic context injection work at SessionStart and clear time, including session selection rules, cached `context_summary` usage, fallback behavior, and the exact shape of injected context? (files: `external/plugins/claude-memory/hooks/hooks.json`, `hooks/memory-context.py`, `hooks/sync_current.py`, `skills/recall-conversations/scripts/memory_lib/summarizer.py`)
- Q4: How does `recall-conversations` expose search and chronological browsing, and what does its BM25/FTS5 -> FTS4 -> `LIKE` cascade imply for portability and ranking quality? (files: `skills/recall-conversations/SKILL.md`, `scripts/search_conversations.py`, `scripts/recent_chats.py`)
- Q5: How does `extract-learnings` move information from raw conversation recall into the memory hierarchy, and how do `memory-auditor` and `signal-discoverer` divide verification vs discovery work during consolidation mode? (files: `skills/extract-learnings/SKILL.md`, `memory-auditor.md`, `signal-discoverer.md`)
- Q6: How does the memory hierarchy `CLAUDE.md -> repo CLAUDE.md -> MEMORY.md -> topic files` compare with `Code_Environment/Public`'s current Spec Kit Memory + `MEMORY.md` model? Where are the approaches complementary vs redundant?
- Q7: How does `get-token-insights` parse raw JSONL files into analytics tables, normalize model pricing and cache tiers, and derive metrics like cache cliffs, skill usage, subagent usage, and hook latency? (files: `skills/get-token-insights/SKILL.md`, `scripts/ingest_token_data.py`, `templates/dashboard.html`)
- Q8: What exactly does the HTML dashboard surface, and which dashboard sections or data contracts would be most valuable for `Code_Environment/Public` without copying the full presentation layer?
- Q9: How do plugin versioning and auto-update work in practice, including root marketplace manifests, per-plugin manifests, and the `/plugin` marketplace auto-update flow? Preserve any version discrepancies between root and plugin-local manifests.
- Q10: Which Claudest ideas are implementation-backed and ready to borrow (`adopt now`), which need prototyping because they depend on Claude-specific local JSONL formats or plugin runtime behavior (`prototype later`), and which should be rejected because Public already covers the capability another way (`reject`)?
- Q11: What is the smallest accurate FTS capability helper contract Public should add before importing more of Claudest's recall cascade?
- Q12: What forced-degrade test matrix proves the FTS portability lane without overstating current Public support?
- Q13: What bounded Stop-hook metadata patch is required before normalized analytics can be made durable?
- Q14: What reader-owned replay schema and idempotency keys best translate Claudest's analytics model into Public's current hook-state reality?
- Q15: Where exactly should the cached-summary fast path land in Public's existing SessionStart and startup-brief surfaces?
- Q16: How should Claudest's verifier/discoverer split be translated into Public's existing signal extraction and post-save review seams?
- Q17: Which token-observability contracts are portable now once Public has a normalized reader, and which Claudest fields should stay presentation-only?
- Q18: What is the dependency-ordered roadmap and acceptance-gate sequence for turning the Claudest research into Public implementation packets?

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the root marketplace first made the rest of the evidence easy to interpret because it established the catalog schema and exact plugin set before comparing local manifests. (iteration 1)
- Reading the schema first made the search scripts easy to interpret because the branch/message split explains both the FTS tables and the result-hydration queries. (iteration 2)
- Reading the hook registration and injector together made the lifecycle boundary and cache-vs-fallback split obvious very quickly. (iteration 3)
- Reading the skill first made the later agent docs much easier to map onto the overall consolidation lifecycle. (iteration 4)
- Reading the parser, analytics builder, and dashboard contract together made it easy to trace each derived metric from raw JSONL field to UI payload. (iteration 5)
- Reading the inline script and the deploy step together made the dashboard's true contract boundary very obvious. (iteration 6)
- Reading the hierarchy description and placement rules together made the overlap with Spec Kit Memory much clearer than reading the recall engine docs alone. (iteration 7)
- The prior iterations had already isolated the evidence clearly enough that Q10 was mostly a decision-compression problem, not a discovery problem. (iteration 8)
- Treating the named Public packets as dependency anchors made the sequencing pass concrete very quickly because each Claudest idea could be mapped onto a real existing substrate instead of debated abstractly. (iteration 9)
- Iteration 9 already reduced the ambiguity to packet dependencies, so the v1 slicing step was mostly about respecting existing producer and consumer boundaries instead of inventing new architecture. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-009.md] (iteration 10)
- the packet-ready brief became much sharper once the Claudest source was re-read at function level, because the distinction between compile-option probing and runtime retry changes how safely Public should design forced-degrade behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:22-106] (iteration 11)
- checking the concrete source surfaces resolved both open questions quickly because the ambiguity was not conceptual anymore; it was a question of whether exact fields and probes already existed. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:123-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] (iteration 12)
- reading the three Public search files together made the duplication boundary obvious, which is exactly what the next packet needs. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:123-145] (iteration 13)
- using the existing test file as the anchor kept the matrix grounded in real Public seams instead of abstract portability claims. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145] (iteration 14)
- reading the producer code and the packet summary together made the "metadata patch only" boundary much easier to defend. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:75-81] (iteration 15)
- the reader contract became much clearer once I treated hook state as immutable evidence and the normalized tables as an additive projection. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:103-110] (iteration 16)
- the current startup/resume separation is already clean, so the mapping exercise turned into finding the smallest richer continuity payload rather than arguing about a new hook model. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md:68-83] (iteration 17)
- comparing the signal-extraction packet with the post-save reviewer showed the split immediately, because one side is already optimized for harvesting and the other for contradiction detection. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:240-360] (iteration 18)
- the existing envelope metadata was enough to keep this pass grounded in current Public capabilities instead of hypothetical reporting. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:122-133] (iteration 19)
- forcing every lane to name an entry condition and an acceptance gate immediately exposed which research threads were still too vague and which were genuinely ready for planning. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-013.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-016.md] (iteration 20)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The prompt's example plugin path for `get-token-insights` did not exist in this checkout, so it could not serve as the comparison manifest. (iteration 1)
- Nothing failed materially. (iteration 2)
- The mirrored plugin was not at repo-root `external/`, so the first read attempt failed until I resolved the phase-local `external/` copy. (iteration 3)
- The initial path assumption was too shallow because this packet vendors `claude-memory` under the spec-local `external/` tree, not repo root. (iteration 4)
- The initial repo-root path assumption was wrong because this research packet vendors the plugin inside its own `external/` subtree. (iteration 5)
- Nothing failed materially. (iteration 6)
- The requested plugin-local `CLAUDE.md` was absent, so the layer model had to be inferred from adjacent documentation instead of a single canonical file. (iteration 7)
- The main friction was semantic, not evidentiary; several tracks mixed a reusable pattern with a larger subsystem, so the synthesis had to make that split explicit. (iteration 8)
- The memory MCP retrieval calls were not usable in this runtime, so packet confirmation had to come from direct spec-folder reads plus the local memory registry rather than a clean `memory_search()` result set. (iteration 9)
- The only sequencing claim that did not survive intact was "ingestion is unblocked now" in the broad sense. The source packet shows that collection is implemented, but analytics-grade storage and cache-tier normalization are still missing. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] (iteration 10)
- the earlier shorthand "BM25/FTS5 -> FTS4 -> LIKE fallback" was directionally correct but hid an important implementation nuance, because Claudest does not actually cascade by catching specific SQLite query failures inside the search function. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:22-106] (iteration 11)
- the earlier "packet-ready" shorthand still hid one implementation trap on each lane. Brief A implicitly assumed an FTS4 landing zone that Public does not yet provision, and Brief B implicitly assumed transcript identity was already durable when it is still only present in the ephemeral Stop payload. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:12-22] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] (iteration 12)
- the earlier shorthand blurred "query primitive" and "capability helper" into one idea, which hid the narrower change Public can safely land first. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478] (iteration 13)
- the earlier shorthand implicitly mixed backend-selection tests with schema-provisioning tests, which is how the phantom FTS4 lane kept slipping into scope. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412] (iteration 14)
- the old shorthand "normalize analytics later" hid the fact that the producer still discards two fields the future reader will need. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:149-166] (iteration 15)
- the earlier roadmap still blurred session totals and per-turn identity into one replay story, which is why `lastTranscriptOffset` looked more magical than it is. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:118-123] (iteration 16)
- the Claudest phrase "automatic context injection" still tempts a wholesale replacement framing, but Public's source already shows that startup guidance and explicit resume tools are deliberate. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:101-108] (iteration 17)
- the Claudest vocabulary initially suggested new agent infrastructure, but the Public code says the first leverage point is workflow ordering, not more subsystems. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:49-54] (iteration 18)
- the earlier synthesis risked making the contract list feel immediately available, when in reality only fragments are available until normalized replay exists. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138] (iteration 19)
- the original packet-ready language was strong enough to guide intuition but still too weak to drive task creation without one more round of narrowing. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-011.md] (iteration 20)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/CLAUDE.md` does not exist, so the plugin-specific layer description had to be reconstructed from the plugin README and `extract-learnings` skill instead. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/CLAUDE.md` does not exist, so the plugin-specific layer description had to be reconstructed from the plugin README and `extract-learnings` skill instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/CLAUDE.md` does not exist, so the plugin-specific layer description had to be reconstructed from the plugin README and `extract-learnings` skill instead.

### `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/MEMORY.md` does not exist, so the Public-side comparison used `CLAUDE.md`, the `system-spec-kit` skill, and `generate-context.js` rather than a top-level repo memory file. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/MEMORY.md` does not exist, so the Public-side comparison used `CLAUDE.md`, the `system-spec-kit` skill, and `generate-context.js` rather than a top-level repo memory file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/MEMORY.md` does not exist, so the Public-side comparison used `CLAUDE.md`, the `system-spec-kit` skill, and `generate-context.js` rather than a top-level repo memory file.

### `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` rules out the idea that consolidation writes raw recalled conversations directly into memory. The source inserts ranking, deduplication, target-layer selection, proposal review, and approval before execution. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` rules out the idea that consolidation writes raw recalled conversations directly into memory. The source inserts ranking, deduplication, target-layer selection, proposal review, and approval before execution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` rules out the idea that consolidation writes raw recalled conversations directly into memory. The source inserts ranking, deduplication, target-layer selection, proposal review, and approval before execution.

### Adding an FTS4 happy-path test to "prove portability." That would validate a lane the current schema does not support. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412] -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Adding an FTS4 happy-path test to "prove portability." That would validate a lane the current schema does not support. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding an FTS4 happy-path test to "prove portability." That would validate a lane the current schema does not support. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]

### Advancing the dashboard contract ahead of normalized ingestion. Iteration 10's sequencing still holds: the durable next packet is the read model first, not presentation fields. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/research.md:577-580] -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Advancing the dashboard contract ahead of normalized ingestion. Iteration 10's sequencing still holds: the durable next packet is the read model first, not presentation fields. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/research.md:577-580]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Advancing the dashboard contract ahead of normalized ingestion. Iteration 10's sequencing still holds: the durable next packet is the read model first, not presentation fields. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/research.md:577-580]

### Borrowing the full `dashboard.html` presentation layer: inline CSS theme tokens, scanline overlay, fixed ticker, collapsible section behavior, Chart.js wiring, Google Fonts dependency, and the SVG-specific skill chart are not the durable value. They are transport and styling decisions, not the underlying contract. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Borrowing the full `dashboard.html` presentation layer: inline CSS theme tokens, scanline overlay, fixed ticker, collapsible section behavior, Chart.js wiring, Google Fonts dependency, and the SVG-specific skill chart are not the durable value. They are transport and styling decisions, not the underlying contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Borrowing the full `dashboard.html` presentation layer: inline CSS theme tokens, scanline overlay, fixed ticker, collapsible section behavior, Chart.js wiring, Google Fonts dependency, and the SVG-specific skill chart are not the durable value. They are transport and styling decisions, not the underlying contract.

### Building a brand-new memory-auditor framework before using the verification machinery Public already has. The split can start as a workflow contract over existing seams. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-360] -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Building a brand-new memory-auditor framework before using the verification machinery Public already has. The split can start as a workflow contract over existing seams. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-360]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a brand-new memory-auditor framework before using the verification machinery Public already has. The split can start as a workflow contract over existing seams. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-360]

### Claiming that turn-level replay can be keyed from `lastTranscriptOffset` alone. The current parser emits only session-level `newOffset=fileSize`, not per-turn offsets. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Claiming that turn-level replay can be keyed from `lastTranscriptOffset` alone. The current parser emits only session-level `newOffset=fileSize`, not per-turn offsets. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming that turn-level replay can be keyed from `lastTranscriptOffset` alone. The current parser emits only session-level `newOffset=fileSize`, not per-turn offsets. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123]

### Copying `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html` wholesale into Code_Environment/Public. The reusable value is the data contract and derived metrics, not the specific HTML/CSS/Chart.js presentation layer. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Copying `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html` wholesale into Code_Environment/Public. The reusable value is the data contract and derived metrics, not the specific HTML/CSS/Chart.js presentation layer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html` wholesale into Code_Environment/Public. The reusable value is the data contract and derived metrics, not the specific HTML/CSS/Chart.js presentation layer.

### Designing the token dashboard contract before the ingestion shape exists. Public already has enough evidence to prototype ingestion first, so reversing that order would recreate the "copy the shell before the data contract" mistake iteration 8 explicitly rejected. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Designing the token dashboard contract before the ingestion shape exists. Public already has enough evidence to prototype ingestion first, so reversing that order would recreate the "copy the shell before the data contract" mistake iteration 8 explicitly rejected. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Designing the token dashboard contract before the ingestion shape exists. Public already has enough evidence to prototype ingestion first, so reversing that order would recreate the "copy the shell before the data contract" mistake iteration 8 explicitly rejected. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md]

### Initial path resolution at repo root failed because `get-token-insights` lives under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/...`, not under a top-level `external/` directory in this checkout. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Initial path resolution at repo root failed because `get-token-insights` lives under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/...`, not under a top-level `external/` directory in this checkout.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Initial path resolution at repo root failed because `get-token-insights` lives under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/...`, not under a top-level `external/` directory in this checkout.

### No `skills/extract-learnings/scripts/` directory exists under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/extract-learnings/`, so there were no script-level consolidation helpers to inspect this iteration. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No `skills/extract-learnings/scripts/` directory exists under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/extract-learnings/`, so there were no script-level consolidation helpers to inspect this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No `skills/extract-learnings/scripts/` directory exists under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/extract-learnings/`, so there were no script-level consolidation helpers to inspect this iteration.

### No new dead ends in this iteration. This was a synthesis-only pass over iterations 1-7 plus the progressive synthesis document and findings registry. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No new dead ends in this iteration. This was a synthesis-only pass over iterations 1-7 plus the progressive synthesis document and findings registry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead ends in this iteration. This was a synthesis-only pass over iterations 1-7 plus the progressive synthesis document and findings registry.

### No new dead ends. The main correction was narrowing the ingestion lane from "already unblocked" to "collection is unblocked, analytics-grade normalization still needs one follow-on spec." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-009.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No new dead ends. The main correction was narrowing the ingestion lane from "already unblocked" to "collection is unblocked, analytics-grade normalization still needs one follow-on spec." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-009.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead ends. The main correction was narrowing the ingestion lane from "already unblocked" to "collection is unblocked, analytics-grade normalization still needs one follow-on spec." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-009.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md]

### No new dead-end path occurred. The correction was placement, not capability: the fast path belongs inside current source-aware routing, not beside it as a separate recovery system. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:186-206] -- BLOCKED (iteration 17, 1 attempts)
- What was tried: No new dead-end path occurred. The correction was placement, not capability: the fast path belongs inside current source-aware routing, not beside it as a separate recovery system. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:186-206]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end path occurred. The correction was placement, not capability: the fast path belongs inside current source-aware routing, not beside it as a separate recovery system. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:186-206]

### No new dead-end path occurred. The correction was simply distinguishing helper-branch tests from schema-backed execution tests. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145] -- BLOCKED (iteration 14, 1 attempts)
- What was tried: No new dead-end path occurred. The correction was simply distinguishing helper-branch tests from schema-backed execution tests. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end path occurred. The correction was simply distinguishing helper-branch tests from schema-backed execution tests. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145]

### No new dead-end path occurred. The key correction was realizing that Public already owns both halves of the split, just under different names. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:35-54] -- BLOCKED (iteration 18, 1 attempts)
- What was tried: No new dead-end path occurred. The key correction was realizing that Public already owns both halves of the split, just under different names. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:35-54]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end path occurred. The key correction was realizing that Public already owns both halves of the split, just under different names. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:35-54]

### No new dead-end path occurred. The key result was replacing "next good ideas" with a dependency-ordered packet train and concrete acceptance gates. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-015.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-016.md] -- BLOCKED (iteration 20, 1 attempts)
- What was tried: No new dead-end path occurred. The key result was replacing "next good ideas" with a dependency-ordered packet train and concrete acceptance gates. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-015.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-016.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end path occurred. The key result was replacing "next good ideas" with a dependency-ordered packet train and concrete acceptance gates. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-015.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-016.md]

### No new dead-end path occurred. The main correction was refusing to treat ephemeral hook input as already durable state. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:12-22] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] -- BLOCKED (iteration 15, 1 attempts)
- What was tried: No new dead-end path occurred. The main correction was refusing to treat ephemeral hook input as already durable state. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:12-22] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end path occurred. The main correction was refusing to treat ephemeral hook input as already durable state. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:12-22] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33]

### No new dead-end path occurred. The main correction was separating replay checkpoint state from durable per-turn identity. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:209-216] -- BLOCKED (iteration 16, 1 attempts)
- What was tried: No new dead-end path occurred. The main correction was separating replay checkpoint state from durable per-turn identity. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:209-216]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end path occurred. The main correction was separating replay checkpoint state from durable per-turn identity. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:209-216]

### No new dead-end path occurred. The main correction was shrinking the vague "port Claudest fallback" story into one concrete helper contract and two concrete caller migrations. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:123-145] -- BLOCKED (iteration 13, 1 attempts)
- What was tried: No new dead-end path occurred. The main correction was shrinking the vague "port Claudest fallback" story into one concrete helper contract and two concrete caller migrations. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:123-145]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end path occurred. The main correction was shrinking the vague "port Claudest fallback" story into one concrete helper contract and two concrete caller migrations. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:123-145]

### No new dead-end path occurred. The main correction was tying each contract to an explicit analytics-reader dependency instead of implying they are available immediately from hook state. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138] -- BLOCKED (iteration 19, 1 attempts)
- What was tried: No new dead-end path occurred. The main correction was tying each contract to an explicit analytics-reader dependency instead of implying they are available immediately from hook state. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end path occurred. The main correction was tying each contract to an explicit analytics-reader dependency instead of implying they are available immediately from hook state. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]

### No new dead-end path was pursued in this final pass. The main correction was replacing the abstract "payload should be enough" assumption with a field-level check of what the Stop hook actually persists and what remains ephemeral. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:191-257] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: No new dead-end path was pursued in this final pass. The main correction was replacing the abstract "payload should be enough" assumption with a field-level check of what the Stop hook actually persists and what remains ephemeral. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:191-257] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end path was pursued in this final pass. The main correction was replacing the abstract "payload should be enough" assumption with a field-level check of what the Stop hook actually persists and what remains ephemeral. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:191-257] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33]

### No new path dead ends occurred after the earlier path correction; the only meaningful correction this iteration was narrowing the Claudest comparison from "fallback by error class" to "fallback by capability probe plus query branch." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:22-106] -- BLOCKED (iteration 11, 1 attempts)
- What was tried: No new path dead ends occurred after the earlier path correction; the only meaningful correction this iteration was narrowing the Claudest comparison from "fallback by error class" to "fallback by capability probe plus query branch." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:22-106]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new path dead ends occurred after the earlier path correction; the only meaningful correction this iteration was narrowing the Claudest comparison from "fallback by error class" to "fallback by capability probe plus query branch." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:22-106]

### No new technical dead ends. This pass was a sequencing synthesis over iteration 8 plus existing Public packet summaries, not a fresh source-discovery round. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No new technical dead ends. This pass was a sequencing synthesis over iteration 8 plus existing Public packet summaries, not a fresh source-discovery round.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new technical dead ends. This pass was a sequencing synthesis over iteration 8 plus existing Public packet summaries, not a fresh source-discovery round.

### None this iteration -- BLOCKED (iteration 3, 3 attempts)
- What was tried: None this iteration
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration

### None this iteration. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration.

### Reopening discovery before planning. The generation-2 work converted the remaining unknowns into packet boundaries and test gates, which means more research would mostly restate existing evidence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-013.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-019.md] -- BLOCKED (iteration 20, 1 attempts)
- What was tried: Reopening discovery before planning. The generation-2 work converted the remaining unknowns into packet boundaries and test gates, which means more research would mostly restate existing evidence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-013.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-019.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening discovery before planning. The generation-2 work converted the remaining unknowns into packet boundaries and test gates, which means more research would mostly restate existing evidence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-013.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-019.md]

### Reopening the prior dead-end around repo-owned auto-update metadata. Iteration 1 already showed the manifests do not encode update policy, so the synthesis keeps that conclusion closed. [SOURCE: external/README.md] [SOURCE: external/.claude-plugin/marketplace.json] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Reopening the prior dead-end around repo-owned auto-update metadata. Iteration 1 already showed the manifests do not encode update policy, so the synthesis keeps that conclusion closed. [SOURCE: external/README.md] [SOURCE: external/.claude-plugin/marketplace.json]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening the prior dead-end around repo-owned auto-update metadata. Iteration 1 already showed the manifests do not encode update policy, so the synthesis keeps that conclusion closed. [SOURCE: external/README.md] [SOURCE: external/.claude-plugin/marketplace.json]

### Replacing `session_bootstrap()` or `memory_context(...resume...)` with a hook-only recency heuristic. Public's existing recovery surfaces remain the source of truth. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md:73-76] -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Replacing `session_bootstrap()` or `memory_context(...resume...)` with a hook-only recency heuristic. Public's existing recovery surfaces remain the source of truth. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md:73-76]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing `session_bootstrap()` or `memory_context(...resume...)` with a hook-only recency heuristic. Public's existing recovery surfaces remain the source of truth. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md:73-76]

### Reusing the "Skills to Consider Disabling" widget as-is. The useful part is still `skill_usage[].{skill,count,errors}`; the disable-table copy and threshold (`count <= 2`) is opinionated product policy, not a reusable observability primitive. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Reusing the "Skills to Consider Disabling" widget as-is. The useful part is still `skill_usage[].{skill,count,errors}`; the disable-table copy and threshold (`count <= 2`) is opinionated product policy, not a reusable observability primitive.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the "Skills to Consider Disabling" widget as-is. The useful part is still `skill_usage[].{skill,count,errors}`; the disable-table copy and threshold (`count <= 2`) is opinionated product policy, not a reusable observability primitive.

### Reusing the older brief's `fts4_match` lane as a default first-packet promise. Public does not currently create an FTS4-capable alternate table, so that would overstate what the first implementation can safely deliver. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Reusing the older brief's `fts4_match` lane as a default first-packet promise. Public does not currently create an FTS4-capable alternate table, so that would overstate what the first implementation can safely deliver. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the older brief's `fts4_match` lane as a default first-packet promise. Public does not currently create an FTS4-capable alternate table, so that would overstate what the first implementation can safely deliver. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]

### Rewriting `024/003` to close the analytics gap. The smallest safe move is a follow-on normalized read model, not a producer rewrite. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Rewriting `024/003` to close the analytics gap. The smallest safe move is a follow-on normalized read model, not a producer rewrite. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rewriting `024/003` to close the analytics gap. The smallest safe move is a follow-on normalized read model, not a producer rewrite. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md]

### Rewriting `session-stop.ts` into the analytics reader. The current evidence supports a narrow metadata patch, not a producer-side normalization job. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:103-110] -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Rewriting `session-stop.ts` into the analytics reader. The current evidence supports a narrow metadata patch, not a producer-side normalization job. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:103-110]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rewriting `session-stop.ts` into the analytics reader. The current evidence supports a narrow metadata patch, not a producer-side normalization job. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:103-110]

### Rewriting the `024/003` producer to close the analytics gap. The packet-ready boundary remains additive normalized tables plus a replay reader, not a producer migration. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:103-110] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138] -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Rewriting the `024/003` producer to close the analytics gap. The packet-ready boundary remains additive normalized tables plus a replay reader, not a producer migration. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:103-110] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rewriting the `024/003` producer to close the analytics gap. The packet-ready boundary remains additive normalized tables plus a replay reader, not a producer migration. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:103-110] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]

### Starting the next Public adoption pass with marketplace/versioning or the branch-ranked SQLite schema. Iteration 8 already classified those lanes as `prototype later`, and the consulted Public packets still do not provide the missing packaging or branch-graph prerequisites. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Starting the next Public adoption pass with marketplace/versioning or the branch-ranked SQLite schema. Iteration 8 already classified those lanes as `prototype later`, and the consulted Public packets still do not provide the missing packaging or branch-graph prerequisites. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting the next Public adoption pass with marketplace/versioning or the branch-ranked SQLite schema. Iteration 8 already classified those lanes as `prototype later`, and the consulted Public packets still do not provide the missing packaging or branch-graph prerequisites. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md]

### Starting with the dashboard contract before ingestion lands. The stress test shows that this would lock in unstable fields too early. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-009.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Starting with the dashboard contract before ingestion lands. The stress test shows that this would lock in unstable fields too early. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-009.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting with the dashboard contract before ingestion lands. The stress test shows that this would lock in unstable fields too early. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-009.md] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md]

### The fallback path is not a special "last 3 exchanges" renderer in current source, even though `_build_fallback_context()` says that in its docstring; the implementation mirrors the same short-session/full render and long-session first-2 plus last-6 structure used by `render_context_summary()`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The fallback path is not a special "last 3 exchanges" renderer in current source, even though `_build_fallback_context()` says that in its docstring; the implementation mirrors the same short-session/full render and long-session first-2 plus last-6 structure used by `render_context_summary()`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The fallback path is not a special "last 3 exchanges" renderer in current source, even though `_build_fallback_context()` says that in its docstring; the implementation mirrors the same short-session/full render and long-session first-2 plus last-6 structure used by `render_context_summary()`.

### The prompt suggested `external/plugins/get-token-insights/.claude-plugin/plugin.json` as an example comparison target, but that plugin folder does not exist in this checkout; I switched the comparison read to `external/plugins/claude-skills/.claude-plugin/plugin.json`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The prompt suggested `external/plugins/get-token-insights/.claude-plugin/plugin.json` as an example comparison target, but that plugin folder does not exist in this checkout; I switched the comparison read to `external/plugins/claude-skills/.claude-plugin/plugin.json`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The prompt suggested `external/plugins/get-token-insights/.claude-plugin/plugin.json` as an example comparison target, but that plugin folder does not exist in this checkout; I switched the comparison read to `external/plugins/claude-skills/.claude-plugin/plugin.json`.

### Treating `speckitSessionId` as the primary analytics join key. The Stop hook does not populate it today, so the reliable current key remains `claudeSessionId`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:162-180] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Treating `speckitSessionId` as the primary analytics join key. The Stop hook does not populate it today, so the reliable current key remains `claudeSessionId`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:162-180]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `speckitSessionId` as the primary analytics join key. The Stop hook does not populate it today, so the reliable current key remains `claudeSessionId`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:162-180]

### Treating a repo-root `MEMORY.md` as necessary for Public. The current model works without one because retrieval is MCP-backed and spec-folder-scoped rather than file-rooted. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating a repo-root `MEMORY.md` as necessary for Public. The current model works without one because retrieval is MCP-backed and spec-folder-scoped rather than file-rooted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a repo-root `MEMORY.md` as necessary for Public. The current model works without one because retrieval is MCP-backed and spec-folder-scoped rather than file-rooted.

### Treating Claudest's hierarchy as a drop-in replacement for Public's memory stack. Public already has stronger retrieval, richer scoping, and explicit spec-folder context preservation. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating Claudest's hierarchy as a drop-in replacement for Public's memory stack. Public already has stronger retrieval, richer scoping, and explicit spec-folder context preservation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Claudest's hierarchy as a drop-in replacement for Public's memory stack. Public already has stronger retrieval, richer scoping, and explicit spec-folder context preservation.

### Treating per-plugin `plugin.json` as the place where update behavior is configured; the inspected manifests only expose package metadata, not update controls. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating per-plugin `plugin.json` as the place where update behavior is configured; the inspected manifests only expose package metadata, not update controls.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating per-plugin `plugin.json` as the place where update behavior is configured; the inspected manifests only expose package metadata, not update controls.

### Treating SessionStart context injection as a recovery-system replacement. The safe lane is still augmentation of `session_bootstrap()` / `session_resume()` style flows, not importing Claude's hook-recency heuristic wholesale. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating SessionStart context injection as a recovery-system replacement. The safe lane is still augmentation of `session_bootstrap()` / `session_resume()` style flows, not importing Claude's hook-recency heuristic wholesale. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating SessionStart context injection as a recovery-system replacement. The safe lane is still augmentation of `session_bootstrap()` / `session_resume()` style flows, not importing Claude's hook-recency heuristic wholesale. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md]

### Treating the Claudest FTS lane as exception-driven tier hopping. The source is probe-first and query-branch-based today, so Public's exception-triggered degrade behavior should be treated as new hardening rather than back-attributed to Claudest. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:22-106] -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating the Claudest FTS lane as exception-driven tier hopping. The source is probe-first and query-branch-based today, so Public's exception-triggered degrade behavior should be treated as new hardening rather than back-attributed to Claudest. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:22-106]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the Claudest FTS lane as exception-driven tier hopping. The source is probe-first and query-branch-based today, so Public's exception-triggered degrade behavior should be treated as new hardening rather than back-attributed to Claudest. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py:22-106]

### Treating the dashboard shell as part of the adoption contract. Public should borrow field semantics and recommendation logic, not an embedded UI. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138] -- BLOCKED (iteration 19, 1 attempts)
- What was tried: Treating the dashboard shell as part of the adoption contract. Public should borrow field semantics and recommendation logic, not an embedded UI. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the dashboard shell as part of the adoption contract. Public should borrow field semantics and recommendation logic, not an embedded UI. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]

### Treating the helper as a broad rewrite of the whole search stack. The current evidence supports a narrow capability contract plus caller migration, not a lexical subsystem rewrite. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478] -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating the helper as a broad rewrite of the whole search stack. The current evidence supports a narrow capability contract plus caller migration, not a lexical subsystem rewrite. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the helper as a broad rewrite of the whole search stack. The current evidence supports a narrow capability contract plus caller migration, not a lexical subsystem rewrite. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478]

### Treating the nine-track matrix as nine independent imports. The evidence keeps splitting cleanly into "portable pattern" versus "requires missing infrastructure," so several tracks only make sense when scoped that way. [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py] [SOURCE: external/plugins/claude-memory/skills/extract-learnings/SKILL.md] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating the nine-track matrix as nine independent imports. The evidence keeps splitting cleanly into "portable pattern" versus "requires missing infrastructure," so several tracks only make sense when scoped that way. [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py] [SOURCE: external/plugins/claude-memory/skills/extract-learnings/SKILL.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the nine-track matrix as nine independent imports. The evidence keeps splitting cleanly into "portable pattern" versus "requires missing infrastructure," so several tracks only make sense when scoped that way. [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py] [SOURCE: external/plugins/claude-memory/skills/extract-learnings/SKILL.md]

### Treating the SessionStart fast path as a replacement for Public recovery. The safe v1 remains augmentation only. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating the SessionStart fast path as a replacement for Public recovery. The safe v1 remains augmentation only. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the SessionStart fast path as a replacement for Public recovery. The safe v1 remains augmentation only. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-008.md]

### Using `lastTranscriptOffset` as the turn-level natural key. The parser never emits per-turn offsets today, so that would create false idempotency. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123] -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Using `lastTranscriptOffset` as the turn-level natural key. The parser never emits per-turn offsets today, so that would create false idempotency. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using `lastTranscriptOffset` as the turn-level natural key. The parser never emits per-turn offsets today, so that would create false idempotency. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
No further research iteration is recommended. The next action is implementation packet creation, starting with the FTS capability helper and forced-degrade tests. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-013.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-014.md]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

### Prior memory
No prior Spec Kit Memory matches for "Claudest claude-memory plugin marketplace" (memory_context returned zero results with evidence gap).

### Related context surfaced by auto-surface hook (adjacent, not directly about Claudest)

- `system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard` — prior FTS5 work in Public's own memory MCP. Useful comparison for Claudest's FTS5/BM25 cascade.
- `system-spec-kit/024-compact-code-graph/003-stop-hook-tracking` — prior token tracking / Stop-hook work. Useful comparison for `get-token-insights` cache-cliff detection.
- `system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme` — memory MCP documentation context.
- `system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction` — prior signal-extraction implementation. Directly relevant to Claudest's `signal-discoverer` agent.

### Repo baseline to compare against
`Code_Environment/Public` already has: Spec Kit Memory (`memory_context`, `memory_search`, `memory_save`), `generate-context.js` structured saves, session continuity with `session_bootstrap`/`session_resume`, `MEMORY.md` agent-facing index, importance tiers in frontmatter, `.opencode/skill/` as a skill-distribution surface. It does NOT currently have: a `.claude-plugin/marketplace.json`-style marketplace manifest, a Claude-JSONL token auditor that emits an HTML dashboard, or Stop-time cached `context_summary` persistence on branches.

### Cross-phase awareness
Phase `001-claude-optimization-settings` extracts lessons from the Reddit audit post (pattern side). This phase `005-claudest` examines the implementation side. Do not restate audit patterns - focus on what the Claudest source actually does.

### External repo layout (seen at init)
`.claude-plugin/`, `.github/`, `.gitignore`, `.pre-commit-config.yaml`, `CHANGELOG.md`, `CLAUDE.md`, `README.md`, `docs/`, `plugins/` (dir), `pyproject.toml`, `scripts/`, `tests/`.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 20
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
- Machine-owned sections: reducer controls Sections 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Dispatch override: generation 1 iteration agent = `cli-codex` (`codex exec --model gpt-5.4 -c model_reasoning_effort=high --full-auto --sandbox workspace-write`). Generation 2 continuation executed in the active Codex workspace session with the same model and reasoning target, still without dispatching the default `@deep-research` agent.
- Current generation: 2
- Started: 2026-04-06T14:35:44Z
<!-- /ANCHOR:research-boundaries -->

<!-- ANCHOR:generation-2 -->
## 14. GENERATION 2 — EXECUTION-READY CONTINUATION (iterations 13-20)

**Lifecycle mode:** `completed-continue` — generation 1 converged at iteration 12 with packet-ready briefs, then the packet was explicitly reopened to reach 20 total iterations without re-litigating the original Claudest findings.

**Scope extension:** generation 2 operates strictly in the implementation-translation space: helper contracts, verification matrices, metadata patch boundaries, analytics reader shape, startup fast-path placement, consolidation role split, portable token-observability contracts, and packet ordering.

### Generation-2 question map

| Iter | Question | Track |
|------|----------|-------|
| 13 | Q11 — smallest accurate FTS capability helper contract | fts-contract |
| 14 | Q12 — forced-degrade test matrix for FTS portability | fts-tests |
| 15 | Q13 — bounded Stop-hook metadata patch before analytics | analytics-producer |
| 16 | Q14 — normalized analytics replay schema and idempotency keys | analytics-reader |
| 17 | Q15 — SessionStart cached-summary fast path placement | startup-fast-path |
| 18 | Q16 — auditor/discoverer split mapped to Public seams | consolidation-split |
| 19 | Q17 — portable token-insight contracts | observability-contracts |
| 20 | Q18 — dependency-ordered roadmap and acceptance gates | roadmap |

### Generation-2 completion criteria

- Iterations 13-20 each append one JSONL record with `generation=2`
- `research/research.md` gains an execution-ready continuation appendix
- FTS, analytics, startup, consolidation, and observability lanes each end with an explicit packet boundary
- The live packet closes at 20 total iterations with no unresolved "research before planning" blockers

<!-- /ANCHOR:generation-2 -->
