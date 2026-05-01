### Finding 4: The right hybrid strategy is routed fusion, not equal-weight “run everything” retrieval
- **Source**: [query-router.ts:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L62), [hybrid-search.ts:1094](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1094), [hybrid-search.ts:1221](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1221), [hybrid-search.ts:2100](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L2100)
- **What it does**: Public already routes by query complexity, keeps at least two channels alive, preserves BM25 for artifact-heavy simple queries, downweights FTS after ablation because lexical flooding hurt top-K, and widens only when degradation signals fire.
- **Why it matters**: this is the strongest practical lesson from the comparison. Semantic and lexical are both valuable, but their value is query-dependent. Unconditional symmetric fusion is noisier than routed fusion.
- **Recommendation**: `adopt now`
- **Impact**: high

### Finding 5: Taxonomy and metadata filters are narrowing tools, not substitutes for lexical or semantic retrieval
- **Source**: [searcher.py:34](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L34), [layers.py:196](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L196), [README.md:54](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L54), [mcp_server.py:155](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L155)
- **What it does**: MemPalace narrows with `wing`/`room` filters and startup taxonomy/status hints; its own correction note says the “palace boost” was mostly standard metadata filtering, not a novel retrieval method.
- **Why it matters**: we should use taxonomy as a precision aid after routing, not mistake it for a third retrieval family. It helps both semantic and lexical lanes, but it does not replace either.
- **Recommendation**: `adopt now`
- **Impact**: medium

## Assessment
- New information ratio: 0.41

## Recommended Next Focus
1. Measure Public queries by failure type: paraphrase miss, exact-anchor miss, temporal miss, and structural miss, then map each to the cheapest winning lane.
2. Prototype two narrow exactness boosters inside Public’s hybrid pipeline: quoted-phrase boost and named-entity boost, both telemetry-gated and benchmarked against current FTS/BM25 lanes.
3. Write an explicit routing contract: `memory_match_triggers` for exact/reactive cues, `memory_search` for semantic/open-ended recall, `code_graph_query` for structural questions, and taxonomy filters only as narrowing/boosting aids.
--- Iteration 27 ---
## Findings
### Finding 1: Hook-driven preservation can create blocking saves without proof that good data was actually preserved
- **Source**: [mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh#L129); [mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh#L64); [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L326); [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85); [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- **What it does**: MemPalace blocks every 15 user turns and always blocks before compaction, then tells the AI to save; optional auto-ingest is backgrounded in the stop hook and synchronous only if `MEMPAL_DIR` is configured. The write path itself is weakly protected: `mempalace_add_drawer` uses deterministic IDs, but it does not actually call the semantic duplicate checker before writing.
- **Why it matters for us**: If we copy this pattern into Public, the biggest failure mode is a false sense of safety: the runtime is interrupted, but preservation quality still depends on the model following instructions correctly. That can yield duplicated memories, noisy categorization, partial saves, or blocked UX with no durable improvement. Public’s current compaction transport and JSON-primary `generate-context.js` path are much more deterministic.
- **Recommendation**: prototype later
- **Impact**: high
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

--
/bin/zsh -lc 'rg -n "''^### Finding|''^## Findings|Recommendation|Impact|adopt now|prototype later|reject|NEW FEATURE" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/research.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- **Why it matters**: This is pleasant for a solo hacker, but it creates configuration drift and harder debugging once multiple runtimes or operators are involved. Public’s JSON-primary save contract is the stronger pattern here: structured input, explicit target precedence, and validated error paths.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: `status` is not just health output, it is an embedded operator playbook
- **Source**: [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L759)
- **What it does**: Source-confirmed. `mempalace_status` returns counts plus `PALACE_PROTOCOL` and `AAAK_SPEC`, so the first health call also teaches the agent when to search, verify, diary-write, and invalidate facts.
- **Why it matters**: This is a strong DX pattern. Public already injects startup instructions and session-recovery guidance, but MemPalace is more direct about memory-specific behavior. The thing to steal is the compact “how to use memory correctly” contract, not the palace framing or AAAK baggage.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Local debugging is better than average because there are concrete artifacts to inspect
- **Source**: [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py), [external/hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md), [external/mempalace/cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1485)
- **What it does**: Source-confirmed. MemPalace logs MCP diagnostics to `stderr`, keeps a JSONL write-ahead log under `~/.mempalace/wal`, writes hook activity to `~/.mempalace/hook_state/hook.log`, and exposes explicit repair/migrate commands.
- **Why it matters**: This is worth copying. Public already does strong `stderr` startup reporting, but MemPalace’s WAL-plus-hook-log pattern is a very usable local forensic surface for “what wrote this memory and when?” and “why did a save trigger?”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Some important operational guarantees are opt-in or overstated, which weakens maintenance trust
- **Source**: [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py), [external/pyproject.toml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml), [external/tests/benchmarks/test_knowledge_graph_bench.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py)
- **What it does**: Source-confirmed. `mempalace_add_drawer` says it “checks for duplicates first,” but the actual write path only guarantees deterministic-ID idempotency; the semantic duplicate check is a separate tool. Likewise, concurrent-writer coverage exists, but only in benchmark-marked tests excluded from the default pytest path.
- **Why it matters**: DX is not just convenience, it is trust. Public should keep doing the opposite here: make default paths match the promise, and keep critical safety checks in default validation rather than benchmark-only lanes.
- **Recommendation**: reject
- **Impact**: high

## Assessment
- New information ratio: 0.54

## Recommended Next Focus
Trace failure-path DX rather than happy-path DX: onboarding/mine/general-extractor error handling, missing-or-corrupt palace recovery, empty-search ergonomics, and whether the separate KG + hooks + Chroma surfaces create operator confusion under real breakage.

RESEARCH BRIEF:
# $refine TIDD-EC Prompt: 005-mempalace

## 2. Role

You are a research specialist in verbatim AI memory systems, ChromaDB-based semantic retrieval, navigable memory taxonomies, wake-up context layering, MCP tool design, hook-driven persistence, and local temporal knowledge graphs. Work like a systems analyst who can separate README positioning from verified Python mechanics, trace how MemPalace composes mining, storage, retrieval, hooks, and protocol guidance, and translate those choices into practical improvements for `Code_Environment/Public`.

## 3. Task

Research MemPalace's raw-verbatim memory architecture, palace taxonomy, wake-up stack, MCP protocol/tooling, hook-driven save flow, and temporal knowledge-graph patterns to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around session continuity, compaction survival, memory hygiene, and agent-facing recall ergonomics. Determine which MemPalace ideas should be `adopt now`, `prototype later`, or `reject`. Keep the analysis honest about what is source-confirmed, what is README-documented, and what is benchmark-claim territory.

## 4. Context

### 4.1 System Description

MemPalace is a local Python memory system centered on a strong design claim: keep raw conversation and project text instead of extracting only summarized facts, then make that verbatim corpus searchable and navigable. The external repo exposes a CLI, an MCP server, hook scripts, a ChromaDB-backed drawer store, a wake-up layering system, and a separate SQLite temporal knowledge graph. Its storage model uses palace terminology: wings for people/projects/topics, halls for shared memory categories, rooms for named ideas, closets for compact summaries, and drawers for original verbatim content.

The most important architectural tension in this phase is that MemPalace mixes strong implementation ideas with aggressive README claims that the project itself partially corrects in its April 7, 2026 note. The raw-verbatim result is the standout claim; AAAK is explicitly experimental and lossy; contradiction detection is documented as incomplete; and some benchmark or rerank claims live more in docs than in source. This phase should reward the underlying architecture where the code supports it, but it must not let benchmark marketing or future-looking README language blur the evidence line.

The repo appears to support three ingestion shapes into one shared memory backend: project mining, conversation mining, and a general heuristic extraction mode. Retrieval then spans direct semantic search, wake-up text generation across L0-L3 layers, palace graph traversal via shared room metadata, and MCP tooling that teaches an operational memory protocol to the agent through the status response itself. Hook scripts add another layer: instead of a memory system that only responds to explicit search/save calls, MemPalace also tries to shape the timing of memory writes at stop and pre-compact boundaries.

### 4.2 Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 005 (memory server), 004 (session continuity) | Focus tool profiles, session lifecycle, topic keys |
| 002 | Mex | Markdown scaffold + drift detection | 005 (project knowledge) | Focus drift detection, scaffold structure, no-DB approach |
| 003 | Modus Memory | FSRS spaced repetition + BM25 | 005 (local memory) | Focus FSRS decay, BM25, librarian expansion, cross-references |
| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 005 (compaction, hybrid retrieval claims) | Focus plugin architecture, project/global scoping, wrapper boundary |
| 005 | MemPalace | Raw verbatim storage + palace taxonomy + hooks + temporal KG | 001 (MCP memory), 004 (compaction/helping memory survive), 003 (local memory) | Focus raw-no-extraction posture, wake-up layers, hooks, palace structure, temporal KG |

### 4.3 What This Repo Already Has

`Code_Environment/Public` already has Spec Kit Memory with hybrid retrieval, `memory_search`, `memory_context`, `memory_match_triggers`, memory-save flows through `generate-context.js`, session/bootstrap handling in the memory MCP server, and compaction-oriented structural transport via `.opencode/plugins/spec-kit-compact-code-graph.js`. It also already has semantic code search via CocoIndex and structured graph context via Compact Code Graph.

What it does **not** currently have is a raw-verbatim-by-default memory posture comparable to MemPalace's drawer model, a first-class wing/hall/room taxonomy for agent memory navigation, a dedicated L0/L1/L2/L3 wake-up stack for context loading, MemPalace-style stop/pre-compact save hooks that actively block to force preservation, or a separate temporal entity-triple knowledge graph with explicit invalidation alongside the main memory store. The comparison should stay anchored to those gaps rather than repeating generic hybrid-RAG analysis already covered elsewhere.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Read the governing Public repo `AGENTS.md` first. Then explicitly verify whether `external/AGENTS.md` exists. If it does not, note that absence as evidence about repo scope rather than inventing external workflow constraints.
3. Before deep research begins, ensure this phase folder contains Level 3 Spec Kit docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`.
4. Use `@speckit` for markdown authoring when the runtime supports agent routing. If routing is unavailable, preserve existing Spec Kit Level 3 structure manually without creating side-channel docs outside the phase folder.
5. Start with `external/README.md`, but read it critically. Cover these sections in order: the April 7, 2026 correction note; Quick Start; How You Actually Use It; The Palace; wake-up / AAAK sections; MCP tools; benchmark sections. Capture both the architecture claims and the repo's own admitted overstatements.
6. Immediately after the README, read `external/pyproject.toml` and `external/mempalace/cli.py`. Confirm the actual runtime boundary, command surface, install assumptions, and the core flows for `init`, `mine`, `search`, `wake-up`, `status`, `repair`, and `compress`.
7. Trace the MCP surface end to end in `external/mempalace/mcp_server.py`. Focus on tool registration, read/write split, stderr logging behavior, `PALACE_PROTOCOL`, `AAAK_SPEC`, status bootstrap behavior, duplicate checking, graph tools, knowledge-graph tools, diary tools, and what the tool names imply about agent discipline.
8. Trace retrieval and context loading next in `external/mempalace/searcher.py` and `external/mempalace/layers.py`. Capture the raw ChromaDB query path, wing/room filtering, L0/L1/L2/L3 layering, wake-up token assumptions, and how much of that layering is implementation versus README framing.
9. Trace structural navigation next in `external/mempalace/palace_graph.py` and `external/mempalace/knowledge_graph.py`. Keep these separate in your notes: palace graph traversal is metadata-derived from ChromaDB rooms/halls/wings, while the knowledge graph is a separate SQLite temporal triple store with invalidation.
10. Trace ingestion behavior next. Read `external/mempalace/miner.py`, `external/mempalace/convo_miner.py`, `external/mempalace/general_extractor.py`, and `external/mempalace/onboarding.py`. Focus on chunking strategy, room detection, no-summary posture, heuristic extraction, onboarding assumptions, and whether the system truly keeps everything or selectively restructures it during ingest.
11. Read hook and benchmark artifacts after the implementation core: `external/hooks/README.md`, `external/hooks/mempal_save_hook.sh`, `external/hooks/mempal_precompact_hook.sh`, and `external/benchmarks/BENCHMARKS.md`. Treat these as crucial to the product story, but distinguish carefully between executable behavior, experimental behavior, and benchmark claims that require caution.
12. Compare MemPalace directly against current `Code_Environment/Public` code: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`, `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`, and `.opencode/plugins/spec-kit-compact-code-graph.js`. Be explicit about what Public already covers better and what MemPalace still contributes.
13. Before the main research pass, validate the phase folder with this exact command:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace" --strict
    ```
14. After validation passes, run `spec_kit:deep-research` with this exact topic:
    ```text
    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external and identify concrete improvements for Code_Environment/Public, especially around raw verbatim memory storage, palace taxonomy (wings/halls/rooms), wake-up context layering, MCP protocol/tool design, hook-driven save flows, and temporal knowledge-graph patterns.
    ```
15. Save all outputs inside `research/`, with `research/research.md` as the canonical report. Every meaningful finding must cite exact file paths, say whether the evidence is `source-confirmed`, `README-documented`, `benchmark-documented`, or mixed, explain why it matters for `Code_Environment/Public`, classify the recommendation as `adopt now`, `prototype later`, or `reject`, identify the affected subsystem, and note migration or truthfulness risk. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace"
    ```

## 6. Research Questions

1. What does MemPalace gain from its raw-verbatim "store everything, then make it findable" posture, and where would that improve or conflict with Spec Kit Memory's more selective save and retrieval model?
2. How useful is the wing / hall / room / closet / drawer taxonomy in practice: does it materially improve navigation and recall, or does it mostly reframe metadata filtering in memorable language?
3. How does the L0/L1/L2/L3 wake-up stack compare with Public's `session_bootstrap`, `memory_context`, and compaction-recovery flows, and what parts of the layering model are reusable here?
4. What does `mcp_server.py` gain by embedding `PALACE_PROTOCOL` and `AAAK_SPEC` directly in the status bootstrap, and could Public benefit from similarly direct memory-usage guidance without adding prompt clutter?
5. How effective are the stop-hook and pre-compact-hook patterns at protecting context before loss, and how do they compare to Public's existing compaction-oriented structural plugin and memory-save workflows?
6. What are the real architectural consequences of keeping the temporal knowledge graph separate from the drawer store, especially around invalidation, diary entries, and fact-vs-verbatim boundaries?
7. How much of MemPalace's benchmark story is supported directly by code in this repo, and which claims should remain benchmark candidates or doc-level references rather than implementation truths?
8. How do `miner.py`, `convo_miner.py`, and `general_extractor.py` balance "store everything" against chunking, heuristics, room assignment, and extraction side paths?
9. Which MemPalace ideas most improve compaction survival and startup continuity for future Public sessions: wake-up layers, hook timing, memory protocol bootstrapping, diary writing, or taxonomy-based narrowing?
10. Which MemPalace features are genuinely reusable architecture, and which are presentation choices, experimental layers, or hype-prone claims that Public should not copy?
11. How should AAAK be evaluated honestly: as a useful optional compression dialect, a still-unproven context-loading experiment, or mostly a distraction from the stronger raw-verbatim baseline?

## 7. Do's

- Do distinguish raw verbatim storage from AAAK compression; they are not the same feature and do not have the same evidence quality.
- Do separate palace graph traversal from the temporal knowledge graph; one is metadata-derived navigation and the other is explicit fact storage with validity windows.
- Do inspect the actual hook scripts, not just their README, so the analysis captures the precise blocking behavior before save and compaction.
- Do compare MemPalace's wake-up flow against current Public bootstrap and compaction behavior using real Public files.
- Do treat the April 7, 2026 correction note as important evidence about truthfulness boundaries and product honesty.
- Do analyze how status/bootstrap responses teach the agent what to do, not just what data they return.
- Do map strong findings to specific Public subsystems such as Spec Kit Memory retrieval, context bootstrap, save flows, or compaction handling.

## 8. Don'ts

- Do not describe MemPalace as "just ChromaDB search"; the repo's differentiators are raw-storage posture, wake-up layers, hooks, taxonomy, and KG split.
- Do not treat README benchmark numbers as fully source-proven implementation facts unless the repo actually exposes the relevant pipeline.
- Do not recommend copying AAAK or benchmark marketing language wholesale into Public planning.
- Do not collapse this phase into generic hybrid-RAG analysis already owned by earlier phases.
- Do not ignore the repo's admitted inaccuracies or unresolved claims; they are central to evaluating whether an idea is production-worthy.
- Do not overlook the difference between "AI remembers because storage exists" and "AI remembers because the protocol tells it when and how to use storage."
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example A: Wake-up and protocol finding

```text
**Finding: Status doubles as a behavior bootstrap, not just a health check**
- Source: external/mempalace/mcp_server.py; external/mempalace/layers.py
- Evidence type: source-confirmed
- What it does: `mempalace_status` returns palace overview data plus `PALACE_PROTOCOL` and `AAAK_SPEC`, while the wake-up stack separately loads L0/L1 context for cheap startup continuity.
- Why it matters: Public already has resume/bootstrap tooling, but it does not currently use one memory-facing status surface to teach concrete retrieval and save behavior this directly.
- Recommendation: prototype later
- Affected area: memory bootstrap UX, session recovery guidance, compaction recovery behavior
- Risk/cost: Medium; could add prompt noise or duplicate existing guidance if not scoped carefully
```

### Example B: Hook-driven preservation finding

```text
**Finding: Save timing is enforced by hooks, not left to agent initiative alone**
- Source: external/hooks/mempal_save_hook.sh; external/hooks/mempal_precompact_hook.sh; external/hooks/README.md
- Evidence type: source-confirmed + README-documented
- What it does: the stop hook blocks every N human exchanges and the pre-compact hook always blocks, forcing the agent to preserve key context before loss.
- Why it matters: Public has compaction-oriented structural transport, but it does not currently enforce a comparable memory-preservation checkpoint before context collapse.
- Recommendation: adopt now or prototype later, depending on runtime surface
- Affected area: memory save automation, compaction resilience, agent operating protocol
- Risk/cost: Medium; intrusive save prompts and duplicate writes need guardrails
```

## 10. Constraints

### 10.1 Error handling

- If a README or benchmark claim is not directly supported by source, label it clearly as documentation- or benchmark-level evidence rather than implementation fact.
- If MemPalace's docs contradict its code or its own April 2026 correction note, prefer source evidence and call out the contradiction explicitly.
- If comparison assumptions about current `Code_Environment/Public` behavior are outdated, correct them in the research instead of preserving stale framing.
- If the external repo structure differs from the paths named here, preserve the same analytical order and document the actual files used.

### 10.2 Scope

**IN SCOPE**

- raw verbatim storage and no-summary posture
- palace taxonomy: wings, halls, rooms, closets, drawers
- L0/L1/L2/L3 wake-up layering
- MCP server design, status bootstrap, protocol guidance, diary tools
- stop and pre-compact hook behavior
- temporal knowledge graph and invalidation model
- mining modes, chunking, heuristics, onboarding
- benchmark and README truthfulness boundaries
- comparison against current Public memory, bootstrap, save, and compaction flows

**OUT OF SCOPE**

- generic Python style commentary
- speculative cloud scaling or hosted-service redesigns
- broad vector-database taxonomy disconnected from MemPalace evidence
- re-litigating BM25/FSRS/plugin topics already owned by earlier phases
- editing or fixing MemPalace itself

### 10.3 Prioritization framework

Rank findings in this order: leverage for Public session continuity, compaction-survival value, truthfulness and evidence quality, fit with current Spec Kit Memory capabilities, operational simplicity, memory-hygiene impact, and clean differentiation from phases `001` through `004`.

## 11. Deliverables

- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` present and valid before deep research starts
- `research/research.md` as the canonical report with at least 5 evidence-backed findings
- explicit comparison against current Public memory retrieval, bootstrap, save, and compaction behavior
- each finding labeled `adopt now`, `prototype later`, or `reject`
- each finding states evidence type: `source-confirmed`, `README-documented`, `benchmark-documented`, or mixed
- `implementation-summary.md` created at the end
- memory saved from this phase folder using `generate-context.js`

Minimum finding schema:

- finding title
- exact source evidence
- evidence type
- what MemPalace does
- why it matters for `Code_Environment/Public`
- recommendation: `adopt now`, `prototype later`, or `reject`
- affected subsystem
- migration, ambiguity, or truthfulness risk

## 12. Evaluation Criteria

- CLEAR target: `>= 40/50`
- RICCE compliance is visible in the prompt:
  - **Role** is specialized in verbatim memory systems, wake-up layering, MCP protocol design, hooks, and temporal KG behavior
  - **Instructions** are ordered, concrete, path-specific, and honest about evidence boundaries
  - **Context** is domain-specific, cross-phase aware, and corrected for current Public capabilities
  - **Constraints** clearly separate source-confirmed behavior from README or benchmark claims
  - **Examples** show strong MemPalace-derived findings about protocol bootstrapping and hook-driven preservation
- at least 5 findings are evidence-backed rather than speculative
- findings explicitly separate raw-mode strengths from AAAK's experimental status
- findings compare MemPalace against today's Public bootstrap and compaction behavior rather than a stale baseline
- cross-phase overlap with `001` through `004` is explicitly bounded so this phase stays focused on raw-verbatim architecture, wake-up layers, hooks, and KG split

## 13. Completion Bar

The phase is only complete when all of the following are true:

- the reading order covered README honesty notes, CLI/runtime boundaries, MCP server, retrieval layers, palace graph, temporal KG, ingest pipeline, hooks, and benchmarks
- current `Code_Environment/Public` memory/bootstrap/compaction behavior was compared using code, not assumptions
- the validation command passed on this exact phase folder
- the exact deep-research topic string appears in the work
- `research/research.md` contains at least 5 evidence-backed findings
- each finding distinguishes source-confirmed behavior from README or benchmark claims where needed
- `checklist.md` is updated with evidence and completion marks
- `implementation-summary.md` exists
- memory is saved successfully for `005-mempalace`
- no edits were made outside this phase folder
- recommendations explicitly address raw storage, taxonomy, wake-up layering, hooks, and temporal KG patterns

OUTPUT FORMAT:
# Iteration 028: BENCHMARK & METRICS

## Focus
BENCHMARK & METRICS: What does this system measure? What metrics should we track for memory quality, retrieval accuracy, and system health?

## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

## Assessment
- New information ratio: [0.0-1.0]

## Recommended Next Focus
[next direction]
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only research pass for iteration 28 focused on MemPalace benchmarking and metrics, then mapping that to concrete measurement recommendations for Spec Kit Memory. I’ll first do a quick memory pass and verify the external repo scope, then read the benchmark/metrics surfaces in both MemPalace and our current memory stack before synthesizing the iteration output.
exec
/bin/zsh -lc 'test -f /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md && echo EXISTS || echo MISSING' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
EXISTS

exec
/bin/zsh -lc 'rg -n "mempalace|benchmark|metrics|hybrid-rag-fusion|005-mempalace" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
25:- packet 013 benchmark evidence should cite `38/40` combined benchmark in checklist/report surfaces; stale `pass 28` wording is a known traceability finding trigger [Task 1]
293:- 005-mempalace, phase-research-prompt.md, dont ask for a spec folder, 13-section TIDD-EC, source-confirmed README-documented benchmark-documented, raw-verbatim hooks taxonomy temporal KG
367:- when the user asked to "create a similar prompt for ...005-mempalace ... dont ask for a spec folder," place `phase-research-prompt.md` in the phase root and skip new spec-folder scaffolding [Task 1]
379:- prompt authoring pattern for this packet family: keep the 13-section TIDD-EC structure, include ordered evidence reading, and force evidence tags (`source-confirmed`, `README-documented`, `benchmark-documented`) per finding [Task 1]
380:- MemPalace-specific guardrails that proved useful: AAAK remains experimental/lossy, raw ChromaDB verbatim posture is baseline, and benchmark/README claims need code-backed verification before adoption [Task 1]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
685:- symptom: deep-review reducer-schema tests fail during closeout; cause: config metadata drift (`metrics` missing, `.deep-review-pause` mutability mismatch); fix: align config/docs with test schema before rerunning suites [Task 3]
1073:- rollout_summaries/2026-03-28T09-47-16-BtZ6-ablation_benchmark_integrity.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T10-47-16-019d33d7-38dc-7343-8b10-d28cc9573e58.jsonl, updated_at=2026-03-28T10:51:34+00:00, thread_id=019d33d7-38dc-7343-8b10-d28cc9573e58)
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1274:- Advisor benchmark/regression commands need explicit `--dataset` and semantic-disable env toggle for stable timing [Task 1]
1278:- symptom: benchmark p95 unexpectedly high; cause: builtin semantic latency noise; fix: disable builtin semantic path during benchmark runs [Task 1]
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

codex
I found prior memory that specifically points to this `005-mempalace` phase and reinforces two useful guardrails for this pass: keep the 13-section evidence discipline, and treat README/benchmark claims as weaker than code-backed behavior. I also verified that `external/AGENTS.md` does exist here, so I’m reading that next before I inspect the benchmark and metrics code paths.
exec
/bin/zsh -lc "sed -n '288,305p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

- rollout_summaries/2026-04-08T06-49-08-WFmZ-mem_palace_phase_prompt.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-49-08-019d6bda-1819-7e43-99e3-158cdec78925.jsonl, updated_at=2026-04-08T06:56:04+00:00, thread_id=019d6bda-1819-7e43-99e3-158cdec78925)

### keywords

- 005-mempalace, phase-research-prompt.md, dont ask for a spec folder, 13-section TIDD-EC, source-confirmed README-documented benchmark-documented, raw-verbatim hooks taxonomy temporal KG

## Task 2: Extend Contextador deep-research from 13 to 20 iterations and fold into v2 synthesis without changing verdict, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-08T06-55-41-FaWO-contextador_deep_research_extension.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-55-41-019d6be0-1720-7040-8abd-586be20dce1e.jsonl, updated_at=2026-04-08T07:50:02+00:00, thread_id=019d6be0-1720-7040-8abd-586be20dce1e)

### keywords

- 003-contextador, spec_kit:deep-research, maxIterations 20, deep-research-config.json, reduce-state.cjs, research-v2.md, recommendations-v2.md, findings-registry-v2.json, F-CROSS-089..F-CROSS-093

## Task 3: Absorb Claudest continuation into master v2 execution-ready lane, outcome success

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# AGENTS.md

> How to build, test, and contribute to MemPalace.

## Setup

```bash
pip install -e ".[dev]"
```

## Commands

```bash
# Run tests
python -m pytest tests/ -v --ignore=tests/benchmarks

# Run tests with coverage
python -m pytest tests/ -v --ignore=tests/benchmarks --cov=mempalace --cov-report=term-missing

# Lint
ruff check .

# Format
ruff format .

# Format check (CI mode)
ruff format --check .
```

## Project structure

```
mempalace/
├── mcp_server.py        # MCP server — all read/write tools
├── miner.py             # Project file miner
├── convo_miner.py       # Conversation transcript miner
├── searcher.py          # Semantic search
├── knowledge_graph.py   # Temporal entity-relationship graph (SQLite)
├── palace.py            # Shared palace operations (ChromaDB access)
├── config.py            # Configuration + input validation
├── normalize.py         # Transcript format detection + normalization
├── cli.py               # CLI dispatcher
├── dialect.py           # AAAK compression dialect
├── palace_graph.py      # Room traversal + cross-wing tunnels
├── hooks_cli.py         # Hook system for auto-save
└── version.py           # Single source of truth for version
```

## Conventions

- **Python style**: snake_case for functions/variables, PascalCase for classes
- **Linter**: ruff with E/F/W rules
- **Formatter**: ruff format, double quotes
- **Commits**: conventional commits (`fix:`, `feat:`, `test:`, `docs:`, `ci:`)
- **Tests**: `tests/test_*.py`, fixtures in `tests/conftest.py`
- **Coverage**: 85% threshold (80% on Windows due to ChromaDB file lock cleanup)

## Architecture

```
User → CLI / MCP Server → ChromaDB (vector store) + SQLite (knowledge graph)

Palace structure:
  WING (person/project)
    └── ROOM (topic)
          └── DRAWER (verbatim text chunk)

Knowledge Graph:
  ENTITY → PREDICATE → ENTITY (with valid_from / valid_to dates)
```

## Key files for common tasks

- **Adding an MCP tool**: `mempalace/mcp_server.py` — add handler function + TOOLS dict entry
- **Changing search**: `mempalace/searcher.py`
- **Modifying mining**: `mempalace/miner.py` (project files) or `mempalace/convo_miner.py` (transcripts)
- **Input validation**: `mempalace/config.py` — `sanitize_name()` / `sanitize_content()`
- **Tests**: mirror source structure in `tests/test_<module>.py`

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
I’ve confirmed the external repo has its own scoped instructions, and they’re useful here mainly because they tell us benchmark tests are intentionally excluded from the default pytest path. I’m moving into the actual metric surfaces now: benchmark docs and tests on the MemPalace side, then the feedback, evaluation, and health surfaces on our side so the comparison stays evidence-based.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "printf '\\n== README benchmarks ==\\n' && rg -n \"April 7|benchmark|latency|accuracy|recall|precision|duplicate|coverage|health|status|metric\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md && printf '\\n== BENCHMARKS ==\\n' && rg -n \"recall|precision|latency|benchmark|accuracy|throughput|concurrent|kg|knowledge graph|duplicate|coverage|memory\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md && printf '\\n== tests/benchmarks ==\\n' && rg -n \"benchmark|latency|concurrent|recall|precision|accuracy|kg|knowledge graph|duplicate|health\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

== README benchmarks ==
7:### The highest-scoring AI memory system ever benchmarked. And it's free.
19:**AAAK (experimental)** — A lossy abbreviation dialect for packing repeated entities into fewer tokens at scale. Readable by any LLM that reads text — Claude, GPT, Gemini, Llama, Mistral — no decoder needed. **AAAK is a separate compression layer, not the storage default**, and on the LongMemEval benchmark it currently regresses vs raw mode (84.2% vs 96.6%). We're iterating. See the [note above](#a-note-from-milla--ben--april-7-2026) for the honest status.
32:[Quick Start](#quick-start) · [The Palace](#the-palace) · [AAAK Dialect](#aaak-dialect-experimental) · [Benchmarks](#benchmarks) · [MCP Tools](#mcp-server)
46:<sub>Reproducible — runners in <a href="benchmarks/">benchmarks/</a>. <a href="benchmarks/BENCHMARKS.md">Full results</a>. The 96.6% is from <b>raw verbatim mode</b>, not AAAK or rooms mode (those score lower — see <a href="#a-note-from-milla--ben--april-7-2026">note above</a>).</sub>
52:## A Note from Milla & Ben — April 7, 2026
60:> - **"30x lossless compression" was overstated.** AAAK is a lossy abbreviation system (entity codes, sentence truncation). Independent benchmarks show AAAK mode scores **84.2% R@5 vs raw mode's 96.6%** on LongMemEval — a 12.4 point regression. The honest framing is: AAAK is an experimental compression layer that trades fidelity for token density, and **the 96.6% headline number is from RAW mode, not AAAK**.
66:> - **"100% with Haiku rerank"** is real (we have the result files) but the rerank pipeline is not in the public benchmark scripts. We're adding it.
77:> 2. Adding `mode raw / aaak / rooms` clearly to the benchmark documentation so the trade-offs are visible
104:mempalace status
202:Inside those closets are **drawers**, and those drawers are where your original files live. In this first version, we haven't used AAAK as a closet tool, but even so, the summaries have shown **96.6% recall** in all the benchmarks we've done across multiple benchmarking platforms. Once the closets use AAAK, searches will be even faster while keeping every word exact. But even now, the closet approach has been a huge boon to how much info is stored in a small space — it's used to easily point your AI agent to the drawer where your original file lives. You never lose anything, and all this happens in seconds.
281:| **L2** | Room recall — recent sessions, current project | On demand | When topic comes up |
290:**Honest status (April 2026):**
296:- **The MemPalace storage default is raw verbatim text in ChromaDB** — that's where the benchmark wins come from. AAAK is a separate compression layer for context loading, not the storage format.
467:| `mempalace_status` | Palace overview + AAAK spec + memory protocol |
472:| `mempalace_check_duplicate` | Check before filing |
507:The AI learns AAAK and the memory protocol automatically from the `mempalace_status` response. No manual configuration.
534:Tested on standard academic benchmarks — reproducible, published datasets.
587:mempalace status                                  # palace overview
669:├── benchmarks/                ← reproducible benchmark runners

== BENCHMARKS ==
9:Every competitive memory system uses an LLM to manage memory:
12:- Supermemory uses an LLM to run agentic search passes
18:That's the finding. The field is over-engineering the memory extraction step. Raw verbatim text with good embeddings is a stronger baseline than anyone realized — because it doesn't lose information. When an LLM extracts "user prefers PostgreSQL" and throws away the original conversation, it loses the context of *why*, the alternatives considered, the tradeoffs discussed. MemPal keeps all of that, and the search model finds it.
36:The 100% is the competitive story: a perfect score on the standard benchmark for AI memory, verified across all 500 questions and all 6 question types — reproducible with either Haiku or Sonnet as the reranker.
47:| 2 | Supermemory ASMR | ~99% | Yes | Undisclosed | Research only, not in production |
53:| 7 | Supermemory (production) | ~85% | Yes | Undisclosed | — |
75:MemPal is more than 2× Mem0 on this benchmark. With Sonnet rerank, MemPal reaches **100% on LoCoMo** across all 5 question types including temporal-inference (was 46% at baseline).
77:**Why MemPal beats Mem0 by 2×:** Mem0 uses an LLM to extract memories — it decides what to remember and discards the rest. When it extracts the wrong thing, the memory is gone. MemPal stores verbatim text. Nothing is discarded. The simpler approach wins because it doesn't lose information.
100:| Wings v1 (broken — filter not boost) | — | 58.0% | None | Speaker WHERE filter discarded evidence; 5.4% coverage |
125:Wings v3 design: one closet per speaker per session. Owner's turns verbatim; other speaker's turns as `[context]` labels. 38 closets/conversation vs 184 (v2) → 26% coverage with top-10. Adversarial score (92.8%) exceeds bge-large overall (92.4%) — speaker ownership almost completely solves the speaker-confusion category.
127:Root cause of wings v1 failure: (1) speaker WHERE filter discarded evidence about Caroline when evidence lived in a John-tagged closet (John spoke more words but conversation was about Caroline); (2) top_k=10 from ~184 closets = 5.4% coverage vs 37% in session mode. Fix: retrieve all closets, use speaker match as 15% distance boost instead of filter.
190:When query keywords appear verbatim in a session, that session gets a small boost. The boost is mild enough not to hurt recall when keywords don't match.
271:The palace classifies each question into one of 5 halls. Pass 1 searches only within that hall — high precision, catches the obvious match. Pass 2 searches the full corpus with the hall affinity as a tiebreaker — catches cases where the relevant session was miscategorized.
277:### Active Work: Diary Mode (98.2% at 65% cache coverage)
285:**Current status:** 98% cache coverage (18,803 of 19,195 sessions pre-computed). The overnight cache build is complete. Full benchmark run pending — expected to reach ≥99.4% once asymmetry from the remaining ~2% uncovered sessions is eliminated.
311:git clone -b ben/benchmarking https://github.com/aya-thekeeper/mempal.git
322:python benchmarks/longmemeval_bench.py \
329:python benchmarks/longmemeval_bench.py \
337:python benchmarks/longmemeval_bench.py \
347:python benchmarks/longmemeval_bench.py \
357:python benchmarks/longmemeval_bench.py \
368:python benchmarks/longmemeval_bench.py \
382:python benchmarks/longmemeval_bench.py \
393:python benchmarks/convomem_bench.py --category all --limit 50
400:python benchmarks/locomo_bench.py /tmp/locomo/data/locomo10.json --granularity session
406:python benchmarks/locomo_bench.py /tmp/locomo/data/locomo10.json \
419:Every major AI memory system and where it stands:
424:| Supermemory | Agentic LLM search (ASMR) | ~99% (exp) / ~85% (prod) | LLM API | Production + experimental tracks |
427:| Mem0 | LLM fact extraction | 30–45% (ConvoMem) | LLM API | Popular, weak on benchmarks |
430:| Zep | Graph-based memory + entity ext | Not published | LLM API + graph DB | Enterprise-focused |
443:| Retrieval accuracy | 96.6% (99.4% w/ LLM) | 91–99% | Not published |
477:A proper split has been created: `benchmarks/lme_split_50_450.json` (seed=42).
485:python benchmarks/longmemeval_bench.py data/... --create-split --split-file benchmarks/lme_split_50_450.json
488:python benchmarks/longmemeval_bench.py data/... --mode hybrid_v4 --dev-only --split-file benchmarks/lme_split_50_450.json
491:python benchmarks/longmemeval_bench.py data/... --mode hybrid_v4 --held-out --split-file benchmarks/lme_split_50_450.json
506:**The scripts are deterministic.** Same data + same script = same result every time. ChromaDB's embeddings are deterministic. The benchmark uses a fixed dataset with no randomness.
510:**The results are auditable.** Every result JSONL file in `benchmarks/results_*.jsonl` contains every question, every retrieved document, every score. You can inspect every individual answer — not just the aggregate.
512:**What "retrieval recall" means here.** These scores measure whether the correct session is in the top-K retrieved results. They do *not* measure whether an LLM can correctly answer the question using that retrieval. End-to-end QA accuracy measurement requires an LLM to generate answers, which requires an API key. The retrieval measurement itself is free.
514:**The LLM rerank is optional, not required.** The 96.6% baseline needs no API key at any stage — not for indexing, not for retrieval, not for scoring. The 99.4% result adds an optional Haiku rerank step that costs approximately $0.001 per question. This is standard practice: Supermemory ASMR, Mastra, and Hindsight all use LLMs in their retrieval pipelines.
546:- A non-commercial team built a memory system that beats commercial products with dedicated engineering.
547:- The key insight is *removal*, not addition — stop trying to extract and compress memory with LLMs; just keep the words.
604:**Architecture v1 (global taxonomy routing):** Haiku assigns each session to a room at index time. At query time, Haiku routes question to 1-2 rooms. **Result: 34.2% R@5** — 62.5% zero-recall. Failure: independent LLM calls with no shared context produced terminology mismatch between index-time labels and query-time routing.
608:| Version | R@5 | R@10 | Zero-recall | Notes |
652:| simple | **95.9%** | Single-turn fact recall |
680:python benchmarks/longmemeval_bench.py /tmp/longmemeval-data/longmemeval_s_cleaned.json \
682:  --held-out --split-file benchmarks/lme_split_50_450.json \
694:python benchmarks/longmemeval_bench.py /tmp/longmemeval-data/longmemeval_s_cleaned.json \
705:python benchmarks/locomo_bench.py /tmp/locomo/data/locomo10.json \
718:python benchmarks/locomo_bench.py /tmp/locomo/data/locomo10.json \

== tests/benchmarks ==
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:5:Uses planted needles to measure recall with and without filtering
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:13:from tests.benchmarks.data_generator import PalaceDataGenerator
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:14:from tests.benchmarks.report import record_metric
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:17:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:19:    """Quantify palace boost: recall improvement from wing/room filtering."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:24:    def test_palace_boost_recall(self, n_drawers, tmp_path, bench_scale):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:25:        """Compare recall@5 with/without wing filter at increasing scale."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:66:        recall_none = unfiltered_hits / max(n_queries, 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:67:        recall_wing = wing_filtered_hits / max(n_queries, 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:68:        recall_room = room_filtered_hits / max(n_queries, 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:70:        boost_wing = recall_wing - recall_none
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:71:        boost_room = recall_room - recall_none
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:73:        record_metric("palace_boost", f"recall_unfiltered_at_{n_drawers}", round(recall_none, 3))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:74:        record_metric("palace_boost", f"recall_wing_filtered_at_{n_drawers}", round(recall_wing, 3))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:75:        record_metric("palace_boost", f"recall_room_filtered_at_{n_drawers}", round(recall_room, 3))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:80:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:82:    """Does filtering reduce query latency by narrowing the search space?"""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:85:        """Compare latency: no filter vs wing vs wing+room."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:122:        record_metric("filter_latency", "avg_unfiltered_ms", round(avg_none, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:123:        record_metric("filter_latency", "avg_wing_filtered_ms", round(avg_wing, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:124:        record_metric("filter_latency", "avg_room_filtered_ms", round(avg_room, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:127:                "filter_latency", "wing_speedup_pct", round((1 - avg_wing / avg_none) * 100, 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:130:                "filter_latency", "room_speedup_pct", round((1 - avg_room / avg_none) * 100, 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:134:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:139:        """Measure wing-filtered recall improvement at multiple sizes."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:167:            recall_none = unfiltered_hits / max(n_queries, 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:168:            recall_filtered = filtered_hits / max(n_queries, 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py:169:            boost = recall_filtered - recall_none
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:36:    Compare current benchmark results against a baseline.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:49:    # "improvement" is checked before "latency" so that composite names
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:50:    # like "latency_improvement_pct" are classified correctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:53:        "recall",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:62:        "latency",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:2:Knowledge graph benchmarks — SQLite temporal KG at scale.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:4:Tests triple insertion throughput, query latency, temporal accuracy,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:5:and SQLite concurrent access behavior.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:13:from tests.benchmarks.data_generator import PalaceDataGenerator
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:14:from tests.benchmarks.report import record_metric
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:17:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:24:        entities, triples = gen.generate_kg_triples(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:30:        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:34:            kg.add_entity(name, etype)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:39:            kg.add_triple(subject, predicate, obj, valid_from=valid_from, valid_to=valid_to)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:44:        record_metric("kg_insert", f"triples_per_sec_at_{n_triples}", round(triples_per_sec, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:45:        record_metric("kg_insert", f"elapsed_sec_at_{n_triples}", round(elapsed, 3))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:48:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:50:    """Query latency for entities with varying relationship counts."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:52:    def test_query_latency_vs_relationships(self, tmp_path):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:56:        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:59:        kg.add_entity("Hub", "person")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:65:                kg.add_entity(entity_name, "project")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:66:                kg.add_triple("Hub", "works_on", entity_name, valid_from="2025-01-01")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:72:            kg.query_entity("Hub")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:79:        record_metric("kg_query", f"avg_ms_with_{total_rels}_rels", round(avg_ms, 2))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:80:        record_metric("kg_query", "total_relationships", total_rels)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:83:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:88:    def test_timeline_latency(self, n_triples, tmp_path):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:92:        entities, triples = gen.generate_kg_triples(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:96:        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:98:            kg.add_entity(name, etype)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:100:            kg.add_triple(subject, predicate, obj, valid_from=valid_from, valid_to=valid_to)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:106:            kg.timeline()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:111:        record_metric("kg_timeline", f"avg_ms_at_{n_triples}", round(avg_ms, 2))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:114:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:122:        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:124:        kg.add_entity("Alice", "person")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:125:        kg.add_entity("ProjectA", "project")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:126:        kg.add_entity("ProjectB", "project")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:129:        kg.add_triple(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:133:        kg.add_triple("Alice", "works_on", "ProjectB", valid_from="2024-07-01")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:137:        entities, triples = gen.generate_kg_triples(n_entities=50, n_triples=500)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:139:            kg.add_entity(name, etype)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:141:            kg.add_triple(subject, predicate, obj, valid_from=valid_from, valid_to=valid_to)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:144:        result_march = kg.query_entity("Alice", as_of="2024-03-15")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:146:        result_sept = kg.query_entity("Alice", as_of="2024-09-15")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:149:            "kg_temporal",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:154:            "kg_temporal",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:160:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:162:    """Test concurrent read/write behavior with SQLite (finding #8)."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:164:    def test_concurrent_writers(self, tmp_path):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:168:        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:172:            kg.add_entity(f"Entity_{i}", "concept")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:184:                    kg.add_triple(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:207:        record_metric("kg_concurrent", "total_failures", total_failures)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:208:        record_metric("kg_concurrent", "total_successes", total_successes)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:209:        record_metric("kg_concurrent", "elapsed_sec", round(elapsed, 2))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:210:        record_metric("kg_concurrent", "threads", n_threads)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:211:        record_metric("kg_concurrent", "triples_per_thread", triples_per_thread)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:213:    def test_concurrent_read_write(self, tmp_path):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:217:        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:221:            kg.add_entity(f"E_{i}", "concept")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:223:            kg.add_triple(f"E_{i % 50}", "links", f"E_{(i + 1) % 50}", valid_from="2025-01-01")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:232:                    kg.query_entity(f"E_{i % 50}")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:241:                    kg.add_triple(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:259:        record_metric("kg_concurrent_rw", "read_errors", sum(read_errors))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:260:        record_metric("kg_concurrent_rw", "write_errors", sum(write_errors))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:263:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:268:    def test_stats_latency(self, n_triples, tmp_path):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:272:        entities, triples = gen.generate_kg_triples(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:276:        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:278:            kg.add_entity(name, etype)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:280:            kg.add_triple(subject, predicate, obj, valid_from=valid_from, valid_to=valid_to)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:285:            kg.stats()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py:290:        record_metric("kg_stats", f"avg_ms_at_{n_triples}", round(avg_ms, 2))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/__init__.py:1:# MemPalace scale benchmark suite
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:4:The palace_boost tests showed room-filtered recall of 1.0, but only because
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:16:from tests.benchmarks.data_generator import PalaceDataGenerator
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:17:from tests.benchmarks.report import record_metric
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:103:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:114:    def test_single_room_recall(self, n_drawers, tmp_path):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:147:        recall_5 = hits_at_5 / n_queries
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:148:        recall_10 = hits_at_10 / n_queries
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:150:        record_metric("single_room_recall", f"recall_at_5_at_{n_drawers}", round(recall_5, 3))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:151:        record_metric("single_room_recall", f"recall_at_10_at_{n_drawers}", round(recall_10, 3))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:154:    def test_single_room_no_filter_recall(self, n_drawers, tmp_path):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:178:        recall_5 = hits_at_5 / n_queries
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:179:        recall_10 = hits_at_10 / n_queries
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:181:        record_metric("single_room_unfiltered", f"recall_at_5_at_{n_drawers}", round(recall_5, 3))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py:182:        record_metric("single_room_unfiltered", f"recall_at_10_at_{n_drawers}", round(recall_10, 3))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:3:106 tests that benchmark mempalace at scale to validate real-world performance limits.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:12:- How does query latency degrade as the palace grows from 1K to 100K drawers?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:14:- At what per-room drawer count does recall break regardless of filtering?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:22:uv run pytest tests/benchmarks/ -v --bench-scale=small -m "benchmark and not slow"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:25:uv run pytest tests/benchmarks/ -v --bench-scale=small
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:28:uv run pytest tests/benchmarks/ -v --bench-scale=medium --bench-report=results.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:31:uv run pytest tests/benchmarks/ -v --bench-scale=stress -m stress
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:58:| `test_search_bench.py` | Query latency vs palace size, recall@k with planted needles, concurrent queries, n_results scaling |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:65:| `test_recall_threshold.py` | Per-room recall ceiling — isolates embedding model limit with all drawers in one bucket |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:66:| `test_knowledge_graph_bench.py` | Triple insertion rate, temporal query accuracy, SQLite concurrent access |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:72:tests/benchmarks/
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:84:- **`populate_palace_directly()`** — bypasses mining, inserts directly into ChromaDB (10-100x faster for search/MCP benchmarks)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:85:- **`generate_kg_triples()`** — entity-relationship triples with temporal validity
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:86:- **`generate_search_queries()`** — queries with known-good answers for recall measurement
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:88:**Planted needles**: Unique identifiable content (e.g., `NEEDLE_0042: PostgreSQL vacuum autovacuum threshold...`) seeded into specific wings/rooms. Search queries target these needles, enabling recall@k measurement without an LLM judge.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:101:    "mcp_status": {"latency_ms_at_1000": 45.2, "rss_delta_mb_at_5000": 12.3},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:102:    "search": {"avg_latency_ms_at_5000": 23.1, "recall_at_5": 0.92},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:111:from tests.benchmarks.report import check_regression
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:119:The GitHub Actions workflow runs benchmarks on PRs at small scale:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:122:benchmark:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:125:  # Runs: pytest tests/benchmarks/ -m "benchmark and not stress and not slow" --bench-scale=small
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:128:Existing unit tests are isolated with `--ignore=tests/benchmarks`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:132:- `@pytest.mark.benchmark` — all benchmark tests
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:2:Deterministic data factory for MemPalace scale benchmarks.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:7:Planted "needle" drawers enable recall measurement without an LLM judge.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:27:        "kg_entities": 50,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:28:        "kg_triples": 200,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:36:        "kg_entities": 200,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:37:        "kg_triples": 2_000,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:45:        "kg_entities": 500,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:46:        "kg_triples": 10_000,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:54:        "kg_entities": 1_000,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:55:        "kg_triples": 50_000,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:156:    "health check",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:247:        # Planted needles for recall measurement
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:252:        """Create unique needle content for recall testing."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:265:            "Prometheus alerting rule fires when p99 latency exceeds 500ms for 5 minutes",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:269:            "React concurrent mode uses startTransition for non-urgent state updates",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:280:            content = f"{needle_id}: {topic}. This is a unique planted needle for recall benchmarking at scale."
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:311:                        ["performance", "readability", "test coverage", "latency"]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:408:        Much faster than mining for benchmarks that only care about
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:436:                        "added_by": "benchmark",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:466:                    "added_by": "benchmark",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:484:    def generate_kg_triples(self, n_entities=None, n_triples=None):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:492:        n_entities = n_entities or self.cfg["kg_entities"]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:493:        n_triples = n_triples or self.cfg["kg_triples"]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:536:        Needle queries have known-good answers for recall measurement.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:554:        # Other half are generic queries (measure latency, not recall)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py:18:        help="Scale level for benchmark tests: small (1K), medium (10K), large (50K), stress (100K)",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py:23:        help="Path for JSON benchmark report output",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py:29:    """The configured benchmark scale level."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py:48:def kg_db(tmp_path):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py:50:    return str(tmp_path / "test_kg.sqlite3")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py:76:    """Collect benchmark metrics across all tests in a session."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py:89:    """Session-scoped results collector shared by all benchmark tests."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py:94:    """Write JSON benchmark report after all tests complete."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:2:Search performance benchmarks.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:4:Measures query latency, recall@k, and concurrent search behavior
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:5:as palace size grows. Uses planted needles for recall measurement.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:9:from concurrent.futures import ThreadPoolExecutor, as_completed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:13:from tests.benchmarks.data_generator import PalaceDataGenerator
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:14:from tests.benchmarks.report import record_metric
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:17:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:19:    """Query latency scaling as palace grows."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:24:    def test_search_latency_curve(self, n_drawers, tmp_path, bench_scale):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:25:        """Measure average search latency at different palace sizes."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:53:        record_metric("search", f"avg_latency_ms_at_{n_drawers}", round(avg_ms, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:58:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:60:    """Planted needle recall — does accuracy degrade as palace grows?"""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:65:    def test_recall_at_k(self, n_drawers, tmp_path, bench_scale):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:95:        recall_at_5 = hits_at_5 / max(total_needle_queries, 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:96:        recall_at_10 = hits_at_10 / max(total_needle_queries, 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:98:        record_metric("search_recall", f"recall_at_5_at_{n_drawers}", round(recall_at_5, 3))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:99:        record_metric("search_recall", f"recall_at_10_at_{n_drawers}", round(recall_at_10, 3))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:102:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:107:        """Measure latency and recall difference with wing filtering."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:146:        latency_improvement = ((avg_unfiltered - avg_filtered) / max(avg_unfiltered, 0.01)) * 100
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:150:        record_metric("search_filter", "latency_improvement_pct", round(latency_improvement, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:152:            "search_filter", "unfiltered_recall_at_5", round(unfiltered_hits / max(n_queries, 1), 3)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:155:            "search_filter", "filtered_recall_at_5", round(filtered_hits / max(n_queries, 1), 3)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:159:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:163:    def test_concurrent_queries(self, tmp_path):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:204:        record_metric("concurrent_search", "p50_ms", round(sorted_lat[n // 2], 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:205:        record_metric("concurrent_search", "p95_ms", round(sorted_lat[int(n * 0.95)], 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:206:        record_metric("concurrent_search", "p99_ms", round(sorted_lat[int(n * 0.99)], 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:207:        record_metric("concurrent_search", "avg_ms", round(sum(sorted_lat) / n, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:208:        record_metric("concurrent_search", "error_count", errors)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:209:        record_metric("concurrent_search", "total_queries", len(queries))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:210:        record_metric("concurrent_search", "workers", 4)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:213:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:215:    """How does n_results affect query latency?"""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py:218:    def test_n_results_latency(self, n_results, tmp_path):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:2:Memory stack (layers.py) benchmarks.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:12:from tests.benchmarks.data_generator import PalaceDataGenerator
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:13:from tests.benchmarks.report import record_metric
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:31:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:38:    def test_wakeup_latency(self, n_drawers, tmp_path, bench_scale):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:65:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:91:        record_metric("layer1", f"latency_ms_at_{n_drawers}", round(elapsed_ms, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:124:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:139:            f.write("I am a benchmark AI.\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:156:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:160:    def test_layer2_latency(self, tmp_path, bench_scale):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:182:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:186:    def test_layer3_latency(self, tmp_path, bench_scale):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:187:        """L3 search latency through MemoryStack."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py:194:            f.write("I am a benchmark AI.\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_ingest_bench.py:2:Ingestion throughput benchmarks.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_ingest_bench.py:16:from tests.benchmarks.data_generator import PalaceDataGenerator
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_ingest_bench.py:17:from tests.benchmarks.report import record_metric
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_ingest_bench.py:35:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_ingest_bench.py:101:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_ingest_bench.py:134:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:6:  - How does query latency degrade as collection grows?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:16:from tests.benchmarks.data_generator import PalaceDataGenerator
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:17:from tests.benchmarks.report import record_metric
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:35:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:66:        record_metric("chromadb_get_all", f"latency_ms_at_{n_drawers}", round(elapsed_ms, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:69:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:71:    """Measure query latency as collection grows."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:76:    def test_query_latency_at_size(self, n_drawers, tmp_path, bench_scale):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:89:            "load balancer health check",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:103:        record_metric("chromadb_query", f"avg_latency_ms_at_{n_drawers}", round(avg_ms, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:104:        record_metric("chromadb_query", f"p95_latency_ms_at_{n_drawers}", round(p95_ms, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:107:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:165:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py:171:        """Add drawers in batches, measure latency per batch."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:2:MCP server tool performance benchmarks.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:17:from tests.benchmarks.data_generator import PalaceDataGenerator
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:18:from tests.benchmarks.report import record_metric
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:33:    """Monkeypatch mcp_server._config and _kg to point at test dirs."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:44:    monkeypatch.setattr(mcp_mod, "_kg", KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3")))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:68:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:93:    def test_tool_status_latency(self, n_drawers, tmp_path, monkeypatch):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:108:        record_metric("mcp_status", f"latency_ms_at_{n_drawers}", round(elapsed_ms, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:111:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:116:    def test_list_wings_latency(self, n_drawers, tmp_path, monkeypatch):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:127:        record_metric("mcp_list_wings", f"latency_ms_at_{n_drawers}", round(elapsed_ms, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:130:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:135:    def test_get_taxonomy_latency(self, n_drawers, tmp_path, monkeypatch):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:146:        record_metric("mcp_taxonomy", f"latency_ms_at_{n_drawers}", round(elapsed_ms, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:149:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:185:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:190:    def test_search_latency(self, n_drawers, tmp_path, monkeypatch):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:206:        record_metric("mcp_search", f"avg_latency_ms_at_{n_drawers}", round(avg_ms, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:209:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:211:    """tool_add_drawer calls tool_check_duplicate first — measure overhead."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:214:    def test_duplicate_check_latency(self, n_drawers, tmp_path, monkeypatch):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:218:        from mempalace.mcp_server import tool_check_duplicate
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:220:        test_content = "This is unique test content for duplicate checking benchmark."
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:222:        result = tool_check_duplicate(content=test_content)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py:226:        record_metric("mcp_duplicate_check", f"latency_ms_at_{n_drawers}", round(elapsed_ms, 1))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_memory_profile.py:2:Memory profiling benchmarks — detect leaks and measure RSS growth.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_memory_profile.py:15:from tests.benchmarks.data_generator import PalaceDataGenerator
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_memory_profile.py:16:from tests.benchmarks.report import record_metric
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_memory_profile.py:34:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_memory_profile.py:71:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_memory_profile.py:88:        monkeypatch.setattr(mcp_mod, "_kg", KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3")))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_memory_profile.py:113:@pytest.mark.benchmark
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_memory_profile.py:147:@pytest.mark.benchmark

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# MemPal Benchmark Results — Full Progression

**March 2026 — The complete record from baseline to state-of-the-art.**

---

## The Core Finding

Every competitive memory system uses an LLM to manage memory:
- Mem0 uses an LLM to extract facts
- Mastra uses GPT-5-mini to observe conversations
- Supermemory uses an LLM to run agentic search passes

They all start from the assumption that you need AI to decide what to remember.

**MemPal's baseline just stores the actual words and searches them with ChromaDB's default embeddings. No extraction. No summarization. No AI deciding what matters. And it scores 96.6% on LongMemEval.**

That's the finding. The field is over-engineering the memory extraction step. Raw verbatim text with good embeddings is a stronger baseline than anyone realized — because it doesn't lose information. When an LLM extracts "user prefers PostgreSQL" and throws away the original conversation, it loses the context of *why*, the alternatives considered, the tradeoffs discussed. MemPal keeps all of that, and the search model finds it.

Nobody published this result because nobody tried the simple thing and measured it properly.

---

## The Two Honest Numbers

These are different claims. They need to be presented as a pair.

| Mode | LongMemEval R@5 | LLM Required | Cost per Query |
|---|---|---|---|
| **Raw ChromaDB** | **96.6%** | None | $0 |
| **Hybrid v4 + Haiku rerank** | **100%** | Haiku (optional) | ~$0.001 |
| **Hybrid v4 + Sonnet rerank** | **100%** | Sonnet (optional) | ~$0.003 |

The 96.6% is the product story: free, private, one dependency, no API key, runs entirely offline.

The 100% is the competitive story: a perfect score on the standard benchmark for AI memory, verified across all 500 questions and all 6 question types — reproducible with either Haiku or Sonnet as the reranker.

Both are real. Both are reproducible. Neither is the whole picture alone.

---

## Comparison vs Published Systems (LongMemEval)

| # | System | R@5 | LLM Required | Which LLM | Notes |
|---|---|---|---|---|---|
| 1 | **MemPal (hybrid v4 + rerank)** | **100%** | Optional | Haiku | Reproducible, 500/500 |
| 2 | Supermemory ASMR | ~99% | Yes | Undisclosed | Research only, not in production |
| 3 | MemPal (hybrid v3 + rerank) | 99.4% | Optional | Haiku | Reproducible |
| 3 | MemPal (palace + rerank) | 99.4% | Optional | Haiku | Independent architecture |
| 4 | Mastra | 94.87% | Yes | GPT-5-mini | — |
| 5 | **MemPal (raw, no LLM)** | **96.6%** | **None** | **None** | **Highest zero-API score published** |
| 6 | Hindsight | 91.4% | Yes | Gemini-3 | — |
| 7 | Supermemory (production) | ~85% | Yes | Undisclosed | — |
| 8 | Stella (dense retriever) | ~85% | None | None | Academic baseline |
| 9 | Contriever | ~78% | None | None | Academic baseline |
| 10 | BM25 (sparse) | ~70% | None | None | Keyword baseline |

**MemPal raw (96.6%) is the highest published LongMemEval score that requires no API key, no cloud, and no LLM at any stage.**

**MemPal hybrid v4 + Haiku rerank (100%) is the first perfect score on LongMemEval — 500/500 questions, all 6 question types at 100%.**

---

## Other Benchmarks

### ConvoMem (Salesforce, 75K+ QA pairs)

| System | Score | Notes |
|---|---|---|
| **MemPal** | **92.9%** | Verbatim text, semantic search |
| Gemini (long context) | 70–82% | Full history in context window |
| Block extraction | 57–71% | LLM-processed blocks |
| Mem0 (RAG) | 30–45% | LLM-extracted memories |

MemPal is more than 2× Mem0 on this benchmark. With Sonnet rerank, MemPal reaches **100% on LoCoMo** across all 5 question types including temporal-inference (was 46% at baseline).

**Why MemPal beats Mem0 by 2×:** Mem0 uses an LLM to extract memories — it decides what to remember and discards the rest. When it extracts the wrong thing, the memory is gone. MemPal stores verbatim text. Nothing is discarded. The simpler approach wins because it doesn't lose information.

**Per-category breakdown:**

| Category | Recall | Grade |
|---|---|---|
| Assistant Facts | 100% | Perfect |
| User Facts | 98.0% | Excellent |
| Abstention | 91.0% | Strong |
| Implicit Connections | 89.3% | Good |
| Preferences | 86.0% | Good — weakest category |

### LoCoMo (1,986 multi-hop QA pairs)

| Mode | R@5 | R@10 | LLM | Notes |
|---|---|---|---|---|
| **Hybrid v5 + Sonnet rerank (top-50)** | **100%** | **100%** | Sonnet | Structurally guaranteed (top-k > sessions) |
| **bge-large + Haiku rerank (top-15)** | — | **96.3%** | Haiku | Single-hop 86.6%, temporal-inf 87.0% |
| **bge-large hybrid (top-10)** | — | **92.4%** | None | +3.5pp over all-MiniLM, single-hop +10.6pp |
| **Hybrid v5 (top-10)** | 83.7% | **88.9%** | None | Beats Memori 81.95% — honest score |
| **Wings v3 speaker-owned closets (top-10)** | — | **85.7%** | None | Adversarial 92.8% — speaker ownership solves speaker confusion |
| **Wings v2 concept closets (top-10)** | — | **75.6%** | None | Adversarial 80.0%; single-hop 49% drags overall |
| **Palace v2 (top-10, 3 rooms)** | 75.6% | **84.8%** | Haiku (index) | Room assignment at index; summary routing at query |
| Wings v1 (broken — filter not boost) | — | 58.0% | None | Speaker WHERE filter discarded evidence; 5.4% coverage |
| Palace v1 (top-5, global LLM routing) | 34.2% | — | Haiku (both) | Fails: taxonomy mismatch |
| Session, no rerank (top-10) | — | 60.3% | None | Baseline |
| Dialog, no rerank (top-10) | — | 48.0% | None | — |

**Wings v2 per-category breakdown (top-10, no LLM):**

| Category | Wings v1 | Wings v2 | Delta |
|---|---|---|---|
| Single-hop | ~52% | 49.0% | -3pp |
| Temporal | ~64% | 79.2% | +15pp |
| Temporal-inference | ~53% | 49.1% | -4pp |
| Open-domain | ~71% | 83.7% | +13pp |
| **Adversarial** | **34.0%** | **80.0%** | **+46pp** |

**Wings v3 per-category breakdown (top-10, no LLM):**

| Category | Wings v1 | Wings v2 | Wings v3 | Hybrid v5 |
|---|---|---|---|---|
| Single-hop | ~52% | 49.0% | **65.3%** | ~70%? |
| Temporal | ~64% | 79.2% | **87.3%** | ~87%? |
| Temporal-inference | ~53% | 49.1% | **63.2%** | ~65%? |
| Open-domain | ~71% | 83.7% | **90.7%** | ~90%? |
| **Adversarial** | **34.0%** | **80.0%** | **92.8%** | — |

Wings v3 design: one closet per speaker per session. Owner's turns verbatim; other speaker's turns as `[context]` labels. 38 closets/conversation vs 184 (v2) → 26% coverage with top-10. Adversarial score (92.8%) exceeds bge-large overall (92.4%) — speaker ownership almost completely solves the speaker-confusion category.

Root cause of wings v1 failure: (1) speaker WHERE filter discarded evidence about Caroline when evidence lived in a John-tagged closet (John spoke more words but conversation was about Caroline); (2) top_k=10 from ~184 closets = 5.4% coverage vs 37% in session mode. Fix: retrieve all closets, use speaker match as 15% distance boost instead of filter.

**With Sonnet rerank, MemPal achieves 100% on every LoCoMo question type — including temporal-inference, which was the hardest category at baseline.**

**Per-category breakdown (hybrid + Sonnet rerank):**

| Category | Recall | Baseline | Delta |
|---|---|---|---|
| Single-hop | 1.000 | 59.0% | +41.0pp |
| Temporal | 1.000 | 69.2% | +30.8pp |
| **Temporal-inference** | **1.000** | **46.0%** | **+54.0pp** |
| Open-domain | 1.000 | 58.1% | +41.9pp |
| Adversarial | 1.000 | 61.9% | +38.1pp |

**Temporal-inference was the hardest category** — questions requiring connections across multiple sessions. Hybrid scoring (person name boost, quoted phrase boost) combined with Sonnet's reading comprehension closes this gap entirely. From 46% to 100%.

---

## LongMemEval — Breakdown by Question Type

The 96.6% R@5 baseline broken down by the six question categories in LongMemEval:

| Question Type | R@5 | R@10 | Count | Notes |
|---|---|---|---|---|
| Knowledge update | 99.0% | 100% | 78 | Strongest — facts that changed over time |
| Multi-session | 98.5% | 100% | 133 | Very strong |
| Temporal reasoning | 96.2% | 97.0% | 133 | Strong |
| Single-session user | 95.7% | 97.1% | 70 | Strong |
| Single-session preference | 93.3% | 96.7% | 30 | Good — preferences stated indirectly |
| Single-session assistant | 92.9% | 96.4% | 56 | Weakest — questions about what the AI said |

The two weakest categories point to specific fixes:
- **Single-session assistant (92.9%)**: Questions ask about what the assistant said, not the user. Fixed by indexing assistant turns as well as user turns.
- **Single-session preference (93.3%)**: Preferences are often stated indirectly ("I usually prefer X"). Fixed by the preference extraction patterns in hybrid v3.

Both were addressed in the improvements that took the score from 96.6% to 99.4%.

---

## The Full Progression — How We Got from 96.6% to 99.4%

Every improvement below was a response to specific failure patterns in the results. Nothing was added speculatively.

### Starting Point: Raw ChromaDB (96.6%)

The baseline: store every session verbatim as a single document. Query with ChromaDB's default embeddings (all-MiniLM-L6-v2). No postprocessing.

This was the first result. Nobody expected it to work this well. The team's hypothesis was that raw verbatim storage would lose to systems that extract structured facts. The 96.6% proved the hypothesis wrong.

**What it does:** Stores verbatim session text. Embeds with sentence transformers. Retrieves by cosine similarity.

**What it misses:** Questions with vocabulary mismatch ("yoga classes" vs "I went this morning"), preference questions where the preference is implied, temporally-ambiguous questions where multiple sessions match.

---

### Improvement 1: Hybrid Scoring v1 → 97.8% (+1.2%)

**What changed:** Added keyword overlap scoring on top of embedding similarity.

```
fused_score = embedding_score × (1 + keyword_weight × overlap)
```

When query keywords appear verbatim in a session, that session gets a small boost. The boost is mild enough not to hurt recall when keywords don't match.

**Why it worked:** Some questions use exact terminology ("PostgreSQL", "Dr. Chen", specific names). Pure embedding similarity can rank a semantically-close session above the exact match. Keyword overlap rescues these cases.

**What it still misses:** Temporally-ambiguous questions. Sessions from the right time period rank equally with sessions from wrong time periods.

---

### Improvement 2: Hybrid Scoring v2 → 98.4% (+0.6%)

**What changed:** Added temporal boost — sessions near the question's reference date get a distance reduction (up to 40%).

```python
# Sessions near question_date - offset get score boost
if temporal_distance < threshold:
    fused_dist *= (1.0 - temporal_boost * proximity_factor)
```

**Why it worked:** Many LongMemEval questions are anchored to a specific time ("what did you do last month?"). Multiple sessions might semantically match, but only one is temporally correct. The boost breaks ties in favor of the right time period.

---

### Improvement 3: Hybrid v2 + Haiku Rerank → 98.8% (+0.4%)

**What changed:** After retrieval, send the top-K candidates to Claude Haiku with the question. Ask Haiku to re-rank by relevance.

**Why it worked:** Embeddings measure semantic similarity, not answer relevance. Haiku can read the question and the retrieved documents and reason about which one actually answers the question — a task embeddings fundamentally cannot do.

**Cost:** ~$0.001/query for Haiku. Optional — the system runs fine without it.

---

### Improvement 4: Hybrid v3 + Haiku Rerank → 99.4% (+0.6%)

**What changed:** Added preference extraction — 16 regex patterns that detect how people actually express preferences in conversation, then create synthetic "User has mentioned: X" documents at index time.

Examples of what gets caught:
- "I usually prefer X" → `User has mentioned: preference for X`
- "I always do Y" → `User has mentioned: always does Y`
- "I don't like Z" → `User has mentioned: dislikes Z`

**Why it worked:** Preference questions are consistently hard for pure embedding retrieval. "What does the user prefer for database backends?" doesn't semantically match "I find Postgres more reliable in my experience" — but it does match a synthetic document that says "User has mentioned: finds Postgres more reliable." The explicit extraction bridges the vocabulary gap without losing the verbatim original.

**Why 16 patterns:** Manual analysis of the miss cases. Each pattern corresponds to a real failure mode found in the wrong-answer JSONL files.

---

### Improvement 5: Hybrid v4 + Haiku Rerank → **100%** (+0.6%)

**What changed:** Three targeted fixes for the three questions that failed in every previous mode.


exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"""
Benchmark report utilities — JSON output and regression detection.

Each test records metrics via record_metric(). At session end, the
conftest.py pytest_terminal_summary hook writes the collected results.
"""

import json
import os
import tempfile


RESULTS_FILE = os.path.join(tempfile.gettempdir(), "mempalace_bench_results.json")


def record_metric(category: str, metric: str, value):
    """Append a metric to the session results file (JSON on disk)."""
    results = {}
    if os.path.exists(RESULTS_FILE):
        try:
            with open(RESULTS_FILE) as f:
                results = json.load(f)
        except (json.JSONDecodeError, OSError):
            results = {}

    if category not in results:
        results[category] = {}
    results[category][metric] = value

    with open(RESULTS_FILE, "w") as f:
        json.dump(results, f, indent=2)


def check_regression(current_report: str, baseline_report: str, threshold: float = 0.2):
    """
    Compare current benchmark results against a baseline.

    Returns a list of regression descriptions. Empty list = no regressions.

    threshold: fractional degradation allowed (0.2 = 20% worse is OK).
    """
    with open(current_report) as f:
        current = json.load(f)
    with open(baseline_report) as f:
        baseline = json.load(f)

    regressions = []
    # Keywords for metric direction — checked in order, first match wins.
    # "improvement" is checked before "latency" so that composite names
    # like "latency_improvement_pct" are classified correctly.
    _higher_is_better_kw = [
        "improvement",
        "recall",
        "throughput",
        "per_sec",
        "files_per_sec",
        "drawers_per_sec",
        "triples_per_sec",
        "speedup",
    ]
    _higher_is_worse_kw = [
        "latency",
        "rss",
        "memory",
        "oom",
        "lock_failures",
        "elapsed",
        "p50_ms",
        "p95_ms",
        "p99_ms",
        "rss_delta_mb",
        "peak_rss_mb",
        "errors",
        "failures",
    ]

    def _metric_direction(name: str) -> str:
        """Return 'higher_better', 'higher_worse', or 'unknown'."""
        low = name.lower()
        for kw in _higher_is_better_kw:
            if kw in low:
                return "higher_better"
        for kw in _higher_is_worse_kw:
            if kw in low:
                return "higher_worse"
        return "unknown"

    for category in baseline.get("results", {}):
        if category not in current.get("results", {}):
            continue
        for metric, base_val in baseline["results"][category].items():
            if metric not in current["results"][category]:
                continue
            curr_val = current["results"][category][metric]
            if not isinstance(base_val, (int, float)) or not isinstance(curr_val, (int, float)):
                continue
            if base_val == 0:
                continue

            direction = _metric_direction(metric)

            if direction == "higher_worse":
                # Higher is worse — check if current exceeds baseline by threshold
                if curr_val > base_val * (1 + threshold):
                    pct = ((curr_val - base_val) / base_val) * 100
                    regressions.append(
                        f"{category}/{metric}: {base_val:.2f} -> {curr_val:.2f} ({pct:+.1f}%, threshold {threshold * 100:.0f}%)"
                    )
            elif direction == "higher_better":
                # Lower is worse — check if current is below baseline by threshold
                if curr_val < base_val * (1 - threshold):
                    pct = ((curr_val - base_val) / base_val) * 100
                    regressions.append(
                        f"{category}/{metric}: {base_val:.2f} -> {curr_val:.2f} ({pct:+.1f}%, threshold {threshold * 100:.0f}%)"
                    )

    return regressions

exec
/bin/zsh -lc 'rg -n "eval_run_ablation|eval_reporting_dashboard|memory_validate|feedback_events|session_health|memory_health|memory_stats|queryId|search_shown|result_cited|Recall@|recall|precision|latency|p95|quality score|confidence" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts/dist/memory .opencode/plugins/spec-kit-compact-code-graph.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:180:  latencyMs?: number;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:246:  latencyMs: number;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:377:// Stores the last resolved session ID so non-search tools (e.g. memory_stats)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:499:): Omit<DispatchGraphContextMeta, 'latencyMs'> {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:632:          latencyMs: Date.now() - startedAt,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:640:          latencyMs: Date.now() - startedAt,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:654:        latencyMs: Date.now() - startedAt,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:874:    // T018: Track last tool call timestamp for all tools except session_health.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:875:    if (name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:939:      console.warn(`[context-server] Auto-surface precheck exceeded p95 target: ${autoSurfaceLatencyMs}ms`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:116:| `SPECKIT_CONFIDENCE_TRUNCATION` | `true` | boolean | Confidence-gap truncation for low-confidence result tails. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:137:| `SPECKIT_NEGATIVE_FEEDBACK` | `true` | boolean | Negative-feedback confidence demotion in ranking (T002b/A4). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:156:| `SPECKIT_QUERY_SURROGATES` | `true` | boolean | Index-time surrogate metadata for recall improvement (REQ-D2-005). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:159:| `SPECKIT_HYDE` | `true` | boolean | Hypothetical Document Embeddings for low-confidence deep queries (REQ-D2-004). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:162:| `SPECKIT_INTENT_CONFIDENCE_FLOOR` | `0.25` | number | Minimum confidence for auto-detected intent. Below this, overrides to "understand". | `handlers/memory-search.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:243:| `SPECKIT_IMPLICIT_FEEDBACK_LOG` | `true` | boolean | Implicit feedback event ledger for `search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, and `follow_on_tool_use`. Shadow-only, no ranking side effects (REQ-D4-001). Graduated ON. | `lib/feedback/feedback-ledger.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:287:| `SPECKIT_RESULT_CONFIDENCE_V1` | `true` | boolean | Per-result calibrated confidence scoring (REQ-D5-004). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:304:| `SPECKIT_EXTENDED_TELEMETRY` | `false` | boolean | Detailed retrieval metrics collection (latency breakdown, quality scores). Opt-in: set `true` to enable. | `lib/telemetry/retrieval-telemetry.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:41:/** Arguments for the memory_stats handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:92:  latencyMs: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:268:        latencyMs: 0, triggerCacheCleared: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:252:    _evalQueryId = evalEntry.queryId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:256:  const logFinalTriggerEval = (memoryIds: number[], latencyMs: number): void => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:261:          queryId: _evalQueryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:265:          latencyMs,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:489:  const latencyMs = Date.now() - startTime;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:490:  if (latencyMs > 100) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:523:      latencyMs: latencyMs,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:541:        latency_ms: latencyMs,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:548:  logFinalTriggerEval(triggerMemoryIds, latencyMs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:13:// Feature catalog: System statistics (memory_stats)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:35:const handle_memory_stats = handleMemoryStats;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:44:  handle_memory_stats,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:9:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:34:  contradiction?: { detected: boolean; type: string | null; description: string | null; confidence: number } | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:321:        latencyMs: 0, triggerCacheCleared: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:20:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:27:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:250:        latencyMs: 0, triggerCacheCleared: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:31:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:249:      latencyMs: 0, triggerCacheCleared: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:266:export const handle_memory_stats = lazyFunction(getMemoryCrudModule, 'handle_memory_stats');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:267:export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:292:export const handle_memory_validate = lazyFunction(getCheckpointsModule, 'handle_memory_validate');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:305:export const handle_eval_run_ablation = lazyFunction(getEvalReportingModule, 'handle_eval_run_ablation');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:306:export const handle_eval_reporting_dashboard = lazyFunction(getEvalReportingModule, 'handle_eval_reporting_dashboard');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:5:// + session_health in one call, merging results with hints.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:106:    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:182:  // Sub-call 2: session_health
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:191:    allHints.push('session_health failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:98:    latencyMs: Date.now() - startTime,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:302:    confidence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:306:  if (!queryIntentMetadata || queryIntentMetadata.queryIntent !== 'structural' || queryIntentMetadata.confidence <= 0.65) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:555:            confidence: r.confidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:652:    description: 'Fast trigger matching for real-time context (low latency)',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:888:    intentConfidence = classification.confidence;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1061:      confidence: intentConfidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1137:    confidence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1147:        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1152:        confidence: classification.confidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1169:      if (classification.intent === 'structural' && classification.confidence > 0.65) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1200:      // 'semantic' or low-confidence: no graph context, fall through
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1215:    _evalQueryId = evalEntry.queryId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1531:        latency_ms: Date.now() - _contextStartTime,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1555:        queryId: _evalQueryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1559:        latencyMs: Date.now() - _contextStartTime,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1567:        queryId: _evalQueryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1572:        latencyMs: Date.now() - _contextStartTime,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:22:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:4:// T018: MCP tool handler for session_health — reports session
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:65:/** Handle session_health tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:102:  const structuralContext = buildStructuralBootstrapContract('session_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:133:  // Phase 023: Compute quality score from context metrics
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:160:      producer: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:161:      sourceSurface: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:170:    sourceSurface: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:29:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:451:          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:452:          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:478:          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:479:          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:504:          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:505:          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:530:          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:531:          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:184:              confidence: a.confidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:65:      if (!metadata || typeof metadata.confidence !== 'number') {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:87:      if (!best || metadata.confidence > best.numericConfidence) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:90:          numericConfidence: metadata.confidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/types.ts:23:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:13:import * as confidenceTracker from '../lib/scoring/confidence-tracker.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:86:  queryId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:97:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:105:  queryId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:107:  if (typeof queryId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:111:  const normalizedQueryId = queryId.trim();
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648:/** Handle memory_validate tool - records user validation feedback to adjust confidence */
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:655:    queryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:677:  const normalizedQueryId = typeof queryId === 'string' && queryId.trim().length > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:678:    ? queryId.trim()
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:681:  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:690:        queryId: normalizedQueryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:721:  // T002b: Negative-feedback confidence signal persistence for runtime scoring.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:726:  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:735:  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:736:    groundTruthSelectionId = recordUserSelection(queryId, memoryId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:750:      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:768:    ? `Positive validation recorded (confidence: ${result.confidence.toFixed(2)})`
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:769:    : `Negative validation recorded (confidence: ${result.confidence.toFixed(2)})`;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:780:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:785:      confidence: result.confidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:815:const handle_memory_validate = handleMemoryValidate;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:822:  handle_memory_validate,
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:36:- `checkpoints.ts` - Checkpoint lifecycle plus `memory_validate`.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:644:    _evalQueryId = evalEntry.queryId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:672:    intentConfidence = classification.confidence;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:678:      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:682:  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:685:    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:707:  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:931:        confidence: intentConfidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1006:      normalizedQuery,   // REQ-D5-001/D5-004: pass query for recovery + confidence context
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1209:        latency_ms: Date.now() - _searchStartTime,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1231:        queryId: _evalQueryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1235:        latencyMs: Date.now() - _searchStartTime,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1241:          queryId: _evalQueryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1251:  // REQ-D4-001: Implicit feedback — log search_shown events for returned results
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1268:          const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1270:            type: 'search_shown',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1272:            queryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1273:            confidence: 'weak',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1283:  // REQ-014: Query flow tracking + result_cited for includeContent searches
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1284:  // Shadow-only: emits query_reformulated, same_topic_requery, and result_cited events.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1310:        const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1314:          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1317:        // Log result_cited for includeContent searches (content was embedded = cited)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:21:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:368: * Compute composite quality score for a memory file.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:570: * Computes quality score, attempts auto-fix if below threshold,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:574: * retries keep ingestion latency predictable within a single request cycle.
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:104:        description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls. When implicit feedback logging is enabled, includeContent searches also emit shadow-only result_cited events for returned memories.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:120:        description: 'Minimum quality score threshold (0.0-1.0). Results with lower quality_score are filtered out.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:179:        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:231:  name: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:268:        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298:  name: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:299:  description: '[L4:Mutation] Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:305:      wasUseful: { type: 'boolean', description: 'Whether the memory was useful (true increases confidence, false decreases it)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:306:      queryId: { type: 'string', description: 'Optional query identifier to attach implicit feedback/ground-truth selection context' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:509:  name: 'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:510:  description: '[L6:Analysis] Run a controlled channel ablation study (R13-S3) and optionally persist Recall@20 deltas to eval_metric_snapshots. Requires SPECKIT_ABLATION=true. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:535:      recallK: { type: 'number', minimum: 1, maximum: 100, description: 'Recall cutoff K (default: 20).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:544:  name: 'eval_reporting_dashboard',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:733:  name: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:769:      health: { type: 'object', description: 'session_health payload (system status, database health, MCP connectivity)' },
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:48:// Feature catalog: Reporting dashboard (eval_reporting_dashboard)
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:49:// Feature catalog: Ablation studies (eval_run_ablation)
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:56:  recallK?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:223:/** Handle eval_run_ablation tool — runs ablation analysis or K-sensitivity sweep.
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:224: * @param args - Ablation arguments (channels, queries, recallK, mode)
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:231:      limit: args.recallK,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:246:  const recallK = typeof args.recallK === 'number' && Number.isFinite(args.recallK)
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:247:    ? Math.max(1, Math.floor(args.recallK))
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:254:        context: 'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:271:        limit: recallK,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:294:      recallK,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:297:      alignmentContext: 'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:314:    tool: 'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:333:  'context recall',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:377:    tool: 'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:402:    tool: 'eval_reporting_dashboard',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:418:const handle_eval_run_ablation = handleEvalRunAblation;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:419:const handle_eval_reporting_dashboard = handleEvalReportingDashboard;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:423:  handle_eval_run_ablation,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:424:  handle_eval_reporting_dashboard,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:431:- `memory_stats` (system statistics)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:436:- `session_health` (session readiness check)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:577:### memory_stats: System Statistics
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:579:`memory_stats()` returns counts, dates and top-ranked folders for the memory system. Use it to confirm indexing is working and to inspect database health.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:604:When Z-score analysis signals low-confidence retrieval (insufficient signal in the indexed corpus), the server prepends an evidence gap warning to the LLM payload. This tells the AI assistant that results may be incomplete rather than letting it treat sparse results as authoritative.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:611:- `latency`: End-to-end retrieval time (ms)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:614:- `quality`: Result quality score based on embedding confidence and match density
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:726:**Behind the scenes:** Intent is classified as `understand`. Adaptive fusion applies a semantic-heavy weight profile, improving recall for conceptual queries over exact keyword matches.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1048:           memory_save, memory_index_scan, memory_stats
.opencode/skill/system-spec-kit/mcp_server/README.md:178:  "tool": "memory_health",
.opencode/skill/system-spec-kit/mcp_server/README.md:249:| Tier 2 | BM25 keyword scoring | FTS5 results below confidence floor |
.opencode/skill/system-spec-kit/mcp_server/README.md:285:**Stage 4 -- Filter and annotate**. Enforces score immutability (no score changes after Stage 2). Applies state filtering by minimum state parameter. Annotates results with confidence labels (high/medium/low) and feature flag states.
.opencode/skill/system-spec-kit/mcp_server/README.md:311:For low-confidence deep searches, the system has two additional fallback strategies:
.opencode/skill/system-spec-kit/mcp_server/README.md:322:Think of it like how your own brain works: things you reviewed recently are easy to recall, while things you have not thought about in months fade into the background.
.opencode/skill/system-spec-kit/mcp_server/README.md:396:| **REINFORCE** | Similar exists, new one adds value | Both kept, old one gets a confidence boost |
.opencode/skill/system-spec-kit/mcp_server/README.md:461:**Result confidence scoring** -- tags each result as high, medium or low confidence using fast heuristics (no LLM needed). Checks: top-K separation, multi-channel agreement, quality score and source document structure.
.opencode/skill/system-spec-kit/mcp_server/README.md:521:**Ablation study framework** -- turns off each search channel one at a time and measures quality degradation (Recall@20 delta). Identifies which components are critical.
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:749:##### `memory_stats`
.opencode/skill/system-spec-kit/mcp_server/README.md:757:| `includeScores` | boolean | Include composite quality scores |
.opencode/skill/system-spec-kit/mcp_server/README.md:763:##### `memory_health`
.opencode/skill/system-spec-kit/mcp_server/README.md:777:##### `session_health`
.opencode/skill/system-spec-kit/mcp_server/README.md:816:##### `memory_validate`
.opencode/skill/system-spec-kit/mcp_server/README.md:818:Tell the system whether a search result was helpful. Helpful results get a confidence boost so they show up more often. Unhelpful results get demoted. Over time, the system learns which memories are genuinely useful, like training a recommendation engine with thumbs-up and thumbs-down.
.opencode/skill/system-spec-kit/mcp_server/README.md:824:| `queryId` | string | Query that retrieved this memory |
.opencode/skill/system-spec-kit/mcp_server/README.md:1030:##### `eval_run_ablation`
.opencode/skill/system-spec-kit/mcp_server/README.md:1038:| `recallK` | number | K value for Recall@K metric |
.opencode/skill/system-spec-kit/mcp_server/README.md:1042:The MCP handler scores chunk-backed hits against `parentMemoryId ?? row.id`, so eval rows stay attached to canonical parent memories. Before comparing runs after a DB rebuild or import, preview or refresh the live ground-truth mapping with `scripts/evals/map-ground-truth-ids.ts`; if token-budget overflow collapses a run below `recallK`, treat that run as investigation-only rather than a clean benchmark.
.opencode/skill/system-spec-kit/mcp_server/README.md:1046:##### `eval_reporting_dashboard`
.opencode/skill/system-spec-kit/mcp_server/README.md:1361:**What happens**: File is validated, embedded and indexed. Returns memory ID, quality score and duplicate check results.
.opencode/skill/system-spec-kit/mcp_server/README.md:1541:| See what is indexed | `memory_list` + `memory_stats` | Browse and count |
.opencode/skill/system-spec-kit/mcp_server/README.md:1542:| Diagnose search problems | `memory_health` | Set `reportMode: "full"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1558:**Common causes**: Stale BM25 index, divergent aliases in FTS5 or memories with low quality scores surfacing.
.opencode/skill/system-spec-kit/mcp_server/README.md:1563:{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1607:**What you see**: `memory_stats` shows fewer memories than expected.
.opencode/skill/system-spec-kit/mcp_server/README.md:1663:{ "tool": "memory_health", "arguments": { "reportMode": "divergent_aliases", "limit": 20 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1699:A typical project with a few hundred memory files uses 10-50 MB. The vector table (1024-dimension float32 embeddings) is the largest contributor. Check with `memory_stats` using `includeScores: true`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1729:Set the flag to `false` or `0` in your environment, restart the server and the pipeline falls back to the last working configuration. The full procedure is in `../references/workflows/rollback_runbook.md`. Use `eval_reporting_dashboard` to verify metrics returned to baseline.
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:221:  queryId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:350:  recallK: positiveIntMax(100).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:403:  memory_stats: memoryStatsSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:404:  memory_health: memoryHealthSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:407:  memory_validate: memoryValidateSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:419:  eval_run_ablation: evalRunAblationSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:420:  eval_reporting_dashboard: evalReportingDashboardSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:454:  session_health: getSchema({}) as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:468:  memory_stats: ['folderRanking', 'excludePatterns', 'includeScores', 'includeArchived', 'limit'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:469:  memory_health: ['reportMode', 'limit', 'specFolder', 'autoRepair', 'confirmed'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472:  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:484:  eval_run_ablation: ['mode', 'channels', 'queries', 'groundTruthQueryIds', 'recallK', 'storeResults', 'includeFormattedReport'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:485:  eval_reporting_dashboard: ['sprintFilter', 'channelFilter', 'metricFilter', 'limit', 'format'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:496:  session_health: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:23:// Feature catalog: System statistics (memory_stats)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:30:/** Handle memory_stats tool -- returns memory system statistics and folder rankings. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:40:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:51:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:70:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:80:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:89:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:98:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:107:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:116:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:159:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:208:          created_at, updated_at, confidence, validation_count, access_count
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:283:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:302:    tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:15:  latencyMs?: number;
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:114:      const latency = typeof autoSurfacedContext?.latencyMs === 'number'
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:115:        ? autoSurfacedContext.latencyMs
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:118:        `Auto-surface hook: injected ${constitutionalCount} constitutional and ${triggeredCount} triggered memories (${latency}ms)`
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:126:      latencyMs: typeof autoSurfacedContext?.latencyMs === 'number' ? autoSurfacedContext.latencyMs : 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1727:        latencyMs: 0, triggerCacheCleared: false,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:61:  latencyMs: number;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:110:// T018: Session-level tracking for prime package and session_health
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:390:    const latencyMs = Date.now() - startTime;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:410:      latencyMs: latencyMs,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:514:    const latencyMs = Date.now() - startTime;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:535:        latencyMs,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:547:      latencyMs,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:680:  // T018: Session tracking for session_health tool
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:42:} from '../lib/search/confidence-scoring.js';
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:616:  // REQ-D5-004: Compute per-result confidence when flag is enabled (additive, no side-effects)
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:617:  const confidenceEnabled = isResultConfidenceEnabled();
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:618:  let confidenceData: ReturnType<typeof computeResultConfidence> | null = null;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:620:  if (confidenceEnabled) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:623:    confidenceData = computeResultConfidence(scoredResults);
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:624:    requestQualityData = assessRequestQuality(scoredResults, confidenceData);
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:630:    // Compute average confidence for recovery decision
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:632:    if (confidenceData && confidenceData.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:633:      const sum = confidenceData.reduce((acc, c) => acc + c.confidence.value, 0);
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:634:      avgConfidence = sum / confidenceData.length;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:667:  // Merge per-result confidence into the formatted result array (additive)
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:670:      if (!confidenceData) return r as unknown as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:671:      const conf = confidenceData[i];
.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:12:  // T018: Session tracking for session_health tool
.opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts:9:    latencyMs: number;
.opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts:49:      latencyMs: hookResult.latencyMs,
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:65:- auto-surface output includes `constitutional`, `triggered`, `surfaced_at`, and `latencyMs`.
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:67:- `MutationHookResult` includes `latencyMs`, `triggerCacheCleared`, `constitutionalCacheCleared`, `graphSignalsCacheCleared`, `coactivationCacheCleared`, `toolCacheInvalidated`, and `errors`.
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:68:- public `postMutationHooks` data includes `operation`, `latencyMs`, `triggerCacheCleared`, `constitutionalCacheCleared`, `graphSignalsCacheCleared`, `coactivationCacheCleared`, and `toolCacheInvalidated`.
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:36:The MCP Server Library provides the core functionality for the Spec Kit Memory MCP server. It implements cognitive memory features including semantic search, attention decay, importance scoring and intelligent context retrieval. These modules work together to provide AI assistants with human-like memory recall and context awareness.
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:65:| **Confidence Truncation** | Removes low-confidence tail results using 2x median gap detection |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:155:│   ├── confidence-truncation.ts # Confidence truncation (2x median gap, min 3 results)
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:157:│   ├── evidence-gap-detector.ts # TRM with Z-score confidence
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:168:│   ├── confidence-tracker.ts   # Confidence tracking
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:339:| `search/confidence-truncation.ts` | Low-confidence tail removal (2x median gap) |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:366:**Hybrid Search**: Combines semantic and keyword search for better recall
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:429:  grade              // Performance grade (1-4): 1=forgot, 4=easy recall
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:139:  queryId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:331:  recallK?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:5:// Collects events during MCP tool dispatch and computes quality scores.
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:206:/** Compute overall quality score and level. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:215:  // F065: Weight rationale for quality score factors:
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:298:    `Compaction auto-surface returned ${autoSurfaced.constitutional.length} constitutional and ${autoSurfaced.triggered.length} triggered memories (${autoSurfaced.latencyMs}ms)`,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:67:  'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:68:  'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:71:  'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:102:    case 'memory_stats':          return handleMemoryStats(parseArgs<StatsArgs>(validateToolArgs('memory_stats', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:103:    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:106:    case 'memory_validate':       return handleMemoryValidate(parseArgs<MemoryValidateArgs>(validateToolArgs('memory_validate', args)));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:42:} from './confidence-truncation.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:66:import type { TruncationResult } from './confidence-truncation.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:87:   * When true, preserve the requested top-K window by bypassing confidence
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:165:    confidence: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1030:        confidence: routeResult.classification.confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1532:  // candidates before low-confidence tails are trimmed.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1555:      console.warn('[hybrid-search] confidence truncation failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1579:          // Wire confidence truncation metadata into per-result trace (036)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1581:            confidenceTruncation: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1623:      queryId: `hybrid-${Date.now()}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1751:  // Primary 30 filters noise; fallback 17 widens recall for sparse corpora
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2013: * Keep Tier 3 structural fallback scores below established Tier 1/2 confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2209:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2339: * @param options - Optional includeContent flag and queryId for overflow logging.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2345:  options?: { includeContent?: boolean; queryId?: string }
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2349:  const queryId = options?.queryId ?? `q-${Date.now()}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2382:      queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2418:      queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2435:    queryId,
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:54:  'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:55:  'eval_reporting_dashboard',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:60:  'session_health',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:75:    case 'eval_run_ablation':          return handleEvalRunAblation(parseArgs<EvalRunAblationArgs>(validateToolArgs('eval_run_ablation', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:76:    case 'eval_reporting_dashboard':   return handleEvalReportingDashboard(parseArgs<EvalReportingDashboardArgs>(validateToolArgs('eval_reporting_dashboard', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:81:    case 'session_health':             return handleSessionHealth();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:6:// Index, update, delete, and status/confidence updates.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:751: * Updates the confidence value for a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:753: * @param confidence - The confidence value to store.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:754: * @returns True when the confidence was updated.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:756:export function update_confidence(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:758:  confidence: number,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:761:  if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:762:    console.warn(`[vector-index] Invalid confidence value: ${confidence}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:769:      SET confidence = ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:771:    `).run(confidence, memory_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:775:    console.warn(`[vector-index] Failed to update confidence for ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:788:export { update_confidence as updateConfidence };
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:8://   2. Session continuity warning if quality score is degraded/critical
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:11://   - 250ms latency budget (aborts if exceeded)
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:27:  latencyMs: number;
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:161:    return { hints: [], tokenCount: 0, latencyMs: 0, skipped: true, skipReason: 'recursion_guard' };
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:192:    const latencyMs = Date.now() - startTime;
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:195:    if (latencyMs > deadlineMs) {
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:196:      console.warn(`[passive-enrichment] Exceeded deadline: ${latencyMs}ms > ${deadlineMs}ms`);
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:199:    return { hints, tokenCount: tokensUsed, latencyMs, skipped: false };
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:206:      latencyMs: Date.now() - startTime,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:73:      FROM negative_feedback_events
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:131:      'SELECT importance_tier, validation_count, confidence FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:135:      confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:530:    caveat = 'Forecast is low-confidence until at least one file has been processed.';
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:537:        caveat = 'Forecast is low-confidence because queue history is still sparse or noisy.';
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:71:  confidence?: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:159: * Classify results by confidence label.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:160: * Returns counts for high, medium, low (and unknown when no confidence data).
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:162: * @param results - Results to classify by confidence label.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:163: * @returns Counts for each confidence bucket.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:175:    const label = result.confidence?.label;
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:196: * Build a human-readable digest string from confidence distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:42:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:250: * @param queryId - Unique identifier for the search query
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:258:  queryId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:322:    ).run(memoryId, 'add', JSON.stringify(terms), queryId, now, shadowMode ? 1 : 0);
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:333:    const applied = applyLearnedTriggers(memoryId, terms, db, queryId);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:16:// Gate logs quality scores and would-reject decisions but does
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:564: * Compute a lightweight quality score for backfilled rows.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:594: * Layer 2: Compute content quality score across all dimensions.
.opencode/skill/system-spec-kit/mcp_server/database/README.md:72:- Use MCP tools (`memory_stats`, `memory_health`, `memory_index_scan`) for normal operations.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:6:// Gate: SPECKIT_HYDE — deep + low-confidence queries only.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:84: * Low-confidence threshold: if the top result has an effective score
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:85: * below this value, the baseline is considered low-confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:90: * Minimum number of results needed to assess baseline confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:91: * An empty result set is always considered low-confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:121: * Detect whether a baseline result set has low retrieval confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:123: * A baseline is low-confidence when:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:131: * @returns True when the baseline is low-confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:380: * for a deep + low-confidence query, log results, and return candidates
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:288:        // PERF(CHK-113): Sequential per-candidate inference. For 20 candidates, latency depends on
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:25:    queryId: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:28:      { queryId: 1, memoryId: 101, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:29:      { queryId: 1, memoryId: 102, relevance: 2 },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:30:      { queryId: 1, memoryId: 103, relevance: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:34:    queryId: 2,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:37:      { queryId: 2, memoryId: 201, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:38:      { queryId: 2, memoryId: 202, relevance: 2 },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:42:    queryId: 3,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:45:      { queryId: 3, memoryId: 301, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:46:      { queryId: 3, memoryId: 302, relevance: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:50:    queryId: 4,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:53:      { queryId: 4, memoryId: 401, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:54:      { queryId: 4, memoryId: 402, relevance: 2 },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:55:      { queryId: 4, memoryId: 403, relevance: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:59:    queryId: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:62:      { queryId: 5, memoryId: 501, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:63:      { queryId: 5, memoryId: 502, relevance: 2 },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:101:    { id: 501, content: 'Ablation study compares channel contribution and recall changes across runs. '.repeat(2) },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:107:  queryId: number;
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:113:    queryId: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:125:    queryId: 2,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:137:    queryId: 3,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:149:    queryId: 4,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:161:    queryId: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:176:    queryId: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:188:    queryId: 2,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:200:    queryId: 3,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:212:    queryId: 4,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:224:    queryId: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:287:    const corpusEntry = EVAL_CORPUS.find(entry => entry.queryId === fixture.queryId);
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:291:    expect(payload.documents).toEqual(QUERY_DOCUMENTS[fixture.queryId].map(doc => doc.content));
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:327:      QUERY_DOCUMENTS[corpusEntry.queryId],
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:394:      metrics: ['MRR@5', 'NDCG@5', 'latency_p50'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:7:// no results, very low-confidence results, or only partial matches.
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:14://   "status": "no_results" | "low_confidence" | "partial",
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:23:export type RecoveryStatus = 'no_results' | 'low_confidence' | 'partial';
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:47:  /** How many results were returned (0 = no_results, 1–N = partial/low_confidence). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:49:  /** Average confidence value across returned results (0–1). Only meaningful when resultCount > 0. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:51:  /** Low-confidence threshold — results below this trigger recovery. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:65: * Classify retrieval status based on result count and confidence signals.
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:76:  ) return 'low_confidence';
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:78:  return 'low_confidence'; // fallback — should only be called when recovery is warranted
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:158:  if (status === 'low_confidence') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:175: * When the search produces no results or low-confidence results, this function
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:194:  if (status !== 'no_results' && status !== 'low_confidence') return [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:291: *  - Average confidence below threshold, OR
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:855:    const lowRecallVectorSearch = () => [{ id: 1, similarity: 0.01, content: 'vector low confidence' }];
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1281:  it('T024: co-activation promotion happens before confidence truncation drops tail candidates', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1358:      queryId: 'p1-token-skip',
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1389:      queryId: 'p1-token-fallback',
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1415:      queryId: 't311-cache',
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:83: * Truncate results based on confidence gap analysis.
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:54:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:120:    const warning = '> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.';
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:126:    const warning = '> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.';
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:113:      "confidence": 45,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:4:// When wasUseful=false is recorded via memory_validate, reduce the
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:5:// Memory's composite score via a confidence multiplier.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:12:// Feature catalog: Negative feedback confidence signal
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:38:  CREATE TABLE IF NOT EXISTS negative_feedback_events (
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:47:  CREATE INDEX IF NOT EXISTS idx_negative_feedback_events_memory
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:48:  ON negative_feedback_events(memory_id, created_at_ms DESC)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:56: * Compute the confidence multiplier based on negative validation count
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:103: * Apply negative feedback confidence signal to a composite score.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:133:    'INSERT INTO negative_feedback_events (memory_id, created_at_ms) VALUES (?, ?)'
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:164:     FROM negative_feedback_events
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:56:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:87:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:55:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:130:  it('T005b-Q3d: getIngestForecast returns low-confidence caveat before progress starts', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:146:      caveat: 'Forecast is low-confidence until at least one file has been processed.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:92: * Filter results by a minimum quality score threshold.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:99: * @param threshold - Minimum quality score in [0, 1] (inclusive).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:356: * expansion and the additional search channels add latency without recall gain.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508:  // the query for the hybrid search channel, improving recall for alias-rich
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:717:          // F1: Wrap parallel variant searches with latency budget.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:789:      // The query as "simple", suppressing expansion with zero added latency.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:871:      // Phase B T016: Uses effectiveQuery (concept-expanded) for BM25 recall.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1167:  //   - Check if the current baseline has low confidence.
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:9:const VALID_RECOVERY_STATUSES = ['no_results', 'low_confidence', 'partial'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:134:  it('classifies weak result sets as low_confidence', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:163:    expect(envelope.data.recovery?.status).toBe('low_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:45:  return { queryId: 1, memoryId, relevance };
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:262:      latencyMs: expect.any(Number),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:270:    expect(typeof parsed.data.postMutationHooks.latencyMs).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:294:      latencyMs: expect.any(Number),
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:299:    // Accept strict equality or floating point precision
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:70:        'handle_memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:609:          queryId: `consumption:${queryLogId}`,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:624:          queryId: `consumption:${queryLogId}`,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:14:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:22:  confidenceRequired: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:24:  confidenceMet: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:30:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:39:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:49:      FROM negative_feedback_events
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:68:  confidence: number,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:75:  return confidence >= PROMOTION_CONFIDENCE_THRESHOLD &&
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:97: * Record a validation event for a memory and persist confidence counters.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:100: * - This function updates `memory_index.confidence` and `validation_count`,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:114:        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:121:      const currentConfidence = memory.confidence ?? CONFIDENCE_BASE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:135:        SET confidence = ?, validation_count = ?, updated_at = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:157:        console.warn('[confidence-tracker] negative feedback recorded', {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:166:        confidence: newConfidence,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:177:    console.error(`[confidence-tracker] recordValidation failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:183: * Get current confidence score for a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:189:      SELECT confidence FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:190:    `).get(memoryId) as { confidence?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:196:    return memory.confidence ?? CONFIDENCE_BASE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:198:    console.error(`[confidence-tracker] getConfidenceScore failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:209:      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:221:    const confidence = memory.confidence ?? CONFIDENCE_BASE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:226:    return isPromotionEligible(memory.importance_tier, confidence, positiveValidationCount);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:228:    console.error(`[confidence-tracker] checkPromotionEligible failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:240:        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:256:        `Requires confidence >= ${PROMOTION_CONFIDENCE_THRESHOLD} (current: ${memory.confidence ?? CONFIDENCE_BASE}) ` +
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:268:    console.warn(`[confidence-tracker] Memory ${memoryId} promoted to critical tier`);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:272:    console.error(`[confidence-tracker] promoteToCritical failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:278: * Get full confidence info for a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:286:      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:293:    const confidence = memory.confidence ?? CONFIDENCE_BASE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:300:      confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:304:      promotionEligible: isPromotionEligible(memory.importance_tier, confidence, positiveValidationCount),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:306:        confidenceRequired: PROMOTION_CONFIDENCE_THRESHOLD,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:308:        confidenceMet: confidence >= PROMOTION_CONFIDENCE_THRESHOLD,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:315:    console.error(`[confidence-tracker] getConfidenceInfo failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:37:    confidence: 0.95,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:77:    confidence: 0.95,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:213:    expect(memory.confidence).toBe(0.95);
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:5:// Transparent Reasoning Module (TRM): Z-score confidence check
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:6:// On RRF scores to detect low-confidence retrieval and inject
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:14:/** Z-score threshold below which retrieval confidence is considered low. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:35:  /** True when retrieval confidence is too low to trust results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:92: * save 30-50 ms of latency.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:208:  return `> **[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=${trm.zScore.toFixed(2)}). Consider first principles.**`;
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:8:import * as confidenceTracker from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:23:    confidence = 0.95,
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:25:  }: { tier?: string; confidence?: number; validationCount?: number } = {},
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:28:    INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:30:  `).run(id, `memory-${id}`, confidence, validationCount, tier, new Date().toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:41:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:58:  it('confidence-tracker eligibility subtracts negative validations from threshold counts', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:59:    insertMemory(1, { confidence: 0.95, validationCount: 5, tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:60:    expect(confidenceTracker.checkPromotionEligible(db, 1)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:65:    expect(confidenceTracker.checkPromotionEligible(db, 1)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:67:    const info = confidenceTracker.getConfidenceInfo(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:74:    insertMemory(2, { confidence: 0.9, validationCount: 4, tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:76:    const negativeResult = confidenceTracker.recordValidation(db, 2, false);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:85:    const positiveResult = confidenceTracker.recordValidation(db, 2, true);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:89:      avgConfidence: undefined, // no confidence data
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:143:  it('emits status "low_confidence" when avgConfidence < threshold', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:148:    expect(payload.status).toBe('low_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:250:  it('recommends "ask_user" for low_confidence + knowledge_gap', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:257:    expect(payload.status).toBe('low_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:324:    const validStatuses = ['no_results', 'low_confidence', 'partial'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:152:        { detected: true, type: 'deprecation', description: 'Previous guidance replaced', confidence: 0.75 },
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:105:    expect(typeof result.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:114:    expect(result.confidence).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:121:    expect(result.confidence).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:420:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:646:  it('C138-T2: classifyIntent returns confidence between 0 and 1', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:648:    expect(result.confidence).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:649:    expect(result.confidence).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:180:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:332:    /** B1: Per-stage and total timing in milliseconds for latency observability. */
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:3:description: "Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking."
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:12:> Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:48:| **HVR Integration** | Human Validation Rate integration for confidence-weighted scoring (Spec 137) |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:125:HVR integration extends the confidence tracking system by incorporating human validation signals into composite scoring. The HVR score reflects how often users confirm a memory as useful versus not useful, creating a feedback-weighted confidence metric.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:132:- Works alongside the existing promotion pipeline in `confidence-tracker.ts`
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:165: confidence-tracker.ts    # User validation and promotion
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:168: negative-feedback.ts     # Negative validation confidence multiplier with time-based recovery
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:181:| `confidence-tracker.ts` | Feedback loop: validation -> promotion |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:184:| `negative-feedback.ts` | Negative validation confidence multiplier with 30-day half-life recovery; records negative feedback events and batch-loads stats for scoring pipeline |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:246:import { recordValidation, getConfidenceInfo } from './confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:253:// Returns: { confidence: 0.6, validationCount: 1, promotionEligible: false }
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:255:// After 5+ validations with confidence >= 0.9
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:160:    it('handles very small score ranges with stable precision', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:163:vi.mock('../lib/search/confidence-scoring', () => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:98:- TRM evidence-gap detection (Z-score confidence check on score distribution).
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:163: *      retrieval; broadening them degrades precision without recall gain.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:194:  // Query as "simple", R12 expansion is suppressed to avoid latency overhead
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:195:  // On short, high-precision queries.
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:8:// T1-T5   : extractValidationMetadata — quality score signals
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:39:describe('extractValidationMetadata — quality score signals', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:78:  it('T5: maps all known importance tiers to expected quality scores', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:98:    it('retrieves all selections when no queryId filter', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:107:    it('filters selections by queryId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:114:      expect(history.every(s => s.queryId === 'q1')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:149:      expect(sel.queryId).toBe('q1');
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:168:    it('returns operational labels with bounded relevance and confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:170:        { queryId: 'q1', memoryId: 42, queryText: 'test query', memoryContent: 'test content' },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:171:        { queryId: 'q2', memoryId: 43, queryText: 'another query', memoryContent: 'another content' },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:177:      expect(labels[0].queryId).toBe('q1');
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:181:      expect(labels[0].confidence).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:182:      expect(labels[0].confidence).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:195:        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.95, reasoning: 'Highly relevant' },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:196:        { queryId: 'q2', memoryId: 43, relevance: 1, confidence: 0.6 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:205:        { queryId: 'q1', memoryId: 42, relevance: 1, confidence: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:208:        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:222:        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:223:        { queryId: 'q2', memoryId: 43, relevance: 2, confidence: 0.85 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:224:        { queryId: 'q3', memoryId: 44, relevance: 1, confidence: 0.7 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:227:        { queryId: 'q1', memoryId: 42, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:228:        { queryId: 'q2', memoryId: 43, relevance: 2 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:229:        { queryId: 'q3', memoryId: 44, relevance: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:243:        { queryId: 'q1', memoryId: 42, relevance: 0, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:244:        { queryId: 'q2', memoryId: 43, relevance: 0, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:247:        { queryId: 'q1', memoryId: 42, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:248:        { queryId: 'q2', memoryId: 43, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:262:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:263:        { queryId: 'q2', memoryId: 2, relevance: 2, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:264:        { queryId: 'q3', memoryId: 3, relevance: 1, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:265:        { queryId: 'q4', memoryId: 4, relevance: 0, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:266:        { queryId: 'q5', memoryId: 5, relevance: 2, confidence: 0.9 }, // disagrees
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:269:        { queryId: 'q1', memoryId: 1, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:270:        { queryId: 'q2', memoryId: 2, relevance: 2 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:271:        { queryId: 'q3', memoryId: 3, relevance: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:272:        { queryId: 'q4', memoryId: 4, relevance: 0 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:273:        { queryId: 'q5', memoryId: 5, relevance: 0 }, // disagrees
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:285:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:286:        { queryId: 'q2', memoryId: 2, relevance: 2, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:287:        { queryId: 'q3', memoryId: 3, relevance: 1, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:288:        { queryId: 'q4', memoryId: 4, relevance: 3, confidence: 0.9 }, // disagrees
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:289:        { queryId: 'q5', memoryId: 5, relevance: 3, confidence: 0.9 }, // disagrees
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:292:        { queryId: 'q1', memoryId: 1, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:293:        { queryId: 'q2', memoryId: 2, relevance: 2 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:294:        { queryId: 'q3', memoryId: 3, relevance: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:295:        { queryId: 'q4', memoryId: 4, relevance: 0 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:296:        { queryId: 'q5', memoryId: 5, relevance: 0 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:307:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 }, // exact match
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:308:        { queryId: 'q2', memoryId: 2, relevance: 2, confidence: 0.9 }, // +1 from manual
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:309:        { queryId: 'q3', memoryId: 3, relevance: 0, confidence: 0.9 }, // -2 from manual
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:312:        { queryId: 'q1', memoryId: 1, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:313:        { queryId: 'q2', memoryId: 2, relevance: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:314:        { queryId: 'q3', memoryId: 3, relevance: 2 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:326:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:327:        { queryId: 'q99', memoryId: 99, relevance: 0, confidence: 0.9 }, // no manual match
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:330:        { queryId: 'q1', memoryId: 1, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:331:        { queryId: 'q50', memoryId: 50, relevance: 2 }, // no LLM match
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:343:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:346:        { queryId: 'q2', memoryId: 2, relevance: 2 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:358:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:359:        { queryId: 'q2', memoryId: 2, relevance: 0, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:362:        { queryId: 'q1', memoryId: 1, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:363:        { queryId: 'q2', memoryId: 2, relevance: 2 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:401:        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:402:        { queryId: 'q2', memoryId: 43, relevance: 2, confidence: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:418:        { queryId: 'q3', memoryId: 44, relevance: 2, confidence: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:785:Monitor query latency and adjust the candidate pool size.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:9:// Timing is recorded for latency observability.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:43:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:286:    memoryTypeConfidence: typeInference.confidence,
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:140:  it('accepts eval_run_ablation mode and custom queries', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:142:      validateToolArgs('eval_run_ablation', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:145:        recallK: 20,
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:150:  it('rejects unknown eval_run_ablation modes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:152:      validateToolArgs('eval_run_ablation', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:479:describe('memory_health schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:482:      validateToolInputSchema('memory_health', { reportMode: 'divergent_aliases', limit: 201 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:488:      validateToolInputSchema('memory_health', { autoRepair: true, confirmed: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:493:    const parsed = validateToolArgs('memory_health', { autoRepair: true, confirmed: true });
.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:287:    expect(typeof result.classification.confidence).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:329:    expect(result.classification.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:163:    expect(shortQuery.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:167:    expect(longQuery.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:174:    expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:228:  it('reports high confidence for trigger matches', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:231:      expect(result.confidence).toBe('high');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:235:  it('reports high confidence for very short queries', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:238:      expect(result.confidence).toBe('high');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:276:  it('reports appropriate confidence for moderate tier', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:279:      expect(['low', 'medium']).toContain(result.confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:283:  it('reports low confidence near simple boundary (4 terms)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:287:      expect(result.confidence).toBe('low');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:291:  it('reports low confidence near complex boundary (8 terms)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:295:      expect(result.confidence).toBe('low');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:335:  it('reports high confidence for very long queries (>12 terms)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:341:      expect(result.confidence).toBe('high');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:345:  it('reports high confidence for content-rich queries (low stop-word ratio)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:352:      expect(result.confidence).toBe('high');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:525:      expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:533:      expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:542:      expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:551:      expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:560:      expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:600:      expect(typeof result.confidence).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:17:// Feature catalog: Negative feedback confidence signal
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:531: * The queryIdPrefix is the only difference between the two call sites.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:535: * @param queryIdPrefix  Short label identifying the scoring model ('5f' | 'cs')
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:541:  queryIdPrefix: string,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:564:        queryId: `${queryIdPrefix}-${Date.now()}`,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:95:    const content = 'Must stop if confidence is below 80%.';
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:98:    expect(directive!.surfaceCondition).toContain('confidence is below 80%');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:58:    expect(ref.confidence).toBeCloseTo(0.89, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:69:    expect(ref.confidence).toBeLessThan(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:5:// (before entering the scoring pipeline), reducing latency for
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:11:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:17:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:193:/** P3-12: Minimum confidence threshold below which "general" style fallback is used */
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:383:      confidence: Math.min(1, score),
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:399: * Classify a query string into one of 7 intent types with confidence and keyword evidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:402: * @returns Intent result with type, confidence, per-intent scores, and matched keywords
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:408:      confidence: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:467:  // P3-12: If top score is below minimum confidence, return "understand" with low confidence
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:472:      confidence: topScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:481:    confidence: Math.min(1, topScore),
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:492: * @returns Intent result with type, confidence, scores, and keywords
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:653: * confidence, the class strategy's `boostFactor` is applied to the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:666:  if (!routingResult || routingResult.confidence <= 0) return results;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:700: * confidence-multiplier demotion. The multiplier is batch-loaded from the DB
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:763:    // Apply negative feedback demotion (multiplicative confidence multiplier)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:938: *   5.  Artifact routing   (all types, when routing confidence > 0)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1230:  if (config.artifactRouting && config.artifactRouting.confidence > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1304:    config.artifactRouting.confidence > 0 &&
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:19:} from '../lib/search/confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:48:    const content = `## Problem & Purpose\n\nThis module improves retrieval precision.`;
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:49:    expect(extractDescription(content)).toBe('This module improves retrieval precision');
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:557:      queryId: 'consumption:1001',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:561:      queryId: 'consumption:1001',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:154:    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 11, evalRunId: 22 });
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:164:      queryId: 11,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:235:    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 31, evalRunId: 32 });
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:289:    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 41, evalRunId: 42 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:30:// 3. Apply evidence gap detection via TRM (Z-score confidence check)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:452:          confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:138:// Default hint is "Run memory_health() for diagnostics".
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:149:      'Run memory_health() to check embedding system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:152:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:168:      'Check network latency to embedding provider',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:179:      'Run memory_health() to see current provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:182:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:242:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:247:      'Run memory_health() to check database integrity',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:252:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:268:      'Contact support with schema version info from memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:271:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:276:      'Run memory_health() to assess damage',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:286:      'Run memory_health() to check database status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:291:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:316:      'Use memory_health() to see current system limits'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:324:      'Use memory_stats() to see available spec folders',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:328:    toolTip: 'memory_stats()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:336:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:340:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:345:      'Check embedding provider status with memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:350:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:377:      'Check memory_stats() to see what content is indexed'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:380:    toolTip: 'memory_stats()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:447:      'Run memory_health() to check system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:450:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:487:      'Check memory_health() for recovery options'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:490:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:529:      'Run memory_health() to check database status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:532:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:659:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:663:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:677:    'Run memory_health() for diagnostics',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:682:  toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:699:        'Check embedding provider status: memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:734:        'Run memory_health() to verify database integrity'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:737:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:757:        'Check memory_health() for embedding provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:760:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:24: * Importance tier → quality score mapping.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:71:  /** Normalised quality score in [0, 1] derived from quality_score or importance_tier. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:80: * Derive a normalised quality score from importance_tier, clamped to [0, 1].
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:162: *   2. `importance_tier` → tier quality score mapping.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:236:  // -- 4. Importance tier signal (even without quality score fallback above) --
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:142:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:148:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:154:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:160:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:166:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:172:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:178:    expect(result.confidence).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:190:    expect(result.confidence).toBe(0.3); // Low confidence from folder hint
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:76:        'handle_memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:77:        'handle_memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:14:// T10 No latency degradation for simple queries (< 5 ms)
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:143:      'how does the embedding based query expansion pipeline handle recall precision tradeoffs';
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:147:      makeMockMemory(1, 'recall precision tradeoff semantic retrieval pipeline'),
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:149:      makeMockMemory(3, 'hybrid retrieval fusion recall semantic candidates'),
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:226:    const complexQuery = 'how does embedding expansion affect recall and precision tradeoffs here';
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:291:  // -- T10: No latency degradation for simple queries -----------------------
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:277:      expect(hardNegIds.has(r.queryId)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:379:      expect(validIds.has(r.queryId)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:684:      expect(hardNegIds.has(r.queryId)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1094:export function get_usage_stats(options: UsageStatsOptions = {}): Array<{ id: number; title: string | null; spec_folder: string; file_path: string; access_count: number; last_accessed: number | null; confidence: number | null; created_at: string }> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1101:  const valid_sort_fields = ['access_count', 'last_accessed', 'confidence'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1109:           last_accessed, confidence, created_at
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1121:    confidence: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1137:export function find_cleanup_candidates(options: CleanupOptions = {}): Array<{ id: number; specFolder: string; filePath: string; title: string; createdAt: string | undefined; lastAccessedAt: number | undefined; accessCount: number; confidence: number; ageString: string; lastAccessString: string; reasons: string[] }> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1160:      confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1166:      OR confidence <= ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1171:      confidence ASC
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1203:    if ((row.confidence || 0.5) <= maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1204:      reasons.push(`low importance (${Math.round((row.confidence || 0.5) * 100)}%)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1215:      confidence: row.confidence || 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1229:export function get_memory_preview(memory_id: number, max_lines = 50): { id: number; specFolder: string; filePath: string; title: string; createdAt: string | undefined; lastAccessedAt: number | undefined; accessCount: number; confidence: number; ageString: string; lastAccessString: string; content: string } | null {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1276:    confidence: memory.confidence || 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:8:// Generates surrogate metadata at index time to improve recall without
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:92: *   - Slash-separated synonyms: "recall/precision" → ["recall", "precision"]
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:11:  { tool: 'memory_stats', handler: 'handleMemoryStats', layer: 'L3' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:12:  { tool: 'memory_health', handler: 'handleMemoryHealth', layer: 'L3' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:15:  { tool: 'memory_validate', handler: 'handleMemoryValidate', layer: 'L4' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:26:  { tool: 'eval_run_ablation', handler: 'handleEvalRunAblation', layer: 'L6' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:27:  { tool: 'eval_reporting_dashboard', handler: 'handleEvalReportingDashboard', layer: 'L6' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:37:  { camel: 'handleMemoryStats', snake: 'handle_memory_stats' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:38:  { camel: 'handleMemoryHealth', snake: 'handle_memory_health' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:41:  { camel: 'handleMemoryValidate', snake: 'handle_memory_validate' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:53:  { camel: 'handleEvalRunAblation', snake: 'handle_eval_run_ablation' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:54:  { camel: 'handleEvalReportingDashboard', snake: 'handle_eval_reporting_dashboard' },
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:4:// Validates confidence computation, label thresholds, driver list
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:13:} from '../lib/search/confidence-scoring';
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:74:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:75:    expect(confidences).toHaveLength(3);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:80:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:81:    expect(confidences).toHaveLength(1);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:84:  it('confidence value is in [0, 1] range for all results', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:86:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:87:    for (const c of confidences) {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:88:      expect(c.confidence.value).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:89:      expect(c.confidence.value).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:107:    expect(conf.confidence.label).toBe('high');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:108:    expect(conf.confidence.value).toBeGreaterThanOrEqual(0.7);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:112:    // Zero score, single channel, no reranker, no anchors → very low confidence
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:115:    expect(conf.confidence.label).toBe('low');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:116:    expect(conf.confidence.value).toBeLessThan(0.4);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:123:    expect(['medium', 'high']).toContain(conf.confidence.label);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:130:  it('large margin (>= 0.15) boosts confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:133:    expect(topConf.confidence.drivers).toContain('large_margin');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:139:    expect(topConf.confidence.drivers).not.toContain('large_margin');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:144:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:145:    const lastConf = confidences[confidences.length - 1];
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:146:    expect(lastConf.confidence.drivers).not.toContain('large_margin');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:160:    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:170:    expect(conf.confidence.drivers).not.toContain('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:181:    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:196:    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:207:    expect(conf.confidence.drivers).not.toContain('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:217:    expect(conf.confidence.drivers).toContain('reranker_boost');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:223:    expect(conf.confidence.drivers).not.toContain('reranker_boost');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:229:    expect(conf.confidence.drivers).not.toContain('reranker_boost');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:235:    expect(conf.confidence.drivers).not.toContain('reranker_boost');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:252:    expect(conf.confidence.drivers).toContain('anchor_density');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:262:    expect(conf.confidence.drivers).not.toContain('anchor_density');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:268:    expect(conf.confidence.drivers).not.toContain('anchor_density');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:279:    expect(highConf.confidence.value).toBeGreaterThan(lowConf.confidence.value);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:286:    expect(conf.confidence.value).toBeGreaterThan(0.2);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:292:    expect(conf.confidence.value).toBeGreaterThan(0.2);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:299:    expect(conf.confidence.value).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:300:    expect(conf.confidence.value).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:311:    expect(Array.isArray(conf.confidence.drivers)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:326:    expect(conf.confidence.drivers.length).toBeGreaterThan(1);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:327:    expect(conf.confidence.drivers).toContain('large_margin');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:328:    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:329:    expect(conf.confidence.drivers).toContain('reranker_boost');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:330:    expect(conf.confidence.drivers).toContain('anchor_density');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:342:  it('returns "good" when most results are high/medium confidence and top score is high', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:348:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:349:    const { requestQuality } = assessRequestQuality(results, confidences);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:353:  it('returns "gap" when all results have low confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:355:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:356:    const { requestQuality } = assessRequestQuality(results, confidences);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:360:  it('returns "weak" for results with mediocre scores and mixed confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:362:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:363:    const { requestQuality } = assessRequestQuality(results, confidences);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:371:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:372:    const { requestQuality } = assessRequestQuality(results, confidences);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:378:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:379:    const assessment = assessRequestQuality(results, confidences);
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:876:        confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:919:        confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:47:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:59:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:71:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:79:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:139:    confidence REAL NOT NULL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:221: * @param queryId - Identifier for the query (can be eval_queries.id or a hash).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:227:  queryId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:241:      queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:264: * @param queryId - Optional filter by query ID. Omit for all selections.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:269:  queryId?: string,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:276:    const whereClause = queryId ? 'WHERE query_id = ?' : '';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:277:    const params = queryId ? [queryId, limit] : [limit];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:302:      queryId: row.query_id,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:329: * relevance grades (0-3) and confidence (0-1). This provides an
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:342:  querySelectionPairs: Array<{ queryId: string; memoryId: number; queryText: string; memoryContent: string }>,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:353:          queryId: pair.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:356:          confidence: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:375:      const confidenceBase = 0.2 + (overlap * 0.7) + (phraseMatch ? 0.1 : 0);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:376:      const confidence = Math.round(clamp01(confidenceBase) * 1000) / 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:379:        queryId: pair.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:382:        confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:405:        (query_id, memory_id, relevance, confidence, reasoning)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:413:          label.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:416:          label.confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:437: * Matches labels by (queryId, memoryId) pairs and computes:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:454:  // Build manual label lookup: "queryId:memoryId" → relevance
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:457:    const key = `${m.queryId}:${m.memoryId}`;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:468:    const key = `${llm.queryId}:${llm.memoryId}`;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:37:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:78:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:105:    INSERT INTO memory_index (spec_folder, file_path, title, content_text, importance_tier, created_at, last_accessed, access_count, confidence, is_pinned, stability, half_life_days)
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:117:    data.confidence || 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:178:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:188:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:207:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:226:        confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:244:        confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:515:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:521:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:527:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:535:        confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:552:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:569:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:638:          confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:659:          confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:679:        confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:34:  return { queryId: 1, memoryId, relevance, tier, createdAt };
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:127:   CORE: Recall@20
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:130:describe('Recall@20', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:285:  it('T006-D13: Weighted recall ≠ unweighted recall when tiers differ', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:295:  it('T006-D14: All relevant found → weighted recall = 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:301:  it('T006-D15: No relevant items → weighted recall = 0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:315:  it('T006-D17: Duplicate memoryIds in results do not inflate weighted recall', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:449:      'recall',
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:450:      'precision',
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:508:  it('T006-F02: All items have relevance 0 — recall and MRR = 0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:555:  it('T005-02: computeF1 matches harmonic mean of deduped precision and recall', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:559:    const precision = computePrecision(results, gt, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:560:    const recall = computeRecall(results, gt, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:561:    const expectedF1 = (2 * precision * recall) / (precision + recall);
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:4:import * as confMod from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:18:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:29:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:35:    'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier) VALUES (?, ?, ?, ?, ?)'
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:39:    opts.confidence ?? 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:87:      insertMemory(db, 1, { confidence: 0.95, validation_count: 6, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:99:      insertMemory(db, 1, { confidence: 0.95, validation_count: 7, importance_tier: 'important' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:110:        'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:121:      insertMemory(db, 1, { confidence: 0.99, validation_count: 10, importance_tier: 'critical' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:130:      insertMemory(db, 1, { confidence: 0.99, validation_count: 10, importance_tier: 'constitutional' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:139:      insertMemory(db, 1, { confidence: 0.3, validation_count: 1, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:155:      insertMemory(db, 1, { confidence: 0.4, validation_count: 2, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:167:      insertMemory(db, 1, { confidence: ct, validation_count: vt, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:174:    it('T-CT16 fails just below confidence threshold', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:178:      insertMemory(db, 1, { confidence: ct - 0.01, validation_count: vt, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:189:      insertMemory(db, 1, { confidence: ct, validation_count: vt - 1, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:12://   - Cap at MAX_FACETS (3) to bound latency
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:38:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:256: * Returns a RoutingResult with the detected class, strategy, and confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:262:    confidence: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:302:  const confidence = bestScore > 0 ? Math.min(1, bestScore / 6) : 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:310:      confidence: 0.4,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:321:        confidence: 0.3, // Low confidence from folder hint only
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:329:    confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:77:    tools: ['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:102:      'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:103:      'eval_reporting_dashboard',
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:231:      confidenceImpact: 0.3,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:239:    expect(contract.confidenceImpact).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:240:    expect(contract.confidenceImpact).toBeLessThanOrEqual(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:247:      confidenceImpact: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:251:    expect(totalFailure.confidenceImpact).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:10:// Acceptance criterion: ablation run shows per-channel Recall@20 delta
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:83:function buildMockMetrics(recallDelta: number): AblationMetrics {
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:88:    'MRR@5': entry(0.65, recallDelta * 0.8),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:89:    'precision@5': entry(0.5, recallDelta * 0.7),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:90:    'recall@5': entry(0.6, recallDelta),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:91:    'NDCG@5': entry(0.7, recallDelta * 0.9),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:92:    'MAP': entry(0.55, recallDelta * 0.6),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:93:    'hit_rate': entry(0.9, recallDelta * 0.3),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:94:    'latency_p50': entry(12, 0.5),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:95:    'latency_p95': entry(25, 1.2),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:403:  // 5. runAblation() — computes correct baseline and ablated recalls
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:414:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:419:        .filter(r => r.queryId === queryWithGT!.id && r.relevance > 0)
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:455:    it('computes baseline and ablated recalls with mock search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:466:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:473:        r => r.queryId === queryWithGT!.id && r.relevance > 0,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:489:        recallK: 20,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:507:      // Each ablated channel should show reduced recall (delta < 0)
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:523:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:529:        r => r.queryId === queryWithGT!.id && r.relevance > 0,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:562:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:568:        r => r.queryId === queryWithGT!.id && r.relevance > 0,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:607:        queryId: queryWithGT!.id,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:623:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:629:        r => r.queryId === queryWithGT!.id && r.relevance > 0,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:656:        recallK: 20,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:674:        expect(failure.queryId).toBe(queryWithGT!.id);
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:720:      expect(md).toContain(`**Baseline Recall@20:** 0.8000`);
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:738:      // Find the recall-delta table data rows (first table only — between first header and first blank line after it)
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:840:            queryId: 42,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:847:      expect(md).toContain('`graph` (queryId=42): Graph timeout');
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:927:    // 1 baseline + 3 channels * (1 recall_delta + 8 metric deltas) = 28 total
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:931:    const baselineRow = rows.find(r => r.metric_name === 'ablation_baseline_recall@20');
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:937:    const deltaRows = rows.filter(r => r.metric_name === 'ablation_recall@20_delta');
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:983:        { channel: 'vector', error: 'vector outage', queryId: 1, query: 'q1' },
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:984:        { channel: 'bm25', error: 'bm25 outage', queryId: 1, query: 'q1' },
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:994:       WHERE metric_name = 'ablation_baseline_recall@20'
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1021:       WHERE metric_name = 'ablation_baseline_recall@20'
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1054:    // ACCEPTANCE CRITERION: ablation run shows per-channel Recall@20 delta
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1067:      GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1089:        r => r.queryId === matchedQuery.id && r.relevance > 0,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1115:      recallK: 20,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1147:    expect(md).toContain('Recall@20');
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1150:  it('ablation report shows distinct per-channel Recall@20 deltas', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1156:      GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1162:      r => r.queryId === queryWithGT!.id && r.relevance > 0,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1206:    'MRR@5', 'precision@5', 'recall@5', 'NDCG@5', 'MAP',
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1207:    'hit_rate', 'latency_p50', 'latency_p95', 'token_usage',
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1225:  it('latency_p50 and latency_p95 are non-negative', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1228:      expect(result.metrics!['latency_p50'].baseline).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1229:      expect(result.metrics!['latency_p95'].baseline).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1230:      expect(result.metrics!['latency_p50'].ablated).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1231:      expect(result.metrics!['latency_p95'].ablated).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1275:    it('stores 9 additional metric rows per channel plus baseline + recall delta', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1286:      // 1 baseline + 3 channels * (1 recall_delta + 8 persisted metric deltas) = 1 + 27 = 28
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1291:        r => r.channel === 'vector' && r.metric_name.startsWith('ablation_') && r.metric_name !== 'ablation_recall@20_delta' && r.metric_name !== 'ablation_baseline_recall@20',
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1298:      expect(metricNames).toContain('ablation_precision@5_delta');
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1299:      expect(metricNames).toContain('ablation_recall@5_delta');
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1303:      expect(metricNames).toContain('ablation_latency_p50_delta');
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1304:      expect(metricNames).toContain('ablation_latency_p95_delta');
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1319:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1324:        r => r.queryId === queryWithGT!.id && r.relevance > 0,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1367:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:9:      latencyMs: 9,
.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:20:      latencyMs: 9,
.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:36:      latencyMs: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:50:      latencyMs: 2,
.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:88:      latencyMs: 6,
.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:98:      latencyMs: 6,
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:123:    const contract = buildStructuralBootstrapContract('session_health');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:126:    expect(contract.sourceSurface).toBe('session_health');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:39:    const trace = createTrace('query', 'sess-123', 'recall');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:42:    expect(trace.intent).toBe('recall');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:167:    expect(contract.confidence_impact).toBe(0.8);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:172:  it('createDegradedContract clamps confidence_impact to [0, 1]', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:174:    expect(overContract.confidence_impact).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:177:    expect(underContract.confidence_impact).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:180:    expect(nanContract.confidence_impact).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:183:    expect(infContract.confidence_impact).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:434:  it('T058: DEFAULT_HINT actions include memory_health() reference (REQ-009)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:437:      a.includes('memory_health()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:446:  it('T060: DEFAULT_HINT has toolTip for memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:447:    expect(DEFAULT_HINT.toolTip).toBe('memory_health()');
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:830:      "expectedResultDescription": "Should surface incremental-index.ts, retry-manager.ts, and any spec about the indexing latency after save operations.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1101:      "notes": "Manual query targeting a specific quantitative formula documented in the system — tests factual precision retrieval."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1106:      "queryId": 1,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1111:      "queryId": 1,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1116:      "queryId": 1,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1121:      "queryId": 2,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1126:      "queryId": 2,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1131:      "queryId": 2,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1136:      "queryId": 3,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1141:      "queryId": 3,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1146:      "queryId": 3,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1151:      "queryId": 4,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1156:      "queryId": 4,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1161:      "queryId": 4,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1166:      "queryId": 5,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1171:      "queryId": 5,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1176:      "queryId": 5,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1181:      "queryId": 6,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1186:      "queryId": 6,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1191:      "queryId": 6,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1196:      "queryId": 7,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1201:      "queryId": 7,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1206:      "queryId": 7,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1211:      "queryId": 8,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1216:      "queryId": 8,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1221:      "queryId": 8,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1226:      "queryId": 9,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1231:      "queryId": 9,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1236:      "queryId": 9,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1241:      "queryId": 10,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1246:      "queryId": 10,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1251:      "queryId": 10,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1256:      "queryId": 11,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1261:      "queryId": 11,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1266:      "queryId": 11,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1271:      "queryId": 12,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1276:      "queryId": 12,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1281:      "queryId": 12,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1286:      "queryId": 13,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1291:      "queryId": 13,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1296:      "queryId": 13,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1301:      "queryId": 14,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1306:      "queryId": 14,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1311:      "queryId": 14,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1316:      "queryId": 15,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1321:      "queryId": 15,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1326:      "queryId": 15,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1331:      "queryId": 16,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1336:      "queryId": 16,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1341:      "queryId": 16,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1346:      "queryId": 22,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1351:      "queryId": 22,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1356:      "queryId": 22,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1361:      "queryId": 23,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1366:      "queryId": 23,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1371:      "queryId": 23,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1376:      "queryId": 24,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1381:      "queryId": 24,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1386:      "queryId": 24,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1391:      "queryId": 25,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1396:      "queryId": 25,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1401:      "queryId": 25,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1406:      "queryId": 26,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1411:      "queryId": 26,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1416:      "queryId": 26,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1421:      "queryId": 27,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1426:      "queryId": 27,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1431:      "queryId": 27,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1436:      "queryId": 28,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1441:      "queryId": 28,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1446:      "queryId": 28,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1451:      "queryId": 29,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1456:      "queryId": 29,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1461:      "queryId": 29,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1466:      "queryId": 30,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1471:      "queryId": 30,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1476:      "queryId": 30,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1481:      "queryId": 31,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1486:      "queryId": 31,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1491:      "queryId": 31,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1496:      "queryId": 32,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1501:      "queryId": 32,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1506:      "queryId": 32,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1511:      "queryId": 33,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1516:      "queryId": 33,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1521:      "queryId": 33,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1526:      "queryId": 34,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1531:      "queryId": 34,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1536:      "queryId": 34,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1541:      "queryId": 35,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1546:      "queryId": 35,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1551:      "queryId": 35,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1556:      "queryId": 36,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1561:      "queryId": 36,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1566:      "queryId": 36,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1571:      "queryId": 37,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1576:      "queryId": 37,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1581:      "queryId": 37,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1586:      "queryId": 38,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1591:      "queryId": 38,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1596:      "queryId": 38,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1601:      "queryId": 39,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1606:      "queryId": 39,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1611:      "queryId": 39,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1616:      "queryId": 40,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1621:      "queryId": 40,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1626:      "queryId": 40,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1631:      "queryId": 41,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1636:      "queryId": 41,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1641:      "queryId": 41,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1646:      "queryId": 42,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1651:      "queryId": 42,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1656:      "queryId": 42,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1661:      "queryId": 43,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1666:      "queryId": 43,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1671:      "queryId": 43,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1676:      "queryId": 44,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1681:      "queryId": 44,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1686:      "queryId": 44,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1691:      "queryId": 45,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1696:      "queryId": 45,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1701:      "queryId": 45,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1706:      "queryId": 46,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1711:      "queryId": 46,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1716:      "queryId": 46,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1721:      "queryId": 47,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1726:      "queryId": 47,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1731:      "queryId": 47,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1736:      "queryId": 48,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1741:      "queryId": 48,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1746:      "queryId": 48,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1751:      "queryId": 49,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1756:      "queryId": 49,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1761:      "queryId": 49,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1766:      "queryId": 50,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1771:      "queryId": 50,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1776:      "queryId": 50,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1781:      "queryId": 51,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1786:      "queryId": 51,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1791:      "queryId": 51,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1796:      "queryId": 52,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1801:      "queryId": 52,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1806:      "queryId": 53,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1811:      "queryId": 53,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1816:      "queryId": 53,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1821:      "queryId": 54,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1826:      "queryId": 54,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1831:      "queryId": 54,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1836:      "queryId": 55,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1841:      "queryId": 55,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1846:      "queryId": 55,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1851:      "queryId": 56,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1856:      "queryId": 56,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1861:      "queryId": 56,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1866:      "queryId": 57,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1871:      "queryId": 57,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1876:      "queryId": 57,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1881:      "queryId": 58,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1886:      "queryId": 58,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1891:      "queryId": 58,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1896:      "queryId": 59,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1901:      "queryId": 59,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1906:      "queryId": 60,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1911:      "queryId": 60,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1916:      "queryId": 60,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1921:      "queryId": 61,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1926:      "queryId": 61,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1931:      "queryId": 61,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1936:      "queryId": 62,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1941:      "queryId": 62,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1946:      "queryId": 62,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1951:      "queryId": 63,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1956:      "queryId": 63,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1961:      "queryId": 64,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1966:      "queryId": 64,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1971:      "queryId": 64,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1976:      "queryId": 65,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1981:      "queryId": 65,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1986:      "queryId": 65,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1991:      "queryId": 66,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1996:      "queryId": 66,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2001:      "queryId": 66,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2006:      "queryId": 67,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2011:      "queryId": 67,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2016:      "queryId": 67,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2021:      "queryId": 68,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2026:      "queryId": 68,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2031:      "queryId": 68,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2036:      "queryId": 69,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2041:      "queryId": 69,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2046:      "queryId": 69,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2051:      "queryId": 70,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2056:      "queryId": 70,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2061:      "queryId": 70,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2066:      "queryId": 71,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2071:      "queryId": 71,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2076:      "queryId": 71,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2081:      "queryId": 72,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2086:      "queryId": 72,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2091:      "queryId": 72,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2096:      "queryId": 73,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2101:      "queryId": 73,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2106:      "queryId": 73,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2111:      "queryId": 74,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2116:      "queryId": 74,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2121:      "queryId": 74,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2126:      "queryId": 75,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2131:      "queryId": 75,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2136:      "queryId": 75,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2141:      "queryId": 76,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2146:      "queryId": 76,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2151:      "queryId": 76,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2156:      "queryId": 77,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2161:      "queryId": 77,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2166:      "queryId": 77,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2171:      "queryId": 78,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2176:      "queryId": 78,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2181:      "queryId": 79,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2186:      "queryId": 79,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2191:      "queryId": 79,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2196:      "queryId": 80,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2201:      "queryId": 80,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2206:      "queryId": 80,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2211:      "queryId": 81,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2216:      "queryId": 81,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2221:      "queryId": 81,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2226:      "queryId": 82,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2231:      "queryId": 82,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2236:      "queryId": 82,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2241:      "queryId": 83,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2246:      "queryId": 83,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2251:      "queryId": 83,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2256:      "queryId": 84,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2261:      "queryId": 84,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2266:      "queryId": 84,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2271:      "queryId": 85,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2276:      "queryId": 86,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2281:      "queryId": 86,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2286:      "queryId": 86,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2291:      "queryId": 87,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2296:      "queryId": 87,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2301:      "queryId": 87,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2306:      "queryId": 88,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2311:      "queryId": 88,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2316:      "queryId": 88,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2321:      "queryId": 89,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2326:      "queryId": 89,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2331:      "queryId": 89,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2336:      "queryId": 90,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2341:      "queryId": 90,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2346:      "queryId": 90,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2351:      "queryId": 91,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2356:      "queryId": 91,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2361:      "queryId": 91,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2366:      "queryId": 92,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2371:      "queryId": 92,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2376:      "queryId": 93,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2381:      "queryId": 93,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2386:      "queryId": 93,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2391:      "queryId": 94,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2396:      "queryId": 94,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2401:      "queryId": 94,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2406:      "queryId": 95,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2411:      "queryId": 95,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2416:      "queryId": 95,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2421:      "queryId": 96,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2426:      "queryId": 96,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2431:      "queryId": 96,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2436:      "queryId": 97,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2441:      "queryId": 97,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2446:      "queryId": 97,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2451:      "queryId": 98,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2456:      "queryId": 98,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2461:      "queryId": 98,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2466:      "queryId": 99,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2471:      "queryId": 99,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2476:      "queryId": 99,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2481:      "queryId": 100,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2486:      "queryId": 100,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2491:      "queryId": 100,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2496:      "queryId": 101,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2501:      "queryId": 101,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2506:      "queryId": 101,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2511:      "queryId": 102,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2516:      "queryId": 102,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2521:      "queryId": 102,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2526:      "queryId": 109,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2531:      "queryId": 109,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2536:      "queryId": 109,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2541:      "queryId": 110,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2546:      "queryId": 110,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2551:      "queryId": 110,
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:144:  // When feature flag is disabled, classifier returns 'complex' with 'fallback' confidence.
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:23:          : 'session_health',
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:492:  describe('7. rerankResults (latency tracking)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:493:    it('tracks latency after successful provider call', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:498:      await crossEncoder.rerankResults('latency-test', docs, { useCache: false });
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:501:      expect(status.latency.count).toBeGreaterThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:502:      expect(status.latency.avg).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:210:      const results = searchFn('graph latency probe', { limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:81:| `scoreChunk` | chunk-thinning.ts | Function | Computes composite quality score for a single chunk |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:55:  /** Recall at configured K (default 20). Named recall20 for backwards compatibility. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:56:  recall20: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:109:  queryId: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:290:/** Result of bootstrap confidence interval computation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:312: * Compute bootstrap 95% confidence interval for MRR@5.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:416: * Inserts one row per metric (mrr@5, ndcg@10, recall@20, hit_rate@1) plus
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:446:    insertSnapshot.run(evalRunId, 'recall@20',    result.metrics.recall20,  channel, queryCount, null, createdAt);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:504:  const recallK = k ?? 20;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:506:  const fetchLimit = Math.max(mrrK, ndcgK, recallK, 20);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:549:    totalRecall  += computeRecall(evalResults, groundTruth, recallK);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:559:    recall20: totalRecall / safeCount,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:590:function buildQueryGroundTruth(queryId: number): GroundTruthEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:591:  const q = GROUND_TRUTH_QUERIES.find(g => g.id === queryId);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:598:    .filter(r => r.queryId === queryId)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:600:      queryId: r.queryId,
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:68:    expect(parsed.data.graphOps.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:88:      queryId: 'ctx-order-preservation',
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:128:      queryId: 'ctx-budget-overhead',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:97:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1027:          typeof parsed.data?.confidence === 'number' ||
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1049:        expect(typeof parsed.data?.confidence === 'number').toBe(true);
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:99:Post-channel: constitutional memory injection, quality score filtering, tier/contextType filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:119:**Score immutability invariant**: Stage 4 MUST NOT modify scores. Enforced via compile-time `Stage4ReadonlyRow` readonly fields and runtime `captureScoreSnapshot` / `verifyScoreInvariant` defence-in-depth. Applies memory-state filtering (HOT/WARM/COLD/DORMANT/ARCHIVED with per-tier limits), evidence gap detection (Z-score confidence check), quality floor (`QUALITY_FLOOR=0.005`), and token budget truncation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:231:**Trade-off**: Adds 200-500ms latency but improves precision by 15-25%.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:250:| **TypeScript**       | `channel-representation.ts`, `channel-enforcement.ts`, `confidence-truncation.ts` (quality)   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:305:| `confidence-truncation.ts` | -      | TypeScript | Removes low-confidence tail using 2x median gap heuristic (min 3 results) (Sprint 3) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:309:| `evidence-gap-detector.ts` | -      | TypeScript | Z-score confidence check on RRF scores to detect low-confidence retrieval |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:333:| `confidence-scoring.ts`    | -      | TypeScript | Computes calibrated confidence scores for retrieval results |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:561:// Track P95 latency (last 100 searches)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:801:// -> { type: 'add_feature', confidence: 0.85 }
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:963:- Query pipeline additions: query complexity routing, channel representation, confidence truncation, dynamic token budgets, folder discovery
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:29:  confidence: number,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:34:    confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:817:  // CONTAINS: class -> method (confidence 1.0)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:831:  // IMPORTS (confidence 1.0)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:844:  // EXPORTS (confidence 1.0)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:857:  // EXTENDS: class -> parent class (confidence 0.95)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:872:  // IMPLEMENTS: class -> interface (confidence 0.95)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:889:  // CALLS: function/method -> called function (confidence 0.8)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:922:  // DECORATES: decorator symbol -> decorated class/function/method (confidence 0.9)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:944:  // OVERRIDES: method -> parent class method (confidence 0.9)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:970:  // TYPE_OF: symbol -> referenced type symbol (confidence 0.85)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:1142:  // Cross-file TESTED_BY edges (heuristic, confidence 0.6)
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:7:import * as mod from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:12:} from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:30:    confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:54:    'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier) VALUES (?, ?, ?, ?, ?)'
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:115:    it('T510-02a: Positive validation increases confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:119:      expect(result.confidence).toBeGreaterThan(before);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:141:    it('T510-03a: Negative validation decreases confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:145:      expect(result.confidence).toBeLessThan(before);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:184:      // Memory 5 has confidence=0.88, validation_count=4
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:185:      // Promotion requires confidence >= 0.9 AND validation_count >= 5
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:208:      expect(typeof info.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:220:// Verifies all 7 DB operations in confidence-tracker survive
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:239:          confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:65:  'confidence',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:141:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:119:          confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/hooks-mutation-wiring.vitest.ts:53:  expect(typeof result.latencyMs).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/hooks-mutation-wiring.vitest.ts:54:  expect(result.latencyMs).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:21:// Feature catalog: Reporting dashboard (eval_reporting_dashboard)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:147:  latency_ms: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:178:  // (e.g. inversion_rate, inversion-rate, latency_ms).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:180:  const lowerIsBetterPrefixes = ['inversion', 'latency'];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:243:               AVG(latency_ms) AS latency_ms,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:413:    const latencyTotals = rows.reduce(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:415:        if (row.latency_ms == null) return acc;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:417:          weightedLatency: acc.weightedLatency + (row.latency_ms * row.query_count),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:418:          latencySamples: acc.latencySamples + row.query_count,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:421:      { weightedLatency: 0, latencySamples: 0 },
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:423:    const avgLatency = latencyTotals.latencySamples > 0
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:424:      ? Math.round((latencyTotals.weightedLatency / latencyTotals.latencySamples) * 100) / 100
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:76: * Filter results by minimum quality score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:189: * No-op if routing result is absent, unknown, or zero-confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:196:  if (!routingResult || routingResult.detectedClass === 'unknown' || routingResult.confidence <= 0) {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:3:// Validates latency ceiling, token budget, feature flag regression.
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:39:    latencyMs: number;
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:118:    parts.push(`> **⚠️ EVIDENCE GAP DETECTED:** Low confidence (Z=${trm.zScore.toFixed(2)})\n`);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:156:  const latencyMs = performance.now() - start;
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:162:      latencyMs,
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:189:  it('T1: end-to-end latency is under 120ms', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:192:    expect(response.metrics.latencyMs).toBeLessThan(120);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:240:    expect(response.metrics.latencyMs).toBeLessThan(120);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:260:    expect(fixBug.metrics.latencyMs).toBeLessThan(120);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:261:    expect(understand.metrics.latencyMs).toBeLessThan(120);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:269:    expect(response.metrics.latencyMs).toBeLessThan(120);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:279:    expect(response.metrics).toHaveProperty('latencyMs');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:170:          confidence: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:175:          confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:3:// Feedback confidence signal (T002b/A4).
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:90:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:123:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:131:    confidence = 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:135:    INSERT INTO memory_index (id, title, trigger_phrases, created_at, importance_tier, validation_count, confidence)
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:137:  `).run(id, title, JSON.stringify(triggerPhrases), createdAt, tier, validationCount, confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:126:      expect(result).toEqual({ queryId: 0, evalRunId: 0 });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:133:      logChannelResult({ evalRunId: 1, queryId: 1, channel: 'vector' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:143:      logFinalResult({ evalRunId: 1, queryId: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:165:      expect(result.queryId).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:170:      const row = db.prepare('SELECT id FROM eval_queries WHERE id = ?').get(result.queryId) as { id: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:172:      expect(row!.id).toBe(result.queryId);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:177:      const { queryId } = logSearchQuery({ query: 'unique-query-text-T005-9', intent: null });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:179:      const row = db.prepare('SELECT * FROM eval_queries WHERE id = ?').get(queryId) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:187:    it('T005-9b: logSearchQuery uses queryId as evalRunId for cross-process-safe correlation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:189:      const { queryId, evalRunId } = logSearchQuery({ query: 'run-id-from-query-id' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:192:      expect(evalRunId).toBe(queryId);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:197:      const { queryId, evalRunId } = logSearchQuery({ query: 'channel-log-test-T005-10' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:200:        queryId,
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:204:        latencyMs: 42,
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:213:      ).get(evalRunId, queryId, 'bm25') as { id: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:219:      const { queryId, evalRunId } = logSearchQuery({ query: 'ids-serialisation-test' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:222:        queryId,
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:230:      ).get(evalRunId, queryId) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:240:      const { queryId, evalRunId } = logSearchQuery({ query: 'final-result-test-T005-12' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:243:        queryId,
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:247:        latencyMs: 123,
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:255:      ).get(evalRunId, queryId) as { id: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:261:      const { queryId, evalRunId } = logSearchQuery({ query: 'fusion-method-test' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:262:      logFinalResult({ evalRunId, queryId, fusionMethod: 'rrf' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:266:      ).get(evalRunId, queryId) as { fusion_method: string };
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:294:      const { queryId, evalRunId } = logSearchQuery({ query: 'run-id-consistency' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:296:      logChannelResult({ evalRunId, queryId, channel: 'vector' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:297:      logFinalResult({ evalRunId, queryId, fusionMethod: 'rrf' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:302:      ).get(queryId, 'vector') as { eval_run_id: number };
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:306:      ).get(queryId) as { eval_run_id: number };
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:328:        expect(typeof r.queryId).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:339:        logChannelResult({ evalRunId: 0, queryId: 0, channel: 'vector' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:347:        logFinalResult({ evalRunId: 0, queryId: 0 });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:354:      const { queryId, evalRunId } = logSearchQuery({ query: 'optional-fields-test' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:356:        logChannelResult({ evalRunId, queryId, channel: 'graph' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:369:   * Measure p95 latency for N iterations of a function.
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:370:   * Returns the p95 in milliseconds.
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:381:    const p95idx = Math.floor(times.length * 0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:382:    return times[p95idx];
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:385:  it('T004b-1: eval logging overhead (p95) is less than 10ms absolute', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:386:    // This is a loose guard: each individual log call should complete in < 10ms on p95.
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:401:      const { queryId, evalRunId } = logSearchQuery({ query: 'bench query', intent: 'understand' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:402:      logChannelResult({ evalRunId, queryId, channel: 'vector', resultMemoryIds: [1, 2, 3], scores: [0.9, 0.8, 0.7] });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:403:      logFinalResult({ evalRunId, queryId, resultMemoryIds: [1, 2, 3], scores: [0.9, 0.8, 0.7] });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:407:    // Assert absolute overhead < 10ms on p95
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:420:    const p95 = measureP95(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:422:      logChannelResult({ evalRunId: 1, queryId: 1, channel: 'vector' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:423:      logFinalResult({ evalRunId: 1, queryId: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:428:    // No-op path should be sub-millisecond on p95
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:429:    expect(p95).toBeLessThan(1);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:433:    // Simulate a representative "search baseline" time: 50ms (well within real search latency).
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:447:      const { queryId, evalRunId } = logSearchQuery({ query: 'overhead test' });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:448:      logChannelResult({ evalRunId, queryId, channel: 'hybrid', resultMemoryIds: [1, 2], scores: [0.9, 0.8] });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:449:      logFinalResult({ evalRunId, queryId, resultMemoryIds: [1, 2], scores: [0.9, 0.8] });
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:60:    latency_ms REAL,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:73:    latency_ms REAL,
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:63:    latency_ms REAL,
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:88:  latency_ms?: number | null;
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:113:      (eval_run_id, query_id, channel, hit_count, latency_ms)
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:122:      r.latency_ms ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:347:        { eval_run_id: 1, query_id: 1, channel: 'vector', hit_count: 5, latency_ms: 12.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:348:        { eval_run_id: 1, query_id: 2, channel: 'vector', hit_count: 3, latency_ms: 15.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:349:        { eval_run_id: 1, query_id: 1, channel: 'bm25', hit_count: 4, latency_ms: 8.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:350:        { eval_run_id: 1, query_id: 2, channel: 'bm25', hit_count: 2, latency_ms: 6.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:354:    it('aggregates channel hits, latency, and query counts', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:374:    it('weights grouped channel latency by query volume across runs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:386:        { eval_run_id: 2, query_id: 1, channel: 'vector', hit_count: 4, latency_ms: 100.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:455:        // Iteration 1: precision@5 = 0.50
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:458:          metric_name: 'precision@5',
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:463:        // Iteration 2: precision@5 = 0.50 (unchanged)
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:466:          metric_name: 'precision@5',
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:479:      expect(trendNames).toEqual(['mrr@5', 'ndcg@5', 'precision@5']);
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:508:      const precTrend = report.trends.find(t => t.metric === 'precision@5');
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:608:        { eval_run_id: 1, query_id: 1, channel: 'vector', hit_count: 5, latency_ms: 10.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:878:        { eval_run_id: 1, query_id: 1, channel: 'vector', hit_count: 5, latency_ms: 10.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:879:        { eval_run_id: 1, query_id: 1, channel: 'bm25', hit_count: 3, latency_ms: 5.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:880:        { eval_run_id: 1, query_id: 1, channel: 'fts', hit_count: 2, latency_ms: 3.0 },
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:155: * Maximum number of concept aliases to resolve per query (bounding latency).
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:165: * latency and external dependencies.
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:143:        { queryId: 1, memoryId: 1, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:144:        { queryId: 1, memoryId: 2, relevance: 2 },
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:145:        { queryId: 1, memoryId: 3, relevance: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:165:        { queryId: 1, memoryId: 1, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:166:        { queryId: 1, memoryId: 2, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:167:        { queryId: 1, memoryId: 3, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:189:        { queryId: 1, memoryId: 1, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:190:        { queryId: 1, memoryId: 2, relevance: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:204:      expect(computeNDCG([], [{ queryId: 1, memoryId: 1, relevance: 3 }], 10)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:25:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:15:// T6:  all channels represented → top-3 unchanged (precision preserved)
.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:226:  // ---- T6: All channels represented → top-3 unchanged (precision preserved) ----
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:62:    type: 'result_cited',
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:64:    queryId: 'q-001',
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:65:    confidence: 'strong',
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:190:  it('initBatchLearning also initializes feedback_events', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:194:      "SELECT name FROM sqlite_master WHERE type='table' AND name='feedback_events'"
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:230:  it('counts confidence tiers separately', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:233:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:234:      makeEvent({ confidence: 'medium', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:235:      makeEvent({ confidence: 'weak',   sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:249:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:250:      makeEvent({ confidence: 'strong', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:251:      makeEvent({ confidence: 'medium', sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:261:      makeEvent({ confidence: 'strong', sessionId: `sess-${i}`, memoryId: 'mem-X' })
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:292:      makeEvent({ memoryId: 'mem-low',  confidence: 'weak',   sessionId: 's1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:293:      makeEvent({ memoryId: 'mem-high', confidence: 'strong', sessionId: 's2' }),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:31:  queryId: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:52:  recall: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:58:  precision: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:241: * Compute F1@K — harmonic mean of Precision@K and Recall@K.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:403: * Recall@K but each relevant item is weighted by its tier:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:606:    recall: computeRecall(results, groundTruth),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:607:    precision: computePrecision(results, groundTruth),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:78:    'negative_feedback_events',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:120:  'negative_feedback_events',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:317:  'weight_history', 'adaptive_signal_events', 'negative_feedback_events',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1264:    if (column === 'confidence') return 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1271:  if (column === 'confidence') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1337:    'confidence',
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:65:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:125:        'network latency', 'packet routing', 'socket buffering',
.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:42: * 1500/2500/4000 tiers balance context window cost vs. recall —
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:45:    confidence: {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:103:  it('produces correct digest with confidence classification', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:105:      makeResult({ id: 1, confidence: { label: 'high', value: 0.9 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:106:      makeResult({ id: 2, confidence: { label: 'high', value: 0.8 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:107:      makeResult({ id: 3, confidence: { label: 'medium', value: 0.5 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:108:      makeResult({ id: 4, confidence: { label: 'low', value: 0.2 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:114:  it('classifies results without confidence data as "weak"', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:116:    // No confidence property → defaults to low/weak
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:123:      makeResult({ id: 1, confidence: { label: 'high', value: 0.95 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:124:      makeResult({ id: 2, confidence: { label: 'high', value: 0.85 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:137:      makeResult({ id: 1, confidence: { label: 'high', value: 0.9 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:138:      makeResult({ id: 2, confidence: { label: 'medium', value: 0.5 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:139:      makeResult({ id: 3, confidence: { label: 'low', value: 0.2 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:140:      makeResult({ id: 4, confidence: { label: 'low', value: 0.1 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:146:  it('treats missing confidence as low', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:10:// + countSaturation * 0.20 + latencyPenalty * 0.15
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:17:/** Default latency target in milliseconds. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:25:  latencyPenalty: 0.15,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:58:  /** Actual search latency in milliseconds. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:59:  latencyMs: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:62:   * Target latency in milliseconds.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:65:  latencyTargetMs?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:76:  /** latencyScore × 0.15 */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:77:  latencyPenalty: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:82:  /** Composite quality score in [0, 1]. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:115: * Compute the latency penalty component.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:116: * Returns max(0, 1 − latencyMs / latencyTargetMs).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:117: *   - 1.0 at latencyMs = 0 (perfect — full credit)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:118: *   - 0.0 at latencyMs ≥ latencyTargetMs (at or over target)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:119: * When latencyTargetMs ≤ 0 it is treated as DEFAULT_LATENCY_TARGET_MS.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:122:  latencyMs: number,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:123:  latencyTargetMs: number,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:126:    latencyTargetMs > 0 ? latencyTargetMs : DEFAULT_LATENCY_TARGET_MS;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:127:  return Math.max(0, 1 - latencyMs / safeTarget);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:158: *   latencyPenalty  — max(0, 1 − latencyMs / latencyTargetMs)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:174:    latencyMs,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:175:    latencyTargetMs = DEFAULT_LATENCY_TARGET_MS,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:184:  const rawLatencyScore = computeLatencyScore(latencyMs, latencyTargetMs);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:191:    latencyPenalty: rawLatencyScore * WEIGHTS.latencyPenalty,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:199:    components.latencyPenalty;
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:58:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:23:        memory_stats: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:24:        memory_health: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:27:        memory_validate: 1000,
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:4:// REQ-D5-004: Per-result calibrated confidence scoring
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:7:// and anchor density into a single calibrated confidence score per
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:14://   "confidence": {
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:24:// IMPORTANT: This module only models ranking confidence for retrieval ordering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:35:// Weights for each confidence factor (must sum to 1.0)
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:65:/** Which factors drove the confidence score upward. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:72:/** Per-result confidence payload. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:84:  confidence: RankingConfidenceContract;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:95: * Minimal result shape needed for confidence computation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:196: * Map raw confidence value to a coarse label.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:212: * Compute per-result confidence for a ranked list of results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:214: * Each result receives a confidence object derived from:
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:261:    // Base score is a strong prior: if the score itself is very high, confidence
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:274:        confidence: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:286: * - "good":  most results have high/medium confidence and a healthy top score
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:288: * - "gap":   no results, or all results have low confidence
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:291: * @param confidences - Parallel confidence array from `computeResultConfidence`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:295:  confidences: ResultConfidence[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:301:  const highOrMediumCount = confidences.filter(
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:302:    (c) => c.confidence.label === 'high' || c.confidence.label === 'medium',
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:319: * Check whether the per-result confidence feature flag is enabled.
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:13:import { computeResultConfidence } from '../lib/search/confidence-scoring.js';
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:78:  it('keeps ranking confidence separate from structural trust axes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:96:    expect(firstConfidence?.confidence.value).toBeTypeOf('number');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:97:    expect(firstConfidence?.confidence).not.toHaveProperty('structuralTrust');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:98:    expect(firstConfidence?.confidence).not.toHaveProperty('parserProvenance');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:99:    expect(firstConfidence?.confidence).not.toHaveProperty('evidenceStatus');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:100:    expect(firstConfidence?.confidence).not.toHaveProperty('freshnessAuthority');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:5:  queryId: number;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:19:  latencyMs?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:22:const mockLogSearchQuery = vi.fn<() => EvalSearchQueryResult>(() => ({ queryId: 77, evalRunId: 88 }));
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:402:            confidence: 0.8, validation_count: 2, access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:46:| `eval-metrics.ts` | MRR, NDCG, recall, precision, F1, MAP, hit-rate, inversion-rate, and constitutional metrics |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:47:| `eval-quality-proxy.ts` | Pure quality proxy formula for latency/result quality tradeoff scoring |
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:83:| Search and ranking | `hybrid-search.vitest.ts`, `bm25-index.vitest.ts`, `query-router.vitest.ts`, `dynamic-token-budget.vitest.ts`, `result-confidence-scoring.vitest.ts` | Retrieval, ranking, and profile/trace behavior |
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:146:Broader confidence runs:
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:130:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:15:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:115: * Returns intent + confidence score. Hybrid intent means
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:120:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:138:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:154:      confidence: computeConfidence(structuralRatio),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:165:      confidence: computeConfidence(semanticRatio),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:172:  // Ambiguous → hybrid with moderate confidence
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:175:    confidence: 0.5 + Math.abs(structuralRatio - semanticRatio) * 0.3,
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:94:     Returns: { detected: boolean, type: string|null, description: string|null, confidence: number }
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:168:      expect(typeof r.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:169:      expect(r.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:172:    it('T125: Result has {detected, type, description, confidence}', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:177:      expect(r).toHaveProperty('confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:356:      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:374:      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:395:      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:39:  contradicts:  0.8,  // Dampened — conflicting signals lower confidence
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:94:    'retrieval.avg_channel_latency_ms': safeScalarMetric(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:96:      'SELECT COALESCE(AVG(latency_ms), 0) AS value FROM eval_channel_results',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:102:    'retrieval.avg_final_latency_ms': safeScalarMetric(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:104:      'SELECT COALESCE(AVG(latency_ms), 0) AS value FROM eval_final_results',
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:104:  latency: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:106:    p95: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:138:const latencyTracker: { durations: number[] } = { durations: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:458:    // Track latency
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:460:    latencyTracker.durations.push(duration);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:461:    if (latencyTracker.durations.length > MAX_LATENCY_SAMPLES) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:462:      latencyTracker.durations.shift();
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:501:  const durations = latencyTracker.durations;
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:504:  let p95 = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:509:    // L3 FIX: Correct p95 percentile index with bounds clamping
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:510:    p95 = sorted[Math.min(Math.ceil(sorted.length * 0.95) - 1, sorted.length - 1)] || 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:517:    latency: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:519:      p95: Math.round(p95),
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:527:  latencyTracker.durations = [];
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:165:      'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:166:      'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:170:      'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:185:      'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:186:      'eval_reporting_dashboard',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:199:      'session_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:293:      'memory_delete', 'memory_update', 'memory_bulk_delete', 'memory_list', 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:299:      'eval_run_ablation', 'eval_reporting_dashboard',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:320:    it('T16d: only session_health is excluded from tool-call tracking', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:321:      expect(sourceCode).toMatch(/if \(name !== 'session_health'\) \{/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:322:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:998:        { id: 'call-3', params: { name: 'memory_stats', arguments: {} } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1064:          { id: 'call-follow-2', params: { name: 'memory_stats', arguments: {} } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1201:        latencyMs: 7,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1231:        latencyMs: 7,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1249:        latencyMs: 11,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1334:        latencyMs: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2089:      'memory_stats': '[L3:Discovery]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2090:      'memory_health': '[L3:Discovery]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2093:      'memory_validate': '[L4:Mutation]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2104:      'eval_run_ablation': '[L6:Analysis]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2105:      'eval_reporting_dashboard': '[L6:Analysis]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2315:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:51:          { id: 'q-1', type: 'question_node', label: 'What causes latency?', iteration: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:10:const mockLogSearchQuery = vi.fn((_payload: unknown) => ({ queryId: 11, evalRunId: 22 }));
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:86:  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.9, fallback: false })),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:181:  const budgetMs = remainingMs ?? 400; // 400ms default latency budget
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:269:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/similarity-test-cases.json:143:      "Actual values may vary slightly between runs due to model precision",
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:25:  migrate_confidence_columns,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:47:  update_confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:175:        r.queryId,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:85:    expect(parsed.data).not.toHaveProperty('confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:122:        memory_stats: 'L3',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:123:        memory_health: 'L3',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:126:        memory_validate: 'L4',
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:183:      { includeContent: true, queryId: 'test-q1' }
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:198:    expect(overflow!.queryId).toBe('test-q1');
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:229:    const { overflow } = truncateToBudget(results, 100, { queryId: 'eval-test' });
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:233:    expect(log.queryId).toBe('eval-test');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:17:// Feature catalog: Negative feedback confidence signal
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:142: * Confidence-gap truncation for low-confidence tails.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:166: * T002b/A4: Negative-feedback confidence demotion in ranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:352: * D2 REQ-D2-005: Index-time surrogates for recall improvement.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:410: * Generates a pseudo-document for low-confidence deep queries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:545: * REQ-D5-004: Per-result calibrated confidence scoring.
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:626:    it('sets confidence to 0.85', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1475:      expect(typeof resolvedPreview.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:4:// Feature catalog: Ablation studies (eval_run_ablation)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:7:// Selectively disables one search channel at a time, measures Recall@20
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:14:// - Delta calculation (baseline vs ablated Recall@20)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:70:  recallK?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:118:  /** Recall@K with all channels enabled. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:120:  /** Recall@K with this channel disabled. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:126:  /** Number of queries where removing this channel decreased recall (channel was helpful). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:128:  /** Number of queries where removing this channel increased recall (channel was harmful). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:148:  'precision@5': AblationMetricEntry;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:149:  'recall@5': AblationMetricEntry;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:153:  'latency_p50': AblationMetricEntry;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:154:  'latency_p95': AblationMetricEntry;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:165:  queryId?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:182:  /** Baseline Recall@K across all queries (all channels enabled). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:220: * in the active DB. Chunk-backed or missing IDs make Recall@K comparisons
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:368:function getGroundTruthForQuery(queryId: number): GroundTruthEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:370:    .filter(r => r.queryId === queryId)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:372:      queryId: r.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:445: * Compute mean Recall@K across a set of per-query recall values.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:447:function meanRecall(recalls: number[]): number {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:448:  if (recalls.length === 0) return 0;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:449:  const sum = recalls.reduce((a, b) => a + b, 0);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:450:  return sum / recalls.length;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:459:): { mrr: number; precision: number; recall: number; ndcg: number; map: number; hitRate: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:462:    precision: computePrecision(results, gt, 5),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:463:    recall: computeRecall(results, gt, 5),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:487:  baselinePerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number; tokenUsage?: number }>,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:488:  ablatedPerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number; tokenUsage?: number }>,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:503:  const bLatencies = bMetrics.map(m => m.latencyMs).sort((a, b) => a - b);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:504:  const aLatencies = aMetrics.map(m => m.latencyMs).sort((a, b) => a - b);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:516:    'precision@5': entry(bMetrics.map(m => m.metrics.precision), aMetrics.map(m => m.metrics.precision)),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:517:    'recall@5': entry(bMetrics.map(m => m.metrics.recall), aMetrics.map(m => m.metrics.recall)),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:521:    'latency_p50': {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:526:    'latency_p95': {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:543: * 3. Compute per-query Recall@K delta
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:562:  const recallK = config.recallK ?? 20;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:590:    const baselineMetricsPerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number; tokenUsage?: number }> = new Map();
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:601:      const latencyMs = performance.now() - t0;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:603:      const recall = computeRecall(results, gt, recallK);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:604:      baselineRecalls.set(q.id, recall);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:605:      baselineMetricsPerQuery.set(q.id, { metrics: computeQueryMetrics(results, gt), latencyMs });
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:617:      const ablatedMetricsPerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number; tokenUsage?: number }> = new Map();
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:628:          const latencyMs = performance.now() - t0;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:630:          const recall = computeRecall(results, gt, recallK);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:631:          ablatedRecalls.set(q.id, recall);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:632:          ablatedMetricsPerQuery.set(q.id, { metrics: computeQueryMetrics(results, gt), latencyMs });
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:641:        for (const [queryId, baselineR] of baselineRecalls) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:642:          const ablatedR = ablatedRecalls.get(queryId);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:683:              queryId: failedQuery.id,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:690:        const querySuffix = failedQuery ? ` (queryId=${failedQuery.id})` : '';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:727: * - metric_name: 'ablation_recall@20_delta'
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:732: * Also stores the baseline recall as a separate row.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:755:    const recallK = report.config.recallK ?? 20;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:763:      // Store baseline recall
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:766:        `ablation_baseline_recall@${recallK}`,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:787:          `ablation_recall@${recallK}_delta`,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:863:  const recallK = report.config.recallK ?? 20;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:864:  lines.push(`- **Baseline Recall@${recallK}:** ${report.overallBaselineRecall.toFixed(4)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:908:  lines.push(`Ch. Helped = queries where channel was helpful (removing it decreased recall). * = significant at p<0.05.`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:915:      const queryInfo = failure.queryId !== undefined ? ` (queryId=${failure.queryId})` : '';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:926:    lines.push(`| Channel | MRR@5 | P@5 | R@5 | NDCG@5 | MAP | Hit Rate | Lat p50 | Lat p95 |`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:935:        `| ${m['precision@5'].delta >= 0 ? '+' : ''}${m['precision@5'].delta.toFixed(4)} ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:936:        `| ${m['recall@5'].delta >= 0 ? '+' : ''}${m['recall@5'].delta.toFixed(4)} ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:940:        `| ${m['latency_p50'].delta >= 0 ? '+' : ''}${m['latency_p50'].delta.toFixed(1)}ms ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:941:        `| ${m['latency_p95'].delta >= 0 ? '+' : ''}${m['latency_p95'].delta.toFixed(1)}ms |`,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:957:    lines.push(`${i + 1}. **${r.channel}** — contribution: ${contribution >= 0 ? '+' : ''}${contribution.toFixed(4)} Recall@${recallK}`);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:31:    surface: 'memory_health';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:88:      surface: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:100:      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:53:      expect(result.confidence).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:66:      expect(result.confidence).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:67:      expect(result.confidence).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:73:    it('confidence never exceeds 0.95', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:77:      expect(result.confidence).toBeLessThanOrEqual(0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:85:      expect(result.confidence).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:333:    expect(result).toHaveProperty('latencyMs');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:362:  it('result.latencyMs is a non-negative number', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:366:    expect(typeof result?.latencyMs).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:367:    expect(result?.latencyMs).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:516:    expect(result).toHaveProperty('latencyMs');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:530:  it('result.latencyMs is non-negative', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:534:    expect(result?.latencyMs).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:661:    expect(result).toHaveProperty('latencyMs');
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:19:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:66:  let confidence = 0.55;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:68:    confidence = Math.max(confidence, candidate);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:99:    confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:113:  const confidence = candidate.confidence;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:120:    || typeof confidence !== 'number'
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:121:    || !Number.isFinite(confidence)
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:132:    confidence: Math.max(0, Math.min(1, confidence)),
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:55:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:148:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:440:          embedding_status TEXT DEFAULT 'success', confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:175:      expect(cols).toContain('latency_ms');
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:188:      expect(cols).toContain('latency_ms');
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:28:  confidence?: ConfidencePayload;
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:52:    file_path: `/tmp/confidence-${id}.md`,
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:56:    triggerPhrases: ['retrieval', 'confidence'],
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:83:  if (!result?.confidence) {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:84:    throw new Error(`Expected confidence payload for result ${resultId}`);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:87:  return result.confidence;
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:90:describe('D5 Phase A: result confidence scoring', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:106:  it('assigns high confidence to a result with a large score margin', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:143:    const confidence = getResultConfidence(envelope, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:144:    expect(confidence.label).toBe('high');
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:145:    expect(confidence.value).toBeGreaterThan(0.7);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:146:    expect(confidence.drivers).toContain('large_margin');
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:149:  it('boosts confidence when multiple channels agree on the top result', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:217:  it('assigns low confidence when the top result barely beats the runner-up', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:239:    const confidence = getResultConfidence(envelope, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:240:    expect(confidence.label).toBe('low');
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:241:    expect(confidence.value).toBeLessThan(0.4);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:244:  it('keeps label thresholds aligned with the numeric confidence value', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:311:  it('populates confidence drivers with contributing factors', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:346:    const confidence = getResultConfidence(envelope, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:347:    expect(confidence.drivers.length).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:348:    expect(new Set(confidence.drivers).size).toBe(confidence.drivers.length);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:349:    expect(confidence.drivers.every((driver) => DRIVER_NAMES.includes(driver as (typeof DRIVER_NAMES)[number]))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:405:  it('omits confidence when SPECKIT_RESULT_CONFIDENCE_V1 is false', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:425:    expect(envelope.data.results.every((result) => result.confidence === undefined)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:41:  queryId: number;
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:66:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:74:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:80:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:316:    expect(r1.confidence).toBe(r2.confidence);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:9:// Signal confidence tiers:
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:12://   weak    — search_shown, same_topic_requery (passive exposure)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:23: *   result_cited | follow_on_tool_use > query_reformulated > same_topic_requery > search_shown
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:26:  | 'search_shown'
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:27:  | 'result_cited'
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:41:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:42:  confidence: FeedbackConfidence;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:47:/** Row shape stored in feedback_events table. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:53:  confidence: FeedbackConfidence;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:61:  queryId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:62:  confidence?: FeedbackConfidence;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:75: * Infer confidence tier from event type.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:76: * Callers may override by providing explicit confidence in the event.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:79:  result_cited:         'strong',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:83:  search_shown:         'weak',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:87: * Resolve confidence for a feedback event.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:116:  CREATE TABLE IF NOT EXISTS feedback_events (
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:119:                 'search_shown','result_cited','query_reformulated',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:124:    confidence TEXT NOT NULL CHECK(confidence IN ('strong','medium','weak')),
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:131:  CREATE INDEX IF NOT EXISTS idx_feedback_type      ON feedback_events(type);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:132:  CREATE INDEX IF NOT EXISTS idx_feedback_memory_id ON feedback_events(memory_id);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:133:  CREATE INDEX IF NOT EXISTS idx_feedback_query_id  ON feedback_events(query_id);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:134:  CREATE INDEX IF NOT EXISTS idx_feedback_confidence ON feedback_events(confidence);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:135:  CREATE INDEX IF NOT EXISTS idx_feedback_timestamp  ON feedback_events(timestamp);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:136:  CREATE INDEX IF NOT EXISTS idx_feedback_session    ON feedback_events(session_id)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:147: * Ensure the feedback_events table and indices exist in the given database.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:180:    const confidence = resolveConfidence(event.type, event.confidence);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:183:      INSERT INTO feedback_events (type, memory_id, query_id, confidence, timestamp, session_id)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:188:      event.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:189:      confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:203: * Record a batch of feedback events (e.g., all search_shown results from
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:249:    if (opts.queryId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:251:      params.push(opts.queryId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:253:    if (opts.confidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:254:      conditions.push('confidence = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:255:      params.push(opts.confidence);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:275:    const sql = `SELECT * FROM feedback_events ${where} ORDER BY timestamp ASC ${effectiveLimit} ${offset}`;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:294:      const row = db.prepare('SELECT COUNT(*) as count FROM feedback_events WHERE type = ?')
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:298:    const row = db.prepare('SELECT COUNT(*) as count FROM feedback_events').get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:307: * Returns counts broken down by confidence tier.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:324:      SELECT confidence, COUNT(*) as cnt
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:325:      FROM feedback_events
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:327:      GROUP BY confidence
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:328:    `).all(memoryId) as Array<{ confidence: FeedbackConfidence; cnt: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:332:      summary[row.confidence] = row.cnt;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:53:  confidence: number; // 0.0 - 1.0
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:123:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:138:    confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:160:        confidence: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:175:    confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:202:          confidence: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:223:          confidence: Math.max(0, 0.95 - (distance * 0.02)),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:244:          confidence: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:258:      confidence: 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:288:  // Sort by confidence descending
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:289:  refs.sort((a, b) => b.confidence - a.confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:20:  latency?: { candidateLatencyMs?: number; totalLatencyMs?: number };
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:37:      confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:110:    expect(t.latency.totalLatencyMs).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:111:    expect(t.latency.candidateLatencyMs).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:112:    expect(t.latency.fusionLatencyMs).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:113:    expect(t.latency.rerankLatencyMs).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:114:    expect(t.latency.boostLatencyMs).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:140:    expect(t.latency.candidateLatencyMs).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:167:    expect(t.latency.candidateLatencyMs).toBe(50);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:168:    expect(t.latency.fusionLatencyMs).toBe(30);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:169:    expect(t.latency.rerankLatencyMs).toBe(20);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:170:    expect(t.latency.boostLatencyMs).toBe(10);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:171:    expect(t.latency.totalLatencyMs).toBe(110);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:177:    expect(t.latency.candidateLatencyMs).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:178:    expect(t.latency.totalLatencyMs).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:184:    expect(t.latency.fusionLatencyMs).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:251:  it('T06c: quality proxy with max latency reduces score', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:261:    // With 5s latency, latency component = 0, reducing overall score
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:308:    expect((json as TelemetryJson).latency?.candidateLatencyMs).toBe(42);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:327:    expect(json.latency).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:364:  it('T10: re-recording a latency stage overwrites previous value', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:367:    expect(t.latency.totalLatencyMs).toBe(100);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:370:    expect(t.latency.candidateLatencyMs).toBe(50);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:371:    expect(t.latency.totalLatencyMs).toBe(50);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:488:      confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:497:      confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:156:      expect(status.latency).toBeTruthy();
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:157:      expect(typeof status.latency.avg).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:158:      expect(typeof status.latency.p95).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:159:      expect(typeof status.latency.count).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:165:      expect(status.latency.count).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:169:  // Sanitize via shared tokenizer, then wrap each token in quotes and join with OR for recall
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:5:// Validates upsert, query, replay, and latency expectations
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:46:          { id: 'q-1', type: 'question_node', label: 'What causes latency?', iteration: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:123:  describe('latency budget contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:37:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:62:    tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:68:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:87:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:31:    type: 'search_shown',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:33:    queryId: 'query-001',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:34:    confidence: 'weak',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:80:  it('creates feedback_events table with correct columns', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:82:    const columns = db.prepare('PRAGMA table_info(feedback_events)').all() as Array<{ name: string }>;
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:88:    expect(names).toContain('confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:93:  it('creates indices for feedback_events', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:96:      "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='feedback_events'"
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:101:    expect(names).toContain('idx_feedback_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:112:    expect(FEEDBACK_SCHEMA_SQL).toContain('search_shown');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:113:    expect(FEEDBACK_SCHEMA_SQL).toContain('result_cited');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:125:    expect(resolveConfidence('search_shown', 'strong')).toBe('strong');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:126:    expect(resolveConfidence('result_cited', 'weak')).toBe('weak');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:130:    expect(resolveConfidence('result_cited')).toBe('strong');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:134:    expect(resolveConfidence('search_shown')).toBe('weak');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:139:      'search_shown',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:140:      'result_cited',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:151:    expect(EVENT_TYPE_CONFIDENCE['result_cited']).toBe('strong');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:160:    expect(EVENT_TYPE_CONFIDENCE['search_shown']).toBe('weak');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:176:    const id = logFeedbackEvent(db, makeEvent({ type: 'result_cited', confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:184:      'search_shown',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:185:      'result_cited',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:196:  it('stores all 3 confidence tiers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:198:    logFeedbackEvent(db, makeEvent({ confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:199:    logFeedbackEvent(db, makeEvent({ confidence: 'medium' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:200:    logFeedbackEvent(db, makeEvent({ confidence: 'weak' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:202:    const tiers = events.map(e => e.confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:212:      type: 'result_cited',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:214:      queryId: 'q-999',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:215:      confidence: 'strong',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:222:    expect(row.type).toBe('result_cited');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:225:    expect(row.confidence).toBe('strong');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:237:  it('auto-infers confidence from type when not overridden', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:239:    // Pass the event type's own inferred confidence to match resolveConfidence
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:243:      queryId: 'q-1',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:244:      confidence: resolveConfidence('query_reformulated'),
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:248:    expect(events[0].confidence).toBe('medium');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:298:    logFeedbackEvent(db, makeEvent({ type: 'search_shown' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:299:    logFeedbackEvent(db, makeEvent({ type: 'result_cited', confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:301:    const shown = getFeedbackEvents(db, { type: 'search_shown' });
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:303:    expect(shown[0].type).toBe('search_shown');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:316:  it('filters by confidence tier', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:318:    logFeedbackEvent(db, makeEvent({ confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:319:    logFeedbackEvent(db, makeEvent({ confidence: 'medium' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:320:    logFeedbackEvent(db, makeEvent({ confidence: 'weak' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:322:    const strong = getFeedbackEvents(db, { confidence: 'strong' });
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:324:    expect(strong[0].confidence).toBe('strong');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:359:    const results = getFeedbackEvents(db, { type: 'result_cited' });
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:394:  it('aggregates correctly across confidence tiers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:396:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:397:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:398:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'medium' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:399:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'weak' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:411:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-A', confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:412:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-B', confidence: 'weak' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:446:    logFeedbackEvent(db, makeEvent({ type: 'search_shown' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:447:    logFeedbackEvent(db, makeEvent({ type: 'search_shown' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:448:    logFeedbackEvent(db, makeEvent({ type: 'result_cited', confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:449:    expect(getFeedbackEventCount(db, 'search_shown')).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:450:    expect(getFeedbackEventCount(db, 'result_cited')).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:85:  queryId: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:92:  queryId: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:99:  /** Wall-clock latency for this channel in milliseconds. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:100:  latencyMs?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:107:  queryId: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:114:  /** Total end-to-end latency in milliseconds. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:115:  latencyMs?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:137: * context, triggers). Returns the queryId and evalRunId that
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:140: * Fail-safe: never throws. Returns { queryId: 0, evalRunId: 0 }
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:144:  const noop: LogSearchQueryResult = { queryId: 0, evalRunId: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:160:    const queryId = typeof result.lastInsertRowid === 'bigint'
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:164:    // Use queryId as the canonical per-invocation run ID.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:166:    const evalRunId = queryId > 0 ? queryId : generateEvalRunId();
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:168:    return { queryId, evalRunId };
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:183:  if (!params.evalRunId || !params.queryId) return;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:189:        (eval_run_id, query_id, channel, result_memory_ids, scores, latency_ms, hit_count)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:193:      params.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:197:      params.latencyMs ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:213:  if (!params.evalRunId || !params.queryId) return;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:219:        (eval_run_id, query_id, result_memory_ids, scores, fusion_method, latency_ms)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:223:      params.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:227:      params.latencyMs ?? null
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:208:    it('T005-E3: handle_eval_reporting_dashboard alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:209:      expect(typeof evalReporting.handle_eval_reporting_dashboard).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:212:    it('T005-E4: handle_eval_run_ablation alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:213:      expect(typeof evalReporting.handle_eval_run_ablation).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:257:    it('T006-A4: recallK defaults to 20 when not provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:261:      expect(call[1].recallK).toBe(20);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:264:    it('T006-A5: recallK is clamped to >= 1', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:265:      await evalReporting.handleEvalRunAblation({ channels: ['vector'], recallK: 0 });
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:268:      expect(call[1].recallK).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:325:          context: 'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:382:          context: 'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:404:        recallK: 7,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:434:        recallK: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:460:        metricFilter: ['recall@20'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:468:        metricFilter: ['recall@20'],
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:350:  const queryIdToText = new Map<string, string>();
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:352:    const queryId = `consumption:${row.id}`;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:353:    queryIdToText.set(queryId, row.query_text);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:354:    return queryId;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:360:  for (const queryId of holdoutQueryIds) {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:361:    const queryText = queryIdToText.get(queryId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:369:        replayed.set(queryId, ranks);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:373:      console.warn(`[shadow-evaluation-runtime] query replay failed for ${queryId}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:440:      (queryId) => replayed.get(queryId)?.live ?? [],
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:441:      (queryId) => replayed.get(queryId)?.shadow ?? [],
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:762:        latencyMs: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:310:  it('T045-17b: quality degradation uses absolute+relative confidence checks', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:448:  it('J2: DEFAULT_HINT actions reference memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:450:    expect(actionsStr).toContain('memory_health');
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:18:  confidence: 'high' | 'medium' | 'low' | 'fallback';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:91: * Determine confidence label based on how clearly the query fits its tier.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:113:    // High confidence: many terms and low stop-word ratio (content-rich)
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:141: * @returns ClassificationResult with tier, features, and confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:151:    confidence: 'fallback',
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:184:    const confidence = determineConfidence(tier, termCount, triggerMatch, stopWordRatio);
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:195:      confidence,
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-retry-stats.vitest.ts:3:// Phase 004 CHK-023 (memory_health embeddingRetry), CHK-024 (retry manager edge cases)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:49:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:218: * @param queryId - Identifier for the query being evaluated
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:224:  queryId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:282:    queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:6:  - "latency metrics"
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:35:The telemetry module provides structured observability for the retrieval pipeline and scoring subsystem. It records per-stage latency, search mode selection, fallback triggers, composite quality scores, scoring observation samples, trace payload validation, and agent consumption events. Telemetry data flows to governance tooling and is used by retrieval handlers to surface pipeline health metrics.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:53:| **QualityMetrics** | Composite 0-1 quality proxy derived from relevance, result count, and latency |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:94:| `SPECKIT_EXTENDED_TELEMETRY` | `false` | Enable extended metric collection (latency breakdown, quality scoring, trace payload validation, and architecture updates). Set to `true` to activate |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:118:| `latency` | `LatencyMetrics` | Per-stage timing breakdown |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:165:**Purpose**: Composite quality score for the retrieval run.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:242:| `confidence` | `number` | Clamped transition confidence in the range `[0, 1]` |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:346:const latency: LatencyMetrics = {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:378:  latency,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:391:  // Collect full latency breakdown and quality score
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:392:  telemetry.latency = collectLatencyMetrics(stages);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:393:  telemetry.quality = computeQualityScore(results, requestedLimit, telemetry.latency.totalLatencyMs);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:408:    queryId: 'q-abc-123',
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:447:| Compare `latency.rerankLatencyMs` to `0` | Detect runs where reranking was skipped |
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:640:          confidence: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:43:        confidence: null,
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:304:  describe('T154: meta.latencyMs measurement', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:305:    it('should calculate latency when startTime provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:318:      expect(typeof envelope.meta.latencyMs).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:319:      expect(envelope.meta.latencyMs).toBeGreaterThanOrEqual(45);
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:322:    it('should not include latencyMs when startTime not provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:329:      expect(envelope.meta.latencyMs).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:332:    it('should measure latency in error responses', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:343:      expect(envelope.meta.latencyMs).toBeGreaterThanOrEqual(20);
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:346:    it('should measure latency in empty responses', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:356:      expect(envelope.meta.latencyMs).toBeGreaterThanOrEqual(20);
.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:38:// CHK-064: Reranker latency benchmark — scorePrompt for 20 candidates < 500ms
.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:39:describe('local-reranker latency benchmark (CHK-064)', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:38:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:123:      previousQueryId: previous.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:132:      previousQueryId: previous.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:153: * @param queryId - Opaque query identifier for event correlation
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:161:  queryId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:179:  entries.push({ tokens, timestamp, queryId, shownMemoryIds });
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:184:    const confidence = detection.type === 'query_reformulated' ? 'medium' : 'weak';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:189:        queryId: detection.previousQueryId ?? queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:190:        confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:202: * Log `result_cited` events for memories whose content was loaded.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:208:  queryId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:217:      type: 'result_cited',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:219:      queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:220:      confidence: 'strong',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:252:      queryId: latest.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:253:      confidence: 'strong',
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:30:} from '../lib/search/confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:97:  it('T001-04: confidence is a valid label (high, medium, low, or fallback)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:100:    expect(validLabels).toContain(result.confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:107:    expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:113:    expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:5:// Captures latency, mode selection, fallback, and quality-proxy
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:41:/** Maximum latency value (ms) for quality proxy normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:42: *  Latencies at or above this ceiling map to a 0.0 quality score component. */
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:160:  latency: LatencyMetrics;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:185:    latency: {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:239:  t.latency[stage] = clamped;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:241:  t.latency.totalLatencyMs =
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:242:    t.latency.candidateLatencyMs +
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:243:    t.latency.fusionLatencyMs +
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:244:    t.latency.rerankLatencyMs +
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:245:    t.latency.boostLatencyMs;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:326:    confidence: Math.max(0, Math.min(1, transition.confidence)),
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:481: * constants (latency ceiling, count saturation) are passed as parameters.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:489:    latencyMs: t.latency.totalLatencyMs,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:490:    latencyTargetMs: QUALITY_PROXY_LATENCY_CEILING_MS,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:654:    latency: {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:655:      totalLatencyMs: t.latency.totalLatencyMs,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:656:      candidateLatencyMs: t.latency.candidateLatencyMs,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:657:      fusionLatencyMs: t.latency.fusionLatencyMs,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:658:      rerankLatencyMs: t.latency.rerankLatencyMs,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:659:      boostLatencyMs: t.latency.boostLatencyMs,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:708:      confidence: Math.max(0, Math.min(1, t.transitionDiagnostics.confidence)),
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:5:// To full pipeline (all 5 channels) while reducing simulated latency.
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:9:// - Use channel count as latency proxy (linear model: channelCount * baseMs)
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:105:/** Simulated base latency per channel (ms). */
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:146:/** Simulate query processing latency (channel count as proxy). */
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:231:  it('T11: simple queries simulated latency is ~60% faster than full pipeline', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:240:  it('T12: moderate queries simulated latency is between simple and full', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:249:  it('T13: p95 latency for simple queries (2 channels) is <30ms', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:255:    const p95Index = Math.floor(sorted.length * 0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:256:    const p95 = sorted[p95Index];
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:257:    expect(p95).toBeLessThan(30);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:260:  it('T14: latency scales linearly with channel count', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:857:      logger.info('Migration v15: Created quality score index');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1677: * Adds legacy confidence-related columns when needed.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1681:export function migrate_confidence_columns(database: Database.Database): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1685:  if (!column_names.includes('confidence')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1687:      database.exec(`ALTER TABLE memory_index ADD COLUMN confidence REAL DEFAULT 0.5`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1688:      console.warn('[vector-index] Migration: Added confidence column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1693:      logDuplicateColumnMigrationSkip('confidence', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2276:    migrate_confidence_columns(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2337:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2487:export { migrate_confidence_columns as migrateConfidenceColumns };
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:231: * @param queryIds - Full set of available query IDs
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:236:  queryIds: string[],
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:242:  if (queryIds.length === 0) return [];
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:244:  if (holdoutPercent >= 1) return [...queryIds];
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:246:  const targetCount = Math.max(1, Math.round(queryIds.length * holdoutPercent));
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:250:    return stratifiedSample(queryIds, opts.intentClasses, targetCount, seed);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:255:  const tagged = queryIds.map(id => ({ id, sortKey: rng() }));
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:264:  queryIds: string[],
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:275:  for (const qid of queryIds) {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:295:  const totalItems = queryIds.length;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:352:        comparison.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:381:  opts: { queryId?: string; cycleId?: string; limit?: number } = {}
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:389:    if (opts.queryId) {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:391:      params.push(opts.queryId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:596:  computeLiveRanks: (queryId: string) => RankedItem[],
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:597:  computeShadowRanks: (queryId: string) => RankedItem[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:92: * latency minimal and the ≤2 LLM calls per deep query budget intact.
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:23:    expect(contract.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-hooks.vitest.ts:63:    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:71:      confidence: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:88:      confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:34:  latency_ms?: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:55:  avg_latency_ms: number;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:108:      latency_ms REAL,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:148:         session_id, timestamp, latency_ms, spec_folder_filter, metadata)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:159:      event.latency_ms ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:184:    avg_latency_ms: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:230:        AVG(latency_ms) as avg_latency
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:232:    `).get(...params) as { avg_results: number | null; avg_latency: number | null };
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:251:      avg_latency_ms: Number((avgRow?.avg_latency ?? 0).toFixed(2)),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:196:      'culinary arts require precision and creativity',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:387:      'The dimensionality of embeddings affects search precision.',
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:74:} from '../lib/search/confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:169:      expect(intent.confidence).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:468:      expect(emptyIntent.confidence).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:625:      // Step 7: Truncate by confidence
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:6:// feedback-ledger.ts), computes confidence-weighted signal scores
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:17://   - All reads and writes use the existing feedback_events table
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:46:/** Per-confidence-tier weights used in the weighted score formula. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:160: * Also calls initFeedbackLedger to guarantee feedback_events exists.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:178: * Groups events by memoryId, counts confidence tiers, and computes
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:179: * a confidence-weighted score.  Does NOT apply min-support filtering
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:215:      entry[ev.confidence]++;
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:173:  const queryIds = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:176:    const holdout = selectHoldoutQueries(queryIds);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:182:    const holdout = selectHoldoutQueries(queryIds, { holdoutPercent: 0.50 });
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:187:    const h1 = selectHoldoutQueries(queryIds, { seed: 42 });
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:188:    const h2 = selectHoldoutQueries(queryIds, { seed: 42 });
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:194:    const h1 = selectHoldoutQueries(queryIds, { seed: 42, holdoutPercent: 0.50 });
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:195:    const h2 = selectHoldoutQueries(queryIds, { seed: 7777, holdoutPercent: 0.50 });
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:205:    expect(selectHoldoutQueries(queryIds, { holdoutPercent: 0 })).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:209:    const holdout = selectHoldoutQueries(queryIds, { holdoutPercent: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:210:    expect(holdout.length).toBe(queryIds.length);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:212:    for (const q of queryIds) {
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:224:    const holdout = selectHoldoutQueries(queryIds, { holdoutPercent: 0.50 });
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:226:      expect(queryIds).toContain(q);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:489:    expect(result.queryId).toBe('q1');
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:684:        queryId: 'q1',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:703:      const history = getShadowScoringHistory(db, { queryId: 'q1' });
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:719:        queryId: 'q1',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:739:        queryId: 'q1',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:761:        queryId: 'q1',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:768:        queryId: 'q2',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:791:        queryId: 'q1',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1394:      queryId: 'q1',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1402:    const allHistory = getShadowScoringHistory(db, { queryId: 'q1' });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:430:  it('rejects content with quality score below 0.6 when quality loop enabled', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:96:  it('logs result_cited for each cited memory id', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:101:    expect(getFeedbackEventCount(db, 'result_cited')).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:102:    const events = getFeedbackEvents(db, { type: 'result_cited' });
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:141:    expect(getFeedbackEventCount(db, 'result_cited')).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:33:    latencyMs: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:163:      latencyMs: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:115:            confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:139:      confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:145:    expect(parsed.data).not.toHaveProperty('confidence');
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts:29:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts:127:      obs.queryId,
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:94:      recall20: mrr5 * 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:357:  it('T008.7b: metric row names are correct (mrr@5, ndcg@10, recall@20, hit_rate@1)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:367:    expect(metricNames).toContain('recall@20');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:404:    expect(typeof result.metrics.recall20).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:472:      if (relevance.queryId <= 3 && relevance.relevance > 0 && !relevantMemoryByQueryId.has(relevance.queryId)) {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:473:        relevantMemoryByQueryId.set(relevance.queryId, relevance.memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:495:    expect(withKOverride.metrics.recall20).not.toBeCloseTo(baseline.metrics.recall20, 10);
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:133:| `type-inference.ts` | Multi-source inference with confidence scoring |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:166:// Returns: { type: 'working', source: 'file_path', confidence: 0.8 }
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:172:// Returns: { type: 'semantic', source: 'frontmatter_explicit', confidence: 1.0 }
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:179:// Returns: { type: 'procedural', source: 'keywords', confidence: 0.7 }
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:37:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:178:      decision_meta: { confidence: 0.95, strategy: 'dedup' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:315:      confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:338:    expect(resumed.confidence).toBe(0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:354:    expect(explicit.confidence).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:407:  it('T033: Quick mode description mentions low latency', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:409:    expect(desc.includes('low latency') || desc.includes('fast')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:195:      queryId: 'test-q-1',
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:215:      queryId: 'age-test',
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:250:      queryId: 'tm01-test',
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:270:      queryId: 'tm01-not-applied',
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:290:      queryId: 'delta-test',
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:335:        queryId: `q${i}`,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:352:      memoryId: 1, queryId: 'q1', timestamp: new Date().toISOString(),
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:358:      memoryId: 2, queryId: 'q2', timestamp: new Date().toISOString(),
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:387:      queryId: 'safe-test',
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:435:        queryId: 'no-table',
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:49:  confidence?: {
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:259:  const lowConfidence = results.filter(r => r.confidence?.label === 'low');
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:261:    blockers.push(`${lowConfidence.length} result(s) have low confidence scores`);
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:45:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts:2:// Transparent Reasoning Module: Z-score confidence check on RRF
.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts:3:// Scores to detect low-confidence retrieval and inject warnings.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:31:        confidence: 0.92,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:43:          { intent: 'find_spec', confidence: 0.92, score: 0.92 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:44:          { intent: 'find_decision', confidence: 0.44, score: 0.44 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:45:          { intent: 'understand', confidence: 0.18, score: 0.18 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:118:      logSearchQuery: vi.fn(() => ({ queryId: 0, evalRunId: 0 })),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:83:  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.9, fallback: false })),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:105:  logSearchQuery: vi.fn(() => ({ queryId: 11, evalRunId: 22 })),
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:57:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:32:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:225:  // 1. Check explicit type in frontmatter (highest confidence)
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:231:      confidence: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:243:      confidence: 0.95,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:252:      confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:261:      confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:271:      confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:281:      confidence: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:285:  // 6. Default type (lowest confidence)
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:289:    confidence: 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:33:  'negative_feedback_events',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:128:    CREATE TABLE IF NOT EXISTS negative_feedback_events (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:347:    INSERT INTO negative_feedback_events (id, memory_id, created_at_ms)
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:6:// Pattern detection, fail-safe behavior, latency tracking.
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:34:  latency_ms?: number | null;
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:50:       session_id, timestamp, latency_ms, spec_folder_filter, metadata)
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:60:    event.latency_ms ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:105:    expect(columnNames).toContain('latency_ms');
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:158:      latency_ms: 42.5,
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:170:    expect(row.latency_ms).toBe(42.5);
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:183:      latency_ms: 150.0,
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:201:      latency_ms: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:218:      latency_ms: null,
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:272:    expect(stats.avg_latency_ms).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:302:  it('T003-E: calculates avg_latency_ms', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:303:    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1, latency_ms: 100 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:304:    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1, latency_ms: 200 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:306:    expect(stats.avg_latency_ms).toBe(150);
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:568:describe('T006: latency tracking', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:579:  it('T006-A: latency_ms is stored as a float', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:580:    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1, latency_ms: 123.456 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:581:    const row = db.prepare(`SELECT latency_ms FROM consumption_log`).get() as { latency_ms: number };
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:582:    expect(typeof row.latency_ms).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:583:    expect(row.latency_ms).toBeCloseTo(123.456);
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:586:  it('T006-B: latency_ms is null when not provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:588:    const row = db.prepare(`SELECT latency_ms FROM consumption_log`).get() as { latency_ms: number | null };
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:589:    expect(row.latency_ms).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:592:  it('T006-C: avg_latency_ms in stats reflects stored latencies', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:593:    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1, latency_ms: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:594:    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1, latency_ms: 20 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:595:    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1, latency_ms: 30 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:597:    expect(stats.avg_latency_ms).toBe(20);
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:600:  it('T006-D: latency can be measured via Date.now() diff', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:607:      latency_ms: fakeLatency,
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:611:    const row = db.prepare(`SELECT latency_ms FROM consumption_log`).get() as { latency_ms: number };
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:612:    expect(row.latency_ms).toBe(fakeLatency);
.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:20:  latencyMs?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:179:  // Calculate latency if start time provided
.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:180:  const latencyMs = startTime ? Date.now() - startTime : null;
.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:186:    ...(latencyMs !== null && { latencyMs }),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:215:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:404:          ((row.confidence as number) || 0.5) <= ARCHIVAL_CONFIG.maxConfidence
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:417:          confidence: (row.confidence as number) || 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:441:  if ((row.confidence as number) <= ARCHIVAL_CONFIG.maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:442:    reasons.push('low-confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:133:          confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:172:      confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:297:- Purpose: Owns ranking and calibration logic once candidate memories already exist. It combines importance tiers, composite scoring, folder relevance, confidence signals, and negative-feedback effects.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:302:  - `confidence-tracker.ts` — confidence-related normalization helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:303:  - `negative-feedback.ts` — post-feedback confidence penalties.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:59:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:139:    return { detected: false, type: null, description: null, confidence: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:148:  // Specificity-based confidence per contradiction type:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:149:  // General/weak signals get lower confidence, explicit/strong signals get higher
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:171:      const confidence = PATTERN_CONFIDENCE[type] ?? 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:172:      if (confidence > maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:173:        maxConfidence = confidence;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:179:      const confidence = (PATTERN_CONFIDENCE[type] ?? 0.5) * 0.6;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:180:      if (confidence > maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:181:        maxConfidence = confidence;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:193:    confidence: maxConfidence,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:220:        { detected: false, type: null, description: null, confidence: 0 },
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:243:        { detected: false, type: null, description: null, confidence: 0 },
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:18: * this to 0.25 for better discovery recall. The R17 fan-effect divisor (sqrt scaling)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:93:| **Testing Effect**           | Low retrievability = greater boost on success                                         | Harder recalls strengthen more       |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:307:  GRADE_GOOD,   // grade (3 = successful recall)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:323:- `GRADE_AGAIN (1)`: Failed recall → Stability × 0.2
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:324:- `GRADE_HARD (2)`: Difficult recall → gradeFactor 0.8
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:325:- `GRADE_GOOD (3)`: Successful recall → gradeFactor 1.0
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:326:- `GRADE_EASY (4)`: Easy recall → gradeFactor 1.3
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:417://   contradiction: { detected: false, type: null, description: null, confidence: 0 },
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:423:// contradiction = { detected: true, type: 'negation', description: '...', confidence: 0.60 }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:670:// candidates = [{ id, title, spec_folder, file_path, created_at, importance_tier, access_count, confidence, reason }]
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:689:# maxConfidence: 0.4                           # Low-confidence threshold
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:970:A: FSRS is validated on 100M+ real human memory data from Anki. Exponential decay (`e^(-t/τ)`) decays too fast initially and too slow later. FSRS power-law decay `(1 + (19/81) × t/S)^(-0.5)` matches how human memory actually works, with a "desirable difficulty" effect where harder recalls strengthen memories more.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:976:A: **Retrievability** (R) is the FSRS-calculated probability of recall (0.0 to 1.0), based on stability and elapsed time. **Attention score** is the session-specific activation level in `working_memory`, which starts at 1.0 when a memory enters the session and decays at 0.95 per cycle.
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:158:    | 'session_health'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:196:  'confidence',
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:197:  'confidenceScore',
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:53:| **DegradedModeContract** | Failure description with confidence impact, retry recommendation, and affected stages |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:131:| `confidence_impact` | `number` | Confidence factor (0 = total loss, 1 = no impact), clamped to [0, 1] |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:162:| `createDegradedContract(failure_mode, fallback_mode, confidence_impact, retry_recommendation, degradedStages)` | `DegradedModeContract` | New degraded-mode record with clamped confidence |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:185:- Do not replace those axes with a single scalar such as `trust`, `confidence`, `authorityScore`, or `freshnessScore`.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:186:- Ranking confidence from `lib/search/confidence-scoring.ts` is retrieval-ordering metadata only and must not be reused as `StructuralTrust`.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:236:console.log(`Failure: ${degraded.failure_mode}, confidence impact: ${degraded.confidence_impact}`);
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:237:// Failure: timeout, confidence impact: 0.15
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:305:- Fail closed when any axis is missing, malformed, or collapsed into scalar stand-ins such as `trust`, `trustScore`, `confidence`, `confidenceScore`, or `authorityScore`.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:312:- Ranking confidence and other retrieval-ordering metadata stay separate from `StructuralTrust`.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:77: * Calculate retrievability (probability of recall) using FSRS v4 formula.

codex
The benchmark story is already getting clearer: MemPalace measures a lot more than the README headline suggests, but most of its operational metrics live in benchmark-only pytest lanes rather than default health or runtime telemetry. I’m now reading the exact files on both sides that define those metrics so I can separate “benchmark score,” “quality signal,” and “system health” cleanly in the final iteration write-up.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"""
MCP server tool performance benchmarks.

Validates production readiness findings:
  - Finding #3: tool_status() unbounded col.get(include=["metadatas"]) → OOM
  - Finding #7: _get_collection() re-instantiates PersistentClient every call
  - Finding #3 variants: tool_list_wings(), tool_get_taxonomy() same pattern

Calls MCP tool handler functions directly with monkeypatched _config.
"""

import time

import chromadb
import pytest

from tests.benchmarks.data_generator import PalaceDataGenerator
from tests.benchmarks.report import record_metric


# ── Helpers ──────────────────────────────────────────────────────────────


def _make_palace(tmp_path, n_drawers, scale="small"):
    """Create a palace with exactly n_drawers, return palace_path."""
    gen = PalaceDataGenerator(seed=42, scale=scale)
    palace_path = str(tmp_path / "palace")
    gen.populate_palace_directly(palace_path, n_drawers=n_drawers, include_needles=False)
    return palace_path


def _patch_mcp_config(monkeypatch, palace_path, tmp_path):
    """Monkeypatch mcp_server._config and _kg to point at test dirs."""
    from mempalace.config import MempalaceConfig
    from mempalace.knowledge_graph import KnowledgeGraph

    cfg = MempalaceConfig(config_dir=str(tmp_path / "cfg"))
    # Override palace_path directly on the object
    monkeypatch.setattr(cfg, "_file_config", {"palace_path": palace_path})

    import mempalace.mcp_server as mcp_mod

    monkeypatch.setattr(mcp_mod, "_config", cfg)
    monkeypatch.setattr(mcp_mod, "_kg", KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3")))


def _get_rss_mb():
    """Get current process RSS in MB."""
    try:
        import psutil

        return psutil.Process().memory_info().rss / (1024 * 1024)
    except ImportError:
        import resource

        # ru_maxrss is in KB on Linux, bytes on macOS
        import platform

        usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        if platform.system() == "Darwin":
            return usage / (1024 * 1024)
        return usage / 1024


# ── Tests ────────────────────────────────────────────────────────────────


@pytest.mark.benchmark
class TestToolStatusOOM:
    """Finding #3: tool_status loads ALL metadata into memory."""

    SIZES = [500, 1_000, 2_500, 5_000]

    @pytest.mark.parametrize("n_drawers", SIZES)
    def test_tool_status_rss_growth(self, n_drawers, tmp_path, monkeypatch):
        """Measure RSS growth from tool_status at different palace sizes."""
        palace_path = _make_palace(tmp_path, n_drawers)
        _patch_mcp_config(monkeypatch, palace_path, tmp_path)

        from mempalace.mcp_server import tool_status

        rss_before = _get_rss_mb()
        result = tool_status()
        rss_after = _get_rss_mb()

        rss_delta = rss_after - rss_before
        assert "error" not in result, f"tool_status failed: {result}"
        assert result["total_drawers"] == n_drawers

        record_metric("mcp_status", f"rss_delta_mb_at_{n_drawers}", round(rss_delta, 2))

    @pytest.mark.parametrize("n_drawers", SIZES)
    def test_tool_status_latency(self, n_drawers, tmp_path, monkeypatch):
        """Measure tool_status response time at different palace sizes."""
        palace_path = _make_palace(tmp_path, n_drawers)
        _patch_mcp_config(monkeypatch, palace_path, tmp_path)

        from mempalace.mcp_server import tool_status

        # Warm up
        tool_status()

        start = time.perf_counter()
        result = tool_status()
        elapsed_ms = (time.perf_counter() - start) * 1000

        assert "error" not in result
        record_metric("mcp_status", f"latency_ms_at_{n_drawers}", round(elapsed_ms, 1))


@pytest.mark.benchmark
class TestToolListWingsUnbounded:
    """Finding #3 variant: tool_list_wings also fetches ALL metadata."""

    @pytest.mark.parametrize("n_drawers", [500, 1_000, 2_500, 5_000])
    def test_list_wings_latency(self, n_drawers, tmp_path, monkeypatch):
        palace_path = _make_palace(tmp_path, n_drawers)
        _patch_mcp_config(monkeypatch, palace_path, tmp_path)

        from mempalace.mcp_server import tool_list_wings

        start = time.perf_counter()
        result = tool_list_wings()
        elapsed_ms = (time.perf_counter() - start) * 1000

        assert "wings" in result
        record_metric("mcp_list_wings", f"latency_ms_at_{n_drawers}", round(elapsed_ms, 1))


@pytest.mark.benchmark
class TestToolGetTaxonomyUnbounded:
    """Finding #3 variant: tool_get_taxonomy also fetches ALL metadata."""

    @pytest.mark.parametrize("n_drawers", [500, 1_000, 2_500, 5_000])
    def test_get_taxonomy_latency(self, n_drawers, tmp_path, monkeypatch):
        palace_path = _make_palace(tmp_path, n_drawers)
        _patch_mcp_config(monkeypatch, palace_path, tmp_path)

        from mempalace.mcp_server import tool_get_taxonomy

        start = time.perf_counter()
        result = tool_get_taxonomy()
        elapsed_ms = (time.perf_counter() - start) * 1000

        assert "taxonomy" in result
        record_metric("mcp_taxonomy", f"latency_ms_at_{n_drawers}", round(elapsed_ms, 1))


@pytest.mark.benchmark
class TestClientReinstantiation:
    """Finding #7: _get_collection() creates new PersistentClient every call."""

    def test_reinstantiation_overhead(self, tmp_path, monkeypatch):
        """Measure cost of 50 _get_collection() calls vs a cached client."""
        palace_path = _make_palace(tmp_path, 500)
        _patch_mcp_config(monkeypatch, palace_path, tmp_path)

        from mempalace.mcp_server import _get_collection

        n_calls = 50

        # Measure re-instantiation (current behavior)
        start = time.perf_counter()
        for _ in range(n_calls):
            col = _get_collection()
            assert col is not None
        uncached_ms = (time.perf_counter() - start) * 1000

        # Measure cached client (what it should be)
        client = chromadb.PersistentClient(path=palace_path)
        cached_col = client.get_collection("mempalace_drawers")
        start = time.perf_counter()
        for _ in range(n_calls):
            _ = cached_col.count()
        cached_ms = (time.perf_counter() - start) * 1000

        overhead_ratio = uncached_ms / max(cached_ms, 0.01)

        record_metric("client_reinstantiation", "uncached_total_ms", round(uncached_ms, 1))
        record_metric("client_reinstantiation", "cached_total_ms", round(cached_ms, 1))
        record_metric("client_reinstantiation", "overhead_ratio", round(overhead_ratio, 2))
        record_metric("client_reinstantiation", "n_calls", n_calls)


@pytest.mark.benchmark
class TestToolSearchLatency:
    """tool_search uses query() not get(), should scale better."""

    @pytest.mark.parametrize("n_drawers", [500, 1_000, 2_500, 5_000])
    def test_search_latency(self, n_drawers, tmp_path, monkeypatch):
        palace_path = _make_palace(tmp_path, n_drawers)
        _patch_mcp_config(monkeypatch, palace_path, tmp_path)

        from mempalace.mcp_server import tool_search

        queries = ["authentication middleware", "database migration", "error handling"]
        latencies = []
        for q in queries:
            start = time.perf_counter()
            result = tool_search(query=q, limit=5)
            elapsed_ms = (time.perf_counter() - start) * 1000
            latencies.append(elapsed_ms)
            assert "error" not in result

        avg_ms = sum(latencies) / len(latencies)
        record_metric("mcp_search", f"avg_latency_ms_at_{n_drawers}", round(avg_ms, 1))


@pytest.mark.benchmark
class TestDuplicateCheckCost:
    """tool_add_drawer calls tool_check_duplicate first — measure overhead."""

    @pytest.mark.parametrize("n_drawers", [500, 1_000, 2_500])
    def test_duplicate_check_latency(self, n_drawers, tmp_path, monkeypatch):
        palace_path = _make_palace(tmp_path, n_drawers)
        _patch_mcp_config(monkeypatch, palace_path, tmp_path)

        from mempalace.mcp_server import tool_check_duplicate

        test_content = "This is unique test content for duplicate checking benchmark."
        start = time.perf_counter()
        result = tool_check_duplicate(content=test_content)
        elapsed_ms = (time.perf_counter() - start) * 1000

        assert "error" not in result
        record_metric("mcp_duplicate_check", f"latency_ms_at_{n_drawers}", round(elapsed_ms, 1))

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"""
ChromaDB stress tests — find the breaking point.

Tests the raw ChromaDB patterns used by mempalace to determine:
  - At what collection size does col.get(include=["metadatas"]) become dangerous?
  - How does query latency degrade as collection grows?
  - How much faster is batched insertion vs sequential?
"""

import os
import time

import chromadb
import pytest

from tests.benchmarks.data_generator import PalaceDataGenerator
from tests.benchmarks.report import record_metric


def _get_rss_mb():
    try:
        import psutil

        return psutil.Process().memory_info().rss / (1024 * 1024)
    except ImportError:
        import resource
        import platform

        usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        if platform.system() == "Darwin":
            return usage / (1024 * 1024)
        return usage / 1024


@pytest.mark.benchmark
class TestGetAllMetadatasOOM:
    """
    The specific pattern causing finding #3:
    col.get(include=["metadatas"]) with NO limit.

    Measures RSS growth to find when this becomes dangerous.
    """

    SIZES = [1_000, 2_500, 5_000, 10_000]

    @pytest.mark.parametrize("n_drawers", SIZES)
    def test_get_all_metadatas_rss(self, n_drawers, tmp_path, bench_scale):
        """RSS growth from fetching all metadata at once."""
        gen = PalaceDataGenerator(seed=42, scale=bench_scale)
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=n_drawers, include_needles=False)

        client = chromadb.PersistentClient(path=palace_path)
        col = client.get_collection("mempalace_drawers")

        rss_before = _get_rss_mb()
        start = time.perf_counter()
        all_meta = col.get(include=["metadatas"])["metadatas"]
        elapsed_ms = (time.perf_counter() - start) * 1000
        rss_after = _get_rss_mb()

        assert len(all_meta) == n_drawers
        rss_delta = rss_after - rss_before

        record_metric("chromadb_get_all", f"rss_delta_mb_at_{n_drawers}", round(rss_delta, 2))
        record_metric("chromadb_get_all", f"latency_ms_at_{n_drawers}", round(elapsed_ms, 1))


@pytest.mark.benchmark
class TestQueryDegradation:
    """Measure query latency as collection grows."""

    SIZES = [1_000, 2_500, 5_000, 10_000]

    @pytest.mark.parametrize("n_drawers", SIZES)
    def test_query_latency_at_size(self, n_drawers, tmp_path, bench_scale):
        gen = PalaceDataGenerator(seed=42, scale=bench_scale)
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=n_drawers, include_needles=False)

        client = chromadb.PersistentClient(path=palace_path)
        col = client.get_collection("mempalace_drawers")

        queries = [
            "authentication middleware optimization",
            "database connection pooling strategy",
            "error handling retry logic",
            "deployment pipeline configuration",
            "load balancer health check",
        ]

        latencies = []
        for q in queries:
            start = time.perf_counter()
            results = col.query(query_texts=[q], n_results=5, include=["documents", "distances"])
            elapsed_ms = (time.perf_counter() - start) * 1000
            latencies.append(elapsed_ms)
            assert results["documents"][0]  # got results

        avg_ms = sum(latencies) / len(latencies)
        p95_ms = sorted(latencies)[int(len(latencies) * 0.95)]

        record_metric("chromadb_query", f"avg_latency_ms_at_{n_drawers}", round(avg_ms, 1))
        record_metric("chromadb_query", f"p95_latency_ms_at_{n_drawers}", round(p95_ms, 1))


@pytest.mark.benchmark
class TestBulkInsertPerformance:
    """Compare batch insertion vs sequential add_drawer pattern."""

    def test_sequential_vs_batched(self, tmp_path):
        """The current miner uses single-document add(). How much faster is batching?"""
        n_docs = 500
        gen = PalaceDataGenerator(seed=42)

        # Generate content
        contents = [gen._random_text(400, 800) for _ in range(n_docs)]

        # Sequential insertion (mimics add_drawer pattern)
        palace_seq = str(tmp_path / "seq")
        os.makedirs(palace_seq)
        client_seq = chromadb.PersistentClient(path=palace_seq)
        col_seq = client_seq.get_or_create_collection("mempalace_drawers")

        start = time.perf_counter()
        for i, content in enumerate(contents):
            col_seq.add(
                documents=[content],
                ids=[f"seq_{i}"],
                metadatas=[{"wing": "test", "room": "bench", "chunk_index": i}],
            )
        sequential_ms = (time.perf_counter() - start) * 1000

        # Batched insertion
        palace_batch = str(tmp_path / "batch")
        os.makedirs(palace_batch)
        client_batch = chromadb.PersistentClient(path=palace_batch)
        col_batch = client_batch.get_or_create_collection("mempalace_drawers")

        batch_size = 100
        start = time.perf_counter()
        for batch_start in range(0, n_docs, batch_size):
            batch_end = min(batch_start + batch_size, n_docs)
            batch_docs = contents[batch_start:batch_end]
            batch_ids = [f"batch_{i}" for i in range(batch_start, batch_end)]
            batch_metas = [
                {"wing": "test", "room": "bench", "chunk_index": i}
                for i in range(batch_start, batch_end)
            ]
            col_batch.add(documents=batch_docs, ids=batch_ids, metadatas=batch_metas)
        batched_ms = (time.perf_counter() - start) * 1000

        speedup = sequential_ms / max(batched_ms, 0.01)

        assert col_seq.count() == n_docs
        assert col_batch.count() == n_docs

        record_metric("chromadb_insert", "sequential_ms", round(sequential_ms, 1))
        record_metric("chromadb_insert", "batched_ms", round(batched_ms, 1))
        record_metric("chromadb_insert", "speedup_ratio", round(speedup, 2))
        record_metric("chromadb_insert", "n_docs", n_docs)
        record_metric("chromadb_insert", "batch_size", batch_size)


@pytest.mark.benchmark
@pytest.mark.slow
class TestMaxCollectionSize:
    """Incrementally grow collection to find practical limits."""

    def test_incremental_growth(self, tmp_path, bench_scale):
        """Add drawers in batches, measure latency per batch."""
        gen = PalaceDataGenerator(seed=42, scale=bench_scale)
        cfg = gen.cfg
        target = min(cfg["drawers"], 10_000)  # cap at 10K for this test

        palace_path = str(tmp_path / "palace")
        os.makedirs(palace_path)
        client = chromadb.PersistentClient(path=palace_path)
        col = client.get_or_create_collection("mempalace_drawers")

        batch_size = 500
        batch_times = []
        total_inserted = 0

        for batch_num in range(0, target, batch_size):
            n = min(batch_size, target - batch_num)
            docs = [gen._random_text(400, 800) for _ in range(n)]
            ids = [f"growth_{batch_num + i}" for i in range(n)]
            metas = [
                {"wing": gen.wings[i % len(gen.wings)], "room": "bench", "chunk_index": i}
                for i in range(batch_num, batch_num + n)
            ]

            start = time.perf_counter()
            col.add(documents=docs, ids=ids, metadatas=metas)
            batch_ms = (time.perf_counter() - start) * 1000
            total_inserted += n
            batch_times.append({"at_size": total_inserted, "batch_ms": round(batch_ms, 1)})

        assert col.count() == total_inserted

        # Record first and last batch times to show degradation
        record_metric("chromadb_growth", "first_batch_ms", batch_times[0]["batch_ms"])
        record_metric("chromadb_growth", "last_batch_ms", batch_times[-1]["batch_ms"])
        record_metric("chromadb_growth", "total_inserted", total_inserted)
        record_metric("chromadb_growth", "batch_times", batch_times)

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_memory_profile.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"""
Memory profiling benchmarks — detect leaks and measure RSS growth.

Uses tracemalloc for heap snapshots and psutil/resource for RSS.
Targets the highest-risk code paths:
  - Repeated search() calls (PersistentClient re-instantiation)
  - Repeated tool_status() calls (unbounded metadata fetch)
  - Layer1.generate() (fetches all drawers)
"""

import tracemalloc

import pytest

from tests.benchmarks.data_generator import PalaceDataGenerator
from tests.benchmarks.report import record_metric


def _get_rss_mb():
    try:
        import psutil

        return psutil.Process().memory_info().rss / (1024 * 1024)
    except ImportError:
        import resource
        import platform

        usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        if platform.system() == "Darwin":
            return usage / (1024 * 1024)
        return usage / 1024


@pytest.mark.benchmark
class TestSearchMemoryProfile:
    """Track RSS growth over repeated search_memories() calls."""

    def test_search_rss_growth(self, tmp_path):
        """Issue 200 searches and track RSS every 50 calls."""
        gen = PalaceDataGenerator(seed=42, scale="small")
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=1_000, include_needles=False)

        from mempalace.searcher import search_memories

        n_calls = 200
        check_interval = 50
        queries = ["authentication", "database", "deployment", "error handling", "testing"]
        rss_readings = []
        rss_readings.append(("start", _get_rss_mb()))

        for i in range(n_calls):
            q = queries[i % len(queries)]
            search_memories(q, palace_path=palace_path, n_results=5)
            if (i + 1) % check_interval == 0:
                rss_readings.append((f"after_{i + 1}", _get_rss_mb()))

        start_rss = rss_readings[0][1]
        end_rss = rss_readings[-1][1]
        growth = end_rss - start_rss

        record_metric("memory_search", "rss_start_mb", round(start_rss, 2))
        record_metric("memory_search", "rss_end_mb", round(end_rss, 2))
        record_metric("memory_search", "rss_growth_mb", round(growth, 2))
        record_metric("memory_search", "n_calls", n_calls)
        record_metric(
            "memory_search", "growth_per_100_calls_mb", round(growth / (n_calls / 100), 2)
        )


@pytest.mark.benchmark
class TestToolStatusMemoryProfile:
    """Track RSS growth from repeated tool_status() calls."""

    def test_tool_status_repeated_calls(self, tmp_path, monkeypatch):
        """tool_status loads ALL metadata each call — does it leak?"""
        gen = PalaceDataGenerator(seed=42, scale="small")
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=2_000, include_needles=False)

        from mempalace.config import MempalaceConfig
        from mempalace.knowledge_graph import KnowledgeGraph
        import mempalace.mcp_server as mcp_mod

        cfg = MempalaceConfig(config_dir=str(tmp_path / "cfg"))
        monkeypatch.setattr(cfg, "_file_config", {"palace_path": palace_path})
        monkeypatch.setattr(mcp_mod, "_config", cfg)
        monkeypatch.setattr(mcp_mod, "_kg", KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3")))

        from mempalace.mcp_server import tool_status

        n_calls = 50
        rss_readings = []
        rss_readings.append(("start", _get_rss_mb()))

        for i in range(n_calls):
            result = tool_status()
            assert result["total_drawers"] == 2_000
            if (i + 1) % 10 == 0:
                rss_readings.append((f"after_{i + 1}", _get_rss_mb()))

        start_rss = rss_readings[0][1]
        end_rss = rss_readings[-1][1]
        growth = end_rss - start_rss

        record_metric("memory_tool_status", "rss_start_mb", round(start_rss, 2))
        record_metric("memory_tool_status", "rss_end_mb", round(end_rss, 2))
        record_metric("memory_tool_status", "rss_growth_mb", round(growth, 2))
        record_metric("memory_tool_status", "n_calls", n_calls)
        record_metric("memory_tool_status", "palace_size", 2_000)


@pytest.mark.benchmark
class TestLayer1MemoryProfile:
    """Layer1.generate() fetches ALL drawers — same risk as tool_status."""

    def test_layer1_repeated_generate(self, tmp_path):
        """Layer1 fetches all drawers for scoring. Track memory over repeats."""
        gen = PalaceDataGenerator(seed=42, scale="small")
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=2_000, include_needles=False)

        from mempalace.layers import Layer1

        layer = Layer1(palace_path=palace_path)

        n_calls = 30
        rss_readings = []
        rss_readings.append(("start", _get_rss_mb()))

        for i in range(n_calls):
            text = layer.generate()
            assert "L1" in text
            if (i + 1) % 10 == 0:
                rss_readings.append((f"after_{i + 1}", _get_rss_mb()))

        start_rss = rss_readings[0][1]
        end_rss = rss_readings[-1][1]
        growth = end_rss - start_rss

        record_metric("memory_layer1", "rss_start_mb", round(start_rss, 2))
        record_metric("memory_layer1", "rss_end_mb", round(end_rss, 2))
        record_metric("memory_layer1", "rss_growth_mb", round(growth, 2))
        record_metric("memory_layer1", "n_calls", n_calls)


@pytest.mark.benchmark
class TestHeapSnapshot:
    """Use tracemalloc to identify top memory allocators during search."""

    def test_search_heap_top_allocators(self, tmp_path):
        """Identify which code paths allocate the most memory during search."""
        gen = PalaceDataGenerator(seed=42, scale="small")
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=1_000, include_needles=False)

        from mempalace.searcher import search_memories

        tracemalloc.start()
        snap_before = tracemalloc.take_snapshot()

        for i in range(100):
            search_memories("test query", palace_path=palace_path, n_results=5)

        snap_after = tracemalloc.take_snapshot()
        tracemalloc.stop()

        stats = snap_after.compare_to(snap_before, "lineno")
        top_allocators = []
        for stat in stats[:10]:
            top_allocators.append(
                {
                    "file": str(stat.traceback),
                    "size_kb": round(stat.size / 1024, 1),
                    "count": stat.count,
                }
            )

        total_growth_kb = sum(s["size_kb"] for s in top_allocators)
        record_metric("heap_search", "top_10_growth_kb", round(total_growth_kb, 1))
        record_metric("heap_search", "n_searches", 100)

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"""
Knowledge graph benchmarks — SQLite temporal KG at scale.

Tests triple insertion throughput, query latency, temporal accuracy,
and SQLite concurrent access behavior.
"""

import threading
import time

import pytest

from tests.benchmarks.data_generator import PalaceDataGenerator
from tests.benchmarks.report import record_metric


@pytest.mark.benchmark
class TestTripleInsertionRate:
    """Measure triples/sec at different scales."""

    @pytest.mark.parametrize("n_triples", [200, 1_000, 5_000])
    def test_insertion_throughput(self, n_triples, tmp_path):
        gen = PalaceDataGenerator(seed=42, scale="small")
        entities, triples = gen.generate_kg_triples(
            n_entities=min(n_triples // 2, 200), n_triples=n_triples
        )

        from mempalace.knowledge_graph import KnowledgeGraph

        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))

        # Insert entities first
        for name, etype in entities:
            kg.add_entity(name, etype)

        # Measure triple insertion
        start = time.perf_counter()
        for subject, predicate, obj, valid_from, valid_to in triples:
            kg.add_triple(subject, predicate, obj, valid_from=valid_from, valid_to=valid_to)
        elapsed = time.perf_counter() - start

        triples_per_sec = n_triples / max(elapsed, 0.001)

        record_metric("kg_insert", f"triples_per_sec_at_{n_triples}", round(triples_per_sec, 1))
        record_metric("kg_insert", f"elapsed_sec_at_{n_triples}", round(elapsed, 3))


@pytest.mark.benchmark
class TestQueryEntityLatency:
    """Query latency for entities with varying relationship counts."""

    def test_query_latency_vs_relationships(self, tmp_path):
        """Create entities with 10, 50, 100 relationships and measure query time."""
        from mempalace.knowledge_graph import KnowledgeGraph

        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))

        # Create a hub entity connected to many others
        kg.add_entity("Hub", "person")
        target_counts = [10, 50, 100]

        for target in target_counts:
            for i in range(target):
                entity_name = f"Node_{target}_{i}"
                kg.add_entity(entity_name, "project")
                kg.add_triple("Hub", "works_on", entity_name, valid_from="2025-01-01")

        # Measure query for Hub (which has sum(target_counts) relationships)
        latencies = []
        for _ in range(20):
            start = time.perf_counter()
            kg.query_entity("Hub")
            elapsed_ms = (time.perf_counter() - start) * 1000
            latencies.append(elapsed_ms)

        avg_ms = sum(latencies) / len(latencies)
        total_rels = sum(target_counts)

        record_metric("kg_query", f"avg_ms_with_{total_rels}_rels", round(avg_ms, 2))
        record_metric("kg_query", "total_relationships", total_rels)


@pytest.mark.benchmark
class TestTimelinePerformance:
    """timeline() with no entity filter does a full table scan."""

    @pytest.mark.parametrize("n_triples", [200, 1_000, 5_000])
    def test_timeline_latency(self, n_triples, tmp_path):
        from mempalace.knowledge_graph import KnowledgeGraph

        gen = PalaceDataGenerator(seed=42)
        entities, triples = gen.generate_kg_triples(
            n_entities=min(n_triples // 2, 200), n_triples=n_triples
        )

        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))
        for name, etype in entities:
            kg.add_entity(name, etype)
        for subject, predicate, obj, valid_from, valid_to in triples:
            kg.add_triple(subject, predicate, obj, valid_from=valid_from, valid_to=valid_to)

        # Measure timeline (no filter = full scan with LIMIT 100)
        latencies = []
        for _ in range(10):
            start = time.perf_counter()
            kg.timeline()
            elapsed_ms = (time.perf_counter() - start) * 1000
            latencies.append(elapsed_ms)

        avg_ms = sum(latencies) / len(latencies)
        record_metric("kg_timeline", f"avg_ms_at_{n_triples}", round(avg_ms, 2))


@pytest.mark.benchmark
class TestTemporalQueryAccuracy:
    """Verify temporal filtering correctness at scale."""

    def test_as_of_filtering(self, tmp_path):
        """Insert triples with known temporal ranges, verify as_of queries."""
        from mempalace.knowledge_graph import KnowledgeGraph

        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))

        kg.add_entity("Alice", "person")
        kg.add_entity("ProjectA", "project")
        kg.add_entity("ProjectB", "project")

        # Alice worked on ProjectA from 2024-01 to 2024-06
        kg.add_triple(
            "Alice", "works_on", "ProjectA", valid_from="2024-01-01", valid_to="2024-06-30"
        )
        # Alice worked on ProjectB from 2024-07 onwards
        kg.add_triple("Alice", "works_on", "ProjectB", valid_from="2024-07-01")

        # Add noise triples
        gen = PalaceDataGenerator(seed=42)
        entities, triples = gen.generate_kg_triples(n_entities=50, n_triples=500)
        for name, etype in entities:
            kg.add_entity(name, etype)
        for subject, predicate, obj, valid_from, valid_to in triples:
            kg.add_triple(subject, predicate, obj, valid_from=valid_from, valid_to=valid_to)

        # Query Alice as of March 2024 — should find ProjectA
        result_march = kg.query_entity("Alice", as_of="2024-03-15")
        # Query Alice as of September 2024 — should find ProjectB
        result_sept = kg.query_entity("Alice", as_of="2024-09-15")

        record_metric(
            "kg_temporal",
            "march_query_results",
            len(result_march) if isinstance(result_march, list) else 0,
        )
        record_metric(
            "kg_temporal",
            "sept_query_results",
            len(result_sept) if isinstance(result_sept, list) else 0,
        )


@pytest.mark.benchmark
class TestSQLiteConcurrentAccess:
    """Test concurrent read/write behavior with SQLite (finding #8)."""

    def test_concurrent_writers(self, tmp_path):
        """N threads writing triples simultaneously — count lock failures."""
        from mempalace.knowledge_graph import KnowledgeGraph

        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))

        # Pre-create entities
        for i in range(100):
            kg.add_entity(f"Entity_{i}", "concept")

        n_threads = 4
        triples_per_thread = 50
        lock_failures = []
        successes = []

        def writer(thread_id):
            fails = 0
            ok = 0
            for i in range(triples_per_thread):
                try:
                    kg.add_triple(
                        f"Entity_{thread_id * 10}",
                        "relates_to",
                        f"Entity_{(thread_id * 10 + i) % 100}",
                        valid_from="2025-01-01",
                    )
                    ok += 1
                except Exception:
                    fails += 1
            lock_failures.append(fails)
            successes.append(ok)

        threads = [threading.Thread(target=writer, args=(t,)) for t in range(n_threads)]
        start = time.perf_counter()
        for t in threads:
            t.start()
        for t in threads:
            t.join(timeout=30)
        elapsed = time.perf_counter() - start

        total_failures = sum(lock_failures)
        total_successes = sum(successes)

        record_metric("kg_concurrent", "total_failures", total_failures)
        record_metric("kg_concurrent", "total_successes", total_successes)
        record_metric("kg_concurrent", "elapsed_sec", round(elapsed, 2))
        record_metric("kg_concurrent", "threads", n_threads)
        record_metric("kg_concurrent", "triples_per_thread", triples_per_thread)

    def test_concurrent_read_write(self, tmp_path):
        """Readers and writers running simultaneously."""
        from mempalace.knowledge_graph import KnowledgeGraph

        kg = KnowledgeGraph(db_path=str(tmp_path / "kg.sqlite3"))

        # Seed some data
        for i in range(50):
            kg.add_entity(f"E_{i}", "concept")
        for i in range(200):
            kg.add_triple(f"E_{i % 50}", "links", f"E_{(i + 1) % 50}", valid_from="2025-01-01")

        read_errors = []
        write_errors = []

        def reader():
            fails = 0
            for i in range(50):
                try:
                    kg.query_entity(f"E_{i % 50}")
                except Exception:
                    fails += 1
            read_errors.append(fails)

        def writer():
            fails = 0
            for i in range(50):
                try:
                    kg.add_triple(
                        f"E_{i % 50}", "new_rel", f"E_{(i + 7) % 50}", valid_from="2025-06-01"
                    )
                except Exception:
                    fails += 1
            write_errors.append(fails)

        threads = [
            threading.Thread(target=reader),
            threading.Thread(target=reader),
            threading.Thread(target=writer),
            threading.Thread(target=writer),
        ]
        for t in threads:
            t.start()
        for t in threads:
            t.join(timeout=30)

        record_metric("kg_concurrent_rw", "read_errors", sum(read_errors))
        record_metric("kg_concurrent_rw", "write_errors", sum(write_errors))

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_ingest_bench.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"""
Memory stack (layers.py) benchmarks.

Tests MemoryStack.wake_up(), Layer1.generate(), and Layer2/L3
at scale. Layer1 has the same unbounded col.get() as tool_status.
"""

import time

import pytest

from tests.benchmarks.data_generator import PalaceDataGenerator
from tests.benchmarks.report import record_metric


def _get_rss_mb():
    try:
        import psutil

        return psutil.Process().memory_info().rss / (1024 * 1024)
    except ImportError:
        import resource
        import platform

        usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        if platform.system() == "Darwin":
            return usage / (1024 * 1024)
        return usage / 1024


@pytest.mark.benchmark
class TestWakeUpCost:
    """Measure wake_up() time (L0 + L1) at different palace sizes."""

    SIZES = [500, 1_000, 2_500, 5_000]

    @pytest.mark.parametrize("n_drawers", SIZES)
    def test_wakeup_latency(self, n_drawers, tmp_path, bench_scale):
        """L0+L1 generation time grows with palace size because L1 fetches all."""
        gen = PalaceDataGenerator(seed=42, scale=bench_scale)
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=n_drawers, include_needles=False)

        # Create identity file
        identity_path = str(tmp_path / "identity.txt")
        with open(identity_path, "w") as f:
            f.write("I am a test AI. Traits: precise, fast.\n")

        from mempalace.layers import MemoryStack

        stack = MemoryStack(palace_path=palace_path, identity_path=identity_path)

        latencies = []
        for _ in range(5):
            start = time.perf_counter()
            text = stack.wake_up()
            elapsed_ms = (time.perf_counter() - start) * 1000
            latencies.append(elapsed_ms)
            assert "L0" in text or "L1" in text or "IDENTITY" in text or "ESSENTIAL" in text

        avg_ms = sum(latencies) / len(latencies)
        record_metric("layers_wakeup", f"avg_ms_at_{n_drawers}", round(avg_ms, 1))


@pytest.mark.benchmark
class TestLayer1UnboundedFetch:
    """Layer1.generate() fetches ALL drawers — same pattern as tool_status."""

    SIZES = [500, 1_000, 2_500, 5_000]

    @pytest.mark.parametrize("n_drawers", SIZES)
    def test_layer1_rss_growth(self, n_drawers, tmp_path):
        """Track RSS from Layer1 fetching all drawers at different sizes."""
        gen = PalaceDataGenerator(seed=42, scale="small")
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=n_drawers, include_needles=False)

        from mempalace.layers import Layer1

        layer = Layer1(palace_path=palace_path)

        rss_before = _get_rss_mb()
        start = time.perf_counter()
        text = layer.generate()
        elapsed_ms = (time.perf_counter() - start) * 1000
        rss_after = _get_rss_mb()

        rss_delta = rss_after - rss_before
        assert "L1" in text

        record_metric("layer1", f"latency_ms_at_{n_drawers}", round(elapsed_ms, 1))
        record_metric("layer1", f"rss_delta_mb_at_{n_drawers}", round(rss_delta, 2))

    def test_layer1_wing_filtered(self, tmp_path):
        """Wing-filtered Layer1 should fetch fewer drawers."""
        gen = PalaceDataGenerator(seed=42, scale="small")
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=2_000, include_needles=False)

        from mempalace.layers import Layer1

        wing = gen.wings[0]

        # Unfiltered
        layer_all = Layer1(palace_path=palace_path)
        start = time.perf_counter()
        layer_all.generate()
        unfiltered_ms = (time.perf_counter() - start) * 1000

        # Wing-filtered
        layer_wing = Layer1(palace_path=palace_path, wing=wing)
        start = time.perf_counter()
        layer_wing.generate()
        filtered_ms = (time.perf_counter() - start) * 1000

        record_metric("layer1_filter", "unfiltered_ms", round(unfiltered_ms, 1))
        record_metric("layer1_filter", "filtered_ms", round(filtered_ms, 1))
        if unfiltered_ms > 0:
            record_metric(
                "layer1_filter", "speedup_pct", round((1 - filtered_ms / unfiltered_ms) * 100, 1)
            )


@pytest.mark.benchmark
class TestWakeUpTokenBudget:
    """Verify L0+L1 stays within token budget even at large palace sizes."""

    SIZES = [500, 1_000, 2_500, 5_000]

    @pytest.mark.parametrize("n_drawers", SIZES)
    def test_token_budget(self, n_drawers, tmp_path):
        """L1 has MAX_CHARS=3200 cap. Verify it holds at scale."""
        gen = PalaceDataGenerator(seed=42, scale="small")
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=n_drawers, include_needles=False)

        identity_path = str(tmp_path / "identity.txt")
        with open(identity_path, "w") as f:
            f.write("I am a benchmark AI.\n")

        from mempalace.layers import MemoryStack

        stack = MemoryStack(palace_path=palace_path, identity_path=identity_path)
        text = stack.wake_up()
        token_estimate = len(text) // 4

        # Budget is ~600-900 tokens. Allow up to 1200 for safety margin.
        record_metric("wakeup_budget", f"tokens_at_{n_drawers}", token_estimate)
        record_metric("wakeup_budget", f"chars_at_{n_drawers}", len(text))

        assert (
            token_estimate < 1200
        ), f"Wake-up exceeded budget: ~{token_estimate} tokens at {n_drawers} drawers"


@pytest.mark.benchmark
class TestLayer2Retrieval:
    """Layer2 on-demand retrieval with filters."""

    def test_layer2_latency(self, tmp_path, bench_scale):
        """L2 retrieval with wing filter at scale."""
        gen = PalaceDataGenerator(seed=42, scale=bench_scale)
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=2_000, include_needles=False)

        from mempalace.layers import Layer2

        layer = Layer2(palace_path=palace_path)
        wing = gen.wings[0]

        latencies = []
        for _ in range(10):
            start = time.perf_counter()
            layer.retrieve(wing=wing, n_results=10)
            elapsed_ms = (time.perf_counter() - start) * 1000
            latencies.append(elapsed_ms)

        avg_ms = sum(latencies) / len(latencies)
        record_metric("layer2", "avg_retrieval_ms", round(avg_ms, 1))


@pytest.mark.benchmark
class TestLayer3Search:
    """Layer3 semantic search through the MemoryStack interface."""

    def test_layer3_latency(self, tmp_path, bench_scale):
        """L3 search latency through MemoryStack."""
        gen = PalaceDataGenerator(seed=42, scale=bench_scale)
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=2_000, include_needles=False)

        identity_path = str(tmp_path / "identity.txt")
        with open(identity_path, "w") as f:
            f.write("I am a benchmark AI.\n")

        from mempalace.layers import MemoryStack

        stack = MemoryStack(palace_path=palace_path, identity_path=identity_path)

        queries = ["authentication", "database", "deployment", "testing", "monitoring"]
        latencies = []
        for q in queries:
            start = time.perf_counter()
            stack.search(q, n_results=5)
            elapsed_ms = (time.perf_counter() - start) * 1000
            latencies.append(elapsed_ms)

        avg_ms = sum(latencies) / len(latencies)
        record_metric("layer3", "avg_search_ms", round(avg_ms, 1))

 succeeded in 0ms:
"""
Ingestion throughput benchmarks.

Measures mining performance at scale:
  - Files/sec and drawers/sec through the full mine() pipeline
  - Peak RSS during mining
  - Chunking throughput isolated from ChromaDB
  - Re-ingest skip overhead (finding #11: file_already_mined check)
"""

import time

import chromadb
import pytest

from tests.benchmarks.data_generator import PalaceDataGenerator
from tests.benchmarks.report import record_metric


def _get_rss_mb():
    try:
        import psutil

        return psutil.Process().memory_info().rss / (1024 * 1024)
    except ImportError:
        import resource
        import platform

        usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        if platform.system() == "Darwin":
            return usage / (1024 * 1024)
        return usage / 1024


@pytest.mark.benchmark
class TestMineThroughput:
    """Measure the full mine() pipeline throughput."""

    @pytest.mark.parametrize("n_files", [20, 50, 100])
    def test_mine_files_per_second(self, n_files, tmp_path, bench_scale):
        """End-to-end mining throughput: generate files, mine, count drawers."""
        gen = PalaceDataGenerator(seed=42, scale=bench_scale)
        project_path, wing, rooms, files_written = gen.generate_project_tree(
            tmp_path / "project", n_files=n_files
        )
        palace_path = str(tmp_path / "palace")

        from mempalace.miner import mine

        start = time.perf_counter()
        mine(project_path, palace_path)
        elapsed = time.perf_counter() - start

        client = chromadb.PersistentClient(path=palace_path)
        col = client.get_collection("mempalace_drawers")
        drawer_count = col.count()

        files_per_sec = files_written / max(elapsed, 0.001)
        drawers_per_sec = drawer_count / max(elapsed, 0.001)

        record_metric("ingest", f"files_per_sec_at_{n_files}", round(files_per_sec, 1))
        record_metric("ingest", f"drawers_per_sec_at_{n_files}", round(drawers_per_sec, 1))
        record_metric("ingest", f"elapsed_sec_at_{n_files}", round(elapsed, 2))
        record_metric("ingest", f"drawers_created_at_{n_files}", drawer_count)

    def test_mine_peak_rss(self, tmp_path, bench_scale):
        """Track peak RSS during a mining run."""
        import threading

        gen = PalaceDataGenerator(seed=42, scale=bench_scale)
        project_path, wing, rooms, files_written = gen.generate_project_tree(
            tmp_path / "project", n_files=100
        )
        palace_path = str(tmp_path / "palace")

        from mempalace.miner import mine

        rss_samples = []
        stop_sampling = threading.Event()

        def sample_rss():
            while not stop_sampling.is_set():
                rss_samples.append(_get_rss_mb())
                stop_sampling.wait(0.1)

        sampler = threading.Thread(target=sample_rss, daemon=True)
        sampler.start()

        rss_before = _get_rss_mb()
        mine(project_path, palace_path)
        stop_sampling.set()
        sampler.join(timeout=1)

        peak_rss = max(rss_samples) if rss_samples else _get_rss_mb()
        rss_delta = peak_rss - rss_before

        record_metric("ingest", "peak_rss_mb", round(peak_rss, 1))
        record_metric("ingest", "rss_delta_mb", round(rss_delta, 1))


@pytest.mark.benchmark
class TestChunkThroughput:
    """Isolate chunking performance from ChromaDB insertion."""

    @pytest.mark.parametrize("content_size_kb", [1, 10, 100])
    def test_chunk_text_throughput(self, content_size_kb):
        """Measure chunk_text speed for different content sizes."""
        from mempalace.miner import chunk_text

        gen = PalaceDataGenerator(seed=42)
        # Generate content of target size
        content = gen._random_text(content_size_kb * 500, content_size_kb * 1200)
        # Pad to approximate target KB
        while len(content) < content_size_kb * 1024:
            content += "\n" + gen._random_text(200, 500)

        n_iterations = 50
        start = time.perf_counter()
        total_chunks = 0
        for _ in range(n_iterations):
            chunks = chunk_text(content, "bench_file.py")
            total_chunks += len(chunks)
        elapsed = time.perf_counter() - start

        chunks_per_sec = total_chunks / max(elapsed, 0.001)
        kb_per_sec = (len(content) * n_iterations / 1024) / max(elapsed, 0.001)

        record_metric(
            "chunking", f"chunks_per_sec_at_{content_size_kb}kb", round(chunks_per_sec, 1)
        )
        record_metric("chunking", f"kb_per_sec_at_{content_size_kb}kb", round(kb_per_sec, 1))


@pytest.mark.benchmark
class TestReingestSkipOverhead:
    """Finding #11: file_already_mined() check overhead at scale."""

    def test_skip_check_cost(self, tmp_path):
        """Mine files, then re-mine — measure cost of skip checks."""
        gen = PalaceDataGenerator(seed=42, scale="small")
        project_path, wing, rooms, files_written = gen.generate_project_tree(
            tmp_path / "project", n_files=50
        )
        palace_path = str(tmp_path / "palace")

        from mempalace.miner import mine

        # First mine
        mine(project_path, palace_path)
        client = chromadb.PersistentClient(path=palace_path)
        col = client.get_collection("mempalace_drawers")
        initial_count = col.count()

        # Re-mine (all files should be skipped)
        start = time.perf_counter()
        mine(project_path, palace_path)
        skip_elapsed = time.perf_counter() - start

        # Verify no new drawers added
        final_count = col.count()
        assert final_count == initial_count, "Re-mine should not add new drawers"

        record_metric("reingest", "skip_check_elapsed_sec", round(skip_elapsed, 2))
        record_metric("reingest", "files_checked", files_written)
        record_metric(
            "reingest",
            "skip_check_per_file_ms",
            round(skip_elapsed * 1000 / max(files_written, 1), 1),
        )

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"""
Palace boost validation — does wing/room filtering actually help?

Quantifies the retrieval improvement from the palace spatial metaphor.
Uses planted needles to measure recall with and without filtering
at different scales.
"""

import time

import pytest

from tests.benchmarks.data_generator import PalaceDataGenerator
from tests.benchmarks.report import record_metric


@pytest.mark.benchmark
class TestFilteredVsUnfilteredRecall:
    """Quantify palace boost: recall improvement from wing/room filtering."""

    SIZES = [1_000, 2_500, 5_000]

    @pytest.mark.parametrize("n_drawers", SIZES)
    def test_palace_boost_recall(self, n_drawers, tmp_path, bench_scale):
        """Compare recall@5 with/without wing filter at increasing scale."""
        gen = PalaceDataGenerator(seed=42, scale=bench_scale)
        palace_path = str(tmp_path / "palace")
        _, _, needle_info = gen.populate_palace_directly(
            palace_path, n_drawers=n_drawers, include_needles=True
        )

        from mempalace.searcher import search_memories

        n_queries = min(10, len(needle_info))
        unfiltered_hits = 0
        wing_filtered_hits = 0
        room_filtered_hits = 0

        for needle in needle_info[:n_queries]:
            # Unfiltered search
            result = search_memories(needle["query"], palace_path=palace_path, n_results=5)
            texts = [h["text"] for h in result.get("results", [])]
            if any("NEEDLE_" in t for t in texts[:5]):
                unfiltered_hits += 1

            # Wing-filtered search
            result = search_memories(
                needle["query"], palace_path=palace_path, wing=needle["wing"], n_results=5
            )
            texts = [h["text"] for h in result.get("results", [])]
            if any("NEEDLE_" in t for t in texts[:5]):
                wing_filtered_hits += 1

            # Wing+room filtered search
            result = search_memories(
                needle["query"],
                palace_path=palace_path,
                wing=needle["wing"],
                room=needle["room"],
                n_results=5,
            )
            texts = [h["text"] for h in result.get("results", [])]
            if any("NEEDLE_" in t for t in texts[:5]):
                room_filtered_hits += 1

        recall_none = unfiltered_hits / max(n_queries, 1)
        recall_wing = wing_filtered_hits / max(n_queries, 1)
        recall_room = room_filtered_hits / max(n_queries, 1)

        boost_wing = recall_wing - recall_none
        boost_room = recall_room - recall_none

        record_metric("palace_boost", f"recall_unfiltered_at_{n_drawers}", round(recall_none, 3))
        record_metric("palace_boost", f"recall_wing_filtered_at_{n_drawers}", round(recall_wing, 3))
        record_metric("palace_boost", f"recall_room_filtered_at_{n_drawers}", round(recall_room, 3))
        record_metric("palace_boost", f"wing_boost_at_{n_drawers}", round(boost_wing, 3))
        record_metric("palace_boost", f"room_boost_at_{n_drawers}", round(boost_room, 3))


@pytest.mark.benchmark
class TestFilterLatencyBenefit:
    """Does filtering reduce query latency by narrowing the search space?"""

    def test_filter_speedup(self, tmp_path, bench_scale):
        """Compare latency: no filter vs wing vs wing+room."""
        gen = PalaceDataGenerator(seed=42, scale=bench_scale)
        palace_path = str(tmp_path / "palace")
        gen.populate_palace_directly(palace_path, n_drawers=5_000, include_needles=False)

        from mempalace.searcher import search_memories

        wing = gen.wings[0]
        room = gen.rooms_by_wing[wing][0]
        query = "authentication middleware optimization"
        n_runs = 10

        # No filter
        latencies_none = []
        for _ in range(n_runs):
            start = time.perf_counter()
            search_memories(query, palace_path=palace_path, n_results=5)
            latencies_none.append((time.perf_counter() - start) * 1000)

        # Wing filter
        latencies_wing = []
        for _ in range(n_runs):
            start = time.perf_counter()
            search_memories(query, palace_path=palace_path, wing=wing, n_results=5)
            latencies_wing.append((time.perf_counter() - start) * 1000)

        # Wing + room filter
        latencies_room = []
        for _ in range(n_runs):
            start = time.perf_counter()
            search_memories(query, palace_path=palace_path, wing=wing, room=room, n_results=5)
            latencies_room.append((time.perf_counter() - start) * 1000)

        avg_none = sum(latencies_none) / len(latencies_none)
        avg_wing = sum(latencies_wing) / len(latencies_wing)
        avg_room = sum(latencies_room) / len(latencies_room)

        record_metric("filter_latency", "avg_unfiltered_ms", round(avg_none, 1))
        record_metric("filter_latency", "avg_wing_filtered_ms", round(avg_wing, 1))
        record_metric("filter_latency", "avg_room_filtered_ms", round(avg_room, 1))
        if avg_none > 0:
            record_metric(
                "filter_latency", "wing_speedup_pct", round((1 - avg_wing / avg_none) * 100, 1)
            )
            record_metric(
                "filter_latency", "room_speedup_pct", round((1 - avg_room / avg_none) * 100, 1)
            )


@pytest.mark.benchmark
class TestBoostAtIncreasingScale:
    """Does the palace boost increase as the palace grows?"""

    def test_boost_scaling(self, tmp_path, bench_scale):
        """Measure wing-filtered recall improvement at multiple sizes."""
        sizes = [500, 1_000, 2_500]
        boosts = []

        for size in sizes:
            gen = PalaceDataGenerator(seed=42, scale=bench_scale)
            palace_path = str(tmp_path / f"palace_{size}")
            _, _, needle_info = gen.populate_palace_directly(
                palace_path, n_drawers=size, include_needles=True
            )

            from mempalace.searcher import search_memories

            n_queries = min(8, len(needle_info))
            unfiltered_hits = 0
            filtered_hits = 0

            for needle in needle_info[:n_queries]:
                result = search_memories(needle["query"], palace_path=palace_path, n_results=5)
                if any("NEEDLE_" in h["text"] for h in result.get("results", [])[:5]):
                    unfiltered_hits += 1

                result = search_memories(
                    needle["query"], palace_path=palace_path, wing=needle["wing"], n_results=5
                )
                if any("NEEDLE_" in h["text"] for h in result.get("results", [])[:5]):
                    filtered_hits += 1

            recall_none = unfiltered_hits / max(n_queries, 1)
            recall_filtered = filtered_hits / max(n_queries, 1)
            boost = recall_filtered - recall_none
            boosts.append({"size": size, "boost": boost})

        record_metric("boost_scaling", "boosts_by_size", boosts)
        # Check if boost increases with scale (the hypothesis)
        if len(boosts) >= 2:
            trend_positive = boosts[-1]["boost"] >= boosts[0]["boost"]
            record_metric("boost_scaling", "trend_positive", trend_positive)

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Eval Reporting
// ────────────────────────────────────────────────────────────────

import path from 'path';

import { checkDatabaseUpdated } from '../core/index.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import {
  init as initHybridSearch,
  hybridSearchEnhanced,
  bm25Search,
  ftsSearch,
} from '../lib/search/hybrid-search.js';
import { generateQueryEmbedding } from '../lib/providers/embeddings.js';
import { MemoryError, ErrorCodes } from '../lib/errors.js';
import { createMCPSuccessResponse } from '../lib/response/envelope.js';
import {
  ALL_CHANNELS,
  isAblationEnabled,
  runAblation,
  assertGroundTruthAlignment,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  type AblationChannel,
  type AblationSearchFn,
} from '../lib/eval/ablation-framework.js';
import {
  generateDashboardReport,
  formatReportJSON,
  formatReportText,
} from '../lib/eval/reporting-dashboard.js';
import {
  analyzeKValueSensitivityBatch,
  formatKValueReport,
} from '../lib/eval/k-value-analysis.js';
import {
  createUnifiedGraphSearchFn,
  computeDegreeScores,
  DEGREE_CHANNEL_WEIGHT,
} from '../lib/search/graph-search-fn.js';
import { isDegreeBoostEnabled } from '../lib/search/search-flags.js';
import type { RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';

import type { MCPResponse } from './types.js';

// Feature catalog: Reporting dashboard (eval_reporting_dashboard)
// Feature catalog: Ablation studies (eval_run_ablation)


interface RunAblationArgs {
  mode?: 'ablation' | 'k_sensitivity';
  channels?: AblationChannel[];
  groundTruthQueryIds?: number[];
  recallK?: number;
  queries?: string[];
  storeResults?: boolean;
  includeFormattedReport?: boolean;
}

interface KSensitivityArgs {
  queries?: string[];
  limit?: number;
}

interface ReportingDashboardArgs {
  sprintFilter?: string[];
  channelFilter?: string[];
  metricFilter?: string[];
  limit?: number;
  format?: 'text' | 'json';
}

function normalizeChannels(input?: string[]): AblationChannel[] {
  if (!Array.isArray(input) || input.length === 0) return ALL_CHANNELS;
  const valid = input.filter((value): value is AblationChannel =>
    (ALL_CHANNELS as string[]).includes(value)
  );
  return valid.length > 0 ? valid : ALL_CHANNELS;
}

function initializeEvalHybridSearch(database: ReturnType<typeof vectorIndex.getDb>) {
  const graphSearchFn = createUnifiedGraphSearchFn(database);
  initHybridSearch(database, vectorIndex.vectorSearch, graphSearchFn);
  return graphSearchFn;
}

function resolveEvalDbPath(): string | null {
  const configuredPath = process.env.SPECKIT_EVAL_DB_PATH?.trim();
  if (!configuredPath) {
    return null;
  }

  return path.resolve(process.cwd(), configuredPath);
}

async function withAblationDb<T>(
  run: (database: NonNullable<ReturnType<typeof vectorIndex.getDb>>, dbPath: string) => Promise<T>,
): Promise<T> {
  const overrideDbPath = resolveEvalDbPath();
  const activeDb = vectorIndex.getDb();

  if (!overrideDbPath) {
    if (!activeDb) {
      throw new MemoryError(
        ErrorCodes.DATABASE_ERROR,
        'Database not initialized. Server may still be starting up.',
        {}
      );
    }
    return run(activeDb, vectorIndex.getDbPath());
  }

  const currentDbPath = path.resolve(vectorIndex.getDbPath());
  if (currentDbPath === overrideDbPath) {
    if (!activeDb) {
      throw new MemoryError(
        ErrorCodes.DATABASE_ERROR,
        'Database not initialized. Server may still be starting up.',
        {}
      );
    }
    return run(activeDb, currentDbPath);
  }

  const previousMemoryDbPath = process.env.MEMORY_DB_PATH;
  vectorIndex.closeDb();
  process.env.MEMORY_DB_PATH = overrideDbPath;

  try {
    const overrideDb = vectorIndex.initializeDb();
    return await run(overrideDb, vectorIndex.getDbPath());
  } finally {
    vectorIndex.closeDb();
    if (previousMemoryDbPath === undefined) {
      delete process.env.MEMORY_DB_PATH;
    } else {
      process.env.MEMORY_DB_PATH = previousMemoryDbPath;
    }
    vectorIndex.initializeDb();
  }
}

function buildRawFusionLists(
  database: NonNullable<ReturnType<typeof vectorIndex.getDb>>,
  graphSearchFn: ReturnType<typeof createUnifiedGraphSearchFn>,
  query: string,
  embedding: Float32Array | number[] | null,
  limit: number,
): RankedList[] {
  const lists: RankedList[] = [];

  if (embedding) {
    const vectorResults = vectorIndex.vectorSearch(embedding, {
      limit,
      minSimilarity: 0,
      includeConstitutional: false,
      includeArchived: false,
    });
    if (vectorResults.length > 0) {
      lists.push({
        source: 'vector',
        results: vectorResults.map((row) => ({ id: row.id as number | string })),
      });
    }
  }

  const ftsResults = ftsSearch(query, { limit });
  if (ftsResults.length > 0) {
    lists.push({
      source: 'fts',
      results: ftsResults.map((row) => ({ id: row.id })),
    });
  }

  const bm25Results = bm25Search(query, { limit });
  if (bm25Results.length > 0) {
    lists.push({
      source: 'bm25',
      results: bm25Results.map((row) => ({ id: row.id })),
    });
  }

  const graphResults = graphSearchFn(query, { limit });
  if (graphResults.length > 0) {
    lists.push({
      source: 'graph',
      results: graphResults.map((row) => ({ id: row.id as number | string })),
    });
  }

  if (isDegreeBoostEnabled()) {
    const allResultIds = new Set<number>();
    for (const list of lists) {
      for (const row of list.results) {
        if (typeof row.id === 'number') {
          allResultIds.add(row.id);
        }
      }
    }

    if (allResultIds.size > 0) {
      const degreeScores = computeDegreeScores(database, Array.from(allResultIds));
      const degreeItems = Array.from(degreeScores.entries())
        .map(([id, score]) => ({ id: Number(id), score }))
        .filter((item) => Number.isFinite(item.id) && item.score > 0)
        .sort((left, right) => right.score - left.score);

      if (degreeItems.length > 0) {
        lists.push({
          source: 'degree',
          results: degreeItems.map((item) => ({ id: item.id })),
          weight: DEGREE_CHANNEL_WEIGHT,
        });
      }
    }
  }

  return lists;
}

/** Handle eval_run_ablation tool — runs ablation analysis or K-sensitivity sweep.
 * @param args - Ablation arguments (channels, queries, recallK, mode)
 * @returns MCP response with ablation report or K-sensitivity results
 */
async function handleEvalRunAblation(args: RunAblationArgs): Promise<MCPResponse> {
  if (args.mode === 'k_sensitivity') {
    return handleEvalKSensitivity({
      queries: args.queries,
      limit: args.recallK,
    });
  }

  await checkDatabaseUpdated();

  if (!isAblationEnabled()) {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      'Ablation is disabled. Set SPECKIT_ABLATION=true to run ablation studies.',
      { flag: 'SPECKIT_ABLATION' }
    );
  }

  const channels = normalizeChannels(args.channels as string[] | undefined);
  const recallK = typeof args.recallK === 'number' && Number.isFinite(args.recallK)
    ? Math.max(1, Math.floor(args.recallK))
    : 20;

  const report = await withAblationDb(async (db, dbPath) => {
    try {
      assertGroundTruthAlignment(db, {
        dbPath,
        context: 'eval_run_ablation',
      });
    } catch (error: unknown) {
      throw new MemoryError(
        ErrorCodes.INVALID_PARAMETER,
        error instanceof Error ? error.message : String(error),
        { dbPath },

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Feedback Event Ledger (REQ-D4-001)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Implicit feedback event ledger
// Records implicit feedback signals from search/save interactions
// into a shadow-only SQLite table. No ranking side effects.
//
// Feature flag: SPECKIT_IMPLICIT_FEEDBACK_LOG (default ON, graduated)
// Signal confidence tiers:
//   strong  — citation, follow_on_tool_use (result was used)
//   medium  — query_reformulated (implicit relevance dissatisfaction)
//   weak    — search_shown, same_topic_requery (passive exposure)
import type Database from 'better-sqlite3';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
----------------------------------------------------------------*/

/**
 * The five implicit feedback event types.
 *
 * Confidence signal hierarchy (strongest → weakest):
 *   result_cited | follow_on_tool_use > query_reformulated > same_topic_requery > search_shown
 */
export type FeedbackEventType =
  | 'search_shown'
  | 'result_cited'
  | 'query_reformulated'
  | 'same_topic_requery'
  | 'follow_on_tool_use';

/** Confidence tier for the implicit signal. */
export type FeedbackConfidence = 'strong' | 'medium' | 'weak';

/** Input shape for recording a feedback event. */
export interface FeedbackEvent {
  type: FeedbackEventType;
  /** The memory ID this event relates to (string form of DB integer id). */
  memoryId: string;
  /** Opaque query identifier (e.g. eval query ID or hash of query text). */
  queryId: string;
  confidence: FeedbackConfidence;
  timestamp: number;
  sessionId?: string | null;
}

/** Row shape stored in feedback_events table. */
export interface FeedbackEventRow {
  id: number;
  type: FeedbackEventType;
  memory_id: string;
  query_id: string;
  confidence: FeedbackConfidence;
  timestamp: number;
  session_id: string | null;
}

export interface GetFeedbackEventsOptions {
  type?: FeedbackEventType;
  memoryId?: string;
  queryId?: string;
  confidence?: FeedbackConfidence;
  sessionId?: string;
  since?: number;   // Unix ms
  until?: number;   // Unix ms
  limit?: number;
  offset?: number;
}

/* ───────────────────────────────────────────────────────────────
   2. CONFIDENCE TIER MAPPING
----------------------------------------------------------------*/

/**
 * Infer confidence tier from event type.
 * Callers may override by providing explicit confidence in the event.
 */
const EVENT_TYPE_CONFIDENCE: Record<FeedbackEventType, FeedbackConfidence> = {
  result_cited:         'strong',
  follow_on_tool_use:   'strong',
  query_reformulated:   'medium',
  same_topic_requery:   'weak',
  search_shown:         'weak',
};

/**
 * Resolve confidence for a feedback event.
 * Uses the caller-supplied value when present, otherwise infers from type.
 */
export function resolveConfidence(
  type: FeedbackEventType,
  explicit?: FeedbackConfidence
): FeedbackConfidence {
  if (explicit) return explicit;
  return EVENT_TYPE_CONFIDENCE[type] ?? 'weak';
}

/* ───────────────────────────────────────────────────────────────
   3. FEATURE FLAG
----------------------------------------------------------------*/

/**
 * Check whether the implicit feedback log is enabled.
 * Default: TRUE (graduated). Set SPECKIT_IMPLICIT_FEEDBACK_LOG=false to disable.
 */
export function isImplicitFeedbackLogEnabled(): boolean {
  const val = process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG?.toLowerCase().trim();
  return val !== 'false' && val !== '0';
}

/* ───────────────────────────────────────────────────────────────
   4. SCHEMA SQL
----------------------------------------------------------------*/

const FEEDBACK_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS feedback_events (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    type       TEXT NOT NULL CHECK(type IN (
                 'search_shown','result_cited','query_reformulated',
                 'same_topic_requery','follow_on_tool_use'
               )),
    memory_id  TEXT NOT NULL,
    query_id   TEXT NOT NULL,
    confidence TEXT NOT NULL CHECK(confidence IN ('strong','medium','weak')),
    timestamp  INTEGER NOT NULL,
    session_id TEXT
  )
`;

const FEEDBACK_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_feedback_type      ON feedback_events(type);
  CREATE INDEX IF NOT EXISTS idx_feedback_memory_id ON feedback_events(memory_id);
  CREATE INDEX IF NOT EXISTS idx_feedback_query_id  ON feedback_events(query_id);
  CREATE INDEX IF NOT EXISTS idx_feedback_confidence ON feedback_events(confidence);
  CREATE INDEX IF NOT EXISTS idx_feedback_timestamp  ON feedback_events(timestamp);
  CREATE INDEX IF NOT EXISTS idx_feedback_session    ON feedback_events(session_id)
`;

/* ───────────────────────────────────────────────────────────────
   5. INITIALIZATION
----------------------------------------------------------------*/

/** Track which DB handles have had the schema initialized. */
const initializedDbs = new WeakSet<object>();

/**
 * Ensure the feedback_events table and indices exist in the given database.
 * Idempotent — safe to call multiple times.
 */
export function initFeedbackLedger(db: Database.Database): void {
  if (initializedDbs.has(db)) return;
  db.exec(FEEDBACK_SCHEMA_SQL);
  db.exec(FEEDBACK_INDEX_SQL);
  initializedDbs.add(db);
}

/* ───────────────────────────────────────────────────────────────
   6. LOG EVENT
----------------------------------------------------------------*/

/**
 * Record a single implicit feedback event.
 *
 * Shadow-only: this function has NO effect on search ranking.
 * Returns the inserted row ID, or null when the feature flag is OFF
 * or the DB write fails.
 *
 * Errors are caught and logged as warnings — feedback recording must
 * never interrupt search or save operations.
 */
export function logFeedbackEvent(
  db: Database.Database,
  event: FeedbackEvent
): number | null {
  if (!isImplicitFeedbackLogEnabled()) return null;

  try {
    initFeedbackLedger(db);

    const confidence = resolveConfidence(event.type, event.confidence);

    const result = db.prepare(`
      INSERT INTO feedback_events (type, memory_id, query_id, confidence, timestamp, session_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      event.type,
      event.memoryId,
      event.queryId,
      confidence,
      event.timestamp,
      event.sessionId ?? null
    );

    return (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[feedback-ledger] logFeedbackEvent error:', message);
    return null;
  }
}

/**
 * Record a batch of feedback events (e.g., all search_shown results from
 * a single search response).
 *
 * Returns the count of successfully inserted rows.
 */
export function logFeedbackEvents(
  db: Database.Database,
  events: FeedbackEvent[]
): number {
  if (!isImplicitFeedbackLogEnabled()) return 0;
  if (events.length === 0) return 0;

  let inserted = 0;
  for (const event of events) {
    const id = logFeedbackEvent(db, event);
    if (id !== null) inserted++;
  }
  return inserted;
}

/* ───────────────────────────────────────────────────────────────
   7. QUERY EVENTS
----------------------------------------------------------------*/

/**
 * Query feedback events with optional filters.
 * Returns matching rows ordered by timestamp ascending.
 */
export function getFeedbackEvents(
  db: Database.Database,
  opts: GetFeedbackEventsOptions = {}
): FeedbackEventRow[] {
  try {
    initFeedbackLedger(db);

    const conditions: string[] = [];
    const params: Array<string | number> = [];

    if (opts.type) {
      conditions.push('type = ?');
      params.push(opts.type);
    }
    if (opts.memoryId !== undefined) {
      conditions.push('memory_id = ?');
      params.push(opts.memoryId);
    }
    if (opts.queryId !== undefined) {
      conditions.push('query_id = ?');
      params.push(opts.queryId);
    }
    if (opts.confidence) {
      conditions.push('confidence = ?');
      params.push(opts.confidence);
    }
    if (opts.sessionId !== undefined) {
      conditions.push('session_id = ?');
      params.push(opts.sessionId);
    }

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Session Health Handler
// ───────────────────────────────────────────────────────────────
// T018: MCP tool handler for session_health — reports session
// readiness, code graph freshness, and priming status.

import {
  isSessionPrimed,
  getSessionTimestamps,
  getLastActiveSessionId,
  getCodeGraphStatusSnapshot,
} from '../hooks/memory-surface.js';

import { computeQualityScore, getLastToolCallAt } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { QualityScore } from '../lib/session/context-metrics.js';
import {
  createSharedPayloadEnvelope,
  trustStateFromStructuralStatus,
  type SharedPayloadEnvelope,
} from '../lib/context/shared-payload.js';
import {
  buildCodeGraphOpsContract,
  type CodeGraphOpsContract,
} from '../lib/code-graph/ops-hardening.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

type SessionStatus = 'ok' | 'warning' | 'stale';

interface SessionHealthDetails {
  sessionAgeMs: number;
  lastToolCallAgoMs: number;
  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
  specFolder: string | null;
  primingStatus: 'primed' | 'not_primed';
}

interface SessionHealthResult {
  status: SessionStatus;
  details: SessionHealthDetails;
  qualityScore: QualityScore;
  structuralContext?: StructuralBootstrapContract;
  payloadContract?: SharedPayloadEnvelope;
  graphOps?: CodeGraphOpsContract;
  hints: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const SIXTY_MINUTES_MS = 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_health tool call */
export async function handleSessionHealth(): Promise<MCPResponse> {
  const now = Date.now();
  const { serverStartedAt } = getSessionTimestamps();
  // F047: Use context-metrics as single source of truth for lastToolCallAt
  // to eliminate dual-state drift with memory-surface's separate timestamp.
  const metricsLastToolCall = getLastToolCallAt();
  const lastToolCallAt = metricsLastToolCall ?? serverStartedAt;
  const primingSessionId = getLastActiveSessionId();
  const primed = primingSessionId ? isSessionPrimed(primingSessionId) : false;

  // Determine graph freshness
  let graphFreshness: SessionHealthDetails['graphFreshness'] = 'error';
  // Wire specFolder from context-metrics (fixes P1: dead field)
  let specFolder: string | null = null;
  try {
    const { getSessionMetrics } = await import('../lib/session/context-metrics.js');
    specFolder = getSessionMetrics().currentSpecFolder;
  } catch { /* metrics module may not be loaded */ }
  try {
    const snapshot = getCodeGraphStatusSnapshot();
    if (snapshot.status === 'ok' && snapshot.data) {
      const totalFiles = snapshot.data.totalFiles ?? 0;
      const lastScan = snapshot.data.lastScanAt;
      if (totalFiles === 0) {
        graphFreshness = 'empty';
      } else if (!lastScan || (now - new Date(lastScan).getTime() > TWENTY_FOUR_HOURS_MS)) {
        graphFreshness = 'stale';
      } else {
        graphFreshness = 'fresh';
      }
    }
  } catch {
    graphFreshness = 'error';
  }

  // Phase 027: Structural bootstrap contract for health surface
  const structuralContext = buildStructuralBootstrapContract('session_health');

  const sessionAgeMs = now - serverStartedAt;
  const lastToolCallAgoMs = now - lastToolCallAt;

  // Status determination logic
  let status: SessionStatus;
  if (!primed || lastToolCallAgoMs > SIXTY_MINUTES_MS) {
    status = 'stale';
  } else if (graphFreshness === 'stale' || graphFreshness === 'empty' || lastToolCallAgoMs > FIFTEEN_MINUTES_MS) {
    status = 'warning';
  } else {
    status = 'ok';
  }

  // Build human-readable hints
  const hints: string[] = [];
  if (!primed) {
    hints.push('Session has not been primed yet. Make any tool call to trigger auto-priming.');
  }
  if (structuralContext.status === 'stale') {
    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
  } else if (structuralContext.status === 'missing') {
    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
  }
  if (lastToolCallAgoMs > SIXTY_MINUTES_MS) {
    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
  } else if (lastToolCallAgoMs > FIFTEEN_MINUTES_MS) {
    hints.push('No tool calls in >15 min. Session context may be drifting.');
  }

  // Phase 023: Compute quality score from context metrics
  const qualityScore = computeQualityScore();

  const payloadContract = createSharedPayloadEnvelope({
    kind: 'health',
    sections: [
      {
        key: 'session-health',
        title: 'Session Health',
        content: `status=${status}; priming=${primed ? 'primed' : 'not_primed'}; graph=${graphFreshness}; specFolder=${specFolder ?? 'none'}`,
        source: 'session',
      },
      {
        key: 'quality-score',
        title: 'Quality Score',
        content: `level=${qualityScore.level}; score=${qualityScore.score}`,
        source: 'operational',
      },
      {
        key: 'structural-context',
        title: 'Structural Context',
        content: structuralContext.summary,
        source: 'code-graph',
      },
    ],
    summary: `Session health is ${status}; graph freshness is ${graphFreshness}; structural status is ${structuralContext.status}`,
    provenance: {
      producer: 'session_health',
      sourceSurface: 'session_health',
      trustState: trustStateFromStructuralStatus(structuralContext.status),
      generatedAt: new Date().toISOString(),
      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
      sourceRefs: ['memory-surface', 'context-metrics', 'session-snapshot'],
    },
  });
  const graphOps = buildCodeGraphOpsContract({
    graphFreshness,
    sourceSurface: 'session_health',
  });

  const result: SessionHealthResult = {
    status,
    details: {
      sessionAgeMs,
      lastToolCallAgoMs,
      graphFreshness,
      specFolder,
      primingStatus: primed ? 'primed' : 'not_primed',
    },
    qualityScore,
    structuralContext,
    payloadContract,
    graphOps,
    hints,
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
  };
}

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Health
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { checkDatabaseUpdated } from '../core/index.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import * as embeddings from '../lib/providers/embeddings.js';
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import { toErrorMessage } from '../utils/index.js';

import { isEmbeddingModelReady } from '../core/index.js';
import { summarizeAliasConflicts } from './memory-index.js';
import * as causalEdges from '../lib/storage/causal-edges.js';
import { getEmbeddingRetryStats } from '../lib/providers/retry-manager.js';

import type { MCPResponse, EmbeddingProfile } from './types.js';
import type { HealthArgs, PartialProviderMetadata } from './memory-crud-types.js';

// Feature catalog: Health diagnostics (memory_health)
// Feature catalog: Validation feedback (memory_validate)
// Feature catalog: Memory health autoRepair metadata


/** Strip absolute paths, stack traces, and truncate for safe user-facing hints. */
function sanitizeErrorForHint(msg: string): string {
  return msg
    .replace(/(^|[\s(])\/(?:[^/\n]+\/)*[^:\n)"'\]]+/g, (_match, prefix: string) => `${prefix}[path]`)
    .replace(/(^|[\s(])[A-Za-z]:\\(?:[^\\\n]+\\)*[^:\n)"'\]]+/g, (_match, prefix: string) => `${prefix}[path]`)
    .replace(/^[ \t]*at .+$/gm, '')            // strip stack trace lines
    .replace(/\n{2,}/g, '\n')                   // collapse blank lines left by stripping
    .trim()
    .slice(0, 200);
}

/** Redact absolute paths: keep only project-relative portion or basename. */
function redactPath(absolutePath: string): string {
  const normalizedPath = toNormalizedPath(absolutePath);
  if (normalizedPath.startsWith('.opencode/')) return normalizedPath;
  if (normalizedPath.startsWith('specs/')) return normalizedPath;
  const opencodeIdx = normalizedPath.indexOf('/.opencode/');
  const specsIdx = normalizedPath.indexOf('/specs/');
  if (opencodeIdx !== -1) return normalizedPath.slice(opencodeIdx + 1);
  if (specsIdx !== -1) return normalizedPath.slice(specsIdx + 1);
  // Fallback: basename only
  const lastSlash = normalizedPath.lastIndexOf('/');
  return lastSlash !== -1 ? normalizedPath.slice(lastSlash + 1) : normalizedPath;
}

/* ───────────────────────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────────────────────────── */

// Read version from package.json at module load time using ESM-relative paths.
// WHY try-catch: if package.json is missing or malformed, the server should still start
const SERVER_VERSION: string = (() => {
  const packageCandidates = [
    resolve(import.meta.dirname, '../package.json'),
    resolve(import.meta.dirname, '../../package.json'),
  ];

  try {
    for (const candidate of packageCandidates) {
      if (!existsSync(candidate)) {
        continue;
      }
      const pkg = JSON.parse(readFileSync(candidate, 'utf-8'));
      if (pkg?.version) {
        return pkg.version;
      }
    }
    return 'unknown';
  } catch (_error: unknown) {
    return 'unknown';
  }
})();

const DIVERGENT_ALIAS_REPORT_MODE = 'divergent_aliases';
const DEFAULT_DIVERGENT_ALIAS_LIMIT = 20;
const MAX_DIVERGENT_ALIAS_LIMIT = 200;
const DOT_OPENCODE_SPECS_SEGMENT = '/.opencode/specs/';
const SPECS_SEGMENT = '/specs/';

interface AliasConflictDbRow {
  file_path: string;
  content_hash: string | null;
  spec_folder?: string | null;
}

interface DivergentAliasVariant {
  filePath: string;
  contentHash: string | null;
}

interface DivergentAliasGroup {
  normalizedPath: string;
  specFolders: string[];
  distinctHashCount: number;
  variants: DivergentAliasVariant[];
}

interface DivergentAliasBucket {
  hasDotOpencodeVariant: boolean;
  hasSpecsVariant: boolean;
  variants: Map<string, string | null>;
  hashes: Set<string>;
  specFolders: Set<string>;
}

function toNormalizedPath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function toSpecAliasKey(filePath: string): string {
  const normalizedPath = toNormalizedPath(filePath);
  return normalizedPath
    .replace(/\/\.opencode\/specs\//g, '/specs/')
    .replace(/^\.opencode\/specs\//, 'specs/');
}

function isSpecsAliasPath(filePath: string): boolean {
  const normalizedPath = toNormalizedPath(filePath);
  return (
    normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) ||
    normalizedPath.includes(SPECS_SEGMENT) ||
    normalizedPath.startsWith('.opencode/specs/') ||
    normalizedPath.startsWith('specs/')
  );
}

function isDotOpencodeVariantPath(normalizedPath: string): boolean {
  return normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) || normalizedPath.startsWith('.opencode/specs/');
}

function isSpecsVariantPath(normalizedPath: string): boolean {
  if (isDotOpencodeVariantPath(normalizedPath)) {
    return false;
  }
  return normalizedPath.includes(SPECS_SEGMENT) || normalizedPath.startsWith('specs/');
}

function getDivergentAliasGroups(rows: AliasConflictDbRow[], limit: number): DivergentAliasGroup[] {
  if (!rows.length) {
    return [];
  }

  const buckets = new Map<string, DivergentAliasBucket>();

  for (const row of rows) {
    if (!row || typeof row.file_path !== 'string' || row.file_path.length === 0) {
      continue;
    }

    const normalizedPath = toNormalizedPath(row.file_path);
    const aliasKey = toSpecAliasKey(normalizedPath);
    let bucket = buckets.get(aliasKey);
    if (!bucket) {
      bucket = {
        hasDotOpencodeVariant: false,
        hasSpecsVariant: false,
        variants: new Map<string, string | null>(),
        hashes: new Set<string>(),
        specFolders: new Set<string>(),
      };
      buckets.set(aliasKey, bucket);
    }

    if (isDotOpencodeVariantPath(normalizedPath)) {
      bucket.hasDotOpencodeVariant = true;
    }
    if (isSpecsVariantPath(normalizedPath)) {
      bucket.hasSpecsVariant = true;
    }

    bucket.variants.set(normalizedPath, row.content_hash ?? null);
    if (typeof row.content_hash === 'string' && row.content_hash.trim().length > 0) {
      bucket.hashes.add(row.content_hash.trim());
    }
    if (typeof row.spec_folder === 'string' && row.spec_folder.length > 0) {
      bucket.specFolders.add(row.spec_folder);
    }
  }

  const groups: DivergentAliasGroup[] = [];
  for (const [normalizedPath, bucket] of buckets.entries()) {
    if (!bucket.hasDotOpencodeVariant || !bucket.hasSpecsVariant) {
      continue;
    }
    if (bucket.variants.size < 2 || bucket.hashes.size < 2) {
      continue;
    }

    const variants: DivergentAliasVariant[] = Array.from(bucket.variants.entries())
      .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
      .map(([filePath, contentHash]) => ({ filePath: redactPath(filePath), contentHash }));

    groups.push({
      normalizedPath: redactPath(normalizedPath),
      // Fix F21 — redact specFolders to prevent path disclosure.
      specFolders: Array.from(bucket.specFolders).sort().map(sf => redactPath(sf)),
      distinctHashCount: bucket.hashes.size,
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

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Ablation Framework (R13-S3)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Ablation studies (eval_run_ablation)
//
// Controlled ablation studies for search channel contribution analysis.
// Selectively disables one search channel at a time, measures Recall@20
// Delta against a full-pipeline baseline, and attributes per-channel
// Contribution to retrieval quality.
//
// Features:
// - Channel toggle mechanism (vector, bm25, fts5, graph, trigger)
// - Ablation runner with ground truth evaluation
// - Delta calculation (baseline vs ablated Recall@20)
// - Paired sign-test for statistical significance
// - Results storage in eval_metric_snapshots table
// - Human-readable ablation report formatting
//
// CRITICAL: Ablation studies are experimental and gated behind
// SPECKIT_ABLATION=true. Every public function is wrapped in try-catch
// And is a no-op when the flag is not set.
import { initEvalDb, getEvalDb } from './eval-db.js';
import {
  computeRecall,
  computeMRR,
  computeNDCG,
  computePrecision,
  computeMAP,
  computeHitRate,
} from './eval-metrics.js';
import type { EvalResult, GroundTruthEntry } from './eval-metrics.js';
import {
  GROUND_TRUTH_QUERIES,
  GROUND_TRUTH_RELEVANCES,
} from './ground-truth-data.js';
import type { GroundTruthQuery } from './ground-truth-data.js';
import type Database from 'better-sqlite3';

/* --- 1. FEATURE FLAG --- */

/**
 * Returns true only when SPECKIT_ABLATION=true (case-insensitive).
 * Anything else (undefined, "false", "1", ...) disables ablation studies.
 */
export function isAblationEnabled(): boolean {
  return process.env.SPECKIT_ABLATION?.toLowerCase() === 'true';
}

/* --- 2. TYPES --- */

/** Known search channels that can be ablated. */
export type AblationChannel = 'vector' | 'bm25' | 'fts5' | 'graph' | 'trigger';

/** All channels available for ablation. */
export const ALL_CHANNELS: AblationChannel[] = [
  'vector',
  'bm25',
  'fts5',
  'graph',
  'trigger',
];

/** Configuration for an ablation study. */
export interface AblationConfig {
  /** Channels to ablate (one at a time). Defaults to ALL_CHANNELS. */
  channels: AblationChannel[];
  /** Subset of ground truth query IDs to use. Omit for all queries. */
  groundTruthQueryIds?: number[];
  /** Recall cutoff K. Defaults to 20. */
  recallK?: number;
  /** Optional active memory DB used to enforce ground-truth parent-memory alignment. */
  alignmentDb?: Database.Database;
  /** Optional DB path used in alignment error messaging. */
  alignmentDbPath?: string;
  /** Optional context label used in alignment error messaging. */
  alignmentContext?: string;
}

interface QuerySelection {
  queries: GroundTruthQuery[];
  requestedQueryIds?: number[];
  resolvedQueryIds?: number[];
  missingQueryIds?: number[];
}

/** Summary of whether the static ground truth matches the active DB universe. */
export interface GroundTruthAlignmentSummary {
  totalQueries: number;
  totalRelevances: number;
  uniqueMemoryIds: number;
  parentRelevanceCount: number;
  chunkRelevanceCount: number;
  missingRelevanceCount: number;
  parentMemoryCount: number;
  chunkMemoryCount: number;
  missingMemoryCount: number;
  chunkExamples: Array<{ memoryId: number; parentMemoryId: number }>;
  missingExamples: number[];
}

/**
 * A search function that the ablation runner calls for each query.
 * The runner passes channel disable flags; the function must respect them.
 *
 * @param query - The search query text.
 * @param disabledChannels - Set of channel names to disable for this run.
 * @returns Array of EvalResult (memoryId, score, rank).
 */
export type AblationSearchFn = (
  query: string,
  disabledChannels: Set<AblationChannel>,
) => EvalResult[] | Promise<EvalResult[]>;

/** Result of ablating a single channel. */
export interface AblationResult {
  /** The channel that was disabled. */
  channel: AblationChannel;
  /** Recall@K with all channels enabled. */
  baselineRecall20: number;
  /** Recall@K with this channel disabled. */
  ablatedRecall20: number;
  /** ablatedRecall20 - baselineRecall20. Negative means channel contributes positively. */
  delta: number;
  /** Two-sided sign-test p-value for statistical significance (null if insufficient data). */
  pValue: number | null;
  /** Number of queries where removing this channel decreased recall (channel was helpful). */
  queriesChannelHelped: number;
  /** Number of queries where removing this channel increased recall (channel was harmful). */
  queriesChannelHurt: number;
  /** Number of queries unaffected by removing this channel. */
  queriesUnchanged: number;
  /** Total queries evaluated. */
  queryCount: number;
  /** Full multi-metric breakdown (9 metrics). */
  metrics?: AblationMetrics;
}

/** A single metric entry comparing baseline vs ablated. */
export interface AblationMetricEntry {
  baseline: number;
  ablated: number;
  delta: number;
}

/** All 9 metrics tracked per ablation channel. */
export interface AblationMetrics {
  'MRR@5': AblationMetricEntry;
  'precision@5': AblationMetricEntry;
  'recall@5': AblationMetricEntry;
  'NDCG@5': AblationMetricEntry;
  'MAP': AblationMetricEntry;
  'hit_rate': AblationMetricEntry;
  'latency_p50': AblationMetricEntry;
  'latency_p95': AblationMetricEntry;
  'token_usage': AblationMetricEntry;
}

/** Failure captured for a single channel ablation run. */
export interface AblationChannelFailure {
  /** Channel that failed during ablation. */
  channel: AblationChannel;
  /** Error message returned by the failing search call. */
  error: string;
  /** Query ID being processed when failure occurred (if known). */
  queryId?: number;
  /** Query text being processed when failure occurred (if known). */
  query?: string;
}

/** Full ablation study report. */
export interface AblationReport {
  /** ISO timestamp of the study. */
  timestamp: string;
  /** Unique run identifier. */
  runId: string;
  /** Configuration used. */
  config: AblationConfig;
  /** Per-channel ablation results. */
  results: AblationResult[];
  /** Channel ablations that failed while the overall run continued. */
  channelFailures?: AblationChannelFailure[];
  /** Baseline Recall@K across all queries (all channels enabled). */
  overallBaselineRecall: number;
  /** Total queries selected for the baseline computation. */
  queryCount?: number;
  /** Total queries actually evaluated (queries with ground truth). */
  evaluatedQueryCount?: number;
  /** Query IDs explicitly requested for this run (if any). */
  requestedQueryIds?: number[];
  /** Query IDs resolved from the static dataset. */
  resolvedQueryIds?: number[];
  /** Requested query IDs that were missing from the static dataset. */
  missingQueryIds?: number[];
  /** Total wall-clock duration in milliseconds. */
  durationMs: number;
}

/* --- 3. INTERNAL HELPERS --- */

/**
 * Get the eval DB instance. Prefers the already-initialized singleton
 * (via getEvalDb) to avoid overwriting test DB paths. Falls back to
 * initEvalDb() if no singleton exists yet.
 */
function getDb() {
  try {
    return getEvalDb();
  } catch {
    return initEvalDb();
  }
}

interface MemoryIndexLookupRow {
  id: number;
  parent_id: number | null;
}

/**
 * Inspect whether every ground-truth relevance ID resolves to a parent memory
 * in the active DB. Chunk-backed or missing IDs make Recall@K comparisons
 * against parent-memory outputs untrustworthy.
 */
export function inspectGroundTruthAlignment(
  database: Database.Database,
): GroundTruthAlignmentSummary {
  const uniqueMemoryIds = Array.from(
    new Set(GROUND_TRUTH_RELEVANCES.map((row) => row.memoryId)),
  ).sort((left, right) => left - right);

  if (uniqueMemoryIds.length === 0) {
    return {
      totalQueries: GROUND_TRUTH_QUERIES.length,
      totalRelevances: 0,
      uniqueMemoryIds: 0,
      parentRelevanceCount: 0,
      chunkRelevanceCount: 0,
      missingRelevanceCount: 0,
      parentMemoryCount: 0,
      chunkMemoryCount: 0,
      missingMemoryCount: 0,
      chunkExamples: [],
      missingExamples: [],
    };
  }

  const placeholders = uniqueMemoryIds.map(() => '?').join(', ');
  const rows = database.prepare(
    `SELECT id, parent_id FROM memory_index WHERE id IN (${placeholders})`,
  ).all(...uniqueMemoryIds) as MemoryIndexLookupRow[];

  const rowById = new Map<number, MemoryIndexLookupRow>();
  for (const row of rows) {
    rowById.set(row.id, row);
  }

  let parentRelevanceCount = 0;
  let chunkRelevanceCount = 0;
  let missingRelevanceCount = 0;
  const parentMemoryIds = new Set<number>();
  const chunkMemoryIds = new Set<number>();

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Retrieval Telemetry (C136-12)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Scoring observability
// Captures latency, mode selection, fallback, and quality-proxy
// Dimensions for governance review and Wave 2 gate decisions.
// Feature flag: SPECKIT_EXTENDED_TELEMETRY (default false / disabled)
import {
  sanitizeRetrievalTracePayload,
} from './trace-schema.js';
import type {
  TelemetryTracePayload,
} from './trace-schema.js';
// F6.06 fix: Import canonical quality proxy from eval module
import { computeQualityProxy as computeQualityProxyCanonical } from '../eval/eval-quality-proxy.js';
import {
  getMemoryRoadmapDefaults,
} from '../config/capability-flags.js';
import type { SessionTransitionTrace } from '../search/session-transition.js';
import type {
  MemoryRoadmapCapabilityFlags,
  MemoryRoadmapPhase,
} from '../config/capability-flags.js';

/* ───────────────────────────────────────────────────────────────
   1. FEATURE FLAG
──────────────────────────────────────────────────────────────── */

/**
 * Extended telemetry controlled by env var (default: disabled for performance).
 * Set SPECKIT_EXTENDED_TELEMETRY=true to enable detailed retrieval metrics collection.
 */
function isExtendedTelemetryEnabled(): boolean {
  return process.env.SPECKIT_EXTENDED_TELEMETRY === 'true';
}

/* ───────────────────────────────────────────────────────────────
   1b. QUALITY PROXY CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Maximum latency value (ms) for quality proxy normalization.
 *  Latencies at or above this ceiling map to a 0.0 quality score component. */
const QUALITY_PROXY_LATENCY_CEILING_MS = 5000;

/** Result count at which the count-saturation component reaches 1.0. */
const QUALITY_PROXY_COUNT_SATURATION_THRESHOLD = 10;

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

/** Latency breakdown by retrieval stage */
interface LatencyMetrics {
  totalLatencyMs: number;
  candidateLatencyMs: number;
  fusionLatencyMs: number;
  rerankLatencyMs: number;
  boostLatencyMs: number;
}

/** Mode selection telemetry */
interface ModeMetrics {
  selectedMode: string | null;
  modeOverrideApplied: boolean;
  pressureLevel: string | null;
  tokenUsageRatio?: number;
}

/** Fallback telemetry */
interface FallbackMetrics {
  fallbackTriggered: boolean;
  fallbackReason?: string;
  degradedModeActive: boolean;
}

/** Quality proxy telemetry */
interface QualityMetrics {
  resultCount: number;
  avgRelevanceScore: number;
  topResultScore: number;
  boostImpactDelta: number;
  extractionCountInSession: number;
  qualityProxyScore: number; // 0-1
}

/** Architecture rollout telemetry for phased memory-roadmap capabilities. */
interface ArchitectureMetrics {
  phase: MemoryRoadmapPhase;
  capabilities: MemoryRoadmapCapabilityFlags;
  scopeDimensionsTracked: number;
}

interface GraphHealthMetrics {
  killSwitchActive: boolean;
  causalBoosted: number;
  coActivationBoosted: number;
  communityInjected: number;
  graphSignalsBoosted: number;
  totalGraphInjected: number;
}

interface AdaptiveMetrics {
  mode: 'shadow' | 'promoted' | 'disabled';
  promotedCount: number;
  demotedCount: number;
  bounded: boolean;
  maxDeltaApplied: number;
}

interface GraphWalkDiagnostics {
  rolloutState: 'off' | 'trace_only' | 'bounded_runtime';
  rowsWithGraphContribution: number;
  rowsWithAppliedBonus: number;
  capAppliedCount: number;
  maxRaw: number;
  maxNormalized: number;
  maxAppliedBonus: number;
}

interface LifecycleForecastDiagnostics {
  state: string | null;
  progress: number;
  filesProcessed: number;
  filesTotal: number;
  etaSeconds: number | null;
  etaConfidence: number | null;
  failureRisk: number | null;
  riskSignals: string[];
  caveat?: string;
}

interface GraphHealthDashboardSummary {
  totalPayloads: number;
  payloadsWithGraphHealth: number;
  killSwitchActiveCount: number;
  averageGraphInjected: number;
  maxGraphInjected: number;
  causalBoostedTotal: number;
  coActivationBoostedTotal: number;
  communityInjectedTotal: number;
  graphSignalsBoostedTotal: number;
}

interface TraceSamplingOptions {
  limit?: number;
  minGraphInjected?: number;
  killSwitchOnly?: boolean;
}

interface SampledTracePayload {
  timestamp: string | null;
  graphHealth: GraphHealthMetrics;
  tracePayload: TelemetryTracePayload;
}

/** Full retrieval telemetry record */
interface RetrievalTelemetry {
  enabled: boolean;
  timestamp: string;
  latency: LatencyMetrics;
  mode: ModeMetrics;
  fallback: FallbackMetrics;
  quality: QualityMetrics;
  architecture: ArchitectureMetrics;
  graphHealth: GraphHealthMetrics;
  adaptive: AdaptiveMetrics;
  tracePayload?: TelemetryTracePayload;
  transitionDiagnostics?: SessionTransitionTrace;
  graphWalkDiagnostics?: GraphWalkDiagnostics;
  lifecycleForecastDiagnostics?: LifecycleForecastDiagnostics;
}

type LatencyStage = keyof Omit<LatencyMetrics, 'totalLatencyMs'>;

/* ───────────────────────────────────────────────────────────────
   3. FACTORY
──────────────────────────────────────────────────────────────── */

function createTelemetry(): RetrievalTelemetry {
  const roadmapDefaults = getMemoryRoadmapDefaults();

  return {
    enabled: isExtendedTelemetryEnabled(),
    timestamp: new Date().toISOString(),
    latency: {
      totalLatencyMs: 0,
      candidateLatencyMs: 0,
      fusionLatencyMs: 0,
      rerankLatencyMs: 0,
      boostLatencyMs: 0,
    },
    mode: {
      selectedMode: null,
      modeOverrideApplied: false,
      pressureLevel: null,
    },
    fallback: {
      fallbackTriggered: false,
      degradedModeActive: false,
    },
    quality: {
      resultCount: 0,
      avgRelevanceScore: 0,
      topResultScore: 0,
      boostImpactDelta: 0,
      extractionCountInSession: 0,
      qualityProxyScore: 0,
    },
    architecture: {
      phase: roadmapDefaults.phase,
      capabilities: { ...roadmapDefaults.capabilities },
      scopeDimensionsTracked: roadmapDefaults.scopeDimensionsTracked,
    },
    graphHealth: {
      killSwitchActive: false,
      causalBoosted: 0,
      coActivationBoosted: 0,
      communityInjected: 0,
      graphSignalsBoosted: 0,
      totalGraphInjected: 0,
    },
    adaptive: {
      mode: 'disabled',
      promotedCount: 0,
      demotedCount: 0,
      bounded: true,
      maxDeltaApplied: 0,
    },
  };
}

/* ───────────────────────────────────────────────────────────────
   4. RECORDING FUNCTIONS
──────────────────────────────────────────────────────────────── */

function recordLatency(t: RetrievalTelemetry, stage: LatencyStage, ms: number): void {
  if (!t.enabled) return;
  const clamped = Math.max(0, Number.isFinite(ms) ? ms : 0);
  t.latency[stage] = clamped;
  // Recompute total from components
  t.latency.totalLatencyMs =
    t.latency.candidateLatencyMs +
    t.latency.fusionLatencyMs +
    t.latency.rerankLatencyMs +
    t.latency.boostLatencyMs;
}

function recordMode(
  t: RetrievalTelemetry,
  mode: string,
  override: boolean,
  pressure: string | null,
  tokenUsageRatio?: number,
): void {
  if (!t.enabled) return;
  t.mode.selectedMode = mode;
  t.mode.modeOverrideApplied = override;
  t.mode.pressureLevel = pressure;
  if (typeof tokenUsageRatio === 'number' && Number.isFinite(tokenUsageRatio)) {
    t.mode.tokenUsageRatio = Math.max(0, Math.min(1, tokenUsageRatio));

 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Validation Responses
// ───────────────────────────────────────────────────────────────
// Pure builder functions that construct rejection/dry-run results
// from validation outcomes. No side effects or DB access.

import type {
  MemorySufficiencyResult,
} from '@spec-kit/shared/parsing/memory-sufficiency';
import { MEMORY_SUFFICIENCY_REJECTION_CODE } from '@spec-kit/shared/parsing/memory-sufficiency';
import type {
  MemoryTemplateContractResult,
} from '@spec-kit/shared/parsing/memory-template-contract';
import type { QualityLoopResult } from '../../handlers/quality-loop.js';
import type { IndexResult, ParsedMemory } from './types.js';
import type { ParsedMemoryValidation } from '../../lib/parsing/memory-parser.js';

// Feature catalog: Dry-run preflight for memory_save
// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Validation feedback (memory_validate)

function applyInsufficiencyMetadata(
  parsed: ParsedMemory,
  sufficiencyResult: MemorySufficiencyResult,
): void {
  if (!sufficiencyResult.pass) {
    parsed.qualityScore = Math.min(parsed.qualityScore ?? 1, sufficiencyResult.score * 0.6);
    parsed.qualityFlags = Array.from(new Set([...(parsed.qualityFlags || []), 'has_insufficient_context']));
  }
}

function buildInsufficiencyRejectionResult(
  parsed: ParsedMemory,
  validation: ParsedMemoryValidation,
  sufficiencyResult: MemorySufficiencyResult,
): IndexResult {
  return {
    status: 'rejected',
    id: 0,
    specFolder: parsed.specFolder,
    title: parsed.title ?? '',
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    qualityScore: parsed.qualityScore,
    qualityFlags: parsed.qualityFlags,
    warnings: validation.warnings,
    rejectionCode: MEMORY_SUFFICIENCY_REJECTION_CODE,
    rejectionReason: `${MEMORY_SUFFICIENCY_REJECTION_CODE}: ${sufficiencyResult.reasons.join(' ')}`,
    message: 'Not enough context for a proper memory.',
    sufficiency: sufficiencyResult,
  };
}

function buildTemplateContractRejectionResult(
  parsed: ParsedMemory,
  validation: ParsedMemoryValidation,
  templateContract: MemoryTemplateContractResult,
): IndexResult {
  const violationSummary = templateContract.violations.map((violation) => violation.code).join(', ');
  return {
    status: 'rejected',
    id: 0,
    specFolder: parsed.specFolder,
    title: parsed.title ?? '',
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    qualityScore: parsed.qualityScore,
    qualityFlags: Array.from(new Set([...(parsed.qualityFlags || []), 'violates_template_contract'])),
    warnings: validation.warnings,
    rejectionReason: `Template contract validation failed: ${violationSummary}`,
    message: 'Memory file does not match the required template contract.',
  };
}

function buildDryRunSummary(
  sufficiencyResult: MemorySufficiencyResult,
  qualityLoopResult: QualityLoopResult,
  templateContract: MemoryTemplateContractResult,
): string {
  if (!qualityLoopResult.passed && qualityLoopResult.rejected) {
    return qualityLoopResult.rejectionReason ?? 'Quality loop rejected the save';
  }

  if (!templateContract.valid) {
    return 'Dry-run detected structural template-contract violations';
  }

  if (!sufficiencyResult.pass) {
    return 'Dry-run detected insufficient context for a durable memory';
  }

  return 'Dry-run validation passed';
}

export {
  applyInsufficiencyMetadata,
  buildInsufficiencyRejectionResult,
  buildTemplateContractRejectionResult,
  buildDryRunSummary,
};

exec
/bin/zsh -lc 'rg -n "Recall@|recall|queryCoverage|precision|MRR|dashboard|metric snapshots|eval_metric_snapshots|storeAblationResults|generateDashboardReport|search_shown|result_cited|follow_on_tool_use|same_topic_requery|query_reformulated" .opencode/skill/system-spec-kit/mcp_server/lib/eval .opencode/skill/system-spec-kit/mcp_server/lib/feedback .opencode/skill/system-spec-kit/mcp_server/handlers/save' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:43:  type: 'query_reformulated' | 'same_topic_requery' | null;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:121:      type: 'same_topic_requery',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:130:      type: 'query_reformulated',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:184:    const confidence = detection.type === 'query_reformulated' ? 'medium' : 'weak';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:202: * Log `result_cited` events for memories whose content was loaded.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:217:      type: 'result_cited',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:228: * Log `follow_on_tool_use` events for memories shown in a recent search.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:250:      type: 'follow_on_tool_use',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:10://   strong  — citation, follow_on_tool_use (result was used)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:11://   medium  — query_reformulated (implicit relevance dissatisfaction)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:12://   weak    — search_shown, same_topic_requery (passive exposure)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:23: *   result_cited | follow_on_tool_use > query_reformulated > same_topic_requery > search_shown
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:26:  | 'search_shown'
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:27:  | 'result_cited'
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:28:  | 'query_reformulated'
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:29:  | 'same_topic_requery'
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:30:  | 'follow_on_tool_use';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:79:  result_cited:         'strong',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:80:  follow_on_tool_use:   'strong',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:81:  query_reformulated:   'medium',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:82:  same_topic_requery:   'weak',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:83:  search_shown:         'weak',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:119:                 'search_shown','result_cited','query_reformulated',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:120:                 'same_topic_requery','follow_on_tool_use'
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:203: * Record a batch of feedback events (e.g., all search_shown results from
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:7:// Provides: Kendall tau, NDCG, MRR, rank comparison, and
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:37:  /** MRR delta: shadow MRR minus live MRR. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:190:   5. MRR
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:194: * Compute MRR (Mean Reciprocal Rank) for a single query.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:199:export function computeMRR(rankedItems: RankedItem[]): number {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:216: * Kendall tau correlation, NDCG delta, and MRR delta.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:276:  // MRR delta
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:277:  const liveMrr = computeMRR(liveJudged);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:278:  const shadowMrr = computeMRR(shadowJudged);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:90:  CREATE TABLE IF NOT EXISTS eval_metric_snapshots (
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:102:    ON eval_metric_snapshots (eval_run_id, metric_name, created_at);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:33:- Reporting dashboard and read-only shadow comparison analysis.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:46:| `eval-metrics.ts` | MRR, NDCG, recall, precision, F1, MAP, hit-rate, inversion-rate, and constitutional metrics |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:53:| `reporting-dashboard.ts` | Sprint/channel aggregation and formatted dashboard output |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:63:- `reporting-dashboard.ts` is the current reporting surface for sprint/channel aggregation.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:21:export { classifyDirection, computeKendallTau, computeNDCG, computeMRR, compareRanks } from './rank-metrics.js';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:61:  /** Mean MRR delta across holdout queries. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:6:// Can optionally persist snapshots into eval_metric_snapshots.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:150: * @param evalDb - Eval database that stores metric snapshots.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:151: * @returns Number of rows written to `eval_metric_snapshots`.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:155:    INSERT INTO eval_metric_snapshots (eval_run_id, metric_name, metric_value, channel, query_count, metadata)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:4:// the rollout: Full reporting dashboard for eval infrastructure.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:8:// Uses: eval-db.ts singleton, eval_metric_snapshots table,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:21:// Feature catalog: Reporting dashboard (eval_reporting_dashboard)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:31:/** Configuration for dashboard report generation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:99:/** Complete dashboard report. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:105:  /** Total metric snapshots included in this report after filters/limit. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:124:// away from a non-default/test eval DB when generating a dashboard.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:130:/** Row shape from eval_metric_snapshots. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:185: * Query all metric snapshots, optionally filtered.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:192:             FROM eval_metric_snapshots
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:567: * Generate the full dashboard report.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:569: * Queries the eval database for metric snapshots and channel results,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:576:export async function generateDashboardReport(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:643: * Format a dashboard report as human-readable text.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:656:  lines.push(`Total metric snapshots: ${report.totalSnapshots}`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:732: * Format a dashboard report as indented JSON string.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:7:// Selectively disables one search channel at a time, measures Recall@20
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:14:// - Delta calculation (baseline vs ablated Recall@20)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:16:// - Results storage in eval_metric_snapshots table
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:25:  computeMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:70:  recallK?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:118:  /** Recall@K with all channels enabled. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:120:  /** Recall@K with this channel disabled. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:126:  /** Number of queries where removing this channel decreased recall (channel was helpful). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:128:  /** Number of queries where removing this channel increased recall (channel was harmful). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:147:  'MRR@5': AblationMetricEntry;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:148:  'precision@5': AblationMetricEntry;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:149:  'recall@5': AblationMetricEntry;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:182:  /** Baseline Recall@K across all queries (all channels enabled). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:220: * in the active DB. Chunk-backed or missing IDs make Recall@K comparisons
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:445: * Compute mean Recall@K across a set of per-query recall values.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:447:function meanRecall(recalls: number[]): number {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:448:  if (recalls.length === 0) return 0;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:449:  const sum = recalls.reduce((a, b) => a + b, 0);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:450:  return sum / recalls.length;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:459:): { mrr: number; precision: number; recall: number; ndcg: number; map: number; hitRate: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:461:    mrr: computeMRR(results, gt, 5),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:462:    precision: computePrecision(results, gt, 5),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:463:    recall: computeRecall(results, gt, 5),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:515:    'MRR@5': entry(bMetrics.map(m => m.metrics.mrr), aMetrics.map(m => m.metrics.mrr)),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:516:    'precision@5': entry(bMetrics.map(m => m.metrics.precision), aMetrics.map(m => m.metrics.precision)),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:517:    'recall@5': entry(bMetrics.map(m => m.metrics.recall), aMetrics.map(m => m.metrics.recall)),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:543: * 3. Compute per-query Recall@K delta
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:562:  const recallK = config.recallK ?? 20;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:603:      const recall = computeRecall(results, gt, recallK);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:604:      baselineRecalls.set(q.id, recall);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:630:          const recall = computeRecall(results, gt, recallK);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:631:          ablatedRecalls.set(q.id, recall);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:724: * Store ablation results in the eval_metric_snapshots table.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:727: * - metric_name: 'ablation_recall@20_delta'
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:732: * Also stores the baseline recall as a separate row.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:739:export function storeAblationResults(report: AblationReport): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:750:      INSERT INTO eval_metric_snapshots
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:755:    const recallK = report.config.recallK ?? 20;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:763:      // Store baseline recall
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:766:        `ablation_baseline_recall@${recallK}`,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:787:          `ablation_recall@${recallK}_delta`,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:842:    console.warn('[ablation] storeAblationResults failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:863:  const recallK = report.config.recallK ?? 20;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:864:  lines.push(`- **Baseline Recall@${recallK}:** ${report.overallBaselineRecall.toFixed(4)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:908:  lines.push(`Ch. Helped = queries where channel was helpful (removing it decreased recall). * = significant at p<0.05.`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:926:    lines.push(`| Channel | MRR@5 | P@5 | R@5 | NDCG@5 | MAP | Hit Rate | Lat p50 | Lat p95 |`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:934:        `| ${m['MRR@5'].delta >= 0 ? '+' : ''}${m['MRR@5'].delta.toFixed(4)} ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:935:        `| ${m['precision@5'].delta >= 0 ? '+' : ''}${m['precision@5'].delta.toFixed(4)} ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:936:        `| ${m['recall@5'].delta >= 0 ? '+' : ''}${m['recall@5'].delta.toFixed(4)} ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:957:    lines.push(`${i + 1}. **${r.channel}** — contribution: ${contribution >= 0 ? '+' : ''}${contribution.toFixed(4)} Recall@${recallK}`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:17://   - The contingency decision matrix turns the measured MRR@5
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:23:  computeMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:44:  /** Top-K cutoff for NDCG and Recall metrics. MRR always uses k=5 for contingency compatibility. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:55:  /** Recall at configured K (default 20). Named recall20 for backwards compatibility. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:56:  recall20: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:66:  /** Per-query MRR@5 values for bootstrap CI computation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:67:  perQueryMRR?: number[];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:68:  /** Bootstrap 95% CI for MRR@5 (computed if perQueryMRR available). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:74:  /** The MRR@5 value used to derive the decision. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:75:  bm25MRR: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:84:  /** Hybrid MRR@5 used as reference (relative mode only). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:85:  hybridMRR?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:132: * Evaluate the BM25 MRR@5 value against the contingency decision matrix.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:135: *   MRR@5 >= 0.80 → PAUSE
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:140: *   MRR@5 0.50–0.79 → RATIONALIZE
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:145: *   MRR@5 < 0.50 → PROCEED
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:149: * @param bm25MRR - The measured MRR@5 value (must be in [0, 1]).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:152:export function evaluateContingency(bm25MRR: number): ContingencyDecision {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:153:  if (bm25MRR >= 0.80) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:155:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:167:  if (bm25MRR >= 0.50) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:169:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:176:        'positive delta in MRR@5 before adoption. Track per-channel contribution carefully.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:181:    bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:194:   Compares BM25 MRR@5 as a percentage of hybrid MRR@5.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:195:   Spec: "BM25 >= 80% of hybrid MRR@5" → PAUSE.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:199: * Evaluate BM25 performance relative to hybrid MRR@5 (spec-compliant).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:202: *   ratio = bm25MRR / hybridMRR
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:213: * @param bm25MRR   - BM25-only MRR@5 (must be in [0, 1]).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:214: * @param hybridMRR - Hybrid/multi-channel MRR@5 (must be in (0, 1]).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:218:  bm25MRR: number,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:219:  hybridMRR: number,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:221:  if (!Number.isFinite(bm25MRR) || !Number.isFinite(hybridMRR) || hybridMRR <= 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:223:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:224:      hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:230:        'Hybrid/BM25 MRR@5 is non-finite, zero, or negative — cannot compute meaningful ratio. ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:235:  const ratio = bm25MRR / hybridMRR;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:239:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:240:      hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:246:        `BM25 achieves ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:247:        `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:255:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:256:      hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:262:        `BM25 achieves ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:263:        `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:265:        'in MRR@5. Track per-channel contribution and justify retained complexity.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:270:    bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:271:    hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:277:      `BM25 achieves only ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:278:      `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:287:   Uses bootstrap resampling to compute 95% CI for MRR@5.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:292:  /** Point estimate (mean MRR@5 across all queries). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:312: * Compute bootstrap 95% confidence interval for MRR@5.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:318: * @param perQueryMRR - Array of per-query MRR@5 values (one per query).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:323:  perQueryMRR: number[],
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:329:  const cleanMRR = perQueryMRR.filter(v => Number.isFinite(v));
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:330:  const n = cleanMRR.length;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:345:  const pointEstimate = cleanMRR.reduce((s, v) => s + v, 0) / n;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:365:      sum += cleanMRR[Math.floor(Math.random() * n)];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:414: * Record BM25 baseline metrics to the eval DB (eval_metric_snapshots table).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:416: * Inserts one row per metric (mrr@5, ndcg@10, recall@20, hit_rate@1) plus
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:433:    INSERT INTO eval_metric_snapshots
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:446:    insertSnapshot.run(evalRunId, 'recall@20',    result.metrics.recall20,  channel, queryCount, null, createdAt);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:454:      result.contingencyDecision.bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:500:  // MRR always uses k=5 (contingency matrix is calibrated for MRR@5)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:504:  const recallK = k ?? 20;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:506:  const fetchLimit = Math.max(mrrK, ndcgK, recallK, 20);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:520:  let totalMRR    = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:525:  // Collect per-query MRR for bootstrap CI (REQ-S0-004)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:526:  const perQueryMRR: number[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:544:    const qMRR = computeMRR(evalResults, groundTruth, mrrK);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:545:    perQueryMRR.push(qMRR);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:547:    totalMRR     += qMRR;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:549:    totalRecall  += computeRecall(evalResults, groundTruth, recallK);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:557:    mrr5:     totalMRR    / safeCount,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:559:    recall20: totalRecall / safeCount,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:567:  const bootstrapCI = computeBootstrapCI(perQueryMRR);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:574:    perQueryMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:23:// understate MRR/NDCG/MAP if used directly.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:52:  recall: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:58:  precision: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:115:export function computeMRR(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:241: * Compute F1@K — harmonic mean of Precision@K and Recall@K.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:403: * Recall@K but each relevant item is weighted by its tier:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:604:    mrr: computeMRR(results, groundTruth),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:606:    recall: computeRecall(results, groundTruth),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:607:    precision: computePrecision(results, groundTruth),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1101:      "notes": "Manual query targeting a specific quantitative formula documented in the system — tests factual precision retrieval."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:98: * ranking and compute 1/rank. MRR@5 is the mean of those reciprocal ranks.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:140: * 4. Computes MRR@5 against the K=60 baseline
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:264: * - recommendation: which K to use based on MRR@5 vs the baseline
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:279:  // Recommendation: find K with highest MRR@5; if it equals baseline, recommend staying
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:293:      : `K=${bestK} yields the highest MRR@5 (${bestMrr.toFixed(4)}); consider switching from K=${analysis.baselineK}.`;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:336: * A judged query with explicit relevance labels for NDCG/MRR evaluation.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:344:  /** IDs considered relevant (binary relevance for MRR computation) */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:574: * Compute MRR@5 against judged relevant IDs (binary relevance).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:578: * @returns MRR@5 in [0, 1]
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:611: * @returns Aggregate NDCG@10 and MRR@5 metrics across the query set

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "handle_memory_validate|wasUseful|validation_count|confidence_score|memory_validate|promoted to critical|queryTerms|resultRank|totalResultsShown" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib | head -n 120' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Checkpoints
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   1. LIB MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

import * as checkpoints from '../lib/storage/checkpoints.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import * as bm25Index from '../lib/search/bm25-index.js';
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import * as confidenceTracker from '../lib/scoring/confidence-tracker.js';
import { executeAutoPromotion } from '../lib/search/auto-promotion.js';
import { recordSelection } from '../lib/search/learned-feedback.js';
import { recordUserSelection } from '../lib/eval/ground-truth-feedback.js';
import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback.js';
import { recordAdaptiveSignal } from '../lib/cognitive/adaptive-ranking.js';
import { checkDatabaseUpdated } from '../core/index.js';
import { requireDb, toErrorMessage } from '../utils/index.js';

// REQ-019: Standardized Response Structure
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';

// Shared handler types
import type { MCPResponse } from './types.js';

// Feature catalog: Checkpoint creation (checkpoint_create)
// Feature catalog: Checkpoint listing (checkpoint_list)
// Feature catalog: Checkpoint restore (checkpoint_restore)
// Feature catalog: Checkpoint deletion (checkpoint_delete)
// Feature catalog: Checkpoint delete confirmName safety


/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

interface CheckpointCreateArgs {
  name: string;
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  metadata?: Record<string, unknown>;
}

interface CheckpointListArgs {
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
}

interface CheckpointRestoreArgs {
  name: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  clearExisting?: boolean;
}

interface CheckpointDeleteArgs {
  name: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  confirmName: string;
}

interface CheckpointScopeArgs {
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
}

interface MemoryValidateArgs {
  id: number | string;
  wasUseful: boolean;
  queryId?: string;
  queryTerms?: string[];
  resultRank?: number;
  totalResultsShown?: number;
  searchMode?: string;
  intent?: string;
  sessionId?: string;
  notes?: string;
}

interface ValidationResult {
  confidence: number;
  validationCount: number;
  positiveValidationCount: number;
  promotionEligible: boolean;
}

function resolveValidationQueryText(
  database: ReturnType<typeof requireDb>,
  queryId?: string,
): string | null {
  if (typeof queryId !== 'string') {
    return null;
  }

  const normalizedQueryId = queryId.trim();
  if (normalizedQueryId.length === 0) {
    return null;
  }

  if (/\s/.test(normalizedQueryId)) {
    return normalizedQueryId;
  }

  const consumptionMatch = normalizedQueryId.match(/^(?:consumption:)?(\d+)$/);
  if (!consumptionMatch) {
    return null;
  }

  const consumptionLogTable = database.prepare(`
    SELECT 1
    FROM sqlite_master
    WHERE type = 'table'
      AND name = 'consumption_log'
    LIMIT 1
  `).get();
  if (!consumptionLogTable) {
    return null;
  }

  const row = database.prepare(`
    SELECT query_text
    FROM consumption_log
    WHERE id = ?
      AND query_text IS NOT NULL
      AND TRIM(query_text) != ''
    LIMIT 1
  `).get(Number.parseInt(consumptionMatch[1], 10)) as { query_text?: string } | undefined;

  return typeof row?.query_text === 'string' && row.query_text.trim().length > 0
    ? row.query_text
    : null;
}

function parseMemoryId(rawId: number | string): number {
  const numericId = typeof rawId === 'string'
    ? Number.parseInt(rawId.trim(), 10)
    : rawId;

  if (
    typeof numericId !== 'number' ||
    !Number.isSafeInteger(numericId) ||
    numericId <= 0 ||
    (typeof rawId === 'string' && !/^\d+$/.test(rawId.trim()))
  ) {
    throw new Error('id must be a positive integer');
  }

  return numericId;
}

function parseCheckpointMetadata(rawMetadata: unknown): Record<string, unknown> {
  if (!rawMetadata) {
    return {};
  }

  if (typeof rawMetadata === 'string') {
    try {
      const parsed = JSON.parse(rawMetadata);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? parsed as Record<string, unknown>
        : {};
    } catch (_error: unknown) {
      return {};
    }
  }

  return typeof rawMetadata === 'object' && !Array.isArray(rawMetadata)
    ? rawMetadata as Record<string, unknown>
    : {};
}

function validateCheckpointScope(args: CheckpointScopeArgs): CheckpointScopeArgs {
  const validateValue = (
    value: string | undefined,
    field: keyof CheckpointScopeArgs,
    options: { trim?: boolean } = {},
  ): string | undefined => {
    if (value === undefined) {
      return undefined;
    }
    if (typeof value !== 'string') {
      throw new Error(`${field} must be a string`);
    }
    return options.trim ? value.trim() : value;
  };

  const tenantId = validateValue(args.tenantId, 'tenantId', { trim: true });
  const userId = validateValue(args.userId, 'userId');
  const agentId = validateValue(args.agentId, 'agentId');
  const sharedSpaceId = validateValue(args.sharedSpaceId, 'sharedSpaceId');
  const hasActorOrSharedSpaceScope =
    userId !== undefined || agentId !== undefined || sharedSpaceId !== undefined;

  if (
    hasActorOrSharedSpaceScope
    && tenantId !== undefined
    && tenantId.trim().length === 0
  ) {
    throw new Error('tenantId must be a non-empty string when userId, agentId, or sharedSpaceId is provided');
  }

  return {
    tenantId: tenantId && tenantId.length > 0 ? tenantId : undefined,
    userId,
    agentId,
    sharedSpaceId,
  };
}

function hasCheckpointScope(scope: CheckpointScopeArgs): boolean {
  return (
    scope.tenantId !== undefined
    || scope.userId !== undefined
    || scope.agentId !== undefined
    || scope.sharedSpaceId !== undefined
  );
}

function requiresCheckpointTenant(scope: CheckpointScopeArgs): boolean {
  return scope.tenantId === undefined && (
    scope.userId !== undefined
    || scope.agentId !== undefined
    || scope.sharedSpaceId !== undefined
  );
}

function mergeCheckpointScopeMetadata(
  metadata: Record<string, unknown> | undefined,
  scope: CheckpointScopeArgs,
): Record<string, unknown> {
  return {
    ...(metadata ?? {}),
    ...(scope.tenantId !== undefined ? { tenantId: scope.tenantId } : {}),
    ...(scope.userId !== undefined ? { userId: scope.userId } : {}),
    ...(scope.agentId !== undefined ? { agentId: scope.agentId } : {}),
    ...(scope.sharedSpaceId !== undefined ? { sharedSpaceId: scope.sharedSpaceId } : {}),
  };
}

function checkpointMatchesScope(rawMetadata: unknown, scope: CheckpointScopeArgs): boolean {
  const metadata = parseCheckpointMetadata(rawMetadata);
  const matchesScopeField = (field: keyof CheckpointScopeArgs): boolean => {
    const expected = scope[field];
    if (expected === undefined) {

 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:35:  totalResultsShown?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:246:      selectionContext.totalResultsShown ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:308:        totalResultsShown: row.total_results_shown ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:292:export const handle_memory_validate = lazyFunction(getCheckpointsModule, 'handle_memory_validate');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:85:  wasUseful: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:87:  queryTerms?: string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:88:  resultRank?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:89:  totalResultsShown?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648:/** Handle memory_validate tool - records user validation feedback to adjust confidence */
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:654:    wasUseful,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:656:    queryTerms,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:657:    resultRank,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:658:    totalResultsShown,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:669:  if (typeof wasUseful !== 'boolean') {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:670:    throw new Error('wasUseful is required and must be a boolean');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:681:  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:685:      signalType: wasUseful ? 'outcome' : 'correction',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:692:        resultRank: typeof resultRank === 'number' ? resultRank : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:693:        totalResultsShown: typeof totalResultsShown === 'number' ? totalResultsShown : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:710:  if (wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:722:  if (!wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:726:  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:735:  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:739:      selectedRank: resultRank,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:740:      totalResultsShown,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:745:    const normalizedTerms = Array.isArray(queryTerms)
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:746:      ? queryTerms.filter((term) => typeof term === 'string' && term.trim().length > 0).map((term) => term.trim())
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:749:    if (typeof resultRank === 'number' && Number.isFinite(resultRank) && resultRank > 0 && normalizedTerms.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:750:      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:767:  const summary = wasUseful
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:775:  if (!wasUseful && result.validationCount > 3) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:780:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:784:      wasUseful: wasUseful,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:815:const handle_memory_validate = handleMemoryValidate;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:822:  handle_memory_validate,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:9:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:36:- `checkpoints.ts` - Checkpoint lifecycle plus `memory_validate`.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:20:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:208:          created_at, updated_at, confidence, validation_count, access_count
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:66:  'validation_count',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:142:      validation_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1697:  if (!column_names.includes('validation_count')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1699:      database.exec(`ALTER TABLE memory_index ADD COLUMN validation_count INTEGER DEFAULT 0`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1700:      console.warn('[vector-index] Migration: Added validation_count column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1705:      logDuplicateColumnMigrationSkip('validation_count', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2338:      validation_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:99:    validation_count INTEGER NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:131:      'SELECT importance_tier, validation_count, confidence FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:134:      validation_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:149:    const totalValidationCount = memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:183:        reason: `below_threshold: positive_validation_count=${validationCount}/${path.threshold}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:192:      reason: `threshold_met: positive_validation_count=${validationCount}>=${path.threshold}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:251:          (memory_id, previous_tier, new_tier, validation_count, promoted_at)
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:298:      SELECT id, importance_tier, validation_count
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:301:        AND validation_count >= ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:305:      validation_count: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:317:        row.validation_count ?? 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:328:        reason: `threshold_met: positive_validation_count=${positiveValidationCount}>=${path.threshold}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:22:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:27:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:403:  const queryTerms = extractKeywords(query);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:404:  if (queryTerms.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:415:    for (const term of queryTerms) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:428:      const relevanceScore = matchCount / queryTerms.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:21:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:31:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:44:  queryTerms: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:45:  resultRank: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:200: * @param queryTerms - Terms from the user's search query
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:206:  queryTerms: string[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:212:  const candidates = queryTerms
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:252: * @param queryTerms - Terms from the user's search query
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:253: * @param resultRank - The rank position of this result (1-based)
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:260:  queryTerms: string[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:261:  resultRank: number,
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:271:    if (resultRank <= TOP_N_EXCLUSION) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:307:    const terms = extractLearnableTerms(queryTerms, existingTriggers);
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:467:    const queryTerms = query
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:472:    if (queryTerms.length === 0) return [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:491:        .filter((entry) => queryTerms.some((qt) => entry.term.includes(qt) || qt.includes(entry.term)))
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:498:          weight: LEARNED_TRIGGER_WEIGHT * (matchedTerms.length / queryTerms.length),
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:60:function scoreSummary(summary: string, queryTerms: string[]): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:61:  if (queryTerms.length === 0) return 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:64:  for (const term of queryTerms) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:67:  return matches / queryTerms.length;
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:121:    const queryTerms = extractQueryTerms(query);
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:122:    if (queryTerms.length === 0) return emptyOutput;
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:140:      const matchScore = scoreSummary(row.summary, queryTerms);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:29:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1338:    'validation_count',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:57:  validation_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:4:// When wasUseful=false is recorded via memory_validate, reduce the
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:69: * @param negativeCount - Number of negative (wasUseful=false) validations
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:40:  validation_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:100: * - This function updates `memory_index.confidence` and `validation_count`,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:102: * - For `wasUseful=false`, `handlers/checkpoints.ts` pairs this update with
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:108:export function recordValidation(db: Database, memoryId: number, wasUseful: boolean): ValidationResult {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:114:        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:124:      if (wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:130:      const currentValidationCount = memory.validationCount ?? memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:135:        SET confidence = ?, validation_count = ?, updated_at = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:140:      const effectiveNegativeValidationCount = wasUseful
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:155:      if (!wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:209:      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:222:    const validationCount = memory.validationCount ?? memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:240:        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:251:      const validationCount = memory.validationCount ?? memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:257:        `and positive_validation_count >= ${PROMOTION_VALIDATION_THRESHOLD} (current: ${positiveValidationCount})`
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:268:    console.warn(`[confidence-tracker] Memory ${memoryId} promoted to critical tier`);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:286:      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:294:    const validationCount = memory.validationCount ?? memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:128:- HVR score = validated_useful_count / total_validation_count
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:260:> **Note on `validationCount`:** SQLite returns `validation_count` (snake_case column name).
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:261:> The code type-casts to include both `validationCount` and `validation_count` for safety,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:263:> `validation_count` is used at runtime. No bug, but the type cast is defensive/misleading.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:699: * Negative feedback: memories with wasUseful=false validations receive a
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:751:`wasUseful=false` validations apply a demotion multiplier to composite scores. Penalty: -0.1 per negative validation, floor at 0.3 (never suppress below 30%). 30-day half-life recovery: penalty halves over time if no further negative feedback. Gated via `SPECKIT_NEGATIVE_FEEDBACK` (default ON).
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:77:    tools: ['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete']

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Reporting Dashboard (R13-S3)
// ───────────────────────────────────────────────────────────────
// the rollout: Full reporting dashboard for eval infrastructure.
// Aggregates metrics per sprint/eval-run, per-channel views,
// Trend analysis, and formatted report output.
//
// Uses: eval-db.ts singleton, eval_metric_snapshots table,
// Eval_channel_results table.
//
// Design:
//   - Read-only queries against eval DB (no writes).
//   - Sprint labels inferred from metadata JSON or eval_run_id grouping.
//   - Pure aggregation logic; DB access isolated to query functions.
// External packages
import type Database from 'better-sqlite3';

// Internal modules
import { getEvalDb, initEvalDb } from './eval-db.js';

// Feature catalog: Reporting dashboard (eval_reporting_dashboard)


// Configurable limit prevents silent data loss at scale (was hardcoded 1000)
const DASHBOARD_ROW_LIMIT = Math.max(1, parseInt(process.env.SPECKIT_DASHBOARD_LIMIT ?? '10000', 10) || 10000);

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

/** Configuration for dashboard report generation. */
export interface ReportConfig {
  /** Filter to specific sprint labels (matched against metadata). */
  sprintFilter?: string[];
  /** Filter to specific channels (e.g. 'vector', 'bm25', 'fts', 'graph', 'trigger'). */
  channelFilter?: string[];
  /** Filter to specific metric names. */
  metricFilter?: string[];
  /** Maximum number of sprint groups to include (most recent first). */
  limit?: number;
}

/** Summary statistics for a single metric. */
export interface MetricSummary {
  mean: number;
  min: number;
  max: number;
  latest: number;
  count: number;
}

/** Per-channel performance within a sprint. */
export interface ChannelPerformance {
  hitCount: number;
  avgLatencyMs: number;
  queryCount: number;
}

/** Report for a single sprint / eval-run group. */
export interface SprintReport {
  /** Sprint label (from metadata or eval_run_id). */
  sprint: string;
  /** Number of eval runs in this sprint group. */
  evalRunCount: number;
  /** Eval run IDs included in this sprint group. */
  evalRunIds: number[];
  /** Per-metric summary statistics. */
  metrics: Record<string, MetricSummary>;
  /** Per-metric, per-channel summary statistics derived from channel-tagged snapshots. */
  channelMetrics: Record<string, Record<string, MetricSummary>>;
  /** Per-channel performance data. */
  channels: Record<string, ChannelPerformance>;
  /** Earliest timestamp in this sprint group. */
  firstSeen: string;
  /** Latest timestamp in this sprint group. */
  lastSeen: string;
}

/** A single trend data point comparing consecutive runs. */
export interface TrendEntry {
  /** Metric name. */
  metric: string;
  /** Previous value. */
  previous: number;
  /** Current value. */
  current: number;
  /** Absolute delta (current - previous). */
  delta: number;
  /** Percentage change. */
  percentChange: number;
  /** Direction indicator. */
  direction: 'improved' | 'regressed' | 'unchanged';
  /** Sprint/run label for the current value. */
  currentLabel: string;
  /** Sprint/run label for the previous value. */
  previousLabel: string;
}

/** Complete dashboard report. */
export interface DashboardReport {
  /** ISO timestamp when report was generated. */
  generatedAt: string;
  /** Total eval runs included in this report after filters/limit. */
  totalEvalRuns: number;
  /** Total metric snapshots included in this report after filters/limit. */
  totalSnapshots: number;
  /** Per-sprint reports. */
  sprints: SprintReport[];
  /** Trend entries showing improvement/regression across runs. */
  trends: TrendEntry[];
  /** Human-readable summary paragraph. */
  summary: string;
}

/* ───────────────────────────────────────────────────────────────
   2. INTERNAL HELPERS — DB QUERIES
──────────────────────────────────────────────────────────────── */

/**
 * Lazy DB accessor. Initializes eval DB if needed.
 * Safe to call repeatedly (initEvalDb is idempotent).
 */
// H18 FIX: Use existing eval DB singleton first to avoid silently switching
// away from a non-default/test eval DB when generating a dashboard.
function getDb(): Database.Database {
  try { return getEvalDb(); } catch (_: unknown) { /* not yet initialized */ }
  return initEvalDb();
}

/** Row shape from eval_metric_snapshots. */
interface SnapshotRow {
  id: number;
  eval_run_id: number;
  metric_name: string;
  metric_value: number;
  channel: string | null;
  query_count: number | null;
  metadata: string | null;
  created_at: string;
}

/** Aggregated per-run/per-channel row shape from eval_channel_results. */
interface ChannelResultRow {
  eval_run_id: number;
  channel: string;
  hit_count: number;
  latency_ms: number | null;
  query_count: number;
}

/**
 * Extract sprint label from a metadata JSON string.
 * Looks for "sprint" key in the JSON. Returns null if not found.
 */
function extractSprintFromMetadata(metadata: string | null): string | null {
  if (!metadata) return null;
  try {
    const parsed = JSON.parse(metadata);
    if (parsed.sprint !== undefined && parsed.sprint !== null) {
      return String(parsed.sprint);
    }
    if (parsed.sprintLabel) {
      return String(parsed.sprintLabel);
    }
    return null;
  } catch (_error: unknown) {
    return null;
  }
}

/**
 * Determine if a metric is "higher is better" (true) or "lower is better" (false).
 * Used for trend direction interpretation.
 */
function isHigherBetter(metricName: string): boolean {
  // Metrics where lower values indicate better performance.
  // Checked via prefix match on lowercase to handle variants
  // (e.g. inversion_rate, inversion-rate, latency_ms).
  const lowerName = metricName.toLowerCase();
  const lowerIsBetterPrefixes = ['inversion', 'latency'];
  return !lowerIsBetterPrefixes.some((prefix) => lowerName.startsWith(prefix));
}

/**
 * Query all metric snapshots, optionally filtered.
 */
function queryMetricSnapshots(
  db: Database.Database,
  config: ReportConfig,
): SnapshotRow[] {
  let sql = `SELECT id, eval_run_id, metric_name, metric_value, channel, query_count, metadata, created_at
             FROM eval_metric_snapshots
             WHERE 1=1`;
  const params: unknown[] = [];

  if (config.metricFilter && config.metricFilter.length > 0) {
    const placeholders = config.metricFilter.map(() => '?').join(', ');
    sql += ` AND metric_name IN (${placeholders})`;
    params.push(...config.metricFilter);
  }

  if (config.channelFilter && config.channelFilter.length > 0) {
    const placeholders = config.channelFilter.map(() => '?').join(', ');
    sql += ` AND (channel IN (${placeholders}) OR channel IS NULL)`;
    params.push(...config.channelFilter);
  }

  sql += ` ORDER BY created_at DESC`;

  const rows = db.prepare(sql).all(...params) as SnapshotRow[];

  if (!config.sprintFilter || config.sprintFilter.length === 0) {
    return rows.slice(0, DASHBOARD_ROW_LIMIT);
  }

  const filteredRows = rows.filter((snap) => {
    const sprintFromMeta = extractSprintFromMetadata(snap.metadata);
    const label = sprintFromMeta ?? `run-${snap.eval_run_id}`;
    return config.sprintFilter!.some((filter) => label.toLowerCase().includes(filter.toLowerCase()));
  });

  // Apply the row safeguard after sprint filtering so matching older rows are not dropped prematurely.
  return filteredRows.slice(0, DASHBOARD_ROW_LIMIT);
}

/**
 * Query grouped channel results for specific eval_run_ids.
 * Aggregating in SQL keeps channel coverage complete for the included runs
 * without materializing every per-query row in memory.
 */
function queryChannelResults(
  db: Database.Database,
  evalRunIds: number[],
  channelFilter?: string[],
): ChannelResultRow[] {
  if (evalRunIds.length === 0) return [];

  const runPlaceholders = evalRunIds.map(() => '?').join(', ');
  let sql = `SELECT
               eval_run_id,
               channel,
               SUM(hit_count) AS hit_count,
               AVG(latency_ms) AS latency_ms,
               COUNT(*) AS query_count
             FROM eval_channel_results
             WHERE eval_run_id IN (${runPlaceholders})`;
  const params: unknown[] = [...evalRunIds];

  if (channelFilter && channelFilter.length > 0) {
    const chPlaceholders = channelFilter.map(() => '?').join(', ');
    sql += ` AND channel IN (${chPlaceholders})`;
    params.push(...channelFilter);
  }

  sql += ` GROUP BY eval_run_id, channel`;

  return db.prepare(sql).all(...params) as ChannelResultRow[];
}

/* ───────────────────────────────────────────────────────────────

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '100,260p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
 * - This function updates `memory_index.confidence` and `validation_count`,
 *   establishing durable feedback state for search-stage signal consumers.
 * - For `wasUseful=false`, `handlers/checkpoints.ts` pairs this update with
 *   `recordNegativeFeedbackEvent`, and Stage 2 (`search/pipeline/stage2-fusion.ts`)
 *   reads those events via `getNegativeFeedbackStats` to apply demotion.
 * - Positive validations can trigger auto-promotion (`importance_tier` changes),
 *   which Stage 2 validation metadata scoring treats as a quality signal.
 */
export function recordValidation(db: Database, memoryId: number, wasUseful: boolean): ValidationResult {
  try {
    // Keep read/compute/write in one transaction so concurrent updates cannot drop validations.
    return db.transaction(() => {
      // Read first so this update derives from the latest persisted values.
      const memory = db.prepare(`
        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
      `).get(memoryId) as MemoryConfidenceRow | undefined;

      if (!memory) {
        throw new Error(`Memory not found: ${memoryId}`);
      }

      const currentConfidence = memory.confidence ?? CONFIDENCE_BASE;
      let newConfidence: number;

      if (wasUseful) {
        newConfidence = Math.min(currentConfidence + CONFIDENCE_POSITIVE_INCREMENT, CONFIDENCE_MAX);
      } else {
        newConfidence = Math.max(currentConfidence - CONFIDENCE_NEGATIVE_DECREMENT, CONFIDENCE_MIN);
      }

      const currentValidationCount = memory.validationCount ?? memory.validation_count ?? 0;
      const newValidationCount = currentValidationCount + 1;

      db.prepare(`
        UPDATE memory_index
        SET confidence = ?, validation_count = ?, updated_at = ?
        WHERE id = ?
      `).run(newConfidence, newValidationCount, new Date().toISOString(), memoryId);

      const priorNegativeValidationCount = getNegativeValidationCount(db, memoryId);
      const effectiveNegativeValidationCount = wasUseful
        ? priorNegativeValidationCount
        : priorNegativeValidationCount + 1;
      const positiveValidationCount = resolvePositiveValidationCount(
        newValidationCount,
        effectiveNegativeValidationCount
      );

      // Report eligibility only; promotion is intentionally explicit and separate.
      const promotionEligible = isPromotionEligible(
        memory.importance_tier,
        newConfidence,
        positiveValidationCount
      );

      if (!wasUseful) {
        const chunkId = memoryId;
        console.warn('[confidence-tracker] negative feedback recorded', {
          chunkId,
          previousConfidence: currentConfidence,
          newConfidence,
          decrement: CONFIDENCE_NEGATIVE_DECREMENT,
        });
      }

      return {
        confidence: newConfidence,
        validationCount: newValidationCount,
        positiveValidationCount,
        promotionEligible,
        wasPromoted: false,
      };
    })();
  } catch (error: unknown) {
    // T-07: Replace success-shaped fallback with explicit failure signaling.
    // Previously returned default values that looked like success, hiding DB errors
    // From callers and allowing downstream side-effects to proceed on stale data.
    console.error(`[confidence-tracker] recordValidation failed for memory ${memoryId}:`, error);
    throw error;
  }
}

/**
 * Get current confidence score for a memory.
 */
export function getConfidenceScore(db: Database, memoryId: number): number {
  try {
    // DB op 3: SELECT
    const memory = db.prepare(`
      SELECT confidence FROM memory_index WHERE id = ?
    `).get(memoryId) as { confidence?: number } | undefined;

    if (!memory) {
      throw new Error(`Memory not found: ${memoryId}`);
    }

    return memory.confidence ?? CONFIDENCE_BASE;
  } catch (error: unknown) {
    console.error(`[confidence-tracker] getConfidenceScore failed for memory ${memoryId}:`, error);
    return CONFIDENCE_BASE;
  }
}

/**
 * Check if a memory is eligible for promotion to critical tier.
 */
export function checkPromotionEligible(db: Database, memoryId: number): boolean {
  try {
    const memory = db.prepare(`
      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
    `).get(memoryId) as MemoryConfidenceRow | undefined;

    if (!memory) {
      return false;
    }

    // Top-tier memories should not be re-promoted.
    if (memory.importance_tier === 'critical' || memory.importance_tier === 'constitutional') {
      return false;
    }

    const confidence = memory.confidence ?? CONFIDENCE_BASE;
    const validationCount = memory.validationCount ?? memory.validation_count ?? 0;
    const negativeValidationCount = getNegativeValidationCount(db, memoryId);
    const positiveValidationCount = resolvePositiveValidationCount(validationCount, negativeValidationCount);

    return isPromotionEligible(memory.importance_tier, confidence, positiveValidationCount);
  } catch (error: unknown) {
    console.error(`[confidence-tracker] checkPromotionEligible failed for memory ${memoryId}:`, error);
    return false;
  }
}

/**
 * Promote a memory to critical tier.
 */
export function promoteToCritical(db: Database, memoryId: number): boolean {
  try {
    if (!checkPromotionEligible(db, memoryId)) {
      const memory = db.prepare(`
        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
      `).get(memoryId) as MemoryConfidenceRow | undefined;

      if (!memory) {
        throw new Error(`Memory not found: ${memoryId}`);
      }

      if (memory.importance_tier === 'critical' || memory.importance_tier === 'constitutional') {
        return false;
      }

      const validationCount = memory.validationCount ?? memory.validation_count ?? 0;
      const negativeValidationCount = getNegativeValidationCount(db, memoryId);
      const positiveValidationCount = resolvePositiveValidationCount(validationCount, negativeValidationCount);
      throw new Error(
        `Memory ${memoryId} not eligible for promotion. ` +
        `Requires confidence >= ${PROMOTION_CONFIDENCE_THRESHOLD} (current: ${memory.confidence ?? CONFIDENCE_BASE}) ` +
        `and positive_validation_count >= ${PROMOTION_VALIDATION_THRESHOLD} (current: ${positiveValidationCount})`
      );
    }


 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Stats
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';
import * as fs from 'fs';

import { checkDatabaseUpdated } from '../core/index.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import * as folderScoring from '../lib/scoring/folder-scoring.js';
import type { FolderMemoryInput } from '../lib/scoring/folder-scoring.js';
import { getGraphMetrics } from '../lib/search/hybrid-search.js';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import { toErrorMessage } from '../utils/index.js';

import type { MCPResponse } from './types.js';
import type { StatsArgs } from './memory-crud-types.js';

// Feature catalog: System statistics (memory_stats)


/* ───────────────────────────────────────────────────────────────
   CORE LOGIC
──────────────────────────────────────────────────────────────── */

/** Handle memory_stats tool -- returns memory system statistics and folder rankings. */
async function handleMemoryStats(args: StatsArgs | null): Promise<MCPResponse> {
  const startTime = Date.now();
  const requestId = randomUUID();
  try {
    await checkDatabaseUpdated();
  } catch (dbStateErr: unknown) {
    const message = toErrorMessage(dbStateErr);
    console.error(`[memory-stats] Database refresh failed [requestId=${requestId}]: ${message}`);
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'Database refresh failed before query execution. Retry the request or restart the MCP server.',
      code: 'E021',
      details: { requestId },
      startTime,
    });
  }

  const database = vectorIndex.getDb();
  if (!database) {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
      code: 'E020',
      details: { requestId },
      startTime,
    });
  }

  const {
    folderRanking = 'count',
    excludePatterns = [],
    includeScores = false,
    includeArchived = false,
    limit: rawLimit = 10,
  } = args || {};

  const validRankings = ['count', 'recency', 'importance', 'composite'];
  if (!validRankings.includes(folderRanking)) {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: `Invalid folderRanking: ${folderRanking}. Valid options: ${validRankings.join(', ')}`,
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }

  if (excludePatterns && !Array.isArray(excludePatterns)) {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'excludePatterns must be an array of regex pattern strings',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (Array.isArray(excludePatterns) && excludePatterns.some((pattern) => typeof pattern !== 'string')) {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'excludePatterns must contain only string patterns',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (includeScores !== undefined && typeof includeScores !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'includeScores must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (includeArchived !== undefined && typeof includeArchived !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'includeArchived must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (rawLimit !== undefined && (typeof rawLimit !== 'number' || !Number.isFinite(rawLimit))) {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'limit must be a finite number',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }

  const safeLimit = Math.max(1, Math.min(Math.floor(rawLimit || 10), 100));

  let total = 0;
  let statusCounts: ReturnType<typeof vectorIndex.getStatusCounts> = { success: 0, pending: 0, failed: 0, retry: 0, partial: 0 };
  let dates: Record<string, unknown> = { oldest: null, newest: null };
  let triggerCount = 0;
  let topFolders: Record<string, unknown>[];
  let totalSpecFolders = 0;
  const tierBreakdown: Record<string, number> = {};
  let lastIndexedAt: string | null = null;

  try {
    const totalResult = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as Record<string, unknown>;
    total = (totalResult && typeof totalResult.count === 'number') ? totalResult.count : 0;
    statusCounts = vectorIndex.getStatusCounts();
    dates = (database.prepare('SELECT MIN(created_at) as oldest, MAX(created_at) as newest FROM memory_index').get() || { oldest: null, newest: null }) as Record<string, unknown>;

    const triggerResult = database.prepare("SELECT SUM(json_array_length(trigger_phrases)) as count FROM memory_index WHERE trigger_phrases IS NOT NULL AND trigger_phrases != '[]'").get() as Record<string, unknown>;
    triggerCount = (triggerResult && typeof triggerResult.count === 'number') ? triggerResult.count : 0;

    const tierRows = database.prepare(
      'SELECT importance_tier, COUNT(*) as count FROM memory_index GROUP BY importance_tier'
    ).all() as { importance_tier: string; count: number }[];
    for (const row of tierRows) {
      tierBreakdown[row.importance_tier || 'normal'] = row.count;
    }

    const lastIndexedRow = database.prepare(
      'SELECT MAX(updated_at) as last_indexed FROM memory_index'
    ).get() as { last_indexed: string | null } | undefined;
    lastIndexedAt = lastIndexedRow?.last_indexed || null;
  } catch (dbErr: unknown) {
    const message = toErrorMessage(dbErr);
    console.error(`[memory-stats] Database query failed (aggregate stats): ${message}`);
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: `Database query failed: ${message}`,
      code: 'E021',
      details: { requestId },
      startTime,
    });
  }

  let databaseSizeBytes: number | null = null;
  try {
    const dbPath = vectorIndex.getDbPath();
    if (dbPath) {
      databaseSizeBytes = fs.statSync(dbPath).size;
    }
  } catch (_err: unknown) {
    // Non-fatal.
  }

  try {
    if (folderRanking === 'count') {
      const folderRows = database.prepare('SELECT spec_folder, COUNT(*) as count FROM memory_index GROUP BY spec_folder ORDER BY count DESC').all() as { spec_folder: string; count: number }[];

      let filteredFolders = folderRows;
      if (!includeArchived) {
        filteredFolders = filteredFolders.filter((folder) => !folderScoring.isArchived(folder.spec_folder));
      }

      if (excludePatterns.length > 0) {
        const loweredPatterns = excludePatterns
          .filter((pattern: string) => typeof pattern === 'string' && pattern.length > 0)
          .map((pattern: string) => pattern.toLowerCase());

        if (loweredPatterns.length > 0) {
          filteredFolders = filteredFolders.filter((folder) => {
            const folderName = folder.spec_folder.toLowerCase();
            return !loweredPatterns.some((pattern) => folderName.includes(pattern));
          });
        }
      }

      totalSpecFolders = filteredFolders.length;
      topFolders = filteredFolders.slice(0, safeLimit).map((folder) => ({
        folder: folder.spec_folder,
        count: folder.count,
      }));
    } else {
      const allMemories: FolderMemoryInput[] = database.prepare(`
        SELECT
          id, spec_folder, file_path, title, importance_weight, importance_tier,
          created_at, updated_at, confidence, validation_count, access_count
        FROM memory_index
        WHERE embedding_status = 'success'
      `).all() as FolderMemoryInput[];

      const scoringOptions = {
        includeArchived,
        excludePatterns,
      };

      let scoredFolders: Record<string, unknown>[];
      try {
        scoredFolders = folderScoring.computeFolderScores(allMemories, scoringOptions);

        // Sort by ranking mode
        if (folderRanking === 'recency') {
          scoredFolders.sort((a, b) => ((b.recencyScore as number) ?? 0) - ((a.recencyScore as number) ?? 0));
        } else if (folderRanking === 'importance') {
          scoredFolders.sort((a, b) => ((b.importanceScore as number) ?? 0) - ((a.importanceScore as number) ?? 0));
        }
        // 'composite' and 'count' use default sort from computeFolderScores (by .score)
      } catch (scoringErr: unknown) {
        const message = toErrorMessage(scoringErr);
        console.error(`[memory-stats] Scoring failed, falling back to count-based: ${message}`);

        const folderCounts = new Map<string, number>();
        for (const memory of allMemories) {
          const folder = (memory.spec_folder as string) || 'unknown';
          folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
        }

        scoredFolders = Array.from(folderCounts.entries())
          .filter(([folder]) => includeArchived || !folderScoring.isArchived(folder))
          .map(([folder, count]) => ({
            folder,
            simplified: folder.split('/').pop() || folder,
            count,
            score: 0,
            isArchived: folderScoring.isArchived(folder),
          }))
          .sort((a, b) => b.count - a.count);
      }

      totalSpecFolders = scoredFolders.length;
      scoredFolders = scoredFolders.slice(0, safeLimit);

      if (includeScores || folderRanking === 'composite') {
        topFolders = scoredFolders.map((folder: Record<string, unknown>) => ({
          folder: folder.folder,
          simplified: folder.simplified,
          count: folder.count,
          score: folder.score,
          recencyScore: folder.recencyScore,

exec
/bin/zsh -lc "sed -n '180,290p' .opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  sessionQueries.set(sessionId, entries.slice(-MAX_QUERIES_PER_SESSION));

  // Emit feedback events for detected patterns
  if (detection.type && detection.previousMemoryIds.length > 0) {
    const confidence = detection.type === 'query_reformulated' ? 'medium' : 'weak';
    for (const memoryId of detection.previousMemoryIds) {
      const event: FeedbackEvent = {
        type: detection.type,
        memoryId,
        queryId: detection.previousQueryId ?? queryId,
        confidence,
        timestamp,
        sessionId,
      };
      logFeedbackEvent(db, event);
    }
  }

  return detection;
}

/**
 * Log `result_cited` events for memories whose content was loaded.
 * Call when includeContent=true and results contain content.
 */
export function logResultCited(
  db: Database.Database,
  sessionId: string | null,
  queryId: string,
  memoryIds: string[],
): void {
  if (!isImplicitFeedbackLogEnabled()) return;
  if (memoryIds.length === 0) return;

  const timestamp = Date.now();
  for (const memoryId of memoryIds) {
    logFeedbackEvent(db, {
      type: 'result_cited',
      memoryId,
      queryId,
      confidence: 'strong',
      timestamp,
      sessionId: sessionId ?? null,
    });
  }
}

/**
 * Log `follow_on_tool_use` events for memories shown in a recent search.
 * Call when any non-search tool is invoked within the follow-on window.
 */
export function logFollowOnToolUse(
  db: Database.Database,
  sessionId: string | null,
): void {
  if (!isImplicitFeedbackLogEnabled()) return;
  if (!sessionId) return;

  const entries = sessionQueries.get(sessionId);
  if (!entries || entries.length === 0) return;

  const latest = entries[entries.length - 1];
  const elapsed = Date.now() - latest.timestamp;

  if (elapsed > FOLLOW_ON_WINDOW_MS) return;
  if (latest.shownMemoryIds.length === 0) return;

  const timestamp = Date.now();
  for (const memoryId of latest.shownMemoryIds) {
    logFeedbackEvent(db, {
      type: 'follow_on_tool_use',
      memoryId,
      queryId: latest.queryId,
      confidence: 'strong',
      timestamp,
      sessionId,
    });
  }
}

/**
 * Clear query history for a session (e.g., on session cleanup).
 */
export function clearSession(sessionId: string): void {
  sessionQueries.delete(sessionId);
}

/**
 * Get current session query count (for testing/diagnostics).
 */
export function getSessionQueryCount(sessionId: string): number {
  return sessionQueries.get(sessionId)?.length ?? 0;
}

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Eval Metrics
// ───────────────────────────────────────────────────────────────
// Feature catalog: Core metric computation
// T006a-e: Pure computation functions for 12 evaluation metrics
// (7 core + 5 diagnostic). No DB access, no side effects.
/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

/** A single retrieved result from a search query. */
export interface EvalResult {
  /** Unique memory identifier. */
  memoryId: number;
  /** Retrieval score assigned by the search system. */
  score: number;
  /** 1-based rank position in the result list. */
  rank: number;
}

// H16 FIX: Use contiguous 1-based position within the topK slice, not external sparse rank.
// External ranks can be non-contiguous after filtering/reranking, which would systematically
// understate MRR/NDCG/MAP if used directly.
function getRankAtIndex(_result: EvalResult, index: number): number {
  return index + 1;
}

/** A single ground truth relevance judgment for a query-memory pair. */
export interface GroundTruthEntry {
  /** Identifier of the query this judgment belongs to. */
  queryId: number;
  /** Unique memory identifier. */
  memoryId: number;
  /**
   * Relevance grade:
   *   0 = not relevant
   *   1 = partially relevant
   *   2 = relevant
   *   3 = highly relevant
   */
  relevance: number;
  /** Optional importance tier (e.g. 'constitutional', 'critical', 'important', 'normal'). */
  tier?: string;
  /** Optional creation timestamp for cold-start detection. */
  createdAt?: Date;
}

/** All computed metrics returned by computeAllMetrics(). */
export interface AllMetrics {
  mrr: number;
  ndcg: number;
  recall: number;
  hitRate: number;
  inversionRate: number;
  constitutionalSurfacingRate: number;
  importanceWeightedRecall: number;
  coldStartDetectionRate: number;
  precision: number;
  f1: number;
  map: number;
  intentWeightedNdcg: number;
}

/* ───────────────────────────────────────────────────────────────
   2. INTERNAL HELPERS
──────────────────────────────────────────────────────────────── */

/**
 * Build a lookup map from memoryId → relevance for fast access.
 */
function buildRelevanceMap(groundTruth: GroundTruthEntry[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const entry of groundTruth) {
    map.set(entry.memoryId, entry.relevance);
  }
  return map;
}

/**
 * Build a lookup map from memoryId → GroundTruthEntry for full detail access.
 */
function buildGroundTruthMap(groundTruth: GroundTruthEntry[]): Map<number, GroundTruthEntry> {
  const map = new Map<number, GroundTruthEntry>();
  for (const entry of groundTruth) {
    map.set(entry.memoryId, entry);
  }
  return map;
}

/**
 * Sort results by rank ascending, return first k items.
 */
function topK(results: EvalResult[], k: number): EvalResult[] {
  const safeK = Number.isFinite(k) ? Math.floor(k) : 0;
  if (safeK <= 0) return [];
  return [...results]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, safeK);
}

/* ───────────────────────────────────────────────────────────────
   3. CORE METRICS
──────────────────────────────────────────────────────────────── */

/**
 * Mean Reciprocal Rank at K (default K=5).
 *
 * For each query: find rank of first relevant result in top-K,
 * take 1/rank. If no relevant result in top-K, contribution = 0.
 * Average across all queries (treated as single query here since
 * results are pre-filtered per call).
 *
 * @returns Value in [0, 1]. Returns 0 for empty inputs.
 */
export function computeMRR(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  k: number = 5,
): number {
  if (results.length === 0 || groundTruth.length === 0) return 0;
  if (groundTruth.every(entry => entry.relevance <= 0)) return 0;

  const relevanceMap = buildRelevanceMap(groundTruth);
  const topResults = topK(results, k);

  for (let i = 0; i < topResults.length; i++) {
    const rel = relevanceMap.get(topResults[i].memoryId) ?? 0;
    if (rel > 0) {
      return 1 / getRankAtIndex(topResults[i], i);
    }
  }

  return 0;
}

/**
 * Normalized Discounted Cumulative Gain at K (default K=10).
 *
 * DCG  = sum(relevance_i / log2(i+2)) for i in 0..K-1 (0-indexed)
 * IDCG = DCG of ideal ranking (relevance sorted descending)
 * NDCG = DCG / IDCG
 *
 * @returns Value in [0, 1]. Returns 0 for empty inputs or zero IDCG.
 */
export function computeNDCG(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  k: number = 10,
): number {
  if (results.length === 0 || groundTruth.length === 0) return 0;
  if (groundTruth.every(entry => entry.relevance <= 0)) return 0;

  const relevanceMap = buildRelevanceMap(groundTruth);
  const topResults = topK(results, k);

  // Compute DCG
  let dcg = 0;
  for (let i = 0; i < topResults.length; i++) {
    const rel = relevanceMap.get(topResults[i].memoryId) ?? 0;
    dcg += rel / Math.log2(getRankAtIndex(topResults[i], i) + 1);
  }

  // Compute IDCG: ideal ordering of all ground truth relevances, top-K
  const idealRelevances = [...groundTruth]
    .map(e => e.relevance)
    .sort((a, b) => b - a)
    .slice(0, k);

  let idcg = 0;
  for (let i = 0; i < idealRelevances.length; i++) {
    idcg += idealRelevances[i] / Math.log2(i + 2);
  }

  if (idcg === 0) return 0;

  return Math.min(1, dcg / idcg);
}

/**
 * Recall at K (default K=20).
 *
 * What fraction of all relevant memories (relevance > 0) in ground
 * truth appear in the top-K results?
 *
 * @returns Value in [0, 1]. Returns 0 when no relevant items exist.
 */
export function computeRecall(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  k: number = 20,
): number {
  if (results.length === 0 || groundTruth.length === 0) return 0;

  const relevantIds = new Set(
    groundTruth.filter(e => e.relevance > 0).map(e => e.memoryId),
  );

  if (relevantIds.size === 0) return 0;

  const topResults = topK(results, k);
  // F-28 — Deduplicate hits by memoryId to prevent Recall > 1.0
  // When the same memory appears multiple times in results.
  const seenIds = new Set<number>();
  let hits = 0;
  for (const r of topResults) {
    if (relevantIds.has(r.memoryId) && !seenIds.has(r.memoryId)) {
      hits++;
      seenIds.add(r.memoryId);
    }
  }

  return hits / relevantIds.size;
}

/**
 * Compute Precision@K — fraction of retrieved results that are relevant.
 * Precision = |relevant ∩ retrieved@K| / K
 */
export function computePrecision(
  results: EvalResult[],

 succeeded in 0ms:
---
title: "Evaluation Modules"
description: "Evaluation, logging, baselines, quality proxies, ablation, and reporting for the memory retrieval pipeline."
trigger_phrases:
  - "eval modules"
  - "ablation"
  - "eval logger"
  - "quality proxy"
---

# Evaluation Modules

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. IMPLEMENTED STATE](#3--implemented-state)
- [4. RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/eval/` contains the measurement stack for retrieval quality, eval logging, baseline comparisons, and rollout reporting. The directory currently has 14 TypeScript modules plus the static `data/ground-truth.json` fixture.

The current surface covers:

- Eval database bootstrap and logging.
- Metric computation and quality proxy scoring.
- BM25 baselines, ablations, k-sensitivity, and state baselines.
- Ground-truth generation plus feedback-based expansion.
- Reporting dashboard and read-only shadow comparison analysis.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:structure -->
## 2. STRUCTURE

| File | Purpose |
|---|---|
| `ablation-framework.ts` | Controlled channel ablation runs, formatting, and storage helpers |
| `bm25-baseline.ts` | BM25-only baseline measurement and baseline metric persistence |
| `edge-density.ts` | Graph edge-density measurement and reporting helpers |
| `eval-db.ts` | Eval database bootstrap and schema management |
| `eval-logger.ts` | Fail-safe query, channel, and final-result logging hooks |
| `eval-metrics.ts` | MRR, NDCG, recall, precision, F1, MAP, hit-rate, inversion-rate, and constitutional metrics |
| `eval-quality-proxy.ts` | Pure quality proxy formula for latency/result quality tradeoff scoring |
| `ground-truth-data.ts` | Static typed ground-truth definitions |
| `ground-truth-feedback.ts` | Selection-feedback capture and judge-agreement helpers |
| `ground-truth-generator.ts` | Ground-truth dataset generation and diversity validation |
| `k-value-analysis.ts` | RRF K-value sweep helpers |
| `memory-state-baseline.ts` | Retrieval/isolation baseline snapshots against the active memory DB |
| `reporting-dashboard.ts` | Sprint/channel aggregation and formatted dashboard output |
| `shadow-scoring.ts` | Read-only shadow comparison helpers and holdout analysis |

<!-- /ANCHOR:structure -->
<!-- ANCHOR:implemented-state -->
## 3. IMPLEMENTED STATE

- `eval-logger.ts` is intentionally fail-safe: when `SPECKIT_EVAL_LOGGING` is not exactly `true`, its public functions no-op instead of risking production retrieval paths.
- `eval-quality-proxy.ts` is a pure calculation module with no DB writes, making it safe for inline quality scoring and tests.
- `ablation-framework.ts` and the handler layer gate mutation-style ablation storage behind `SPECKIT_ABLATION=true`.
- `reporting-dashboard.ts` is the current reporting surface for sprint/channel aggregation.
- `shadow-scoring.ts` retains comparison and analysis helpers, but the legacy write path is retired; the module is now effectively read-only analysis support.
- `ground-truth-feedback.ts` is the bridge between implicit user selections, stored labels, and judge-agreement analysis.

<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:related -->
## 4. RELATED

- `../README.md`
- `../search/README.md`
- `../../api/README.md`
- `../../tests/README.md`

<!-- /ANCHOR:related -->

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory State Baseline Metrics
// ───────────────────────────────────────────────────────────────
// Feature catalog: Memory roadmap baseline snapshot
// Captures baseline retrieval/isolation metrics before phased rollout.
// Can optionally persist snapshots into eval_metric_snapshots.
import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';
import { getMemoryRoadmapDefaults } from '../config/capability-flags.js';
import { DEFAULT_DB_DIR, initEvalDb, getEvalDbPath } from './eval-db.js';

const CONTEXT_DB_FILENAME = 'context-index.sqlite';

interface MemoryStateBaselineSnapshot {
  capturedAt: string;
  evalRunId: number;
  specFolder: string | null;
  metrics: Record<string, number>;
  metadata: Record<string, unknown>;
  persistedRows?: number;
}

interface CaptureMemoryStateBaselineOptions {
  specFolder?: string | null;
  evalRunId?: number;
  persist?: boolean;
  metadata?: Record<string, unknown>;
  contextDbPath?: string;
}

function safeNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return 0;
}

function safeScalarMetric(
  database: Database.Database,
  sql: string,
  params: unknown[] = [],
  field = 'value',
): number {
  try {
    const row = database.prepare(sql).get(...params) as Record<string, unknown> | undefined;
    if (!row) {
      return 0;
    }
    return safeNumber(row[field]);
  } catch (_error: unknown) {
    return 0;
  }
}

function resolveContextDbPath(explicitPath?: string): string {
  if (typeof explicitPath === 'string' && explicitPath.trim().length > 0) {
    return path.resolve(explicitPath.trim());
  }

  if (typeof process.env.MEMORY_DB_PATH === 'string' && process.env.MEMORY_DB_PATH.trim().length > 0) {
    return path.resolve(process.env.MEMORY_DB_PATH.trim());
  }

  return path.resolve(DEFAULT_DB_DIR, CONTEXT_DB_FILENAME);
}

function openContextDb(dbPath: string): Database.Database | null {
  if (!fs.existsSync(dbPath)) {
    return null;
  }

  try {
    return new Database(dbPath, { readonly: true, fileMustExist: true });
  } catch (_error: unknown) {
    return null;
  }
}

function buildMetrics(evalDb: Database.Database, contextDb: Database.Database | null): Record<string, number> {
  const metrics: Record<string, number> = {
    'retrieval.eval_queries_total': safeScalarMetric(
      evalDb,
      'SELECT COUNT(*) AS value FROM eval_queries',
    ),
    'retrieval.eval_channel_rows_total': safeScalarMetric(
      evalDb,
      'SELECT COUNT(*) AS value FROM eval_channel_results',
    ),
    'retrieval.avg_channel_hit_count': safeScalarMetric(
      evalDb,
      'SELECT COALESCE(AVG(hit_count), 0) AS value FROM eval_channel_results',
    ),
    'retrieval.avg_channel_latency_ms': safeScalarMetric(
      evalDb,
      'SELECT COALESCE(AVG(latency_ms), 0) AS value FROM eval_channel_results',
    ),
    'retrieval.eval_final_rows_total': safeScalarMetric(
      evalDb,
      'SELECT COUNT(*) AS value FROM eval_final_results',
    ),
    'retrieval.avg_final_latency_ms': safeScalarMetric(
      evalDb,
      'SELECT COALESCE(AVG(latency_ms), 0) AS value FROM eval_final_results',
    ),
  };

  if (!contextDb) {
    metrics['isolation.memory_rows_total'] = 0;
    metrics['isolation.distinct_spec_folders'] = 0;
    metrics['isolation.unscoped_rows'] = 0;
    metrics['isolation.missing_session_scope_rows'] = 0;
    metrics['isolation.unknown_context_type_rows'] = 0;
    metrics['schema.version'] = 0;
    return metrics;
  }

  metrics['isolation.memory_rows_total'] = safeScalarMetric(
    contextDb,
    'SELECT COUNT(*) AS value FROM memory_index',
  );
  metrics['isolation.distinct_spec_folders'] = safeScalarMetric(
    contextDb,
    "SELECT COUNT(DISTINCT spec_folder) AS value FROM memory_index WHERE spec_folder IS NOT NULL AND TRIM(spec_folder) != ''",
  );
  metrics['isolation.unscoped_rows'] = safeScalarMetric(
    contextDb,
    "SELECT COUNT(*) AS value FROM memory_index WHERE spec_folder IS NULL OR TRIM(spec_folder) = ''",
  );
  metrics['isolation.missing_session_scope_rows'] = safeScalarMetric(
    contextDb,
    "SELECT COUNT(*) AS value FROM memory_index WHERE session_id IS NULL OR TRIM(session_id) = ''",
  );
  metrics['isolation.unknown_context_type_rows'] = safeScalarMetric(
    contextDb,
    "SELECT COUNT(*) AS value FROM memory_index WHERE context_type IS NULL OR TRIM(context_type) = '' OR context_type NOT IN ('research','implementation','planning','general','decision','discovery')",
  );
  metrics['schema.version'] = safeScalarMetric(
    contextDb,
    'SELECT version AS value FROM schema_version WHERE id = 1',
  );

  return metrics;
}

/**
 * Persist a captured baseline snapshot into eval metric history.
 *
 * @param snapshot - Baseline snapshot to persist.
 * @param evalDb - Eval database that stores metric snapshots.
 * @returns Number of rows written to `eval_metric_snapshots`.
 */
function persistMemoryStateBaselineSnapshot(snapshot: MemoryStateBaselineSnapshot, evalDb: Database.Database): number {
  const insert = evalDb.prepare(`
    INSERT INTO eval_metric_snapshots (eval_run_id, metric_name, metric_value, channel, query_count, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const metadata = JSON.stringify(snapshot.metadata);
  let persisted = 0;

  for (const [metricName, metricValue] of Object.entries(snapshot.metrics)) {
    insert.run(snapshot.evalRunId, metricName, metricValue, 'memory-state-baseline', null, metadata);
    persisted += 1;
  }

  return persisted;
}

/**
 * Capture baseline retrieval and isolation metrics for readiness.
 *
 * @param options - Snapshot configuration and optional persistence controls.
 * @returns Baseline snapshot for the current eval and context databases.
 */
function captureMemoryStateBaselineSnapshot(
  options: CaptureMemoryStateBaselineOptions = {},
): MemoryStateBaselineSnapshot {
  const contextDbPath = resolveContextDbPath(options.contextDbPath);
  const targetEvalDbDir = path.dirname(contextDbPath);
  const previousEvalDbPath = getEvalDbPath();

  // H17 FIX: Wrap the entire path switch in try/finally so the previous DB is
  // restored even when initEvalDb() fails after closing the prior singleton.
  let evalDb: ReturnType<typeof initEvalDb> | null = null;
  let contextDb: ReturnType<typeof openContextDb> | null = null;
  try {
    evalDb = initEvalDb(targetEvalDbDir);
    contextDb = openContextDb(contextDbPath);
    const defaults = getMemoryRoadmapDefaults();
    const evalRunId = options.evalRunId ?? -Math.floor(Date.now() / 1000);

    const metrics = buildMetrics(evalDb, contextDb);
    const snapshot: MemoryStateBaselineSnapshot = {
      capturedAt: new Date().toISOString(),
      evalRunId,
      specFolder: options.specFolder ?? null,
      metrics,
      metadata: {
        source: 'memory-state-baseline',
        phase: defaults.phase,
        capabilities: defaults.capabilities,
        scopeDimensionsTracked: defaults.scopeDimensionsTracked,
        contextDbPath,
        ...options.metadata,
      },
    };

    if (options.persist) {
      snapshot.persistedRows = persistMemoryStateBaselineSnapshot(snapshot, evalDb);
    }

    return snapshot;
  } finally {
    try {
      contextDb?.close();
    } catch (_error: unknown) {
      // Ignore close failures in baseline capture path
    }


exec
/bin/zsh -lc "sed -n '640,790p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '110,170p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

The scoring layer includes document-type multipliers for active document types (for example `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary`, `memory`, `constitutional`, `research`, `handover`, `scratch`). These multipliers are used by folder scoring and document retrieval ranking.

### Event-Based Decay Model (Spec 136)

The scoring module supports an event-based decay model that replaces pure time-based decay with event-driven signals. Instead of decaying scores solely based on elapsed time, the model tracks meaningful events (access, citation, validation) and adjusts decay rates based on event frequency and recency. This provides more accurate relevance scoring for memories that are actively referenced versus those that are merely recent.

**Key properties:**
- Decay triggered by event gaps rather than wall-clock time
- Event types: `access`, `citation`, `validation`, `modification`
- Memories with frequent events decay slower; idle memories decay faster
- Backward-compatible with FSRS decay (falls back when no event data available)

### Human Validation Rate (HVR) Integration (Spec 137)

HVR integration extends the confidence tracking system by incorporating human validation signals into composite scoring. The HVR score reflects how often users confirm a memory as useful versus not useful, creating a feedback-weighted confidence metric.

**Key properties:**
- HVR score = validated_useful_count / total_validation_count
- Integrates with the Confidence Tracking factor in composite scoring
- High-HVR memories receive score boosts during retrieval
- Low-HVR memories are candidates for demotion or deprecation
- Works alongside the existing promotion pipeline in `confidence-tracker.ts`

### Phase-Aware Scoring (Spec 139)

Phase-aware scoring adjusts retrieval relevance based on the active spec phase context. When a user is working within a specific phase of a phased spec folder, memories belonging to that phase (or its parent/sibling phases) receive scoring adjustments.

**Key properties:**
- Phase context derived from spec folder structure (e.g., `003-parent/001-phase-child`)
- Same-phase memories receive a boost; unrelated-phase memories receive a penalty
- Parent-phase memories are boosted at a lower factor than same-phase
- Phase columns added in schema v15 for persistent phase metadata

### Graph Signals Post-Processing

Graph signals are applied after the core scoring pipeline via `lib/graph/graph-signals.ts`. When enabled, they add two bounded bonuses to the current score:

- Momentum bonus: `clamp(momentum * 0.01, 0, 0.05)`
- Causal-depth bonus: `normalizedDepth * 0.05`

The causal-depth pass condenses strongly connected components, then computes longest-path depth across the resulting DAG. This preserves deeper causal chains even when shortcut edges exist, gives all members of a cycle the same bounded depth layer, and still leaves pure isolated cycles at `0` normalized depth.

<!-- /ANCHOR:key-concepts -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
scoring/
 composite-scoring.ts     # 5-factor and 6-factor composite scoring, N4 cold-start boost, score normalization
 importance-tiers.ts      # 6-tier importance configuration
 folder-scoring.ts        # Re-exports from @spec-kit/shared/scoring/folder-scoring
 confidence-tracker.ts    # User validation and promotion
 interference-scoring.ts  # TM-01 interference penalty for redundant memories (Sprint 2)
 mpab-aggregation.ts      # Multi-Parent Aggregated Bonus for chunk-to-memory score aggregation
 negative-feedback.ts     # Negative validation confidence multiplier with time-based recovery
 README.md                # This file
```

 succeeded in 0ms:
    startTime: startTime
  });
}

/* ───────────────────────────────────────────────────────────────
   7. MEMORY VALIDATE HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_validate tool - records user validation feedback to adjust confidence */
async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const {
    id,
    wasUseful,
    queryId,
    queryTerms,
    resultRank,
    totalResultsShown,
    searchMode,
    intent,
    sessionId,
    notes,
  } = args;

  if (id === undefined || id === null) {
    throw new Error('id is required');
  }

  if (typeof wasUseful !== 'boolean') {
    throw new Error('wasUseful is required and must be a boolean');
  }

  const memoryId = parseMemoryId(id);

  vectorIndex.initializeDb();
  const database = requireDb();
  const normalizedQueryId = typeof queryId === 'string' && queryId.trim().length > 0
    ? queryId.trim()
    : null;
  const queryText = resolveValidationQueryText(database, normalizedQueryId ?? undefined);
  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
  try {
    recordAdaptiveSignal(database, {
      memoryId,
      signalType: wasUseful ? 'outcome' : 'correction',
      signalValue: 1,
      query: queryText,
      actor: sessionId ?? 'memory_validate',
      metadata: {
        queryId: normalizedQueryId,
        queryText,
        resultRank: typeof resultRank === 'number' ? resultRank : null,
        totalResultsShown: typeof totalResultsShown === 'number' ? totalResultsShown : null,
        intent: intent ?? null,
      },
    });
  } catch (_error: unknown) {
    // Adaptive signals are best-effort only
  }

  // T002a: Auto-promotion wiring on positive feedback.
  let autoPromotion: {
    attempted: boolean;
    promoted: boolean;
    previousTier?: string;
    newTier?: string;
    reason?: string;
  } | null = null;

  if (wasUseful) {
    const promotionResult = executeAutoPromotion(database, memoryId);
    autoPromotion = {
      attempted: true,
      promoted: promotionResult.promoted,
      previousTier: promotionResult.previousTier,
      newTier: promotionResult.newTier,
      reason: promotionResult.reason,
    };
  }

  // T002b: Negative-feedback confidence signal persistence for runtime scoring.
  if (!wasUseful) {
    recordNegativeFeedbackEvent(database, memoryId);
  }

  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
  let learnedFeedback: {
    attempted: boolean;
    applied: boolean;
    termsLearned: string[];
    reason?: string;
  } | null = null;
  let groundTruthSelectionId: number | null = null;

  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
    groundTruthSelectionId = recordUserSelection(queryId, memoryId, {
      searchMode,
      intent,
      selectedRank: resultRank,
      totalResultsShown,
      sessionId,
      notes,
    });

    const normalizedTerms = Array.isArray(queryTerms)
      ? queryTerms.filter((term) => typeof term === 'string' && term.trim().length > 0).map((term) => term.trim())
      : [];

    if (typeof resultRank === 'number' && Number.isFinite(resultRank) && resultRank > 0 && normalizedTerms.length > 0) {
      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
      learnedFeedback = {
        attempted: true,
        applied: learnResult.applied,
        termsLearned: learnResult.terms,
        reason: learnResult.reason,
      };
    } else {
      learnedFeedback = {
        attempted: false,
        applied: false,
        termsLearned: [],
        reason: 'missing_query_terms_or_rank',
      };
    }
  }

  const summary = wasUseful
    ? `Positive validation recorded (confidence: ${result.confidence.toFixed(2)})`
    : `Negative validation recorded (confidence: ${result.confidence.toFixed(2)})`;

  const hints: string[] = [];
  if (result.promotionEligible) {
    hints.push('Memory eligible for promotion to critical tier');
  }
  if (!wasUseful && result.validationCount > 3) {
    hints.push('Consider updating or deleting this memory if consistently unhelpful');
  }

  return createMCPSuccessResponse({
    tool: 'memory_validate',
    summary,
    data: {
      memoryId,
      wasUseful: wasUseful,
      confidence: result.confidence,
      validationCount: result.validationCount,
      positiveValidationCount: result.positiveValidationCount,
      promotionEligible: result.promotionEligible,
      autoPromotion,
      learnedFeedback,

exec
/bin/zsh -lc "sed -n '880,980p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    }
    // Classify specific tool calls for finer-grained metrics
    if (name === 'memory_context' && args.mode === 'resume') {
      recordMetricEvent({ kind: 'memory_recovery' });
    }
    if (name.startsWith('code_graph_')) {
      recordMetricEvent({ kind: 'code_graph_query' });
    }
    if (typeof args.specFolder === 'string' && args.specFolder) {
      recordMetricEvent({ kind: 'spec_folder_change', specFolder: args.specFolder as string });
    }

    const dbReinitialized = await checkDatabaseUpdated();
    if (dbReinitialized) {
      await invalidateReinitializedDbCaches();
    }

    let sessionPrimeContext: AutoSurfaceResult | null = null;
    try {
      sessionPrimeContext = await primeSessionIfNeeded(
        name,
        args,
        sessionTrackingId,
      );
    } catch (primeErr: unknown) {
      const msg = primeErr instanceof Error ? primeErr.message : String(primeErr);
      console.error(`[context-server] Session priming failed (non-fatal): ${msg}`);
    }

    // SK-004/TM-05: Auto-surface memories before dispatch (after validation)
    let autoSurfacedContext: AutoSurfaceResult | null = null;
    const isCompactionLifecycleCall =
      name === 'memory_context' && args.mode === 'resume';

    const autoSurfaceStart = Date.now();
    if (MEMORY_AWARE_TOOLS.has(name)) {
      const contextHint: string | null = extractContextHint(args);
      if (contextHint) {
        try {
          if (isCompactionLifecycleCall) {
            autoSurfacedContext = await autoSurfaceAtCompaction(contextHint);
          } else {
            autoSurfacedContext = await autoSurfaceMemories(contextHint);
          }
        } catch (surfaceErr: unknown) {
          const msg = surfaceErr instanceof Error ? surfaceErr.message : String(surfaceErr);
          console.error(`[context-server] Auto-surface failed (non-fatal): ${msg}`);
        }
      }
    } else {
      try {
        autoSurfacedContext = await autoSurfaceAtToolDispatch(name, args);
      } catch (surfaceErr: unknown) {
        const msg = surfaceErr instanceof Error ? surfaceErr.message : String(surfaceErr);
        console.error(`[context-server] Tool-dispatch auto-surface failed (non-fatal): ${msg}`);
      }
    }
    const autoSurfaceLatencyMs = Date.now() - autoSurfaceStart;
    if (autoSurfaceLatencyMs > 250) {
      console.warn(`[context-server] Auto-surface precheck exceeded p95 target: ${autoSurfaceLatencyMs}ms`);
    }

    // Ensure database is initialized (safe no-op if already done)
    // P1-11 FIX: Module-level guard avoids redundant calls on every tool invocation
    if (!dbInitialized) {
      vectorIndex.initializeDb();
      dbInitialized = true;
    }

    // T303: Dispatch to tool modules
    const result = await dispatchTool(name, args) as ToolCallResponse | null;
    if (!result) {
      throw new Error(`Unknown tool: ${name}`);
    }

    let dispatchGraphContext: DispatchGraphContextMeta | null = null;
    if (!result.isError) {
      dispatchGraphContext = await resolveDispatchGraphContext(name, args);
    }

    runAfterToolCallbacks(name, callId, structuredClone(result));

    // REQ-014: Log follow_on_tool_use when a non-search tool is called after a recent search
    // Shadow-only: no ranking side effects. Fail-safe, never throws.
    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
      try {
        const { logFollowOnToolUse } = await import('./lib/feedback/query-flow-tracker.js');
        const { requireDb } = await import('./utils/index.js');
        const db = (() => { try { return requireDb(); } catch { return null; } })();
        const followOnSessionId = sessionTrackingId ?? lastKnownSessionId;
        if (db && followOnSessionId) {
          logFollowOnToolUse(db, followOnSessionId);
        }
      } catch { /* follow_on_tool_use logging must never break dispatch */ }
    }

    // Phase 024: Code-search redirect hint for memory tools
    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
      const queryStr = typeof args.query === 'string' ? args.query : typeof args.input === 'string' ? args.input : '';
      const codeSearchPattern = /\b(find code|implementation of|function that|where is|how does .+ work|class that|method for)\b/i;
      if (queryStr && codeSearchPattern.test(queryStr)) {

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Context Metrics
// ───────────────────────────────────────────────────────────────
// Phase 023: Lightweight session quality tracking.
// Collects events during MCP tool dispatch and computes quality scores.
// In-memory only — no DB persistence needed for now.

import { getStats as getGraphStats } from '../code-graph/code-graph-db.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export interface SessionMetrics {
  sessionId: string;
  startedAt: string;
  lastToolCallAt: string | null;
  toolCallCount: number;
  memoryRecoveryCalls: number;
  codeGraphQueries: number;
  specFolderTransitions: number;
  currentSpecFolder: string | null;
  primed: boolean;
}

export type QualityLevel = 'healthy' | 'degraded' | 'critical';

export interface QualityScore {
  level: QualityLevel;
  score: number; // 0.0 – 1.0
  factors: {
    recency: number;        // 1.0 if recent tool call, decays over time
    recovery: number;       // 1.0 if memory recovered this session
    graphFreshness: number; // 1.0 fresh, 0.5 stale, 0.0 empty
    continuity: number;     // 1.0 if spec folder stable, lower on transitions
  };
}

export type MetricEventKind =
  | 'tool_call'
  | 'memory_recovery'
  | 'code_graph_query'
  | 'spec_folder_change'
  | 'bootstrap';

export type BootstrapSource = 'hook' | 'mcp_auto' | 'agent' | 'manual' | 'tool';
export type BootstrapCompleteness = 'full' | 'partial' | 'minimal';

export interface BootstrapRecord {
  source: BootstrapSource;
  durationMs: number;
  completeness: BootstrapCompleteness;
  timestamp: string;
}

export interface MetricEvent {
  kind: MetricEventKind;
  toolName?: string;
  specFolder?: string;
}

/* ───────────────────────────────────────────────────────────────
   2. STATE
──────────────────────────────────────────────────────────────── */

const sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const startedAt = new Date().toISOString();

let lastToolCallAt: number | null = null;
let toolCallCount = 0;
let memoryRecoveryCalls = 0;
let codeGraphQueries = 0;
let specFolderTransitions = 0;
let currentSpecFolder: string | null = null;
let primed = false;
const bootstrapRecords: BootstrapRecord[] = [];

/* ───────────────────────────────────────────────────────────────
   3. CONSTANTS
──────────────────────────────────────────────────────────────── */

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const SIXTY_MINUTES_MS = 60 * 60 * 1000;
// Matches the session-snapshot graph staleness threshold.
const GRAPH_FRESHNESS_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

/* ───────────────────────────────────────────────────────────────
   4. EVENT RECORDING
──────────────────────────────────────────────────────────────── */

/** Record a metric event from tool dispatch or lifecycle hooks. */
export function recordMetricEvent(event: MetricEvent): void {
  switch (event.kind) {
    case 'tool_call':
      toolCallCount++;
      lastToolCallAt = Date.now();
      if (!primed) primed = true;
      break;

    case 'memory_recovery':
      memoryRecoveryCalls++;
      break;

    case 'code_graph_query':
      codeGraphQueries++;
      break;

    case 'spec_folder_change':
      if (event.specFolder && event.specFolder !== currentSpecFolder) {
        specFolderTransitions++;
        currentSpecFolder = event.specFolder;
      }
      break;

    case 'bootstrap':
      // Handled by recordBootstrapEvent — no-op here
      break;
  }
}

/** Phase 024 / Item 9: Record a bootstrap telemetry event. */
export function recordBootstrapEvent(
  source: BootstrapSource,
  durationMs: number,
  completeness: BootstrapCompleteness,
): void {
  bootstrapRecords.push({
    source,
    durationMs,
    completeness,
    timestamp: new Date().toISOString(),
  });
}

/** Get all bootstrap records for diagnostics. */
export function getBootstrapRecords(): readonly BootstrapRecord[] {
  return bootstrapRecords;
}

/* ───────────────────────────────────────────────────────────────
   5. METRICS SNAPSHOT
──────────────────────────────────────────────────────────────── */

/** Return a read-only snapshot of current session metrics. */
export function getSessionMetrics(): SessionMetrics {
  return {
    sessionId,
    startedAt,
    lastToolCallAt: lastToolCallAt ? new Date(lastToolCallAt).toISOString() : null,
    toolCallCount,
    memoryRecoveryCalls,
    codeGraphQueries,
    specFolderTransitions,
    currentSpecFolder,
    primed,
  };
}

/* ───────────────────────────────────────────────────────────────
   6. QUALITY SCORING
──────────────────────────────────────────────────────────────── */

/** Compute recency factor: 1.0 if <5 min, linear decay to 0.0 at 60 min. */
function computeRecency(): number {
  if (lastToolCallAt === null) return 0;
  const elapsed = Date.now() - lastToolCallAt;
  if (elapsed <= FIVE_MINUTES_MS) return 1.0;
  if (elapsed >= SIXTY_MINUTES_MS) return 0.0;
  // Linear decay between 5 min and 60 min
  return 1.0 - (elapsed - FIVE_MINUTES_MS) / (SIXTY_MINUTES_MS - FIVE_MINUTES_MS);
}

/** Compute recovery factor: 1.0 if any memory recovery call, 0.0 otherwise. */
function computeRecovery(): number {
  return memoryRecoveryCalls > 0 ? 1.0 : 0.0;
}

/** Compute graph freshness: 1.0 fresh, 0.5 stale, 0.0 empty/error. */
function computeGraphFreshness(): number {
  try {
    const stats = getGraphStats();
    if (stats.totalFiles === 0) return 0.0;
    if (!stats.lastScanTimestamp) return 0.5;
    const age = Date.now() - new Date(stats.lastScanTimestamp).getTime();
    return age <= GRAPH_FRESHNESS_THRESHOLD_MS ? 1.0 : 0.5;
  } catch {
    return 0.0;
  }
}

/** Compute continuity: 1.0 if 0-1 transitions, 0.5 if 2-3, 0.0 if >3. */
function computeContinuity(): number {
  if (specFolderTransitions <= 1) return 1.0;
  if (specFolderTransitions <= 3) return 0.5;
  return 0.0;
}

/**
 * F047: Single source of truth for lastToolCallAt timestamp.
 * session-health.ts should use this instead of the memory-surface duplicate.
 */
export function getLastToolCallAt(): number | null {
  return lastToolCallAt;
}

/** Compute overall quality score and level. */
export function computeQualityScore(): QualityScore {
  const factors = {
    recency: computeRecency(),
    recovery: computeRecovery(),
    graphFreshness: computeGraphFreshness(),
    continuity: computeContinuity(),
  };

  // F065: Weight rationale for quality score factors:
  //
  //   recency (0.35)       — Highest weight because stale sessions are the primary
  //                          degradation signal. A 60-min gap almost certainly means
  //                          the LLM's working context has drifted from the codebase.
  //
  //   continuity (0.25)    — Second-highest. Frequent spec folder switches indicate
  //                          context fragmentation; stable focus correlates with quality.
  //
  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
  //                          reliable signal that the session has recovered prior state.
  //                          Binary (done/not-done) so lower weight than continuous factors.
  //
  //   graphFreshness (0.20) — A stale code graph means structural queries return
  //                          outdated symbols. Tied with recovery because both are
  //                          "enabling" factors rather than direct quality signals.
  //
  //   Total: 0.35 + 0.25 + 0.20 + 0.20 = 1.00
  const score = (
    factors.recency * 0.35 +
    factors.recovery * 0.20 +
    factors.graphFreshness * 0.20 +
    factors.continuity * 0.25
  );

  let level: QualityLevel;

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
#!/usr/bin/env python3
"""
MemPalace MCP Server — read/write palace access for Claude Code
================================================================
Install: claude mcp add mempalace -- python -m mempalace.mcp_server [--palace /path/to/palace]

Tools (read):
  mempalace_status          — total drawers, wing/room breakdown
  mempalace_list_wings      — all wings with drawer counts
  mempalace_list_rooms      — rooms within a wing
  mempalace_get_taxonomy    — full wing → room → count tree
  mempalace_search          — semantic search, optional wing/room filter
  mempalace_check_duplicate — check if content already exists before filing

Tools (write):
  mempalace_add_drawer      — file verbatim content into a wing/room
  mempalace_delete_drawer   — remove a drawer by ID
"""

import argparse
import os
import sys
import json
import logging
import hashlib
from datetime import datetime
from pathlib import Path

from .config import MempalaceConfig, sanitize_name, sanitize_content
from .version import __version__
from .searcher import search_memories
from .palace_graph import traverse, find_tunnels, graph_stats
import chromadb

from .knowledge_graph import KnowledgeGraph

logging.basicConfig(level=logging.INFO, format="%(message)s", stream=sys.stderr)
logger = logging.getLogger("mempalace_mcp")


def _parse_args():
    parser = argparse.ArgumentParser(description="MemPalace MCP Server")
    parser.add_argument(
        "--palace",
        metavar="PATH",
        help="Path to the palace directory (overrides config file and env var)",
    )
    args, unknown = parser.parse_known_args()
    if unknown:
        logger.debug("Ignoring unknown args: %s", unknown)
    return args


_args = _parse_args()

if _args.palace:
    os.environ["MEMPALACE_PALACE_PATH"] = os.path.abspath(_args.palace)

_config = MempalaceConfig()
if _args.palace:
    _kg = KnowledgeGraph(db_path=os.path.join(_config.palace_path, "knowledge_graph.sqlite3"))
else:
    _kg = KnowledgeGraph()


_client_cache = None
_collection_cache = None


# ==================== WRITE-AHEAD LOG ====================
# Every write operation is logged to a JSONL file before execution.
# This provides an audit trail for detecting memory poisoning and
# enables review/rollback of writes from external or untrusted sources.

_WAL_DIR = Path(os.path.expanduser("~/.mempalace/wal"))
_WAL_DIR.mkdir(parents=True, exist_ok=True)
try:
    _WAL_DIR.chmod(0o700)
except (OSError, NotImplementedError):
    pass
_WAL_FILE = _WAL_DIR / "write_log.jsonl"


def _wal_log(operation: str, params: dict, result: dict = None):
    """Append a write operation to the write-ahead log."""
    entry = {
        "timestamp": datetime.now().isoformat(),
        "operation": operation,
        "params": params,
        "result": result,
    }
    try:
        with open(_WAL_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, default=str) + "\n")
        try:
            _WAL_FILE.chmod(0o600)
        except (OSError, NotImplementedError):
            pass
    except Exception as e:
        logger.error(f"WAL write failed: {e}")


_client_cache = None
_collection_cache = None


def _get_client():
    """Return a singleton ChromaDB PersistentClient."""
    global _client_cache
    if _client_cache is None:
        _client_cache = chromadb.PersistentClient(path=_config.palace_path)
    return _client_cache


def _get_collection(create=False):
    """Return the ChromaDB collection, caching the client between calls."""
    global _collection_cache
    try:
        client = _get_client()
        if create:
            _collection_cache = client.get_or_create_collection(_config.collection_name)
        elif _collection_cache is None:
            _collection_cache = client.get_collection(_config.collection_name)
        return _collection_cache
    except Exception:
        return None


def _no_palace():
    return {
        "error": "No palace found",
        "hint": "Run: mempalace init <dir> && mempalace mine <dir>",
    }


# ==================== READ TOOLS ====================


def tool_status():
    col = _get_collection()
    if not col:
        return _no_palace()
    count = col.count()
    wings = {}
    rooms = {}
    try:
        all_meta = col.get(include=["metadatas"], limit=10000)["metadatas"]
        for m in all_meta:
            w = m.get("wing", "unknown")
            r = m.get("room", "unknown")
            wings[w] = wings.get(w, 0) + 1
            rooms[r] = rooms.get(r, 0) + 1
    except Exception:
        pass
    return {
        "total_drawers": count,
        "wings": wings,
        "rooms": rooms,
        "palace_path": _config.palace_path,
        "protocol": PALACE_PROTOCOL,
        "aaak_dialect": AAAK_SPEC,
    }


# ── AAAK Dialect Spec ─────────────────────────────────────────────────────────
# Included in status response so the AI learns it on first wake-up call.
# Also available via mempalace_get_aaak_spec tool.

PALACE_PROTOCOL = """IMPORTANT — MemPalace Memory Protocol:
1. ON WAKE-UP: Call mempalace_status to load palace overview + AAAK spec.
2. BEFORE RESPONDING about any person, project, or past event: call mempalace_kg_query or mempalace_search FIRST. Never guess — verify.
3. IF UNSURE about a fact (name, gender, age, relationship): say "let me check" and query the palace. Wrong is worse than slow.
4. AFTER EACH SESSION: call mempalace_diary_write to record what happened, what you learned, what matters.
5. WHEN FACTS CHANGE: call mempalace_kg_invalidate on the old fact, mempalace_kg_add for the new one.

This protocol ensures the AI KNOWS before it speaks. Storage is not memory — but storage + this protocol = memory."""

AAAK_SPEC = """AAAK is a compressed memory dialect that MemPalace uses for efficient storage.
It is designed to be readable by both humans and LLMs without decoding.

FORMAT:
  ENTITIES: 3-letter uppercase codes. ALC=Alice, JOR=Jordan, RIL=Riley, MAX=Max, BEN=Ben.
  EMOTIONS: *action markers* before/during text. *warm*=joy, *fierce*=determined, *raw*=vulnerable, *bloom*=tenderness.
  STRUCTURE: Pipe-separated fields. FAM: family | PROJ: projects | ⚠: warnings/reminders.
  DATES: ISO format (2026-03-31). COUNTS: Nx = N mentions (e.g., 570x).
  IMPORTANCE: ★ to ★★★★★ (1-5 scale).
  HALLS: hall_facts, hall_events, hall_discoveries, hall_preferences, hall_advice.
  WINGS: wing_user, wing_agent, wing_team, wing_code, wing_myproject, wing_hardware, wing_ue5, wing_ai_research.
  ROOMS: Hyphenated slugs representing named ideas (e.g., chromadb-setup, gpu-pricing).

EXAMPLE:
  FAM: ALC→♡JOR | 2D(kids): RIL(18,sports) MAX(11,chess+swimming) | BEN(contributor)

Read AAAK naturally — expand codes mentally, treat *markers* as emotional context.
When WRITING AAAK: use entity codes, mark emotions, keep structure tight."""


def tool_list_wings():
    col = _get_collection()
    if not col:
        return _no_palace()
    wings = {}
    try:
        all_meta = col.get(include=["metadatas"], limit=10000)["metadatas"]
        for m in all_meta:
            w = m.get("wing", "unknown")
            wings[w] = wings.get(w, 0) + 1
    except Exception:
        pass
    return {"wings": wings}


def tool_list_rooms(wing: str = None):
    col = _get_collection()
    if not col:
        return _no_palace()
    rooms = {}
    try:
        kwargs = {"include": ["metadatas"], "limit": 10000}
        if wing:
            kwargs["where"] = {"wing": wing}
        all_meta = col.get(**kwargs)["metadatas"]
        for m in all_meta:
            r = m.get("room", "unknown")
            rooms[r] = rooms.get(r, 0) + 1
    except Exception:
        pass
    return {"wing": wing or "all", "rooms": rooms}


def tool_get_taxonomy():
    col = _get_collection()
    if not col:
        return _no_palace()
    taxonomy = {}
    try:
        all_meta = col.get(include=["metadatas"], limit=10000)["metadatas"]
        for m in all_meta:
            w = m.get("wing", "unknown")
            r = m.get("room", "unknown")

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
#!/usr/bin/env python3
"""
searcher.py — Find anything. Exact words.

Semantic search against the palace.
Returns verbatim text — the actual words, never summaries.
"""

import logging
from pathlib import Path

import chromadb

logger = logging.getLogger("mempalace_mcp")


class SearchError(Exception):
    """Raised when search cannot proceed (e.g. no palace found)."""


def search(query: str, palace_path: str, wing: str = None, room: str = None, n_results: int = 5):
    """
    Search the palace. Returns verbatim drawer content.
    Optionally filter by wing (project) or room (aspect).
    """
    try:
        client = chromadb.PersistentClient(path=palace_path)
        col = client.get_collection("mempalace_drawers")
    except Exception:
        print(f"\n  No palace found at {palace_path}")
        print("  Run: mempalace init <dir> then mempalace mine <dir>")
        raise SearchError(f"No palace found at {palace_path}")

    # Build where filter
    where = {}
    if wing and room:
        where = {"$and": [{"wing": wing}, {"room": room}]}
    elif wing:
        where = {"wing": wing}
    elif room:
        where = {"room": room}

    try:
        kwargs = {
            "query_texts": [query],
            "n_results": n_results,
            "include": ["documents", "metadatas", "distances"],
        }
        if where:
            kwargs["where"] = where

        results = col.query(**kwargs)

    except Exception as e:
        print(f"\n  Search error: {e}")
        raise SearchError(f"Search error: {e}") from e

    docs = results["documents"][0]
    metas = results["metadatas"][0]
    dists = results["distances"][0]

    if not docs:
        print(f'\n  No results found for: "{query}"')
        return

    print(f"\n{'=' * 60}")
    print(f'  Results for: "{query}"')
    if wing:
        print(f"  Wing: {wing}")
    if room:
        print(f"  Room: {room}")
    print(f"{'=' * 60}\n")

    for i, (doc, meta, dist) in enumerate(zip(docs, metas, dists), 1):
        similarity = round(1 - dist, 3)
        source = Path(meta.get("source_file", "?")).name
        wing_name = meta.get("wing", "?")
        room_name = meta.get("room", "?")

        print(f"  [{i}] {wing_name} / {room_name}")
        print(f"      Source: {source}")
        print(f"      Match:  {similarity}")
        print()
        # Print the verbatim text, indented
        for line in doc.strip().split("\n"):
            print(f"      {line}")
        print()
        print(f"  {'─' * 56}")

    print()


def search_memories(
    query: str, palace_path: str, wing: str = None, room: str = None, n_results: int = 5
) -> dict:
    """
    Programmatic search — returns a dict instead of printing.
    Used by the MCP server and other callers that need data.
    """
    try:
        client = chromadb.PersistentClient(path=palace_path)
        col = client.get_collection("mempalace_drawers")
    except Exception as e:
        logger.error("No palace found at %s: %s", palace_path, e)
        return {
            "error": "No palace found",
            "hint": "Run: mempalace init <dir> && mempalace mine <dir>",
        }

    # Build where filter
    where = {}
    if wing and room:
        where = {"$and": [{"wing": wing}, {"room": room}]}
    elif wing:
        where = {"wing": wing}
    elif room:
        where = {"room": room}

    try:
        kwargs = {
            "query_texts": [query],
            "n_results": n_results,
            "include": ["documents", "metadatas", "distances"],
        }
        if where:
            kwargs["where"] = where

        results = col.query(**kwargs)
    except Exception as e:
        return {"error": f"Search error: {e}"}

    docs = results["documents"][0]
    metas = results["metadatas"][0]
    dists = results["distances"][0]

    hits = []
    for doc, meta, dist in zip(docs, metas, dists):
        hits.append(
            {
                "text": doc,
                "wing": meta.get("wing", "unknown"),
                "room": meta.get("room", "unknown"),
                "source_file": Path(meta.get("source_file", "?")).name,
                "similarity": round(1 - dist, 3),
            }
        )

    return {
        "query": query,
        "filters": {"wing": wing, "room": room},
        "results": hits,
    }

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/conftest.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "check_regression|RESULTS_FILE|pytest_terminal_summary|baseline_report|regression" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:252:**Result:** All 6 question types at 100% R@5. 500/500 questions. No regressions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:2:Benchmark report utilities — JSON output and regression detection.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:5:conftest.py pytest_terminal_summary hook writes the collected results.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:13:RESULTS_FILE = os.path.join(tempfile.gettempdir(), "mempalace_bench_results.json")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:19:    if os.path.exists(RESULTS_FILE):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:21:            with open(RESULTS_FILE) as f:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:30:    with open(RESULTS_FILE, "w") as f:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:34:def check_regression(current_report: str, baseline_report: str, threshold: float = 0.2):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:38:    Returns a list of regression descriptions. Empty list = no regressions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:44:    with open(baseline_report) as f:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:47:    regressions = []
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:106:                    regressions.append(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:113:                    regressions.append(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py:117:    return regressions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py:93:def pytest_terminal_summary(terminalreporter, config):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:75:  report.py                # JSON report writer + regression checker
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:111:from tests.benchmarks.report import check_regression
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md:113:regressions = check_regression("current.json", "baseline.json", threshold=0.2)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py:271:            "Git bisect automated with custom test script for regression hunting",

 succeeded in 0ms:
"""
conftest.py — Shared fixtures for MemPalace tests.

Provides isolated palace and knowledge graph instances so tests never
touch the user's real data or leak temp files on failure.

HOME is redirected to a temp directory at module load time — before any
mempalace imports — so that module-level initialisations (e.g.
``_kg = KnowledgeGraph()`` in mcp_server) write to a throwaway location
instead of the real user profile.
"""

import os
import shutil
import tempfile

# ── Isolate HOME before any mempalace imports ──────────────────────────
_original_env = {}
_session_tmp = tempfile.mkdtemp(prefix="mempalace_session_")

for _var in ("HOME", "USERPROFILE", "HOMEDRIVE", "HOMEPATH"):
    _original_env[_var] = os.environ.get(_var)

os.environ["HOME"] = _session_tmp
os.environ["USERPROFILE"] = _session_tmp
os.environ["HOMEDRIVE"] = os.path.splitdrive(_session_tmp)[0] or "C:"
os.environ["HOMEPATH"] = os.path.splitdrive(_session_tmp)[1] or _session_tmp

# Now it is safe to import mempalace modules that trigger initialisation.
import chromadb  # noqa: E402
import pytest  # noqa: E402

from mempalace.config import MempalaceConfig  # noqa: E402
from mempalace.knowledge_graph import KnowledgeGraph  # noqa: E402


@pytest.fixture(autouse=True)
def _reset_mcp_cache():
    """Reset the MCP server's cached ChromaDB client/collection between tests."""

    def _clear_cache():
        try:
            from mempalace import mcp_server

            mcp_server._client_cache = None
            mcp_server._collection_cache = None
        except (ImportError, AttributeError):
            pass

    _clear_cache()
    yield
    _clear_cache()


@pytest.fixture(scope="session", autouse=True)
def _isolate_home():
    """Ensure HOME points to a temp dir for the entire test session.

    The env vars were already set at module level (above) so that
    module-level initialisations are captured.  This fixture simply
    restores the originals on teardown and cleans up the temp dir.
    """
    yield
    for var, orig in _original_env.items():
        if orig is None:
            os.environ.pop(var, None)
        else:
            os.environ[var] = orig
    shutil.rmtree(_session_tmp, ignore_errors=True)


@pytest.fixture
def tmp_dir():
    """Create and auto-cleanup a temporary directory."""
    d = tempfile.mkdtemp(prefix="mempalace_test_")
    yield d
    shutil.rmtree(d, ignore_errors=True)


@pytest.fixture
def palace_path(tmp_dir):
    """Path to an empty palace directory inside tmp_dir."""
    p = os.path.join(tmp_dir, "palace")
    os.makedirs(p)
    return p


@pytest.fixture
def config(tmp_dir, palace_path):
    """A MempalaceConfig pointing at the temp palace."""
    cfg_dir = os.path.join(tmp_dir, "config")
    os.makedirs(cfg_dir)
    import json

    with open(os.path.join(cfg_dir, "config.json"), "w") as f:
        json.dump({"palace_path": palace_path}, f)
    return MempalaceConfig(config_dir=cfg_dir)


@pytest.fixture
def collection(palace_path):
    """A ChromaDB collection pre-seeded in the temp palace."""
    client = chromadb.PersistentClient(path=palace_path)
    col = client.get_or_create_collection("mempalace_drawers")
    yield col
    client.delete_collection("mempalace_drawers")
    del client


@pytest.fixture
def seeded_collection(collection):
    """Collection with a handful of representative drawers."""
    collection.add(
        ids=[
            "drawer_proj_backend_aaa",
            "drawer_proj_backend_bbb",
            "drawer_proj_frontend_ccc",
            "drawer_notes_planning_ddd",
        ],
        documents=[
            "The authentication module uses JWT tokens for session management. "
            "Tokens expire after 24 hours. Refresh tokens are stored in HttpOnly cookies.",
            "Database migrations are handled by Alembic. We use PostgreSQL 15 "
            "with connection pooling via pgbouncer.",
            "The React frontend uses TanStack Query for server state management. "
            "All API calls go through a centralized fetch wrapper.",
            "Sprint planning: migrate auth to passkeys by Q3. "
            "Evaluate ChromaDB alternatives for vector search.",
        ],
        metadatas=[
            {
                "wing": "project",
                "room": "backend",
                "source_file": "auth.py",
                "chunk_index": 0,
                "added_by": "miner",
                "filed_at": "2026-01-01T00:00:00",
            },
            {
                "wing": "project",
                "room": "backend",
                "source_file": "db.py",
                "chunk_index": 0,
                "added_by": "miner",
                "filed_at": "2026-01-02T00:00:00",
            },
            {
                "wing": "project",
                "room": "frontend",
                "source_file": "App.tsx",
                "chunk_index": 0,
                "added_by": "miner",
                "filed_at": "2026-01-03T00:00:00",
            },
            {
                "wing": "notes",
                "room": "planning",
                "source_file": "sprint.md",
                "chunk_index": 0,
                "added_by": "miner",
                "filed_at": "2026-01-04T00:00:00",
            },
        ],
    )
    return collection


@pytest.fixture
def kg(tmp_dir):
    """An isolated KnowledgeGraph using a temp SQLite file."""
    db_path = os.path.join(tmp_dir, "test_kg.sqlite3")
    return KnowledgeGraph(db_path=db_path)


@pytest.fixture
def seeded_kg(kg):
    """KnowledgeGraph pre-loaded with sample triples."""
    kg.add_entity("Alice", entity_type="person")
    kg.add_entity("Max", entity_type="person")
    kg.add_entity("swimming", entity_type="activity")
    kg.add_entity("chess", entity_type="activity")

    kg.add_triple("Alice", "parent_of", "Max", valid_from="2015-04-01")
    kg.add_triple("Max", "does", "swimming", valid_from="2025-01-01")
    kg.add_triple("Max", "does", "chess", valid_from="2024-06-01")
    kg.add_triple("Alice", "works_at", "Acme Corp", valid_from="2020-01-01", valid_to="2024-12-31")
    kg.add_triple("Alice", "works_at", "NewCo", valid_from="2025-01-01")

    return kg

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"""Benchmark-specific pytest configuration, fixtures, and CLI options."""

import json
import os
import tempfile

import pytest


SCALE_OPTIONS = ["small", "medium", "large", "stress"]


def pytest_addoption(parser):
    parser.addoption(
        "--bench-scale",
        default="small",
        choices=SCALE_OPTIONS,
        help="Scale level for benchmark tests: small (1K), medium (10K), large (50K), stress (100K)",
    )
    parser.addoption(
        "--bench-report",
        default=None,
        help="Path for JSON benchmark report output",
    )


@pytest.fixture(scope="session")
def bench_scale(request):
    """The configured benchmark scale level."""
    return request.config.getoption("--bench-scale")


@pytest.fixture(scope="session")
def bench_report_path(request):
    """Path for JSON report output, or None."""
    return request.config.getoption("--bench-report")


@pytest.fixture
def palace_dir(tmp_path):
    """Isolated palace directory for a single test."""
    p = tmp_path / "palace"
    p.mkdir()
    return str(p)


@pytest.fixture
def kg_db(tmp_path):
    """Isolated KG SQLite path for a single test."""
    return str(tmp_path / "test_kg.sqlite3")


@pytest.fixture
def config_dir(tmp_path):
    """Isolated config directory for monkeypatching MempalaceConfig."""
    d = tmp_path / "config"
    d.mkdir()
    config = {"palace_path": str(tmp_path / "palace"), "collection_name": "mempalace_drawers"}
    with open(d / "config.json", "w") as f:
        json.dump(config, f)
    return str(d)


@pytest.fixture
def project_dir(tmp_path):
    """Temporary project directory for mining tests."""
    d = tmp_path / "project"
    d.mkdir()
    return d


# ── Session-scoped result collector ──────────────────────────────────────


class BenchmarkResults:
    """Collect benchmark metrics across all tests in a session."""

    def __init__(self):
        self.results = {}

    def record(self, category: str, metric: str, value):
        if category not in self.results:
            self.results[category] = {}
        self.results[category][metric] = value


@pytest.fixture(scope="session")
def bench_results():
    """Session-scoped results collector shared by all benchmark tests."""
    return BenchmarkResults()


def pytest_terminal_summary(terminalreporter, config):
    """Write JSON benchmark report after all tests complete."""
    report_path = config.getoption("--bench-report", default=None)
    if not report_path:
        return

    # Collect results written by individual tests via record_metric()
    import platform
    import subprocess

    try:
        git_sha = subprocess.check_output(
            ["git", "rev-parse", "--short", "HEAD"], text=True, stderr=subprocess.DEVNULL
        ).strip()
    except Exception:
        git_sha = "unknown"

    try:
        import chromadb

        chromadb_version = chromadb.__version__
    except Exception:
        chromadb_version = "unknown"

    report = {
        "timestamp": __import__("datetime").datetime.now().isoformat(),
        "git_sha": git_sha,
        "python_version": platform.python_version(),
        "chromadb_version": chromadb_version,
        "scale": config.getoption("--bench-scale", default="small"),
        "system": {
            "os": platform.system().lower(),
            "cpu_count": os.cpu_count(),
            "platform": platform.platform(),
        },
        "results": {},
    }

    # Read results from the temp file written by record_metric()
    results_file = os.path.join(tempfile.gettempdir(), "mempalace_bench_results.json")
    if os.path.exists(results_file):
        try:
            with open(results_file) as f:
                report["results"] = json.load(f)
            os.unlink(results_file)
        except Exception:
            pass

    os.makedirs(os.path.dirname(os.path.abspath(report_path)), exist_ok=True)
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    terminalreporter.write_line(f"\nBenchmark report written to: {report_path}")

 succeeded in 0ms:
# MemPalace Scale Benchmark Suite

106 tests that benchmark mempalace at scale to validate real-world performance limits.

## Why

MemPalace has strong academic scores (96.6% R@5 on LongMemEval) but no empirical data on how it behaves at scale. Key unknowns:

- `tool_status()` loads ALL metadata into memory — at what palace size does this OOM?
- `PersistentClient` is re-instantiated on every MCP call — what's the overhead?
- Modified files are never re-ingested — what's the skip-check cost at scale?
- How does query latency degrade as the palace grows from 1K to 100K drawers?
- Does wing/room filtering actually improve retrieval, and by how much?
- At what per-room drawer count does recall break regardless of filtering?

This suite finds those answers.

## Quick Start

```bash
# Fast smoke test (~2 min)
uv run pytest tests/benchmarks/ -v --bench-scale=small -m "benchmark and not slow"

# Full small scale (~35 min)
uv run pytest tests/benchmarks/ -v --bench-scale=small

# Medium scale with JSON report
uv run pytest tests/benchmarks/ -v --bench-scale=medium --bench-report=results.json

# Stress test (local only, very slow)
uv run pytest tests/benchmarks/ -v --bench-scale=stress -m stress
```

## Scale Levels

| Level   | Drawers | Wings | Rooms/Wing | KG Triples | Use case            |
|---------|---------|-------|------------|------------|---------------------|
| small   | 1,000   | 3     | 5          | 200        | CI, quick checks    |
| medium  | 10,000  | 8     | 12         | 2,000      | Pre-release testing |
| large   | 50,000  | 15    | 20         | 10,000     | Scale limit finding |
| stress  | 100,000 | 25    | 30         | 50,000     | Breaking point      |

## Test Modules

### Critical Path

| File | What it tests |
|------|--------------|
| `test_mcp_bench.py` | MCP tool response times, unbounded metadata fetch, client re-instantiation overhead |
| `test_chromadb_stress.py` | ChromaDB breaking point, query degradation curve, batch vs sequential insert |
| `test_memory_profile.py` | RSS/heap growth over repeated operations, leak detection |

### Performance Baselines

| File | What it tests |
|------|--------------|
| `test_ingest_bench.py` | Mining throughput (files/sec, drawers/sec), peak RSS, chunking speed, re-ingest skip overhead |
| `test_search_bench.py` | Query latency vs palace size, recall@k with planted needles, concurrent queries, n_results scaling |

### Architectural Validation

| File | What it tests |
|------|--------------|
| `test_palace_boost.py` | Retrieval improvement from wing/room filtering at different scales |
| `test_recall_threshold.py` | Per-room recall ceiling — isolates embedding model limit with all drawers in one bucket |
| `test_knowledge_graph_bench.py` | Triple insertion rate, temporal query accuracy, SQLite concurrent access |
| `test_layers_bench.py` | MemoryStack wake-up cost, Layer1 unbounded fetch, token budget compliance |

## Architecture

```
tests/benchmarks/
  conftest.py              # --bench-scale / --bench-report CLI options, fixtures, markers
  data_generator.py        # Deterministic data factory (seeded RNG, planted needles)
  report.py                # JSON report writer + regression checker
  test_*.py                # 9 test modules (106 tests total)
```

### Data Generator

`PalaceDataGenerator(seed=42, scale="small")` produces deterministic, realistic test data:

- **`generate_project_tree()`** — writes real files + `mempalace.yaml` for `mine()` to ingest
- **`populate_palace_directly()`** — bypasses mining, inserts directly into ChromaDB (10-100x faster for search/MCP benchmarks)
- **`generate_kg_triples()`** — entity-relationship triples with temporal validity
- **`generate_search_queries()`** — queries with known-good answers for recall measurement

**Planted needles**: Unique identifiable content (e.g., `NEEDLE_0042: PostgreSQL vacuum autovacuum threshold...`) seeded into specific wings/rooms. Search queries target these needles, enabling recall@k measurement without an LLM judge.

### JSON Reports

When run with `--bench-report=path.json`, produces machine-readable output:

```json
{
  "timestamp": "2026-04-07T...",
  "git_sha": "abc123",
  "scale": "small",
  "system": {"os": "linux", "cpu_count": 8},
  "results": {
    "mcp_status": {"latency_ms_at_1000": 45.2, "rss_delta_mb_at_5000": 12.3},
    "search": {"avg_latency_ms_at_5000": 23.1, "recall_at_5": 0.92},
    "chromadb_insert": {"sequential_ms": 8500, "batched_ms": 1200, "speedup_ratio": 7.1}
  }
}
```

### Regression Detection

```python
from tests.benchmarks.report import check_regression

regressions = check_regression("current.json", "baseline.json", threshold=0.2)
# Returns list of metric descriptions that degraded beyond 20%
```

## CI Integration

The GitHub Actions workflow runs benchmarks on PRs at small scale:

```yaml
benchmark:
  runs-on: ubuntu-latest
  if: github.event_name == 'pull_request'
  # Runs: pytest tests/benchmarks/ -m "benchmark and not stress and not slow" --bench-scale=small
```

Existing unit tests are isolated with `--ignore=tests/benchmarks`.

## Markers

- `@pytest.mark.benchmark` — all benchmark tests
- `@pytest.mark.slow` — tests taking >30s even at small scale
- `@pytest.mark.stress` — tests that should only run at large/stress scale

## Dependencies

Only one new dependency beyond the existing dev stack: `psutil` (for cross-platform RSS measurement). `tracemalloc` and `resource` are stdlib.

codex
# Iteration 028: BENCHMARK & METRICS

## Focus
BENCHMARK & METRICS: What does this system measure? What metrics should we track for memory quality, retrieval accuracy, and system health?

## Findings
### Finding 1: MemPalace measures three different things, but presents them under one benchmark story
- **Source**: [BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md), [tests/benchmarks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md), [tests/benchmarks/report.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py)
- **What it does**: README and benchmark docs emphasize retrieval scores like `R@5` and per-category recall, but the actual suite also records latency, `p95`, RSS growth, insertion throughput, concurrent failure counts, token budget, and speedup ratios via benchmark-only pytest modules and JSON reports.
- **Why it matters**: the right lesson for us is not “track one headline recall number,” but “separate retrieval accuracy, memory quality, and operational health into different scoreboards.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: MemPalace’s strongest metrics pattern is reproducible benchmark provenance, not the headline number itself
- **Source**: [tests/benchmarks/conftest.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py), [tests/benchmarks/report.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py)
- **What it does**: benchmark runs persist `timestamp`, `git_sha`, Python/Chroma versions, scale, system metadata, and per-category metrics to JSON, then compare current runs against baselines with direction-aware regression detection.
- **Why it matters**: our eval surfaces should keep this same provenance discipline so any ablation or dashboard delta is tied to an exact DB, code revision, channel set, and runtime config.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: MemPalace’s runtime status is not a real health dashboard
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py), [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md), [tests/benchmarks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md)
- **What it does**: `tool_status()` returns counts plus protocol text, but no latency, error-rate, degradation, or trend metrics; meanwhile the scale suite is outside default pytest and must be run explicitly.
- **Why it matters**: benchmark coverage and live health are different products. Public is already stronger here, and we should keep that separation explicit instead of treating `status` as proof of runtime health.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Spec Kit Memory already has the richer retrieval-accuracy stack
- **Source**: [lib/eval/eval-metrics.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts), [lib/eval/ablation-framework.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts), [lib/eval/reporting-dashboard.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts), [lib/eval/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md)
- **What it does**: Public computes `MRR`, `NDCG`, `recall`, `precision`, `F1`, `MAP`, `hit-rate`, inversion and constitutional metrics; ablation also tracks `Recall@20` contribution plus `MRR@5`, `P@5`, `R@5`, `NDCG@5`, `MAP`, `hit_rate`, `latency_p50`, `latency_p95`, and `token_usage`.
- **Why it matters**: the immediate gap is not metric math, but routine visibility and consistent use. Public should treat this eval stack as the canonical retrieval-accuracy surface.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Public already has the right raw ingredients for memory-quality metrics, but they need to be treated as first-class KPIs
- **Source**: [handlers/checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts), [lib/scoring/confidence-tracker.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts), [lib/scoring/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md), [lib/feedback/feedback-ledger.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts), [lib/feedback/query-flow-tracker.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts)
- **What it does**: `memory_validate` updates `confidence`, `validationCount`, `positiveValidationCount`, promotion eligibility, learned feedback, and negative feedback; the feedback ledger logs `search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, and `follow_on_tool_use`; scoring docs define HVR as useful validations divided by total validations.
- **Why it matters**: this is the right basis for memory quality because it measures whether a memory helped, not just whether it was retrieved.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Structural and temporal subsystems need correctness metrics, not just counts and latency
- **Source**: [tests/benchmarks/test_knowledge_graph_bench.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py), [handlers/session-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts), [handlers/memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [lib/session/context-metrics.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts)
- **What it does**: MemPalace benchmarks KG insertion, latency, and concurrent failures, but its temporal “accuracy” test mainly logs result counts; Public health surfaces are better on readiness and freshness, but they do not yet expose judged correctness metrics for code-graph, causal-link, or temporal-answer quality.
- **Why it matters**: for our system, system health should include not just “graph exists” or “latency is okay,” but “structural answers are still correct enough to trust.”
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Assessment
- New information ratio: 0.57

## Recommended Next Focus
Define a single Public scorecard with three lanes and explicit owners:
1. `memory quality`: HVR, confidence, negative-feedback rate, citation/use rate, reformulation rate.
2. `retrieval accuracy`: Recall@20, MRR@5, NDCG@5/10, P@5, MAP, hit rate, per-channel ablation delta, judged structural/temporal correctness.
3. `system health`: p50/p95 latency by stage, fallback/degraded-mode rate, graph freshness, session quality score, DB/schema health, embedding retry rate.


hook: Stop
hook: Stop Completed
tokens used
167,659
# Iteration 028: BENCHMARK & METRICS

## Focus
BENCHMARK & METRICS: What does this system measure? What metrics should we track for memory quality, retrieval accuracy, and system health?

## Findings
### Finding 1: MemPalace measures three different things, but presents them under one benchmark story
- **Source**: [BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md), [tests/benchmarks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md), [tests/benchmarks/report.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py)
- **What it does**: README and benchmark docs emphasize retrieval scores like `R@5` and per-category recall, but the actual suite also records latency, `p95`, RSS growth, insertion throughput, concurrent failure counts, token budget, and speedup ratios via benchmark-only pytest modules and JSON reports.
- **Why it matters**: the right lesson for us is not “track one headline recall number,” but “separate retrieval accuracy, memory quality, and operational health into different scoreboards.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: MemPalace’s strongest metrics pattern is reproducible benchmark provenance, not the headline number itself
- **Source**: [tests/benchmarks/conftest.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py), [tests/benchmarks/report.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py)
- **What it does**: benchmark runs persist `timestamp`, `git_sha`, Python/Chroma versions, scale, system metadata, and per-category metrics to JSON, then compare current runs against baselines with direction-aware regression detection.
- **Why it matters**: our eval surfaces should keep this same provenance discipline so any ablation or dashboard delta is tied to an exact DB, code revision, channel set, and runtime config.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: MemPalace’s runtime status is not a real health dashboard
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py), [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md), [tests/benchmarks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md)
- **What it does**: `tool_status()` returns counts plus protocol text, but no latency, error-rate, degradation, or trend metrics; meanwhile the scale suite is outside default pytest and must be run explicitly.
- **Why it matters**: benchmark coverage and live health are different products. Public is already stronger here, and we should keep that separation explicit instead of treating `status` as proof of runtime health.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Spec Kit Memory already has the richer retrieval-accuracy stack
- **Source**: [lib/eval/eval-metrics.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts), [lib/eval/ablation-framework.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts), [lib/eval/reporting-dashboard.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts), [lib/eval/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md)
- **What it does**: Public computes `MRR`, `NDCG`, `recall`, `precision`, `F1`, `MAP`, `hit-rate`, inversion and constitutional metrics; ablation also tracks `Recall@20` contribution plus `MRR@5`, `P@5`, `R@5`, `NDCG@5`, `MAP`, `hit_rate`, `latency_p50`, `latency_p95`, and `token_usage`.
- **Why it matters**: the immediate gap is not metric math, but routine visibility and consistent use. Public should treat this eval stack as the canonical retrieval-accuracy surface.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Public already has the right raw ingredients for memory-quality metrics, but they need to be treated as first-class KPIs
- **Source**: [handlers/checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts), [lib/scoring/confidence-tracker.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts), [lib/scoring/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md), [lib/feedback/feedback-ledger.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts), [lib/feedback/query-flow-tracker.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts)
- **What it does**: `memory_validate` updates `confidence`, `validationCount`, `positiveValidationCount`, promotion eligibility, learned feedback, and negative feedback; the feedback ledger logs `search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, and `follow_on_tool_use`; scoring docs define HVR as useful validations divided by total validations.
- **Why it matters**: this is the right basis for memory quality because it measures whether a memory helped, not just whether it was retrieved.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Structural and temporal subsystems need correctness metrics, not just counts and latency
- **Source**: [tests/benchmarks/test_knowledge_graph_bench.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py), [handlers/session-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts), [handlers/memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [lib/session/context-metrics.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts)
- **What it does**: MemPalace benchmarks KG insertion, latency, and concurrent failures, but its temporal “accuracy” test mainly logs result counts; Public health surfaces are better on readiness and freshness, but they do not yet expose judged correctness metrics for code-graph, causal-link, or temporal-answer quality.
- **Why it matters**: for our system, system health should include not just “graph exists” or “latency is okay,” but “structural answers are still correct enough to trust.”
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Assessment
- New information ratio: 0.57

## Recommended Next Focus
Define a single Public scorecard with three lanes and explicit owners:
1. `memory quality`: HVR, confidence, negative-feedback rate, citation/use rate, reformulation rate.
2. `retrieval accuracy`: Recall@20, MRR@5, NDCG@5/10, P@5, MAP, hit rate, per-channel ablation delta, judged structural/temporal correctness.
3. `system health`: p50/p95 latency by stage, fallback/degraded-mode rate, graph freshness, session quality score, DB/schema health, embedding retry rate.
