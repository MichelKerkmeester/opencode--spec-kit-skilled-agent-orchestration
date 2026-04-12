### Finding 4: Public should reject a separate L0/L1/L2/L3 engine and express wake-up behavior as profiles on the existing retrieval stack
- **Source**: [searcher.py#L21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L21), [searcher.py#L93](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L93), [layers.py#L76](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L76), [layers.py#L185](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L185), [layers.py#L250](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L250), [layers.py#L489](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L489), [memory-context.ts#L439](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L439), [memory-context.ts#L1322](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1322)
- **What it does**: MemPalace’s layer stack is conceptually neat, but it duplicates search/filter logic already present in `searcher.py`, emits formatted text rather than one authoritative structured result shape, and still uses rough token heuristics (`len(...) // 4`). Public already has profile-aware orchestration and budget enforcement in `memory_context`.
- **Why it matters for us**: For Public, a separate wake-up engine would duplicate ranking, result formatting, and token-budget logic we already solved elsewhere. If we want L0/L1-like behavior, it should be expressed as an existing `memory_context`/`session_bootstrap` profile, not as a parallel retrieval subsystem.
- **Recommendation**: reject
- **Impact**: medium

### Finding 5: Public should preserve its modular handler architecture and not absorb new memory features into a single giant server file
- **Source**: [mcp_server.py#L1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L1), [mcp_server.py#L590](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L590), [mcp_server.py#L848](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L848), [memory-context.ts#L1078](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1078), [memory-save.ts#L1273](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1273), [save-quality-gate.ts#L602](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L602), [context-server.ts#L1652](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1652)
- **What it does**: MemPalace’s `mcp_server.py` owns tool registration, bootstrap text, drawer writes, KG writes, diary writes, and JSON-RPC dispatch in one file. Public splits orchestration, retrieval, save validation, and server lifecycle into dedicated modules.
- **Why it matters for us**: The next wave of ideas here is taxonomy, hooks, and maybe identity UX. A monolithic merge would make write authority, governance, and review harder. The safer direction is to add any new capabilities as bounded handlers layered on top of the existing validated save/search contracts.
- **Recommendation**: adopt now
- **Impact**: medium

## Sources Consulted
- [phase-research-prompt.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/phase-research-prompt.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md)
- [external/pyproject.toml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml)
- [external/mempalace/cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py)
- [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py)
- [external/mempalace/searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py)
- [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py)
- [external/mempalace/palace_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py)
- [external/mempalace/knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py)
- [external/mempalace/miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py)
- [external/mempalace/convo_miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py)
- [external/mempalace/general_extractor.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py)
- [external/mempalace/onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py)
- [external/hooks/mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh)
- [external/hooks/mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh)
- [external/benchmarks/BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [iteration-011.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-011.md)

## Assessment
- New information ratio: 0.72
- Questions addressed: bootstrap authority, compaction-survival strategy, taxonomy routing risk, wake-up layering reuse, modularity vs monolith
- Questions answered: the main refactor is consolidation, not expansion; Public should centralize bootstrap/save authority, keep taxonomy auxiliary, and resist adding a parallel wake-up engine or monolithic memory server

## Reflection
- What worked: tracing MemPalace’s README corrections against the actual Python implementation and then comparing those mechanics directly to Public’s live bootstrap, save, and compaction code made the real architectural tradeoffs stand out quickly
- What did not work: the phase root currently only contains `phase-research-prompt.md`, so the brief’s expected Level 3 root docs are not present even though `validate.sh --strict` still passed as inferred Level 1; I also could not run the write-based `spec_kit:deep-research`, report updates, or memory save steps in this read-only sandbox

## Recommended Next Focus
Create a narrow Public-side refactor packet around authority surfaces: make one bootstrap owner, make one validated hook-to-save path, and treat taxonomy as a browse overlay that never outranks hybrid query retrieval.

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

OUTPUT FORMAT (MANDATORY - follow this exactly):
# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

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
I’m treating this as a read-only deep research pass over the MemPalace source plus our current memory stack, with the phase folder already pre-approved as you specified. I’m doing a quick memory/context pass first, then I’ll trace the external implementation files in the order from your brief and compare them directly against Public’s live handlers.
2026-04-10T20:12:27.222300Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "python3 - <<'PY'
from pathlib import Path
p = Path('/Users/michelkerkmeester/.codex/memories/MEMORY.md')
text = p.read_text(errors='ignore').splitlines()
keywords = ['mempalace', 'hybrid-rag-fusion', 'deep research', 'memory architecture', 'raw verbatim', 'hooks', 'wake-up', 'knowledge graph']
for i,line in enumerate(text,1):
    low = line.lower()
    if any(k in low for k in keywords):
        print(f\"{i}:{line}\")
PY"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
exec
/bin/zsh -lc "sed -n '1,260p' AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "pwd && printf '\\n---\\n' && rg --files -g 'AGENTS.md' . /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins | sed 's#"'^#FILE:#'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

---
FILE:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md
FILE:./AGENTS.md
FILE:./.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/external/opencode-lcm-master/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/007-relay-main/external/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/e2e/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop-electron/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/test/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-omp/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/e2e-artifacts/session-create-internal/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/external/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-github/AGENTS.md
FILE:./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-pi/AGENTS.md

codex
I’ve confirmed the external repo does have its own `external/AGENTS.md`, so I’m folding that into the read-only research scope now. Next I’m pulling prior memory notes plus the external instructions, then I’ll trace MemPalace from CLI and MCP entrypoints into retrieval, hooks, and the separate graph layers.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
The repo-level and external instructions line up with a straightforward source-tracing pass: CLI and search are small, while `mcp_server.py` and the layer files are where the architectural pressure points live. I’m checking prior memory notes, the deep-research skill guidance, and the phase-folder readiness/validation state before I extract the new paradigm-shift findings.
exec
/bin/zsh -lc 'rg -n -i "mempalace|hybrid-rag-fusion|raw verbatim|wake-up|hooks|knowledge graph|taxonomy" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13:- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 005-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict
130:- docs(026-runtime), no runtime code edits, staged runtime packet docs first, validate.sh 002-implement-cache-warning-hooks, validate.sh 005-code-graph-upgrades, description.json memory/metadata.json untouched
235:- scoped verifier baseline showed 0 errors and only two in-scope warnings (`TS-MODULE-HEADER` on `publication-gate.ts` and `test/hooks/replay-harness.ts`); this is the operative drift set for that HEAD~10 window [Task 1]
242:scope: redundancy-driven doc updates in `002-implement-cache-warning-hooks` and `003-memory-quality-issues`, plus Phase 6 plan recall tied to completed research authority
253:- 002-implement-cache-warning-hooks, 003-memory-quality-issues, compact continuity wrapper, decision-record.md, implementation-summary.md, spec/validate.sh --strict, template-only anchor/header mismatch
285:## Task 1: Add MemPalace phase-root prompt with Level-3 gating and evidence-bound research instructions, outcome success
293:- 005-mempalace, phase-research-prompt.md, dont ask for a spec folder, 13-section TIDD-EC, source-confirmed README-documented benchmark-documented, raw-verbatim hooks taxonomy temporal KG
335:## Task 6: Harmonize `002-implement-cache-warning-hooks` with canonical post-2026-04-08 research sequencing and acceptance criteria, outcome success
343:- 002-implement-cache-warning-hooks, canonical research, sequencing prerequisites acceptance criteria, producer metadata, normalized analytics reader, cache token carry-forward, bootstrap authority, UserPromptSubmit demoted
367:- when the user asked to "create a similar prompt for ...005-mempalace ... dont ask for a spec folder," place `phase-research-prompt.md` in the phase root and skip new spec-folder scaffolding [Task 1]
380:- MemPalace-specific guardrails that proved useful: AAAK remains experimental/lossy, raw ChromaDB verbatim posture is baseline, and benchmark/README claims need code-backed verification before adoption [Task 1]
388:- canonical source for `002-implement-cache-warning-hooks` updates is the post-2026-04-08 synthesis in `001-research-graph-context-systems/research.md` and `research/recommendations.md`; align ordering/prereqs/acceptance there and keep task wording consistent about `.claude/settings.local.json` boundaries [Task 6]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
532:- query-flow-tracker, memory-search-ux-hooks.vitest.ts, feedback-ledger.vitest.ts, includeContent, search_shown, stale dist restart
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
787:- hook path truth is `mcp_server/hooks/claude/*.ts` and compiled `mcp_server/dist/hooks/claude/*.js`; avoid stale `scripts/hooks/claude/` references [Task 4]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1618:- checkContentHashDedup, status duplicate, postMutationHooks, generateContinueSessionMd, hydra-spec-pack-consistency.vitest.ts
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1865:- rollout_summaries/2026-03-13T11-17-08-0feG-ux_hooks_auto_review_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-17-08-019ce6ea-1d8c-74d2-8e3c-3aa526c1878a.jsonl, updated_at=2026-03-13T11:40:34+00:00, thread_id=019ce6ea-1d8c-74d2-8e3c-3aa526c1878a)
1956:## Task 3: Apply lifecycle and UX hooks remediation fixes with targeted+broad verification
1961:- rollout_summaries/2026-03-12T16-58-17-S6j2-ux_hooks_comprehensive_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T17-58-17-019ce2fc-1651-7ef3-bf8a-225e52ad5cd4.jsonl, updated_at=2026-03-12T18:24:29+00:00, thread_id=019ce2fc-1651-7ef3-bf8a-225e52ad5cd4)
1965:- cancelIngestJob retry, ALLOWED_BASE_PATHS startup recovery, MutationHookResult.errors, hooks-ux-feedback.vitest.ts, verify_alignment_drift.py
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]
2115:- Keep module-header plus numbered uppercase sections (`IMPORTS`, `COMPONENT`, `HOOKS AND LOCAL STATE`, `DERIVED STATE`, `HANDLERS`, `EFFECTS`, `RENDER`) so future diffs stay navigable [Task 1]

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "printf 'Phase docs:\\n' && ls -1 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace | rg '"'^(spec|plan|tasks|checklist|decision-record|implementation-summary)'"\\.md"'$|''^research$'"' && printf '\\nValidation:\\n' && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace\" --strict" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1416ms:

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace
  Level:  1 (inferred)

───────────────────────────────────────────────────────────────


.opencode/skill/system-spec-kit/scripts/spec/validate.sh: line 406: cannot create temp file for here document: Operation not permitted

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 0

  RESULT: PASSED


2026-04-10T20:12:47.440355Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 61
codex
Validation is still running, so I’m polling that while I gather the code paths I’ll need for the actual comparison. The key memory note so far is useful but narrow: this phase already established the honesty boundaries around raw-verbatim storage, hooks, taxonomy, and AAAK, which lets me focus this pass on deeper architectural shifts instead of repeating the earlier baseline.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	<div align="center">
     2	
     3	<img src="assets/mempalace_logo.png" alt="MemPalace" width="280">
     4	
     5	# MemPalace
     6	
     7	### The highest-scoring AI memory system ever benchmarked. And it's free.
     8	
     9	<br>
    10	
    11	Every conversation you have with an AI — every decision, every debugging session, every architecture debate — disappears when the session ends. Six months of work, gone. You start over every time.
    12	
    13	Other memory systems try to fix this by letting AI decide what's worth remembering. It extracts "user prefers Postgres" and throws away the conversation where you explained *why*. MemPalace takes a different approach: **store everything, then make it findable.**
    14	
    15	**The Palace** — Ancient Greek orators memorized entire speeches by placing ideas in rooms of an imaginary building. Walk through the building, find the idea. MemPalace applies the same principle to AI memory: your conversations are organized into wings (people and projects), halls (types of memory), and rooms (specific ideas). No AI decides what matters — you keep every word, and the structure gives you a navigable map instead of a flat search index.
    16	
    17	**Raw verbatim storage** — MemPalace stores your actual exchanges in ChromaDB without summarization or extraction. The 96.6% LongMemEval result comes from this raw mode. We don't burn an LLM to decide what's "worth remembering" — we keep everything and let semantic search find it.
    18	
    19	**AAAK (experimental)** — A lossy abbreviation dialect for packing repeated entities into fewer tokens at scale. Readable by any LLM that reads text — Claude, GPT, Gemini, Llama, Mistral — no decoder needed. **AAAK is a separate compression layer, not the storage default**, and on the LongMemEval benchmark it currently regresses vs raw mode (84.2% vs 96.6%). We're iterating. See the [note above](#a-note-from-milla--ben--april-7-2026) for the honest status.
    20	
    21	**Local, open, adaptable** — MemPalace runs entirely on your machine, on any data you have locally, without using any external API or services. It has been tested on conversations — but it can be adapted for different types of datastores. This is why we're open-sourcing it.
    22	
    23	<br>
    24	
    25	[![][version-shield]][release-link]
    26	[![][python-shield]][python-link]
    27	[![][license-shield]][license-link]
    28	[![][discord-shield]][discord-link]
    29	
    30	<br>
    31	
    32	[Quick Start](#quick-start) · [The Palace](#the-palace) · [AAAK Dialect](#aaak-dialect-experimental) · [Benchmarks](#benchmarks) · [MCP Tools](#mcp-server)
    33	
    34	<br>
    35	
    36	### Highest LongMemEval score ever published — free or paid.
    37	
    38	<table>
    39	<tr>
    40	<td align="center"><strong>96.6%</strong><br><sub>LongMemEval R@5<br><b>raw mode</b>, zero API calls</sub></td>
    41	<td align="center"><strong>500/500</strong><br><sub>questions tested<br>independently reproduced</sub></td>
    42	<td align="center"><strong>$0</strong><br><sub>No subscription<br>No cloud. Local only.</sub></td>
    43	</tr>
    44	</table>
    45	
    46	<sub>Reproducible — runners in <a href="benchmarks/">benchmarks/</a>. <a href="benchmarks/BENCHMARKS.md">Full results</a>. The 96.6% is from <b>raw verbatim mode</b>, not AAAK or rooms mode (those score lower — see <a href="#a-note-from-milla--ben--april-7-2026">note above</a>).</sub>
    47	
    48	</div>
    49	
    50	---
    51	
    52	## A Note from Milla & Ben — April 7, 2026
    53	
    54	> The community caught real problems in this README within hours of launch and we want to address them directly.
    55	>
    56	> **What we got wrong:**
    57	>
    58	> - **The AAAK token example was incorrect.** We used a rough heuristic (`len(text)//3`) for token counts instead of an actual tokenizer. Real counts via OpenAI's tokenizer: the English example is 66 tokens, the AAAK example is 73. AAAK does not save tokens at small scales — it's designed for *repeated entities at scale*, and the README example was a bad demonstration of that. We're rewriting it.
    59	>
    60	> - **"30x lossless compression" was overstated.** AAAK is a lossy abbreviation system (entity codes, sentence truncation). Independent benchmarks show AAAK mode scores **84.2% R@5 vs raw mode's 96.6%** on LongMemEval — a 12.4 point regression. The honest framing is: AAAK is an experimental compression layer that trades fidelity for token density, and **the 96.6% headline number is from RAW mode, not AAAK**.
    61	>
    62	> - **"+34% palace boost" was misleading.** That number compares unfiltered search to wing+room metadata filtering. Metadata filtering is a standard ChromaDB feature, not a novel retrieval mechanism. Real and useful, but not a moat.
    63	>
    64	> - **"Contradiction detection"** exists as a separate utility (`fact_checker.py`) but is not currently wired into the knowledge graph operations as the README implied.
    65	>
    66	> - **"100% with Haiku rerank"** is real (we have the result files) but the rerank pipeline is not in the public benchmark scripts. We're adding it.
    67	>
    68	> **What's still true and reproducible:**
    69	>
    70	> - **96.6% R@5 on LongMemEval in raw mode**, on 500 questions, zero API calls — independently reproduced on M2 Ultra in under 5 minutes by [@gizmax](https://github.com/milla-jovovich/mempalace/issues/39).
    71	> - Local, free, no subscription, no cloud, no data leaving your machine.
    72	> - The architecture (wings, rooms, closets, drawers) is real and useful, even if it's not a magical retrieval boost.
    73	>
    74	> **What we're doing:**
    75	>
    76	> 1. Rewriting the AAAK example with real tokenizer counts and a scenario where AAAK actually demonstrates compression
    77	> 2. Adding `mode raw / aaak / rooms` clearly to the benchmark documentation so the trade-offs are visible
    78	> 3. Wiring `fact_checker.py` into the KG ops so the contradiction detection claim becomes true
    79	> 4. Pinning ChromaDB to a tested range (Issue #100), fixing the shell injection in hooks (#110), and addressing the macOS ARM64 segfault (#74)
    80	>
    81	> **Thank you to everyone who poked holes in this.** Brutal honest criticism is exactly what makes open source work, and it's what we asked for. Special thanks to [@panuhorsmalahti](https://github.com/milla-jovovich/mempalace/issues/43), [@lhl](https://github.com/milla-jovovich/mempalace/issues/27), [@gizmax](https://github.com/milla-jovovich/mempalace/issues/39), and everyone who filed an issue or a PR in the first 48 hours. We're listening, we're fixing, and we'd rather be right than impressive.
    82	>
    83	> — *Milla Jovovich & Ben Sigman*
    84	
    85	---
    86	
    87	## Quick Start
    88	
    89	```bash
    90	pip install mempalace
    91	
    92	# Set up your world — who you work with, what your projects are
    93	mempalace init ~/projects/myapp
    94	
    95	# Mine your data
    96	mempalace mine ~/projects/myapp                    # projects — code, docs, notes
    97	mempalace mine ~/chats/ --mode convos              # convos — Claude, ChatGPT, Slack exports
    98	mempalace mine ~/chats/ --mode convos --extract general  # general — classifies into decisions, milestones, problems
    99	
   100	# Search anything you've ever discussed
   101	mempalace search "why did we switch to GraphQL"
   102	
   103	# Your AI remembers
   104	mempalace status
   105	```
   106	
   107	Three mining modes: **projects** (code and docs), **convos** (conversation exports), and **general** (auto-classifies into decisions, preferences, milestones, problems, and emotional context). Everything stays on your machine.
   108	
   109	---
   110	
   111	## How You Actually Use It
   112	
   113	After the one-time setup (install → init → mine), you don't run MemPalace commands manually. Your AI uses it for you. There are two ways, depending on which AI you use.
   114	
   115	### With Claude Code (recommended)
   116	
   117	Native marketplace install:
   118	
   119	```bash
   120	claude plugin marketplace add milla-jovovich/mempalace
   121	claude plugin install --scope user mempalace
   122	```
   123	
   124	Restart Claude Code, then type `/skills` to verify "mempalace" appears.
   125	
   126	### With Claude, ChatGPT, Cursor, Gemini (MCP-compatible tools)
   127	
   128	```bash
   129	# Connect MemPalace once
   130	claude mcp add mempalace -- python -m mempalace.mcp_server
   131	```
   132	
   133	Now your AI has 19 tools available through MCP. Ask it anything:
   134	
   135	> *"What did we decide about auth last month?"*
   136	
   137	Claude calls `mempalace_search` automatically, gets verbatim results, and answers you. You never type `mempalace search` again. The AI handles it.
   138	
   139	MemPalace also works natively with **Gemini CLI** (which handles the server and save hooks automatically) — see the [Gemini CLI Integration Guide](examples/gemini_cli_setup.md).
   140	
   141	### With local models (Llama, Mistral, or any offline LLM)
   142	
   143	Local models generally don't speak MCP yet. Two approaches:
   144	
   145	**1. Wake-up command** — load your world into the model's context:
   146	
   147	```bash
   148	mempalace wake-up > context.txt
   149	# Paste context.txt into your local model's system prompt
   150	```
   151	
   152	This gives your local model ~170 tokens of critical facts (in AAAK if you prefer) before you ask a single question.
   153	
   154	**2. CLI search** — query on demand, feed results into your prompt:
   155	
   156	```bash
   157	mempalace search "auth decisions" > results.txt
   158	# Include results.txt in your prompt
   159	```
   160	
   161	Or use the Python API:
   162	
   163	```python
   164	from mempalace.searcher import search_memories
   165	results = search_memories("auth decisions", palace_path="~/.mempalace/palace")
   166	# Inject into your local model's context
   167	```
   168	
   169	Either way — your entire memory stack runs offline. ChromaDB on your machine, Llama on your machine, AAAK for compression, zero cloud calls.
   170	
   171	---
   172	
   173	## The Problem
   174	
   175	Decisions happen in conversations now. Not in docs. Not in Jira. In conversations with Claude, ChatGPT, Copilot. The reasoning, the tradeoffs, the "we tried X and it failed because Y" — all trapped in chat windows that evaporate when the session ends.
   176	
   177	**Six months of daily AI use = 19.5 million tokens.** That's every decision, every debugging session, every architecture debate. Gone.
   178	
   179	| Approach | Tokens loaded | Annual cost |
   180	|----------|--------------|-------------|
   181	| Paste everything | 19.5M — doesn't fit any context window | Impossible |
   182	| LLM summaries | ~650K | ~$507/yr |
   183	| **MemPalace wake-up** | **~170 tokens** | **~$0.70/yr** |
   184	| **MemPalace + 5 searches** | **~13,500 tokens** | **~$10/yr** |
   185	
   186	MemPalace loads 170 tokens of critical facts on wake-up — your team, your projects, your preferences. Then searches only when needed. $10/year to remember everything vs $507/year for summaries that lose context.
   187	
   188	---
   189	
   190	## How It Works
   191	
   192	### The Palace
   193	
   194	The layout is fairly simple, though it took a long time to get there.
   195	
   196	It starts with a **wing**. Every project, person, or topic you're filing gets its own wing in the palace.
   197	
   198	Each wing has **rooms** connected to it, where information is divided into subjects that relate to that wing — so every room is a different element of what your project contains. Project ideas could be one room, employees could be another, financial statements another. There can be an endless number of rooms that split the wing into sections. The MemPalace install detects these for you automatically, and of course you can personalize it any way you feel is right.
   199	
   200	Every room has a **closet** connected to it, and here's where things get interesting. We've developed an AI language called **AAAK**. Don't ask — it's a whole story of its own. Your agent learns the AAAK shorthand every time it wakes up. Because AAAK is essentially English, but a very truncated version, your agent understands how to use it in seconds. It comes as part of the install, built into the MemPalace code. In our next update, we'll add AAAK directly to the closets, which will be a real game changer — the amount of info in the closets will be much bigger, but it will take up far less space and far less reading time for your agent.
   201	
   202	Inside those closets are **drawers**, and those drawers are where your original files live. In this first version, we haven't used AAAK as a closet tool, but even so, the summaries have shown **96.6% recall** in all the benchmarks we've done across multiple benchmarking platforms. Once the closets use AAAK, searches will be even faster while keeping every word exact. But even now, the closet approach has been a huge boon to how much info is stored in a small space — it's used to easily point your AI agent to the drawer where your original file lives. You never lose anything, and all this happens in seconds.
   203	
   204	There are also **halls**, which connect rooms within a wing, and **tunnels**, which connect rooms from different wings to one another. So finding things becomes truly effortless — we've given the AI a clean and organized way to know where to start searching, without having to look through every keyword in huge folders.
   205	
   206	You say what you're looking for and boom, it already knows which wing to go to. Just *that* in itself would have made a big difference. But this is beautiful, elegant, organic, and most importantly, efficient.
   207	
   208	```
   209	  ┌─────────────────────────────────────────────────────────────┐
   210	  │  WING: Person                                              │
   211	  │                                                            │
   212	  │    ┌──────────┐  ──hall──  ┌──────────┐                    │
   213	  │    │  Room A  │            │  Room B  │                    │
   214	  │    └────┬─────┘            └──────────┘                    │
   215	  │         │                                                  │
   216	  │         ▼                                                  │
   217	  │    ┌──────────┐      ┌──────────┐                          │
   218	  │    │  Closet  │ ───▶ │  Drawer  │                          │
   219	  │    └──────────┘      └──────────┘                          │
   220	  └─────────┼──────────────────────────────────────────────────┘
   221	            │
   222	          tunnel
   223	            │
   224	  ┌─────────┼──────────────────────────────────────────────────┐
   225	  │  WING: Project                                             │
   226	  │         │                                                  │
   227	  │    ┌────┴─────┐  ──hall──  ┌──────────┐                    │
   228	  │    │  Room A  │            │  Room C  │                    │
   229	  │    └────┬─────┘            └──────────┘                    │
   230	  │         │                                                  │
   231	  │         ▼                                                  │
   232	  │    ┌──────────┐      ┌──────────┐                          │
   233	  │    │  Closet  │ ───▶ │  Drawer  │                          │
   234	  │    └──────────┘      └──────────┘                          │
   235	  └─────────────────────────────────────────────────────────────┘
   236	```
   237	
   238	**Wings** — a person or project. As many as you need.
   239	**Rooms** — specific topics within a wing. Auth, billing, deploy — endless rooms.
   240	**Halls** — connections between related rooms *within* the same wing. If Room A (auth) and Room B (security) are related, a hall links them.
   241	**Tunnels** — connections *between* wings. When Person A and a Project both have a room about "auth," a tunnel cross-references them automatically.
   242	**Closets** — summaries that point to the original content. (In v3.0.0 these are plain-text summaries; AAAK-encoded closets are coming in a future update — see [Task #30](https://github.com/milla-jovovich/mempalace/issues/30).)
   243	**Drawers** — the original verbatim files. The exact words, never summarized.
   244	
   245	**Halls** are memory types — the same in every wing, acting as corridors:
   246	- `hall_facts` — decisions made, choices locked in
   247	- `hall_events` — sessions, milestones, debugging
   248	- `hall_discoveries` — breakthroughs, new insights
   249	- `hall_preferences` — habits, likes, opinions
   250	- `hall_advice` — recommendations and solutions
   251	
   252	**Rooms** are named ideas — `auth-migration`, `graphql-switch`, `ci-pipeline`. When the same room appears in different wings, it creates a **tunnel** — connecting the same topic across domains:
   253	
   254	```
   255	wing_kai       / hall_events / auth-migration  → "Kai debugged the OAuth token refresh"
   256	wing_driftwood / hall_facts  / auth-migration  → "team decided to migrate auth to Clerk"
   257	wing_priya     / hall_advice / auth-migration  → "Priya approved Clerk over Auth0"
   258	```
   259	
   260	Same room. Three wings. The tunnel connects them.

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml | sed -n '1,220p' && printf '\\n--- CLI ---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	[project]
     2	name = "mempalace"
     3	version = "3.1.0"
     4	description = "Give your AI a memory — mine projects and conversations into a searchable palace. No API key required."
     5	readme = "README.md"
     6	requires-python = ">=3.9"
     7	license = "MIT"
     8	authors = [
     9	    {name = "milla-jovovich"},
    10	]
    11	keywords = [
    12	    "ai", "memory", "llm", "rag", "chromadb", "mcp",
    13	    "vector-database", "claude", "chatgpt", "embeddings",
    14	]
    15	classifiers = [
    16	    "Development Status :: 4 - Beta",
    17	    "Environment :: Console",
    18	    "Intended Audience :: Developers",
    19	    "Programming Language :: Python :: 3",
    20	    "Programming Language :: Python :: 3.9",
    21	    "Programming Language :: Python :: 3.10",
    22	    "Programming Language :: Python :: 3.11",
    23	    "Programming Language :: Python :: 3.12",
    24	    "Topic :: Scientific/Engineering :: Artificial Intelligence",
    25	    "Topic :: Utilities",
    26	]
    27	dependencies = [
    28	    "chromadb>=0.5.0,<0.7",
    29	    "pyyaml>=6.0,<7",
    30	]
    31	
    32	[project.urls]
    33	Homepage = "https://github.com/milla-jovovich/mempalace"
    34	Repository = "https://github.com/milla-jovovich/mempalace"
    35	"Bug Tracker" = "https://github.com/milla-jovovich/mempalace/issues"
    36	
    37	[project.scripts]
    38	mempalace = "mempalace:main"
    39	
    40	[project.optional-dependencies]
    41	dev = ["pytest>=7.0", "pytest-cov>=4.0", "ruff>=0.4.0", "psutil>=5.9"]
    42	spellcheck = ["autocorrect>=2.0"]
    43	
    44	[dependency-groups]
    45	dev = ["pytest>=7.0", "pytest-cov>=4.0", "ruff>=0.4.0", "psutil>=5.9"]
    46	
    47	[build-system]
    48	requires = ["hatchling"]
    49	build-backend = "hatchling.build"
    50	
    51	[tool.hatch.build.targets.wheel]
    52	packages = ["mempalace"]
    53	
    54	[tool.ruff]
    55	line-length = 100
    56	target-version = "py39"
    57	extend-exclude = ["benchmarks"]
    58	
    59	[tool.ruff.lint]
    60	select = ["E", "F", "W", "C901"]
    61	ignore = ["E501"]
    62	
    63	[tool.ruff.lint.mccabe]
    64	max-complexity = 25
    65	
    66	[tool.ruff.format]
    67	quote-style = "double"
    68	
    69	[tool.pytest.ini_options]
    70	testpaths = ["tests"]
    71	pythonpath = ["."]
    72	addopts = "-m 'not benchmark and not slow and not stress'"
    73	markers = [
    74	    "benchmark: scale/performance benchmark tests",
    75	    "slow: tests that take more than 30 seconds",
    76	    "stress: destructive scale tests (100K+ drawers)",
    77	]
    78	
    79	[tool.coverage.run]
    80	source = ["mempalace"]
    81	
    82	[tool.coverage.report]
    83	fail_under = 85
    84	show_missing = true
    85	exclude_lines = [
    86	    "if __name__",
    87	    "pragma: no cover",
    88	]

--- CLI ---
     1	#!/usr/bin/env python3
     2	"""
     3	MemPalace — Give your AI a memory. No API key required.
     4	
     5	Two ways to ingest:
     6	  Projects:      mempalace mine ~/projects/my_app          (code, docs, notes)
     7	  Conversations: mempalace mine ~/chats/ --mode convos     (Claude, ChatGPT, Slack)
     8	
     9	Same palace. Same search. Different ingest strategies.
    10	
    11	Commands:
    12	    mempalace init <dir>                  Detect rooms from folder structure
    13	    mempalace split <dir>                 Split concatenated mega-files into per-session files
    14	    mempalace mine <dir>                  Mine project files (default)
    15	    mempalace mine <dir> --mode convos    Mine conversation exports
    16	    mempalace search "query"              Find anything, exact words
    17	    mempalace mcp                         Show MCP setup command
    18	    mempalace wake-up                     Show L0 + L1 wake-up context
    19	    mempalace wake-up --wing my_app       Wake-up for a specific project
    20	    mempalace status                      Show what's been filed
    21	
    22	Examples:
    23	    mempalace init ~/projects/my_app
    24	    mempalace mine ~/projects/my_app
    25	    mempalace mine ~/chats/claude-sessions --mode convos
    26	    mempalace search "why did we switch to GraphQL"
    27	    mempalace search "pricing discussion" --wing my_app --room costs
    28	"""
    29	
    30	import os
    31	import sys
    32	import shlex
    33	import argparse
    34	from pathlib import Path
    35	
    36	from .config import MempalaceConfig
    37	
    38	
    39	def cmd_init(args):
    40	    import json
    41	    from pathlib import Path
    42	    from .entity_detector import scan_for_detection, detect_entities, confirm_entities
    43	    from .room_detector_local import detect_rooms_local
    44	
    45	    # Pass 1: auto-detect people and projects from file content
    46	    print(f"\n  Scanning for entities in: {args.dir}")
    47	    files = scan_for_detection(args.dir)
    48	    if files:
    49	        print(f"  Reading {len(files)} files...")
    50	        detected = detect_entities(files)
    51	        total = len(detected["people"]) + len(detected["projects"]) + len(detected["uncertain"])
    52	        if total > 0:
    53	            confirmed = confirm_entities(detected, yes=getattr(args, "yes", False))
    54	            # Save confirmed entities to <project>/entities.json for the miner
    55	            if confirmed["people"] or confirmed["projects"]:
    56	                entities_path = Path(args.dir).expanduser().resolve() / "entities.json"
    57	                with open(entities_path, "w") as f:
    58	                    json.dump(confirmed, f, indent=2)
    59	                print(f"  Entities saved: {entities_path}")
    60	        else:
    61	            print("  No entities detected — proceeding with directory-based rooms.")
    62	
    63	    # Pass 2: detect rooms from folder structure
    64	    detect_rooms_local(project_dir=args.dir, yes=getattr(args, "yes", False))
    65	    MempalaceConfig().init()
    66	
    67	
    68	def cmd_mine(args):
    69	    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path
    70	    include_ignored = []
    71	    for raw in args.include_ignored or []:
    72	        include_ignored.extend(part.strip() for part in raw.split(",") if part.strip())
    73	
    74	    if args.mode == "convos":
    75	        from .convo_miner import mine_convos
    76	
    77	        mine_convos(
    78	            convo_dir=args.dir,
    79	            palace_path=palace_path,
    80	            wing=args.wing,
    81	            agent=args.agent,
    82	            limit=args.limit,
    83	            dry_run=args.dry_run,
    84	            extract_mode=args.extract,
    85	        )
    86	    else:
    87	        from .miner import mine
    88	
    89	        mine(
    90	            project_dir=args.dir,
    91	            palace_path=palace_path,
    92	            wing_override=args.wing,
    93	            agent=args.agent,
    94	            limit=args.limit,
    95	            dry_run=args.dry_run,
    96	            respect_gitignore=not args.no_gitignore,
    97	            include_ignored=include_ignored,
    98	        )
    99	
   100	
   101	def cmd_search(args):
   102	    from .searcher import search, SearchError
   103	
   104	    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path
   105	    try:
   106	        search(
   107	            query=args.query,
   108	            palace_path=palace_path,
   109	            wing=args.wing,
   110	            room=args.room,
   111	            n_results=args.results,
   112	        )
   113	    except SearchError:
   114	        sys.exit(1)
   115	
   116	
   117	def cmd_wakeup(args):
   118	    """Show L0 (identity) + L1 (essential story) — the wake-up context."""
   119	    from .layers import MemoryStack
   120	
   121	    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path
   122	    stack = MemoryStack(palace_path=palace_path)
   123	
   124	    text = stack.wake_up(wing=args.wing)
   125	    tokens = len(text) // 4
   126	    print(f"Wake-up text (~{tokens} tokens):")
   127	    print("=" * 50)
   128	    print(text)
   129	
   130	
   131	def cmd_split(args):
   132	    """Split concatenated transcript mega-files into per-session files."""
   133	    from .split_mega_files import main as split_main
   134	    import sys
   135	
   136	    # Rebuild argv for split_mega_files argparse
   137	    argv = ["--source", args.dir]
   138	    if args.output_dir:
   139	        argv += ["--output-dir", args.output_dir]
   140	    if args.dry_run:
   141	        argv.append("--dry-run")
   142	    if args.min_sessions != 2:
   143	        argv += ["--min-sessions", str(args.min_sessions)]
   144	
   145	    old_argv = sys.argv
   146	    sys.argv = ["mempalace split"] + argv
   147	    try:
   148	        split_main()
   149	    finally:
   150	        sys.argv = old_argv
   151	
   152	
   153	def cmd_migrate(args):
   154	    """Migrate palace from a different ChromaDB version."""
   155	    from .migrate import migrate
   156	
   157	    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path
   158	    migrate(palace_path=palace_path, dry_run=args.dry_run)
   159	
   160	
   161	def cmd_status(args):
   162	    from .miner import status
   163	
   164	    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path
   165	    status(palace_path=palace_path)
   166	
   167	
   168	def cmd_repair(args):
   169	    """Rebuild palace vector index from SQLite metadata."""
   170	    import chromadb
   171	    import shutil
   172	
   173	    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path
   174	
   175	    if not os.path.isdir(palace_path):
   176	        print(f"\n  No palace found at {palace_path}")
   177	        return
   178	
   179	    print(f"\n{'=' * 55}")
   180	    print("  MemPalace Repair")
   181	    print(f"{'=' * 55}\n")
   182	    print(f"  Palace: {palace_path}")
   183	
   184	    # Try to read existing drawers
   185	    try:
   186	        client = chromadb.PersistentClient(path=palace_path)
   187	        col = client.get_collection("mempalace_drawers")
   188	        total = col.count()
   189	        print(f"  Drawers found: {total}")
   190	    except Exception as e:
   191	        print(f"  Error reading palace: {e}")
   192	        print("  Cannot recover — palace may need to be re-mined from source files.")
   193	        return
   194	
   195	    if total == 0:
   196	        print("  Nothing to repair.")
   197	        return
   198	
   199	    # Extract all drawers in batches
   200	    print("\n  Extracting drawers...")
   201	    batch_size = 5000
   202	    all_ids = []
   203	    all_docs = []
   204	    all_metas = []
   205	    offset = 0
   206	    while offset < total:
   207	        batch = col.get(limit=batch_size, offset=offset, include=["documents", "metadatas"])
   208	        all_ids.extend(batch["ids"])
   209	        all_docs.extend(batch["documents"])
   210	        all_metas.extend(batch["metadatas"])
   211	        offset += batch_size
   212	    print(f"  Extracted {len(all_ids)} drawers")
   213	
   214	    # Backup and rebuild
   215	    palace_path = palace_path.rstrip(os.sep)
   216	    backup_path = palace_path + ".backup"
   217	    if os.path.exists(backup_path):
   218	        shutil.rmtree(backup_path)
   219	    print(f"  Backing up to {backup_path}...")
   220	    shutil.copytree(palace_path, backup_path)
   221	
   222	    print("  Rebuilding collection...")
   223	    client.delete_collection("mempalace_drawers")
   224	    new_col = client.create_collection("mempalace_drawers")
   225	
   226	    filed = 0
   227	    for i in range(0, len(all_ids), batch_size):
   228	        batch_ids = all_ids[i : i + batch_size]
   229	        batch_docs = all_docs[i : i + batch_size]
   230	        batch_metas = all_metas[i : i + batch_size]
   231	        new_col.add(documents=batch_docs, ids=batch_ids, metadatas=batch_metas)
   232	        filed += len(batch_ids)
   233	        print(f"  Re-filed {filed}/{len(all_ids)} drawers...")
   234	
   235	    print(f"\n  Repair complete. {filed} drawers rebuilt.")
   236	    print(f"  Backup saved at {backup_path}")
   237	    print(f"\n{'=' * 55}\n")
   238	
   239	
   240	def cmd_hook(args):
   241	    """Run hook logic: reads JSON from stdin, outputs JSON to stdout."""
   242	    from .hooks_cli import run_hook
   243	
   244	    run_hook(hook_name=args.hook, harness=args.harness)
   245	
   246	
   247	def cmd_instructions(args):
   248	    """Output skill instructions to stdout."""
   249	    from .instructions_cli import run_instructions
   250	
   251	    run_instructions(name=args.name)
   252	
   253	
   254	def cmd_mcp(args):
   255	    """Show how to wire MemPalace into MCP-capable hosts."""
   256	    base_server_cmd = "python -m mempalace.mcp_server"
   257	
   258	    if args.palace:
   259	        resolved_palace = str(Path(args.palace).expanduser())
   260	        server_cmd = f"{base_server_cmd} --palace {shlex.quote(resolved_palace)}"

codex
The main pattern is already emerging from the source itself: MemPalace is less a “better retriever” than a different operating posture. I’m now tracing the parts that turn that posture into behavior: status/bootstrap text, layered wake-up output, hook timing, and the split between navigable metadata and temporal facts.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	        server_cmd = f"{base_server_cmd} --palace {shlex.quote(resolved_palace)}"
   261	    else:
   262	        server_cmd = base_server_cmd
   263	
   264	    print("MemPalace MCP quick setup:")
   265	    print(f"  claude mcp add mempalace -- {server_cmd}")
   266	    print("\nRun the server directly:")
   267	    print(f"  {server_cmd}")
   268	
   269	    if not args.palace:
   270	        print("\nOptional custom palace:")
   271	        print(f"  claude mcp add mempalace -- {base_server_cmd} --palace /path/to/palace")
   272	        print(f"  {base_server_cmd} --palace /path/to/palace")
   273	
   274	
   275	def cmd_compress(args):
   276	    """Compress drawers in a wing using AAAK Dialect."""
   277	    import chromadb
   278	    from .dialect import Dialect
   279	
   280	    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path
   281	
   282	    # Load dialect (with optional entity config)
   283	    config_path = args.config
   284	    if not config_path:
   285	        for candidate in ["entities.json", os.path.join(palace_path, "entities.json")]:
   286	            if os.path.exists(candidate):
   287	                config_path = candidate
   288	                break
   289	
   290	    if config_path and os.path.exists(config_path):
   291	        dialect = Dialect.from_config(config_path)
   292	        print(f"  Loaded entity config: {config_path}")
   293	    else:
   294	        dialect = Dialect()
   295	
   296	    # Connect to palace
   297	    try:
   298	        client = chromadb.PersistentClient(path=palace_path)
   299	        col = client.get_collection("mempalace_drawers")
   300	    except Exception:
   301	        print(f"\n  No palace found at {palace_path}")
   302	        print("  Run: mempalace init <dir> then mempalace mine <dir>")
   303	        sys.exit(1)
   304	
   305	    # Query drawers in batches to avoid SQLite variable limit (~999)
   306	    where = {"wing": args.wing} if args.wing else None
   307	    _BATCH = 500
   308	    docs, metas, ids = [], [], []
   309	    offset = 0
   310	    while True:
   311	        try:
   312	            kwargs = {"include": ["documents", "metadatas"], "limit": _BATCH, "offset": offset}
   313	            if where:
   314	                kwargs["where"] = where
   315	            batch = col.get(**kwargs)
   316	        except Exception as e:
   317	            if not docs:
   318	                print(f"\n  Error reading drawers: {e}")
   319	                sys.exit(1)
   320	            break
   321	        batch_docs = batch.get("documents", [])
   322	        if not batch_docs:
   323	            break
   324	        docs.extend(batch_docs)
   325	        metas.extend(batch.get("metadatas", []))
   326	        ids.extend(batch.get("ids", []))
   327	        offset += len(batch_docs)
   328	        if len(batch_docs) < _BATCH:
   329	            break
   330	
   331	    if not docs:
   332	        wing_label = f" in wing '{args.wing}'" if args.wing else ""
   333	        print(f"\n  No drawers found{wing_label}.")
   334	        return
   335	
   336	    print(
   337	        f"\n  Compressing {len(docs)} drawers"
   338	        + (f" in wing '{args.wing}'" if args.wing else "")
   339	        + "..."
   340	    )
   341	    print()
   342	
   343	    total_original = 0
   344	    total_compressed = 0
   345	    compressed_entries = []
   346	
   347	    for doc, meta, doc_id in zip(docs, metas, ids):
   348	        compressed = dialect.compress(doc, metadata=meta)
   349	        stats = dialect.compression_stats(doc, compressed)
   350	
   351	        total_original += stats["original_chars"]
   352	        total_compressed += stats["compressed_chars"]
   353	
   354	        compressed_entries.append((doc_id, compressed, meta, stats))
   355	
   356	        if args.dry_run:
   357	            wing_name = meta.get("wing", "?")
   358	            room_name = meta.get("room", "?")
   359	            source = Path(meta.get("source_file", "?")).name
   360	            print(f"  [{wing_name}/{room_name}] {source}")
   361	            print(
   362	                f"    {stats['original_tokens']}t -> {stats['compressed_tokens']}t ({stats['ratio']:.1f}x)"
   363	            )
   364	            print(f"    {compressed}")
   365	            print()
   366	
   367	    # Store compressed versions (unless dry-run)
   368	    if not args.dry_run:
   369	        try:
   370	            comp_col = client.get_or_create_collection("mempalace_compressed")
   371	            for doc_id, compressed, meta, stats in compressed_entries:
   372	                comp_meta = dict(meta)
   373	                comp_meta["compression_ratio"] = round(stats["ratio"], 1)
   374	                comp_meta["original_tokens"] = stats["original_tokens"]
   375	                comp_col.upsert(
   376	                    ids=[doc_id],
   377	                    documents=[compressed],
   378	                    metadatas=[comp_meta],
   379	                )
   380	            print(
   381	                f"  Stored {len(compressed_entries)} compressed drawers in 'mempalace_compressed' collection."
   382	            )
   383	        except Exception as e:
   384	            print(f"  Error storing compressed drawers: {e}")
   385	            sys.exit(1)
   386	
   387	    # Summary
   388	    ratio = total_original / max(total_compressed, 1)
   389	    orig_tokens = Dialect.count_tokens("x" * total_original)
   390	    comp_tokens = Dialect.count_tokens("x" * total_compressed)
   391	    print(f"  Total: {orig_tokens:,}t -> {comp_tokens:,}t ({ratio:.1f}x compression)")
   392	    if args.dry_run:
   393	        print("  (dry run -- nothing stored)")
   394	
   395	
   396	def main():
   397	    parser = argparse.ArgumentParser(
   398	        description="MemPalace — Give your AI a memory. No API key required.",
   399	        formatter_class=argparse.RawDescriptionHelpFormatter,
   400	        epilog=__doc__,
   401	    )
   402	    parser.add_argument(
   403	        "--palace",
   404	        default=None,
   405	        help="Where the palace lives (default: from ~/.mempalace/config.json or ~/.mempalace/palace)",
   406	    )
   407	
   408	    sub = parser.add_subparsers(dest="command")
   409	
   410	    # init
   411	    p_init = sub.add_parser("init", help="Detect rooms from your folder structure")
   412	    p_init.add_argument("dir", help="Project directory to set up")
   413	    p_init.add_argument(
   414	        "--yes", action="store_true", help="Auto-accept all detected entities (non-interactive)"
   415	    )
   416	
   417	    # mine
   418	    p_mine = sub.add_parser("mine", help="Mine files into the palace")
   419	    p_mine.add_argument("dir", help="Directory to mine")
   420	    p_mine.add_argument(
   421	        "--mode",
   422	        choices=["projects", "convos"],
   423	        default="projects",
   424	        help="Ingest mode: 'projects' for code/docs (default), 'convos' for chat exports",
   425	    )
   426	    p_mine.add_argument("--wing", default=None, help="Wing name (default: directory name)")
   427	    p_mine.add_argument(
   428	        "--no-gitignore",
   429	        action="store_true",
   430	        help="Don't respect .gitignore files when scanning project files",
   431	    )
   432	    p_mine.add_argument(
   433	        "--include-ignored",
   434	        action="append",
   435	        default=[],
   436	        help="Always scan these project-relative paths even if ignored; repeat or pass comma-separated paths",
   437	    )
   438	    p_mine.add_argument(
   439	        "--agent",
   440	        default="mempalace",
   441	        help="Your name — recorded on every drawer (default: mempalace)",
   442	    )
   443	    p_mine.add_argument("--limit", type=int, default=0, help="Max files to process (0 = all)")
   444	    p_mine.add_argument(
   445	        "--dry-run", action="store_true", help="Show what would be filed without filing"
   446	    )
   447	    p_mine.add_argument(
   448	        "--extract",
   449	        choices=["exchange", "general"],
   450	        default="exchange",
   451	        help="Extraction strategy for convos mode: 'exchange' (default) or 'general' (5 memory types)",
   452	    )
   453	
   454	    # search
   455	    p_search = sub.add_parser("search", help="Find anything, exact words")
   456	    p_search.add_argument("query", help="What to search for")
   457	    p_search.add_argument("--wing", default=None, help="Limit to one project")
   458	    p_search.add_argument("--room", default=None, help="Limit to one room")
   459	    p_search.add_argument("--results", type=int, default=5, help="Number of results")
   460	
   461	    # compress
   462	    p_compress = sub.add_parser(
   463	        "compress", help="Compress drawers using AAAK Dialect (~30x reduction)"
   464	    )
   465	    p_compress.add_argument("--wing", default=None, help="Wing to compress (default: all wings)")
   466	    p_compress.add_argument(
   467	        "--dry-run", action="store_true", help="Preview compression without storing"
   468	    )
   469	    p_compress.add_argument(
   470	        "--config", default=None, help="Entity config JSON (e.g. entities.json)"
   471	    )
   472	
   473	    # wake-up
   474	    p_wakeup = sub.add_parser("wake-up", help="Show L0 + L1 wake-up context (~600-900 tokens)")
   475	    p_wakeup.add_argument("--wing", default=None, help="Wake-up for a specific project/wing")
   476	
   477	    # split
   478	    p_split = sub.add_parser(
   479	        "split",
   480	        help="Split concatenated transcript mega-files into per-session files (run before mine)",
   481	    )
   482	    p_split.add_argument("dir", help="Directory containing transcript files")
   483	    p_split.add_argument(
   484	        "--output-dir",
   485	        default=None,
   486	        help="Write split files here (default: same directory as source files)",
   487	    )
   488	    p_split.add_argument(
   489	        "--dry-run",
   490	        action="store_true",
   491	        help="Show what would be split without writing files",
   492	    )
   493	    p_split.add_argument(
   494	        "--min-sessions",
   495	        type=int,
   496	        default=2,
   497	        help="Only split files containing at least N sessions (default: 2)",
   498	    )
   499	
   500	    # hook
   501	    p_hook = sub.add_parser(
   502	        "hook",
   503	        help="Run hook logic (reads JSON from stdin, outputs JSON to stdout)",
   504	    )
   505	    hook_sub = p_hook.add_subparsers(dest="hook_action")
   506	    p_hook_run = hook_sub.add_parser("run", help="Execute a hook")
   507	    p_hook_run.add_argument(
   508	        "--hook",
   509	        required=True,
   510	        choices=["session-start", "stop", "precompact"],
   511	        help="Hook name to run",
   512	    )
   513	    p_hook_run.add_argument(
   514	        "--harness",
   515	        required=True,
   516	        choices=["claude-code", "codex"],
   517	        help="Harness type (determines stdin JSON format)",
   518	    )
   519	
   520	    # instructions

 succeeded in 0ms:
   260	Same room. Three wings. The tunnel connects them.
   261	
   262	### Why Structure Matters
   263	
   264	Tested on 22,000+ real conversation memories:
   265	
   266	```
   267	Search all closets:          60.9%  R@10
   268	Search within wing:          73.1%  (+12%)
   269	Search wing + hall:          84.8%  (+24%)
   270	Search wing + room:          94.8%  (+34%)
   271	```
   272	
   273	Wings and rooms aren't cosmetic. They're a **34% retrieval improvement**. The palace structure is the product.
   274	
   275	### The Memory Stack
   276	
   277	| Layer | What | Size | When |
   278	|-------|------|------|------|
   279	| **L0** | Identity — who is this AI? | ~50 tokens | Always loaded |
   280	| **L1** | Critical facts — team, projects, preferences | ~120 tokens (AAAK) | Always loaded |
   281	| **L2** | Room recall — recent sessions, current project | On demand | When topic comes up |
   282	| **L3** | Deep search — semantic query across all closets | On demand | When explicitly asked |
   283	
   284	Your AI wakes up with L0 + L1 (~170 tokens) and knows your world. Searches only fire when needed.
   285	
   286	### AAAK Dialect (experimental)
   287	
   288	AAAK is a lossy abbreviation system — entity codes, structural markers, and sentence truncation — designed to pack repeated entities and relationships into fewer tokens at scale. It is **readable by any LLM that reads text** (Claude, GPT, Gemini, Llama, Mistral) without a decoder, so a local model can use it without any cloud dependency.
   289	
   290	**Honest status (April 2026):**
   291	
   292	- **AAAK is lossy, not lossless.** It uses regex-based abbreviation, not reversible compression.
   293	- **It does not save tokens at small scales.** Short text already tokenizes efficiently. AAAK overhead (codes, separators) costs more than it saves on a few sentences.
   294	- **It can save tokens at scale** — in scenarios with many repeated entities (a team mentioned hundreds of times, the same project across thousands of sessions), the entity codes amortize.
   295	- **AAAK currently regresses LongMemEval** vs raw verbatim retrieval (84.2% R@5 vs 96.6%). The 96.6% headline number is from **raw mode**, not AAAK mode.
   296	- **The MemPalace storage default is raw verbatim text in ChromaDB** — that's where the benchmark wins come from. AAAK is a separate compression layer for context loading, not the storage format.
   297	
   298	We're iterating on the dialect spec, adding a real tokenizer for stats, and exploring better break points for when to use it. Track progress in [Issue #43](https://github.com/milla-jovovich/mempalace/issues/43) and [#27](https://github.com/milla-jovovich/mempalace/issues/27).
   299	
   300	### Contradiction Detection (experimental, not yet wired into KG)
   301	
   302	A separate utility (`fact_checker.py`) can check assertions against entity facts. It's not currently called automatically by the knowledge graph operations — this is being fixed (track in [Issue #27](https://github.com/milla-jovovich/mempalace/issues/27)). When enabled it catches things like:
   303	
   304	```
   305	Input:  "Soren finished the auth migration"
   306	Output: 🔴 AUTH-MIGRATION: attribution conflict — Maya was assigned, not Soren
   307	
   308	Input:  "Kai has been here 2 years"
   309	Output: 🟡 KAI: wrong_tenure — records show 3 years (started 2023-04)
   310	
   311	Input:  "The sprint ends Friday"
   312	Output: 🟡 SPRINT: stale_date — current sprint ends Thursday (updated 2 days ago)
   313	```
   314	
   315	Facts checked against the knowledge graph. Ages, dates, and tenures calculated dynamically — not hardcoded.
   316	
   317	---
   318	
   319	## Real-World Examples
   320	
   321	### Solo developer across multiple projects
   322	
   323	```bash
   324	# Mine each project's conversations
   325	mempalace mine ~/chats/orion/  --mode convos --wing orion
   326	mempalace mine ~/chats/nova/   --mode convos --wing nova
   327	mempalace mine ~/chats/helios/ --mode convos --wing helios
   328	
   329	# Six months later: "why did I use Postgres here?"
   330	mempalace search "database decision" --wing orion
   331	# → "Chose Postgres over SQLite because Orion needs concurrent writes
   332	#    and the dataset will exceed 10GB. Decided 2025-11-03."
   333	
   334	# Cross-project search
   335	mempalace search "rate limiting approach"
   336	# → finds your approach in Orion AND Nova, shows the differences
   337	```
   338	
   339	### Team lead managing a product
   340	
   341	```bash
   342	# Mine Slack exports and AI conversations
   343	mempalace mine ~/exports/slack/ --mode convos --wing driftwood
   344	mempalace mine ~/.claude/projects/ --mode convos
   345	
   346	# "What did Soren work on last sprint?"
   347	mempalace search "Soren sprint" --wing driftwood
   348	# → 14 closets: OAuth refactor, dark mode, component library migration
   349	
   350	# "Who decided to use Clerk?"
   351	mempalace search "Clerk decision" --wing driftwood
   352	# → "Kai recommended Clerk over Auth0 — pricing + developer experience.
   353	#    Team agreed 2026-01-15. Maya handling the migration."
   354	```
   355	
   356	### Before mining: split mega-files
   357	
   358	Some transcript exports concatenate multiple sessions into one huge file:
   359	
   360	```bash
   361	mempalace split ~/chats/                      # split into per-session files
   362	mempalace split ~/chats/ --dry-run            # preview first
   363	mempalace split ~/chats/ --min-sessions 3     # only split files with 3+ sessions
   364	```
   365	
   366	---
   367	
   368	## Knowledge Graph
   369	
   370	Temporal entity-relationship triples — like Zep's Graphiti, but SQLite instead of Neo4j. Local and free.
   371	
   372	```python
   373	from mempalace.knowledge_graph import KnowledgeGraph
   374	
   375	kg = KnowledgeGraph()
   376	kg.add_triple("Kai", "works_on", "Orion", valid_from="2025-06-01")
   377	kg.add_triple("Maya", "assigned_to", "auth-migration", valid_from="2026-01-15")
   378	kg.add_triple("Maya", "completed", "auth-migration", valid_from="2026-02-01")
   379	
   380	# What's Kai working on?
   381	kg.query_entity("Kai")
   382	# → [Kai → works_on → Orion (current), Kai → recommended → Clerk (2026-01)]
   383	
   384	# What was true in January?
   385	kg.query_entity("Maya", as_of="2026-01-20")
   386	# → [Maya → assigned_to → auth-migration (active)]
   387	
   388	# Timeline
   389	kg.timeline("Orion")
   390	# → chronological story of the project
   391	```
   392	
   393	Facts have validity windows. When something stops being true, invalidate it:
   394	
   395	```python
   396	kg.invalidate("Kai", "works_on", "Orion", ended="2026-03-01")
   397	```
   398	
   399	Now queries for Kai's current work won't return Orion. Historical queries still will.
   400	
   401	| Feature | MemPalace | Zep (Graphiti) |
   402	|---------|-----------|----------------|
   403	| Storage | SQLite (local) | Neo4j (cloud) |
   404	| Cost | Free | $25/mo+ |
   405	| Temporal validity | Yes | Yes |
   406	| Self-hosted | Always | Enterprise only |
   407	| Privacy | Everything local | SOC 2, HIPAA |
   408	
   409	---
   410	
   411	## Specialist Agents
   412	
   413	Create agents that focus on specific areas. Each agent gets its own wing and diary in the palace — not in your CLAUDE.md. Add 50 agents, your config stays the same size.
   414	
   415	```
   416	~/.mempalace/agents/
   417	  ├── reviewer.json       # code quality, patterns, bugs
   418	  ├── architect.json      # design decisions, tradeoffs
   419	  └── ops.json            # deploys, incidents, infra
   420	```
   421	
   422	Your CLAUDE.md just needs one line:
   423	
   424	```
   425	You have MemPalace agents. Run mempalace_list_agents to see them.
   426	```
   427	
   428	The AI discovers its agents from the palace at runtime. Each agent:
   429	
   430	- **Has a focus** — what it pays attention to
   431	- **Keeps a diary** — written in AAAK, persists across sessions
   432	- **Builds expertise** — reads its own history to stay sharp in its domain
   433	
   434	```
   435	# Agent writes to its diary after a code review
   436	mempalace_diary_write("reviewer",
   437	    "PR#42|auth.bypass.found|missing.middleware.check|pattern:3rd.time.this.quarter|★★★★")
   438	
   439	# Agent reads back its history
   440	mempalace_diary_read("reviewer", last_n=10)
   441	# → last 10 findings, compressed in AAAK
   442	```
   443	
   444	Each agent is a specialist lens on your data. The reviewer remembers every bug pattern it's seen. The architect remembers every design decision. The ops agent remembers every incident. They don't share a scratchpad — they each maintain their own memory.
   445	
   446	Letta charges $20–200/mo for agent-managed memory. MemPalace does it with a wing.
   447	
   448	---
   449	
   450	## MCP Server
   451	
   452	```bash
   453	# Via plugin (recommended)
   454	claude plugin marketplace add milla-jovovich/mempalace
   455	claude plugin install --scope user mempalace
   456	
   457	# Or manually
   458	claude mcp add mempalace -- python -m mempalace.mcp_server
   459	```
   460	
   461	### 19 Tools
   462	
   463	**Palace (read)**
   464	
   465	| Tool | What |
   466	|------|------|
   467	| `mempalace_status` | Palace overview + AAAK spec + memory protocol |
   468	| `mempalace_list_wings` | Wings with counts |
   469	| `mempalace_list_rooms` | Rooms within a wing |
   470	| `mempalace_get_taxonomy` | Full wing → room → count tree |
   471	| `mempalace_search` | Semantic search with wing/room filters |
   472	| `mempalace_check_duplicate` | Check before filing |
   473	| `mempalace_get_aaak_spec` | AAAK dialect reference |
   474	
   475	**Palace (write)**
   476	
   477	| Tool | What |
   478	|------|------|
   479	| `mempalace_add_drawer` | File verbatim content |
   480	| `mempalace_delete_drawer` | Remove by ID |
   481	
   482	**Knowledge Graph**
   483	
   484	| Tool | What |
   485	|------|------|
   486	| `mempalace_kg_query` | Entity relationships with time filtering |
   487	| `mempalace_kg_add` | Add facts |
   488	| `mempalace_kg_invalidate` | Mark facts as ended |
   489	| `mempalace_kg_timeline` | Chronological entity story |
   490	| `mempalace_kg_stats` | Graph overview |
   491	
   492	**Navigation**
   493	
   494	| Tool | What |
   495	|------|------|
   496	| `mempalace_traverse` | Walk the graph from a room across wings |
   497	| `mempalace_find_tunnels` | Find rooms bridging two wings |
   498	| `mempalace_graph_stats` | Graph connectivity overview |
   499	
   500	**Agent Diary**
   501	
   502	| Tool | What |
   503	|------|------|
   504	| `mempalace_diary_write` | Write AAAK diary entry |
   505	| `mempalace_diary_read` | Read recent diary entries |
   506	
   507	The AI learns AAAK and the memory protocol automatically from the `mempalace_status` response. No manual configuration.
   508	
   509	---
   510	
   511	## Auto-Save Hooks
   512	
   513	Two hooks for Claude Code that automatically save memories during work:
   514	
   515	**Save Hook** — every 15 messages, triggers a structured save. Topics, decisions, quotes, code changes. Also regenerates the critical facts layer.
   516	
   517	**PreCompact Hook** — fires before context compression. Emergency save before the window shrinks.
   518	
   519	```json
   520	{

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env python3
     2	"""
     3	MemPalace MCP Server — read/write palace access for Claude Code
     4	================================================================
     5	Install: claude mcp add mempalace -- python -m mempalace.mcp_server [--palace /path/to/palace]
     6	
     7	Tools (read):
     8	  mempalace_status          — total drawers, wing/room breakdown
     9	  mempalace_list_wings      — all wings with drawer counts
    10	  mempalace_list_rooms      — rooms within a wing
    11	  mempalace_get_taxonomy    — full wing → room → count tree
    12	  mempalace_search          — semantic search, optional wing/room filter
    13	  mempalace_check_duplicate — check if content already exists before filing
    14	
    15	Tools (write):
    16	  mempalace_add_drawer      — file verbatim content into a wing/room
    17	  mempalace_delete_drawer   — remove a drawer by ID
    18	"""
    19	
    20	import argparse
    21	import os
    22	import sys
    23	import json
    24	import logging
    25	import hashlib
    26	from datetime import datetime
    27	from pathlib import Path
    28	
    29	from .config import MempalaceConfig, sanitize_name, sanitize_content
    30	from .version import __version__
    31	from .searcher import search_memories
    32	from .palace_graph import traverse, find_tunnels, graph_stats
    33	import chromadb
    34	
    35	from .knowledge_graph import KnowledgeGraph
    36	
    37	logging.basicConfig(level=logging.INFO, format="%(message)s", stream=sys.stderr)
    38	logger = logging.getLogger("mempalace_mcp")
    39	
    40	
    41	def _parse_args():
    42	    parser = argparse.ArgumentParser(description="MemPalace MCP Server")
    43	    parser.add_argument(
    44	        "--palace",
    45	        metavar="PATH",
    46	        help="Path to the palace directory (overrides config file and env var)",
    47	    )
    48	    args, unknown = parser.parse_known_args()
    49	    if unknown:
    50	        logger.debug("Ignoring unknown args: %s", unknown)
    51	    return args
    52	
    53	
    54	_args = _parse_args()
    55	
    56	if _args.palace:
    57	    os.environ["MEMPALACE_PALACE_PATH"] = os.path.abspath(_args.palace)
    58	
    59	_config = MempalaceConfig()
    60	if _args.palace:
    61	    _kg = KnowledgeGraph(db_path=os.path.join(_config.palace_path, "knowledge_graph.sqlite3"))
    62	else:
    63	    _kg = KnowledgeGraph()
    64	
    65	
    66	_client_cache = None
    67	_collection_cache = None
    68	
    69	
    70	# ==================== WRITE-AHEAD LOG ====================
    71	# Every write operation is logged to a JSONL file before execution.
    72	# This provides an audit trail for detecting memory poisoning and
    73	# enables review/rollback of writes from external or untrusted sources.
    74	
    75	_WAL_DIR = Path(os.path.expanduser("~/.mempalace/wal"))
    76	_WAL_DIR.mkdir(parents=True, exist_ok=True)
    77	try:
    78	    _WAL_DIR.chmod(0o700)
    79	except (OSError, NotImplementedError):
    80	    pass
    81	_WAL_FILE = _WAL_DIR / "write_log.jsonl"
    82	
    83	
    84	def _wal_log(operation: str, params: dict, result: dict = None):
    85	    """Append a write operation to the write-ahead log."""
    86	    entry = {
    87	        "timestamp": datetime.now().isoformat(),
    88	        "operation": operation,
    89	        "params": params,
    90	        "result": result,
    91	    }
    92	    try:
    93	        with open(_WAL_FILE, "a", encoding="utf-8") as f:
    94	            f.write(json.dumps(entry, default=str) + "\n")
    95	        try:
    96	            _WAL_FILE.chmod(0o600)
    97	        except (OSError, NotImplementedError):
    98	            pass
    99	    except Exception as e:
   100	        logger.error(f"WAL write failed: {e}")
   101	
   102	
   103	_client_cache = None
   104	_collection_cache = None
   105	
   106	
   107	def _get_client():
   108	    """Return a singleton ChromaDB PersistentClient."""
   109	    global _client_cache
   110	    if _client_cache is None:
   111	        _client_cache = chromadb.PersistentClient(path=_config.palace_path)
   112	    return _client_cache
   113	
   114	
   115	def _get_collection(create=False):
   116	    """Return the ChromaDB collection, caching the client between calls."""
   117	    global _collection_cache
   118	    try:
   119	        client = _get_client()
   120	        if create:
   121	            _collection_cache = client.get_or_create_collection(_config.collection_name)
   122	        elif _collection_cache is None:
   123	            _collection_cache = client.get_collection(_config.collection_name)
   124	        return _collection_cache
   125	    except Exception:
   126	        return None
   127	
   128	
   129	def _no_palace():
   130	    return {
   131	        "error": "No palace found",
   132	        "hint": "Run: mempalace init <dir> && mempalace mine <dir>",
   133	    }
   134	
   135	
   136	# ==================== READ TOOLS ====================
   137	
   138	
   139	def tool_status():
   140	    col = _get_collection()
   141	    if not col:
   142	        return _no_palace()
   143	    count = col.count()
   144	    wings = {}
   145	    rooms = {}
   146	    try:
   147	        all_meta = col.get(include=["metadatas"], limit=10000)["metadatas"]
   148	        for m in all_meta:
   149	            w = m.get("wing", "unknown")
   150	            r = m.get("room", "unknown")
   151	            wings[w] = wings.get(w, 0) + 1
   152	            rooms[r] = rooms.get(r, 0) + 1
   153	    except Exception:
   154	        pass
   155	    return {
   156	        "total_drawers": count,
   157	        "wings": wings,
   158	        "rooms": rooms,
   159	        "palace_path": _config.palace_path,
   160	        "protocol": PALACE_PROTOCOL,
   161	        "aaak_dialect": AAAK_SPEC,
   162	    }
   163	
   164	
   165	# ── AAAK Dialect Spec ─────────────────────────────────────────────────────────
   166	# Included in status response so the AI learns it on first wake-up call.
   167	# Also available via mempalace_get_aaak_spec tool.
   168	
   169	PALACE_PROTOCOL = """IMPORTANT — MemPalace Memory Protocol:
   170	1. ON WAKE-UP: Call mempalace_status to load palace overview + AAAK spec.
   171	2. BEFORE RESPONDING about any person, project, or past event: call mempalace_kg_query or mempalace_search FIRST. Never guess — verify.
   172	3. IF UNSURE about a fact (name, gender, age, relationship): say "let me check" and query the palace. Wrong is worse than slow.
   173	4. AFTER EACH SESSION: call mempalace_diary_write to record what happened, what you learned, what matters.
   174	5. WHEN FACTS CHANGE: call mempalace_kg_invalidate on the old fact, mempalace_kg_add for the new one.
   175	
   176	This protocol ensures the AI KNOWS before it speaks. Storage is not memory — but storage + this protocol = memory."""
   177	
   178	AAAK_SPEC = """AAAK is a compressed memory dialect that MemPalace uses for efficient storage.
   179	It is designed to be readable by both humans and LLMs without decoding.
   180	
   181	FORMAT:
   182	  ENTITIES: 3-letter uppercase codes. ALC=Alice, JOR=Jordan, RIL=Riley, MAX=Max, BEN=Ben.
   183	  EMOTIONS: *action markers* before/during text. *warm*=joy, *fierce*=determined, *raw*=vulnerable, *bloom*=tenderness.
   184	  STRUCTURE: Pipe-separated fields. FAM: family | PROJ: projects | ⚠: warnings/reminders.
   185	  DATES: ISO format (2026-03-31). COUNTS: Nx = N mentions (e.g., 570x).
   186	  IMPORTANCE: ★ to ★★★★★ (1-5 scale).
   187	  HALLS: hall_facts, hall_events, hall_discoveries, hall_preferences, hall_advice.
   188	  WINGS: wing_user, wing_agent, wing_team, wing_code, wing_myproject, wing_hardware, wing_ue5, wing_ai_research.
   189	  ROOMS: Hyphenated slugs representing named ideas (e.g., chromadb-setup, gpu-pricing).
   190	
   191	EXAMPLE:
   192	  FAM: ALC→♡JOR | 2D(kids): RIL(18,sports) MAX(11,chess+swimming) | BEN(contributor)
   193	
   194	Read AAAK naturally — expand codes mentally, treat *markers* as emotional context.
   195	When WRITING AAAK: use entity codes, mark emotions, keep structure tight."""
   196	
   197	
   198	def tool_list_wings():
   199	    col = _get_collection()
   200	    if not col:
   201	        return _no_palace()
   202	    wings = {}
   203	    try:
   204	        all_meta = col.get(include=["metadatas"], limit=10000)["metadatas"]
   205	        for m in all_meta:
   206	            w = m.get("wing", "unknown")
   207	            wings[w] = wings.get(w, 0) + 1
   208	    except Exception:
   209	        pass
   210	    return {"wings": wings}
   211	
   212	
   213	def tool_list_rooms(wing: str = None):
   214	    col = _get_collection()
   215	    if not col:
   216	        return _no_palace()
   217	    rooms = {}
   218	    try:
   219	        kwargs = {"include": ["metadatas"], "limit": 10000}
   220	        if wing:
   221	            kwargs["where"] = {"wing": wing}
   222	        all_meta = col.get(**kwargs)["metadatas"]
   223	        for m in all_meta:
   224	            r = m.get("room", "unknown")
   225	            rooms[r] = rooms.get(r, 0) + 1
   226	    except Exception:
   227	        pass
   228	    return {"wing": wing or "all", "rooms": rooms}
   229	
   230	
   231	def tool_get_taxonomy():
   232	    col = _get_collection()
   233	    if not col:
   234	        return _no_palace()
   235	    taxonomy = {}
   236	    try:
   237	        all_meta = col.get(include=["metadatas"], limit=10000)["metadatas"]
   238	        for m in all_meta:
   239	            w = m.get("wing", "unknown")
   240	            r = m.get("room", "unknown")
   241	            if w not in taxonomy:
   242	                taxonomy[w] = {}
   243	            taxonomy[w][r] = taxonomy[w].get(r, 0) + 1
   244	    except Exception:
   245	        pass
   246	    return {"taxonomy": taxonomy}
   247	
   248	
   249	def tool_search(query: str, limit: int = 5, wing: str = None, room: str = None):
   250	    return search_memories(
   251	        query,
   252	        palace_path=_config.palace_path,
   253	        wing=wing,
   254	        room=room,
   255	        n_results=limit,
   256	    )
   257	
   258	
   259	def tool_check_duplicate(content: str, threshold: float = 0.9):
   260	    col = _get_collection()
   261	    if not col:
   262	        return _no_palace()
   263	    try:
   264	        results = col.query(
   265	            query_texts=[content],
   266	            n_results=5,
   267	            include=["metadatas", "documents", "distances"],
   268	        )
   269	        duplicates = []
   270	        if results["ids"] and results["ids"][0]:
   271	            for i, drawer_id in enumerate(results["ids"][0]):
   272	                dist = results["distances"][0][i]
   273	                similarity = round(1 - dist, 3)
   274	                if similarity >= threshold:
   275	                    meta = results["metadatas"][0][i]
   276	                    doc = results["documents"][0][i]
   277	                    duplicates.append(
   278	                        {
   279	                            "id": drawer_id,
   280	                            "wing": meta.get("wing", "?"),
   281	                            "room": meta.get("room", "?"),
   282	                            "similarity": similarity,
   283	                            "content": doc[:200] + "..." if len(doc) > 200 else doc,
   284	                        }
   285	                    )
   286	        return {
   287	            "is_duplicate": len(duplicates) > 0,
   288	            "matches": duplicates,
   289	        }
   290	    except Exception as e:
   291	        return {"error": str(e)}
   292	
   293	
   294	def tool_get_aaak_spec():
   295	    """Return the AAAK dialect specification."""
   296	    return {"aaak_spec": AAAK_SPEC}
   297	
   298	
   299	def tool_traverse_graph(start_room: str, max_hops: int = 2):
   300	    """Walk the palace graph from a room. Find connected ideas across wings."""
   301	    col = _get_collection()
   302	    if not col:
   303	        return _no_palace()
   304	    return traverse(start_room, col=col, max_hops=max_hops)
   305	
   306	
   307	def tool_find_tunnels(wing_a: str = None, wing_b: str = None):
   308	    """Find rooms that bridge two wings — the hallways connecting domains."""
   309	    col = _get_collection()
   310	    if not col:
   311	        return _no_palace()
   312	    return find_tunnels(wing_a, wing_b, col=col)
   313	
   314	
   315	def tool_graph_stats():
   316	    """Palace graph overview: nodes, tunnels, edges, connectivity."""
   317	    col = _get_collection()
   318	    if not col:
   319	        return _no_palace()
   320	    return graph_stats(col=col)

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py | sed -n '320,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   320	    return graph_stats(col=col)
   321	
   322	
   323	# ==================== WRITE TOOLS ====================
   324	
   325	
   326	def tool_add_drawer(
   327	    wing: str, room: str, content: str, source_file: str = None, added_by: str = "mcp"
   328	):
   329	    """File verbatim content into a wing/room. Checks for duplicates first."""
   330	    try:
   331	        wing = sanitize_name(wing, "wing")
   332	        room = sanitize_name(room, "room")
   333	        content = sanitize_content(content)
   334	    except ValueError as e:
   335	        return {"success": False, "error": str(e)}
   336	
   337	    col = _get_collection(create=True)
   338	    if not col:
   339	        return _no_palace()
   340	
   341	    drawer_id = f"drawer_{wing}_{room}_{hashlib.sha256((wing + room + content[:100]).encode()).hexdigest()[:24]}"
   342	
   343	    _wal_log(
   344	        "add_drawer",
   345	        {
   346	            "drawer_id": drawer_id,
   347	            "wing": wing,
   348	            "room": room,
   349	            "added_by": added_by,
   350	            "content_length": len(content),
   351	            "content_preview": content[:200],
   352	        },
   353	    )
   354	
   355	    # Idempotency: if the deterministic ID already exists, return success as a no-op.
   356	    try:
   357	        existing = col.get(ids=[drawer_id])
   358	        if existing and existing["ids"]:
   359	            return {"success": True, "reason": "already_exists", "drawer_id": drawer_id}
   360	    except Exception:
   361	        pass
   362	
   363	    try:
   364	        col.upsert(
   365	            ids=[drawer_id],
   366	            documents=[content],
   367	            metadatas=[
   368	                {
   369	                    "wing": wing,
   370	                    "room": room,
   371	                    "source_file": source_file or "",
   372	                    "chunk_index": 0,
   373	                    "added_by": added_by,
   374	                    "filed_at": datetime.now().isoformat(),
   375	                }
   376	            ],
   377	        )
   378	        logger.info(f"Filed drawer: {drawer_id} → {wing}/{room}")
   379	        return {"success": True, "drawer_id": drawer_id, "wing": wing, "room": room}
   380	    except Exception as e:
   381	        return {"success": False, "error": str(e)}
   382	
   383	
   384	def tool_delete_drawer(drawer_id: str):
   385	    """Delete a single drawer by ID."""
   386	    col = _get_collection()
   387	    if not col:
   388	        return _no_palace()
   389	    existing = col.get(ids=[drawer_id])
   390	    if not existing["ids"]:
   391	        return {"success": False, "error": f"Drawer not found: {drawer_id}"}
   392	
   393	    # Log the deletion with the content being removed for audit trail
   394	    deleted_content = existing.get("documents", [""])[0] if existing.get("documents") else ""
   395	    deleted_meta = existing.get("metadatas", [{}])[0] if existing.get("metadatas") else {}
   396	    _wal_log(
   397	        "delete_drawer",
   398	        {
   399	            "drawer_id": drawer_id,
   400	            "deleted_meta": deleted_meta,
   401	            "content_preview": deleted_content[:200],
   402	        },
   403	    )
   404	
   405	    try:
   406	        col.delete(ids=[drawer_id])
   407	        logger.info(f"Deleted drawer: {drawer_id}")
   408	        return {"success": True, "drawer_id": drawer_id}
   409	    except Exception as e:
   410	        return {"success": False, "error": str(e)}
   411	
   412	
   413	# ==================== KNOWLEDGE GRAPH ====================
   414	
   415	
   416	def tool_kg_query(entity: str, as_of: str = None, direction: str = "both"):
   417	    """Query the knowledge graph for an entity's relationships."""
   418	    results = _kg.query_entity(entity, as_of=as_of, direction=direction)
   419	    return {"entity": entity, "as_of": as_of, "facts": results, "count": len(results)}
   420	
   421	
   422	def tool_kg_add(
   423	    subject: str, predicate: str, object: str, valid_from: str = None, source_closet: str = None
   424	):
   425	    """Add a relationship to the knowledge graph."""
   426	    try:
   427	        subject = sanitize_name(subject, "subject")
   428	        predicate = sanitize_name(predicate, "predicate")
   429	        object = sanitize_name(object, "object")
   430	    except ValueError as e:
   431	        return {"success": False, "error": str(e)}
   432	
   433	    _wal_log(
   434	        "kg_add",
   435	        {
   436	            "subject": subject,
   437	            "predicate": predicate,
   438	            "object": object,
   439	            "valid_from": valid_from,
   440	            "source_closet": source_closet,
   441	        },
   442	    )
   443	    triple_id = _kg.add_triple(
   444	        subject, predicate, object, valid_from=valid_from, source_closet=source_closet
   445	    )
   446	    return {"success": True, "triple_id": triple_id, "fact": f"{subject} → {predicate} → {object}"}
   447	
   448	
   449	def tool_kg_invalidate(subject: str, predicate: str, object: str, ended: str = None):
   450	    """Mark a fact as no longer true (set end date)."""
   451	    _wal_log(
   452	        "kg_invalidate",
   453	        {"subject": subject, "predicate": predicate, "object": object, "ended": ended},
   454	    )
   455	    _kg.invalidate(subject, predicate, object, ended=ended)
   456	    return {
   457	        "success": True,
   458	        "fact": f"{subject} → {predicate} → {object}",
   459	        "ended": ended or "today",
   460	    }
   461	
   462	
   463	def tool_kg_timeline(entity: str = None):
   464	    """Get chronological timeline of facts, optionally for one entity."""
   465	    results = _kg.timeline(entity)
   466	    return {"entity": entity or "all", "timeline": results, "count": len(results)}
   467	
   468	
   469	def tool_kg_stats():
   470	    """Knowledge graph overview: entities, triples, relationship types."""
   471	    return _kg.stats()
   472	
   473	
   474	# ==================== AGENT DIARY ====================
   475	
   476	
   477	def tool_diary_write(agent_name: str, entry: str, topic: str = "general"):
   478	    """
   479	    Write a diary entry for this agent. Each agent gets its own wing
   480	    with a diary room. Entries are timestamped and accumulate over time.
   481	
   482	    This is the agent's personal journal — observations, thoughts,
   483	    what it worked on, what it noticed, what it thinks matters.
   484	    """
   485	    try:
   486	        agent_name = sanitize_name(agent_name, "agent_name")
   487	        entry = sanitize_content(entry)
   488	    except ValueError as e:
   489	        return {"success": False, "error": str(e)}
   490	
   491	    wing = f"wing_{agent_name.lower().replace(' ', '_')}"
   492	    room = "diary"
   493	    col = _get_collection(create=True)
   494	    if not col:
   495	        return _no_palace()
   496	
   497	    now = datetime.now()
   498	    entry_id = f"diary_{wing}_{now.strftime('%Y%m%d_%H%M%S')}_{hashlib.sha256(entry[:50].encode()).hexdigest()[:12]}"
   499	
   500	    _wal_log(
   501	        "diary_write",
   502	        {
   503	            "agent_name": agent_name,
   504	            "topic": topic,
   505	            "entry_id": entry_id,
   506	            "entry_preview": entry[:200],
   507	        },
   508	    )
   509	
   510	    try:
   511	        # TODO: Future versions should expand AAAK before embedding to improve
   512	        # semantic search quality. For now, store raw AAAK in metadata so it's
   513	        # preserved, and keep the document as-is for embedding (even though
   514	        # compressed AAAK degrades embedding quality).
   515	        col.add(
   516	            ids=[entry_id],
   517	            documents=[entry],
   518	            metadatas=[
   519	                {
   520	                    "wing": wing,
   521	                    "room": room,
   522	                    "hall": "hall_diary",
   523	                    "topic": topic,
   524	                    "type": "diary_entry",
   525	                    "agent": agent_name,
   526	                    "filed_at": now.isoformat(),
   527	                    "date": now.strftime("%Y-%m-%d"),
   528	                }
   529	            ],
   530	        )
   531	        logger.info(f"Diary entry: {entry_id} → {wing}/diary/{topic}")
   532	        return {
   533	            "success": True,
   534	            "entry_id": entry_id,
   535	            "agent": agent_name,
   536	            "topic": topic,
   537	            "timestamp": now.isoformat(),
   538	        }
   539	    except Exception as e:
   540	        return {"success": False, "error": str(e)}
   541	
   542	
   543	def tool_diary_read(agent_name: str, last_n: int = 10):
   544	    """
   545	    Read an agent's recent diary entries. Returns the last N entries
   546	    in chronological order — the agent's personal journal.
   547	    """
   548	    wing = f"wing_{agent_name.lower().replace(' ', '_')}"
   549	    col = _get_collection()
   550	    if not col:
   551	        return _no_palace()
   552	
   553	    try:
   554	        results = col.get(
   555	            where={"$and": [{"wing": wing}, {"room": "diary"}]},
   556	            include=["documents", "metadatas"],
   557	            limit=10000,
   558	        )
   559	
   560	        if not results["ids"]:
   561	            return {"agent": agent_name, "entries": [], "message": "No diary entries yet."}
   562	
   563	        # Combine and sort by timestamp
   564	        entries = []
   565	        for doc, meta in zip(results["documents"], results["metadatas"]):
   566	            entries.append(
   567	                {
   568	                    "date": meta.get("date", ""),
   569	                    "timestamp": meta.get("filed_at", ""),
   570	                    "topic": meta.get("topic", ""),
   571	                    "content": doc,
   572	                }
   573	            )
   574	
   575	        entries.sort(key=lambda x: x["timestamp"], reverse=True)
   576	        entries = entries[:last_n]
   577	
   578	        return {
   579	            "agent": agent_name,
   580	            "entries": entries,
   581	            "total": len(results["ids"]),
   582	            "showing": len(entries),
   583	        }
   584	    except Exception as e:
   585	        return {"error": str(e)}
   586	
   587	
   588	# ==================== MCP PROTOCOL ====================
   589	
   590	TOOLS = {
   591	    "mempalace_status": {
   592	        "description": "Palace overview — total drawers, wing and room counts",
   593	        "input_schema": {"type": "object", "properties": {}},
   594	        "handler": tool_status,
   595	    },
   596	    "mempalace_list_wings": {
   597	        "description": "List all wings with drawer counts",
   598	        "input_schema": {"type": "object", "properties": {}},
   599	        "handler": tool_list_wings,
   600	    },
   601	    "mempalace_list_rooms": {
   602	        "description": "List rooms within a wing (or all rooms if no wing given)",
   603	        "input_schema": {
   604	            "type": "object",
   605	            "properties": {
   606	                "wing": {"type": "string", "description": "Wing to list rooms for (optional)"},
   607	            },
   608	        },
   609	        "handler": tool_list_rooms,
   610	    },
   611	    "mempalace_get_taxonomy": {
   612	        "description": "Full taxonomy: wing → room → drawer count",
   613	        "input_schema": {"type": "object", "properties": {}},
   614	        "handler": tool_get_taxonomy,
   615	    },
   616	    "mempalace_get_aaak_spec": {
   617	        "description": "Get the AAAK dialect specification — the compressed memory format MemPalace uses. Call this if you need to read or write AAAK-compressed memories.",
   618	        "input_schema": {"type": "object", "properties": {}},
   619	        "handler": tool_get_aaak_spec,
   620	    },
   621	    "mempalace_kg_query": {
   622	        "description": "Query the knowledge graph for an entity's relationships. Returns typed facts with temporal validity. E.g. 'Max' → child_of Alice, loves chess, does swimming. Filter by date with as_of to see what was true at a point in time.",
   623	        "input_schema": {
   624	            "type": "object",
   625	            "properties": {
   626	                "entity": {
   627	                    "type": "string",
   628	                    "description": "Entity to query (e.g. 'Max', 'MyProject', 'Alice')",
   629	                },
   630	                "as_of": {
   631	                    "type": "string",
   632	                    "description": "Date filter — only facts valid at this date (YYYY-MM-DD, optional)",
   633	                },
   634	                "direction": {
   635	                    "type": "string",
   636	                    "description": "outgoing (entity→?), incoming (?→entity), or both (default: both)",
   637	                },
   638	            },
   639	            "required": ["entity"],
   640	        },
   641	        "handler": tool_kg_query,
   642	    },
   643	    "mempalace_kg_add": {
   644	        "description": "Add a fact to the knowledge graph. Subject → predicate → object with optional time window. E.g. ('Max', 'started_school', 'Year 7', valid_from='2026-09-01').",
   645	        "input_schema": {
   646	            "type": "object",
   647	            "properties": {
   648	                "subject": {"type": "string", "description": "The entity doing/being something"},
   649	                "predicate": {
   650	                    "type": "string",
   651	                    "description": "The relationship type (e.g. 'loves', 'works_on', 'daughter_of')",
   652	                },
   653	                "object": {"type": "string", "description": "The entity being connected to"},
   654	                "valid_from": {
   655	                    "type": "string",
   656	                    "description": "When this became true (YYYY-MM-DD, optional)",
   657	                },
   658	                "source_closet": {
   659	                    "type": "string",
   660	                    "description": "Closet ID where this fact appears (optional)",
   661	                },
   662	            },
   663	            "required": ["subject", "predicate", "object"],
   664	        },
   665	        "handler": tool_kg_add,
   666	    },
   667	    "mempalace_kg_invalidate": {
   668	        "description": "Mark a fact as no longer true. E.g. ankle injury resolved, job ended, moved house.",
   669	        "input_schema": {
   670	            "type": "object",
   671	            "properties": {
   672	                "subject": {"type": "string", "description": "Entity"},
   673	                "predicate": {"type": "string", "description": "Relationship"},
   674	                "object": {"type": "string", "description": "Connected entity"},
   675	                "ended": {
   676	                    "type": "string",
   677	                    "description": "When it stopped being true (YYYY-MM-DD, default: today)",
   678	                },
   679	            },
   680	            "required": ["subject", "predicate", "object"],
   681	        },
   682	        "handler": tool_kg_invalidate,
   683	    },
   684	    "mempalace_kg_timeline": {
   685	        "description": "Chronological timeline of facts. Shows the story of an entity (or everything) in order.",
   686	        "input_schema": {
   687	            "type": "object",
   688	            "properties": {
   689	                "entity": {
   690	                    "type": "string",
   691	                    "description": "Entity to get timeline for (optional — omit for full timeline)",
   692	                },
   693	            },
   694	        },
   695	        "handler": tool_kg_timeline,
   696	    },
   697	    "mempalace_kg_stats": {
   698	        "description": "Knowledge graph overview: entities, triples, current vs expired facts, relationship types.",
   699	        "input_schema": {"type": "object", "properties": {}},
   700	        "handler": tool_kg_stats,
   701	    },
   702	    "mempalace_traverse": {
   703	        "description": "Walk the palace graph from a room. Shows connected ideas across wings — the tunnels. Like following a thread through the palace: start at 'chromadb-setup' in wing_code, discover it connects to wing_myproject (planning) and wing_user (feelings about it).",
   704	        "input_schema": {
   705	            "type": "object",
   706	            "properties": {
   707	                "start_room": {
   708	                    "type": "string",
   709	                    "description": "Room to start from (e.g. 'chromadb-setup', 'riley-school')",
   710	                },
   711	                "max_hops": {
   712	                    "type": "integer",
   713	                    "description": "How many connections to follow (default: 2)",
   714	                },
   715	            },
   716	            "required": ["start_room"],
   717	        },
   718	        "handler": tool_traverse_graph,
   719	    },
   720	    "mempalace_find_tunnels": {
   721	        "description": "Find rooms that bridge two wings — the hallways connecting different domains. E.g. what topics connect wing_code to wing_team?",
   722	        "input_schema": {
   723	            "type": "object",
   724	            "properties": {
   725	                "wing_a": {"type": "string", "description": "First wing (optional)"},
   726	                "wing_b": {"type": "string", "description": "Second wing (optional)"},
   727	            },
   728	        },
   729	        "handler": tool_find_tunnels,
   730	    },
   731	    "mempalace_graph_stats": {
   732	        "description": "Palace graph overview: total rooms, tunnel connections, edges between wings.",
   733	        "input_schema": {"type": "object", "properties": {}},
   734	        "handler": tool_graph_stats,
   735	    },
   736	    "mempalace_search": {
   737	        "description": "Semantic search. Returns verbatim drawer content with similarity scores.",
   738	        "input_schema": {
   739	            "type": "object",
   740	            "properties": {
   741	                "query": {"type": "string", "description": "What to search for"},
   742	                "limit": {"type": "integer", "description": "Max results (default 5)"},
   743	                "wing": {"type": "string", "description": "Filter by wing (optional)"},
   744	                "room": {"type": "string", "description": "Filter by room (optional)"},
   745	            },
   746	            "required": ["query"],
   747	        },
   748	        "handler": tool_search,
   749	    },
   750	    "mempalace_check_duplicate": {
   751	        "description": "Check if content already exists in the palace before filing",
   752	        "input_schema": {
   753	            "type": "object",
   754	            "properties": {
   755	                "content": {"type": "string", "description": "Content to check"},
   756	                "threshold": {
   757	                    "type": "number",
   758	                    "description": "Similarity threshold 0-1 (default 0.9)",
   759	                },
   760	            },

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env python3
     2	"""
     3	searcher.py — Find anything. Exact words.
     4	
     5	Semantic search against the palace.
     6	Returns verbatim text — the actual words, never summaries.
     7	"""
     8	
     9	import logging
    10	from pathlib import Path
    11	
    12	import chromadb
    13	
    14	logger = logging.getLogger("mempalace_mcp")
    15	
    16	
    17	class SearchError(Exception):
    18	    """Raised when search cannot proceed (e.g. no palace found)."""
    19	
    20	
    21	def search(query: str, palace_path: str, wing: str = None, room: str = None, n_results: int = 5):
    22	    """
    23	    Search the palace. Returns verbatim drawer content.
    24	    Optionally filter by wing (project) or room (aspect).
    25	    """
    26	    try:
    27	        client = chromadb.PersistentClient(path=palace_path)
    28	        col = client.get_collection("mempalace_drawers")
    29	    except Exception:
    30	        print(f"\n  No palace found at {palace_path}")
    31	        print("  Run: mempalace init <dir> then mempalace mine <dir>")
    32	        raise SearchError(f"No palace found at {palace_path}")
    33	
    34	    # Build where filter
    35	    where = {}
    36	    if wing and room:
    37	        where = {"$and": [{"wing": wing}, {"room": room}]}
    38	    elif wing:
    39	        where = {"wing": wing}
    40	    elif room:
    41	        where = {"room": room}
    42	
    43	    try:
    44	        kwargs = {
    45	            "query_texts": [query],
    46	            "n_results": n_results,
    47	            "include": ["documents", "metadatas", "distances"],
    48	        }
    49	        if where:
    50	            kwargs["where"] = where
    51	
    52	        results = col.query(**kwargs)
    53	
    54	    except Exception as e:
    55	        print(f"\n  Search error: {e}")
    56	        raise SearchError(f"Search error: {e}") from e
    57	
    58	    docs = results["documents"][0]
    59	    metas = results["metadatas"][0]
    60	    dists = results["distances"][0]
    61	
    62	    if not docs:
    63	        print(f'\n  No results found for: "{query}"')
    64	        return
    65	
    66	    print(f"\n{'=' * 60}")
    67	    print(f'  Results for: "{query}"')
    68	    if wing:
    69	        print(f"  Wing: {wing}")
    70	    if room:
    71	        print(f"  Room: {room}")
    72	    print(f"{'=' * 60}\n")
    73	
    74	    for i, (doc, meta, dist) in enumerate(zip(docs, metas, dists), 1):
    75	        similarity = round(1 - dist, 3)
    76	        source = Path(meta.get("source_file", "?")).name
    77	        wing_name = meta.get("wing", "?")
    78	        room_name = meta.get("room", "?")
    79	
    80	        print(f"  [{i}] {wing_name} / {room_name}")
    81	        print(f"      Source: {source}")
    82	        print(f"      Match:  {similarity}")
    83	        print()
    84	        # Print the verbatim text, indented
    85	        for line in doc.strip().split("\n"):
    86	            print(f"      {line}")
    87	        print()
    88	        print(f"  {'─' * 56}")
    89	
    90	    print()
    91	
    92	
    93	def search_memories(
    94	    query: str, palace_path: str, wing: str = None, room: str = None, n_results: int = 5
    95	) -> dict:
    96	    """
    97	    Programmatic search — returns a dict instead of printing.
    98	    Used by the MCP server and other callers that need data.
    99	    """
   100	    try:
   101	        client = chromadb.PersistentClient(path=palace_path)
   102	        col = client.get_collection("mempalace_drawers")
   103	    except Exception as e:
   104	        logger.error("No palace found at %s: %s", palace_path, e)
   105	        return {
   106	            "error": "No palace found",
   107	            "hint": "Run: mempalace init <dir> && mempalace mine <dir>",
   108	        }
   109	
   110	    # Build where filter
   111	    where = {}
   112	    if wing and room:
   113	        where = {"$and": [{"wing": wing}, {"room": room}]}
   114	    elif wing:
   115	        where = {"wing": wing}
   116	    elif room:
   117	        where = {"room": room}
   118	
   119	    try:
   120	        kwargs = {
   121	            "query_texts": [query],
   122	            "n_results": n_results,
   123	            "include": ["documents", "metadatas", "distances"],
   124	        }
   125	        if where:
   126	            kwargs["where"] = where
   127	
   128	        results = col.query(**kwargs)
   129	    except Exception as e:
   130	        return {"error": f"Search error: {e}"}
   131	
   132	    docs = results["documents"][0]
   133	    metas = results["metadatas"][0]
   134	    dists = results["distances"][0]
   135	
   136	    hits = []
   137	    for doc, meta, dist in zip(docs, metas, dists):
   138	        hits.append(
   139	            {
   140	                "text": doc,
   141	                "wing": meta.get("wing", "unknown"),
   142	                "room": meta.get("room", "unknown"),
   143	                "source_file": Path(meta.get("source_file", "?")).name,
   144	                "similarity": round(1 - dist, 3),
   145	            }
   146	        )
   147	
   148	    return {
   149	        "query": query,
   150	        "filters": {"wing": wing, "room": room},
   151	        "results": hits,
   152	    }

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env python3
     2	"""
     3	layers.py — 4-Layer Memory Stack for mempalace
     4	===================================================
     5	
     6	Load only what you need, when you need it.
     7	
     8	    Layer 0: Identity       (~100 tokens)   — Always loaded. "Who am I?"
     9	    Layer 1: Essential Story (~500-800)      — Always loaded. Top moments from the palace.
    10	    Layer 2: On-Demand      (~200-500 each)  — Loaded when a topic/wing comes up.
    11	    Layer 3: Deep Search    (unlimited)      — Full ChromaDB semantic search.
    12	
    13	Wake-up cost: ~600-900 tokens (L0+L1). Leaves 95%+ of context free.
    14	
    15	Reads directly from ChromaDB (mempalace_drawers)
    16	and ~/.mempalace/identity.txt.
    17	"""
    18	
    19	import os
    20	import sys
    21	from pathlib import Path
    22	from collections import defaultdict
    23	
    24	import chromadb
    25	
    26	from .config import MempalaceConfig
    27	
    28	
    29	# ---------------------------------------------------------------------------
    30	# Layer 0 — Identity
    31	# ---------------------------------------------------------------------------
    32	
    33	
    34	class Layer0:
    35	    """
    36	    ~100 tokens. Always loaded.
    37	    Reads from ~/.mempalace/identity.txt — a plain-text file the user writes.
    38	
    39	    Example identity.txt:
    40	        I am Atlas, a personal AI assistant for Alice.
    41	        Traits: warm, direct, remembers everything.
    42	        People: Alice (creator), Bob (Alice's partner).
    43	        Project: A journaling app that helps people process emotions.
    44	    """
    45	
    46	    def __init__(self, identity_path: str = None):
    47	        if identity_path is None:
    48	            identity_path = os.path.expanduser("~/.mempalace/identity.txt")
    49	        self.path = identity_path
    50	        self._text = None
    51	
    52	    def render(self) -> str:
    53	        """Return the identity text, or a sensible default."""
    54	        if self._text is not None:
    55	            return self._text
    56	
    57	        if os.path.exists(self.path):
    58	            with open(self.path, "r") as f:
    59	                self._text = f.read().strip()
    60	        else:
    61	            self._text = (
    62	                "## L0 — IDENTITY\nNo identity configured. Create ~/.mempalace/identity.txt"
    63	            )
    64	
    65	        return self._text
    66	
    67	    def token_estimate(self) -> int:
    68	        return len(self.render()) // 4
    69	
    70	
    71	# ---------------------------------------------------------------------------
    72	# Layer 1 — Essential Story (auto-generated from palace)
    73	# ---------------------------------------------------------------------------
    74	
    75	
    76	class Layer1:
    77	    """
    78	    ~500-800 tokens. Always loaded.
    79	    Auto-generated from the highest-weight / most-recent drawers in the palace.
    80	    Groups by room, picks the top N moments, compresses to a compact summary.
    81	    """
    82	
    83	    MAX_DRAWERS = 15  # at most 15 moments in wake-up
    84	    MAX_CHARS = 3200  # hard cap on total L1 text (~800 tokens)
    85	
    86	    def __init__(self, palace_path: str = None, wing: str = None):
    87	        cfg = MempalaceConfig()
    88	        self.palace_path = palace_path or cfg.palace_path
    89	        self.wing = wing
    90	
    91	    def generate(self) -> str:
    92	        """Pull top drawers from ChromaDB and format as compact L1 text."""
    93	        try:
    94	            client = chromadb.PersistentClient(path=self.palace_path)
    95	            col = client.get_collection("mempalace_drawers")
    96	        except Exception:
    97	            return "## L1 — No palace found. Run: mempalace mine <dir>"
    98	
    99	        # Fetch all drawers in batches to avoid SQLite variable limit (~999)
   100	        _BATCH = 500
   101	        docs, metas = [], []
   102	        offset = 0
   103	        while True:
   104	            kwargs = {"include": ["documents", "metadatas"], "limit": _BATCH, "offset": offset}
   105	            if self.wing:
   106	                kwargs["where"] = {"wing": self.wing}
   107	            try:
   108	                batch = col.get(**kwargs)
   109	            except Exception:
   110	                break
   111	            batch_docs = batch.get("documents", [])
   112	            batch_metas = batch.get("metadatas", [])
   113	            if not batch_docs:
   114	                break
   115	            docs.extend(batch_docs)
   116	            metas.extend(batch_metas)
   117	            offset += len(batch_docs)
   118	            if len(batch_docs) < _BATCH:
   119	                break
   120	
   121	        if not docs:
   122	            return "## L1 — No memories yet."
   123	
   124	        # Score each drawer: prefer high importance, recent filing
   125	        scored = []
   126	        for doc, meta in zip(docs, metas):
   127	            importance = 3
   128	            # Try multiple metadata keys that might carry weight info
   129	            for key in ("importance", "emotional_weight", "weight"):
   130	                val = meta.get(key)
   131	                if val is not None:
   132	                    try:
   133	                        importance = float(val)
   134	                    except (ValueError, TypeError):
   135	                        pass
   136	                    break
   137	            scored.append((importance, meta, doc))
   138	
   139	        # Sort by importance descending, take top N
   140	        scored.sort(key=lambda x: x[0], reverse=True)
   141	        top = scored[: self.MAX_DRAWERS]
   142	
   143	        # Group by room for readability
   144	        by_room = defaultdict(list)
   145	        for imp, meta, doc in top:
   146	            room = meta.get("room", "general")
   147	            by_room[room].append((imp, meta, doc))
   148	
   149	        # Build compact text
   150	        lines = ["## L1 — ESSENTIAL STORY"]
   151	
   152	        total_len = 0
   153	        for room, entries in sorted(by_room.items()):
   154	            room_line = f"\n[{room}]"
   155	            lines.append(room_line)
   156	            total_len += len(room_line)
   157	
   158	            for imp, meta, doc in entries:
   159	                source = Path(meta.get("source_file", "")).name if meta.get("source_file") else ""
   160	
   161	                # Truncate doc to keep L1 compact
   162	                snippet = doc.strip().replace("\n", " ")
   163	                if len(snippet) > 200:
   164	                    snippet = snippet[:197] + "..."
   165	
   166	                entry_line = f"  - {snippet}"
   167	                if source:
   168	                    entry_line += f"  ({source})"
   169	
   170	                if total_len + len(entry_line) > self.MAX_CHARS:
   171	                    lines.append("  ... (more in L3 search)")
   172	                    return "\n".join(lines)
   173	
   174	                lines.append(entry_line)
   175	                total_len += len(entry_line)
   176	
   177	        return "\n".join(lines)
   178	
   179	
   180	# ---------------------------------------------------------------------------
   181	# Layer 2 — On-Demand (wing/room filtered retrieval)
   182	# ---------------------------------------------------------------------------
   183	
   184	
   185	class Layer2:
   186	    """
   187	    ~200-500 tokens per retrieval.
   188	    Loaded when a specific topic or wing comes up in conversation.
   189	    Queries ChromaDB with a wing/room filter.
   190	    """
   191	
   192	    def __init__(self, palace_path: str = None):
   193	        cfg = MempalaceConfig()
   194	        self.palace_path = palace_path or cfg.palace_path
   195	
   196	    def retrieve(self, wing: str = None, room: str = None, n_results: int = 10) -> str:
   197	        """Retrieve drawers filtered by wing and/or room."""
   198	        try:
   199	            client = chromadb.PersistentClient(path=self.palace_path)
   200	            col = client.get_collection("mempalace_drawers")
   201	        except Exception:
   202	            return "No palace found."
   203	
   204	        where = {}
   205	        if wing and room:
   206	            where = {"$and": [{"wing": wing}, {"room": room}]}
   207	        elif wing:
   208	            where = {"wing": wing}
   209	        elif room:
   210	            where = {"room": room}
   211	
   212	        kwargs = {"include": ["documents", "metadatas"], "limit": n_results}
   213	        if where:
   214	            kwargs["where"] = where
   215	
   216	        try:
   217	            results = col.get(**kwargs)
   218	        except Exception as e:
   219	            return f"Retrieval error: {e}"
   220	
   221	        docs = results.get("documents", [])
   222	        metas = results.get("metadatas", [])
   223	
   224	        if not docs:
   225	            label = f"wing={wing}" if wing else ""
   226	            if room:
   227	                label += f" room={room}" if label else f"room={room}"
   228	            return f"No drawers found for {label}."
   229	
   230	        lines = [f"## L2 — ON-DEMAND ({len(docs)} drawers)"]
   231	        for doc, meta in zip(docs[:n_results], metas[:n_results]):
   232	            room_name = meta.get("room", "?")
   233	            source = Path(meta.get("source_file", "")).name if meta.get("source_file") else ""
   234	            snippet = doc.strip().replace("\n", " ")
   235	            if len(snippet) > 300:
   236	                snippet = snippet[:297] + "..."
   237	            entry = f"  [{room_name}] {snippet}"
   238	            if source:
   239	                entry += f"  ({source})"
   240	            lines.append(entry)
   241	
   242	        return "\n".join(lines)
   243	
   244	
   245	# ---------------------------------------------------------------------------
   246	# Layer 3 — Deep Search (full semantic search via ChromaDB)
   247	# ---------------------------------------------------------------------------
   248	
   249	
   250	class Layer3:
   251	    """
   252	    Unlimited depth. Semantic search against the full palace.
   253	    Reuses searcher.py logic against mempalace_drawers.
   254	    """
   255	
   256	    def __init__(self, palace_path: str = None):
   257	        cfg = MempalaceConfig()
   258	        self.palace_path = palace_path or cfg.palace_path
   259	
   260	    def search(self, query: str, wing: str = None, room: str = None, n_results: int = 5) -> str:
   261	        """Semantic search, returns compact result text."""
   262	        try:
   263	            client = chromadb.PersistentClient(path=self.palace_path)
   264	            col = client.get_collection("mempalace_drawers")
   265	        except Exception:
   266	            return "No palace found."
   267	
   268	        where = {}
   269	        if wing and room:
   270	            where = {"$and": [{"wing": wing}, {"room": room}]}
   271	        elif wing:
   272	            where = {"wing": wing}
   273	        elif room:
   274	            where = {"room": room}
   275	
   276	        kwargs = {
   277	            "query_texts": [query],
   278	            "n_results": n_results,
   279	            "include": ["documents", "metadatas", "distances"],
   280	        }
   281	        if where:
   282	            kwargs["where"] = where
   283	
   284	        try:
   285	            results = col.query(**kwargs)
   286	        except Exception as e:
   287	            return f"Search error: {e}"
   288	
   289	        docs = results["documents"][0]
   290	        metas = results["metadatas"][0]
   291	        dists = results["distances"][0]
   292	
   293	        if not docs:
   294	            return "No results found."
   295	
   296	        lines = [f'## L3 — SEARCH RESULTS for "{query}"']
   297	        for i, (doc, meta, dist) in enumerate(zip(docs, metas, dists), 1):
   298	            similarity = round(1 - dist, 3)
   299	            wing_name = meta.get("wing", "?")
   300	            room_name = meta.get("room", "?")
   301	            source = Path(meta.get("source_file", "")).name if meta.get("source_file") else ""
   302	
   303	            snippet = doc.strip().replace("\n", " ")
   304	            if len(snippet) > 300:
   305	                snippet = snippet[:297] + "..."
   306	
   307	            lines.append(f"  [{i}] {wing_name}/{room_name} (sim={similarity})")
   308	            lines.append(f"      {snippet}")
   309	            if source:
   310	                lines.append(f"      src: {source}")
   311	
   312	        return "\n".join(lines)
   313	
   314	    def search_raw(
   315	        self, query: str, wing: str = None, room: str = None, n_results: int = 5
   316	    ) -> list:
   317	        """Return raw dicts instead of formatted text."""
   318	        try:
   319	            client = chromadb.PersistentClient(path=self.palace_path)
   320	            col = client.get_collection("mempalace_drawers")
   321	        except Exception:
   322	            return []
   323	
   324	        where = {}
   325	        if wing and room:
   326	            where = {"$and": [{"wing": wing}, {"room": room}]}
   327	        elif wing:
   328	            where = {"wing": wing}
   329	        elif room:
   330	            where = {"room": room}
   331	
   332	        kwargs = {
   333	            "query_texts": [query],
   334	            "n_results": n_results,
   335	            "include": ["documents", "metadatas", "distances"],
   336	        }
   337	        if where:
   338	            kwargs["where"] = where
   339	
   340	        try:

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py | sed -n '340,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   340	        try:
   341	            results = col.query(**kwargs)
   342	        except Exception:
   343	            return []
   344	
   345	        hits = []
   346	        for doc, meta, dist in zip(
   347	            results["documents"][0],
   348	            results["metadatas"][0],
   349	            results["distances"][0],
   350	        ):
   351	            hits.append(
   352	                {
   353	                    "text": doc,
   354	                    "wing": meta.get("wing", "unknown"),
   355	                    "room": meta.get("room", "unknown"),
   356	                    "source_file": Path(meta.get("source_file", "?")).name,
   357	                    "similarity": round(1 - dist, 3),
   358	                    "metadata": meta,
   359	                }
   360	            )
   361	        return hits
   362	
   363	
   364	# ---------------------------------------------------------------------------
   365	# MemoryStack — unified interface
   366	# ---------------------------------------------------------------------------
   367	
   368	
   369	class MemoryStack:
   370	    """
   371	    The full 4-layer stack. One class, one palace, everything works.
   372	
   373	        stack = MemoryStack()
   374	        print(stack.wake_up())                # L0 + L1 (~600-900 tokens)
   375	        print(stack.recall(wing="my_app"))     # L2 on-demand
   376	        print(stack.search("pricing change"))  # L3 deep search
   377	    """
   378	
   379	    def __init__(self, palace_path: str = None, identity_path: str = None):
   380	        cfg = MempalaceConfig()
   381	        self.palace_path = palace_path or cfg.palace_path
   382	        self.identity_path = identity_path or os.path.expanduser("~/.mempalace/identity.txt")
   383	
   384	        self.l0 = Layer0(self.identity_path)
   385	        self.l1 = Layer1(self.palace_path)
   386	        self.l2 = Layer2(self.palace_path)
   387	        self.l3 = Layer3(self.palace_path)
   388	
   389	    def wake_up(self, wing: str = None) -> str:
   390	        """
   391	        Generate wake-up text: L0 (identity) + L1 (essential story).
   392	        Typically ~600-900 tokens. Inject into system prompt or first message.
   393	
   394	        Args:
   395	            wing: Optional wing filter for L1 (project-specific wake-up).
   396	        """
   397	        parts = []
   398	
   399	        # L0: Identity
   400	        parts.append(self.l0.render())
   401	        parts.append("")
   402	
   403	        # L1: Essential Story
   404	        if wing:
   405	            self.l1.wing = wing
   406	        parts.append(self.l1.generate())
   407	
   408	        return "\n".join(parts)
   409	
   410	    def recall(self, wing: str = None, room: str = None, n_results: int = 10) -> str:
   411	        """On-demand L2 retrieval filtered by wing/room."""
   412	        return self.l2.retrieve(wing=wing, room=room, n_results=n_results)
   413	
   414	    def search(self, query: str, wing: str = None, room: str = None, n_results: int = 5) -> str:
   415	        """Deep L3 semantic search."""
   416	        return self.l3.search(query, wing=wing, room=room, n_results=n_results)
   417	
   418	    def status(self) -> dict:
   419	        """Status of all layers."""
   420	        result = {
   421	            "palace_path": self.palace_path,
   422	            "L0_identity": {
   423	                "path": self.identity_path,
   424	                "exists": os.path.exists(self.identity_path),
   425	                "tokens": self.l0.token_estimate(),
   426	            },
   427	            "L1_essential": {
   428	                "description": "Auto-generated from top palace drawers",
   429	            },
   430	            "L2_on_demand": {
   431	                "description": "Wing/room filtered retrieval",
   432	            },
   433	            "L3_deep_search": {
   434	                "description": "Full semantic search via ChromaDB",
   435	            },
   436	        }
   437	
   438	        # Count drawers
   439	        try:
   440	            client = chromadb.PersistentClient(path=self.palace_path)
   441	            col = client.get_collection("mempalace_drawers")
   442	            count = col.count()
   443	            result["total_drawers"] = count
   444	        except Exception:
   445	            result["total_drawers"] = 0
   446	
   447	        return result
   448	
   449	
   450	# ---------------------------------------------------------------------------
   451	# CLI (standalone)
   452	# ---------------------------------------------------------------------------
   453	
   454	if __name__ == "__main__":
   455	    import json
   456	
   457	    def usage():
   458	        print("layers.py — 4-Layer Memory Stack")
   459	        print()
   460	        print("Usage:")
   461	        print("  python layers.py wake-up              Show L0 + L1")
   462	        print("  python layers.py wake-up --wing=NAME  Wake-up for a specific project")
   463	        print("  python layers.py recall --wing=NAME   On-demand L2 retrieval")
   464	        print("  python layers.py search <query>       Deep L3 search")
   465	        print("  python layers.py status               Show layer status")
   466	        sys.exit(0)
   467	
   468	    if len(sys.argv) < 2:
   469	        usage()
   470	
   471	    cmd = sys.argv[1]
   472	
   473	    # Parse flags
   474	    flags = {}
   475	    positional = []
   476	    for arg in sys.argv[2:]:
   477	        if arg.startswith("--") and "=" in arg:
   478	            key, val = arg.split("=", 1)
   479	            flags[key.lstrip("-")] = val
   480	        elif not arg.startswith("--"):
   481	            positional.append(arg)
   482	
   483	    palace_path = flags.get("palace")
   484	    stack = MemoryStack(palace_path=palace_path)
   485	
   486	    if cmd in ("wake-up", "wakeup"):
   487	        wing = flags.get("wing")
   488	        text = stack.wake_up(wing=wing)
   489	        tokens = len(text) // 4
   490	        print(f"Wake-up text (~{tokens} tokens):")
   491	        print("=" * 50)
   492	        print(text)
   493	
   494	    elif cmd == "recall":
   495	        wing = flags.get("wing")
   496	        room = flags.get("room")
   497	        text = stack.recall(wing=wing, room=room)
   498	        print(text)
   499	
   500	    elif cmd == "search":
   501	        query = " ".join(positional) if positional else ""
   502	        if not query:
   503	            print("Usage: python layers.py search <query>")
   504	            sys.exit(1)
   505	        wing = flags.get("wing")
   506	        room = flags.get("room")
   507	        text = stack.search(query, wing=wing, room=room)
   508	        print(text)
   509	
   510	    elif cmd == "status":
   511	        s = stack.status()
   512	        print(json.dumps(s, indent=2))
   513	
   514	    else:
   515	        usage()

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py | sed -n '1,320p' && printf '\\n--- KG ---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	"""
     2	palace_graph.py — Graph traversal layer for MemPalace
     3	======================================================
     4	
     5	Builds a navigable graph from the palace structure:
     6	  - Nodes = rooms (named ideas)
     7	  - Edges = shared rooms across wings (tunnels)
     8	  - Edge types = halls (the corridors)
     9	
    10	Enables queries like:
    11	  "Start at chromadb-setup in wing_code, walk to wing_myproject"
    12	  "Find all rooms connected to riley-college-apps"
    13	  "What topics bridge wing_hardware and wing_myproject?"
    14	
    15	No external graph DB needed — built from ChromaDB metadata.
    16	"""
    17	
    18	from collections import defaultdict, Counter
    19	from .config import MempalaceConfig
    20	
    21	import chromadb
    22	
    23	
    24	def _get_collection(config=None):
    25	    config = config or MempalaceConfig()
    26	    try:
    27	        client = chromadb.PersistentClient(path=config.palace_path)
    28	        return client.get_collection(config.collection_name)
    29	    except Exception:
    30	        return None
    31	
    32	
    33	def build_graph(col=None, config=None):
    34	    """
    35	    Build the palace graph from ChromaDB metadata.
    36	
    37	    Returns:
    38	        nodes: dict of {room: {wings: set, halls: set, count: int}}
    39	        edges: list of {room, wing_a, wing_b, hall} — one per tunnel crossing
    40	    """
    41	    if col is None:
    42	        col = _get_collection(config)
    43	    if not col:
    44	        return {}, []
    45	
    46	    total = col.count()
    47	    room_data = defaultdict(lambda: {"wings": set(), "halls": set(), "count": 0, "dates": set()})
    48	
    49	    offset = 0
    50	    while offset < total:
    51	        batch = col.get(limit=1000, offset=offset, include=["metadatas"])
    52	        for meta in batch["metadatas"]:
    53	            room = meta.get("room", "")
    54	            wing = meta.get("wing", "")
    55	            hall = meta.get("hall", "")
    56	            date = meta.get("date", "")
    57	            if room and room != "general" and wing:
    58	                room_data[room]["wings"].add(wing)
    59	                if hall:
    60	                    room_data[room]["halls"].add(hall)
    61	                if date:
    62	                    room_data[room]["dates"].add(date)
    63	                room_data[room]["count"] += 1
    64	        if not batch["ids"]:
    65	            break
    66	        offset += len(batch["ids"])
    67	
    68	    # Build edges from rooms that span multiple wings
    69	    edges = []
    70	    for room, data in room_data.items():
    71	        wings = sorted(data["wings"])
    72	        if len(wings) >= 2:
    73	            for i, wa in enumerate(wings):
    74	                for wb in wings[i + 1 :]:
    75	                    for hall in data["halls"]:
    76	                        edges.append(
    77	                            {
    78	                                "room": room,
    79	                                "wing_a": wa,
    80	                                "wing_b": wb,
    81	                                "hall": hall,
    82	                                "count": data["count"],
    83	                            }
    84	                        )
    85	
    86	    # Convert sets to lists for JSON serialization
    87	    nodes = {}
    88	    for room, data in room_data.items():
    89	        nodes[room] = {
    90	            "wings": sorted(data["wings"]),
    91	            "halls": sorted(data["halls"]),
    92	            "count": data["count"],
    93	            "dates": sorted(data["dates"])[-5:] if data["dates"] else [],
    94	        }
    95	
    96	    return nodes, edges
    97	
    98	
    99	def traverse(start_room: str, col=None, config=None, max_hops: int = 2):
   100	    """
   101	    Walk the graph from a starting room. Find connected rooms
   102	    through shared wings.
   103	
   104	    Returns list of paths: [{room, wing, hall, hop_distance}]
   105	    """
   106	    nodes, edges = build_graph(col, config)
   107	
   108	    if start_room not in nodes:
   109	        return {
   110	            "error": f"Room '{start_room}' not found",
   111	            "suggestions": _fuzzy_match(start_room, nodes),
   112	        }
   113	
   114	    start = nodes[start_room]
   115	    visited = {start_room}
   116	    results = [
   117	        {
   118	            "room": start_room,
   119	            "wings": start["wings"],
   120	            "halls": start["halls"],
   121	            "count": start["count"],
   122	            "hop": 0,
   123	        }
   124	    ]
   125	
   126	    # BFS traversal
   127	    frontier = [(start_room, 0)]
   128	    while frontier:
   129	        current_room, depth = frontier.pop(0)
   130	        if depth >= max_hops:
   131	            continue
   132	
   133	        current = nodes.get(current_room, {})
   134	        current_wings = set(current.get("wings", []))
   135	
   136	        # Find all rooms that share a wing with current room
   137	        for room, data in nodes.items():
   138	            if room in visited:
   139	                continue
   140	            shared_wings = current_wings & set(data["wings"])
   141	            if shared_wings:
   142	                visited.add(room)
   143	                results.append(
   144	                    {
   145	                        "room": room,
   146	                        "wings": data["wings"],
   147	                        "halls": data["halls"],
   148	                        "count": data["count"],
   149	                        "hop": depth + 1,
   150	                        "connected_via": sorted(shared_wings),
   151	                    }
   152	                )
   153	                if depth + 1 < max_hops:
   154	                    frontier.append((room, depth + 1))
   155	
   156	    # Sort by relevance (hop distance, then count)
   157	    results.sort(key=lambda x: (x["hop"], -x["count"]))
   158	    return results[:50]  # cap results
   159	
   160	
   161	def find_tunnels(wing_a: str = None, wing_b: str = None, col=None, config=None):
   162	    """
   163	    Find rooms that connect two wings (or all tunnel rooms if no wings specified).
   164	    These are the "hallways" — same named idea appearing in multiple domains.
   165	    """
   166	    nodes, edges = build_graph(col, config)
   167	
   168	    tunnels = []
   169	    for room, data in nodes.items():
   170	        wings = data["wings"]
   171	        if len(wings) < 2:
   172	            continue
   173	
   174	        if wing_a and wing_a not in wings:
   175	            continue
   176	        if wing_b and wing_b not in wings:
   177	            continue
   178	
   179	        tunnels.append(
   180	            {
   181	                "room": room,
   182	                "wings": wings,
   183	                "halls": data["halls"],
   184	                "count": data["count"],
   185	                "recent": data["dates"][-1] if data["dates"] else "",
   186	            }
   187	        )
   188	
   189	    tunnels.sort(key=lambda x: -x["count"])
   190	    return tunnels[:50]
   191	
   192	
   193	def graph_stats(col=None, config=None):
   194	    """Summary statistics about the palace graph."""
   195	    nodes, edges = build_graph(col, config)
   196	
   197	    tunnel_rooms = sum(1 for n in nodes.values() if len(n["wings"]) >= 2)
   198	    wing_counts = Counter()
   199	    for data in nodes.values():
   200	        for w in data["wings"]:
   201	            wing_counts[w] += 1
   202	
   203	    return {
   204	        "total_rooms": len(nodes),
   205	        "tunnel_rooms": tunnel_rooms,
   206	        "total_edges": len(edges),
   207	        "rooms_per_wing": dict(wing_counts.most_common()),
   208	        "top_tunnels": [
   209	            {"room": r, "wings": d["wings"], "count": d["count"]}
   210	            for r, d in sorted(nodes.items(), key=lambda x: -len(x[1]["wings"]))[:10]
   211	            if len(d["wings"]) >= 2
   212	        ],
   213	    }
   214	
   215	
   216	def _fuzzy_match(query: str, nodes: dict, n: int = 5):
   217	    """Find rooms that approximately match a query string."""
   218	    query_lower = query.lower()
   219	    scored = []
   220	    for room in nodes:
   221	        # Simple substring matching
   222	        if query_lower in room:
   223	            scored.append((room, 1.0))
   224	        elif any(word in room for word in query_lower.split("-")):
   225	            scored.append((room, 0.5))
   226	    scored.sort(key=lambda x: -x[1])
   227	    return [r for r, _ in scored[:n]]

--- KG ---
     1	"""
     2	knowledge_graph.py — Temporal Entity-Relationship Graph for MemPalace
     3	=====================================================================
     4	
     5	Real knowledge graph with:
     6	  - Entity nodes (people, projects, tools, concepts)
     7	  - Typed relationship edges (daughter_of, does, loves, works_on, etc.)
     8	  - Temporal validity (valid_from → valid_to — knows WHEN facts are true)
     9	  - Closet references (links back to the verbatim memory)
    10	
    11	Storage: SQLite (local, no dependencies, no subscriptions)
    12	Query: entity-first traversal with time filtering
    13	
    14	This is what competes with Zep's temporal knowledge graph.
    15	Zep uses Neo4j in the cloud ($25/mo+). We use SQLite locally (free).
    16	
    17	Usage:
    18	    from mempalace.knowledge_graph import KnowledgeGraph
    19	
    20	    kg = KnowledgeGraph()
    21	    kg.add_triple("Max", "child_of", "Alice", valid_from="2015-04-01")
    22	    kg.add_triple("Max", "does", "swimming", valid_from="2025-01-01")
    23	    kg.add_triple("Max", "loves", "chess", valid_from="2025-10-01")
    24	
    25	    # Query: everything about Max
    26	    kg.query_entity("Max")
    27	
    28	    # Query: what was true about Max in January 2026?
    29	    kg.query_entity("Max", as_of="2026-01-15")
    30	
    31	    # Query: who is connected to Alice?
    32	    kg.query_entity("Alice", direction="both")
    33	
    34	    # Invalidate: Max's sports injury resolved
    35	    kg.invalidate("Max", "has_issue", "sports_injury", ended="2026-02-15")
    36	"""
    37	
    38	import hashlib
    39	import json
    40	import os
    41	import sqlite3
    42	from datetime import date, datetime
    43	from pathlib import Path
    44	
    45	
    46	DEFAULT_KG_PATH = os.path.expanduser("~/.mempalace/knowledge_graph.sqlite3")
    47	
    48	
    49	class KnowledgeGraph:
    50	    def __init__(self, db_path: str = None):
    51	        self.db_path = db_path or DEFAULT_KG_PATH
    52	        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
    53	        self._connection = None
    54	        self._init_db()
    55	
    56	    def _init_db(self):
    57	        conn = self._conn()
    58	        conn.executescript("""
    59	            PRAGMA journal_mode=WAL;
    60	
    61	            CREATE TABLE IF NOT EXISTS entities (
    62	                id TEXT PRIMARY KEY,
    63	                name TEXT NOT NULL,
    64	                type TEXT DEFAULT 'unknown',
    65	                properties TEXT DEFAULT '{}',
    66	                created_at TEXT DEFAULT CURRENT_TIMESTAMP
    67	            );
    68	
    69	            CREATE TABLE IF NOT EXISTS triples (
    70	                id TEXT PRIMARY KEY,
    71	                subject TEXT NOT NULL,
    72	                predicate TEXT NOT NULL,
    73	                object TEXT NOT NULL,
    74	                valid_from TEXT,
    75	                valid_to TEXT,
    76	                confidence REAL DEFAULT 1.0,
    77	                source_closet TEXT,
    78	                source_file TEXT,
    79	                extracted_at TEXT DEFAULT CURRENT_TIMESTAMP,
    80	                FOREIGN KEY (subject) REFERENCES entities(id),
    81	                FOREIGN KEY (object) REFERENCES entities(id)
    82	            );
    83	
    84	            CREATE INDEX IF NOT EXISTS idx_triples_subject ON triples(subject);
    85	            CREATE INDEX IF NOT EXISTS idx_triples_object ON triples(object);
    86	            CREATE INDEX IF NOT EXISTS idx_triples_predicate ON triples(predicate);
    87	            CREATE INDEX IF NOT EXISTS idx_triples_valid ON triples(valid_from, valid_to);
    88	        """)
    89	        conn.commit()
    90	
    91	    def _conn(self):
    92	        if self._connection is None:
    93	            self._connection = sqlite3.connect(self.db_path, timeout=10, check_same_thread=False)
    94	            self._connection.execute("PRAGMA journal_mode=WAL")
    95	            self._connection.row_factory = sqlite3.Row
    96	        return self._connection
    97	
    98	    def close(self):
    99	        """Close the database connection."""
   100	        if self._connection is not None:
   101	            self._connection.close()
   102	            self._connection = None
   103	
   104	    def _entity_id(self, name: str) -> str:
   105	        return name.lower().replace(" ", "_").replace("'", "")
   106	
   107	    # ── Write operations ──────────────────────────────────────────────────
   108	
   109	    def add_entity(self, name: str, entity_type: str = "unknown", properties: dict = None):
   110	        """Add or update an entity node."""
   111	        eid = self._entity_id(name)
   112	        props = json.dumps(properties or {})
   113	        conn = self._conn()
   114	        with conn:
   115	            conn.execute(
   116	                "INSERT OR REPLACE INTO entities (id, name, type, properties) VALUES (?, ?, ?, ?)",
   117	                (eid, name, entity_type, props),
   118	            )
   119	        return eid
   120	
   121	    def add_triple(
   122	        self,
   123	        subject: str,
   124	        predicate: str,
   125	        obj: str,
   126	        valid_from: str = None,
   127	        valid_to: str = None,
   128	        confidence: float = 1.0,
   129	        source_closet: str = None,
   130	        source_file: str = None,
   131	    ):
   132	        """
   133	        Add a relationship triple: subject → predicate → object.
   134	
   135	        Examples:
   136	            add_triple("Max", "child_of", "Alice", valid_from="2015-04-01")
   137	            add_triple("Max", "does", "swimming", valid_from="2025-01-01")
   138	            add_triple("Alice", "worried_about", "Max injury", valid_from="2026-01", valid_to="2026-02")
   139	        """
   140	        sub_id = self._entity_id(subject)
   141	        obj_id = self._entity_id(obj)
   142	        pred = predicate.lower().replace(" ", "_")
   143	
   144	        # Auto-create entities if they don't exist
   145	        conn = self._conn()
   146	        with conn:
   147	            conn.execute(
   148	                "INSERT OR IGNORE INTO entities (id, name) VALUES (?, ?)", (sub_id, subject)
   149	            )
   150	            conn.execute("INSERT OR IGNORE INTO entities (id, name) VALUES (?, ?)", (obj_id, obj))
   151	
   152	            # Check for existing identical triple
   153	            existing = conn.execute(
   154	                "SELECT id FROM triples WHERE subject=? AND predicate=? AND object=? AND valid_to IS NULL",
   155	                (sub_id, pred, obj_id),
   156	            ).fetchone()
   157	
   158	            if existing:
   159	                return existing["id"]  # Already exists and still valid
   160	
   161	            triple_id = f"t_{sub_id}_{pred}_{obj_id}_{hashlib.sha256(f'{valid_from}{datetime.now().isoformat()}'.encode()).hexdigest()[:12]}"
   162	
   163	            conn.execute(
   164	                """INSERT INTO triples (id, subject, predicate, object, valid_from, valid_to, confidence, source_closet, source_file)
   165	                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
   166	                (
   167	                    triple_id,
   168	                    sub_id,
   169	                    pred,
   170	                    obj_id,
   171	                    valid_from,
   172	                    valid_to,
   173	                    confidence,
   174	                    source_closet,
   175	                    source_file,
   176	                ),
   177	            )
   178	        return triple_id
   179	
   180	    def invalidate(self, subject: str, predicate: str, obj: str, ended: str = None):
   181	        """Mark a relationship as no longer valid (set valid_to date)."""
   182	        sub_id = self._entity_id(subject)
   183	        obj_id = self._entity_id(obj)
   184	        pred = predicate.lower().replace(" ", "_")
   185	        ended = ended or date.today().isoformat()
   186	
   187	        conn = self._conn()
   188	        with conn:
   189	            conn.execute(
   190	                "UPDATE triples SET valid_to=? WHERE subject=? AND predicate=? AND object=? AND valid_to IS NULL",
   191	                (ended, sub_id, pred, obj_id),
   192	            )
   193	
   194	    # ── Query operations ──────────────────────────────────────────────────
   195	
   196	    def query_entity(self, name: str, as_of: str = None, direction: str = "outgoing"):
   197	        """
   198	        Get all relationships for an entity.
   199	
   200	        direction: "outgoing" (entity → ?), "incoming" (? → entity), "both"
   201	        as_of: date string — only return facts valid at that time
   202	        """
   203	        eid = self._entity_id(name)
   204	        conn = self._conn()
   205	
   206	        results = []
   207	
   208	        if direction in ("outgoing", "both"):
   209	            query = "SELECT t.*, e.name as obj_name FROM triples t JOIN entities e ON t.object = e.id WHERE t.subject = ?"
   210	            params = [eid]
   211	            if as_of:
   212	                query += " AND (t.valid_from IS NULL OR t.valid_from <= ?) AND (t.valid_to IS NULL OR t.valid_to >= ?)"
   213	                params.extend([as_of, as_of])
   214	            for row in conn.execute(query, params).fetchall():
   215	                results.append(
   216	                    {
   217	                        "direction": "outgoing",
   218	                        "subject": name,
   219	                        "predicate": row["predicate"],
   220	                        "object": row["obj_name"],
   221	                        "valid_from": row["valid_from"],
   222	                        "valid_to": row["valid_to"],
   223	                        "confidence": row["confidence"],
   224	                        "source_closet": row["source_closet"],
   225	                        "current": row["valid_to"] is None,
   226	                    }
   227	                )
   228	
   229	        if direction in ("incoming", "both"):
   230	            query = "SELECT t.*, e.name as sub_name FROM triples t JOIN entities e ON t.subject = e.id WHERE t.object = ?"
   231	            params = [eid]
   232	            if as_of:
   233	                query += " AND (t.valid_from IS NULL OR t.valid_from <= ?) AND (t.valid_to IS NULL OR t.valid_to >= ?)"
   234	                params.extend([as_of, as_of])
   235	            for row in conn.execute(query, params).fetchall():
   236	                results.append(
   237	                    {
   238	                        "direction": "incoming",
   239	                        "subject": row["sub_name"],
   240	                        "predicate": row["predicate"],
   241	                        "object": name,
   242	                        "valid_from": row["valid_from"],
   243	                        "valid_to": row["valid_to"],
   244	                        "confidence": row["confidence"],
   245	                        "source_closet": row["source_closet"],
   246	                        "current": row["valid_to"] is None,
   247	                    }
   248	                )
   249	
   250	        return results
   251	
   252	    def query_relationship(self, predicate: str, as_of: str = None):
   253	        """Get all triples with a given relationship type."""
   254	        pred = predicate.lower().replace(" ", "_")
   255	        conn = self._conn()
   256	        query = """
   257	            SELECT t.*, s.name as sub_name, o.name as obj_name
   258	            FROM triples t
   259	            JOIN entities s ON t.subject = s.id
   260	            JOIN entities o ON t.object = o.id
   261	            WHERE t.predicate = ?
   262	        """
   263	        params = [pred]
   264	        if as_of:
   265	            query += " AND (t.valid_from IS NULL OR t.valid_from <= ?) AND (t.valid_to IS NULL OR t.valid_to >= ?)"
   266	            params.extend([as_of, as_of])
   267	
   268	        results = []
   269	        for row in conn.execute(query, params).fetchall():
   270	            results.append(
   271	                {
   272	                    "subject": row["sub_name"],
   273	                    "predicate": pred,
   274	                    "object": row["obj_name"],
   275	                    "valid_from": row["valid_from"],
   276	                    "valid_to": row["valid_to"],
   277	                    "current": row["valid_to"] is None,
   278	                }
   279	            )
   280	        return results
   281	
   282	    def timeline(self, entity_name: str = None):
   283	        """Get all facts in chronological order, optionally filtered by entity."""
   284	        conn = self._conn()
   285	        if entity_name:
   286	            eid = self._entity_id(entity_name)
   287	            rows = conn.execute(
   288	                """
   289	                SELECT t.*, s.name as sub_name, o.name as obj_name
   290	                FROM triples t
   291	                JOIN entities s ON t.subject = s.id
   292	                JOIN entities o ON t.object = o.id
   293	                WHERE (t.subject = ? OR t.object = ?)
   294	                ORDER BY t.valid_from ASC NULLS LAST
   295	                LIMIT 100
   296	            """,
   297	                (eid, eid),
   298	            ).fetchall()
   299	        else:
   300	            rows = conn.execute("""
   301	                SELECT t.*, s.name as sub_name, o.name as obj_name
   302	                FROM triples t
   303	                JOIN entities s ON t.subject = s.id
   304	                JOIN entities o ON t.object = o.id
   305	                ORDER BY t.valid_from ASC NULLS LAST
   306	                LIMIT 100
   307	            """).fetchall()
   308	
   309	        return [
   310	            {
   311	                "subject": r["sub_name"],
   312	                "predicate": r["predicate"],
   313	                "object": r["obj_name"],
   314	                "valid_from": r["valid_from"],
   315	                "valid_to": r["valid_to"],
   316	                "current": r["valid_to"] is None,
   317	            }
   318	            for r in rows
   319	        ]
   320	
   321	    # ── Stats ─────────────────────────────────────────────────────────────
   322	
   323	    def stats(self):
   324	        conn = self._conn()
   325	        entities = conn.execute("SELECT COUNT(*) as cnt FROM entities").fetchone()["cnt"]
   326	        triples = conn.execute("SELECT COUNT(*) as cnt FROM triples").fetchone()["cnt"]
   327	        current = conn.execute(
   328	            "SELECT COUNT(*) as cnt FROM triples WHERE valid_to IS NULL"
   329	        ).fetchone()["cnt"]
   330	        expired = triples - current
   331	        predicates = [
   332	            r["predicate"]
   333	            for r in conn.execute(
   334	                "SELECT DISTINCT predicate FROM triples ORDER BY predicate"
   335	            ).fetchall()
   336	        ]
   337	        return {
   338	            "entities": entities,
   339	            "triples": triples,
   340	            "current_facts": current,

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md | sed -n '1,240p' && printf '\\n--- SAVE HOOK ---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh | sed -n '1,260p' && printf '\\n--- PRECOMPACT HOOK ---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# MemPalace Hooks — Auto-Save for Terminal AI Tools
     2	
     3	These hook scripts make MemPalace save automatically. No manual "save" commands needed.
     4	
     5	## What They Do
     6	
     7	| Hook | When It Fires | What Happens |
     8	|------|--------------|-------------|
     9	| **Save Hook** | Every 15 human messages | Blocks the AI, tells it to save key topics/decisions/quotes to the palace |
    10	| **PreCompact Hook** | Right before context compaction | Emergency save — forces the AI to save EVERYTHING before losing context |
    11	
    12	The AI does the actual filing — it knows the conversation context, so it classifies memories into the right wings/halls/closets. The hooks just tell it WHEN to save.
    13	
    14	## Install — Claude Code
    15	
    16	Add to `.claude/settings.local.json`:
    17	
    18	```json
    19	{
    20	  "hooks": {
    21	    "Stop": [{
    22	      "matcher": "*",
    23	      "hooks": [{
    24	        "type": "command",
    25	        "command": "/absolute/path/to/hooks/mempal_save_hook.sh",
    26	        "timeout": 30
    27	      }]
    28	    }],
    29	    "PreCompact": [{
    30	      "hooks": [{
    31	        "type": "command",
    32	        "command": "/absolute/path/to/hooks/mempal_precompact_hook.sh",
    33	        "timeout": 30
    34	      }]
    35	    }]
    36	  }
    37	}
    38	```
    39	
    40	Make them executable:
    41	```bash
    42	chmod +x hooks/mempal_save_hook.sh hooks/mempal_precompact_hook.sh
    43	```
    44	
    45	## Install — Codex CLI (OpenAI)
    46	
    47	Add to `.codex/hooks.json`:
    48	
    49	```json
    50	{
    51	  "Stop": [{
    52	    "type": "command",
    53	    "command": "/absolute/path/to/hooks/mempal_save_hook.sh",
    54	    "timeout": 30
    55	  }],
    56	  "PreCompact": [{
    57	    "type": "command",
    58	    "command": "/absolute/path/to/hooks/mempal_precompact_hook.sh",
    59	    "timeout": 30
    60	  }]
    61	}
    62	```
    63	
    64	## Configuration
    65	
    66	Edit `mempal_save_hook.sh` to change:
    67	
    68	- **`SAVE_INTERVAL=15`** — How many human messages between saves. Lower = more frequent saves, higher = less interruption.
    69	- **`STATE_DIR`** — Where hook state is stored (defaults to `~/.mempalace/hook_state/`)
    70	- **`MEMPAL_DIR`** — Optional. Set to a conversations directory to auto-run `mempalace mine <dir>` on each save trigger. Leave blank (default) to let the AI handle saving via the block reason message.
    71	
    72	### mempalace CLI
    73	
    74	The relevant commands are:
    75	
    76	```bash
    77	mempalace mine <dir>               # Mine all files in a directory
    78	mempalace mine <dir> --mode convos # Mine conversation transcripts only
    79	```
    80	
    81	The hooks resolve the repo root automatically from their own path, so they work regardless of where you install the repo.
    82	
    83	## How It Works (Technical)
    84	
    85	### Save Hook (Stop event)
    86	
    87	```
    88	User sends message → AI responds → Claude Code fires Stop hook
    89	                                            ↓
    90	                                    Hook counts human messages in JSONL transcript
    91	                                            ↓
    92	                              ┌─── < 15 since last save ──→ echo "{}" (let AI stop)
    93	                              │
    94	                              └─── ≥ 15 since last save ──→ {"decision": "block", "reason": "save..."}
    95	                                                                    ↓
    96	                                                            AI saves to palace
    97	                                                                    ↓
    98	                                                            AI tries to stop again
    99	                                                                    ↓
   100	                                                            stop_hook_active = true
   101	                                                                    ↓
   102	                                                            Hook sees flag → echo "{}" (let it through)
   103	```
   104	
   105	The `stop_hook_active` flag prevents infinite loops: block once → AI saves → tries to stop → flag is true → we let it through.
   106	
   107	### PreCompact Hook
   108	
   109	```
   110	Context window getting full → Claude Code fires PreCompact
   111	                                        ↓
   112	                                Hook ALWAYS blocks
   113	                                        ↓
   114	                                AI saves everything
   115	                                        ↓
   116	                                Compaction proceeds
   117	```
   118	
   119	No counting needed — compaction always warrants a save.
   120	
   121	## Debugging
   122	
   123	Check the hook log:
   124	```bash
   125	cat ~/.mempalace/hook_state/hook.log
   126	```
   127	
   128	Example output:
   129	```
   130	[14:30:15] Session abc123: 12 exchanges, 12 since last save
   131	[14:35:22] Session abc123: 15 exchanges, 15 since last save
   132	[14:35:22] TRIGGERING SAVE at exchange 15
   133	[14:40:01] Session abc123: 18 exchanges, 3 since last save
   134	```
   135	
   136	## Cost
   137	
   138	**Zero extra tokens.** The hooks are bash scripts that run locally. They don't call any API. The only "cost" is the AI spending a few seconds organizing memories at each checkpoint — and it's doing that with context it already has loaded.

--- SAVE HOOK ---
     1	#!/bin/bash
     2	# MEMPALACE SAVE HOOK — Auto-save every N exchanges
     3	#
     4	# Claude Code "Stop" hook. After every assistant response:
     5	# 1. Counts human messages in the session transcript
     6	# 2. Every SAVE_INTERVAL messages, BLOCKS the AI from stopping
     7	# 3. Returns a reason telling the AI to save structured diary + palace entries
     8	# 4. AI does the save (topics, decisions, code, quotes → organized into palace)
     9	# 5. Next Stop fires with stop_hook_active=true → lets AI stop normally
    10	#
    11	# The AI does the classification — it knows what wing/hall/closet to use
    12	# because it has context about the conversation. No regex needed.
    13	#
    14	# === INSTALL ===
    15	# Add to .claude/settings.local.json:
    16	#
    17	#   "hooks": {
    18	#     "Stop": [{
    19	#       "matcher": "*",
    20	#       "hooks": [{
    21	#         "type": "command",
    22	#         "command": "/absolute/path/to/mempal_save_hook.sh",
    23	#         "timeout": 30
    24	#       }]
    25	#     }]
    26	#   }
    27	#
    28	# For Codex CLI, add to .codex/hooks.json:
    29	#
    30	#   "Stop": [{
    31	#     "type": "command",
    32	#     "command": "/absolute/path/to/mempal_save_hook.sh",
    33	#     "timeout": 30
    34	#   }]
    35	#
    36	# === HOW IT WORKS ===
    37	#
    38	# Claude Code sends JSON on stdin with these fields:
    39	#   session_id       — unique session identifier
    40	#   stop_hook_active — true if AI is already in a save cycle (prevents infinite loop)
    41	#   transcript_path  — path to the JSONL transcript file
    42	#
    43	# When we block, Claude Code shows our "reason" to the AI as a system message.
    44	# The AI then saves to memory, and when it tries to stop again,
    45	# stop_hook_active=true so we let it through. No infinite loop.
    46	#
    47	# === MEMPALACE CLI ===
    48	# This repo uses: mempalace mine <dir>
    49	# or:            mempalace mine <dir> --mode convos
    50	# Set MEMPAL_DIR below if you want the hook to auto-ingest after blocking.
    51	# Leave blank to rely on the AI's own save instructions.
    52	#
    53	# === CONFIGURATION ===
    54	
    55	SAVE_INTERVAL=15  # Save every N human messages (adjust to taste)
    56	STATE_DIR="$HOME/.mempalace/hook_state"
    57	mkdir -p "$STATE_DIR"
    58	
    59	# Optional: set to the directory you want auto-ingested on each save trigger.
    60	# Example: MEMPAL_DIR="$HOME/conversations"
    61	# Leave empty to skip auto-ingest (AI handles saving via the block reason).
    62	MEMPAL_DIR=""
    63	
    64	# Read JSON input from stdin
    65	INPUT=$(cat)
    66	
    67	# Parse all fields in a single Python call (3x faster than separate invocations)
    68	eval $(echo "$INPUT" | python3 -c "
    69	import sys, json
    70	data = json.load(sys.stdin)
    71	sid = data.get('session_id', 'unknown')
    72	sha = data.get('stop_hook_active', False)
    73	tp = data.get('transcript_path', '')
    74	# Shell-safe output — only allow alphanumeric, underscore, hyphen, slash, dot, tilde
    75	import re
    76	safe = lambda s: re.sub(r'[^a-zA-Z0-9_/.\-~]', '', str(s))
    77	print(f'SESSION_ID=\"{safe(sid)}\"')
    78	print(f'STOP_HOOK_ACTIVE=\"{sha}\"')
    79	print(f'TRANSCRIPT_PATH=\"{safe(tp)}\"')
    80	" 2>/dev/null)
    81	
    82	# Expand ~ in path
    83	TRANSCRIPT_PATH="${TRANSCRIPT_PATH/#\~/$HOME}"
    84	
    85	# If we're already in a save cycle, let the AI stop normally
    86	# This is the infinite-loop prevention: block once → AI saves → tries to stop again → we let it through
    87	if [ "$STOP_HOOK_ACTIVE" = "True" ] || [ "$STOP_HOOK_ACTIVE" = "true" ]; then
    88	    echo "{}"
    89	    exit 0
    90	fi
    91	
    92	# Count human messages in the JSONL transcript
    93	# SECURITY: Pass transcript path as sys.argv to avoid shell injection via crafted paths
    94	if [ -f "$TRANSCRIPT_PATH" ]; then
    95	    EXCHANGE_COUNT=$(python3 - "$TRANSCRIPT_PATH" <<'PYEOF'
    96	import json, sys
    97	count = 0
    98	with open(sys.argv[1]) as f:
    99	    for line in f:
   100	        try:
   101	            entry = json.loads(line)
   102	            msg = entry.get('message', {})
   103	            if isinstance(msg, dict) and msg.get('role') == 'user':
   104	                content = msg.get('content', '')
   105	                if isinstance(content, str) and '<command-message>' in content:
   106	                    continue
   107	                count += 1
   108	        except:
   109	            pass
   110	print(count)
   111	PYEOF
   112	2>/dev/null)
   113	else
   114	    EXCHANGE_COUNT=0
   115	fi
   116	
   117	# Track last save point for this session
   118	LAST_SAVE_FILE="$STATE_DIR/${SESSION_ID}_last_save"
   119	LAST_SAVE=0
   120	if [ -f "$LAST_SAVE_FILE" ]; then
   121	    LAST_SAVE=$(cat "$LAST_SAVE_FILE")
   122	fi
   123	
   124	SINCE_LAST=$((EXCHANGE_COUNT - LAST_SAVE))
   125	
   126	# Log for debugging (check ~/.mempalace/hook_state/hook.log)
   127	echo "[$(date '+%H:%M:%S')] Session $SESSION_ID: $EXCHANGE_COUNT exchanges, $SINCE_LAST since last save" >> "$STATE_DIR/hook.log"
   128	
   129	# Time to save?
   130	if [ "$SINCE_LAST" -ge "$SAVE_INTERVAL" ] && [ "$EXCHANGE_COUNT" -gt 0 ]; then
   131	    # Update last save point
   132	    echo "$EXCHANGE_COUNT" > "$LAST_SAVE_FILE"
   133	
   134	    echo "[$(date '+%H:%M:%S')] TRIGGERING SAVE at exchange $EXCHANGE_COUNT" >> "$STATE_DIR/hook.log"
   135	
   136	    # Optional: run mempalace ingest in background if MEMPAL_DIR is set
   137	    if [ -n "$MEMPAL_DIR" ] && [ -d "$MEMPAL_DIR" ]; then
   138	        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
   139	        REPO_DIR="$(dirname "$SCRIPT_DIR")"
   140	        python3 -m mempalace mine "$MEMPAL_DIR" >> "$STATE_DIR/hook.log" 2>&1 &
   141	    fi
   142	
   143	    # Block the AI and tell it to save
   144	    # The "reason" becomes a system message the AI sees and acts on
   145	    cat << 'HOOKJSON'
   146	{
   147	  "decision": "block",
   148	  "reason": "AUTO-SAVE checkpoint. Save key topics, decisions, quotes, and code from this session to your memory system. Organize into appropriate categories. Use verbatim quotes where possible. Continue conversation after saving."
   149	}
   150	HOOKJSON
   151	else
   152	    # Not time yet — let the AI stop normally
   153	    echo "{}"
   154	fi

--- PRECOMPACT HOOK ---
     1	#!/bin/bash
     2	# MEMPALACE PRE-COMPACT HOOK — Emergency save before compaction
     3	#
     4	# Claude Code "PreCompact" hook. Fires RIGHT BEFORE the conversation
     5	# gets compressed to free up context window space.
     6	#
     7	# This is the safety net. When compaction happens, the AI loses detailed
     8	# context about what was discussed. This hook forces one final save of
     9	# EVERYTHING before that happens.
    10	#
    11	# Unlike the save hook (which triggers every N exchanges), this ALWAYS
    12	# blocks — because compaction is always worth saving before.
    13	#
    14	# === INSTALL ===
    15	# Add to .claude/settings.local.json:
    16	#
    17	#   "hooks": {
    18	#     "PreCompact": [{
    19	#       "hooks": [{
    20	#         "type": "command",
    21	#         "command": "/absolute/path/to/mempal_precompact_hook.sh",
    22	#         "timeout": 30
    23	#       }]
    24	#     }]
    25	#   }
    26	#
    27	# For Codex CLI, add to .codex/hooks.json:
    28	#
    29	#   "PreCompact": [{
    30	#     "type": "command",
    31	#     "command": "/absolute/path/to/mempal_precompact_hook.sh",
    32	#     "timeout": 30
    33	#   }]
    34	#
    35	# === HOW IT WORKS ===
    36	#
    37	# Claude Code sends JSON on stdin with:
    38	#   session_id — unique session identifier
    39	#
    40	# We always return decision: "block" with a reason telling the AI
    41	# to save everything. After the AI saves, compaction proceeds normally.
    42	#
    43	# === MEMPALACE CLI ===
    44	# This repo uses: mempalace mine <dir>
    45	# or:            mempalace mine <dir> --mode convos
    46	# Set MEMPAL_DIR below if you want the hook to auto-ingest before compaction.
    47	# Leave blank to rely on the AI's own save instructions.
    48	
    49	STATE_DIR="$HOME/.mempalace/hook_state"
    50	mkdir -p "$STATE_DIR"
    51	
    52	# Optional: set to the directory you want auto-ingested before compaction.
    53	# Example: MEMPAL_DIR="$HOME/conversations"
    54	# Leave empty to skip auto-ingest (AI handles saving via the block reason).
    55	MEMPAL_DIR=""
    56	
    57	# Read JSON input from stdin
    58	INPUT=$(cat)
    59	
    60	SESSION_ID=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('session_id','unknown'))" 2>/dev/null)
    61	
    62	echo "[$(date '+%H:%M:%S')] PRE-COMPACT triggered for session $SESSION_ID" >> "$STATE_DIR/hook.log"
    63	
    64	# Optional: run mempalace ingest synchronously so memories land before compaction
    65	if [ -n "$MEMPAL_DIR" ] && [ -d "$MEMPAL_DIR" ]; then
    66	    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    67	    REPO_DIR="$(dirname "$SCRIPT_DIR")"
    68	    python3 -m mempalace mine "$MEMPAL_DIR" >> "$STATE_DIR/hook.log" 2>&1
    69	fi
    70	
    71	# Always block — compaction = save everything
    72	cat << 'HOOKJSON'
    73	{
    74	  "decision": "block",
    75	  "reason": "COMPACTION IMMINENT. Save ALL topics, decisions, quotes, code, and important context from this session to your memory system. Be thorough — after compaction, detailed context will be lost. Organize into appropriate categories. Use verbatim quotes where possible. Save everything, then allow compaction to proceed."
    76	}
    77	HOOKJSON

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env python3
     2	"""
     3	miner.py — Files everything into the palace.
     4	
     5	Reads mempalace.yaml from the project directory to know the wing + rooms.
     6	Routes each file to the right room based on content.
     7	Stores verbatim chunks as drawers. No summaries. Ever.
     8	"""
     9	
    10	import os
    11	import sys
    12	import hashlib
    13	import fnmatch
    14	from pathlib import Path
    15	from datetime import datetime
    16	from collections import defaultdict
    17	
    18	import chromadb
    19	
    20	from .palace import SKIP_DIRS, get_collection, file_already_mined
    21	
    22	READABLE_EXTENSIONS = {
    23	    ".txt",
    24	    ".md",
    25	    ".py",
    26	    ".js",
    27	    ".ts",
    28	    ".jsx",
    29	    ".tsx",
    30	    ".json",
    31	    ".yaml",
    32	    ".yml",
    33	    ".html",
    34	    ".css",
    35	    ".java",
    36	    ".go",
    37	    ".rs",
    38	    ".rb",
    39	    ".sh",
    40	    ".csv",
    41	    ".sql",
    42	    ".toml",
    43	}
    44	
    45	SKIP_FILENAMES = {
    46	    "mempalace.yaml",
    47	    "mempalace.yml",
    48	    "mempal.yaml",
    49	    "mempal.yml",
    50	    ".gitignore",
    51	    "package-lock.json",
    52	}
    53	
    54	CHUNK_SIZE = 800  # chars per drawer
    55	CHUNK_OVERLAP = 100  # overlap between chunks
    56	MIN_CHUNK_SIZE = 50  # skip tiny chunks
    57	MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB — skip files larger than this
    58	
    59	
    60	# =============================================================================
    61	# IGNORE MATCHING
    62	# =============================================================================
    63	
    64	
    65	class GitignoreMatcher:
    66	    """Lightweight matcher for one directory's .gitignore patterns."""
    67	
    68	    def __init__(self, base_dir: Path, rules: list):
    69	        self.base_dir = base_dir
    70	        self.rules = rules
    71	
    72	    @classmethod
    73	    def from_dir(cls, dir_path: Path):
    74	        gitignore_path = dir_path / ".gitignore"
    75	        if not gitignore_path.is_file():
    76	            return None
    77	
    78	        try:
    79	            lines = gitignore_path.read_text(encoding="utf-8", errors="replace").splitlines()
    80	        except Exception:
    81	            return None
    82	
    83	        rules = []
    84	        for raw_line in lines:
    85	            line = raw_line.strip()
    86	            if not line:
    87	                continue
    88	
    89	            if line.startswith("\\#") or line.startswith("\\!"):
    90	                line = line[1:]
    91	            elif line.startswith("#"):
    92	                continue
    93	
    94	            negated = line.startswith("!")
    95	            if negated:
    96	                line = line[1:]
    97	
    98	            anchored = line.startswith("/")
    99	            if anchored:
   100	                line = line.lstrip("/")
   101	
   102	            dir_only = line.endswith("/")
   103	            if dir_only:
   104	                line = line.rstrip("/")
   105	
   106	            if not line:
   107	                continue
   108	
   109	            rules.append(
   110	                {
   111	                    "pattern": line,
   112	                    "anchored": anchored,
   113	                    "dir_only": dir_only,
   114	                    "negated": negated,
   115	                }
   116	            )
   117	
   118	        if not rules:
   119	            return None
   120	
   121	        return cls(dir_path, rules)
   122	
   123	    def matches(self, path: Path, is_dir: bool = None):
   124	        try:
   125	            relative = path.relative_to(self.base_dir).as_posix().strip("/")
   126	        except ValueError:
   127	            return None
   128	
   129	        if not relative:
   130	            return None
   131	
   132	        if is_dir is None:
   133	            is_dir = path.is_dir()
   134	
   135	        ignored = None
   136	        for rule in self.rules:
   137	            if self._rule_matches(rule, relative, is_dir):
   138	                ignored = not rule["negated"]
   139	        return ignored
   140	
   141	    def _rule_matches(self, rule: dict, relative: str, is_dir: bool) -> bool:
   142	        pattern = rule["pattern"]
   143	        parts = relative.split("/")
   144	        pattern_parts = pattern.split("/")
   145	
   146	        if rule["dir_only"]:
   147	            target_parts = parts if is_dir else parts[:-1]
   148	            if not target_parts:
   149	                return False
   150	            if rule["anchored"] or len(pattern_parts) > 1:
   151	                return self._match_from_root(target_parts, pattern_parts)
   152	            return any(fnmatch.fnmatch(part, pattern) for part in target_parts)
   153	
   154	        if rule["anchored"] or len(pattern_parts) > 1:
   155	            return self._match_from_root(parts, pattern_parts)
   156	
   157	        return any(fnmatch.fnmatch(part, pattern) for part in parts)
   158	
   159	    def _match_from_root(self, target_parts: list, pattern_parts: list) -> bool:
   160	        def matches(path_index: int, pattern_index: int) -> bool:
   161	            if pattern_index == len(pattern_parts):
   162	                return True
   163	
   164	            if path_index == len(target_parts):
   165	                return all(part == "**" for part in pattern_parts[pattern_index:])
   166	
   167	            pattern_part = pattern_parts[pattern_index]
   168	            if pattern_part == "**":
   169	                return matches(path_index, pattern_index + 1) or matches(
   170	                    path_index + 1, pattern_index
   171	                )
   172	
   173	            if not fnmatch.fnmatch(target_parts[path_index], pattern_part):
   174	                return False
   175	
   176	            return matches(path_index + 1, pattern_index + 1)
   177	
   178	        return matches(0, 0)
   179	
   180	
   181	def load_gitignore_matcher(dir_path: Path, cache: dict):
   182	    """Load and cache one directory's .gitignore matcher."""
   183	    if dir_path not in cache:
   184	        cache[dir_path] = GitignoreMatcher.from_dir(dir_path)
   185	    return cache[dir_path]
   186	
   187	
   188	def is_gitignored(path: Path, matchers: list, is_dir: bool = False) -> bool:
   189	    """Apply active .gitignore matchers in ancestor order; last match wins."""
   190	    ignored = False
   191	    for matcher in matchers:
   192	        decision = matcher.matches(path, is_dir=is_dir)
   193	        if decision is not None:
   194	            ignored = decision
   195	    return ignored
   196	
   197	
   198	def should_skip_dir(dirname: str) -> bool:
   199	    """Skip known generated/cache directories before gitignore matching."""
   200	    return dirname in SKIP_DIRS or dirname.endswith(".egg-info")
   201	
   202	
   203	def normalize_include_paths(include_ignored: list) -> set:
   204	    """Normalize comma-parsed include paths into project-relative POSIX strings."""
   205	    normalized = set()
   206	    for raw_path in include_ignored or []:
   207	        candidate = str(raw_path).strip().strip("/")
   208	        if candidate:
   209	            normalized.add(Path(candidate).as_posix())
   210	    return normalized
   211	
   212	
   213	def is_exact_force_include(path: Path, project_path: Path, include_paths: set) -> bool:
   214	    """Return True when a path exactly matches an explicit include override."""
   215	    if not include_paths:
   216	        return False
   217	
   218	    try:
   219	        relative = path.relative_to(project_path).as_posix().strip("/")
   220	    except ValueError:
   221	        return False
   222	
   223	    return relative in include_paths
   224	
   225	
   226	def is_force_included(path: Path, project_path: Path, include_paths: set) -> bool:
   227	    """Return True when a path or one of its ancestors/descendants was explicitly included."""
   228	    if not include_paths:
   229	        return False
   230	
   231	    try:
   232	        relative = path.relative_to(project_path).as_posix().strip("/")
   233	    except ValueError:
   234	        return False
   235	
   236	    if not relative:
   237	        return False
   238	
   239	    for include_path in include_paths:
   240	        if relative == include_path:
   241	            return True
   242	        if relative.startswith(f"{include_path}/"):
   243	            return True
   244	        if include_path.startswith(f"{relative}/"):
   245	            return True
   246	
   247	    return False
   248	
   249	
   250	# =============================================================================
   251	# CONFIG
   252	# =============================================================================
   253	
   254	
   255	def load_config(project_dir: str) -> dict:
   256	    """Load mempalace.yaml from project directory (falls back to mempal.yaml)."""
   257	    import yaml
   258	
   259	    config_path = Path(project_dir).expanduser().resolve() / "mempalace.yaml"
   260	    if not config_path.exists():
   261	        # Fallback to legacy name
   262	        legacy_path = Path(project_dir).expanduser().resolve() / "mempal.yaml"
   263	        if legacy_path.exists():
   264	            config_path = legacy_path
   265	        else:
   266	            print(f"ERROR: No mempalace.yaml found in {project_dir}")
   267	            print(f"Run: mempalace init {project_dir}")
   268	            sys.exit(1)
   269	    with open(config_path) as f:
   270	        return yaml.safe_load(f)
   271	
   272	
   273	# =============================================================================
   274	# FILE ROUTING — which room does this file belong to?
   275	# =============================================================================
   276	
   277	
   278	def detect_room(filepath: Path, content: str, rooms: list, project_path: Path) -> str:
   279	    """
   280	    Route a file to the right room.
   281	    Priority:
   282	    1. Folder path matches a room name
   283	    2. Filename matches a room name or keyword
   284	    3. Content keyword scoring
   285	    4. Fallback: "general"
   286	    """
   287	    relative = str(filepath.relative_to(project_path)).lower()
   288	    filename = filepath.stem.lower()
   289	    content_lower = content[:2000].lower()
   290	
   291	    # Priority 1: folder path matches room name or keywords
   292	    path_parts = relative.replace("\\", "/").split("/")
   293	    for part in path_parts[:-1]:  # skip filename itself
   294	        for room in rooms:
   295	            candidates = [room["name"].lower()] + [k.lower() for k in room.get("keywords", [])]
   296	            if any(part == c or c in part or part in c for c in candidates):
   297	                return room["name"]
   298	
   299	    # Priority 2: filename matches room name
   300	    for room in rooms:
   301	        if room["name"].lower() in filename or filename in room["name"].lower():
   302	            return room["name"]
   303	
   304	    # Priority 3: keyword scoring from room keywords + name
   305	    scores = defaultdict(int)
   306	    for room in rooms:
   307	        keywords = room.get("keywords", []) + [room["name"]]
   308	        for kw in keywords:
   309	            count = content_lower.count(kw.lower())
   310	            scores[room["name"]] += count
   311	
   312	    if scores:
   313	        best = max(scores, key=scores.get)
   314	        if scores[best] > 0:
   315	            return best
   316	
   317	    return "general"
   318	
   319	
   320	# =============================================================================

 succeeded in 0ms:
     1	#!/usr/bin/env python3
     2	"""
     3	convo_miner.py — Mine conversations into the palace.
     4	
     5	Ingests chat exports (Claude Code, ChatGPT, Slack, plain text transcripts).
     6	Normalizes format, chunks by exchange pair (Q+A = one unit), files to palace.
     7	
     8	Same palace as project mining. Different ingest strategy.
     9	"""
    10	
    11	import os
    12	import sys
    13	import hashlib
    14	from pathlib import Path
    15	from datetime import datetime
    16	from collections import defaultdict
    17	
    18	from .normalize import normalize
    19	from .palace import SKIP_DIRS, get_collection, file_already_mined
    20	
    21	
    22	# File types that might contain conversations
    23	CONVO_EXTENSIONS = {
    24	    ".txt",
    25	    ".md",
    26	    ".json",
    27	    ".jsonl",
    28	}
    29	
    30	MIN_CHUNK_SIZE = 30
    31	MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB — skip files larger than this
    32	
    33	
    34	# =============================================================================
    35	# CHUNKING — exchange pairs for conversations
    36	# =============================================================================
    37	
    38	
    39	def chunk_exchanges(content: str) -> list:
    40	    """
    41	    Chunk by exchange pair: one > turn + AI response = one unit.
    42	    Falls back to paragraph chunking if no > markers.
    43	    """
    44	    lines = content.split("\n")
    45	    quote_lines = sum(1 for line in lines if line.strip().startswith(">"))
    46	
    47	    if quote_lines >= 3:
    48	        return _chunk_by_exchange(lines)
    49	    else:
    50	        return _chunk_by_paragraph(content)
    51	
    52	
    53	def _chunk_by_exchange(lines: list) -> list:
    54	    """One user turn (>) + the AI response that follows = one chunk."""
    55	    chunks = []
    56	    i = 0
    57	
    58	    while i < len(lines):
    59	        line = lines[i]
    60	        if line.strip().startswith(">"):
    61	            user_turn = line.strip()
    62	            i += 1
    63	
    64	            ai_lines = []
    65	            while i < len(lines):
    66	                next_line = lines[i]
    67	                if next_line.strip().startswith(">") or next_line.strip().startswith("---"):
    68	                    break
    69	                if next_line.strip():
    70	                    ai_lines.append(next_line.strip())
    71	                i += 1
    72	
    73	            ai_response = " ".join(ai_lines[:8])
    74	            content = f"{user_turn}\n{ai_response}" if ai_response else user_turn
    75	
    76	            if len(content.strip()) > MIN_CHUNK_SIZE:
    77	                chunks.append(
    78	                    {
    79	                        "content": content,
    80	                        "chunk_index": len(chunks),
    81	                    }
    82	                )
    83	        else:
    84	            i += 1
    85	
    86	    return chunks
    87	
    88	
    89	def _chunk_by_paragraph(content: str) -> list:
    90	    """Fallback: chunk by paragraph breaks."""
    91	    chunks = []
    92	    paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
    93	
    94	    # If no paragraph breaks and long content, chunk by line groups
    95	    if len(paragraphs) <= 1 and content.count("\n") > 20:
    96	        lines = content.split("\n")
    97	        for i in range(0, len(lines), 25):
    98	            group = "\n".join(lines[i : i + 25]).strip()
    99	            if len(group) > MIN_CHUNK_SIZE:
   100	                chunks.append({"content": group, "chunk_index": len(chunks)})
   101	        return chunks
   102	
   103	    for para in paragraphs:
   104	        if len(para) > MIN_CHUNK_SIZE:
   105	            chunks.append({"content": para, "chunk_index": len(chunks)})
   106	
   107	    return chunks
   108	
   109	
   110	# =============================================================================
   111	# ROOM DETECTION — topic-based for conversations
   112	# =============================================================================
   113	
   114	TOPIC_KEYWORDS = {
   115	    "technical": [
   116	        "code",
   117	        "python",
   118	        "function",
   119	        "bug",
   120	        "error",
   121	        "api",
   122	        "database",
   123	        "server",
   124	        "deploy",
   125	        "git",
   126	        "test",
   127	        "debug",
   128	        "refactor",
   129	    ],
   130	    "architecture": [
   131	        "architecture",
   132	        "design",
   133	        "pattern",
   134	        "structure",
   135	        "schema",
   136	        "interface",
   137	        "module",
   138	        "component",
   139	        "service",
   140	        "layer",
   141	    ],
   142	    "planning": [
   143	        "plan",
   144	        "roadmap",
   145	        "milestone",
   146	        "deadline",
   147	        "priority",
   148	        "sprint",
   149	        "backlog",
   150	        "scope",
   151	        "requirement",
   152	        "spec",
   153	    ],
   154	    "decisions": [
   155	        "decided",
   156	        "chose",
   157	        "picked",
   158	        "switched",
   159	        "migrated",
   160	        "replaced",
   161	        "trade-off",
   162	        "alternative",
   163	        "option",
   164	        "approach",
   165	    ],
   166	    "problems": [
   167	        "problem",
   168	        "issue",
   169	        "broken",
   170	        "failed",
   171	        "crash",
   172	        "stuck",
   173	        "workaround",
   174	        "fix",
   175	        "solved",
   176	        "resolved",
   177	    ],
   178	}
   179	
   180	
   181	def detect_convo_room(content: str) -> str:
   182	    """Score conversation content against topic keywords."""
   183	    content_lower = content[:3000].lower()
   184	    scores = {}
   185	    for room, keywords in TOPIC_KEYWORDS.items():
   186	        score = sum(1 for kw in keywords if kw in content_lower)
   187	        if score > 0:
   188	            scores[room] = score
   189	    if scores:
   190	        return max(scores, key=scores.get)
   191	    return "general"
   192	
   193	
   194	# =============================================================================
   195	# PALACE OPERATIONS
   196	# =============================================================================
   197	
   198	
   199	# =============================================================================
   200	# SCAN FOR CONVERSATION FILES
   201	# =============================================================================
   202	
   203	
   204	def scan_convos(convo_dir: str) -> list:
   205	    """Find all potential conversation files."""
   206	    convo_path = Path(convo_dir).expanduser().resolve()
   207	    files = []
   208	    for root, dirs, filenames in os.walk(convo_path):
   209	        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
   210	        for filename in filenames:
   211	            if filename.endswith(".meta.json"):
   212	                continue
   213	            filepath = Path(root) / filename
   214	            if filepath.suffix.lower() in CONVO_EXTENSIONS:
   215	                # Skip symlinks and oversized files
   216	                if filepath.is_symlink():
   217	                    continue
   218	                try:
   219	                    if filepath.stat().st_size > MAX_FILE_SIZE:
   220	                        continue
   221	                except OSError:
   222	                    continue
   223	                files.append(filepath)
   224	    return files
   225	
   226	
   227	# =============================================================================
   228	# MINE CONVERSATIONS
   229	# =============================================================================
   230	
   231	
   232	def mine_convos(
   233	    convo_dir: str,
   234	    palace_path: str,
   235	    wing: str = None,
   236	    agent: str = "mempalace",
   237	    limit: int = 0,
   238	    dry_run: bool = False,
   239	    extract_mode: str = "exchange",
   240	):
   241	    """Mine a directory of conversation files into the palace.
   242	
   243	    extract_mode:
   244	        "exchange" — default exchange-pair chunking (Q+A = one unit)
   245	        "general"  — general extractor: decisions, preferences, milestones, problems, emotions
   246	    """
   247	
   248	    convo_path = Path(convo_dir).expanduser().resolve()
   249	    if not wing:
   250	        wing = convo_path.name.lower().replace(" ", "_").replace("-", "_")
   251	
   252	    files = scan_convos(convo_dir)
   253	    if limit > 0:
   254	        files = files[:limit]
   255	
   256	    print(f"\n{'=' * 55}")
   257	    print("  MemPalace Mine — Conversations")
   258	    print(f"{'=' * 55}")
   259	    print(f"  Wing:    {wing}")
   260	    print(f"  Source:  {convo_path}")
   261	    print(f"  Files:   {len(files)}")
   262	    print(f"  Palace:  {palace_path}")
   263	    if dry_run:
   264	        print("  DRY RUN — nothing will be filed")
   265	    print(f"{'-' * 55}\n")
   266	
   267	    collection = get_collection(palace_path) if not dry_run else None
   268	
   269	    total_drawers = 0
   270	    files_skipped = 0
   271	    room_counts = defaultdict(int)
   272	
   273	    for i, filepath in enumerate(files, 1):
   274	        source_file = str(filepath)
   275	
   276	        # Skip if already filed
   277	        if not dry_run and file_already_mined(collection, source_file):
   278	            files_skipped += 1
   279	            continue
   280	
   281	        # Normalize format
   282	        try:
   283	            content = normalize(str(filepath))
   284	        except (OSError, ValueError):
   285	            continue
   286	
   287	        if not content or len(content.strip()) < MIN_CHUNK_SIZE:
   288	            continue
   289	
   290	        # Chunk — either exchange pairs or general extraction
   291	        if extract_mode == "general":
   292	            from .general_extractor import extract_memories
   293	
   294	            chunks = extract_memories(content)
   295	            # Each chunk already has memory_type; use it as the room name
   296	        else:
   297	            chunks = chunk_exchanges(content)
   298	
   299	        if not chunks:
   300	            continue
   301	
   302	        # Detect room from content (general mode uses memory_type instead)
   303	        if extract_mode != "general":
   304	            room = detect_convo_room(content)
   305	        else:
   306	            room = None  # set per-chunk below
   307	
   308	        if dry_run:
   309	            if extract_mode == "general":
   310	                from collections import Counter
   311	
   312	                type_counts = Counter(c.get("memory_type", "general") for c in chunks)
   313	                types_str = ", ".join(f"{t}:{n}" for t, n in type_counts.most_common())
   314	                print(f"    [DRY RUN] {filepath.name} → {len(chunks)} memories ({types_str})")
   315	            else:
   316	                print(f"    [DRY RUN] {filepath.name} → room:{room} ({len(chunks)} drawers)")
   317	            total_drawers += len(chunks)
   318	            # Track room counts
   319	            if extract_mode == "general":
   320	                for c in chunks:
   321	                    room_counts[c.get("memory_type", "general")] += 1
   322	            else:
   323	                room_counts[room] += 1
   324	            continue
   325	
   326	        if extract_mode != "general":
   327	            room_counts[room] += 1
   328	
   329	        # File each chunk
   330	        drawers_added = 0
   331	        for chunk in chunks:
   332	            chunk_room = chunk.get("memory_type", room) if extract_mode == "general" else room
   333	            if extract_mode == "general":
   334	                room_counts[chunk_room] += 1
   335	            drawer_id = f"drawer_{wing}_{chunk_room}_{hashlib.sha256((source_file + str(chunk['chunk_index'])).encode()).hexdigest()[:24]}"
   336	            try:
   337	                collection.upsert(
   338	                    documents=[chunk["content"]],
   339	                    ids=[drawer_id],
   340	                    metadatas=[
   341	                        {
   342	                            "wing": wing,
   343	                            "room": chunk_room,
   344	                            "source_file": source_file,
   345	                            "chunk_index": chunk["chunk_index"],
   346	                            "added_by": agent,
   347	                            "filed_at": datetime.now().isoformat(),
   348	                            "ingest_mode": "convos",
   349	                            "extract_mode": extract_mode,
   350	                        }
   351	                    ],
   352	                )
   353	                drawers_added += 1
   354	            except Exception as e:
   355	                if "already exists" not in str(e).lower():
   356	                    raise
   357	
   358	        total_drawers += drawers_added
   359	        print(f"  ✓ [{i:4}/{len(files)}] {filepath.name[:50]:50} +{drawers_added}")
   360	

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py | sed -n '1,320p' && printf '\\n--- ONBOARDING ---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env python3
     2	"""
     3	general_extractor.py — Extract 5 types of memories from text.
     4	
     5	Types:
     6	  1. DECISIONS    — "we went with X because Y", choices made
     7	  2. PREFERENCES  — "always use X", "never do Y", "I prefer Z"
     8	  3. MILESTONES   — breakthroughs, things that finally worked
     9	  4. PROBLEMS     — what broke, what fixed it, root causes
    10	  5. EMOTIONAL    — feelings, vulnerability, relationships
    11	
    12	No LLM required. Pure keyword/pattern heuristics.
    13	No external dependencies on palace.py, dialect.py, or layers.py.
    14	
    15	Usage:
    16	    from general_extractor import extract_memories
    17	
    18	    chunks = extract_memories(text)
    19	    # [{"content": "...", "memory_type": "decision", "chunk_index": 0}, ...]
    20	"""
    21	
    22	import re
    23	from typing import List, Dict, Tuple
    24	
    25	
    26	# =============================================================================
    27	# MARKER SETS — One per memory type
    28	# =============================================================================
    29	
    30	DECISION_MARKERS = [
    31	    r"\blet'?s (use|go with|try|pick|choose|switch to)\b",
    32	    r"\bwe (should|decided|chose|went with|picked|settled on)\b",
    33	    r"\bi'?m going (to|with)\b",
    34	    r"\bbetter (to|than|approach|option|choice)\b",
    35	    r"\binstead of\b",
    36	    r"\brather than\b",
    37	    r"\bthe reason (is|was|being)\b",
    38	    r"\bbecause\b",
    39	    r"\btrade-?off\b",
    40	    r"\bpros and cons\b",
    41	    r"\bover\b.*\bbecause\b",
    42	    r"\barchitecture\b",
    43	    r"\bapproach\b",
    44	    r"\bstrategy\b",
    45	    r"\bpattern\b",
    46	    r"\bstack\b",
    47	    r"\bframework\b",
    48	    r"\binfrastructure\b",
    49	    r"\bset (it |this )?to\b",
    50	    r"\bconfigure\b",
    51	    r"\bdefault\b",
    52	]
    53	
    54	PREFERENCE_MARKERS = [
    55	    r"\bi prefer\b",
    56	    r"\balways use\b",
    57	    r"\bnever use\b",
    58	    r"\bdon'?t (ever |like to )?(use|do|mock|stub|import)\b",
    59	    r"\bi like (to|when|how)\b",
    60	    r"\bi hate (when|how|it when)\b",
    61	    r"\bplease (always|never|don'?t)\b",
    62	    r"\bmy (rule|preference|style|convention) is\b",
    63	    r"\bwe (always|never)\b",
    64	    r"\bfunctional\b.*\bstyle\b",
    65	    r"\bimperative\b",
    66	    r"\bsnake_?case\b",
    67	    r"\bcamel_?case\b",
    68	    r"\btabs\b.*\bspaces\b",
    69	    r"\bspaces\b.*\btabs\b",
    70	    r"\buse\b.*\binstead of\b",
    71	]
    72	
    73	MILESTONE_MARKERS = [
    74	    r"\bit works\b",
    75	    r"\bit worked\b",
    76	    r"\bgot it working\b",
    77	    r"\bfixed\b",
    78	    r"\bsolved\b",
    79	    r"\bbreakthrough\b",
    80	    r"\bfigured (it )?out\b",
    81	    r"\bnailed it\b",
    82	    r"\bcracked (it|the)\b",
    83	    r"\bfinally\b",
    84	    r"\bfirst time\b",
    85	    r"\bfirst ever\b",
    86	    r"\bnever (done|been|had) before\b",
    87	    r"\bdiscovered\b",
    88	    r"\brealized\b",
    89	    r"\bfound (out|that)\b",
    90	    r"\bturns out\b",
    91	    r"\bthe key (is|was|insight)\b",
    92	    r"\bthe trick (is|was)\b",
    93	    r"\bnow i (understand|see|get it)\b",
    94	    r"\bbuilt\b",
    95	    r"\bcreated\b",
    96	    r"\bimplemented\b",
    97	    r"\bshipped\b",
    98	    r"\blaunched\b",
    99	    r"\bdeployed\b",
   100	    r"\breleased\b",
   101	    r"\bprototype\b",
   102	    r"\bproof of concept\b",
   103	    r"\bdemo\b",
   104	    r"\bversion \d",
   105	    r"\bv\d+\.\d+",
   106	    r"\d+x (compression|faster|slower|better|improvement|reduction)",
   107	    r"\d+% (reduction|improvement|faster|better|smaller)",
   108	]
   109	
   110	PROBLEM_MARKERS = [
   111	    r"\b(bug|error|crash|fail|broke|broken|issue|problem)\b",
   112	    r"\bdoesn'?t work\b",
   113	    r"\bnot working\b",
   114	    r"\bwon'?t\b.*\bwork\b",
   115	    r"\bkeeps? (failing|crashing|breaking|erroring)\b",
   116	    r"\broot cause\b",
   117	    r"\bthe (problem|issue|bug) (is|was)\b",
   118	    r"\bturns out\b.*\b(was|because|due to)\b",
   119	    r"\bthe fix (is|was)\b",
   120	    r"\bworkaround\b",
   121	    r"\bthat'?s why\b",
   122	    r"\bthe reason it\b",
   123	    r"\bfixed (it |the |by )\b",
   124	    r"\bsolution (is|was)\b",
   125	    r"\bresolved\b",
   126	    r"\bpatched\b",
   127	    r"\bthe answer (is|was)\b",
   128	    r"\b(had|need) to\b.*\binstead\b",
   129	]
   130	
   131	EMOTION_MARKERS = [
   132	    r"\blove\b",
   133	    r"\bscared\b",
   134	    r"\bafraid\b",
   135	    r"\bproud\b",
   136	    r"\bhurt\b",
   137	    r"\bhappy\b",
   138	    r"\bsad\b",
   139	    r"\bcry\b",
   140	    r"\bcrying\b",
   141	    r"\bmiss\b",
   142	    r"\bsorry\b",
   143	    r"\bgrateful\b",
   144	    r"\bangry\b",
   145	    r"\bworried\b",
   146	    r"\blonely\b",
   147	    r"\bbeautiful\b",
   148	    r"\bamazing\b",
   149	    r"\bwonderful\b",
   150	    r"i feel",
   151	    r"i'm scared",
   152	    r"i love you",
   153	    r"i'm sorry",
   154	    r"i can't",
   155	    r"i wish",
   156	    r"i miss",
   157	    r"i need",
   158	    r"never told anyone",
   159	    r"nobody knows",
   160	    r"\*[^*]+\*",
   161	]
   162	
   163	ALL_MARKERS = {
   164	    "decision": DECISION_MARKERS,
   165	    "preference": PREFERENCE_MARKERS,
   166	    "milestone": MILESTONE_MARKERS,
   167	    "problem": PROBLEM_MARKERS,
   168	    "emotional": EMOTION_MARKERS,
   169	}
   170	
   171	
   172	# =============================================================================
   173	# SENTIMENT — for disambiguation
   174	# =============================================================================
   175	
   176	POSITIVE_WORDS = {
   177	    "pride",
   178	    "proud",
   179	    "joy",
   180	    "happy",
   181	    "love",
   182	    "loving",
   183	    "beautiful",
   184	    "amazing",
   185	    "wonderful",
   186	    "incredible",
   187	    "fantastic",
   188	    "brilliant",
   189	    "perfect",
   190	    "excited",
   191	    "thrilled",
   192	    "grateful",
   193	    "warm",
   194	    "breakthrough",
   195	    "success",
   196	    "works",
   197	    "working",
   198	    "solved",
   199	    "fixed",
   200	    "nailed",
   201	    "heart",
   202	    "hug",
   203	    "precious",
   204	    "adore",
   205	}
   206	
   207	NEGATIVE_WORDS = {
   208	    "bug",
   209	    "error",
   210	    "crash",
   211	    "crashing",
   212	    "crashed",
   213	    "fail",
   214	    "failed",
   215	    "failing",
   216	    "failure",
   217	    "broken",
   218	    "broke",
   219	    "breaking",
   220	    "breaks",
   221	    "issue",
   222	    "problem",
   223	    "wrong",
   224	    "stuck",
   225	    "blocked",
   226	    "unable",
   227	    "impossible",
   228	    "missing",
   229	    "terrible",
   230	    "horrible",
   231	    "awful",
   232	    "worse",
   233	    "worst",
   234	    "panic",
   235	    "disaster",
   236	    "mess",
   237	}
   238	
   239	
   240	def _get_sentiment(text: str) -> str:
   241	    """Quick sentiment: 'positive', 'negative', or 'neutral'."""
   242	    words = set(w.lower() for w in re.findall(r"\b\w+\b", text))
   243	    pos = len(words & POSITIVE_WORDS)
   244	    neg = len(words & NEGATIVE_WORDS)
   245	    if pos > neg:
   246	        return "positive"
   247	    elif neg > pos:
   248	        return "negative"
   249	    return "neutral"
   250	
   251	
   252	def _has_resolution(text: str) -> bool:
   253	    """Check if text describes a RESOLVED problem."""
   254	    text_lower = text.lower()
   255	    patterns = [
   256	        r"\bfixed\b",
   257	        r"\bsolved\b",
   258	        r"\bresolved\b",
   259	        r"\bpatched\b",
   260	        r"\bgot it working\b",
   261	        r"\bit works\b",
   262	        r"\bnailed it\b",
   263	        r"\bfigured (it )?out\b",
   264	        r"\bthe (fix|answer|solution)\b",
   265	    ]
   266	    return any(re.search(p, text_lower) for p in patterns)
   267	
   268	
   269	def _disambiguate(memory_type: str, text: str, scores: Dict[str, float]) -> str:
   270	    """Fix misclassifications using sentiment + resolution."""
   271	    sentiment = _get_sentiment(text)
   272	
   273	    # Resolved problems are milestones
   274	    if memory_type == "problem" and _has_resolution(text):
   275	        if scores.get("emotional", 0) > 0 and sentiment == "positive":
   276	            return "emotional"
   277	        return "milestone"
   278	
   279	    # Problem + positive sentiment => milestone or emotional
   280	    if memory_type == "problem" and sentiment == "positive":
   281	        if scores.get("milestone", 0) > 0:
   282	            return "milestone"
   283	        if scores.get("emotional", 0) > 0:
   284	            return "emotional"
   285	
   286	    return memory_type
   287	
   288	
   289	# =============================================================================
   290	# CODE LINE FILTERING
   291	# =============================================================================
   292	
   293	_CODE_LINE_PATTERNS = [
   294	    re.compile(r"^\s*[\$#]\s"),
   295	    re.compile(
   296	        r"^\s*(cd|source|echo|export|pip|npm|git|python|bash|curl|wget|mkdir|rm|cp|mv|ls|cat|grep|find|chmod|sudo|brew|docker)\s"
   297	    ),
   298	    re.compile(r"^\s*```"),
   299	    re.compile(r"^\s*(import|from|def|class|function|const|let|var|return)\s"),
   300	    re.compile(r"^\s*[A-Z_]{2,}="),
   301	    re.compile(r"^\s*\|"),
   302	    re.compile(r"^\s*[-]{2,}"),
   303	    re.compile(r"^\s*[{}\[\]]\s*$"),
   304	    re.compile(r"^\s*(if|for|while|try|except|elif|else:)\b"),
   305	    re.compile(r"^\s*\w+\.\w+\("),
   306	    re.compile(r"^\s*\w+ = \w+\.\w+"),
   307	]
   308	
   309	
   310	def _is_code_line(line: str) -> bool:
   311	    stripped = line.strip()
   312	    if not stripped:
   313	        return False
   314	    for pattern in _CODE_LINE_PATTERNS:
   315	        if pattern.match(stripped):
   316	            return True
   317	    alpha_ratio = sum(1 for c in stripped if c.isalpha()) / max(len(stripped), 1)
   318	    if alpha_ratio < 0.4 and len(stripped) > 10:
   319	        return True
   320	    return False

--- ONBOARDING ---
     1	#!/usr/bin/env python3
     2	"""
     3	onboarding.py — MemPalace first-run setup.
     4	
     5	Asks the user:
     6	  1. How they're using MemPalace (work / personal / combo)
     7	  2. Who the people in their life are (names, nicknames, relationships)
     8	  3. What their projects are
     9	  4. What they want their wings called
    10	
    11	Seeds the entity_registry with confirmed data so MemPalace knows your world
    12	from minute one — before a single session is indexed.
    13	
    14	Usage:
    15	    python3 -m mempalace.onboarding
    16	    or: mempalace init
    17	"""
    18	
    19	from pathlib import Path
    20	from mempalace.entity_registry import EntityRegistry
    21	from mempalace.entity_detector import detect_entities, scan_for_detection
    22	
    23	
    24	# ─────────────────────────────────────────────────────────────────────────────
    25	# Default wing taxonomies by mode
    26	# ─────────────────────────────────────────────────────────────────────────────
    27	
    28	DEFAULT_WINGS = {
    29	    "work": [
    30	        "projects",
    31	        "clients",
    32	        "team",
    33	        "decisions",
    34	        "research",
    35	    ],
    36	    "personal": [
    37	        "family",
    38	        "health",
    39	        "creative",
    40	        "reflections",
    41	        "relationships",
    42	    ],
    43	    "combo": [
    44	        "family",
    45	        "work",
    46	        "health",
    47	        "creative",
    48	        "projects",
    49	        "reflections",
    50	    ],
    51	}
    52	
    53	
    54	# ─────────────────────────────────────────────────────────────────────────────
    55	# Helpers
    56	# ─────────────────────────────────────────────────────────────────────────────
    57	
    58	
    59	def _hr():
    60	    print(f"\n{'─' * 58}")
    61	
    62	
    63	def _header(text):
    64	    print(f"\n{'=' * 58}")
    65	    print(f"  {text}")
    66	    print(f"{'=' * 58}")
    67	
    68	
    69	def _ask(prompt, default=None):
    70	    if default:
    71	        val = input(f"  {prompt} [{default}]: ").strip()
    72	        return val if val else default
    73	    return input(f"  {prompt}: ").strip()
    74	
    75	
    76	def _yn(prompt, default="y"):
    77	    val = input(f"  {prompt} [{'Y/n' if default == 'y' else 'y/N'}]: ").strip().lower()
    78	    if not val:
    79	        return default == "y"
    80	    return val.startswith("y")
    81	
    82	
    83	# ─────────────────────────────────────────────────────────────────────────────
    84	# Step 1: Mode selection
    85	# ─────────────────────────────────────────────────────────────────────────────
    86	
    87	
    88	def _ask_mode() -> str:
    89	    _header("Welcome to MemPalace")
    90	    print("""
    91	  MemPalace is a personal memory system. To work well, it needs to know
    92	  a little about your world — who the people are, what the projects
    93	  are, and how you want your memory organized.
    94	
    95	  This takes about 2 minutes. You can always update it later.
    96	""")
    97	    print("  How are you using MemPalace?")
    98	    print()
    99	    print("    [1]  Work     — notes, projects, clients, colleagues, decisions")
   100	    print("    [2]  Personal — diary, family, health, relationships, reflections")
   101	    print("    [3]  Both     — personal and professional mixed")
   102	    print()
   103	
   104	    while True:
   105	        choice = input("  Your choice [1/2/3]: ").strip()
   106	        if choice == "1":
   107	            return "work"
   108	        elif choice == "2":
   109	            return "personal"
   110	        elif choice == "3":
   111	            return "combo"
   112	        print("  Please enter 1, 2, or 3.")
   113	
   114	
   115	# ─────────────────────────────────────────────────────────────────────────────
   116	# Step 2: People
   117	# ─────────────────────────────────────────────────────────────────────────────
   118	
   119	
   120	def _ask_people(mode: str) -> tuple[list, dict]:
   121	    """Returns (people_list, aliases_dict)."""
   122	    people = []
   123	    aliases = {}  # nickname → full name
   124	
   125	    if mode in ("personal", "combo"):
   126	        _hr()
   127	        print("""
   128	  Personal world — who are the important people in your life?
   129	
   130	  Format: name, relationship (e.g. "Riley, daughter" or just "Devon")
   131	  For nicknames, you'll be asked separately.
   132	  Type 'done' when finished.
   133	""")
   134	        while True:
   135	            entry = input("  Person: ").strip()
   136	            if entry.lower() in ("done", ""):
   137	                break
   138	            parts = [p.strip() for p in entry.split(",", 1)]
   139	            name = parts[0]
   140	            relationship = parts[1] if len(parts) > 1 else ""
   141	            if name:
   142	                # Ask about nicknames
   143	                nick = input(f"  Nickname for {name}? (or enter to skip): ").strip()
   144	                if nick:
   145	                    aliases[nick] = name
   146	                people.append({"name": name, "relationship": relationship, "context": "personal"})
   147	
   148	    if mode in ("work", "combo"):
   149	        _hr()
   150	        print("""
   151	  Work world — who are the colleagues, clients, or collaborators
   152	  you'd want to find in your notes?
   153	
   154	  Format: name, role (e.g. "Ben, co-founder" or just "Sarah")
   155	  Type 'done' when finished.
   156	""")
   157	        while True:
   158	            entry = input("  Person: ").strip()
   159	            if entry.lower() in ("done", ""):
   160	                break
   161	            parts = [p.strip() for p in entry.split(",", 1)]
   162	            name = parts[0]
   163	            role = parts[1] if len(parts) > 1 else ""
   164	            if name:
   165	                people.append({"name": name, "relationship": role, "context": "work"})
   166	
   167	    return people, aliases
   168	
   169	
   170	# ─────────────────────────────────────────────────────────────────────────────
   171	# Step 3: Projects
   172	# ─────────────────────────────────────────────────────────────────────────────
   173	
   174	
   175	def _ask_projects(mode: str) -> list:
   176	    if mode == "personal":
   177	        return []
   178	
   179	    _hr()
   180	    print("""
   181	  What are your main projects? (These help MemPalace distinguish project
   182	  names from person names — e.g. "Lantern" the project vs. "Lantern" the word.)
   183	
   184	  Type 'done' when finished.
   185	""")
   186	    projects = []
   187	    while True:
   188	        proj = input("  Project: ").strip()
   189	        if proj.lower() in ("done", ""):
   190	            break
   191	        if proj:
   192	            projects.append(proj)
   193	    return projects
   194	
   195	
   196	# ─────────────────────────────────────────────────────────────────────────────
   197	# Step 4: Wings
   198	# ─────────────────────────────────────────────────────────────────────────────
   199	
   200	
   201	def _ask_wings(mode: str) -> list:
   202	    defaults = DEFAULT_WINGS[mode]
   203	    _hr()
   204	    print(f"""
   205	  Wings are the top-level categories in your memory palace.
   206	
   207	  Suggested wings for {mode} mode:
   208	    {", ".join(defaults)}
   209	
   210	  Press enter to keep these, or type your own comma-separated list.
   211	""")
   212	    custom = input("  Wings: ").strip()
   213	    if custom:
   214	        return [w.strip() for w in custom.split(",") if w.strip()]
   215	    return defaults
   216	
   217	
   218	# ─────────────────────────────────────────────────────────────────────────────
   219	# Step 5: Auto-detect from files
   220	# ─────────────────────────────────────────────────────────────────────────────
   221	
   222	
   223	def _auto_detect(directory: str, known_people: list) -> list:
   224	    """Scan directory for additional entity candidates."""
   225	    known_names = {p["name"].lower() for p in known_people}
   226	
   227	    try:
   228	        files = scan_for_detection(directory)
   229	        if not files:
   230	            return []
   231	        detected = detect_entities(files)
   232	        new_people = [
   233	            e
   234	            for e in detected["people"]
   235	            if e["name"].lower() not in known_names and e["confidence"] >= 0.7
   236	        ]
   237	        return new_people
   238	    except Exception:
   239	        return []
   240	
   241	
   242	# ─────────────────────────────────────────────────────────────────────────────
   243	# Step 6: Ambiguity warnings
   244	# ─────────────────────────────────────────────────────────────────────────────
   245	
   246	
   247	def _warn_ambiguous(people: list) -> list:
   248	    """
   249	    Flag names that are also common English words.
   250	    Returns list of ambiguous names for user awareness.
   251	    """
   252	    from mempalace.entity_registry import COMMON_ENGLISH_WORDS
   253	
   254	    ambiguous = []
   255	    for p in people:
   256	        if p["name"].lower() in COMMON_ENGLISH_WORDS:
   257	            ambiguous.append(p["name"])
   258	    return ambiguous
   259	
   260	

codex
I’ve finished the external pass through README, CLI, MCP server, layers, graph split, hooks, and ingestion. The next step is the direct gap analysis against Public’s actual handlers so the final findings stay anchored to what we already have, not to an older mental model.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server .opencode/plugins .opencode/skill/system-spec-kit/scripts/dist/memory | rg 'memory-search\\.ts|memory-context\\.ts|context-server\\.ts|generate-context\\.js|spec-kit-compact-code-graph\\.js'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/plugins/spec-kit-compact-code-graph.js
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js.map
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js

 succeeded in 0ms:
     1	# MemPal Benchmark Results — Full Progression
     2	
     3	**March 2026 — The complete record from baseline to state-of-the-art.**
     4	
     5	---
     6	
     7	## The Core Finding
     8	
     9	Every competitive memory system uses an LLM to manage memory:
    10	- Mem0 uses an LLM to extract facts
    11	- Mastra uses GPT-5-mini to observe conversations
    12	- Supermemory uses an LLM to run agentic search passes
    13	
    14	They all start from the assumption that you need AI to decide what to remember.
    15	
    16	**MemPal's baseline just stores the actual words and searches them with ChromaDB's default embeddings. No extraction. No summarization. No AI deciding what matters. And it scores 96.6% on LongMemEval.**
    17	
    18	That's the finding. The field is over-engineering the memory extraction step. Raw verbatim text with good embeddings is a stronger baseline than anyone realized — because it doesn't lose information. When an LLM extracts "user prefers PostgreSQL" and throws away the original conversation, it loses the context of *why*, the alternatives considered, the tradeoffs discussed. MemPal keeps all of that, and the search model finds it.
    19	
    20	Nobody published this result because nobody tried the simple thing and measured it properly.
    21	
    22	---
    23	
    24	## The Two Honest Numbers
    25	
    26	These are different claims. They need to be presented as a pair.
    27	
    28	| Mode | LongMemEval R@5 | LLM Required | Cost per Query |
    29	|---|---|---|---|
    30	| **Raw ChromaDB** | **96.6%** | None | $0 |
    31	| **Hybrid v4 + Haiku rerank** | **100%** | Haiku (optional) | ~$0.001 |
    32	| **Hybrid v4 + Sonnet rerank** | **100%** | Sonnet (optional) | ~$0.003 |
    33	
    34	The 96.6% is the product story: free, private, one dependency, no API key, runs entirely offline.
    35	
    36	The 100% is the competitive story: a perfect score on the standard benchmark for AI memory, verified across all 500 questions and all 6 question types — reproducible with either Haiku or Sonnet as the reranker.
    37	
    38	Both are real. Both are reproducible. Neither is the whole picture alone.
    39	
    40	---
    41	
    42	## Comparison vs Published Systems (LongMemEval)
    43	
    44	| # | System | R@5 | LLM Required | Which LLM | Notes |
    45	|---|---|---|---|---|---|
    46	| 1 | **MemPal (hybrid v4 + rerank)** | **100%** | Optional | Haiku | Reproducible, 500/500 |
    47	| 2 | Supermemory ASMR | ~99% | Yes | Undisclosed | Research only, not in production |
    48	| 3 | MemPal (hybrid v3 + rerank) | 99.4% | Optional | Haiku | Reproducible |
    49	| 3 | MemPal (palace + rerank) | 99.4% | Optional | Haiku | Independent architecture |
    50	| 4 | Mastra | 94.87% | Yes | GPT-5-mini | — |
    51	| 5 | **MemPal (raw, no LLM)** | **96.6%** | **None** | **None** | **Highest zero-API score published** |
    52	| 6 | Hindsight | 91.4% | Yes | Gemini-3 | — |
    53	| 7 | Supermemory (production) | ~85% | Yes | Undisclosed | — |
    54	| 8 | Stella (dense retriever) | ~85% | None | None | Academic baseline |
    55	| 9 | Contriever | ~78% | None | None | Academic baseline |
    56	| 10 | BM25 (sparse) | ~70% | None | None | Keyword baseline |
    57	
    58	**MemPal raw (96.6%) is the highest published LongMemEval score that requires no API key, no cloud, and no LLM at any stage.**
    59	
    60	**MemPal hybrid v4 + Haiku rerank (100%) is the first perfect score on LongMemEval — 500/500 questions, all 6 question types at 100%.**
    61	
    62	---
    63	
    64	## Other Benchmarks
    65	
    66	### ConvoMem (Salesforce, 75K+ QA pairs)
    67	
    68	| System | Score | Notes |
    69	|---|---|---|
    70	| **MemPal** | **92.9%** | Verbatim text, semantic search |
    71	| Gemini (long context) | 70–82% | Full history in context window |
    72	| Block extraction | 57–71% | LLM-processed blocks |
    73	| Mem0 (RAG) | 30–45% | LLM-extracted memories |
    74	
    75	MemPal is more than 2× Mem0 on this benchmark. With Sonnet rerank, MemPal reaches **100% on LoCoMo** across all 5 question types including temporal-inference (was 46% at baseline).
    76	
    77	**Why MemPal beats Mem0 by 2×:** Mem0 uses an LLM to extract memories — it decides what to remember and discards the rest. When it extracts the wrong thing, the memory is gone. MemPal stores verbatim text. Nothing is discarded. The simpler approach wins because it doesn't lose information.
    78	
    79	**Per-category breakdown:**
    80	
    81	| Category | Recall | Grade |
    82	|---|---|---|
    83	| Assistant Facts | 100% | Perfect |
    84	| User Facts | 98.0% | Excellent |
    85	| Abstention | 91.0% | Strong |
    86	| Implicit Connections | 89.3% | Good |
    87	| Preferences | 86.0% | Good — weakest category |
    88	
    89	### LoCoMo (1,986 multi-hop QA pairs)
    90	
    91	| Mode | R@5 | R@10 | LLM | Notes |
    92	|---|---|---|---|---|
    93	| **Hybrid v5 + Sonnet rerank (top-50)** | **100%** | **100%** | Sonnet | Structurally guaranteed (top-k > sessions) |
    94	| **bge-large + Haiku rerank (top-15)** | — | **96.3%** | Haiku | Single-hop 86.6%, temporal-inf 87.0% |
    95	| **bge-large hybrid (top-10)** | — | **92.4%** | None | +3.5pp over all-MiniLM, single-hop +10.6pp |
    96	| **Hybrid v5 (top-10)** | 83.7% | **88.9%** | None | Beats Memori 81.95% — honest score |
    97	| **Wings v3 speaker-owned closets (top-10)** | — | **85.7%** | None | Adversarial 92.8% — speaker ownership solves speaker confusion |
    98	| **Wings v2 concept closets (top-10)** | — | **75.6%** | None | Adversarial 80.0%; single-hop 49% drags overall |
    99	| **Palace v2 (top-10, 3 rooms)** | 75.6% | **84.8%** | Haiku (index) | Room assignment at index; summary routing at query |
   100	| Wings v1 (broken — filter not boost) | — | 58.0% | None | Speaker WHERE filter discarded evidence; 5.4% coverage |
   101	| Palace v1 (top-5, global LLM routing) | 34.2% | — | Haiku (both) | Fails: taxonomy mismatch |
   102	| Session, no rerank (top-10) | — | 60.3% | None | Baseline |
   103	| Dialog, no rerank (top-10) | — | 48.0% | None | — |
   104	
   105	**Wings v2 per-category breakdown (top-10, no LLM):**
   106	
   107	| Category | Wings v1 | Wings v2 | Delta |
   108	|---|---|---|---|
   109	| Single-hop | ~52% | 49.0% | -3pp |
   110	| Temporal | ~64% | 79.2% | +15pp |
   111	| Temporal-inference | ~53% | 49.1% | -4pp |
   112	| Open-domain | ~71% | 83.7% | +13pp |
   113	| **Adversarial** | **34.0%** | **80.0%** | **+46pp** |
   114	
   115	**Wings v3 per-category breakdown (top-10, no LLM):**
   116	
   117	| Category | Wings v1 | Wings v2 | Wings v3 | Hybrid v5 |
   118	|---|---|---|---|---|
   119	| Single-hop | ~52% | 49.0% | **65.3%** | ~70%? |
   120	| Temporal | ~64% | 79.2% | **87.3%** | ~87%? |
   121	| Temporal-inference | ~53% | 49.1% | **63.2%** | ~65%? |
   122	| Open-domain | ~71% | 83.7% | **90.7%** | ~90%? |
   123	| **Adversarial** | **34.0%** | **80.0%** | **92.8%** | — |
   124	
   125	Wings v3 design: one closet per speaker per session. Owner's turns verbatim; other speaker's turns as `[context]` labels. 38 closets/conversation vs 184 (v2) → 26% coverage with top-10. Adversarial score (92.8%) exceeds bge-large overall (92.4%) — speaker ownership almost completely solves the speaker-confusion category.
   126	
   127	Root cause of wings v1 failure: (1) speaker WHERE filter discarded evidence about Caroline when evidence lived in a John-tagged closet (John spoke more words but conversation was about Caroline); (2) top_k=10 from ~184 closets = 5.4% coverage vs 37% in session mode. Fix: retrieve all closets, use speaker match as 15% distance boost instead of filter.
   128	
   129	**With Sonnet rerank, MemPal achieves 100% on every LoCoMo question type — including temporal-inference, which was the hardest category at baseline.**
   130	
   131	**Per-category breakdown (hybrid + Sonnet rerank):**
   132	
   133	| Category | Recall | Baseline | Delta |
   134	|---|---|---|---|
   135	| Single-hop | 1.000 | 59.0% | +41.0pp |
   136	| Temporal | 1.000 | 69.2% | +30.8pp |
   137	| **Temporal-inference** | **1.000** | **46.0%** | **+54.0pp** |
   138	| Open-domain | 1.000 | 58.1% | +41.9pp |
   139	| Adversarial | 1.000 | 61.9% | +38.1pp |
   140	
   141	**Temporal-inference was the hardest category** — questions requiring connections across multiple sessions. Hybrid scoring (person name boost, quoted phrase boost) combined with Sonnet's reading comprehension closes this gap entirely. From 46% to 100%.
   142	
   143	---
   144	
   145	## LongMemEval — Breakdown by Question Type
   146	
   147	The 96.6% R@5 baseline broken down by the six question categories in LongMemEval:
   148	
   149	| Question Type | R@5 | R@10 | Count | Notes |
   150	|---|---|---|---|---|
   151	| Knowledge update | 99.0% | 100% | 78 | Strongest — facts that changed over time |
   152	| Multi-session | 98.5% | 100% | 133 | Very strong |
   153	| Temporal reasoning | 96.2% | 97.0% | 133 | Strong |
   154	| Single-session user | 95.7% | 97.1% | 70 | Strong |
   155	| Single-session preference | 93.3% | 96.7% | 30 | Good — preferences stated indirectly |
   156	| Single-session assistant | 92.9% | 96.4% | 56 | Weakest — questions about what the AI said |
   157	
   158	The two weakest categories point to specific fixes:
   159	- **Single-session assistant (92.9%)**: Questions ask about what the assistant said, not the user. Fixed by indexing assistant turns as well as user turns.
   160	- **Single-session preference (93.3%)**: Preferences are often stated indirectly ("I usually prefer X"). Fixed by the preference extraction patterns in hybrid v3.
   161	
   162	Both were addressed in the improvements that took the score from 96.6% to 99.4%.
   163	
   164	---
   165	
   166	## The Full Progression — How We Got from 96.6% to 99.4%
   167	
   168	Every improvement below was a response to specific failure patterns in the results. Nothing was added speculatively.
   169	
   170	### Starting Point: Raw ChromaDB (96.6%)
   171	
   172	The baseline: store every session verbatim as a single document. Query with ChromaDB's default embeddings (all-MiniLM-L6-v2). No postprocessing.
   173	
   174	This was the first result. Nobody expected it to work this well. The team's hypothesis was that raw verbatim storage would lose to systems that extract structured facts. The 96.6% proved the hypothesis wrong.
   175	
   176	**What it does:** Stores verbatim session text. Embeds with sentence transformers. Retrieves by cosine similarity.
   177	
   178	**What it misses:** Questions with vocabulary mismatch ("yoga classes" vs "I went this morning"), preference questions where the preference is implied, temporally-ambiguous questions where multiple sessions match.
   179	
   180	---
   181	
   182	### Improvement 1: Hybrid Scoring v1 → 97.8% (+1.2%)
   183	
   184	**What changed:** Added keyword overlap scoring on top of embedding similarity.
   185	
   186	```
   187	fused_score = embedding_score × (1 + keyword_weight × overlap)
   188	```
   189	
   190	When query keywords appear verbatim in a session, that session gets a small boost. The boost is mild enough not to hurt recall when keywords don't match.
   191	
   192	**Why it worked:** Some questions use exact terminology ("PostgreSQL", "Dr. Chen", specific names). Pure embedding similarity can rank a semantically-close session above the exact match. Keyword overlap rescues these cases.
   193	
   194	**What it still misses:** Temporally-ambiguous questions. Sessions from the right time period rank equally with sessions from wrong time periods.
   195	
   196	---
   197	
   198	### Improvement 2: Hybrid Scoring v2 → 98.4% (+0.6%)
   199	
   200	**What changed:** Added temporal boost — sessions near the question's reference date get a distance reduction (up to 40%).
   201	
   202	```python
   203	# Sessions near question_date - offset get score boost
   204	if temporal_distance < threshold:
   205	    fused_dist *= (1.0 - temporal_boost * proximity_factor)
   206	```
   207	
   208	**Why it worked:** Many LongMemEval questions are anchored to a specific time ("what did you do last month?"). Multiple sessions might semantically match, but only one is temporally correct. The boost breaks ties in favor of the right time period.
   209	
   210	---
   211	
   212	### Improvement 3: Hybrid v2 + Haiku Rerank → 98.8% (+0.4%)
   213	
   214	**What changed:** After retrieval, send the top-K candidates to Claude Haiku with the question. Ask Haiku to re-rank by relevance.
   215	
   216	**Why it worked:** Embeddings measure semantic similarity, not answer relevance. Haiku can read the question and the retrieved documents and reason about which one actually answers the question — a task embeddings fundamentally cannot do.
   217	
   218	**Cost:** ~$0.001/query for Haiku. Optional — the system runs fine without it.
   219	
   220	---
   221	
   222	### Improvement 4: Hybrid v3 + Haiku Rerank → 99.4% (+0.6%)
   223	
   224	**What changed:** Added preference extraction — 16 regex patterns that detect how people actually express preferences in conversation, then create synthetic "User has mentioned: X" documents at index time.
   225	
   226	Examples of what gets caught:
   227	- "I usually prefer X" → `User has mentioned: preference for X`
   228	- "I always do Y" → `User has mentioned: always does Y`
   229	- "I don't like Z" → `User has mentioned: dislikes Z`
   230	
   231	**Why it worked:** Preference questions are consistently hard for pure embedding retrieval. "What does the user prefer for database backends?" doesn't semantically match "I find Postgres more reliable in my experience" — but it does match a synthetic document that says "User has mentioned: finds Postgres more reliable." The explicit extraction bridges the vocabulary gap without losing the verbatim original.
   232	
   233	**Why 16 patterns:** Manual analysis of the miss cases. Each pattern corresponds to a real failure mode found in the wrong-answer JSONL files.
   234	
   235	---
   236	
   237	### Improvement 5: Hybrid v4 + Haiku Rerank → **100%** (+0.6%)
   238	
   239	**What changed:** Three targeted fixes for the three questions that failed in every previous mode.
   240	
   241	The remaining misses were identified by loading both the hybrid v3 and palace results and finding the exact questions that failed in *both* architectures — confirming they were hard limits, not luck.
   242	
   243	**Fix 1 — Quoted phrase extraction** (miss: `'sexual compulsions'` assistant question):
   244	The question contained an exact quoted phrase in single quotes. Sessions containing that exact phrase now get a 60% distance reduction. The target session jumped from unranked to rank 1.
   245	
   246	**Fix 2 — Person name boosting** (miss: `Rachel/ukulele` temporal question):
   247	Sentence-embedded models give insufficient weight to person names. Capitalized proper nouns are extracted from queries; sessions mentioning that name get a 40% distance reduction. The target session jumped from unranked to rank 2.
   248	
   249	**Fix 3 — Memory/nostalgia patterns** (miss: `high school reunion` preference question):
   250	The target session said "I still remember the happy high school experiences such as being part of the debate team." Added patterns to preference extraction: `"I still remember X"`, `"I used to X"`, `"when I was in high school X"`, `"growing up X"`. This created a synthetic doc "User has mentioned: positive high school experiences, debate team, AP courses" — which the reunion question now matches. Target session jumped to rank 3.
   251	
   252	**Result:** All 6 question types at 100% R@5. 500/500 questions. No regressions.
   253	
   254	**Haiku vs. Sonnet rerank:** Both achieve 100% R@5. NDCG@10 is 0.976 (Haiku) vs 0.975 (Sonnet) — statistically identical. Haiku is ~3× cheaper. Sonnet is slightly faster at this task (2.99s/q vs 3.85s/q in our run). Either works; Haiku is the default recommendation.
   255	
   256	---
   257	
   258	### Parallel Approach: Palace Mode + Haiku Rerank → 99.4% (independent convergence)
   259	
   260	Built independently from the hybrid track. Different architecture, same ceiling.

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-011.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	### Finding 4: MemPalace’s temporal KG is more expressive than our causal links, but its hygiene is manual and not contradiction-safe yet
     2	- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L422), [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L69), [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L347), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L78), [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L557), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L57), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L663) `source-confirmed + README-documented`
     3	- **What it does**: MemPalace has a separate SQLite triple store with `valid_from`/`valid_to`, manual invalidation, and `source_closet` provenance, but its own README says contradiction wiring is still pending. Public’s causal layer is less fact-like, yet it validates relation types, clamps strengths to finite `0..1`, caps auto-edge strength, clears graph caches on mutation, cleans orphaned edges, and reports graph coverage.
     4	- **Why it matters for us**: MemPalace wins on fact expressiveness, Public wins on operational hygiene. The reusable idea is temporal validity on edges, not the current MemPalace fact pipeline as-is.
     5	- **Recommendation**: prototype later
     6	- **Impact**: medium
     7	
     8	### Finding 5: MemPalace’s “store everything” story is selectively lossy in the ingest pipeline, which weakens its hygiene claims
     9	- **Source**: [convo_miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py#L39), [convo_miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py#L181), [general_extractor.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py#L363), [miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py#L407), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L138) `source-confirmed`
    10	- **What it does**: Conversation ingest truncates AI responses to the first 8 lines, room assignment is keyword-scored, heuristic extraction only keeps paragraphs that clear a confidence floor, and project re-mines delete and reinsert prior drawers. That is not “unfiltered raw memory”; it is selective routing and reduction. Public is also selective, but it makes that explicit through trigger filtering and save quality controls instead of presenting the result as untouched raw capture.
    11	- **Why it matters for us**: Hygiene depends on truthfulness about loss and transformation. MemPalace’s real pipeline is workable, but its storage story is cleaner in prose than in code.
    12	- **Recommendation**: reject
    13	- **Impact**: medium
    14	
    15	### Finding 6: MemPalace diary storage knowingly trades recall hygiene for compression convenience
    16	- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L477), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L752), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L209) `source-confirmed`
    17	- **What it does**: MemPalace’s diary tool explicitly notes that raw AAAK is stored even though compressed AAAK degrades embedding quality. Public has no direct equivalent diary feature, but its save path already expects validation and quality gating before long-term indexing.
    18	- **Why it matters for us**: If we ever add agent diaries, this is the exact hygiene pitfall to avoid: compressed recall artifacts should not become the primary indexed representation.
    19	- **Recommendation**: NEW FEATURE
    20	- **Impact**: medium
    21	
    22	## Sources Consulted
    23	- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md)
    24	- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md)
    25	- [external/pyproject.toml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml)
    26	- [external/mempalace/cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py), [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py)
    27	- [external/mempalace/searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py), [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py)
    28	- [external/mempalace/palace_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py), [external/mempalace/knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py)
    29	- [external/mempalace/miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py), [external/mempalace/convo_miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py), [external/mempalace/general_extractor.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py)
    30	- [external/hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md), [external/hooks/mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh), [external/hooks/mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh)
    31	- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts), [preflight.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
    32	
    33	## Assessment
    34	- New information ratio: 0.74
    35	- Questions addressed: duplicate hygiene, retrieval/trigger hygiene, health/repair hygiene, temporal fact hygiene, ingest truthfulness, compressed-diary hygiene
    36	- Questions answered: MemPalace is weaker than Public on save-time hygiene, trigger enforcement, and repair tooling; its strongest reusable hygiene idea is temporal invalidation semantics, while its biggest hidden weakness is that “raw verbatim” is still heavily transformed during ingest
    37	
    38	## Reflection
    39	- What worked: tracing handler code against lower-level storage modules made the hygiene split very clear; MemPalace keeps discipline in protocol text, while Public keeps more discipline in validated write/read paths
    40	- What did not work: CocoIndex MCP calls did not return in this runtime, so I relied on direct source tracing with `rg`/`nl`; the strict validator passed but still emitted `cannot create temp file for here document: Operation not permitted`; and I could not run the write-based deep-research/save steps in this read-only sandbox
    41	
    42	## Recommended Next Focus
    43	Compare identity hygiene next: MemPalace’s wing/room naming, AAAK entity codes, and manual fact subjects versus Public’s `tenantId`/`userId`/`agentId`/`sharedSpaceId`, learned triggers, and causal-edge provenance, to decide whether we need a human-friendly alias layer at the UX edge without weakening governed retrieval.
    44	
    45	RESEARCH BRIEF:
    46	# $refine TIDD-EC Prompt: 005-mempalace
    47	
    48	## 2. Role
    49	
    50	You are a research specialist in verbatim AI memory systems, ChromaDB-based semantic retrieval, navigable memory taxonomies, wake-up context layering, MCP tool design, hook-driven persistence, and local temporal knowledge graphs. Work like a systems analyst who can separate README positioning from verified Python mechanics, trace how MemPalace composes mining, storage, retrieval, hooks, and protocol guidance, and translate those choices into practical improvements for `Code_Environment/Public`.
    51	
    52	## 3. Task
    53	
    54	Research MemPalace's raw-verbatim memory architecture, palace taxonomy, wake-up stack, MCP protocol/tooling, hook-driven save flow, and temporal knowledge-graph patterns to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around session continuity, compaction survival, memory hygiene, and agent-facing recall ergonomics. Determine which MemPalace ideas should be `adopt now`, `prototype later`, or `reject`. Keep the analysis honest about what is source-confirmed, what is README-documented, and what is benchmark-claim territory.
    55	
    56	## 4. Context
    57	
    58	### 4.1 System Description
    59	
    60	MemPalace is a local Python memory system centered on a strong design claim: keep raw conversation and project text instead of extracting only summarized facts, then make that verbatim corpus searchable and navigable. The external repo exposes a CLI, an MCP server, hook scripts, a ChromaDB-backed drawer store, a wake-up layering system, and a separate SQLite temporal knowledge graph. Its storage model uses palace terminology: wings for people/projects/topics, halls for shared memory categories, rooms for named ideas, closets for compact summaries, and drawers for original verbatim content.
    61	
    62	The most important architectural tension in this phase is that MemPalace mixes strong implementation ideas with aggressive README claims that the project itself partially corrects in its April 7, 2026 note. The raw-verbatim result is the standout claim; AAAK is explicitly experimental and lossy; contradiction detection is documented as incomplete; and some benchmark or rerank claims live more in docs than in source. This phase should reward the underlying architecture where the code supports it, but it must not let benchmark marketing or future-looking README language blur the evidence line.
    63	
    64	The repo appears to support three ingestion shapes into one shared memory backend: project mining, conversation mining, and a general heuristic extraction mode. Retrieval then spans direct semantic search, wake-up text generation across L0-L3 layers, palace graph traversal via shared room metadata, and MCP tooling that teaches an operational memory protocol to the agent through the status response itself. Hook scripts add another layer: instead of a memory system that only responds to explicit search/save calls, MemPalace also tries to shape the timing of memory writes at stop and pre-compact boundaries.
    65	
    66	### 4.2 Cross-Phase Awareness Table
    67	
    68	| Phase | System | Core Pattern | Overlap Risk | Differentiation |
    69	|-------|--------|-------------|-------------|-----------------|
    70	| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 005 (memory server), 004 (session continuity) | Focus tool profiles, session lifecycle, topic keys |
    71	| 002 | Mex | Markdown scaffold + drift detection | 005 (project knowledge) | Focus drift detection, scaffold structure, no-DB approach |
    72	| 003 | Modus Memory | FSRS spaced repetition + BM25 | 005 (local memory) | Focus FSRS decay, BM25, librarian expansion, cross-references |
    73	| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 005 (compaction, hybrid retrieval claims) | Focus plugin architecture, project/global scoping, wrapper boundary |
    74	| 005 | MemPalace | Raw verbatim storage + palace taxonomy + hooks + temporal KG | 001 (MCP memory), 004 (compaction/helping memory survive), 003 (local memory) | Focus raw-no-extraction posture, wake-up layers, hooks, palace structure, temporal KG |
    75	
    76	### 4.3 What This Repo Already Has
    77	
    78	`Code_Environment/Public` already has Spec Kit Memory with hybrid retrieval, `memory_search`, `memory_context`, `memory_match_triggers`, memory-save flows through `generate-context.js`, session/bootstrap handling in the memory MCP server, and compaction-oriented structural transport via `.opencode/plugins/spec-kit-compact-code-graph.js`. It also already has semantic code search via CocoIndex and structured graph context via Compact Code Graph.
    79	
    80	What it does **not** currently have is a raw-verbatim-by-default memory posture comparable to MemPalace's drawer model, a first-class wing/hall/room taxonomy for agent memory navigation, a dedicated L0/L1/L2/L3 wake-up stack for context loading, MemPalace-style stop/pre-compact save hooks that actively block to force preservation, or a separate temporal entity-triple knowledge graph with explicit invalidation alongside the main memory store. The comparison should stay anchored to those gaps rather than repeating generic hybrid-RAG analysis already covered elsewhere.
    81	
    82	## 5. Instructions
    83	
    84	1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
    85	2. Read the governing Public repo `AGENTS.md` first. Then explicitly verify whether `external/AGENTS.md` exists. If it does not, note that absence as evidence about repo scope rather than inventing external workflow constraints.
    86	3. Before deep research begins, ensure this phase folder contains Level 3 Spec Kit docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`.
    87	4. Use `@speckit` for markdown authoring when the runtime supports agent routing. If routing is unavailable, preserve existing Spec Kit Level 3 structure manually without creating side-channel docs outside the phase folder.
    88	5. Start with `external/README.md`, but read it critically. Cover these sections in order: the April 7, 2026 correction note; Quick Start; How You Actually Use It; The Palace; wake-up / AAAK sections; MCP tools; benchmark sections. Capture both the architecture claims and the repo's own admitted overstatements.
    89	6. Immediately after the README, read `external/pyproject.toml` and `external/mempalace/cli.py`. Confirm the actual runtime boundary, command surface, install assumptions, and the core flows for `init`, `mine`, `search`, `wake-up`, `status`, `repair`, and `compress`.
    90	7. Trace the MCP surface end to end in `external/mempalace/mcp_server.py`. Focus on tool registration, read/write split, stderr logging behavior, `PALACE_PROTOCOL`, `AAAK_SPEC`, status bootstrap behavior, duplicate checking, graph tools, knowledge-graph tools, diary tools, and what the tool names imply about agent discipline.
    91	8. Trace retrieval and context loading next in `external/mempalace/searcher.py` and `external/mempalace/layers.py`. Capture the raw ChromaDB query path, wing/room filtering, L0/L1/L2/L3 layering, wake-up token assumptions, and how much of that layering is implementation versus README framing.
    92	9. Trace structural navigation next in `external/mempalace/palace_graph.py` and `external/mempalace/knowledge_graph.py`. Keep these separate in your notes: palace graph traversal is metadata-derived from ChromaDB rooms/halls/wings, while the knowledge graph is a separate SQLite temporal triple store with invalidation.
    93	10. Trace ingestion behavior next. Read `external/mempalace/miner.py`, `external/mempalace/convo_miner.py`, `external/mempalace/general_extractor.py`, and `external/mempalace/onboarding.py`. Focus on chunking strategy, room detection, no-summary posture, heuristic extraction, onboarding assumptions, and whether the system truly keeps everything or selectively restructures it during ingest.
    94	11. Read hook and benchmark artifacts after the implementation core: `external/hooks/README.md`, `external/hooks/mempal_save_hook.sh`, `external/hooks/mempal_precompact_hook.sh`, and `external/benchmarks/BENCHMARKS.md`. Treat these as crucial to the product story, but distinguish carefully between executable behavior, experimental behavior, and benchmark claims that require caution.
    95	12. Compare MemPalace directly against current `Code_Environment/Public` code: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`, `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`, and `.opencode/plugins/spec-kit-compact-code-graph.js`. Be explicit about what Public already covers better and what MemPalace still contributes.
    96	13. Before the main research pass, validate the phase folder with this exact command:
    97	    ```bash
    98	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace" --strict
    99	    ```
   100	14. After validation passes, run `spec_kit:deep-research` with this exact topic:
   101	    ```text
   102	    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external and identify concrete improvements for Code_Environment/Public, especially around raw verbatim memory storage, palace taxonomy (wings/halls/rooms), wake-up context layering, MCP protocol/tool design, hook-driven save flows, and temporal knowledge-graph patterns.
   103	    ```
   104	15. Save all outputs inside `research/`, with `research/research.md` as the canonical report. Every meaningful finding must cite exact file paths, say whether the evidence is `source-confirmed`, `README-documented`, `benchmark-documented`, or mixed, explain why it matters for `Code_Environment/Public`, classify the recommendation as `adopt now`, `prototype later`, or `reject`, identify the affected subsystem, and note migration or truthfulness risk. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
   105	    ```bash
   106	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace"
   107	    ```
   108	
   109	## 6. Research Questions
   110	
   111	1. What does MemPalace gain from its raw-verbatim "store everything, then make it findable" posture, and where would that improve or conflict with Spec Kit Memory's more selective save and retrieval model?
   112	2. How useful is the wing / hall / room / closet / drawer taxonomy in practice: does it materially improve navigation and recall, or does it mostly reframe metadata filtering in memorable language?
   113	3. How does the L0/L1/L2/L3 wake-up stack compare with Public's `session_bootstrap`, `memory_context`, and compaction-recovery flows, and what parts of the layering model are reusable here?
   114	4. What does `mcp_server.py` gain by embedding `PALACE_PROTOCOL` and `AAAK_SPEC` directly in the status bootstrap, and could Public benefit from similarly direct memory-usage guidance without adding prompt clutter?
   115	5. How effective are the stop-hook and pre-compact-hook patterns at protecting context before loss, and how do they compare to Public's existing compaction-oriented structural plugin and memory-save workflows?
   116	6. What are the real architectural consequences of keeping the temporal knowledge graph separate from the drawer store, especially around invalidation, diary entries, and fact-vs-verbatim boundaries?
   117	7. How much of MemPalace's benchmark story is supported directly by code in this repo, and which claims should remain benchmark candidates or doc-level references rather than implementation truths?
   118	8. How do `miner.py`, `convo_miner.py`, and `general_extractor.py` balance "store everything" against chunking, heuristics, room assignment, and extraction side paths?
   119	9. Which MemPalace ideas most improve compaction survival and startup continuity for future Public sessions: wake-up layers, hook timing, memory protocol bootstrapping, diary writing, or taxonomy-based narrowing?
   120	10. Which MemPalace features are genuinely reusable architecture, and which are presentation choices, experimental layers, or hype-prone claims that Public should not copy?
   121	11. How should AAAK be evaluated honestly: as a useful optional compression dialect, a still-unproven context-loading experiment, or mostly a distraction from the stronger raw-verbatim baseline?
   122	
   123	## 7. Do's
   124	
   125	- Do distinguish raw verbatim storage from AAAK compression; they are not the same feature and do not have the same evidence quality.
   126	- Do separate palace graph traversal from the temporal knowledge graph; one is metadata-derived navigation and the other is explicit fact storage with validity windows.
   127	- Do inspect the actual hook scripts, not just their README, so the analysis captures the precise blocking behavior before save and compaction.
   128	- Do compare MemPalace's wake-up flow against current Public bootstrap and compaction behavior using real Public files.
   129	- Do treat the April 7, 2026 correction note as important evidence about truthfulness boundaries and product honesty.
   130	- Do analyze how status/bootstrap responses teach the agent what to do, not just what data they return.
   131	- Do map strong findings to specific Public subsystems such as Spec Kit Memory retrieval, context bootstrap, save flows, or compaction handling.
   132	
   133	## 8. Don'ts
   134	
   135	- Do not describe MemPalace as "just ChromaDB search"; the repo's differentiators are raw-storage posture, wake-up layers, hooks, taxonomy, and KG split.
   136	- Do not treat README benchmark numbers as fully source-proven implementation facts unless the repo actually exposes the relevant pipeline.
   137	- Do not recommend copying AAAK or benchmark marketing language wholesale into Public planning.
   138	- Do not collapse this phase into generic hybrid-RAG analysis already owned by earlier phases.
   139	- Do not ignore the repo's admitted inaccuracies or unresolved claims; they are central to evaluating whether an idea is production-worthy.
   140	- Do not overlook the difference between "AI remembers because storage exists" and "AI remembers because the protocol tells it when and how to use storage."
   141	- Do not edit anything under `external/` or outside this phase folder.
   142	
   143	## 9. Examples
   144	
   145	### Example A: Wake-up and protocol finding
   146	
   147	```text
   148	**Finding: Status doubles as a behavior bootstrap, not just a health check**
   149	- Source: external/mempalace/mcp_server.py; external/mempalace/layers.py
   150	- Evidence type: source-confirmed
   151	- What it does: `mempalace_status` returns palace overview data plus `PALACE_PROTOCOL` and `AAAK_SPEC`, while the wake-up stack separately loads L0/L1 context for cheap startup continuity.
   152	- Why it matters: Public already has resume/bootstrap tooling, but it does not currently use one memory-facing status surface to teach concrete retrieval and save behavior this directly.
   153	- Recommendation: prototype later
   154	- Affected area: memory bootstrap UX, session recovery guidance, compaction recovery behavior
   155	- Risk/cost: Medium; could add prompt noise or duplicate existing guidance if not scoped carefully
   156	```
   157	
   158	### Example B: Hook-driven preservation finding
   159	
   160	```text
   161	**Finding: Save timing is enforced by hooks, not left to agent initiative alone**
   162	- Source: external/hooks/mempal_save_hook.sh; external/hooks/mempal_precompact_hook.sh; external/hooks/README.md
   163	- Evidence type: source-confirmed + README-documented
   164	- What it does: the stop hook blocks every N human exchanges and the pre-compact hook always blocks, forcing the agent to preserve key context before loss.
   165	- Why it matters: Public has compaction-oriented structural transport, but it does not currently enforce a comparable memory-preservation checkpoint before context collapse.
   166	- Recommendation: adopt now or prototype later, depending on runtime surface
   167	- Affected area: memory save automation, compaction resilience, agent operating protocol
   168	- Risk/cost: Medium; intrusive save prompts and duplicate writes need guardrails
   169	```
   170	
   171	## 10. Constraints
   172	
   173	### 10.1 Error handling
   174	
   175	- If a README or benchmark claim is not directly supported by source, label it clearly as documentation- or benchmark-level evidence rather than implementation fact.
   176	- If MemPalace's docs contradict its code or its own April 2026 correction note, prefer source evidence and call out the contradiction explicitly.
   177	- If comparison assumptions about current `Code_Environment/Public` behavior are outdated, correct them in the research instead of preserving stale framing.
   178	- If the external repo structure differs from the paths named here, preserve the same analytical order and document the actual files used.
   179	
   180	### 10.2 Scope
   181	
   182	**IN SCOPE**
   183	
   184	- raw verbatim storage and no-summary posture
   185	- palace taxonomy: wings, halls, rooms, closets, drawers
   186	- L0/L1/L2/L3 wake-up layering
   187	- MCP server design, status bootstrap, protocol guidance, diary tools
   188	- stop and pre-compact hook behavior
   189	- temporal knowledge graph and invalidation model
   190	- mining modes, chunking, heuristics, onboarding
   191	- benchmark and README truthfulness boundaries
   192	- comparison against current Public memory, bootstrap, save, and compaction flows
   193	
   194	**OUT OF SCOPE**
   195	
   196	- generic Python style commentary
   197	- speculative cloud scaling or hosted-service redesigns
   198	- broad vector-database taxonomy disconnected from MemPalace evidence
   199	- re-litigating BM25/FSRS/plugin topics already owned by earlier phases
   200	- editing or fixing MemPalace itself
   201	
   202	### 10.3 Prioritization framework
   203	
   204	Rank findings in this order: leverage for Public session continuity, compaction-survival value, truthfulness and evidence quality, fit with current Spec Kit Memory capabilities, operational simplicity, memory-hygiene impact, and clean differentiation from phases `001` through `004`.
   205	
   206	## 11. Deliverables
   207	
   208	- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` present and valid before deep research starts
   209	- `research/research.md` as the canonical report with at least 5 evidence-backed findings
   210	- explicit comparison against current Public memory retrieval, bootstrap, save, and compaction behavior
   211	- each finding labeled `adopt now`, `prototype later`, or `reject`
   212	- each finding states evidence type: `source-confirmed`, `README-documented`, `benchmark-documented`, or mixed
   213	- `implementation-summary.md` created at the end
   214	- memory saved from this phase folder using `generate-context.js`
   215	
   216	Minimum finding schema:
   217	
   218	- finding title
   219	- exact source evidence
   220	- evidence type
   221	- what MemPalace does
   222	- why it matters for `Code_Environment/Public`
   223	- recommendation: `adopt now`, `prototype later`, or `reject`
   224	- affected subsystem
   225	- migration, ambiguity, or truthfulness risk
   226	
   227	## 12. Evaluation Criteria
   228	
   229	- CLEAR target: `>= 40/50`
   230	- RICCE compliance is visible in the prompt:
   231	  - **Role** is specialized in verbatim memory systems, wake-up layering, MCP protocol design, hooks, and temporal KG behavior
   232	  - **Instructions** are ordered, concrete, path-specific, and honest about evidence boundaries
   233	  - **Context** is domain-specific, cross-phase aware, and corrected for current Public capabilities
   234	  - **Constraints** clearly separate source-confirmed behavior from README or benchmark claims
   235	  - **Examples** show strong MemPalace-derived findings about protocol bootstrapping and hook-driven preservation
   236	- at least 5 findings are evidence-backed rather than speculative
   237	- findings explicitly separate raw-mode strengths from AAAK's experimental status
   238	- findings compare MemPalace against today's Public bootstrap and compaction behavior rather than a stale baseline
   239	- cross-phase overlap with `001` through `004` is explicitly bounded so this phase stays focused on raw-verbatim architecture, wake-up layers, hooks, and KG split
   240	
   241	## 13. Completion Bar
   242	
   243	The phase is only complete when all of the following are true:
   244	
   245	- the reading order covered README honesty notes, CLI/runtime boundaries, MCP server, retrieval layers, palace graph, temporal KG, ingest pipeline, hooks, and benchmarks
   246	- current `Code_Environment/Public` memory/bootstrap/compaction behavior was compared using code, not assumptions
   247	- the validation command passed on this exact phase folder
   248	- the exact deep-research topic string appears in the work
   249	- `research/research.md` contains at least 5 evidence-backed findings
   250	- each finding distinguishes source-confirmed behavior from README or benchmark claims where needed
   251	- `checklist.md` is updated with evidence and completion marks
   252	- `implementation-summary.md` exists
   253	- memory is saved successfully for `005-mempalace`
   254	- no edits were made outside this phase folder
   255	- recommendations explicitly address raw storage, taxonomy, wake-up layering, hooks, and temporal KG patterns
   256	
   257	OUTPUT FORMAT (MANDATORY - follow this exactly):
   258	# Iteration 011: GAP ANALYSIS - MISSING FEATURES
   259	
   260	## Focus

exec
/bin/zsh -lc 'rg -n "profile|resume|bootstrap|token|budget|session|hook|compaction|compact|guidance|protocol|duplicate|save|quality|governed|tenant|userId|agentId|sharedSpaceId|includeContent|raw" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/plugins/spec-kit-compact-code-graph.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/plugins/spec-kit-compact-code-graph.js:9:// Thin OpenCode plugin hook layer for packet 030.
.opencode/plugins/spec-kit-compact-code-graph.js:36:const PLUGIN_ID = 'spec-kit-compact-code-graph';
.opencode/plugins/spec-kit-compact-code-graph.js:44:const BRIDGE_PATH = fileURLToPath(new URL('./spec-kit-compact-code-graph-bridge.mjs', import.meta.url));
.opencode/plugins/spec-kit-compact-code-graph.js:57: *   hook: string,
.opencode/plugins/spec-kit-compact-code-graph.js:71: *     hook: string,
.opencode/plugins/spec-kit-compact-code-graph.js:77: *   compaction?: TransportBlock,
.opencode/plugins/spec-kit-compact-code-graph.js:97:function normalizeOptions(rawOptions) {
.opencode/plugins/spec-kit-compact-code-graph.js:98:  if (!rawOptions || typeof rawOptions !== 'object') {
.opencode/plugins/spec-kit-compact-code-graph.js:107:  const options = /** @type {PluginOptions} */ (rawOptions);
.opencode/plugins/spec-kit-compact-code-graph.js:120:function cacheKeyForSession(sessionID, specFolder) {
.opencode/plugins/spec-kit-compact-code-graph.js:121:  return `${specFolder ?? '__workspace__'}::${sessionID ?? '__global__'}`;
.opencode/plugins/spec-kit-compact-code-graph.js:185:async function loadTransportPlan({ projectDir, sessionID, specFolder, cacheTtlMs, nodeBinary, bridgeTimeoutMs }) {
.opencode/plugins/spec-kit-compact-code-graph.js:186:  const key = cacheKeyForSession(sessionID, specFolder);
.opencode/plugins/spec-kit-compact-code-graph.js:230:  if (typeof event.sessionID === 'string') {
.opencode/plugins/spec-kit-compact-code-graph.js:231:    return event.sessionID;
.opencode/plugins/spec-kit-compact-code-graph.js:235:    if (typeof event.properties.sessionID === 'string') {
.opencode/plugins/spec-kit-compact-code-graph.js:236:      return event.properties.sessionID;
.opencode/plugins/spec-kit-compact-code-graph.js:239:      if (typeof event.properties.info.sessionID === 'string') {
.opencode/plugins/spec-kit-compact-code-graph.js:240:        return event.properties.info.sessionID;
.opencode/plugins/spec-kit-compact-code-graph.js:246:    if (event.properties.part && typeof event.properties.part === 'object' && typeof event.properties.part.sessionID === 'string') {
.opencode/plugins/spec-kit-compact-code-graph.js:247:      return event.properties.part.sessionID;
.opencode/plugins/spec-kit-compact-code-graph.js:256:    && (eventType.startsWith('session.') || eventType.startsWith('message.'));
.opencode/plugins/spec-kit-compact-code-graph.js:259:function invalidateTransportCache(sessionID, specFolder) {
.opencode/plugins/spec-kit-compact-code-graph.js:260:  if (sessionID) {
.opencode/plugins/spec-kit-compact-code-graph.js:261:    transportCache.delete(cacheKeyForSession(sessionID, specFolder));
.opencode/plugins/spec-kit-compact-code-graph.js:277: * Create the Spec Kit OpenCode plugin and its transport-backed hook handlers.
.opencode/plugins/spec-kit-compact-code-graph.js:280: * @param {PluginOptions | undefined} rawOptions - Optional plugin overrides.
.opencode/plugins/spec-kit-compact-code-graph.js:283:export default async function SpecKitCompactCodeGraphPlugin(ctx, rawOptions) {
.opencode/plugins/spec-kit-compact-code-graph.js:284:  const options = normalizeOptions(rawOptions);
.opencode/plugins/spec-kit-compact-code-graph.js:296:      spec_kit_compact_code_graph_status: tool({
.opencode/plugins/spec-kit-compact-code-graph.js:297:        description: 'Show Spec Kit compact code graph plugin cache status',
.opencode/plugins/spec-kit-compact-code-graph.js:308:            `resume_mode=${RESUME_MODE}`,
.opencode/plugins/spec-kit-compact-code-graph.js:326:        sessionID: input.sessionID,
.opencode/plugins/spec-kit-compact-code-graph.js:362:        sessionID: anchor.info.sessionID,
.opencode/plugins/spec-kit-compact-code-graph.js:380:          sessionID: anchor.info.sessionID,
.opencode/plugins/spec-kit-compact-code-graph.js:396:    'experimental.session.compacting': async (input, output) => {
.opencode/plugins/spec-kit-compact-code-graph.js:399:        sessionID: input.sessionID,
.opencode/plugins/spec-kit-compact-code-graph.js:406:      const block = plan?.compaction;
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:57:const collect_session_data_1 = require("../extractors/collect-session-data");
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:70:  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:72:  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:85:Preferred save path (JSON-PRIMARY):
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:87:  - The AI has strictly better information about its own session than any DB query can reconstruct.
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:93:    but they must not reroute the save to another folder.
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:95:JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:227:function resolveCliSpecFolderReference(rawArg) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:228:    const folderName = path.basename(rawArg);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:229:    const explicitProjectScopedPath = !rawArg.endsWith('.json') && (rawArg.startsWith('specs/') ||
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:230:        rawArg.startsWith('.opencode/specs/'))
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:231:        ? path.join(core_1.CONFIG.PROJECT_ROOT, rawArg)
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:234:    if (!rawArg.endsWith('.json')) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:235:        if (path.isAbsolute(rawArg)) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:236:            const absoluteSegments = rawArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:241:                resolvedNestedPath = rawArg;
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:244:        let cleaned = rawArg;
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:275:    const isSpecFolderPath = (rawArg.startsWith('specs/') ||
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:276:        rawArg.startsWith('.opencode/specs/') ||
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:277:        core_1.SPEC_FOLDER_BASIC_PATTERN.test(folderName)) && !rawArg.endsWith('.json');
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:278:    return isSpecFolderPath ? rawArg : null;
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:300:function parseStructuredJson(rawJson, sourceLabel) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:301:    if (rawJson.trim().length === 0) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:306:        parsed = JSON.parse(rawJson);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:322:    const rawJson = mode === '--stdin'
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:325:    if (mode === '--json' && rawJson === undefined) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:329:    if (mode === '--json' && (rawJson === undefined || rawJson.trim().length === 0)) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:333:    const payload = parseStructuredJson(rawJson ?? '', mode);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:349:        sessionId: null,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:356:    // Extract --session-id <uuid> from argv before positional parsing
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:357:    let sessionId = null;
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:360:        if (argv[i] === '--session-id') {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:363:                throw new Error('--session-id requires a non-empty value');
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:365:            sessionId = candidate.trim();
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:373:        return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:377:        return { ...structured, sessionId };
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:388:        sessionId,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:513:            collectSessionDataFn: collect_session_data_1.collectSessionData,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:514:            sessionId: parsed.sessionId ?? undefined,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:519:        const isExpected = /Spec folder not found|No spec folders|specs\/ directory|retry attempts|Expected|Invalid JSON provided|requires a target spec folder|requires an inline JSON string|required a non-empty JSON object|JSON object payload|no longer supported|session-id requires/.test(errMsg);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:27:import { estimateTokens } from '../formatters/token-metrics.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:33:import * as sessionManager from '../lib/session/session-manager.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:42:} from '../lib/search/session-transition.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:73:  readonly tokenBudget?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:79:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:80:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:81:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:82:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:84:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:86:  includeContent?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:89:  profile?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:90:  sessionTransition?: SessionTransitionTrace;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:94:  sessionScope: 'caller' | 'ephemeral';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:97:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:99:  resumedContextCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:108:  tokenBudget?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:116:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:117:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:118:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:119:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:121:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:123:  includeContent?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:125:  tokenUsage?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:128:  profile?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:131:/** T205: Token budget enforcement metadata */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:133:  budgetTokens: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:146:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:155:  resumeHeuristicApplied: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:180:  sessionLifecycle: SessionLifecycleMetadata;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:186:  sessionTransition: SessionTransitionTrace;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:332:   Enforces per-layer/per-mode token budgets by estimating the
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:333:   token count of strategy results and truncating when exceeded.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:334:   Uses character-based estimation: 1 token ≈ 4 chars.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:338: * T205: Enforce token budget on strategy results.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:340: * Estimates the token count of the serialized result. If over budget,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:342: * until within budget. Higher-scored results are preserved.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:344:function enforceTokenBudget(result: ContextResult, budgetTokens: number): { result: ContextResult; enforcement: TokenBudgetEnforcement } {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:348:  // Under budget — no enforcement needed
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:349:  if (actualTokens <= budgetTokens) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:353:        budgetTokens,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:361:  // Over budget — attempt to truncate embedded results
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:380:        summary: 'Context truncated to fit token budget',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:424:      if (estimateTokens(JSON.stringify(fallbackResult)) <= budgetTokens) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:439:  const compactStructuredResult = (
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:490:        if (candidateTokens <= budgetTokens) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:522:        // Remove items from the end until we fit within budget
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:539:        // Phase 2: Drop lowest-scored results if still over budget
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:540:        while (currentResults.length > 1 && currentTokens > budgetTokens) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:561:          if (currentTokens + metadataTokens <= budgetTokens) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:576:        // Recalculate actual tokens after truncation
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:579:        if (newSerializedTokens <= budgetTokens) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:583:              budgetTokens,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:593:        const compacted = compactStructuredResult(innerEnvelope, currentResults, contentArr);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:594:        if (compacted) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:596:            result: compacted.result,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:598:              budgetTokens,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:599:              actualTokens: compacted.actualTokens,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:615:  // Fallback when parsing fails or a structured response still exceeds budget.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:616:  // Always emit valid nested JSON rather than raw character slices.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:627:      budgetTokens,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:654:    tokenBudget: 800
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:662:    tokenBudget: 3500
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:670:    tokenBudget: 3000
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:674:  resume: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:677:    strategy: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:678:    tokenBudget: 2000
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:704:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:705:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:706:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:707:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:725:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:726:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:727:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:728:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:731:    includeContent: options.includeContent || false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:734:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:735:    sessionTransition: options.sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:737:    profile: options.profile,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:756:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:757:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:758:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:759:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:762:    includeContent: options.includeContent || false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:765:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:766:    sessionTransition: options.sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:768:    profile: options.profile,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:784:  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:787:    query: input || 'resume work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:790:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:791:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:792:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:793:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:796:    includeContent: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:798:    anchors: resumeAnchors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:799:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:800:    sessionTransition: options.sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:802:    profile: options.profile,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:810:    strategy: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:811:    mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:812:    resumeAnchors: resumeAnchors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:827:  // Security: session scope derived from server context, not caller input
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:829:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:830:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:831:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:837:      resumed: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:846:  const resumed = trustedSession.trusted;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:847:  const priorMode = resumed
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:850:  const counter = resumed
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:857:    resumed,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:865:  session: SessionLifecycleResolution,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:883:  let resumeHeuristicApplied = false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:898:    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:900:      session.resumed ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:901:      session.priorMode === 'resume' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:909:      effectiveMode = 'resume';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:910:      resumeHeuristicApplied = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:942:      resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:986:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1004:    sessionLifecycle,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1010:    sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1031:            includeTrace === true ? sessionTransition : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1047:    tokenUsageSource: pressurePolicy.source,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1048:    tokenUsagePressure: pressurePolicy.ratio,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1056:    sessionLifecycle,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1057:    tokenBudget: effectiveBudget,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1058:    tokenBudgetEnforcement: enforcement,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1109:    includeContent: include_content = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1110:    tokenUsage,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1142:  if (requested_mode !== 'resume') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1156:      // F050: Extract a symbol-like token from the query instead of passing
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1157:      // raw prose to buildContext({ subject }). resolveSubjectToRef() matches
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1159:      // Heuristic: pick the first token that looks like a code identifier
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1224:    resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1227:    error: sessionScopeError,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1229:  if (sessionScopeError) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1232:      error: sessionScopeError,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1240:  const sessionLifecycle: SessionLifecycleMetadata = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1241:    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1244:    resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1246:    resumedContextCount: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1251:  const tokenBudget = layerInfo?.tokenBudget ?? 2000;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1254:    tokenBudget,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1257:    runtimeContextStats.tokenCount = estimateTokens(normalizedInput);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1259:    runtimeContextStats.tokenCount = undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1262:  // Resolve token pressure (caller -> estimator -> unavailable)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1267:    ? getPressureLevel(tokenUsage, runtimeContextStats)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1281:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1282:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1283:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1284:    sharedSpaceId: args.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1288:    includeContent: include_content,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1291:    profile: args.profile,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1305:      resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1314:    resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1319:  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1321:  // support profile formatting — setting a profile there would be a no-op.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1322:  if (!options.profile && detectedIntent && effectiveMode !== 'quick' && isIntentAutoProfileEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1328:        options.profile = autoProfile;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1329:        console.error(`[memory-context] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1332:      // Auto-profile is best-effort — never breaks context retrieval
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1336:  const sessionTransition = buildSessionTransitionTrace({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1338:    resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1343:    queryHeuristicApplied: resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1345:  options.sessionTransition = options.includeTrace === true ? sessionTransition : undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1352:  const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1354:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1355:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1356:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1359:  if (!sessionStateResult.success) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1361:      `[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1418:    // Best-effort session state write — do not fail the handler
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1421:  // T205: Determine effective token budget from mode or layer definitions
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1422:  const modeTokenBudget = CONTEXT_MODES[effectiveMode]?.tokenBudget;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1423:  const effectiveBudget = modeTokenBudget || tokenBudget;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1425:  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1426:  // so the final response respects the advertised token budget.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1430:      sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434:  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1436:    if (resumeContextItems.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1437:      sessionLifecycle.resumedContextCount = resumeContextItems.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1448:  // T205: Enforce token budget AFTER all context injection
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1449:  const { result: budgetedResult, enforcement } = enforceTokenBudget(tracedResult0, effectiveBudget);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1450:  const tracedResult = budgetedResult;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1473:      ? `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy) [truncated${enforcement.originalResultCount !== undefined ? `: ${enforcement.originalResultCount} → ${enforcement.returnedResultCount} results` : ''} to fit ${effectiveBudget} token budget]`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1479:      `Token budget: ${effectiveBudget} (${effectiveMode} mode)`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1491:      sessionLifecycle,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1497:        resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1502:      sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1530:        session_id: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1562:      const strategy = typeof budgetedResult?.strategy === 'string' && budgetedResult.strategy.length > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1563:        ? budgetedResult.strategy
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:9:import * as sessionManager from '../lib/session/session-manager.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:69:} from '../lib/search/session-transition.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:75:} from '../lib/response/profile-formatters.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:89:  deduplicateResults as deduplicateWithSessionState,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:93:} from '../lib/search/session-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:181:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:182:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:183:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:184:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:191:  includeContent?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:194:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:207:  min_quality_score?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:210:  sessionTransition?: SessionTransitionTrace;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:212:  profile?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:324:function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:325:  const session = retrievalSessionStateManager.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:327:    activeGoal: session.activeGoal,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:328:    seenResultIds: Array.from(session.seenResultIds),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:329:    openQuestions: [...session.openQuestions],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:330:    preferredAnchors: [...session.preferredAnchors],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450:function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:451:  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:454:      dedupStats: { enabled: false, sessionId: null }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:458:  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:461:    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:468:      sessionId
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:498:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:499:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:500:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:501:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:502:    limit: rawLimit = 10,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:508:    includeContent: includeContent = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:511:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:517:    rerank = true, // Enable reranking by default for better result quality
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:524:    min_quality_score,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:527:    sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:528:    profile,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:535:    tenantId: normalizedScope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:536:    userId: normalizedScope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:537:    agentId: normalizedScope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:538:    sessionId: normalizedScope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:539:    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:578:  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:581:  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:582:    ? Math.min(Math.floor(rawLimit), 100)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:691:  // Phase C: Intent-to-profile auto-routing.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:692:  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:693:  let effectiveProfile: string | undefined = profile;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:699:        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:702:      // Auto-profile is best-effort — never breaks search
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:714:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:724:    tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:725:    userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:726:    agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:727:    sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:734:    qualityThreshold,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:738:    includeContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:744:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:781:      tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:782:      userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:783:      agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784:      sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:789:      includeContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:791:      qualityThreshold,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:797:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:834:                     quality_score, created_at
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:869:          const raw = (r as Record<string, unknown>);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:870:          if (typeof raw.similarity === 'number') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:871:            raw.similarity = Math.min(raw.similarity * folderBoost.factor, 1.0);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:886:    if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:889:        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:892:        retrievalSessionStateManager.setAnchors(sessionId, anchors);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:895:      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:985:      session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1000:      includeContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1054:  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1065:      data.sessionDedup = deduped.metadata;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1071:  // Apply session deduplication AFTER cache
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1072:  if (sessionId && enableDedup && sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1103:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1111:      const tokensSaved = filteredCount * 200;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1121:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1125:        tokensSaved: tokensSaved,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1127:        tokenSavingsEstimate: tokensSaved > 0 ? `~${tokensSaved} tokens` : '0'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1136:        resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1146:  if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1159:        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1162:      data.sessionState = buildSessionStatePayload(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1172:  if (includeTrace && sessionTransition) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1173:    responseToReturn = attachSessionTransitionTrace(responseToReturn, sessionTransition);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1178:    retrievalTelemetry.recordTransitionDiagnostics(telemetry, sessionTransition);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1208:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1275:            sessionId: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1283:  // REQ-014: Query flow tracking + result_cited for includeContent searches
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1314:          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1317:        // Log result_cited for includeContent searches (content was embedded = cited)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1318:        if (includeContent && shownIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1325:  // REQ-D5-003: Apply presentation profile when flag is enabled and profile is specified.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1326:  // Phase C: effectiveProfile includes auto-routed profile from intent detection.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1331:        const profiled = applyProfileToEnvelope(effectiveProfile, firstEntry.text);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1332:        if (profiled !== firstEntry.text) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1335:            content: [{ ...firstEntry, text: profiled }],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1338:      } catch (_profileError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:15:import { Server } from '@modelcontextprotocol/sdk/server/index.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:16:import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:17:import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:39:import { runPostMutationHooks } from './handlers/mutation-hooks.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:59:} from './hooks/index.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:60:import { primeSessionIfNeeded } from './hooks/memory-surface.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:85:import * as sessionBoost from './lib/search/session-boost.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:113:import * as sessionManager from './lib/session/session-manager.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:115:// Phase 023: Context metrics — lightweight session quality tracking
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:116:import { recordMetricEvent } from './lib/session/context-metrics.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:131:import { getSessionSnapshot } from './lib/session/session-snapshot.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:169:  sessionPrimed?: boolean;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:171:  /** T018: Structured Prime Package for non-hook CLI auto-priming */
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:258:  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:360:  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:361:    ? ((extra as { sessionId?: string }).sessionId ?? null)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:363:  const explicitSessionId = typeof args.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:364:    ? args.sessionId
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:365:    : typeof args.session_id === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:366:      ? args.session_id
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:376:// REQ-014: Sticky session for follow_on_tool_use correlation.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:377:// Stores the last resolved session ID so non-search tools (e.g. memory_stats)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:378:// that lack an explicit sessionId param can still correlate with a prior search.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:669:  sessionPrimeContext: AutoSurfaceResult,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:676:  const constitutionalCount = Array.isArray(sessionPrimeContext.constitutional)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:677:    ? sessionPrimeContext.constitutional.length
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:679:  const codeGraphStatus = sessionPrimeContext.codeGraphStatus;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:688:  // T018: Include Prime Package hints for non-hook CLIs
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:689:  const pkg = sessionPrimeContext.primePackage;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:700:  meta.sessionPriming = sessionPrimeContext;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:738:// (CHK-076): Instructions are computed once at startup and NOT refreshed during the session.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:739:// This is by design — instruction updates require MCP protocol re-negotiation which most clients
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:764:  // Phase 024 / Item 4: Session recovery digest from session-snapshot
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:766:    const { getSessionSnapshot } = await import('./lib/session/session-snapshot.js');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:768:    const hasData = snap.specFolder || snap.graphFreshness !== 'error' || snap.sessionQuality !== 'unknown';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:777:      lines.push(`- Session quality: ${snap.sessionQuality}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:780:  } catch { /* session-snapshot not available — skip digest */ }
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:782:  // Phase 027: Structural bootstrap guidance for non-hook runtimes
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:792:    const { getSessionSnapshot: getSnap } = await import('./lib/session/session-snapshot.js');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:865:  const sessionTrackingId = resolveSessionTrackingId(args, _extra);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:866:  if (sessionTrackingId) lastKnownSessionId = sessionTrackingId;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:874:    // T018: Track last tool call timestamp for all tools except session_health.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:875:    if (name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:876:      recordToolCall(sessionTrackingId);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:878:      // Phase 023: Record metric event for context quality tracking
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:897:    let sessionPrimeContext: AutoSurfaceResult | null = null;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:899:      sessionPrimeContext = await primeSessionIfNeeded(
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:902:        sessionTrackingId,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:969:        const followOnSessionId = sessionTrackingId ?? lastKnownSessionId;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1021:    // near mentioned file paths and session continuity warnings.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1045:    // SK-004: Inject auto-surface hints before token-budget enforcement so
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1051:    // Token Budget Hybrid: Inject tokenBudget into response metadata (CHK-072)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1052:    // T205: Enforce per-layer token budgets with actual truncation
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1066:          if (sessionPrimeContext && !result.isError) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1067:            injectSessionPrimeHints(envelope, meta, sessionPrimeContext);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1075:          const budget = getTokenBudget(name);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1076:          meta.tokenBudget = budget;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1079:          if (typeof meta.tokenCount === 'number' && meta.tokenCount > budget) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1080:            console.error(`[token-budget] ${name} response (${meta.tokenCount} tokens) exceeds budget (${budget})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1082:            // T205: Attempt to truncate results array to fit within budget
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1087:              // Remove from end (lowest-scored) until within budget
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1090:                // P1-06 FIX: Recalculate token count from the full envelope
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1091:                // (not just results) so trace metadata is included in the budget.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1093:                if (typeof meta.tokenCount === 'number' && meta.tokenCount <= budget) break;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1099:                envelope.hints.push(`Token budget enforced: truncated ${originalCount} → ${innerResults.length} results to fit ${budget} token budget`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1101:              meta.tokenBudgetTruncated = true;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1107:                envelope.hints.push(`Response exceeds token budget (${meta.tokenCount}/${budget})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1114:        // Non-JSON response, skip token budget injection
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1199:    const rawResults = existingScanLocations.flatMap((location) =>
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1204:    const found = rawResults.length;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1205:    const recovered = rawResults.filter(r => r.recovered).length;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1213:      results: rawResults,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1318:        // Non-fatal: startup scan must continue even if invalidation hooks fail.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1362:  runCleanupStep('sessionManager', () => sessionManager.shutdown());
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1485:    `[context-server] Detected runtime: ${detectedRuntime.runtime} (hookPolicy=${detectedRuntime.hookPolicy})`,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1560:  // P4-12/P4-19 FIX: Pass sessionManager and incrementalIndex so db-state can
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1567:    sessionManager,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1570:      sessionBoost,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1660:      console.error('[context-server] WARNING: Database has 0 memories — search will return no results until memories are saved');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1673:    sessionBoost.init(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1694:    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1791:      const sessionResult = sessionManager.init(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1792:      if (sessionResult.success) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1793:        console.error(`[context-server] Session manager initialized (enabled: ${sessionManager.isEnabled()})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1796:        // Reset any sessions that were active when server last crashed
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1797:        const recoveryResult = sessionManager.resetInterruptedSessions();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1799:          console.error(`[context-server] Crash recovery: marked ${recoveryResult.interruptedCount} sessions as interrupted`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1800:          // Log interrupted sessions for visibility
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1801:          const interrupted = sessionManager.getInterruptedSessions();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1802:          if (interrupted.sessions && interrupted.sessions.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1803:            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1807:        console.warn('[context-server] Session manager initialization returned:', sessionResult.error);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1809:    } catch (sessionErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1810:      const message = sessionErr instanceof Error ? sessionErr.message : String(sessionErr);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Search
     3	// ───────────────────────────────────────────────────────────────
     4	/* ───────────────────────────────────────────────────────────────
     5	   1. DEPENDENCIES
     6	──────────────────────────────────────────────────────────────── */
     7	
     8	import * as toolCache from '../lib/cache/tool-cache.js';
     9	import * as sessionManager from '../lib/session/session-manager.js';
    10	import * as intentClassifier from '../lib/search/intent-classifier.js';
    11	// TierClassifier, crossEncoder imports removed — only used by legacy V1 pipeline.
    12	import { isSessionBoostEnabled, isCausalBoostEnabled, isCommunitySearchFallbackEnabled, isDualRetrievalEnabled, isIntentAutoProfileEnabled } from '../lib/search/search-flags.js';
    13	import { searchCommunities } from '../lib/search/community-search.js';
    14	// 4-stage pipeline architecture
    15	import { executePipeline } from '../lib/search/pipeline/index.js';
    16	import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline/index.js';
    17	import type { IntentWeightsConfig } from '../lib/search/pipeline/types.js';
    18	import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
    19	import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
    20	// Artifact-class routing (spec/plan/tasks/checklist/memory)
    21	import { getStrategyForQuery } from '../lib/search/artifact-routing.js';
    22	// Chunk reassembly (extracted from this file)
    23	import { collapseAndReassembleChunkResults } from '../lib/search/chunk-reassembly.js';
    24	// Search utilities (extracted from this file)
    25	import {
    26	  filterByMinQualityScore,
    27	  resolveQualityThreshold,
    28	  buildCacheArgs,
    29	  resolveRowContextType,
    30	  resolveArtifactRoutingQuery,
    31	  applyArtifactRouting,
    32	} from '../lib/search/search-utils.js';
    33	// CacheArgsInput used internally by buildCacheArgs (lib/search/search-utils.ts)
    34	// Eval channel tracking (extracted from this file)
    35	import {
    36	  collectEvalChannelsFromRow,
    37	  buildEvalChannelPayloads,
    38	  summarizeGraphWalkDiagnostics,
    39	} from '../lib/telemetry/eval-channel-tracking.js';
    40	import type { EvalChannelPayload } from '../lib/telemetry/eval-channel-tracking.js';
    41	
    42	// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
    43	import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
    44	import {
    45	  logFeedbackEvents,
    46	  isImplicitFeedbackLogEnabled,
    47	} from '../lib/feedback/feedback-ledger.js';
    48	import type { FeedbackEvent } from '../lib/feedback/feedback-ledger.js';
    49	import { trackQueryAndDetect, logResultCited } from '../lib/feedback/query-flow-tracker.js';
    50	
    51	// Core utilities
    52	import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core/index.js';
    53	import { validateQuery, requireDb, toErrorMessage } from '../utils/index.js';
    54	
    55	// Response envelope + formatters
    56	import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
    57	import { formatSearchResults } from '../formatters/index.js';
    58	
    59	// Shared handler types
    60	import type { MCPResponse, IntentClassification } from './types.js';
    61	
    62	// Retrieval trace contracts (C136-08)
    63	import { createTrace } from '@spec-kit/shared/contracts/retrieval-trace';
    64	import { buildAdaptiveShadowProposal } from '../lib/cognitive/adaptive-ranking.js';
    65	import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
    66	import {
    67	  attachSessionTransitionTrace,
    68	  type SessionTransitionTrace,
    69	} from '../lib/search/session-transition.js';
    70	
    71	// REQ-D5-003: Mode-Aware Response Shape
    72	import {
    73	  applyProfileToEnvelope,
    74	  isResponseProfileEnabled,
    75	} from '../lib/response/profile-formatters.js';
    76	import {
    77	  buildProgressiveResponse,
    78	  extractSnippets,
    79	  isProgressiveDisclosureEnabled,
    80	  resolveCursor,
    81	} from '../lib/search/progressive-disclosure.js';
    82	import {
    83	  getLastLexicalCapabilitySnapshot,
    84	  resetLastLexicalCapabilitySnapshot,
    85	} from '../lib/search/sqlite-fts.js';
    86	import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
    87	import { evaluatePublicationGate } from '../lib/context/publication-gate.js';
    88	import {
    89	  deduplicateResults as deduplicateWithSessionState,
    90	  isSessionRetrievalStateEnabled,
    91	  manager as retrievalSessionStateManager,
    92	  refineForGoal,
    93	} from '../lib/search/session-state.js';
    94	
    95	// Type imports for casting
    96	import type { IntentType, IntentWeights as IntentClassifierWeights } from '../lib/search/intent-classifier.js';
    97	import type { RawSearchResult } from '../formatters/index.js';
    98	// RoutingResult, WeightedResult — now used internally by lib/search/search-utils.ts
    99	
   100	// Feature catalog: Semantic and lexical search (memory_search)
   101	// Feature catalog: Hybrid search pipeline
   102	// Feature catalog: 4-stage pipeline architecture
   103	// Feature catalog: Quality-aware 3-tier search fallback
   104	
   105	
   106	/* ───────────────────────────────────────────────────────────────
   107	   2. TYPES
   108	──────────────────────────────────────────────────────────────── */
   109	
   110	/**
   111	 * Internal search result row — enriched DB row used within this handler.
   112	 * NOT the same as the canonical SearchResult in shared/types.ts.
   113	 * Self-contained: uses local types instead of the deprecated MemoryRow/MemoryRecord shapes.
   114	 * This can migrate to MemoryDbRow & Record<string, unknown> later without changing the handler contract.
   115	 */
   116	interface MemorySearchRow extends Record<string, unknown> {
   117	  id: number;
   118	  similarity?: number;
   119	  importance_tier?: string;
   120	  contextType?: string;
   121	  context_type?: string;
   122	  attentionScore?: number;
   123	  retrievability?: number;
   124	  stability?: number;
   125	  last_review?: string | null;
   126	  created_at?: string;
   127	  last_accessed?: number;
   128	  content?: string;
   129	  memoryState?: string;
   130	  file_path?: string;
   131	  parent_id?: number | null;
   132	  chunk_index?: number | null;
   133	  chunk_label?: string | null;
   134	  isChunk?: boolean;
   135	  parentId?: number | null;
   136	  chunkIndex?: number | null;
   137	  chunkLabel?: string | null;
   138	  chunkCount?: number | null;
   139	  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
   140	  precomputedContent?: string;
   141	}
   142	
   143	interface DedupResult {
   144	  results: MemorySearchRow[];
   145	  dedupStats: Record<string, unknown>;
   146	}
   147	
   148	interface SearchCachePayload {
   149	  summary: string;
   150	  data: Record<string, unknown>;
   151	  hints: string[];
   152	}
   153	
   154	type SessionAwareResult = Record<string, unknown> & {
   155	  id: number | string;
   156	  score?: number;
   157	  content?: string;
   158	};
   159	
   160	// ChunkReassemblyResult — now imported from lib/search/chunk-reassembly.ts
   161	
   162	type IntentWeights = IntentClassifierWeights;
   163	
   164	function toIntentWeightsConfig(weights: IntentWeights | null): IntentWeightsConfig | null {
   165	  if (!weights) return null;
   166	  return {
   167	    similarity: weights.similarity,
   168	    importance: weights.importance,
   169	    recency: weights.recency,
   170	  };
   171	}
   172	
   173	// EvalChannelPayload — now imported from lib/telemetry/eval-channel-tracking.ts
   174	
   175	interface SearchArgs {
   176	  cursor?: string;
   177	  query?: string;
   178	  concepts?: string[];
   179	  specFolder?: string;
   180	  folderBoost?: { folder: string; factor: number };
   181	  tenantId?: string;
   182	  userId?: string;
   183	  agentId?: string;
   184	  sharedSpaceId?: string;
   185	  limit?: number;
   186	  tier?: string;
   187	  contextType?: string;
   188	  useDecay?: boolean;
   189	  includeContiguity?: boolean;
   190	  includeConstitutional?: boolean;
   191	  includeContent?: boolean;
   192	  anchors?: string[];
   193	  bypassCache?: boolean;
   194	  sessionId?: string;
   195	  enableDedup?: boolean;
   196	  intent?: string;
   197	  autoDetectIntent?: boolean;
   198	  minState?: string;
   199	  applyStateLimits?: boolean;
   200	  rerank?: boolean;
   201	  applyLengthPenalty?: boolean;
   202	  trackAccess?: boolean; // opt-in access tracking (default false)
   203	  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
   204	  enableSessionBoost?: boolean;
   205	  enableCausalBoost?: boolean;
   206	  minQualityScore?: number;
   207	  min_quality_score?: number;
   208	  mode?: string; // "deep" mode enables query expansion for multi-query RAG
   209	  includeTrace?: boolean;
   210	  sessionTransition?: SessionTransitionTrace;
   211	  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
   212	  profile?: string;
   213	  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
   214	  retrievalLevel?: 'local' | 'global' | 'auto';
   215	}
   216	
   217	// resolveRowContextType — now imported from lib/search/search-utils.ts
   218	// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts
   219	
   220	function attachTelemetryMeta(
   221	  response: MCPResponse,
   222	  telemetryPayload: Record<string, unknown>,
   223	): MCPResponse {
   224	  const firstEntry = response?.content?.[0];
   225	  if (!firstEntry || typeof firstEntry.text !== 'string') {
   226	    return response;
   227	  }
   228	
   229	  try {
   230	    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
   231	    const meta = envelope.meta && typeof envelope.meta === 'object'
   232	      ? envelope.meta as Record<string, unknown>
   233	      : {};
   234	    envelope.meta = {
   235	      ...meta,
   236	      _telemetry: telemetryPayload,
   237	    };
   238	
   239	    return {
   240	      ...response,
   241	      content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
   242	    };
   243	  } catch (error: unknown) {
   244	    const message = toErrorMessage(error);
   245	    console.warn('[memory-search] Failed to attach telemetry payload:', message);
   246	    return response;
   247	  }
   248	}
   249	
   250	function extractResponseResults(response: MCPResponse): Array<Record<string, unknown>> {
   251	  const firstEntry = response?.content?.[0];
   252	  if (!firstEntry || typeof firstEntry.text !== 'string') {
   253	    return [];
   254	  }
   255	
   256	  try {
   257	    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
   258	    const data = envelope.data && typeof envelope.data === 'object'
   259	      ? envelope.data as Record<string, unknown>
   260	      : null;
   261	    return Array.isArray(data?.results)
   262	      ? data.results as Array<Record<string, unknown>>
   263	      : [];
   264	  } catch {
   265	    return [];
   266	  }
   267	}
   268	
   269	function extractSearchCachePayload(response: MCPResponse): SearchCachePayload | null {
   270	  const firstEntry = response?.content?.[0];
   271	  if (!firstEntry || typeof firstEntry.text !== 'string') {
   272	    return null;
   273	  }
   274	
   275	  try {
   276	    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
   277	    const summary = typeof envelope.summary === 'string' ? envelope.summary : null;
   278	    const data = envelope.data && typeof envelope.data === 'object'
   279	      ? envelope.data as Record<string, unknown>
   280	      : null;
   281	    const hints = Array.isArray(envelope.hints)
   282	      ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
   283	      : [];
   284	
   285	    if (!summary || !data) {
   286	      return null;
   287	    }
   288	
   289	    return { summary, data, hints };
   290	  } catch {
   291	    return null;
   292	  }
   293	}
   294	
   295	function parseResponseEnvelope(
   296	  response: MCPResponse,
   297	): { firstEntry: { type: 'text'; text: string }; envelope: Record<string, unknown> } | null {
   298	  const firstEntry = response?.content?.[0];
   299	  if (!firstEntry || firstEntry.type !== 'text' || typeof firstEntry.text !== 'string') {
   300	    return null;
   301	  }
   302	
   303	  try {
   304	    return {
   305	      firstEntry,
   306	      envelope: JSON.parse(firstEntry.text) as Record<string, unknown>,
   307	    };
   308	  } catch {
   309	    return null;
   310	  }
   311	}
   312	
   313	function replaceResponseEnvelope(
   314	  response: MCPResponse,
   315	  firstEntry: { type: 'text'; text: string },
   316	  envelope: Record<string, unknown>,
   317	): MCPResponse {
   318	  return {
   319	    ...response,
   320	    content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '400,1500p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   400	      },
   401	      {
   402	        data: {
   403	          count: 0,
   404	          results: [],
   405	        },
   406	      },
   407	    ];
   408	
   409	    if (parseFailedInnerText) {
   410	      const meta = candidateInnerStates[0].meta as Record<string, unknown>;
   411	      meta.parseFailedPreview = parseFailedInnerText.slice(0, 120);
   412	    }
   413	
   414	    for (const innerEnvelope of candidateInnerStates) {
   415	      if (contentClone.length > 0) {
   416	        contentClone[0] = { ...contentClone[0], text: JSON.stringify(innerEnvelope) };
   417	        (fallbackResult as Record<string, unknown>).content = contentClone;
   418	      } else {
   419	        (fallbackResult as Record<string, unknown>).content = [
   420	          { type: 'text', text: JSON.stringify(innerEnvelope) },
   421	        ];
   422	      }
   423	
   424	      if (estimateTokens(JSON.stringify(fallbackResult)) <= budgetTokens) {
   425	        return fallbackResult;
   426	      }
   427	    }
   428	
   429	    return {
   430	      strategy: baseResult.strategy,
   431	      mode: baseResult.mode,
   432	      content: [{
   433	        type: 'text',
   434	        text: JSON.stringify({ data: { count: 0, results: [] } }),
   435	      }],
   436	    };
   437	  };
   438	
   439	  const compactStructuredResult = (
   440	    innerEnvelope: Record<string, unknown>,
   441	    currentResults: Array<Record<string, unknown>>,
   442	    contentEntries: Array<{ type: string; text: string }>,
   443	  ): { result: ContextResult; actualTokens: number } | null => {
   444	    const truncateKeys = ['content', 'snippet', 'summary', 'text'] as const;
   445	    const lastIndex = currentResults.length - 1;
   446	
   447	    if (lastIndex < 0) {
   448	      return null;
   449	    }
   450	
   451	    const lastResult = currentResults[lastIndex];
   452	    if (!lastResult || typeof lastResult !== 'object') {
   453	      return null;
   454	    }
   455	
   456	    for (const key of truncateKeys) {
   457	      const originalValue = lastResult[key];
   458	      if (typeof originalValue !== 'string' || originalValue.length === 0) {
   459	        continue;
   460	      }
   461	
   462	      let bestResult: ContextResult | null = null;
   463	      let bestTokens = Number.POSITIVE_INFINITY;
   464	      let low = 0;
   465	      let high = originalValue.length;
   466	
   467	      while (low <= high) {
   468	        const mid = Math.floor((low + high) / 2);
   469	        const candidateResults = [...currentResults];
   470	        candidateResults[lastIndex] = {
   471	          ...lastResult,
   472	          [key]: originalValue.slice(0, mid),
   473	        };
   474	
   475	        innerEnvelope.data = {
   476	          ...((innerEnvelope.data as Record<string, unknown>) ?? {}),
   477	          results: candidateResults,
   478	          count: candidateResults.length,
   479	        };
   480	
   481	        const candidateContent = contentEntries.map((entry, index) => (
   482	          index === 0 ? { type: entry.type, text: JSON.stringify(innerEnvelope) } : { ...entry }
   483	        ));
   484	        const candidateResult = {
   485	          ...truncatedResult,
   486	          content: candidateContent,
   487	        } as ContextResult;
   488	        const candidateTokens = estimateTokens(JSON.stringify(candidateResult));
   489	
   490	        if (candidateTokens <= budgetTokens) {
   491	          bestResult = candidateResult;
   492	          bestTokens = candidateTokens;
   493	          low = mid + 1;
   494	        } else {
   495	          high = mid - 1;
   496	        }
   497	      }
   498	
   499	      if (bestResult) {
   500	        return {
   501	          result: bestResult,
   502	          actualTokens: bestTokens,
   503	        };
   504	      }
   505	    }
   506	
   507	    return null;
   508	  };
   509	
   510	  // Try to find and truncate the inner results array
   511	  const contentArr = (truncatedResult as Record<string, unknown>).content as Array<{ type: string; text: string }> | undefined;
   512	  let parseFailedInnerText: string | undefined;
   513	  if (contentArr && Array.isArray(contentArr) && contentArr.length > 0 && contentArr[0]?.text) {
   514	    try {
   515	      const innerEnvelope = JSON.parse(contentArr[0].text);
   516	      const innerResults = innerEnvelope?.data?.results;
   517	
   518	      if (Array.isArray(innerResults) && innerResults.length > 0) {
   519	        originalResultCount = innerResults.length;
   520	
   521	        // Results should already be sorted by score (highest first)
   522	        // Remove items from the end until we fit within budget
   523	        const currentResults = [...innerResults];
   524	        let currentTokens = actualTokens;
   525	
   526	        // Phase 1: Adaptive content truncation — truncate content fields before dropping results
   527	        const MAX_CONTENT_CHARS = 500;
   528	        for (const r of currentResults) {
   529	          if (r.content && typeof r.content === 'string' && r.content.length > MAX_CONTENT_CHARS) {
   530	            r.content = r.content.substring(0, MAX_CONTENT_CHARS) + '...';
   531	            r.contentTruncated = true;
   532	          }
   533	        }
   534	        // Re-estimate after content truncation
   535	        innerEnvelope.data.results = currentResults;
   536	        innerEnvelope.data.count = currentResults.length;
   537	        currentTokens = estimateTokens(JSON.stringify(innerEnvelope));
   538	
   539	        // Phase 2: Drop lowest-scored results if still over budget
   540	        while (currentResults.length > 1 && currentTokens > budgetTokens) {
   541	          // Remove the last (lowest-scored) result
   542	          const removed = currentResults.pop();
   543	          const removedTokens = estimateTokens(JSON.stringify(removed));
   544	          currentTokens -= removedTokens;
   545	        }
   546	
   547	        // Phase 3: Two-tier response — append metadata-only entries for dropped results
   548	        const droppedResults = innerResults.slice(currentResults.length);
   549	        if (droppedResults.length > 0) {
   550	          const metadataOnly = droppedResults.map((r: Record<string, unknown>) => ({
   551	            id: r.id,
   552	            title: r.title,
   553	            similarity: r.similarity,
   554	            specFolder: r.specFolder,
   555	            confidence: r.confidence,
   556	            importanceTier: r.importanceTier,
   557	            isConstitutional: r.isConstitutional,
   558	            metadataOnly: true,
   559	          }));
   560	          const metadataTokens = estimateTokens(JSON.stringify(metadataOnly));
   561	          if (currentTokens + metadataTokens <= budgetTokens) {
   562	            currentResults.push(...metadataOnly);
   563	            currentTokens += metadataTokens;
   564	          }
   565	        }
   566	
   567	        // Update the inner envelope
   568	        innerEnvelope.data.results = currentResults;
   569	        innerEnvelope.data.count = currentResults.length;
   570	        returnedResultCount = currentResults.length;
   571	
   572	        // Re-serialize
   573	        contentArr[0] = { type: 'text', text: JSON.stringify(innerEnvelope) };
   574	        (truncatedResult as Record<string, unknown>).content = contentArr;
   575	
   576	        // Recalculate actual tokens after truncation
   577	        const newSerializedTokens = estimateTokens(JSON.stringify(truncatedResult));
   578	
   579	        if (newSerializedTokens <= budgetTokens) {
   580	          return {
   581	            result: truncatedResult,
   582	            enforcement: {
   583	              budgetTokens,
   584	              actualTokens: newSerializedTokens,
   585	              enforced: true,
   586	              truncated: true,
   587	              originalResultCount,
   588	              returnedResultCount,
   589	            }
   590	          };
   591	        }
   592	
   593	        const compacted = compactStructuredResult(innerEnvelope, currentResults, contentArr);
   594	        if (compacted) {
   595	          return {
   596	            result: compacted.result,
   597	            enforcement: {
   598	              budgetTokens,
   599	              actualTokens: compacted.actualTokens,
   600	              enforced: true,
   601	              truncated: true,
   602	              originalResultCount,
   603	              returnedResultCount,
   604	            }
   605	          };
   606	        }
   607	      }
   608	    } catch {
   609	      parseFailed = true;
   610	      parseFailedInnerText = contentArr[0].text;
   611	      // JSON parse failed — fall through to structural truncation
   612	    }
   613	  }
   614	
   615	  // Fallback when parsing fails or a structured response still exceeds budget.
   616	  // Always emit valid nested JSON rather than raw character slices.
   617	  const fallbackResult = fallbackToStructuredBudget(
   618	    parseFailed ? result : truncatedResult,
   619	    parseFailedInnerText,
   620	  );
   621	
   622	  const fallbackTokens = estimateTokens(JSON.stringify(fallbackResult));
   623	
   624	  return {
   625	    result: fallbackResult,
   626	    enforcement: {
   627	      budgetTokens,
   628	      actualTokens: fallbackTokens,
   629	      enforced: true,
   630	      truncated: true,
   631	      originalResultCount,
   632	      returnedResultCount,
   633	    }
   634	  };
   635	}
   636	
   637	/* ───────────────────────────────────────────────────────────────
   638	   3. CONTEXT MODE DEFINITIONS
   639	──────────────────────────────────────────────────────────────── */
   640	
   641	const CONTEXT_MODES: Record<string, ContextMode> = {
   642	  // Auto-detect: Let the system determine the best approach
   643	  auto: {
   644	    name: 'Auto',
   645	    description: 'Automatically detect intent and route to optimal strategy',
   646	    strategy: 'adaptive'
   647	  },
   648	
   649	  // Quick: Fast trigger-based matching for reactive context
   650	  quick: {
   651	    name: 'Quick',
   652	    description: 'Fast trigger matching for real-time context (low latency)',
   653	    strategy: 'triggers',
   654	    tokenBudget: 800
   655	  },
   656	
   657	  // Deep: Comprehensive semantic search with full context
   658	  deep: {
   659	    name: 'Deep',
   660	    description: 'Semantic search with full context retrieval',
   661	    strategy: 'search',
   662	    tokenBudget: 3500
   663	  },
   664	
   665	  // Focused: Intent-specific search with optimized weights
   666	  focused: {
   667	    name: 'Focused',
   668	    description: 'Intent-aware search with task-specific optimization',
   669	    strategy: 'intent-search',
   670	    tokenBudget: 3000
   671	  },
   672	
   673	  // Resume: Session recovery mode
   674	  resume: {
   675	    name: 'Resume',
   676	    description: 'Resume previous work with state and next-steps anchors',
   677	    strategy: 'resume',
   678	    tokenBudget: 2000
   679	  }
   680	};
   681	
   682	/* ───────────────────────────────────────────────────────────────
   683	   4. INTENT-TO-MODE ROUTING
   684	──────────────────────────────────────────────────────────────── */
   685	
   686	const INTENT_TO_MODE: Record<string, string> = {
   687	  add_feature: 'deep',
   688	  fix_bug: 'focused',
   689	  refactor: 'deep',
   690	  security_audit: 'deep',
   691	  understand: 'focused',
   692	  find_spec: 'deep',
   693	  find_decision: 'focused'
   694	};
   695	
   696	/* ───────────────────────────────────────────────────────────────
   697	   5. CONTEXT STRATEGY EXECUTORS
   698	──────────────────────────────────────────────────────────────── */
   699	
   700	async function executeQuickStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
   701	  const result = await handleMemoryMatchTriggers({
   702	    prompt: input,
   703	    specFolder: options.specFolder,
   704	    tenantId: options.tenantId,
   705	    userId: options.userId,
   706	    agentId: options.agentId,
   707	    sharedSpaceId: options.sharedSpaceId,
   708	    limit: options.limit || 5,
   709	    session_id: options.sessionId,
   710	    include_cognitive: true
   711	  });
   712	
   713	  return {
   714	    strategy: 'quick',
   715	    mode: 'quick',
   716	    ...result
   717	  };
   718	}
   719	
   720	async function executeDeepStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
   721	  const result = await handleMemorySearch({
   722	    query: input,
   723	    specFolder: options.specFolder,
   724	    folderBoost: options.folderBoost,
   725	    tenantId: options.tenantId,
   726	    userId: options.userId,
   727	    agentId: options.agentId,
   728	    sharedSpaceId: options.sharedSpaceId,
   729	    limit: options.limit || 10,
   730	    includeConstitutional: true,
   731	    includeContent: options.includeContent || false,
   732	    includeTrace: options.includeTrace || false, // CHK-040
   733	    anchors: options.anchors,
   734	    sessionId: options.sessionId,
   735	    sessionTransition: options.sessionTransition,
   736	    enableDedup: options.enableDedup !== false,
   737	    profile: options.profile,
   738	    intent: intent ?? undefined,
   739	    autoDetectIntent: intent ? false : true,
   740	    useDecay: true,
   741	    // minState omitted — memoryState column not yet in schema
   742	  });
   743	
   744	  return {
   745	    strategy: 'deep',
   746	    mode: 'deep',
   747	    ...result
   748	  };
   749	}
   750	
   751	async function executeFocusedStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
   752	  const result = await handleMemorySearch({
   753	    query: input,
   754	    specFolder: options.specFolder,
   755	    folderBoost: options.folderBoost,
   756	    tenantId: options.tenantId,
   757	    userId: options.userId,
   758	    agentId: options.agentId,
   759	    sharedSpaceId: options.sharedSpaceId,
   760	    limit: options.limit || 8,
   761	    includeConstitutional: true,
   762	    includeContent: options.includeContent || false,
   763	    includeTrace: options.includeTrace || false, // CHK-040
   764	    anchors: options.anchors,
   765	    sessionId: options.sessionId,
   766	    sessionTransition: options.sessionTransition,
   767	    enableDedup: options.enableDedup !== false,
   768	    profile: options.profile,
   769	    intent: intent ?? undefined,
   770	    autoDetectIntent: intent ? false : true,
   771	    useDecay: true,
   772	    // minState omitted — memoryState column not yet in schema
   773	  });
   774	
   775	  return {
   776	    strategy: 'focused',
   777	    mode: 'focused',
   778	    intent: intent,
   779	    ...result
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
   861	}
   862	
   863	function resolveEffectiveMode(
   864	  args: ContextArgs,
   865	  session: SessionLifecycleResolution,
   866	  pressurePolicy: {
   867	    level: string;
   868	    ratio: number | null;
   869	    source: string;
   870	    warning: string | null;
   871	  },
   872	): EffectiveModeResolution {
   873	  const requestedMode = args.mode ?? 'auto';
   874	  const explicitIntent = args.intent;
   875	  const normalizedInput = args.input.trim();
   876	
   877	  let effectiveMode = requestedMode;
   878	  let detectedIntent = explicitIntent;
   879	  let intentConfidence = explicitIntent ? 1.0 : 0;
   880	  let pressureOverrideTargetMode: PressureOverrideTargetMode = null;
   881	  let pressureOverrideApplied = false;
   882	  let pressureWarning: string | null = null;
   883	  let resumeHeuristicApplied = false;
   884	
   885	  if (!detectedIntent && requestedMode !== 'quick') {
   886	    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedInput);
   887	    detectedIntent = classification.intent;
   888	    intentConfidence = classification.confidence;
   889	  }
   890	
   891	  if (requestedMode === 'auto') {
   892	    effectiveMode = INTENT_TO_MODE[detectedIntent!] || 'focused';
   893	
   894	    if (normalizedInput.length < 50 || /^(what|how|where|when|why)\s/i.test(normalizedInput)) {
   895	      effectiveMode = 'focused';
   896	    }
   897	
   898	    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
   899	    const hasResumeContext =
   900	      session.resumed ||
   901	      session.priorMode === 'resume' ||
   902	      (
   903	        Boolean(args.specFolder) &&
   904	        normalizedInput.length <= 120 &&
   905	        /\b(next(?:\s+steps?)?|status|state|blockers|where\b|left off|what changed)\b/i.test(normalizedInput)
   906	      );
   907	
   908	    if (hasResumeKeywords || hasResumeContext) {
   909	      effectiveMode = 'resume';
   910	      resumeHeuristicApplied = true;
   911	    }
   912	
   913	    const prePressureMode = effectiveMode;
   914	    if (pressurePolicy.level === 'quick') {
   915	      pressureOverrideTargetMode = 'quick';
   916	    } else if (pressurePolicy.level === 'focused') {
   917	      pressureOverrideTargetMode = 'focused';
   918	    }
   919	
   920	    if (pressureOverrideTargetMode) {
   921	      effectiveMode = pressureOverrideTargetMode;
   922	      pressureOverrideApplied = prePressureMode !== pressureOverrideTargetMode;
   923	
   924	      if (pressureOverrideApplied) {
   925	        pressureWarning = `Pressure policy override applied: ${pressurePolicy.level} pressure (${pressurePolicy.ratio}) forced mode ${pressureOverrideTargetMode} from ${prePressureMode}.`;
   926	      }
   927	    }
   928	  }
   929	
   930	  if (!CONTEXT_MODES[effectiveMode]) {
   931	    effectiveMode = 'focused';
   932	  }
   933	
   934	  return {
   935	    effectiveMode,
   936	    pressureOverrideApplied,
   937	    pressureOverrideTargetMode,
   938	    pressureWarning,
   939	    intentClassification: {
   940	      detectedIntent,
   941	      intentConfidence,
   942	      resumeHeuristicApplied,
   943	      source: explicitIntent ? 'explicit' : 'auto-detected',
   944	    },
   945	  };
   946	}
   947	
   948	function maybeDiscoverSpecFolder(options: ContextOptions, args: ContextArgs): string | undefined {
   949	  if (args.specFolder || !isFolderDiscoveryEnabled()) {
   950	    return undefined;
   951	  }
   952	
   953	  try {
   954	    const basePaths = getSpecsBasePaths();
   955	    const discoveredFolder = discoverSpecFolder(args.input.trim(), basePaths) || undefined;
   956	    if (discoveredFolder) {
   957	      (options as Record<string, unknown>).folderBoost = {
   958	        folder: discoveredFolder,
   959	        factor: parseFloat(process.env.SPECKIT_FOLDER_BOOST_FACTOR || '1.3'),
   960	      };
   961	    }
   962	    return discoveredFolder;
   963	  } catch (error: unknown) {
   964	    console.error(
   965	      '[memory-context] folder discovery failed (non-critical):',
   966	      error instanceof Error ? error.message : String(error),
   967	    );
   968	    return undefined;
   969	  }
   970	}
   971	
   972	async function executeStrategy(
   973	  effectiveMode: string,
   974	  options: ContextOptions,
   975	  args: ContextArgs,
   976	): Promise<ContextResult> {
   977	  const normalizedInput = args.input.trim();
   978	
   979	  switch (effectiveMode) {
   980	    case 'quick':
   981	      return executeQuickStrategy(normalizedInput, options);
   982	
   983	    case 'deep':
   984	      return executeDeepStrategy(normalizedInput, args.intent || null, options);
   985	
   986	    case 'resume':
   987	      return executeResumeStrategy(normalizedInput, args.intent || null, options);
   988	
   989	    case 'focused':
   990	    default:
   991	      return executeFocusedStrategy(normalizedInput, args.intent || null, options);
   992	  }
   993	}
   994	
   995	function buildResponseMeta(params: BuildResponseMetaParams): Record<string, unknown> {
   996	  const {
   997	    effectiveMode,
   998	    requestedMode,
   999	    tracedResult,
  1000	    pressurePolicy,
  1001	    pressureOverrideApplied,
  1002	    pressureOverrideTargetMode,
  1003	    pressureWarning,
  1004	    sessionLifecycle,
  1005	    effectiveBudget,
  1006	    enforcement,
  1007	    intentClassification,
  1008	    discoveredFolder,
  1009	    includeTrace,
  1010	    sessionTransition,
  1011	    structuralRoutingNudge,
  1012	  } = params;
  1013	  const { detectedIntent, intentConfidence, source } = intentClassification;
  1014	
  1015	  const telemetryMeta = retrievalTelemetry.isExtendedTelemetryEnabled()
  1016	    ? (() => {
  1017	        try {
  1018	          const t = retrievalTelemetry.createTelemetry();
  1019	          retrievalTelemetry.recordMode(
  1020	            t,
  1021	            effectiveMode,
  1022	            pressureOverrideApplied,
  1023	            pressurePolicy.level,
  1024	            pressurePolicy.ratio ?? undefined,
  1025	          );
  1026	          if (effectiveMode !== requestedMode && pressureOverrideApplied) {
  1027	            retrievalTelemetry.recordFallback(t, `pressure override: ${requestedMode} -> ${effectiveMode}`);
  1028	          }
  1029	          retrievalTelemetry.recordTransitionDiagnostics(
  1030	            t,
  1031	            includeTrace === true ? sessionTransition : undefined,
  1032	          );
  1033	          return { _telemetry: retrievalTelemetry.toJSON(t) };
  1034	        } catch (error: unknown) {
  1035	          void error;
  1036	          // Telemetry must never crash the handler
  1037	          return {};
  1038	        }
  1039	      })()
  1040	    : {};
  1041	
  1042	  return {
  1043	    layer: 'L1:Orchestration',
  1044	    mode: effectiveMode,
  1045	    requestedMode,
  1046	    strategy: tracedResult.strategy,
  1047	    tokenUsageSource: pressurePolicy.source,
  1048	    tokenUsagePressure: pressurePolicy.ratio,
  1049	    pressureLevel: pressurePolicy.level,
  1050	    pressure_level: pressurePolicy.level,
  1051	    pressurePolicy: {
  1052	      applied: pressureOverrideApplied,
  1053	      overrideMode: pressureOverrideApplied ? pressureOverrideTargetMode : null,
  1054	      warning: pressureWarning,
  1055	    },
  1056	    sessionLifecycle,
  1057	    tokenBudget: effectiveBudget,
  1058	    tokenBudgetEnforcement: enforcement,
  1059	    intent: detectedIntent ? {
  1060	      type: detectedIntent,
  1061	      confidence: intentConfidence,
  1062	      source,
  1063	    } : null,
  1064	    folderDiscovery: discoveredFolder ? {
  1065	      discovered: true,
  1066	      specFolder: discoveredFolder,
  1067	      source: 'folder-discovery',
  1068	    } : null,
  1069	    structuralRoutingNudge,
  1070	    ...telemetryMeta,
  1071	  };
  1072	}
  1073	
  1074	/* ───────────────────────────────────────────────────────────────
  1075	   7. MAIN HANDLER
  1076	──────────────────────────────────────────────────────────────── */
  1077	
  1078	/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
  1079	 * @param args - Context retrieval arguments (intent, mode, specFolder, anchors, etc.)
  1080	 * @returns MCP response with context-aware memory results
  1081	 */
  1082	async function handleMemoryContext(args: ContextArgs): Promise<MCPResponse> {
  1083	  const _contextStartTime = Date.now();
  1084	  const requestId = randomUUID();
  1085	
  1086	  try {
  1087	  try {
  1088	    await checkDatabaseUpdated();
  1089	  } catch (error: unknown) {
  1090	    const message = error instanceof Error ? error.message : String(error);
  1091	    return createMCPErrorResponse({
  1092	      tool: 'memory_context',
  1093	      error: `Database state check failed: ${message}`,
  1094	      code: 'E_INTERNAL',
  1095	      details: { requestId, layer: 'L1:Orchestration' },
  1096	      recovery: {
  1097	        hint: 'The memory database may be unavailable. Retry or check database connectivity.',
  1098	      },
  1099	    });
  1100	  }
  1101	
  1102	  const {
  1103	    input,
  1104	    mode: requested_mode = 'auto',
  1105	    intent: explicit_intent,
  1106	    specFolder: spec_folder,
  1107	    limit,
  1108	    enableDedup: enableDedup = true,
  1109	    includeContent: include_content = false,
  1110	    tokenUsage,
  1111	    anchors
  1112	  } = args;
  1113	
  1114	  // Validate input
  1115	  if (!input || typeof input !== 'string' || input.trim().length === 0) {
  1116	    return createMCPErrorResponse({
  1117	      tool: 'memory_context',
  1118	      error: 'Input is required and must be a non-empty string',
  1119	      code: 'E_VALIDATION',
  1120	      details: { requestId, layer: 'L1:Orchestration' },
  1121	      recovery: {
  1122	        hint: 'Provide a query, prompt, or context description'
  1123	      }
  1124	    });
  1125	  }
  1126	
  1127	  const normalizedInput = input.trim();
  1128	
  1129	  // ── Phase 020: Query-Intent Routing ──────────────────────────
  1130	  // Classify query intent and optionally augment response with code
  1131	  // graph context for structural/hybrid queries. Entire block is
  1132	  // wrapped in try/catch — any failure silently falls through to
  1133	  // existing semantic logic.
  1134	  let queryIntentMetadata: {
  1135	    queryIntent: string;
  1136	    routedBackend: string;
  1137	    confidence: number;
  1138	    matchedKeywords?: string[];
  1139	  } | null = null;
  1140	  let graphContextResult: Record<string, unknown> | null = null;
  1141	
  1142	  if (requested_mode !== 'resume') {
  1143	    try {
  1144	      const classification = classifyQueryIntent(normalizedInput);
  1145	      queryIntentMetadata = {
  1146	        queryIntent: classification.intent,
  1147	        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
  1148	          ? 'structural'
  1149	          : classification.intent === 'hybrid'
  1150	            ? 'hybrid'
  1151	            : 'semantic',
  1152	        confidence: classification.confidence,
  1153	        matchedKeywords: classification.matchedKeywords,
  1154	      };
  1155	
  1156	      // F050: Extract a symbol-like token from the query instead of passing
  1157	      // raw prose to buildContext({ subject }). resolveSubjectToRef() matches
  1158	      // against code_nodes.name / fq_name, so prose never resolves.
  1159	      // Heuristic: pick the first token that looks like a code identifier
  1160	      // (contains uppercase, underscore, or dot — e.g. "buildContext", "fq_name",
  1161	      // "code-graph-db.ts"). Falls back to first matched keyword, then normalizedInput.
  1162	      const codeIdentifierPattern = /[A-Z_.]|^[a-z]+[A-Z]/;
  1163	      const inputTokens = normalizedInput.split(/\s+/).filter(t => t.length >= 2);
  1164	      const extractedSubject =
  1165	        inputTokens.find(t => codeIdentifierPattern.test(t)) ??
  1166	        (classification.matchedKeywords?.[0]) ??
  1167	        normalizedInput;
  1168	
  1169	      if (classification.intent === 'structural' && classification.confidence > 0.65) {
  1170	        try {
  1171	          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
  1172	          if (cgResult.metadata.totalNodes > 0) {
  1173	            graphContextResult = {
  1174	              graphContext: cgResult.graphContext,
  1175	              textBrief: cgResult.textBrief,
  1176	              combinedSummary: cgResult.combinedSummary,
  1177	              nextActions: cgResult.nextActions,
  1178	              metadata: cgResult.metadata,
  1179	            };
  1180	          }
  1181	        } catch {
  1182	          // Code graph unavailable — fall through to semantic
  1183	        }
  1184	      } else if (classification.intent === 'hybrid') {
  1185	        try {
  1186	          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
  1187	          if (cgResult.metadata.totalNodes > 0) {
  1188	            graphContextResult = {
  1189	              graphContext: cgResult.graphContext,
  1190	              textBrief: cgResult.textBrief,
  1191	              combinedSummary: cgResult.combinedSummary,
  1192	              nextActions: cgResult.nextActions,
  1193	              metadata: cgResult.metadata,
  1194	            };
  1195	          }
  1196	        } catch {
  1197	          // Code graph unavailable — hybrid degrades to semantic-only
  1198	        }
  1199	      }
  1200	      // 'semantic' or low-confidence: no graph context, fall through
  1201	    } catch {
  1202	      // Classification failed — fall through to existing logic entirely
  1203	    }
  1204	  }
  1205	
  1206	  // Eval logger — capture context query at entry (fail-safe)
  1207	  let _evalQueryId = 0;
  1208	  let _evalRunId = 0;
  1209	  try {
  1210	    const evalEntry = logSearchQuery({
  1211	      query: normalizedInput,
  1212	      intent: explicit_intent ?? null,
  1213	      specFolder: spec_folder ?? null,
  1214	    });
  1215	    _evalQueryId = evalEntry.queryId;
  1216	    _evalRunId = evalEntry.evalRunId;
  1217	  } catch {
  1218	    // Intentional no-op — error deliberately discarded
  1219	  }
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
  1456	  }
  1457	  if (queryIntentMetadata) {
  1458	    responseData.queryIntentRouting = queryIntentMetadata;
  1459	  }
  1460	  const structuralRoutingNudge = buildStructuralRoutingNudge(
  1461	    normalizedInput,
  1462	    queryIntentMetadata,
  1463	    graphContextResult,
  1464	  );
  1465	  if (structuralRoutingNudge) {
  1466	    responseData.structuralRoutingNudge = structuralRoutingNudge;
  1467	  }
  1468	
  1469	  // Build response with layer metadata
  1470	  const _contextResponse = createMCPResponse({
  1471	    tool: 'memory_context',
  1472	    summary: enforcement.truncated
  1473	      ? `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy) [truncated${enforcement.originalResultCount !== undefined ? `: ${enforcement.originalResultCount} → ${enforcement.returnedResultCount} results` : ''} to fit ${effectiveBudget} token budget]`
  1474	      : `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy)`,
  1475	    data: responseData,
  1476	    hints: [
  1477	      `Mode: ${CONTEXT_MODES[effectiveMode].description}`,
  1478	      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
  1479	      `Token budget: ${effectiveBudget} (${effectiveMode} mode)`,
  1480	      ...(structuralRoutingNudge ? [structuralRoutingNudge.message] : []),
  1481	      ...(pressureWarning ? [pressureWarning] : [])
  1482	    ],
  1483	    extraMeta: buildResponseMeta({
  1484	      effectiveMode,
  1485	      requestedMode: requested_mode,
  1486	      tracedResult,
  1487	      pressurePolicy,
  1488	      pressureOverrideApplied,
  1489	      pressureOverrideTargetMode,
  1490	      pressureWarning,
  1491	      sessionLifecycle,
  1492	      effectiveBudget,
  1493	      enforcement,
  1494	      intentClassification: {
  1495	        detectedIntent,
  1496	        intentConfidence,
  1497	        resumeHeuristicApplied,
  1498	        source: intentSource,
  1499	      },
  1500	      discoveredFolder,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '730,810p;860,930p;1045,1110p;1788,1805p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   730	      activeCount: success,
   731	      staleCount: pending + failed + retry,
   732	    };
   733	  } catch (_error: unknown) {
   734	    return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
   735	  }
   736	}
   737	
   738	// (CHK-076): Instructions are computed once at startup and NOT refreshed during the session.
   739	// This is by design — instruction updates require MCP protocol re-negotiation which most clients
   740	// Don't support. If index changes significantly, restart the server to refresh instructions.
   741	async function buildServerInstructions(): Promise<string> {
   742	  if (!isDynamicInitEnabled()) {
   743	    return '';
   744	  }
   745	
   746	  const stats = await getMemoryStats();
   747	  const channels: string[] = ['vector', 'fts5'];
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
   791	  try {
   792	    const { getSessionSnapshot: getSnap } = await import('./lib/session/session-snapshot.js');
   793	    const snap = getSnap();
   794	    const routingRules: string[] = [];
   795	    if (snap.cocoIndexAvailable) {
   796	      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
   797	    }
   798	    if (snap.graphFreshness === 'fresh' || snap.graphFreshness === 'stale') {
   799	      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
   800	    }
   801	    routingRules.push('Exact text/regex matching → Grep tool');
   802	    if (routingRules.length > 0) {
   803	      lines.push('');
   804	      lines.push('## Tool Routing');
   805	      for (const rule of routingRules) {
   806	        lines.push(`- ${rule}`);
   807	      }
   808	    }
   809	  } catch { /* tool routing snapshot unavailable — skip */ }
   810	
   860	server.setRequestHandler(CallToolRequestSchema, async (request, _extra: unknown): Promise<any> => {
   861	  const requestParams = request.params as { name: string; arguments?: Record<string, unknown> };
   862	  const { name } = requestParams;
   863	  const args: Record<string, unknown> = requestParams.arguments ?? {};
   864	  const callId = resolveToolCallId(request as { id?: unknown });
   865	  const sessionTrackingId = resolveSessionTrackingId(args, _extra);
   866	  if (sessionTrackingId) lastKnownSessionId = sessionTrackingId;
   867	
   868	  try {
   869	    // SEC-003: Validate input lengths before processing (CWE-400 mitigation)
   870	    validateInputLengths(args);
   871	    // T304: Zod validation is applied per-tool inside each dispatch module
   872	    // (tools/*.ts) to avoid double-validation overhead at the server layer.
   873	
   874	    // T018: Track last tool call timestamp for all tools except session_health.
   875	    if (name !== 'session_health') {
   876	      recordToolCall(sessionTrackingId);
   877	
   878	      // Phase 023: Record metric event for context quality tracking
   879	      recordMetricEvent({ kind: 'tool_call', toolName: name });
   880	    }
   881	    // Classify specific tool calls for finer-grained metrics
   882	    if (name === 'memory_context' && args.mode === 'resume') {
   883	      recordMetricEvent({ kind: 'memory_recovery' });
   884	    }
   885	    if (name.startsWith('code_graph_')) {
   886	      recordMetricEvent({ kind: 'code_graph_query' });
   887	    }
   888	    if (typeof args.specFolder === 'string' && args.specFolder) {
   889	      recordMetricEvent({ kind: 'spec_folder_change', specFolder: args.specFolder as string });
   890	    }
   891	
   892	    const dbReinitialized = await checkDatabaseUpdated();
   893	    if (dbReinitialized) {
   894	      await invalidateReinitializedDbCaches();
   895	    }
   896	
   897	    let sessionPrimeContext: AutoSurfaceResult | null = null;
   898	    try {
   899	      sessionPrimeContext = await primeSessionIfNeeded(
   900	        name,
   901	        args,
   902	        sessionTrackingId,
   903	      );
   904	    } catch (primeErr: unknown) {
   905	      const msg = primeErr instanceof Error ? primeErr.message : String(primeErr);
   906	      console.error(`[context-server] Session priming failed (non-fatal): ${msg}`);
   907	    }
   908	
   909	    // SK-004/TM-05: Auto-surface memories before dispatch (after validation)
   910	    let autoSurfacedContext: AutoSurfaceResult | null = null;
   911	    const isCompactionLifecycleCall =
   912	      name === 'memory_context' && args.mode === 'resume';
   913	
   914	    const autoSurfaceStart = Date.now();
   915	    if (MEMORY_AWARE_TOOLS.has(name)) {
   916	      const contextHint: string | null = extractContextHint(args);
   917	      if (contextHint) {
   918	        try {
   919	          if (isCompactionLifecycleCall) {
   920	            autoSurfacedContext = await autoSurfaceAtCompaction(contextHint);
   921	          } else {
   922	            autoSurfacedContext = await autoSurfaceMemories(contextHint);
   923	          }
   924	        } catch (surfaceErr: unknown) {
   925	          const msg = surfaceErr instanceof Error ? surfaceErr.message : String(surfaceErr);
   926	          console.error(`[context-server] Auto-surface failed (non-fatal): ${msg}`);
   927	        }
   928	      }
   929	    } else {
   930	      try {
  1045	    // SK-004: Inject auto-surface hints before token-budget enforcement so
  1046	    // The final envelope metadata reflects the fully decorated response.
  1047	    if (autoSurfacedContext && result && !result.isError) {
  1048	      appendAutoSurfaceHints(result, autoSurfacedContext);
  1049	    }
  1050	
  1051	    // Token Budget Hybrid: Inject tokenBudget into response metadata (CHK-072)
  1052	    // T205: Enforce per-layer token budgets with actual truncation
  1053	    if (result && result.content && result.content[0]?.text) {
  1054	      try {
  1055	        const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
  1056	        if (envelope && typeof envelope === 'object' && !Array.isArray(envelope)) {
  1057	          const metaValue = envelope.meta;
  1058	          const meta = isRecord(metaValue)
  1059	            ? metaValue as Record<string, unknown>
  1060	            : {};
  1061	          const dataValue = envelope.data;
  1062	          const data = isRecord(dataValue)
  1063	            ? dataValue as Record<string, unknown>
  1064	            : null;
  1065	          envelope.meta = meta;
  1066	          if (sessionPrimeContext && !result.isError) {
  1067	            injectSessionPrimeHints(envelope, meta, sessionPrimeContext);
  1068	          }
  1069	          if (autoSurfacedContext && !result.isError) {
  1070	            meta.autoSurfacedContext = autoSurfacedContext;
  1071	          }
  1072	          if (dispatchGraphContext && !result.isError) {
  1073	            meta.graphContext = dispatchGraphContext;
  1074	          }
  1075	          const budget = getTokenBudget(name);
  1076	          meta.tokenBudget = budget;
  1077	          syncEnvelopeTokenCount(envelope);
  1078	
  1079	          if (typeof meta.tokenCount === 'number' && meta.tokenCount > budget) {
  1080	            console.error(`[token-budget] ${name} response (${meta.tokenCount} tokens) exceeds budget (${budget})`);
  1081	
  1082	            // T205: Attempt to truncate results array to fit within budget
  1083	            const innerResults = data?.results;
  1084	            if (Array.isArray(innerResults) && innerResults.length > 1) {
  1085	              const originalCount = innerResults.length;
  1086	              // Results are typically sorted by score (highest first)
  1087	              // Remove from end (lowest-scored) until within budget
  1088	              while (innerResults.length > 1) {
  1089	                innerResults.pop();
  1090	                // P1-06 FIX: Recalculate token count from the full envelope
  1091	                // (not just results) so trace metadata is included in the budget.
  1092	                syncEnvelopeTokenCount(envelope);
  1093	                if (typeof meta.tokenCount === 'number' && meta.tokenCount <= budget) break;
  1094	              }
  1095	              if (data && data.count !== undefined) {
  1096	                data.count = innerResults.length;
  1097	              }
  1098	              if (Array.isArray(envelope.hints)) {
  1099	                envelope.hints.push(`Token budget enforced: truncated ${originalCount} → ${innerResults.length} results to fit ${budget} token budget`);
  1100	              }
  1101	              meta.tokenBudgetTruncated = true;
  1102	              meta.originalResultCount = originalCount;
  1103	              meta.returnedResultCount = innerResults.length;
  1104	            } else {
  1105	              // No truncatable results array — add warning hint only
  1106	              if (Array.isArray(envelope.hints)) {
  1107	                envelope.hints.push(`Response exceeds token budget (${meta.tokenCount}/${budget})`);
  1108	              }
  1109	            }
  1110	          }
  1788	
  1789	    // T001-T004: Session deduplication module
  1790	    try {
  1791	      const sessionResult = sessionManager.init(database);
  1792	      if (sessionResult.success) {
  1793	        console.error(`[context-server] Session manager initialized (enabled: ${sessionManager.isEnabled()})`);
  1794	
  1795	        // T073-T075: Crash Recovery Pattern (REQ-016)
  1796	        // Reset any sessions that were active when server last crashed
  1797	        const recoveryResult = sessionManager.resetInterruptedSessions();
  1798	        if (recoveryResult.interruptedCount > 0) {
  1799	          console.error(`[context-server] Crash recovery: marked ${recoveryResult.interruptedCount} sessions as interrupted`);
  1800	          // Log interrupted sessions for visibility
  1801	          const interrupted = sessionManager.getInterruptedSessions();
  1802	          if (interrupted.sessions && interrupted.sessions.length > 0) {
  1803	            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
  1804	          }
  1805	        }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '60,130p;300,390p;500,545p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    60	// ───────────────────────────────────────────────────────────────
    61	const HELP_TEXT = `
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
    91	  - When a spec folder is passed on the CLI, that explicit target is authoritative.
    92	  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    93	    but they must not reroute the save to another folder.
    94	
    95	JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
    96	  {
    97	    "user_prompts": [...],
    98	    "observations": [...],
    99	    "recent_context": [...],
   100	    "toolCalls": [
   101	      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
   102	      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
   103	    ],
   104	    "exchanges": [
   105	      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
   106	    ],
   107	    "preflight": {
   108	      "knowledgeScore": 40,
   109	      "uncertaintyScore": 60,
   110	      "contextScore": 50,
   111	      "timestamp": "ISO-8601",
   112	      "gaps": ["gap1", "gap2"],
   113	      "confidence": 45,
   114	      "readiness": "Needs research"
   115	    },
   116	    "postflight": {
   117	      "knowledgeScore": 75,
   118	      "uncertaintyScore": 25,
   119	      "contextScore": 80,
   120	      "gapsClosed": ["gap1"],
   121	      "newGaps": ["new-gap"]
   122	    }
   123	  }
   124	
   125	  Tool/Exchange enrichment fields (all optional — JSON-mode only):
   126	  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
   127	  - exchanges[]: Key user-assistant exchanges with timestamps
   128	  - These provide richer context than DB extraction since the AI filters noise at source
   129	
   130	  Learning Delta Calculation:
   300	function parseStructuredJson(rawJson, sourceLabel) {
   301	    if (rawJson.trim().length === 0) {
   302	        throw new Error(`${sourceLabel} requires a non-empty JSON object`);
   303	    }
   304	    let parsed;
   305	    try {
   306	        parsed = JSON.parse(rawJson);
   307	    }
   308	    catch (error) {
   309	        const errMsg = error instanceof Error ? error.message : String(error);
   310	        throw new Error(`Invalid JSON provided via ${sourceLabel}: ${errMsg}`);
   311	    }
   312	    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
   313	        throw new Error(`${sourceLabel} requires a JSON object payload`);
   314	    }
   315	    return parsed;
   316	}
   317	async function parseStructuredModeArguments(mode, args, stdinReader) {
   318	    if (mode === '--stdin' && process.stdin.isTTY) {
   319	        console.error('--stdin requires piped input');
   320	        process.exit(1);
   321	    }
   322	    const rawJson = mode === '--stdin'
   323	        ? await stdinReader()
   324	        : args[1];
   325	    if (mode === '--json' && rawJson === undefined) {
   326	        throw new Error('--json requires an inline JSON string argument');
   327	    }
   328	    // Validation: empty --json is a user error, not a crash
   329	    if (mode === '--json' && (rawJson === undefined || rawJson.trim().length === 0)) {
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
   346	            ...payload,
   347	            _source: 'file',
   348	        },
   349	        sessionId: null,
   350	    };
   351	}
   352	// ───────────────────────────────────────────────────────────────
   353	// 5. CLI ARGUMENT PARSING
   354	// ───────────────────────────────────────────────────────────────
   355	async function parseArguments(argv = process.argv.slice(2), stdinReader = readAllStdin) {
   356	    // Extract --session-id <uuid> from argv before positional parsing
   357	    let sessionId = null;
   358	    const filteredArgv = [];
   359	    for (let i = 0; i < argv.length; i++) {
   360	        if (argv[i] === '--session-id') {
   361	            const candidate = argv[i + 1];
   362	            if (!candidate || candidate.startsWith('--') || candidate.trim().length === 0) {
   363	                throw new Error('--session-id requires a non-empty value');
   364	            }
   365	            sessionId = candidate.trim();
   366	            i++; // skip the value
   367	            continue;
   368	        }
   369	        filteredArgv.push(argv[i]);
   370	    }
   371	    const [primaryArg, secondaryArg] = filteredArgv;
   372	    if (!primaryArg) {
   373	        return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
   374	    }
   375	    if (primaryArg === '--stdin' || primaryArg === '--json') {
   376	        const structured = await parseStructuredModeArguments(primaryArg, filteredArgv, stdinReader);
   377	        return { ...structured, sessionId };
   378	    }
   379	    const resolvedSpecFolder = resolveCliSpecFolderReference(primaryArg);
   380	    if (resolvedSpecFolder) {
   381	        throw new Error('Direct spec folder mode is no longer supported. ' +
   382	            'Use structured JSON via --json, --stdin, or a JSON temp file.');
   383	    }
   384	    return {
   385	        dataFile: primaryArg,
   386	        specFolderArg: secondaryArg || null,
   387	        collectedData: null,
   388	        sessionId,
   389	    };
   390	}
   500	    console.error('Starting memory skill...\n');
   501	    try {
   502	        const parsed = await parseArguments(argv, stdinReader);
   503	        core_1.CONFIG.DATA_FILE = parsed.dataFile;
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
   517	    catch (error) {
   518	        const errMsg = error instanceof Error ? error.message : String(error);
   519	        const isExpected = /Spec folder not found|No spec folders|specs\/ directory|retry attempts|Expected|Invalid JSON provided|requires a target spec folder|requires an inline JSON string|required a non-empty JSON object|JSON object payload|no longer supported|session-id requires/.test(errMsg);
   520	        if (isExpected) {
   521	            console.error(`\nError: ${errMsg}`);
   522	        }
   523	        else {
   524	            console.error('Unexpected Error:', errMsg);
   525	            if (error instanceof Error) {
   526	                console.error(error.stack);
   527	            }
   528	        }
   529	        process.exit(1);
   530	    }
   531	}
   532	// ───────────────────────────────────────────────────────────────
   533	// 7. EXPORTS
   534	// ───────────────────────────────────────────────────────────────
   535	if (require.main === module) {
   536	    installSignalHandlers();
   537	    main().catch((error) => {
   538	        const errMsg = error instanceof Error ? error.message : String(error);
   539	        console.error(`Fatal error: ${errMsg}`);
   540	        if (error instanceof Error) {
   541	            console.error(error.stack);
   542	        }
   543	        process.exit(1);
   544	    });
   545	}

exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '1,220p;280,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Spec Kit Compact Code Graph OpenCode Plugin                              ║
     3	// ╚══════════════════════════════════════════════════════════════════════════╝
     4	'use strict';
     5	
     6	// ─────────────────────────────────────────────────────────────────────────────
     7	// 1. OVERVIEW
     8	// ─────────────────────────────────────────────────────────────────────────────
     9	// Thin OpenCode plugin hook layer for packet 030.
    10	// Important runtime boundary: never import the MCP server bundle directly
    11	// inside the OpenCode host process because its native modules (better-sqlite3,
    12	// sqlite-vec) may be compiled for a different Node ABI than the host runtime.
    13	// Instead, call a plain `node` bridge process that loads the server bundle in
    14	// the user's normal Node environment and returns the transport plan as JSON.
    15	
    16	// ─────────────────────────────────────────────────────────────────────────────
    17	// 2. IMPORTS
    18	// ─────────────────────────────────────────────────────────────────────────────
    19	
    20	import { randomUUID } from 'node:crypto';
    21	import { execFile } from 'node:child_process';
    22	import { fileURLToPath } from 'node:url';
    23	
    24	import { tool } from '@opencode-ai/plugin';
    25	import {
    26	  createSyntheticTextPart,
    27	  hasUnsafeMessageTransformParts,
    28	  hasSyntheticTextPartMarker,
    29	  isMessageAnchorLike,
    30	} from './spec-kit-opencode-message-schema.mjs';
    31	
    32	// ─────────────────────────────────────────────────────────────────────────────
    33	// 3. CONSTANTS AND TYPES
    34	// ─────────────────────────────────────────────────────────────────────────────
    35	
    36	const PLUGIN_ID = 'spec-kit-compact-code-graph';
    37	const DEFAULT_CACHE_TTL_MS = 5000;
    38	const DEFAULT_BRIDGE_TIMEOUT_MS = 15000;
    39	const DEFAULT_NODE_BINARY = 'node';
    40	const RESUME_MODE = 'minimal';
    41	const MESSAGES_TRANSFORM_ENABLED = true;
    42	const MESSAGES_TRANSFORM_MODE = 'schema_aligned';
    43	const SYNTHETIC_METADATA_KEY = 'specKitCompactCodeGraph';
    44	const BRIDGE_PATH = fileURLToPath(new URL('./spec-kit-compact-code-graph-bridge.mjs', import.meta.url));
    45	
    46	/**
    47	 * @typedef {{
    48	 *   cacheTtlMs?: number,
    49	 *   specFolder?: string,
    50	 *   nodeBinary?: string,
    51	 *   bridgeTimeoutMs?: number,
    52	 * }} PluginOptions
    53	 */
    54	
    55	/**
    56	 * @typedef {{
    57	 *   hook: string,
    58	 *   title: string,
    59	 *   payloadKind: string,
    60	 *   dedupeKey: string,
    61	 *   content: string,
    62	 * }} TransportBlock
    63	 */
    64	
    65	/**
    66	 * @typedef {{
    67	 *   interfaceVersion: string,
    68	 *   transportOnly: true,
    69	 *   retrievalPolicyOwner: string,
    70	 *   event: {
    71	 *     hook: string,
    72	 *     trackedPayloadKinds: string[],
    73	 *     summary: string,
    74	 *   },
    75	 *   systemTransform?: TransportBlock,
    76	 *   messagesTransform: TransportBlock[],
    77	 *   compaction?: TransportBlock,
    78	 * }} TransportPlan
    79	 */
    80	
    81	// ─────────────────────────────────────────────────────────────────────────────
    82	// 4. MODULE STATE
    83	// ─────────────────────────────────────────────────────────────────────────────
    84	
    85	const transportCache = new Map();
    86	let runtimeReady = false;
    87	let lastRuntimeError = null;
    88	
    89	// ─────────────────────────────────────────────────────────────────────────────
    90	// 5. HELPERS
    91	// ─────────────────────────────────────────────────────────────────────────────
    92	
    93	function normalizePositiveInt(value, fallback) {
    94	  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
    95	}
    96	
    97	function normalizeOptions(rawOptions) {
    98	  if (!rawOptions || typeof rawOptions !== 'object') {
    99	    return {
   100	      cacheTtlMs: DEFAULT_CACHE_TTL_MS,
   101	      specFolder: undefined,
   102	      nodeBinary: process.env.SPEC_KIT_PLUGIN_NODE_BINARY || DEFAULT_NODE_BINARY,
   103	      bridgeTimeoutMs: DEFAULT_BRIDGE_TIMEOUT_MS,
   104	    };
   105	  }
   106	
   107	  const options = /** @type {PluginOptions} */ (rawOptions);
   108	  return {
   109	    cacheTtlMs: normalizePositiveInt(options.cacheTtlMs, DEFAULT_CACHE_TTL_MS),
   110	    specFolder: typeof options.specFolder === 'string' && options.specFolder.trim()
   111	      ? options.specFolder.trim()
   112	      : undefined,
   113	    nodeBinary: typeof options.nodeBinary === 'string' && options.nodeBinary.trim()
   114	      ? options.nodeBinary.trim()
   115	      : (process.env.SPEC_KIT_PLUGIN_NODE_BINARY || DEFAULT_NODE_BINARY),
   116	    bridgeTimeoutMs: normalizePositiveInt(options.bridgeTimeoutMs, DEFAULT_BRIDGE_TIMEOUT_MS),
   117	  };
   118	}
   119	
   120	function cacheKeyForSession(sessionID, specFolder) {
   121	  return `${specFolder ?? '__workspace__'}::${sessionID ?? '__global__'}`;
   122	}
   123	
   124	function parseTransportPlan(responseText) {
   125	  if (!responseText) {
   126	    return null;
   127	  }
   128	
   129	  try {
   130	    const parsed = JSON.parse(responseText);
   131	    const data = parsed?.data ?? parsed;
   132	    const plan = data?.opencodeTransport;
   133	    if (!plan || typeof plan !== 'object') {
   134	      return null;
   135	    }
   136	    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
   137	      return null;
   138	    }
   139	    return /** @type {TransportPlan} */ (plan);
   140	  } catch {
   141	    return null;
   142	  }
   143	}
   144	
   145	function stringifyError(error) {
   146	  if (!error) {
   147	    return 'Unknown bridge error';
   148	  }
   149	  if (error instanceof Error) {
   150	    return error.message;
   151	  }
   152	  return String(error);
   153	}
   154	
   155	function execFilePromise(file, args, options) {
   156	  return new Promise((resolve, reject) => {
   157	    execFile(file, args, options, (error, stdout, stderr) => {
   158	      if (error) {
   159	        reject(error);
   160	        return;
   161	      }
   162	      resolve({
   163	        stdout: typeof stdout === 'string' ? stdout : '',
   164	        stderr: typeof stderr === 'string' ? stderr : '',
   165	      });
   166	    });
   167	  });
   168	}
   169	
   170	async function runTransportBridge({ projectDir, specFolder, nodeBinary, bridgeTimeoutMs }) {
   171	  const args = [BRIDGE_PATH, '--minimal'];
   172	  if (specFolder) {
   173	    args.push('--spec-folder', specFolder);
   174	  }
   175	
   176	  const result = await execFilePromise(nodeBinary, args, {
   177	    cwd: projectDir,
   178	    env: process.env,
   179	    timeout: bridgeTimeoutMs,
   180	    maxBuffer: 1024 * 1024,
   181	  });
   182	  return parseTransportPlan(result.stdout.trim());
   183	}
   184	
   185	async function loadTransportPlan({ projectDir, sessionID, specFolder, cacheTtlMs, nodeBinary, bridgeTimeoutMs }) {
   186	  const key = cacheKeyForSession(sessionID, specFolder);
   187	  const now = Date.now();
   188	  const cached = transportCache.get(key);
   189	
   190	  if (cached && cached.expiresAt > now) {
   191	    return cached.plan;
   192	  }
   193	
   194	  try {
   195	    const plan = await runTransportBridge({
   196	      projectDir,
   197	      specFolder,
   198	      nodeBinary,
   199	      bridgeTimeoutMs,
   200	    });
   201	
   202	    if (!plan) {
   203	      lastRuntimeError = 'Bridge returned no OpenCode transport payload';
   204	      runtimeReady = false;
   205	      transportCache.delete(key);
   206	      return null;
   207	    }
   208	
   209	    runtimeReady = true;
   210	    lastRuntimeError = null;
   211	    transportCache.set(key, {
   212	      plan,
   213	      expiresAt: now + cacheTtlMs,
   214	      updatedAt: new Date(now).toISOString(),
   215	    });
   216	    return plan;
   217	  } catch (error) {
   218	    runtimeReady = false;
   219	    lastRuntimeError = stringifyError(error);
   220	    transportCache.delete(key);
   280	 * @param {PluginOptions | undefined} rawOptions - Optional plugin overrides.
   281	 * @returns {Promise<object>} Hook and tool registrations consumed by OpenCode.
   282	 */
   283	export default async function SpecKitCompactCodeGraphPlugin(ctx, rawOptions) {
   284	  const options = normalizeOptions(rawOptions);
   285	  const projectDir = ctx?.directory || process.cwd();
   286	
   287	  return {
   288	    event: async ({ event }) => {
   289	      if (!shouldInvalidateEvent(event?.type)) {
   290	        return;
   291	      }
   292	      invalidateTransportCache(extractEventSessionID(event), options.specFolder);
   293	    },
   294	
   295	    tool: {
   296	      spec_kit_compact_code_graph_status: tool({
   297	        description: 'Show Spec Kit compact code graph plugin cache status',
   298	        args: {},
   299	        async execute() {
   300	          const entries = [...transportCache.entries()]
   301	            .map(([key, value]) => `${key} expires=${new Date(value.expiresAt).toISOString()}`)
   302	            .join('\n');
   303	
   304	          return [
   305	            `plugin_id=${PLUGIN_ID}`,
   306	            `cache_ttl_ms=${options.cacheTtlMs}`,
   307	            `spec_folder=${options.specFolder ?? 'auto'}`,
   308	            `resume_mode=${RESUME_MODE}`,
   309	            `messages_transform_enabled=${MESSAGES_TRANSFORM_ENABLED}`,
   310	            `messages_transform_mode=${MESSAGES_TRANSFORM_MODE}`,
   311	            `runtime_ready=${runtimeReady}`,
   312	            `node_binary=${options.nodeBinary}`,
   313	            `bridge_timeout_ms=${options.bridgeTimeoutMs}`,
   314	            `bridge_path=${BRIDGE_PATH}`,
   315	            `last_runtime_error=${lastRuntimeError ?? 'none'}`,
   316	            `cache_entries=${transportCache.size}`,
   317	            entries || 'cache=empty',
   318	          ].join('\n');
   319	        },
   320	      }),
   321	    },
   322	
   323	    'experimental.chat.system.transform': async (input, output) => {
   324	      const plan = await loadTransportPlan({
   325	        projectDir,
   326	        sessionID: input.sessionID,
   327	        specFolder: options.specFolder,
   328	        cacheTtlMs: options.cacheTtlMs,
   329	        nodeBinary: options.nodeBinary,
   330	        bridgeTimeoutMs: options.bridgeTimeoutMs,
   331	      });
   332	
   333	      const block = plan?.systemTransform;
   334	      if (!block) {
   335	        return;
   336	      }
   337	
   338	      const rendered = `${block.title}\n${block.content}`;
   339	      if (output.system.some((entry) => entry.includes(rendered))) {
   340	        return;
   341	      }
   342	
   343	      output.system.push(rendered);
   344	    },
   345	
   346	    'experimental.chat.messages.transform': async (_input, output) => {
   347	      if (!MESSAGES_TRANSFORM_ENABLED) {
   348	        return;
   349	      }
   350	
   351	      const anchor = output.messages.at(-1);
   352	      if (!isMessageAnchorLike(anchor)) {
   353	        return;
   354	      }
   355	
   356	      if (hasUnsafeMessageTransformParts(anchor.parts)) {
   357	        return;
   358	      }
   359	
   360	      const plan = await loadTransportPlan({
   361	        projectDir,
   362	        sessionID: anchor.info.sessionID,
   363	        specFolder: options.specFolder,
   364	        cacheTtlMs: options.cacheTtlMs,
   365	        nodeBinary: options.nodeBinary,
   366	        bridgeTimeoutMs: options.bridgeTimeoutMs,
   367	      });
   368	
   369	      if (!plan || plan.messagesTransform.length === 0) {
   370	        return;
   371	      }
   372	
   373	      for (const block of plan.messagesTransform) {
   374	        if (hasSyntheticTextPartMarker(anchor.parts, SYNTHETIC_METADATA_KEY, block.dedupeKey)) {
   375	          continue;
   376	        }
   377	
   378	        const part = createSyntheticTextPart({
   379	          id: `${PLUGIN_ID}-${randomUUID().replace(/-/g, '').slice(0, 12)}`,
   380	          sessionID: anchor.info.sessionID,
   381	          messageID: anchor.info.id,
   382	          text: `${block.title}\n${block.content}`,
   383	          metadata: {
   384	            [SYNTHETIC_METADATA_KEY]: block.dedupeKey,
   385	          },
   386	        });
   387	
   388	        if (!part) {
   389	          continue;
   390	        }
   391	
   392	        anchor.parts.push(part);
   393	      }
   394	    },
   395	
   396	    'experimental.session.compacting': async (input, output) => {
   397	      const plan = await loadTransportPlan({
   398	        projectDir,
   399	        sessionID: input.sessionID,
   400	        specFolder: options.specFolder,
   401	        cacheTtlMs: options.cacheTtlMs,
   402	        nodeBinary: options.nodeBinary,
   403	        bridgeTimeoutMs: options.bridgeTimeoutMs,
   404	      });
   405	
   406	      const block = plan?.compaction;
   407	      if (!block) {
   408	        return;
   409	      }
   410	
   411	      const rendered = `${block.title}\n${block.content}`;
   412	      if (output.context.some((entry) => entry.includes(rendered))) {
   413	        return;
   414	      }
   415	
   416	      output.context.push(rendered);
   417	    },
   418	  };
   419	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '500,760p;1048,1175p;1310,1340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1048	      ? buildSearchResponseFromPayload(cachePayload, _searchStartTime, false)
  1049	      : formatted;
  1050	  }
  1051	
  1052	  responseToReturn = applyPublicationGateToResponse(responseToReturn);
  1053	
  1054	  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
  1055	    const parsedResponse = parseResponseEnvelope(responseToReturn);
  1056	    const data = parsedResponse?.envelope.data && typeof parsedResponse.envelope.data === 'object'
  1057	      ? parsedResponse.envelope.data as Record<string, unknown>
  1058	      : null;
  1059	      const existingResults = Array.isArray(data?.results) ? data.results as SessionAwareResult[] : null;
  1060	
  1061	    if (parsedResponse && data && existingResults && existingResults.length > 0) {
  1062	      const deduped = deduplicateWithSessionState(existingResults, sessionId);
  1063	      data.results = deduped.results as SessionAwareResult[];
  1064	      data.count = deduped.results.length;
  1065	      data.sessionDedup = deduped.metadata;
  1066	      parsedResponse.envelope.data = data;
  1067	      responseToReturn = replaceResponseEnvelope(responseToReturn, parsedResponse.firstEntry, parsedResponse.envelope);
  1068	    }
  1069	  }
  1070	
  1071	  // Apply session deduplication AFTER cache
  1072	  if (sessionId && enableDedup && sessionManager.isEnabled()) {
  1073	    let resultsData: Record<string, unknown> | null = null;
  1074	    if (responseToReturn?.content?.[0]?.text && typeof responseToReturn.content[0].text === 'string') {
  1075	      try {
  1076	        resultsData = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
  1077	      } catch (err: unknown) {
  1078	        const message = toErrorMessage(err);
  1079	        console.warn('[memory-search] Failed to parse cached response for dedup:', message);
  1080	        resultsData = null;
  1081	      }
  1082	    } else if (responseToReturn && typeof responseToReturn === 'object') {
  1083	      resultsData = responseToReturn as unknown as Record<string, unknown>;
  1084	    }
  1085	
  1086	    // P1-018 — Validate response shape before dedup. If the cached response
  1087	    // Doesn't have the expected data.results array, log a warning and skip dedup
  1088	    // Rather than silently falling through to the un-deduped response.
  1089	    const data = (resultsData && typeof resultsData.data === 'object' && resultsData.data !== null)
  1090	      ? resultsData.data as Record<string, unknown>
  1091	      : null;
  1092	    const existingResults = Array.isArray(data?.results) ? data.results as MemorySearchRow[] : null;
  1093	
  1094	    if (resultsData && !data) {
  1095	      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
  1096	    } else if (data && !existingResults) {
  1097	      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
  1098	    }
  1099	
  1100	    if (resultsData && data && existingResults && existingResults.length > 0) {
  1101	      const { results: dedupedResults } = applySessionDedup(
  1102	        existingResults,
  1103	        sessionId,
  1104	        enableDedup
  1105	      );
  1106	
  1107	      const originalCount = existingResults.length;
  1108	      const dedupedCount = dedupedResults.length;
  1109	      const filteredCount = originalCount - dedupedCount;
  1110	
  1111	      const tokensSaved = filteredCount * 200;
  1112	      const savingsPercent = originalCount > 0
  1113	        ? Math.round((filteredCount / originalCount) * 100)
  1114	        : 0;
  1115	
  1116	      data.results = dedupedResults;
  1117	      data.count = dedupedCount;
  1118	
  1119	      const dedupStats = {
  1120	        enabled: true,
  1121	        sessionId,
  1122	        originalCount: originalCount,
  1123	        returnedCount: dedupedCount,
  1124	        filteredCount: filteredCount,
  1125	        tokensSaved: tokensSaved,
  1126	        savingsPercent: savingsPercent,
  1127	        tokenSavingsEstimate: tokensSaved > 0 ? `~${tokensSaved} tokens` : '0'
  1128	      };
  1129	      resultsData.dedupStats = dedupStats;
  1130	
  1131	      if (resultsData.meta && typeof resultsData.meta === 'object') {
  1132	        (resultsData.meta as Record<string, unknown>).dedupStats = dedupStats;
  1133	      }
  1134	
  1135	      if (filteredCount > 0 && typeof resultsData.summary === 'string') {
  1136	        resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
  1137	      }
  1138	
  1139	      responseToReturn = {
  1140	        ...responseToReturn,
  1141	        content: [{ type: 'text', text: JSON.stringify(resultsData, null, 2) }]
  1142	      } as MCPResponse;
  1143	    }
  1144	  }
  1145	
  1146	  if (sessionId && isSessionRetrievalStateEnabled()) {
  1147	    const parsedResponse = parseResponseEnvelope(responseToReturn);
  1148	    const data = parsedResponse?.envelope.data && typeof parsedResponse.envelope.data === 'object'
  1149	      ? parsedResponse.envelope.data as Record<string, unknown>
  1150	      : null;
  1151	    const existingResults = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
  1152	
  1153	    if (parsedResponse && data) {
  1154	      const returnedIds = existingResults
  1155	        .map((result) => result.id ?? result.resultId)
  1156	        .filter((id): id is string | number => typeof id === 'string' || typeof id === 'number');
  1157	
  1158	      if (returnedIds.length > 0) {
  1159	        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
  1160	      }
  1161	
  1162	      data.sessionState = buildSessionStatePayload(sessionId);
  1163	      if (goalRefinementPayload) {
  1164	        data.goalRefinement = goalRefinementPayload;
  1165	      }
  1166	
  1167	      parsedResponse.envelope.data = data;
  1168	      responseToReturn = replaceResponseEnvelope(responseToReturn, parsedResponse.firstEntry, parsedResponse.envelope);
  1169	    }
  1170	  }
  1171	
  1172	  if (includeTrace && sessionTransition) {
  1173	    responseToReturn = attachSessionTransitionTrace(responseToReturn, sessionTransition);
  1174	  }
  1175	
  1310	        const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
  1311	
  1312	        // Track query flow — detects reformulations and same-topic re-queries
  1313	        if (normalizedQuery) {
  1314	          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
  1315	        }
  1316	
  1317	        // Log result_cited for includeContent searches (content was embedded = cited)
  1318	        if (includeContent && shownIds.length > 0) {
  1319	          logResultCited(db, sessionId ?? null, queryId, shownIds);
  1320	        }
  1321	      }
  1322	    }
  1323	  } catch (_error: unknown) { /* query flow tracking must never break search */ }
  1324	
  1325	  // REQ-D5-003: Apply presentation profile when flag is enabled and profile is specified.
  1326	  // Phase C: effectiveProfile includes auto-routed profile from intent detection.
  1327	  if (effectiveProfile && typeof effectiveProfile === 'string' && isResponseProfileEnabled()) {
  1328	    const firstEntry = responseToReturn?.content?.[0];
  1329	    if (firstEntry && typeof firstEntry.text === 'string') {
  1330	      try {
  1331	        const profiled = applyProfileToEnvelope(effectiveProfile, firstEntry.text);
  1332	        if (profiled !== firstEntry.text) {
  1333	          responseToReturn = {
  1334	            ...responseToReturn,
  1335	            content: [{ ...firstEntry, text: profiled }],
  1336	          } as MCPResponse;
  1337	        }
  1338	      } catch (_profileError: unknown) {
  1339	        // Profile formatting is best-effort — never breaks search
  1340	      }

exec
/bin/zsh -lc "rg -n \"session_bootstrap|session_resume|primeSessionIfNeeded|autoSurfaceAtCompaction|autoSurfaceMemories|buildServerInstructions|memory_context\\(resume\\)|Structural Bootstrap\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:52:  autoSurfaceMemories,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:54:  autoSurfaceAtCompaction,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:60:import { primeSessionIfNeeded } from './hooks/memory-surface.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:741:async function buildServerInstructions(): Promise<string> {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:784:  lines.push('## Structural Bootstrap (Phase 027)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:899:      sessionPrimeContext = await primeSessionIfNeeded(
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:920:            autoSurfacedContext = await autoSurfaceAtCompaction(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:922:            autoSurfacedContext = await autoSurfaceMemories(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1876:      const dynamicInstructions = await buildServerInstructions();

exec
/bin/zsh -lc 'rg -n "JSON-PRIMARY|strictly better information|spec folder|Direct spec folder mode is no longer supported|target spec folder|session-id" .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
48:// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
72:  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata
85:Preferred save path (JSON-PRIMARY):
87:  - The AI has strictly better information about its own session than any DB query can reconstruct.
91:  - When a spec folder is passed on the CLI, that explicit target is authoritative.
178:    // Check if the last two segments both match the spec folder pattern
182:            // Both segments are valid spec folder names — valid nested spec folder
214:        return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
340:        throw new Error(`${mode} requires a target spec folder via an explicit CLI override or payload specFolder`);
356:    // Extract --session-id <uuid> from argv before positional parsing
360:        if (argv[i] === '--session-id') {
363:                throw new Error('--session-id requires a non-empty value');
381:        throw new Error('Direct spec folder mode is no longer supported. ' +
404:        // Input looks like a valid spec folder name but wasn't found at top level.
414:    console.error(`\nError: Invalid spec folder format: ${specFolderArg}`);
482:                        console.error('Available spec folders:');
490:            console.error('[generate-context] Failed to list spec folders:', errMsg);
519:        const isExpected = /Spec folder not found|No spec folders|specs\/ directory|retry attempts|Expected|Invalid JSON provided|requires a target spec folder|requires an inline JSON string|required a non-empty JSON object|JSON object payload|no longer supported|session-id requires/.test(errMsg);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '180,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   180	  sessionLifecycle: SessionLifecycleMetadata;
   181	  effectiveBudget: number;
   182	  enforcement: TokenBudgetEnforcement;
   183	  intentClassification: EffectiveModeIntentClassification;
   184	  discoveredFolder?: string;
   185	  includeTrace: boolean;
   186	  sessionTransition: SessionTransitionTrace;
   187	  structuralRoutingNudge: StructuralRoutingNudgeMeta | null;
   188	}
   189	
   190	interface StrategyErrorPayload {
   191	  error: string;
   192	  code: string;
   193	  details: Record<string, unknown>;
   194	  hints: string[];
   195	  severity: string | null;
   196	}
   197	
   198	interface StructuralRoutingNudgeMeta {
   199	  advisory: true;
   200	  readiness: 'ready';
   201	  preferredTool: 'code_graph_query';
   202	  message: string;
   203	  preservesAuthority: 'session_bootstrap';
   204	}
   205	
   206	const STRUCTURAL_ROUTING_PATTERNS = [
   207	  /\b(?:who|what)\s+calls?\b/i,
   208	  /\bcallers?\s+of\b/i,
   209	  /\b(?:who|what)\s+imports?\b/i,
   210	  /\bimports?\s+of\b/i,
   211	  /\b(?:show|list)\s+(?:the\s+)?outline\b/i,
   212	  /\boutline\s+of\b/i,
   213	  /\bdependenc(?:y|ies)\b/i,
   214	  /\bdependents?\b/i,
   215	  /\bwhat\s+extends\b/i,
   216	];
   217	
   218	function extractResultRowsFromContextResponse(responseText: string): Array<Record<string, unknown>> {
   219	  try {
   220	    const parsed = JSON.parse(responseText) as Record<string, unknown>;
   221	    const outerData = parsed?.data as Record<string, unknown> | undefined;
   222	
   223	    const directRows = Array.isArray(outerData?.results)
   224	      ? outerData.results as Array<Record<string, unknown>>
   225	      : null;
   226	    if (directRows) {
   227	      return directRows;
   228	    }
   229	
   230	    const nestedContent = Array.isArray(outerData?.content)
   231	      ? outerData.content as Array<{ type?: string; text?: string }>
   232	      : [];
   233	    const nestedText = nestedContent[0]?.text;
   234	    if (typeof nestedText !== 'string' || nestedText.length === 0) {
   235	      return [];
   236	    }
   237	
   238	    const nestedEnvelope = JSON.parse(nestedText) as Record<string, unknown>;
   239	    const nestedData = nestedEnvelope?.data as Record<string, unknown> | undefined;
   240	    return Array.isArray(nestedData?.results)
   241	      ? nestedData.results as Array<Record<string, unknown>>
   242	      : [];
   243	  } catch {
   244	    return [];
   245	  }
   246	}
   247	
   248	function extractStrategyError(result: ContextResult): StrategyErrorPayload | null {
   249	  if ((result as Record<string, unknown>).isError !== true) {
   250	    return null;
   251	  }
   252	
   253	  const content = Array.isArray((result as Record<string, unknown>).content)
   254	    ? ((result as Record<string, unknown>).content as Array<{ text?: string }>)
   255	    : [];
   256	  const responseText = content[0]?.text;
   257	  if (typeof responseText !== 'string' || responseText.length === 0) {
   258	    return {
   259	      error: 'Context strategy failed',
   260	      code: 'E_STRATEGY',
   261	      details: {},
   262	      hints: [],
   263	      severity: null,
   264	    };
   265	  }
   266	
   267	  try {
   268	    const parsed = JSON.parse(responseText) as {
   269	      data?: {
   270	        error?: string;
   271	        code?: string;
   272	        details?: Record<string, unknown>;
   273	      };
   274	      hints?: string[];
   275	      meta?: {
   276	        severity?: string;
   277	      };
   278	    };
   279	
   280	    return {
   281	      error: parsed.data?.error ?? 'Context strategy failed',
   282	      code: parsed.data?.code ?? 'E_STRATEGY',
   283	      details: parsed.data?.details ?? {},
   284	      hints: Array.isArray(parsed.hints) ? parsed.hints : [],
   285	      severity: parsed.meta?.severity ?? null,
   286	    };
   287	  } catch {
   288	    return {
   289	      error: 'Context strategy failed',
   290	      code: 'E_STRATEGY',
   291	      details: {},
   292	      hints: [],
   293	      severity: null,
   294	    };
   295	  }
   296	}
   297	
   298	function buildStructuralRoutingNudge(
   299	  input: string,
   300	  queryIntentMetadata: {
   301	    queryIntent: string;
   302	    confidence: number;
   303	  } | null,
   304	  graphContextResult: Record<string, unknown> | null,
   305	): StructuralRoutingNudgeMeta | null {
   306	  if (!queryIntentMetadata || queryIntentMetadata.queryIntent !== 'structural' || queryIntentMetadata.confidence <= 0.65) {
   307	    return null;
   308	  }
   309	
   310	  if (!STRUCTURAL_ROUTING_PATTERNS.some((pattern) => pattern.test(input))) {
   311	    return null;
   312	  }
   313	
   314	  const metadata = graphContextResult?.metadata as Record<string, unknown> | undefined;
   315	  const totalNodes = typeof metadata?.totalNodes === 'number' ? metadata.totalNodes : 0;
   316	  if (totalNodes <= 0) {
   317	    return null;
   318	  }
   319	
   320	  return {
   321	    advisory: true,
   322	    readiness: 'ready',
   323	    preferredTool: 'code_graph_query',
   324	    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
   325	    preservesAuthority: 'session_bootstrap',
   326	  };
   327	}
   328	
   329	/* ───────────────────────────────────────────────────────────────
   330	   2. TOKEN BUDGET ENFORCEMENT (T205)
   331	   
   332	   Enforces per-layer/per-mode token budgets by estimating the
   333	   token count of strategy results and truncating when exceeded.
   334	   Uses character-based estimation: 1 token ≈ 4 chars.
   335	──────────────────────────────────────────────────────────────── */
   336	
   337	/**
   338	 * T205: Enforce token budget on strategy results.
   339	 * 
   340	 * Estimates the token count of the serialized result. If over budget,

codex
# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

## Findings
### Finding 1: Memory becomes a lifecycle policy, not just a retrieval API
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L155), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169), [mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh#L129), [mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh#L71), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L897), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L919), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396) (source-confirmed + README-documented)
- **What it does**: MemPalace treats memory as a timed operating discipline: `mempalace_status` teaches query/save behavior up front, the Stop hook blocks every 15 user turns, and PreCompact always blocks before loss. Public already primes sessions, auto-surfaces context, and injects compaction transport, but it mostly nudges rather than enforces preservation.
- **Why it matters for us**: The deeper shift is that “memory architecture” includes lifecycle checkpoints and agent behavior contracts, not just storage and ranking. Public should think in terms of preservation policy surfaces, especially around compaction and long sessions.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Context delivery should be a response compiler, not a separate wake-up stack
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L275), [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L76), [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L185), [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L369), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L526), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L641), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1448), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L691), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1325) (source-confirmed + README-documented)
- **What it does**: MemPalace’s L0/L1/L2/L3 model is mostly formatted text assembly with rough `len(...) // 4` token estimates and separate rendering paths. Public already does something more powerful: mode routing, structured envelopes, profile selection, progressive disclosure, session dedup, and actual budget enforcement with truncation and metadata-only spillover.
- **Why it matters for us**: The paradigm shift is to treat memory output as a compiled artifact shaped for task, pressure, and budget, not as a hardcoded layer stack. That makes wake-up/resume a profile problem, not a separate engine problem.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: A strong memory system can have multiple planes of truth without forcing them into one index
- **Source**: [palace_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py#L33), [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L49), [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L121), [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L180), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L746), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L782), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1142) (source-confirmed)
- **What it does**: MemPalace separates three representational planes: verbatim drawers in ChromaDB, a navigational graph derived from room metadata, and a separate temporal triple store with invalidation. Public already hints at the same architectural direction by keeping semantic memory, code-graph structure, and orchestration distinct.
- **Why it matters for us**: The big shift is representational pluralism. If we need fact-time validity, it should likely live in its own bounded fact plane rather than being forced into causal links, search metadata, or the main memory row shape.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Authority surfaces matter more than feature count
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L326), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L422), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L477), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L338), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L381), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L198), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L9) (source-confirmed)
- **What it does**: MemPalace exposes many overlapping write authorities: direct drawer writes, diary writes, KG writes, AI-directed hook saves, and optional hook auto-ingest. Public is stricter: JSON-primary save is the canonical path, explicit target spec folder wins, direct spec-folder mode is rejected, and session recovery authority is explicitly preserved by `session_bootstrap`.
- **Why it matters for us**: The paradigm shift is to architect memory around a few clear authority owners: who decides where memory is saved, who owns session recovery truth, who injects compaction transport, and who is allowed to write derived fact state. That is a better scaling principle than adding more tools.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Identity should be governed internally and human-friendly externally
- **Source**: [onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py#L28), [onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py#L120), [onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py#L175), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L533), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L827) (source-confirmed)
- **What it does**: MemPalace makes people/projects/wings a first-class user-facing taxonomy from the start. Public instead grounds retrieval in governed scope fields like `tenantId`, `userId`, `agentId`, `sessionId`, and `sharedSpaceId`.
- **Why it matters for us**: The shift is not “copy wings.” It is to split identity into two planes: machine-trustworthy internal scope and optional human-friendly aliases/navigation. That would give us MemPalace’s ergonomic browsing without weakening governed retrieval.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Truthfulness boundaries are part of the architecture
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L52), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L262), [BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md#L24), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L682) (mixed: source-confirmed + README-documented + benchmark-documented)
- **What it does**: MemPalace’s own correction note shows how easily mode boundaries blur: raw mode, rooms mode, AAAK, and unreleased rerank paths were marketed too closely together. Public already encodes stricter guardrails in structured save contracts and confidence floors.
- **Why it matters for us**: A memory system is not trustworthy if its interfaces blur what is stored, what is derived, what is experimental, and what is benchmark-only. Evidence tiering needs to be part of the product contract, not just a doc habit.
- **Recommendation**: adopt now
- **Impact**: medium

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md)
- [external/pyproject.toml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml), [external/mempalace/cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py)
- [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py), [external/mempalace/searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py), [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py)
- [external/mempalace/palace_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py), [external/mempalace/knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py)
- [external/mempalace/miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py), [external/mempalace/convo_miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py), [external/mempalace/general_extractor.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py), [external/mempalace/onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py)
- [external/hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md), [external/hooks/mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh), [external/hooks/mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh), [external/benchmarks/BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [iteration-011.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-011.md)

## Assessment
- New information ratio: 0.76
- Questions addressed: lifecycle-timed preservation, wake-up vs response compilation, separate memory planes, authority boundaries, identity/taxonomy layering, truthfulness boundaries
- Questions answered: the biggest shift MemPalace suggests is not room-first retrieval but a broader model where memory is lifecycle policy plus multiple bounded representations; Public should preserve its query-led, governed architecture and selectively borrow checkpointing and temporal-fact ideas

## Reflection
- What worked: tracing the external code in the exact order from the brief and then matching each concept against live Public handlers made the deeper shifts visible quickly, especially around lifecycle timing, response shaping, and representation boundaries
- What did not work: CocoIndex MCP calls were cancelled in this runtime, so I relied on direct source tracing with `rg` and `nl`; the strict validator passed but still emitted `cannot create temp file for here document: Operation not permitted`; and the phase folder still only exposed `research/` at the root, so I could not verify the expected Level 3 root docs from disk in this read-only pass

## Recommended Next Focus
Test whether Public needs a dedicated temporal fact plane or only a thin validity layer on top of causal links, and evaluate hook-style preservation checkpoints as a bounded orchestration feature rather than a retrieval refactor.


hook: Stop
hook: Stop Completed
tokens used
170,589
# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

## Findings
### Finding 1: Memory becomes a lifecycle policy, not just a retrieval API
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L155), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169), [mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh#L129), [mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh#L71), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L897), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L919), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396) (source-confirmed + README-documented)
- **What it does**: MemPalace treats memory as a timed operating discipline: `mempalace_status` teaches query/save behavior up front, the Stop hook blocks every 15 user turns, and PreCompact always blocks before loss. Public already primes sessions, auto-surfaces context, and injects compaction transport, but it mostly nudges rather than enforces preservation.
- **Why it matters for us**: The deeper shift is that “memory architecture” includes lifecycle checkpoints and agent behavior contracts, not just storage and ranking. Public should think in terms of preservation policy surfaces, especially around compaction and long sessions.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Context delivery should be a response compiler, not a separate wake-up stack
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L275), [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L76), [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L185), [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L369), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L526), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L641), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1448), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L691), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1325) (source-confirmed + README-documented)
- **What it does**: MemPalace’s L0/L1/L2/L3 model is mostly formatted text assembly with rough `len(...) // 4` token estimates and separate rendering paths. Public already does something more powerful: mode routing, structured envelopes, profile selection, progressive disclosure, session dedup, and actual budget enforcement with truncation and metadata-only spillover.
- **Why it matters for us**: The paradigm shift is to treat memory output as a compiled artifact shaped for task, pressure, and budget, not as a hardcoded layer stack. That makes wake-up/resume a profile problem, not a separate engine problem.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: A strong memory system can have multiple planes of truth without forcing them into one index
- **Source**: [palace_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py#L33), [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L49), [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L121), [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L180), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L746), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L782), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1142) (source-confirmed)
- **What it does**: MemPalace separates three representational planes: verbatim drawers in ChromaDB, a navigational graph derived from room metadata, and a separate temporal triple store with invalidation. Public already hints at the same architectural direction by keeping semantic memory, code-graph structure, and orchestration distinct.
- **Why it matters for us**: The big shift is representational pluralism. If we need fact-time validity, it should likely live in its own bounded fact plane rather than being forced into causal links, search metadata, or the main memory row shape.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Authority surfaces matter more than feature count
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L326), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L422), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L477), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L338), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L381), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L198), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L9) (source-confirmed)
- **What it does**: MemPalace exposes many overlapping write authorities: direct drawer writes, diary writes, KG writes, AI-directed hook saves, and optional hook auto-ingest. Public is stricter: JSON-primary save is the canonical path, explicit target spec folder wins, direct spec-folder mode is rejected, and session recovery authority is explicitly preserved by `session_bootstrap`.
- **Why it matters for us**: The paradigm shift is to architect memory around a few clear authority owners: who decides where memory is saved, who owns session recovery truth, who injects compaction transport, and who is allowed to write derived fact state. That is a better scaling principle than adding more tools.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Identity should be governed internally and human-friendly externally
- **Source**: [onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py#L28), [onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py#L120), [onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py#L175), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L533), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L827) (source-confirmed)
- **What it does**: MemPalace makes people/projects/wings a first-class user-facing taxonomy from the start. Public instead grounds retrieval in governed scope fields like `tenantId`, `userId`, `agentId`, `sessionId`, and `sharedSpaceId`.
- **Why it matters for us**: The shift is not “copy wings.” It is to split identity into two planes: machine-trustworthy internal scope and optional human-friendly aliases/navigation. That would give us MemPalace’s ergonomic browsing without weakening governed retrieval.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Truthfulness boundaries are part of the architecture
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L52), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L262), [BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md#L24), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L682) (mixed: source-confirmed + README-documented + benchmark-documented)
- **What it does**: MemPalace’s own correction note shows how easily mode boundaries blur: raw mode, rooms mode, AAAK, and unreleased rerank paths were marketed too closely together. Public already encodes stricter guardrails in structured save contracts and confidence floors.
- **Why it matters for us**: A memory system is not trustworthy if its interfaces blur what is stored, what is derived, what is experimental, and what is benchmark-only. Evidence tiering needs to be part of the product contract, not just a doc habit.
- **Recommendation**: adopt now
- **Impact**: medium

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md)
- [external/pyproject.toml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml), [external/mempalace/cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py)
- [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py), [external/mempalace/searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py), [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py)
- [external/mempalace/palace_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py), [external/mempalace/knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py)
- [external/mempalace/miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py), [external/mempalace/convo_miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py), [external/mempalace/general_extractor.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py), [external/mempalace/onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py)
- [external/hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md), [external/hooks/mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh), [external/hooks/mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh), [external/benchmarks/BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [iteration-011.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-011.md)

## Assessment
- New information ratio: 0.76
- Questions addressed: lifecycle-timed preservation, wake-up vs response compilation, separate memory planes, authority boundaries, identity/taxonomy layering, truthfulness boundaries
- Questions answered: the biggest shift MemPalace suggests is not room-first retrieval but a broader model where memory is lifecycle policy plus multiple bounded representations; Public should preserve its query-led, governed architecture and selectively borrow checkpointing and temporal-fact ideas

## Reflection
- What worked: tracing the external code in the exact order from the brief and then matching each concept against live Public handlers made the deeper shifts visible quickly, especially around lifecycle timing, response shaping, and representation boundaries
- What did not work: CocoIndex MCP calls were cancelled in this runtime, so I relied on direct source tracing with `rg` and `nl`; the strict validator passed but still emitted `cannot create temp file for here document: Operation not permitted`; and the phase folder still only exposed `research/` at the root, so I could not verify the expected Level 3 root docs from disk in this read-only pass

## Recommended Next Focus
Test whether Public needs a dedicated temporal fact plane or only a thin validity layer on top of causal links, and evaluate hook-style preservation checkpoints as a bounded orchestration feature rather than a retrieval refactor.
