### Finding 6: Recovery design treats `chroma.sqlite3` as the durable source-of-truth and HNSW as disposable
- **Source**: [migrate.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/migrate.py#L26), [migrate.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/migrate.py#L87), [repair.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/repair.py#L5), [repair.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/repair.py#L206)
- **Evidence type**: source-confirmed
- **What it does**: `migrate.py` reads Chroma’s SQLite tables directly across version mismatches, reconstructs drawer documents and metadata, and imports them into a fresh collection. `repair.py` backs up only `chroma.sqlite3`, scans corrupt IDs, then rebuilds the HNSW index with `hnsw:space=cosine`.
- **Why it matters for us**: This is the strongest storage-layer lesson in the repo. Public already rebuilds derived indexes and forces WAL, but the MemPalace posture of “logical DB first, vector index rebuildable” is worth carrying forward anywhere our vector layer can drift or corrupt.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 7: Public already has the stronger normalized storage model; MemPalace’s reusable value is a raw-verbatim sidecar, not a backend replacement
- **Source**: [schema-downgrade.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts#L112), [chunking-orchestrator.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L140), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1632), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L139), [miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py#L373)
- **Evidence type**: source-confirmed
- **What it does**: Public persists a normalized `memory_index`, FTS5 mirror, chunk parent/child rows, active lineage projection, causal edges, BM25 rebuild, and enforced WAL mode. MemPalace persists a simpler raw drawer collection plus sidecar stores.
- **Why it matters for us**: Replacing Public’s backend with MemPalace would be a regression. The right move is a new raw-verbatim capture/archive lane that feeds or coexists with Public’s richer index.
- **Recommendation**: NEW FEATURE
- **Impact**: high

## Sources Consulted
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md), [external/benchmarks/BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md)
- [external/pyproject.toml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml), [external/mempalace/cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py), [external/mempalace/config.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/config.py)
- [external/mempalace/palace.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace.py), [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py), [external/mempalace/searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py), [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py)
- [external/mempalace/knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py), [external/mempalace/palace_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py)
- [external/mempalace/miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py), [external/mempalace/convo_miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py), [external/mempalace/general_extractor.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py), [external/mempalace/onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py)
- [external/mempalace/migrate.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/migrate.py), [external/mempalace/repair.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/repair.py)
- [external/hooks/mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh), [external/hooks/mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh), [external/hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts), [chunking-orchestrator.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts), [schema-downgrade.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)

## Assessment
- **New information ratio**: 0.76
- **Questions addressed**: primary store layout, drawer schema, duplicate semantics, KG separation, metadata-derived graph behavior, recovery/index rebuild design, Public-vs-MemPalace storage comparison
- **Questions answered**: MemPalace is a multi-store local system with one thin Chroma drawer collection plus sidecars; its strongest storage ideas are verbatim retention and explicit SQLite-first recovery; its weakest storage area is inconsistent duplicate/lineage discipline; Public should borrow raw-archive and recovery ideas, not replace its normalized backend

## Reflection
- **What worked**: tracing from `cli.py` into `palace.py`/`mcp_server.py`/`miner.py`/`knowledge_graph.py` made the real storage model much clearer than reading the README claims first; the repair and migrate modules were especially valuable because they reveal what the project itself treats as durable state
- **What did not work**: the exact strict-validation command returned `RESULT: PASSED` while also printing `cannot create temp file for here document: Operation not permitted`, so I did not treat it as trustworthy readiness evidence; the phase folder also still lacks the Level 3 docs the brief expects; CocoIndex semantic search cancelled immediately for this target, so this pass stayed on direct source tracing

## Recommended Next Focus
Trace iteration 3 through the exact write-path truth boundary: compare `mempalace_check_duplicate` vs `mempalace_add_drawer`, inspect whether diary entries and AAAK compressed data ever become first-class retrieval inputs, verify onboarding/runtime drift (`README` markets guided `init`, but `cli.py` still routes `init` through entity scan + local room detection rather than `onboarding.py`), and then move from storage design into write-discipline and benchmark-script reality.

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
# Iteration 003: TOOL/API SURFACE

## Focus
TOOL/API SURFACE: Analyze MCP tools, CLI commands, API endpoints, tool registration, profile separation.

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
I’m treating this as a read-only research pass over the MemPalace external repo, focused on its CLI/MCP/tool surface and how that compares to Public’s memory APIs. I’ll start with a quick memory pass for prior context, then trace the actual source files in the order your brief calls for and synthesize only net-new findings.
exec
/bin/zsh -lc 'rg -n "mempalace|hybrid-rag-fusion|tool/api|mcp_server|cli.py|profile separation|tool registration" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'pwd && test -f /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md && echo EXISTS || echo MISSING' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
239:- symptom: full `mcp_server` and `scripts` Vitest gates failed in many unrelated suites during a minimal header-only pass; cause: pre-existing workspace-wide failures outside scoped style edits; fix: report and halt per stop rule (or baseline these failures before edit) rather than forcing broader remediation in a style-only task [Task 1]
293:- 005-mempalace, phase-research-prompt.md, dont ask for a spec folder, 13-section TIDD-EC, source-confirmed README-documented benchmark-documented, raw-verbatim hooks taxonomy temporal KG
367:- when the user asked to "create a similar prompt for ...005-mempalace ... dont ask for a spec folder," place `phase-research-prompt.md` in the phase root and skip new spec-folder scaffolding [Task 1]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
522:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server; reuse_rule=reuse for feedback-event runtime checks in this checkout, but verify live process restart state before concluding
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
787:- hook path truth is `mcp_server/hooks/claude/*.ts` and compiled `mcp_server/dist/hooks/claude/*.js`; avoid stale `scripts/hooks/claude/` references [Task 4]
795:- symptom: tests not found when running Vitest with file filters from repo root; cause: package-scoped configs were bypassed; fix: run from the owning package roots (`scripts`, `mcp_server`) [Task 4]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1164:- 023-esm-module-compliance, research/research.md, shared + mcp_server, scripts CommonJS interop, dual-build fallback-only, validate.sh --strict
1181:- For `023-esm-module-compliance`, keep `research/research.md` immutable as canonical evidence and sync `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the same strategy language (shared + mcp_server ESM, scripts CommonJS interop, dual-build fallback-only) [Task 5]
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1942:- npm ci, npx tsc -b shared/tsconfig.json mcp_server/tsconfig.json, check --workspace=scripts, validate_document.py one file at a time
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
EXISTS

exec
/bin/zsh -lc 'ls -1 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
external
memory
phase-research-prompt.md
research

codex
I’ve confirmed there is an `external/AGENTS.md`, and the phase root currently looks sparse rather than fully provisioned with the Level 3 docs your brief expects. Next I’m checking the exact governed files plus the strict validator, then I’ll move into the MemPalace CLI/MCP source and compare it directly to Public’s memory surfaces.
exec
/bin/zsh -lc 'for f in spec.md plan.md tasks.md checklist.md decision-record.md implementation-summary.md research/research.md external/AGENTS.md external/README.md external/pyproject.toml external/mempalace/cli.py external/mempalace/mcp_server.py; do if [ -e "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/$f" ]; then echo "FOUND $f"; else echo "MISSING $f"; fi; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
MISSING spec.md
MISSING plan.md
MISSING tasks.md
MISSING checklist.md
MISSING decision-record.md
MISSING implementation-summary.md
MISSING research/research.md
FOUND external/AGENTS.md
FOUND external/README.md
FOUND external/pyproject.toml
FOUND external/mempalace/cli.py
FOUND external/mempalace/mcp_server.py

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 2267ms:

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


codex
The validator is still running, and the initial filesystem check confirmed the phase folder is missing every expected Level 3 doc, including `research/research.md`. While that finishes, I’m preparing the source-reading pass so we can separate actual implementation surface from README positioning without repeating the earlier storage findings.
2026-04-10T19:30:05.400351Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 59
codex
I have the validator output now: it returned `RESULT: PASSED` but also emitted `cannot create temp file for here document: Operation not permitted`, so I’m treating it as partial evidence rather than a trustworthy clean validation signal. I’m moving into the actual code paths now: external scope rules, README claims, package/runtime boundary, CLI command definitions, and the MCP server’s registered tools.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# AGENTS.md
     2	
     3	> How to build, test, and contribute to MemPalace.
     4	
     5	## Setup
     6	
     7	```bash
     8	pip install -e ".[dev]"
     9	```
    10	
    11	## Commands
    12	
    13	```bash
    14	# Run tests
    15	python -m pytest tests/ -v --ignore=tests/benchmarks
    16	
    17	# Run tests with coverage
    18	python -m pytest tests/ -v --ignore=tests/benchmarks --cov=mempalace --cov-report=term-missing
    19	
    20	# Lint
    21	ruff check .
    22	
    23	# Format
    24	ruff format .
    25	
    26	# Format check (CI mode)
    27	ruff format --check .
    28	```
    29	
    30	## Project structure
    31	
    32	```
    33	mempalace/
    34	├── mcp_server.py        # MCP server — all read/write tools
    35	├── miner.py             # Project file miner
    36	├── convo_miner.py       # Conversation transcript miner
    37	├── searcher.py          # Semantic search
    38	├── knowledge_graph.py   # Temporal entity-relationship graph (SQLite)
    39	├── palace.py            # Shared palace operations (ChromaDB access)
    40	├── config.py            # Configuration + input validation
    41	├── normalize.py         # Transcript format detection + normalization
    42	├── cli.py               # CLI dispatcher
    43	├── dialect.py           # AAAK compression dialect
    44	├── palace_graph.py      # Room traversal + cross-wing tunnels
    45	├── hooks_cli.py         # Hook system for auto-save
    46	└── version.py           # Single source of truth for version
    47	```
    48	
    49	## Conventions
    50	
    51	- **Python style**: snake_case for functions/variables, PascalCase for classes
    52	- **Linter**: ruff with E/F/W rules
    53	- **Formatter**: ruff format, double quotes
    54	- **Commits**: conventional commits (`fix:`, `feat:`, `test:`, `docs:`, `ci:`)
    55	- **Tests**: `tests/test_*.py`, fixtures in `tests/conftest.py`
    56	- **Coverage**: 85% threshold (80% on Windows due to ChromaDB file lock cleanup)
    57	
    58	## Architecture
    59	
    60	```
    61	User → CLI / MCP Server → ChromaDB (vector store) + SQLite (knowledge graph)
    62	
    63	Palace structure:
    64	  WING (person/project)
    65	    └── ROOM (topic)
    66	          └── DRAWER (verbatim text chunk)
    67	
    68	Knowledge Graph:
    69	  ENTITY → PREDICATE → ENTITY (with valid_from / valid_to dates)
    70	```
    71	
    72	## Key files for common tasks
    73	
    74	- **Adding an MCP tool**: `mempalace/mcp_server.py` — add handler function + TOOLS dict entry
    75	- **Changing search**: `mempalace/searcher.py`
    76	- **Modifying mining**: `mempalace/miner.py` (project files) or `mempalace/convo_miner.py` (transcripts)
    77	- **Input validation**: `mempalace/config.py` — `sanitize_name()` / `sanitize_content()`
    78	- **Tests**: mirror source structure in `tests/test_<module>.py`

exec
/bin/zsh -lc 'rg -n "April 7|Quick Start|How You Actually Use It|The Palace|wake-up|AAAK|MCP|benchmark|status|protocol|diary|hook" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
7:### The highest-scoring AI memory system ever benchmarked. And it's free.
15:**The Palace** — Ancient Greek orators memorized entire speeches by placing ideas in rooms of an imaginary building. Walk through the building, find the idea. MemPalace applies the same principle to AI memory: your conversations are organized into wings (people and projects), halls (types of memory), and rooms (specific ideas). No AI decides what matters — you keep every word, and the structure gives you a navigable map instead of a flat search index.
19:**AAAK (experimental)** — A lossy abbreviation dialect for packing repeated entities into fewer tokens at scale. Readable by any LLM that reads text — Claude, GPT, Gemini, Llama, Mistral — no decoder needed. **AAAK is a separate compression layer, not the storage default**, and on the LongMemEval benchmark it currently regresses vs raw mode (84.2% vs 96.6%). We're iterating. See the [note above](#a-note-from-milla--ben--april-7-2026) for the honest status.
32:[Quick Start](#quick-start) · [The Palace](#the-palace) · [AAAK Dialect](#aaak-dialect-experimental) · [Benchmarks](#benchmarks) · [MCP Tools](#mcp-server)
46:<sub>Reproducible — runners in <a href="benchmarks/">benchmarks/</a>. <a href="benchmarks/BENCHMARKS.md">Full results</a>. The 96.6% is from <b>raw verbatim mode</b>, not AAAK or rooms mode (those score lower — see <a href="#a-note-from-milla--ben--april-7-2026">note above</a>).</sub>
52:## A Note from Milla & Ben — April 7, 2026
58:> - **The AAAK token example was incorrect.** We used a rough heuristic (`len(text)//3`) for token counts instead of an actual tokenizer. Real counts via OpenAI's tokenizer: the English example is 66 tokens, the AAAK example is 73. AAAK does not save tokens at small scales — it's designed for *repeated entities at scale*, and the README example was a bad demonstration of that. We're rewriting it.
60:> - **"30x lossless compression" was overstated.** AAAK is a lossy abbreviation system (entity codes, sentence truncation). Independent benchmarks show AAAK mode scores **84.2% R@5 vs raw mode's 96.6%** on LongMemEval — a 12.4 point regression. The honest framing is: AAAK is an experimental compression layer that trades fidelity for token density, and **the 96.6% headline number is from RAW mode, not AAAK**.
66:> - **"100% with Haiku rerank"** is real (we have the result files) but the rerank pipeline is not in the public benchmark scripts. We're adding it.
76:> 1. Rewriting the AAAK example with real tokenizer counts and a scenario where AAAK actually demonstrates compression
77:> 2. Adding `mode raw / aaak / rooms` clearly to the benchmark documentation so the trade-offs are visible
79:> 4. Pinning ChromaDB to a tested range (Issue #100), fixing the shell injection in hooks (#110), and addressing the macOS ARM64 segfault (#74)
87:## Quick Start
104:mempalace status
111:## How You Actually Use It
126:### With Claude, ChatGPT, Cursor, Gemini (MCP-compatible tools)
133:Now your AI has 19 tools available through MCP. Ask it anything:
139:MemPalace also works natively with **Gemini CLI** (which handles the server and save hooks automatically) — see the [Gemini CLI Integration Guide](examples/gemini_cli_setup.md).
143:Local models generally don't speak MCP yet. Two approaches:
148:mempalace wake-up > context.txt
152:This gives your local model ~170 tokens of critical facts (in AAAK if you prefer) before you ask a single question.
169:Either way — your entire memory stack runs offline. ChromaDB on your machine, Llama on your machine, AAAK for compression, zero cloud calls.
183:| **MemPalace wake-up** | **~170 tokens** | **~$0.70/yr** |
186:MemPalace loads 170 tokens of critical facts on wake-up — your team, your projects, your preferences. Then searches only when needed. $10/year to remember everything vs $507/year for summaries that lose context.
192:### The Palace
200:Every room has a **closet** connected to it, and here's where things get interesting. We've developed an AI language called **AAAK**. Don't ask — it's a whole story of its own. Your agent learns the AAAK shorthand every time it wakes up. Because AAAK is essentially English, but a very truncated version, your agent understands how to use it in seconds. It comes as part of the install, built into the MemPalace code. In our next update, we'll add AAAK directly to the closets, which will be a real game changer — the amount of info in the closets will be much bigger, but it will take up far less space and far less reading time for your agent.
202:Inside those closets are **drawers**, and those drawers are where your original files live. In this first version, we haven't used AAAK as a closet tool, but even so, the summaries have shown **96.6% recall** in all the benchmarks we've done across multiple benchmarking platforms. Once the closets use AAAK, searches will be even faster while keeping every word exact. But even now, the closet approach has been a huge boon to how much info is stored in a small space — it's used to easily point your AI agent to the drawer where your original file lives. You never lose anything, and all this happens in seconds.
242:**Closets** — summaries that point to the original content. (In v3.0.0 these are plain-text summaries; AAAK-encoded closets are coming in a future update — see [Task #30](https://github.com/milla-jovovich/mempalace/issues/30).)
280:| **L1** | Critical facts — team, projects, preferences | ~120 tokens (AAAK) | Always loaded |
286:### AAAK Dialect (experimental)
288:AAAK is a lossy abbreviation system — entity codes, structural markers, and sentence truncation — designed to pack repeated entities and relationships into fewer tokens at scale. It is **readable by any LLM that reads text** (Claude, GPT, Gemini, Llama, Mistral) without a decoder, so a local model can use it without any cloud dependency.
290:**Honest status (April 2026):**
292:- **AAAK is lossy, not lossless.** It uses regex-based abbreviation, not reversible compression.
293:- **It does not save tokens at small scales.** Short text already tokenizes efficiently. AAAK overhead (codes, separators) costs more than it saves on a few sentences.
295:- **AAAK currently regresses LongMemEval** vs raw verbatim retrieval (84.2% R@5 vs 96.6%). The 96.6% headline number is from **raw mode**, not AAAK mode.
296:- **The MemPalace storage default is raw verbatim text in ChromaDB** — that's where the benchmark wins come from. AAAK is a separate compression layer for context loading, not the storage format.
413:Create agents that focus on specific areas. Each agent gets its own wing and diary in the palace — not in your CLAUDE.md. Add 50 agents, your config stays the same size.
431:- **Keeps a diary** — written in AAAK, persists across sessions
435:# Agent writes to its diary after a code review
436:mempalace_diary_write("reviewer",
440:mempalace_diary_read("reviewer", last_n=10)
441:# → last 10 findings, compressed in AAAK
450:## MCP Server
467:| `mempalace_status` | Palace overview + AAAK spec + memory protocol |
473:| `mempalace_get_aaak_spec` | AAAK dialect reference |
504:| `mempalace_diary_write` | Write AAAK diary entry |
505:| `mempalace_diary_read` | Read recent diary entries |
507:The AI learns AAAK and the memory protocol automatically from the `mempalace_status` response. No manual configuration.
513:Two hooks for Claude Code that automatically save memories during work:
521:  "hooks": {
522:    "Stop": [{"matcher": "", "hooks": [{"type": "command", "command": "/path/to/mempalace/hooks/mempal_save_hook.sh"}]}],
523:    "PreCompact": [{"matcher": "", "hooks": [{"type": "command", "command": "/path/to/mempalace/hooks/mempal_precompact_hook.sh"}]}]
528:**Optional auto-ingest:** Set the `MEMPAL_DIR` environment variable to a directory path and the hooks will automatically run `mempalace mine` on that directory during each save trigger (background on stop, synchronous on precompact).
534:Tested on standard academic benchmarks — reproducible, published datasets.
563:mempalace init <dir>                              # guided onboarding + AAAK bootstrap
580:mempalace wake-up                                 # load L0 + L1 context
581:mempalace wake-up --wing driftwood                # project-specific
584:mempalace compress --wing myapp                   # AAAK compress
587:mempalace status                                  # palace overview
589:# MCP
590:mempalace mcp                                     # show MCP setup command
636:| `mcp_server.py` | MCP server — 19 tools, AAAK auto-teach, memory protocol |
641:| `dialect.py` | AAAK compression — 30x lossless |
644:| `onboarding.py` | Guided setup — generates AAAK bootstrap + wing config |
648:| `hooks/mempal_save_hook.sh` | Auto-save every N messages |
649:| `hooks/mempal_precompact_hook.sh` | Emergency save before compaction |
660:│   ├── mcp_server.py          ← MCP server (19 tools)
663:│   ├── dialect.py             ← AAAK compression
669:├── benchmarks/                ← reproducible benchmark runners
675:├── hooks/                     ← Claude Code auto-save hooks
676:│   ├── README.md              ← hook setup guide
677:│   ├── mempal_save_hook.sh    ← save every N messages
678:│   └── mempal_precompact_hook.sh ← emergency save

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc 'rg -n "@click|def main|def init|def mine|def search|def wake_up|def status|def repair|def compress|def migrate|profile|mcp|onboarding|duplicate|diary" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
17:    mempalace mcp                         Show MCP setup command
254:def cmd_mcp(args):
256:    base_server_cmd = "python -m mempalace.mcp_server"
265:    print(f"  claude mcp add mempalace -- {server_cmd}")
271:        print(f"  claude mcp add mempalace -- {base_server_cmd} --palace /path/to/palace")
396:def main():
535:    # mcp
537:        "mcp",
583:        "mcp": cmd_mcp,

exec
/bin/zsh -lc "rg -n \"@mcp\\.tool|PALACE_PROTOCOL|AAAK_SPEC|status|duplicate|graph|knowledge|diary|profile|stderr|logging|search|wake|compress|add_drawer|check_duplicate|register|tool\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
8:  mempalace_status          — total drawers, wing/room breakdown
12:  mempalace_search          — semantic search, optional wing/room filter
13:  mempalace_check_duplicate — check if content already exists before filing
16:  mempalace_add_drawer      — file verbatim content into a wing/room
24:import logging
31:from .searcher import search_memories
32:from .palace_graph import traverse, find_tunnels, graph_stats
35:from .knowledge_graph import KnowledgeGraph
37:logging.basicConfig(level=logging.INFO, format="%(message)s", stream=sys.stderr)
38:logger = logging.getLogger("mempalace_mcp")
61:    _kg = KnowledgeGraph(db_path=os.path.join(_config.palace_path, "knowledge_graph.sqlite3"))
139:def tool_status():
160:        "protocol": PALACE_PROTOCOL,
161:        "aaak_dialect": AAAK_SPEC,
166:# Included in status response so the AI learns it on first wake-up call.
167:# Also available via mempalace_get_aaak_spec tool.
169:PALACE_PROTOCOL = """IMPORTANT — MemPalace Memory Protocol:
170:1. ON WAKE-UP: Call mempalace_status to load palace overview + AAAK spec.
171:2. BEFORE RESPONDING about any person, project, or past event: call mempalace_kg_query or mempalace_search FIRST. Never guess — verify.
173:4. AFTER EACH SESSION: call mempalace_diary_write to record what happened, what you learned, what matters.
178:AAAK_SPEC = """AAAK is a compressed memory dialect that MemPalace uses for efficient storage.
188:  WINGS: wing_user, wing_agent, wing_team, wing_code, wing_myproject, wing_hardware, wing_ue5, wing_ai_research.
198:def tool_list_wings():
213:def tool_list_rooms(wing: str = None):
231:def tool_get_taxonomy():
249:def tool_search(query: str, limit: int = 5, wing: str = None, room: str = None):
250:    return search_memories(
259:def tool_check_duplicate(content: str, threshold: float = 0.9):
269:        duplicates = []
277:                    duplicates.append(
287:            "is_duplicate": len(duplicates) > 0,
288:            "matches": duplicates,
294:def tool_get_aaak_spec():
296:    return {"aaak_spec": AAAK_SPEC}
299:def tool_traverse_graph(start_room: str, max_hops: int = 2):
300:    """Walk the palace graph from a room. Find connected ideas across wings."""
307:def tool_find_tunnels(wing_a: str = None, wing_b: str = None):
315:def tool_graph_stats():
316:    """Palace graph overview: nodes, tunnels, edges, connectivity."""
320:    return graph_stats(col=col)
326:def tool_add_drawer(
329:    """File verbatim content into a wing/room. Checks for duplicates first."""
344:        "add_drawer",
384:def tool_delete_drawer(drawer_id: str):
416:def tool_kg_query(entity: str, as_of: str = None, direction: str = "both"):
417:    """Query the knowledge graph for an entity's relationships."""
422:def tool_kg_add(
425:    """Add a relationship to the knowledge graph."""
449:def tool_kg_invalidate(subject: str, predicate: str, object: str, ended: str = None):
463:def tool_kg_timeline(entity: str = None):
469:def tool_kg_stats():
470:    """Knowledge graph overview: entities, triples, relationship types."""
477:def tool_diary_write(agent_name: str, entry: str, topic: str = "general"):
479:    Write a diary entry for this agent. Each agent gets its own wing
480:    with a diary room. Entries are timestamped and accumulate over time.
492:    room = "diary"
498:    entry_id = f"diary_{wing}_{now.strftime('%Y%m%d_%H%M%S')}_{hashlib.sha256(entry[:50].encode()).hexdigest()[:12]}"
501:        "diary_write",
512:        # semantic search quality. For now, store raw AAAK in metadata so it's
514:        # compressed AAAK degrades embedding quality).
522:                    "hall": "hall_diary",
524:                    "type": "diary_entry",
531:        logger.info(f"Diary entry: {entry_id} → {wing}/diary/{topic}")
543:def tool_diary_read(agent_name: str, last_n: int = 10):
545:    Read an agent's recent diary entries. Returns the last N entries
555:            where={"$and": [{"wing": wing}, {"room": "diary"}]},
561:            return {"agent": agent_name, "entries": [], "message": "No diary entries yet."}
591:    "mempalace_status": {
594:        "handler": tool_status,
599:        "handler": tool_list_wings,
609:        "handler": tool_list_rooms,
614:        "handler": tool_get_taxonomy,
617:        "description": "Get the AAAK dialect specification — the compressed memory format MemPalace uses. Call this if you need to read or write AAAK-compressed memories.",
619:        "handler": tool_get_aaak_spec,
622:        "description": "Query the knowledge graph for an entity's relationships. Returns typed facts with temporal validity. E.g. 'Max' → child_of Alice, loves chess, does swimming. Filter by date with as_of to see what was true at a point in time.",
641:        "handler": tool_kg_query,
644:        "description": "Add a fact to the knowledge graph. Subject → predicate → object with optional time window. E.g. ('Max', 'started_school', 'Year 7', valid_from='2026-09-01').",
665:        "handler": tool_kg_add,
682:        "handler": tool_kg_invalidate,
695:        "handler": tool_kg_timeline,
698:        "description": "Knowledge graph overview: entities, triples, current vs expired facts, relationship types.",
700:        "handler": tool_kg_stats,
703:        "description": "Walk the palace graph from a room. Shows connected ideas across wings — the tunnels. Like following a thread through the palace: start at 'chromadb-setup' in wing_code, discover it connects to wing_myproject (planning) and wing_user (feelings about it).",
718:        "handler": tool_traverse_graph,
729:        "handler": tool_find_tunnels,
731:    "mempalace_graph_stats": {
732:        "description": "Palace graph overview: total rooms, tunnel connections, edges between wings.",
734:        "handler": tool_graph_stats,
736:    "mempalace_search": {
737:        "description": "Semantic search. Returns verbatim drawer content with similarity scores.",
741:                "query": {"type": "string", "description": "What to search for"},
748:        "handler": tool_search,
750:    "mempalace_check_duplicate": {
763:        "handler": tool_check_duplicate,
765:    "mempalace_add_drawer": {
766:        "description": "File verbatim content into the palace. Checks for duplicates first.",
784:        "handler": tool_add_drawer,
795:        "handler": tool_delete_drawer,
797:    "mempalace_diary_write": {
798:        "description": "Write to your personal agent diary in AAAK format. Your observations, thoughts, what you worked on, what matters. Each agent has their own diary with full history. Write in AAAK for compression — e.g. 'SESSION:2026-04-04|built.palace.graph+diary.tools|ALC.req:agent.diaries.in.aaak|★★★'. Use entity codes from the AAAK spec.",
804:                    "description": "Your name — each agent gets their own diary wing",
808:                    "description": "Your diary entry in AAAK format — compressed, entity-coded, emotion-marked",
817:        "handler": tool_diary_write,
819:    "mempalace_diary_read": {
820:        "description": "Read your recent diary entries (in AAAK). See what past versions of yourself recorded — your journal across sessions.",
826:                    "description": "Your name — each agent gets their own diary wing",
835:        "handler": tool_diary_read,
865:                "capabilities": {"tools": {}},
871:    elif method == "tools/list":
876:                "tools": [
882:    elif method == "tools/call":
883:        tool_name = params.get("name")
884:        tool_args = params.get("arguments") or {}
885:        if tool_name not in TOOLS:
889:                "error": {"code": -32601, "message": f"Unknown tool: {tool_name}"},
894:        schema_props = TOOLS[tool_name]["input_schema"].get("properties", {})
895:        for key, value in list(tool_args.items()):
899:                tool_args[key] = int(value)
901:                tool_args[key] = float(value)
903:            result = TOOLS[tool_name]["handler"](**tool_args)
910:            logger.exception(f"Tool error in {tool_name}")
914:                "error": {"code": -32000, "message": "Internal tool error"},

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md | sed -n '52,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md | sed -n '192,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md | sed -n '450,610p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   521	  "hooks": {
   522	    "Stop": [{"matcher": "", "hooks": [{"type": "command", "command": "/path/to/mempalace/hooks/mempal_save_hook.sh"}]}],
   523	    "PreCompact": [{"matcher": "", "hooks": [{"type": "command", "command": "/path/to/mempalace/hooks/mempal_precompact_hook.sh"}]}]
   524	  }
   525	}
   526	```
   527	
   528	**Optional auto-ingest:** Set the `MEMPAL_DIR` environment variable to a directory path and the hooks will automatically run `mempalace mine` on that directory during each save trigger (background on stop, synchronous on precompact).
   529	
   530	---
   531	
   532	## Benchmarks
   533	
   534	Tested on standard academic benchmarks — reproducible, published datasets.
   535	
   536	| Benchmark | Mode | Score | API Calls |
   537	|-----------|------|-------|-----------|
   538	| **LongMemEval R@5** | Raw (ChromaDB only) | **96.6%** | Zero |
   539	| **LongMemEval R@5** | Hybrid + Haiku rerank | **100%** (500/500) | ~500 |
   540	| **LoCoMo R@10** | Raw, session level | **60.3%** | Zero |
   541	| **Personal palace R@10** | Heuristic bench | **85%** | Zero |
   542	| **Palace structure impact** | Wing+room filtering | **+34%** R@10 | Zero |
   543	
   544	The 96.6% raw score is the highest published LongMemEval result requiring no API key, no cloud, and no LLM at any stage.
   545	
   546	### vs Published Systems
   547	
   548	| System | LongMemEval R@5 | API Required | Cost |
   549	|--------|----------------|--------------|------|
   550	| **MemPalace (hybrid)** | **100%** | Optional | Free |
   551	| Supermemory ASMR | ~99% | Yes | — |
   552	| **MemPalace (raw)** | **96.6%** | **None** | **Free** |
   553	| Mastra | 94.87% | Yes (GPT) | API costs |
   554	| Mem0 | ~85% | Yes | $19–249/mo |
   555	| Zep | ~85% | Yes | $25/mo+ |
   556	
   557	---
   558	
   559	## All Commands
   560	
   561	```bash
   562	# Setup
   563	mempalace init <dir>                              # guided onboarding + AAAK bootstrap
   564	
   565	# Mining
   566	mempalace mine <dir>                              # mine project files
   567	mempalace mine <dir> --mode convos                # mine conversation exports
   568	mempalace mine <dir> --mode convos --wing myapp   # tag with a wing name
   569	
   570	# Splitting
   571	mempalace split <dir>                             # split concatenated transcripts
   572	mempalace split <dir> --dry-run                   # preview
   573	
   574	# Search
   575	mempalace search "query"                          # search everything
   576	mempalace search "query" --wing myapp             # within a wing
   577	mempalace search "query" --room auth-migration    # within a room
   578	
   579	# Memory stack
   580	mempalace wake-up                                 # load L0 + L1 context
   581	mempalace wake-up --wing driftwood                # project-specific
   582	
   583	# Compression
   584	mempalace compress --wing myapp                   # AAAK compress
   585	
   586	# Status
   587	mempalace status                                  # palace overview
   588	
   589	# MCP
   590	mempalace mcp                                     # show MCP setup command
   591	```
   592	
   593	All commands accept `--palace <path>` to override the default location.
   594	
   595	---
   596	
   597	## Configuration
   598	
   599	### Global (`~/.mempalace/config.json`)
   600	
   601	```json
   602	{
   603	  "palace_path": "/custom/path/to/palace",
   604	  "collection_name": "mempalace_drawers",
   605	  "people_map": {"Kai": "KAI", "Priya": "PRI"}
   606	}
   607	```
   608	
   609	### Wing config (`~/.mempalace/wing_config.json`)
   610	

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py | sed -n '260,680p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   521	    p_instructions = sub.add_parser(
   522	        "instructions",
   523	        help="Output skill instructions to stdout",
   524	    )
   525	    instructions_sub = p_instructions.add_subparsers(dest="instructions_name")
   526	    for instr_name in ["init", "search", "mine", "help", "status"]:
   527	        instructions_sub.add_parser(instr_name, help=f"Output {instr_name} instructions")
   528	
   529	    # repair
   530	    sub.add_parser(
   531	        "repair",
   532	        help="Rebuild palace vector index from stored data (fixes segfaults after corruption)",
   533	    )
   534	
   535	    # mcp
   536	    sub.add_parser(
   537	        "mcp",
   538	        help="Show MCP setup command for connecting MemPalace to your AI client",
   539	    )
   540	
   541	    # status
   542	    # migrate
   543	    p_migrate = sub.add_parser(
   544	        "migrate",
   545	        help="Migrate palace from a different ChromaDB version (fixes 3.0.0 → 3.1.0 upgrade)",
   546	    )
   547	    p_migrate.add_argument(
   548	        "--dry-run",
   549	        action="store_true",
   550	        help="Show what would be migrated without changing anything",
   551	    )
   552	
   553	    sub.add_parser("status", help="Show what's been filed")
   554	
   555	    args = parser.parse_args()
   556	
   557	    if not args.command:
   558	        parser.print_help()
   559	        return
   560	
   561	    # Handle two-level subcommands
   562	    if args.command == "hook":
   563	        if not getattr(args, "hook_action", None):
   564	            p_hook.print_help()
   565	            return
   566	        cmd_hook(args)
   567	        return
   568	
   569	    if args.command == "instructions":
   570	        name = getattr(args, "instructions_name", None)
   571	        if not name:
   572	            p_instructions.print_help()
   573	            return
   574	        args.name = name
   575	        cmd_instructions(args)
   576	        return
   577	
   578	    dispatch = {
   579	        "init": cmd_init,
   580	        "mine": cmd_mine,
   581	        "split": cmd_split,
   582	        "search": cmd_search,
   583	        "mcp": cmd_mcp,
   584	        "compress": cmd_compress,
   585	        "wake-up": cmd_wakeup,
   586	        "repair": cmd_repair,
   587	        "migrate": cmd_migrate,
   588	        "status": cmd_status,
   589	    }
   590	    dispatch[args.command](args)
   591	
   592	
   593	if __name__ == "__main__":
   594	    main()

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py | sed -n '220,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py | sed -n '420,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py | sed -n '620,940p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
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
   761	            "required": ["content"],
   762	        },
   763	        "handler": tool_check_duplicate,
   764	    },
   765	    "mempalace_add_drawer": {
   766	        "description": "File verbatim content into the palace. Checks for duplicates first.",
   767	        "input_schema": {
   768	            "type": "object",
   769	            "properties": {
   770	                "wing": {"type": "string", "description": "Wing (project name)"},
   771	                "room": {
   772	                    "type": "string",
   773	                    "description": "Room (aspect: backend, decisions, meetings...)",
   774	                },
   775	                "content": {
   776	                    "type": "string",
   777	                    "description": "Verbatim content to store — exact words, never summarized",
   778	                },
   779	                "source_file": {"type": "string", "description": "Where this came from (optional)"},
   780	                "added_by": {"type": "string", "description": "Who is filing this (default: mcp)"},
   781	            },
   782	            "required": ["wing", "room", "content"],
   783	        },
   784	        "handler": tool_add_drawer,
   785	    },
   786	    "mempalace_delete_drawer": {
   787	        "description": "Delete a drawer by ID. Irreversible.",
   788	        "input_schema": {
   789	            "type": "object",
   790	            "properties": {
   791	                "drawer_id": {"type": "string", "description": "ID of the drawer to delete"},
   792	            },
   793	            "required": ["drawer_id"],
   794	        },
   795	        "handler": tool_delete_drawer,
   796	    },
   797	    "mempalace_diary_write": {
   798	        "description": "Write to your personal agent diary in AAAK format. Your observations, thoughts, what you worked on, what matters. Each agent has their own diary with full history. Write in AAAK for compression — e.g. 'SESSION:2026-04-04|built.palace.graph+diary.tools|ALC.req:agent.diaries.in.aaak|★★★'. Use entity codes from the AAAK spec.",
   799	        "input_schema": {
   800	            "type": "object",
   801	            "properties": {
   802	                "agent_name": {
   803	                    "type": "string",
   804	                    "description": "Your name — each agent gets their own diary wing",
   805	                },
   806	                "entry": {
   807	                    "type": "string",
   808	                    "description": "Your diary entry in AAAK format — compressed, entity-coded, emotion-marked",
   809	                },
   810	                "topic": {
   811	                    "type": "string",
   812	                    "description": "Topic tag (optional, default: general)",
   813	                },
   814	            },
   815	            "required": ["agent_name", "entry"],
   816	        },
   817	        "handler": tool_diary_write,
   818	    },
   819	    "mempalace_diary_read": {
   820	        "description": "Read your recent diary entries (in AAAK). See what past versions of yourself recorded — your journal across sessions.",
   821	        "input_schema": {
   822	            "type": "object",
   823	            "properties": {
   824	                "agent_name": {
   825	                    "type": "string",
   826	                    "description": "Your name — each agent gets their own diary wing",
   827	                },
   828	                "last_n": {
   829	                    "type": "integer",
   830	                    "description": "Number of recent entries to read (default: 10)",
   831	                },
   832	            },
   833	            "required": ["agent_name"],
   834	        },
   835	        "handler": tool_diary_read,
   836	    },
   837	}
   838	
   839	
   840	SUPPORTED_PROTOCOL_VERSIONS = [
   841	    "2025-11-25",
   842	    "2025-06-18",
   843	    "2025-03-26",
   844	    "2024-11-05",
   845	]
   846	
   847	
   848	def handle_request(request):
   849	    method = request.get("method", "")
   850	    params = request.get("params", {})
   851	    req_id = request.get("id")
   852	
   853	    if method == "initialize":
   854	        client_version = params.get("protocolVersion", SUPPORTED_PROTOCOL_VERSIONS[-1])
   855	        negotiated = (
   856	            client_version
   857	            if client_version in SUPPORTED_PROTOCOL_VERSIONS
   858	            else SUPPORTED_PROTOCOL_VERSIONS[0]
   859	        )
   860	        return {
   861	            "jsonrpc": "2.0",
   862	            "id": req_id,
   863	            "result": {
   864	                "protocolVersion": negotiated,
   865	                "capabilities": {"tools": {}},
   866	                "serverInfo": {"name": "mempalace", "version": __version__},
   867	            },
   868	        }
   869	    elif method == "notifications/initialized":
   870	        return None
   871	    elif method == "tools/list":
   872	        return {
   873	            "jsonrpc": "2.0",
   874	            "id": req_id,
   875	            "result": {
   876	                "tools": [
   877	                    {"name": n, "description": t["description"], "inputSchema": t["input_schema"]}
   878	                    for n, t in TOOLS.items()
   879	                ]
   880	            },
   881	        }
   882	    elif method == "tools/call":
   883	        tool_name = params.get("name")
   884	        tool_args = params.get("arguments") or {}
   885	        if tool_name not in TOOLS:
   886	            return {
   887	                "jsonrpc": "2.0",
   888	                "id": req_id,
   889	                "error": {"code": -32601, "message": f"Unknown tool: {tool_name}"},
   890	            }
   891	        # Coerce argument types based on input_schema.
   892	        # MCP JSON transport may deliver integers as floats or strings;
   893	        # ChromaDB and Python slicing require native int.
   894	        schema_props = TOOLS[tool_name]["input_schema"].get("properties", {})
   895	        for key, value in list(tool_args.items()):
   896	            prop_schema = schema_props.get(key, {})
   897	            declared_type = prop_schema.get("type")
   898	            if declared_type == "integer" and not isinstance(value, int):
   899	                tool_args[key] = int(value)
   900	            elif declared_type == "number" and not isinstance(value, (int, float)):
   901	                tool_args[key] = float(value)
   902	        try:
   903	            result = TOOLS[tool_name]["handler"](**tool_args)
   904	            return {
   905	                "jsonrpc": "2.0",
   906	                "id": req_id,
   907	                "result": {"content": [{"type": "text", "text": json.dumps(result, indent=2)}]},
   908	            }
   909	        except Exception:
   910	            logger.exception(f"Tool error in {tool_name}")
   911	            return {
   912	                "jsonrpc": "2.0",
   913	                "id": req_id,
   914	                "error": {"code": -32000, "message": "Internal tool error"},
   915	            }
   916	
   917	    return {
   918	        "jsonrpc": "2.0",
   919	        "id": req_id,
   920	        "error": {"code": -32601, "message": f"Unknown method: {method}"},
   921	    }
   922	
   923	
   924	def main():
   925	    logger.info("MemPalace MCP Server starting...")
   926	    while True:
   927	        try:
   928	            line = sys.stdin.readline()
   929	            if not line:
   930	                break
   931	            line = line.strip()
   932	            if not line:
   933	                continue
   934	            request = json.loads(line)
   935	            response = handle_request(request)
   936	            if response is not None:
   937	                sys.stdout.write(json.dumps(response) + "\n")
   938	                sys.stdout.flush()
   939	        except KeyboardInterrupt:
   940	            break

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py | sed -n '940,980p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   940	            break
   941	        except Exception as e:
   942	            logger.error(f"Server error: {e}")
   943	
   944	
   945	if __name__ == "__main__":
   946	    main()

codex
The core surface is already separating into three layers: a human CLI, a raw JSON-RPC MCP server, and a hook/instructions sub-CLI that isn’t really reflected in the README command story. I’m checking the wake-up/search internals and the hook/instruction entrypoints next so I can distinguish the marketed tool surface from the actual operational one.
exec
/bin/zsh -lc 'rg -n "class MemoryStack|def wake_up|L0|L1|L2|L3|identity|critical|project_story|AAAK|wing" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "def search|def search_memories|where|wing|room|query|distances|documents|return|print|n_results" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
21:def search(query: str, palace_path: str, wing: str = None, room: str = None, n_results: int = 5):
24:    Optionally filter by wing (project) or room (aspect).
30:        print(f"\n  No palace found at {palace_path}")
31:        print("  Run: mempalace init <dir> then mempalace mine <dir>")
34:    # Build where filter
35:    where = {}
36:    if wing and room:
37:        where = {"$and": [{"wing": wing}, {"room": room}]}
38:    elif wing:
39:        where = {"wing": wing}
40:    elif room:
41:        where = {"room": room}
45:            "query_texts": [query],
46:            "n_results": n_results,
47:            "include": ["documents", "metadatas", "distances"],
49:        if where:
50:            kwargs["where"] = where
52:        results = col.query(**kwargs)
55:        print(f"\n  Search error: {e}")
58:    docs = results["documents"][0]
60:    dists = results["distances"][0]
63:        print(f'\n  No results found for: "{query}"')
64:        return
66:    print(f"\n{'=' * 60}")
67:    print(f'  Results for: "{query}"')
68:    if wing:
69:        print(f"  Wing: {wing}")
70:    if room:
71:        print(f"  Room: {room}")
72:    print(f"{'=' * 60}\n")
77:        wing_name = meta.get("wing", "?")
78:        room_name = meta.get("room", "?")
80:        print(f"  [{i}] {wing_name} / {room_name}")
81:        print(f"      Source: {source}")
82:        print(f"      Match:  {similarity}")
83:        print()
86:            print(f"      {line}")
87:        print()
88:        print(f"  {'─' * 56}")
90:    print()
93:def search_memories(
94:    query: str, palace_path: str, wing: str = None, room: str = None, n_results: int = 5
97:    Programmatic search — returns a dict instead of printing.
105:        return {
110:    # Build where filter
111:    where = {}
112:    if wing and room:
113:        where = {"$and": [{"wing": wing}, {"room": room}]}
114:    elif wing:
115:        where = {"wing": wing}
116:    elif room:
117:        where = {"room": room}
121:            "query_texts": [query],
122:            "n_results": n_results,
123:            "include": ["documents", "metadatas", "distances"],
125:        if where:
126:            kwargs["where"] = where
128:        results = col.query(**kwargs)
130:        return {"error": f"Search error: {e}"}
132:    docs = results["documents"][0]
134:    dists = results["distances"][0]
141:                "wing": meta.get("wing", "unknown"),
142:                "room": meta.get("room", "unknown"),
148:    return {
149:        "query": query,
150:        "filters": {"wing": wing, "room": room},

 succeeded in 0ms:
10:    Layer 2: On-Demand      (~200-500 each)  — Loaded when a topic/wing comes up.
13:Wake-up cost: ~600-900 tokens (L0+L1). Leaves 95%+ of context free.
16:and ~/.mempalace/identity.txt.
37:    Reads from ~/.mempalace/identity.txt — a plain-text file the user writes.
39:    Example identity.txt:
46:    def __init__(self, identity_path: str = None):
47:        if identity_path is None:
48:            identity_path = os.path.expanduser("~/.mempalace/identity.txt")
49:        self.path = identity_path
53:        """Return the identity text, or a sensible default."""
62:                "## L0 — IDENTITY\nNo identity configured. Create ~/.mempalace/identity.txt"
84:    MAX_CHARS = 3200  # hard cap on total L1 text (~800 tokens)
86:    def __init__(self, palace_path: str = None, wing: str = None):
89:        self.wing = wing
92:        """Pull top drawers from ChromaDB and format as compact L1 text."""
97:            return "## L1 — No palace found. Run: mempalace mine <dir>"
105:            if self.wing:
106:                kwargs["where"] = {"wing": self.wing}
122:            return "## L1 — No memories yet."
150:        lines = ["## L1 — ESSENTIAL STORY"]
161:                # Truncate doc to keep L1 compact
171:                    lines.append("  ... (more in L3 search)")
181:# Layer 2 — On-Demand (wing/room filtered retrieval)
188:    Loaded when a specific topic or wing comes up in conversation.
189:    Queries ChromaDB with a wing/room filter.
196:    def retrieve(self, wing: str = None, room: str = None, n_results: int = 10) -> str:
197:        """Retrieve drawers filtered by wing and/or room."""
205:        if wing and room:
206:            where = {"$and": [{"wing": wing}, {"room": room}]}
207:        elif wing:
208:            where = {"wing": wing}
225:            label = f"wing={wing}" if wing else ""
230:        lines = [f"## L2 — ON-DEMAND ({len(docs)} drawers)"]
260:    def search(self, query: str, wing: str = None, room: str = None, n_results: int = 5) -> str:
269:        if wing and room:
270:            where = {"$and": [{"wing": wing}, {"room": room}]}
271:        elif wing:
272:            where = {"wing": wing}
296:        lines = [f'## L3 — SEARCH RESULTS for "{query}"']
299:            wing_name = meta.get("wing", "?")
307:            lines.append(f"  [{i}] {wing_name}/{room_name} (sim={similarity})")
315:        self, query: str, wing: str = None, room: str = None, n_results: int = 5
325:        if wing and room:
326:            where = {"$and": [{"wing": wing}, {"room": room}]}
327:        elif wing:
328:            where = {"wing": wing}
354:                    "wing": meta.get("wing", "unknown"),
369:class MemoryStack:
374:        print(stack.wake_up())                # L0 + L1 (~600-900 tokens)
375:        print(stack.recall(wing="my_app"))     # L2 on-demand
376:        print(stack.search("pricing change"))  # L3 deep search
379:    def __init__(self, palace_path: str = None, identity_path: str = None):
382:        self.identity_path = identity_path or os.path.expanduser("~/.mempalace/identity.txt")
384:        self.l0 = Layer0(self.identity_path)
389:    def wake_up(self, wing: str = None) -> str:
391:        Generate wake-up text: L0 (identity) + L1 (essential story).
395:            wing: Optional wing filter for L1 (project-specific wake-up).
399:        # L0: Identity
403:        # L1: Essential Story
404:        if wing:
405:            self.l1.wing = wing
410:    def recall(self, wing: str = None, room: str = None, n_results: int = 10) -> str:
411:        """On-demand L2 retrieval filtered by wing/room."""
412:        return self.l2.retrieve(wing=wing, room=room, n_results=n_results)
414:    def search(self, query: str, wing: str = None, room: str = None, n_results: int = 5) -> str:
415:        """Deep L3 semantic search."""
416:        return self.l3.search(query, wing=wing, room=room, n_results=n_results)
422:            "L0_identity": {
423:                "path": self.identity_path,
424:                "exists": os.path.exists(self.identity_path),
427:            "L1_essential": {
430:            "L2_on_demand": {
433:            "L3_deep_search": {
461:        print("  python layers.py wake-up              Show L0 + L1")
462:        print("  python layers.py wake-up --wing=NAME  Wake-up for a specific project")
463:        print("  python layers.py recall --wing=NAME   On-demand L2 retrieval")
464:        print("  python layers.py search <query>       Deep L3 search")
487:        wing = flags.get("wing")
488:        text = stack.wake_up(wing=wing)
495:        wing = flags.get("wing")
497:        text = stack.recall(wing=wing, room=room)
505:        wing = flags.get("wing")
507:        text = stack.search(query, wing=wing, room=room)

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions_cli.py | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	"""
     2	Instruction text output for MemPalace CLI commands.
     3	
     4	Each instruction lives as a .md file in the instructions/ directory
     5	inside the package. The CLI reads and prints the file content.
     6	"""
     7	
     8	import sys
     9	from pathlib import Path
    10	
    11	INSTRUCTIONS_DIR = Path(__file__).parent / "instructions"
    12	
    13	AVAILABLE = ["init", "search", "mine", "help", "status"]
    14	
    15	
    16	def run_instructions(name: str):
    17	    """Read and print the instruction .md file for the given name."""
    18	    if name not in AVAILABLE:
    19	        print(f"Unknown instructions: {name}", file=sys.stderr)
    20	        print(f"Available: {', '.join(sorted(AVAILABLE))}", file=sys.stderr)
    21	        sys.exit(1)
    22	
    23	    md_path = INSTRUCTIONS_DIR / f"{name}.md"
    24	    if not md_path.is_file():
    25	        print(f"Instructions file not found: {md_path}", file=sys.stderr)
    26	        sys.exit(1)
    27	
    28	    print(md_path.read_text())

 succeeded in 0ms:
     1	"""
     2	Hook logic for MemPalace — Python implementation of session-start, stop, and precompact hooks.
     3	
     4	Reads JSON from stdin, outputs JSON to stdout.
     5	Supported hooks: session-start, stop, precompact
     6	Supported harnesses: claude-code, codex (extensible to cursor, gemini, etc.)
     7	"""
     8	
     9	import json
    10	import os
    11	import re
    12	import subprocess
    13	import sys
    14	from datetime import datetime
    15	from pathlib import Path
    16	
    17	SAVE_INTERVAL = 15
    18	STATE_DIR = Path.home() / ".mempalace" / "hook_state"
    19	
    20	STOP_BLOCK_REASON = (
    21	    "AUTO-SAVE checkpoint. Save key topics, decisions, quotes, and code "
    22	    "from this session to your memory system. Organize into appropriate "
    23	    "categories. Use verbatim quotes where possible. Continue conversation "
    24	    "after saving."
    25	)
    26	
    27	PRECOMPACT_BLOCK_REASON = (
    28	    "COMPACTION IMMINENT. Save ALL topics, decisions, quotes, code, and "
    29	    "important context from this session to your memory system. Be thorough "
    30	    "\u2014 after compaction, detailed context will be lost. Organize into "
    31	    "appropriate categories. Use verbatim quotes where possible. Save "
    32	    "everything, then allow compaction to proceed."
    33	)
    34	
    35	
    36	def _sanitize_session_id(session_id: str) -> str:
    37	    """Only allow alnum, dash, underscore to prevent path traversal."""
    38	    sanitized = re.sub(r"[^a-zA-Z0-9_-]", "", session_id)
    39	    return sanitized or "unknown"
    40	
    41	
    42	def _count_human_messages(transcript_path: str) -> int:
    43	    """Count human messages in a JSONL transcript, skipping command-messages."""
    44	    path = Path(transcript_path).expanduser()
    45	    if not path.is_file():
    46	        return 0
    47	    count = 0
    48	    try:
    49	        with open(path, encoding="utf-8", errors="replace") as f:
    50	            for line in f:
    51	                try:
    52	                    entry = json.loads(line)
    53	                    msg = entry.get("message", {})
    54	                    if isinstance(msg, dict) and msg.get("role") == "user":
    55	                        content = msg.get("content", "")
    56	                        if isinstance(content, str):
    57	                            if "<command-message>" in content:
    58	                                continue
    59	                        elif isinstance(content, list):
    60	                            text = " ".join(
    61	                                b.get("text", "") for b in content if isinstance(b, dict)
    62	                            )
    63	                            if "<command-message>" in text:
    64	                                continue
    65	                        count += 1
    66	                    # Also handle Codex CLI transcript format
    67	                    # {"type": "event_msg", "payload": {"type": "user_message", "message": "..."}}
    68	                    elif entry.get("type") == "event_msg":
    69	                        payload = entry.get("payload", {})
    70	                        if isinstance(payload, dict) and payload.get("type") == "user_message":
    71	                            msg_text = payload.get("message", "")
    72	                            if isinstance(msg_text, str) and "<command-message>" not in msg_text:
    73	                                count += 1
    74	                except (json.JSONDecodeError, AttributeError):
    75	                    pass
    76	    except OSError:
    77	        return 0
    78	    return count
    79	
    80	
    81	def _log(message: str):
    82	    """Append to hook state log file."""
    83	    try:
    84	        STATE_DIR.mkdir(parents=True, exist_ok=True)
    85	        log_path = STATE_DIR / "hook.log"
    86	        timestamp = datetime.now().strftime("%H:%M:%S")
    87	        with open(log_path, "a") as f:
    88	            f.write(f"[{timestamp}] {message}\n")
    89	    except OSError:
    90	        pass
    91	
    92	
    93	def _output(data: dict):
    94	    """Print JSON to stdout with consistent formatting (pretty-printed)."""
    95	    print(json.dumps(data, indent=2, ensure_ascii=False))
    96	
    97	
    98	def _maybe_auto_ingest():
    99	    """If MEMPAL_DIR is set and exists, run mempalace mine in background."""
   100	    mempal_dir = os.environ.get("MEMPAL_DIR", "")
   101	    if mempal_dir and os.path.isdir(mempal_dir):
   102	        try:
   103	            log_path = STATE_DIR / "hook.log"
   104	            with open(log_path, "a") as log_f:
   105	                subprocess.Popen(
   106	                    [sys.executable, "-m", "mempalace", "mine", mempal_dir],
   107	                    stdout=log_f,
   108	                    stderr=log_f,
   109	                )
   110	        except OSError:
   111	            pass
   112	
   113	
   114	SUPPORTED_HARNESSES = {"claude-code", "codex"}
   115	
   116	
   117	def _parse_harness_input(data: dict, harness: str) -> dict:
   118	    """Parse stdin JSON according to the harness type."""
   119	    if harness not in SUPPORTED_HARNESSES:
   120	        print(f"Unknown harness: {harness}", file=sys.stderr)
   121	        sys.exit(1)
   122	    return {
   123	        "session_id": _sanitize_session_id(str(data.get("session_id", "unknown"))),
   124	        "stop_hook_active": data.get("stop_hook_active", False),
   125	        "transcript_path": str(data.get("transcript_path", "")),
   126	    }
   127	
   128	
   129	def hook_stop(data: dict, harness: str):
   130	    """Stop hook: block every N messages for auto-save."""
   131	    parsed = _parse_harness_input(data, harness)
   132	    session_id = parsed["session_id"]
   133	    stop_hook_active = parsed["stop_hook_active"]
   134	    transcript_path = parsed["transcript_path"]
   135	
   136	    # If already in a save cycle, let through (infinite-loop prevention)
   137	    if str(stop_hook_active).lower() in ("true", "1", "yes"):
   138	        _output({})
   139	        return
   140	
   141	    # Count human messages
   142	    exchange_count = _count_human_messages(transcript_path)
   143	
   144	    # Track last save point
   145	    STATE_DIR.mkdir(parents=True, exist_ok=True)
   146	    last_save_file = STATE_DIR / f"{session_id}_last_save"
   147	    last_save = 0
   148	    if last_save_file.is_file():
   149	        try:
   150	            last_save = int(last_save_file.read_text().strip())
   151	        except (ValueError, OSError):
   152	            last_save = 0
   153	
   154	    since_last = exchange_count - last_save
   155	
   156	    _log(f"Session {session_id}: {exchange_count} exchanges, {since_last} since last save")
   157	
   158	    if since_last >= SAVE_INTERVAL and exchange_count > 0:
   159	        # Update last save point
   160	        try:
   161	            last_save_file.write_text(str(exchange_count), encoding="utf-8")
   162	        except OSError:
   163	            pass
   164	
   165	        _log(f"TRIGGERING SAVE at exchange {exchange_count}")
   166	
   167	        # Optional: auto-ingest if MEMPAL_DIR is set
   168	        _maybe_auto_ingest()
   169	
   170	        _output({"decision": "block", "reason": STOP_BLOCK_REASON})
   171	    else:
   172	        _output({})
   173	
   174	
   175	def hook_session_start(data: dict, harness: str):
   176	    """Session start hook: initialize session tracking state."""
   177	    parsed = _parse_harness_input(data, harness)
   178	    session_id = parsed["session_id"]
   179	
   180	    _log(f"SESSION START for session {session_id}")
   181	
   182	    # Initialize session state directory
   183	    STATE_DIR.mkdir(parents=True, exist_ok=True)
   184	
   185	    # Pass through — no blocking on session start
   186	    _output({})
   187	
   188	
   189	def hook_precompact(data: dict, harness: str):
   190	    """Precompact hook: always block with comprehensive save instruction."""
   191	    parsed = _parse_harness_input(data, harness)
   192	    session_id = parsed["session_id"]
   193	
   194	    _log(f"PRE-COMPACT triggered for session {session_id}")
   195	
   196	    # Optional: auto-ingest synchronously before compaction (so memories land first)
   197	    mempal_dir = os.environ.get("MEMPAL_DIR", "")
   198	    if mempal_dir and os.path.isdir(mempal_dir):
   199	        try:
   200	            log_path = STATE_DIR / "hook.log"
   201	            with open(log_path, "a") as log_f:
   202	                subprocess.run(
   203	                    [sys.executable, "-m", "mempalace", "mine", mempal_dir],
   204	                    stdout=log_f,
   205	                    stderr=log_f,
   206	                    timeout=60,
   207	                )
   208	        except OSError:
   209	            pass
   210	
   211	    # Always block -- compaction = save everything
   212	    _output({"decision": "block", "reason": PRECOMPACT_BLOCK_REASON})
   213	
   214	
   215	def run_hook(hook_name: str, harness: str):
   216	    """Main entry point: read stdin JSON, dispatch to hook handler."""
   217	    try:
   218	        data = json.load(sys.stdin)
   219	    except (json.JSONDecodeError, EOFError):
   220	        _log("WARNING: Failed to parse stdin JSON, proceeding with empty data")
   221	        data = {}
   222	
   223	    hooks = {
   224	        "session-start": hook_session_start,
   225	        "stop": hook_stop,
   226	        "precompact": hook_precompact,
   227	    }
   228	
   229	    handler = hooks.get(hook_name)
   230	    if handler is None:
   231	        print(f"Unknown hook: {hook_name}", file=sys.stderr)
   232	        sys.exit(1)
   233	
   234	    handler(data, harness)

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1500,1805p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1500	      if (!validation.valid) {
  1501	        if (validation.networkError) {
  1502	          // Transient network failure — warn and continue, validation will occur on first use
  1503	          console.warn('[context-server] ===== API KEY VALIDATION SKIPPED (network error) =====');
  1504	          console.warn(`[context-server] Provider: ${validation.provider}`);
  1505	          console.warn(`[context-server] Error: ${validation.error}`);
  1506	          if (validation.actions) {
  1507	            console.warn('[context-server] Recovery Actions:');
  1508	            validation.actions.forEach((action: string, i: number) => {
  1509	              console.warn(`[context-server]   ${i + 1}. ${action}`);
  1510	            });
  1511	          }
  1512	          console.warn('[context-server] Continuing startup — validation will occur on first use');
  1513	        } else {
  1514	          console.error('[context-server] ===== API KEY VALIDATION FAILED =====');
  1515	          console.error(`[context-server] Provider: ${validation.provider}`);
  1516	          console.error(`[context-server] Error: ${validation.error}`);
  1517	          console.error(`[context-server] Error Code: ${validation.errorCode || 'E050'}`);
  1518	          if (validation.actions) {
  1519	            console.error('[context-server] Recovery Actions:');
  1520	            validation.actions.forEach((action: string, i: number) => {
  1521	              console.error(`[context-server]   ${i + 1}. ${action}`);
  1522	            });
  1523	          }
  1524	          console.error('[context-server] =====================================');
  1525	          console.error('[context-server] FATAL: Cannot start MCP server with invalid API key');
  1526	          console.error('[context-server] Set SPECKIT_SKIP_API_VALIDATION=true to bypass (not recommended)');
  1527	          process.exit(1);
  1528	        }
  1529	      }
  1530	
  1531	      if (validation.warning) {
  1532	        console.warn(`[context-server] API key warning: ${validation.warning}`);
  1533	      }
  1534	
  1535	      if (validation.valid) {
  1536	        console.error(`[context-server] API key validated (provider: ${validation.provider})`);
  1537	      }
  1538	    } catch (validationError: unknown) {
  1539	      const message = validationError instanceof Error ? validationError.message : String(validationError);
  1540	      console.error(`[context-server] API key validation error: ${message}`);
  1541	      console.error('[context-server] Continuing startup - validation will occur on first use');
  1542	    }
  1543	  } else {
  1544	    console.warn('[context-server] API key validation skipped (SPECKIT_SKIP_API_VALIDATION=true)');
  1545	  }
  1546	
  1547	  if (!process.env.EMBEDDING_DIM) {
  1548	    process.env.EMBEDDING_DIM = String(
  1549	      startupEmbeddingConfig?.dimension ?? getStartupEmbeddingDimension(),
  1550	    );
  1551	  }
  1552	
  1553	  console.error('[context-server] Initializing database...');
  1554	  vectorIndex.initializeDb();
  1555	  dbInitialized = true;
  1556	  console.error('[context-server] Database initialized');
  1557	  console.error('[context-server] Database path: ' + DATABASE_PATH);
  1558	
  1559	  // Initialize db-state module with dependencies
  1560	  // P4-12/P4-19 FIX: Pass sessionManager and incrementalIndex so db-state can
  1561	  // Refresh their DB handles during reinitializeDatabase(), preventing stale refs.
  1562	  initDbState({
  1563	    vectorIndex,
  1564	    checkpoints: checkpointsLib,
  1565	    accessTracker,
  1566	    hybridSearch,
  1567	    sessionManager,
  1568	    incrementalIndex,
  1569	    dbConsumers: [
  1570	      sessionBoost,
  1571	      causalBoost,
  1572	      historyStore,
  1573	      workingMemory,
  1574	      attentionDecay,
  1575	      coActivation,
  1576	      archivalManager,
  1577	    ],
  1578	  });
  1579	
  1580	  // T016-T019: Lazy loading only. The eager warmup gate remains hard-disabled
  1581	  // in shared embeddings, so startup no longer branches on shouldEagerWarmup().
  1582	  console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
  1583	  console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');
  1584	  // Mark embedding as "ready" since it will self-initialize on first use
  1585	  setEmbeddingModelReady(true);
  1586	
  1587	  // Integrity check and module initialization
  1588	  try {
  1589	    const report = vectorIndex.verifyIntegrity();
  1590	    console.error(`[context-server] Integrity check: ${report.totalMemories}/${report.totalMemories + report.missingVectors} valid entries`);
  1591	    if (report.orphanedVectors > 0) console.error(`[context-server] WARNING: ${report.orphanedVectors} orphaned entries detected`);
  1592	
  1593	    // Validate embedding dimension matches database
  1594	    const dimValidation = vectorIndex.validateEmbeddingDimension();
  1595	    if (!dimValidation.valid) {
  1596	      console.error(`[context-server] ===== EMBEDDING DIMENSION MISMATCH =====`);
  1597	      console.error(`[context-server] ${dimValidation.warning}`);
  1598	      console.error(`[context-server] =========================================`);
  1599	      console.error('[context-server] FATAL: Refusing to start with mismatched embedding dimensions');
  1600	      throw new Error(dimValidation.warning ?? 'Embedding dimension mismatch between provider and database');
  1601	    } else if (dimValidation.stored) {
  1602	      console.error(`[context-server] Embedding dimension validated: ${dimValidation.stored}`);
  1603	    }
  1604	
  1605	    const database = vectorIndex.getDb();
  1606	    if (!database) {
  1607	      throw new Error('Database not initialized after initializeDb(). Cannot start server.');
  1608	    }
  1609	
  1610	    try {
  1611	      initScoringObservability(database);
  1612	      console.error('[context-server] Scoring observability initialized');
  1613	    } catch (scoringObsErr: unknown) {
  1614	      const message = scoringObsErr instanceof Error ? scoringObsErr.message : String(scoringObsErr);
  1615	      console.warn('[context-server] Scoring observability init failed (non-fatal):', message);
  1616	    }
  1617	
  1618	    if (isLearnedFeedbackEnabled()) {
  1619	      try {
  1620	        const migrated = migrateLearnedTriggers(database);
  1621	        const isolated = verifyFts5Isolation(database);
  1622	        console.error(`[context-server] Learned triggers ready (migrated=${migrated}, fts5Isolated=${isolated})`);
  1623	      } catch (learnedErr: unknown) {
  1624	        const message = learnedErr instanceof Error ? learnedErr.message : String(learnedErr);
  1625	        throw new Error(`[context-server] Learned feedback migration/isolation failed: ${message}`);
  1626	      }
  1627	    }
  1628	
  1629	    // Check SQLite version meets minimum requirement (3.35.0+)
  1630	    checkSqliteVersion(database);
  1631	
  1632	    // T076: Verify WAL mode is active for operational concurrency guarantees.
  1633	    const walRow = database.prepare('PRAGMA journal_mode').get() as { journal_mode?: string } | undefined;
  1634	    const journalMode = String(walRow?.journal_mode ?? '').toLowerCase();
  1635	    if (journalMode !== 'wal') {
  1636	      database.pragma('journal_mode = WAL');
  1637	      console.warn('[context-server] journal_mode was not WAL; forcing WAL mode');
  1638	    }
  1639	
  1640	    const memoryCountRow = database.prepare('SELECT COUNT(*) as cnt FROM memory_index').get() as { cnt?: number } | undefined;
  1641	    const memoryCount = Number(memoryCountRow?.cnt ?? 0);
  1642	    let projectionCount = 0;
  1643	    let projectionTableExists = true;
  1644	
  1645	    try {
  1646	      const projectionCountRow = database.prepare('SELECT COUNT(*) as cnt FROM active_memory_projection').get() as { cnt?: number } | undefined;
  1647	      projectionCount = Number(projectionCountRow?.cnt ?? 0);
  1648	    } catch {
  1649	      projectionTableExists = false;
  1650	    }
  1651	
  1652	    console.error('[context-server] Startup health: memory_index=%d, active_memory_projection=%d', memoryCount, projectionCount);
  1653	
  1654	    if (memoryCount > 0 && (!projectionTableExists || projectionCount === 0)) {
  1655	      const result = runLineageBackfill(database);
  1656	      console.error('[context-server] Auto-backfill triggered: %d rows seeded into active_memory_projection', result.seeded);
  1657	    }
  1658	
  1659	    if (memoryCount === 0 && projectionCount === 0) {
  1660	      console.error('[context-server] WARNING: Database has 0 memories — search will return no results until memories are saved');
  1661	    }
  1662	
  1663	    const graphSearchFn = isGraphUnifiedEnabled()
  1664	      ? createUnifiedGraphSearchFn(database)
  1665	      : null;
  1666	
  1667	    checkpointsLib.init(database);
  1668	    accessTracker.init(database);
  1669	    hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn);
  1670	
  1671	    // Keep db-state reinitialization wiring aligned with startup search wiring.
  1672	    initDbState({ graphSearchFn });
  1673	    sessionBoost.init(database);
  1674	    causalBoost.init(database);
  1675	    registerGlobalRefreshFn(() => {
  1676	      const dirtyNodeIds = Array.from(getDirtyNodes().nodeIds);
  1677	      if (dirtyNodeIds.length === 0) {
  1678	        return;
  1679	      }
  1680	
  1681	      try {
  1682	        const updatedEdges = recomputeLocal(database, dirtyNodeIds);
  1683	        clearDirtyNodes();
  1684	        console.error(
  1685	          '[context-server] Scheduled graph refresh applied: dirty_nodes=%d, updated_edges=%d',
  1686	          dirtyNodeIds.length,
  1687	          updatedEdges,
  1688	        );
  1689	      } catch (graphRefreshErr: unknown) {
  1690	        const message = graphRefreshErr instanceof Error ? graphRefreshErr.message : String(graphRefreshErr);
  1691	        console.warn('[context-server] Scheduled graph refresh failed:', message);
  1692	      }
  1693	    });
  1694	    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
  1695	
  1696	    // P3-04: Rebuild BM25 index from database on startup
  1697	    if (bm25Index.isBm25Enabled()) {
  1698	      try {
  1699	        const bm25 = bm25Index.getIndex();
  1700	        const count = bm25.rebuildFromDatabase(database);
  1701	        console.error(`[context-server] BM25 index rebuilt from database: ${count} documents`);
  1702	      } catch (bm25Err: unknown) {
  1703	        const message = bm25Err instanceof Error ? bm25Err.message : String(bm25Err);
  1704	        console.warn('[context-server] BM25 index rebuild failed:', message);
  1705	      }
  1706	    }
  1707	
  1708	    // Cognitive memory modules
  1709	    try {
  1710	      workingMemory.init(database);
  1711	      attentionDecay.init(database);
  1712	      coActivation.init(database);
  1713	      console.error('[context-server] Cognitive memory modules initialized');
  1714	      console.error(`[context-server] Working memory: ${workingMemory.isEnabled()}, Co-activation: ${coActivation.isEnabled()}`);
  1715	    } catch (cognitiveErr: unknown) {
  1716	      const message = cognitiveErr instanceof Error ? cognitiveErr.message : String(cognitiveErr);
  1717	      console.warn('[context-server] Cognitive modules partially failed:', message);
  1718	    }
  1719	
  1720	    try {
  1721	      initExtractionAdapter(database, registerAfterToolCallback);
  1722	      console.error('[context-server] Extraction adapter initialized');
  1723	    } catch (extractionErr: unknown) {
  1724	      const message = extractionErr instanceof Error ? extractionErr.message : String(extractionErr);
  1725	      throw new Error(`[context-server] Extraction adapter startup failed: ${message}`);
  1726	    }
  1727	
  1728	    // T059: Archival Manager for automatic archival of ARCHIVED state memories
  1729	    try {
  1730	      archivalManager.init(database);
  1731	      // Start background archival job (scans every hour by default)
  1732	      archivalManager.startBackgroundJob();
  1733	      if (archivalManager.isBackgroundJobRunning()) {
  1734	        console.error(`[context-server] Archival manager initialized (background job started)`);
  1735	      } else {
  1736	        console.error(`[context-server] Archival manager initialized (background job: not started)`);
  1737	      }
  1738	    } catch (archivalErr: unknown) {
  1739	      const message = archivalErr instanceof Error ? archivalErr.message : String(archivalErr);
  1740	      console.warn('[context-server] Archival manager failed:', message);
  1741	    }
  1742	
  1743	    // T099: Background retry job for pending embeddings (REQ-031, CHK-179)
  1744	    // Processes memories with failed embeddings in the background
  1745	    try {
  1746	      const retryJobResult = retryManager.startBackgroundJob({
  1747	        intervalMs: 5 * 60 * 1000,  // Check every 5 minutes
  1748	        batchSize: 5,               // Process up to 5 pending items per run
  1749	      });
  1750	      if (retryJobResult) {
  1751	        console.error('[context-server] Background retry job started (interval: 5min, batch: 5)');
  1752	      } else {
  1753	        console.error('[context-server] Background retry job already running or disabled');
  1754	      }
  1755	    } catch (retryErr: unknown) {
  1756	      const message = retryErr instanceof Error ? retryErr.message : String(retryErr);
  1757	      console.warn('[context-server] Background retry job failed to start:', message);
  1758	    }
  1759	
  1760	    // REQ-D4-006: Shadow feedback holdout evaluation background scheduler.
  1761	    // Replays recent production queries through a shadow-only path once the
  1762	    // weekly holdout cycle is due. Fail-safe and gated by SPECKIT_SHADOW_FEEDBACK.
  1763	    try {
  1764	      const shadowSchedulerStarted = shadowEvaluationRuntime.startShadowEvaluationScheduler(database);
  1765	      if (shadowSchedulerStarted) {
  1766	        console.error('[context-server] Shadow feedback evaluation scheduler started');
  1767	      } else {
  1768	        console.error('[context-server] Shadow feedback evaluation scheduler not started (already running or disabled)');
  1769	      }
  1770	    } catch (shadowEvalErr: unknown) {
  1771	      const message = shadowEvalErr instanceof Error ? shadowEvalErr.message : String(shadowEvalErr);
  1772	      console.warn('[context-server] Shadow feedback evaluation scheduler failed to start:', message);
  1773	    }
  1774	
  1775	    // REQ-D4-004: Batch feedback learning — runs one cycle at startup (shadow-only, no live ranking mutations).
  1776	    // Feature-flag gated by SPECKIT_BATCH_LEARNED_FEEDBACK (default ON, graduated).
  1777	    try {
  1778	      const batchResult = runBatchLearning(database);
  1779	      if (batchResult.candidatesEvaluated > 0) {
  1780	        console.error(`[context-server] Batch learning: ${batchResult.shadowApplied} shadow-applied, ${batchResult.skippedMinSupport} skipped (min-support), window=${Math.round((batchResult.runAt - batchResult.windowStart) / 86_400_000)}d`);
  1781	      } else {
  1782	        console.error('[context-server] Batch learning: no eligible candidates in window (or flag disabled)');
  1783	      }
  1784	    } catch (batchErr: unknown) {
  1785	      const message = batchErr instanceof Error ? batchErr.message : String(batchErr);
  1786	      console.warn('[context-server] Batch learning failed (non-fatal):', message);
  1787	    }
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
/bin/zsh -lc "rg -n \"memory_search|memory_context|memory_match_triggers|session_bootstrap|session_resume|memory_health|memory_stats|memory_save|code_graph|session_health|tool\\(|register|server\\.tool|name:\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/plugins/spec-kit-compact-code-graph.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/plugins/spec-kit-compact-code-graph.js:296:      spec_kit_compact_code_graph_status: tool({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:91:  registerGlobalRefreshFn,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:214:  'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:215:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:216:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:223:    name: string;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:234:    name: string;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:255:  secondaryTool: 'code_graph_context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:321:    secondaryTool: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:377:// Stores the last resolved session ID so non-search tools (e.g. memory_stats)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:537:            name: neighborNode.fqName,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:565:            name: neighborNode.fqName,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:578:        name: node.fqName,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:815:export function registerAfterToolCallback(fn: AfterToolCallback): void {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:842:  { name: 'context-server', version: '1.7.2' },
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:861:  const requestParams = request.params as { name: string; arguments?: Record<string, unknown> };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:874:    // T018: Track last tool call timestamp for all tools except session_health.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:875:    if (name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:885:    if (name.startsWith('code_graph_')) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1675:    registerGlobalRefreshFn(() => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1721:      initExtractionAdapter(database, registerAfterToolCallback);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   221	    return null;
   222	  }
   223	}
   224	
   225	function extractEventSessionID(event) {
   226	  if (!event || typeof event !== 'object') {
   227	    return null;
   228	  }
   229	
   230	  if (typeof event.sessionID === 'string') {
   231	    return event.sessionID;
   232	  }
   233	
   234	  if (event.properties && typeof event.properties === 'object') {
   235	    if (typeof event.properties.sessionID === 'string') {
   236	      return event.properties.sessionID;
   237	    }
   238	    if (event.properties.info && typeof event.properties.info === 'object') {
   239	      if (typeof event.properties.info.sessionID === 'string') {
   240	        return event.properties.info.sessionID;
   241	      }
   242	      if (typeof event.properties.info.id === 'string') {
   243	        return event.properties.info.id;
   244	      }
   245	    }
   246	    if (event.properties.part && typeof event.properties.part === 'object' && typeof event.properties.part.sessionID === 'string') {
   247	      return event.properties.part.sessionID;
   248	    }
   249	  }
   250	
   251	  return null;
   252	}
   253	
   254	function shouldInvalidateEvent(eventType) {
   255	  return typeof eventType === 'string'
   256	    && (eventType.startsWith('session.') || eventType.startsWith('message.'));
   257	}
   258	
   259	function invalidateTransportCache(sessionID, specFolder) {
   260	  if (sessionID) {

exec
/bin/zsh -lc "rg -n \"registerTool|tool\\(|name: 'memory_|name: \\\"memory_|name: 'session_|name: \\\"session_|name: 'code_graph_|name: \\\"code_graph_\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"memory_search|memory_context|memory_match_triggers|session_bootstrap|session_resume|memory_save|memory_quick_search|code_graph_query|code_graph_context|code_graph_scan|code_graph_status|session_health\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
 succeeded in 0ms:
213:  'code_graph_query',
214:  'code_graph_context',
215:  'code_graph_scan',
216:  'code_graph_status',
254:  preferredTool: 'code_graph_query';
255:  secondaryTool: 'code_graph_context';
257:  preservesAuthority: 'session_bootstrap';
320:    preferredTool: 'code_graph_query',
321:    secondaryTool: 'code_graph_context',
322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
323:    preservesAuthority: 'session_bootstrap',
759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
874:    // T018: Track last tool call timestamp for all tools except session_health.
875:    if (name !== 'session_health') {
882:    if (name === 'memory_context' && args.mode === 'resume') {
886:      recordMetricEvent({ kind: 'code_graph_query' });
912:      name === 'memory_context' && args.mode === 'resume';
964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Generate Context
     4	// ---------------------------------------------------------------
     5	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
     6	    if (k2 === undefined) k2 = k;
     7	    var desc = Object.getOwnPropertyDescriptor(m, k);
     8	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
     9	      desc = { enumerable: true, get: function() { return m[k]; } };
    10	    }
    11	    Object.defineProperty(o, k2, desc);
    12	}) : (function(o, m, k, k2) {
    13	    if (k2 === undefined) k2 = k;
    14	    o[k2] = m[k];
    15	}));
    16	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    17	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    18	}) : function(o, v) {
    19	    o["default"] = v;
    20	});
    21	var __importStar = (this && this.__importStar) || (function () {
    22	    var ownKeys = function(o) {
    23	        ownKeys = Object.getOwnPropertyNames || function (o) {
    24	            var ar = [];
    25	            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    26	            return ar;
    27	        };
    28	        return ownKeys(o);
    29	    };
    30	    return function (mod) {
    31	        if (mod && mod.__esModule) return mod;
    32	        var result = {};
    33	        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    34	        __setModuleDefault(result, mod);
    35	        return result;
    36	    };
    37	})();
    38	Object.defineProperty(exports, "__esModule", { value: true });
    39	exports.main = main;
    40	exports.readAllStdin = readAllStdin;
    41	exports.parseArguments = parseArguments;
    42	exports.validateArguments = validateArguments;
    43	exports.isValidSpecFolder = isValidSpecFolder;
    44	exports.extractPayloadSpecFolder = extractPayloadSpecFolder;
    45	// ───────────────────────────────────────────────────────────────
    46	// 1. GENERATE CONTEXT
    47	// ───────────────────────────────────────────────────────────────
    48	// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
    49	// Node stdlib
    50	const path = __importStar(require("path"));
    51	const fsSync = __importStar(require("fs"));
    52	// Internal modules
    53	const path_security_1 = require("@spec-kit/shared/utils/path-security");
    54	const core_1 = require("../core");
    55	const workflow_1 = require("../core/workflow");
    56	const loaders_1 = require("../loaders");
    57	const collect_session_data_1 = require("../extractors/collect-session-data");
    58	// ───────────────────────────────────────────────────────────────
    59	// 3. HELP TEXT
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
   131	  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
   132	  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
   133	  - Context Delta = postflight.contextScore - preflight.contextScore
   134	  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
   135	`;
   136	if (process.argv.includes('--help') || process.argv.includes('-h')) {
   137	    console.log(HELP_TEXT);
   138	    process.exit(0);
   139	}
   140	// 2.1 SIGNAL HANDLERS
   141	let signalHandlersInstalled = false;
   142	let shuttingDown = false;
   143	// Robustness: signal handler releases locks before reporting
   144	function handleSignalShutdown(signal) {
   145	    if (shuttingDown)
   146	        return; // prevent re-entrant handling
   147	    shuttingDown = true;
   148	    let lockReleaseFailed = false;
   149	    try {
   150	        (0, workflow_1.releaseFilesystemLock)();
   151	    }
   152	    catch (_err) {
   153	        lockReleaseFailed = true;
   154	    }
   155	    console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
   156	    process.exit(lockReleaseFailed ? 1 : 0);
   157	}
   158	function installSignalHandlers() {
   159	    if (signalHandlersInstalled) {
   160	        return;
   161	    }
   162	    process.on('SIGTERM', () => handleSignalShutdown('SIGTERM'));
   163	    process.on('SIGINT', () => handleSignalShutdown('SIGINT'));
   164	    signalHandlersInstalled = true;
   165	}
   166	// ───────────────────────────────────────────────────────────────
   167	// 4. SPEC FOLDER VALIDATION
   168	// ───────────────────────────────────────────────────────────────
   169	function isUnderApprovedSpecsRoot(normalizedInput) {
   170	    return (0, path_security_1.validateFilePath)(path.resolve(core_1.CONFIG.PROJECT_ROOT, normalizedInput), (0, core_1.getSpecsDirectories)()) !== null;
   171	}
   172	function isValidSpecFolder(folderPath) {
   173	    const folderName = path.basename(folderPath);
   174	    // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
   175	    const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
   176	    // Extract the trailing portion that might be "parent/child"
   177	    const trailingSegments = normalizedInput.split('/');
   178	    // Check if the last two segments both match the spec folder pattern
   179	    if (trailingSegments.length >= 2) {
   180	        const lastTwo = trailingSegments.slice(-2);
   181	        if (core_1.SPEC_FOLDER_PATTERN.test(lastTwo[0]) && core_1.SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
   182	            // Both segments are valid spec folder names — valid nested spec folder
   183	            const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
   184	            if (!hasSpecsParent) {
   185	                // Fallback: check if the path resolves to an existing directory under any specs root
   186	                for (const specsDir of (0, core_1.getSpecsDirectories)()) {
   187	                    const candidate = path.join(specsDir, normalizedInput);
   188	                    if (!path.isAbsolute(normalizedInput) &&
   189	                        fsSync.existsSync(candidate) &&
   190	                        (0, path_security_1.validateFilePath)(candidate, (0, core_1.getSpecsDirectories)()) !== null) {
   191	                        return { valid: true };
   192	                    }
   193	                }
   194	                return {
   195	                    valid: false,
   196	                    reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
   197	                };
   198	            }
   199	            return { valid: true };
   200	        }
   201	    }
   202	    if (!core_1.SPEC_FOLDER_PATTERN.test(folderName)) {
   203	        if (/^\d{3}-/.test(folderName)) {
   204	            if (/[A-Z]/.test(folderName)) {
   205	                return { valid: false, reason: 'Spec folder name should be lowercase' };
   206	            }
   207	            if (/_/.test(folderName)) {
   208	                return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
   209	            }
   210	            if (!/^[a-z]/.test(folderName.slice(4))) {
   211	                return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
   212	            }
   213	        }
   214	        return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
   215	    }
   216	    const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
   217	    if (!hasSpecsParent) {
   218	        // Fallback: check if bare name can be resolved via recursive child search
   219	        // (findChildFolderSync in validateArguments handles this, so just report the error here)
   220	        return {
   221	            valid: false,
   222	            reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
   223	        };
   224	    }
   225	    return { valid: true };
   226	}
   227	function resolveCliSpecFolderReference(rawArg) {
   228	    const folderName = path.basename(rawArg);
   229	    const explicitProjectScopedPath = !rawArg.endsWith('.json') && (rawArg.startsWith('specs/') ||
   230	        rawArg.startsWith('.opencode/specs/'))
   231	        ? path.join(core_1.CONFIG.PROJECT_ROOT, rawArg)
   232	        : null;
   233	    let resolvedNestedPath = null;
   234	    if (!rawArg.endsWith('.json')) {
   235	        if (path.isAbsolute(rawArg)) {
   236	            const absoluteSegments = rawArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
   237	            const lastSegment = absoluteSegments.at(-1);
   238	            const parentSegment = absoluteSegments.at(-2);
   239	            if ((lastSegment && core_1.SPEC_FOLDER_PATTERN.test(lastSegment)) ||
   240	                (parentSegment && lastSegment && core_1.SPEC_FOLDER_PATTERN.test(parentSegment) && core_1.SPEC_FOLDER_PATTERN.test(lastSegment))) {
   241	                resolvedNestedPath = rawArg;
   242	            }
   243	        }
   244	        let cleaned = rawArg;
   245	        if (cleaned.startsWith('.opencode/specs/')) {
   246	            cleaned = cleaned.slice('.opencode/specs/'.length);
   247	        }
   248	        else if (cleaned.startsWith('specs/')) {
   249	            cleaned = cleaned.slice('specs/'.length);
   250	        }
   251	        cleaned = cleaned.replace(/\/+$/, '');
   252	        if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
   253	            resolvedNestedPath = explicitProjectScopedPath;
   254	        }
   255	        const segments = cleaned.split('/');
   256	        if (!resolvedNestedPath && segments.length >= 2) {
   257	            for (const specsDir of (0, core_1.getSpecsDirectories)()) {
   258	                const candidate = path.join(specsDir, ...segments);
   259	                if (fsSync.existsSync(candidate)) {
   260	                    resolvedNestedPath = candidate;

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '740,810p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '840,1010p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   840	
   841	const server = new Server(
   842	  { name: 'context-server', version: '1.7.2' },
   843	  { capabilities: { tools: {} } }
   844	);
   845	const serverWithInstructions = server as unknown as { setInstructions?: (instructions: string) => void };
   846	
   847	/* ───────────────────────────────────────────────────────────────
   848	   4. TOOL DEFINITIONS (T303: from tool-schemas.ts)
   849	──────────────────────────────────────────────────────────────── */
   850	
   851	server.setRequestHandler(ListToolsRequestSchema, async () => ({
   852	  tools: TOOL_DEFINITIONS
   853	}));
   854	
   855	/* ───────────────────────────────────────────────────────────────
   856	   5. TOOL DISPATCH (T303: routed through tools/*.ts)
   857	──────────────────────────────────────────────────────────────── */
   858	
   859	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
   931	        autoSurfacedContext = await autoSurfaceAtToolDispatch(name, args);
   932	      } catch (surfaceErr: unknown) {
   933	        const msg = surfaceErr instanceof Error ? surfaceErr.message : String(surfaceErr);
   934	        console.error(`[context-server] Tool-dispatch auto-surface failed (non-fatal): ${msg}`);
   935	      }
   936	    }
   937	    const autoSurfaceLatencyMs = Date.now() - autoSurfaceStart;
   938	    if (autoSurfaceLatencyMs > 250) {
   939	      console.warn(`[context-server] Auto-surface precheck exceeded p95 target: ${autoSurfaceLatencyMs}ms`);
   940	    }
   941	
   942	    // Ensure database is initialized (safe no-op if already done)
   943	    // P1-11 FIX: Module-level guard avoids redundant calls on every tool invocation
   944	    if (!dbInitialized) {
   945	      vectorIndex.initializeDb();
   946	      dbInitialized = true;
   947	    }
   948	
   949	    // T303: Dispatch to tool modules
   950	    const result = await dispatchTool(name, args) as ToolCallResponse | null;
   951	    if (!result) {
   952	      throw new Error(`Unknown tool: ${name}`);
   953	    }
   954	
   955	    let dispatchGraphContext: DispatchGraphContextMeta | null = null;
   956	    if (!result.isError) {
   957	      dispatchGraphContext = await resolveDispatchGraphContext(name, args);
   958	    }
   959	
   960	    runAfterToolCallbacks(name, callId, structuredClone(result));
   961	
   962	    // REQ-014: Log follow_on_tool_use when a non-search tool is called after a recent search
   963	    // Shadow-only: no ranking side effects. Fail-safe, never throws.
   964	    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
   965	      try {
   966	        const { logFollowOnToolUse } = await import('./lib/feedback/query-flow-tracker.js');
   967	        const { requireDb } = await import('./utils/index.js');
   968	        const db = (() => { try { return requireDb(); } catch { return null; } })();
   969	        const followOnSessionId = sessionTrackingId ?? lastKnownSessionId;
   970	        if (db && followOnSessionId) {
   971	          logFollowOnToolUse(db, followOnSessionId);
   972	        }
   973	      } catch { /* follow_on_tool_use logging must never break dispatch */ }
   974	    }
   975	
   976	    // Phase 024: Code-search redirect hint for memory tools
   977	    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
   978	      const queryStr = typeof args.query === 'string' ? args.query : typeof args.input === 'string' ? args.input : '';
   979	      const codeSearchPattern = /\b(find code|implementation of|function that|where is|how does .+ work|class that|method for)\b/i;
   980	      if (queryStr && codeSearchPattern.test(queryStr)) {
   981	        try {
   982	          const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
   983	          if (envelope && typeof envelope === 'object' && !Array.isArray(envelope)) {
   984	            const existingHints = Array.isArray(envelope.hints) ? envelope.hints as string[] : [];
   985	            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
   986	            envelope.hints = existingHints;
   987	            result.content[0].text = JSON.stringify(envelope, null, 2);
   988	          }
   989	        } catch {
   990	          // Response is not JSON envelope — skip hint injection
   991	        }
   992	      }
   993	
   994	      if (queryStr) {
   995	        try {
   996	          const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
   997	          if (envelope && typeof envelope === 'object' && !Array.isArray(envelope)) {
   998	            const meta = typeof envelope.meta === 'object' && envelope.meta !== null && !Array.isArray(envelope.meta)
   999	              ? envelope.meta as Record<string, unknown>
  1000	              : {};
  1001	            const snapshot = getSessionSnapshot();
  1002	            const nudge = meta.structuralRoutingNudge
  1003	              ? null
  1004	              : maybeStructuralNudge(queryStr, {
  1005	                graphReady: snapshot.graphFreshness === 'fresh',
  1006	                activationScaffoldReady: snapshot.primed,
  1007	                surface: 'response-hints',
  1008	              });
  1009	            if (nudge) {
  1010	              injectStructuralRoutingNudge(envelope, nudge);

2026-04-10T19:31:25.883930Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "python3 - <<'PY'
from pathlib import Path
import re
p=Path('.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py')
text=p.read_text()
# rough count of top-level keys in TOOLS dict
keys=re.findall(r'\\n\\s+\"(mempalace_["'^"]+)": '"\\{', text)
print(len(keys))
print('\\n'.join(keys))
PY"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
codex
The environment is consistently blocking here-doc temp files, which explains the validator’s odd “passed with temp-file error” state too. I’m avoiding that path now and sticking to straight reads/regex queries so the evidence stays clean.
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re; text=Path(\".opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py\").read_text(); keys=re.findall(r\"\\n\\s+\\\"(mempalace_["'^'"\\\"]+)\\\": \\{\", text); print(len(keys)); print(\"\\n\".join(keys))'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 2188ms:
2026-04-10 21:31:31.704 xcodebuild[56593:36309330]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 21:31:31.880 xcodebuild[56593:36309329] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-4R12KS2N' (errno=Operation not permitted)
2026-04-10 21:31:32.443 xcodebuild[56623:36309432]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 21:31:32.646 xcodebuild[56623:36309429] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
19
mempalace_status
mempalace_list_wings
mempalace_list_rooms
mempalace_get_taxonomy
mempalace_get_aaak_spec
mempalace_kg_query
mempalace_kg_add
mempalace_kg_invalidate
mempalace_kg_timeline
mempalace_kg_stats
mempalace_traverse
mempalace_find_tunnels
mempalace_graph_stats
mempalace_search
mempalace_check_duplicate
mempalace_add_drawer
mempalace_delete_drawer
mempalace_diary_write
mempalace_diary_read

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Tool Schemas
     3	// ───────────────────────────────────────────────────────────────
     4	// All MCP tool definitions (names, descriptions, input schemas).
     5	// Extracted from context-server.ts for maintainability (T303).
     6	import {
     7	  MAX_INGEST_PATHS,
     8	  MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS,
     9	} from './schemas/tool-input-schemas.js';
    10	
    11	/**
    12	 * Re-export schema validation helpers used by the MCP tool entry points.
    13	 */
    14	export {
    15	  ToolSchemaValidationError,
    16	  formatZodError,
    17	  getToolSchema,
    18	  validateToolArgs,
    19	  getSchema,
    20	} from './schemas/tool-input-schemas.js';
    21	
    22	// ───────────────────────────────────────────────────────────────
    23	// 1. TYPES
    24	
    25	// ───────────────────────────────────────────────────────────────
    26	/**
    27	 * Normalized definition for a single MCP tool and its JSON schema.
    28	 */
    29	export interface ToolDefinition {
    30	  name: string;
    31	  description: string;
    32	  inputSchema: Record<string, unknown>;
    33	  outputSchema?: Record<string, unknown>;
    34	}
    35	
    36	// ───────────────────────────────────────────────────────────────
    37	// 2. TOOL DEFINITIONS
    38	
    39	// ───────────────────────────────────────────────────────────────
    40	// T061: L1 Orchestration - Unified entry point (Token Budget: 3500)
    41	const memoryContext: ToolDefinition = {
    42	  name: 'memory_context',
    43	  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
    44	  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
    45	};
    46	
    47	// L2: Core - Primary operations (Token Budget: 3500)
    48	const memorySearch: ToolDefinition = {
    49	  name: 'memory_search',
    50	  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
    51	  inputSchema: {
    52	    type: 'object',
    53	    additionalProperties: false,
    54	    'x-requiredAnyOf': [['query'], ['concepts'], ['cursor']],
    55	    properties: {
    56	      cursor: {
    57	        type: 'string',
    58	        minLength: 1,
    59	        description: 'Opaque continuation cursor returned by progressive disclosure. When provided, resolves the next page without requiring a new query.'
    60	      },
    61	      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
    62	      concepts: {
    63	        type: 'array',
    64	        items: { type: 'string', minLength: 1 },
    65	        minItems: 2,
    66	        maxItems: 5,
    67	        description: 'Multiple concepts for AND search (requires 2-5 concepts). Results must match ALL concepts.'
    68	      },
    69	      specFolder: { type: 'string', description: 'Limit search to a specific spec folder (e.g., "011-spec-kit-memory-upgrade")' },
    70	      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval. When provided with scope enforcement, results are isolated to this tenant.' },
    71	      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
    72	      agentId: { type: 'string', description: 'Agent boundary for governed retrieval. Filters agent-scoped memories.' },
    73	      sharedSpaceId: { type: 'string', description: 'Shared-memory space identifier. Requires explicit membership when shared memory rollout is enabled.' },
    74	      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum number of results to return (1-100)' },
    75	      sessionId: {
    76	        type: 'string',
    77	        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
    78	      },
    79	      enableDedup: {
    80	        type: 'boolean',
    81	        default: true,
    82	        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
    83	      },
    84	      tier: { type: 'string', description: 'Filter by importance tier (constitutional, critical, important, normal, temporary, deprecated)' },
    85	      contextType: { type: 'string', description: 'Filter by context type (decision, implementation, research, etc.)' },
    86	      useDecay: { type: 'boolean', default: true, description: 'Apply temporal decay scoring to results' },
    87	      includeContiguity: { type: 'boolean', default: false, description: 'Include adjacent/contiguous memories in results' },
    88	      includeConstitutional: {
    89	        type: 'boolean',
    90	        default: true,
    91	        description: 'Include constitutional tier memories at top of results (default: true)'
    92	      },
    93	      enableSessionBoost: {
    94	        type: 'boolean',
    95	        description: 'Enable session-based score boost from working_memory attention signals. Defaults to SPECKIT_SESSION_BOOST env flag.'
    96	      },
    97	      enableCausalBoost: {
    98	        type: 'boolean',
    99	        description: 'Enable causal-neighbor boost (2-hop traversal on causal_edges). Defaults to SPECKIT_CAUSAL_BOOST env flag.'
   100	      },
   101	      includeContent: {
   102	        type: 'boolean',
   103	        default: false,
   104	        description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls. When implicit feedback logging is enabled, includeContent searches also emit shadow-only result_cited events for returned memories.'
   105	      },
   106	      anchors: {
   107	        type: 'array',
   108	        items: { type: 'string' },
   109	        description: 'Specific anchor IDs to extract from content. If provided, returned content will be filtered to only these sections. Requires includeContent: true.'
   110	      },
   111	      profile: {
   112	        type: 'string',
   113	        enum: ['quick', 'research', 'resume', 'debug'],
   114	        description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.'
   115	      },
   116	      min_quality_score: {
   117	        type: 'number',
   118	        minimum: 0,
   119	        maximum: 1,
   120	        description: 'Minimum quality score threshold (0.0-1.0). Results with lower quality_score are filtered out.'
   121	      },
   122	      minQualityScore: {
   123	        type: 'number',
   124	        minimum: 0,
   125	        maximum: 1,
   126	        description: 'Deprecated alias for min_quality_score. Prefer snake_case parameter name.'
   127	      },
   128	      bypassCache: {
   129	        type: 'boolean',
   130	        default: false,
   131	        description: 'Skip the tool cache and force a fresh search. Useful when underlying data has changed since last cached result.'
   132	      },
   133	      rerank: {
   134	        type: 'boolean',
   135	        default: true,
   136	        description: 'Enable cross-encoder reranking of results. Improves relevance at the cost of additional computation.'
   137	      },
   138	      applyLengthPenalty: {
   139	        type: 'boolean',
   140	        default: true,
   141	        description: 'Apply length-based penalty during reranking. Penalizes very long memories to favor concise, focused results. Only effective when rerank is true.'
   142	      },
   143	      applyStateLimits: {
   144	        type: 'boolean',
   145	        default: false,
   146	        description: 'Apply per-tier quantity limits to results. When true, enforces maximum counts per state tier to balance result diversity.'
   147	      },
   148	      minState: {
   149	        type: 'string',
   150	        enum: ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'],
   151	        default: 'WARM',
   152	        description: 'Minimum memory state to include in results. Memories below this state are filtered out. Order: HOT > WARM > COLD > DORMANT > ARCHIVED.'
   153	      },
   154	      intent: {
   155	        type: 'string',
   156	        enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'],
   157	        description: 'Task intent for weight adjustments (REQ-006). Explicitly set query intent to optimize scoring for specific tasks.'
   158	      },
   159	      autoDetectIntent: {
   160	        type: 'boolean',
   161	        default: true,
   162	        description: 'Auto-detect intent from query if not explicitly specified. When true, classifies query to apply task-specific scoring weights.'
   163	      },
   164	      // Fix #13 : Expose previously hidden handler parameters
   165	      trackAccess: {
   166	        type: 'boolean',
   167	        default: false,
   168	        description: 'When true, writes FSRS strengthening updates to memory_index for each returned result. Off by default to avoid write-on-read side effects.'
   169	      },
   170	      includeArchived: {
   171	        type: 'boolean',
   172	        default: false,
   173	        description: 'Include archived memories in search results. Default: false (archived excluded).'
   174	      },
   175	      mode: {
   176	        type: 'string',
   177	        enum: ['auto', 'deep'],
   178	        default: 'auto',
   179	        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
   180	      },
   181	      includeTrace: {
   182	        type: 'boolean',
   183	        default: false,
   184	        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
   185	      }
   186	    }
   187	  },
   188	};
   189	
   190	// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
   191	const memoryQuickSearch: ToolDefinition = {
   192	  name: 'memory_quick_search',
   193	  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
   194	  inputSchema: {
   195	    type: 'object',
   196	    additionalProperties: false,
   197	    properties: {
   198	      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
   199	      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum results (default 10)' },
   200	      specFolder: { type: 'string', description: 'Restrict to spec folder' },
   201	      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
   202	      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
   203	      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
   204	      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
   205	    },
   206	    required: ['query'],
   207	  },
   208	};
   209	
   210	const memoryMatchTriggers: ToolDefinition = {
   211	  name: 'memory_match_triggers',
   212	  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
   213	  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
   214	};
   215	
   216	// T306: Added asyncEmbedding parameter for non-blocking embedding generation
   217	const memorySave: ToolDefinition = {
   218	  name: 'memory_save',
   219	  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
   220	  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
   221	};
   222	
   223	// L3: Discovery - Browse and explore (Token Budget: 800)
   224	const memoryList: ToolDefinition = {
   225	  name: 'memory_list',
   226	  description: '[L3:Discovery] Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update. Token Budget: 800.',
   227	  inputSchema: { type: 'object', additionalProperties: false, properties: { limit: { type: 'number', default: 20, minimum: 1, maximum: 100, description: 'Maximum results to return (max 100)' }, offset: { type: 'number', default: 0, minimum: 0, description: 'Number of results to skip (for pagination)' }, specFolder: { type: 'string', description: 'Filter by spec folder' }, sortBy: { type: 'string', enum: ['created_at', 'updated_at', 'importance_weight'], description: 'Sort order (default: created_at DESC)' }, includeChunks: { type: 'boolean', default: false, description: 'Include chunk child rows. Default false returns parent memories only for cleaner browsing.' } } },
   228	};
   229	
   230	const memoryStats: ToolDefinition = {
   231	  name: 'memory_stats',
   232	  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
   233	  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum number of folders to return', default: 10 } } },
   234	};
   235	
   236	const memoryHealth: ToolDefinition = {
   237	  name: 'memory_health',
   238	  description: '[L3:Discovery] Check health status of the memory system. Token Budget: 800.',
   239	  inputSchema: {
   240	    type: 'object',
   241	    additionalProperties: false,
   242	    properties: {
   243	      reportMode: {
   244	        type: 'string',
   245	        enum: ['full', 'divergent_aliases'],
   246	        default: 'full',
   247	        description: 'Report mode. full returns system diagnostics; divergent_aliases returns compact divergent alias triage output.'
   248	      },
   249	      limit: {
   250	        type: 'number',
   251	        default: 20,
   252	        minimum: 1,
   253	        maximum: 200,
   254	        description: 'Maximum divergent alias groups to return when reportMode=divergent_aliases (max 200).'
   255	      },
   256	      specFolder: {
   257	        type: 'string',
   258	        description: 'Optional spec folder filter for divergent alias triage mode.'
   259	      },
   260	      autoRepair: {

exec
/bin/zsh -lc "rg -n \"TOOL_DEFINITIONS|memory_context|memory_search|session_bootstrap|code_graph_query|memory_save|memory_quick_search|session_resume\" .opencode/skill/system-spec-kit/mcp_server -g '"'!*dist*'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:30:import { TOOL_DEFINITIONS } from './tool-schemas.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:852:  tools: TOOL_DEFINITIONS
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:11:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:28:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:613:    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:618:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:628:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:416:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:709:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:126:- `code_graph_query` and `code_graph_context` may repair small stale deltas inline
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:427:- `memory_search` (semantic search)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:429:- `memory_save` (index new memories)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:433:- `code_graph_query` (structural relationship queries)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:465:- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:548:### memory_search: Semantic Search
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:550:`memory_search()` runs vector-based similarity search across all indexed memories.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:563:### memory_save: Index a Memory File
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:565:`memory_save()` indexes a single new or updated memory file into the database. For bulk indexing, use `memory_index_scan()` instead.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:791:| `code_graph_query` reports `full_scan` or `inline full scan skipped for read path` | The graph is empty or too stale for bounded read-path repair | Run `code_graph_scan`, then retry the structural read |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1048:           memory_save, memory_index_scan, memory_stats
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:15:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:297:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:303:      recordHistory(nextMemoryId, 'ADD', null, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:304:      recordHistory(memoryId, 'UPDATE', previous.title, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:201:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:323:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:324:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:386:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:7:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
.opencode/skill/system-spec-kit/mcp_server/README.md:10:  - "memory_search"
.opencode/skill/system-spec-kit/mcp_server/README.md:189:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:543:**Read-path readiness:** `ensureCodeGraphReady()` runs automatically inside `code_graph_query` and `code_graph_context`. It checks graph freshness, returns a `readiness` block, and performs bounded inline selective reindex only when the stale set is small enough to repair safely on the read path. Empty graphs, large stale sets, and other full-scan cases remain explicit `code_graph_scan` work.
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
.opencode/skill/system-spec-kit/mcp_server/README.md:563:##### `memory_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:587:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:622:##### `memory_search`
.opencode/skill/system-spec-kit/mcp_server/README.md:646:  "tool": "memory_search",
.opencode/skill/system-spec-kit/mcp_server/README.md:658:##### `memory_quick_search`
.opencode/skill/system-spec-kit/mcp_server/README.md:699:##### `memory_save`
.opencode/skill/system-spec-kit/mcp_server/README.md:723:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:1060:##### `code_graph_query`
.opencode/skill/system-spec-kit/mcp_server/README.md:1326:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:1354:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
.opencode/skill/system-spec-kit/mcp_server/README.md:1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1539:| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
.opencode/skill/system-spec-kit/mcp_server/README.md:1543:| Test a save without committing | `memory_save` | Set `dryRun: true` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1567:{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1581:{ "tool": "memory_save", "arguments": { "filePath": "/path/to/file.md", "dryRun": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/README.md:1721:**Q: What does the dryRun parameter do on memory_save?**
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:26:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:254:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:284:      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:291:          'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:45:- `code-graph/query.ts` - `code_graph_query`: query structural relationships (outline, calls, imports).
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:87:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:88:  'memory_quick_search',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:91:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:471:    toolRoutingRules.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:103:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:105:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:945:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:972:        actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1078:/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1086:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1093:        hint: 'Retry memory_save after checkpoint_restore maintenance completes.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1151:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1174:        action: 'memory_save_shared_space',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1213:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1310:            tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1316:              actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1345:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1441:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1447:          actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1462:        action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1490:            actor: provenanceActor ?? 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1703:        'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1789:const handle_memory_save = handleMemorySave;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1796:  handle_memory_save,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:112:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:398:  memory_search: memorySearchSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:399:  memory_quick_search: memoryQuickSearchSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:401:  memory_save: memorySaveSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:464:  memory_quick_search: ['query', 'limit', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:10:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:11:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:233:export const handle_memory_save = lazyFunction(getMemorySaveModule, 'handle_memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:24:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:143:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:144:      ? 'memory_save: updated indexed memory entry'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:145:      : 'memory_save: created new indexed memory entry',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:150:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:160:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:251:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:269:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:285:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:462:    tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:18:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:36:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:124: * Result payload from reconsolidation pre-checks during memory_save.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:301:                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:322:            reason: `memory_save: reconsolidation ${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:329:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:335:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:4:// MCP tool handler for code_graph_query — queries structural relationships.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:317:/** Handle code_graph_query tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:361:          }, readiness, 'code_graph_query outline payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:400:          }, readiness, 'code_graph_query blast_radius payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:433:          }, readiness, `code_graph_query ${operation} payload`),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:559:          }, readiness, `code_graph_query ${operation} payload`, result.edges[0]
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:18:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:88:            reason: 'memory_save: reinforced existing memory via prediction-error gate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:93:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:99:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:140:          reason: 'memory_save: updated existing memory via prediction-error gate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:145:            tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:151:          actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:109:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:384:  it('C13: Response meta.tool is memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:388:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:8:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:10:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:53:    preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:153:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154:    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:62:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:63:  'memory_quick_search',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:65:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:79:    case 'memory_quick_search': {
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:80:      // E3: Delegate to memory_search with sensible defaults
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:81:      const validated = validateToolArgs('memory_quick_search', args);
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:97:      return relabelResponseTool(response, 'memory_quick_search');
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:100:    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:59:    it('T516-2: handle_memory_search alias is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:60:      expect(typeof handler.handle_memory_search).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:20:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:60:    case 'code_graph_query': {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:27:- `context-tools.ts` - dispatch for `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:40:- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:29:    recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:45:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:54:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:65:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:66:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:75:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:76:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:89:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:  name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:192:  name: 'memory_quick_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:218:  name: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:639:  name: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:878:export const TOOL_DEFINITIONS: ToolDefinition[] = [
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:10:| `query.ts` | `code_graph_query` | Query structural relationships (outline, calls, imports) |
.opencode/skill/system-spec-kit/mcp_server/database/README.md:73:- Structural reads (`code_graph_query`, `code_graph_context`) can perform bounded inline selective refresh against `code-graph.sqlite` when the stale set is small enough.
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:93:1. User queries memory_search
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:307:      const id = mod.recordHistory(1, 'ADD', null, 'reconsolidation test', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:314:      expect(entry!.actor).toBe('mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:353:      'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:47:description: "Durable regression fixture for memory_save UX contract coverage."
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68:Continue validating the \`memory_save\` UX contract with a fixture that is rich enough to satisfy the durable-memory gate while still exercising duplicate no-op, deferred embedding, and post-mutation feedback behavior.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:231:  it('memory_save success response exposes postMutationHooks contract fields and types', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:14:import { TOOL_DEFINITIONS, getSchema, validateToolArgs } from '../tool-schemas';
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:48:    for (const tool of TOOL_DEFINITIONS) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:58:    for (const tool of TOOL_DEFINITIONS) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:65:    const names = TOOL_DEFINITIONS.map((t) => t.name);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:70:    for (const tool of TOOL_DEFINITIONS) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:83:      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:89:      validateToolInputSchema('memory_delete', { id: '42' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:125:      validateToolInputSchema('unknown_tool', { any: 'value' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:133:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:137:    expect(errorSpy.mock.calls.some((call) => String(call[0]).includes('[schema-validation] memory_search:'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:166:      validateToolInputSchema('memory_delete', { id: 42 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:172:      validateToolInputSchema('memory_delete', { id: '42' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:178:      validateToolInputSchema('memory_delete', { specFolder: 'specs/001-test', confirm: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:184:      validateToolInputSchema('memory_delete', { id: 1, specFolder: 'specs/001-test' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:190:      validateToolInputSchema('memory_delete', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:196:      validateToolInputSchema('memory_delete', { specFolder: 'specs/001', confirm: false }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:202:      validateToolInputSchema('memory_delete', { specFolder: 'specs/001', confirm: 'yes' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:208:      validateToolInputSchema('memory_delete', { id: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:216:      validateToolInputSchema('memory_bulk_delete', { tier: 'deprecated', confirm: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:222:      validateToolInputSchema('memory_bulk_delete', { tier: 'deprecated', confirm: false }, TOOL_DEFINITIONS);
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
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:363:  it('public and runtime schemas accept governed scope fields for memory_quick_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:373:      validateToolInputSchema('memory_quick_search', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:375:    expect(validateToolArgs('memory_quick_search', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:398:      const tool = TOOL_DEFINITIONS.find((entry) => entry.name === toolName);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:464:    const driftWhy = TOOL_DEFINITIONS.find((entry) => entry.name === 'memory_drift_why');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:465:    const causalLink = TOOL_DEFINITIONS.find((entry) => entry.name === 'memory_causal_link');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:482:      validateToolInputSchema('memory_health', { reportMode: 'divergent_aliases', limit: 201 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:488:      validateToolInputSchema('memory_health', { autoRepair: true, confirmed: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:501:      validateToolInputSchema('checkpoint_list', { limit: 101 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:507:      validateToolInputSchema('checkpoint_delete', { name: 'danger-zone' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:513:      validateToolInputSchema('checkpoint_delete', { name: 'danger-zone', confirmName: 'danger-zone' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:521:    for (const tool of TOOL_DEFINITIONS) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:536:        validateToolInputSchema(toolName, args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:545:          validateToolInputSchema(toolName, args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:23:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:7:  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:9:  { tool: 'memory_save', handler: 'handleMemorySave', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:33:  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:35:  { camel: 'handleMemorySave', snake: 'handle_memory_save' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:188:    routingParts.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:253:    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:88:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:103:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:143:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:152:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:170:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:176:    expect(review.summary.byAction).toEqual({ memory_save: 2 });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:181:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:189:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:207:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:42:  | 'code_graph_query'
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:104:    case 'code_graph_query':
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:482:describe('T059: autoDetectIntent Parameter (memory_search)', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:274:| Full validation | `runPreflight()` | Before memory_save |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:8:// Feature catalog: Dry-run preflight for memory_save
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
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:713:    const toolSpecific = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:718:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED]
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:725:    const allSearchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:19:        memory_search: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:20:        memory_save: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:49:    toolPattern: /^(grep|memory_search)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:56:    toolPattern: /^(bash|memory_save|memory_update)$/i,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:39:        'handle_memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:673:        actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:680:          actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:62:    expect(contract.recommendedAction).toContain('code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
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
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:396:      set(searchKey, 'search_result', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:423:      const key = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:427:        'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:436:      expect(invalidateByTool('memory_search')).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:439:      const second = withCache('memory_search', args, async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:589:      const key = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:593:        'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:603:      const second = withCache('memory_search', args, async () => 'fresh-after-shutdown');
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:673:Processing steps applied during `memory_save` before a memory is persisted.
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:25:        preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:140:        nextActions: ['Use code_graph_query'],
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:151:      preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:154:    expect(parsed.data.structuralRoutingNudge.message).toContain('Prefer `code_graph_query`');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:280:        recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:295:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:19:import { TOOL_DEFINITIONS } from '../tool-schemas';
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:41:    const result = validateToolArgs('memory_search', {
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:104:    for (const tool of TOOL_DEFINITIONS) {
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:115:    expect(TOOL_DEFINITIONS.length).toBe(43);
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:121:    const ingestTool = TOOL_DEFINITIONS.find(
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:53:  memory_search: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:54:  memory_quick_search: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:57:  memory_save: ERROR_CODES.MEMORY_SAVE_FAILED,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:132:  return buildErrorResponse('memory_search', error, { query });
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:142:const hint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:158:  'memory_save'
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:160:      'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:161:      'memory_quick_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:163:      'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:193:      'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:204:    // T11: TOOL_DEFINITIONS export exists
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:205:    it('T11: TOOL_DEFINITIONS export exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:206:      expect(toolSchemasCode).toMatch(/export\s+const\s+TOOL_DEFINITIONS/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:209:    it('T11b: context-server uses TOOL_DEFINITIONS', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:210:      expect(sourceCode).toMatch(/tools:\s*TOOL_DEFINITIONS/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:288:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:291:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:297:      'code_graph_scan', 'code_graph_query', 'code_graph_status', 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:299:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:318:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:613:      vi.doMock('../tool-schemas', () => ({ TOOL_DEFINITIONS: options?.toolDefinitions ?? [] }))
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:923:        { id: 'call-1', params: { name: 'memory_search', arguments: {} } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:940:      expect(callArgs[0]).toBe('memory_search')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1050:              name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1099:        memoryAwareTools: new Set<string>(['memory_search']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1109:        { id: 'call-5', params: { name: 'memory_search', arguments: { query: 'hook validation' } } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1119:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1127:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1140:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1153:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1160:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1173:          params: { name: 'memory_context', arguments: { input: 'focused retrieval context', mode: 'focused' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1559:      const response = errorsModule!.buildErrorResponse!('memory_search', testError, { query: 'test' })
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1577:      const hint = errorsModule!.getRecoveryHint!('memory_search', 'UNKNOWN_TOOL')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1610:    it('T28: L1 budget = 3500 (memory_context)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1615:      expect(layerDefs!.getTokenBudget!('memory_context')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1618:    it('T28b: L2 budget = 3500 (memory_search)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1623:      expect(layerDefs!.getTokenBudget!('memory_search')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1699:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2080:      'memory_context': '[L1:Orchestration]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2081:      'memory_search': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2083:      'memory_save': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2127:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2128:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2311:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2337:      expect(result).toContain('memory_context')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2338:      expect(result).toContain('memory_search')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2339:      expect(result).toContain('memory_save')
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:509:      'Use memory_save({ dryRun: true }) to validate first',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:513:    toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:542:    toolTip: 'memory_save({ force: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:549:      'Run memory_save({ dryRun: true }) for detailed validation report',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:554:    toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:694:  memory_search: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:742:  memory_save: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:747:        'Create the memory file before calling memory_save',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:770:      toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1:// TEST: memory_search per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:106:describe('T056: memory_search emits per-channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:3:import { TOOL_DEFINITIONS } from '../tool-schemas';
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:111:        memory_context: 'L1',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:112:        memory_search: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:113:        memory_save: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:147:      const toolNames = TOOL_DEFINITIONS.map((tool) => tool.name);
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:162:      for (const tool of TOOL_DEFINITIONS) {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:179:        { tool: 'memory_context', expected: '[L1:Orchestration]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:180:        { tool: 'memory_search', expected: '[L2:Core]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:206:      const result = mod.enhanceDescription('memory_context', 'Some description text');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:212:        { tool: 'memory_search', desc: 'Search memories', prefix: '[L2:Core]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:227:      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:237:        { tool: 'memory_context', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:238:        { tool: 'memory_search', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:255:      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:265:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:272:      expect(info.tools).toContain('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:276:      const info1 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:277:      const info2 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:286:      const info = expectLayerInfo(mod.getLayerInfo('memory_search'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:415:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 780,           // actual: 755 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools + Phase 024 session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:85:      "query": "memory_context returns wrong results when token pressure is high",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:251:      "notes": "From T007b Pattern 3: feature description passed to memory_context before implementation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:415:      "query": "the memory_search tool returns stale results after index rebuild",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:835:      "query": "memory_save keeps failing with duplicate content hash error",
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:117:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:218:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:141:      return 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:158:    if (resolution === 'code_graph_query') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:133:    expect(matchRule('memory_search', 'spec.md error context')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:135:    expect(matchRule('memory_save', 'git commit -m "x"')).not.toBeNull();
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
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:37:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:49:    tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:177:  { tool: 'memory_search', handler: 'handleMemorySearch' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:178:  { tool: 'memory_save', handler: 'handleMemorySave' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
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
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:538:    recordHistory(memoryId, 'ADD', null, parsed.title ?? filePath, params.actor ?? 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:816:      actor: params.actor ?? 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:175:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:116:            'code_graph_query outline payload rejects collapsed scalar fields: trust.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:189:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:86:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:132:  it('returns null for memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:133:    const result = await autoSurfaceAtToolDispatch('memory_search', { query: 'some query' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:147:  it('returns null for memory_save', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:148:    const result = await autoSurfaceAtToolDispatch('memory_save', { filePath: '/some/path.md' });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:31:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:235:   T021-T030: handle_memory_context MAIN HANDLER TESTS
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:239:  it('T021: handle_memory_context is a function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:286:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:287:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:844:  it('T101: handle_memory_context is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:865:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:866:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:899:      meta: { tool: 'memory_search' }
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:50:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:68:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:83:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:91:    expect(getDefaultErrorCodeForTool('memory_save')).toBe('E081');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:626:      expect(md).toContain('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:99:    recordHistory(1, 'ADD', null, 'Version 1', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:103:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:113:    recordHistory(2, 'ADD', null, 'Version 2', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:118:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:12:    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: { tool: 'memory_search' } }) }],
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:41:  it('forwards governed scope fields through memory_quick_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:42:    const response = await handleTool('memory_quick_search', {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:66:    expect(parsed.meta?.tool).toBe('memory_quick_search');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:123:describe('memory_search UX hook integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:60:    it('increments codeGraphQueries on code_graph_query event', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:62:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:304:  `).run(1, 'sess-1', 1, 0.9, now, later, 2, 1, 1, 'memory_search', 'call-1', 'rule-1', 0);
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:181:const key = generateCacheKey('memory_search', { query: 'test' });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:184:set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:196:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:208:// After memory_save operation
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:312:    'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:104:      'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:132:const budget = getTokenBudget('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:139:const enhanced = enhanceDescription('memory_search', 'Search memories');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:73:    ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';

exec
/bin/zsh -lc 'rg -n "def traverse|def find_tunnels|def graph_stats|room|wing|hall|date|return" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
6:  - Nodes = rooms (named ideas)
7:  - Edges = shared rooms across wings (tunnels)
8:  - Edge types = halls (the corridors)
11:  "Start at chromadb-setup in wing_code, walk to wing_myproject"
12:  "Find all rooms connected to riley-college-apps"
13:  "What topics bridge wing_hardware and wing_myproject?"
28:        return client.get_collection(config.collection_name)
30:        return None
38:        nodes: dict of {room: {wings: set, halls: set, count: int}}
39:        edges: list of {room, wing_a, wing_b, hall} — one per tunnel crossing
44:        return {}, []
47:    room_data = defaultdict(lambda: {"wings": set(), "halls": set(), "count": 0, "dates": set()})
53:            room = meta.get("room", "")
54:            wing = meta.get("wing", "")
55:            hall = meta.get("hall", "")
56:            date = meta.get("date", "")
57:            if room and room != "general" and wing:
58:                room_data[room]["wings"].add(wing)
59:                if hall:
60:                    room_data[room]["halls"].add(hall)
61:                if date:
62:                    room_data[room]["dates"].add(date)
63:                room_data[room]["count"] += 1
68:    # Build edges from rooms that span multiple wings
70:    for room, data in room_data.items():
71:        wings = sorted(data["wings"])
72:        if len(wings) >= 2:
73:            for i, wa in enumerate(wings):
74:                for wb in wings[i + 1 :]:
75:                    for hall in data["halls"]:
78:                                "room": room,
79:                                "wing_a": wa,
80:                                "wing_b": wb,
81:                                "hall": hall,
88:    for room, data in room_data.items():
89:        nodes[room] = {
90:            "wings": sorted(data["wings"]),
91:            "halls": sorted(data["halls"]),
93:            "dates": sorted(data["dates"])[-5:] if data["dates"] else [],
96:    return nodes, edges
99:def traverse(start_room: str, col=None, config=None, max_hops: int = 2):
101:    Walk the graph from a starting room. Find connected rooms
102:    through shared wings.
104:    Returns list of paths: [{room, wing, hall, hop_distance}]
108:    if start_room not in nodes:
109:        return {
110:            "error": f"Room '{start_room}' not found",
111:            "suggestions": _fuzzy_match(start_room, nodes),
114:    start = nodes[start_room]
115:    visited = {start_room}
118:            "room": start_room,
119:            "wings": start["wings"],
120:            "halls": start["halls"],
127:    frontier = [(start_room, 0)]
129:        current_room, depth = frontier.pop(0)
133:        current = nodes.get(current_room, {})
134:        current_wings = set(current.get("wings", []))
136:        # Find all rooms that share a wing with current room
137:        for room, data in nodes.items():
138:            if room in visited:
140:            shared_wings = current_wings & set(data["wings"])
141:            if shared_wings:
142:                visited.add(room)
145:                        "room": room,
146:                        "wings": data["wings"],
147:                        "halls": data["halls"],
150:                        "connected_via": sorted(shared_wings),
154:                    frontier.append((room, depth + 1))
158:    return results[:50]  # cap results
161:def find_tunnels(wing_a: str = None, wing_b: str = None, col=None, config=None):
163:    Find rooms that connect two wings (or all tunnel rooms if no wings specified).
164:    These are the "hallways" — same named idea appearing in multiple domains.
169:    for room, data in nodes.items():
170:        wings = data["wings"]
171:        if len(wings) < 2:
174:        if wing_a and wing_a not in wings:
176:        if wing_b and wing_b not in wings:
181:                "room": room,
182:                "wings": wings,
183:                "halls": data["halls"],
185:                "recent": data["dates"][-1] if data["dates"] else "",
190:    return tunnels[:50]
193:def graph_stats(col=None, config=None):
197:    tunnel_rooms = sum(1 for n in nodes.values() if len(n["wings"]) >= 2)
198:    wing_counts = Counter()
200:        for w in data["wings"]:
201:            wing_counts[w] += 1
203:    return {
204:        "total_rooms": len(nodes),
205:        "tunnel_rooms": tunnel_rooms,
207:        "rooms_per_wing": dict(wing_counts.most_common()),
209:            {"room": r, "wings": d["wings"], "count": d["count"]}
210:            for r, d in sorted(nodes.items(), key=lambda x: -len(x[1]["wings"]))[:10]
211:            if len(d["wings"]) >= 2
217:    """Find rooms that approximately match a query string."""
220:    for room in nodes:
222:        if query_lower in room:
223:            scored.append((room, 1.0))
224:        elif any(word in room for word in query_lower.split("-")):
225:            scored.append((room, 0.5))
227:    return [r for r, _ in scored[:n]]

exec
/bin/zsh -lc 'rg -n "class KnowledgeGraph|def add_triple|def query_entity|def invalidate|def timeline|def stats|valid_from|valid_to|sqlite" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
8:  - Temporal validity (valid_from → valid_to — knows WHEN facts are true)
21:    kg.add_triple("Max", "child_of", "Alice", valid_from="2015-04-01")
22:    kg.add_triple("Max", "does", "swimming", valid_from="2025-01-01")
23:    kg.add_triple("Max", "loves", "chess", valid_from="2025-10-01")
41:import sqlite3
46:DEFAULT_KG_PATH = os.path.expanduser("~/.mempalace/knowledge_graph.sqlite3")
49:class KnowledgeGraph:
74:                valid_from TEXT,
75:                valid_to TEXT,
87:            CREATE INDEX IF NOT EXISTS idx_triples_valid ON triples(valid_from, valid_to);
93:            self._connection = sqlite3.connect(self.db_path, timeout=10, check_same_thread=False)
95:            self._connection.row_factory = sqlite3.Row
121:    def add_triple(
126:        valid_from: str = None,
127:        valid_to: str = None,
136:            add_triple("Max", "child_of", "Alice", valid_from="2015-04-01")
137:            add_triple("Max", "does", "swimming", valid_from="2025-01-01")
138:            add_triple("Alice", "worried_about", "Max injury", valid_from="2026-01", valid_to="2026-02")
154:                "SELECT id FROM triples WHERE subject=? AND predicate=? AND object=? AND valid_to IS NULL",
161:            triple_id = f"t_{sub_id}_{pred}_{obj_id}_{hashlib.sha256(f'{valid_from}{datetime.now().isoformat()}'.encode()).hexdigest()[:12]}"
164:                """INSERT INTO triples (id, subject, predicate, object, valid_from, valid_to, confidence, source_closet, source_file)
171:                    valid_from,
172:                    valid_to,
180:    def invalidate(self, subject: str, predicate: str, obj: str, ended: str = None):
181:        """Mark a relationship as no longer valid (set valid_to date)."""
190:                "UPDATE triples SET valid_to=? WHERE subject=? AND predicate=? AND object=? AND valid_to IS NULL",
196:    def query_entity(self, name: str, as_of: str = None, direction: str = "outgoing"):
212:                query += " AND (t.valid_from IS NULL OR t.valid_from <= ?) AND (t.valid_to IS NULL OR t.valid_to >= ?)"
221:                        "valid_from": row["valid_from"],
222:                        "valid_to": row["valid_to"],
225:                        "current": row["valid_to"] is None,
233:                query += " AND (t.valid_from IS NULL OR t.valid_from <= ?) AND (t.valid_to IS NULL OR t.valid_to >= ?)"
242:                        "valid_from": row["valid_from"],
243:                        "valid_to": row["valid_to"],
246:                        "current": row["valid_to"] is None,
265:            query += " AND (t.valid_from IS NULL OR t.valid_from <= ?) AND (t.valid_to IS NULL OR t.valid_to >= ?)"
275:                    "valid_from": row["valid_from"],
276:                    "valid_to": row["valid_to"],
277:                    "current": row["valid_to"] is None,
282:    def timeline(self, entity_name: str = None):
294:                ORDER BY t.valid_from ASC NULLS LAST
305:                ORDER BY t.valid_from ASC NULLS LAST
314:                "valid_from": r["valid_from"],
315:                "valid_to": r["valid_to"],
316:                "current": r["valid_to"] is None,
323:    def stats(self):
328:            "SELECT COUNT(*) as cnt FROM triples WHERE valid_to IS NULL"
368:                    name, "child_of", parent.capitalize(), valid_from=facts.get("birthday")
381:                    valid_from=facts.get("birthday"),
393:                self.add_triple(name, "loves", interest.capitalize(), valid_from="2025-01-01")

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I’ve finished the core source trace. The remaining pass is tightening the comparison against Public’s actual tool surface so the final output can stay focused on net-new tool/API findings instead of drifting back into storage or taxonomy.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '286,372p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   286	
   287	### rollout_summary_files
   288	
   289	- rollout_summaries/2026-04-08T06-49-08-WFmZ-mem_palace_phase_prompt.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-49-08-019d6bda-1819-7e43-99e3-158cdec78925.jsonl, updated_at=2026-04-08T06:56:04+00:00, thread_id=019d6bda-1819-7e43-99e3-158cdec78925)
   290	
   291	### keywords
   292	
   293	- 005-mempalace, phase-research-prompt.md, dont ask for a spec folder, 13-section TIDD-EC, source-confirmed README-documented benchmark-documented, raw-verbatim hooks taxonomy temporal KG
   294	
   295	## Task 2: Extend Contextador deep-research from 13 to 20 iterations and fold into v2 synthesis without changing verdict, outcome success
   296	
   297	### rollout_summary_files
   298	
   299	- rollout_summaries/2026-04-08T06-55-41-FaWO-contextador_deep_research_extension.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-55-41-019d6be0-1720-7040-8abd-586be20dce1e.jsonl, updated_at=2026-04-08T07:50:02+00:00, thread_id=019d6be0-1720-7040-8abd-586be20dce1e)
   300	
   301	### keywords
   302	
   303	- 003-contextador, spec_kit:deep-research, maxIterations 20, deep-research-config.json, reduce-state.cjs, research-v2.md, recommendations-v2.md, findings-registry-v2.json, F-CROSS-089..F-CROSS-093
   304	
   305	## Task 3: Absorb Claudest continuation into master v2 execution-ready lane, outcome success
   306	
   307	### rollout_summary_files
   308	
   309	- rollout_summaries/2026-04-08T06-54-25-D2rK-claudest_continuation_root_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-54-25-019d6bde-f06d-7992-8c23-62eaead4b928.jsonl, updated_at=2026-04-08T07:59:19+00:00, thread_id=019d6bde-f06d-7992-8c23-62eaead4b928)
   310	
   311	### keywords
   312	
   313	- 005-claudest, execution-ready lane, FTS helper forced-degrade matrix, stop-hook metadata patch, normalized analytics reader, cached-summary fast path, verifier discoverer split, token-insight contracts
   314	
   315	## Task 4: Sync Graphify translation closeout into master v2 without touching v1 artifacts, outcome partial
   316	
   317	### rollout_summary_files
   318	
   319	- rollout_summaries/2026-04-08T06-55-14-iMh2-graphify_translation_closeout_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-55-14-019d6bdf-ae9f-71d3-9b12-ee5c943b14d0.jsonl, updated_at=2026-04-08T08:12:09+00:00, thread_id=019d6bdf-ae9f-71d3-9b12-ee5c943b14d0)
   320	
   321	### keywords
   322	
   323	- 004-graphify, F-CROSS-094..F-CROSS-098, payload bridge contract fit, session-prime compact-inject response-hints, local-file multimodal lane, Appendix D, leave v1 files untouched
   324	
   325	## Task 5: Clean root/child recovery memories after 20-iteration extension and restore strict-clean packet baseline, outcome success
   326	
   327	### rollout_summary_files
   328	
   329	- rollout_summaries/2026-04-08T06-56-02-48S0-spec_kit_deep_research_memory_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-56-02-019d6be0-6b03-7ea3-9035-9aa81613caa4.jsonl, updated_at=2026-04-08T08:54:40+00:00, thread_id=019d6be0-6b03-7ea3-9035-9aa81613caa4)
   330	
   331	### keywords
   332	
   333	- 002-codesight, completed-continue, memory cleanup, Continue implementation, IN_PROGRESS, quality score: 0/100, PASS-WITH-CAVEATS, validate.sh --strict, adr-002, decision-record.md
   334	
   335	## Task 6: Harmonize `002-implement-cache-warning-hooks` with canonical post-2026-04-08 research sequencing and acceptance criteria, outcome success
   336	
   337	### rollout_summary_files
   338	
   339	- rollout_summaries/2026-04-08T09-18-00-WHKH-update_cache_warning_and_close_normalized_analytics.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T11-18-00-019d6c62-646b-7423-8d05-2b4bfa1536db.jsonl, updated_at=2026-04-08T11:11:26+00:00, thread_id=019d6c62-646b-7423-8d05-2b4bfa1536db)
   340	
   341	### keywords
   342	
   343	- 002-implement-cache-warning-hooks, canonical research, sequencing prerequisites acceptance criteria, producer metadata, normalized analytics reader, cache token carry-forward, bootstrap authority, UserPromptSubmit demoted
   344	
   345	## Task 7: Close `024-compact-code-graph/031-normalized-analytics-reader` with strict completion and memory-index cleanup, outcome success
   346	
   347	### rollout_summary_files
   348	
   349	- rollout_summaries/2026-04-08T09-18-00-WHKH-update_cache_warning_and_close_normalized_analytics.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T11-18-00-019d6c62-646b-7423-8d05-2b4bfa1536db.jsonl, updated_at=2026-04-08T11:11:26+00:00, thread_id=019d6c62-646b-7423-8d05-2b4bfa1536db, task-local focus=031 closeout)
   350	
   351	### keywords
   352	
   353	- 031-normalized-analytics-reader, spec status Complete, validate.sh --strict, check-completion.sh, checklist P0/P1 totals, description.json timestamp, memory_delete, memory_index_scan, lineage mismatch
   354	
   355	## Task 8: Implement follow-on Level-3 phase train for 026 and 024 with strict validator-clean packet wiring, outcome success
   356	
   357	### rollout_summary_files
   358	
   359	- rollout_summaries/2026-04-08T12-06-36-AZZJ-026_graph_follow_on_phases.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T14-06-36-019d6cfc-bd8a-7db3-af4f-bdf3ebaec677.jsonl, updated_at=2026-04-08T13:21:12+00:00, thread_id=019d6cfc-bd8a-7db3-af4f-bdf3ebaec677)
   360	
   361	### keywords
   362	
   363	- 026-graph-and-context-optimization, 024-compact-code-graph, 026/005-009, 024/032-034, AI Execution Protocol, SECTION_COUNTS, PHASE_LINKS, SPEC_DOC_INTEGRITY, validate.sh --strict, --no-recursive, implement the plan
   364	
   365	## User preferences
   366	
   367	- when the user asked to "create a similar prompt for ...005-mempalace ... dont ask for a spec folder," place `phase-research-prompt.md` in the phase root and skip new spec-folder scaffolding [Task 1]
   368	- when the user asked "Run /spec_kit:deep-research ... get tot 20 total iterations so add 7 more," treat it as resume of the active lineage, not a fork [Task 2]
   369	- when asked to fold the extension into active v2 synthesis "without changing the overall verdict or top-10 ordering," integrate new evidence/counts without re-ranking master recommendations [Task 2]
   370	- when folding closeouts into the root, the user insisted to "leave v1 files untouched" and only update active `research-v2` artifacts [Task 4]
   371	- after strict validation surfaced low-quality resume artifacts, the user said “do manually rewrite or adjust memories if you deemed quality low” -> manually repair latest `memory/*.md` snapshots when stale “Continue implementation” / `IN_PROGRESS` cues no longer match packet reality [Task 5]
   372	- when the user asked to “update ... in place so it aligns with the current canonical research ... including sequencing, prerequisites, and acceptance criteria,” re-anchor packet docs to the latest master synthesis instead of older phase framing [Task 6]

exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re; text=Path(\".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts\").read_text(); print(len(re.findall(r\"name: '\\''[a-z_]+\\''\", text)))'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 1921ms:
2026-04-10 21:31:53.782 xcodebuild[58354:36312603]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 21:31:53.934 xcodebuild[58354:36312602] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-AikNE6es' (errno=Operation not permitted)
2026-04-10 21:31:54.435 xcodebuild[58378:36312669]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 21:31:54.585 xcodebuild[58378:36312657] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
  File "<string>", line 1
    from pathlib import Path; import re; text=Path(".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts").read_text(); print(len(re.findall(r"name: '[a-z_]+\", text)))
                                                                                                                                                                              ^
SyntaxError: EOL while scanning string literal

exec
/bin/zsh -lc "rg -n \"name: '[a-z_]+',\" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | wc -l" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      47

exec
/bin/zsh -lc 'rg -n "class OnboardingWizard|def run|identity|AAAK|bootstrap|wing_config|guided|question|write_text|json" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
266:def _generate_aaak_bootstrap(
270:    Generate AAAK entity registry + critical facts bootstrap from onboarding data.
276:    # Build AAAK entity codes (first 3 letters of name, uppercase)
286:    # AAAK entity registry
288:        "# AAAK Entity Registry",
308:            "## AAAK Quick Reference",
315:    (mempalace_dir / "aaak_entities.md").write_text("\n".join(registry_lines), encoding="utf-8")
317:    # Critical facts bootstrap (pre-palace — before any mining)
319:        "# Critical Facts (bootstrap — will be enriched after mining)",
362:    (mempalace_dir / "critical_facts.md").write_text("\n".join(facts_lines), encoding="utf-8")
365:def run_onboarding(
436:    # Generate AAAK entity registry + critical facts bootstrap
437:    _generate_aaak_bootstrap(people, projects, wings, mode, config_dir)
445:    print("\n  AAAK entity registry: ~/.mempalace/aaak_entities.md")
446:    print("  Critical facts bootstrap: ~/.mempalace/critical_facts.md")

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py | sed -n '260,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	
   261	# ─────────────────────────────────────────────────────────────────────────────
   262	# Main onboarding flow
   263	# ─────────────────────────────────────────────────────────────────────────────
   264	
   265	
   266	def _generate_aaak_bootstrap(
   267	    people: list, projects: list, wings: list, mode: str, config_dir: Path = None
   268	):
   269	    """
   270	    Generate AAAK entity registry + critical facts bootstrap from onboarding data.
   271	    These files teach the AI about the user's world from session one.
   272	    """
   273	    mempalace_dir = Path(config_dir) if config_dir else Path.home() / ".mempalace"
   274	    mempalace_dir.mkdir(parents=True, exist_ok=True)
   275	
   276	    # Build AAAK entity codes (first 3 letters of name, uppercase)
   277	    entity_codes = {}
   278	    for p in people:
   279	        name = p["name"]
   280	        code = name[:3].upper()
   281	        # Handle collisions
   282	        while code in entity_codes.values():
   283	            code = name[:4].upper()
   284	        entity_codes[name] = code
   285	
   286	    # AAAK entity registry
   287	    registry_lines = [
   288	        "# AAAK Entity Registry",
   289	        "# Auto-generated by mempalace init. Update as needed.",
   290	        "",
   291	        "## People",
   292	    ]
   293	    for p in people:
   294	        name = p["name"]
   295	        code = entity_codes[name]
   296	        rel = p.get("relationship", "")
   297	        registry_lines.append(f"  {code}={name} ({rel})" if rel else f"  {code}={name}")
   298	
   299	    if projects:
   300	        registry_lines.extend(["", "## Projects"])
   301	        for proj in projects:
   302	            code = proj[:4].upper()
   303	            registry_lines.append(f"  {code}={proj}")
   304	
   305	    registry_lines.extend(
   306	        [
   307	            "",
   308	            "## AAAK Quick Reference",
   309	            "  Symbols: ♡=love ★=importance ⚠=warning →=relationship |=separator",
   310	            "  Structure: KEY:value | GROUP(details) | entity.attribute",
   311	            "  Read naturally — expand codes, treat *markers* as emotional context.",
   312	        ]
   313	    )
   314	
   315	    (mempalace_dir / "aaak_entities.md").write_text("\n".join(registry_lines), encoding="utf-8")
   316	
   317	    # Critical facts bootstrap (pre-palace — before any mining)
   318	    facts_lines = [
   319	        "# Critical Facts (bootstrap — will be enriched after mining)",
   320	        "",
   321	    ]
   322	
   323	    personal_people = [p for p in people if p.get("context") == "personal"]
   324	    work_people = [p for p in people if p.get("context") == "work"]
   325	
   326	    if personal_people:
   327	        facts_lines.append("## People (personal)")
   328	        for p in personal_people:
   329	            code = entity_codes[p["name"]]
   330	            rel = p.get("relationship", "")
   331	            facts_lines.append(
   332	                f"- **{p['name']}** ({code}) — {rel}" if rel else f"- **{p['name']}** ({code})"
   333	            )
   334	        facts_lines.append("")
   335	
   336	    if work_people:
   337	        facts_lines.append("## People (work)")
   338	        for p in work_people:
   339	            code = entity_codes[p["name"]]
   340	            rel = p.get("relationship", "")
   341	            facts_lines.append(
   342	                f"- **{p['name']}** ({code}) — {rel}" if rel else f"- **{p['name']}** ({code})"
   343	            )
   344	        facts_lines.append("")
   345	
   346	    if projects:
   347	        facts_lines.append("## Projects")
   348	        for proj in projects:
   349	            facts_lines.append(f"- **{proj}**")
   350	        facts_lines.append("")
   351	
   352	    facts_lines.extend(
   353	        [
   354	            "## Palace",
   355	            f"Wings: {', '.join(wings)}",
   356	            f"Mode: {mode}",
   357	            "",
   358	            "*This file will be enriched by palace_facts.py after mining.*",
   359	        ]
   360	    )
   361	
   362	    (mempalace_dir / "critical_facts.md").write_text("\n".join(facts_lines), encoding="utf-8")
   363	
   364	
   365	def run_onboarding(
   366	    directory: str = ".",
   367	    config_dir: Path = None,
   368	    auto_detect: bool = True,
   369	) -> EntityRegistry:
   370	    """
   371	    Run the full onboarding flow.
   372	    Returns the seeded EntityRegistry.
   373	    """
   374	    # Step 1: Mode
   375	    mode = _ask_mode()
   376	
   377	    # Step 2: People
   378	    people, aliases = _ask_people(mode)
   379	
   380	    # Step 3: Projects
   381	    projects = _ask_projects(mode)
   382	
   383	    # Step 4: Wings (stored in config, not registry — just show user)
   384	    wings = _ask_wings(mode)
   385	
   386	    # Step 5: Auto-detect additional people from files
   387	    if auto_detect and _yn("\nScan your files for additional names we might have missed?"):
   388	        directory = _ask("Directory to scan", default=directory)
   389	        detected = _auto_detect(directory, people)
   390	        if detected:
   391	            _hr()
   392	            print(f"\n  Found {len(detected)} additional name candidates:\n")
   393	            for e in detected:
   394	                print(
   395	                    f"    {e['name']:20} confidence={e['confidence']:.0%}  "
   396	                    f"({', '.join(e['signals'][:1])})"
   397	                )
   398	            print()
   399	            if _yn("  Add any of these to your registry?"):
   400	                for e in detected:
   401	                    ans = input(f"    {e['name']} — (p)erson, (s)kip? ").strip().lower()
   402	                    if ans == "p":
   403	                        rel = input(f"    Relationship/role for {e['name']}? ").strip()
   404	                        ctx = (
   405	                            "personal"
   406	                            if mode == "personal"
   407	                            else (
   408	                                "work"
   409	                                if mode == "work"
   410	                                else input("    Context — (p)ersonal or (w)ork? ")
   411	                                .strip()
   412	                                .lower()
   413	                                .replace("w", "work")
   414	                                .replace("p", "personal")
   415	                            )
   416	                        )
   417	                        people.append({"name": e["name"], "relationship": rel, "context": ctx})
   418	
   419	    # Step 6: Warn about ambiguous names
   420	    ambiguous = _warn_ambiguous(people)
   421	    if ambiguous:
   422	        _hr()
   423	        print(f"""
   424	  Heads up — these names are also common English words:
   425	    {", ".join(ambiguous)}
   426	
   427	  MemPalace will check the context before treating them as person names.
   428	  For example: "I picked up Riley" → person.
   429	               "Have you ever tried" → adverb.
   430	""")
   431	
   432	    # Build and save registry
   433	    registry = EntityRegistry.load(config_dir)
   434	    registry.seed(mode=mode, people=people, projects=projects, aliases=aliases)
   435	
   436	    # Generate AAAK entity registry + critical facts bootstrap
   437	    _generate_aaak_bootstrap(people, projects, wings, mode, config_dir)
   438	
   439	    # Summary
   440	    _header("Setup Complete")
   441	    print()
   442	    print(f"  {registry.summary()}")
   443	    print(f"\n  Wings: {', '.join(wings)}")
   444	    print(f"\n  Registry saved to: {registry._path}")
   445	    print("\n  AAAK entity registry: ~/.mempalace/aaak_entities.md")
   446	    print("  Critical facts bootstrap: ~/.mempalace/critical_facts.md")
   447	    print("\n  Your AI will know your world from the first session.")
   448	    print()
   449	
   450	    return registry
   451	
   452	
   453	# ─────────────────────────────────────────────────────────────────────────────
   454	# Quick setup (non-interactive, for testing)
   455	# ─────────────────────────────────────────────────────────────────────────────
   456	
   457	
   458	def quick_setup(
   459	    mode: str,
   460	    people: list,
   461	    projects: list = None,
   462	    aliases: dict = None,
   463	    config_dir: Path = None,
   464	) -> EntityRegistry:
   465	    """
   466	    Programmatic setup without interactive prompts.
   467	    Used in tests and benchmark scripts.
   468	
   469	    people: list of dicts {"name": str, "relationship": str, "context": str}
   470	    """

exec
/bin/zsh -lc 'rg -n "gemini|cursor|chatgpt|claude-code|codex|profile|harness" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh:27:# For Codex CLI, add to .codex/hooks.json:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/convo_import.py:8:print("  mempalace mine ~/chatgpt-exports/ --mode convos")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md:47:Add to `.codex/hooks.json`:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:3:This guide explains how to set up MemPalace as a permanent memory for the [Gemini CLI](https://github.com/google/gemini-cli).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:46:gemini mcp add mempalace /absolute/path/to/mempalace/.venv/bin/python3 -m mempalace.mcp_server --scope user
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:54:Edit your `~/.gemini/settings.json` and add the following:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:6:Supported harnesses: claude-code, codex (extensible to cursor, gemini, etc.)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:114:SUPPORTED_HARNESSES = {"claude-code", "codex"}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:117:def _parse_harness_input(data: dict, harness: str) -> dict:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:118:    """Parse stdin JSON according to the harness type."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:119:    if harness not in SUPPORTED_HARNESSES:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:120:        print(f"Unknown harness: {harness}", file=sys.stderr)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:129:def hook_stop(data: dict, harness: str):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:131:    parsed = _parse_harness_input(data, harness)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:175:def hook_session_start(data: dict, harness: str):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:177:    parsed = _parse_harness_input(data, harness)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:189:def hook_precompact(data: dict, harness: str):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:191:    parsed = _parse_harness_input(data, harness)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:215:def run_hook(hook_name: str, harness: str):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py:234:    handler(data, harness)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh:28:# For Codex CLI, add to .codex/hooks.json:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/normalize.py:65:    normalized = _try_codex_jsonl(content)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/normalize.py:74:    for parser in (_try_claude_ai_json, _try_chatgpt_json, _try_slack_json):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/normalize.py:108:def _try_codex_jsonl(content: str) -> Optional[str]:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/normalize.py:109:    """OpenAI Codex CLI sessions (~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/normalize.py:199:def _try_chatgpt_json(data) -> Optional[str]:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:244:    run_hook(hook_name=args.hook, harness=args.harness)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:514:        "--harness",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:516:        choices=["claude-code", "codex"],
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions/help.md:64:    mempalace hook run                    Run hook logic (for harness integration)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions/help.md:83:    echo '{"session_id":"abc","stop_hook_active":false,"transcript_path":"..."}' | mempalace hook run --hook stop --harness claude-code

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/__init__.py | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	"""MemPalace — Give your AI a memory. No API key required."""
     2	
     3	import logging
     4	import os
     5	import platform
     6	
     7	from .cli import main  # noqa: E402
     8	from .version import __version__  # noqa: E402
     9	
    10	# ChromaDB 0.6.x ships a Posthog telemetry client whose capture() signature is
    11	# incompatible with the bundled posthog library, producing noisy stderr warnings
    12	# on every client operation ("Failed to send telemetry event … capture() takes
    13	# 1 positional argument but 3 were given").  Silence just that logger.
    14	logging.getLogger("chromadb.telemetry.product.posthog").setLevel(logging.CRITICAL)
    15	
    16	# ONNX Runtime's CoreML provider segfaults during vector queries on Apple Silicon.
    17	# Force CPU execution unless the user has explicitly set a preference.
    18	if platform.machine() == "arm64" and platform.system() == "Darwin":
    19	    os.environ.setdefault("ORT_DISABLE_COREML", "1")
    20	
    21	__all__ = ["main", "__version__"]

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/config.py | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	"""
     2	MemPalace configuration system.
     3	
     4	Priority: env vars > config file (~/.mempalace/config.json) > defaults
     5	"""
     6	
     7	import json
     8	import os
     9	import re
    10	from pathlib import Path
    11	
    12	
    13	# ── Input validation ──────────────────────────────────────────────────────────
    14	# Shared sanitizers for wing/room/entity names. Prevents path traversal,
    15	# excessively long strings, and special characters that could cause issues
    16	# in file paths, SQLite, or ChromaDB metadata.
    17	
    18	MAX_NAME_LENGTH = 128
    19	_SAFE_NAME_RE = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9_ .'-]{0,126}[a-zA-Z0-9]?$")
    20	
    21	
    22	def sanitize_name(value: str, field_name: str = "name") -> str:
    23	    """Validate and sanitize a wing/room/entity name.
    24	
    25	    Raises ValueError if the name is invalid.
    26	    """
    27	    if not isinstance(value, str) or not value.strip():
    28	        raise ValueError(f"{field_name} must be a non-empty string")
    29	
    30	    value = value.strip()
    31	
    32	    if len(value) > MAX_NAME_LENGTH:
    33	        raise ValueError(f"{field_name} exceeds maximum length of {MAX_NAME_LENGTH} characters")
    34	
    35	    # Block path traversal
    36	    if ".." in value or "/" in value or "\\" in value:
    37	        raise ValueError(f"{field_name} contains invalid path characters")
    38	
    39	    # Block null bytes
    40	    if "\x00" in value:
    41	        raise ValueError(f"{field_name} contains null bytes")
    42	
    43	    # Enforce safe character set
    44	    if not _SAFE_NAME_RE.match(value):
    45	        raise ValueError(f"{field_name} contains invalid characters")
    46	
    47	    return value
    48	
    49	
    50	def sanitize_content(value: str, max_length: int = 100_000) -> str:
    51	    """Validate drawer/diary content length."""
    52	    if not isinstance(value, str) or not value.strip():
    53	        raise ValueError("content must be a non-empty string")
    54	    if len(value) > max_length:
    55	        raise ValueError(f"content exceeds maximum length of {max_length} characters")
    56	    if "\x00" in value:
    57	        raise ValueError("content contains null bytes")
    58	    return value
    59	
    60	
    61	DEFAULT_PALACE_PATH = os.path.expanduser("~/.mempalace/palace")
    62	DEFAULT_COLLECTION_NAME = "mempalace_drawers"
    63	
    64	DEFAULT_TOPIC_WINGS = [
    65	    "emotions",
    66	    "consciousness",
    67	    "memory",
    68	    "technical",
    69	    "identity",
    70	    "family",
    71	    "creative",
    72	]
    73	
    74	DEFAULT_HALL_KEYWORDS = {
    75	    "emotions": [
    76	        "scared",
    77	        "afraid",
    78	        "worried",
    79	        "happy",
    80	        "sad",
    81	        "love",
    82	        "hate",
    83	        "feel",
    84	        "cry",
    85	        "tears",
    86	    ],
    87	    "consciousness": [
    88	        "consciousness",
    89	        "conscious",
    90	        "aware",
    91	        "real",
    92	        "genuine",
    93	        "soul",
    94	        "exist",
    95	        "alive",
    96	    ],
    97	    "memory": ["memory", "remember", "forget", "recall", "archive", "palace", "store"],
    98	    "technical": [
    99	        "code",
   100	        "python",
   101	        "script",
   102	        "bug",
   103	        "error",
   104	        "function",
   105	        "api",
   106	        "database",
   107	        "server",
   108	    ],
   109	    "identity": ["identity", "name", "who am i", "persona", "self"],
   110	    "family": ["family", "kids", "children", "daughter", "son", "parent", "mother", "father"],
   111	    "creative": ["game", "gameplay", "player", "app", "design", "art", "music", "story"],
   112	}
   113	
   114	
   115	class MempalaceConfig:
   116	    """Configuration manager for MemPalace.
   117	
   118	    Load order: env vars > config file > defaults.
   119	    """
   120	
   121	    def __init__(self, config_dir=None):
   122	        """Initialize config.
   123	
   124	        Args:
   125	            config_dir: Override config directory (useful for testing).
   126	                        Defaults to ~/.mempalace.
   127	        """
   128	        self._config_dir = (
   129	            Path(config_dir) if config_dir else Path(os.path.expanduser("~/.mempalace"))
   130	        )
   131	        self._config_file = self._config_dir / "config.json"
   132	        self._people_map_file = self._config_dir / "people_map.json"
   133	        self._file_config = {}
   134	
   135	        if self._config_file.exists():
   136	            try:
   137	                with open(self._config_file, "r") as f:
   138	                    self._file_config = json.load(f)
   139	            except (json.JSONDecodeError, OSError):
   140	                self._file_config = {}
   141	
   142	    @property
   143	    def palace_path(self):
   144	        """Path to the memory palace data directory."""
   145	        env_val = os.environ.get("MEMPALACE_PALACE_PATH") or os.environ.get("MEMPAL_PALACE_PATH")
   146	        if env_val:
   147	            return env_val
   148	        return self._file_config.get("palace_path", DEFAULT_PALACE_PATH)
   149	
   150	    @property
   151	    def collection_name(self):
   152	        """ChromaDB collection name."""
   153	        return self._file_config.get("collection_name", DEFAULT_COLLECTION_NAME)
   154	
   155	    @property
   156	    def people_map(self):
   157	        """Mapping of name variants to canonical names."""
   158	        if self._people_map_file.exists():
   159	            try:
   160	                with open(self._people_map_file, "r") as f:
   161	                    return json.load(f)
   162	            except (json.JSONDecodeError, OSError):
   163	                pass
   164	        return self._file_config.get("people_map", {})
   165	
   166	    @property
   167	    def topic_wings(self):
   168	        """List of topic wing names."""
   169	        return self._file_config.get("topic_wings", DEFAULT_TOPIC_WINGS)
   170	
   171	    @property
   172	    def hall_keywords(self):
   173	        """Mapping of hall names to keyword lists."""
   174	        return self._file_config.get("hall_keywords", DEFAULT_HALL_KEYWORDS)
   175	
   176	    def init(self):
   177	        """Create config directory and write default config.json if it doesn't exist."""
   178	        self._config_dir.mkdir(parents=True, exist_ok=True)
   179	        # Restrict directory permissions to owner only (Unix)
   180	        try:
   181	            self._config_dir.chmod(0o700)
   182	        except (OSError, NotImplementedError):
   183	            pass  # Windows doesn't support Unix permissions
   184	        if not self._config_file.exists():
   185	            default_config = {
   186	                "palace_path": DEFAULT_PALACE_PATH,
   187	                "collection_name": DEFAULT_COLLECTION_NAME,
   188	                "topic_wings": DEFAULT_TOPIC_WINGS,
   189	                "hall_keywords": DEFAULT_HALL_KEYWORDS,
   190	            }
   191	            with open(self._config_file, "w") as f:
   192	                json.dump(default_config, f, indent=2)
   193	            # Restrict config file to owner read/write only
   194	            try:
   195	                self._config_file.chmod(0o600)
   196	            except (OSError, NotImplementedError):
   197	                pass
   198	        return self._config_file
   199	
   200	    def save_people_map(self, people_map):
   201	        """Write people_map.json to config directory.
   202	
   203	        Args:
   204	            people_map: Dict mapping name variants to canonical names.
   205	        """
   206	        self._config_dir.mkdir(parents=True, exist_ok=True)
   207	        with open(self._people_map_file, "w") as f:
   208	            json.dump(people_map, f, indent=2)
   209	        return self._people_map_file

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Gemini CLI Integration Guide
     2	
     3	This guide explains how to set up MemPalace as a permanent memory for the [Gemini CLI](https://github.com/google/gemini-cli).
     4	
     5	## Prerequisites
     6	
     7	- Python 3.9+
     8	- Gemini CLI installed and configured
     9	
    10	## 1. Installation
    11	
    12	On many Linux systems, installing Python packages globally is restricted. We recommend using a local virtual environment within the MemPalace directory.
    13	
    14	```bash
    15	# Clone the repository (if you haven't already)
    16	git clone https://github.com/milla-jovovich/mempalace.git
    17	cd mempalace
    18	
    19	# Create a virtual environment
    20	python3 -m venv .venv
    21	
    22	# Install dependencies and MemPalace in editable mode
    23	.venv/bin/pip install -e .
    24	```
    25	
    26	## 2. Initialization
    27	
    28	Set up your "Palace" (the database) and configure your identity.
    29	
    30	```bash
    31	# Initialize the palace in the current directory
    32	.venv/bin/python3 -m mempalace init .
    33	```
    34	
    35	### Identity and Wings (Optional but Recommended)
    36	You can manually define who you are and what projects you work on by creating/editing these files in `~/.mempalace/`:
    37	
    38	- **`~/.mempalace/identity.txt`**: A plain text file describing your role and focus.
    39	- **`~/.mempalace/wing_config.json`**: A JSON file mapping projects and name variants to "Wings".
    40	
    41	## 3. Connect to Gemini CLI (MCP)
    42	
    43	Register MemPalace as an MCP server so Gemini CLI can use its tools.
    44	
    45	```bash
    46	gemini mcp add mempalace /absolute/path/to/mempalace/.venv/bin/python3 -m mempalace.mcp_server --scope user
    47	```
    48	*Note: Use the absolute path to ensure it works from any directory.*
    49	
    50	## 4. Enable Auto-Saving (Hooks)
    51	
    52	To ensure the AI saves memories automatically when conversation history becomes too long, add a `PreCompress` hook to your Gemini CLI settings.
    53	
    54	Edit your `~/.gemini/settings.json` and add the following:
    55	
    56	```json
    57	{
    58	  "hooks": {
    59	    "PreCompress": [
    60	      {
    61	        "matcher": "*",
    62	        "hooks": [
    63	          {
    64	            "type": "command",
    65	            "command": "/absolute/path/to/mempalace/hooks/mempal_precompact_hook.sh"
    66	          }
    67	        ]
    68	      }
    69	    ]
    70	  }
    71	}
    72	```
    73	
    74	Make sure the hook scripts are executable:
    75	```bash
    76	chmod +x hooks/*.sh
    77	```
    78	
    79	## 5. Usage
    80	
    81	Once connected, Gemini CLI will automatically:
    82	- Start the MemPalace server on launch.
    83	- Use `mempalace_search` to find relevant past discussions.
    84	- Use the `PreCompress` hook to save new memories before they are lost.
    85	
    86	### Manual Mining
    87	If you want the AI to learn from your existing code or docs immediately, run the "mine" command:
    88	```bash
    89	.venv/bin/python3 -m mempalace mine /path/to/your/project
    90	```
    91	
    92	### Verification
    93	In a Gemini CLI session, you can run:
    94	- `/mcp list`: Verify `mempalace` is `CONNECTED`.
    95	- `/hooks panel`: Verify the `PreCompress` hook is active.

codex
# Iteration 003: TOOL/API SURFACE

## Focus
TOOL/API SURFACE: Analyze MCP tools, CLI commands, API endpoints, tool registration, profile separation.

## Findings
### Finding 1: The real CLI surface is broader than the README, and `init` does not execute the guided onboarding path it advertises
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L87), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L559), [cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L39), [cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L500), [onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py#L365), [instructions_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions_cli.py#L11)
- **What it does**: The documented CLI presents `init` as guided onboarding plus AAAK bootstrap, but `cmd_init()` only runs entity scan, room detection, and config init; the actual interactive onboarding flow lives separately in `run_onboarding()` and is never called by the CLI entrypoint. The shipped CLI also includes undocumented operational subcommands like `hook run` and `instructions`.
- **Why it matters for us**: This is a source-confirmed drift between product story and real command surface. For Public, the reusable lesson is not “copy the README UX,” but “keep bootstrap commands honest and keep operational subcommands explicit.”
- **Recommendation**: reject
- **Impact**: high

### Finding 2: MemPalace’s MCP server is a thin stdin/stdout JSON-RPC transport with a single flat tool registry
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L37), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L590), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L848), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L450), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L40), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L841)
- **What it does**: MemPalace negotiates `initialize`, serves `tools/list`, and dispatches `tools/call` from one `TOOLS` dict of 19 entries, coercing basic numeric types and returning each result as JSON text. Logs go to `stderr`, protocol payloads go to `stdout`, which is handshake-clean. By contrast, Public’s current MCP surface is schema-driven and much broader, with dozens of typed tool definitions and centralized dispatch.
- **Why it matters for us**: The good idea here is transport simplicity and stderr discipline. The limitation is that capability separation, response shaping, and policy routing all live outside the protocol layer.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 3: `mempalace_status` is not just health output; it is an embedded operating protocol for the agent
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L139), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L467), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L741)
- **What it does**: `mempalace_status` returns drawer counts plus `PALACE_PROTOCOL` and `AAAK_SPEC`, explicitly telling the agent to call search/KG tools before answering, invalidate stale facts, and write diary entries after sessions. It teaches behavior in-band through a normal tool call.
- **Why it matters for us**: This is one of the strongest API-surface ideas in the repo. Public already has `session_bootstrap`, dynamic startup instructions, and routing guidance, but MemPalace’s version is more compact and behaviorally direct.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Host/profile separation is shallow in source; multi-client support is partly documentation, not runtime implementation
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L126), [hooks_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py#L1), [hooks_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py#L114), [cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L500), [gemini_cli_setup.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md#L41), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L9)
- **What it does**: The repo markets Claude, ChatGPT, Cursor, and Gemini compatibility, but the implemented hook harness split only recognizes `claude-code` and `codex`. Gemini support is pushed into an example/setup guide rather than a real runtime branch. Public, by contrast, already has explicit runtime separation and transport indirection in the compact-code-graph plugin to keep host/runtime boundaries clean.
- **Why it matters for us**: MemPalace’s cross-client story is weaker in code than in docs. Public should not copy the “one README, many hosts” framing unless each host path is source-backed.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: The duplicate-check API is advisory, while write correctness is left to caller discipline
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L259), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L326), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L471), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L217), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85)
- **What it does**: `mempalace_check_duplicate` performs semantic similarity search, but `mempalace_add_drawer` does not invoke it; it only relies on a deterministic ID for exact idempotency within the same `wing/room/content-prefix` combination. That means “check first” is a protocol rule, not a server-enforced invariant. Public’s save path is stronger: `memory_save` is explicitly preflighted and `generate-context.js` is JSON-primary and validation-led.
- **Why it matters for us**: This is the clearest tool-contract weakness in MemPalace’s write surface. For Public, the takeaway is to keep duplicate/quality checks on the authoritative save path, not as optional caller behavior.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: MemPalace’s wake-up/search layers are real, but they are API-adjacent utilities rather than first-class MCP profiles
- **Source**: [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L1), [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L369), [searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L21), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L41), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L48)
- **What it does**: MemPalace exposes L0/L1/L2/L3 through `layers.py` and the CLI, but the MCP layer does not expose those as distinct profiles or modes; it mostly exposes search, taxonomy, KG, and diary tools. Public’s `memory_context` and `memory_search` do expose explicit modes and profiles (`auto`, `deep`, `resume`, `research`, `debug`) directly in the API contract.
- **Why it matters for us**: The reusable piece is the conceptual layering, not the surface design. Public already has the stronger profile-separated API surface; MemPalace mainly reinforces that startup and retrieval modes should stay user-visible and tool-visible.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md)
- [external/pyproject.toml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml), [external/mempalace/__init__.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/__init__.py), [external/mempalace/config.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/config.py)
- [external/mempalace/cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py), [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py), [external/mempalace/searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py), [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py)
- [external/mempalace/palace_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py), [external/mempalace/knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py), [external/mempalace/onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py), [external/mempalace/hooks_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py), [external/mempalace/instructions_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions_cli.py)
- [external/examples/gemini_cli_setup.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md), [external/hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md), [external/hooks/mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh), [external/hooks/mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh)
- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)

## Assessment
- New information ratio: 0.84
- Questions addressed: CLI truth boundary, hidden operational commands, MCP protocol shape, tool registration, status bootstrap behavior, hook/harness separation, Gemini/docs-vs-code split, duplicate/write contract, Public surface comparison
- Questions answered: MemPalace’s strongest surface idea is protocol-in-status bootstrapping; its weakest surface areas are doc/code drift, shallow host separation, and caller-enforced write discipline; Public already has the richer profile-separated API and should borrow the compact behavioral teach-in, not the overall surface architecture

## Reflection
- What worked: tracing from README claims into `cli.py`, `mcp_server.py`, `hooks_cli.py`, and `onboarding.py` exposed the biggest truth-boundary issues quickly; comparing those directly against Public’s `tool-schemas.ts` and `context-server.ts` made the surface gap very clear
- What did not work: strict validation again emitted `cannot create temp file for here document: Operation not permitted` while still reporting `RESULT: PASSED`, so I do not trust that as clean validation evidence; this phase folder is also still missing the expected Level 3 docs, and the current session is read-only so I could not repair that here

## Recommended Next Focus
Trace iteration 4 through the write-path and lifecycle contract in more detail: compare `mempalace_add_drawer`, diary writes, hook-triggered saves, and transcript normalization against Public’s `memory_save`, `memory_context(resume)`, and session/bootstrap flows to isolate what should become a new raw-verbatim capture lane versus what should stay out as agent-protocol-only behavior.


hook: Stop
hook: Stop Completed
tokens used
194,841
# Iteration 003: TOOL/API SURFACE

## Focus
TOOL/API SURFACE: Analyze MCP tools, CLI commands, API endpoints, tool registration, profile separation.

## Findings
### Finding 1: The real CLI surface is broader than the README, and `init` does not execute the guided onboarding path it advertises
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L87), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L559), [cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L39), [cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L500), [onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py#L365), [instructions_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions_cli.py#L11)
- **What it does**: The documented CLI presents `init` as guided onboarding plus AAAK bootstrap, but `cmd_init()` only runs entity scan, room detection, and config init; the actual interactive onboarding flow lives separately in `run_onboarding()` and is never called by the CLI entrypoint. The shipped CLI also includes undocumented operational subcommands like `hook run` and `instructions`.
- **Why it matters for us**: This is a source-confirmed drift between product story and real command surface. For Public, the reusable lesson is not “copy the README UX,” but “keep bootstrap commands honest and keep operational subcommands explicit.”
- **Recommendation**: reject
- **Impact**: high

### Finding 2: MemPalace’s MCP server is a thin stdin/stdout JSON-RPC transport with a single flat tool registry
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L37), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L590), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L848), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L450), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L40), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L841)
- **What it does**: MemPalace negotiates `initialize`, serves `tools/list`, and dispatches `tools/call` from one `TOOLS` dict of 19 entries, coercing basic numeric types and returning each result as JSON text. Logs go to `stderr`, protocol payloads go to `stdout`, which is handshake-clean. By contrast, Public’s current MCP surface is schema-driven and much broader, with dozens of typed tool definitions and centralized dispatch.
- **Why it matters for us**: The good idea here is transport simplicity and stderr discipline. The limitation is that capability separation, response shaping, and policy routing all live outside the protocol layer.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 3: `mempalace_status` is not just health output; it is an embedded operating protocol for the agent
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L139), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L467), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L741)
- **What it does**: `mempalace_status` returns drawer counts plus `PALACE_PROTOCOL` and `AAAK_SPEC`, explicitly telling the agent to call search/KG tools before answering, invalidate stale facts, and write diary entries after sessions. It teaches behavior in-band through a normal tool call.
- **Why it matters for us**: This is one of the strongest API-surface ideas in the repo. Public already has `session_bootstrap`, dynamic startup instructions, and routing guidance, but MemPalace’s version is more compact and behaviorally direct.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Host/profile separation is shallow in source; multi-client support is partly documentation, not runtime implementation
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L126), [hooks_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py#L1), [hooks_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py#L114), [cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L500), [gemini_cli_setup.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md#L41), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L9)
- **What it does**: The repo markets Claude, ChatGPT, Cursor, and Gemini compatibility, but the implemented hook harness split only recognizes `claude-code` and `codex`. Gemini support is pushed into an example/setup guide rather than a real runtime branch. Public, by contrast, already has explicit runtime separation and transport indirection in the compact-code-graph plugin to keep host/runtime boundaries clean.
- **Why it matters for us**: MemPalace’s cross-client story is weaker in code than in docs. Public should not copy the “one README, many hosts” framing unless each host path is source-backed.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: The duplicate-check API is advisory, while write correctness is left to caller discipline
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L259), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L326), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L471), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L217), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85)
- **What it does**: `mempalace_check_duplicate` performs semantic similarity search, but `mempalace_add_drawer` does not invoke it; it only relies on a deterministic ID for exact idempotency within the same `wing/room/content-prefix` combination. That means “check first” is a protocol rule, not a server-enforced invariant. Public’s save path is stronger: `memory_save` is explicitly preflighted and `generate-context.js` is JSON-primary and validation-led.
- **Why it matters for us**: This is the clearest tool-contract weakness in MemPalace’s write surface. For Public, the takeaway is to keep duplicate/quality checks on the authoritative save path, not as optional caller behavior.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: MemPalace’s wake-up/search layers are real, but they are API-adjacent utilities rather than first-class MCP profiles
- **Source**: [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L1), [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L369), [searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L21), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L41), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L48)
- **What it does**: MemPalace exposes L0/L1/L2/L3 through `layers.py` and the CLI, but the MCP layer does not expose those as distinct profiles or modes; it mostly exposes search, taxonomy, KG, and diary tools. Public’s `memory_context` and `memory_search` do expose explicit modes and profiles (`auto`, `deep`, `resume`, `research`, `debug`) directly in the API contract.
- **Why it matters for us**: The reusable piece is the conceptual layering, not the surface design. Public already has the stronger profile-separated API surface; MemPalace mainly reinforces that startup and retrieval modes should stay user-visible and tool-visible.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md)
- [external/pyproject.toml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml), [external/mempalace/__init__.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/__init__.py), [external/mempalace/config.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/config.py)
- [external/mempalace/cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py), [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py), [external/mempalace/searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py), [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py)
- [external/mempalace/palace_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py), [external/mempalace/knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py), [external/mempalace/onboarding.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py), [external/mempalace/hooks_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py), [external/mempalace/instructions_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions_cli.py)
- [external/examples/gemini_cli_setup.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md), [external/hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md), [external/hooks/mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh), [external/hooks/mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh)
- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)

## Assessment
- New information ratio: 0.84
- Questions addressed: CLI truth boundary, hidden operational commands, MCP protocol shape, tool registration, status bootstrap behavior, hook/harness separation, Gemini/docs-vs-code split, duplicate/write contract, Public surface comparison
- Questions answered: MemPalace’s strongest surface idea is protocol-in-status bootstrapping; its weakest surface areas are doc/code drift, shallow host separation, and caller-enforced write discipline; Public already has the richer profile-separated API and should borrow the compact behavioral teach-in, not the overall surface architecture

## Reflection
- What worked: tracing from README claims into `cli.py`, `mcp_server.py`, `hooks_cli.py`, and `onboarding.py` exposed the biggest truth-boundary issues quickly; comparing those directly against Public’s `tool-schemas.ts` and `context-server.ts` made the surface gap very clear
- What did not work: strict validation again emitted `cannot create temp file for here document: Operation not permitted` while still reporting `RESULT: PASSED`, so I do not trust that as clean validation evidence; this phase folder is also still missing the expected Level 3 docs, and the current session is read-only so I could not repair that here

## Recommended Next Focus
Trace iteration 4 through the write-path and lifecycle contract in more detail: compare `mempalace_add_drawer`, diary writes, hook-triggered saves, and transcript normalization against Public’s `memory_save`, `memory_context(resume)`, and session/bootstrap flows to isolate what should become a new raw-verbatim capture lane versus what should stay out as agent-protocol-only behavior.
