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
