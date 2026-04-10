# Iteration 032: MIGRATION RISK MATRIX

## Focus
MIGRATION RISK MATRIX: For each adopt-now pattern, detail what could break during migration. Include rollback plans and feature flags needed.

## Findings
### Finding N: [Title]
- **Source**: file path(s) [SOURCE: path:line]
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
- **Source strength**: primary / secondary / tentative

## Sources Consulted
- [file:line references]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]
- Novelty justification: [1-sentence explanation]

## Ruled Out
- [approaches eliminated and why]

## Reflection
- What worked: [approach + causal explanation]
- What did not work: [approach + root cause]
- What I would do differently: [specific adjustment]

## Recommended Next Focus
[What to investigate next]

ACCUMULATED FINDINGS SUMMARY:
 it does**: MemPalace blocks every 15 user turns and always blocks before compaction, then tells the AI to save; optional auto-ingest is backgrounded in the stop hook and synchronous only if `MEMPAL_DIR` is configured. The write path itself is weakly protected: `mempalace_add_drawer` uses deterministic IDs, but it does not actually call the semantic duplicate checker before writing.
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
--
/bin/zsh -lc 'rg -n "''^### Finding|''^## Findings|Recommendation|Impact|adopt now|prototype later|reject|NEW FEATURE" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/research.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
--- Iteration 29 ---
## Findings
- **Priority**: 7
- **Effort**: 1/5
- **Impact**: 4/5

### Finding 8: Reject AAAK-first recall and full palace taxonomy as core Public architecture
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L58), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L292), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L510), [room_detector_local.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py#L97), [BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md#L604)
- **What it does**: AAAK is explicitly lossy and benchmark-worse than raw mode; room routing underperforms the stronger no-rooms hybrid baseline.
- **Why it matters**: Both ideas add governance and truthfulness risk without enough upside for Public’s current architecture.
- **Recommendation**: reject
- **Priority**: 8
- **Effort**: 1/5
- **Impact**: 3/5

## Assessment
- New information ratio: 0.10
- Repo note: `external/AGENTS.md` exists, `research/research.md` is an appended multi-pass file whose cleanest current verdict is the final synthesis block near the end, and there is no persisted `iteration-030.md`.
- Operational note: strict validation returned `PASSED`, but also emitted a temp-file warning under the read-only sandbox; I could not update the phase files, create `implementation-summary.md`, or run the phase memory save.

## Recommended Next Focus
Implement the three `adopt now` items first in this order: compaction-time JSON-primary checkpoint, bootstrap memory-protocol hints, and audit/repair surfaces. After that, prototype selective verbatim evidence retention, a wake-up retrieval profile, and a citation-governed temporal fact sidecar; keep forced blocking saves, AAAK-first recall, and full palace taxonomy out of the near-term roadmap.
--- Iteration 31 ---
## Findings
### Finding N: [Title]
- **Source**: file path(s) [SOURCE: path:line]
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
- **Source strength**: primary / secondary / tentative

## Sources Consulted
- [file:line references]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]
--
## Findings
For EACH finding:
### Finding N: [Title]

## Assessment
- **New information ratio**: 0.12
- **Questions addressed**: phased sequencing, dependency ordering, what to keep out of the roadmap
- **Questions answered**: Q1 should be deterministic preservation plus protocol plus observability; Q2 should stay scoped to evidence retention and wake-up retrieval; Q3 should isolate temporal facts as a sidecar
- **Novelty justification**: This pass adds delivery sequencing and dependency structure on top of the settled 30-iteration recommendation set rather than introducing new primitives.
- **Operational note**: strict validation passed for the phase folder, but the validator reported a temp-file warning under the read-only sandbox, and I could not write this draft back to `research/research.md` or create the missing spec artifacts.

## Ruled Out
- Forced hook-blocking saves as the primary preservation mechanism because they interrupt the runtime without guaranteeing high-quality capture.
- AAAK-first recall because the repo’s own April 7, 2026 correction and benchmark notes mark it as lossy and worse than raw mode.
- Full palace taxonomy as core Public architecture because the practical value is in disciplined filters and hints, not the metaphor itself.

## Reflection
- **What worked**: Using the final synthesis block in [research.md#L290535](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/research.md#L290535) as the base and then re-checking the underlying source lines made the roadmap stable and low-drift.
- **What did not work**: The phase folder is not actually in the Level 3-on-disk state described by the prompt, so I could not turn this into a persisted packet update in this session.
- **What I would do differently**: Next pass should write this draft into `research/research.md`, update the checklist and implementation summary, and convert the roadmap into concrete follow-on implementation phases.

## Recommended Next Focus
Translate this roadmap into implementation packets: one Q1 packet for checkpointing and bootstrap hints, one Q1 packet for audit/repair surfaces, one Q2 packet for bounded verbatim evidence plus wake-up profile, and one Q3 packet for the temporal fact sidecar.

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
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only deep-research pass for iteration 32, focused on migration risk for the already-emerging adopt-now patterns. First I’m loading prior context and re-checking the exact source files so the matrix stays grounded in current code rather than earlier summaries.
mcp: spec_kit_memory/memory_quick_search started
mcp: spec_kit_memory/memory_quick_search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "pwd && rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace | sed 's#"'^#/#'"' | head -n 80" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/assets/mempalace_logo.png
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/README.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/membench_bench.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/convomem_bench.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/HOOKS_TUTORIAL.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/convo_import.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/mcp_setup.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/basic_mining.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/CONTRIBUTING.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/integrations/openclaw/SKILL.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/docs/schema.sql
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_detector.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/__main__.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/migrate.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/split_mega_files.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions_cli.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/py.typed
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dedup.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/README.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/__init__.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/spellcheck.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/normalize.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dialect.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/version.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/config.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions/mine.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions/init.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions/help.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions/status.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions/search.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/repair.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/test_palace_graph.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/test_knowledge_graph.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/test_normalize.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/test_cli.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/test_convo_miner.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/test_config.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_palace_boost.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/report.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_knowledge_graph_bench.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/data_generator.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_layers_bench.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_chromadb_stress.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_recall_threshold.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_mcp_bench.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/README.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/__init__.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_ingest_bench.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_memory_profile.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/test_search_bench.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks/conftest.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/test_config_extra.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/test_miner.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/test_spellcheck_extra.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/test_onboarding.py
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/test_version_consistency.py

codex
I found that `external/AGENTS.md` does exist, so I’m checking it before going deeper into the vendor tree. I’m also opening the deep-research guidance briefly so the iteration output matches the expected structure instead of drifting into a generic audit.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 3.2.0.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `007-auth-feature/`) that contains documentation for a single feature/task or a coordinated packet of related phase work:

Spec folders may also be nested as coordination-root packets with direct-child phase folders (e.g., `specs/02--track/022-feature/011-phase/002-child/`).

- **Purpose**: Track specifications, plans, tasks, and decisions for one unit of work
- **Location**: Under `specs/` using either `###-short-name/` at the root or nested packet paths for phased coordination
- **Contents**: Markdown files (spec.md, plan.md, tasks.md) plus optional memory/ and scratch/ subdirectories

Think of it as a "project folder" for AI-assisted development - it keeps context organized and enables session continuity.

### Activation Triggers

**MANDATORY for ALL file modifications:**
- Code files: JS, TS, Python, CSS, HTML
- Documentation: Markdown, README, guides
- Configuration: JSON, YAML, TOML, env templates
- Templates, knowledge base, build/tooling files

**Request patterns that trigger activation:**
- "Add/implement/create [feature]"
- "Fix/update/refactor [code]"
- "Modify/change [configuration]"
- Any keyword: add, implement, fix, update, create, modify, rename, delete, configure, analyze, phase

**Example triggers:**
- "Add email validation to the signup form" → Level 1-2
- "Refactor the authentication module" → Level 2-3
- "Fix the button alignment bug" → Level 1
- "Implement user dashboard with analytics" → Level 3

### When NOT to Use

- Pure exploration/reading (no file modifications)
- Single typo fixes (<5 characters in one file)
- Whitespace-only changes
- Auto-generated file updates (package-lock.json)
- User explicitly selects Option D (skip documentation)

**Rule of thumb:** If modifying ANY file content → Activate this skill.
Status: ✅ This requirement applies immediately once file edits are requested.

### Agent Exclusivity

**⛔ CRITICAL:** `@speckit` is the ONLY agent permitted to create or substantively write spec folder documentation (*.md files).

- **Requires @speckit:** spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, and any other *.md in spec folders
- **Exceptions:**
  - `memory/` → uses generate-context.js script
  - `scratch/` → temporary workspace, any agent
  - `handover.md` → @handover agent only
  - `research/research.md` → @deep-research agent only
  - `debug-delegation.md` → @debug agent only

Routing to `@general`, `@write`, or other agents for spec documentation is a **hard violation**. See constitutional memory: `speckit-exclusivity.md`

### Utility Template Triggers

| Template              | Trigger Keywords                                                                                                              | Action                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `handover.md`         | "handover", "next session", "continue later", "pass context", "ending session", "save state", "multi-session", "for next AI"  | Suggest creating handover |
| `debug-delegation.md` | "stuck", "can't fix", "tried everything", "same error", "fresh eyes", "hours on this", "still failing", "need help debugging" | Suggest `/spec_kit:debug` |

**Rule:** When detected, proactively suggest the appropriate action.

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/memory/` for context retrieval, save workflows, trigger behavior, and indexing.
- `references/templates/` for level selection, template composition, and structure guides.
- `references/validation/` for checklist policy, verification rules, decision formats, and template compliance contracts.
- `references/structure/` for folder organization and sub-folder versioning.
- `references/workflows/` for command workflows and worked examples.
- `references/debugging/` for troubleshooting and root-cause methodology.
- `references/config/` for runtime environment configuration.

### Template and Script Sources of Truth

- Level definitions and template size guidance: [level_specifications.md](./references/templates/level_specifications.md)
- Template usage and composition rules: [template_guide.md](./references/templates/template_guide.md)
- Use `templates/level_N/` for operational templates; `core/` and `addendum/` remain composition inputs.
- Use `templates/changelog/` for packet-local nested changelog generation at completion time.
- Script architecture, build outputs, and runtime entrypoints: [scripts/README.md](./scripts/README.md)
- Memory save JSON schema and workflow contracts: [save_workflow.md](./references/memory/save_workflow.md)
- Nested packet changelog workflow: [nested_changelog.md](./references/workflows/nested_changelog.md)

Primary operational scripts:
- `spec/validate.sh`
- `spec/create.sh`
- `spec/archive.sh`
- `spec/check-completion.sh`
- `spec/recommend-level.sh`
- `templates/compose.sh`

### Resource Loading Levels

| Level       | When to Load               | Resources                    |
| ----------- | -------------------------- | ---------------------------- |
| ALWAYS      | Every skill invocation     | Shared patterns + SKILL.md   |
| CONDITIONAL | If intent signals match   | Intent-mapped references     |
| ON_DEMAND   | Only on explicit request   | Deep-dive quality standards  |

`references/workflows/quick_reference.md` is the primary first-touch command surface. Keep the compact `spec_kit` and `memory` command map there, and use this file only to point readers to it rather than duplicating the full matrix.

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/workflows/quick_reference.md"

INTENT_SIGNALS = {
    "PLAN": {"weight": 3, "keywords": ["plan", "design", "new spec", "level selection", "option b"]},
    "RESEARCH": {"weight": 3, "keywords": ["investigate", "explore", "analyze", "prior work", "evidence"]},
    "IMPLEMENT": {"weight": 3, "keywords": ["implement", "build", "execute", "workflow"]},
    "DEBUG": {"weight": 4, "keywords": ["stuck", "error", "not working", "failed", "debug"]},
    "COMPLETE": {"weight": 4, "keywords": ["done", "complete", "finish", "verify", "checklist"]},
    "MEMORY": {"weight": 4, "keywords": ["memory", "save context", "resume", "checkpoint", "context"]},
    "HANDOVER": {"weight": 4, "keywords": ["handover", "continue later", "next session", "pause"]},
    "PHASE": {"weight": 4, "keywords": ["phase", "decompose", "split", "workstream", "multi-phase", "phased approach", "phased", "multi-session"]},
    "RETRIEVAL_TUNING": {"weight": 3, "keywords": ["retrieval", "search tuning", "fusion", "scoring", "pipeline"]},
    "EVALUATION": {"weight": 3, "keywords": ["evaluate", "ablation", "benchmark", "baseline", "metrics"]},
    "SCORING_CALIBRATION": {"weight": 3, "keywords": ["calibration", "scoring", "normalization", "decay", "interference"]},
    "ROLLOUT_FLAGS": {"weight": 3, "keywords": ["feature flag", "rollout", "toggle", "enable", "disable"]},
    "GOVERNANCE": {"weight": 3, "keywords": ["governance", "shared memory", "tenant", "retention", "audit"]},
}

RESOURCE_MAP = {
    "PLAN": [
        "references/templates/level_specifications.md",
        "references/templates/template_guide.md",
        "references/validation/template_compliance_contract.md",
    ],
    "RESEARCH": [
        "references/workflows/quick_reference.md",
        "references/workflows/worked_examples.md",
        "references/memory/epistemic_vectors.md",
    ],
    "IMPLEMENT": [
        "references/validation/validation_rules.md",
        "references/validation/template_compliance_contract.md",
        "references/templates/template_guide.md",
    ],
    "DEBUG": [
        "references/debugging/troubleshooting.md",
        "references/workflows/quick_reference.md",
        "manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md",
    ],
    "COMPLETE": [
        "references/validation/validation_rules.md",
        "references/workflows/nested_changelog.md",
    ],
    "MEMORY": [
        "references/memory/memory_system.md",
        "references/memory/save_workflow.md",
        "references/memory/trigger_config.md",
    ],
    "HANDOVER": [
        "references/workflows/quick_reference.md",
    ],
    "PHASE": [
        "references/structure/phase_definitions.md",
        "references/structure/sub_folder_versioning.md",
        "references/validation/phase_checklists.md",
    ],
    "RETRIEVAL_TUNING": [
        "references/memory/embedding_resilience.md",
        "references/memory/trigger_config.md",
    ],
    "EVALUATION": [
        "references/memory/epistemic_vectors.md",
        "references/config/environment_variables.md",
        "manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md",
    ],
    "SCORING_CALIBRATION": [
        "references/config/environment_variables.md",
    ],
    "ROLLOUT_FLAGS": [
        "references/config/environment_variables.md",
        "feature_catalog/19--feature-flag-reference/",
    ],
    "GOVERNANCE": [
        "references/config/environment_variables.md",
    ],
}

COMMAND_BOOSTS = {
    "/spec_kit:plan": "PLAN",
    "/spec_kit:implement": "IMPLEMENT",
    "/spec_kit:debug": "DEBUG",
    "/spec_kit:complete": "COMPLETE",

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
I’ve confirmed the external repo has its own scoped instructions and that this phase is already in deep-research territory, so the next pass is evidence collection rather than broad discovery. I’m validating the phase folder, then I’ll walk the specific source order the brief requires and turn the settled adopt-now items into a migration-risk matrix with rollback and flag strategy.
Read-only deep-research iteration 32 focused on migration risk for adopt-now patterns. I’ll validate the phase, gather source evidence from the external repo and current Public implementation, then synthesize a structured iteration report with migration risks, flags, and rollback plans.
  → Validate the phase folder and inspect current research artifacts for established adopt-now patterns
  • Read the required MemPalace and Public source files to extract migration-risk evidence for each adopt-now pattern
  • Synthesize iteration 32 in the requested format, including rollback plans, feature flags, and novelty assessment
exec
/bin/zsh -lc "rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace | rg '/(spec\\.md|plan\\.md|tasks\\.md|checklist\\.md|decision-record\\.md|implementation-summary\\.md|research/research\\.md)"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/research.md

exec
/bin/zsh -lc 'rg -n "adopt now|prototype later|reject|Recommended Next Focus|compaction-time JSON-primary checkpoint|bootstrap memory-protocol hints|audit/repair surfaces|wake-up|temporal fact|verbatim evidence" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/research.md | tail -n 120' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
287434:191961:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-002.md:15845:- **Recommendation**: reject
287436:191966:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-002.md:15853:- **Recommendation**: prototype later
287438:191971:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-002.md:15861:- **Recommendation**: adopt now
287440:191976:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-002.md:15869:- **Recommendation**: adopt now
287446:196822:    12	- **Recommendation**: reject
287450:196969:   159	- Recommendation: prototype later
287453:196982:   172	- Recommendation: adopt now or prototype later, depending on runtime surface
287456:197173:- **Recommendation**: adopt now
287459:197180:- **Recommendation**: adopt now
287462:197187:- **Recommendation**: prototype later
287464:197190:### Finding 4: L0-L3 wake-up is a presentation pattern, not a storage model to copy
287465:197194:- **Recommendation**: prototype later
287467:197197:### Finding 5: A separate temporal fact plane is the only true net-new feature track
287471:197208:- **Recommendation**: reject
287474:197215:- **Recommendation**: reject
287477:197253:## Recommended Next Focus
287479:197278:- **Recommendation**: adopt now
287482:197285:- **Recommendation**: adopt now
287485:197292:- **Recommendation**: prototype later
287487:197295:### Finding 4: L0-L3 wake-up is a presentation pattern, not a storage model to copy
287488:197299:- **Recommendation**: prototype later
287490:197302:### Finding 5: A separate temporal fact plane is the only true net-new feature track
287494:197313:- **Recommendation**: reject
287497:197320:- **Recommendation**: reject
287500:197358:## Recommended Next Focus
287563:197164	FINAL SYNTHESIS: Classify EVERY finding as adopt-now / prototype-later / new-feature-needed / reject. Executive summary.
287565:197166	MemPalace contributes two near-term ideas worth carrying into Public now: a compaction-time structured save checkpoint and a short bootstrap hint layer that teaches memory behavior. Everything else should stay scoped: selective verbatim evidence retention and layered wake-up are worth prototyping, a temporal fact plane is a separate net-new feature track, and full taxonomy plus AAAK/diary-centric recall should be rejected as primary architecture. I used prior phase memory only to recover continuity; the findings below are based on current-turn source reads.
287572:197173	- **Recommendation**: adopt now
287579:197180	- **Recommendation**: adopt now
287586:197187	- **Recommendation**: prototype later
287589:197190	### Finding 4: L0-L3 wake-up is a presentation pattern, not a storage model to copy
287591:197192	- **What it does**: MemPalace’s wake-up stack is L0 identity text plus an L1 “essential story” built by sorting stored drawers by lightweight importance metadata and grouping by room; L2 and L3 are filtered retrieval and search over the same store.
287592:197193	- **Why it matters for us**: Public already has `session_bootstrap`, `memory_context`, hints, profiles, and progressive disclosure. The right transfer is a “wake-up profile” on the existing retrieval stack, not a second memory engine or AAAK-first startup contract.
287593:197194	- **Recommendation**: prototype later
287596:197197	### Finding 5: A separate temporal fact plane is the only true net-new feature track
287607:197208	- **Recommendation**: reject
287614:197215	- **Recommendation**: reject
287645:197246	- Questions addressed: hook timing and preservation; bootstrap/protocol authority; raw-verbatim versus ingest loss; layered wake-up behavior; temporal KG governance; AAAK/diary value; taxonomy ROI
287646:197247	- Questions answered: the adopt-now items are a compaction-time JSON-primary save checkpoint and a short bootstrap hint block; raw retention should become selective evidence support rather than total transcript storage; layered wake-up is only worth trying as a retrieval profile; the temporal fact plane is a separate stricter feature track; AAAK-first recall and full taxonomy should stay out
287652:197253	## Recommended Next Focus
287656:197257	4. Test a wake-up/recovery profile on top of existing `session_bootstrap` and `memory_search`, not a separate L0-L3 storage system.
287657:197258	5. Open a separate design track for temporal facts with mandatory citations, authority tiers, correction review, and invalidation provenance.
287658:197259	6. Keep wings/halls/rooms, AAAK-first wake-up, and diary-centric recall out of the near-term roadmap.
287668:197269	FINAL SYNTHESIS: Classify EVERY finding as adopt-now / prototype-later / new-feature-needed / reject. Executive summary.
287670:197271	MemPalace contributes two near-term ideas worth carrying into Public now: a compaction-time structured save checkpoint and a short bootstrap hint layer that teaches memory behavior. Everything else should stay scoped: selective verbatim evidence retention and layered wake-up are worth prototyping, a temporal fact plane is a separate net-new feature track, and full taxonomy plus AAAK/diary-centric recall should be rejected as primary architecture. I used prior phase memory only to recover continuity; the findings below are based on current-turn source reads.
287677:197278	- **Recommendation**: adopt now
287684:197285	- **Recommendation**: adopt now
287691:197292	- **Recommendation**: prototype later
287694:197295	### Finding 4: L0-L3 wake-up is a presentation pattern, not a storage model to copy
287696:197297	- **What it does**: MemPalace’s wake-up stack is L0 identity text plus an L1 “essential story” built by sorting stored drawers by lightweight importance metadata and grouping by room; L2 and L3 are filtered retrieval and search over the same store.
287697:197298	- **Why it matters for us**: Public already has `session_bootstrap`, `memory_context`, hints, profiles, and progressive disclosure. The right transfer is a “wake-up profile” on the existing retrieval stack, not a second memory engine or AAAK-first startup contract.
287698:197299	- **Recommendation**: prototype later
287701:197302	### Finding 5: A separate temporal fact plane is the only true net-new feature track
287712:197313	- **Recommendation**: reject
287719:197320	- **Recommendation**: reject
287750:197351	- Questions addressed: hook timing and preservation; bootstrap/protocol authority; raw-verbatim versus ingest loss; layered wake-up behavior; temporal KG governance; AAAK/diary value; taxonomy ROI
287751:197352	- Questions answered: the adopt-now items are a compaction-time JSON-primary save checkpoint and a short bootstrap hint block; raw retention should become selective evidence support rather than total transcript storage; layered wake-up is only worth trying as a retrieval profile; the temporal fact plane is a separate stricter feature track; AAAK-first recall and full taxonomy should stay out
287757:197358	## Recommended Next Focus
287761:197362	4. Test a wake-up/recovery profile on top of existing `session_bootstrap` and `memory_search`, not a separate L0-L3 storage system.
287762:197363	5. Open a separate design track for temporal facts with mandatory citations, authority tiers, correction review, and invalidation provenance.
287763:197364	6. Keep wings/halls/rooms, AAAK-first wake-up, and diary-centric recall out of the near-term roadmap.
287979:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:166:# Included in status response so the AI learns it on first wake-up call.
288044:/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "April 7|AAAK|lossy|regress|raw mode|benchmark|diary|wake-up|L0|L1|L2|L3|rooms" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
288105:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:148:mempalace wake-up > context.txt
288108:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:183:| **MemPalace wake-up** | **~170 tokens** | **~$0.70/yr** |
288109:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:186:MemPalace loads 170 tokens of critical facts on wake-up — your team, your projects, your preferences. Then searches only when needed. $10/year to remember everything vs $507/year for summaries that lose context.
288144:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:580:mempalace wake-up                                 # load L0 + L1 context
288145:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:581:mempalace wake-up --wing driftwood                # project-specific
288555:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py:391:        Generate wake-up text: L0 (identity) + L1 (essential story).
288556:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py:395:            wing: Optional wing filter for L1 (project-specific wake-up).
288575:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py:461:        print("  python layers.py wake-up              Show L0 + L1")
289822:   166	# Included in status response so the AI learns it on first wake-up call.
290183:  6047	ARCHITECTURE DECISION RECORD: Document the key architectural decisions this system made and why. Which decisions should we adopt and which should we reject?
290186:  6050	### Finding 1: Keep verbatim evidence as the authority, then add narrower retrieval views on top
290189:  6053	- **Why it matters**: This is the right architectural center of gravity. Public should not become raw-everything-by-default, but it should preserve more verbatim evidence for high-value decisions, quotes, and failure context instead of forcing every useful memory into a compressed abstraction.
290190:  6054	- **Recommendation**: adopt now
290197:  6061	- **Recommendation**: adopt now
290204:  6068	- **Recommendation**: adopt now
290207:  6071	### Finding 4: A cheap wake-up stack is reusable, but not as a replacement for Public’s stronger resume/bootstrap flow
290210:  6074	- **Why it matters**: Public already has the more robust recovery spine with `session_bootstrap`, `session_resume`, and structural freshness checks. The reusable part is the idea of a tiny, cheap “wake-up brief” for hot starts, not the whole MemPalace layering model as a new source of truth.
290211:  6075	- **Recommendation**: prototype later
290217:  6081	- **Why it matters**: This separation is architecturally sound. Public already has causal links and graph-aware retrieval, but not a true temporal fact store. A narrow temporal sidecar for changed facts, identities, and state transitions would reduce ambiguity without contaminating the main memory corpus.
290218:  6082	- **Recommendation**: prototype later
290225:  6089	- **Recommendation**: reject
290232:  6096	- **Recommendation**: reject
290238:  6102	## Recommended Next Focus
290239:  6103	Convert this ADR into a final adoption matrix for iteration 30: `adopt now` should be protocol bootstrap, bounded verbatim evidence retention, and local audit/repair surfaces; `prototype later` should be a temporal fact sidecar and optional wake-up brief; `reject` should remain forced hook-blocking saves and AAAK-centered compression as core architecture.
290242:I’m splitting one last recommendation that had been bundled too loosely in earlier passes: MemPalace’s observability and repair posture is worth copying, while the forced hook-blocking behavior is not. That gives us a cleaner final matrix and avoids rejecting the useful operational surfaces along with the noisy control flow.
290535:FINAL EXTENDED SYNTHESIS: Integrate all 30 iterations. Update the adopt/prototype/reject classification. Create the definitive recommendation set with priority, effort, and impact scores.
290542:- **Recommendation**: adopt now
290551:- **Recommendation**: adopt now
290560:- **Recommendation**: adopt now
290565:### Finding 4: Keep verbatim evidence only for high-stakes memories
290569:- **Recommendation**: prototype later
290574:### Finding 5: Treat L0-L3 wake-up as a retrieval profile, not a second memory system
290576:- **What it does**: MemPalace’s wake-up stack is real, but the implementation is basically identity text plus grouped high-importance snippets.
290577:- **Why it matters**: Public should prototype a wake-up profile on top of `session_bootstrap` and existing retrieval, not replicate the storage model.
290578:- **Recommendation**: prototype later
290583:### Finding 6: A temporal fact sidecar is the strongest long-term prototype
290587:- **Recommendation**: prototype later
290596:- **Recommendation**: reject
290605:- **Recommendation**: reject
290615:## Recommended Next Focus
290616:Implement the three `adopt now` items first in this order: compaction-time JSON-primary checkpoint, bootstrap memory-protocol hints, and audit/repair surfaces. After that, prototype selective verbatim evidence retention, a wake-up retrieval profile, and a citation-governed temporal fact sidecar; keep forced blocking saves, AAAK-first recall, and full palace taxonomy out of the near-term roadmap.
290626:FINAL EXTENDED SYNTHESIS: Integrate all 30 iterations. Update the adopt/prototype/reject classification. Create the definitive recommendation set with priority, effort, and impact scores.
290633:- **Recommendation**: adopt now
290642:- **Recommendation**: adopt now
290651:- **Recommendation**: adopt now
290656:### Finding 4: Keep verbatim evidence only for high-stakes memories
290660:- **Recommendation**: prototype later
290665:### Finding 5: Treat L0-L3 wake-up as a retrieval profile, not a second memory system
290667:- **What it does**: MemPalace’s wake-up stack is real, but the implementation is basically identity text plus grouped high-importance snippets.
290668:- **Why it matters**: Public should prototype a wake-up profile on top of `session_bootstrap` and existing retrieval, not replicate the storage model.
290669:- **Recommendation**: prototype later
290674:### Finding 6: A temporal fact sidecar is the strongest long-term prototype
290678:- **Recommendation**: prototype later
290687:- **Recommendation**: reject
290696:- **Recommendation**: reject
290706:## Recommended Next Focus
290707:Implement the three `adopt now` items first in this order: compaction-time JSON-primary checkpoint, bootstrap memory-protocol hints, and audit/repair surfaces. After that, prototype selective verbatim evidence retention, a wake-up retrieval profile, and a citation-governed temporal fact sidecar; keep forced blocking saves, AAAK-first recall, and full palace taxonomy out of the near-term roadmap.

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1161ms:

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
The phase folder itself looks incomplete on disk right now: `research/research.md` exists, but the expected Level 3 docs are missing from this checkout. I’m still continuing the read-only iteration because the request is explicitly research-only, and I’m pulling the validator result plus the final synthesis block to anchor the migration matrix to the already-set recommendation set.
codex
The validator passed, but only because this packet currently infers as Level 1 and the script couldn’t create its temp here-doc under the read-only sandbox. I’m now pulling exact source lines for the three adopt-now tracks and the matching Public surfaces so the risks, flags, and rollback plans are tied to real code paths instead of just earlier conclusions.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "PALACE_PROTOCOL|AAAK_SPEC|status|repair|compress|wake-up|add_drawer|duplicate|audit|diary|knowledge graph" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/plugins/spec-kit-compact-code-graph.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:44:// History (audit trail for file-watcher deletes)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:138:  status: string;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:165:    status: 'ok' | 'error';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:216:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:242:  status: 'ok' | 'timeout' | 'unavailable';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:281:function isMutationStatus(status: string | undefined): boolean {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:282:  return status === 'indexed' || status === 'updated' || status === 'reinforced' || status === 'deferred';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:594:    status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:636:          status: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:650:        status: 'timeout',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:680:  const codeGraphState = codeGraphStatus?.status === 'ok'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:681:    ? 'loaded code graph status'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:682:    : 'code graph status unavailable';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1292:        if (result.status === 'indexed') indexed++;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1293:        else if (result.status === 'updated') updated++;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1838:              if (isMutationStatus(result.status)) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1841:                    indexed: result.status === 'indexed' || result.status === 'deferred' ? 1 : 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1842:                    updated: result.status === 'updated' || result.status === 'reinforced' ? 1 : 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1847:                    status: result.status,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:89:  deduplicateResults as deduplicateWithSessionState,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1136:        resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:101:      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:102:      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:126:  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh:7:# 3. Returns a reason telling the AI to save structured diary + palace entries
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh:5:# gets compressed to free up context window space.
.opencode/plugins/spec-kit-compact-code-graph.js:296:      spec_kit_compact_code_graph_status: tool({
.opencode/plugins/spec-kit-compact-code-graph.js:297:        description: 'Show Spec Kit compact code graph plugin cache status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:18:    mempalace wake-up                     Show L0 + L1 wake-up context
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:19:    mempalace wake-up --wing my_app       Wake-up for a specific project
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:20:    mempalace status                      Show what's been filed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:118:    """Show L0 (identity) + L1 (essential story) — the wake-up context."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:161:def cmd_status(args):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:162:    from .miner import status
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:165:    status(palace_path=palace_path)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:168:def cmd_repair(args):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:196:        print("  Nothing to repair.")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:275:def cmd_compress(args):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:344:    total_compressed = 0
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:345:    compressed_entries = []
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:348:        compressed = dialect.compress(doc, metadata=meta)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:349:        stats = dialect.compression_stats(doc, compressed)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:352:        total_compressed += stats["compressed_chars"]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:354:        compressed_entries.append((doc_id, compressed, meta, stats))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:362:                f"    {stats['original_tokens']}t -> {stats['compressed_tokens']}t ({stats['ratio']:.1f}x)"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:364:            print(f"    {compressed}")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:367:    # Store compressed versions (unless dry-run)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:370:            comp_col = client.get_or_create_collection("mempalace_compressed")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:371:            for doc_id, compressed, meta, stats in compressed_entries:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:373:                comp_meta["compression_ratio"] = round(stats["ratio"], 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:377:                    documents=[compressed],
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:381:                f"  Stored {len(compressed_entries)} compressed drawers in 'mempalace_compressed' collection."
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:384:            print(f"  Error storing compressed drawers: {e}")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:388:    ratio = total_original / max(total_compressed, 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:390:    comp_tokens = Dialect.count_tokens("x" * total_compressed)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:391:    print(f"  Total: {orig_tokens:,}t -> {comp_tokens:,}t ({ratio:.1f}x compression)")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:461:    # compress
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:462:    p_compress = sub.add_parser(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:463:        "compress", help="Compress drawers using AAAK Dialect (~30x reduction)"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:465:    p_compress.add_argument("--wing", default=None, help="Wing to compress (default: all wings)")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:466:    p_compress.add_argument(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:467:        "--dry-run", action="store_true", help="Preview compression without storing"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:469:    p_compress.add_argument(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:473:    # wake-up
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:474:    p_wakeup = sub.add_parser("wake-up", help="Show L0 + L1 wake-up context (~600-900 tokens)")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:526:    for instr_name in ["init", "search", "mine", "help", "status"]:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:529:    # repair
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:531:        "repair",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:541:    # status
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:553:    sub.add_parser("status", help="Show what's been filed")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:584:        "compress": cmd_compress,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:585:        "wake-up": cmd_wakeup,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:586:        "repair": cmd_repair,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py:588:        "status": cmd_status,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:8:  mempalace_status          — total drawers, wing/room breakdown
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:13:  mempalace_check_duplicate — check if content already exists before filing
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:16:  mempalace_add_drawer      — file verbatim content into a wing/room
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:72:# This provides an audit trail for detecting memory poisoning and
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:139:def tool_status():
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:160:        "protocol": PALACE_PROTOCOL,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:161:        "aaak_dialect": AAAK_SPEC,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:166:# Included in status response so the AI learns it on first wake-up call.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:169:PALACE_PROTOCOL = """IMPORTANT — MemPalace Memory Protocol:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:170:1. ON WAKE-UP: Call mempalace_status to load palace overview + AAAK spec.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:173:4. AFTER EACH SESSION: call mempalace_diary_write to record what happened, what you learned, what matters.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:178:AAAK_SPEC = """AAAK is a compressed memory dialect that MemPalace uses for efficient storage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:259:def tool_check_duplicate(content: str, threshold: float = 0.9):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:269:        duplicates = []
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:277:                    duplicates.append(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:287:            "is_duplicate": len(duplicates) > 0,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:288:            "matches": duplicates,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:296:    return {"aaak_spec": AAAK_SPEC}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:326:def tool_add_drawer(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:329:    """File verbatim content into a wing/room. Checks for duplicates first."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:344:        "add_drawer",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:393:    # Log the deletion with the content being removed for audit trail
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:417:    """Query the knowledge graph for an entity's relationships."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:425:    """Add a relationship to the knowledge graph."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:477:def tool_diary_write(agent_name: str, entry: str, topic: str = "general"):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:479:    Write a diary entry for this agent. Each agent gets its own wing
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:480:    with a diary room. Entries are timestamped and accumulate over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:492:    room = "diary"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:498:    entry_id = f"diary_{wing}_{now.strftime('%Y%m%d_%H%M%S')}_{hashlib.sha256(entry[:50].encode()).hexdigest()[:12]}"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:501:        "diary_write",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:514:        # compressed AAAK degrades embedding quality).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:522:                    "hall": "hall_diary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:524:                    "type": "diary_entry",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:531:        logger.info(f"Diary entry: {entry_id} → {wing}/diary/{topic}")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:543:def tool_diary_read(agent_name: str, last_n: int = 10):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:545:    Read an agent's recent diary entries. Returns the last N entries
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:555:            where={"$and": [{"wing": wing}, {"room": "diary"}]},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:561:            return {"agent": agent_name, "entries": [], "message": "No diary entries yet."}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:591:    "mempalace_status": {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:594:        "handler": tool_status,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:617:        "description": "Get the AAAK dialect specification — the compressed memory format MemPalace uses. Call this if you need to read or write AAAK-compressed memories.",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:622:        "description": "Query the knowledge graph for an entity's relationships. Returns typed facts with temporal validity. E.g. 'Max' → child_of Alice, loves chess, does swimming. Filter by date with as_of to see what was true at a point in time.",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:644:        "description": "Add a fact to the knowledge graph. Subject → predicate → object with optional time window. E.g. ('Max', 'started_school', 'Year 7', valid_from='2026-09-01').",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:750:    "mempalace_check_duplicate": {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:763:        "handler": tool_check_duplicate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:765:    "mempalace_add_drawer": {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:766:        "description": "File verbatim content into the palace. Checks for duplicates first.",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:784:        "handler": tool_add_drawer,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:797:    "mempalace_diary_write": {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:798:        "description": "Write to your personal agent diary in AAAK format. Your observations, thoughts, what you worked on, what matters. Each agent has their own diary with full history. Write in AAAK for compression — e.g. 'SESSION:2026-04-04|built.palace.graph+diary.tools|ALC.req:agent.diaries.in.aaak|★★★'. Use entity codes from the AAAK spec.",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:804:                    "description": "Your name — each agent gets their own diary wing",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:808:                    "description": "Your diary entry in AAAK format — compressed, entity-coded, emotion-marked",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:817:        "handler": tool_diary_write,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:819:    "mempalace_diary_read": {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:820:        "description": "Read your recent diary entries (in AAAK). See what past versions of yourself recorded — your journal across sessions.",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:826:                    "description": "Your name — each agent gets their own diary wing",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py:835:        "handler": tool_diary_read,

exec
/bin/zsh -lc "sed -n '290532,290708p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/research.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Iteration 030: FINAL EXTENDED SYNTHESIS

## Focus
FINAL EXTENDED SYNTHESIS: Integrate all 30 iterations. Update the adopt/prototype/reject classification. Create the definitive recommendation set with priority, effort, and impact scores.

## Findings
### Finding 1: Add one compaction-time structured preservation checkpoint
- **Source**: [mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh#L129), [mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh#L64), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85)
- **What it does**: MemPalace blocks before compaction and periodically on stop; Public already has a compaction surface plus a deterministic JSON-primary save path.
- **Why it matters**: This is the highest-leverage transfer with the least churn.
- **Recommendation**: adopt now
- **Priority**: 1
- **Effort**: 2/5
- **Impact**: 5/5

### Finding 2: Add a tiny status/bootstrap memory-protocol hint block
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L155), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L684), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L785)
- **What it does**: MemPalace teaches agent behavior in `status`; Public already emits hints and structural bootstrap guidance.
- **Why it matters**: Public can copy the discipline without copying the palace metaphor.
- **Recommendation**: adopt now
- **Priority**: 2
- **Effort**: 1/5
- **Impact**: 4/5

### Finding 3: Copy observability and repair posture, not MemPalace control flow
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L37), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L70), [cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L168), [hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md#L83)
- **What it does**: MemPalace logs to `stderr`, keeps a JSONL WAL, records hook state, and exposes repair/rebuild commands.
- **Why it matters**: Those surfaces build trust and debuggability even if the save strategy itself is not portable.
- **Recommendation**: adopt now
- **Priority**: 3
- **Effort**: 2/5
- **Impact**: 4/5

### Finding 4: Keep verbatim evidence only for high-stakes memories
- **Source**: [searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L21), [convo_miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py#L53), [general_extractor.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py#L363), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85)
- **What it does**: MemPalace retrieves verbatim text, but ingest still chunks, truncates, and drops low-confidence segments.
- **Why it matters**: The right transfer is quote-carrying evidence support, not full raw transcript hoarding.
- **Recommendation**: prototype later
- **Priority**: 4
- **Effort**: 3/5
- **Impact**: 5/5

### Finding 5: Treat L0-L3 wake-up as a retrieval profile, not a second memory system
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L279), [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L79), [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L391), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L785)
- **What it does**: MemPalace’s wake-up stack is real, but the implementation is basically identity text plus grouped high-importance snippets.
- **Why it matters**: Public should prototype a wake-up profile on top of `session_bootstrap` and existing retrieval, not replicate the storage model.
- **Recommendation**: prototype later
- **Priority**: 5
- **Effort**: 2/5
- **Impact**: 3/5

### Finding 6: A temporal fact sidecar is the strongest long-term prototype
- **Source**: [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L74), [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L164), [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L180), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L449)
- **What it does**: MemPalace cleanly separates mutable facts into a temporal SQLite graph with `valid_from`, `valid_to`, timeline queries, and invalidation.
- **Why it matters**: Public does not have this today, and it is the clearest net-new capability if built with stricter evidence requirements.
- **Recommendation**: prototype later
- **Priority**: 6
- **Effort**: 4/5
- **Impact**: 5/5

### Finding 7: Reject forced hook-blocking saves as the primary preservation model
- **Source**: [hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md#L7), [mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh#L143), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L259), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L326)
- **What it does**: Hooks interrupt the runtime, but actual quality still depends on the model classifying and saving correctly; duplicate detection is advisory and not enforced in `add_drawer`.
- **Why it matters**: This is noisy UX with weak guarantees.
- **Recommendation**: reject
- **Priority**: 7
- **Effort**: 1/5
- **Impact**: 4/5

### Finding 8: Reject AAAK-first recall and full palace taxonomy as core Public architecture
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L58), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L292), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L510), [room_detector_local.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py#L97), [BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md#L604)
- **What it does**: AAAK is explicitly lossy and benchmark-worse than raw mode; room routing underperforms the stronger no-rooms hybrid baseline.
- **Why it matters**: Both ideas add governance and truthfulness risk without enough upside for Public’s current architecture.
- **Recommendation**: reject
- **Priority**: 8
- **Effort**: 1/5
- **Impact**: 3/5

## Assessment
- New information ratio: 0.10
- Repo note: `external/AGENTS.md` exists, `research/research.md` is an appended multi-pass file whose cleanest current verdict is the final synthesis block near the end, and there is no persisted `iteration-030.md`.
- Operational note: strict validation returned `PASSED`, but also emitted a temp-file warning under the read-only sandbox; I could not update the phase files, create `implementation-summary.md`, or run the phase memory save.

## Recommended Next Focus
Implement the three `adopt now` items first in this order: compaction-time JSON-primary checkpoint, bootstrap memory-protocol hints, and audit/repair surfaces. After that, prototype selective verbatim evidence retention, a wake-up retrieval profile, and a citation-governed temporal fact sidecar; keep forced blocking saves, AAAK-first recall, and full palace taxonomy out of the near-term roadmap.


hook: Stop
hook: Stop Completed
tokens used
127,011
# Iteration 030: FINAL EXTENDED SYNTHESIS

## Focus
FINAL EXTENDED SYNTHESIS: Integrate all 30 iterations. Update the adopt/prototype/reject classification. Create the definitive recommendation set with priority, effort, and impact scores.

## Findings
### Finding 1: Add one compaction-time structured preservation checkpoint
- **Source**: [mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh#L129), [mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh#L64), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85)
- **What it does**: MemPalace blocks before compaction and periodically on stop; Public already has a compaction surface plus a deterministic JSON-primary save path.
- **Why it matters**: This is the highest-leverage transfer with the least churn.
- **Recommendation**: adopt now
- **Priority**: 1
- **Effort**: 2/5
- **Impact**: 5/5

### Finding 2: Add a tiny status/bootstrap memory-protocol hint block
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L155), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L684), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L785)
- **What it does**: MemPalace teaches agent behavior in `status`; Public already emits hints and structural bootstrap guidance.
- **Why it matters**: Public can copy the discipline without copying the palace metaphor.
- **Recommendation**: adopt now
- **Priority**: 2
- **Effort**: 1/5
- **Impact**: 4/5

### Finding 3: Copy observability and repair posture, not MemPalace control flow
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L37), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L70), [cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L168), [hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md#L83)
- **What it does**: MemPalace logs to `stderr`, keeps a JSONL WAL, records hook state, and exposes repair/rebuild commands.
- **Why it matters**: Those surfaces build trust and debuggability even if the save strategy itself is not portable.
- **Recommendation**: adopt now
- **Priority**: 3
- **Effort**: 2/5
- **Impact**: 4/5

### Finding 4: Keep verbatim evidence only for high-stakes memories
- **Source**: [searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L21), [convo_miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py#L53), [general_extractor.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py#L363), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85)
- **What it does**: MemPalace retrieves verbatim text, but ingest still chunks, truncates, and drops low-confidence segments.
- **Why it matters**: The right transfer is quote-carrying evidence support, not full raw transcript hoarding.
- **Recommendation**: prototype later
- **Priority**: 4
- **Effort**: 3/5
- **Impact**: 5/5

### Finding 5: Treat L0-L3 wake-up as a retrieval profile, not a second memory system
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L279), [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L79), [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L391), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L785)
- **What it does**: MemPalace’s wake-up stack is real, but the implementation is basically identity text plus grouped high-importance snippets.
- **Why it matters**: Public should prototype a wake-up profile on top of `session_bootstrap` and existing retrieval, not replicate the storage model.
- **Recommendation**: prototype later
- **Priority**: 5
- **Effort**: 2/5
- **Impact**: 3/5

### Finding 6: A temporal fact sidecar is the strongest long-term prototype
- **Source**: [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L74), [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L164), [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L180), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L449)
- **What it does**: MemPalace cleanly separates mutable facts into a temporal SQLite graph with `valid_from`, `valid_to`, timeline queries, and invalidation.
- **Why it matters**: Public does not have this today, and it is the clearest net-new capability if built with stricter evidence requirements.
- **Recommendation**: prototype later
- **Priority**: 6
- **Effort**: 4/5
- **Impact**: 5/5

### Finding 7: Reject forced hook-blocking saves as the primary preservation model
- **Source**: [hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md#L7), [mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh#L143), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L259), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L326)
- **What it does**: Hooks interrupt the runtime, but actual quality still depends on the model classifying and saving correctly; duplicate detection is advisory and not enforced in `add_drawer`.
- **Why it matters**: This is noisy UX with weak guarantees.
- **Recommendation**: reject
- **Priority**: 7
- **Effort**: 1/5
- **Impact**: 4/5

### Finding 8: Reject AAAK-first recall and full palace taxonomy as core Public architecture
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L58), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L292), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L510), [room_detector_local.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py#L97), [BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md#L604)
- **What it does**: AAAK is explicitly lossy and benchmark-worse than raw mode; room routing underperforms the stronger no-rooms hybrid baseline.
- **Why it matters**: Both ideas add governance and truthfulness risk without enough upside for Public’s current architecture.
- **Recommendation**: reject
- **Priority**: 8
- **Effort**: 1/5
- **Impact**: 3/5

## Assessment
- New information ratio: 0.10
- Repo note: `external/AGENTS.md` exists, `research/research.md` is an appended multi-pass file whose cleanest current verdict is the final synthesis block near the end, and there is no persisted `iteration-030.md`.
- Operational note: strict validation returned `PASSED`, but also emitted a temp-file warning under the read-only sandbox; I could not update the phase files, create `implementation-summary.md`, or run the phase memory save.

## Recommended Next Focus
Implement the three `adopt now` items first in this order: compaction-time JSON-primary checkpoint, bootstrap memory-protocol hints, and audit/repair surfaces. After that, prototype selective verbatim evidence retention, a wake-up retrieval profile, and a citation-governed temporal fact sidecar; keep forced blocking saves, AAAK-first recall, and full palace taxonomy out of the near-term roadmap.


codex
I have the recommendation baseline now: the current packet already converged on three adopt-now items, and iteration 32 is about whether each one can survive migration cleanly. I’m reading the implementation line ranges behind those three items next so I can separate “worth adopting” from “safe to roll out without breaking current flows.”
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh | sed -n '110,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py | sed -n '32,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py | sed -n '250,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py | sed -n '155,230p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '70,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '660,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   660	  if (timeoutHandle) {
   661	    clearTimeout(timeoutHandle);
   662	  }
   663	  return graphContext;
   664	}
   665	
   666	function injectSessionPrimeHints(
   667	  envelope: Record<string, unknown>,
   668	  meta: Record<string, unknown>,
   669	  sessionPrimeContext: AutoSurfaceResult,
   670	): void {
   671	  const hints = Array.isArray(envelope.hints)
   672	    ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
   673	    : [];
   674	  envelope.hints = hints;
   675	
   676	  const constitutionalCount = Array.isArray(sessionPrimeContext.constitutional)
   677	    ? sessionPrimeContext.constitutional.length
   678	    : 0;
   679	  const codeGraphStatus = sessionPrimeContext.codeGraphStatus;
   680	  const codeGraphState = codeGraphStatus?.status === 'ok'
   681	    ? 'loaded code graph status'
   682	    : 'code graph status unavailable';
   683	
   684	  hints.push(
   685	    `Session priming: loaded ${constitutionalCount} constitutional memories and ${codeGraphState}`
   686	  );
   687	
   688	  // T018: Include Prime Package hints for non-hook CLIs
   689	  const pkg = sessionPrimeContext.primePackage;
   690	  if (pkg) {
   691	    if (pkg.specFolder) {
   692	      hints.push(`Active spec folder: ${pkg.specFolder}`);
   693	    }
   694	    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
   695	    if (pkg.recommendedCalls.length > 0) {
   696	      hints.push(`Recommended next calls: ${pkg.recommendedCalls.join(', ')}`);
   697	    }
   698	  }
   699	
   700	  meta.sessionPriming = sessionPrimeContext;
   701	}
   702	
   703	async function getMemoryStats(): Promise<DynamicMemoryStats> {
   704	  try {
   705	    const response = await handleMemoryStats({
   706	      folderRanking: 'count',
   707	      includeArchived: true,
   708	      limit: 100,
   709	    });
   710	    const payload = response?.content?.[0]?.text;
   711	    if (typeof payload !== 'string' || payload.length === 0) {
   712	      return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
   713	    }
   714	
   715	    const parsed = JSON.parse(payload) as Record<string, unknown>;
   716	    const data = (parsed.data ?? {}) as Record<string, unknown>;
   717	    const byStatus = (data.byStatus ?? {}) as Record<string, unknown>;
   718	    const topFolders = Array.isArray(data.topFolders) ? data.topFolders : [];
   719	    const success = typeof byStatus.success === 'number' ? byStatus.success : 0;
   720	    const pending = typeof byStatus.pending === 'number' ? byStatus.pending : 0;
   721	    const failed = typeof byStatus.failed === 'number' ? byStatus.failed : 0;
   722	    const retry = typeof byStatus.retry === 'number' ? byStatus.retry : 0;
   723	    const totalSpecFolders = typeof data.totalSpecFolders === 'number'
   724	      ? data.totalSpecFolders
   725	      : topFolders.length;
   726	
   727	    return {
   728	      totalMemories: typeof data.totalMemories === 'number' ? data.totalMemories : 0,
   729	      specFolderCount: totalSpecFolders,
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
   811	  return lines.filter(Boolean).join(' ');
   812	}
   813	
   814	/** Register a callback to be invoked asynchronously after each tool call completes. */
   815	export function registerAfterToolCallback(fn: AfterToolCallback): void {
   816	  afterToolCallbacks.push(fn);
   817	}
   818	
   819	async function invalidateReinitializedDbCaches(): Promise<void> {
   820	  const invalidatedEntries = toolCache.clear();

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1040,1155p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '360,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1040	    formatted = applyPublicationGateToResponse(formatted);
  1041	
  1042	    const cachePayload = extractSearchCachePayload(formatted);
  1043	    if (cachePayload && cacheEnabled) {
  1044	      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
  1045	    }
  1046	
  1047	    responseToReturn = cachePayload
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

 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md | sed -n '1,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "session_bootstrap|memory_health|memory_stats|memory_index_scan|session_resume|code_graph_scan|tool routing|Session Recovery|Structural Bootstrap" .opencode/skill/system-spec-kit/mcp_server/context-server.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
215:  'code_graph_scan',
257:  preservesAuthority: 'session_bootstrap';
323:    preservesAuthority: 'session_bootstrap',
377:// Stores the last resolved session ID so non-search tools (e.g. memory_stats)
752:    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
774:      lines.push('## Session Recovery');
784:  lines.push('## Structural Bootstrap (Phase 027)');
785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
809:  } catch { /* tool routing snapshot unavailable — skip */ }
1243:      console.error('[context-server] Run memory_index_scan manually after model loads');

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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py | sed -n '70,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
The external side is clear now: the adopt-now value comes from timing, protocol teaching, and repairability, while the risky parts are the blocking control flow and weak duplicate guarantees around it. I’m doing one last pass on the current Public tool surfaces so the migration notes say what would actually regress here, not just what could regress in theory.
exec
/bin/zsh -lc "rg -n \"experimental\\.session\\.compacting|messagesTransform|compaction\" .opencode/plugins/spec-kit-compact-code-graph.js .opencode/plugins -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/plugins/spec-kit-compact-code-graph.js:76: *   messagesTransform: TransportBlock[],
.opencode/plugins/spec-kit-compact-code-graph.js:77: *   compaction?: TransportBlock,
.opencode/plugins/spec-kit-compact-code-graph.js:136:    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
.opencode/plugins/spec-kit-compact-code-graph.js:369:      if (!plan || plan.messagesTransform.length === 0) {
.opencode/plugins/spec-kit-compact-code-graph.js:373:      for (const block of plan.messagesTransform) {
.opencode/plugins/spec-kit-compact-code-graph.js:396:    'experimental.session.compacting': async (input, output) => {
.opencode/plugins/spec-kit-compact-code-graph.js:406:      const block = plan?.compaction;
.opencode/plugins/spec-kit-opencode-message-schema.mjs:48:  'compaction',
.opencode/plugins/spec-kit-compact-code-graph.js:76: *   messagesTransform: TransportBlock[],
.opencode/plugins/spec-kit-compact-code-graph.js:77: *   compaction?: TransportBlock,
.opencode/plugins/spec-kit-compact-code-graph.js:136:    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
.opencode/plugins/spec-kit-compact-code-graph.js:369:      if (!plan || plan.messagesTransform.length === 0) {
.opencode/plugins/spec-kit-compact-code-graph.js:373:      for (const block of plan.messagesTransform) {
.opencode/plugins/spec-kit-compact-code-graph.js:396:    'experimental.session.compacting': async (input, output) => {
.opencode/plugins/spec-kit-compact-code-graph.js:406:      const block = plan?.compaction;

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md | sed -n '50,95p;175,205p;275,315p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"memory_health|session_bootstrap|session_resume|memory_index_scan|memory_stats|memory_save|code_graph_status|code_graph_scan\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:215:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:216:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:377:// Stores the last resolved session ID so non-search tools (e.g. memory_stats)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:752:    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1243:      console.error('[context-server] Run memory_index_scan manually after model loads');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:11:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:41:/** Arguments for the memory_stats handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:30:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:108:        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:109:        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:291:  hints.push(`Run memory_index_scan({ force: true }) to re-index if needed`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:13:// Feature catalog: System statistics (memory_stats)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:35:const handle_memory_stats = handleMemoryStats;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:44:  handle_memory_stats,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:7:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:26:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:254:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:284:      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:291:          'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:8:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:10:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:36:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:124: * Result payload from reconsolidation pre-checks during memory_save.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:301:                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:322:            reason: `memory_save: reconsolidation ${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:329:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:335:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:10:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:11:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:459:    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:18:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:88:            reason: 'memory_save: reinforced existing memory via prediction-error gate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:93:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:99:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:140:          reason: 'memory_save: updated existing memory via prediction-error gate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:145:            tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:151:          actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:144:      ? 'memory_save: updated indexed memory entry'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:145:      : 'memory_save: created new indexed memory entry',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:150:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:160:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:251:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:269:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:285:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:462:    tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/README.md:178:  "tool": "memory_health",
.opencode/skill/system-spec-kit/mcp_server/README.md:189:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:543:**Read-path readiness:** `ensureCodeGraphReady()` runs automatically inside `code_graph_query` and `code_graph_context`. It checks graph freshness, returns a `readiness` block, and performs bounded inline selective reindex only when the stale set is small enough to repair safely on the read path. Empty graphs, large stale sets, and other full-scan cases remain explicit `code_graph_scan` work.
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:699:##### `memory_save`
.opencode/skill/system-spec-kit/mcp_server/README.md:723:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:749:##### `memory_stats`
.opencode/skill/system-spec-kit/mcp_server/README.md:763:##### `memory_health`
.opencode/skill/system-spec-kit/mcp_server/README.md:1093:##### `memory_index_scan`
.opencode/skill/system-spec-kit/mcp_server/README.md:1152:##### `code_graph_scan`
.opencode/skill/system-spec-kit/mcp_server/README.md:1165:##### `code_graph_status`
.opencode/skill/system-spec-kit/mcp_server/README.md:1304:| `SPEC_KIT_BATCH_SIZE` | `5` | Batch size for `memory_index_scan` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1354:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
.opencode/skill/system-spec-kit/mcp_server/README.md:1537:| Repair an empty or broadly stale code graph | `code_graph_scan` | Use when readiness reports `full_scan` or the graph is missing |
.opencode/skill/system-spec-kit/mcp_server/README.md:1541:| See what is indexed | `memory_list` + `memory_stats` | Browse and count |
.opencode/skill/system-spec-kit/mcp_server/README.md:1542:| Diagnose search problems | `memory_health` | Set `reportMode: "full"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1543:| Test a save without committing | `memory_save` | Set `dryRun: true` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1563:{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1581:{ "tool": "memory_save", "arguments": { "filePath": "/path/to/file.md", "dryRun": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1607:**What you see**: `memory_stats` shows fewer memories than expected.
.opencode/skill/system-spec-kit/mcp_server/README.md:1641:| Search returning empty | Run `memory_index_scan` to re-index |
.opencode/skill/system-spec-kit/mcp_server/README.md:1663:{ "tool": "memory_health", "arguments": { "reportMode": "divergent_aliases", "limit": 20 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1699:A typical project with a few hundred memory files uses 10-50 MB. The vector table (1024-dimension float32 embeddings) is the largest contributor. Check with `memory_stats` using `includeScores: true`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1721:**Q: What does the dryRun parameter do on memory_save?**
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:28:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:613:    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:618:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:628:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:18:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:233:export const handle_memory_save = lazyFunction(getMemorySaveModule, 'handle_memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:266:export const handle_memory_stats = lazyFunction(getMemoryCrudModule, 'handle_memory_stats');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:267:export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:275:export const handle_memory_index_scan = lazyFunction(getMemoryIndexModule, 'handle_memory_index_scan');
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:44:- `code-graph/scan.ts` - `code_graph_scan`: index workspace files, build structural graph.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:46:- `code-graph/status.ts` - `code_graph_status`: report graph health and statistics.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:60:      hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:61:      actions: ['Restart the MCP server', 'Call memory_index_scan()'],
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
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:4:// MCP tool handler for code_graph_status — reports graph health.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:9:/** Handle code_graph_status tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:9:| `scan.ts` | `code_graph_scan` | Index workspace files, build structural graph |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:11:| `status.ts` | `code_graph_status` | Report graph health and statistics |
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:17:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:236:        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:237:        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:263:    hints.push('Run memory_index_scan() to regenerate embeddings');
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:401:  memory_save: memorySaveSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:403:  memory_stats: memoryStatsSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:404:  memory_health: memoryHealthSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:421:  memory_index_scan: memoryIndexScanSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:468:  memory_stats: ['folderRanking', 'excludePatterns', 'includeScores', 'includeArchived', 'limit'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:469:  memory_health: ['reportMode', 'limit', 'specFolder', 'autoRepair', 'confirmed'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:486:  memory_index_scan: ['specFolder', 'force', 'includeConstitutional', 'includeSpecDocs', 'incremental'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:15:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:4:// MCP tool handler for code_graph_scan — indexes workspace files.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:123:/** Handle code_graph_scan tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:10:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:91:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:92:  'memory_index_scan'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:457:    recommendedCalls.push('code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:99:      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:297:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:303:      recordHistory(nextMemoryId, 'ADD', null, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:304:      recordHistory(memoryId, 'UPDATE', previous.title, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:19:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:21:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:58:    case 'code_graph_scan':
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:67:    case 'code_graph_status':
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:334:        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:462:          `Run memory_index_scan with force:true to rebuild FTS5 index.`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:24:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:65:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:67:  'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:68:  'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:100:    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:102:    case 'memory_stats':          return handleMemoryStats(parseArgs<StatsArgs>(validateToolArgs('memory_stats', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:103:    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:143:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:155:      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:169:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:48:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:148:/** Handle memory_index_scan tool - scans and indexes memory files with incremental support */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:153:      tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:157:        hint: 'Retry memory_index_scan after checkpoint_restore maintenance completes.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:176:      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:180:    console.warn('[memory_index_scan] Could not verify embedding dimension:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:195:      tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:271:              'mcp:memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:312:      tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:631:    tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:671:const handle_memory_index_scan = handleMemoryIndexScan;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:680:  handle_memory_index_scan,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:39:        'handle_memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:47:  'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:68:    case 'memory_index_scan':          return handleMemoryIndexScan(parseArgs<ScanArgs>(validateToolArgs('memory_index_scan', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:243:      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:255:    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:23:// Feature catalog: System statistics (memory_stats)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:30:/** Handle memory_stats tool -- returns memory system statistics and folder rankings. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:40:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:51:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:52:      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:70:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:80:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:89:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:98:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:107:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:116:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:159:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:283:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:302:    tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:307:      const id = mod.recordHistory(1, 'ADD', null, 'reconsolidation test', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:314:      expect(entry!.actor).toBe('mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:353:      'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:359:      'mcp:memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:47:description: "Durable regression fixture for memory_save UX contract coverage."
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68:Continue validating the \`memory_save\` UX contract with a fixture that is rich enough to satisfy the durable-memory gate while still exercising duplicate no-op, deferred embedding, and post-mutation feedback behavior.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:85:| \`mcp_server/handlers/memory-save.ts\` | Coordinates duplicate detection, sufficiency evaluation, template validation, and post-mutation feedback for \`memory_save\`. |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:248:  it('memory_save success response exposes postMutationHooks contract fields and types', async () => {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:218:  name: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:231:  name: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:268:        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:562:  name: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:624:  name: 'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:657:  name: 'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/database/README.md:72:- Use MCP tools (`memory_stats`, `memory_health`, `memory_index_scan`) for normal operations.
.opencode/skill/system-spec-kit/mcp_server/database/README.md:74:- Empty or broadly stale structural states still require explicit `code_graph_scan` to rebuild the graph database.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:120:- `code-graph.sqlite` (auto-created on first `code_graph_scan`, stored alongside `context-index.sqlite`)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:127:- empty or broadly stale graphs still require explicit `code_graph_scan`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:429:- `memory_save` (index new memories)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:430:- `memory_index_scan` (bulk indexing)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:431:- `memory_stats` (system statistics)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:432:- `code_graph_scan` (structural code indexing)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:434:- `code_graph_status` (graph health check)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:490:# This calls memory_index_scan() internally
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:563:### memory_save: Index a Memory File
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:565:`memory_save()` indexes a single new or updated memory file into the database. For bulk indexing, use `memory_index_scan()` instead.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:567:### memory_index_scan: Bulk Indexing
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:569:`memory_index_scan()` scans the workspace for new or changed memory files and indexes them.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:577:### memory_stats: System Statistics
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:579:`memory_stats()` returns counts, dates and top-ranked folders for the memory system. Use it to confirm indexing is working and to inspect database health.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:706:1. AI calls `memory_index_scan({ force: false })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:790:| Server starts but returns no memories | No indexed memories yet, or embeddings are pending | Run `memory_index_scan({ force: true })` via your AI |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:791:| `code_graph_query` reports `full_scan` or `inline full scan skipped for read path` | The graph is empty or too stale for bounded read-path repair | Run `code_graph_scan`, then retry the structural read |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:792:| Startup or resume shows graph `stale` | Freshness-aware startup detected drift before a structural read ran | Run a structural read to allow bounded inline repair, or run `code_graph_scan` for broader stale states |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:863:Recovery: ask your AI "Index all memory files" (calls `memory_index_scan({ force: true })`). Restart your MCP client after manual database operations.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:970:This calls `memory_index_scan({ force: true })` to repopulate the search index from the restored database.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1048:           memory_save, memory_index_scan, memory_stats
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:88:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:103:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:143:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:152:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:170:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:176:    expect(review.summary.byAction).toEqual({ memory_save: 2 });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:181:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:189:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:207:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:109:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:121:      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:135:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:479:describe('memory_health schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:482:      validateToolInputSchema('memory_health', { reportMode: 'divergent_aliases', limit: 201 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:488:      validateToolInputSchema('memory_health', { autoRepair: true, confirmed: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:493:    const parsed = validateToolArgs('memory_health', { autoRepair: true, confirmed: true });
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:              producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:31:              sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:62:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:86:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:98:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:107:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:108:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:120:    expect(parsed.data.hints.some((hint: string) => hint.includes('Run code_graph_scan'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:121:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:274:| Full validation | `runPreflight()` | Before memory_save |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:8:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:191:  it('T024: memory_save has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:192:    expect(TOOL_SPECIFIC_HINTS.memory_save).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:193:    expect(typeof TOOL_SPECIFIC_HINTS.memory_save).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:196:  it('T025: memory_index_scan has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:197:    expect(TOOL_SPECIFIC_HINTS.memory_index_scan).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:198:    expect(typeof TOOL_SPECIFIC_HINTS.memory_index_scan).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:229:  it('T030: memory_save FILE_NOT_FOUND has contextual guidance', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:231:      TOOL_SPECIFIC_HINTS.memory_save?.[ERROR_CODES.FILE_NOT_FOUND];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:292:    const fullHint = getRecoveryHint('memory_save', ERROR_CODES.VALIDATION_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:299:    const saveEmbedHint = getRecoveryHint('memory_save', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:434:  it('T058: DEFAULT_HINT actions include memory_health() reference (REQ-009)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:437:      a.includes('memory_health()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:446:  it('T060: DEFAULT_HINT has toolTip for memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:447:    expect(DEFAULT_HINT.toolTip).toBe('memory_health()');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:68:    expect(parsed.data.graphOps.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:96:      const key2 = generateCacheKey('memory_save', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:354:      const key3 = generateCacheKey('memory_save', { query: 'test3' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:357:      set(key3, 'value3', { toolName: 'memory_save' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:367:      const key2 = generateCacheKey('memory_save', { query: 'test2' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:370:      set(key2, 'value2', { toolName: 'memory_save' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:381:      const key2 = generateCacheKey('memory_save', { query: 'test2' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:384:      set(key2, 'value2', { toolName: 'memory_save' });
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:56:    toolPattern: /^(bash|memory_save|memory_update)$/i,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:39:        'handle_memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:680:        actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:687:          actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:76:        'handle_memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:77:        'handle_memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:208:// After memory_save operation
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:130:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:20:        memory_save: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:23:        memory_stats: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:24:        memory_health: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:35:        memory_index_scan: 1000,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:57:  memory_save: ERROR_CODES.MEMORY_SAVE_FAILED,
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-retry-stats.vitest.ts:3:// Phase 004 CHK-023 (memory_health embeddingRetry), CHK-024 (retry manager edge cases)
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:49:    tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:62:    tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:68:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:162:    tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:178:  { tool: 'memory_save', handler: 'handleMemorySave' },
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:158:  'memory_save'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:163:      'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:165:      'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:166:      'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:187:      'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:192:      'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:194:      'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:293:      'memory_delete', 'memory_update', 'memory_bulk_delete', 'memory_list', 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:301:      'code_graph_scan', 'code_graph_query', 'code_graph_status', 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:322:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:998:        { id: 'call-3', params: { name: 'memory_stats', arguments: {} } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1064:          { id: 'call-follow-2', params: { name: 'memory_stats', arguments: {} } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1376:      expect(instructions).toContain('Warning: 12 stale memories detected. Consider running memory_index_scan.')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1670:    it('T28h: L7 budget = 1000 (memory_index_scan)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1675:      expect(layerDefs!.getTokenBudget!('memory_index_scan')).toBe(1000)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1703:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2087:      'memory_save': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2089:      'memory_stats': '[L3:Discovery]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2090:      'memory_health': '[L3:Discovery]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2106:      'memory_index_scan': '[L7:Maintenance]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2308:        ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2315:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2343:      expect(result).toContain('memory_save')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2365:      expect(atBoundary).not.toContain('Consider running memory_index_scan')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2375:      expect(aboveBoundary).toContain('Consider running memory_index_scan')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2448:      // Warning text must suggest memory_index_scan
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2449:      expect(fnBody).toMatch(/memory_index_scan/)
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:138:// Default hint is "Run memory_health() for diagnostics".
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:149:      'Run memory_health() to check embedding system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:152:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:157:      'Run memory_index_scan with force=true to rebuild index',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:162:    toolTip: 'memory_index_scan({ force: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:179:      'Run memory_health() to see current provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:182:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:242:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:247:      'Run memory_health() to check database integrity',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:252:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:268:      'Contact support with schema version info from memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:271:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:276:      'Run memory_health() to assess damage',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:278:      'If no checkpoint available, rebuild index: memory_index_scan({ force: true })'
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
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:509:      'Use memory_save({ dryRun: true }) to validate first',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:513:    toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:529:      'Run memory_health() to check database status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:532:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:542:    toolTip: 'memory_save({ force: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:549:      'Run memory_save({ dryRun: true }) for detailed validation report',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:554:    toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:659:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:663:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:677:    'Run memory_health() for diagnostics',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:682:  toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:699:        'Check embedding provider status: memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:709:        'Run memory_index_scan() to rebuild if needed',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:713:      toolTip: 'memory_index_scan()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:734:        'Run memory_health() to verify database integrity'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:737:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:742:  memory_save: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:747:        'Create the memory file before calling memory_save',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:757:        'Check memory_health() for embedding provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:760:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:770:      toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:775:  memory_index_scan: {
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 880,           // actual: 862 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools, Phase 024 session_bootstrap, and newer graph/search tool contracts
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:119:        memory_save: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:122:        memory_stats: 'L3',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:123:        memory_health: 'L3',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:137:        memory_index_scan: 'L7',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:200:        { tool: 'memory_index_scan', expected: '[L7:Maintenance]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:258:        { tool: 'memory_index_scan', expected: 1000 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:432:                           'memory_index_scan'];
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:548: * `memory_index_scan` picks up the gap and re-embeds the memory. This avoids blocking
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:46:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:51:      expect(envelope.meta.tool).toBe('memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:176:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:196:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:835:      "query": "memory_save keeps failing with duplicate content hash error",
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:97:    expect(brief.startupSurface).toContain('- Code Graph: empty -- run `code_graph_scan`');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:199:    const status = await hooks.tool?.spec_kit_compact_code_graph_status.execute({});
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:227:    const status = await hooks.tool?.spec_kit_compact_code_graph_status.execute({});
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:23:    expect(contract.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:448:  it('J2: DEFAULT_HINT actions reference memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:450:    expect(actionsStr).toContain('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:469:  it('K2: Has memory_search, checkpoint_restore, memory_save', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:472:    expect('memory_save' in TOOL_SPECIFIC_HINTS).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:9:  { tool: 'memory_save', handler: 'handleMemorySave', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:11:  { tool: 'memory_stats', handler: 'handleMemoryStats', layer: 'L3' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:12:  { tool: 'memory_health', handler: 'handleMemoryHealth', layer: 'L3' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:28:  { tool: 'memory_index_scan', handler: 'handleMemoryIndexScan', layer: 'L7' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:35:  { camel: 'handleMemorySave', snake: 'handle_memory_save' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:37:  { camel: 'handleMemoryStats', snake: 'handle_memory_stats' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:38:  { camel: 'handleMemoryHealth', snake: 'handle_memory_health' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:55:  { camel: 'handleMemoryIndexScan', snake: 'handle_memory_index_scan' },
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:147:  it('returns null for memory_save', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:148:    const result = await autoSurfaceAtToolDispatch('memory_save', { filePath: '/some/path.md' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:152:  it('returns null for memory_index_scan', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:153:    const result = await autoSurfaceAtToolDispatch('memory_index_scan', { specFolder: 'specs/001' });
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:91:    expect(getDefaultErrorCodeForTool('memory_save')).toBe('E081');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:99:    recordHistory(1, 'ADD', null, 'Version 1', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:103:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:113:    recordHistory(2, 'ADD', null, 'Version 2', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:118:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:135:    expect(matchRule('memory_save', 'git commit -m "x"')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:115:    tools: ['memory_index_scan', 'memory_get_learning_history', 'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel', 'code_graph_scan', 'code_graph_status', 'ccc_status', 'ccc_reindex', 'ccc_feedback']
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:125:    textBrief: 'No anchors resolved. Try `code_graph_scan` first, or provide a `subject` or `seeds[]`.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:127:    nextActions: ['Run `code_graph_scan` to index the workspace', 'Provide `subject` parameter with a symbol name'],
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:153:    actions.push('Run `code_graph_scan` to improve resolution (file anchors found)');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:538:    recordHistory(memoryId, 'ADD', null, parsed.title ?? filePath, params.actor ?? 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:816:      actor: params.actor ?? 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:116:    codeGraphLine = 'empty -- run `code_graph_scan`';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:157:      lines.push('Freshness: stale — first structural read may trigger bounded inline refresh or recommend code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:31:    surface: 'memory_health';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:88:      surface: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:100:      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:673:Processing steps applied during `memory_save` before a memory is persisted.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:725:`memory_index_scan` now runs the broader post-mutation invalidation hook behavior whenever a scan indexes, updates, or stale-deletes rows.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '735,780p;595,620p;538,548p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   538	
   539	**Storage:** `database/code-graph.sqlite` (separate from `database/context-index.sqlite`), with tables: `code_files`, `code_nodes`, `code_edges`, and `code_graph_metadata`.
   540	
   541	**Edge types:** `CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, `DECORATES`, `OVERRIDES`, `TYPE_OF`.
   542	
   543	**Read-path readiness:** `ensureCodeGraphReady()` runs automatically inside `code_graph_query` and `code_graph_context`. It checks graph freshness, returns a `readiness` block, and performs bounded inline selective reindex only when the stale set is small enough to repair safely on the read path. Empty graphs, large stale sets, and other full-scan cases remain explicit `code_graph_scan` work.
   544	
   545	**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
   546	
   547	**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
   548	
   595	```
   596	
   597	---
   598	
   599	##### `session_resume`
   600	
   601	Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
   602	
   603	| Parameter | Type | Notes |
   604	|-----------|------|-------|
   605	| `specFolder` | string | Scope resume to a specific spec folder |
   606	| `minimal` | boolean | Skip heavy memory context, return code graph, CocoIndex, structural context, hints, and optional session quality without the full memory payload |
   607	
   608	---
   609	
   610	##### `session_bootstrap`
   611	
   612	Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
   613	
   614	| Parameter | Type | Notes |
   615	|-----------|------|-------|
   616	| `specFolder` | string | Scope bootstrap to a specific spec folder |
   617	
   618	---
   619	
   620	#### L2: Core (4 tools)
   735	##### `memory_list`
   736	
   737	Browse what is stored. Like opening a filing cabinet and looking at the folder labels. Use this to discover what is in the index and find IDs for delete or update operations.
   738	
   739	| Parameter | Type | Notes |
   740	|-----------|------|-------|
   741	| `limit` | number | Max 100 per page |
   742	| `offset` | number | Pagination offset |
   743	| `specFolder` | string | Scope to a folder |
   744	| `sortBy` | string | `created_at`, `updated_at` or `importance_weight` |
   745	| `includeChunks` | boolean | Include chunk-level detail |
   746	
   747	---
   748	
   749	##### `memory_stats`
   750	
   751	Get the big picture. How many memories are stored, when they were last updated, which folders have the most content and how the importance tiers are distributed. Think of it like a dashboard for your knowledge base.
   752	
   753	| Parameter | Type | Notes |
   754	|-----------|------|-------|
   755	| `folderRanking` | string | `count`, `recency`, `importance` or `composite` |
   756	| `excludePatterns` | string[] | Glob patterns to exclude |
   757	| `includeScores` | boolean | Include composite quality scores |
   758	| `includeArchived` | boolean | Include ARCHIVED state memories in counts |
   759	| `limit` | number | Max folders to return |
   760	
   761	---
   762	
   763	##### `memory_health`
   764	
   765	Run a health check. This is the diagnostic tool for when search quality degrades or something feels off. It checks for stale indexes, divergent aliases, broken embeddings and other issues. It can also attempt automatic repairs.
   766	
   767	| Parameter | Type | Notes |
   768	|-----------|------|-------|
   769	| `reportMode` | string | `full` (default) or `divergent_aliases` |
   770	| `limit` | number | Max items to report |
   771	| `specFolder` | string | Scope to a folder |
   772	| `autoRepair` | boolean | Attempt automatic repairs |
   773	| `confirmed` | boolean | Confirm destructive repair operations |
   774	
   775	---
   776	
   777	##### `session_health`
   778	
   779	Check session readiness: priming status, code graph freshness and time since last tool call. Returns `ok`, `warning` or `stale` with actionable hints. Call periodically during long sessions to detect context drift.
   780	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts | sed -n '24,108p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    24	    graphFreshness: GraphFreshness;
    25	    sourceSurface: string;
    26	    summary: string;
    27	    recommendedAction: string;
    28	  };
    29	  doctor: {
    30	    supported: true;
    31	    surface: 'memory_health';
    32	    checks: string[];
    33	    repairModes: string[];
    34	    recommendedAction: string;
    35	  };
    36	  exportImport: {
    37	    rawDbDumpAllowed: false;
    38	    portableIdentityRequired: true;
    39	    postImportRepairRequired: true;
    40	    workspaceBoundRelativePaths: true;
    41	    absolutePaths: 'allowed-for-import-only';
    42	    recommendedAction: string;
    43	  };
    44	  previewPolicy: {
    45	    mode: 'metadata-only';
    46	    rawBinaryAllowed: false;
    47	    recommendedFields: string[];
    48	    recommendedAction: string;
    49	  };
    50	}
    51	
    52	export function normalizeStructuralReadiness(graphFreshness: GraphFreshness): StructuralReadiness {
    53	  if (graphFreshness === 'fresh') {
    54	    return 'ready';
    55	  }
    56	  if (graphFreshness === 'stale') {
    57	    return 'stale';
    58	  }
    59	  return 'missing';
    60	}
    61	
    62	export function buildCodeGraphOpsContract(args: {
    63	  graphFreshness: GraphFreshness;
    64	  sourceSurface: string;
    65	}): CodeGraphOpsContract {
    66	  const canonical = normalizeStructuralReadiness(args.graphFreshness);
    67	  const readinessSummary = canonical === 'ready'
    68	    ? 'Code graph readiness is unified and structurally usable.'
    69	    : canonical === 'stale'
    70	      ? 'Code graph exists but needs refresh before structural trust is high.'
    71	      : 'Code graph is missing or unusable; fallback and repair flows should be used.';
    72	  const readinessAction = canonical === 'ready'
    73	    ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
    74	    : canonical === 'stale'
    75	      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
    76	      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
    77	
    78	  return {
    79	    readiness: {
    80	      canonical,
    81	      graphFreshness: args.graphFreshness,
    82	      sourceSurface: args.sourceSurface,
    83	      summary: readinessSummary,
    84	      recommendedAction: readinessAction,
    85	    },
    86	    doctor: {
    87	      supported: true,
    88	      surface: 'memory_health',
    89	      checks: [
    90	        'fts_consistency',
    91	        'trigger_cache_refresh',
    92	        'orphan_edges',
    93	        'orphan_vectors',
    94	        'orphan_chunks',
    95	      ],
    96	      repairModes: [
    97	        'confirmation-gated autoRepair',
    98	        'best-effort partial success reporting',
    99	      ],
   100	      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
   101	    },
   102	    exportImport: {
   103	      rawDbDumpAllowed: false,
   104	      portableIdentityRequired: true,
   105	      postImportRepairRequired: true,
   106	      workspaceBoundRelativePaths: true,
   107	      absolutePaths: 'allowed-for-import-only',
   108	      recommendedAction: 'Treat export/import as a portable identity flow with post-import repair, never as a raw DB dump.',

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '452,490p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

Validated the phase in read-only mode, reviewed the converged iteration-030 synthesis and the underlying MemPalace/Public source lines, and synthesized a migration-risk view for each adopt-now pattern.
  ✓ Validate the phase folder and inspect current research artifacts for established adopt-now patterns
  ✓ Read the required MemPalace and Public source files to extract migration-risk evidence for each adopt-now pattern
  ✓ Synthesize iteration 32 in the requested format, including rollback plans, feature flags, and novelty assessment
codex
# Iteration 032: MIGRATION RISK MATRIX

## Focus
MIGRATION RISK MATRIX: for each `adopt now` pattern, detail what could break during migration, plus rollback plans and feature flags.

## Findings
### Finding 1: Compaction-time checkpoint is worth adopting only if it stays fail-open and JSON-primary
- **Source**: [external/hooks/mempal_precompact_hook.sh:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh#L64), [external/hooks/mempal_precompact_hook.sh:71](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh#L71), [generate-context.js:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- **What it does**: MemPalace blocks before compaction and can run ingest first; Public already has a compaction hook surface and a deterministic structured save contract.
- **Why it matters**: This is the cleanest transfer, but only if we reuse Public’s existing compaction transport and `generate-context.js` authority instead of copying MemPalace’s blocking-control-flow model.
- **What could break during migration**: duplicate saves during compaction, compaction latency spikes, save failures on missing/ambiguous spec-folder context, and false confidence if the checkpoint blocks compaction but the structured save never lands.
- **Feature flags needed**: `SK_MEM_COMPACTION_CHECKPOINT_ENABLED`, `SK_MEM_COMPACTION_CHECKPOINT_MODE=advisory|auto`, `SK_MEM_COMPACTION_CHECKPOINT_TIMEOUT_MS`, `SK_MEM_COMPACTION_CHECKPOINT_REQUIRE_SPEC=true`.
- **Rollback plan**: disable the checkpoint flag and fall back to the current non-mutating compaction transport in [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396); leave `generate-context.js` unchanged and verify compaction still proceeds with only transport context injection.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Bootstrap protocol hints should extend current hints, not create a second authority surface
- **Source**: [external/mempalace/mcp_server.py:155](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L155), [external/mempalace/mcp_server.py:169](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169), [context-server.ts:684](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L684), [context-server.ts:785](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L785)
- **What it does**: MemPalace’s `status` teaches retrieval and save behavior directly; Public already injects priming hints, recovery guidance, and tool-routing instructions.
- **Why it matters**: The useful pattern is explicit operational guidance, but Public already has that spine, so migration risk is mostly duplication and drift.
- **What could break during migration**: prompt bloat, contradictory instructions between startup hints and live tool behavior, stale advice because server instructions are computed once at startup, and over-eager memory calls that crowd out actual task work.
- **Feature flags needed**: `SK_MEM_BOOTSTRAP_HINTS_ENABLED`, `SK_MEM_BOOTSTRAP_HINTS_SURFACE=session_bootstrap|session_resume|startup`, `SK_MEM_BOOTSTRAP_HINTS_MAX_LINES`, `SK_MEM_BOOTSTRAP_HINTS_INCLUDE_SAVE_PROTOCOL=false`.
- **Rollback plan**: remove the extra hint block and retain the current `hints` and structural-bootstrap lines in [context-server.ts:684](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L684) and [context-server.ts:785](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L785).
- **Recommendation**: adopt now
- **Impact**: medium
- **Source strength**: primary

### Finding 3: Observability and repair posture is adoptable if it stays bounded, metadata-first, and stderr-clean
- **Source**: [external/mempalace/mcp_server.py:37](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L37), [external/mempalace/mcp_server.py:70](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L70), [external/mempalace/cli.py:168](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L168), [mcp_server/README.md:763](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L763), [ops-hardening.ts:86](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts#L86)
- **What it does**: MemPalace logs write operations to a JSONL WAL, keeps diagnostics on `stderr`, and exposes an explicit rebuild path; Public already has `memory_health`, `memory_stats`, bounded repair guidance, and non-mutating startup surfaces.
- **Why it matters**: This migration can improve operator trust fast, but only if it complements the existing doctor surfaces instead of bypassing them.
- **What could break during migration**: leaking sensitive content into write logs, introducing repair flows that bypass Public’s confirmation-gated `memory_health` contract, normalizing raw-database rebuild habits that conflict with workspace-bound portability rules, and stdout contamination if diagnostics stop being handshake-clean.
- **Feature flags needed**: `SK_MEM_WRITE_AUDIT_LOG_ENABLED`, `SK_MEM_WRITE_AUDIT_PREVIEW=metadata|redacted`, `SK_MEM_REPAIR_SURFACES_ENABLED`, `SK_MEM_REPAIR_AUTOFIX_EXPERIMENTAL=false`.
- **Rollback plan**: disable WAL-style logging, keep `memory_health` as the sole repair authority, archive any new audit log without mutating indexed memories, and verify diagnostics still go to `stderr` only.
- **Recommendation**: adopt now
- **Impact**: medium
- **Source strength**: primary

## Sources Consulted
- [external/AGENTS.md:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md#L1)
- [research/research.md:290535](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/research.md#L290535)
- [external/hooks/README.md:7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md#L7)
- [external/README.md:52](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L52)
- [external/mempalace/mcp_server.py:139](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L139)
- [external/mempalace/cli.py:168](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L168)
- [external/mempalace/knowledge_graph.py:74](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L74)
- [generate-context.js:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85)
- [context-server.ts:684](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L684)
- [mcp_server/README.md:543](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L543)

## Assessment
- **New information ratio**: 0.24
- **Questions addressed**: what can break when adopting compaction checkpoints, bootstrap protocol hints, and audit/repair posture; which flags are needed; how to roll back safely.
- **Questions answered**: Q1 checkpointing is safe only as fail-open JSON-primary capture; Q2 protocol hints should extend existing Public hints rather than create a new authority surface; Q3 observability/repair is portable only if bounded by current `memory_health` and stderr-clean contracts.
- **Novelty justification**: prior iterations identified what to adopt; this pass adds migration-specific breakage modes, rollout flags, and rollback mechanics grounded in current Public code.
- **Operational note**: the exact validator command returned `RESULT: PASSED`, but the packet currently infers as Level 1 and the checkout only contains [research/research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/research.md#L1), not the expected Level 3 doc set. I could not persist iteration 32 because the sandbox is read-only.

## Ruled Out
- MemPalace-style hard blocking as the primary checkpoint mechanism, because it couples preservation to agent compliance.
- A second standalone bootstrap authority, because Public already has `session_bootstrap`, `session_resume`, and startup instructions.
- Raw repair or import flows that bypass `memory_health`, because Public’s current repair contract is bounded and confirmation-gated.

## Reflection
- **What worked**: anchoring on the final synthesis block first, then validating each adopt-now item against current source lines, kept the migration matrix consistent with the packet’s existing direction.
- **What did not work**: the phase folder is not in the expected on-disk Level 3 state, and the read-only sandbox prevented updating `research/research.md`, `implementation-summary.md`, or memory artifacts.
- **What I would do differently**: next pass should be a write-enabled rollout packet that converts these three findings into implementation phases with explicit flags, metrics, and disable paths.

## Recommended Next Focus
Create one implementation packet per adopt-now item, with rollout order:
1. compaction checkpoint in advisory mode first,
2. bootstrap hint extension second,
3. audit/repair surfaces third.

Each packet should ship with a kill switch, a success metric, and a one-command rollback path before any wider enablement.
hook: Stop
hook: Stop Completed
tokens used
78,707
# Iteration 032: MIGRATION RISK MATRIX

## Focus
MIGRATION RISK MATRIX: for each `adopt now` pattern, detail what could break during migration, plus rollback plans and feature flags.

## Findings
### Finding 1: Compaction-time checkpoint is worth adopting only if it stays fail-open and JSON-primary
- **Source**: [external/hooks/mempal_precompact_hook.sh:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh#L64), [external/hooks/mempal_precompact_hook.sh:71](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh#L71), [generate-context.js:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- **What it does**: MemPalace blocks before compaction and can run ingest first; Public already has a compaction hook surface and a deterministic structured save contract.
- **Why it matters**: This is the cleanest transfer, but only if we reuse Public’s existing compaction transport and `generate-context.js` authority instead of copying MemPalace’s blocking-control-flow model.
- **What could break during migration**: duplicate saves during compaction, compaction latency spikes, save failures on missing/ambiguous spec-folder context, and false confidence if the checkpoint blocks compaction but the structured save never lands.
- **Feature flags needed**: `SK_MEM_COMPACTION_CHECKPOINT_ENABLED`, `SK_MEM_COMPACTION_CHECKPOINT_MODE=advisory|auto`, `SK_MEM_COMPACTION_CHECKPOINT_TIMEOUT_MS`, `SK_MEM_COMPACTION_CHECKPOINT_REQUIRE_SPEC=true`.
- **Rollback plan**: disable the checkpoint flag and fall back to the current non-mutating compaction transport in [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396); leave `generate-context.js` unchanged and verify compaction still proceeds with only transport context injection.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Bootstrap protocol hints should extend current hints, not create a second authority surface
- **Source**: [external/mempalace/mcp_server.py:155](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L155), [external/mempalace/mcp_server.py:169](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169), [context-server.ts:684](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L684), [context-server.ts:785](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L785)
- **What it does**: MemPalace’s `status` teaches retrieval and save behavior directly; Public already injects priming hints, recovery guidance, and tool-routing instructions.
- **Why it matters**: The useful pattern is explicit operational guidance, but Public already has that spine, so migration risk is mostly duplication and drift.
- **What could break during migration**: prompt bloat, contradictory instructions between startup hints and live tool behavior, stale advice because server instructions are computed once at startup, and over-eager memory calls that crowd out actual task work.
- **Feature flags needed**: `SK_MEM_BOOTSTRAP_HINTS_ENABLED`, `SK_MEM_BOOTSTRAP_HINTS_SURFACE=session_bootstrap|session_resume|startup`, `SK_MEM_BOOTSTRAP_HINTS_MAX_LINES`, `SK_MEM_BOOTSTRAP_HINTS_INCLUDE_SAVE_PROTOCOL=false`.
- **Rollback plan**: remove the extra hint block and retain the current `hints` and structural-bootstrap lines in [context-server.ts:684](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L684) and [context-server.ts:785](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L785).
- **Recommendation**: adopt now
- **Impact**: medium
- **Source strength**: primary

### Finding 3: Observability and repair posture is adoptable if it stays bounded, metadata-first, and stderr-clean
- **Source**: [external/mempalace/mcp_server.py:37](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L37), [external/mempalace/mcp_server.py:70](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L70), [external/mempalace/cli.py:168](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L168), [mcp_server/README.md:763](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L763), [ops-hardening.ts:86](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts#L86)
- **What it does**: MemPalace logs write operations to a JSONL WAL, keeps diagnostics on `stderr`, and exposes an explicit rebuild path; Public already has `memory_health`, `memory_stats`, bounded repair guidance, and non-mutating startup surfaces.
- **Why it matters**: This migration can improve operator trust fast, but only if it complements the existing doctor surfaces instead of bypassing them.
- **What could break during migration**: leaking sensitive content into write logs, introducing repair flows that bypass Public’s confirmation-gated `memory_health` contract, normalizing raw-database rebuild habits that conflict with workspace-bound portability rules, and stdout contamination if diagnostics stop being handshake-clean.
- **Feature flags needed**: `SK_MEM_WRITE_AUDIT_LOG_ENABLED`, `SK_MEM_WRITE_AUDIT_PREVIEW=metadata|redacted`, `SK_MEM_REPAIR_SURFACES_ENABLED`, `SK_MEM_REPAIR_AUTOFIX_EXPERIMENTAL=false`.
- **Rollback plan**: disable WAL-style logging, keep `memory_health` as the sole repair authority, archive any new audit log without mutating indexed memories, and verify diagnostics still go to `stderr` only.
- **Recommendation**: adopt now
- **Impact**: medium
- **Source strength**: primary

## Sources Consulted
- [external/AGENTS.md:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md#L1)
- [research/research.md:290535](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/research.md#L290535)
- [external/hooks/README.md:7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md#L7)
- [external/README.md:52](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L52)
- [external/mempalace/mcp_server.py:139](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L139)
- [external/mempalace/cli.py:168](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L168)
- [external/mempalace/knowledge_graph.py:74](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L74)
- [generate-context.js:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85)
- [context-server.ts:684](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L684)
- [mcp_server/README.md:543](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L543)

## Assessment
- **New information ratio**: 0.24
- **Questions addressed**: what can break when adopting compaction checkpoints, bootstrap protocol hints, and audit/repair posture; which flags are needed; how to roll back safely.
- **Questions answered**: Q1 checkpointing is safe only as fail-open JSON-primary capture; Q2 protocol hints should extend existing Public hints rather than create a new authority surface; Q3 observability/repair is portable only if bounded by current `memory_health` and stderr-clean contracts.
- **Novelty justification**: prior iterations identified what to adopt; this pass adds migration-specific breakage modes, rollout flags, and rollback mechanics grounded in current Public code.
- **Operational note**: the exact validator command returned `RESULT: PASSED`, but the packet currently infers as Level 1 and the checkout only contains [research/research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/research.md#L1), not the expected Level 3 doc set. I could not persist iteration 32 because the sandbox is read-only.

## Ruled Out
- MemPalace-style hard blocking as the primary checkpoint mechanism, because it couples preservation to agent compliance.
- A second standalone bootstrap authority, because Public already has `session_bootstrap`, `session_resume`, and startup instructions.
- Raw repair or import flows that bypass `memory_health`, because Public’s current repair contract is bounded and confirmation-gated.

## Reflection
- **What worked**: anchoring on the final synthesis block first, then validating each adopt-now item against current source lines, kept the migration matrix consistent with the packet’s existing direction.
- **What did not work**: the phase folder is not in the expected on-disk Level 3 state, and the read-only sandbox prevented updating `research/research.md`, `implementation-summary.md`, or memory artifacts.
- **What I would do differently**: next pass should be a write-enabled rollout packet that converts these three findings into implementation phases with explicit flags, metrics, and disable paths.

## Recommended Next Focus
Create one implementation packet per adopt-now item, with rollout order:
1. compaction checkpoint in advisory mode first,
2. bootstrap hint extension second,
3. audit/repair surfaces third.

Each packet should ship with a kill switch, a success metric, and a one-command rollback path before any wider enablement.
