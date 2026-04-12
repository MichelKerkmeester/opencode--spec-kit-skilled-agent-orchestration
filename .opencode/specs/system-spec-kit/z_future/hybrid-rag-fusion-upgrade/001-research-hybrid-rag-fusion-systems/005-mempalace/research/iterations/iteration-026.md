### Finding 4: MemPalace handles context pressure with blunt truncation; Public already has the stronger budget discipline
- **Source**: [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L83); [layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L170); [searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L21); [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1129)
- **What it does**: MemPalace caps wake-up at 15 drawers and 3200 chars, then falls back to “more in L3 search.” Public’s `memory_search` already filters duplicates and reports token savings, which is a better fit for tight context windows than a static L1 truncation wall.
- **Why it matters**: Compaction survival is partly a token-budget problem. Dedup-aware retrieval preserves more useful state than a fixed-size replay of top snippets.
- **Recommendation**: reject
- **Impact**: medium

### Finding 5: Temporal truth survives compaction only if the agent remembers to query it
- **Source**: [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L152); [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L180); [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L282); [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169)
- **What it does**: MemPalace’s KG supports idempotent current facts, invalidation, `as_of` queries, and timelines, but that truth layer is not injected into wake-up. The agent must follow the protocol and query it after startup.
- **Why it matters**: This is a good model for “truth after compaction,” but only if recovery hints explicitly steer the agent there. Otherwise the temporal plane stays latent.
- **Recommendation**: prototype later
- **Impact**: medium

## Assessment
- New information ratio: 0.34
- Read-only note: the strict validator passed again, but the phase folder in this checkout still inferred as `Level: 1`; the Level 3 root doc set named in the brief is not present at the phase root, so this iteration is evidence-complete but not packet-closeout complete.

## Recommended Next Focus
1. Design a compaction checkpoint receipt that `session_bootstrap` or `session_resume` can actually consume: saved timestamp, target spec folder, artifact id, and confidence/provenance.
2. Prototype a tiny additive “survival digest” generated from active-session evidence only, not from the full memory corpus, and keep dedup/token accounting in the loop.
3. Draft a short reusable memory operating contract for Public bootstrap surfaces so post-compaction agents know when to use `memory_context`, `memory_search`, code graph, and future temporal-truth lanes.
--- Iteration 25 ---
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
- **Impact**: high

### Finding 3: “Private” agent memory is a naming convention, not an authorization boundary
- **Source**: [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py)
- **What it does**: Agent diary entries are stored under `wing_<agent>/diary`, and reads filter on that wing. But the MCP surface exposes global listing and search tools without actor-scoped auth parameters, so diary separation is organizational rather than enforced private/public scoping.
- **Why it matters**: For multi-agent safety, “each agent has its own diary wing” sounds stronger than it is. Any caller with palace access is still operating against one shared server and one shared corpus.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: The temporal KG is concurrency-tolerant locally, but globally shared logically
- **Source**: [knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py), [mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py)
- **What it does**: The KG uses SQLite with WAL mode and `check_same_thread=False`, and it deduplicates currently-valid identical triples before insert. That helps local write tolerance, but facts themselves carry no tenant, user, agent, session, or shared/private ownership fields, so invalidation mutates a global truth layer for the whole palace.
- **Why it matters**: The temporal fact model is still interesting, but copied as-is it would let one actor end or replace facts for everyone sharing that store.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 5: Public already has the stronger multi-agent safety model
- **Source**: [scope-governance.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts), [shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts), [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts), [workflow.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js), [progressive-disclosure.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts), [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- **What it does**: Public validates governed ingest with `tenantId`/`sessionId`/`userId` or `agentId` plus provenance, enforces deny-by-default shared-space membership and role checks, records shared conflicts with explicit strategies, serializes save work with spec-folder locks plus transactions, and binds cursors/session reuse to scope identity.
- **Why it matters**: The safe direction is not to import MemPalace’s storage model wholesale. The useful imports are taxonomy and temporal ideas, but only on top of Public’s existing scope, conflict, and lock primitives.
- **Recommendation**: adopt now
- **Impact**: high

## Assessment
- New information ratio: 0.46

## Recommended Next Focus
1. Verify whether MemPalace’s test suite exercises simultaneous writers at all, or whether concurrency safety is entirely implicit in Chroma and SQLite behavior.
2. Design a Public-only taxonomy and diary layer that inherits existing `tenantId` / `userId` / `agentId` / `sharedSpaceId` boundaries instead of replacing them.
3. If Public gets a temporal fact plane, require ownership, shared-space awareness, and conflict semantics from day one so invalidation cannot become a global unscoped mutation.

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
# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

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
I’m treating this as a read-only research pass for iteration 26, focused on semantic versus lexical trade-offs in MemPalace versus Spec Kit Memory. I’ll do a quick memory pass for prior context, then inspect the external and current-system code paths that govern semantic retrieval, lexical filtering, and hybrid behavior.
exec
/bin/zsh -lc 'rg -n "mempalace|hybrid-rag|semantic|lexical|BM25|FTS|Chroma|searcher|memory_search|memory_context|memory_match_triggers|CocoIndex" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13:- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 005-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict
24:- packet 010 degraded lexical lane vocabulary is `lexicalPath: 'unavailable'`; align runtime output, tests, README, and checklist language to this exact label [Task 1]
205:- shipped 014 lane includes detector provenance vocabulary carriers, blast-radius traversal with explicit depth cap and union semantics, and low-authority hot-file breadcrumb evidence while preserving packet 011 trust-axis payloads [Task 1]
293:- 005-mempalace, phase-research-prompt.md, dont ask for a spec folder, 13-section TIDD-EC, source-confirmed README-documented benchmark-documented, raw-verbatim hooks taxonomy temporal KG
313:- 005-claudest, execution-ready lane, FTS helper forced-degrade matrix, stop-hook metadata patch, normalized analytics reader, cached-summary fast path, verifier discoverer split, token-insight contracts
367:- when the user asked to "create a similar prompt for ...005-mempalace ... dont ask for a spec folder," place `phase-research-prompt.md` in the phase root and skip new spec-folder scaffolding [Task 1]
380:- MemPalace-specific guardrails that proved useful: AAAK remains experimental/lossy, raw ChromaDB verbatim posture is baseline, and benchmark/README claims need code-backed verification before adoption [Task 1]
383:- Claudest continuation is now an execution-ready sequence to preserve in order: FTS helper and forced-degrade tests -> stop-hook metadata patch -> normalized analytics reader -> cached-summary fast path -> verifier/discoverer split -> token-insight contracts [Task 3]
392:- follow-on phase train now implemented as: `026/005` measurement contract -> `026/006` trust-axis contract -> `026/007` detector floor -> `026/008` graph hint nudge -> `026/009` auditable publication -> `024/032` cached-summary consumer -> `024/033` optional FTS hardening -> `024/034` workflow/token-insight split [Task 8]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
547:- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
753:## Task 7: Add dedicated README section for CocoIndex + Compact Code Graph with packet references, outcome success
761:- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1069:## Task 7: Verify and harden FTS5 ablation integrity (alignment guard + evaluation mode + parent-id normalization)
1087:- when user requested ablation verification, run `eval_run_ablation({ mode:"ablation", includeFormattedReport:true, storeResults:true })` through Codex MCP before declaring FTS5 outcomes [Task 7]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1192:scope: `/spec_kit:deep-research --review` execution contract, review-folder semantics, and release-readiness criteria mapping
1274:- Advisor benchmark/regression commands need explicit `--dataset` and semantic-disable env toggle for stable timing [Task 1]
1278:- symptom: benchmark p95 unexpectedly high; cause: builtin semantic latency noise; fix: disable builtin semantic path during benchmark runs [Task 1]
1443:scope: structured JSON save authority, recovery-only fallback semantics, and Phase 016/011 runtime-doc-test parity
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc 'if [ -f "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md" ]; then echo EXISTS; else echo MISSING; fi' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
EXISTS

codex
I’ve confirmed the external repo has its own `AGENTS.md`, so I’m folding that into the read-only analysis instead of assuming no deeper constraints. Next I’m reading the retrieval surfaces on both sides to pin down where semantic-only retrieval helps, where lexical matching is still decisive, and whether the hybrid lane is real or mostly framing.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
#!/usr/bin/env python3
"""
layers.py — 4-Layer Memory Stack for mempalace
===================================================

Load only what you need, when you need it.

    Layer 0: Identity       (~100 tokens)   — Always loaded. "Who am I?"
    Layer 1: Essential Story (~500-800)      — Always loaded. Top moments from the palace.
    Layer 2: On-Demand      (~200-500 each)  — Loaded when a topic/wing comes up.
    Layer 3: Deep Search    (unlimited)      — Full ChromaDB semantic search.

Wake-up cost: ~600-900 tokens (L0+L1). Leaves 95%+ of context free.

Reads directly from ChromaDB (mempalace_drawers)
and ~/.mempalace/identity.txt.
"""

import os
import sys
from pathlib import Path
from collections import defaultdict

import chromadb

from .config import MempalaceConfig


# ---------------------------------------------------------------------------
# Layer 0 — Identity
# ---------------------------------------------------------------------------


class Layer0:
    """
    ~100 tokens. Always loaded.
    Reads from ~/.mempalace/identity.txt — a plain-text file the user writes.

    Example identity.txt:
        I am Atlas, a personal AI assistant for Alice.
        Traits: warm, direct, remembers everything.
        People: Alice (creator), Bob (Alice's partner).
        Project: A journaling app that helps people process emotions.
    """

    def __init__(self, identity_path: str = None):
        if identity_path is None:
            identity_path = os.path.expanduser("~/.mempalace/identity.txt")
        self.path = identity_path
        self._text = None

    def render(self) -> str:
        """Return the identity text, or a sensible default."""
        if self._text is not None:
            return self._text

        if os.path.exists(self.path):
            with open(self.path, "r") as f:
                self._text = f.read().strip()
        else:
            self._text = (
                "## L0 — IDENTITY\nNo identity configured. Create ~/.mempalace/identity.txt"
            )

        return self._text

    def token_estimate(self) -> int:
        return len(self.render()) // 4


# ---------------------------------------------------------------------------
# Layer 1 — Essential Story (auto-generated from palace)
# ---------------------------------------------------------------------------


class Layer1:
    """
    ~500-800 tokens. Always loaded.
    Auto-generated from the highest-weight / most-recent drawers in the palace.
    Groups by room, picks the top N moments, compresses to a compact summary.
    """

    MAX_DRAWERS = 15  # at most 15 moments in wake-up
    MAX_CHARS = 3200  # hard cap on total L1 text (~800 tokens)

    def __init__(self, palace_path: str = None, wing: str = None):
        cfg = MempalaceConfig()
        self.palace_path = palace_path or cfg.palace_path
        self.wing = wing

    def generate(self) -> str:
        """Pull top drawers from ChromaDB and format as compact L1 text."""
        try:
            client = chromadb.PersistentClient(path=self.palace_path)
            col = client.get_collection("mempalace_drawers")
        except Exception:
            return "## L1 — No palace found. Run: mempalace mine <dir>"

        # Fetch all drawers in batches to avoid SQLite variable limit (~999)
        _BATCH = 500
        docs, metas = [], []
        offset = 0
        while True:
            kwargs = {"include": ["documents", "metadatas"], "limit": _BATCH, "offset": offset}
            if self.wing:
                kwargs["where"] = {"wing": self.wing}
            try:
                batch = col.get(**kwargs)
            except Exception:
                break
            batch_docs = batch.get("documents", [])
            batch_metas = batch.get("metadatas", [])
            if not batch_docs:
                break
            docs.extend(batch_docs)
            metas.extend(batch_metas)
            offset += len(batch_docs)
            if len(batch_docs) < _BATCH:
                break

        if not docs:
            return "## L1 — No memories yet."

        # Score each drawer: prefer high importance, recent filing
        scored = []
        for doc, meta in zip(docs, metas):
            importance = 3
            # Try multiple metadata keys that might carry weight info
            for key in ("importance", "emotional_weight", "weight"):
                val = meta.get(key)
                if val is not None:
                    try:
                        importance = float(val)
                    except (ValueError, TypeError):
                        pass
                    break
            scored.append((importance, meta, doc))

        # Sort by importance descending, take top N
        scored.sort(key=lambda x: x[0], reverse=True)
        top = scored[: self.MAX_DRAWERS]

        # Group by room for readability
        by_room = defaultdict(list)
        for imp, meta, doc in top:
            room = meta.get("room", "general")
            by_room[room].append((imp, meta, doc))

        # Build compact text
        lines = ["## L1 — ESSENTIAL STORY"]

        total_len = 0
        for room, entries in sorted(by_room.items()):
            room_line = f"\n[{room}]"
            lines.append(room_line)
            total_len += len(room_line)

            for imp, meta, doc in entries:
                source = Path(meta.get("source_file", "")).name if meta.get("source_file") else ""

                # Truncate doc to keep L1 compact
                snippet = doc.strip().replace("\n", " ")
                if len(snippet) > 200:
                    snippet = snippet[:197] + "..."

                entry_line = f"  - {snippet}"
                if source:
                    entry_line += f"  ({source})"

                if total_len + len(entry_line) > self.MAX_CHARS:
                    lines.append("  ... (more in L3 search)")
                    return "\n".join(lines)

                lines.append(entry_line)
                total_len += len(entry_line)

        return "\n".join(lines)


# ---------------------------------------------------------------------------
# Layer 2 — On-Demand (wing/room filtered retrieval)
# ---------------------------------------------------------------------------


class Layer2:
    """
    ~200-500 tokens per retrieval.
    Loaded when a specific topic or wing comes up in conversation.
    Queries ChromaDB with a wing/room filter.
    """

    def __init__(self, palace_path: str = None):
        cfg = MempalaceConfig()
        self.palace_path = palace_path or cfg.palace_path

    def retrieve(self, wing: str = None, room: str = None, n_results: int = 10) -> str:
        """Retrieve drawers filtered by wing and/or room."""
        try:
            client = chromadb.PersistentClient(path=self.palace_path)
            col = client.get_collection("mempalace_drawers")
        except Exception:
            return "No palace found."

        where = {}
        if wing and room:
            where = {"$and": [{"wing": wing}, {"room": room}]}
        elif wing:
            where = {"wing": wing}
        elif room:
            where = {"room": room}

        kwargs = {"include": ["documents", "metadatas"], "limit": n_results}
        if where:
            kwargs["where"] = where

        try:
            results = col.get(**kwargs)
        except Exception as e:
            return f"Retrieval error: {e}"

        docs = results.get("documents", [])
        metas = results.get("metadatas", [])

        if not docs:
            label = f"wing={wing}" if wing else ""
            if room:
                label += f" room={room}" if label else f"room={room}"
            return f"No drawers found for {label}."

        lines = [f"## L2 — ON-DEMAND ({len(docs)} drawers)"]
        for doc, meta in zip(docs[:n_results], metas[:n_results]):
            room_name = meta.get("room", "?")
            source = Path(meta.get("source_file", "")).name if meta.get("source_file") else ""
            snippet = doc.strip().replace("\n", " ")
            if len(snippet) > 300:
                snippet = snippet[:297] + "..."
            entry = f"  [{room_name}] {snippet}"
            if source:
                entry += f"  ({source})"
            lines.append(entry)

        return "\n".join(lines)


# ---------------------------------------------------------------------------
# Layer 3 — Deep Search (full semantic search via ChromaDB)
# ---------------------------------------------------------------------------


class Layer3:
    """
    Unlimited depth. Semantic search against the full palace.
    Reuses searcher.py logic against mempalace_drawers.
    """

    def __init__(self, palace_path: str = None):
        cfg = MempalaceConfig()
        self.palace_path = palace_path or cfg.palace_path

    def search(self, query: str, wing: str = None, room: str = None, n_results: int = 5) -> str:

exec
/bin/zsh -lc "sed -n '1080,1325p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
        resultsData = null;
      }
    } else if (responseToReturn && typeof responseToReturn === 'object') {
      resultsData = responseToReturn as unknown as Record<string, unknown>;
    }

    // P1-018 — Validate response shape before dedup. If the cached response
    // Doesn't have the expected data.results array, log a warning and skip dedup
    // Rather than silently falling through to the un-deduped response.
    const data = (resultsData && typeof resultsData.data === 'object' && resultsData.data !== null)
      ? resultsData.data as Record<string, unknown>
      : null;
    const existingResults = Array.isArray(data?.results) ? data.results as MemorySearchRow[] : null;

    if (resultsData && !data) {
      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
    } else if (data && !existingResults) {
      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
    }

    if (resultsData && data && existingResults && existingResults.length > 0) {
      const { results: dedupedResults } = applySessionDedup(
        existingResults,
        sessionId,
        enableDedup
      );

      const originalCount = existingResults.length;
      const dedupedCount = dedupedResults.length;
      const filteredCount = originalCount - dedupedCount;

      const tokensSaved = filteredCount * 200;
      const savingsPercent = originalCount > 0
        ? Math.round((filteredCount / originalCount) * 100)
        : 0;

      data.results = dedupedResults;
      data.count = dedupedCount;

      const dedupStats = {
        enabled: true,
        sessionId,
        originalCount: originalCount,
        returnedCount: dedupedCount,
        filteredCount: filteredCount,
        tokensSaved: tokensSaved,
        savingsPercent: savingsPercent,
        tokenSavingsEstimate: tokensSaved > 0 ? `~${tokensSaved} tokens` : '0'
      };
      resultsData.dedupStats = dedupStats;

      if (resultsData.meta && typeof resultsData.meta === 'object') {
        (resultsData.meta as Record<string, unknown>).dedupStats = dedupStats;
      }

      if (filteredCount > 0 && typeof resultsData.summary === 'string') {
        resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
      }

      responseToReturn = {
        ...responseToReturn,
        content: [{ type: 'text', text: JSON.stringify(resultsData, null, 2) }]
      } as MCPResponse;
    }
  }

  if (sessionId && isSessionRetrievalStateEnabled()) {
    const parsedResponse = parseResponseEnvelope(responseToReturn);
    const data = parsedResponse?.envelope.data && typeof parsedResponse.envelope.data === 'object'
      ? parsedResponse.envelope.data as Record<string, unknown>
      : null;
    const existingResults = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];

    if (parsedResponse && data) {
      const returnedIds = existingResults
        .map((result) => result.id ?? result.resultId)
        .filter((id): id is string | number => typeof id === 'string' || typeof id === 'number');

      if (returnedIds.length > 0) {
        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
      }

      data.sessionState = buildSessionStatePayload(sessionId);
      if (goalRefinementPayload) {
        data.goalRefinement = goalRefinementPayload;
      }

      parsedResponse.envelope.data = data;
      responseToReturn = replaceResponseEnvelope(responseToReturn, parsedResponse.firstEntry, parsedResponse.envelope);
    }
  }

  if (includeTrace && sessionTransition) {
    responseToReturn = attachSessionTransitionTrace(responseToReturn, sessionTransition);
  }

  if (retrievalTelemetry.isExtendedTelemetryEnabled()) {
    const telemetry = retrievalTelemetry.createTelemetry();
    retrievalTelemetry.recordTransitionDiagnostics(telemetry, sessionTransition);
    retrievalTelemetry.recordGraphWalkDiagnostics(
      telemetry,
      summarizeGraphWalkDiagnostics(extractResponseResults(responseToReturn)),
    );
    responseToReturn = attachTelemetryMeta(responseToReturn, retrievalTelemetry.toJSON(telemetry));
  }

  // Consumption instrumentation — log search event (fail-safe, never throws)
  try {
    const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
    if (db) {
      initConsumptionLog(db);
      let resultIds: number[] = [];
      let resultCount = 0;
      try {
        if (responseToReturn?.content?.[0]?.text) {
          const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
          const data = parsed?.data as Record<string, unknown> | undefined;
          const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
          resultIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
          resultCount = Array.isArray(data?.results) ? (data.results as unknown[]).length : 0;
        }
      } catch (_error: unknown) { /* ignore parse errors */ }
      logConsumptionEvent(db, {
        event_type: 'search',
        query_text: effectiveQuery || null,
        intent: detectedIntent,
        result_count: resultCount,
        result_ids: resultIds,
        session_id: sessionId ?? null,
        latency_ms: Date.now() - _searchStartTime,
        spec_folder_filter: specFolder ?? null,
      });
    }
  } catch (_error: unknown) { /* instrumentation must never cause search to fail */ }

  // Eval logger — capture final results at pipeline exit (fail-safe)
  try {
    if (_evalRunId && _evalQueryId) {
      let finalMemoryIds: number[] = [];
      let finalScores: number[] = [];
      try {
        if (responseToReturn?.content?.[0]?.text) {
          const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
          const data = parsed?.data as Record<string, unknown> | undefined;
          const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
          finalMemoryIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
          finalScores = results.map(r => (r.score ?? r.similarity ?? 0) as number);
        }
      } catch (_error: unknown) { /* ignore parse errors */ }
      logFinalResult({
        evalRunId: _evalRunId,
        queryId: _evalQueryId,
        resultMemoryIds: finalMemoryIds,
        scores: finalScores,
        fusionMethod: 'rrf',
        latencyMs: Date.now() - _searchStartTime,
      });

      for (const payload of _evalChannelPayloads) {
        logChannelResult({
          evalRunId: _evalRunId,
          queryId: _evalQueryId,
          channel: payload.channel,
          resultMemoryIds: payload.resultMemoryIds,
          scores: payload.scores,
          hitCount: payload.resultMemoryIds.length,
        });
      }
    }
  } catch (_error: unknown) { /* eval logging must never break search */ }

  // REQ-D4-001: Implicit feedback — log search_shown events for returned results
  // Shadow-only: no ranking side effects. Fail-safe, never throws.
  try {
    if (isImplicitFeedbackLogEnabled()) {
      const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
      if (db) {
        let shownMemoryIds: number[] = [];
        try {
          if (responseToReturn?.content?.[0]?.text) {
            const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
            const data = parsed?.data as Record<string, unknown> | undefined;
            const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
            shownMemoryIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
          }
        } catch (_error: unknown) { /* ignore parse errors */ }

        if (shownMemoryIds.length > 0) {
          const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
          const feedbackEvents: FeedbackEvent[] = shownMemoryIds.map(memId => ({
            type: 'search_shown',
            memoryId: String(memId),
            queryId,
            confidence: 'weak',
            timestamp: _searchStartTime,
            sessionId: sessionId ?? null,
          }));
          logFeedbackEvents(db, feedbackEvents);
        }
      }
    }
  } catch (_error: unknown) { /* feedback logging must never break search */ }

  // REQ-014: Query flow tracking + result_cited for includeContent searches
  // Shadow-only: emits query_reformulated, same_topic_requery, and result_cited events.
  try {
    if (isImplicitFeedbackLogEnabled()) {
      const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
      if (db) {
        // Extract shown memory IDs from response (reuse parsed data if available)
        let shownIds: string[] = [];
        try {
          if (responseToReturn?.content?.[0]?.text) {
            const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
            const data = parsed?.data as Record<string, unknown> | undefined;
            const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
            shownIds = results.flatMap((result) => {
              const candidate = result.id;
              if (typeof candidate !== 'number' && typeof candidate !== 'string') {
                return [];
              }
              const normalizedId = String(candidate).trim();
              if (!normalizedId || normalizedId === 'undefined' || normalizedId === 'null') {
                return [];
              }
              return [normalizedId];
            });
          }
        } catch (_error: unknown) { /* ignore parse errors */ }

        const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);

        // Track query flow — detects reformulations and same-topic re-queries
        if (normalizedQuery) {
          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
        }

        // Log result_cited for includeContent searches (content was embedded = cited)
        if (includeContent && shownIds.length > 0) {
          logResultCited(db, sessionId ?? null, queryId, shownIds);
        }
      }
    }
  } catch (_error: unknown) { /* query flow tracking must never break search */ }

  // REQ-D5-003: Apply presentation profile when flag is enabled and profile is specified.

web search: 
web search: 
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "rg -n \"lexical|semantic|fts|bm25|hybrid|rrf|vector|embedding|keyword|query expansion|fallback|degrad\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/lib -g '"'!**/*.map'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:85:} from '../lib/search/sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:86:import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:103:// Feature catalog: Quality-aware 3-tier search fallback
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:139:  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:208:  mode?: string; // "deep" mode enables query expansion for multi-query RAG
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:213:  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:362:  if (typeof data.lexicalPath !== 'string' && snapshot) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:363:    data.lexicalPath = snapshot.lexicalPath;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:365:  if (typeof data.fallbackState !== 'string' && snapshot) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:366:    data.fallbackState = snapshot.fallbackState;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:675:    if (classification.fallback) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:676:      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:706:  // Re-run artifact routing with detected intent for fallback coverage
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:763:    // Wait for embedding model only on cache miss
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:777:        : 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:812:    // Phase B T018/T019: Community search fallback — inject community members on weak results
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:858:          console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:905:    const lexicalCapability = getLastLexicalCapabilitySnapshot();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:906:    if (lexicalCapability) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:908:        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:919:    if (lexicalCapability) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:920:      extraData.lexicalPath = lexicalCapability.lexicalPath;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:921:      extraData.fallbackState = lexicalCapability.fallbackState;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1234:        fusionMethod: 'rrf',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:72:} from '@spec-kit/shared/embeddings/factory';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:75:import * as vectorIndex from './lib/search/vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:76:import * as _embeddings from './lib/providers/embeddings.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:80:import * as hybridSearch from './lib/search/hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:87:import * as bm25Index from './lib/search/bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:109:// T099: Retry manager for background embedding retry job (REQ-031, CHK-179)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:201:/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:747:  const channels: string[] = ['vector', 'fts5'];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:748:  if (bm25Index.isBm25Enabled()) channels.push('bm25');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:945:      vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1127:      const fallbackError = wrapError instanceof Error ? wrapError.message : String(wrapError);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1128:      console.error(`[context-server] Failed to build MCP error envelope for '${name}': ${fallbackError}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1129:      const fallbackCode = getDefaultErrorCodeForTool(name);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1133:        code: fallbackCode,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1134:        recovery: getRecoveryHint(name, fallbackCode),
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1193:    const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1238:    console.error('[context-server] Waiting for embedding model to be ready...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1242:      console.error('[context-server] Startup scan skipped: embedding model not ready');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1380:    runCleanupStep('vectorIndex', () => vectorIndex.closeDb());
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1410:  const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1437:      if (vectorIndex.deleteMemory(row.id)) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1495:    console.error('[context-server] Validating embedding API key...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1554:  vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1563:    vectorIndex,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1566:    hybridSearch,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1581:  // in shared embeddings, so startup no longer branches on shouldEagerWarmup().
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1582:  console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1584:  // Mark embedding as "ready" since it will self-initialize on first use
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1589:    const report = vectorIndex.verifyIntegrity();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1593:    // Validate embedding dimension matches database
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1594:    const dimValidation = vectorIndex.validateEmbeddingDimension();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1599:      console.error('[context-server] FATAL: Refusing to start with mismatched embedding dimensions');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1605:    const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1622:        console.error(`[context-server] Learned triggers ready (migrated=${migrated}, fts5Isolated=${isolated})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1669:    hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1694:    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1697:    if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1699:        const bm25 = bm25Index.getIndex();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1700:        const count = bm25.rebuildFromDatabase(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1702:      } catch (bm25Err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1703:        const message = bm25Err instanceof Error ? bm25Err.message : String(bm25Err);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1743:    // T099: Background retry job for pending embeddings (REQ-031, CHK-179)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1744:    // Processes memories with failed embeddings in the background
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:27:  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:185:    routingParts.push('semantic/concept search → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:26:export type QualityLevel = 'healthy' | 'degraded' | 'critical';
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:218:  //                          degradation signal. A 60-min gap almost certainly means
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:242:  else if (score > 0.4) level = 'degraded';
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:3:description: "Protocol abstractions for embedding/vector backends, with shared-package migration notes."
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:6:  - "embedding provider interface"
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:7:  - "vector store interface"
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:12:> Protocol abstractions for embedding/vector backends, with shared-package migration notes.
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:32:The interfaces module documents contracts for embedding providers and vector stores. Most interfaces now live in `@spec-kit/shared`; this local module remains the compatibility layer and local vector-store stub.
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:39:| **Flexibility** | Swap backends (local vs API embeddings) via configuration |
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:51:> **Note**: Most source files (`embedding-provider.ts`, `index.ts`) were relocated to `@spec-kit/shared` during the shared package migration. `vector-store.ts` remains as a local stub/re-export.
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:55:├── vector-store.ts         # Vector store interface (stub/re-export from @spec-kit/shared)
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:63:| `embedding-provider.ts` | Relocated to `@spec-kit/shared` |
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:64:| `vector-store.ts` | **Remains locally** (stub/re-export) |
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:80:| `IVectorStore` | `vector-store.ts` | Abstract base class for JS runtime consumers; subclasses must implement search/upsert/delete/get/stats/availability/dimension/close |
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:100:import { IVectorStore } from './vector-store';
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:103:  async search(embedding, topK, options) { return []; }
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:104:  async upsert(id, embedding, metadata) { return 1; }
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:117:import { IVectorStore } from './vector-store';
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:139:| [./vector-store.ts](./vector-store.ts) | Local runtime abstract class contract |
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:140:| [../search/vector-index-impl.ts](../search/vector-index-impl.ts) | Main in-repo `IVectorStore` implementation |
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:7:// This file exists for plain-JS files (e.g., vector-index-impl.js)
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:10: * Abstract base class for vector store implementations.
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:14:  async search(_embedding: unknown, _topK: number, _options?: unknown): Promise<unknown[]> {
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:18:  async upsert(_id: string, _embedding: unknown, _metadata: Record<string, unknown>): Promise<number> {
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:313:    throw new Error('[session-analytics-db] Seeded model pricing is missing a sonnet fallback');
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:30:The validation subsystem provides pre-flight checks that run before expensive operations like embedding generation or database writes. It prevents invalid data from entering the system and provides actionable feedback for resolution.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:38:| Quality Gate Layers | 3 | Structural, content quality, semantic dedup |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:47:| **Duplicate Detection** | Exact (SHA-256 hash) and similar (vector similarity) duplicate finding |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:50:| **Save Quality Gate** | 3-layer pre-storage validation (structural, content quality scoring, semantic dedup). Behind `SPECKIT_SAVE_QUALITY_GATE` flag |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:60: save-quality-gate.ts # 3-layer pre-storage quality gate (structural, content, semantic dedup)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:69:| `save-quality-gate.ts` | 3-layer pre-storage quality gate: structural validation, content quality scoring (title, triggers, length, anchors, metadata, signal density), and semantic dedup. Behind `SPECKIT_SAVE_QUALITY_GATE` flag with 14-day warn-only graduation period |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:94:| Similar | Vector similarity | Requires embedding |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:98:Prevents exceeding embedding API limits:
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:180:| `cosineSimilarity(a, b)` | Cosine similarity between two vectors |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:181:| `checkSemanticDedup(params)` | Layer 3: semantic dedup check |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:260:  embedding: embeddingVector,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:261:  findSimilar: (emb, opts) => vectorStore.search(emb, opts),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:277:| Token estimate | `estimateTokens()` | Before embedding API |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:22:import * as vectorIndex from '../search/vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:72:    semanticDedup: SemanticDedupResult | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:84:  embedding?: Float32Array | number[] | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:90:/** Callback for finding similar memories by embedding */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:92:  embedding: Float32Array | number[],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:172:    const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:189:    const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:205:    const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:659: * Compute cosine similarity between two vectors.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:661: * @param a - First vector
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:662: * @param b - Second vector
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:686: * Layer 3: Check for semantic near-duplicates using vector similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:688: * Compares the new memory's embedding against existing memories in
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:692: * @param embedding - The embedding vector of the new memory
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:694: * @param findSimilar - Callback to find similar memories by embedding
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:698:  embedding: Float32Array | number[],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:703:    const candidates = findSimilar(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:785:        semanticDedup: null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:817:  // Layer 3: Semantic dedup (only if embedding and findSimilar are available)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:818:  let semanticDedup: SemanticDedupResult | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:819:  if (params.embedding && params.findSimilar) {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:820:    semanticDedup = checkSemanticDedup(
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:821:      params.embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:825:    if (semanticDedup.reason) {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:826:      allReasons.push(semanticDedup.reason);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:833:    || (semanticDedup !== null && !semanticDedup.pass);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:852:      semanticDedup,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:102:  embedding?: Float32Array | number[];
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:123:  embedding?: Float32Array | number[];
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:197:type FindSimilarFn = (embedding: Float32Array | number[], options: {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:424:    embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:566:  // Check 2: Similar duplicate via vector similarity (requires embedding)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:567:  if (check_similar && find_similar && embedding) {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:569:      const candidates = find_similar(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:627:  include_embedding_overhead?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:632:    include_embedding_overhead = true,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:652:  // Add overhead for embedding API call (context + response)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:653:  if (include_embedding_overhead) {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:654:    const embeddingOverhead = 150;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:655:    estimated += embeddingOverhead;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:758:    embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:853:      { content, spec_folder, database, find_similar, embedding, tenantId, userId, agentId, sharedSpaceId },
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:98:  // Rule 3: Words after key phrases — keywords are case-insensitive via explicit
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:48:  'embedding_model',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:49:  'embedding_generated_at',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:50:  'embedding_status',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:124:      embedding_model TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:125:      embedding_generated_at TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:126:      embedding_status TEXT DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:151:        CHECK(memory_type IN ('working', 'episodic', 'prospective', 'implicit', 'declarative', 'procedural', 'semantic', 'autobiographical', 'meta-cognitive')),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:154:        CHECK(type_inference_source IN ('frontmatter_explicit', 'importance_tier', 'file_path', 'keywords', 'default', 'manual')),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:170:    CREATE INDEX IF NOT EXISTS idx_embedding_status ON memory_index(embedding_status);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:171:    CREATE INDEX IF NOT EXISTS idx_retry_eligible ON memory_index(embedding_status, retry_count, last_retry_at);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:193:    CREATE INDEX IF NOT EXISTS idx_embedding_pending
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:194:      ON memory_index(embedding_status)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:195:      WHERE embedding_status IN ('pending', 'partial', 'retry');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:197:    CREATE INDEX IF NOT EXISTS idx_fts_fallback
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:198:      ON memory_index(spec_folder, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:199:      WHERE embedding_status IN ('pending', 'failed', 'retry');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:205:    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:212:    CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:213:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:219:    CREATE TRIGGER IF NOT EXISTS memory_fts_update AFTER UPDATE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:220:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:222:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:228:    CREATE TRIGGER IF NOT EXISTS memory_fts_delete AFTER DELETE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:229:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:234:  database.exec(`INSERT INTO memory_fts(memory_fts) VALUES('rebuild')`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:272:        DROP TRIGGER IF EXISTS memory_fts_insert;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:273:        DROP TRIGGER IF EXISTS memory_fts_update;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:274:        DROP TRIGGER IF EXISTS memory_fts_delete;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:275:        DROP TABLE IF EXISTS memory_fts;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:113:    // Intentional no-op — error deliberately discarded for fail-safe fallback
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:181:    // Intentional no-op — error deliberately discarded for fail-safe fallback
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:36:  conflictType: 'keyword_negation' | 'semantic_opposition';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:66:/** Consolidation cadence for runtime hook (weekly batch semantics) */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:69:/** Negation keywords for lightweight contradiction heuristic */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:83: * 2. Conflict check — keyword negation heuristic
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:85: * Returns pairs that are both semantically similar AND contain
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:130:  // Get all non-deprecated, non-chunk memories with embeddings
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:132:    SELECT m.id, m.title, m.content_text, v.embedding
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:145:    embedding: Buffer;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:149:  // A 5-second deadline prevents runaway CPU when embeddings are large or the
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:161:        new Float32Array(memories[i].embedding.buffer, memories[i].embedding.byteOffset, memories[i].embedding.byteLength / 4),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:162:        new Float32Array(memories[j].embedding.buffer, memories[j].embedding.byteOffset, memories[j].embedding.byteLength / 4),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:174:            conflictType: 'keyword_negation',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:185: * Heuristic-only contradiction scan when vector similarity is unavailable.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:208:  // Same 5-second timeout guard as the vector-based scan to prevent
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:209:  // Unbounded CPU usage in the heuristic O(n^2) fallback path.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:228:          conflictType: 'keyword_negation',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:244:  for (const keyword of NEGATION_KEYWORDS) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:245:    const inA = lowerA.includes(keyword);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:246:    const inB = lowerB.includes(keyword);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:44:| **Memory ID Resolution** | Deterministic ID fallback ensures stable identity across extraction runs |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:74:| `extraction-adapter.ts` | Resolves memory IDs with deterministic fallback; orchestrates post-tool extraction pipeline | — |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:27:  embedding_status?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:57:  'file_mtime_ms', 'embedding_status', 'encoding_intent', 'document_type',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:54: * the memory_fts FTS5 virtual table. The FTS5 index columns are:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:95: * FTS5 index (memory_fts). This is a safety check that should be run
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:98: * The FTS5 virtual table memory_fts should only contain:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:111:    const ftsTable = db.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:112:      `SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_fts'`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:115:    if (!ftsTable) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:120:    const createSql = ftsTable.sql.toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:125:        'CRITICAL: learned_triggers found in FTS5 index (memory_fts). ' +
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:6:// Gzip-compressed database checkpoints with embedding preservation
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:98:    'memory_fts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:103:    'embedding_cache',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:186:  embedding: Buffer | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:205:  vectors?: SnapshotVectorRow[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:311:  'memory_index', 'memory_fts', 'vec_memories', 'vec_metadata', 'causal_edges',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:637:    return ['rowid', 'embedding'];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:673:        'SELECT rowid AS rowid, embedding FROM vec_memories WHERE rowid IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:679:      SELECT v.rowid AS rowid, v.embedding AS embedding
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:686:      'SELECT rowid AS rowid, embedding FROM vec_memories'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:853:  if (Array.isArray(snapshot.vectors)) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:855:      columns: ['rowid', 'embedding'],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:856:      rows: snapshot.vectors.map((row) => ({
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:858:        embedding: row.embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:886:  if (tableName === 'memory_fts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:887:    database.exec(`INSERT INTO memory_fts(memory_fts) VALUES('delete-all')`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1047:    if (tableName === 'memory_fts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1218:      name: 'fts-rebuild',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1221:        if (tableExists(database, 'memory_fts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1222:          database.exec(`INSERT INTO memory_fts(memory_fts) VALUES('rebuild')`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1320:    'embedding_model',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1321:    'embedding_generated_at',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1322:    'embedding_status',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1375: * Optional fields (anchor_id, embedding_*, etc.) may be null/undefined for
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1452:      const vectorRows = tables.vec_memories?.rows ?? [];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1455:      const vectors = vectorRows.map((row) => ({
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1457:        embedding: toBuffer(row.embedding),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1465:        vectors,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1492:          vectorCount: vectors.length,
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:42:| **Automatic Inference** | Detect memory type from path, frontmatter, or keywords |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:74:| **semantic** | 180 days | Never | Core concepts: architecture, design principles |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:95:| critical | semantic | Core concepts, high persistence |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:109:| `architecture`, `adr-\d+` | semantic | `docs/adr-001.md` |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:132:| `memory-types.ts` | Type definitions, half-lives, path/keyword patterns |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:170:  content: '---\nmemory_type: semantic\n---\n# Architecture Overview',
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:172:// Returns: { type: 'semantic', source: 'frontmatter_explicit', confidence: 1.0 }
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:174:// From keywords
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:179:// Returns: { type: 'procedural', source: 'keywords', confidence: 0.7 }
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:35:The telemetry module provides structured observability for the retrieval pipeline and scoring subsystem. It records per-stage latency, search mode selection, fallback triggers, composite quality scores, scoring observation samples, trace payload validation, and agent consumption events. Telemetry data flows to governance tooling and is used by retrieval handlers to surface pipeline health metrics.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:52:| **FallbackMetrics** | Fallback trigger detection, optional reason string, and degraded-mode flag |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:108:When `SPECKIT_EXTENDED_TELEMETRY` is disabled (default), the minimal `RetrievalTelemetry` shell is still created so callers can rely on a stable shape. Latency, mode, fallback, quality, graph-health, and adaptive sub-metrics remain zeroed/empty, while the baseline architecture snapshot still records the current memory-roadmap phase/capability defaults.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:120:| `fallback` | `FallbackMetrics` | Fallback trigger record |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:148:| `selectedMode` | `string \| null` | Mode chosen for this run (e.g., `hybrid`, `auto`, `deep`) |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:155:**Purpose**: Record whether and why the pipeline fell back to a degraded path.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:159:| `fallbackTriggered` | `boolean` | Whether any fallback was activated |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:160:| `fallbackReason` | `string \| undefined` | Human-readable reason for fallback (omitted when not triggered) |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:161:| `degradedModeActive` | `boolean` | Whether the run completed in degraded mode |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:183:| < 0.40 | Poor -- review fallback policy |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:222:**Purpose**: Summarize graph-walk rollout semantics and bounded contribution diagnostics for a retrieval run.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:312:| `RETRIEVAL_TRACE_STAGES` | Allowed stage names: `candidate`, `filter`, `fusion`, `rerank`, `fallback`, `final-rank` |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:361:const fallback: FallbackMetrics = {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:362:  fallbackTriggered: false,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:363:  degradedModeActive: false,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:380:  fallback,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:445:| Check `fallback.fallbackTriggered` to gate quality alerts | Governance / SLO monitoring |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:446:| Use `quality.qualityProxyScore < 0.6` to log degraded-run warnings | Observability dashboards |
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:35:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:130:    rrfScore: typeof result.rrfScore === 'number' ? result.rrfScore : undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:10:// Table syntax, fence markers, checkbox notation) that degrades
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:11:// The quality of semantic embeddings and keyword retrieval.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:18://   - bm25-index.ts     ~line 245  : where `content_text` is used for token building
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:30: * including it verbatim in the embedding text just adds repetitive
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:81: * tokens like "typescript" or "json" carry no semantic signal about
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:166: * numbering carries no semantic meaning for retrieval.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:197: * Normalize markdown content for use in embedding generation.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:209: * The result is a clean prose representation suitable for semantic
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:210: * embedding models (nomic-embed-text-v1.5 and compatible providers).
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:235: * Normalize markdown content for use in BM25 keyword indexing.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:238: * embedding pipeline.  Code fence markers (``` + lang id) are stripped
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:253: *   bm25-index.ts ~line 245 where `content_text` is used for token building.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:257:  // Steps as the embedding pipeline (frontmatter, anchors, HTML
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:261:  // Can diverge in the future without modifying the embedding path.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:43:| Retrieval Stages | 6 | candidate, filter, fusion, rerank, fallback, final-rank |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:50:| **ContextEnvelope\<T\>** | Generic typed wrapper for pipeline results with trace and degraded-mode metadata |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:87:**Purpose**: Generic typed wrapper for pipeline results with trace and degraded-mode metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:93:| `degradedMode` | `DegradedModeContract?` | Optional degraded mode contract if any stage failed |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:130:| `fallback_mode` | `string` | Fallback strategy applied |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:133:| `degradedStages` | `RetrievalStage[]` | Stages affected by the degradation |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:153:| `fallback` | Fallback path (degraded mode) |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:162:| `createDegradedContract(failure_mode, fallback_mode, confidence_impact, retry_recommendation, degradedStages)` | `DegradedModeContract` | New degraded-mode record with clamped confidence |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:163:| `createEnvelope(data, trace, degradedMode?, serverVersion?)` | `ContextEnvelope<T>` | New envelope wrapping results + trace + metadata |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:227:// Reranker timed out -- signal degraded mode
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:228:const degraded = createDegradedContract(
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:236:console.log(`Failure: ${degraded.failure_mode}, confidence impact: ${degraded.confidence_impact}`);
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:246:| Signal failure | `createDegradedContract(failure, fallback, impact, retry, stages)` | When a stage falls back or fails |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:247:| Wrap output | `createEnvelope(data, trace, degraded?)` | Before returning from retrieval handler |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:349:      // Node 18 compatibility fallback when recursive readdir is unavailable.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:613:        // Mention boost can push rawScore above 1.0 which breaks [0,1] score semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:36:  | 'semantic'
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:94:  semantic: {
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:124:  'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:180:  { pattern: /architecture/i, type: 'semantic' },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:181:  { pattern: /design[-_]?doc/i, type: 'semantic' },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:182:  { pattern: /adr[-_]?\d+/i, type: 'semantic' },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:243:  'architecture': 'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:244:  'design': 'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:245:  'principle': 'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:246:  'concept': 'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:247:  'decision': 'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:355:    semantic: 180,
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:391:  { filePattern: /(?:^|\/)spec\.md$/i,                    documentType: 'spec',                    memoryType: 'semantic',    defaultImportanceTier: 'important', defaultImportanceWeight: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:392:  { filePattern: /(?:^|\/)plan\.md$/i,                    documentType: 'plan',                    memoryType: 'semantic',    defaultImportanceTier: 'important', defaultImportanceWeight: 0.7 },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:395:  { filePattern: /(?:^|\/)decision-record\.md$/i,         documentType: 'decision_record',         memoryType: 'semantic',    defaultImportanceTier: 'important', defaultImportanceWeight: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:396:  { filePattern: /(?:^|\/)implementation-summary\.md$/i,  documentType: 'implementation_summary',  memoryType: 'semantic',    defaultImportanceTier: 'normal',    defaultImportanceWeight: 0.6 },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:397:  { filePattern: /(?:^|\/)(?:research\/research\.md|research\.md)$/i, documentType: 'research', memoryType: 'semantic', defaultImportanceTier: 'normal', defaultImportanceWeight: 0.6 },
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:35: * Checks `score`, then `similarity`, then `rrfScore` — returns 0 if none found.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:48:  const rrfScore = row.rrfScore;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:49:  if (typeof rrfScore === 'number' && Number.isFinite(rrfScore)) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:50:    return rrfScore;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:59: * Falls back to `['hybrid']` if no channels are found.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:85:    channels.add('hybrid');
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:6:import * as vectorIndex from '../search/vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:17:  keywords: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:58:  degraded?: TriggerMatcherDegradedState;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:179:  WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:352:    vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:353:    const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:553:  // Check CORRECTION keywords
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:563:      keywords: correctionHits,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:568:  // Check PREFERENCE keywords
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:578:      keywords: preferenceHits,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:583:  // Check REINFORCEMENT keywords
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:593:      keywords: reinforcementHits,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:720:      ...(lastDegradedState ? { degraded: lastDegradedState } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:25:`lib/storage/` contains the persistence-side helpers that sit below handlers and above the raw vector-index schema/runtime. The directory currently contains 14 TypeScript modules.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:37:- The primary memory schema is at `SCHEMA_VERSION = 23` in `lib/search/vector-index-schema.ts`.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:65:- `incremental-index.ts` uses `file_mtime_ms`, `content_hash`, and `embedding_status` together, so unchanged-path fast paths still requeue rows whose embeddings are unhealthy.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:71:- `checkpoints.ts` supports working-memory snapshots, while restore flows still require a re-index pass to rebuild embeddings.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:174:    // T-07: Replace success-shaped fallback with explicit failure signaling.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts:17: * @param filePath - Source file path used for fallback heuristics.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts:48: * @returns True when the document participates in spec-level semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:31:  source: 'frontmatter_explicit' | 'importance_tier' | 'file_path' | 'keywords' | 'default';
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:61:  critical: 'semantic',              // Core concepts, high persistence
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:141:    return 'semantic';
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:184:  // Score each type based on keyword matches
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:187:  for (const [keyword, type] of Object.entries(KEYWORD_TYPE_MAP)) {
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:188:    if (fullText.includes(keyword.toLowerCase())) {
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:190:      // Longer keywords get higher scores (more specific)
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:191:      typeScores.set(type, currentScore + keyword.length);
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:275:  // 5. Check keyword analysis
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:276:  const keywordType = inferTypeFromKeywords(title, triggerPhrases, content);
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:277:  if (keywordType) {
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:279:      type: keywordType,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:280:      source: 'keywords',
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:307:    // L1 FIX: Use index-based fallback key to avoid collapsing pathless inputs
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:323:  keywords: 'Matched keywords in title or trigger phrases',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:17: * fallbacks, search-enriched properties, etc.).
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:5:// Captures latency, mode selection, fallback, and quality-proxy
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:71:  fallbackTriggered: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:72:  fallbackReason?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:73:  degradedModeActive: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:162:  fallback: FallbackMetrics;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:197:    fallback: {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:198:      fallbackTriggered: false,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:199:      degradedModeActive: false,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:266:  t.fallback.fallbackTriggered = true;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:268:    t.fallback.fallbackReason = reason;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:270:  t.fallback.degradedModeActive = true;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:643:  const fallbackPayload: Record<string, unknown> = {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:644:    fallbackTriggered: t.fallback.fallbackTriggered,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:645:    degradedModeActive: t.fallback.degradedModeActive,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:647:  if (typeof t.fallback.fallbackReason === 'string' && t.fallback.fallbackReason.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:648:    fallbackPayload.fallbackReason = t.fallback.fallbackReason;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:662:    fallback: fallbackPayload,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:28:- `content-normalizer.ts` for embedding/BM25-safe normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:36:| `content-normalizer.ts` | Strips frontmatter, anchors, HTML comments, fences, tables, list syntax, and heading markers before embedding or BM25 work |
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:47:- `content-normalizer.ts` is the shared normalization path for both embedding generation and BM25 token building.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:262:> but the camelCase variant is always `undefined`. The `??` fallback chain ensures
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:9:import * as bm25Index from '../search/bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:10:import * as embeddingsProvider from '../providers/embeddings.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:12:import { ensureLineageTables } from '../search/vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:13:import { get_embedding_dim, refresh_interference_scores_for_folder, sqlite_vec_available } from '../search/vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:14:import { to_embedding_buffer } from '../search/vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:167:  embedding: Float32Array | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:168:  embeddingFailureReason: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:442:  const { database, parsed, filePath, embedding, embeddingFailureReason } = params;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:452:  const embeddingStatus = embedding
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:466:      embedding_model,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:467:      embedding_generated_at,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:468:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:486:    embeddingsProvider.getModelName(),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:487:    embedding ? now : null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:488:    embeddingStatus,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:489:    embeddingFailureReason,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:512:  if (embedding && sqlite_vec_available()) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:513:    const expectedDim = get_embedding_dim();
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:514:    if (embedding.length !== expectedDim) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:515:      throw new Error(`Embedding must be ${expectedDim} dimensions, got ${embedding.length}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:519:      INSERT INTO vec_memories (rowid, embedding)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:521:    `).run(BigInt(memoryId), to_embedding_buffer(embedding));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:524:  if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:526:      bm25Index.getIndex().addDocument(String(memoryId), bm25Index.buildBm25DocumentText({
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:64:let bm25IndexModule: Bm25IndexModule | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:65:let bm25IndexModulePromise: Promise<Bm25IndexModule | null> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:68:  if (bm25IndexModule !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:69:    return bm25IndexModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:71:  if (bm25IndexModulePromise !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:72:    return bm25IndexModulePromise;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:75:  const primaryModulePath = '../search/bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:76:  const fallbackModulePath = '../../search/bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:80:      bm25IndexModule = await import(primaryModulePath) as Bm25IndexModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:81:      return bm25IndexModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:86:        bm25IndexModule = await import(fallbackModulePath) as Bm25IndexModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:87:        return bm25IndexModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:88:      } catch (fallbackError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:89:        const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:91:          `[archival-manager] bm25-index module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:98:  bm25IndexModulePromise = loadPromise;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:102:    if (bm25IndexModulePromise === loadPromise) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:103:      bm25IndexModulePromise = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:109:  if (bm25IndexModule !== null) return bm25IndexModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:110:  if (bm25IndexModulePromise === null) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:120:let embeddingsModule: EmbeddingModule | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:121:let embeddingsModulePromise: Promise<EmbeddingModule | null> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:124:  if (embeddingsModule !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:125:    return embeddingsModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:127:  if (embeddingsModulePromise !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:128:    return embeddingsModulePromise;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:131:  const primaryModulePath = '../providers/embeddings.js';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:132:  const fallbackModulePath = '../../providers/embeddings.js';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:136:      embeddingsModule = await import(primaryModulePath) as EmbeddingModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:137:      return embeddingsModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:142:        embeddingsModule = await import(fallbackModulePath) as EmbeddingModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:143:        return embeddingsModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:144:      } catch (fallbackError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:145:        const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:147:          `[archival-manager] embeddings module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:154:  embeddingsModulePromise = loadPromise;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:158:    if (embeddingsModulePromise === loadPromise) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:159:      embeddingsModulePromise = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:165:  if (embeddingsModule !== null) return embeddingsModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:166:  if (embeddingsModulePromise === null) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:173:  embeddingsModule = module;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:174:  embeddingsModulePromise = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:491:  const bm25 = getBm25Index();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:492:  if (!db || !bm25 || !bm25.isBm25Enabled()) return;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:495:    bm25.getIndex().removeDocument(String(memoryId));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:502:// Vector-only deletion — removes the vec_memories embedding row without
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:520:  const bm25 = getBm25Index();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:521:  if (!db || !bm25 || !bm25.isBm25Enabled()) return;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:534:    const text = bm25.buildBm25DocumentText(row);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:536:    bm25.getIndex().addDocument(String(memoryId), text);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:544: * Defer vector re-embedding to the next index scan rather than rebuilding immediately.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:549: * the unarchive call on an async embedding generation round-trip and keeps the
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:554:    `[archival-manager] Deferred vector re-embedding for memory ${memoryId} until next index scan`
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-summaries.ts:101:    const fallbackIds = memberIds.slice(0, 3).map(String);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-summaries.ts:102:    sentences.push(`The cluster is currently identified by member IDs ${formatList(fallbackIds)}.`);
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:45: * | `regex`      | Lightweight regex-based fallback — no WASM dependencies     |
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:92:  fallbackTier?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:589:  // Method 2: Find ## Trigger Phrases section (fallback/additional)
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:631:  const { documentType = null, fallbackTier = null } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:658:  if (fallbackTier && isValidTier(fallbackTier)) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:659:    return normalizeTier(fallbackTier);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:80: * This is a lightweight heuristic used when vector cosine similarity
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:15:  'fallback',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:17:// Feature catalog: Stage 3 effectiveScore fallback chain
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:188:    { pattern: /embedding.*failed/i, message: 'Failed to generate embedding. Search may be unavailable.' },
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:268:  // Legacy fallback patterns
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:300:  // Legacy fallback patterns
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:350:  // Extract error code (from MemoryError or fallback)
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:146:  source: 'memory' | 'code-graph' | 'semantic' | 'session' | 'operational';
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:303:    // fallbacks are preserved separately and map to the nearest legacy parser
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:6:// After embedding generation, check top-3 most similar memories
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:19:import * as bm25Index from '../search/bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:20:import { clear_search_cache } from '../search/vector-index-aliases.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:21:import { refresh_interference_scores_for_folder } from '../search/vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:23:import { delete_memory_from_database } from '../search/vector-index-mutations.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:59:  embedding: Float32Array | number[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:113:/** Callback for finding similar memories by embedding */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:115:  embedding: Float32Array | number[],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:122:/** Callback for generating an embedding from content */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:154: * @param embedding - The embedding vector to compare against
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:156: * @param findSimilar - Callback to find similar memories by embedding
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:161:  embedding: Float32Array | number[],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:167:    return findSimilar(embedding, { limit, specFolder });
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:203: * memory, boosts the importance_weight, and updates the embedding
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:209: * @param generateEmbedding - Optional callback to regenerate embedding for merged content
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:220:  let bm25RepairWarning: string | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:239:    // Generate embedding BEFORE transaction (async I/O cannot run inside
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:247:        console.warn('[reconsolidation] Failed to regenerate embedding for merge:', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:248:        // Non-fatal: merged content is stored even without updated embedding
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:252:    let bm25RepairNeeded = false;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:269:        SELECT embedding
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:272:      `).get(existingMemory.id) as { embedding?: Buffer } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:274:        ? embeddingToBuffer(newEmbedding)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:275:        : (reusedEmbeddingRow?.embedding ?? null);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:276:      const mergedEmbeddingStatus = mergedEmbeddingBuffer ? 'success' : getOptionalString(currentRow, 'embedding_status') ?? 'pending';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:282:      mergedBm25DocumentText = bm25Index.buildBm25DocumentText({
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:308:        embedding_status: mergedEmbeddingStatus,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:309:        embedding_model: getOptionalString(currentRow, 'embedding_model'),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:310:        embedding_generated_at: mergedEmbeddingBuffer ? now : getOptionalString(currentRow, 'embedding_generated_at'),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:314:        bm25_repair_needed: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:329:          INSERT INTO vec_memories (rowid, embedding)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:337:        embedding_status: mergedEmbeddingStatus,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:358:      if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:360:          const bm25 = bm25Index.getIndex();
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:361:          bm25.removeDocument(String(existingMemory.id));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:362:          bm25.addDocument(String(newId), mergedBm25DocumentText);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:363:        } catch (bm25Err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:364:          const message = bm25Err instanceof Error ? bm25Err.message : String(bm25Err);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:366:          bm25RepairNeeded = true;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:392:    if (bm25RepairNeeded) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:400:        bm25RepairWarning =
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:414:      warnings: bm25RepairWarning ? [bm25RepairWarning] : undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:467: * Legacy fallback (when no new ID is available):
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:522:      // Atomic transaction: content + embedding + hash update together.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:534:        if (newMemory.embedding) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:535:          const buffer = embeddingToBuffer(newMemory.embedding);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:537:            'UPDATE vec_memories SET embedding = ? WHERE rowid = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:624:    newMemory.embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:723: * Convert an embedding array to a Buffer for SQLite storage.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:725: * @param embedding - The embedding as Float32Array or number[]
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:726: * @returns Buffer representation of the embedding
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:728:function embeddingToBuffer(embedding: Float32Array | number[]): Buffer {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:729:  if (embedding instanceof Float32Array) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:730:    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:732:  return Buffer.from(new Float32Array(embedding).buffer);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:740:  if (!bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:745:    const bm25 = bm25Index.getIndex();
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:747:      bm25.removeDocument(String(args.previousMemoryId));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:749:    bm25.removeDocument(String(args.memoryId));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:750:    bm25.addDocument(String(args.memoryId), args.documentText);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:768:  if (tableColumns.has('bm25_repair_needed')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:773:    db.exec('ALTER TABLE memory_index ADD COLUMN bm25_repair_needed INTEGER DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:774:    tableColumns.add('bm25_repair_needed');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:778:      tableColumns.add('bm25_repair_needed');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:781:    console.warn('[reconsolidation] Failed to ensure bm25_repair_needed column:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:791:  if (!tableColumns.has('bm25_repair_needed')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:798:      SET bm25_repair_needed = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:804:    console.warn(`[reconsolidation] Failed to persist bm25_repair_needed=${repairNeeded ? 1 : 0} for memory ${memoryId}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:900:  const fallbackFields: Record<keyof PostInsertMetadataFields, unknown> = {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:910:    embedding_status: existingRow.embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:932:  for (const key of Object.keys(fallbackFields) as Array<keyof PostInsertMetadataFields>) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:936:    const value = preferredFields[key] ?? fallbackFields[key];
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:65:- Purpose: Owns short-lived caching for expensive operations, especially tool output reuse and embedding reuse. This module is an infrastructure concern, not a ranking or retrieval-policy layer.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:67:  - `embedding-cache.ts` — persistent embedding cache used to avoid duplicate embedding generation.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:81:  - `anchor-chunker.ts` — anchor-first, heading-fallback chunk generation for large files.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:156:  - `bm25-baseline.ts` — lexical-only baseline measurement.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:218:- Purpose: Owns local runtime abstractions for vector-store behavior and documents the shared-package migration of interface types. It is the compatibility boundary between in-repo consumers and `@spec-kit/shared` contracts.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:220:  - `vector-store.ts` — local abstract base class for JS/runtime vector-store implementations.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:270:- Purpose: Owns embedding provider abstraction and retry orchestration. It is the provider-facing infrastructure boundary between retrieval/indexing code and concrete embedding backends.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:272:  - `embeddings.ts` — shared-package-backed embeddings surface used by index/search code.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:313:- Purpose: Owns the retrieval engine: candidate generation, vector/lexical channels, fusion, reranking, query intelligence, graph-aware retrieval, and schema/index helpers needed by the search path. This is the highest-churn and broadest domain module in `lib/`.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:315:  - `hybrid-search.ts` — main hybrid retrieval entry point across search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:317:  - `vector-index-store.ts` — vector-store abstraction bridge and core index operations.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:318:  - `vector-index-schema.ts` — schema creation and schema-safety helpers for search storage.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:352:  - `incremental-index.ts` — incremental indexing and deferred lexical-only indexing helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:401:  - `save-quality-gate.ts` — multi-layer structural/content/semantic quality gate.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:226:    searchType: 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:417:        console.warn('[shadow-evaluation-runtime] skipped cycle: embedding model not ready');
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:91:| E040-E049 | Search | Query errors, vector unavailable |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:143:// Returns tool-specific hint for embedding failure in search context
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts:4:// Feature catalog: Quality-aware 3-tier search fallback
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts:60: * Compute pressure level with a three-tier fallback contract:
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:15:export type RankDirection = 'improved' | 'degraded' | 'unchanged';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:41:  /** Count of results that degraded. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:42:  degradedCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:84:  if (delta < 0) return 'degraded';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:242:  let degradedCount = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:258:      else if (direction === 'degraded') degradedCount++;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:289:      degradedCount,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:9:import * as vectorIndex from '../search/vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:10:import { computeContentHash, lookupEmbedding, storeEmbedding } from '../cache/embedding-cache.js';
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:12:import { generateDocumentEmbedding, getEmbeddingDimension, getModelName } from './embeddings.js';
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:36:/** In-memory-only snapshot of embedding retry health — no DB access. */
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:82: * for camelCase fallback fields (e.g. retryCount, triggerPhrases).
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:116:  const status = typeof memory.embedding_status === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:117:    ? memory.embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:118:    : typeof memory.embeddingStatus === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:119:      ? memory.embeddingStatus
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:151:  if (lower.includes('openai') || lower.includes('text-embedding')) return 'openai';
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:160:    /^embedding_[a-z_]+/.test(lower) ||
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:164:    lower.includes('text-embedding') ||
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:174:    lower.includes('embedding provider')
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:182:  if (lower.includes('embedding_timeout') || lower.includes('timeout') || lower.includes('timed out')) {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:190:    lower.includes('embedding_rate_limit') ||
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:292:  const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:305:        SET embedding_status = 'retry',
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:309:          AND embedding_status = 'pending'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:318:          AND embedding_status = 'retry'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:366:// Hammering the embedding API when the provider is entirely down. After
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:442:  vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:443:  const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:452:    WHERE embedding_status IN ('pending', 'retry')
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:455:      CASE WHEN embedding_status = 'pending' THEN 0 ELSE 1 END,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:474:  if (row.embedding_status === 'pending') return true;
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:476:  if (row.embedding_status === 'retry' && row.last_retry_at) {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:487:  return row.embedding_status === 'retry';
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:491:  const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:499:    WHERE embedding_status = 'failed'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:507:  const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:515:      SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:516:      SUM(CASE WHEN embedding_status = 'retry' THEN 1 ELSE 0 END) as retry,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:517:      SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:518:      SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as success,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:537: * Return a lightweight in-memory snapshot of embedding retry health.
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:561:  const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:567:    const memory = vectorIndex.getMemory(id);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:570:      typeof memory.embedding_status === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:571:        ? memory.embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:572:        : typeof (memory as { embeddingStatus?: unknown }).embeddingStatus === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:573:          ? (memory as { embeddingStatus?: string }).embeddingStatus ?? null
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:582:    // BUG-1 fix: Normalize content before embedding to match sync save path (memory-save.ts:1119).
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:583:    // Without this, async-saved memories get embeddings from raw markdown (YAML frontmatter, HTML
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:584:    // Comments, code fences) while sync-saved memories get clean normalized embeddings.
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:587:    const embeddingDim = getEmbeddingDimension();
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:589:    const cachedEmbedding = lookupEmbedding(db, contentHash, modelId, embeddingDim);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:591:    let embedding: Float32Array | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:594:      embedding = new Float32Array(
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:606:        embedding = await generateDocumentEmbedding(normalizedContent);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:619:      if (embedding) {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:625:          Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength),
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:626:          embedding.length,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:633:    if (!embedding) {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:641:        SET embedding_status = 'success',
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:642:            embedding_generated_at = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:654:      const embeddingBuffer = Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:655:      db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(BigInt(id), embeddingBuffer);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:661:      return { success: true, id, dimensions: embedding.length };
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:683:  const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:687:  const memory = vectorIndex.getMemory(id);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:696:  const previousStatus = typeof memory.embedding_status === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:697:    ? memory.embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:698:    : typeof (memory as { embeddingStatus?: unknown }).embeddingStatus === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:699:      ? (memory as { embeddingStatus?: string }).embeddingStatus ?? null
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:707:      SET embedding_status = 'retry',
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:719:  const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:725:  const memory = vectorIndex.getMemory(id);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:728:  const previousStatus = memory && typeof memory.embedding_status === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:729:    ? memory.embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:730:    : memory && typeof (memory as { embeddingStatus?: unknown }).embeddingStatus === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:731:      ? (memory as { embeddingStatus?: string }).embeddingStatus ?? null
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:736:    SET embedding_status = 'failed',
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:745:  const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:748:  const memory = vectorIndex.getMemory(id);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:749:  const previousStatus = memory && typeof memory.embedding_status === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:750:    ? memory.embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:751:    : memory && typeof (memory as { embeddingStatus?: unknown }).embeddingStatus === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:752:      ? (memory as { embeddingStatus?: string }).embeddingStatus ?? null
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:757:    SET embedding_status = 'retry',
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:762:    WHERE id = ? AND embedding_status = 'failed'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:895:    console.error(`[retry-manager] Background job: Processing up to ${batchSize} of ${stats.queue_size} pending embeddings`);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:945:  const memory = vectorIndex.getMemory(id) as RetryMemoryRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:789:      // This preserves legacy "rollback to before next change" semantics for
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:8://   2. Session continuity warning if quality score is degraded/critical
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:120: * Enrich with session continuity warning if quality is degraded.
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:131:    if (quality.level === 'degraded') {
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:4:// Feature catalog: Deferred lexical-only indexing
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:38:  embedding_status: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:119:          SELECT file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:126:          SELECT file_path, file_mtime_ms, content_hash, embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:174:    // Still check if embedding status is pending
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:175:    if (stored.embedding_status === 'pending' || stored.embedding_status === 'failed') {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:23: * fallbacks, search-enriched properties like similarity, etc.).
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:28:// Try to import, fallback to inline calculation if not yet available
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:77:    console.warn(`[composite-scoring] fsrs-scheduler unavailable; using inline fallback: ${fsrsSchedulerLoadError}`);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:151:  semantic_threshold: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:259:  semantic_threshold: 0.8,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:312:  // Graduated-ON semantics — classification decay is active unless explicitly disabled.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:468:  if (similarity >= PATTERN_ALIGNMENT_BONUSES.semantic_threshold) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:469:    score += (similarity - PATTERN_ALIGNMENT_BONUSES.semantic_threshold) * 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:473:  // Boost score when query keywords match the document type
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:567:        // Graduated flag — default ON. Use !== 'false' to match graduated semantics (BUG-4 fix).
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:600:  // Merging partial overrides. Without this, partial overrides break weighted-average semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:648:  // Without this, partial overrides break weighted-average semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:271:  vectorSearchFn: (embedding: Float32Array, options: Record<string, unknown>) => Array<{ id: number; similarity: number; [key: string]: unknown }>
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:276:    // Get the memory's embedding via a vector search for itself
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:280:    // Get the memory's actual embedding from vec_memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:281:    const embeddingRow = db ? (db.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:282:      'SELECT embedding FROM vec_memories WHERE rowid = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:283:    ) as import('better-sqlite3').Statement).get(memoryId) as { embedding: Buffer } | undefined : undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:285:    if (!embeddingRow || !embeddingRow.embedding || embeddingRow.embedding.length === 0) return 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:288:    const uint8 = new Uint8Array(embeddingRow.embedding);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:291:      console.warn(`[co-activation] Invalid embedding size (${uint8.byteLength} bytes) for memory ${memoryId}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:294:    const embedding = new Float32Array(uint8.buffer, uint8.byteOffset, uint8.byteLength / 4);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:295:    const similar = vectorSearchFn(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:322: * which may be semantically dissimilar but contextually important.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:366: * surfaces causally related but semantically dissimilar memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:367: * that pure vector similarity would miss.
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:147:// Returns: ['L1', 'L2'] - Start orchestration, fallback to core
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:8:// Spec: system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:5:  - "embedding providers"
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:32:The providers module handles embedding generation and retry logic for the Spec Kit Memory MCP server. It provides a unified abstraction layer for multiple embedding providers (Voyage AI, OpenAI) with exponential backoff retry management for reliable embedding generation.
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:38:| Modules | 2 | embeddings, retry-manager |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:46:| **Provider Abstraction** | Unified interface for Voyage AI, OpenAI and local models (re-exported from `@spec-kit/shared/embeddings`) |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:48:| **Background Retry Job** | Optional processing of pending embeddings every 5 minutes |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:60: embeddings.ts        # Re-export from @spec-kit/shared/embeddings
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:69:| `embeddings.ts` | Re-exports all embedding utilities from `@spec-kit/shared/embeddings` |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:83:### Embeddings Provider (`embeddings.ts`)
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:85:**Purpose**: Unified interface for generating embeddings from multiple providers
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:90:| **Task Types** | Query embeddings, document embeddings, batch processing |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:92:| **Source** | Re-exported from `@spec-kit/shared/embeddings` (workspace package) |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:95:import { generateDocumentEmbedding, generateQueryEmbedding } from './embeddings';
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:103:**Purpose**: Handle failed embedding generations with exponential backoff
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:120:| `retryEmbedding` | `(id: number, content: string) => Promise<RetryResult>` | Retry a single embedding |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:137:**T3-15 circuit breaker:** The retry manager opens a provider circuit breaker after 5 consecutive embedding-provider failures, cools down for 2 minutes, and causes retry paths to skip outbound embedding API calls until the cooldown expires.
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:149:import { generateDocumentEmbedding } from './embeddings';
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:152:const embedding = await generateDocumentEmbedding(text);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:154:if (embedding) {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:155:  console.log(`Embedding dimensions: ${embedding.length}`);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:187:| Generate doc embedding | `generateDocumentEmbedding(text)` | Index new content |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:188:| Generate query embedding | `generateQueryEmbedding(text)` | Search queries |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:207:| [search/README.md](../search/README.md) | Vector search using embeddings |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:213:| [Voyage AI Docs](https://docs.voyageai.com/) | Primary embedding provider |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:214:| [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) | Alternative provider |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:148:      'Verify network connectivity to embedding provider',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:149:      'Run memory_health() to check embedding system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:155:    hint: 'Embedding dimension mismatch. The vector index may need reindexing.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:158:      'Check if embedding provider changed (e.g., Voyage vs OpenAI)',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:168:      'Check network latency to embedding provider',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:169:      'Consider enabling local fallback: ENABLE_LOCAL_FALLBACK=true'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:175:    hint: 'No embedding provider available. Search limited to text matching.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:178:      'Enable local fallback: ENABLE_LOCAL_FALLBACK=true',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:337:      'If vector search failed, results may still include BM25 matches'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:343:    hint: 'Vector search unavailable. Using text-based search as fallback.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:345:      'Check embedding provider status with memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:346:      'Ensure at least one embedding method is configured',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:347:      'Text search (BM25) will still work for keyword matches'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:389:      'Enable local fallback: ENABLE_LOCAL_FALLBACK=true'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:403:    hint: 'Local embedding model not available.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:407:      'Use API-based embedding as alternative'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:412:    hint: 'Rate limited by embedding provider. Retry after delay.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:415:      'Consider enabling local fallback for high-volume operations',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:610:      'See memory_causal_link() documentation for relation semantics'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:696:      hint: 'Semantic search unavailable. Results limited to keyword matching.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:699:        'Check embedding provider status: memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:753:      hint: 'Memory saved but embedding failed. Will be searchable via text only.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:757:        'Check memory_health() for embedding provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:777:      hint: 'Scan complete but embeddings unavailable. Files indexed for text search only.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:779:        'Configure an embedding provider for semantic search',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:780:        'Re-run scan after configuring embeddings',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:15:  embedding: Buffer;
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:40: * Create the embedding_cache table if it does not exist.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:47:    CREATE TABLE IF NOT EXISTS embedding_cache (
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:50:      embedding BLOB NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:62: * Look up a cached embedding by content hash, model ID, and embedding dimension.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:63: * On hit: updates last_used_at and returns the embedding Buffer.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:69: * @param dimensions - Expected embedding dimensions for this lookup
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:79:    'SELECT embedding FROM embedding_cache WHERE content_hash = ? AND model_id = ? AND dimensions = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:81:    | { embedding: Buffer }
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:93:    "UPDATE embedding_cache SET last_used_at = datetime('now') WHERE content_hash = ? AND model_id = ? AND dimensions = ?",
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:96:  return row.embedding;
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:107: * Store an embedding in the cache.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:109: * rows are overwritten with the latest embedding, while allowing multiple
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:120: * @param embedding - Raw embedding buffer
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:121: * @param dimensions - Number of embedding dimensions
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:127:  embedding: Buffer,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:132:    'SELECT COUNT(*) AS cnt FROM embedding_cache',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:138:      `DELETE FROM embedding_cache WHERE rowid IN (
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:139:         SELECT rowid FROM embedding_cache ORDER BY last_used_at ASC LIMIT ?
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:145:    `INSERT OR REPLACE INTO embedding_cache
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:146:       (content_hash, model_id, embedding, dimensions, last_used_at)
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:148:  ) as Database.Statement).run(contentHash, modelId, embedding, dimensions);
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:162:    `DELETE FROM embedding_cache
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:172: * Return runtime hit/miss statistics for the embedding cache.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:179: * Return aggregate statistics about the embedding cache.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:199:      COALESCE(SUM(LENGTH(embedding)), 0) AS total_size_bytes,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:202:    FROM embedding_cache
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:221: * Remove all entries from the embedding cache.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:226:  db.exec('DELETE FROM embedding_cache');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:16:// Search-time ranking      → FSRS-preferred SQL (vector-index-impl.js)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:105:  // Inline fallback uses canonical constants from fsrs-scheduler.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:307:      WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:51: * Apply temporal-contiguity boost to vector search results.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:63:export function vectorSearchWithContiguity(
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:63:├── embedding-cache.ts     # Persistent SQLite embedding cache with LRU eviction
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:74:| `embedding-cache.ts` | Persistent SQLite embedding cache: avoids re-computing embeddings for identical content. Uses content-hash + model-ID keys with LRU eviction (Sprint 3) |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:144:### Embedding Cache (`embedding-cache.ts`)
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:146:**Purpose**: Persistent SQLite-backed embedding cache to avoid redundant API calls for identical content.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:151:| **Storage** | SQLite table `embedding_cache` |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:157:| `initEmbeddingCacheTable(db)` | Create `embedding_cache` table (idempotent) |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:158:| `getEmbeddingFromCache(db, contentHash, modelId)` | Retrieve cached embedding (updates LRU timestamp) |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:159:| `putEmbeddingInCache(db, contentHash, modelId, embedding, dimensions)` | Store embedding in cache |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:242:| `embedding-cache.ts` | Persistent embedding cache keyed by content hash + model |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts:8:// MAINTENANCE: Keep exports in sync with @spec-kit/shared/embeddings.
.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts:18:  semanticChunk,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts:48:  __embeddingCircuitTestables,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts:49:} from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:27:  | 'embedding'
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:85:const ACTIVE_STATES = new Set<IngestJobState>(['queued', 'parsing', 'embedding', 'indexing']);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:90:  parsing: new Set<IngestJobState>(['embedding', 'cancelled', 'failed']),
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:91:  embedding: new Set<IngestJobState>(['indexing', 'cancelled', 'failed']),
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:166:function parseJsonArray<T>(value: string | null | undefined, fallback: T[]): T[] {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:167:  if (!value) return fallback;
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:170:    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:172:    return fallback;
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:551:  const stateRisk = job.state === 'indexing' ? 0.15 : (job.state === 'embedding' ? 0.1 : 0.05);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:586:  // Step 2: Embedding — placeholder for batch embedding pre-processing.
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:590:  job = await setIngestJobState(jobId, 'embedding');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:91:| **Spreading Activation**     | Boost related memories (+0.15 on access)                                              | Maintains semantic coherence         |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:271:| `temporal-contiguity.ts`   | Time-based linking        | `vectorSearchWithContiguity`, `getTemporalNeighbors`, `buildTimeline`       |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:547:// Populate related memories using vector search
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:550:  vectorSearchFn  // (embedding: Float32Array, options) => Array<{id, similarity}>
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:701:  vectorSearchWithContiguity,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:711:// Boost vector search results by temporal proximity
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:717:const boosted = vectorSearchWithContiguity(results, DEFAULT_WINDOW);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:791:  candidates,        // from vector search
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1029:| [../search/vector-index.ts](../search/vector-index.ts)             | Semantic search using voyageai embeddings |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:14:// Scores query-memory relevance using lexical overlap heuristics.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:20://   - LLM-judge interface is deterministic (non-stub fallback).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:326: * Deterministic fallback implementation for LLM-judge relevance labels.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:328: * Uses lexical overlap between query and memory content to assign
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:357:          reasoning: 'Heuristic judge: insufficient lexical signal (empty query or content tokens)',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:200:            ? 'semantic'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:59:  // Empty seeds + no subject → outline mode fallback
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:119:/** Build fallback result when no seeds/subject resolve */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:158:  actions.push('Use `mcp__cocoindex_code__search` for semantic discovery of related code');
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:65:  /** Total improved / degraded / unchanged across all queries. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:83:  total_degraded: number;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:149:    direction    TEXT NOT NULL CHECK(direction IN ('improved','degraded','unchanged')),
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:172:    total_degraded   INTEGER NOT NULL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:433:         mean_kendall_tau, total_improved, total_degraded, total_unchanged, is_improvement)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:517:      totalDegraded: row.total_degraded,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:660:      totalDegraded += comp.metrics.degradedCount;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:6:// - Regex fallback (SPECKIT_PARSER=regex): lightweight, no WASM deps
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:342:    // Class methods — require at least one modifier keyword OR a method body opener `{`
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:477:  let classIndent = 0; // indentation column of the class keyword
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:604:    // F042: Match 'function foo { }' and 'function foo() { }' (function keyword form without prior match)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:679: *   - 'regex': Lightweight regex-based fallback with no WASM dependencies
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:904:        // Skip self-references, keywords, and duplicates
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:906:        // Skip common JS/TS keywords that precede parens
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:5:// retrieval backend: structural (code graph) vs semantic
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:6:// (CocoIndex) vs hybrid (both).
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:9:// routing between structural (code graph) and semantic backends.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:11:export type QueryIntent = 'structural' | 'semantic' | 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:17:  semanticScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:71:  // F035: Narrowed — require semantic noun after opener to avoid matching structural queries
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:75:  // F035: Narrowed — require semantic noun after "what is/are/does"
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:85:function countKeywordHits(tokens: string[], keywords: Set<string>): { count: number; matched: string[] } {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:88:    if (keywords.has(token)) matched.push(token);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:92:  for (const kw of keywords) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:113: * (code graph) and semantic (CocoIndex) retrieval backends.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:120:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:125:  const semanticHits = countKeywordHits(tokens, SEMANTIC_KEYWORDS);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:127:  const semanticPatterns = countPatternHits(query, SEMANTIC_PATTERNS);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:129:  // Weighted scoring: keywords count 1x, patterns count 2x
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:131:  const semanticScore = semanticHits.count + semanticPatterns * 2;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:132:  const total = structuralScore + semanticScore;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:134:  const matchedKeywords = [...structuralHits.matched, ...semanticHits.matched];
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:136:  // No signals at all → hybrid (run both)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:138:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:142:  const semanticRatio = semanticScore / total;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:156:      semanticScore,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:161:  // Clear semantic signal (>65% semantic)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:162:  if (semanticRatio > 0.65) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:164:      intent: 'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:165:      confidence: computeConfidence(semanticRatio),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:167:      semanticScore,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:172:  // Ambiguous → hybrid with moderate confidence
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:174:    intent: 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:175:    confidence: 0.5 + Math.abs(structuralRatio - semanticRatio) * 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:177:    semanticScore,
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:19:  /** Anchor IDs covered by this chunk (empty for fallback chunks) */
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:57:/** Maximum chunk size — hard cap to stay under embedding token budget */
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:63:/** Max characters for parent summary (BM25 fallback) */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:97:    // Density denominator uses total memories for meaningful sparse-graph semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:211:    '  neutralising its contribution to hybrid search until R10 is complete.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:160:      lines.push('Orientation: use code graph highlights for structural entry points and call paths; use CocoIndex for semantic discovery when the symbol or file is still unknown.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:118:export function getRecoveryApproach(): 'hooks' | 'tool_fallback' {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:119:  return areHooksAvailable() ? 'hooks' : 'tool_fallback';
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:32:The chunking module splits large memory files into smaller pieces suitable for embedding and indexing. It works in two stages: first chunking (splitting), then thinning (filtering).
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:43:| Anchor-first, structure-fallback | ANCHOR tags provide precise author-defined boundaries. Heading-based splitting is a reasonable fallback for untagged content. |
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:44:| 4,000-char target, 12,000-char max | Target of ~1,000 tokens (at 4 chars/token) fits embedding model budgets. Hard cap prevents single chunks from exceeding token limits. |
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:58:  anchor-chunker.ts    # Two-strategy file chunking (anchor-based + structure-based fallback)
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:116:| `PARENT_SUMMARY_LENGTH` | 500 chars | BM25 fallback summary extracted from file start |
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:8:import { ensureGovernanceTables, ensureSharedSpaceTables } from '../search/vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:104:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:113:  /** Score origin metadata for distinguishing real reranks from fallbacks. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:180:  if (result.scoringMethod === 'fallback') return false;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:148:  if (node.type === 'lexical_declaration') {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:311:  if (node.type === 'lexical_declaration') {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:480:      || nodeType === 'lexical_declaration';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:71:      : 'Code graph is missing or unusable; fallback and repair flows should be used.';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:90:        'fts_consistency',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:93:        'orphan_vectors',
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:36:The MCP Server Library provides the core functionality for the Spec Kit Memory MCP server. It implements cognitive memory features including semantic search, attention decay, importance scoring and intelligent context retrieval. These modules work together to provide AI assistants with human-like memory recall and context awareness.
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:54:| **Semantic Search** | Vector-based similarity search with SQLite vector index and hybrid keyword matching |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:62:| **Embedding Cache** | Persistent SQLite cache for embedding reuse with LRU eviction |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:81:| Voyage AI API | Required | For embeddings |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:94:import { SQLiteVectorStore } from './search/vector-index';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:111:import { SQLiteVectorStore } from './search/vector-index';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:135:│   ├── vector-index.ts         # Vector similarity search with SQLite
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:136:│   ├── vector-index-impl.ts    # Core vector index implementation
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:137:│   ├── hybrid-search.ts        # Combined semantic + keyword search + token budget
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:138:│   ├── rrf-fusion.ts           # Reciprocal Rank Fusion scoring (5 channels incl. degree)
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:140:│   ├── bm25-index.ts           # BM25 lexical indexing
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:141:│   ├── sqlite-fts.ts           # SQLite FTS5 full-text search
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:200:│   ├── embeddings.ts           # Embedding provider (Voyage AI)
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:227:│   ├── embedding-cache.ts      # Persistent SQLite embedding cache with LRU eviction
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:238:│   ├── bm25-baseline.ts        # BM25 baseline measurement
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:250:│   ├── vector-store.ts         # Vector store interface
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:270:│   ├── retrieval-telemetry.ts  # Latency, mode, fallback and quality metrics
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:320:| `search/vector-index.ts` | Core vector similarity search with RRF fusion |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:321:| `search/vector-index-impl.ts` | Core vector index implementation |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:323:| `search/bm25-index.ts` | BM25 lexical search indexing |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:324:| `search/cross-encoder.ts` | Cross-encoder semantic reranking |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:343:| `cache/embedding-cache.ts` | Persistent SQLite embedding cache with LRU eviction |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:358:**Vector Index**: Semantic similarity search using Voyage AI embeddings
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:362:| **Purpose** | Find memories by semantic meaning, not just keywords |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:363:| **Usage** | `search.vectorIndex.search_memories(query, options)` |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:366:**Hybrid Search**: Combines semantic and keyword search for better recall
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:370:| **Purpose** | Use both semantic understanding and exact keyword matches |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:371:| **Usage** | `search.hybridSearch.search(query, options)` |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:403:3. **Stability fallback**: If only `stability` exists but no timestamps, use `min(1, stability / 10)`
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:404:4. **Attention score fallback**: If `attentionScore` exists, use it directly
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:518:- `lib/search/vector-index-impl.ts`: v13 migration adds `document_type` and `spec_level` columns and indexes.
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:532:import * as vectorIndex from './search/vector-index';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:534:const queryEmbedding = new Float32Array(vectorIndex.getEmbeddingDim());
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:535:const results = vectorIndex.vectorSearch(queryEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:546:**Result**: Returns top 5 memories ranked by semantic similarity and importance
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:577:// Combine semantic and keyword search
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:578:import { hybridSearch } from './search/hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:581:const results = await hybridSearch('TODO authentication', queryEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:615:| Direct imports | `import { SQLiteVectorStore } from './search/vector-index';` | Focused module usage |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:631:**Symptom**: `Error: Cannot find module './search/vector-index'`
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:638:import { SQLiteVectorStore } from './search/vector-index';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:669:import * as embeddingsProvider from './providers/embeddings';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:677:| Import errors | Use concrete module paths such as `./search/vector-index` |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:686:import { SQLiteVectorStore } from './search/vector-index';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:695:// Test embedding provider
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:696:import * as embeddingsProvider from './providers/embeddings';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:697:const embedding = await embeddingsProvider.generateQueryEmbedding('test query');
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:698:console.log('Embedding dimensions:', embedding.length);
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:721:| [Search Modules](./search/) | Vector index, hybrid search, fusion algorithms |
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:4:// Combines vector, FTS, and BM25 search with fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:9:import { getIndex, isBm25Enabled } from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:10:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:15:import { fts5Bm25Search } from './sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:63:import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:71:  embedding: Float32Array | number[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:96:   * Internal fallback override: when true, bypass complexity routing and
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:117:   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:118:   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:119:   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:122:   * After hybrid merge, all source scores are min-max normalized to 0-1 within
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:135:  _degradation?: unknown;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:141:  const primarySource = result.sources[0] ?? 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:147:    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:196:/** Fallback tier in the 3-tier degradation chain. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:199:/** Why degradation was triggered at a given tier. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:207:/** Record of a single degradation event during tiered fallback. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:216: * Absolute quality floor for degradation checks.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:219: * high fixed threshold causes false degradations. Use a conservative floor and
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:234:/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:236:/** Secondary vector similarity floor for adaptive retry passes (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:238:/** Tier-2 vector similarity floor for quality-aware fallback (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:260:let vectorSearchFn: VectorSearchFn | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:303: * Initialize hybrid search with database, vector search, and optional graph search dependencies.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:305: * @param vectorFn - Optional vector search function for semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:310:  vectorFn: VectorSearchFn | null = null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:314:  vectorSearchFn = vectorFn;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:324: * @returns Array of BM25-scored results tagged with source 'bm25'.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:326:function bm25Search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:331:    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:394:        source: 'bm25',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:398:    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:425: * @returns True if the memory_fts table exists in the connected database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:429:    console.warn('[hybrid-search] db not initialized — isFtsAvailable returning false');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:435:      SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:448: * @returns Array of FTS-scored results tagged with source 'fts'.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:450:function ftsSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:455:    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:462:    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:463:    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:466:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:468:    return bm25Results.map(row => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:471:      score: row.fts_score || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:472:      source: 'fts',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:476:    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:493:  const ftsResults = ftsSearch(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:494:  const bm25Results = bm25Search(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:501:  for (const r of ftsResults) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:505:  for (const r of bm25Results) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:554:  const fallbackScores: Record<string, number> = {};
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:559:    fallbackScores[source] = resultScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:561:  return fallbackScores;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:600:    source: typeof primary.source === 'string' ? primary.source : (sources[0] ?? 'hybrid'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:682:  const allowed = new Set<ChannelName>(['vector', 'fts', 'graph', 'degree']);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:685:    allowed.add('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:688:  if (options.useVector === false) allowed.delete('vector');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:689:  if (options.useBm25 === false) allowed.delete('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:690:  if (options.useFts === false) allowed.delete('fts');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:707:    useVector: allowedChannels.has('vector'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:708:    useBm25: allowedChannels.has('bm25'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:709:    useFts: allowedChannels.has('fts'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:742:  vectorEmbeddingCache: Map<number, Float32Array>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:747:    (result as Record<string, unknown>).fallbackRetry = true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:772:  embedding: Float32Array | number[] | null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:784:  const primaryExecution = await collectAndFuseHybridResults(query, embedding, primaryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:787:    : await hybridSearch(query, embedding, primaryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:806:    const retryExecution = await collectAndFuseHybridResults(query, embedding, retryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:809:      : await hybridSearch(query, embedding, retryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:826:    const retryExecution = await collectAndFuseHybridResults(query, embedding, retryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:829:      : await hybridSearch(query, embedding, retryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:848: * Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:849: * Prefer hybridSearchEnhanced() or searchWithFallback() instead. This function uses naive per-source
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:850: * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:851: * Retained as internal fallback only.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:853:async function hybridSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:855:  embedding: Float32Array | number[] | null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:872:  if (useVector && embedding && vectorSearchFn) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:874:      const vectorResults = vectorSearchFn(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:881:      for (const r of vectorResults) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:886:          source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:891:      console.warn(`[hybrid-search] Vector search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:897:    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:898:    results.push(...ftsResults);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:903:    const bm25Results = bm25Search(query, { limit, specFolder });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:904:    results.push(...bm25Results);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:921:      console.warn(`[hybrid-search] Graph search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:954:  // LIMITATION (P1-1): When a result appears in multiple sources (e.g., vector + fts),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:973: * Enhanced hybrid search with RRF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:977:async function hybridSearchEnhanced(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:979:  embedding: Float32Array | number[] | null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:982:  const execution = await collectAndFuseHybridResults(query, embedding, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:991:  return hybridSearch(query, embedding, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:996:  embedding: Float32Array | number[] | null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1010:    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1016:    // every fallback tier. useGraph=false also disables the dependent degree lane.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1053:    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1054:    let ftsChannelResults: HybridSearchResult[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1055:    let bm25ChannelResults: HybridSearchResult[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1056:    const vectorEmbeddingCache = new Map<number, Float32Array>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1062:    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1064:        const vectorResults = vectorSearchFn(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1072:        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1075:          source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1077:        for (const result of semanticResults) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1079:          const embeddingCandidate = toEmbeddingBufferView(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1080:            (result as Record<string, unknown>).embedding
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1081:            ?? (result as Record<string, unknown>).embeddingBuffer
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1083:          if (embeddingCandidate) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1084:            vectorEmbeddingCache.set(result.id, embeddingCandidate);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1087:        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1089:        // Non-critical — vector channel failure does not block pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1090:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1094:    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1095:    if (activeChannels.has('fts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1096:      ftsChannelResults = ftsSearch(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1097:      if (ftsChannelResults.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1099:        // flooding top-K with noisy lexical matches despite its exact-match value.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1100:        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1104:    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1105:    if (activeChannels.has('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1106:      bm25ChannelResults = bm25Search(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1107:      if (bm25ChannelResults.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1108:        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1110:        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1133:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1177:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1181:    // Merge keyword results after all channels complete
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1182:    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1183:      ...ftsChannelResults,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1184:      ...bm25ChannelResults,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1195:        vectorEmbeddingCache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1222:    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1227:      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1228:    const { semanticWeight, keywordWeight, graphWeight: adaptiveGraphWeight } = fusionWeights;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1229:    const keywordFusionResults = keywordResults.map((result) => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1231:      source: 'keyword',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1234:      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1236:        if (list.source === 'vector') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1237:          return { ...list, weight: semanticWeight };
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1245:    if (keywordFusionResults.length > 0 && keywordWeight > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1247:        source: 'keyword',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1248:        results: keywordFusionResults,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1249:        weight: keywordWeight,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1273:      vectorEmbeddingCache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1278:    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1296:    vectorEmbeddingCache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1337:      console.error('[hybrid-search] MPAB error (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1360:      fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1375:    console.warn('[hybrid-search] channel enforcement failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1382:  const degradationMeta = shadowMeta._degradation;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1384:  // C138/T316: MMR reranking with request-scoped embedding cache.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1385:  // Reuse embeddings already returned by the vector channel when present and
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1390:  // Preserve cross-encoder gate semantics: when SPECKIT_CROSS_ENCODER=false, skip reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1405:        const embeddingMap = new Map<number, Float32Array>(vectorEmbeddingCache);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1406:        const missingIds = numericIds.filter((id) => !embeddingMap.has(id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1411:            `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1412:          ) as Database.Statement).all(...missingIds) as Array<{ rowid: number; embedding: Buffer }>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1415:            if (Buffer.isBuffer(row.embedding)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1416:              embeddingMap.set(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1418:                new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1426:          const emb = embeddingMap.get(r.id as number);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1431:              embedding: emb,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1441:          // rows that have embeddings. Non-embedded rows (lexical-only hits,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1459:              source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1469:        console.warn(`[hybrid-search] MMR embedding retrieval failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1491:            if ('rrfScore' in result) (result as Record<string, unknown>).rrfScore = boostedScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1501:      console.warn('[hybrid-search] co-activation enrichment failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1555:      console.warn('[hybrid-search] confidence truncation failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1575:          ...(degradationMeta !== undefined ? { degradation: degradationMeta } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1623:      queryId: `hybrid-${Date.now()}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1675: * Collect pipeline candidates through the adaptive fallback chain, returning
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1680: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1686:  embedding: Float32Array | number[] | null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1691:    embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1710:  if (allowedChannels.has('fts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1711:    const ftsFallback = collectCandidatesFromLists(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1712:      [{ source: 'fts', results: ftsSearch(query, options) }],
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1715:    if (ftsFallback.length > 0) return ftsFallback;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1718:  if (allowedChannels.has('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1719:    const bm25Fallback = collectCandidatesFromLists(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1720:      [{ source: 'bm25', results: bm25Search(query, options) }],
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1723:    if (bm25Fallback.length > 0) return bm25Fallback;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1726:  console.warn('[hybrid-search] Raw candidate collection returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1731: * Search with automatic fallback chain.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1733: * fallback (searchWithFallbackTiered). Otherwise: C138-P0 two-pass adaptive
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1734: * fallback — primary at minSimilarity=30, retry at 17.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1737: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1743:  embedding: Float32Array | number[] | null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1746:  // PI-A2: Delegate to tiered fallback when flag is enabled
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1748:    return searchWithFallbackTiered(query, embedding, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1751:  // Primary 30 filters noise; fallback 17 widens recall for sparse corpora
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1753:  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1754:  // The naive hybridSearch that merges raw scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1757:    embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1771:  if (allowedChannels.has('fts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1772:    const ftsResults = ftsSearch(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1773:    if (ftsResults.length > 0) return ftsResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1777:  if (allowedChannels.has('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1778:    const bm25Results = bm25Search(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1779:    if (bm25Results.length > 0) return bm25Results;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1782:  console.warn('[hybrid-search] All search methods returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1791: * requiring embeddings or text similarity. Pure SQL fallback.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1800:    console.warn('[hybrid-search] db not initialized — returning empty structuralSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1855:    console.warn(`[hybrid-search] Structural search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2013: * Keep Tier 3 structural fallback scores below established Tier 1/2 confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2014: * Prevents structural placeholders from outranking stronger semantic/lexical hits.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2101: * PI-A2: Quality-aware 3-tier search fallback chain.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2103: * TIER 1: hybridSearchEnhanced at minSimilarity=30
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2106: * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2115: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2117: * @returns Results with _degradation metadata attached as non-enumerable property.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2121:  embedding: Float32Array | number[] | null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2124:  const degradationEvents: DegradationEvent[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2125:  const { stages } = await executeFallbackPlan(query, embedding, options, 'tiered');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2135:    // Tier 1 passed quality thresholds — attach empty degradation metadata
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2136:    Object.defineProperty(finalTier1, '_degradation', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2137:      value: degradationEvents,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2147:  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2151:  degradationEvents.push({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2163:    Object.defineProperty(finalTier2, '_degradation', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2164:      value: degradationEvents,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2174:  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2179:  degradationEvents.push({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2190:  Object.defineProperty(finalResults, '_degradation', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2191:    value: degradationEvents,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2204:/** Maximum characters for a summary fallback when a single result overflows the budget. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2282:    'combined_lexical_score',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2317: * Create a summary fallback for a single result whose content exceeds the token budget.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2390:      `[hybrid-search] Token budget overflow (single-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2427:      `[hybrid-search] Token budget overflow (top-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2444:    `[hybrid-search] Token budget overflow: ${totalTokens} tokens > ${effectiveBudget} budget, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2467:  bm25Search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2472:  ftsSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2473:  hybridSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2474:  hybridSearchEnhanced,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2489:  // PI-A2: Tiered fallback exports
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-types.ts:5: * Function signature for graph-based lexical search helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/ops/README.md:44:| `job-queue.ts` | SQLite-backed ingestion job queue with a finite state machine (`queued` > `parsing` > `embedding` > `indexing` > `complete`/`failed`/`cancelled`). Enforces valid state transitions, tracks per-file progress against the original submitted path list and caps stored errors at 50. Crash recovery resets incomplete jobs to `queued` on startup. |
.opencode/skill/system-spec-kit/mcp_server/lib/ops/README.md:55:- Reindex parity: watcher- and ingest-driven reindex paths use the normal synchronous embedding cache-miss path; they do not force deferred embeddings unless async mode was explicitly requested or provider generation fails.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:4:// Split from vector-index-store.ts — contains ALL schema creation,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:15:import { initEmbeddingCache } from '../cache/embedding-cache.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:18:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:125:    embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:172:  const tableSql = getTableSql(database, 'embedding_cache');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:181:  if (!hasTable(database, 'embedding_cache')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:190:  logger.info('Migrating embedding_cache primary key to include dimensions');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:192:    ALTER TABLE embedding_cache RENAME TO embedding_cache_legacy_dimensions;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:196:    INSERT OR REPLACE INTO embedding_cache (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:199:      embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:207:      embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:211:    FROM embedding_cache_legacy_dimensions
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:213:  database.exec('DROP TABLE embedding_cache_legacy_dimensions');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:288:  fallback: string,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:295:  return fallback;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:408:// Added 'partial' embedding_status for deferred indexing (REQ-031, T096)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:426:/** Current schema version for vector-index migrations. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:519:              'procedural', 'semantic', 'autobiographical', 'meta-cognitive'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:542:              'frontmatter_explicit', 'importance_tier', 'file_path', 'keywords', 'default', 'manual'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:581:      // V6 -> v7: Add 'partial' embedding_status for deferred indexing (REQ-031, T096)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:584:          CREATE INDEX IF NOT EXISTS idx_embedding_pending
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:585:          ON memory_index(embedding_status)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:586:          WHERE embedding_status IN ('pending', 'partial', 'retry')
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:588:        logger.info('Migration v7: Created idx_embedding_pending partial index');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:590:        console.warn('[VectorIndex] Migration v7 warning (idx_embedding_pending):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:595:          CREATE INDEX IF NOT EXISTS idx_fts_fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:596:          ON memory_index(spec_folder, embedding_status, importance_tier)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:597:          WHERE embedding_status IN ('pending', 'partial')
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:599:        logger.info('Migration v7: Created idx_fts_fallback index for deferred indexing');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:601:        console.warn('[VectorIndex] Migration v7 warning (idx_fts_fallback):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:747:        database.exec('DROP TRIGGER IF EXISTS memory_fts_insert');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:748:        database.exec('DROP TRIGGER IF EXISTS memory_fts_update');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:749:        database.exec('DROP TRIGGER IF EXISTS memory_fts_delete');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:751:        database.exec('DROP TABLE IF EXISTS memory_fts');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:753:          CREATE VIRTUAL TABLE memory_fts USING fts5(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:760:          CREATE TRIGGER memory_fts_insert AFTER INSERT ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:761:            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:766:          CREATE TRIGGER memory_fts_update AFTER UPDATE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:767:            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:769:            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:774:          CREATE TRIGGER memory_fts_delete AFTER DELETE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:775:            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:823:          database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1011:            summary_embedding BLOB,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1136:       ON memory_index(embedding_status, id)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1137:       WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1572:      warnings.push('memory_history table missing; historical replay functionality may be degraded.');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1688:      console.warn('[vector-index] Migration: Added confidence column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1700:      console.warn('[vector-index] Migration: Added validation_count column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1712:      console.warn('[vector-index] Migration: Added importance_tier column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1721:      console.warn('[vector-index] Migration: Created idx_importance_tier index');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1732:      console.warn('[vector-index] Migration: Added context_type column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1744:      console.warn('[vector-index] Migration: Added content_hash column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1756:      console.warn('[vector-index] Migration: Added channel column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1768:      console.warn('[vector-index] Migration: Added session_id column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1780:      console.warn('[vector-index] Migration: Added base_importance column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1792:      console.warn('[vector-index] Migration: Added decay_half_life_days column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1804:      console.warn('[vector-index] Migration: Added is_pinned column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1816:      console.warn('[vector-index] Migration: Added last_accessed column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1828:      console.warn('[vector-index] Migration: Added expires_at column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1840:      console.warn('[vector-index] Migration: Added related_memories column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1852:      console.warn('[vector-index] Migration: Added stability column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1864:      console.warn('[vector-index] Migration: Added difficulty column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1876:      console.warn('[vector-index] Migration: Added last_review column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1888:      console.warn('[vector-index] Migration: Added review_count column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1910:      console.warn('[vector-index] Migration: Added canonical_file_path column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1929:    console.warn('[vector-index] Canonical path index warning:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1996: * Creates common indexes used by vector-index queries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2005:    console.warn('[vector-index] Failed to create index', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2022:    console.warn('[vector-index] Failed to create canonical path indexes', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2039:    console.warn('[vector-index] Failed to create index', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2050:    console.warn('[vector-index] Failed to create index', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2061:    console.warn('[vector-index] Failed to create index', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2071:      ON memory_index(embedding_status, id)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2072:      WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2079:    console.warn('[vector-index] Failed to create idx_trigger_cache_source', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2090:    console.warn('[vector-index] Failed to create idx_spec_folder_created_at', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2103:      console.warn('[vector-index] Failed to create idx_history_timestamp:', get_error_message(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2259: * Creates or upgrades the vector-index schema.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2266:  options: { sqlite_vec_available: boolean; get_embedding_dim: () => number }
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2268:  const { sqlite_vec_available, get_embedding_dim } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2291:    // the rollout (REQ-S2-001) — embedding cache table must exist before any
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2310:      embedding_model TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2311:      embedding_generated_at TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2312:      embedding_status TEXT DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2363:    const embedding_dim = get_embedding_dim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2366:        embedding FLOAT[${embedding_dim}]
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2377:      INSERT OR REPLACE INTO vec_metadata (key, value) VALUES ('embedding_dim', ?)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2378:    `).run(String(embedding_dim));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2379:    logger.info(`Created vec_memories table with dimension ${embedding_dim}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2384:    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2392:    CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2393:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2399:    CREATE TRIGGER IF NOT EXISTS memory_fts_update AFTER UPDATE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2400:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2402:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2408:    CREATE TRIGGER IF NOT EXISTS memory_fts_delete AFTER DELETE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2409:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2420:  // the rollout (REQ-S2-001) — create embedding_cache table
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2428:    CREATE INDEX idx_embedding_status ON memory_index(embedding_status);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2429:    CREATE INDEX idx_retry_eligible ON memory_index(embedding_status, retry_count, last_retry_at)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2440:      ON memory_index(embedding_status, id)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2441:      WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2457:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2479:  console.warn('[vector-index] Schema created successfully');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:22:- **CocoIndex** (semantic, external MCP): finds relevant code by concept
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:11:} from '../search/vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:95:  'semantic_divergence',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:387: * Context types that should never decay under the hybrid decay policy.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:408: * REQ-D4-002: Check whether the hybrid decay policy feature flag is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:417: * REQ-D4-002: Classify a memory's decay behaviour under the hybrid policy.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:440: * REQ-D4-002: Apply the hybrid decay policy to a stability value.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cleanup-helpers.ts:1:import { get_error_message } from '../search/vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:9:// Module returns a positional fallback (scored 0–0.5) and marks
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:10:// Results with scoringMethod:'fallback' so callers can distinguish
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:17:// Local cross-encoder model.  The positional fallback is NOT a
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:94:   *   'fallback'      — synthetic positional score (0–0.5) when no provider is available
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:96:  scoringMethod: 'cross-encoder' | 'fallback';
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:144:// Positional fallback scores instead.
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:400:    // No reranker available — P3-16: use 'fallback' scoringMethod and distinct score range
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:407:      scoringMethod: 'fallback' as const,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:412:  // Consecutively, skip the API call and return positional fallback.
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:419:      provider: 'fallback',
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:420:      scoringMethod: 'fallback' as const,
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:485:      provider: 'fallback',
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:486:      scoringMethod: 'fallback' as const,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:10:      "expectedResultDescription": "Memory or spec covering search-weights.json and the MAX_TRIGGERS_PER_MEMORY constant in vector-index-impl.ts. Should surface the T000c audit or related sprint-0 documentation.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:40:      "expectedResultDescription": "Decision records from hybrid-rag-fusion spec (spec 139) about fusion strategy selection. Should surface rationale for RRF over linear weighted sum.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:50:      "expectedResultDescription": "Should surface adaptive-fusion.ts (FEATURE_FLAG constant, isFeatureEnabled check), search-flags.ts, and rollout-policy.ts. Tests understanding the opt-out semantics.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:51:      "notes": "Bug-intent query matching a specific flag. Tests whether bug-type queries get boosted keyword weighting for technical terms."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:91:      "notes": "Bug-intent query with specific symptom. Tests whether bug-type queries get boosted keyword weighting for technical terms."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:115:      "query": "which spec documents were added during the hybrid RAG fusion sprint",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:120:      "expectedResultDescription": "Should surface memories in spec folder system-spec-kit/022-hybrid-rag-fusion (89 memories) and 140-hybrid-rag-fusion-refinement. Lists spec documents created in those sprints.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:135:      "query": "smartRanking config weights in search-weights.json are inconsistent with the code fallback values",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:140:      "expectedResultDescription": "Should surface T000c audit document which explicitly documents the relevanceWeight 0.2 vs 0.5 discrepancy, plus vector-index-impl.ts lines 2802-2804.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:280:      "expectedResultDescription": "Deep investigation query. Should surface adaptive-fusion.ts, hybrid-search.ts, rrf-fusion.ts, and related spec memories spanning the search stack.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:295:      "query": "list all memories in the hybrid RAG fusion spec folder",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:300:      "expectedResultDescription": "Spec-scoped browse. Should surface memory titles and tiers from spec folder system-spec-kit/022-hybrid-rag-fusion or 140-hybrid-rag-fusion-refinement.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:370:      "expectedResultDescription": "Should surface bm25-index.ts isBm25Enabled() function and any documentation about the BM25 feature flag.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:375:      "query": "how does multi-query expansion work in deep mode retrieval",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:381:      "notes": "From T007b §1 step 3: multi-query expansion is specific to deep mode — cross-document query."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:455:      "query": "how does RRF fusion combine vector and BM25 channel scores",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:460:      "expectedResultDescription": "Should surface rrf-fusion.ts, adaptive-fusion.ts channel weights, and the T000a baseline note about graphHitRate=0.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:595:      "query": "vector index embedding generation pipeline",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:600:      "expectedResultDescription": "Should surface vector-index.ts, embeddings.ts, and any spec memories about embedding model selection or the indexing pipeline.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:601:      "notes": "Trigger-phrase-style query about the vector indexing subsystem."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:610:      "expectedResultDescription": "Should surface rrf-fusion.ts, adaptive-fusion.ts, and spec memories about channel weight configuration.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:611:      "notes": "Derived from \"reciprocal rank fusion\" trigger phrase in the hybrid search documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:660:      "expectedResultDescription": "Should surface bm25-index.ts tokenize() and simpleStem() functions and any spec documentation about the text normalization approach.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:751:      "notes": "Vague natural language query — tests whether broad semantic retrieval surfaces the right subsystems."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:765:      "query": "why did the team choose SQLite over a dedicated vector database for memory storage",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:770:      "expectedResultDescription": "Should surface decision records or spec memories explaining the choice of SQLite + FTS5 + custom vector storage over alternatives like Pinecone or Chroma.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:855:      "query": "I want to add telemetry tracking to the hybrid search pipeline",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:880:      "expectedResultDescription": "Should surface the vector-store.ts interface, eval-db.ts, and the decision record about choosing SQLite. May surface the architecture layer definitions.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:905:      "query": "show me the checklist for the sprint 0 hybrid RAG fusion refinement",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:915:      "query": "is there a research document for the hybrid RAG fusion approach",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:920:      "expectedResultDescription": "Should surface research/research.md from the 139-hybrid-rag-fusion or 140-hybrid-rag-fusion-refinement spec folder if it exists.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:955:      "query": "can the trigger matching and vector search be unified into a single query path",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:960:      "expectedResultDescription": "Should surface trigger-matcher.ts, vector-index.ts, hybrid-search.ts, and any architectural decision about keeping the two paths separate.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1065:      "query": "machine learning model training pipeline for embedding fine-tuning",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1071:      "notes": "Hard negative — \"embedding\" exists but \"training pipeline\" context is completely absent."
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:16: * and extracted keywords for lightweight matching.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:21:  keywords: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:339: * Extract significant keywords from a description string.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:346: * @param description - A description string to extract keywords from.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:347: * @returns Deduplicated array of significant lowercase keywords.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:358:  const keywords: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:366:    keywords.push(cleaned);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:369:  return keywords;
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:378: * simple keyword-overlap scoring.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:383: *   in its keywords or description (case-insensitive)
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:387: * This is a lightweight pre-filter, NOT a replacement for vector search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:413:    const keywordSet = new Set(folder.keywords);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:416:      // Keywords set lookup is O(1); description substring is fallback for partial matches
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:417:      if (keywordSet.has(term)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:475:      // Cases still aggregate through spec.md fallback so discovery retains a useful label.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:484:            keywords: perFolder.keywords,
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:492:      // Missing files still use pure spec.md fallback to avoid surprising backfill writes.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:500:          /* Best-effort repair — fallback extraction below remains authoritative */
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:520:            keywords: perFolder.keywords,
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:593:  const keywords = extractKeywords(description);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:602:    keywords,
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:659:  const keywords = extractKeywords(description);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:681:    keywords,
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:693: * Returns null if missing, corrupt, or structurally invalid (graceful degradation).
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:707:    // Validate ALL PerFolderDescription fields — type mismatch triggers spec.md fallback.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:715:      !Array.isArray(parsed.keywords) ||
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:716:      !parsed.keywords.every((e: unknown) => typeof e === 'string') ||
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:723:      return null; // Structurally invalid — triggers spec.md fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:946:    // Never throw — return null for graceful degradation
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:977:    // CHK-PI-B3-004: Never throw — graceful degradation
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:18:// Follow same env-var precedence as main DB (vector-index-impl.ts)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:72:    fusion_method TEXT DEFAULT 'rrf',
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:399:    // Do NOT touch memory_fts or any FTS5 table (Safeguard #1).
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:9:  to_embedding_buffer,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:13:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:20:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:38:} from './vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:46:  update_embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:56:} from './vector-index-mutations.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:63:  vector_search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:70:  generate_query_embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:71:  keyword_search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:72:  vector_search_enriched,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:74:  multi_concept_keyword_search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:88:  vectorSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:96:  keywordSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:97:  vectorSearchEnriched,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:108:} from './vector-index-queries.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:126:} from './vector-index-aliases.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:151:  get_embedding_dim,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:152:  get_confirmed_embedding_dimension,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:153:  validate_embedding_dimension,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:154:  is_vector_search_available,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:161:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:165:  isVectorSearchAvailable as is_vector_search_available_alias,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:166:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:12:// - Channel toggle mechanism (vector, bm25, fts5, graph, trigger)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:52:export type AblationChannel = 'vector' | 'bm25' | 'fts5' | 'graph' | 'trigger';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:56:  'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:57:  'bm25',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:58:  'fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:746:    // With production run IDs (same pattern as bm25-baseline.ts).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:995: * expected by the hybridSearch / hybridSearchEnhanced functions.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:1004:    useVector: !disabledChannels.has('vector'),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:1005:    useBm25: !disabledChannels.has('bm25'),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:1006:    useFts: !disabledChannels.has('fts5'),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:108:  // The production memory_fts index using multi-strategy FTS5 search.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:7:// Search path (disabling vector, graph, and trigger channels)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:11:// Keyword search achieves without any semantic, graph, or trigger
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:75:  bm25MRR: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:85:  hybridMRR?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:86:  /** BM25/hybrid ratio (relative mode only). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:92: * Mirrors the shape used in hybrid-search.ts so callers can reuse the same
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:100:  /** Source channel identifier. Expected: 'bm25' or 'fts'. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:118: * using ONLY the BM25/FTS5 channel (vector, graph, trigger disabled).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:119: * For production use, wire up the FTS5 path from hybrid-search with all
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:136: *     BM25 alone is very strong — semantic/graph additions may not
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:141: *     BM25 is moderate — semantic/graph channels must demonstrably
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:147: *     retrieval. Proceed with hybrid search implementation.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:149: * @param bm25MRR - The measured MRR@5 value (must be in [0, 1]).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:152:export function evaluateContingency(bm25MRR: number): ContingencyDecision {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:153:  if (bm25MRR >= 0.80) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:155:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:160:        'BM25 alone is very strong — semantic/graph additions may not justify complexity. ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:162:        'additional retrieval channels. Consider whether the marginal gain from vector/graph ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:167:  if (bm25MRR >= 0.50) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:169:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:174:        'BM25 is moderate — semantic/graph channels should demonstrably improve over this baseline. ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:175:        'Each additional channel (vector, graph, trigger) must show a statistically meaningful ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:181:    bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:187:      'The low keyword-only baseline confirms that semantic and graph augmentation ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:188:      'adds meaningful value. Proceed with hybrid search implementation.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:194:   Compares BM25 MRR@5 as a percentage of hybrid MRR@5.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:195:   Spec: "BM25 >= 80% of hybrid MRR@5" → PAUSE.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:199: * Evaluate BM25 performance relative to hybrid MRR@5 (spec-compliant).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:202: *   ratio = bm25MRR / hybridMRR
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:205: *     BM25 achieves ≥80% of hybrid — multi-channel adds little value.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:208: *     BM25 achieves 50-79% of hybrid — channels need per-channel evidence.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:211: *     BM25 achieves <50% of hybrid — multi-channel clearly justified.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:213: * @param bm25MRR   - BM25-only MRR@5 (must be in [0, 1]).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:214: * @param hybridMRR - Hybrid/multi-channel MRR@5 (must be in (0, 1]).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:218:  bm25MRR: number,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:219:  hybridMRR: number,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:221:  if (!Number.isFinite(bm25MRR) || !Number.isFinite(hybridMRR) || hybridMRR <= 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:223:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:224:      hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:231:        'Defaulting to PROCEED until hybrid baseline is established.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:235:  const ratio = bm25MRR / hybridMRR;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:239:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:240:      hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:246:        `BM25 achieves ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:247:        `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:248:        'The multi-channel architecture adds marginal value over keyword search alone. ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:255:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:256:      hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:262:        `BM25 achieves ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:263:        `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:270:    bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:271:    hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:277:      `BM25 achieves only ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:278:      `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:279:      'Multi-channel retrieval provides substantial improvement over keyword search. ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:280:      'Proceed with hybrid search optimization.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:419: * Channel is recorded as 'bm25' to distinguish from multi-channel runs.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:438:  const channel = 'bm25';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:453:      'bm25_contingency_decision',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:454:      result.contingencyDecision.bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:474: * the BM25/FTS5 path ONLY — vector, graph, and trigger channels must be
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:478: * deterministic results (see tests/bm25-baseline.vitest.ts).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:529:    // Run BM25-only search (channels: bm25/fts only, no vector/graph/trigger)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:247:        ? 'live_fallback'
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:5:// RERANKER_LOCAL and gracefully degrades to unchanged ordering on any
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:277:     * remote/fallback behavior for non-opted-in environments.
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:330:    console.warn(`[local-reranker] fallback to original ordering: ${toErrorMessage(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:4:// Phase B T018: Community-level search as fallback channel.
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:7:// searches community summaries by keyword matching and returns
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:29:  source: 'community_fallback';
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:91: * Search community summaries by keyword matching.
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:94: * score. Used as a fallback channel when primary search returns weak results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:109:    source: 'community_fallback',
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:171:      source: 'community_fallback',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:5:// Split from vector-index-store.ts — contains ALL query/search functions,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:14:import * as embeddingsProvider from '../providers/embeddings.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:18:  to_embedding_buffer,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:21:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:24:  get_embedding_dim,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:32:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:33:import { delete_memory_from_database } from './vector-index-mutations.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:39:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:60: * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:113: * Gets memory counts grouped by embedding status.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:114: * @returns The counts for each embedding status.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:120:    SELECT m.embedding_status, COUNT(*) as count
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:123:    GROUP BY m.embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:128:  for (const row of rows as Array<{ embedding_status: keyof typeof counts; count: number }>) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:129:    if (row.embedding_status in counts) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:130:      counts[row.embedding_status] = row.count;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:158: * Searches indexed memories by vector similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:159: * @param query_embedding - The query embedding to search with.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:162: * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:165: * const rows = vector_search(queryEmbedding, { limit: 5, specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:168:export function vector_search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:169:  query_embedding: EmbeddingInput,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:175:    console.warn('[vector-index] Vector search unavailable - sqlite-vec not loaded');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:190:  // M9 FIX: Validate embedding dimension before querying
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:191:  const expected_dim = get_embedding_dim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:192:  if (!query_embedding || query_embedding.length !== expected_dim) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:194:      `Invalid embedding dimension: expected ${expected_dim}, got ${query_embedding?.length}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:199:  const query_buffer = to_embedding_buffer(query_embedding);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:202:  // ADR-004: FSRS-preferred decay with half-life fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:221:  const where_clauses = ['m.embedding_status = \'success\''];
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:263:      SELECT m.*, vec_distance_cosine(v.embedding, ?) as distance,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:309: * Searches indexed memories with multiple concept embeddings.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:310: * @param concept_embeddings - The concept embeddings to search with.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:313: * @throws {VectorIndexError} When concept count or embedding dimensions are invalid, or when store initialization fails.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:320:  concept_embeddings: EmbeddingInput[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:325:    console.warn('[vector-index] Multi-concept search unavailable - sqlite-vec not loaded');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:331:  const concepts = concept_embeddings;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:336:  const expected_dim = get_embedding_dim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:340:        `Invalid embedding dimension: expected ${expected_dim}, got ${emb?.length}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:348:  const concept_buffers = concepts.map(c => to_embedding_buffer(c));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:352:    `vec_distance_cosine(v.embedding, ?) as dist_${i}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:356:    `vec_distance_cosine(v.embedding, ?) <= ?`
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:380:      WHERE m.embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:505:    console.warn('[vector-index] extract_tags: invalid content type, expected string');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:557:        console.warn('[vector-index-queries] Date parsing failed', { error: _e instanceof Error ? _e.message : String(_e) });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:586: * Generates an embedding for a search query.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:588: * @returns A promise that resolves to the embedding, if generated.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:590:export async function generate_query_embedding(query: string): Promise<Float32Array | null> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:592:    console.warn('[vector-index] Empty query provided for embedding');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:597:    const embeddings = embeddingsProvider;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:598:    const embedding = await embeddings.generateQueryEmbedding(query.trim());
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:599:    return embedding;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:601:    console.warn(`[vector-index] Query embedding failed: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:611: * Searches indexed memories using keyword matching.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:616:export function keyword_search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:624:    console.warn('[vector-index] keyword_search: invalid query, expected non-empty string');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:630:    console.warn('[vector-index] keyword_search: no valid search terms after tokenization');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:677:    return { ...row, keyword_score: score };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:681:    .filter((row: MemoryRow) => Number(row.keyword_score ?? 0) > 0)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:682:    .sort((a: MemoryRow, b: MemoryRow) => Number(b.keyword_score ?? 0) - Number(a.keyword_score ?? 0))
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:697: * Runs enriched vector search for a text query.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:702: * @throws {VectorIndexError} Propagates vector-store initialization failures from the underlying search pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:705: * const results = await vector_search_enriched('sqlite vec mismatch', 10, { specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:708:export async function vector_search_enriched(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:717:  const query_embedding = await generate_query_embedding(query);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:720:  let search_method = 'vector';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:723:  if (query_embedding && sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:724:    raw_results = vector_search(query_embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:730:    console.warn('[vector-index] Falling back to keyword search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:731:    search_method = 'keyword';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:732:    raw_results = keyword_search(query, { limit, specFolder }, database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:747:    const similarity = search_method === 'vector'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:749:      : Math.min(100, (row.keyword_score || 0) * 20);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:769:    console.warn(`[vector-index] Enriched search took ${elapsed}ms (target <500ms)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:781: * @param concepts - The concept queries or embeddings.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:785: * @throws {VectorIndexError} When concept validation fails or the vector search pipeline cannot execute.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:788: * const results = await multi_concept_search_enriched(['sqlite', 'vector'], 10, { specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:804:  const concept_embeddings: EmbeddingInput[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:807:      const embedding = await generate_query_embedding(concept);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:808:      if (!embedding) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:809:        console.warn(`[vector-index] Failed to embed concept: "${concept}"`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:810:        return await multi_concept_keyword_search(concepts.filter(c => typeof c === 'string'), limit, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:812:      concept_embeddings.push(embedding);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:814:      concept_embeddings.push(concept);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:820:    console.warn('[vector-index] Falling back to keyword multi-concept search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:821:    return await multi_concept_keyword_search(concepts.filter(c => typeof c === 'string'), limit, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:824:  const raw_results = multi_concept_search(concept_embeddings, { limit, specFolder, minSimilarity });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:855:    console.warn(`[vector-index] Multi-concept search took ${elapsed}ms (target <500ms)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:862: * Runs keyword search for multiple concepts.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:868:export async function multi_concept_keyword_search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:876:    console.warn('[vector-index] multi_concept_keyword_search: empty concepts array');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:881:    keyword_search(concept, { limit: 100, specFolder })
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:920:      avgSimilarity: Math.min(100, (row.keyword_score || 1) * 15),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:921:      conceptSimilarities: concepts.map(() => row.keyword_score || 1),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:930:      searchMethod: 'keyword',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:945:    console.warn('[vector-index] parse_quoted_terms: invalid query, expected non-empty string');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1084:    console.warn(`[vector-index] Failed to get related memories for ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1185:    console.warn(`[vector-index] find_cleanup_candidates error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1238:    console.warn(`[vector-index] get_memory_preview query error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1259:    console.warn('[vector-index] get_memory_preview file read warning', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1291: * Verifies vector-index consistency and optional cleanup results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1298:): { totalMemories: number; totalVectors: number; orphanedVectors: number; missingVectors: number; orphanedFiles: Array<{ id: number; file_path: string; reason: string }>; orphanedChunks: number; isConsistent: boolean; cleaned?: { vectors: number; chunks: number } } {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1302:  const find_orphaned_vector_ids = () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1304:      console.warn('[vector-index] find_orphaned_vector_ids: sqlite-vec not available');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1313:      console.warn('[vector-index] Could not query orphaned vectors:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1318:  const orphaned_vector_ids = find_orphaned_vector_ids();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1319:  const orphaned_vectors = orphaned_vector_ids.length;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1321:  let cleaned_vectors = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1322:  if (autoClean && orphaned_vectors > 0 && sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1323:    logger.info(`Auto-cleaning ${orphaned_vectors} orphaned vectors...`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1325:    for (const rowid of orphaned_vector_ids) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1328:        cleaned_vectors++;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1330:        console.warn(`[vector-index] Failed to clean orphaned vector ${rowid}: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1333:    logger.info(`Cleaned ${cleaned_vectors} orphaned vectors`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1338:  const missing_vectors = sqlite_vec
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1341:        WHERE m.embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1347:  const total_vectors = sqlite_vec
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1383:      console.warn('[vector-index] Could not query orphaned chunks:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1409:        console.warn(`[vector-index] Failed to clean orphaned chunk ${chunk.id}: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1419:    totalVectors: total_vectors,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1420:    orphanedVectors: autoClean ? orphaned_vectors - cleaned_vectors : orphaned_vectors,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1421:    missingVectors: missing_vectors,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1424:    isConsistent: (orphaned_vectors - cleaned_vectors) === 0 && missing_vectors === 0 && orphaned_files.length === 0 && effective_orphaned_chunks === 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1425:    cleaned: (autoClean && (cleaned_vectors > 0 || cleaned_chunks > 0))
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1426:      ? { vectors: cleaned_vectors, chunks: cleaned_chunks }
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1437:export { vector_search as vectorSearch };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1444:export { generate_query_embedding as generateQueryEmbedding };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1445:export { keyword_search as keywordSearch };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1446:export { vector_search_enriched as vectorSearchEnriched };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1448:export { multi_concept_keyword_search as multiConceptKeywordSearch };
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:21:/** Maximum graph traversal depth. Beyond 2 hops, signal degrades and queries become expensive. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:23:/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:103:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:232: * Intent priority lists may include upper-case semantic labels (e.g. 'CORRECTION').
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:356: * Resolve the primary numeric score from a result, checking score, rrfScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:361:  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore)) return result.rrfScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:376:    rrfScore: score,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:639:      rrfScore: score,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:728:    // Find seed memory IDs whose titles contain matched concept keywords
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:42:| `bm25-baseline.ts` | BM25-only baseline measurement and baseline metric persistence |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:7:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:8:import type { RankedList, FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:177:      ? fused.reduce((sum, r) => sum + r.rrfScore, 0) / fused.length
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:675:    const fallbackResult: JudgedKSweepResult = {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:680:    return fallbackResult;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:23:  /** Weight for semantic (vector) search component, 0-1 */
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:24:  semanticWeight: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:25:  /** Weight for keyword (BM25) search component, 0-1 */
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:26:  keywordWeight: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:55:    semanticWeight: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:56:    keywordWeight: 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:63:    semanticWeight: 0.6,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:64:    keywordWeight: 0.4,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:71:    semanticWeight: 0.4,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:72:    keywordWeight: 0.6,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:79:    semanticWeight: 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:80:    keywordWeight: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:87:    semanticWeight: 0.6,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:88:    keywordWeight: 0.4,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:95:    semanticWeight: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:96:    keywordWeight: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:103:    semanticWeight: 0.8,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:104:    keywordWeight: 0.2,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:111:    semanticWeight: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:112:    keywordWeight: 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:119:    semanticWeight: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:120:    keywordWeight: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:153: * Query keyword/pattern mapping for artifact class detection from
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:156:const QUERY_PATTERNS: Array<{ keywords: string[]; patterns: RegExp[]; artifactClass: ArtifactClass }> = [
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:159:    keywords: ['checklist', 'checkbox', 'check list', 'verification', 'p0', 'p1', 'p2', 'blocker'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:164:    keywords: ['tasks', 'task list', 'todo', 'to-do', 'work items', 'backlog'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:169:    keywords: ['decision', 'adr', 'decision-record', 'rationale', 'trade-off', 'tradeoff', 'chose', 'alternative'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:174:    keywords: ['implementation-summary', 'implementation summary', 'summary of changes', 'what was implemented', 'config', 'setup', 'env', 'flag', 'setting'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:179:    keywords: ['plan', 'planning', 'approach', 'strategy', 'phases', 'milestones', 'timeline'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:184:    keywords: ['spec', 'specification', 'requirements', 'scope', 'objective', 'constraints'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:189:    keywords: ['research', 'investigation', 'analysis', 'findings', 'study', 'evaluation', 'search', 'retrieval', 'pipeline', 'indexing', 'embedding', 'vector', 'semantic'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:194:    keywords: ['memory', 'context', 'session', 'previous session', 'prior work', 'last time', 'continue', 'resume', 'recover', 'continuation'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:204: * Intent-based fallback mapping for artifact class detection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:205: * Used when keyword/pattern scoring yields zero matches but an
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:277:  for (const { keywords, patterns, artifactClass } of QUERY_PATTERNS) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:281:    for (const keyword of keywords) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:282:      if (lower.includes(keyword)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:300:  // Confidence: normalize score. Max realistic score ~6-8 (3 keywords + 2 patterns).
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:304:  // Intent-based fallback: use module-level INTENT_TO_ARTIFACT map
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:9:// query, embeds it, then uses the pseudo-document embedding as an
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:30:import * as embeddings from '../providers/embeddings.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:31:import * as vectorIndex from './vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:57:/** HyDE result including the pseudo-document and its embedding. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:61:  /** Embedding vector of the pseudo-document (Float32Array). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:62:  embedding: Float32Array;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:69:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:128: *   intentAdjustedScore (not in BaselineResult) → rrfScore → score → similarity/100
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:156:  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:157:    return Math.max(0, Math.min(1, result.rrfScore));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:286: *   3. Embed the pseudo-document via the embeddings provider.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:287: *   4. Cache { pseudoDocument, embedding } with 1-hour TTL.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:293: *   - LLM or embedding call fails
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:316:  // Cache hit — return stored pseudo-document + embedding
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:328:    const embeddingRaw = await embeddings.generateQueryEmbedding(pseudoDocument);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:329:    if (!embeddingRaw) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:334:    const embedding = embeddingRaw instanceof Float32Array
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:335:      ? embeddingRaw
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:336:      : Float32Array.from(embeddingRaw as number[]);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:338:    const result: HyDEResult = { pseudoDocument, embedding };
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:353: * Run a vector-only search using the HyDE pseudo-document embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:361: * @param embedding - The pseudo-document embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:366:export function vectorOnly(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:367:  embedding: Float32Array,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:371:  return vectorIndex.vectorSearch(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:412:    const candidates = vectorOnly(hydeResult.embedding, limit, specFolder);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:93:  /** Channel name: "vector", "bm25", "graph", or "trigger". */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:112:  /** Fusion method used, e.g. "rrf". */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:226:      params.fusionMethod ?? 'rrf',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:40:  /** Human-readable name for this shadow algorithm (e.g. "rrf-v2", "weighted-bm25"). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:15:// Feature catalog: Quality-aware 3-tier search fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:84: * Multi-query expansion for deep-mode retrieval.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:100: * PI-A2: Quality-aware 3-tier search fallback chain.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:176: * R12: Query expansion for embedding-based retrieval.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:197: * Records intent metadata (document, code, structured_data) alongside embeddings.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:259: * Temporal contiguity boost on raw Stage 1 vector results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:589: * Phase B T016: Query concept expansion for hybrid search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:598: * Phase B T017: Graph-expanded fallback on zero/weak results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:650: * Phase B T018: Community-level search as fallback channel.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:661: * Adds retrievalLevel parameter: 'local' (entity), 'global' (community), 'auto' (local + fallback).
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:28:  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:38:    fallback: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:82: * 4. Falls back to file_read_fallback when chunks have missing content
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:99:        fallback: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:126:        contentSource: 'file_read_fallback',
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:148:        fallback: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:185:    let fallback = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:192:        fallback++;
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:193:        return { ...row, chunkCount, contentSource: 'file_read_fallback' as const };
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:205:        fallback++;
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:206:        return { ...row, chunkCount, contentSource: 'file_read_fallback' as const };
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:216:        fallback++;
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:217:        return { ...row, chunkCount, contentSource: 'file_read_fallback' as const };
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:235:        fallback,
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:247:        fallback: parentIds.size,
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:78:  return 'low_confidence'; // fallback — should only be called when recovery is warranted
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173: * Phase B T017: Build graph-expanded fallback query terms on zero/weak results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:200:    // Find memory IDs matching the routed concepts via title keyword search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:237:    // Step 3: Extract short keyword phrases from neighbor titles
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:6:// - vector-index-types.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:7:// - vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:8:// - vector-index-mutations.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:9:// - vector-index-store.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:10:// - vector-index-queries.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:11:// - vector-index-aliases.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:14:export * from './vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:35:  /** Filter to specific channels (e.g. 'vector', 'bm25', 'fts', 'graph', 'trigger'). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:7:// Use inside the hybrid-search pipeline after RRF/RSF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:296: * Compute keyword overlap between goal and content.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:297: * Returns a score between 0 and 1 based on fraction of goal keywords found in content.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:325: * Applies a boost factor of up to GOAL_BOOST_MAX (1.2x) based on keyword overlap.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:5:// Split from vector-index-store.ts — contains ALL mutation functions:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:8:import * as embeddingsProvider from '../providers/embeddings.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:14:import * as bm25Index from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:17:} from './vector-index-aliases.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:20:  to_embedding_buffer,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:23:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:26:  get_embedding_dim,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:31:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:35:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:128:// contract adopts appendOnly and canonicalFilePath semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:132:type IndexMemoryDeferredParams = Omit<IndexMemoryParams, 'embedding'> & {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:140: * Indexes a memory with an embedding payload.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:143: * @throws {VectorIndexError} When embedding validation fails or the mutation cannot be applied.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:149: *   embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:165:    embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:175:  if (!embedding) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:179:  const expected_dim = get_embedding_dim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:180:  if (embedding.length !== expected_dim) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:181:    console.warn(`[vector-index] Embedding dimension mismatch: expected ${expected_dim}, got ${embedding.length}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:183:      `Embedding must be ${expected_dim} dimensions, got ${embedding.length}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:190:  const embedding_buffer = to_embedding_buffer(embedding);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:204:      embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:218:    const embedding_status = sqlite_vec ? 'success' : 'pending';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:223:        importance_weight, created_at, updated_at, embedding_model,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:224:        embedding_generated_at, embedding_status, encoding_intent, document_type, spec_level,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:229:      importanceWeight, now, now, embeddingsProvider.getModelName(), now, embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:242:        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:243:      `).run(row_id, embedding_buffer);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:258: * Indexes a memory record without storing an embedding yet.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:301:            embedding_status = 'pending',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:322:        importance_weight, created_at, updated_at, embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:334:    logger.info(`Deferred indexing: Memory ${Number(row_id)} saved without embedding (BM25/FTS5 searchable)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:343: * Updates stored memory metadata and embeddings.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:346: * @throws {VectorIndexError} When embedding validation fails or the mutation transaction cannot complete.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:349: * const id = update_memory({ id: 42, title: 'Updated title', embedding });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:362:    embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:433:    if (embedding) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:434:      updates.push('embedding_model = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:435:      updates.push('embedding_generated_at = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:436:      // H1 FIX: Set 'pending' until vector write is confirmed
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:437:      updates.push('embedding_status = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:438:      values.push(embeddingsProvider.getModelName(), now, 'pending');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:453:    if (embedding && sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:454:      const expected_dim = get_embedding_dim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:455:      if (embedding.length !== expected_dim) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:456:        console.warn(`[vector-index] Embedding dimension mismatch in update: expected ${expected_dim}, got ${embedding.length}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:458:          `Embedding must be ${expected_dim} dimensions, got ${embedding.length}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:463:      const embedding_buffer = to_embedding_buffer(embedding);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:466:        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:467:      `).run(BigInt(id), embedding_buffer);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:468:      // H1 FIX: Mark success only after vector write confirmed
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:469:      database.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('success', id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:551:      if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:552:        bm25Index.getIndex().removeDocument(String(id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:651:            console.warn(`[VectorIndex] Failed to delete vector for memory ${id}: ${get_error_message(vec_error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:672:        console.warn(`[vector-index] Failed to delete memory ${id}: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:699:        if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:700:          const bm25 = bm25Index.getIndex();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:702:            bm25.removeDocument(String(id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:710:    console.warn(`[vector-index] delete_memories transaction error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:720: * Updates the embedding status for a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:722: * @param status - The new embedding status.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:725:export function update_embedding_status(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:732:    console.warn(`[vector-index] Invalid embedding status: ${status}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:739:      SET embedding_status = ?, updated_at = datetime('now')
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:745:    console.warn(`[vector-index] Failed to update embedding status for ${id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:762:    console.warn(`[vector-index] Invalid confidence value: ${confidence}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:775:    console.warn(`[vector-index] Failed to update confidence for ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:787:export { update_embedding_status as updateEmbeddingStatus };
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:6:// Extracted from hybrid-search.ts ftsSearch() for independent
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:9:import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:18:  fts_score: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:28:type LexicalPath = 'fts5' | 'like' | 'unavailable';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:33:  | 'no_such_module_fts5'
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:34:  | 'bm25_runtime_failure';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:37:  lexicalPath: LexicalPath;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:38:  fallbackState: FallbackState;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:84:  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:89:  return message.includes('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:101:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:102:        fallbackState: 'compile_probe_miss',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:107:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:108:      fallbackState: 'compile_probe_miss',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:114:      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:119:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:120:        fallbackState: 'missing_table',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:126:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:127:        fallbackState: 'no_such_module_fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:131:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:132:      fallbackState: 'missing_table',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:137:    lexicalPath: 'fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:138:    fallbackState: 'ok',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:147: * Execute a weighted BM25 FTS5 search against memory_fts.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:149: * Uses SQLite FTS5's built-in bm25() ranking function with
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:159: * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:162:function fts5Bm25Search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:170:  const tokens = normalizeLexicalQueryTokens(query).fts;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:197:    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:198:    FROM memory_fts
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:199:    JOIN memory_index m ON m.id = memory_fts.rowid
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:200:    WHERE memory_fts MATCH ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:204:    ORDER BY fts_score DESC
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:210:  if (capability.fallbackState !== 'ok') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:211:    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:223:      fts_score: (row.fts_score as number) || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:226:      lexicalPath: 'fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:227:      fallbackState: 'ok',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:234:          lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:235:          fallbackState: 'no_such_module_fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:239:            lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:240:            fallbackState: 'bm25_runtime_failure',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:242:        : msg.toLowerCase().includes('no such table: memory_fts')
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:244:              lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:245:              fallbackState: 'missing_table',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:248:              lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:249:              fallbackState: 'bm25_runtime_failure',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:252:    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:258: * Check if the memory_fts FTS5 virtual table exists in the database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:260: * Used as a feature-detect before calling fts5Bm25Search, since FTS5
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:264: * @returns true if memory_fts exists and is queryable
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:268: *   fts5Bm25Search(db, 'memory');
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:273:  return probeFts5Capability(db).fallbackState === 'ok';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:282:  fts5Bm25Search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:4:// SCHEMA_VERSION is now canonical in vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:8:/** Supported embedding input shapes for vector search and mutation operations. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:11:/** Stable error codes emitted by vector-index modules. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:23:/** Structured error used by vector-index query, mutation, and store helpers. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:47:  embedding_model?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:48:  embedding_generated_at?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:49:  embedding_status?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:71:  keywordScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:75:/** Represents a vector-search memory row shared by query and store helpers. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:88:  keyword_score?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:107:  embedding: EmbeddingInput;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:123:  embedding?: EmbeddingInput;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:132:/** Controls vector search filtering and ranking behavior. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:168: * Converts an embedding vector into a binary buffer for sqlite-vec storage.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:169: * @param embedding - The embedding values to serialize.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:170: * @returns A binary buffer representing the embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:172:export function to_embedding_buffer(embedding: EmbeddingInput): Buffer {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:173:  if (embedding instanceof Float32Array) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:174:    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:176:  return Buffer.from(new Float32Array(embedding).buffer);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:232:// ValidateEmbeddingDimension are exported from vector-index-store.ts (canonical)
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:9:// Seeds are retrieved via a lightweight keyword-only search using
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:10:// BM25/FTS5 (no embedding call) to ground the LLM prompt in real
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:24:import { fts5Bm25Search } from './sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:91: * Uses FTS5 / BM25 keyword search only — no embedding call — to keep
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:110:    const rawResults = fts5Bm25Search(db, query, { limit });
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:186: * If neither is set, the function returns null (caller handles graceful fallback).
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:330:   *   7. Return result (or fallback identity on any failure).
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:359:    const fallback: ReformulationResult = { abstract: q, variants: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:362:      return fallback;
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:376:        `[llm-reformulation] llm.rewrite failed, returning fallback: ${msg}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:380:    return fallback;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:406: * Compute keyword overlap score between a query and a target string.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:414:function keywordOverlap(queryTokens: string[], target: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:435: *   - Question match (best keyword overlap across surrogateQuestions): weight 0.4
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:436: *   - Summary match (keyword overlap): weight 0.2
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:437: *   - Heading match (best keyword overlap across headings): weight 0.1
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:463:    const overlap = keywordOverlap(queryTokens, alias);
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:475:    const overlap = keywordOverlap(queryTokens, question);
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:490:    summaryScore = keywordOverlap(queryTokens, surrogates.summary);
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:499:    const overlap = keywordOverlap(queryTokens, heading);
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:537:  keywordOverlap,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:8:// Contiguity to raw vector-channel hits before later pipeline stages.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:12://   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:14://   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:16://   - hybrid: collectRawCandidates → falls back to vector on failure
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:17://   - vector: Direct vectorSearch
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:28://     - candidates contains raw channel scores; vector hits may include an
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:33://     - Generates query embeddings via the embeddings provider (external call)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:34://     - Reads from the vector index and FTS5 / BM25 index (DB reads only)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:38:import * as vectorIndex from '../vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:39:import * as embeddings from '../../providers/embeddings.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:40:import * as hybridSearch from '../hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:41:import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:44:import { expandQueryWithEmbeddings, isExpansionActive } from '../embedding-expansion.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:79:/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:82:/** Number of similar memories to mine for R12 embedding-based query expansion terms. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:245:  const fallbackScores: Record<string, number> = {};
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:247:    fallbackScores[source] = resolvedScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:249:  return fallbackScores;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:354: * rule-based expansion is skipped — consistent with the R12 embedding-expansion
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:459: * and `config.mode`, then applies vector-channel temporal contiguity when
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:472:  // Fix #16: Cache embedding at function scope for reuse in constitutional injection
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508:  // the query for the hybrid search channel, improving recall for alias-rich
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:509:  // queries (e.g. "semantic search" → also searches "retrieval", "query", etc.).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:513:  /** Effective query for hybrid search — may be expanded by concept routing. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:516:  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:581:    // Generate one embedding per concept
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:584:      const emb = await embeddings.generateQueryEmbedding(concept);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:587:          `[stage1-candidate-gen] Failed to generate embedding for concept: "${concept}"`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:594:    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:602:  // -- Channel: Hybrid (with optional deep-mode query expansion) ---------------
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:604:  else if (searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:605:    // Resolve the query embedding — either pre-computed in config or generate now
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:606:    // Fix #16 — Cache this embedding for reuse in constitutional injection path
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:609:      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:613:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616:    // Deep mode: expand query into variants and run hybrid for each, then dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:621:      // sub-query facets and run hybrid search per facet. Results are merged
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:654:            // Run hybrid for the original query plus each facet, in parallel
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:661:                  const facetEmbedding = await embeddings.generateQueryEmbedding(q);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:663:                    console.warn('[stage1-candidate-gen] D2 facet embedding generation returned null');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:666:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:724:                const variantEmbedding = await embeddings.generateQueryEmbedding(variant);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:726:                  console.warn('[stage1-candidate-gen] Deep variant embedding generation returned null');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:729:                const variantResults = await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:738:            'Deep-mode query expansion',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:759:            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:761:          // Fall through to single hybrid search below
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:763:          candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:770:        // ExpandQuery returned only the original; treat as standard hybrid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:772:        candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:781:      // -- R12: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:784:      // We expand the query using embedding similarity to find related terms
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:811:              hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:822:              embeddings.generateQueryEmbedding(expanded.combinedQuery).then(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:825:                    console.warn('[stage1-candidate-gen] Expanded query embedding generation returned null');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:828:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:855:                channel: 'r12-embedding-expansion',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:864:            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:869:      // Standard hybrid search — runs when R12 is off, suppressed by R15,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:875:          const hybridResults = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:880:          candidates = hybridResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:881:        } catch (hybridErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:882:          const hybridMsg =
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:883:            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:885:            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:888:          // Fallback: pure vector search
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:890:          let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:899:            vectorResults = (
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:900:              vectorSearchWithContiguity(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:901:                vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:904:            ) ?? vectorResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:906:          candidates = vectorResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:909:            addTraceEntry(trace, 'fallback', 0, candidates.length, 0, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:910:              reason: hybridMsg,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:911:              channel: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:921:  else if (searchType === 'vector') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:923:      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:926:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for vector search query');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:930:    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:939:      vectorResults = (
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:940:        vectorSearchWithContiguity(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:941:          vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:944:      ) ?? vectorResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:946:    candidates = vectorResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:953:      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:961:  // Exception: for hybrid search, tier/contextType are applied here because
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:963:  // For vector search, tier/contextType were already passed to vectorSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1011:  // In the current candidate set, fetch them separately via vector search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1026:      // Fix #16 — Reuse cached embedding instead of generating a new one
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1028:        cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1031:        const constitutionalResults = vectorIndex.vectorSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1048:        // via vector search bypass the earlier governance/context gate.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1080:  //   1. Retrieve top-3 seed results via fast BM25/FTS5 (no embedding call).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1082:  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1088:  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1096:          cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1103:              // Reuse cached embedding for original query (idx 0); generate fresh for variants
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1104:              const emb = idx === 0 ? reformEmbedding : await embeddings.generateQueryEmbedding(q);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1106:                console.warn('[stage1-candidate-gen] LLM reform embedding generation returned null');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1109:              return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1169:  //   - Run a vector-only search with the pseudo-document embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1176:  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1216:  // Met (>5000 indexed), run a parallel search on summary embeddings and merge
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1217:  // Results. Pattern follows R12 embedding expansion: run in parallel, merge
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1224:          queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1279:                  channel: 'r8-summary-embeddings',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1335:              // raw row.score. For vector-only rows with only `similarity`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1337:              // Using the canonical fallback chain prevents overwriting
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1345:                rrfScore: boostedScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1391:  // P1 fix: activeChannels counts actual retrieval channels (vector, keyword/BM25),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1392:  // while channelCount counts parallel query variants. In hybrid mode both vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1393:  // and keyword channels are always active regardless of query variant count.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1394:  const activeChannels = searchType === 'hybrid' ? 2 : 1;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:8:// Stages 2-4 fall back to previous stage output with degraded metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:12:// Input:  PipelineConfig (query, embedding, limits, flags, intent, session)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:18://     - When a stage degrades, metadata.degraded = true and timing tracks each stage
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:60:  let degraded = false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:62:  // -- Stage 1: Candidate Generation (MANDATORY — no fallback possible) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:97:    degraded = true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:129:    degraded = true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:138:          fallback: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:163:    degraded = true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:190:      degraded: degraded || undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:5:// Semantic query expansion using embedding similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:11:// Rather than semantic broadening.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:20:import * as vectorIndex from './vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:30: * Result produced by embedding-based query expansion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:33: * - `expanded`      — Array of semantically related terms extracted from
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:65:/** Number of semantically similar memories to mine for expansion terms. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:74:/** Stop-words that carry no semantic signal for expansion. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:156: * Expand a query using embedding-based similarity to find semantically
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:163: *      retrieval; broadening them degrades precision without recall gain.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:164: *   3. Embedding vector is invalid (zero-length or non-finite values).
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:168: *   a. Run a vector similarity search using the provided embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:174: * @param embedding - Pre-computed query embedding (Float32Array from the
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:175: *                    embeddings provider). Must not be empty.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:183:  embedding: Float32Array,
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:201:  // -- Guard 3: Valid embedding -----------------------------------------------
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:202:  if (!embedding || embedding.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:203:    console.warn('[embedding-expansion] Received empty embedding — skipping expansion');
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:212:    // Use the query embedding to find semantically similar memories.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:215:    const similarMemories = vectorIndex.vectorSearch(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:267:    // FTS and embedding re-encoding without requiring a separator token.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:277:    console.warn(`[embedding-expansion] Expansion failed, using original query: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:287: * Synchronous predicate that returns true when R12 embedding expansion
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:298: * @returns True when embedding expansion should be applied.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:19:  keywords: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:131: * T016: Lightweight deterministic embedding centroid classifier.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:133: * The model uses hashed bag-of-words embeddings so centroids can be built
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:193:/** P3-12: Minimum confidence threshold below which "general" style fallback is used */
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:212: * Score a query against an intent's keyword list, returning normalized score and matched keywords.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:216: * @returns Object with normalized score and array of matched keywords
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:220:  const keywords = INTENT_KEYWORDS[intent];
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:224:  for (const keyword of keywords) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:225:    if (lower.includes(keyword)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:227:      matches.push(keyword);
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:231:  // P3-12: Require at least 2 keyword matches for a meaningful keyword score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:232:  // A single generic keyword match produces a heavily discounted score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:237:  // Normalize by keyword count
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:239:    score: keywords.length > 0 ? score / keywords.length : 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:279: * Compute a deterministic normalized embedding for text.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:282: * @returns Normalized Float32Array embedding vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:295: * Build one centroid vector per intent from seed phrases and keywords.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:297: * @returns Map of intent types to their centroid embedding vectors
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:332: * L2-normalize a vector in place.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:334: * @param vec - Float32Array vector to normalize
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:335: * @returns The same vector, normalized to unit length
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:351: * Dot product similarity for normalized vectors.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:353: * @param a - First vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:354: * @param b - Second vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:355: * @returns Dot product (cosine similarity for unit vectors)
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:367: * Score query-to-intent using centroid embeddings.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:399: * Classify a query string into one of 7 intent types with confidence and keyword evidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:402: * @returns Intent result with type, confidence, per-intent scores, and matched keywords
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:410:      keywords: [],
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:428:    const { score: keywordScore, matches } = calculateKeywordScore(query, intent);
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:432:    let combined = (centroidScore * 0.5) + (keywordScore * 0.35) + (patternScore * 0.15);
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:468:  // This prevents weak single-keyword matches from dominating classification.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:474:      keywords: [...new Set(allKeywords)],
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:483:    keywords: [...new Set(allKeywords)],
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:492: * @returns Intent result with type, confidence, scores, and keywords
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:16:   * Higher = better lexical match. Not directly comparable to vector similarity
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:42:const BM25_ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'experimental', 'fallback']);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:51: * These weights are consumed by the FTS5 path in sqlite-fts.ts,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:55: * trigger_phrases:  5.0 — curated keywords next most important
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:323:    const queryTokens = normalizeLexicalQueryTokens(query).bm25;
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:415:      console.warn(`[bm25-index] Failed to sync BM25 rows: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:465:      console.warn(`[bm25-index] Failed to schedule BM25 warmup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:530: * @returns Sanitized query tokens safe to reuse for lexical search paths.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:533: * sanitizeQueryTokens('title:memory AND vector');
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:534: * // ['title', 'memory', 'vector']
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:561:  fts: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:562:  bm25: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:573:    fts: [...sharedTokens, ...phraseToken],
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:574:    bm25: sharedTokens
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:18:  confidence: 'high' | 'medium' | 'low' | 'fallback';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:25:/** Common English stop words for semantic complexity heuristic */
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:135: * graduated), all queries classify as "complex" (safe fallback — full pipeline).
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:137: * On any error, returns "complex" (safe fallback per spec).
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:147:  // Safe fallback for any unexpected state
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:151:    confidence: 'fallback',
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:160:    // Edge case: empty or whitespace-only queries → complex fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:11://     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:29:// 4.  Intent weights          — non-hybrid search post-scoring adjustment
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:38:// Therefore ONLY applied for non-hybrid search types (vector,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:39:// Multi-concept). Applying it to hybrid results would double-count.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:192:        console.warn(`[stage2-fusion] learned stage2 model at ${modelPath} is invalid; shadow scoring will use manual-only fallback`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:263: * from types.ts. The shared function uses the correct fallback chain:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:264: * intentAdjustedScore → rrfScore → score → similarity/100, all clamped to [0,1].
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:275:    rrfScore: clamped,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:288:    row.rrfScore = clamped;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:592: * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:594: * during fusion. Calling this on hybrid results would double-count intent.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:654: * current composite score (`score`, then `rrfScore`, then `similarity`).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:930: *   1.  Session boost      (hybrid only — working memory attention)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:932: *   2.  Causal boost       (hybrid only — graph-traversal amplification)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:937: *   4.  Intent weights     (non-hybrid only — G2 prevention)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:972:  // the same row objects, creating a race condition if the orchestrator's timeout fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:975:  const isHybrid = config.searchType === 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:978:  // Only for hybrid search type — session attention signals are most meaningful
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:979:  // When the full hybrid result set is available for ordering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:988:      // so rrfScore/intentAdjustedScore are not stale for subsequent steps.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1000:  // Uses computeRecencyScore (already imported but previously unused in hybrid path).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1031:  // Only for hybrid search type — causal graph traversal is seeded from the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1057:  // Appear in the co-activation graph. Matches V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1210:  // G2 PREVENTION: Only apply for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1266:          rrfScore: row.rrfScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:5:// Split from vector-index-store.ts — contains LRUCache, query caching,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:13:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:17:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:19:  vector_search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:20:  vector_search_enriched,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:23:  generate_query_embedding,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:24:} from './vector-index-queries.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:199:// Cached version of vector_search_enriched with LRU cache
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:219:  const results = await vector_search_enriched(query, limit, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:276:    console.warn(`[vector-index] learn_from_selection query error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:318:    console.warn(`[vector-index] learn_from_selection update error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:340:    const embedding = await generate_query_embedding(content.substring(0, 1000));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:341:    if (!embedding) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:342:      console.warn(`[vector-index] Could not generate embedding for memory ${new_memory_id}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:346:    const similar = vector_search(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:365:    console.warn(`[vector-index] Failed to link related memories for ${new_memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:389:    console.warn(`[vector-index] Failed to record access for memory ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:415:  const results = await vector_search_enriched(query, fetch_limit, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:429:    console.warn(`[vector-index] Enhanced search took ${elapsed}ms (target <600ms)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:7:import { sanitizeFTS5Query } from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:61:let ftsTableAvailabilityPerDb = new WeakMap<Database.Database, boolean>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:70:  const cached = ftsTableAvailabilityPerDb.get(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:77:      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:80:    ftsTableAvailabilityPerDb.set(database, available);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:83:    ftsTableAvailabilityPerDb.set(database, false);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:91: * Uses FTS5 full-text search (memory_fts table) instead of naive LIKE matching.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:111:    // Hierarchy-aware fallback/augmentation for spec-scoped retrieval.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:150: * FTS5-backed causal edge query. Finds memory IDs via the memory_fts
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:165:  // 1) Materialize matched memory rowids once (no OR join against memory_fts)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:167:  // 3) Collapse duplicate edge hits in SQL (MAX fts_score per edge)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:172:        -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:173:      FROM memory_fts
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:174:      WHERE memory_fts MATCH ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:175:      ORDER BY fts_score DESC
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:179:      SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength, mm.fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:183:      SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength, mm.fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:194:        MAX(fts_score) AS fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:198:    SELECT id, source_id, target_id, relation, strength, fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:200:    ORDER BY (strength * fts_score) DESC
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:206:  ) as Array<CausalEdgeRow & { fts_score: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:209:  // Numeric IDs matching memory_index.id (INTEGER column) in the hybrid search
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:216:    const ftsScore = typeof row.fts_score === 'number' && Number.isFinite(row.fts_score)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:217:      ? row.fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:219:    const score = edgeStrength * ftsScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:228:        ftsScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:243:        ftsScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:256: * Legacy LIKE-based fallback when FTS5 table is unavailable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:634:  ftsTableAvailabilityPerDb = new WeakMap<Database.Database, boolean>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:640:  ftsTableAvailabilityPerDb.delete(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:17://     "summary": "Ranked first because semantic, reranker, decision-anchor agreed",
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:18://     "topSignals": ["semantic_match", "anchor:decisions"],
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:19://     "channelContribution": { "vector": 0.44, "fts": 0.12, "graph": 0.06 }
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:32:  | 'semantic_match'
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:33:  | 'lexical_match'
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:45:  vector: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:46:  fts: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:95:    signals.push('semantic_match');
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:103:  if (channelAttribution.includes('fts') || channelAttribution.includes('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:104:    signals.push('lexical_match');
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:173: * Prioritises: semantic/lexical first, then boosts, then meta.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:204:    if (signal === 'semantic_match') return 'semantic similarity';
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:205:    if (signal === 'lexical_match') return 'keyword match';
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:232: * distribute the effective score across vector, fts, and graph channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:240:  const vectorScore = typeof row.vectorScore === 'number' && Number.isFinite(row.vectorScore)
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:241:    ? Math.max(0, Math.min(1, row.vectorScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:243:  const ftsScore = typeof row.ftsScore === 'number' && Number.isFinite(row.ftsScore)
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:244:    ? Math.max(0, Math.min(1, row.ftsScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:254:  if (vectorScore !== null && ftsScore !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:258:      vector: Math.round(vectorScore * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:259:      fts: Math.round(ftsScore * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:268:  const hasFTS = channelAttribution.includes('fts') || channelAttribution.includes('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:275:      vector: Math.round(remaining * 0.75 * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:276:      fts: Math.round(remaining * 0.25 * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:283:      vector: Math.round(effectiveScore * 0.78 * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:284:      fts: Math.round(effectiveScore * 0.22 * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:292:      vector: Math.round((effectiveScore - graphShare) * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:293:      fts: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:298:  // Vector-only fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:299:  return { vector: Math.round(effectiveScore * 100) / 100, fts: 0, graph: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:15:// Structured IDs follow the pattern: TYPE-keywords-NNN
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:39:   * The semantic type extracted from the anchor ID.
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:40:   * For structured IDs (TYPE-keywords-NNN) this is the leading segment in
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:69: * Derive the semantic type from an anchor ID.
.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts:4:// Feature catalog: Stage 3 effectiveScore fallback chain
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:21://     - contentSource is set to 'reassembled_chunks' or 'file_read_fallback'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:68:function resolveRerankOutputScore(raw: unknown, fallback: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:72:  return floorScore(fallback);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:100:  fallback: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:116:type RerankProvider = 'cross-encoder' | 'local-gguf' | 'fallback-sort' | 'none';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:167:  // Gated behind SPECKIT_MMR feature flag. Retrieves embeddings from
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:169:  // The result set, matching the V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:180:          `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:181:        ) as Database.Statement).all(...numericIds) as Array<{ rowid: number; embedding: Buffer }>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:183:        const embeddingMap = new Map<number, Float32Array>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:185:          if (Buffer.isBuffer(row.embedding)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:186:            embeddingMap.set(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:188:              new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:195:          const emb = embeddingMap.get(r.id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:199:              // Use effectiveScore() for consistent fallback chain
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:201:              embedding: emb,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:213:          // FIX #5: MMR can only diversify rows that have embeddings. Non-embedded
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:214:          // rows (lexical-only hits, graph injections) must be preserved and merged
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:269:        fallback: chunkStats.fallback,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:298: * results unmodified (graceful degradation).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:357:          rrfScore: rerankScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:373:  // P1-015: Use effectiveScore() for consistent fallback chain
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:394:      (result) => result.scoringMethod === 'fallback'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:396:      ? 'fallback-sort'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:421:        rrfScore: rerankScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:429:    // Graceful degradation — return original results on any reranker failure
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:485:    fallback: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:577: * and rrfScore before raw score/similarity, matching Stage 2's
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:596: *   `contentSource: 'file_read_fallback'`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:623:      // Parent not found in DB — use best chunk as fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:624:      stats.fallback++;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:649:      rrfScore: parentScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:666:      `[stage3-rerank] MPAB DB reassembly failed for parent ${parentId}: ${toErrorMessage(err)} — using chunk fallback`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:668:    stats.fallback++;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:674: * Mark a pipeline row as a chunk-content fallback.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:679: * @returns A new PipelineRow annotated as a fallback parent representation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:691:    contentSource: 'file_read_fallback',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:693:    rrfScore: parentScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:9:   Common English words that carry no semantic signal.
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:40:   Generic programming keywords that appear in nearly all code.
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:26: * Compute cosine similarity between two vectors.
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:83: * Generate summary, compute embedding, store in memory_summaries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:87: * 3. Call embeddingFn(summary) to get embedding
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:89: * 5. Store embedding as Buffer (Float32Array -> Buffer)
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:95: * @param embeddingFn - Async function to compute embedding vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:102:  embeddingFn: (text: string) => Promise<Float32Array | null>
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:115:    const embedding = await embeddingFn(summary);
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:116:    const embeddingBlob = embedding ? float32ToBuffer(embedding) : null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:122:        (memory_id, summary_text, summary_embedding, key_sentences, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:130:      embeddingBlob,
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:148: * Vector search on summary embeddings — parallel channel for stage1.
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:150: * 1. SELECT id, memory_id, summary_embedding FROM memory_summaries
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:151: *    WHERE summary_embedding IS NOT NULL
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:152: * 2. Compute cosine similarity between query embedding and each summary embedding
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:157: * @param queryEmbedding - Query vector to compare against stored summaries
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:171:      SELECT id, memory_id, summary_embedding
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:173:      WHERE summary_embedding IS NOT NULL
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:175:    `).all(fetchCap) as Array<{ id: number; memory_id: number; summary_embedding: Buffer }>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:180:      const storedEmbedding = bufferToFloat32(row.summary_embedding);
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:195:      '[memory-summaries] Failed to query summary embeddings:',
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:215:      WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:38:  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:42:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:55: * Shared score resolution function — canonical fallback chain for deriving the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:60: * separate implementations with different fallback orders and clamping. This shared
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:61: * function uses the correct chain: intentAdjustedScore → rrfScore → score → similarity/100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:67:  if (typeof row.rrfScore === 'number' && Number.isFinite(row.rrfScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:68:    return Math.max(0, Math.min(1, row.rrfScore));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:82:  'similarity' | 'score' | 'importance_weight' | 'rrfScore' | 'intentAdjustedScore' | 'attentionScore'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:105:  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:122:  searchType: 'hybrid' | 'vector' | 'multi-concept';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:191: * Executes search channels (FTS5, semantic, trigger, graph, co-activation)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:206:    /** Actual retrieval channels active (vector=1, hybrid=2). Unlike channelCount which tracks query variants. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:280:      fallback: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:334:    /** B1: True when one or more stages fell back to degraded output. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:335:    degraded?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:371:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:385:    rrfScore: r.rrfScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:419:    if (row.rrfScore !== snap.rrfScore) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:421:        `[Stage4Invariant] Score mutation detected: id=${snap.id} rrfScore changed from ${snap.rrfScore} to ${row.rrfScore}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:16://     - No score field (similarity, score, rrfScore, intentAdjustedScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:207: * A1 FIX: Previously used a different precedence order (rrfScore first) and
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:306:  // Enforce caller's limit after all filtering to prevent degraded paths exceeding requested count
.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:113: * or a leading imperative keyword followed by a noun phrase or condition.
.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:145: *   - the condition clause introduced by a condition keyword (conditionClause)
.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:155:  // Find the earliest imperative keyword present in this line
.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:179:      // Clause starts after the condition keyword
.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:198: *    imperative keywords (must, always, never, should, …).
.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:207: * @param title   - Title of the memory (used as fallback source label).
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:16:// Fields (score, rrfScore, similarity, intentAdjustedScore). It only
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:129:  // Partial signal: content mentions validation-related keywords.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:236:  // -- 4. Importance tier signal (even without quality score fallback above) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:6:// TypeScript port of the vector index implementation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:23:import { getStartupEmbeddingDimension } from '@spec-kit/shared/embeddings/factory';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:26:import { IVectorStore } from '../interfaces/vector-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:35:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:39:} from './vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:46:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:82:/** Loaded search weight configuration for vector-index ranking (lazy-loaded). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:100:let _cached_queries: Awaited<typeof import('./vector-index-queries.js')> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:101:let _cached_mutations: Awaited<typeof import('./vector-index-mutations.js')> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:102:let _cached_aliases: Awaited<typeof import('./vector-index-aliases.js')> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:105:  return _cached_queries ??= await import('./vector-index-queries.js');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:109:  return _cached_mutations ??= await import('./vector-index-mutations.js');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:113:  return _cached_aliases ??= await import('./vector-index-aliases.js');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:120:/** Default embedding dimension used by the vector index. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:124: * Gets the active embedding dimension for the current provider.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:125: * @returns The embedding dimension.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:127:export function get_embedding_dim(): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:132: * Waits for the embedding provider to report a stable dimension.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:134: * @returns A promise that resolves to the confirmed embedding dimension.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:136:export async function get_confirmed_embedding_dimension(timeout_ms = 5000): Promise<number> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:139:    const dim = get_embedding_dim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:145:  console.warn('[vector-index] Using default dimension 768 after timeout');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:164:function get_existing_embedding_dimension(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:186:      SELECT value FROM vec_metadata WHERE key = 'embedding_dim'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:222:    reason: 'No stored vector dimension found for existing schema',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:226:function validate_embedding_dimension_for_connection(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:235:    const current_dim = get_embedding_dim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:236:    const existing = get_existing_embedding_dimension(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:248:      const warning = `EMBEDDING DIMENSION MISMATCH: Existing database stores ${existing.stored_dim}-dim vectors (${source_label}), ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:249:        `but the active embedding configuration resolves to ${current_dim}. Refusing to bootstrap because vector search would fail. ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:252:      console.error(`[vector-index] WARNING: ${warning}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:258:    console.warn('[vector-index] Dimension validation error:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:259:    return { valid: true, stored: null, current: get_embedding_dim(), reason: get_error_message(e) };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:264: * Validates that stored vector dimensions match the provider.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:267:export function validate_embedding_dimension(): { valid: boolean; stored: number | null; current: number | null; reason?: string; warning?: string } {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:268:  return validate_embedding_dimension_for_connection(db, sqlite_vec_available_flag);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:280:/** Default path for the vector-index database file. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:327:      console.warn(`[vector-index] Could not read file ${valid_path}: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:337: * @param default_value - The fallback value to return on failure.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:338: * @returns The parsed JSON value or the fallback.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:360:        console.warn('[vector-index] Blocked potential prototype pollution in JSON');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:367:    console.warn(`[vector-index] JSON parse error: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:413:        console.warn(`[vector-index] Database connection listener failed: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:425:    console.warn(`[vector-index] Could not set permissions on ${target_path}: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:499:    console.warn('[vector-index] Cache validation error:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:564:        SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as complete,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:565:        SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:566:        SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:636:        AND m.embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:728:    console.warn(`[vector-index] interference score refresh failed for '${specFolder}': ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:737: * Initializes the vector-index database connection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:773:      console.error('[vector-index] FATAL: better-sqlite3 native module failed to load');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:774:      console.error(`[vector-index] ${errMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:775:      console.error(`[vector-index] Running: Node ${process.version} (MODULE_VERSION ${process.versions.modules})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:780:          console.error(`[vector-index] Marker recorded: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:785:      console.error('[vector-index] This usually means Node.js was updated without rebuilding native modules.');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:786:      console.error('[vector-index] Fix: Run \'bash scripts/setup/rebuild-native-modules.sh\' from the spec-kit root');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:787:      console.error('[vector-index] Or manually: npm rebuild better-sqlite3');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:797:    console.warn(`[vector-index] sqlite-vec extension not available: ${get_error_message(vec_error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:798:    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:799:    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:810:  const preBootstrapDimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:814:    console.error(`[vector-index] FATAL: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:819:  create_schema(new_db, { sqlite_vec_available: vec_available, get_embedding_dim });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:822:  const dimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:825:    console.error(`[vector-index] FATAL: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:843: * Closes the shared vector-index database connection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:860: * Gets the active vector-index database path.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:868: * Gets the shared vector-index database connection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:875:// Check if vector search is available (sqlite-vec loaded)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:877: * Reports whether sqlite-vec vector search is available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:878: * @returns True when vector search is available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:880:export function is_vector_search_available(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:888:/** Implements the vector-store interface on top of SQLite. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:911:   * Searches indexed memories by embedding similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:912:   * @param embedding - The query embedding to search with.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:916:   * @throws {VectorIndexError} When the embedding dimension is invalid or the store cannot initialize.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:922:  async search(embedding: EmbeddingInput, topK: number, options: VectorSearchOptions = {}): Promise<MemoryRow[]> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:926:    const expected_dim = get_embedding_dim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:927:    if (!embedding || embedding.length !== expected_dim) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:929:        `Invalid embedding dimension: expected ${expected_dim}, got ${embedding?.length}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:945:    const { vector_search } = await getQueriesModule();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:946:    return vector_search(embedding, search_options, database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:950:   * Inserts or updates a memory row and its embedding metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:952:   * @param embedding - The embedding to persist.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:955:   * @throws {VectorIndexError} When embedding validation fails or required metadata is missing.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:958:   * const id = await store.upsert('ignored', embedding, { spec_folder: 'specs/001-demo', file_path: 'spec.md' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:961:  async upsert(_id: string, embedding: EmbeddingInput, metadata: JsonObject): Promise<number> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:965:    const expected_dim = get_embedding_dim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:966:    if (!embedding || embedding.length !== expected_dim) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:968:        `Embedding dimension mismatch: expected ${expected_dim}, got ${embedding?.length}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:994:      embedding: embedding
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1054:    return get_embedding_dim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1079:    embedding: string,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1084:    const { vector_search_enriched } = await getQueriesModule();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1085:    return vector_search_enriched(embedding, undefined, options, database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1088:  async enhancedSearch(embedding: string, options: EnhancedSearchOptions = {}): Promise<EnrichedSearchResult[]> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1092:    return enhanced_search(embedding, undefined, options, database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1114:    cleaned?: { vectors: number; chunks: number };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1132:export { get_confirmed_embedding_dimension as getConfirmedEmbeddingDimension };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1133:export { get_embedding_dim as getEmbeddingDim };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1134:export { validate_embedding_dimension as validateEmbeddingDimension };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1137:export { is_vector_search_available as isVectorSearchAvailable };
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:46:| `stage1-candidate-gen.ts` | Stage 1: Candidate Generation. Runs search channels (hybrid, vector, multi-concept), applies deep-mode query expansion (R6), embedding-based expansion (R12), summary embeddings (R8), constitutional memory injection, quality threshold filtering and tier/contextType filtering. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:47:| `stage2-fusion.ts` | Stage 2: Fusion + Signal Integration. The single authoritative scoring point. Applies 9 signal steps in fixed order: session boost, causal boost, co-activation spreading, community co-retrieval, graph signals, FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals, artifact limiting, anchor metadata and validation metadata scoring. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:78:- Channels: hybrid (with optional deep-mode expansion), vector, multi-concept.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:79:- Optional R12 embedding expansion and R8 summary embedding channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:86:- G2 prevention: intent weights are applied only for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:106:2. **G2 Double-Weighting Guard.** Intent weights are applied only for non-hybrid search types. Hybrid search incorporates intent weighting during RRF/RSF fusion internally.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:108:4. **Score Resolution Consistency.** All stages use the shared `resolveEffectiveScore()` function from `types.ts` with fallback chain: `intentAdjustedScore` > `rrfScore` > `score` > `similarity/100`, clamped to [0, 1].
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:114:- `mcp_server/lib/search/` - Parent search directory containing hybrid search, vector index, cross-encoder and other search modules consumed by the pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:7:// Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:75: * Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:102:  'embedding': 'embedding',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:103:  'embeddings': 'embedding',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:104:  'vector': 'embedding',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:105:  'vectors': 'embedding',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:106:  'representation': 'embedding',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:142:  'semantic': 'search',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:143:  'semantics': 'search',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:171: * nounPhrases('How does vector search indexing work?');
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:172: * // ['vector', 'search', 'indexing', 'work']
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:374: * alias table to collect related search terms for query expansion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:593:        // Keep canonical fallback even when aliases are malformed.
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:743: * Resolve S5 density threshold from env var with safe fallback.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:14://   - Graceful fallback: any error returns only the original query
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:206: * The "score" used for tie-breaking is resolved from `score`, `rrfScore`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:212:export function mergeByFacetCoverage<T extends { id: number; score?: number; rrfScore?: number; similarity?: number }>(
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:263: * Resolve a numeric score from a result item using the pipeline's fallback chain.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:266:function resolveItemScore(item: { score?: number; rrfScore?: number; similarity?: number }): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:269:  if (typeof item.rrfScore === 'number' && Number.isFinite(item.rrfScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:270:    return Math.max(0, Math.min(1, item.rrfScore));
.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts:9:// Stored in the `encoding_intent` column alongside the embedding
.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts:59:  // Import/require/export statements and programming keywords
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:16:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:124:  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:125:    return result.rrfScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:174:          rrfScore: finalScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:34:  /** Whether the dynamic flag was active (false = default fallback used). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:3:description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:6:  - "hybrid search"
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:7:  - "vector search"
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:12:> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:27:- [FTS CAPABILITY CASCADE FLOOR](#fts-capability-cascade-floor)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:39:The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:42:- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:45:- **Query Enhancement**: Fuzzy matching (Levenshtein) + acronym expansions (via hybrid-search.ts inline logic)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:75:`vector-index.ts` is the primary typed export surface for the vector index and re-exports the split schema, query, mutation, store and alias modules. `vector-index-impl.ts` is now a 14-line backward-compatibility shim that simply re-exports `vector-index.ts` for older import paths.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:93:| Vector | `vector-index.ts` | Semantic similarity via sqlite-vec through the split vector-index modules |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:94:| BM25 | `bm25-index.ts` | Pure TypeScript keyword matching |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:95:| FTS5 | `sqlite-fts.ts` | SQLite FTS5 BM25 weighted scoring |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:109:6. Intent weights — non-hybrid only (G2 double-weighting prevention: `isHybrid` boolean guard)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:116:Cross-encoder reranking (optional, min 2 results) followed by MPAB chunk-to-memory aggregation. Aggregation formula: `parentScore = sMax + 0.3 * Sum(rest) / sqrt(N)` where `sMax` is the best chunk score and N is the remaining chunk count. Chunk ordering preserves `chunk_index` document order (B2 guarantee). `contentSource` metadata marks provenance (`reassembled_chunks` or `file_read_fallback`).
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:134:- Resilient to retrieval method failures (graceful degradation)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:172:<a id="fts-capability-cascade-floor"></a>
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:177:- `lexicalPath`: the lane that actually ran for lexical retrieval. Current packet-owned values are `fts5` and `unavailable`. The wider response schema also allows `like`, but packet `010` does not claim that lane for this runtime seam.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:178:- `fallbackState`: the truthful FTS capability outcome for the request.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:180:The forced-degrade matrix is:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:182:| `fallbackState` | Meaning | `lexicalPath` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:184:| `ok` | FTS5 compile probe passed, `memory_fts` exists, and BM25 ranking executed normally | `fts5` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:185:| `compile_probe_miss` | `PRAGMA compile_options` does not report FTS5 support, so lexical work cannot run for this request | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:186:| `missing_table` | FTS5 support is present, but `memory_fts` is missing at runtime | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:187:| `no_such_module_fts5` | The SQLite engine rejects FTS5 usage with `no such module: fts5` | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:188:| `bm25_runtime_failure` | The FTS5 table exists, but the `bm25(...)` ranking call fails at runtime | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:190:The contract is intentionally narrow: preserve result-shape semantics, surface truthful lane metadata, and let later packets build on that truth instead of inferring capability from empty results or warning logs.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:246:| **TypeScript**       | `hybrid-search.ts`, `cross-encoder.ts`, `intent-classifier.ts`, `bm25-index.ts`             |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:247:| **TypeScript**       | `vector-index.ts` (typed export surface) + `vector-index-impl.ts` (14-line compatibility shim) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:248:| **TypeScript**       | `reranker.ts` (local reranking utility); `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts` relocated to `shared/algorithms/` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:253:### Facade Pattern: vector-index
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:259:vector-index.ts          (166 LOC)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:262:    - vector-index-types.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:263:    - vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:264:    - vector-index-mutations.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:265:    - vector-index-queries.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:266:    - vector-index-store.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:267:    - vector-index-aliases.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:270:vector-index-impl.ts     (14 LOC)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:272:  - Re-exports from './vector-index'
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:276:**NOTE**: Most vector-index logic now lives in the split `vector-index-*` modules. `vector-index-impl.ts` is only a compatibility adapter, so runtime changes should be made in `vector-index.ts` or the underlying split modules.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:282:| `vector-index.ts`          | 166    | TypeScript | Typed export surface re-exporting the split vector-index modules |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:283:| `vector-index-impl.ts`     | 14     | TypeScript | Backward-compatibility shim that re-exports `vector-index.ts` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:284:| `vector-index-types.ts`    | -      | TypeScript | Shared type definitions for vector index modules    |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:285:| `vector-index-schema.ts`   | -      | TypeScript | Schema creation and migration logic                 |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:286:| `vector-index-mutations.ts`| -      | TypeScript | Insert, update, and delete operations for vector index |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:287:| `vector-index-queries.ts`  | -      | TypeScript | Query builders and search operations for vector index |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:288:| `vector-index-aliases.ts`  | -      | TypeScript | Re-export aliases for backward-compatible imports   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:289:| `vector-index-store.ts`    | -      | TypeScript | Low-level storage operations and reconsolidation helpers |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:290:| `hybrid-search.ts`         | ~900   | TypeScript | Orchestrates vector/FTS/BM25/graph/degree fusion via adaptive RRF |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:292:| `local-reranker.ts`        | -      | TypeScript | Local GGUF-based cross-encoder reranking fallback   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:293:| `intent-classifier.ts`     | ~500   | TypeScript | 7 intent types with keyword patterns                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:294:| `bm25-index.ts`            | ~280   | TypeScript | Pure TypeScript BM25 (REQ-028, v1.2.0)              |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:307:| `folder-discovery.ts`      | -      | TypeScript | Spec folder description discovery: per-folder `description.json` CRUD, centralized cache aggregation, staleness detection, `slugifyFolderName()` helper, keyword-overlap relevance scoring (PI-B3) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:311:| `sqlite-fts.ts`            | -      | TypeScript | SQLite FTS5 BM25 weighted scoring, extracted from hybrid-search for independent use |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:316:| `memory-summaries.ts`      | -      | TypeScript | Summary storage, embedding, and search channel for memory summaries (R8) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:323:| `embedding-expansion.ts`   | -      | TypeScript | Embedding-based query expansion for R12 multi-vector retrieval |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:337:| `hyde.ts`                  | -      | TypeScript | HyDE-style hypothetical document generation for query expansion |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:343:| `community-search.ts`      | -      | TypeScript | Community-level search fallback — keyword-matches community summaries, returns member IDs |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:353:**Relocated to `shared/algorithms/`**: `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts` -- these are now imported from `@spec-kit/shared/algorithms/`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:359:   hybrid-search.ts -> Expand acronyms + fix typos (inline)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:366:   vector-index.ts -> Vector search (semantic)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:367:   bm25-index.ts -> BM25 search (keyword)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:375:   rrf-fusion.ts -> RRF with k=40, convergence bonus
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:377:   hybrid-search.ts -> Orchestrate multi-source fusion
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:413:| `ENABLE_BM25`            | `true`   | Enable BM25 lexical search (legacy compatibility gate) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:418:| `EMBEDDING_DIM`          | `768`    | Fallback embedding dimension        |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:425:| `SPECKIT_EMBEDDING_EXPANSION`| `true` | Enable R12 embedding-based query expansion |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:455:| v7      | `partial` embedding_status + `idx_embedding_pending` + `idx_fts_fallback` (REQ-031, T096) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:476:function toEmbeddingBuffer(embedding) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:477:  return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:506:// 1. Vector search (semantic similarity)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:507:// 2. BM25/FTS5 search (keyword matching)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:516:hybridSearch("authentication", { specFolder: "specs/<###-spec-name>" })
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:523:- If no structural graph channel: Vector + Lexical + Co-activation (3-channel fallback)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:529:// Primary keywords: 2x weight
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:530:// Secondary keywords: 1x weight
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:597:| **Storage** | Summaries stored with embeddings in SQLite for vector search |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:600:| **Pipeline** | `generateAndStoreSummary()` combines TF-IDF extraction with embedding and persistence |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:607:| `querySummaryEmbeddings` | `(db, queryEmbedding, limit?) => SummarySearchResult[]` | Search summaries by embedding similarity |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:679:Same-path `unchanged` only applies to healthy existing rows (`success`, `pending`, `partial`), so unhealthy embedding states still re-enter indexing. Cross-path content-hash dedup accepts chunked parents only when the parent row is in valid `partial` state and ignores invalid parent rows marked `complete`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:706:**Embedding Cache Consistency** (`save/embedding-pipeline.ts` + chunking path):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:707:Embedding cache keys now hash normalized content in both the primary and chunked embedding paths, so equivalent normalized content shares cache entries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:718:**Lexical Normalization + BM25 Document Text** (`bm25-index.ts`):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:719:`buildBm25DocumentText()` builds the canonical lexical document from title, content, trigger phrases, and folder metadata. `normalizeLexicalQueryTokens()` is shared by BM25 and SQLite FTS flows so lexical matching stays aligned across search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:722:Watcher- and ingest-triggered reindex paths now use the normal synchronous embedding cache-miss flow. Deferred embeddings remain opt-in via `asyncEmbedding` or failure fallback.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:769:import { initializeDb } from './vector-index';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:770:import { init, unifiedSearch } from './hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:771:import { vectorSearch } from './vector-index';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:776:init(db, vectorSearch);
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:786:// - rrfScore: Combined score
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:787:// - sources: ['vector', 'bm25', 'graph']
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:788:// - vectorRank, bm25Rank, graphRank
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:796:import { unifiedSearch } from './hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:833:import * as bm25Index from './bm25-index';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:836:if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:838:  const results = bm25Index.getIndex().search('authentication', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:850:import { initializeDb, getDb } from './vector-index';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:872:- Guard clauses added for missing data, null embeddings, and edge cases (B4)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:906:| `@spec-kit/shared/embeddings` | Embeddings provider abstraction   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:908:| Search weights configuration | Loaded via SERVER_DIR in the split vector-index modules (compat imports still route through `vector-index-impl.ts`) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:943:| REQ-011 | RRF fusion enhancement           | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:946:| REQ-014 | BM25 hybrid search               | bm25-index.ts, hybrid-search.ts |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:947:| REQ-018 | Query expansion (fuzzy)          | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:948:| REQ-027 | Fuzzy acronym matching           | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:949:| REQ-028 | Pure TypeScript BM25             | bm25-index.ts                   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:961:- `vector-index.ts` is the primary typed export surface. `vector-index-impl.ts` is a 14-line compatibility shim, and the core implementation lives in the split vector-index modules for types, schema, mutations, queries, aliases, and store
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:962:- `rrf-fusion.ts`, `adaptive-fusion.ts`, and `mmr-reranker.ts` relocated to `shared/algorithms/`
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:23:/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:24:type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:41:const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:47:const FALLBACK_CHANNELS: readonly ChannelName[] = ['vector', 'fts'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:64: * - simple:   2 channels (vector + fts) — fastest path
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:65: * - moderate: 3 channels (vector + fts + bm25) — balanced
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:69:  simple: ['vector', 'fts'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:70:  moderate: ['vector', 'fts', 'bm25'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:71:  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:81: * fallback channels (vector, fts) until the minimum is met.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:87:  for (const fallback of FALLBACK_CHANNELS) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:89:    if (!result.includes(fallback)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:90:      result.push(fallback);
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:144:  // When feature flag is disabled, classifier returns 'complex' with 'fallback' confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:156:    ? enforceMinimumChannels([...channels, 'bm25'])
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:102:  // Tokenize the query into lowercase keywords.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:151: * @param rrfScores - Array of Reciprocal Rank Fusion scores (any length).
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:154:export function detectEvidenceGap(rrfScores: number[]): TRMResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:155:  if (rrfScores.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:159:  const finiteScores = rrfScores.filter((score) => Number.isFinite(score));
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:46:  embedding: ['vector', 'representation'],

exec
/bin/zsh -lc "sed -n '260,520p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
            if w not in taxonomy:
                taxonomy[w] = {}
            taxonomy[w][r] = taxonomy[w].get(r, 0) + 1
    except Exception:
        pass
    return {"taxonomy": taxonomy}


def tool_search(query: str, limit: int = 5, wing: str = None, room: str = None):
    return search_memories(
        query,
        palace_path=_config.palace_path,
        wing=wing,
        room=room,
        n_results=limit,
    )


def tool_check_duplicate(content: str, threshold: float = 0.9):
    col = _get_collection()

 succeeded in 0ms:
    col = _get_collection()
    if not col:
        return _no_palace()
    try:
        results = col.query(
            query_texts=[content],
            n_results=5,
            include=["metadatas", "documents", "distances"],
        )
        duplicates = []
        if results["ids"] and results["ids"][0]:
            for i, drawer_id in enumerate(results["ids"][0]):
                dist = results["distances"][0][i]
                similarity = round(1 - dist, 3)
                if similarity >= threshold:
                    meta = results["metadatas"][0][i]
                    doc = results["documents"][0][i]
                    duplicates.append(
                        {
                            "id": drawer_id,
                            "wing": meta.get("wing", "?"),
                            "room": meta.get("room", "?"),
                            "similarity": similarity,
                            "content": doc[:200] + "..." if len(doc) > 200 else doc,
                        }
                    )
        return {
            "is_duplicate": len(duplicates) > 0,
            "matches": duplicates,
        }
    except Exception as e:
        return {"error": str(e)}


def tool_get_aaak_spec():
    """Return the AAAK dialect specification."""
    return {"aaak_spec": AAAK_SPEC}


def tool_traverse_graph(start_room: str, max_hops: int = 2):
    """Walk the palace graph from a room. Find connected ideas across wings."""
    col = _get_collection()
    if not col:
        return _no_palace()
    return traverse(start_room, col=col, max_hops=max_hops)


def tool_find_tunnels(wing_a: str = None, wing_b: str = None):
    """Find rooms that bridge two wings — the hallways connecting domains."""
    col = _get_collection()
    if not col:
        return _no_palace()
    return find_tunnels(wing_a, wing_b, col=col)


def tool_graph_stats():
    """Palace graph overview: nodes, tunnels, edges, connectivity."""
    col = _get_collection()
    if not col:
        return _no_palace()
    return graph_stats(col=col)


# ==================== WRITE TOOLS ====================


def tool_add_drawer(
    wing: str, room: str, content: str, source_file: str = None, added_by: str = "mcp"
):
    """File verbatim content into a wing/room. Checks for duplicates first."""
    try:
        wing = sanitize_name(wing, "wing")
        room = sanitize_name(room, "room")
        content = sanitize_content(content)
    except ValueError as e:
        return {"success": False, "error": str(e)}

    col = _get_collection(create=True)
    if not col:
        return _no_palace()

    drawer_id = f"drawer_{wing}_{room}_{hashlib.sha256((wing + room + content[:100]).encode()).hexdigest()[:24]}"

    _wal_log(
        "add_drawer",
        {
            "drawer_id": drawer_id,
            "wing": wing,
            "room": room,
            "added_by": added_by,
            "content_length": len(content),
            "content_preview": content[:200],
        },
    )

    # Idempotency: if the deterministic ID already exists, return success as a no-op.
    try:
        existing = col.get(ids=[drawer_id])
        if existing and existing["ids"]:
            return {"success": True, "reason": "already_exists", "drawer_id": drawer_id}
    except Exception:
        pass

    try:
        col.upsert(
            ids=[drawer_id],
            documents=[content],
            metadatas=[
                {
                    "wing": wing,
                    "room": room,
                    "source_file": source_file or "",
                    "chunk_index": 0,
                    "added_by": added_by,
                    "filed_at": datetime.now().isoformat(),
                }
            ],
        )
        logger.info(f"Filed drawer: {drawer_id} → {wing}/{room}")
        return {"success": True, "drawer_id": drawer_id, "wing": wing, "room": room}
    except Exception as e:
        return {"success": False, "error": str(e)}


def tool_delete_drawer(drawer_id: str):
    """Delete a single drawer by ID."""
    col = _get_collection()
    if not col:
        return _no_palace()
    existing = col.get(ids=[drawer_id])
    if not existing["ids"]:
        return {"success": False, "error": f"Drawer not found: {drawer_id}"}

    # Log the deletion with the content being removed for audit trail
    deleted_content = existing.get("documents", [""])[0] if existing.get("documents") else ""
    deleted_meta = existing.get("metadatas", [{}])[0] if existing.get("metadatas") else {}
    _wal_log(
        "delete_drawer",
        {
            "drawer_id": drawer_id,
            "deleted_meta": deleted_meta,
            "content_preview": deleted_content[:200],
        },
    )

    try:
        col.delete(ids=[drawer_id])
        logger.info(f"Deleted drawer: {drawer_id}")
        return {"success": True, "drawer_id": drawer_id}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ==================== KNOWLEDGE GRAPH ====================


def tool_kg_query(entity: str, as_of: str = None, direction: str = "both"):
    """Query the knowledge graph for an entity's relationships."""
    results = _kg.query_entity(entity, as_of=as_of, direction=direction)
    return {"entity": entity, "as_of": as_of, "facts": results, "count": len(results)}


def tool_kg_add(
    subject: str, predicate: str, object: str, valid_from: str = None, source_closet: str = None
):
    """Add a relationship to the knowledge graph."""
    try:
        subject = sanitize_name(subject, "subject")
        predicate = sanitize_name(predicate, "predicate")
        object = sanitize_name(object, "object")
    except ValueError as e:
        return {"success": False, "error": str(e)}

    _wal_log(
        "kg_add",
        {
            "subject": subject,
            "predicate": predicate,
            "object": object,
            "valid_from": valid_from,
            "source_closet": source_closet,
        },
    )
    triple_id = _kg.add_triple(
        subject, predicate, object, valid_from=valid_from, source_closet=source_closet
    )
    return {"success": True, "triple_id": triple_id, "fact": f"{subject} → {predicate} → {object}"}


def tool_kg_invalidate(subject: str, predicate: str, object: str, ended: str = None):
    """Mark a fact as no longer true (set end date)."""
    _wal_log(
        "kg_invalidate",
        {"subject": subject, "predicate": predicate, "object": object, "ended": ended},
    )
    _kg.invalidate(subject, predicate, object, ended=ended)
    return {
        "success": True,
        "fact": f"{subject} → {predicate} → {object}",
        "ended": ended or "today",
    }


def tool_kg_timeline(entity: str = None):
    """Get chronological timeline of facts, optionally for one entity."""
    results = _kg.timeline(entity)
    return {"entity": entity or "all", "timeline": results, "count": len(results)}


def tool_kg_stats():
    """Knowledge graph overview: entities, triples, relationship types."""
    return _kg.stats()


# ==================== AGENT DIARY ====================


def tool_diary_write(agent_name: str, entry: str, topic: str = "general"):
    """
    Write a diary entry for this agent. Each agent gets its own wing
    with a diary room. Entries are timestamped and accumulate over time.

    This is the agent's personal journal — observations, thoughts,
    what it worked on, what it noticed, what it thinks matters.
    """
    try:
        agent_name = sanitize_name(agent_name, "agent_name")
        entry = sanitize_content(entry)
    except ValueError as e:
        return {"success": False, "error": str(e)}

    wing = f"wing_{agent_name.lower().replace(' ', '_')}"
    room = "diary"
    col = _get_collection(create=True)
    if not col:
        return _no_palace()

    now = datetime.now()
    entry_id = f"diary_{wing}_{now.strftime('%Y%m%d_%H%M%S')}_{hashlib.sha256(entry[:50].encode()).hexdigest()[:12]}"

    _wal_log(
        "diary_write",
        {
            "agent_name": agent_name,
            "topic": topic,
            "entry_id": entry_id,
            "entry_preview": entry[:200],
        },
    )

    try:
        # TODO: Future versions should expand AAAK before embedding to improve
        # semantic search quality. For now, store raw AAAK in metadata so it's
        # preserved, and keep the document as-is for embedding (even though
        # compressed AAAK degrades embedding quality).
        col.add(
            ids=[entry_id],
            documents=[entry],
            metadatas=[
                {
                    "wing": wing,

codex
The main contrast is already visible: MemPalace’s search path is pure Chroma semantic retrieval plus metadata filters, while Public’s search surface advertises and appears to implement multi-channel fusion with explicit lexical capability snapshots. I’m drilling into the fusion and routing files now so the recommendations are grounded in the actual lane behavior, not just comments or README language.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Query Router
// ───────────────────────────────────────────────────────────────
// Tier-to-channel-subset routing for query complexity
// Maps classifier tiers to channel subsets for selective pipeline execution.

import {
  classifyQueryComplexity,
  isComplexityRouterEnabled,
  type QueryComplexityTier,
  type ClassificationResult,
} from './query-classifier.js';
import { getStrategyForQuery } from './artifact-routing.js';
import { classifyIntent } from './intent-classifier.js';

// Feature catalog: Query complexity router


/* ───────────────────────────────────────────────────────────────
   1. TYPES & CONSTANTS
----------------------------------------------------------------*/

/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';

/** Maps each complexity tier to the set of channels that should be executed. */
interface ChannelRoutingConfig {
  simple: ChannelName[];
  moderate: ChannelName[];
  complex: ChannelName[];
}

/** Result of the routeQuery convenience function. */
interface RouteResult {
  tier: QueryComplexityTier;
  channels: ChannelName[];
  classification: ClassificationResult;
}

/** All available channels in execution order. */
const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;

/** Minimum required channels for safe routing. */
const MIN_CHANNELS = 2;

/** Fallback channels used to pad configs that violate the minimum invariant. */
const FALLBACK_CHANNELS: readonly ChannelName[] = ['vector', 'fts'] as const;
const BM25_PRESERVING_ARTIFACTS = new Set([
  'spec',
  'plan',
  'tasks',
  'checklist',
  'decision-record',
  'implementation-summary',
  'research',
]);

/* ───────────────────────────────────────────────────────────────
   2. DEFAULT ROUTING CONFIG
----------------------------------------------------------------*/

/**
 * Default tier-to-channel mapping:
 * - simple:   2 channels (vector + fts) — fastest path
 * - moderate: 3 channels (vector + fts + bm25) — balanced
 * - complex:  5 channels (all) — full pipeline
 */
const DEFAULT_ROUTING_CONFIG: ChannelRoutingConfig = {
  simple: ['vector', 'fts'],
  moderate: ['vector', 'fts', 'bm25'],
  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
};

/* ───────────────────────────────────────────────────────────────
   3. CHANNEL SUBSET RESOLUTION
----------------------------------------------------------------*/

/**
 * Enforce the minimum 2-distinct-channel invariant on a channel list.
 * If the list has fewer than MIN_CHANNELS entries, pad with
 * fallback channels (vector, fts) until the minimum is met.
 */
function enforceMinimumChannels(channels: ChannelName[]): ChannelName[] {
  const result = [...new Set(channels)] as ChannelName[];
  if (result.length >= MIN_CHANNELS) return result;

  for (const fallback of FALLBACK_CHANNELS) {
    if (result.length >= MIN_CHANNELS) break;
    if (!result.includes(fallback)) {
      result.push(fallback);
    }
  }

  return result;
}

/**
 * Get the channel subset for a given complexity tier.
 *
 * @param tier - The classified query complexity tier
 * @param config - Optional custom routing config (defaults to DEFAULT_ROUTING_CONFIG)
 * @returns Array of channel names to execute, guaranteed minimum 2 channels
 */
function getChannelSubset(
  tier: QueryComplexityTier,
  config?: ChannelRoutingConfig,
): ChannelName[] {
  const effectiveConfig = config ?? DEFAULT_ROUTING_CONFIG;
  const channels = effectiveConfig[tier] ?? [...ALL_CHANNELS];
  return enforceMinimumChannels([...channels]);
}

function shouldPreserveBm25(query: string): boolean {
  const intent = classifyIntent(query).intent;
  if (intent === 'find_spec' || intent === 'find_decision') {
    return true;
  }

  const artifact = getStrategyForQuery(query).detectedClass;
  return BM25_PRESERVING_ARTIFACTS.has(artifact);
}

/* ───────────────────────────────────────────────────────────────
   4. CONVENIENCE: CLASSIFY + ROUTE
----------------------------------------------------------------*/

/**
 * Classify a query's complexity and route it to the appropriate channel subset
 * in a single call.
 *
 * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled, returns all 5 channels
 * (full pipeline) regardless of classification result.
 *
 * @param query - The search query to classify and route
 * @param triggerPhrases - Optional trigger phrases for simple-tier classification
 * @returns RouteResult with tier, channels, and full classification details
 */
function routeQuery(
  query: string,
  triggerPhrases?: string[],
): RouteResult {
  const classification = classifyQueryComplexity(query, triggerPhrases);

  // When feature flag is disabled, classifier returns 'complex' with 'fallback' confidence.
  // In that case, always return all channels (full pipeline — safe default).
  if (!isComplexityRouterEnabled()) {
    return {
      tier: classification.tier,
      channels: [...ALL_CHANNELS],
      classification,
    };
  }

  const channels = getChannelSubset(classification.tier);
  const adjustedChannels = classification.tier === 'simple' && shouldPreserveBm25(query)
    ? enforceMinimumChannels([...channels, 'bm25'])
    : channels;

  return {
    tier: classification.tier,
    channels: adjustedChannels,
    classification,
  };
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
----------------------------------------------------------------*/

export {
  // Types
  type ChannelName,
  type ChannelRoutingConfig,
  type RouteResult,

  // Constants
  DEFAULT_ROUTING_CONFIG,
  ALL_CHANNELS,
  MIN_CHANNELS,
  FALLBACK_CHANNELS,

  // Functions
  getChannelSubset,
  routeQuery,

  // Internal helpers (exported for testing)
  enforceMinimumChannels,
};

exec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Hybrid Search
// ───────────────────────────────────────────────────────────────
// Combines vector, FTS, and BM25 search with fallback

// 1. IMPORTS

// Local
import { getIndex, isBm25Enabled } from './bm25-index.js';
import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import { getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
import { CO_ACTIVATION_CONFIG, spreadActivation } from '../cognitive/co-activation.js';
import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
import { INTENT_LAMBDA_MAP, classifyIntent } from './intent-classifier.js';
import { fts5Bm25Search } from './sqlite-fts.js';
import { DEGREE_CHANNEL_WEIGHT } from './graph-search-fn.js';
import {
  isMMREnabled,
  isCrossEncoderEnabled,
  isLocalRerankerEnabled,
  isSearchFallbackEnabled,
  isDocscoreAggregationEnabled,
  isDegreeBoostEnabled,
  isContextHeadersEnabled,
} from './search-flags.js';
import { rerankLocal } from './local-reranker.js';
import { computeDegreeScores } from './graph-search-fn.js';
import type { GraphSearchFn } from './search-types.js';

// Feature catalog: Hybrid search pipeline

export type { GraphSearchFn } from './search-types.js';

import { routeQuery } from './query-router.js';
import { isComplexityRouterEnabled } from './query-classifier.js';
import { enforceChannelRepresentation } from './channel-enforcement.js';
import {
  truncateByConfidence,
  isConfidenceTruncationEnabled,
  DEFAULT_MIN_RESULTS,
  GAP_THRESHOLD_MULTIPLIER,
} from './confidence-truncation.js';
import {
  getDynamicTokenBudget,
  isDynamicTokenBudgetEnabled,
  DEFAULT_TOKEN_BUDGET_CONFIG,
} from './dynamic-token-budget.js';
import { ensureDescriptionCache, getSpecsBasePaths } from './folder-discovery.js';
import {
  isFolderScoringEnabled,
  lookupFolders,
  computeFolderRelevanceScores,
  enrichResultsWithFolderScores,
  twoPhaseRetrieval,
} from './folder-relevance.js';

import { collapseAndReassembleChunkResults } from '../scoring/mpab-aggregation.js';

// Type-only
import type Database from 'better-sqlite3';
import type { SpreadResult } from '../cognitive/co-activation.js';
import type { MMRCandidate } from '@spec-kit/shared/algorithms/mmr-reranker';
import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { ChannelName } from './query-router.js';
import type { EnforcementResult } from './channel-enforcement.js';
import type { TruncationResult } from './confidence-truncation.js';

// 2. INTERFACES

type VectorSearchFn = (
  embedding: Float32Array | number[],
  options: Record<string, unknown>
) => Array<Record<string, unknown>>;

interface HybridSearchOptions {
  limit?: number;
  specFolder?: string;
  minSimilarity?: number;
  useBm25?: boolean;
  useFts?: boolean;
  useVector?: boolean;
  useGraph?: boolean;
  includeArchived?: boolean;
  includeContent?: boolean;
  /**
   * Evaluation-only mode.
   * When true, preserve the requested top-K window by bypassing confidence
   * truncation and token-budget truncation without changing live defaults.
   */
  evaluationMode?: boolean;
  /** Classified query intent for adaptive fusion weight selection (e.g. 'understand', 'fix_bug'). */
  intent?: string;
  /** Optional trigger phrases for query-classifier trigger-match routing path. */
  triggerPhrases?: string[];
  /**
   * Internal fallback override: when true, bypass complexity routing and
   * enable all retrieval channels for this search call.
   */
  forceAllChannels?: boolean;
  /**
   * Internal raw-candidate mode used by the Stage 1 pipeline.
   * When true, stop after channel collection and return pre-fusion candidates.
   */
  skipFusion?: boolean;
  /**
   * Internal pipeline handoff mode.
   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
   * apply the remaining pipeline scoring and aggregation steps.
   */
  stopAfterFusion?: boolean;
}

interface HybridSearchResult {
  id: number | string;
  /**
   * Normalized relevance score (0-1). Semantics depend on `source`:
   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
   * - `'graph'` — graph traversal relevance
   *
   * After hybrid merge, all source scores are min-max normalized to 0-1 within
   * their source group to ensure fair cross-method comparison (see P3-02 fix).
   */
  score: number;
  source: string;
  title?: string;
  [key: string]: unknown;
}

/** Non-enumerable shadow metadata attached to result arrays via Object.defineProperty. */
interface ShadowMetaArray {
  _s4shadow?: unknown;
  _s4attribution?: unknown;
  _degradation?: unknown;
}

/** Normalize a fused RRF result to the HybridSearchResult contract. */
function toHybridResult(result: FusionResult): HybridSearchResult {
  const sourceCandidate = (result as { source?: unknown }).source;
  const primarySource = result.sources[0] ?? 'hybrid';
  const scoreCandidate = (result as { score?: unknown }).score;

  return {
    ...result,
    id: result.id,
    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
    source: typeof sourceCandidate === 'string' ? sourceCandidate : primarySource,
  };
}

// 3. SPRINT 3 PIPELINE METADATA

/**
 * Optional metadata about pipeline stages attached to enhanced search results.
 * Only populated when the corresponding feature flags are enabled.
 */
interface Sprint3PipelineMeta {
  /** Query complexity routing result (SPECKIT_COMPLEXITY_ROUTER). */
  routing?: {
    tier: string;
    channels: string[];
    skippedChannels: string[];
    featureFlagEnabled: boolean;
    confidence: string;
    features: Record<string, unknown>;
  };
  /** Channel enforcement result (SPECKIT_CHANNEL_MIN_REP). */
  enforcement?: { applied: boolean; promotedCount: number; underRepresentedChannels: string[] };
  /** Confidence truncation result (SPECKIT_CONFIDENCE_TRUNCATION). */
  truncation?: {
    truncated: boolean;
    originalCount: number;
    truncatedCount: number;
    medianGap: number;
    cutoffGap: number;
    cutoffIndex: number;
    thresholdMultiplier: number;
    minResultsGuaranteed: number;
    featureFlagEnabled: boolean;
  };
  /** Dynamic token budget result (SPECKIT_DYNAMIC_TOKEN_BUDGET). */
  tokenBudget?: {
    tier: string;
    budget: number;
    applied: boolean;
    featureFlagEnabled: boolean;
    configValues: Record<string, number>;
    headerOverhead: number;
    adjustedBudget: number;
  };
}

// 4. PI-A2: DEGRADATION TYPES

/** Fallback tier in the 3-tier degradation chain. */
type FallbackTier = 1 | 2 | 3;

/** Why degradation was triggered at a given tier. */
interface DegradationTrigger {
  reason: 'low_quality' | 'insufficient_results' | 'both';
  topScore: number;
  resultCount: number;
  relativeGap?: number;
}

/** Record of a single degradation event during tiered fallback. */
interface DegradationEvent {
  tier: FallbackTier;
  trigger: DegradationTrigger;
  resultCountBefore: number;
  resultCountAfter: number;
}

/**
 * Absolute quality floor for degradation checks.
 *
 * Raw RRF scores are typically small decimals (often <0.05), so a
 * high fixed threshold causes false degradations. Use a conservative floor and
 * pair it with a relative-gap check to avoid score-scale coupling.
 */
const DEGRADATION_QUALITY_THRESHOLD = 0.02;

/** Minimum relative separation between top-1 and top-2 scores. */
const DEGRADATION_MIN_RELATIVE_GAP = 0.2;

/** Minimum result count: must have >= this many results to stay at current tier. */
const DEGRADATION_MIN_RESULTS = 3;

// 5. MODULE STATE

/** Default result limit when none is specified by the caller. */
const DEFAULT_LIMIT = 20;
/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
const PRIMARY_FALLBACK_MIN_SIMILARITY = 30;
/** Secondary vector similarity floor for adaptive retry passes (percentage units). */
const SECONDARY_FALLBACK_MIN_SIMILARITY = 17;
/** Tier-2 vector similarity floor for quality-aware fallback (percentage units). */
const TIERED_FALLBACK_MIN_SIMILARITY = 10;

/** Minimum MMR candidates required for diversity reranking to be worthwhile. */
const MMR_MIN_CANDIDATES = 2;

/** Fallback lambda (diversity vs relevance) when intent is not in INTENT_LAMBDA_MAP. */
const MMR_DEFAULT_LAMBDA = 0.7;

/** Number of top results used as seeds for co-activation spreading. */
const SPREAD_ACTIVATION_TOP_N = 5;

/** Maximum contextual tree header length prepended to content (including brackets). */
const CONTEXT_HEADER_MAX_CHARS = 100;
/** Header/content separator characters added during contextual tree injection. */
const CONTEXT_HEADER_SEPARATOR_CHARS = 1;
/** Reserved token overhead per contextual header, calibrated to max header length. */
const CONTEXT_HEADER_TOKEN_OVERHEAD = Math.ceil(
  (CONTEXT_HEADER_MAX_CHARS + CONTEXT_HEADER_SEPARATOR_CHARS) / 4
);

let db: Database.Database | null = null;
let vectorSearchFn: VectorSearchFn | null = null;
let graphSearchFn: GraphSearchFn | null = null;

// 6. GRAPH CHANNEL METRICS (T008)

interface GraphChannelMetrics {
  totalQueries: number;
  graphHits: number;
  graphOnlyResults: number;
  multiSourceResults: number;
}

const graphMetrics: GraphChannelMetrics = {
  totalQueries: 0,
  graphHits: 0,
  graphOnlyResults: 0,
  multiSourceResults: 0,
};

/**
 * Return current graph channel metrics for health check reporting.
 * graphHitRate is computed as graphHits / totalQueries.
 */
function getGraphMetrics(): GraphChannelMetrics & { graphHitRate: number } {
  return {
    ...graphMetrics,
    graphHitRate: graphMetrics.totalQueries > 0
      ? graphMetrics.graphHits / graphMetrics.totalQueries
      : 0,
  };
}

/** Reset all graph channel metrics counters to zero. */
function resetGraphMetrics(): void {
  graphMetrics.totalQueries = 0;
  graphMetrics.graphHits = 0;
  graphMetrics.graphOnlyResults = 0;
  graphMetrics.multiSourceResults = 0;
}

// 7. INITIALIZATION

/**
 * Initialize hybrid search with database, vector search, and optional graph search dependencies.
 * @param database - The better-sqlite3 database instance for FTS and graph queries.
 * @param vectorFn - Optional vector search function for semantic similarity.
 * @param graphFn - Optional graph search function for causal/structural retrieval.
 */
function init(
  database: Database.Database,
  vectorFn: VectorSearchFn | null = null,
  graphFn: GraphSearchFn | null = null
): void {
  db = database;
  vectorSearchFn = vectorFn;
  graphSearchFn = graphFn;
}

// 8. BM25 SEARCH

/**

 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Sqlite Fts
// ───────────────────────────────────────────────────────────────
// Feature catalog: Semantic and lexical search (memory_search)
// Weighted BM25 scoring for FTS5 full-text search.
// Extracted from hybrid-search.ts ftsSearch() for independent
// Testing and future delegation.

import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
import type Database from 'better-sqlite3';

// ───────────────────────────────────────────────────────────────
// 2. INTERFACES

// ───────────────────────────────────────────────────────────────
interface FtsBm25Result {
  id: number;
  fts_score: number;
  [key: string]: unknown;
}

interface FtsBm25Options {
  limit?: number;
  specFolder?: string;
  includeArchived?: boolean;
}

type LexicalPath = 'fts5' | 'like' | 'unavailable';
type FallbackState =
  | 'ok'
  | 'compile_probe_miss'
  | 'missing_table'
  | 'no_such_module_fts5'
  | 'bm25_runtime_failure';

interface LexicalCapabilitySnapshot {
  lexicalPath: LexicalPath;
  fallbackState: FallbackState;
}

let lastLexicalCapabilitySnapshot: LexicalCapabilitySnapshot | null = null;

function cloneLexicalCapabilitySnapshot(
  snapshot: LexicalCapabilitySnapshot | null
): LexicalCapabilitySnapshot | null {
  return snapshot ? { ...snapshot } : null;
}

function setLastLexicalCapabilitySnapshot(snapshot: LexicalCapabilitySnapshot): void {
  lastLexicalCapabilitySnapshot = { ...snapshot };
}

function getLastLexicalCapabilitySnapshot(): LexicalCapabilitySnapshot | null {
  return cloneLexicalCapabilitySnapshot(lastLexicalCapabilitySnapshot);
}

function resetLastLexicalCapabilitySnapshot(): void {
  lastLexicalCapabilitySnapshot = null;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function readCompileOptionValue(row: unknown): string | null {
  if (typeof row === 'string') {
    return row;
  }
  if (!row || typeof row !== 'object') {
    return null;
  }

  const record = row as Record<string, unknown>;
  const direct = record.compile_options;
  if (typeof direct === 'string') {
    return direct;
  }

  const firstString = Object.values(record).find((value) => typeof value === 'string');
  return typeof firstString === 'string' ? firstString : null;
}

function isNoSuchModuleFts5Error(error: unknown): boolean {
  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
}

function isBm25RuntimeFailure(error: unknown): boolean {
  const message = toErrorMessage(error).toLowerCase();
  return message.includes('bm25');
}

function probeFts5Capability(db: Database.Database): LexicalCapabilitySnapshot {
  try {
    const compileRows = (db.prepare('PRAGMA compile_options') as Database.Statement).all() as unknown[];
    const hasFts5CompileFlag = compileRows
      .map(readCompileOptionValue)
      .some((value) => typeof value === 'string' && value.toUpperCase().includes('ENABLE_FTS5'));

    if (!hasFts5CompileFlag) {
      return {
        lexicalPath: 'unavailable',
        fallbackState: 'compile_probe_miss',
      };
    }
  } catch {
    return {
      lexicalPath: 'unavailable',
      fallbackState: 'compile_probe_miss',
    };
  }

  try {
    const result = (db.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
    ) as Database.Statement).get() as { name: string } | undefined;

    if (!result) {
      return {
        lexicalPath: 'unavailable',
        fallbackState: 'missing_table',
      };
    }
  } catch (error: unknown) {
    if (isNoSuchModuleFts5Error(error)) {
      return {
        lexicalPath: 'unavailable',
        fallbackState: 'no_such_module_fts5',
      };
    }
    return {
      lexicalPath: 'unavailable',
      fallbackState: 'missing_table',
    };
  }

  return {
    lexicalPath: 'fts5',
    fallbackState: 'ok',
  };
}

// ───────────────────────────────────────────────────────────────
// 3. CORE FUNCTION

// ───────────────────────────────────────────────────────────────
/**
 * Execute a weighted BM25 FTS5 search against memory_fts.
 *
 * Uses SQLite FTS5's built-in bm25() ranking function with
 * per-column weights instead of the default `rank` pseudo-column.
 * This gives title matches 10x weight, trigger_phrases 5x, etc.
 *
 * @param db - SQLite database connection
 * @param query - Raw search query (will be sanitized)
 * @param options - Search options (limit, specFolder, includeArchived)
 * @returns Array of results with BM25 scores (higher = better)
 * @example
 * ```ts
 * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
 * ```
 */
function fts5Bm25Search(
  db: Database.Database,
  query: string,
  options: FtsBm25Options = {}
): FtsBm25Result[] {
  const { limit = 20, specFolder, includeArchived = false } = options;

  // Sanitize via shared tokenizer, then wrap each token in quotes and join with OR for recall
  const tokens = normalizeLexicalQueryTokens(query).fts;
  const sanitized = tokens
    .map(t => (t.startsWith('"') && t.endsWith('"')) ? t : `"${t}"`)
    .join(' OR ');

  if (!sanitized) {
    setLastLexicalCapabilitySnapshot(probeFts5Capability(db));
    return [];
  }

  const folderFilter = specFolder
    ? 'AND (m.spec_folder = ? OR m.spec_folder LIKE ? || "/%")'
    : '';
  const archivalFilter = !includeArchived
    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
    : '';
  const deprecatedTierFilter =
    "AND (m.importance_tier IS NULL OR m.importance_tier != 'deprecated')";

  const params: (string | number)[] = specFolder
    ? [sanitized, specFolder, specFolder, limit]
    : [sanitized, limit];

  // Bm25() returns negative scores (lower = better), so we negate
  // To produce positive scores where higher = better match.
  const [w0, w1, w2, w3] = BM25_FTS5_WEIGHTS;
  const sql = `
    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
    FROM memory_fts
    JOIN memory_index m ON m.id = memory_fts.rowid
    WHERE memory_fts MATCH ?
      ${folderFilter}
      ${archivalFilter}
      ${deprecatedTierFilter}
    ORDER BY fts_score DESC
    LIMIT ?
  `;

  const capability = probeFts5Capability(db);
  setLastLexicalCapabilitySnapshot(capability);
  if (capability.fallbackState !== 'ok') {
    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
    return [];
  }

  try {
    const rows = (db.prepare(sql) as Database.Statement).all(
      ...params
    ) as Array<Record<string, unknown>>;

    const normalizedRows = rows.map(row => ({
      ...row,
      id: row.id as number,
      fts_score: (row.fts_score as number) || 0,
    }));
    setLastLexicalCapabilitySnapshot({
      lexicalPath: 'fts5',
      fallbackState: 'ok',
    });
    return normalizedRows;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const failureSnapshot: LexicalCapabilitySnapshot = isNoSuchModuleFts5Error(error)
      ? {
          lexicalPath: 'unavailable',
          fallbackState: 'no_such_module_fts5',
        }
      : isBm25RuntimeFailure(error)
        ? {
            lexicalPath: 'unavailable',
            fallbackState: 'bm25_runtime_failure',
          }
        : msg.toLowerCase().includes('no such table: memory_fts')
          ? {
              lexicalPath: 'unavailable',
              fallbackState: 'missing_table',
            }
          : {
              lexicalPath: 'unavailable',
              fallbackState: 'bm25_runtime_failure',
            };
    setLastLexicalCapabilitySnapshot(failureSnapshot);
    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
    return [];
  }
}

/**
 * Check if the memory_fts FTS5 virtual table exists in the database.
 *
 * Used as a feature-detect before calling fts5Bm25Search, since FTS5
 * may be absent on older SQLite builds or freshly-created databases.
 *
 * @param db - SQLite database connection to check
 * @returns true if memory_fts exists and is queryable
 * @example
 * ```ts
 * if (isFts5Available(db)) {
 *   fts5Bm25Search(db, 'memory');
 * }
 * ```
 */
function isFts5Available(db: Database.Database): boolean {
  return probeFts5Capability(db).fallbackState === 'ok';
}

// ───────────────────────────────────────────────────────────────
// 4. EXPORTS

// ───────────────────────────────────────────────────────────────
export {

exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Bm25 Index
// ───────────────────────────────────────────────────────────────
// Feature catalog: BM25 trigger phrase re-index gate
import type Database from 'better-sqlite3';
import { normalizeContentForBM25 } from '../parsing/content-normalizer.js';

// ───────────────────────────────────────────────────────────────
// 1. INTERFACES

// ───────────────────────────────────────────────────────────────
interface BM25SearchResult {
  id: string;
  /**
   * BM25 term-frequency relevance score (unbounded, typically 0-25+).
   * Higher = better lexical match. Not directly comparable to vector similarity
   * scores; use min-max normalization or RRF when combining with other methods.
   */
  score: number;
}

interface BM25Stats {
  documentCount: number;
  termCount: number;
  avgDocLength: number;
}

interface BM25DocumentSource {
  title?: string | null;
  content_text?: string | null;
  trigger_phrases?: string | string[] | null;
  file_path?: string | null;
}

/* ───────────────────────────────────────────────────────────────
   1B. CONSTANTS & FEATURE FLAG
   ──────────────────────────────────────────────────────────────── */

const DEFAULT_K1 = 1.2;
const DEFAULT_B = 0.75;
const BM25_WARMUP_BATCH_SIZE = 250;
const BM25_ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'experimental', 'fallback']);
const BM25_DISABLED_VALUES = new Set(['0', 'false', 'no', 'off']);

/**
 * C138: Field weight multipliers for weighted BM25 scoring.
 * When indexing a document composed of multiple fields, multiply
 * each field's token scores by the appropriate weight before
 * accumulating the total document score.
 *
 * These weights are consumed by the FTS5 path in sqlite-fts.ts,
 * not the in-memory BM25 engine in this file. Exported for shared access.
 *
 * title:           10.0 — exact title matches are the strongest signal
 * trigger_phrases:  5.0 — curated keywords next most important
 * content_generic:  2.0 — generic textual content (file_path, tags, etc.)
 * body:             1.0 — baseline weight for full body / content_text
 */
const BM25_FTS5_WEIGHTS = [10.0, 5.0, 2.0, 1.0] as const;

const BM25_FIELD_WEIGHTS: Record<string, number> = {
  title: BM25_FTS5_WEIGHTS[0],
  trigger_phrases: BM25_FTS5_WEIGHTS[1],
  content_generic: BM25_FTS5_WEIGHTS[2],
  body: BM25_FTS5_WEIGHTS[3],
};

/**
 * Check whether the in-memory BM25 index is enabled.
 *
 * @returns `true` when BM25 indexing/search is enabled for the current process.
 * @example
 * ```ts
 * if (isBm25Enabled()) {
 *   getIndex();
 * }
 * ```
 */
function isBm25Enabled(): boolean {
  const value = process.env.ENABLE_BM25?.trim().toLowerCase();
  if (!value) return true; // enabled by default
  if (BM25_DISABLED_VALUES.has(value)) return false;
  return BM25_ENABLED_VALUES.has(value);
}

// ───────────────────────────────────────────────────────────────
// 2. HELPERS

// ───────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'it', 'as', 'was', 'are', 'be',
  'has', 'had', 'have', 'been', 'were', 'will', 'would', 'could', 'should',
  'may', 'might', 'can', 'this', 'that', 'these', 'those', 'not', 'no',
  'do', 'does', 'did', 'so', 'if', 'then', 'than', 'too', 'very',
]);

/**
 * Apply lightweight stemming to a token for BM25 indexing and matching.
 *
 * @param word - Token to stem.
 * @returns A lowercased token with simple suffix normalization applied.
 * @example
 * ```ts
 * simpleStem('running');
 * // 'run'
 * ```
 */
function simpleStem(word: string): string {
  let stem = word.toLowerCase();
  let suffixRemoved = false;
  // Simple suffix removal
  if (stem.endsWith('ing') && stem.length > 5) { stem = stem.slice(0, -3); suffixRemoved = true; }
  else if (stem.endsWith('tion') && stem.length > 6) { stem = stem.slice(0, -4); suffixRemoved = true; }
  else if (stem.endsWith('ed') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('ly') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('es') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('s') && stem.length > 3) { stem = stem.slice(0, -1); suffixRemoved = true; }
  // Only deduplicate doubled consonants when a suffix was actually removed.
  // Without this guard, original double consonants are incorrectly stripped:
  // "bass" -> "bas", "jazz" -> "jaz", "bill" -> "bil" etc.
  // Handle doubled consonants after suffix
  // Removal. "running"→"runn"→"run", "stopped"→"stopp"→"stop". Check if last two chars
  // Are identical consonants and deduplicate.
  if (suffixRemoved && stem.length >= 3) {
    const last = stem[stem.length - 1];
    if (last === stem[stem.length - 2] && !/[aeiou]/.test(last)) {
      stem = stem.slice(0, -1);
    }
  }
  return stem;
}

function splitLexicalFragments(text: string): string[] {
  if (!text || typeof text !== 'string') return [];

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean);
}

/**
 * Tokenize raw text into normalized BM25 terms.
 *
 * @param text - Input text to tokenize.
 * @returns Stemmed, lowercased, stop-word-filtered terms.
 * @example
 * ```ts
 * tokenize('The memory indexing pipeline');
 * // ['memory', 'index', 'pipeline']
 * ```
 */
function tokenize(text: string): string[] {
  return splitLexicalFragments(text)
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
    .map(simpleStem);
}

/**
 * Count token frequency occurrences for BM25 scoring.
 *
 * @param tokens - Normalized tokens produced by {@link tokenize}.
 * @returns A frequency map keyed by token text.
 * @example
 * ```ts
 * getTermFrequencies(['memory', 'memory', 'search']).get('memory');
 * // 2
 * ```
 */
function getTermFrequencies(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const token of tokens) {
    freq.set(token, (freq.get(token) || 0) + 1);
  }
  return freq;
}

function normalizeTriggerPhrasesForBM25(triggerPhrases: string | string[] | null | undefined): string {
  if (Array.isArray(triggerPhrases)) {
    return triggerPhrases
      .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
      .join(' ');
  }

  if (typeof triggerPhrases !== 'string') {
    return '';
  }

  const trimmed = triggerPhrases.trim();
  if (!trimmed) {
    return '';
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) {
      return parsed
        .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
        .join(' ');
    }
  } catch {
    // Fall back to raw string when the database value is not JSON.
  }

  return trimmed;
}

function buildBm25DocumentText(row: BM25DocumentSource): string {
  const textParts: string[] = [];

  if (typeof row.title === 'string' && row.title.trim()) {
    textParts.push(row.title.trim());
  }

  if (typeof row.content_text === 'string' && row.content_text.trim()) {
    textParts.push(normalizeContentForBM25(row.content_text));
  }

  const triggerPhrases = normalizeTriggerPhrasesForBM25(row.trigger_phrases);
  if (triggerPhrases) {
    textParts.push(triggerPhrases);
  }

  if (typeof row.file_path === 'string' && row.file_path.trim()) {
    textParts.push(row.file_path.trim());
  }

  return textParts.join(' ').trim();
}

// ───────────────────────────────────────────────────────────────
// 3. BM25 INDEX CLASS

// ───────────────────────────────────────────────────────────────
class BM25Index {
  private k1: number;
  private b: number;
  private documents: Map<string, { tokens: string[]; termFreq: Map<string, number> }>;
  private documentFreq: Map<string, number>;
  private totalDocLength: number;
  private warmupHandle: ReturnType<typeof setTimeout> | null;
  private warmupGeneration: number;

  constructor(k1: number = DEFAULT_K1, b: number = DEFAULT_B) {
    this.k1 = k1;
    this.b = b;
    this.documents = new Map();
    this.documentFreq = new Map();
    this.totalDocLength = 0;
    this.warmupHandle = null;
    this.warmupGeneration = 0;
  }

  addDocument(id: string, text: string): void {
    const tokens = tokenize(text);
    const termFreq = getTermFrequencies(tokens);

    // Remove old document if exists
    if (this.documents.has(id)) {
      this.removeDocument(id);
    }

    this.documents.set(id, { tokens, termFreq });
    this.totalDocLength += tokens.length;

    // Update document frequency
    for (const term of termFreq.keys()) {
      this.documentFreq.set(term, (this.documentFreq.get(term) || 0) + 1);
    }
  }

  removeDocument(id: string): boolean {
    const doc = this.documents.get(id);
    if (!doc) return false;

    this.totalDocLength -= doc.tokens.length;


exec
/bin/zsh -lc "rg -n \"routeQuery|fts5Bm25Search|getIndex\\(|vectorSearchFn|fuseResultsMulti|degradation|fallback|useBm25|useFts|useVector|enforceChannelRepresentation|channels\" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
4:// Combines vector, FTS, and BM25 search with fallback
10:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
15:import { fts5Bm25Search } from './sqlite-fts.js';
34:import { routeQuery } from './query-router.js';
36:import { enforceChannelRepresentation } from './channel-enforcement.js';
79:  useBm25?: boolean;
80:  useFts?: boolean;
81:  useVector?: boolean;
96:   * Internal fallback override: when true, bypass complexity routing and
97:   * enable all retrieval channels for this search call.
135:  _degradation?: unknown;
162:    channels: string[];
196:/** Fallback tier in the 3-tier degradation chain. */
199:/** Why degradation was triggered at a given tier. */
207:/** Record of a single degradation event during tiered fallback. */
216: * Absolute quality floor for degradation checks.
219: * high fixed threshold causes false degradations. Use a conservative floor and
234:/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
238:/** Tier-2 vector similarity floor for quality-aware fallback (percentage units). */
260:let vectorSearchFn: VectorSearchFn | null = null;
314:  vectorSearchFn = vectorFn;
338:    const index = getIndex();
413:    const index = getIndex();
465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
466:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
554:  const fallbackScores: Record<string, number> = {};
559:    fallbackScores[source] = resultScore;
561:  return fallbackScores;
688:  if (options.useVector === false) allowed.delete('vector');
689:  if (options.useBm25 === false) allowed.delete('bm25');
690:  if (options.useFts === false) allowed.delete('fts');
707:    useVector: allowedChannels.has('vector'),
708:    useBm25: allowedChannels.has('bm25'),
709:    useFts: allowedChannels.has('fts'),
738:  routeResult: ReturnType<typeof routeQuery>;
747:    (result as Record<string, unknown>).fallbackRetry = true;
851: * Retained as internal fallback only.
862:    useBm25 = isBm25Enabled(),
863:    useFts = true,
864:    useVector = true,
872:  if (useVector && embedding && vectorSearchFn) {
874:      const vectorResults = vectorSearchFn(embedding, {
896:  if (useFts) {
902:  if (useBm25) {
974: * All search channels use synchronous better-sqlite3; sequential execution
1007:    // When enabled, classifies query complexity and restricts channels to a
1008:    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
1009:    const routeResult = routeQuery(query, options.triggerPhrases);
1013:      : new Set<ChannelName>(routeResult.channels);
1016:    // every fallback tier. useGraph=false also disables the dependent degree lane.
1027:        channels: routeResult.channels,
1058:    // All channels use synchronous better-sqlite3; sequential execution
1062:    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
1064:        const vectorResults = vectorSearchFn(embedding, {
1142:        // Collect all numeric IDs from existing channels
1181:    // Merge keyword results after all channels complete
1253:    const fused = fuseResultsMulti(fusionLists);
1359:    const enforcementResult: EnforcementResult = enforceChannelRepresentation(
1382:  const degradationMeta = shadowMeta._degradation;
1575:          ...(degradationMeta !== undefined ? { degradation: degradationMeta } : {}),
1675: * Collect pipeline candidates through the adaptive fallback chain, returning
1731: * Search with automatic fallback chain.
1733: * fallback (searchWithFallbackTiered). Otherwise: C138-P0 two-pass adaptive
1734: * fallback — primary at minSimilarity=30, retry at 17.
1746:  // PI-A2: Delegate to tiered fallback when flag is enabled
1751:  // Primary 30 filters noise; fallback 17 widens recall for sparse corpora
1791: * requiring embeddings or text similarity. Pure SQL fallback.
2013: * Keep Tier 3 structural fallback scores below established Tier 1/2 confidence.
2101: * PI-A2: Quality-aware 3-tier search fallback chain.
2106: * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
2117: * @returns Results with _degradation metadata attached as non-enumerable property.
2124:  const degradationEvents: DegradationEvent[] = [];
2135:    // Tier 1 passed quality thresholds — attach empty degradation metadata
2136:    Object.defineProperty(finalTier1, '_degradation', {
2137:      value: degradationEvents,
2144:  // TIER 2: Widen search — lower similarity, force all channels
2147:  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
2151:  degradationEvents.push({
2163:    Object.defineProperty(finalTier2, '_degradation', {
2164:      value: degradationEvents,
2174:  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
2179:  degradationEvents.push({
2190:  Object.defineProperty(finalResults, '_degradation', {
2191:    value: degradationEvents,
2204:/** Maximum characters for a summary fallback when a single result overflows the budget. */
2317: * Create a summary fallback for a single result whose content exceeds the token budget.
2390:      `[hybrid-search] Token budget overflow (single-result fallback): ` +
2427:      `[hybrid-search] Token budget overflow (top-result fallback): ` +
2486:  routeQuery,
2489:  // PI-A2: Tiered fallback exports

exec
/bin/zsh -lc "sed -n '320,760p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/**
 * Search the BM25 index with optional spec folder filtering.
 * @param query - The search query string.
 * @param options - Optional limit and specFolder filter.
 * @returns Array of BM25-scored results tagged with source 'bm25'.
 */
function bm25Search(
  query: string,
  options: { limit?: number; specFolder?: string } = {}
): HybridSearchResult[] {
  if (!isBm25Enabled()) {
    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
    return [];
  }

  const { limit = DEFAULT_LIMIT, specFolder } = options;

  try {
    const index = getIndex();
    const results = index.search(query, limit);

    // BM25 document IDs are stringified
    // Numeric memory IDs (e.g., "42"), not spec folder paths. The old filter compared
    // R.id against specFolder which never matched. Use DB lookup to resolve spec_folder.

    // B7 FIX: Batch-resolve spec folders for all result IDs (was N+1 individual queries)
    // T72 SECURITY: Spec-folder scope MUST fail closed — any error in scope
    // resolution returns [] rather than leaking unscoped BM25 candidates.
    let specFolderMap: Map<number, string | null> | null = null;
    if (specFolder) {
      if (!db) {
        const error = new Error('Database unavailable for spec-folder scope lookup');
        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
        return [];
      }

      try {
        const ids = results.map((r: { id: string }) => Number(r.id));
        if (ids.length === 0) {
          return [];
        }
        const placeholders = ids.map(() => '?').join(',');
        const rows = db.prepare(
          `SELECT id, spec_folder FROM memory_index WHERE id IN (${placeholders})`
        ).all(...ids) as Array<{ id: number; spec_folder: string | null }>;
        specFolderMap = new Map();
        for (const row of rows) {
          specFolderMap.set(row.id, row.spec_folder);
        }
      } catch (error: unknown) {
        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
        return [];
      }

      // T72 DEFENSE-IN-DEPTH: If specFolder was requested but specFolderMap
      // is still null after the resolution block, something unexpected happened.
      // Fail closed rather than falling through to unscoped results.
      if (!specFolderMap) {
        const error = new Error('specFolderMap unexpectedly null after scope resolution');
        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
        return [];
      }
    }

    return results
      .filter((r: { id: string }) => {
        if (!specFolder) return true;
        if (!specFolderMap) return false;
        const folder = specFolderMap.get(Number(r.id));
        if (!folder) return false;
        return folder === specFolder || folder.startsWith(specFolder + '/');
      })
      .map((r: { id: string; score: number }) => ({
        ...r,
        source: 'bm25',
      }));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
    return [];
  }
}

/**
 * Check whether the BM25 index is populated and available for search.
 * @returns True if the BM25 index exists and contains at least one document.
 */
function isBm25Available(): boolean {
  if (!isBm25Enabled()) {
    return false;
  }

  try {
    const index = getIndex();
    return index.getStats().documentCount > 0;
  } catch (_err: unknown) {
    // Swallow index-not-initialized errors; caller treats absence as unavailable
    return false;
  }
}

// 9. FTS SEARCH

/**
 * Check whether the FTS5 full-text search table exists in the database.
 * @returns True if the memory_fts table exists in the connected database.
 */
function isFtsAvailable(): boolean {
  if (!db) {
    console.warn('[hybrid-search] db not initialized — isFtsAvailable returning false');
    return false;
  }

  try {
    const result = (db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'
    `) as Database.Statement).get() as { name: string } | undefined;
    return !!result;
  } catch (_err: unknown) {
    // Swallow DB errors; caller treats absence as unavailable
    return false;
  }
}

/**
 * Run FTS5 full-text search with weighted BM25 scoring and optional spec folder filtering.
 * @param query - The search query string.
 * @param options - Optional limit, specFolder filter, and includeArchived flag.
 * @returns Array of FTS-scored results tagged with source 'fts'.
 */
function ftsSearch(
  query: string,
  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
): HybridSearchResult[] {
  if (!db || !isFtsAvailable()) {
    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
    return [];
  }

  const { limit = DEFAULT_LIMIT, specFolder, includeArchived = false } = options;

  try {
    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
    // (title 10x, trigger_phrases 5x, file_path 2x, content 1x)
    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });

    return bm25Results.map(row => ({
      ...row,
      id: row.id as number,
      score: row.fts_score || 0,
      source: 'fts',
    }));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
    return [];
  }
}

// 10. COMBINED LEXICAL SEARCH

/**
 * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
 * @param query - The search query string.
 * @param options - Optional limit, specFolder filter, and includeArchived flag.
 * @returns Deduplicated array of merged results sorted by score descending.
 */
function combinedLexicalSearch(
  query: string,
  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
): HybridSearchResult[] {
  const ftsResults = ftsSearch(query, options);
  const bm25Results = bm25Search(query, options);

  // Merge by canonical ID, prefer FTS scores.
  // CanonicalResultId() prevents duplicate rows when one channel emits
  // Numeric IDs (42) and another emits string IDs ("42" or "mem:42").
  const merged = new Map<string, HybridSearchResult>();

  for (const r of ftsResults) {
    merged.set(canonicalResultId(r.id), r);
  }

  for (const r of bm25Results) {
    const canonicalId = canonicalResultId(r.id);
    if (!merged.has(canonicalId)) {
      merged.set(canonicalId, r);
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, options.limit || DEFAULT_LIMIT);
}

type RawChannelList = {
  source: string;
  results: Array<{ id: number | string; [key: string]: unknown }>;
};

function resolveRawCandidateScore(result: { score?: unknown; similarity?: unknown }): number {
  if (typeof result.score === 'number' && Number.isFinite(result.score)) {
    return result.score;
  }
  if (typeof result.similarity === 'number' && Number.isFinite(result.similarity)) {
    return result.similarity / 100;
  }
  return 0;
}

function getCandidateSources(result: HybridSearchResult): string[] {
  const sourceList = (result as { sources?: unknown }).sources;
  if (Array.isArray(sourceList)) {
    return sourceList.filter((value): value is string => typeof value === 'string');
  }
  return typeof result.source === 'string' && result.source.length > 0
    ? [result.source]
    : [];
}

function getCandidateSourceScores(result: HybridSearchResult): Record<string, number> {
  const sourceScores = (result as { sourceScores?: unknown }).sourceScores;
  if (sourceScores && typeof sourceScores === 'object' && !Array.isArray(sourceScores)) {
    const normalizedScores: Record<string, number> = {};
    for (const [source, score] of Object.entries(sourceScores as Record<string, unknown>)) {
      if (typeof score === 'number' && Number.isFinite(score)) {
        normalizedScores[source] = score;
      }
    }
    return normalizedScores;
  }

  const fallbackScores: Record<string, number> = {};
  const resultScore = typeof result.score === 'number' && Number.isFinite(result.score)
    ? result.score
    : 0;
  for (const source of getCandidateSources(result)) {
    fallbackScores[source] = resultScore;
  }
  return fallbackScores;
}

function mergeRawCandidate(
  existing: HybridSearchResult | undefined,
  incoming: HybridSearchResult
): HybridSearchResult {
  if (!existing) {
    const sources = getCandidateSources(incoming);
    const channelCount = sources.length;
    return {
      ...incoming,
      sources,
      channelCount,
      sourceScores: getCandidateSourceScores(incoming),
      channelAttribution: sources,
    };
  }

  const existingScore = typeof existing.score === 'number' && Number.isFinite(existing.score)
    ? existing.score
    : 0;
  const incomingScore = typeof incoming.score === 'number' && Number.isFinite(incoming.score)
    ? incoming.score
    : 0;
  const primary = incomingScore > existingScore ? incoming : existing;
  const secondary = primary === incoming ? existing : incoming;
  const sources = Array.from(new Set([
    ...getCandidateSources(existing),
    ...getCandidateSources(incoming),
  ]));
  const channelCount = sources.length;
  const crossChannelBonus = Math.min(0.06, 0.02 * Math.max(0, channelCount - 1));
  const mergedScore = Math.max(0, Math.min(1, Math.max(existingScore, incomingScore) + crossChannelBonus));

  return {
    ...(secondary ?? {}),
    ...primary,
    score: mergedScore,
    source: typeof primary.source === 'string' ? primary.source : (sources[0] ?? 'hybrid'),
    sources,
    channelCount,
    sourceScores: {
      ...getCandidateSourceScores(existing),
      ...getCandidateSourceScores(incoming),
    },
    channelAttribution: sources,
  };
}

function collectCandidatesFromLists(
  lists: RawChannelList[],
  limit?: number
): HybridSearchResult[] {
  const deduped = new Map<string, HybridSearchResult>();

  for (const list of lists) {
    if (!Array.isArray(list.results) || list.results.length === 0) continue;

    const scored = list.results.map((result) => {
      const rawScore = resolveRawCandidateScore(result as { score?: unknown; similarity?: unknown });
      return { result, rawScore };
    });

    let min = Infinity;
    let max = -Infinity;
    for (const { rawScore } of scored) {
      if (rawScore < min) min = rawScore;
      if (rawScore > max) max = rawScore;
    }
    const range = max - min;

    for (const { result, rawScore } of scored) {
      const normalizedScore = range > 0 ? (rawScore - min) / range : (rawScore > 0 ? 1.0 : 0);
      const candidate: HybridSearchResult = {
        ...result,
        id: result.id,
        source: list.source,
        score: normalizedScore,
        sources: [list.source],
        sourceScores: { [list.source]: normalizedScore },
        channelAttribution: [list.source],
      };
      const key = canonicalResultId(candidate.id);
      deduped.set(key, mergeRawCandidate(deduped.get(key), candidate));
    }
  }

  return applyResultLimit(
    Array.from(deduped.values()).sort((a, b) => {
      const aScore = typeof a.score === 'number' && Number.isFinite(a.score) ? a.score : 0;
      const bScore = typeof b.score === 'number' && Number.isFinite(b.score) ? b.score : 0;
      return bScore - aScore;
    }),
    limit
  );
}

function mergeRawCandidateSets(
  existing: HybridSearchResult[],
  incoming: HybridSearchResult[],
  limit?: number
): HybridSearchResult[] {
  const merged = new Map<string, HybridSearchResult>();

  for (const result of [...existing, ...incoming]) {
    const key = canonicalResultId(result.id);
    merged.set(key, mergeRawCandidate(merged.get(key), result));
  }

  return applyResultLimit(
    Array.from(merged.values()).sort((a, b) => {
      const aScore = typeof a.score === 'number' && Number.isFinite(a.score) ? a.score : 0;
      const bScore = typeof b.score === 'number' && Number.isFinite(b.score) ? b.score : 0;
      return bScore - aScore;
    }),
    limit
  );
}

function getAllowedChannels(options: HybridSearchOptions): Set<ChannelName> {
  const allowed = new Set<ChannelName>(['vector', 'fts', 'graph', 'degree']);

  if (isBm25Enabled()) {
    allowed.add('bm25');
  }

  if (options.useVector === false) allowed.delete('vector');
  if (options.useBm25 === false) allowed.delete('bm25');
  if (options.useFts === false) allowed.delete('fts');
  if (options.useGraph === false) {
    allowed.delete('graph');
    allowed.delete('degree');
  }

  return allowed;
}

function applyAllowedChannelOverrides(
  options: HybridSearchOptions,
  allowedChannels: Set<ChannelName>,
  overrides: Partial<HybridSearchOptions> = {}
): HybridSearchOptions {
  return {
    ...options,
    ...overrides,
    useVector: allowedChannels.has('vector'),
    useBm25: allowedChannels.has('bm25'),
    useFts: allowedChannels.has('fts'),
    useGraph: allowedChannels.has('graph'),
  };
}

type FallbackPlanKind = 'adaptive' | 'tiered';
type FallbackStageName = 'primary' | 'retry';

interface FallbackPlanStage {
  stage: FallbackStageName;
  options: HybridSearchOptions;
  results: HybridSearchResult[];
  execution: HybridFusionExecution | null;
  trigger?: 'empty' | DegradationTrigger;
}

interface FallbackPlanExecution {
  allowedChannels: Set<ChannelName>;
  stages: FallbackPlanStage[];
}

interface HybridFusionExecution {
  evaluationMode: boolean;
  intent: string;
  lists: Array<{
    source: string;
    results: Array<{ id: number | string; [key: string]: unknown }>;
    weight?: number;
  }>;
  routeResult: ReturnType<typeof routeQuery>;
  budgetResult: ReturnType<typeof getDynamicTokenBudget>;
  s3meta: Sprint3PipelineMeta;
  fusedResults: HybridSearchResult[];
  vectorEmbeddingCache: Map<number, Float32Array>;
}

function markFallbackRetry(results: HybridSearchResult[]): HybridSearchResult[] {
  for (const result of results) {
    (result as Record<string, unknown>).fallbackRetry = true;
  }

  return results;
}

function toEmbeddingBufferView(value: unknown): Float32Array | null {
  if (value instanceof Float32Array) {
    return value;
  }

  if (Array.isArray(value)) {
    const asNumbers = value.every((entry) => typeof entry === 'number' && Number.isFinite(entry));
    return asNumbers ? new Float32Array(value) : null;

exec
/bin/zsh -lc "sed -n '760,1180p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    return asNumbers ? new Float32Array(value) : null;
  }

  if (Buffer.isBuffer(value)) {
    return new Float32Array(value.buffer, value.byteOffset, value.byteLength / 4);
  }

  return null;
}

async function executeFallbackPlan(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {},
  planKind: FallbackPlanKind,
  overrides: Partial<HybridSearchOptions> = {}
): Promise<FallbackPlanExecution> {
  const allowedChannels = getAllowedChannels(options);
  const stages: FallbackPlanStage[] = [];

  const primaryOptions = applyAllowedChannelOverrides(options, allowedChannels, {
    minSimilarity: options.minSimilarity ?? PRIMARY_FALLBACK_MIN_SIMILARITY,
    ...overrides,
  });
  const primaryExecution = await collectAndFuseHybridResults(query, embedding, primaryOptions);
  const primaryResults = primaryExecution
    ? applyResultLimit(primaryExecution.fusedResults, primaryOptions.limit)
    : await hybridSearch(query, embedding, primaryOptions);
  stages.push({
    stage: 'primary',
    options: primaryOptions,
    results: primaryResults,
    execution: primaryExecution,
  });

  if (planKind === 'tiered') {
    const trigger = checkDegradation(primaryResults);
    if (!trigger) {
      return { allowedChannels, stages };
    }

    const retryOptions = applyAllowedChannelOverrides(options, allowedChannels, {
      ...overrides,
      minSimilarity: TIERED_FALLBACK_MIN_SIMILARITY,
      forceAllChannels: true,
    });
    const retryExecution = await collectAndFuseHybridResults(query, embedding, retryOptions);
    const retryResults = retryExecution
      ? applyResultLimit(retryExecution.fusedResults, retryOptions.limit)
      : await hybridSearch(query, embedding, retryOptions);
    stages.push({
      stage: 'retry',
      options: retryOptions,
      results: retryResults,
      execution: retryExecution,
      trigger,
    });
    return { allowedChannels, stages };
  }

  const primaryMinSimilarity = primaryOptions.minSimilarity ?? PRIMARY_FALLBACK_MIN_SIMILARITY;
  if (primaryResults.length === 0 && primaryMinSimilarity >= SECONDARY_FALLBACK_MIN_SIMILARITY) {
    const retryOptions = applyAllowedChannelOverrides(options, allowedChannels, {
      ...overrides,
      minSimilarity: SECONDARY_FALLBACK_MIN_SIMILARITY,
    });
    const retryExecution = await collectAndFuseHybridResults(query, embedding, retryOptions);
    const retryResultsBase = retryExecution
      ? applyResultLimit(retryExecution.fusedResults, retryOptions.limit)
      : await hybridSearch(query, embedding, retryOptions);
    const retryResults = retryResultsBase.length > 0
      ? markFallbackRetry(retryResultsBase)
      : retryResultsBase;
    stages.push({
      stage: 'retry',
      options: retryOptions,
      results: retryResults,
      execution: retryExecution,
      trigger: 'empty',
    });
  }

  return { allowedChannels, stages };
}

// 11. HYBRID SEARCH

/**
 * Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization.
 * Prefer hybridSearchEnhanced() or searchWithFallback() instead. This function uses naive per-source
 * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
 * Retained as internal fallback only.
 */
async function hybridSearch(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const {
    limit = DEFAULT_LIMIT,
    specFolder,
    minSimilarity = 0,
    useBm25 = isBm25Enabled(),
    useFts = true,
    useVector = true,
    useGraph = true,
    includeArchived = false,
  } = options;

  const results: HybridSearchResult[] = [];

  // Vector search
  if (useVector && embedding && vectorSearchFn) {
    try {
      const vectorResults = vectorSearchFn(embedding, {
        limit,
        specFolder,
        minSimilarity,
        includeConstitutional: false, // Handler manages constitutional separately
        includeArchived,
      });
      for (const r of vectorResults) {
        results.push({
          ...r,
          id: r.id as number,
          score: (r.similarity as number) || 0,
          source: 'vector',
        });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[hybrid-search] Vector search failed: ${msg}`);
    }
  }

  // FTS search
  if (useFts) {
    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
    results.push(...ftsResults);
  }

  // BM25 search
  if (useBm25) {
    const bm25Results = bm25Search(query, { limit, specFolder });
    results.push(...bm25Results);
  }

  // Graph search
  if (useGraph && graphSearchFn) {
    try {
      const graphResults = graphSearchFn(query, { limit, specFolder });
      for (const r of graphResults) {
        results.push({
          ...r,
          id: r.id as number | string,
          score: (r.score as number) || 0,
          source: 'graph',
        });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[hybrid-search] Graph search failed: ${msg}`);
    }
  }

  // Normalize scores per source before merging so one method's raw scale
  // Does not dominate others during final ranking.
  const bySource = new Map<string, HybridSearchResult[]>();
  for (const r of results) {
    const src = r.source || 'unknown';
    if (!bySource.has(src)) bySource.set(src, []);
    bySource.get(src)!.push(r); // non-null safe: has() guard above guarantees entry exists
  }

  const normalized: HybridSearchResult[] = [];
  for (const [, group] of bySource) {
    if (group.length === 0) continue;
    const scores = group.map(r => r.score);
    let min = Infinity;
    let max = -Infinity;
    for (const s of scores) {
      if (s < min) min = s;
      if (s > max) max = s;
    }
    const range = max - min;
    for (const r of group) {
      normalized.push({
        ...r,
        score: range > 0 ? (r.score - min) / range : (r.score > 0 ? 1.0 : 0),
      });
    }
  }

  // Deduplicate by ID (keep highest normalized score)
  // LIMITATION (P1-1): When a result appears in multiple sources (e.g., vector + fts),
  // Only the highest-scoring entry's `source` is preserved. Multi-source provenance
  // Is lost here. To fix properly, HybridSearchResult would need a `sources: string[]`
  // Field and downstream consumers would need to be updated accordingly.
  const deduped = new Map<string, HybridSearchResult>();
  for (const r of normalized) {
    const canonicalId = canonicalResultId(r.id);
    const existing = deduped.get(canonicalId);
    if (!existing || r.score > existing.score) {
      deduped.set(canonicalId, r);
    }
  }

  return Array.from(deduped.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Enhanced hybrid search with RRF fusion.
 * All search channels use synchronous better-sqlite3; sequential execution
 * is correct — Promise.all would add overhead without achieving parallelism.
 */
async function hybridSearchEnhanced(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const execution = await collectAndFuseHybridResults(query, embedding, options);
  if (execution) {
    if (options.stopAfterFusion) {
      return applyResultLimit(execution.fusedResults, options.limit);
    }

    return enrichFusedResults(query, execution, options);
  }

  return hybridSearch(query, embedding, options);
}

async function collectAndFuseHybridResults(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridFusionExecution | null> {
  try {
    const evaluationMode = options.evaluationMode === true;
    const lists: HybridFusionExecution['lists'] = [];

    // Pipeline metadata collector (populated by flag-gated stages)
    const s3meta: Sprint3PipelineMeta = {};

    // -- Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
    // When enabled, classifies query complexity and restricts channels to a
    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
    const routeResult = routeQuery(query, options.triggerPhrases);
    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
    const activeChannels = options.forceAllChannels
      ? new Set<ChannelName>(allPossibleChannels)
      : new Set<ChannelName>(routeResult.channels);

    // Respect explicit caller channel disables across both the primary route and
    // every fallback tier. useGraph=false also disables the dependent degree lane.
    const allowedChannels = getAllowedChannels(options);
    for (const channel of allPossibleChannels) {
      if (!allowedChannels.has(channel)) activeChannels.delete(channel);
    }

    const skippedChannels = allPossibleChannels.filter(ch => !activeChannels.has(ch));

    if (skippedChannels.length > 0) {
      s3meta.routing = {
        tier: routeResult.tier,
        channels: routeResult.channels,
        skippedChannels,
        featureFlagEnabled: isComplexityRouterEnabled(),
        confidence: routeResult.classification.confidence,
        features: routeResult.classification.features as Record<string, unknown>,
      };
    }

    // -- Stage E: Dynamic Token Budget (SPECKIT_DYNAMIC_TOKEN_BUDGET) --
    // Compute tier-aware budget early so it's available for downstream truncation.
    // When disabled, getDynamicTokenBudget returns the default 4000 budget with applied=false.
    const budgetResult = getDynamicTokenBudget(routeResult.tier);
    if (budgetResult.applied && !evaluationMode) {
      s3meta.tokenBudget = {
        tier: budgetResult.tier,
        budget: budgetResult.budget,
        applied: budgetResult.applied,
        featureFlagEnabled: isDynamicTokenBudgetEnabled(),
        configValues: DEFAULT_TOKEN_BUDGET_CONFIG as unknown as Record<string, number>,
        // headerOverhead and adjustedBudget are patched in below after they are computed
        headerOverhead: 0,
        adjustedBudget: budgetResult.budget,
      };
    }

    // Channel results collected independently, merged after all complete
    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
    let ftsChannelResults: HybridSearchResult[] = [];
    let bm25ChannelResults: HybridSearchResult[] = [];
    const vectorEmbeddingCache = new Map<number, Float32Array>();

    // All channels use synchronous better-sqlite3; sequential execution
    // Is correct — Promise.all adds overhead without parallelism.

    // Vector channel — gated by query-complexity routing
    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
      try {
        const vectorResults = vectorSearchFn(embedding, {
          limit: options.limit || DEFAULT_LIMIT,
          specFolder: options.specFolder,
          minSimilarity: options.minSimilarity || 0,
          includeConstitutional: false,
          includeArchived: options.includeArchived || false,
          includeEmbeddings: true,
        });
        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
          ...r,
          id: r.id as number | string,
          source: 'vector',
        }));
        for (const result of semanticResults) {
          if (typeof result.id !== 'number') continue;
          const embeddingCandidate = toEmbeddingBufferView(
            (result as Record<string, unknown>).embedding
            ?? (result as Record<string, unknown>).embeddingBuffer
          );
          if (embeddingCandidate) {
            vectorEmbeddingCache.set(result.id, embeddingCandidate);
          }
        }
        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
      } catch (_err: unknown) {
        // Non-critical — vector channel failure does not block pipeline
        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
      }
    }

    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
    if (activeChannels.has('fts')) {
      ftsChannelResults = ftsSearch(query, options);
      if (ftsChannelResults.length > 0) {
        // FTS weight reduced to 0.3 after ablation showed 0.8 was harmful,
        // flooding top-K with noisy lexical matches despite its exact-match value.
        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
      }
    }

    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
    if (activeChannels.has('bm25')) {
      bm25ChannelResults = bm25Search(query, options);
      if (bm25ChannelResults.length > 0) {
        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
        // Has less precise scoring than SQLite FTS5 BM25; kept for coverage breadth.
        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
      }
    }

    // Graph channel — gated by query-complexity routing
    const useGraph = (options.useGraph !== false) && activeChannels.has('graph');
    if (useGraph && graphSearchFn) {
      try {
        graphMetrics.totalQueries++; // counted only if channel executes
        const graphResults = graphSearchFn(query, {
          limit: options.limit || DEFAULT_LIMIT,
          specFolder: options.specFolder,
          intent: options.intent,
        });
        if (graphResults.length > 0) {
          graphMetrics.graphHits++;
          lists.push({ source: 'graph', results: graphResults.map((r: Record<string, unknown>) => ({
            ...r,
            id: r.id as number | string,
          })), weight: 0.5 });
        }
      } catch (_err: unknown) {
        // Non-critical — graph channel failure does not block pipeline
        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
      }
    }

    // Degree channel re-ranks based on causal-edge connectivity.
    // Graduated: default-ON. Set SPECKIT_DEGREE_BOOST=false to disable.
    // Degree channel — also gated by query-complexity routing
    if (activeChannels.has('degree') && db && isDegreeBoostEnabled()) {
      try {
        // Collect all numeric IDs from existing channels
        const allResultIds = new Set<number>();
        for (const list of lists) {
          for (const r of list.results) {
            const id = r.id;
            if (typeof id === 'number') allResultIds.add(id);
          }
        }

        if (allResultIds.size > 0) {
          const degreeScores = computeDegreeScores(db, Array.from(allResultIds));

          // Build a ranked list sorted by degree score (highest first)
          const degreeItems: Array<{ id: number; degreeScore: number }> = [];
          for (const [idStr, score] of degreeScores) {
            const numId = Number(idStr);
            if (score > 0 && !isNaN(numId)) {
              degreeItems.push({ id: numId, degreeScore: score });
            }
          }
          degreeItems.sort((a, b) => b.degreeScore - a.degreeScore);

          if (degreeItems.length > 0) {
            lists.push({
              source: 'degree',
              results: degreeItems.map(item => ({
                id: item.id,
                degreeScore: item.degreeScore,
              })),
              weight: DEGREE_CHANNEL_WEIGHT,
            });
          }
        }
      } catch (_err: unknown) {
        // Non-critical — degree channel failure does not block pipeline
        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
      }
    }


exec
/bin/zsh -lc "sed -n '1180,1480p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

    // Merge keyword results after all channels complete
    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
      ...ftsChannelResults,
      ...bm25ChannelResults,
    ];

    if (options.skipFusion) {
      return {
        evaluationMode,
        intent: options.intent || classifyIntent(query).intent,
        lists,
        routeResult,
        budgetResult,
        s3meta,
        vectorEmbeddingCache,
        fusedResults: collectCandidatesFromLists(
          lists.filter((list) => list.source !== 'degree'),
          options.limit ?? DEFAULT_LIMIT
        ),
      };
    }

    if (lists.length === 0) {
      return null;
    }

    // Track multi-source and graph-only results
    const sourceMap = new Map<string, Set<string>>();
    for (const list of lists) {
      for (const r of list.results) {
        const key = canonicalResultId(r.id);
        if (!sourceMap.has(key)) sourceMap.set(key, new Set());
        sourceMap.get(key)!.add(list.source); // non-null safe: has() guard above guarantees entry exists
      }
    }
    for (const [, sources] of sourceMap) {
      if (sources.size > 1) graphMetrics.multiSourceResults++;
      if (sources.size === 1 && sources.has('graph')) graphMetrics.graphOnlyResults++;
    }

    // C138/T315: Build weighted fusion lists once from lightweight adaptive
    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
    const intent = options.intent || classifyIntent(query).intent;
    const adaptiveEnabled = isAdaptiveFusionEnabled();
    const fusionWeights = adaptiveEnabled
      ? getAdaptiveWeights(intent)
      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
    const { semanticWeight, keywordWeight, graphWeight: adaptiveGraphWeight } = fusionWeights;
    const keywordFusionResults = keywordResults.map((result) => ({
      ...result,
      source: 'keyword',
    }));
    const fusionLists = lists
      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
      .map((list) => {
        if (list.source === 'vector') {
          return { ...list, weight: semanticWeight };
        }
        if (list.source === 'graph' && typeof adaptiveGraphWeight === 'number') {
          return { ...list, weight: adaptiveGraphWeight };
        }
        return { ...list };
      });

    if (keywordFusionResults.length > 0 && keywordWeight > 0) {
      fusionLists.push({
        source: 'keyword',
        results: keywordFusionResults,
        weight: keywordWeight,
      });
    }

    const fused = fuseResultsMulti(fusionLists);

    const fusedResults = fused.map(toHybridResult).map((row) => {
      const rowRecord = row as Record<string, unknown>;
      if (rowRecord.parentMemoryId !== undefined) return row;
      const normalizedParentMemoryId = rowRecord.parent_id ?? rowRecord.parentId;
      if (normalizedParentMemoryId === undefined) return row;
      return {
        ...row,
        parentMemoryId: normalizedParentMemoryId,
      };
    });

    return {
      evaluationMode,
      intent,
      lists,
      routeResult,
      budgetResult,
      s3meta,
      vectorEmbeddingCache,
      fusedResults,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
    return null;
  }
}

async function enrichFusedResults(
  query: string,
  execution: HybridFusionExecution,
  options: HybridSearchOptions = {},
  initialResults: HybridSearchResult[] = execution.fusedResults
): Promise<HybridSearchResult[]> {
  const {
    evaluationMode,
    intent,
    lists,
    routeResult,
    budgetResult,
    s3meta,
    vectorEmbeddingCache,
  } = execution;
  let fusedHybridResults = initialResults;
  const limit = options.limit || DEFAULT_LIMIT;

  // -- Aggregation stage: MPAB chunk-to-memory aggregation (after fusion, before state filter) --
  // When enabled, collapses chunk-level results back to their parent memory
  // Documents using MPAB scoring (sMax + 0.3 * sum(remaining) / sqrt(N)). This prevents
  // Multiple chunks from the same document dominating the result list.
  // MINOR-1 fix: isMpabEnabled() and isDocscoreAggregationEnabled() check the same env var
  if (isDocscoreAggregationEnabled()) {
    try {
      const chunkResults = fusedHybridResults.filter(
        r => (r as Record<string, unknown>).parentMemoryId != null && (r as Record<string, unknown>).chunkIndex != null
      );
      if (chunkResults.length > 0) {
        const nonChunkResults = fusedHybridResults.filter(
          r => (r as Record<string, unknown>).parentMemoryId == null || (r as Record<string, unknown>).chunkIndex == null
        );
        const collapsed = collapseAndReassembleChunkResults(
          chunkResults.map(r => ({
            id: r.id,
            parentMemoryId: (r as Record<string, unknown>).parentMemoryId as number | string,
            chunkIndex: (r as Record<string, unknown>).chunkIndex as number,
            score: r.score,
          }))
        );
        // Merge collapsed chunk results with non-chunk results
        fusedHybridResults = [
          ...collapsed.map(c => ({
            id: c.parentMemoryId,
            score: c.mpabScore,
            source: 'mpab' as string,
            _chunkHits: c._chunkHits,
          } as HybridSearchResult)),
          ...nonChunkResults,
        ];
      }
    } catch (_mpabErr: unknown) {
      // Non-critical — MPAB failure does not block pipeline
      const msg = _mpabErr instanceof Error ? _mpabErr.message : String(_mpabErr);
      console.error('[hybrid-search] MPAB error (non-fatal):', msg);
    }
  }

  // -- Stage C: Channel Enforcement (SPECKIT_CHANNEL_MIN_REP) --
  // Ensures every channel that returned results has at least one representative
  // In the top-k window. Prevents single-channel dominance in fusion output.
  // When disabled, passes results through unchanged.
  try {
    const channelResultSets = new Map<string, Array<{ id: number | string; score: number; [key: string]: unknown }>>();
    for (const list of lists) {
      channelResultSets.set(list.source, list.results.map(r => ({
        ...r,
        id: r.id,
        score: typeof (r as Record<string, unknown>).score === 'number'
          ? (r as Record<string, unknown>).score as number
          : typeof (r as Record<string, unknown>).similarity === 'number'
            ? ((r as Record<string, unknown>).similarity as number) / 100
            : 0,
      })));
    }

    const enforcementResult: EnforcementResult = enforceChannelRepresentation(
      fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),
      channelResultSets,
      limit,
    );

    if (enforcementResult.enforcement.applied) {
      fusedHybridResults = enforcementResult.results as HybridSearchResult[];
      s3meta.enforcement = {
        applied: true,
        promotedCount: enforcementResult.enforcement.promotedCount,
        underRepresentedChannels: enforcementResult.enforcement.underRepresentedChannels,
      };
    }
  } catch (err: unknown) {
    // Non-critical — enforcement failure does not block pipeline
    console.warn('[hybrid-search] channel enforcement failed:', err instanceof Error ? err.message : String(err));
  }

  // Preserve non-enumerable eval metadata across later array reallocations.
  const shadowMeta = initialResults as HybridSearchResult[] & ShadowMetaArray;
  const s4shadowMeta = shadowMeta._s4shadow;
  const s4attributionMeta = shadowMeta._s4attribution;
  const degradationMeta = shadowMeta._degradation;

  // C138/T316: MMR reranking with request-scoped embedding cache.
  // Reuse embeddings already returned by the vector channel when present and
  // only query vec_memories for missing IDs.
  let reranked: HybridSearchResult[] = fusedHybridResults.slice(0, limit);

  // P1-5: Optional local GGUF reranking path (RERANKER_LOCAL=true).
  // Preserve cross-encoder gate semantics: when SPECKIT_CROSS_ENCODER=false, skip reranking.
  if (isCrossEncoderEnabled() && isLocalRerankerEnabled() && reranked.length >= MMR_MIN_CANDIDATES) {
    const localReranked = await rerankLocal(query, reranked, limit);
    if (localReranked !== reranked) {
      reranked = localReranked as HybridSearchResult[];
    }
  }

  if (db && isMMREnabled()) {
    const numericIds = reranked
      .map(r => r.id)
      .filter((id): id is number => typeof id === 'number');

    if (numericIds.length >= MMR_MIN_CANDIDATES) {
      try {
        const embeddingMap = new Map<number, Float32Array>(vectorEmbeddingCache);
        const missingIds = numericIds.filter((id) => !embeddingMap.has(id));

        if (missingIds.length > 0) {
          const placeholders = missingIds.map(() => '?').join(', ');
          const embRows = (db.prepare(
            `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
          ) as Database.Statement).all(...missingIds) as Array<{ rowid: number; embedding: Buffer }>;

          for (const row of embRows) {
            if (Buffer.isBuffer(row.embedding)) {
              embeddingMap.set(
                row.rowid,
                new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
              );
            }
          }
        }

        const mmrCandidates: MMRCandidate[] = [];
        for (const r of reranked) {
          const emb = embeddingMap.get(r.id as number);
          if (emb) {
            mmrCandidates.push({
              id: r.id as number,
              score: (r.score as number) ?? 0,
              embedding: emb,
            });
          }
        }

        if (mmrCandidates.length >= MMR_MIN_CANDIDATES) {
          const mmrLambda = INTENT_LAMBDA_MAP[intent] ?? MMR_DEFAULT_LAMBDA;
          const diversified = applyMMR(mmrCandidates, { lambda: mmrLambda, limit });

          // FIX #6: Same fix as stage3-rerank FIX #5 — MMR can only diversify
          // rows that have embeddings. Non-embedded rows (lexical-only hits,
          // graph injections) must be preserved and merged back in their
          // original relative order instead of being silently dropped.
          const embeddedIdSet = new Set(mmrCandidates.map(c => c.id));
          const nonEmbeddedRows = reranked.filter(r => !embeddedIdSet.has(r.id as number));
          const rerankedById = new Map<string, HybridSearchResult>(
            reranked.map((result) => [canonicalResultId(result.id), result])
          );

          const diversifiedRows = diversified.map((candidate): HybridSearchResult => {
            const existing = rerankedById.get(canonicalResultId(candidate.id));
            if (existing) {
              return existing;
            }

            return {
              id: candidate.id,
              score: candidate.score,
              source: 'vector',
            };
          });

          // Merge: diversified embedded rows first (MMR-ordered), then
          // non-embedded rows in their original relative order.
          reranked = [...diversifiedRows, ...nonEmbeddedRows];
        }
      } catch (embErr: unknown) {
        const msg = embErr instanceof Error ? embErr.message : String(embErr);
        console.warn(`[hybrid-search] MMR embedding retrieval failed: ${msg}`);
      }
    }
  }

  // C138: Co-activation spreading — enrich with temporal neighbors
  const topIds = reranked
    .slice(0, SPREAD_ACTIVATION_TOP_N)
    .map(r => r.id)
    .filter((id): id is number => typeof id === 'number');
  if (topIds.length > 0) {
    try {

exec
/bin/zsh -lc "sed -n '2100,2205p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/**
 * PI-A2: Quality-aware 3-tier search fallback chain.
 *
 * TIER 1: hybridSearchEnhanced at minSimilarity=30
 *   → Pass if quality signal is healthy AND count >= 3
 *
 * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
 *   → Merge with Tier 1, dedup by id
 *   → Pass if quality signal is healthy AND count >= 3
 *
 * TIER 3: structuralSearch (pure SQL last-resort)
 *   → Merge with Tier 1+2 results after score calibration
 *   → Return capped set
 *
 * @param query - The search query string.
 * @param embedding - Optional embedding vector for semantic search.
 * @param options - Hybrid search configuration options.
 * @returns Results with _degradation metadata attached as non-enumerable property.
 */
async function searchWithFallbackTiered(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const degradationEvents: DegradationEvent[] = [];
  const { stages } = await executeFallbackPlan(query, embedding, options, 'tiered');
  const tier1Stage = stages[0];
  const tier2Stage = stages[1];
  let results = tier1Stage?.results ?? [];

  const tier1Trigger = checkDegradation(results);
  if (!tier1Trigger) {
    const finalTier1 = tier1Stage?.execution
      ? await enrichFusedResults(query, tier1Stage.execution, tier1Stage.options, results)
      : applyResultLimit(results, options.limit);
    // Tier 1 passed quality thresholds — attach empty degradation metadata
    Object.defineProperty(finalTier1, '_degradation', {
      value: degradationEvents,
      enumerable: false,
      configurable: true,
    });
    return finalTier1;
  }

  // TIER 2: Widen search — lower similarity, force all channels
  const tier1CountBefore = results.length;

  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);

  const tier2Results = tier2Stage?.results ?? [];
  results = mergeResults(results, tier2Results);
  degradationEvents.push({
    tier: 1,
    trigger: tier1Trigger,
    resultCountBefore: tier1CountBefore,
    resultCountAfter: results.length,
  });

  const tier2Trigger = checkDegradation(results);
  if (!tier2Trigger) {
    const finalTier2 = tier2Stage?.execution
      ? await enrichFusedResults(query, tier2Stage.execution, tier2Stage.options, results)
      : applyResultLimit(results, options.limit);
    Object.defineProperty(finalTier2, '_degradation', {
      value: degradationEvents,
      enumerable: false,
      configurable: true,
    });
    return finalTier2;
  }

  // TIER 3: Structural search (pure SQL last-resort)
  const tier2CountBefore = results.length;

  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);

  const tier3Results = structuralSearch({ specFolder: options.specFolder, limit: options.limit });
  const calibratedTier3 = calibrateTier3Scores(results, tier3Results);
  results = mergeResults(results, calibratedTier3);
  degradationEvents.push({
    tier: 2,
    trigger: tier2Trigger,
    resultCountBefore: tier2CountBefore,
    resultCountAfter: results.length,
  });

  const finalResults = tier2Stage?.execution
    ? await enrichFusedResults(query, tier2Stage.execution, tier2Stage.options, results)
    : applyResultLimit(results, options.limit);

  Object.defineProperty(finalResults, '_degradation', {
    value: degradationEvents,
    enumerable: false,
    configurable: true,
  });

  return finalResults;
}

// 14. PRE-FLIGHT TOKEN BUDGET VALIDATION (T007)

/** Default token budget — configurable via SPECKIT_TOKEN_BUDGET env var. */
const DEFAULT_TOKEN_BUDGET = 2000;

/** Maximum characters for a summary fallback when a single result overflows the budget. */
const SUMMARY_MAX_CHARS = 400;

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
<div align="center">

<img src="assets/mempalace_logo.png" alt="MemPalace" width="280">

# MemPalace

### The highest-scoring AI memory system ever benchmarked. And it's free.

<br>

Every conversation you have with an AI — every decision, every debugging session, every architecture debate — disappears when the session ends. Six months of work, gone. You start over every time.

Other memory systems try to fix this by letting AI decide what's worth remembering. It extracts "user prefers Postgres" and throws away the conversation where you explained *why*. MemPalace takes a different approach: **store everything, then make it findable.**

**The Palace** — Ancient Greek orators memorized entire speeches by placing ideas in rooms of an imaginary building. Walk through the building, find the idea. MemPalace applies the same principle to AI memory: your conversations are organized into wings (people and projects), halls (types of memory), and rooms (specific ideas). No AI decides what matters — you keep every word, and the structure gives you a navigable map instead of a flat search index.

**Raw verbatim storage** — MemPalace stores your actual exchanges in ChromaDB without summarization or extraction. The 96.6% LongMemEval result comes from this raw mode. We don't burn an LLM to decide what's "worth remembering" — we keep everything and let semantic search find it.

**AAAK (experimental)** — A lossy abbreviation dialect for packing repeated entities into fewer tokens at scale. Readable by any LLM that reads text — Claude, GPT, Gemini, Llama, Mistral — no decoder needed. **AAAK is a separate compression layer, not the storage default**, and on the LongMemEval benchmark it currently regresses vs raw mode (84.2% vs 96.6%). We're iterating. See the [note above](#a-note-from-milla--ben--april-7-2026) for the honest status.

**Local, open, adaptable** — MemPalace runs entirely on your machine, on any data you have locally, without using any external API or services. It has been tested on conversations — but it can be adapted for different types of datastores. This is why we're open-sourcing it.

<br>

[![][version-shield]][release-link]
[![][python-shield]][python-link]
[![][license-shield]][license-link]
[![][discord-shield]][discord-link]

<br>

[Quick Start](#quick-start) · [The Palace](#the-palace) · [AAAK Dialect](#aaak-dialect-experimental) · [Benchmarks](#benchmarks) · [MCP Tools](#mcp-server)

<br>

### Highest LongMemEval score ever published — free or paid.

<table>
<tr>
<td align="center"><strong>96.6%</strong><br><sub>LongMemEval R@5<br><b>raw mode</b>, zero API calls</sub></td>
<td align="center"><strong>500/500</strong><br><sub>questions tested<br>independently reproduced</sub></td>
<td align="center"><strong>$0</strong><br><sub>No subscription<br>No cloud. Local only.</sub></td>
</tr>
</table>

<sub>Reproducible — runners in <a href="benchmarks/">benchmarks/</a>. <a href="benchmarks/BENCHMARKS.md">Full results</a>. The 96.6% is from <b>raw verbatim mode</b>, not AAAK or rooms mode (those score lower — see <a href="#a-note-from-milla--ben--april-7-2026">note above</a>).</sub>

</div>

---

## A Note from Milla & Ben — April 7, 2026

> The community caught real problems in this README within hours of launch and we want to address them directly.
>
> **What we got wrong:**
>
> - **The AAAK token example was incorrect.** We used a rough heuristic (`len(text)//3`) for token counts instead of an actual tokenizer. Real counts via OpenAI's tokenizer: the English example is 66 tokens, the AAAK example is 73. AAAK does not save tokens at small scales — it's designed for *repeated entities at scale*, and the README example was a bad demonstration of that. We're rewriting it.
>
> - **"30x lossless compression" was overstated.** AAAK is a lossy abbreviation system (entity codes, sentence truncation). Independent benchmarks show AAAK mode scores **84.2% R@5 vs raw mode's 96.6%** on LongMemEval — a 12.4 point regression. The honest framing is: AAAK is an experimental compression layer that trades fidelity for token density, and **the 96.6% headline number is from RAW mode, not AAAK**.
>
> - **"+34% palace boost" was misleading.** That number compares unfiltered search to wing+room metadata filtering. Metadata filtering is a standard ChromaDB feature, not a novel retrieval mechanism. Real and useful, but not a moat.
>
> - **"Contradiction detection"** exists as a separate utility (`fact_checker.py`) but is not currently wired into the knowledge graph operations as the README implied.
>
> - **"100% with Haiku rerank"** is real (we have the result files) but the rerank pipeline is not in the public benchmark scripts. We're adding it.
>
> **What's still true and reproducible:**
>
> - **96.6% R@5 on LongMemEval in raw mode**, on 500 questions, zero API calls — independently reproduced on M2 Ultra in under 5 minutes by [@gizmax](https://github.com/milla-jovovich/mempalace/issues/39).
> - Local, free, no subscription, no cloud, no data leaving your machine.
> - The architecture (wings, rooms, closets, drawers) is real and useful, even if it's not a magical retrieval boost.
>
> **What we're doing:**
>
> 1. Rewriting the AAAK example with real tokenizer counts and a scenario where AAAK actually demonstrates compression
> 2. Adding `mode raw / aaak / rooms` clearly to the benchmark documentation so the trade-offs are visible
> 3. Wiring `fact_checker.py` into the KG ops so the contradiction detection claim becomes true
> 4. Pinning ChromaDB to a tested range (Issue #100), fixing the shell injection in hooks (#110), and addressing the macOS ARM64 segfault (#74)
>
> **Thank you to everyone who poked holes in this.** Brutal honest criticism is exactly what makes open source work, and it's what we asked for. Special thanks to [@panuhorsmalahti](https://github.com/milla-jovovich/mempalace/issues/43), [@lhl](https://github.com/milla-jovovich/mempalace/issues/27), [@gizmax](https://github.com/milla-jovovich/mempalace/issues/39), and everyone who filed an issue or a PR in the first 48 hours. We're listening, we're fixing, and we'd rather be right than impressive.
>
> — *Milla Jovovich & Ben Sigman*

---

## Quick Start

```bash
pip install mempalace

# Set up your world — who you work with, what your projects are
mempalace init ~/projects/myapp

# Mine your data
mempalace mine ~/projects/myapp                    # projects — code, docs, notes
mempalace mine ~/chats/ --mode convos              # convos — Claude, ChatGPT, Slack exports
mempalace mine ~/chats/ --mode convos --extract general  # general — classifies into decisions, milestones, problems

# Search anything you've ever discussed
mempalace search "why did we switch to GraphQL"

# Your AI remembers
mempalace status
```

Three mining modes: **projects** (code and docs), **convos** (conversation exports), and **general** (auto-classifies into decisions, preferences, milestones, problems, and emotional context). Everything stays on your machine.

---

## How You Actually Use It

After the one-time setup (install → init → mine), you don't run MemPalace commands manually. Your AI uses it for you. There are two ways, depending on which AI you use.

### With Claude Code (recommended)

Native marketplace install:

```bash
claude plugin marketplace add milla-jovovich/mempalace
claude plugin install --scope user mempalace
```

Restart Claude Code, then type `/skills` to verify "mempalace" appears.

### With Claude, ChatGPT, Cursor, Gemini (MCP-compatible tools)

```bash
# Connect MemPalace once
claude mcp add mempalace -- python -m mempalace.mcp_server
```

Now your AI has 19 tools available through MCP. Ask it anything:

> *"What did we decide about auth last month?"*

Claude calls `mempalace_search` automatically, gets verbatim results, and answers you. You never type `mempalace search` again. The AI handles it.

MemPalace also works natively with **Gemini CLI** (which handles the server and save hooks automatically) — see the [Gemini CLI Integration Guide](examples/gemini_cli_setup.md).

### With local models (Llama, Mistral, or any offline LLM)

Local models generally don't speak MCP yet. Two approaches:

**1. Wake-up command** — load your world into the model's context:

```bash
mempalace wake-up > context.txt
# Paste context.txt into your local model's system prompt
```

This gives your local model ~170 tokens of critical facts (in AAAK if you prefer) before you ask a single question.

**2. CLI search** — query on demand, feed results into your prompt:

```bash
mempalace search "auth decisions" > results.txt
# Include results.txt in your prompt
```

Or use the Python API:

```python
from mempalace.searcher import search_memories
results = search_memories("auth decisions", palace_path="~/.mempalace/palace")
# Inject into your local model's context
```

Either way — your entire memory stack runs offline. ChromaDB on your machine, Llama on your machine, AAAK for compression, zero cloud calls.

---

## The Problem

Decisions happen in conversations now. Not in docs. Not in Jira. In conversations with Claude, ChatGPT, Copilot. The reasoning, the tradeoffs, the "we tried X and it failed because Y" — all trapped in chat windows that evaporate when the session ends.

**Six months of daily AI use = 19.5 million tokens.** That's every decision, every debugging session, every architecture debate. Gone.

| Approach | Tokens loaded | Annual cost |
|----------|--------------|-------------|
| Paste everything | 19.5M — doesn't fit any context window | Impossible |
| LLM summaries | ~650K | ~$507/yr |
| **MemPalace wake-up** | **~170 tokens** | **~$0.70/yr** |
| **MemPalace + 5 searches** | **~13,500 tokens** | **~$10/yr** |

MemPalace loads 170 tokens of critical facts on wake-up — your team, your projects, your preferences. Then searches only when needed. $10/year to remember everything vs $507/year for summaries that lose context.

---

## How It Works

### The Palace

The layout is fairly simple, though it took a long time to get there.

It starts with a **wing**. Every project, person, or topic you're filing gets its own wing in the palace.

Each wing has **rooms** connected to it, where information is divided into subjects that relate to that wing — so every room is a different element of what your project contains. Project ideas could be one room, employees could be another, financial statements another. There can be an endless number of rooms that split the wing into sections. The MemPalace install detects these for you automatically, and of course you can personalize it any way you feel is right.

Every room has a **closet** connected to it, and here's where things get interesting. We've developed an AI language called **AAAK**. Don't ask — it's a whole story of its own. Your agent learns the AAAK shorthand every time it wakes up. Because AAAK is essentially English, but a very truncated version, your agent understands how to use it in seconds. It comes as part of the install, built into the MemPalace code. In our next update, we'll add AAAK directly to the closets, which will be a real game changer — the amount of info in the closets will be much bigger, but it will take up far less space and far less reading time for your agent.

Inside those closets are **drawers**, and those drawers are where your original files live. In this first version, we haven't used AAAK as a closet tool, but even so, the summaries have shown **96.6% recall** in all the benchmarks we've done across multiple benchmarking platforms. Once the closets use AAAK, searches will be even faster while keeping every word exact. But even now, the closet approach has been a huge boon to how much info is stored in a small space — it's used to easily point your AI agent to the drawer where your original file lives. You never lose anything, and all this happens in seconds.

There are also **halls**, which connect rooms within a wing, and **tunnels**, which connect rooms from different wings to one another. So finding things becomes truly effortless — we've given the AI a clean and organized way to know where to start searching, without having to look through every keyword in huge folders.

You say what you're looking for and boom, it already knows which wing to go to. Just *that* in itself would have made a big difference. But this is beautiful, elegant, organic, and most importantly, efficient.

```
  ┌─────────────────────────────────────────────────────────────┐
  │  WING: Person                                              │
  │                                                            │
  │    ┌──────────┐  ──hall──  ┌──────────┐                    │
  │    │  Room A  │            │  Room B  │                    │
  │    └────┬─────┘            └──────────┘                    │
  │         │                                                  │
  │         ▼                                                  │
  │    ┌──────────┐      ┌──────────┐                          │
  │    │  Closet  │ ───▶ │  Drawer  │                          │
  │    └──────────┘      └──────────┘                          │
  └─────────┼──────────────────────────────────────────────────┘
            │
          tunnel
            │
  ┌─────────┼──────────────────────────────────────────────────┐
  │  WING: Project                                             │
  │         │                                                  │
  │    ┌────┴─────┐  ──hall──  ┌──────────┐                    │
  │    │  Room A  │            │  Room C  │                    │
  │    └────┬─────┘            └──────────┘                    │
  │         │                                                  │
  │         ▼                                                  │
  │    ┌──────────┐      ┌──────────┐                          │
  │    │  Closet  │ ───▶ │  Drawer  │                          │
  │    └──────────┘      └──────────┘                          │
  └─────────────────────────────────────────────────────────────┘
```

**Wings** — a person or project. As many as you need.
**Rooms** — specific topics within a wing. Auth, billing, deploy — endless rooms.
**Halls** — connections between related rooms *within* the same wing. If Room A (auth) and Room B (security) are related, a hall links them.
**Tunnels** — connections *between* wings. When Person A and a Project both have a room about "auth," a tunnel cross-references them automatically.
**Closets** — summaries that point to the original content. (In v3.0.0 these are plain-text summaries; AAAK-encoded closets are coming in a future update — see [Task #30](https://github.com/milla-jovovich/mempalace/issues/30).)
**Drawers** — the original verbatim files. The exact words, never summarized.

**Halls** are memory types — the same in every wing, acting as corridors:
- `hall_facts` — decisions made, choices locked in
- `hall_events` — sessions, milestones, debugging
- `hall_discoveries` — breakthroughs, new insights
- `hall_preferences` — habits, likes, opinions
- `hall_advice` — recommendations and solutions

**Rooms** are named ideas — `auth-migration`, `graphql-switch`, `ci-pipeline`. When the same room appears in different wings, it creates a **tunnel** — connecting the same topic across domains:

```
wing_kai       / hall_events / auth-migration  → "Kai debugged the OAuth token refresh"
wing_driftwood / hall_facts  / auth-migration  → "team decided to migrate auth to Clerk"
wing_priya     / hall_advice / auth-migration  → "Priya approved Clerk over Auth0"
```

Same room. Three wings. The tunnel connects them.

codex
I’ve got the high-level picture: MemPalace is still a semantic-first system with taxonomy filters, not a semantic-plus-lexical hybrid. I’m checking Public’s trigger and context paths next, because the important design question is not just “vector plus FTS,” but which caller should hit which lane first for exact identifiers, fuzzy concepts, and resume flows.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Context
// ────────────────────────────────────────────────────────────────

import { randomUUID } from 'crypto';

// Layer definitions
import * as layerDefs from '../lib/architecture/layer-definitions.js';
import { checkDatabaseUpdated } from '../core/index.js';
import { toErrorMessage } from '../utils/index.js';

// Intent classifier
import * as intentClassifier from '../lib/search/intent-classifier.js';

// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
import { buildContext } from '../lib/code-graph/code-graph-context.js';

// Core handlers for routing
import { handleMemorySearch } from './memory-search.js';
import { handleMemoryMatchTriggers } from './memory-triggers.js';

// Response envelope
import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope.js';

// Token estimation
import { estimateTokens } from '../formatters/token-metrics.js';
import {
  getPressureLevel,
  type RuntimeContextStats,
} from '../lib/cognitive/pressure-monitor.js';
import * as workingMemory from '../lib/cognitive/working-memory.js';
import * as sessionManager from '../lib/session/session-manager.js';

// Telemetry
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
import {
  attachSessionTransitionTrace,
  buildSessionTransitionTrace,
  type SessionTransitionTrace,
} from '../lib/search/session-transition.js';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
import * as vectorIndex from '../lib/search/vector-index.js';

// Shared handler types
import type { MCPResponse, IntentClassification } from './types.js';

// PI-B3: Folder discovery integration
import { discoverSpecFolder, getSpecsBasePaths } from '../lib/search/folder-discovery.js';
import {
  isAutoResumeEnabled,
  isFolderDiscoveryEnabled,
  isPressurePolicyEnabled,
  isIntentAutoProfileEnabled,
} from '../lib/search/search-flags.js';

// Feature catalog: Unified context retrieval (memory_context)
// Feature catalog: Dual-scope memory auto-surface
// Feature catalog: Provenance-rich response envelopes


/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface ContextMode {
  readonly name: string;
  readonly description: string;
  readonly strategy: string;
  readonly tokenBudget?: number;
}

interface ContextOptions {
  specFolder?: string;
  folderBoost?: { folder: string; factor: number };
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
  anchors?: string[];
  profile?: string;
  sessionTransition?: SessionTransitionTrace;
}

interface SessionLifecycleMetadata {
  sessionScope: 'caller' | 'ephemeral';
  requestedSessionId: string | null;
  effectiveSessionId: string;
  resumed: boolean;
  eventCounterStart: number;
  resumedContextCount: number;
}

interface ContextResult extends Record<string, unknown> {
  strategy: string;
  mode: string;
}

interface LayerInfo {
  tokenBudget?: number;
}

interface ContextArgs {
  input: string;
  mode?: string;
  intent?: string;
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
  tokenUsage?: number;
  anchors?: string[];
  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
  profile?: string;
}

/** T205: Token budget enforcement metadata */
interface TokenBudgetEnforcement {
  budgetTokens: number;
  actualTokens: number;
  enforced: boolean;
  truncated: boolean;
  originalResultCount?: number;
  returnedResultCount?: number;
}

type PressureOverrideTargetMode = 'quick' | 'focused' | null;

interface SessionLifecycleResolution {
  requestedSessionId: string | null;
  effectiveSessionId: string;
  resumed: boolean;
  priorMode: string | null;
  counter: number;
  error?: string;
}

interface EffectiveModeIntentClassification {
  detectedIntent?: string;
  intentConfidence: number;
  resumeHeuristicApplied: boolean;
  source: 'explicit' | 'auto-detected';
}

interface EffectiveModeResolution {
  effectiveMode: string;
  pressureOverrideApplied: boolean;
  pressureOverrideTargetMode: PressureOverrideTargetMode;
  pressureWarning: string | null;
  intentClassification: EffectiveModeIntentClassification;
}

interface BuildResponseMetaParams {
  effectiveMode: string;
  requestedMode: string;
  tracedResult: ContextResult;
  pressurePolicy: {
    level: string;
    ratio: number | null;
    source: string;
    warning: string | null;
  };
  pressureOverrideApplied: boolean;
  pressureOverrideTargetMode: PressureOverrideTargetMode;
  pressureWarning: string | null;
  sessionLifecycle: SessionLifecycleMetadata;
  effectiveBudget: number;
  enforcement: TokenBudgetEnforcement;
  intentClassification: EffectiveModeIntentClassification;
  discoveredFolder?: string;
  includeTrace: boolean;
  sessionTransition: SessionTransitionTrace;
  structuralRoutingNudge: StructuralRoutingNudgeMeta | null;
}

interface StrategyErrorPayload {
  error: string;
  code: string;
  details: Record<string, unknown>;
  hints: string[];
  severity: string | null;
}

interface StructuralRoutingNudgeMeta {
  advisory: true;
  readiness: 'ready';
  preferredTool: 'code_graph_query';
  message: string;
  preservesAuthority: 'session_bootstrap';
}

const STRUCTURAL_ROUTING_PATTERNS = [
  /\b(?:who|what)\s+calls?\b/i,
  /\bcallers?\s+of\b/i,
  /\b(?:who|what)\s+imports?\b/i,
  /\bimports?\s+of\b/i,
  /\b(?:show|list)\s+(?:the\s+)?outline\b/i,
  /\boutline\s+of\b/i,
  /\bdependenc(?:y|ies)\b/i,
  /\bdependents?\b/i,
  /\bwhat\s+extends\b/i,
];

function extractResultRowsFromContextResponse(responseText: string): Array<Record<string, unknown>> {
  try {
    const parsed = JSON.parse(responseText) as Record<string, unknown>;
    const outerData = parsed?.data as Record<string, unknown> | undefined;

    const directRows = Array.isArray(outerData?.results)
      ? outerData.results as Array<Record<string, unknown>>
      : null;
    if (directRows) {
      return directRows;
    }

    const nestedContent = Array.isArray(outerData?.content)
      ? outerData.content as Array<{ type?: string; text?: string }>
      : [];
    const nestedText = nestedContent[0]?.text;
    if (typeof nestedText !== 'string' || nestedText.length === 0) {
      return [];
    }

    const nestedEnvelope = JSON.parse(nestedText) as Record<string, unknown>;
    const nestedData = nestedEnvelope?.data as Record<string, unknown> | undefined;
    return Array.isArray(nestedData?.results)
      ? nestedData.results as Array<Record<string, unknown>>
      : [];
  } catch {
    return [];
  }
}

function extractStrategyError(result: ContextResult): StrategyErrorPayload | null {
  if ((result as Record<string, unknown>).isError !== true) {
    return null;
  }

  const content = Array.isArray((result as Record<string, unknown>).content)
    ? ((result as Record<string, unknown>).content as Array<{ text?: string }>)
    : [];
  const responseText = content[0]?.text;
  if (typeof responseText !== 'string' || responseText.length === 0) {
    return {
      error: 'Context strategy failed',
      code: 'E_STRATEGY',

exec
/bin/zsh -lc "rg -n \"memory_match_triggers|match_triggers|trigger phrase|exact match|memory_context\\(|mode: 'resume'|mode === 'resume'|resume\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/*.map'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:8:// Feature catalog: BM25 trigger phrase re-index gate
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:337:      summary: 'No matching trigger phrases found',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:349:        'Ensure memories have trigger phrases defined',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:496:    : `Matched ${formattedResults.length} memories via trigger phrases`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:151:      // T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4:// Phase 020: Composite MCP tool that merges memory resume context,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:417:        mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:418:        profile: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:471:  // Phase 027: Structural bootstrap contract for resume surface
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:511:      key: 'memory-resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:560:    kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:591:      resumePayload: payloadContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:80:type SessionResumeModule = typeof import('./session-resume.js');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:208:    sessionResumeModule = loadHandlerModule<SessionResumeModule>('session-resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:331:// Session resume handler
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:7:import { handleSessionResume } from './session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:8:import type { CachedSessionSummaryDecision } from './session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:46:  resume: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:95:  resumeData: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:101:  if (resumeData.error) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:169:  let resumeData: Record<string, unknown> = {};
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:171:    const resumeResponse = await handleSessionResume({
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:174:    resumeData = extractData(resumeResponse);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:175:    allHints.push(...extractHints(resumeData));
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:178:    resumeData = { error: message };
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:202:  const cachedSummary = extractCachedSummary(resumeData);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:216:  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:219:  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:224:  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:227:  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:228:  if (!resumeData.error && !resumeStructuralTrust) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:238:  const resumeWithTrust = resumeData.error
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:239:    ? resumeData
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:241:      resumeData,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:242:      resumeStructuralTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:248:      key: 'resume-surface',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:250:      content: summarizeUnknown(resumeData),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:252:      certainty: resumeCertainty,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:280:      // which remains valid even when the remote resume surface fails closed.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:289:      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:299:      { label: 'resume', certainty: resumeCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:324:    resume: resumeWithTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:332:      resumePayload,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:338:    // Keep advisory routing guidance out of nextActions so bootstrap and resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:339:    // remain the authoritative recovery owners for startup and deep resume flows.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:97:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:99:  resumedContextCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:146:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:155:  resumeHeuristicApplied: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:674:  resume: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:677:    strategy: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:784:  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:787:    query: input || 'resume work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:798:    anchors: resumeAnchors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:810:    strategy: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:811:    mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:812:    resumeAnchors: resumeAnchors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:837:      resumed: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:846:  const resumed = trustedSession.trusted;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:847:  const priorMode = resumed
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:850:  const counter = resumed
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:857:    resumed,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:883:  let resumeHeuristicApplied = false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:898:    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:900:      session.resumed ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:901:      session.priorMode === 'resume' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:909:      effectiveMode = 'resume';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:910:      resumeHeuristicApplied = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:942:      resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:986:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1142:  if (requested_mode !== 'resume') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1224:    resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1244:    resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1246:    resumedContextCount: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1305:      resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1314:    resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1338:    resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1343:    queryHeuristicApplied: resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1425:  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434:  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1436:    if (resumeContextItems.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1437:      sessionLifecycle.resumedContextCount = resumeContextItems.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1497:        resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:40:  profile?: 'quick' | 'research' | 'resume' | 'debug';
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:204:/** Arguments for session resume requests. */
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:113:        enum: ['quick', 'research', 'resume', 'debug'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:212:  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:219:  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:294:  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:738:// Phase 020: Composite session resume tool
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:746:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:761:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:772:      nextActions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 recommended next actions derived from resume, health, and structural status' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:774:    required: ['resume', 'health', 'hints', 'nextActions'],
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:549:            // SK-005 Prefix matching: try exact match first, then fall back to
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:87: * Compute trigger phrase quality sub-score.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:89: * Evaluates whether the memory metadata declares enough trigger phrases for
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:108:    issues.push('No trigger phrases found');
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:112:    issues.push(`Only ${count} trigger phrase(s) — 4+ recommended`);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:427: * - Re-extract trigger phrases from content headings/title
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:442:  // Fix #1 : Re-extract trigger phrases if missing/insufficient
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:443:  const hasTriggerIssue = issues.some(i => /trigger phrase/i.test(i));
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:452:      fixed.push(`Re-extracted ${extracted.length} trigger phrases from content`);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:482: * Extract trigger phrases from content by scanning headings and the title.
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:6:// based on the session source (compact, startup, resume, clear).
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:18:import { getCachedSessionSummaryDecision, logCachedSummaryDecision } from '../../handlers/session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:96:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:107:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:176:/** Handle source=resume: load resume context for continued session */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:232:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:125:- startup and resume surfaces report freshness-aware graph status (`fresh`, `stale`, `empty`, `error`)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:539:- `resume`: Session recovery (loads previous state)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:596:When enabled, this feature adjusts the balance between vector similarity and keyword relevance based on the detected task type. It supports 7 task types: `add_feature`, `fix_bug`, `refactor`, `understand`, `plan`, `debug` and `resume`. For example, `fix_bug` boosts exact-match keyword signals while `understand` emphasizes semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:792:| Startup or resume shows graph `stale` | Freshness-aware startup detected drift before a structural read ran | Run a structural read to allow bounded inline repair, or run `code_graph_scan` for broader stale states |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:10://   source: "startup" | "resume" | "clear"
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:142:/** Handle source=resume: load resume context */
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:194:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/README.md:62:| **Retrieval modes** | 5 | auto, quick, deep, focused, resume |
.opencode/skill/system-spec-kit/mcp_server/README.md:85:The memory system exposes 47 MCP tools through 4 memory slash commands plus the borrowed recovery workflow in `/spec_kit:resume`. Think of commands as doors into the system. Each door opens access only to the tools it needs.
.opencode/skill/system-spec-kit/mcp_server/README.md:93:| `/spec_kit:resume` | Continue or recover an interrupted spec-folder session through the broader memory/session recovery stack | Broad helper surface; primary chain uses 3 shared memory tools |
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:570:| `mode` | string | `auto` (default), `quick`, `deep`, `focused`, `resume` |
.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:605:| `specFolder` | string | Scope resume to a specific spec folder |
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:809:| `triggerPhrases` | string[] | Updated trigger phrases |
.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:101:  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:115:  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:152:  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:10:| `session-prime.ts` | SessionStart | Injects context via stdout based on source (compact/startup/resume/clear) |
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:21:SessionStart(resume) → load prior session state
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:395:        qualityFlags: ['No trigger phrases found'],
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1260:  const resumeCommand = specFolder
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1261:    ? `/spec_kit:resume ${specFolder}`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1304:${resumeCommand}
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:16:  // SessionStart fields (Gemini has startup/resume/clear; no native compact source)
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:17:  source?: 'startup' | 'resume' | 'clear' | string;
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:505:**Trigger Matcher**: Matches user prompts to memory trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:508:// Find memories with matching trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:509:const matches = await parsing.triggerMatcher.match_triggers({
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:9:/** Token budget for session priming (startup/resume) */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:17:  source?: 'startup' | 'resume' | 'clear' | 'compact';
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:125:- Quick resume command
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:200:| Recover state | `recoverState(sessionId)` | On session resume |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:191:Bootstrap and resume remain the authority surfaces for structural context. Packet `006` only adds the shared trust contract beside packet `005`'s certainty contract; it does not create a new graph-only owner surface.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:306:- Preserve the three axes distinctly through bootstrap or resume-facing payloads. Do not merge them into a single "graph trust" label during transport.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:311:- Current owner surfaces remain authoritative: shared payload sections, session bootstrap or resume consumers, and bridge-facing graph payloads.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:25:/** Complete transport-only plan derived from shared startup/resume payloads. */
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:85:  resumePayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:93:    args.resumePayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:98:  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:99:  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:95:    { id: 403, content: 'Post-save review highlights title, trigger phrase, and importance tier issues. '.repeat(2) },
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:338:      input: 'resume auth work',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:353:      input: 'resume auth work',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:354:      profile: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:380:      prompt: 'resume auth work',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:93:  /** Optional trigger phrases for query-classifier trigger-match routing path. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:9:  | 'resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:312:    const expected = ['auto', 'quick', 'deep', 'focused', 'resume'];
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:353:  it('resume tokenBudget is 2000', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:355:    expect(memoryContext.CONTEXT_MODES.resume.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:196: * - Terms must NOT already exist as organic trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:201: * @param existingTriggers - Current trigger phrases already on the memory
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:842:      title: 'test query exact match',
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:847:      query: 'test query exact match',
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:13://   resume   — state + nextSteps + blockers
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:29:export type ResponseProfile = 'quick' | 'research' | 'resume' | 'debug';
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:86:/** Output of the `resume` profile formatter. */
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:111:  | { profile: 'resume'; data: ResumeProfile }
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:352: * Format results as the `resume` profile.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:402: * @param profile       - Profile name ('quick' | 'research' | 'resume' | 'debug')
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:423:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:424:      return { profile: 'resume', data: formatResume(safeInput) };
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:54:| Keyword Mappings | 40+ | Title/trigger phrase to type mapping |
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:947:        title: 'exact match test query',
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:952:      const optionsMax = { query: 'exact match test query', anchors: ['test'] }
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:307:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 }, // exact match
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:452:    it('T054-6f: Same-path unchanged does not short-circuit when trigger phrases changed', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:453:      const content = 'Existing same-path row with stale trigger phrases.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:483:      const content = 'Existing same-path row with stale trigger phrases.';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:76: * Check if the query exactly matches any known trigger phrase (case-insensitive).
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:79: * @param triggerPhrases - Known trigger phrases to match against.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:80: * @returns True when the query matches a trigger phrase exactly.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:95: * @param hasTrigger    - Whether a trigger phrase matched.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:130: * - Simple: ≤3 terms OR trigger phrase match
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:140: * @param triggerPhrases - Optional array of known trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:33:| `profile-formatters.ts` | Profile reducers for `quick`, `research`, `resume`, and `debug` response shapes |
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:41:- `profile-formatters.ts` exports `applyResponseProfile()` and `applyProfileToEnvelope()` plus the public profile types for `quick`, `research`, `resume`, and `debug`.
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:159:  // Normalize trigger phrases to array
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:323:  keywords: 'Matched keywords in title or trigger phrases',
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:175:| `scoreTriggerQuality(triggerPhrases)` | Layer 2 dimension: trigger phrase quality (0-1) |
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:21:        : kind === 'resume'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:36:    const resume = makePayload('resume', 'resume summary');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:41:      resumePayload: resume,
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:57:    const payload = makePayload('resume', 'resume summary');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:58:    expect(coerceSharedPayloadEnvelope(payload)?.kind).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:5:/** Maximum trigger phrases stored for each memory. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:180: * Parses trigger phrase storage into a normalized string array.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:181: * @param value - The stored trigger phrase payload.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:182: * @returns Parsed trigger phrases, or an empty array on invalid input.
.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:290:  it('T21: routes trigger phrase match to simple tier', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:487: * Score trigger phrase quality (0-1).
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:489: * @param triggerPhrases - Array of trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:638:      reasons.push('No trigger phrases: add at least 1-2 trigger phrases');
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:4:// Feature catalog: BM25 trigger phrase re-index gate
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:315:      prompt: 'resume auth work',
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:135: * @param triggerPhrases - Optional trigger phrases for simple-tier classification
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:5:// 100+ stop words that should never be learned as trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:57:   to serve as meaningful trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:76: * as trigger phrases. All terms stored in lowercase for case-insensitive matching.
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:151:    expect(brief.startupSurface).toContain('- Memory: startup summary only (resume on demand)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:260: * Learns new trigger phrases from a selected result.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:263: * @returns True when trigger phrases were updated.
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:219:  it('classifies trigger phrase matches as simple regardless of length', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:221:      // "get learning history" has 3 terms and is a trigger phrase
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:480:  it('matches exact trigger phrase (case-insensitive)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:486:  it('does not match partial trigger phrase', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:491:  it('handles empty trigger phrase list', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:501:      // "get learning history" is a trigger phrase with exactly 3 terms
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:719:`buildBm25DocumentText()` builds the canonical lexical document from title, content, trigger phrases, and folder metadata. `normalizeLexicalQueryTokens()` is shared by BM25 and SQLite FTS flows so lexical matching stays aligned across search channels.
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:8:describe('hook-state session resume', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:9:  const sessionId = 'test-resume-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:14:  it('recovers session state for resume', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:32:  it('preserves compact prime across resume', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:395:      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:397:      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:10:// Latency on short, well-defined queries that benefit from exact matches
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:292:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1123:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1136:        triggered: [{ memory_id: 11, matched_phrases: ['resume'] }],
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1144:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1150:      expect(autoSurfaceAtCompactionMock).toHaveBeenCalledWith('session resume context')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1157:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1703:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1747:      expect(hooksModule!.extractContextHint!({ prompt: 'trigger phrase' })).toBe('trigger phrase')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2086:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:671: * (quick, research, resume, debug) when no explicit profile is specified by the caller.
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:77:    it('P01: exact match returns the anchor ID itself', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:82:    it('P02: exact match even when multiple prefix candidates exist', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:91:    it('P03: exact match with empty string content still matches', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:203:      // Empty string exact match — extracted[''] is undefined
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:157:// In-memory cache of trigger phrases for fast matching
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:208:  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:306:/** Get or create a cached regex for a trigger phrase. @param phrase - The trigger phrase @returns Compiled RegExp */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:337:/** Load all trigger phrases from the index into memory */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:380:        console.warn(`[trigger-matcher] Failed to parse trigger phrases for memory ${row.id}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:621:/** Match user prompt against trigger phrases using exact string matching */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:694:/** Match trigger phrases with additional stats */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:725:/** Get all unique trigger phrases in the cache */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:763:/** Get memories by trigger phrase */
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:480:        currentTask: 'resume crash recovery verification',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:508:        contextSummary: 'Need to resume from the saved recovery packet.',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:518:      expect(content).toContain('/spec_kit:resume specs/022-hybrid-rag-fusion');
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:7:  'session-resume',
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:26:  resumedSession: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:49:    case 'session-resume':
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:50:      return `resumed session inferred ${effectiveMode} mode`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:71:  if (args.resumedSession) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:72:    activeSignals.push('session-resume');
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:89:    if (!args.resumedSession && !args.pressureOverrideApplied && args.requestedMode === 'auto' && !args.queryHeuristicApplied) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:37:| `memory-parser.ts` | Parses titles, trigger phrases, tiers, document type, causal links, anchors, and content hashes from markdown files |
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:327:    it('3.3.4b filters single-word stopword trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:541:/** Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter */
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:194:    keywords: ['memory', 'context', 'session', 'previous session', 'prior work', 'last time', 'continue', 'resume', 'recover', 'continuation'],
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:3:// TF-IDF + N-gram hybrid trigger phrase extraction
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:100:    it('T515-03: no duplicate trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:104:| **Recency** | 0.40 | Days since last update (primary for "resume work") |
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:704:      (a: string) => a.includes('/spec_kit:resume') || a.includes('recovery')
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:106:    it('T501-01: exact match on trigger phrase', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:137:    it('T501-04: multi-word trigger phrase matches', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:265:    it('T501-13a: Unicode-aware boundaries match Cyrillic and CJK trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1416:    it('does not re-add existing trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:39:import { handleSessionResume } from '../handlers/session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:45:describe('session-resume handler', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:65:    expect(parsed.data.payloadContract.kind).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:108:    expect(parsed.data.hints.some((h: string) => h.includes('Memory resume failed'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:121:  it('records bootstrap telemetry for full resume requests', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:244:describe('T020: Quick resume command (DB-dependent)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:246:  it('T020-01: Generates /spec_kit:resume command when specFolder is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:262:  it('T020-05: specFolder takes precedence over sessionId for resume command', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:3:vi.mock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:10:          memory: { resumed: true },
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:11:          hints: ['resume ok'],
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:13:            kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:14:            summary: 'resume payload',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:19:                content: 'resume structural context',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:              producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:31:              sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:67:import { handleSessionResume } from '../handlers/session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:83:    expect(parsed.data.resume.memory).toEqual({ resumed: true });
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:90:      resume: expect.any(Object),
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:95:    expect(parsed.data.hints).toEqual(expect.arrayContaining(['resume ok', 'health ok']));
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:98:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:469:      'Consider using /spec_kit:resume for session recovery'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:710:        'Text results will still be relevant for exact matches'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1068:    it('persists quality-loop trigger phrase fixes into downstream save inputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1123:        fixes: ['Re-extracted 4 trigger phrases from content'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1362:        fixes: ['Re-extracted 4 trigger phrases from content'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1410:        fixes: ['Re-extracted 4 trigger phrases from content'],
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:447:      const testContent = 'Test memory content for exact match detection';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:96:    : 'startup summary only (resume on demand)';
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:231:      "notes": "From T007b Pattern 2: session resume always uses \"session state\" as the input string."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:240:      "expectedResultDescription": "Topic-scoped resume query. Should surface spec folder 001-sprint-0-measurement-foundation memories with state/next-steps anchors.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:241:      "notes": "From T007b Pattern 2: variant of session resume scoped to a specific sprint/spec folder."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:510:      "expectedResultDescription": "Should surface trigger-matcher.ts, trigger-extractor.vitest.ts, and any spec about trigger phrase normalization.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:570:      "expectedResultDescription": "Should surface memories with trigger phrases matching \"content hash\" or \"deduplication\". Likely surfaces T054-related memories about SHA256 dedup implementation.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:571:      "notes": "Derived from known trigger phrases in the memory system related to content hash dedup."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:590:      "expectedResultDescription": "Should surface session-boost.ts, working-memory.ts, and memories with trigger phrases about session boost or attention scoring.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:591:      "notes": "Derived from env var name which appears as a trigger phrase in session boost documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:611:      "notes": "Derived from \"reciprocal rank fusion\" trigger phrase in the hybrid search documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:621:      "notes": "Direct trigger phrase derived from the system name and initialization context."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:641:      "notes": "Derived from \"generate-context\" trigger phrase in the memory save workflow documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:651:      "notes": "Derived from \"attention decay\" trigger phrase in the cognitive subsystem."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:661:      "notes": "Derived from \"BM25\" and \"stemming\" trigger phrases in the BM25 index module."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:671:      "notes": "Derived from \"causal edge\" and \"graph traversal\" trigger phrases."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:681:      "notes": "Derived from \"decision record\" and \"level 3\" trigger phrases in spec kit documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:691:      "notes": "Derived from \"maximal marginal relevance\" or \"MMR\" trigger phrases."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:701:      "notes": "Derived from SPECKIT_PRESSURE_POLICY env var trigger phrase — overlaps with seed query 9 but phrased differently."
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:111:      input: 'resume quickly',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:68:    vi.doMock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:223:  it('keeps bootstrap and resume authoritative while surfacing the nudge separately', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:224:    vi.doMock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:231:              memory: { resumed: true },
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:232:              hints: ['resume ok'],
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:234:                kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:264:    detail: 'Queries must be NOT derived from trigger phrases',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:24:    it('resume', () => { expect(classifyQueryIntent('resume my last session').intent).toBe('hybrid'); });
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:43:    it('resume my previous work', () => { expect(classifyQueryIntent('resume my previous work').intent).toBe('hybrid'); });
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:86:  // T041-01: Store an embedding, look it up, verify exact match
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:703:          trigger_phrases: 'updated trigger phrase',
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:780:    await handleMemoryUpdate({ id: 42, triggerPhrases: ['updated trigger phrase'] });
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:792:        trigger_phrases: 'updated trigger phrase',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:120:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:525: *   find_spec       — rewards exact matches heavily (3x), moderate partial
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:216:      expect(modes.resume.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:226:    it('T205-D3: Budget ordering is logical (quick < resume < focused < deep)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:231:      const resumeBudget = modes.resume.tokenBudget;
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:235:      expect(resumeBudget).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:238:      if (quickBudget === undefined || resumeBudget === undefined || focusedBudget === undefined || deepBudget === undefined) {
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:241:      expect(quickBudget).toBeLessThan(resumeBudget);
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:242:      expect(resumeBudget).toBeLessThan(focusedBudget);
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:71:  it('surfaces certainty fields in the shared resume payload', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:123:    const { handleSessionResume } = await import('../handlers/session-resume.js');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:142:      'memory-resume': 'estimated',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:162:    vi.doMock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:169:              memory: { resumed: true },
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:170:              hints: ['resume ok'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:172:                kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:238:    expect(parsed.data.payloadContract.summary).toContain('resume=estimated');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:243:      'resume-surface': 'estimated',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:7:// - Quality score computation (trigger phrases, anchors, budget, coherence)
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:105:  it('returns 0 when no trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:109:    expect(result.issues[0]).toMatch(/no trigger phrases/i);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:112:  it('returns 0.5 for 1-3 trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:116:    expect(result.issues[0]).toMatch(/2 trigger phrase/i);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:119:  it('returns 1.0 for 4+ trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:363:  it('extracts title as trigger phrase', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:396:  it('re-extracts trigger phrases when missing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:399:    const result = attemptAutoFix(content, metadata, ['No trigger phrases found']);
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:130:      expect(['startup', 'resume', 'compact', 'clear']).toContain(source);
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:151:  it('keeps structural snapshot trust off the errored resume payload while preserving it on structural context', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:152:    vi.doMock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:154:        throw new Error('synthetic resume failure');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:188:    expect(parsed.data.resume.error).toContain('synthetic resume failure');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:189:    expect(parsed.data.resume).not.toHaveProperty('parserProvenance');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:190:    expect(parsed.data.resume).not.toHaveProperty('evidenceStatus');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:191:    expect(parsed.data.resume).not.toHaveProperty('freshnessAuthority');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:23:          trackedPayloadKinds: ['resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:29:          payloadKind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:30:          dedupeKey: 'system:resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:31:          content: 'Summary: resume summary',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:36:          payloadKind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:37:          dedupeKey: 'messages:resume:0',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:43:          payloadKind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:44:          dedupeKey: 'compaction:resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:126:        specKitCompactCodeGraph: 'messages:resume:0',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:203:    expect(status).toContain('resume_mode=minimal');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:85:      resumed?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:87:      resumedContextCount?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:137:    it('T524-1: Auto mode routes "resume" to resume strategy', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:140:          input: 'resume where I left off on the authentication module',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:156:      expect(mode).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:181:    it('routes auto mode to resume when a caller session already exists without resume keywords', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:182:      mockTrustedSession('session-auto-resume');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:188:          sessionId: 'session-auto-resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:191:        'auto-resume-session-context'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:195:      expect(parsed.meta.mode).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:288:    it('forwards governed scope fields through resume-mode search routing', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:291:          input: 'resume session',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:292:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:299:        'scope-forward-resume'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:319:        resume: 2000,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:515:  describe('Session lifecycle metadata and resume context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:561:    it('T027l/T027m: caller session resume reports counter and injects top-5 context', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:576:          input: 'resume previous work on memory quality',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:578:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:581:        'T027l-resume'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:588:      expect(parsed.meta.sessionLifecycle.resumed).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:590:      expect(parsed.meta.sessionLifecycle.resumedContextCount).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:625:          input: 'resume prior work',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:627:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:639:          currentState: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:641:          signalSources: expect.arrayContaining(['session-resume', 'explicit-mode']),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:642:          reason: 'resumed session inferred resume mode',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:647:    it('uses the last inferred mode as previousState when a traced caller session resumes', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:655:          input: 'resume previous work on memory quality',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:657:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:667:          currentState: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:668:          signalSources: expect.arrayContaining(['session-resume', 'explicit-mode']),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:673:    it('default-on contract: auto-resume injection runs when SPECKIT_AUTO_RESUME is unset', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:682:          title: 'Auto resume memory',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:683:          filePath: '/tmp/auto-resume.md',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:690:          input: 'resume prior work',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:692:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:695:        'auto-resume-default-on'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:713:          title: 'Disabled auto-resume memory',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:714:          filePath: '/tmp/disabled-auto-resume.md',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:721:          input: 'resume prior work',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:723:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:726:        'auto-resume-opt-out'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:190:    const resumed = await handleMemorySearch({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:195:    const resumedEnvelope = parseEnvelope(resumed);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:196:    const resumedData = resumedEnvelope.data as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:198:    expect(resumedEnvelope.summary).toBe('Error: Cursor is invalid, expired, or out of scope');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:199:    expect(resumedData.error).toBe('Cursor is invalid, expired, or out of scope');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:453:  it('auto-fix rescues missing trigger phrases from headings', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:455:    // Content with headings (for trigger extraction) but NO trigger phrases and NO anchors.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:467:    expect(result.fixes.some(f => /trigger phrase/i.test(f))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1091:  it('rejects emoji-only trigger phrases as non-semantic', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1166:  it('quality loop handles exactly 3 trigger phrases at boundary', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:49:  it('resume session continues event_counter and preserves working memory items', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:52:    expect(workingMemory.setAttentionScore('resume-session', 2, 0.7)).toBe(true); // 0
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:53:    expect(workingMemory.setAttentionScore('resume-session', 3, 0.6)).toBe(true); // 1
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:55:    expect(workingMemory.sessionExists('resume-session')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:56:    expect(workingMemory.getSessionEventCounter('resume-session')).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:58:    expect(workingMemory.setAttentionScore('resume-session', 2, 0.9)).toBe(true); // 2
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:59:    expect(workingMemory.getSessionEventCounter('resume-session')).toBeGreaterThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:61:    const rows = workingMemory.getWorkingMemory('resume-session');
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:62:    const resumedRow = rows.find((row) => row.memory_id === 2);
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:63:    expect(resumedRow?.event_counter).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:65:    const promptContext = workingMemory.getSessionPromptContext('resume-session', 0.05, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-denylist.vitest.ts:3:// Into learned relevance feedback trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:177:    it('T500-06a: Inline YAML trigger phrases extracted', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:193:    it('T500-06b: Multi-line YAML trigger phrases extracted', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:424:Contenu en francais: cafe, resume, naive, cliche.
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:615:      expect(md).toContain('/spec_kit:resume specs/005');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:625:      // Without specFolder, should use sessionId-based resume command
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:107:    expect(modes).toContain('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:135:  it('T006: resume mode has resume strategy and 2000 token budget', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:136:    const resumeMode: ContextMode = CONTEXT_MODES.resume;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:137:    expect(resumeMode.strategy).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:138:    expect(resumeMode.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:229:  it('T020: No intent maps to quick or resume by default', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:232:      expect(mode).not.toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:304:      resumedSession: false,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:323:  it('prioritizes resumed-session and explicit-mode reasons deterministically', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:324:    const resumed = buildSessionTransitionTrace({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:326:      resumedSession: true,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:327:      effectiveMode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:333:    expect(resumed.signalSources).toEqual([
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:334:      'session-resume',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:338:    expect(resumed.confidence).toBe(0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:339:    expect(resumed.reason).toBe('resumed session inferred resume mode');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:343:      resumedSession: false,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:375:      resumedSession: false,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:574:  it('T061: Resume mode strategy is resume', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:575:    expect(CONTEXT_MODES.resume.strategy).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:579:    expect(CONTEXT_MODES.resume.name).toBe('Resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:583:    const desc: string = CONTEXT_MODES.resume.description.toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:585:      desc.includes('session') || desc.includes('previous') || desc.includes('resume') || desc.includes('state')
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:590:    expect(CONTEXT_MODES.resume.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:594:    const resumeBudget: number = CONTEXT_MODES.resume.tokenBudget!;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:596:    expect(resumeBudget).toBeLessThan(deepBudget);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:601:    expect(mappedModes).not.toContain('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:606:    const resumeCount: number = strategies.filter((s: string) => s === 'resume').length;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:607:    expect(resumeCount).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:611:    const desc: string = CONTEXT_MODES.resume.description.toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:618:    expect(CONTEXT_MODES.resume.description.length).toBeGreaterThan(10);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:622:    const resume: ContextMode = CONTEXT_MODES.resume;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:623:    expect(resume.name).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:624:    expect(resume.description).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:625:    expect(resume.strategy).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:626:    expect(resume.tokenBudget).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:671:    // And via keyword detection, can route to resume
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:731:    const resume: number = CONTEXT_MODES.resume.tokenBudget!;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:735:    expect(quick).toBeLessThan(resume);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:736:    expect(resume).toBeLessThan(focused);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:852:    expect(Object.keys(CONTEXT_MODES).sort()).toEqual(['auto', 'deep', 'focused', 'quick', 'resume']);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:1005:      resume: 2000
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:59:    trackQueryAndDetect(db, 'sess-b', 'memory context resume', 'q1', ['mem-9']);
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:61:    const detection = trackQueryAndDetect(db, 'sess-b', 'resume memory context', 'q2', ['mem-10']);
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/similarity-test-cases.json:112:      "description": "Exact or near-exact matches"
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:151:            data: { resumed: true },
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:195:    const { handleSessionResume } = await import('../handlers/session-resume.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:196:    const resumeResult = await handleSessionResume({ specFolder: 'specs/026-root' });
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:197:    const parsedResume = JSON.parse(resumeResult.content[0].text);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:198:    const resumeStructuralSection = parsedResume.data.payloadContract.sections.find(
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:202:    expect(resumeStructuralSection?.structuralTrust).toEqual({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:215:    expect(parsed.data.resume).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:6:// session-resume.ts, and other consumers.

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-match-triggers.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-match-triggers.ts: No such file or directory

codex
The trigger-path file is named `memory-triggers.ts`, not `memory-match-triggers.ts`, so I’m reading the real handler now. That’s useful in itself: this lane is a distinct subsystem, not just a thin alias over full search.
exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Triggers
// ───────────────────────────────────────────────────────────────
// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';

// Feature catalog: Trigger phrase matching (memory_match_triggers)
// Feature catalog: BM25 trigger phrase re-index gate


/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES
──────────────────────────────────────────────────────────────── */

// Core utilities
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
import { toErrorMessage } from '../utils/index.js';
import { createFilePathValidator } from '../utils/validators.js';

// Formatters
import { calculateTokenMetrics, type TokenMetrics } from '../formatters/index.js';

// Lib modules
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import * as workingMemory from '../lib/cognitive/working-memory.js';
import * as attentionDecay from '../lib/cognitive/attention-decay.js';
import * as tierClassifier from '../lib/cognitive/tier-classifier.js';
import type { TierInput, StateStats } from '../lib/cognitive/tier-classifier.js';
import * as coActivation from '../lib/cognitive/co-activation.js';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse, createMCPEmptyResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
// T004: Consumption instrumentation
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logFinalResult } from '../lib/eval/eval-logger.js';

// Shared handler types
import type { MCPResponse } from './types.js';
// C2 FIX: Import DB access for scope filtering
import { initialize_db } from '../lib/search/vector-index-store.js';
// T73: Import session manager for trusted session validation (IDOR prevention)
import * as sessionManager from '../lib/session/session-manager.js';

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

interface TriggerMatch {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  matchedPhrases: string[];
  importanceWeight: number;
  [key: string]: unknown;
}

interface EnrichedTriggerMatch extends TriggerMatch {
  attentionScore: number;
  tier: string;
  coActivated: boolean;
}

interface FormattedResult {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  matchedPhrases: string[];
  importanceWeight: number;
  tier?: string;
  attentionScore?: number;
  content?: string;
  coActivated?: boolean;
  [key: string]: unknown;
}

interface DecayStats {
  decayedCount: number;
}

interface CoActivatedMemory {
  memoryId: number;
}

interface WorkingMemoryEntry {
  memoryId: number;
  attentionScore: number;
}

interface CognitiveStats {
  enabled: boolean;
  sessionId: string;
  turnNumber: number;
  decayApplied: number;
  memoriesActivated: number;
  coActivations: number;
  tierDistribution: StateStats;
  tokenMetrics: TokenMetrics;
}

interface TriggerArgs {
  prompt: string;
  specFolder?: string;
  limit?: number;
  session_id?: string;
  turnNumber?: number;
  include_cognitive?: boolean;
  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
}

/* ───────────────────────────────────────────────────────────────
   2b. CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Per-turn decay rate for attention scoring. */
const TURN_DECAY_RATE = 0.98;
const validateTieredFilePath = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);

/* ───────────────────────────────────────────────────────────────
   2c. HELPER FUNCTIONS
──────────────────────────────────────────────────────────────── */

/** Fetch full memory records required for FSRS tier classification. */
function fetchMemoryRecords(memoryIds: number[]): Map<number, TierInput> {
  const records = new Map<number, TierInput>();
  if (memoryIds.length === 0) return records;

  const db = attentionDecay.getDb();
  if (!db) return records;

  try {
    const stmt = db.prepare(
      'SELECT * FROM memory_index WHERE id = ?'
    );
    for (const id of memoryIds) {
      const row = stmt.get(id) as TierInput | undefined;
      if (row) {
        records.set(row.id as number, row);
      }
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
  }

  return records;
}

/** Get tiered content for a memory based on its tier state (HOT=full, WARM=summary, COLD=excluded) */
async function getTieredContent(
  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
  tier: string
): Promise<string> {
  if (tier === 'COLD' || tier === 'DORMANT' || tier === 'ARCHIVED') return '';
  try {
    const fs = await import('fs');
    const validatedPath = validateTieredFilePath(memoryInfo.filePath);
    const canonicalPath = validateTieredFilePath(fs.realpathSync(validatedPath));
    const content = fs.readFileSync(canonicalPath, 'utf-8');
    if (tier === 'HOT') return content;
    // WARM tier returns truncated summary
    return content.substring(0, 150) + (content.length > 150 ? '...' : '');
  } catch (_error: unknown) {
    console.warn('[memory-triggers] getTieredContent failed', {
      filePath: memoryInfo.filePath, // server-side only; safe to log
      tier,
      error: _error instanceof Error ? _error.message : String(_error),
    });
    return '';
  }
}

/* ───────────────────────────────────────────────────────────────
   3. MATCH TRIGGERS HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
  const {
    prompt,
    limit: rawLimit = 3,
    session_id: rawSessionId,
    turnNumber: rawTurnNumber = 1,
    include_cognitive: includeCognitive = true
  } = args;

  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
  if (!prompt || typeof prompt !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_match_triggers',
      error: 'prompt is required and must be a string',
      code: 'E_VALIDATION',
      details: { parameter: 'prompt' },
      recovery: {
        hint: 'Provide a non-empty string for the prompt parameter'
      }
    });
  }

  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
  // manager to prevent IDOR. Callers cannot read/write working memory for
  // arbitrary sessions — only server-minted or previously tracked sessions.
  let sessionId: string | undefined = rawSessionId;
  if (rawSessionId) {
    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
      tenantId: args.tenantId,
      userId: args.userId,
      agentId: args.agentId,
    });
    if (trustedSession.error) {
      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
      return createMCPErrorResponse({
        tool: 'memory_match_triggers',
        error: trustedSession.error,
        code: 'E_SESSION_SCOPE',
        details: { requestedSessionId: rawSessionId },
        recovery: {
          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
        },
      });
    }
    sessionId = trustedSession.effectiveSessionId;
  }

  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 50)
    : 3;
  const turnNumber = (typeof rawTurnNumber === 'number' && Number.isFinite(rawTurnNumber) && rawTurnNumber >= 0)
    ? Math.floor(rawTurnNumber)
    : 1;

  await checkDatabaseUpdated();

  const startTime = Date.now();

  // Eval logger — capture trigger query at entry (fail-safe)
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: prompt,
      intent: 'trigger_match',
      specFolder: null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }

  const logFinalTriggerEval = (memoryIds: number[], latencyMs: number): void => {
    try {
      if (_evalRunId && _evalQueryId) {
        logFinalResult({
          evalRunId: _evalRunId,
          queryId: _evalQueryId,
          resultMemoryIds: memoryIds,
          scores: memoryIds.map(() => 1.0), // trigger matches are binary
          fusionMethod: 'trigger',
          latencyMs,
        });
      }
    } catch (_error: unknown) {
      /* eval logging must never break triggers handler */
    }
  };

  const useCognitive = includeCognitive &&
    sessionId &&
    workingMemory.isEnabled() &&
    attentionDecay.getDb();

  let decayStats: DecayStats | null = null;
  if (useCognitive) {
    try {

exec
/bin/zsh -lc "sed -n '280,560p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    try {
      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      console.warn('[memory_match_triggers] Decay failed:', message);
    }
  }

  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
  let results: TriggerMatch[] = triggerMatchResult.matches;

  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
    try {
      const database = initialize_db();
      const memoryIds = results.map(r => r.memoryId);
      if (memoryIds.length > 0) {
        const placeholders = memoryIds.map(() => '?').join(',');
        const scopeRows = database.prepare(`
          SELECT id, spec_folder, tenant_id, user_id, agent_id, shared_space_id
          FROM memory_index WHERE id IN (${placeholders})
        `).all(...memoryIds) as Array<{
          id: number;
          spec_folder?: string;
          tenant_id?: string;
          user_id?: string;
          agent_id?: string;
          shared_space_id?: string;
        }>;
        const scopeMap = new Map(scopeRows.map(r => [r.id, r]));
        results = results.filter(match => {
          const row = scopeMap.get(match.memoryId);
          if (!row) return false;
          // H2 FIX: Require exact scope match — rows with NULL scope are excluded
          // when the caller specifies a scope, not silently passed through.
          if (specFolder && row.spec_folder !== specFolder) return false;
          if (tenantId && row.tenant_id !== tenantId) return false;
          if (userId && row.user_id !== userId) return false;
          if (agentId && row.agent_id !== agentId) return false;
          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
          return true;
        });
      }
    } catch (scopeErr: unknown) {
      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
      results = [];
    }
  }
  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
    ? triggerMatchResult.stats.signals
    : [];
  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;

  if (!results || results.length === 0) {
    const noMatchResponse = createMCPEmptyResponse({
      tool: 'memory_match_triggers',
      summary: 'No matching trigger phrases found',
      data: {
        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
        degradedMatching: degradedTriggerMatching,
        cognitive: useCognitive ? {
          enabled: true,
          sessionId,
          turnNumber: turnNumber,
          decayApplied: decayStats ? decayStats.decayedCount : 0
        } : null
      },
      hints: [
        'Ensure memories have trigger phrases defined',
        'Try a different prompt or check memory content',
        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
      ],
      startTime: startTime
    });

    logFinalTriggerEval([], Date.now() - startTime);
    return noMatchResponse;
  }

  let formattedResults: FormattedResult[];
  let cognitiveStats: CognitiveStats | null = null;

  if (useCognitive) {
    // Step 3: ACTIVATE (T209)
    const activatedMemories: number[] = [];
    for (const match of results) {
      try {
        attentionDecay.activateMemory(match.memoryId);
        // T209: Persist max attention boost for matched memories.
        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
        activatedMemories.push(match.memoryId);
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
      }
    }

    // Step 4: CO-ACTIVATE
    const coActivatedMemories: CoActivatedMemory[] = [];
    if (coActivation.isEnabled()) {
      for (const memoryId of activatedMemories) {
        try {
          const boosted: CoActivatedMemory[] | null = coActivation.spreadActivation([memoryId])
            .map(r => ({ memoryId: r.id }));
          if (boosted && Array.isArray(boosted)) {
            coActivatedMemories.push(...boosted);
          }
        } catch (err: unknown) {
          const message = toErrorMessage(err);
          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
        }
      }
    }

    const matchedIds = results.map((m: TriggerMatch) => m.memoryId);
    const fullRecords = fetchMemoryRecords(matchedIds);

    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
      .map(wm => ({ memoryId: (wm.id as number) || 0, attentionScore: (wm.attention_score as number) || 1.0 }));

    const turnDecayFactor = turnNumber > 1
      ? Math.pow(TURN_DECAY_RATE, turnNumber - 1)
      : 1.0;

    const enrichedResults: EnrichedTriggerMatch[] = results.map((match: TriggerMatch) => {
      const fullRecord = fullRecords.get(match.memoryId);
      const wmEntry = sessionMemories.find(wm => wm.memoryId === match.memoryId);

      let attentionScore: number;
      let tier: string;

      if (fullRecord) {
        const classification = tierClassifier.classifyTier(fullRecord);
        let effectiveRetrievability = classification.retrievability;

        if (wmEntry) {
          // WM already applies its own decay — skip turnDecayFactor to avoid double-decay.
          effectiveRetrievability = Math.min(effectiveRetrievability, wmEntry.attentionScore);
        } else {
          effectiveRetrievability *= turnDecayFactor;
        }

        attentionScore = effectiveRetrievability;
        tier = tierClassifier.classifyState(effectiveRetrievability);
      } else {
        // When no FSRS record, use WM score directly (already session-decayed) or apply turn decay
        const baseScore = wmEntry ? wmEntry.attentionScore : 1.0;
        attentionScore = wmEntry ? baseScore : baseScore * turnDecayFactor;
        tier = tierClassifier.classifyState(attentionScore);
      }

      // Clamp to [0,1] — retrievability * decay or wmEntry scores
      // Can drift outside the valid range due to floating-point arithmetic.
      attentionScore = Math.max(0, Math.min(1, attentionScore));

      return {
        ...match,
        attentionScore: attentionScore,
        tier,
        coActivated: coActivatedMemories.some(ca => ca.memoryId === match.memoryId)
      };
    });

    const tieredResults = tierClassifier.filterAndLimitByState(enrichedResults, null, limit);

    formattedResults = await Promise.all(tieredResults.map(async (r: EnrichedTriggerMatch) => {
      const content: string = await getTieredContent({
        filePath: r.filePath,
        title: r.title,
        triggerPhrases: r.matchedPhrases
      }, r.tier);

      return {
        memoryId: r.memoryId,
        specFolder: r.specFolder,
        filePath: r.filePath,
        title: r.title,
        matchedPhrases: r.matchedPhrases,
        importanceWeight: r.importanceWeight,
        tier: r.tier,
        attentionScore: r.attentionScore,
        content: content,
        coActivated: r.coActivated || false
      };
    }));

    cognitiveStats = {
      enabled: true,
      sessionId: sessionId!,
      turnNumber: turnNumber,
      decayApplied: decayStats ? decayStats.decayedCount : 0,
      memoriesActivated: activatedMemories.length,
      coActivations: coActivatedMemories.length,
      tierDistribution: tierClassifier.getStateStats(enrichedResults),
      tokenMetrics: calculateTokenMetrics(results, formattedResults)
    };

  } else {
    formattedResults = results.slice(0, limit).map((r: TriggerMatch) => ({
      memoryId: r.memoryId,
      specFolder: r.specFolder,
      filePath: r.filePath,
      title: r.title,
      matchedPhrases: r.matchedPhrases,
      importanceWeight: r.importanceWeight
    }));
  }

  const latencyMs = Date.now() - startTime;
  if (latencyMs > 100) {
    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
  }

  const summary = useCognitive
    ? `Matched ${formattedResults.length} memories with cognitive features`
    : `Matched ${formattedResults.length} memories via trigger phrases`;

  const hints: string[] = [];
  if (!useCognitive && sessionId) {
    hints.push('Enable cognitive features with include_cognitive: true');
  }
  const coldCount = cognitiveStats?.tierDistribution?.COLD;
  if (coldCount !== undefined && coldCount > 0) {
    hints.push(`${coldCount} COLD-tier memories excluded for token efficiency`);
  }
  if (detectedSignals.length > 0) {
    hints.push(`Signal vocabulary applied (${detectedSignals.length} category matches)`);
  }

  const _triggersResponse = createMCPSuccessResponse({
    tool: 'memory_match_triggers',
    summary,
    data: {
      matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
      count: formattedResults.length,
      results: formattedResults,
      degradedMatching: degradedTriggerMatching,
      cognitive: cognitiveStats
    },
    hints,
    startTime: startTime,
    extraMeta: {
      latencyMs: latencyMs,
      triggerSignals: detectedSignals,
      ...(degradedTriggerMatching ? { degradedMatching: degradedTriggerMatching } : {}),
    }
  });

  // Consumption instrumentation — log triggers event (fail-safe, never throws)
  try {
    const db = attentionDecay.getDb();
    if (db) {
      initConsumptionLog(db);
      const resultIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
      logConsumptionEvent(db, {
        event_type: 'triggers',
        query_text: prompt,
        result_count: formattedResults.length,
        result_ids: resultIds,
        session_id: sessionId ?? null,
        latency_ms: latencyMs,
      });
    }
  } catch (_error: unknown) { /* instrumentation must never cause triggers handler to fail */ }

  // Eval logger — capture final trigger results at exit (fail-safe)
  const triggerMemoryIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
  logFinalTriggerEval(triggerMemoryIds, latencyMs);

  return _triggersResponse;
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  handleMemoryMatchTriggers,
};


exec
/bin/zsh -lc "rg -n \"strategy: 'resume'|handleMemorySearch\\(|handleMemoryMatchTriggers\\(|classifyQueryIntent|code_graph_query|structural\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
15:// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
16:import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
187:  structuralRoutingNudge: StructuralRoutingNudgeMeta | null;
201:  preferredTool: 'code_graph_query';
306:  if (!queryIntentMetadata || queryIntentMetadata.queryIntent !== 'structural' || queryIntentMetadata.confidence <= 0.65) {
323:    preferredTool: 'code_graph_query',
324:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
611:      // JSON parse failed — fall through to structural truncation
677:    strategy: 'resume',
701:  const result = await handleMemoryMatchTriggers({
721:  const result = await handleMemorySearch({
752:  const result = await handleMemorySearch({
786:  const result = await handleMemorySearch({
810:    strategy: 'resume',
1011:    structuralRoutingNudge,
1069:    structuralRoutingNudge,
1131:  // graph context for structural/hybrid queries. Entire block is
1144:      const classification = classifyQueryIntent(normalizedInput);
1147:        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
1148:          ? 'structural'
1169:      if (classification.intent === 'structural' && classification.confidence > 0.65) {
1460:  const structuralRoutingNudge = buildStructuralRoutingNudge(
1465:  if (structuralRoutingNudge) {
1466:    responseData.structuralRoutingNudge = structuralRoutingNudge;
1480:      ...(structuralRoutingNudge ? [structuralRoutingNudge.message] : []),
1503:      structuralRoutingNudge,

exec
/bin/zsh -lc "sed -n '640,830p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1120,1195p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

const CONTEXT_MODES: Record<string, ContextMode> = {
  // Auto-detect: Let the system determine the best approach
  auto: {
    name: 'Auto',
    description: 'Automatically detect intent and route to optimal strategy',
    strategy: 'adaptive'
  },

  // Quick: Fast trigger-based matching for reactive context
  quick: {
    name: 'Quick',
    description: 'Fast trigger matching for real-time context (low latency)',
    strategy: 'triggers',
    tokenBudget: 800
  },

  // Deep: Comprehensive semantic search with full context
  deep: {
    name: 'Deep',
    description: 'Semantic search with full context retrieval',
    strategy: 'search',
    tokenBudget: 3500
  },

  // Focused: Intent-specific search with optimized weights
  focused: {
    name: 'Focused',
    description: 'Intent-aware search with task-specific optimization',
    strategy: 'intent-search',
    tokenBudget: 3000
  },

  // Resume: Session recovery mode
  resume: {
    name: 'Resume',
    description: 'Resume previous work with state and next-steps anchors',
    strategy: 'resume',
    tokenBudget: 2000
  }
};

/* ───────────────────────────────────────────────────────────────
   4. INTENT-TO-MODE ROUTING
──────────────────────────────────────────────────────────────── */

const INTENT_TO_MODE: Record<string, string> = {
  add_feature: 'deep',
  fix_bug: 'focused',
  refactor: 'deep',
  security_audit: 'deep',
  understand: 'focused',
  find_spec: 'deep',
  find_decision: 'focused'
};

/* ───────────────────────────────────────────────────────────────
   5. CONTEXT STRATEGY EXECUTORS
──────────────────────────────────────────────────────────────── */

async function executeQuickStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemoryMatchTriggers({
    prompt: input,
    specFolder: options.specFolder,
    tenantId: options.tenantId,
    userId: options.userId,
    agentId: options.agentId,
    sharedSpaceId: options.sharedSpaceId,
    limit: options.limit || 5,
    session_id: options.sessionId,
    include_cognitive: true
  });

  return {
    strategy: 'quick',
    mode: 'quick',
    ...result
  };
}

async function executeDeepStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemorySearch({
    query: input,
    specFolder: options.specFolder,
    folderBoost: options.folderBoost,
    tenantId: options.tenantId,
    userId: options.userId,
    agentId: options.agentId,
    sharedSpaceId: options.sharedSpaceId,
    limit: options.limit || 10,
    includeConstitutional: true,
    includeContent: options.includeContent || false,
    includeTrace: options.includeTrace || false, // CHK-040
    anchors: options.anchors,
    sessionId: options.sessionId,
    sessionTransition: options.sessionTransition,
    enableDedup: options.enableDedup !== false,
    profile: options.profile,
    intent: intent ?? undefined,
    autoDetectIntent: intent ? false : true,
    useDecay: true,
    // minState omitted — memoryState column not yet in schema
  });

  return {
    strategy: 'deep',
    mode: 'deep',
    ...result
  };
}

async function executeFocusedStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemorySearch({
    query: input,
    specFolder: options.specFolder,
    folderBoost: options.folderBoost,
    tenantId: options.tenantId,
    userId: options.userId,
    agentId: options.agentId,
    sharedSpaceId: options.sharedSpaceId,
    limit: options.limit || 8,
    includeConstitutional: true,
    includeContent: options.includeContent || false,
    includeTrace: options.includeTrace || false, // CHK-040
    anchors: options.anchors,
    sessionId: options.sessionId,
    sessionTransition: options.sessionTransition,
    enableDedup: options.enableDedup !== false,
    profile: options.profile,
    intent: intent ?? undefined,
    autoDetectIntent: intent ? false : true,
    useDecay: true,
    // minState omitted — memoryState column not yet in schema
  });

  return {
    strategy: 'focused',
    mode: 'focused',
    intent: intent,
    ...result
  };
}

async function executeResumeStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];

  const result = await handleMemorySearch({
    query: input || 'resume work continue session',
    specFolder: options.specFolder,
    folderBoost: options.folderBoost,
    tenantId: options.tenantId,
    userId: options.userId,
    agentId: options.agentId,
    sharedSpaceId: options.sharedSpaceId,
    limit: options.limit || 5,
    includeConstitutional: false,
    includeContent: true,
    includeTrace: options.includeTrace || false, // CHK-040
    anchors: resumeAnchors,
    sessionId: options.sessionId,
    sessionTransition: options.sessionTransition,
    enableDedup: false,
    profile: options.profile,
    intent: intent ?? undefined,
    autoDetectIntent: intent ? false : true,
    useDecay: false,
    // minState omitted — memoryState column not yet in schema
  });

  return {
    strategy: 'resume',
    mode: 'resume',
    resumeAnchors: resumeAnchors,
    ...result
  };
}

/* ───────────────────────────────────────────────────────────────
   6. HANDLER HELPERS
──────────────────────────────────────────────────────────────── */

function resolveSessionLifecycle(
  args: ContextArgs,
  db: ReturnType<typeof vectorIndex.getDb> | null,
): SessionLifecycleResolution {
  void db;

  // Security: session scope derived from server context, not caller input
  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
    tenantId: args.tenantId,
    userId: args.userId,

 succeeded in 0ms:
      details: { requestId, layer: 'L1:Orchestration' },
      recovery: {
        hint: 'Provide a query, prompt, or context description'
      }
    });
  }

  const normalizedInput = input.trim();

  // ── Phase 020: Query-Intent Routing ──────────────────────────
  // Classify query intent and optionally augment response with code
  // graph context for structural/hybrid queries. Entire block is
  // wrapped in try/catch — any failure silently falls through to
  // existing semantic logic.
  let queryIntentMetadata: {
    queryIntent: string;
    routedBackend: string;
    confidence: number;
    matchedKeywords?: string[];
  } | null = null;
  let graphContextResult: Record<string, unknown> | null = null;

  if (requested_mode !== 'resume') {
    try {
      const classification = classifyQueryIntent(normalizedInput);
      queryIntentMetadata = {
        queryIntent: classification.intent,
        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
          ? 'structural'
          : classification.intent === 'hybrid'
            ? 'hybrid'
            : 'semantic',
        confidence: classification.confidence,
        matchedKeywords: classification.matchedKeywords,
      };

      // F050: Extract a symbol-like token from the query instead of passing
      // raw prose to buildContext({ subject }). resolveSubjectToRef() matches
      // against code_nodes.name / fq_name, so prose never resolves.
      // Heuristic: pick the first token that looks like a code identifier
      // (contains uppercase, underscore, or dot — e.g. "buildContext", "fq_name",
      // "code-graph-db.ts"). Falls back to first matched keyword, then normalizedInput.
      const codeIdentifierPattern = /[A-Z_.]|^[a-z]+[A-Z]/;
      const inputTokens = normalizedInput.split(/\s+/).filter(t => t.length >= 2);
      const extractedSubject =
        inputTokens.find(t => codeIdentifierPattern.test(t)) ??
        (classification.matchedKeywords?.[0]) ??
        normalizedInput;

      if (classification.intent === 'structural' && classification.confidence > 0.65) {
        try {
          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
          if (cgResult.metadata.totalNodes > 0) {
            graphContextResult = {
              graphContext: cgResult.graphContext,
              textBrief: cgResult.textBrief,
              combinedSummary: cgResult.combinedSummary,
              nextActions: cgResult.nextActions,
              metadata: cgResult.metadata,
            };
          }
        } catch {
          // Code graph unavailable — fall through to semantic
        }
      } else if (classification.intent === 'hybrid') {
        try {
          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
          if (cgResult.metadata.totalNodes > 0) {
            graphContextResult = {
              graphContext: cgResult.graphContext,
              textBrief: cgResult.textBrief,
              combinedSummary: cgResult.combinedSummary,
              nextActions: cgResult.nextActions,
              metadata: cgResult.metadata,
            };
          }

exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Trigger Matcher
// ───────────────────────────────────────────────────────────────
// Feature catalog: Trigger phrase matching (memory_match_triggers)
import type Database from 'better-sqlite3';
import * as vectorIndex from '../search/vector-index.js';
import { escapeRegex } from '../utils/path-security.js';

/* --- 1. TYPES --- */

/** Signal category detected in user prompt */
export type SignalCategory = 'correction' | 'preference' | 'reinforcement' | 'neutral';

/** Result of signal detection for a prompt */
export interface SignalDetection {
  category: SignalCategory;
  keywords: string[];
  boost: number;
}

/** Trigger cache entry for a single phrase-to-memory mapping */
export interface TriggerCacheEntry {
  triggerId: number;
  phrase: string;
  regex: RegExp;
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  importanceWeight: number;
}

/** Match result grouped by memory */
export interface TriggerMatch {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  importanceWeight: number;
  matchedPhrases: string[];
  [key: string]: unknown;
}

/** Match result with additional statistics */
export interface TriggerMatchWithStats {
  matches: TriggerMatch[];
  stats: TriggerMatchStats;
}

/** Statistics about a trigger matching operation */
export interface TriggerMatchStats {
  promptLength: number;
  cacheSize: number;
  matchCount: number;
  totalMatchedPhrases: number;
  matchTimeMs: number;
  signals?: SignalDetection[];
  degraded?: TriggerMatcherDegradedState;
}

/** Cache statistics */
export interface CacheStats {
  size: number;
  timestamp: number;
  ageMs: number | null;
  regexCacheSize: number;
  maxRegexCacheSize: number;
}

export interface TriggerMatcherFailure {
  code: string;
  message: string;
  memoryId?: number;
  filePath?: string;
}

export interface TriggerMatcherDegradedState {
  code: string;
  message: string;
  failedEntries: number;
  failures: TriggerMatcherFailure[];
}

/** Memory result from getMemoriesByPhrase */
export interface MemoryByPhrase {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  importanceWeight: number;
}

/** Execution time log entry */
export interface ExecutionLogEntry {
  timestamp: string;
  operation: string;
  durationMs: number;
  target: string;
  [key: string]: unknown;
}

/** Trigger matcher configuration */
export interface TriggerMatcherConfig {
  CACHE_TTL_MS: number;
  DEFAULT_LIMIT: number;
  MIN_PHRASE_LENGTH: number;
  MAX_PROMPT_LENGTH: number;
  WARN_THRESHOLD_MS: number;
  LOG_EXECUTION_TIME: boolean;
  MAX_REGEX_CACHE_SIZE: number;
}

/* --- 2. CONFIGURATION --- */

/**
 * Defines the CONFIG constant.
 */
export const CONFIG: TriggerMatcherConfig = {
  CACHE_TTL_MS: 60000,
  DEFAULT_LIMIT: 3,
  MIN_PHRASE_LENGTH: 3,
  MAX_PROMPT_LENGTH: 5000,
  WARN_THRESHOLD_MS: 30,
  LOG_EXECUTION_TIME: true,
  MAX_REGEX_CACHE_SIZE: 100,
};

/* --- 3. EXECUTION TIME LOGGING --- */

/** Log hook execution time for monitoring and debugging */
export function logExecutionTime(operation: string, durationMs: number, details: Record<string, unknown> = {}): ExecutionLogEntry | undefined {
  if (!CONFIG.LOG_EXECUTION_TIME) {
    return;
  }

  const logEntry: ExecutionLogEntry = {
    timestamp: new Date().toISOString(),
    operation,
    durationMs: durationMs,
    target: durationMs < 50 ? 'PASS' : 'SLOW',
    ...details,
  };

  // Log to console for debugging
  if (durationMs >= CONFIG.WARN_THRESHOLD_MS) {
    console.warn(`[trigger-matcher] ${operation}: ${durationMs}ms (target <50ms)`, details);
  } else if (process.env.DEBUG_TRIGGER_MATCHER) {
    console.error(`[trigger-matcher] ${operation}: ${durationMs}ms`, details);
  }

  // Return the entry for test verification
  return logEntry;
}

/* --- 4. TRIGGER CACHE --- */

// In-memory cache of trigger phrases for fast matching
let triggerCache: TriggerCacheEntry[] | null = null;
let triggerCandidateIndex: Map<string, Set<number>> | null = null;
let cacheTimestamp: number = 0;
let lastDegradedState: TriggerMatcherDegradedState | null = null;
const triggerCacheLoaderStatementByConnection = new WeakMap<Database.Database, Database.Statement>();

// LRU cache for regex objects to prevent memory leaks
const regexLruCache: Map<string, RegExp> = new Map();
const UNICODE_WORD_CHAR_CLASS = '\\p{L}\\p{N}\\p{M}';
const UNICODE_TOKEN_PATTERN = /[\p{L}\p{N}\p{M}]+/gu;
const CJK_SCRIPT_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
const MIN_INDEX_NGRAM_SIZE = 2;
const MAX_INDEX_NGRAM_SIZE = 3;
const COMMON_TRIGGER_STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'to', 'of', 'in', 'on', 'at', 'for', 'from', 'with', 'by',
]);
const TRIGGER_CACHE_LOADER_SQL = `
  SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
  FROM memory_index
  WHERE embedding_status = 'success'
    AND trigger_phrases IS NOT NULL
    AND trigger_phrases != '[]'
    AND trigger_phrases != ''
  ORDER BY id ASC
`;

function getTriggerCacheLoaderStatement(database: Database.Database): Database.Statement {
  const cachedStatement = triggerCacheLoaderStatementByConnection.get(database);
  if (cachedStatement) {
    return cachedStatement;
  }

  const statement = database.prepare(TRIGGER_CACHE_LOADER_SQL) as Database.Statement;
  triggerCacheLoaderStatementByConnection.set(database, statement);
  return statement;
}

export function normalizeTriggerText(text: string): string {
  return normalizeUnicode(text, false)
    .trim()
    .replace(/\s+/g, ' ');
}

function buildBoundaryRegex(phrase: string): RegExp {
  const normalizedPhrase = normalizeTriggerText(phrase);
  const escaped = escapeRegex(normalizedPhrase);

  // CJK text often appears in continuous sentence flow without whitespace-delimited
  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
  // phrases are not rejected by boundary checks on neighboring CJK characters.
  if (CJK_SCRIPT_PATTERN.test(normalizedPhrase) && !/\s/u.test(normalizedPhrase)) {
    return new RegExp(escaped, 'iu');
  }

  return new RegExp(
    `(?:^|[^${UNICODE_WORD_CHAR_CLASS}])${escaped}(?:[^${UNICODE_WORD_CHAR_CLASS}]|$)`,
    'iu'
  );
}

function getUnicodeTokens(text: string): string[] {
  const normalized = normalizeTriggerText(text);
  if (!normalized) {
    return [];
  }

  return Array.from(normalized.matchAll(UNICODE_TOKEN_PATTERN), (match) => match[0]);
}

function isSignificantIndexToken(token: string): boolean {
  if (!token) {
    return false;
  }

  return token.length >= CONFIG.MIN_PHRASE_LENGTH && !COMMON_TRIGGER_STOPWORDS.has(token);
}

function extractTriggerIndexKeys(text: string): string[] {
  const normalized = normalizeTriggerText(text);
  if (!normalized) {
    return [];
  }

  const rawTokens = getUnicodeTokens(normalized);
  const tokens = rawTokens.filter(isSignificantIndexToken);
  const basis = tokens.length > 0 ? tokens : rawTokens;
  const keys = new Set<string>();

  for (const token of basis) {
    if (token) {
      keys.add(token);
    }
  }

  for (let size = MIN_INDEX_NGRAM_SIZE; size <= MAX_INDEX_NGRAM_SIZE; size += 1) {
    if (basis.length < size) {
      continue;
    }

    for (let index = 0; index <= basis.length - size; index += 1) {
      keys.add(basis.slice(index, index + size).join(' '));
    }
  }

  if (keys.size === 0) {
    keys.add(normalized);
  }

  return [...keys];
}

function indexTriggerEntry(entry: TriggerCacheEntry): void {
  if (!triggerCandidateIndex) {
    triggerCandidateIndex = new Map();
  }

  const keys = extractTriggerIndexKeys(entry.phrase);
  for (const key of keys) {
    const indexedIds = triggerCandidateIndex.get(key);
    if (indexedIds) {
      indexedIds.add(entry.triggerId);

exec
/bin/zsh -lc 'rg -n "LIKE|MATCH|fts|bm25|trigger|normalizeLexicalQueryTokens|tokenize|exact|substring|phrase" .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
21:/** Trigger cache entry for a single phrase-to-memory mapping */
23:  triggerId: number;
24:  phrase: string;
50:/** Statistics about a trigger matching operation */
146:    console.warn(`[trigger-matcher] ${operation}: ${durationMs}ms (target <50ms)`, details);
147:  } else if (process.env.DEBUG_TRIGGER_MATCHER) {
148:    console.error(`[trigger-matcher] ${operation}: ${durationMs}ms`, details);
157:// In-memory cache of trigger phrases for fast matching
158:let triggerCache: TriggerCacheEntry[] | null = null;
159:let triggerCandidateIndex: Map<string, Set<number>> | null = null;
162:const triggerCacheLoaderStatementByConnection = new WeakMap<Database.Database, Database.Statement>();
177:  SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
180:    AND trigger_phrases IS NOT NULL
181:    AND trigger_phrases != '[]'
182:    AND trigger_phrases != ''
187:  const cachedStatement = triggerCacheLoaderStatementByConnection.get(database);
193:  triggerCacheLoaderStatementByConnection.set(database, statement);
203:function buildBoundaryRegex(phrase: string): RegExp {
204:  const normalizedPhrase = normalizeTriggerText(phrase);
208:  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
209:  // phrases are not rejected by boundary checks on neighboring CJK characters.
272:  if (!triggerCandidateIndex) {
273:    triggerCandidateIndex = new Map();
276:  const keys = extractTriggerIndexKeys(entry.phrase);
278:    const indexedIds = triggerCandidateIndex.get(key);
280:      indexedIds.add(entry.triggerId);
284:    triggerCandidateIndex.set(key, new Set([entry.triggerId]));
288:function isSpecificTriggerPhrase(phrase: string): boolean {
289:  const normalized = normalizeTriggerText(phrase);
306:/** Get or create a cached regex for a trigger phrase. @param phrase - The trigger phrase @returns Compiled RegExp */
307:export function getCachedRegex(phrase: string): RegExp {
308:  const normalizedPhrase = normalizeTriggerText(phrase);
337:/** Load all trigger phrases from the index into memory */
342:  if (triggerCache && (now - cacheTimestamp) < CONFIG.CACHE_TTL_MS) {
343:    return triggerCache;
349:    // Because trigger-matcher may be the first module to access the database in the
357:      console.warn('[trigger-matcher] Database not initialized. Server may still be starting up.');
366:      trigger_phrases: string;
371:    triggerCache = [];
372:    triggerCandidateIndex = new Map();
375:      let phrases: unknown;
377:        phrases = JSON.parse(row.trigger_phrases);
380:        console.warn(`[trigger-matcher] Failed to parse trigger phrases for memory ${row.id}: ${message}`);
390:      if (!Array.isArray(phrases)) {
394:      for (const phrase of phrases) {
395:        if (typeof phrase !== 'string') {
399:        const normalizedPhrase = normalizeTriggerText(phrase);
405:          triggerId: triggerCache.length,
406:          phrase: normalizedPhrase,
415:        triggerCache.push(entry);
429:    return triggerCache;
432:    console.warn(`[trigger-matcher] Cache load failed: ${message}`);
443:/** Clear the trigger cache (useful for testing or after updates) */
445:  triggerCache = null;
446:  triggerCandidateIndex = null;
455:    size: triggerCache ? triggerCache.length : 0,
463:/* --- 5. STRING MATCHING --- */
487:/** Check if a phrase exists in text with word boundaries */
488:export function matchPhraseWithBoundary(text: string, phrase: string, precompiledRegex: RegExp | null = null): boolean {
494:  return buildBoundaryRegex(phrase).test(normalizeUnicode(text, false));
506:  'let me rephrase',
525:  'exactly',
619:/* --- 7. MAIN MATCHING FUNCTION --- */
621:/** Match user prompt against trigger phrases using exact string matching */
632:    ? userPrompt.substring(0, CONFIG.MAX_PROMPT_LENGTH)
646:  // Match against all cached phrases
650:    if (matchPhraseWithBoundary(promptNormalized, entry.phrase, entry.regex)) {
666:      match.matchedPhrases.push(entry.phrase);
670:  // Sort by: 1) Number of matched phrases (desc), 2) Importance weight (desc)
673:      const phraseDiff = b.matchedPhrases.length - a.matchedPhrases.length;
674:      if (phraseDiff !== 0) {
675:        return phraseDiff;
683:  logExecutionTime('match_trigger_phrases', elapsed, {
694:/** Match trigger phrases with additional stats */
725:/** Get all unique trigger phrases in the cache */
728:  return [...new Set(cache.map(e => e.phrase))];
732:  if (cache.length === 0 || !triggerCandidateIndex || triggerCandidateIndex.size === 0) {
743:    const indexedIds = triggerCandidateIndex.get(key);
748:    for (const triggerId of indexedIds) {
749:      candidateIds.add(triggerId);
759:    .map((triggerId) => cache[triggerId])
763:/** Get memories by trigger phrase */
764:export function getMemoriesByPhrase(phrase: string): MemoryByPhrase[] {
766:  const normalizedPhrase = normalizeTriggerText(phrase);
772:    if (entry.phrase === normalizedPhrase && !memoryIds.has(entry.memoryId)) {
787:/** Refresh trigger cache (forces reload on next access) */

exec
/bin/zsh -lc "sed -n '619,690p' .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/* --- 7. MAIN MATCHING FUNCTION --- */

/** Match user prompt against trigger phrases using exact string matching */
export function matchTriggerPhrases(userPrompt: string, limit: number = CONFIG.DEFAULT_LIMIT): TriggerMatch[] {
  const startTime = Date.now();

  // Validation
  if (!userPrompt || typeof userPrompt !== 'string') {
    return [];
  }

  // Truncate very long prompts
  const prompt = userPrompt.length > CONFIG.MAX_PROMPT_LENGTH
    ? userPrompt.substring(0, CONFIG.MAX_PROMPT_LENGTH)
    : userPrompt;

  const promptNormalized = normalizeUnicode(prompt, false);

  // Load cache (fast if already loaded)
  const cache = loadTriggerCache();

  if (cache.length === 0) {
    return [];
  }

  const candidateEntries = getTriggerCandidates(promptNormalized, cache);

  // Match against all cached phrases
  const matchesByMemory = new Map<number, TriggerMatch>();

  for (const entry of candidateEntries) {
    if (matchPhraseWithBoundary(promptNormalized, entry.phrase, entry.regex)) {
      const key = entry.memoryId;

      let match = matchesByMemory.get(key);
      if (!match) {
        match = {
          memoryId: entry.memoryId,
          specFolder: entry.specFolder,
          filePath: entry.filePath,
          title: entry.title,
          importanceWeight: entry.importanceWeight,
          matchedPhrases: [],
        };
        matchesByMemory.set(key, match);
      }

      match.matchedPhrases.push(entry.phrase);
    }
  }

  // Sort by: 1) Number of matched phrases (desc), 2) Importance weight (desc)
  const results = Array.from(matchesByMemory.values())
    .sort((a, b) => {
      const phraseDiff = b.matchedPhrases.length - a.matchedPhrases.length;
      if (phraseDiff !== 0) {
        return phraseDiff;
      }
      return b.importanceWeight - a.importanceWeight;
    })
    .slice(0, limit);

  // Performance logging (CHK069)
  const elapsed = Date.now() - startTime;
  logExecutionTime('match_trigger_phrases', elapsed, {
    promptLength: prompt.length,
    cacheSize: cache.length,
    candidateCount: candidateEntries.length,
    matchCount: results.length,
    totalPhrases: results.reduce((sum, m) => sum + m.matchedPhrases.length, 0),
  });


exec
/bin/zsh -lc "sed -n '288,315p' .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
function isSpecificTriggerPhrase(phrase: string): boolean {
  const normalized = normalizeTriggerText(phrase);
  if (normalized.length < CONFIG.MIN_PHRASE_LENGTH) {
    return false;
  }

  const tokens = normalized.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return false;
  }

  if (tokens.length === 1) {
    return !COMMON_TRIGGER_STOPWORDS.has(tokens[0]);
  }

  return tokens.some((token) => token.length >= CONFIG.MIN_PHRASE_LENGTH);
}

/** Get or create a cached regex for a trigger phrase. @param phrase - The trigger phrase @returns Compiled RegExp */
export function getCachedRegex(phrase: string): RegExp {
  const normalizedPhrase = normalizeTriggerText(phrase);

  // Check if already in cache
  if (regexLruCache.has(normalizedPhrase)) {
    // Move to end (most recently used) by deleting and re-adding
    const regex = regexLruCache.get(normalizedPhrase);
    if (regex) {
      regexLruCache.delete(normalizedPhrase);

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
#!/usr/bin/env python3
"""
MemPalace — Give your AI a memory. No API key required.

Two ways to ingest:
  Projects:      mempalace mine ~/projects/my_app          (code, docs, notes)
  Conversations: mempalace mine ~/chats/ --mode convos     (Claude, ChatGPT, Slack)

Same palace. Same search. Different ingest strategies.

Commands:
    mempalace init <dir>                  Detect rooms from folder structure
    mempalace split <dir>                 Split concatenated mega-files into per-session files
    mempalace mine <dir>                  Mine project files (default)
    mempalace mine <dir> --mode convos    Mine conversation exports
    mempalace search "query"              Find anything, exact words
    mempalace mcp                         Show MCP setup command
    mempalace wake-up                     Show L0 + L1 wake-up context
    mempalace wake-up --wing my_app       Wake-up for a specific project
    mempalace status                      Show what's been filed

Examples:
    mempalace init ~/projects/my_app
    mempalace mine ~/projects/my_app
    mempalace mine ~/chats/claude-sessions --mode convos
    mempalace search "why did we switch to GraphQL"
    mempalace search "pricing discussion" --wing my_app --room costs
"""

import os
import sys
import shlex
import argparse
from pathlib import Path

from .config import MempalaceConfig


def cmd_init(args):
    import json
    from pathlib import Path
    from .entity_detector import scan_for_detection, detect_entities, confirm_entities
    from .room_detector_local import detect_rooms_local

    # Pass 1: auto-detect people and projects from file content
    print(f"\n  Scanning for entities in: {args.dir}")
    files = scan_for_detection(args.dir)
    if files:
        print(f"  Reading {len(files)} files...")
        detected = detect_entities(files)
        total = len(detected["people"]) + len(detected["projects"]) + len(detected["uncertain"])
        if total > 0:
            confirmed = confirm_entities(detected, yes=getattr(args, "yes", False))
            # Save confirmed entities to <project>/entities.json for the miner
            if confirmed["people"] or confirmed["projects"]:
                entities_path = Path(args.dir).expanduser().resolve() / "entities.json"
                with open(entities_path, "w") as f:
                    json.dump(confirmed, f, indent=2)
                print(f"  Entities saved: {entities_path}")
        else:
            print("  No entities detected — proceeding with directory-based rooms.")

    # Pass 2: detect rooms from folder structure
    detect_rooms_local(project_dir=args.dir, yes=getattr(args, "yes", False))
    MempalaceConfig().init()


def cmd_mine(args):
    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path
    include_ignored = []
    for raw in args.include_ignored or []:
        include_ignored.extend(part.strip() for part in raw.split(",") if part.strip())

    if args.mode == "convos":
        from .convo_miner import mine_convos

        mine_convos(
            convo_dir=args.dir,
            palace_path=palace_path,
            wing=args.wing,
            agent=args.agent,
            limit=args.limit,
            dry_run=args.dry_run,
            extract_mode=args.extract,
        )
    else:
        from .miner import mine

        mine(
            project_dir=args.dir,
            palace_path=palace_path,
            wing_override=args.wing,
            agent=args.agent,
            limit=args.limit,
            dry_run=args.dry_run,
            respect_gitignore=not args.no_gitignore,
            include_ignored=include_ignored,
        )


def cmd_search(args):
    from .searcher import search, SearchError

    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path
    try:
        search(
            query=args.query,
            palace_path=palace_path,
            wing=args.wing,
            room=args.room,
            n_results=args.results,
        )
    except SearchError:
        sys.exit(1)


def cmd_wakeup(args):
    """Show L0 (identity) + L1 (essential story) — the wake-up context."""
    from .layers import MemoryStack

    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path
    stack = MemoryStack(palace_path=palace_path)

    text = stack.wake_up(wing=args.wing)
    tokens = len(text) // 4
    print(f"Wake-up text (~{tokens} tokens):")
    print("=" * 50)
    print(text)


def cmd_split(args):
    """Split concatenated transcript mega-files into per-session files."""
    from .split_mega_files import main as split_main
    import sys

    # Rebuild argv for split_mega_files argparse
    argv = ["--source", args.dir]
    if args.output_dir:
        argv += ["--output-dir", args.output_dir]
    if args.dry_run:
        argv.append("--dry-run")
    if args.min_sessions != 2:
        argv += ["--min-sessions", str(args.min_sessions)]

    old_argv = sys.argv
    sys.argv = ["mempalace split"] + argv
    try:
        split_main()
    finally:
        sys.argv = old_argv


def cmd_migrate(args):
    """Migrate palace from a different ChromaDB version."""
    from .migrate import migrate

    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path
    migrate(palace_path=palace_path, dry_run=args.dry_run)


def cmd_status(args):
    from .miner import status

    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path
    status(palace_path=palace_path)


def cmd_repair(args):
    """Rebuild palace vector index from SQLite metadata."""
    import chromadb
    import shutil

    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path

    if not os.path.isdir(palace_path):
        print(f"\n  No palace found at {palace_path}")
        return

    print(f"\n{'=' * 55}")
    print("  MemPalace Repair")
    print(f"{'=' * 55}\n")
    print(f"  Palace: {palace_path}")

    # Try to read existing drawers
    try:
        client = chromadb.PersistentClient(path=palace_path)
        col = client.get_collection("mempalace_drawers")
        total = col.count()
        print(f"  Drawers found: {total}")
    except Exception as e:
        print(f"  Error reading palace: {e}")
        print("  Cannot recover — palace may need to be re-mined from source files.")
        return

    if total == 0:
        print("  Nothing to repair.")
        return

    # Extract all drawers in batches
    print("\n  Extracting drawers...")
    batch_size = 5000
    all_ids = []
    all_docs = []
    all_metas = []
    offset = 0
    while offset < total:
        batch = col.get(limit=batch_size, offset=offset, include=["documents", "metadatas"])
        all_ids.extend(batch["ids"])
        all_docs.extend(batch["documents"])
        all_metas.extend(batch["metadatas"])
        offset += batch_size
    print(f"  Extracted {len(all_ids)} drawers")

    # Backup and rebuild
    palace_path = palace_path.rstrip(os.sep)
    backup_path = palace_path + ".backup"
    if os.path.exists(backup_path):
        shutil.rmtree(backup_path)
    print(f"  Backing up to {backup_path}...")
    shutil.copytree(palace_path, backup_path)

    print("  Rebuilding collection...")
    client.delete_collection("mempalace_drawers")
    new_col = client.create_collection("mempalace_drawers")

    filed = 0
    for i in range(0, len(all_ids), batch_size):
        batch_ids = all_ids[i : i + batch_size]
        batch_docs = all_docs[i : i + batch_size]
        batch_metas = all_metas[i : i + batch_size]
        new_col.add(documents=batch_docs, ids=batch_ids, metadatas=batch_metas)
        filed += len(batch_ids)
        print(f"  Re-filed {filed}/{len(all_ids)} drawers...")

    print(f"\n  Repair complete. {filed} drawers rebuilt.")
    print(f"  Backup saved at {backup_path}")
    print(f"\n{'=' * 55}\n")


def cmd_hook(args):
    """Run hook logic: reads JSON from stdin, outputs JSON to stdout."""
    from .hooks_cli import run_hook

    run_hook(hook_name=args.hook, harness=args.harness)


def cmd_instructions(args):
    """Output skill instructions to stdout."""
    from .instructions_cli import run_instructions

    run_instructions(name=args.name)


def cmd_mcp(args):
    """Show how to wire MemPalace into MCP-capable hosts."""
    base_server_cmd = "python -m mempalace.mcp_server"

    if args.palace:
        resolved_palace = str(Path(args.palace).expanduser())
        server_cmd = f"{base_server_cmd} --palace {shlex.quote(resolved_palace)}"

exec
/bin/zsh -lc 'rg -n "fts|bm25|keyword|lexical|exact match|substring|LIKE|MATCH|rank|rerank" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:66:> - **"100% with Haiku rerank"** is real (we have the result files) but the rerank pipeline is not in the public benchmark scripts. We're adding it.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:204:There are also **halls**, which connect rooms within a wing, and **tunnels**, which connect rooms from different wings to one another. So finding things becomes truly effortless — we've given the AI a clean and organized way to know where to start searching, without having to look through every keyword in huge folders.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:539:| **LongMemEval R@5** | Hybrid + Haiku rerank | **100%** (500/500) | ~500 |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:617:    "wing_kai": {"type": "person", "keywords": ["kai", "kai's"]},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:618:    "wing_driftwood": {"type": "project", "keywords": ["driftwood", "analytics", "saas"]}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py:182:    """Score conversation content against topic keywords."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py:185:    for room, keywords in TOPIC_KEYWORDS.items():
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py:186:        score = sum(1 for kw in keywords if kw in content_lower)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/migrate.py:58:              AND em.key NOT LIKE 'chroma:%'
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py:12:No LLM required. Pure keyword/pattern heuristics.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py:346:    """Score text against regex markers. Returns (score, matched_keywords)."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py:349:    keywords = []
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py:354:            keywords.extend(m if isinstance(m, str) else m[0] if m else marker for m in matches)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py:355:    return score, list(set(keywords))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dialect.py:22:  Zettel:   ZID:ENTITIES|topic_keywords|"key_quote"|WEIGHT|EMOTIONS|FLAGS
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dialect.py:415:        """Detect emotions from plain text using keyword signals."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dialect.py:419:        for keyword, code in _EMOTION_SIGNALS.items():
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dialect.py:420:            if keyword in text_lower and code not in seen:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dialect.py:426:        """Detect importance flags from plain text using keyword signals."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dialect.py:430:        for keyword, flag in _FLAG_SIGNALS.items():
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dialect.py:431:            if keyword in text_lower and flag not in seen:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dialect.py:460:        ranked = sorted(freq.items(), key=lambda x: -x[1])
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dialect.py:461:        return [w for w, _ in ranked[:max_topics]]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:19:# Format: {folder_keyword: room_name}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:151:                "keywords": [room_name, original.lower()],
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:161:                "keywords": [],
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:174:    keyword_counts = defaultdict(int)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:182:            for keyword, room in FOLDER_ROOM_MAP.items():
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:183:                if keyword in name_lower:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:184:                    keyword_counts[room] += 1
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:188:    for room, count in sorted(keyword_counts.items(), key=lambda x: x[1], reverse=True):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:194:                    "keywords": [room],
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:201:        rooms = [{"name": "general", "description": "All project files", "keywords": []}]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:249:            rooms.append({"name": new_name, "description": new_desc, "keywords": [new_name]})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:262:                "keywords": r.get("keywords", [r["name"]]),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py:302:        rooms = [{"name": "general", "description": "All project files", "keywords": []}]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py:221:        # Simple substring matching
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py:61:# IGNORE MATCHING
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py:283:    2. Filename matches a room name or keyword
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py:284:    3. Content keyword scoring
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py:291:    # Priority 1: folder path matches room name or keywords
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py:295:            candidates = [room["name"].lower()] + [k.lower() for k in room.get("keywords", [])]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py:304:    # Priority 3: keyword scoring from room keywords + name
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py:307:        keywords = room.get("keywords", []) + [room["name"]]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py:308:        for kw in keywords:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/config.py:172:    def hall_keywords(self):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/config.py:173:        """Mapping of hall names to keyword lists."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/config.py:174:        return self._file_config.get("hall_keywords", DEFAULT_HALL_KEYWORDS)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/config.py:189:                "hall_keywords": DEFAULT_HALL_KEYWORDS,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:31:| **Hybrid v4 + Haiku rerank** | **100%** | Haiku (optional) | ~$0.001 |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:32:| **Hybrid v4 + Sonnet rerank** | **100%** | Sonnet (optional) | ~$0.003 |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:36:The 100% is the competitive story: a perfect score on the standard benchmark for AI memory, verified across all 500 questions and all 6 question types — reproducible with either Haiku or Sonnet as the reranker.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:46:| 1 | **MemPal (hybrid v4 + rerank)** | **100%** | Optional | Haiku | Reproducible, 500/500 |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:48:| 3 | MemPal (hybrid v3 + rerank) | 99.4% | Optional | Haiku | Reproducible |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:49:| 3 | MemPal (palace + rerank) | 99.4% | Optional | Haiku | Independent architecture |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:60:**MemPal hybrid v4 + Haiku rerank (100%) is the first perfect score on LongMemEval — 500/500 questions, all 6 question types at 100%.**
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:75:MemPal is more than 2× Mem0 on this benchmark. With Sonnet rerank, MemPal reaches **100% on LoCoMo** across all 5 question types including temporal-inference (was 46% at baseline).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:93:| **Hybrid v5 + Sonnet rerank (top-50)** | **100%** | **100%** | Sonnet | Structurally guaranteed (top-k > sessions) |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:94:| **bge-large + Haiku rerank (top-15)** | — | **96.3%** | Haiku | Single-hop 86.6%, temporal-inf 87.0% |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:102:| Session, no rerank (top-10) | — | 60.3% | None | Baseline |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:103:| Dialog, no rerank (top-10) | — | 48.0% | None | — |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:129:**With Sonnet rerank, MemPal achieves 100% on every LoCoMo question type — including temporal-inference, which was the hardest category at baseline.**
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:131:**Per-category breakdown (hybrid + Sonnet rerank):**
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:184:**What changed:** Added keyword overlap scoring on top of embedding similarity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:187:fused_score = embedding_score × (1 + keyword_weight × overlap)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:190:When query keywords appear verbatim in a session, that session gets a small boost. The boost is mild enough not to hurt recall when keywords don't match.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:192:**Why it worked:** Some questions use exact terminology ("PostgreSQL", "Dr. Chen", specific names). Pure embedding similarity can rank a semantically-close session above the exact match. Keyword overlap rescues these cases.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:194:**What it still misses:** Temporally-ambiguous questions. Sessions from the right time period rank equally with sessions from wrong time periods.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:212:### Improvement 3: Hybrid v2 + Haiku Rerank → 98.8% (+0.4%)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:214:**What changed:** After retrieval, send the top-K candidates to Claude Haiku with the question. Ask Haiku to re-rank by relevance.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:222:### Improvement 4: Hybrid v3 + Haiku Rerank → 99.4% (+0.6%)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:237:### Improvement 5: Hybrid v4 + Haiku Rerank → **100%** (+0.6%)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:244:The question contained an exact quoted phrase in single quotes. Sessions containing that exact phrase now get a 60% distance reduction. The target session jumped from unranked to rank 1.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:247:Sentence-embedded models give insufficient weight to person names. Capitalized proper nouns are extracted from queries; sessions mentioning that name get a 40% distance reduction. The target session jumped from unranked to rank 2.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:250:The target session said "I still remember the happy high school experiences such as being part of the debate team." Added patterns to preference extraction: `"I still remember X"`, `"I used to X"`, `"when I was in high school X"`, `"growing up X"`. This created a synthetic doc "User has mentioned: positive high school experiences, debate team, AP courses" — which the reunion question now matches. Target session jumped to rank 3.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:254:**Haiku vs. Sonnet rerank:** Both achieve 100% R@5. NDCG@10 is 0.976 (Haiku) vs 0.975 (Sonnet) — statistically identical. Haiku is ~3× cheaper. Sonnet is slightly faster at this task (2.99s/q vs 3.85s/q in our run). Either works; Haiku is the default recommendation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:258:### Parallel Approach: Palace Mode + Haiku Rerank → 99.4% (independent convergence)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:296:| Hybrid v2 + rerank | 98.8% | — | Haiku | ~$0.001 | ✅ Verified |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:297:| Hybrid v3 + rerank | 99.4% | 0.983 | Haiku | ~$0.001 | ✅ Verified |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:298:| Palace + rerank | 99.4% | 0.983 | Haiku | ~$0.001 | ✅ Verified |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:299:| Diary + rerank (98% cache) | 98.2% | 0.956 | Haiku | ~$0.001 | ✅ Partial — full run pending |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:300:| **Hybrid v4 + Haiku rerank** | **100%** | **0.976** | Haiku | ~$0.001 | ✅ Verified |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:301:| **Hybrid v4 + Sonnet rerank** | **100%** | **0.975** | Sonnet | ~$0.003 | ✅ Verified |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:326:### Hybrid v3, no rerank (98.4% range) — no API key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:334:### Hybrid v3 + Haiku rerank (99.4%) — needs API key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:340:  --llm-rerank \
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:344:### Hybrid v4 + Haiku rerank (100%) — needs API key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:350:  --llm-rerank \
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:354:### Hybrid v4 + Sonnet rerank (100%) — needs API key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:360:  --llm-rerank \
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:365:### Palace + Haiku rerank (99.4%) — needs API key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:371:  --llm-rerank \
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:375:### Diary + Haiku rerank (needs precomputed cache) — needs API key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:385:  --llm-rerank \
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:396:### LoCoMo — no rerank (60.3% at top-10)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:403:### LoCoMo — hybrid + Sonnet rerank (100%)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:410:  --llm-rerank \
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:423:| **MemPal** | Raw verbatim text + ChromaDB | 96.6% / 100% | Python + ChromaDB | Open source — 100% LME + 100% LoCoMo w/ rerank |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:498:The LoCoMo 100% result with top-k=50 has a structural issue: each of the 10 conversations has 19–32 sessions, but top-k=50 exceeds that count. This means the ground-truth session is always in the candidate pool regardless of the embedding model's ranking. The Sonnet rerank is essentially doing reading comprehension over all sessions — the embedding retrieval step is bypassed entirely.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:500:**The honest LoCoMo score is the top-10 result: 60.3% without rerank.** A re-run at top-k=10 with the hybrid mode and rerank is the next step for a publishable LoCoMo result.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:514:**The LLM rerank is optional, not required.** The 96.6% baseline needs no API key at any stage — not for indexing, not for retrieval, not for scoring. The 99.4% result adds an optional Haiku rerank step that costs approximately $0.001 per question. This is standard practice: Supermemory ASMR, Mastra, and Hindsight all use LLMs in their retrieval pipelines.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:525:| `results_hybrid_v3_rerank_full500.jsonl` | hybrid+rerank | 99.4% | Haiku |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:526:| `results_palace_rerank_full500.jsonl` | palace+rerank | 99.4% | Haiku |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:527:| `results_diary_haiku_rerank_full500.jsonl` | diary+rerank | 98.2% | 65% cache, partial |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:530:| `results_mempal_hybrid_v4_llmrerank_session_20260325_0930.jsonl` | hybrid_v4+rerank | 100% | Haiku, 500/500 |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:531:| `results_mempal_hybrid_v4_llmrerank_session_20260325_1054.jsonl` | hybrid_v4+rerank | 100% | Sonnet, LME 500/500 |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:532:| `results_locomo_hybrid_llmrerank_session_top50_20260325_1056.json` | locomo hybrid+rerank | 100% | Sonnet, 1986/1986 |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:534:| `results_locomo_hybrid_session_top10_*.json` | locomo hybrid_v5 | 88.9% R@10 | Honest — top-10, no rerank |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:556:### LongMemEval held-out 450 — hybrid_v4 (no rerank, clean score)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:583:### LoCoMo hybrid_v5 — honest top-10 (no rerank)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:587:The v5 fix: extracted person names from keyword overlap scoring. In LoCoMo, both speakers' names appear in every session — including them in keyword boosting gave equal signal to all sessions. Removing them lets predicate keywords ("research", "career") do the actual work.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:598:Beats Memori (81.95%) by 7pp with no reranking. Result file: `results_locomo_hybrid_session_top10_*.json`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:606:**Architecture v2 (conversation-specific routing):** Same room assignments at index time. At query time, route using keyword overlap against per-room aggregated session summaries — the *same text* used to generate the labels. No LLM calls at query time. **Result: 84.8% R@10 (3 rooms), 75.6% R@5.**
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:615:**Gap vs. hybrid_v5:** 4.1pp at R@10. The palace structure is working — room assignments are semantically correct (Caroline's identity dominates; Joanna+Nate in hobbies_creativity). The remaining gap is inherent to filtering: some sessions in room #4 or #5 by keyword score are missed even though they're relevant.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:681:  --mode hybrid_v4 --llm-rerank \
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md:708:  --llm-rerank --llm-model claude-haiku-4-5-20251001
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:19:    python benchmarks/locomo_bench.py /path/to/locomo/data/locomo10.json --mode hybrid --llm-rerank
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:382:    "hobbies_creativity",  # painting, music, sports, art, crafts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:512:def llm_rerank_locomo(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:621:    llm_rerank_enabled=False,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:637:    if llm_rerank_enabled or mode == "palace":
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:655:    rerank_label = f" + LLM re-rank ({llm_model.split('-')[1]})" if llm_rerank_enabled else ""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:663:    print(f"  Mode:        {mode}{rerank_label}")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:747:                # Extract names + predicate keywords once (used by hybrid, rooms, palace)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:771:                    # Score each room by predicate keyword overlap against its aggregate
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:810:                    # Hybrid_v5 rerank within the room (small set — clean signal)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:829:                    #   Score each session's summary by predicate keyword overlap.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:844:                    # Stage 2: embedding query filtered to those rooms, then hybrid rerank
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:872:                    # ── Standard query + optional hybrid rerank ──────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:898:                # LLM rerank
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:899:                if llm_rerank_enabled and api_key:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:900:                    rerank_pool = min(10, len(retrieved_ids))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:901:                    retrieved_ids = llm_rerank_locomo(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:906:                        top_k=rerank_pool,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:941:    print(f"  RESULTS — MemPal ({mode}{rerank_label}, {granularity}, top-{top_k})")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:1008:        help="Retrieval mode: raw, hybrid (v5), rooms (keyword routing), palace (LLM room assignment)",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:1026:    parser.add_argument("--llm-rerank", action="store_true", help="Use LLM to rerank top results")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:1030:        help="Model for LLM rerank (default: claude-sonnet-4-6)",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:1048:        rerank_tag = "_llmrerank" if args.llm_rerank else ""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:1050:            f"benchmarks/results_locomo_{args.mode}{rerank_tag}"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/locomo_bench.py:1062:        args.llm_rerank,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/membench_bench.py:355:        # Hybrid re-scoring: predicate keywords (person names excluded)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:21:- "What degree did I graduate with?" → answer: "Business Administration" — semantically generic, but the exact phrase is findable via keyword match
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:29:Questions like "What was the significant business milestone I mentioned four weeks ago?" contain a time anchor that embeddings don't use at all. The correct session was always semantically in the top-50 — but not ranked first because the temporal signal was invisible to embeddings. A date-proximity boost fixes this.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:40:### Stage 2: Keyword re-ranking
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:41:Extract meaningful keywords from the question (strip stop words). For each retrieved document, compute keyword overlap score. Apply a **distance reduction** proportional to overlap:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:49:- `overlap` — fraction of question keywords found in the document (0.0 to 1.0)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:50:- `0.30` — the boost weight: up to 30% distance reduction for perfect keyword overlap
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:56:After re-ranking, sort by fused_dist ascending. The final ranked list is returned.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:59:The keyword extractor strips common words that add noise:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:71:Only words 3+ characters that aren't stop words count as keywords.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:124:### Fix 3: Hybrid keyword boost (same as v1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:126:All the v1 keyword re-ranking applied on top of fixes 1 and 2.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:139:| **Hybrid v2 + LLM rerank** | 98.8% | 99.0% | 0.966 | +2.2pp / +0.8pp / +0.077 |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:140:| **Hybrid v3 + LLM rerank** | 99.4% | 99.6% | 0.975 | +2.8pp / +1.4pp / +0.086 |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:141:| **Palace + LLM rerank** | **99.4%** | **99.4%** | **0.973** | **+2.8pp / +1.2pp / +0.084** |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:142:| **Diary + LLM rerank (65% cache)** | 98.2% | 98.4% | 0.956 | +1.6pp / +0.2pp / +0.067 |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:150:Per-type R@5 breakdown (hybrid v3 + LLM rerank):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:158:### Remaining 3 misses (after hybrid v3 + LLM rerank)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:164:- assistant: 96.4% → **98.2%** (expanded top-20 rerank pool caught rank-11-12 sessions)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:208:# Run palace + LLM rerank (requires API key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:211:  --mode palace --llm-rerank --out benchmarks/results_palace_llmrerank_full500.jsonl
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:213:# Run hybrid v3 + LLM rerank (requires API key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:215:  --mode hybrid_v3 --llm-rerank
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:220:# Run hybrid v2 + LLM rerank (local-friendly, no preference extraction)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:222:  --mode hybrid_v2 --llm-rerank
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:241:# Tune the keyword boost weight
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:248:- hybrid_v2 + LLM rerank: ~620s (~10 min) — adds ~0.8s per question for Haiku API call
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:250:- palace + LLM rerank: ~700s (~12 min)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:293:**The key insight:** Halls *reduce noise* by narrowing the initial search pool, but the final ranking is always score-based — hall navigation is a boost, not an override. This prevents the case where wrong hall sessions pre-empt the correct answer.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:311:Palace mode still misses questions like: *"Where do I take yoga classes?"* when the relevant session only says *"I went this morning, my instructor was great."* No keyword overlap, no semantic bridge. The embedding sees "yoga classes" vs "went this morning" — too different.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:347:### LLM Rerank compatibility
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:349:`--llm-rerank` works with diary mode. The reranker sees the full enriched corpus (including diary synthetic docs) when selecting the best session. This is the full stack.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:352:# Full diary + rerank run (requires complete cache for best results)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:355:  --mode diary --llm-rerank --diary-cache benchmarks/diary_cache_haiku.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:360:The partial-coverage run (65% cache, 35% fell back to palace) gave R@5=98.2% — lower than palace+rerank at 99.4%. Partial diary coverage introduces vocabulary-bridging docs for some sessions but not others, creating retrieval asymmetry. Full-coverage result (100% sessions with diary topics) is expected to equal or beat 99.4%.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:395:This document ranks near the top for "I've been having trouble with battery life" even when the session text never uses those exact words. The evaluation correctly maps it to the right session.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:397:### Fix 2: Expanded LLM rerank pool (20 instead of 10)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:399:Some assistant-reference failures had the correct session at rank 11-12 — just outside the window Haiku sees. Expanding to top-20 catches these with negligible prompt cost.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:401:## How LLM Re-ranking Works (`--llm-rerank`)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:403:An optional fourth pass that works with any retrieval mode. Add `--llm-rerank` to any run.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:409:# That session is promoted to rank 1; rest stay in hybrid_v2 order
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:429:**Why only 1 pick (not a full ranking):**
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:430:Asking for a full ranking increases prompt complexity and error rate. Picking the single best is decisive and reliable. The rest of the ranking stays in hybrid_v2 order, which is already excellent.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:433:If the API call fails (timeout, rate limit, no key), the function catches the exception and returns the original hybrid_v2 ranking unchanged. The benchmark never crashes due to the LLM pass.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:493:### 2. LLM-assisted re-ranking
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:495:For jargon-dense questions ("Hardware-Aware Modular Training") and context-gap questions ("business milestone"), a lightweight LLM re-ranker as a third pass could close the remaining gap:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:518:  results_hybrid_v2_llmrerank_full500.jsonl    — hybrid v2 + LLM rerank (R@5=98.8%)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:519:  results_hybrid_v3_llmrerank_full500.jsonl    — hybrid v3 + LLM rerank (R@5=99.4%, NDCG=0.975) ← CURRENT BEST (tied)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:520:  results_palace_full500.jsonl                 — palace mode (R@5=97.2%, no rerank)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:521:  results_palace_llmrerank_full500.jsonl       — palace + LLM rerank (R@5=99.4%, NDCG=0.973) ← CURRENT BEST (tied)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:522:  results_diary_haiku_rerank_full500.jsonl     — diary + LLM rerank, 65% cache (R@5=98.2%) ← partial, full pending
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:532:**Why 30% keyword boost?**
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:533:Strong enough to flip edge cases (a semantically ambiguous doc with perfect keyword overlap), not so strong it overrides clearly-better semantic results. Full 500-question validation confirms 0.30 is optimal. Higher weights show no improvement on the full set.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:535:**Why top-50 retrieval then re-rank?**
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/HYBRID_MODE.md:536:Larger candidate pool gives keyword re-ranking more to work with. If the answer is at position 45 semantically but has perfect keyword overlap, we need it in the pool to promote it. Cost: ChromaDB returns slightly more data per query. Impact on speed: negligible.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:61:def ndcg(rankings, correct_ids, corpus_ids, k):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:63:    relevances = [1.0 if corpus_ids[idx] in correct_ids else 0.0 for idx in rankings[:k]]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:71:def evaluate_retrieval(rankings, correct_ids, corpus_ids, k):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:73:    Evaluate retrieval at rank k.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:76:    top_k_ids = set(corpus_ids[idx] for idx in rankings[:k])
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:79:    ndcg_score = ndcg(rankings, correct_ids, corpus_ids, k)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:173:        rankings: numpy-style list of indices into corpus (descending relevance)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:231:    # Build rankings: indices into corpus sorted by relevance (lowest distance = most relevant)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:233:    ranked_indices = [doc_id_to_idx[rid] for rid in result_ids]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:236:    seen = set(ranked_indices)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:239:            ranked_indices.append(i)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:241:    return ranked_indices, corpus, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:308:    ranked_indices = [doc_id_to_idx[rid] for rid in result_ids]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:310:    seen = set(ranked_indices)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:313:            ranked_indices.append(i)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:315:    return ranked_indices, corpus, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:318:# Topic keywords for room detection (same as convo_miner.py)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:387:    """Score text against topic keywords, return best room."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:390:    for room, keywords in TOPIC_KEYWORDS.items():
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:391:        score = sum(1 for kw in keywords if kw in text_lower)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:452:    # Global search with room-based reranking (soft boost, not hard filter)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:459:    # Rerank: boost results in the matching room by reducing distance
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:474:    ranked_indices = [idx for idx, _ in scored]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:477:    seen = set(ranked_indices)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:480:            ranked_indices.append(i)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:482:    return ranked_indices, corpus, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:489:    Hybrid mode: semantic search + keyword overlap re-ranking.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:493:    2. Re-rank by fusing semantic distance with keyword overlap score
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:495:    Keyword overlap catches cases where the answer keyword is very specific
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:553:    def extract_keywords(text):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:557:    def keyword_overlap(query_kws, doc_text):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:615:    # Extract keywords from question for overlap scoring
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:616:    query_keywords = extract_keywords(query)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:618:    # Re-rank by fusing semantic distance with keyword overlap
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:622:        overlap = keyword_overlap(query_keywords, doc)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:623:        # Lower distance = better. Reduce distance for keyword overlap.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:628:    ranked_indices = [idx for idx, _ in scored]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:630:    seen = set(ranked_indices)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:633:            ranked_indices.append(i)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:635:    return ranked_indices, corpus, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:694:    ranked_indices = [doc_id_to_idx[rid] for rid in result_ids]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:696:    seen = set(ranked_indices)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:699:            ranked_indices.append(i)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:701:    return ranked_indices, corpus, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:728:        match session keywords (user discussed "Adobe Premiere Pro", question asks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:730:        domain keywords.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:787:    def extract_keywords(text):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:791:    def keyword_overlap(query_kws, doc_text):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:917:        # Build final rankings: two-pass top sessions first, then rest
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:920:        ranked_indices = two_pass_order + [i for i in range(len(corpus_user)) if i not in seen]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:921:        return ranked_indices, corpus_user, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:935:    query_keywords = extract_keywords(question)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:957:        overlap = keyword_overlap(query_keywords, doc)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:979:    ranked_indices = [idx for idx, _ in scored]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:981:    seen = set(ranked_indices)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:984:            ranked_indices.append(i)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:986:    return ranked_indices, corpus_user, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:990:# HYBRID V3 — Preference Extraction + Expanded Re-rank Pool
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1012:          → the pref doc ranks near the top for this question
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1014:    Fix 2 — Expanded LLM re-rank pool (20 instead of 10):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1015:        The two remaining assistant failures have their correct session at rank
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1074:    def extract_keywords(text):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1078:    def keyword_overlap(query_kws, doc_text):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1255:        ranked_indices = two_pass_order + [i for i in range(len(corpus_user)) if i not in seen]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1256:        return ranked_indices, corpus_user, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1275:    query_keywords = extract_keywords(question)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1297:        overlap = keyword_overlap(query_keywords, doc)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1320:    # Keep whichever ranks first; map back to corpus_user index for evaluation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1323:    ranked_indices = []
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1328:            ranked_indices.append(corpus_id_to_user_idx[cid])
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1330:    # Fill in any sessions not yet ranked
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1333:            ranked_indices.append(i)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1336:    return ranked_indices, corpus_user, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1422:    def extract_keywords(text):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1426:    def keyword_overlap(query_kws, doc_text):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1704:            overlap = keyword_overlap(extract_keywords(question), doc)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1714:        ranked_indices = []
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1718:                ranked_indices.append(idx)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1721:                ranked_indices.append(i)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1723:        return ranked_indices, corpus_user, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1742:    query_keywords = extract_keywords(question)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1763:        overlap = keyword_overlap(query_keywords, doc)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1792:    ranked_indices = []
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1797:            ranked_indices.append(corpus_id_to_user_idx[cid])
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1801:            ranked_indices.append(i)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:1804:    return ranked_indices, corpus_user, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2079:    def extract_keywords(text):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2083:    def keyword_overlap(query_kws, doc_text):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2224:    query_keywords = extract_keywords(question)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2227:        overlap = keyword_overlap(query_keywords, doc)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2302:    # PASS 2: Full haystack search — primary ranking
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2348:    # Build final ranking purely by score — hall navigation boosts but never overrides
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2349:    ranked_indices = []
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2353:            ranked_indices.append(corpus_id_to_user_idx[cid])
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2359:            ranked_indices.append(i)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2362:    return ranked_indices, corpus_user, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2385:        Without diary: no keyword overlap → miss
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2465:    This bridges vocabulary gaps that neither embeddings nor keyword matching
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2528:    def extract_keywords(text):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2532:    def keyword_overlap(query_kws, doc_text):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2670:    query_keywords = extract_keywords(question)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2673:        overlap = keyword_overlap(query_keywords, doc)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2750:    ranked_indices = []
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2754:            ranked_indices.append(corpus_id_to_user_idx[cid])
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2759:            ranked_indices.append(i)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2762:    return ranked_indices, corpus_user, corpus_ids, corpus_timestamps
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2765:def llm_rerank(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2766:    question, rankings, corpus, corpus_ids, api_key, top_k=10, model="claude-haiku-4-5-20251001"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2769:    Use an LLM to re-rank the top-k retrieved sessions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2773:    is promoted to rank 1; the rest stay in their existing order.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2782:        rankings:    Current ranked list of corpus indices (from any mode)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2787:        model:       Claude model ID for reranking (default: haiku)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2790:        Reordered rankings list with LLM's best pick promoted to rank 1.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2795:    candidates = rankings[:top_k]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2797:        return rankings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2801:    for rank, idx in enumerate(candidates):
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2803:        session_blocks.append(f"Session {rank + 1}:\n{text}")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2848:                    reordered = [chosen_idx] + [i for i in rankings if i != chosen_idx]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2856:            # else fall through to return rankings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2860:    return rankings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2935:    llm_rerank_enabled=False,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2968:    if llm_rerank_enabled or mode == "diary":
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:2972:                "ERROR: --llm-rerank / --mode diary requires an API key. "
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3041:    rerank_label = f" + LLM re-rank ({model_short})" if llm_rerank_enabled else ""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3043:    print(f"  Mode:        {mode}{diary_label}{rerank_label}")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3069:            rankings, corpus, corpus_ids, corpus_timestamps = build_palace_and_retrieve_aaak(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3073:            rankings, corpus, corpus_ids, corpus_timestamps = build_palace_and_retrieve_rooms(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3077:            rankings, corpus, corpus_ids, corpus_timestamps = build_palace_and_retrieve_hybrid(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3081:            rankings, corpus, corpus_ids, corpus_timestamps = build_palace_and_retrieve_hybrid_v2(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3085:            rankings, corpus, corpus_ids, corpus_timestamps = build_palace_and_retrieve_hybrid_v3(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3089:            rankings, corpus, corpus_ids, corpus_timestamps = build_palace_and_retrieve_hybrid_v4(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3093:            rankings, corpus, corpus_ids, corpus_timestamps = build_palace_and_retrieve_palace(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3099:            rankings, corpus, corpus_ids, corpus_timestamps = build_palace_and_retrieve_diary(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3108:            rankings, corpus, corpus_ids, corpus_timestamps = build_palace_and_retrieve_full(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3112:            rankings, corpus, corpus_ids, corpus_timestamps = build_palace_and_retrieve(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3116:        if not rankings:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3120:        # Optional LLM re-ranking pass (larger pool for v3/palace to catch rank-11-12 misses)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3121:        if llm_rerank_enabled:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3122:            rerank_pool = 20 if mode in ("hybrid_v3", "hybrid_v4", "palace") else 10
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3123:            rankings = llm_rerank(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3124:                question, rankings, corpus, corpus_ids, api_key, top_k=rerank_pool, model=llm_model
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3143:            ra, rl, nd = evaluate_retrieval(rankings, session_correct, session_level_ids, k)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3151:            ra_t, rl_t, nd_t = evaluate_retrieval(rankings, turn_correct, corpus_ids, k)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3163:        ranked_items = []
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3164:        for idx in rankings[:50]:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3165:            ranked_items.append(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3181:                    "ranked_items": ranked_items,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3283:        "--llm-rerank",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3286:        help="Enable LLM re-ranking pass using Claude Haiku (requires API key). "
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3287:        "Promotes the best session from top-10 to rank 1. Targets preference "
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3293:        help="Anthropic API key for LLM re-ranking. Falls back to ANTHROPIC_API_KEY "
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3299:        help="Model for LLM re-ranking and diary ingest "
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3379:        suffix = "_llmrerank" if args.llm_rerank else ""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py:3398:        args.llm_rerank,

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

The remaining misses were identified by loading both the hybrid v3 and palace results and finding the exact questions that failed in *both* architectures — confirming they were hard limits, not luck.

**Fix 1 — Quoted phrase extraction** (miss: `'sexual compulsions'` assistant question):
The question contained an exact quoted phrase in single quotes. Sessions containing that exact phrase now get a 60% distance reduction. The target session jumped from unranked to rank 1.

**Fix 2 — Person name boosting** (miss: `Rachel/ukulele` temporal question):
Sentence-embedded models give insufficient weight to person names. Capitalized proper nouns are extracted from queries; sessions mentioning that name get a 40% distance reduction. The target session jumped from unranked to rank 2.

**Fix 3 — Memory/nostalgia patterns** (miss: `high school reunion` preference question):
The target session said "I still remember the happy high school experiences such as being part of the debate team." Added patterns to preference extraction: `"I still remember X"`, `"I used to X"`, `"when I was in high school X"`, `"growing up X"`. This created a synthetic doc "User has mentioned: positive high school experiences, debate team, AP courses" — which the reunion question now matches. Target session jumped to rank 3.

**Result:** All 6 question types at 100% R@5. 500/500 questions. No regressions.

**Haiku vs. Sonnet rerank:** Both achieve 100% R@5. NDCG@10 is 0.976 (Haiku) vs 0.975 (Sonnet) — statistically identical. Haiku is ~3× cheaper. Sonnet is slightly faster at this task (2.99s/q vs 3.85s/q in our run). Either works; Haiku is the default recommendation.

---

### Parallel Approach: Palace Mode + Haiku Rerank → 99.4% (independent convergence)

Built independently from the hybrid track. Different architecture, same ceiling.

codex
I’m checking the benchmark code too, because MemPalace’s docs use “hybrid” language in a few different ways. If the lexical or rerank gains only exist in benchmark scripts and not in the shipped server path, that changes the recommendation a lot for what we should actually borrow.
exec
/bin/zsh -lc "sed -n '2460,2725p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "def build_palace_and_retrieve_hybrid_v4|keyword overlap|quoted phrase|person name|preference extraction|temporal boost|hybrid v4|rerank" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
452:    # Global search with room-based reranking (soft boost, not hard filter)
489:    Hybrid mode: semantic search + keyword overlap re-ranking.
493:    2. Re-rank by fusing semantic distance with keyword overlap score
618:    # Re-rank by fusing semantic distance with keyword overlap
623:        # Lower distance = better. Reduce distance for keyword overlap.
1339:def build_palace_and_retrieve_hybrid_v4(
1358:        Gap: Embedding model gives low weight to person names like 'Rachel'.
1365:        Fix: Extract quoted phrases from question; boost sessions containing exact quotes.
1433:    # NEW: Extract quoted phrases from question (single or double quotes)
1441:        """Strong boost if document contains an exact quoted phrase from the question."""
1448:    # NEW: Extract person names (capitalized words that aren't common title-case words)
1522:        """Extract likely person names: capitalized words mid-sentence."""
1678:    # (ensures the quoted phrases appear in the indexed text)
1700:        # Apply quoted phrase + name boost in scoring
1780:        # V4: Person name boost (for temporal-reasoning + person name questions)
2385:        Without diary: no keyword overlap → miss
2765:def llm_rerank(
2787:        model:       Claude model ID for reranking (default: haiku)
2935:    llm_rerank_enabled=False,
2968:    if llm_rerank_enabled or mode == "diary":
2972:                "ERROR: --llm-rerank / --mode diary requires an API key. "
3041:    rerank_label = f" + LLM re-rank ({model_short})" if llm_rerank_enabled else ""
3043:    print(f"  Mode:        {mode}{diary_label}{rerank_label}")
3121:        if llm_rerank_enabled:
3122:            rerank_pool = 20 if mode in ("hybrid_v3", "hybrid_v4", "palace") else 10
3123:            rankings = llm_rerank(
3124:                question, rankings, corpus, corpus_ids, api_key, top_k=rerank_pool, model=llm_model
3283:        "--llm-rerank",
3379:        suffix = "_llmrerank" if args.llm_rerank else ""
3398:        args.llm_rerank,

 succeeded in 0ms:
      - Haiku reads the session → extracts 2-5 specific topics + a summary
      - Synthetic doc: "Session topics: yoga classes, Tuesday routine. Summary: ..."
      - Same corpus_id as the session → evaluation maps it correctly
      - Added to the haystack alongside raw user turns

    This bridges vocabulary gaps that neither embeddings nor keyword matching
    can cross — e.g., "Where do I take yoga classes?" matching a session that
    only says "I went this morning, my instructor was great."

    diary_cache: dict mapping sess_id → {"topics": [...], "summary": "..."}
                 Pre-populated before the benchmark loop to avoid redundant API calls.
                 Pass the same dict across all questions — it grows as new sessions appear.
    """
    import re as _re
    from datetime import datetime, timedelta

    STOP_WORDS = {
        "what",
        "when",
        "where",
        "who",
        "how",
        "which",
        "did",
        "do",
        "was",
        "were",
        "have",
        "has",
        "had",
        "is",
        "are",
        "the",
        "a",
        "an",
        "my",
        "me",
        "i",
        "you",
        "your",
        "their",
        "it",
        "its",
        "in",
        "on",
        "at",
        "to",
        "for",
        "of",
        "with",
        "by",
        "from",
        "ago",
        "last",
        "that",
        "this",
        "there",
        "about",
        "get",
        "got",
        "give",
        "gave",
        "buy",
        "bought",
        "made",
        "make",
    }

    def extract_keywords(text):
        words = _re.findall(r"\b[a-z]{3,}\b", text.lower())
        return [w for w in words if w not in STOP_WORDS]

    def keyword_overlap(query_kws, doc_text):
        doc_lower = doc_text.lower()
        if not query_kws:
            return 0.0
        hits = sum(1 for kw in query_kws if kw in doc_lower)
        return hits / len(query_kws)

    def parse_question_date(date_str):
        try:
            return datetime.strptime(date_str.split(" (")[0], "%Y/%m/%d")
        except Exception:
            return None

    def parse_time_offset_days(question):
        q = question.lower()
        patterns = [
            (r"(\d+)\s+days?\s+ago", lambda m: (int(m.group(1)), 2)),
            (r"a\s+couple\s+(?:of\s+)?days?\s+ago", lambda m: (2, 2)),
            (r"yesterday", lambda m: (1, 1)),
            (r"a\s+week\s+ago", lambda m: (7, 3)),
            (r"(\d+)\s+weeks?\s+ago", lambda m: (int(m.group(1)) * 7, 5)),
            (r"last\s+week", lambda m: (7, 3)),
            (r"a\s+month\s+ago", lambda m: (30, 7)),
            (r"(\d+)\s+months?\s+ago", lambda m: (int(m.group(1)) * 30, 10)),
            (r"last\s+month", lambda m: (30, 7)),
            (r"last\s+year", lambda m: (365, 30)),
            (r"a\s+year\s+ago", lambda m: (365, 30)),
            (r"recently", lambda m: (14, 14)),
        ]
        for pattern, extractor in patterns:
            m = _re.search(pattern, q)
            if m:
                return extractor(m)
        return None

    # Preference extraction (same 16 patterns as v3/palace)
    PREF_PATTERNS = [
        r"i(?:'ve been| have been) having (?:trouble|issues?|problems?) with ([^,\.!?]{5,80})",
        r"i(?:'ve been| have been) feeling ([^,\.!?]{5,60})",
        r"i(?:'ve been| have been) (?:struggling|dealing) with ([^,\.!?]{5,80})",
        r"i(?:'ve been| have been) (?:worried|concerned) about ([^,\.!?]{5,80})",
        r"i(?:'m| am) (?:worried|concerned) about ([^,\.!?]{5,80})",
        r"i prefer ([^,\.!?]{5,60})",
        r"i usually ([^,\.!?]{5,60})",
        r"i(?:'ve been| have been) (?:trying|attempting) to ([^,\.!?]{5,80})",
        r"i(?:'ve been| have been) (?:considering|thinking about) ([^,\.!?]{5,80})",
        r"lately[,\s]+(?:i've been|i have been|i'm|i am) ([^,\.!?]{5,80})",
        r"recently[,\s]+(?:i've been|i have been|i'm|i am) ([^,\.!?]{5,80})",
        r"i(?:'ve been| have been) (?:working on|focused on|interested in) ([^,\.!?]{5,80})",
        r"i want to ([^,\.!?]{5,60})",
        r"i(?:'m| am) looking (?:to|for) ([^,\.!?]{5,60})",
        r"i(?:'m| am) thinking (?:about|of) ([^,\.!?]{5,60})",
        r"i(?:'ve been| have been) (?:noticing|experiencing) ([^,\.!?]{5,80})",
    ]

    def extract_preferences(session):
        mentions = []
        for turn in session:
            if turn["role"] != "user":
                continue
            text = turn["content"].lower()
            for pat in PREF_PATTERNS:
                for match in _re.findall(pat, text, _re.IGNORECASE):
                    clean = match.strip().rstrip(".,;!? ")
                    if 5 <= len(clean) <= 80:
                        mentions.append(clean)
        seen = set()
        unique = []
        for m in mentions:
            if m not in seen:
                seen.add(m)
                unique.append(m)
        return unique[:10]

    if diary_cache is None:
        diary_cache = {}

    sessions = entry["haystack_sessions"]
    session_ids = entry["haystack_session_ids"]
    dates = entry["haystack_dates"]
    question = entry["question"]
    question_date = parse_question_date(entry.get("question_date", ""))

    corpus_user = []
    corpus_ids = []
    corpus_timestamps = []
    diary_docs = []  # LLM topic layer docs (one per session with diary data)
    diary_meta = []
    pref_wing_docs = []
    pref_wing_meta = []

    for session, sess_id, date in zip(sessions, session_ids, dates):
        user_turns = [t["content"] for t in session if t["role"] == "user"]
        if not user_turns:
            continue

        user_doc = "\n".join(user_turns)
        corpus_user.append(user_doc)
        corpus_ids.append(sess_id)
        corpus_timestamps.append(date)

        # DIARY LAYER: get or compute LLM topic extraction
        if sess_id not in diary_cache:
            if api_key:
                result = diary_ingest_session(session, sess_id, api_key, model=diary_model)
                diary_cache[sess_id] = result  # cache even if None
            else:
                diary_cache[sess_id] = None

        diary_data = diary_cache.get(sess_id)
        if diary_data:
            topics = diary_data.get("topics", [])
            summary = diary_data.get("summary", "")
            if topics or summary:
                topic_str = ", ".join(topics) if topics else ""
                diary_doc = f"Session topics: {topic_str}. Summary: {summary}"
                diary_docs.append(diary_doc)
                diary_meta.append(
                    {
                        "corpus_id": sess_id,
                        "timestamp": date,
                        "hall": classify_session_hall(session),
                    }
                )

        # PREFERENCE WING (same as v3/palace)
        prefs = extract_preferences(session)
        if prefs:
            pref_doc = "User has mentioned: " + "; ".join(prefs)
            pref_wing_docs.append(pref_doc)
            pref_wing_meta.append({"corpus_id": sess_id, "timestamp": date})

    if not corpus_user:
        return [], corpus_user, corpus_ids, corpus_timestamps

    # Hall navigation (same as palace)
    target_halls = classify_question_hall(question)
    primary_hall = target_halls[0]
    query_keywords = extract_keywords(question)

    def hybrid_score(dist, doc):
        overlap = keyword_overlap(query_keywords, doc)
        return dist * (1.0 - hybrid_weight * overlap)

    time_offset = parse_time_offset_days(question)
    target_date = None
    if time_offset and question_date:
        target_date = question_date - timedelta(days=time_offset[0])

    def apply_temporal(fused_dist, timestamp):
        if not target_date:
            return fused_dist
        sess_date = parse_question_date(timestamp)
        if not sess_date:
            return fused_dist
        delta_days = abs((sess_date - target_date).days)
        tol = time_offset[1]
        if delta_days <= tol:
            boost = 0.40
        elif delta_days <= tol * 3:
            boost = 0.40 * (1.0 - (delta_days - tol) / (tol * 2))
        else:
            boost = 0.0
        return fused_dist * (1.0 - boost)

    corpus_id_to_user_idx = {cid: i for i, cid in enumerate(corpus_ids)}

    # -------------------------------------------------------------------------
    # FULL SEARCH: raw user docs + diary topic docs + preference wing
    # Diary docs and pref docs share corpus_id with their session — same hit
    # -------------------------------------------------------------------------
    full_docs = corpus_user + diary_docs + pref_wing_docs
    full_meta = (
        [
            {
                "corpus_id": corpus_ids[i],
                "timestamp": corpus_timestamps[i],
                "hall": classify_session_hall(sessions[i]) if i < len(sessions) else HALL_GENERAL,
                "layer": "raw",
            }
            for i in range(len(corpus_user))
        ]
        + [dict(m, layer="diary") for m in diary_meta]
        + [dict(m, layer="pref") for m in pref_wing_meta]
    )

    coll = _fresh_collection()
    coll.add(
        documents=full_docs,
        ids=[f"doc_{i}" for i in range(len(full_docs))],
        metadatas=full_meta,
    )
    r = coll.query(
        query_texts=[question],

exec
/bin/zsh -lc "sed -n '2725,2865p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
        query_texts=[question],
        n_results=min(n_results, len(full_docs)),
        include=["distances", "metadatas", "documents"],
    )

    scored = []
    for rid, dist, doc, meta in zip(
        r["ids"][0], r["distances"][0], r["documents"][0], r["metadatas"][0]
    ):
        cid = meta["corpus_id"]
        fd = hybrid_score(dist, doc)
        # Hall bonus
        if meta.get("hall") == primary_hall and primary_hall != HALL_GENERAL:
            fd *= 0.75
        elif meta.get("hall") in target_halls:
            fd *= 0.90
        # Diary layer bonus: LLM topic doc that matches gets extra 20% boost
        # (it's a more precise signal than raw text)
        if meta.get("layer") == "diary":
            fd *= 0.80
        fd = apply_temporal(fd, meta.get("timestamp", ""))
        scored.append((cid, fd))

    scored.sort(key=lambda x: x[1])

    ranked_indices = []
    seen_ids = set()
    for cid, _ in scored:
        if cid not in seen_ids and cid in corpus_id_to_user_idx:
            ranked_indices.append(corpus_id_to_user_idx[cid])
            seen_ids.add(cid)

    for i in range(len(corpus_user)):
        if corpus_ids[i] not in seen_ids:
            ranked_indices.append(i)
            seen_ids.add(corpus_ids[i])

    return ranked_indices, corpus_user, corpus_ids, corpus_timestamps


def llm_rerank(
    question, rankings, corpus, corpus_ids, api_key, top_k=10, model="claude-haiku-4-5-20251001"
):
    """
    Use an LLM to re-rank the top-k retrieved sessions.

    Takes the top-k sessions from any retrieval mode and asks the LLM
    which single session is most relevant to the question. That session
    is promoted to rank 1; the rest stay in their existing order.

    This closes the gap for "preference" and jargon-dense "assistant"
    failures where the right session is in top-10 semantically but not
    top-5 — because the semantic gap (battery life ↔ phone hardware) is
    too large for embeddings to bridge.

    Args:
        question:    The benchmark question string
        rankings:    Current ranked list of corpus indices (from any mode)
        corpus:      List of document strings
        corpus_ids:  List of corpus IDs (parallel to corpus)
        api_key:     Anthropic API key string
        top_k:       How many top sessions to send to LLM (default: 10)
        model:       Claude model ID for reranking (default: haiku)

    Returns:
        Reordered rankings list with LLM's best pick promoted to rank 1.
    """
    import urllib.request
    import urllib.error

    candidates = rankings[:top_k]
    if not candidates:
        return rankings

    # Format sessions for the prompt — first 500 chars each, labelled 1..N
    session_blocks = []
    for rank, idx in enumerate(candidates):
        text = corpus[idx][:500].replace("\n", " ").strip()
        session_blocks.append(f"Session {rank + 1}:\n{text}")

    sessions_text = "\n\n".join(session_blocks)

    prompt = (
        f"Question: {question}\n\n"
        f"Below are {len(candidates)} conversation sessions from someone's memory. "
        f"Which single session is most likely to contain the answer to the question above? "
        f"Reply with ONLY a number between 1 and {len(candidates)}. Nothing else.\n\n"
        f"{sessions_text}\n\n"
        f"Most relevant session number:"
    )

    payload = json.dumps(
        {
            "model": model,
            "max_tokens": 8,
            "messages": [{"role": "user", "content": prompt}],
        }
    ).encode("utf-8")

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=payload,
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        method="POST",
    )

    import socket as _socket

    for _attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                result = json.loads(resp.read())
            raw = result["content"][0]["text"].strip()
            # Parse just the first integer from Haiku's response
            m = re.search(r"\b(\d+)\b", raw)
            if m:
                pick = int(m.group(1))
                if 1 <= pick <= len(candidates):
                    chosen_idx = candidates[pick - 1]
                    reordered = [chosen_idx] + [i for i in rankings if i != chosen_idx]
                    return reordered
            break  # Got a response, even if unparseable — don't retry
        except (_socket.timeout, TimeoutError):
            if _attempt < 2:
                import time as _time

                _time.sleep(3)  # brief pause then retry
            # else fall through to return rankings
        except (urllib.error.URLError, KeyError, ValueError, IndexError, OSError):
            break  # Non-timeout error — fall back immediately

    return rankings


def _load_api_key(key_arg):
    """Load API key from --llm-key arg, env var, or ~/.config/lu/keys.json."""
    if key_arg:

exec
/bin/zsh -lc "sed -n '452,640p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1339,1815p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    # Global search with room-based reranking (soft boost, not hard filter)
    global_results = collection.query(
        query_texts=[query],
        n_results=min(n_results, len(corpus)),
        include=["distances", "metadatas"],
    )

    # Rerank: boost results in the matching room by reducing distance
    doc_id_to_idx = {f"doc_{i}": i for i in range(len(corpus))}
    scored = []
    for rid, dist, meta in zip(
        global_results["ids"][0],
        global_results["distances"][0],
        global_results["metadatas"][0],
    ):
        idx = doc_id_to_idx[rid]
        # Soft boost: reduce distance by 20% if room matches
        boosted_dist = dist * 0.8 if meta.get("room") == query_room else dist
        scored.append((idx, boosted_dist))

    # Sort by boosted distance (ascending = most relevant first)
    scored.sort(key=lambda x: x[1])
    ranked_indices = [idx for idx, _ in scored]

    # Fill remaining
    seen = set(ranked_indices)
    for i in range(len(corpus)):
        if i not in seen:
            ranked_indices.append(i)

    return ranked_indices, corpus, corpus_ids, corpus_timestamps


def build_palace_and_retrieve_hybrid(
    entry, granularity="session", n_results=50, hybrid_weight=0.30
):
    """
    Hybrid mode: semantic search + keyword overlap re-ranking.

    Two-stage approach:
    1. Retrieve top-N via ChromaDB semantic search (same as raw)
    2. Re-rank by fusing semantic distance with keyword overlap score

    Keyword overlap catches cases where the answer keyword is very specific
    ("Business Administration", "stand mixer") but embedding similarity
    alone doesn't push it into the top-5.

    Also applies temporal recency bonus for temporal-reasoning questions.
    """
    STOP_WORDS = {
        "what",
        "when",
        "where",
        "who",
        "how",
        "which",
        "did",
        "do",
        "was",
        "were",
        "have",
        "has",
        "had",
        "is",
        "are",
        "the",
        "a",
        "an",
        "my",
        "me",
        "i",
        "you",
        "your",
        "their",
        "it",
        "its",
        "in",
        "on",
        "at",
        "to",
        "for",
        "of",
        "with",
        "by",
        "from",
        "ago",
        "last",
        "that",
        "this",
        "there",
        "about",
        "get",
        "got",
        "give",
        "gave",
        "buy",
        "bought",
        "made",
        "make",
    }

    def extract_keywords(text):
        words = re.findall(r"\b[a-z]{3,}\b", text.lower())
        return [w for w in words if w not in STOP_WORDS]

    def keyword_overlap(query_kws, doc_text):
        doc_lower = doc_text.lower()
        if not query_kws:
            return 0.0
        hits = sum(1 for kw in query_kws if kw in doc_lower)
        return hits / len(query_kws)

    corpus = []
    corpus_ids = []
    corpus_timestamps = []

    sessions = entry["haystack_sessions"]
    session_ids = entry["haystack_session_ids"]
    dates = entry["haystack_dates"]

    for sess_idx, (session, sess_id, date) in enumerate(zip(sessions, session_ids, dates)):
        if granularity == "session":
            user_turns = [t["content"] for t in session if t["role"] == "user"]
            if user_turns:
                doc = "\n".join(user_turns)
                corpus.append(doc)
                corpus_ids.append(sess_id)
                corpus_timestamps.append(date)
        else:
            turn_num = 0
            for turn in session:
                if turn["role"] == "user":
                    corpus.append(turn["content"])
                    corpus_ids.append(f"{sess_id}_turn_{turn_num}")
                    corpus_timestamps.append(date)
                    turn_num += 1

    if not corpus:
        return [], corpus, corpus_ids, corpus_timestamps

    collection = _fresh_collection()

    collection.add(
        documents=corpus,
        ids=[f"doc_{i}" for i in range(len(corpus))],
        metadatas=[
            {"corpus_id": cid, "timestamp": ts} for cid, ts in zip(corpus_ids, corpus_timestamps)
        ],
    )

    query = entry["question"]
    results = collection.query(
        query_texts=[query],
        n_results=min(n_results, len(corpus)),
        include=["distances", "metadatas", "documents"],
    )

    result_ids = results["ids"][0]
    distances = results["distances"][0]
    documents = results["documents"][0]

    doc_id_to_idx = {f"doc_{i}": i for i in range(len(corpus))}

    # Extract keywords from question for overlap scoring
    query_keywords = extract_keywords(query)

    # Re-rank by fusing semantic distance with keyword overlap
    scored = []
    for rid, dist, doc in zip(result_ids, distances, documents):
        idx = doc_id_to_idx[rid]
        overlap = keyword_overlap(query_keywords, doc)
        # Lower distance = better. Reduce distance for keyword overlap.
        fused_dist = dist * (1.0 - hybrid_weight * overlap)
        scored.append((idx, fused_dist))

    scored.sort(key=lambda x: x[1])
    ranked_indices = [idx for idx, _ in scored]

    seen = set(ranked_indices)
    for i in range(len(corpus)):
        if i not in seen:
            ranked_indices.append(i)

    return ranked_indices, corpus, corpus_ids, corpus_timestamps


def build_palace_and_retrieve_full(entry, granularity="session", n_results=50):
    """
    Full-turn mode: index BOTH user and assistant turns per session.

 succeeded in 0ms:
def build_palace_and_retrieve_hybrid_v4(
    entry, granularity="session", n_results=50, hybrid_weight=0.30
):
    """
    Hybrid V4: hybrid_v3 + three targeted fixes for the final 3 misses.

    Analysis of remaining misses at 99.4% (both hybrid_v3 and palace fail on these):

    Miss 1 — 'high school reunion' (d6233ab6, single-session-preference):
        Target session: "I still remember the happy high school experiences such as
        being part of the debate team and taking advanced placement courses."
        Question: "high school reunion...nostalgic"
        Gap: "reunion/nostalgic" ≠ "debate team/AP courses" in embedding space.
        Fix: Add memory/nostalgia patterns to extract "User has mentioned: positive
        high school experiences, debate team, AP courses" as a synthetic pref doc.

    Miss 2 — 'Rachel/ukulele' (4dfccbf8, temporal-reasoning):
        Target session: "I just started taking ukulele lessons with my friend Rachel today."
        Question: "What did I do with Rachel on the Wednesday two months ago?"
        Gap: Embedding model gives low weight to person names like 'Rachel'.
        Fix: Extract capitalized proper nouns from question; boost sessions containing them.

    Miss 3 — 'sexual compulsions' (ceb54acb, single-session-assistant):
        Target session: assistant suggests "sexual fixations", "sexual impulsivity", etc.
        Question: "you suggested 'sexual compulsions' and a few other options..."
        Gap: Short 2-turn session, niche topic — embeddings don't surface it.
        Fix: Extract quoted phrases from question; boost sessions containing exact quotes.
    """
    import re as _re
    from datetime import datetime, timedelta

    STOP_WORDS = {
        "what",
        "when",
        "where",
        "who",
        "how",
        "which",
        "did",
        "do",
        "was",
        "were",
        "have",
        "has",
        "had",
        "is",
        "are",
        "the",
        "a",
        "an",
        "my",
        "me",
        "i",
        "you",
        "your",
        "their",
        "it",
        "its",
        "in",
        "on",
        "at",
        "to",
        "for",
        "of",
        "with",
        "by",
        "from",
        "ago",
        "last",
        "that",
        "this",
        "there",
        "about",
        "get",
        "got",
        "give",
        "gave",
        "buy",
        "bought",
        "made",
        "make",
    }

    def extract_keywords(text):
        words = _re.findall(r"\b[a-z]{3,}\b", text.lower())
        return [w for w in words if w not in STOP_WORDS]

    def keyword_overlap(query_kws, doc_text):
        doc_lower = doc_text.lower()
        if not query_kws:
            return 0.0
        hits = sum(1 for kw in query_kws if kw in doc_lower)
        return hits / len(query_kws)

    # NEW: Extract quoted phrases from question (single or double quotes)
    def extract_quoted_phrases(text):
        phrases = []
        for pat in [r"'([^']{3,60})'", r'"([^"]{3,60})"']:
            phrases.extend(_re.findall(pat, text))
        return [p.strip() for p in phrases if len(p.strip()) >= 3]

    def quoted_phrase_boost(phrases, doc_text):
        """Strong boost if document contains an exact quoted phrase from the question."""
        if not phrases:
            return 0.0
        doc_lower = doc_text.lower()
        hits = sum(1 for p in phrases if p.lower() in doc_lower)
        return min(hits / len(phrases), 1.0)

    # NEW: Extract person names (capitalized words that aren't common title-case words)
    NOT_NAMES = {
        "What",
        "When",
        "Where",
        "Who",
        "How",
        "Which",
        "Did",
        "Do",
        "Was",
        "Were",
        "Have",
        "Has",
        "Had",
        "Is",
        "Are",
        "The",
        "My",
        "Our",
        "Their",
        "Can",
        "Could",
        "Would",
        "Should",
        "Will",
        "Shall",
        "May",
        "Might",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "January",
        "February",
        "March",
        "April",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
        "In",
        "On",
        "At",
        "For",
        "To",
        "Of",
        "With",
        "By",
        "From",
        "And",
        "But",
        "I",
        "It",
        "Its",
        "This",
        "That",
        "These",
        "Those",
        "Previously",
        "Recently",
        "Also",
        "Just",
        "Very",
        "More",
    }

    def extract_person_names(text):
        """Extract likely person names: capitalized words mid-sentence."""
        words = _re.findall(r"\b[A-Z][a-z]{2,15}\b", text)
        return list(set(w for w in words if w not in NOT_NAMES))

    def person_name_boost(names, doc_text):
        """Boost if document contains the person's name."""
        if not names:
            return 0.0
        doc_lower = doc_text.lower()
        hits = sum(1 for n in names if n.lower() in doc_lower)
        return min(hits / len(names), 1.0)

    def parse_question_date(date_str):
        try:
            return datetime.strptime(date_str.split(" (")[0], "%Y/%m/%d")
        except Exception:
            return None

    def parse_time_offset_days(question):
        q = question.lower()
        patterns = [
            (r"(\d+)\s+days?\s+ago", lambda m: (int(m.group(1)), 2)),
            (r"a\s+couple\s+(?:of\s+)?days?\s+ago", lambda m: (2, 2)),
            (r"yesterday", lambda m: (1, 1)),
            (r"a\s+week\s+ago", lambda m: (7, 3)),
            (r"(\d+)\s+weeks?\s+ago", lambda m: (int(m.group(1)) * 7, 5)),
            (r"last\s+week", lambda m: (7, 3)),
            (r"a\s+month\s+ago", lambda m: (30, 7)),
            (r"(\d+)\s+months?\s+ago", lambda m: (int(m.group(1)) * 30, 10)),
            (r"last\s+month", lambda m: (30, 7)),
            (r"last\s+year", lambda m: (365, 30)),
            (r"a\s+year\s+ago", lambda m: (365, 30)),
            (r"recently", lambda m: (14, 14)),
        ]
        for pattern, extractor in patterns:
            m = _re.search(pattern, q)
            if m:
                return extractor(m)
        return None

    def is_assistant_reference(question):
        q = question.lower()
        triggers = [
            "you suggested",
            "you told me",
            "you mentioned",
            "you said",
            "you recommended",
            "remind me what you",
            "you provided",
            "you listed",
            "you gave me",
            "you described",
            "what did you",
            "you came up with",
            "you helped me",
            "you explained",
            "can you remind me",
            "you identified",
        ]
        return any(t in q for t in triggers)

    # -------------------------------------------------------------------------
    # V4: Expanded preference patterns (adds memory/nostalgia for Miss 1)
    # -------------------------------------------------------------------------
    PREF_PATTERNS = [
        r"i(?:'ve been| have been) having (?:trouble|issues?|problems?) with ([^,\.!?]{5,80})",
        r"i(?:'ve been| have been) feeling ([^,\.!?]{5,60})",
        r"i(?:'ve been| have been) (?:struggling|dealing) with ([^,\.!?]{5,80})",
        r"i(?:'ve been| have been) (?:worried|concerned) about ([^,\.!?]{5,80})",
        r"i(?:'m| am) (?:worried|concerned) about ([^,\.!?]{5,80})",
        r"i prefer ([^,\.!?]{5,60})",
        r"i usually ([^,\.!?]{5,60})",
        r"i(?:'ve been| have been) (?:trying|attempting) to ([^,\.!?]{5,80})",
        r"i(?:'ve been| have been) (?:considering|thinking about) ([^,\.!?]{5,80})",
        r"lately[,\s]+(?:i've been|i have been|i'm|i am) ([^,\.!?]{5,80})",
        r"recently[,\s]+(?:i've been|i have been|i'm|i am) ([^,\.!?]{5,80})",
        r"i(?:'ve been| have been) (?:working on|focused on|interested in) ([^,\.!?]{5,80})",
        r"i want to ([^,\.!?]{5,60})",
        r"i(?:'m| am) looking (?:to|for) ([^,\.!?]{5,60})",
        r"i(?:'m| am) thinking (?:about|of) ([^,\.!?]{5,60})",
        r"i(?:'ve been| have been) (?:noticing|experiencing) ([^,\.!?]{5,80})",
        # NEW in V4 — memory/nostalgia patterns (for high school reunion miss):
        r"i (?:still )?remember (?:the |my )?([^,\.!?]{5,80})",
        r"i used to ([^,\.!?]{5,60})",
        r"when i was (?:in high school|in college|young|a kid|growing up)[,\s]+([^,\.!?]{5,80})",
        r"growing up[,\s]+([^,\.!?]{5,80})",
        r"(?:happy|fond|good|positive) (?:high school|college|childhood|school) (?:experience|memory|memories|time)[^,\.!?]{0,60}",
    ]

    def extract_preferences(session):
        """Extract preference/concern/memory expressions from user turns in a session."""
        mentions = []
        for turn in session:
            if turn["role"] != "user":
                continue
            text = turn["content"].lower()
            for pat in PREF_PATTERNS:
                for match in _re.findall(pat, text, _re.IGNORECASE):
                    if isinstance(match, tuple):
                        match = " ".join(match)
                    clean = match.strip().rstrip(".,;!? ")
                    if 5 <= len(clean) <= 80:
                        mentions.append(clean)
        seen = set()
        unique = []
        for m in mentions:
            if m not in seen:
                seen.add(m)
                unique.append(m)
        return unique[:12]

    # -------------------------------------------------------------------------
    # Build corpus
    # -------------------------------------------------------------------------
    sessions = entry["haystack_sessions"]
    session_ids = entry["haystack_session_ids"]
    dates = entry["haystack_dates"]
    question = entry["question"]
    question_date = parse_question_date(entry.get("question_date", ""))

    # V4: Pre-extract question signals
    quoted_phrases = extract_quoted_phrases(question)
    person_names = extract_person_names(question)

    corpus_user = []
    corpus_full = []
    corpus_ids = []
    corpus_timestamps = []

    pref_docs = []
    pref_ids = []
    pref_timestamps = []

    for session, sess_id, date in zip(sessions, session_ids, dates):
        user_turns = [t["content"] for t in session if t["role"] == "user"]
        all_turns = [t["content"] for t in session]
        if not user_turns:
            continue
        corpus_user.append("\n".join(user_turns))
        corpus_full.append("\n".join(all_turns))
        corpus_ids.append(sess_id)
        corpus_timestamps.append(date)

        prefs = extract_preferences(session)
        if prefs:
            pref_doc = "User has mentioned: " + "; ".join(prefs)
            pref_docs.append(pref_doc)
            pref_ids.append(sess_id)
            pref_timestamps.append(date)

    if not corpus_user:
        return [], corpus_user, corpus_ids, corpus_timestamps

    # -------------------------------------------------------------------------
    # Two-pass for assistant-reference questions — V4 uses corpus_full for Pass 1
    # (ensures the quoted phrases appear in the indexed text)
    # -------------------------------------------------------------------------
    if is_assistant_reference(question):
        collection = _fresh_collection()
        # Index full turns (not just user) so assistant's exact words are searchable
        collection.add(
            documents=corpus_full,
            ids=[f"doc_{i}" for i in range(len(corpus_full))],
            metadatas=[
                {"corpus_id": cid, "timestamp": ts}
                for cid, ts in zip(corpus_ids, corpus_timestamps)
            ],
        )
        results = collection.query(
            query_texts=[question],
            n_results=min(50, len(corpus_full)),
            include=["distances", "metadatas", "documents"],
        )
        result_ids = results["ids"][0]
        distances = results["distances"][0]
        documents = results["documents"][0]

        # Apply quoted phrase + name boost in scoring
        scored = []
        for rid, dist, doc in zip(result_ids, distances, documents):
            idx = int(rid.split("_")[1])
            overlap = keyword_overlap(extract_keywords(question), doc)
            fused_dist = dist * (1.0 - hybrid_weight * overlap)
            # Quoted phrase boost — strong signal for assistant-recall questions
            q_boost = quoted_phrase_boost(quoted_phrases, doc)
            if q_boost > 0:
                fused_dist = fused_dist * (1.0 - 0.60 * q_boost)
            scored.append((idx, fused_dist))

        scored.sort(key=lambda x: x[1])
        seen = set()
        ranked_indices = []
        for idx, _ in scored:
            if corpus_ids[idx] not in seen:
                seen.add(corpus_ids[idx])
                ranked_indices.append(idx)
        for i in range(len(corpus_user)):
            if corpus_ids[i] not in seen:
                ranked_indices.append(i)
                seen.add(corpus_ids[i])
        return ranked_indices, corpus_user, corpus_ids, corpus_timestamps

    # -------------------------------------------------------------------------
    # Build expanded collection: user docs + synthetic preference docs
    # -------------------------------------------------------------------------
    all_docs = corpus_user + pref_docs
    all_ids_meta = corpus_ids + pref_ids
    all_ts = corpus_timestamps + pref_timestamps

    collection = _fresh_collection()
    collection.add(
        documents=all_docs,
        ids=[f"doc_{i}" for i in range(len(all_docs))],
        metadatas=[
            {"corpus_id": cid, "timestamp": ts, "is_pref": i >= len(corpus_user)}
            for i, (cid, ts) in enumerate(zip(all_ids_meta, all_ts))
        ],
    )

    query_keywords = extract_keywords(question)
    results = collection.query(
        query_texts=[question],
        n_results=min(n_results, len(all_docs)),
        include=["distances", "metadatas", "documents"],
    )

    result_ids = results["ids"][0]
    distances = results["distances"][0]
    documents = results["documents"][0]
    doc_id_to_idx = {f"doc_{i}": i for i in range(len(all_docs))}

    time_offset = parse_time_offset_days(question)
    target_date = None
    if time_offset and question_date:
        days_back, tolerance = time_offset
        target_date = question_date - timedelta(days=days_back)

    scored = []
    for rid, dist, doc in zip(result_ids, distances, documents):
        idx = doc_id_to_idx[rid]
        overlap = keyword_overlap(query_keywords, doc)
        fused_dist = dist * (1.0 - hybrid_weight * overlap)

        # Temporal boost (same as v3)
        if target_date:
            sess_date = parse_question_date(all_ts[idx])
            if sess_date:
                delta_days = abs((sess_date - target_date).days)
                tol = time_offset[1]
                if delta_days <= tol:
                    temporal_boost = 0.40
                elif delta_days <= tol * 3:
                    temporal_boost = 0.40 * (1.0 - (delta_days - tol) / (tol * 2))
                else:
                    temporal_boost = 0.0
                fused_dist = fused_dist * (1.0 - temporal_boost)

        # V4: Person name boost (for temporal-reasoning + person name questions)
        if person_names:
            n_boost = person_name_boost(person_names, doc)
            if n_boost > 0:
                fused_dist = fused_dist * (1.0 - 0.40 * n_boost)

        scored.append((idx, fused_dist))

    scored.sort(key=lambda x: x[1])

    corpus_id_to_user_idx = {cid: i for i, cid in enumerate(corpus_ids)}
    seen_ids = set()
    ranked_indices = []
    for idx, _ in scored:
        cid = all_ids_meta[idx]
        if cid not in seen_ids:
            seen_ids.add(cid)
            ranked_indices.append(corpus_id_to_user_idx[cid])

    for i in range(len(corpus_user)):
        if corpus_ids[i] not in seen_ids:
            ranked_indices.append(i)
            seen_ids.add(corpus_ids[i])

    return ranked_indices, corpus_user, corpus_ids, corpus_timestamps


# =============================================================================
# PALACE MODE — Hall classification + drawer indexing + hall-boosted retrieval
# =============================================================================

# Hall names mirror the MemPal palace taxonomy
HALL_PREFERENCES = "hall_preferences"
HALL_FACTS = "hall_facts"
HALL_EVENTS = "hall_events"
HALL_ASSISTANT = "hall_assistant_advice"

codex
I’ve got enough structure to turn this into concrete trade-off guidance. I’m pulling exact line references now so the final iteration write-up can separate shipped retrieval behavior, benchmark-only behavior, and the routing changes that are actually justified.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py | sed -n '70,230p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py | sed -n '120,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py | sed -n '480,660p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
   480	            ranked_indices.append(i)
   481	
   482	    return ranked_indices, corpus, corpus_ids, corpus_timestamps
   483	
   484	
   485	def build_palace_and_retrieve_hybrid(
   486	    entry, granularity="session", n_results=50, hybrid_weight=0.30
   487	):
   488	    """
   489	    Hybrid mode: semantic search + keyword overlap re-ranking.
   490	
   491	    Two-stage approach:
   492	    1. Retrieve top-N via ChromaDB semantic search (same as raw)
   493	    2. Re-rank by fusing semantic distance with keyword overlap score
   494	
   495	    Keyword overlap catches cases where the answer keyword is very specific
   496	    ("Business Administration", "stand mixer") but embedding similarity
   497	    alone doesn't push it into the top-5.
   498	
   499	    Also applies temporal recency bonus for temporal-reasoning questions.
   500	    """
   501	    STOP_WORDS = {
   502	        "what",
   503	        "when",
   504	        "where",
   505	        "who",
   506	        "how",
   507	        "which",
   508	        "did",
   509	        "do",
   510	        "was",
   511	        "were",
   512	        "have",
   513	        "has",
   514	        "had",
   515	        "is",
   516	        "are",
   517	        "the",
   518	        "a",
   519	        "an",
   520	        "my",
   521	        "me",
   522	        "i",
   523	        "you",
   524	        "your",
   525	        "their",
   526	        "it",
   527	        "its",
   528	        "in",
   529	        "on",
   530	        "at",
   531	        "to",
   532	        "for",
   533	        "of",
   534	        "with",
   535	        "by",
   536	        "from",
   537	        "ago",
   538	        "last",
   539	        "that",
   540	        "this",
   541	        "there",
   542	        "about",
   543	        "get",
   544	        "got",
   545	        "give",
   546	        "gave",
   547	        "buy",
   548	        "bought",
   549	        "made",
   550	        "make",
   551	    }
   552	
   553	    def extract_keywords(text):
   554	        words = re.findall(r"\b[a-z]{3,}\b", text.lower())
   555	        return [w for w in words if w not in STOP_WORDS]
   556	
   557	    def keyword_overlap(query_kws, doc_text):
   558	        doc_lower = doc_text.lower()
   559	        if not query_kws:
   560	            return 0.0
   561	        hits = sum(1 for kw in query_kws if kw in doc_lower)
   562	        return hits / len(query_kws)
   563	
   564	    corpus = []
   565	    corpus_ids = []
   566	    corpus_timestamps = []
   567	
   568	    sessions = entry["haystack_sessions"]
   569	    session_ids = entry["haystack_session_ids"]
   570	    dates = entry["haystack_dates"]
   571	
   572	    for sess_idx, (session, sess_id, date) in enumerate(zip(sessions, session_ids, dates)):
   573	        if granularity == "session":
   574	            user_turns = [t["content"] for t in session if t["role"] == "user"]
   575	            if user_turns:
   576	                doc = "\n".join(user_turns)
   577	                corpus.append(doc)
   578	                corpus_ids.append(sess_id)
   579	                corpus_timestamps.append(date)
   580	        else:
   581	            turn_num = 0
   582	            for turn in session:
   583	                if turn["role"] == "user":
   584	                    corpus.append(turn["content"])
   585	                    corpus_ids.append(f"{sess_id}_turn_{turn_num}")
   586	                    corpus_timestamps.append(date)
   587	                    turn_num += 1
   588	
   589	    if not corpus:
   590	        return [], corpus, corpus_ids, corpus_timestamps
   591	
   592	    collection = _fresh_collection()
   593	
   594	    collection.add(
   595	        documents=corpus,
   596	        ids=[f"doc_{i}" for i in range(len(corpus))],
   597	        metadatas=[
   598	            {"corpus_id": cid, "timestamp": ts} for cid, ts in zip(corpus_ids, corpus_timestamps)
   599	        ],
   600	    )
   601	
   602	    query = entry["question"]
   603	    results = collection.query(
   604	        query_texts=[query],
   605	        n_results=min(n_results, len(corpus)),
   606	        include=["distances", "metadatas", "documents"],
   607	    )
   608	
   609	    result_ids = results["ids"][0]
   610	    distances = results["distances"][0]
   611	    documents = results["documents"][0]
   612	
   613	    doc_id_to_idx = {f"doc_{i}": i for i in range(len(corpus))}
   614	
   615	    # Extract keywords from question for overlap scoring
   616	    query_keywords = extract_keywords(query)
   617	
   618	    # Re-rank by fusing semantic distance with keyword overlap
   619	    scored = []
   620	    for rid, dist, doc in zip(result_ids, distances, documents):
   621	        idx = doc_id_to_idx[rid]
   622	        overlap = keyword_overlap(query_keywords, doc)
   623	        # Lower distance = better. Reduce distance for keyword overlap.
   624	        fused_dist = dist * (1.0 - hybrid_weight * overlap)
   625	        scored.append((idx, fused_dist))
   626	
   627	    scored.sort(key=lambda x: x[1])
   628	    ranked_indices = [idx for idx, _ in scored]
   629	
   630	    seen = set(ranked_indices)
   631	    for i in range(len(corpus)):
   632	        if i not in seen:
   633	            ranked_indices.append(i)
   634	
   635	    return ranked_indices, corpus, corpus_ids, corpus_timestamps
   636	
   637	
   638	def build_palace_and_retrieve_full(entry, granularity="session", n_results=50):
   639	    """
   640	    Full-turn mode: index BOTH user and assistant turns per session.
   641	
   642	    The key insight: assistant responses contain confirmed facts ("Yes, you graduated
   643	    with a Business Administration degree") that are exactly what benchmark questions
   644	    ask about. Indexing only user turns misses half the signal.
   645	    """
   646	    corpus = []
   647	    corpus_ids = []
   648	    corpus_timestamps = []
   649	
   650	    sessions = entry["haystack_sessions"]
   651	    session_ids = entry["haystack_session_ids"]
   652	    dates = entry["haystack_dates"]
   653	
   654	    for sess_idx, (session, sess_id, date) in enumerate(zip(sessions, session_ids, dates)):
   655	        if granularity == "session":
   656	            # All turns: user questions + assistant confirmations/answers
   657	            all_turns = [t["content"] for t in session]
   658	            if all_turns:
   659	                doc = "\n".join(all_turns)
   660	                corpus.append(doc)

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts | sed -n '20,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    20	   1. TYPES & CONSTANTS
    21	----------------------------------------------------------------*/
    22	
    23	/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
    24	type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
    25	
    26	/** Maps each complexity tier to the set of channels that should be executed. */
    27	interface ChannelRoutingConfig {
    28	  simple: ChannelName[];
    29	  moderate: ChannelName[];
    30	  complex: ChannelName[];
    31	}
    32	
    33	/** Result of the routeQuery convenience function. */
    34	interface RouteResult {
    35	  tier: QueryComplexityTier;
    36	  channels: ChannelName[];
    37	  classification: ClassificationResult;
    38	}
    39	
    40	/** All available channels in execution order. */
    41	const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
    42	
    43	/** Minimum required channels for safe routing. */
    44	const MIN_CHANNELS = 2;
    45	
    46	/** Fallback channels used to pad configs that violate the minimum invariant. */
    47	const FALLBACK_CHANNELS: readonly ChannelName[] = ['vector', 'fts'] as const;
    48	const BM25_PRESERVING_ARTIFACTS = new Set([
    49	  'spec',
    50	  'plan',
    51	  'tasks',
    52	  'checklist',
    53	  'decision-record',
    54	  'implementation-summary',
    55	  'research',
    56	]);
    57	
    58	/* ───────────────────────────────────────────────────────────────
    59	   2. DEFAULT ROUTING CONFIG
    60	----------------------------------------------------------------*/
    61	
    62	/**
    63	 * Default tier-to-channel mapping:
    64	 * - simple:   2 channels (vector + fts) — fastest path
    65	 * - moderate: 3 channels (vector + fts + bm25) — balanced
    66	 * - complex:  5 channels (all) — full pipeline
    67	 */
    68	const DEFAULT_ROUTING_CONFIG: ChannelRoutingConfig = {
    69	  simple: ['vector', 'fts'],
    70	  moderate: ['vector', 'fts', 'bm25'],
    71	  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    72	};
    73	
    74	/* ───────────────────────────────────────────────────────────────
    75	   3. CHANNEL SUBSET RESOLUTION
    76	----------------------------------------------------------------*/
    77	
    78	/**
    79	 * Enforce the minimum 2-distinct-channel invariant on a channel list.
    80	 * If the list has fewer than MIN_CHANNELS entries, pad with
    81	 * fallback channels (vector, fts) until the minimum is met.
    82	 */
    83	function enforceMinimumChannels(channels: ChannelName[]): ChannelName[] {
    84	  const result = [...new Set(channels)] as ChannelName[];
    85	  if (result.length >= MIN_CHANNELS) return result;
    86	
    87	  for (const fallback of FALLBACK_CHANNELS) {
    88	    if (result.length >= MIN_CHANNELS) break;
    89	    if (!result.includes(fallback)) {
    90	      result.push(fallback);
    91	    }
    92	  }
    93	
    94	  return result;
    95	}
    96	
    97	/**
    98	 * Get the channel subset for a given complexity tier.
    99	 *
   100	 * @param tier - The classified query complexity tier
   101	 * @param config - Optional custom routing config (defaults to DEFAULT_ROUTING_CONFIG)
   102	 * @returns Array of channel names to execute, guaranteed minimum 2 channels
   103	 */
   104	function getChannelSubset(
   105	  tier: QueryComplexityTier,
   106	  config?: ChannelRoutingConfig,
   107	): ChannelName[] {
   108	  const effectiveConfig = config ?? DEFAULT_ROUTING_CONFIG;
   109	  const channels = effectiveConfig[tier] ?? [...ALL_CHANNELS];
   110	  return enforceMinimumChannels([...channels]);
   111	}
   112	
   113	function shouldPreserveBm25(query: string): boolean {
   114	  const intent = classifyIntent(query).intent;
   115	  if (intent === 'find_spec' || intent === 'find_decision') {
   116	    return true;
   117	  }
   118	
   119	  const artifact = getStrategyForQuery(query).detectedClass;
   120	  return BM25_PRESERVING_ARTIFACTS.has(artifact);
   121	}
   122	
   123	/* ───────────────────────────────────────────────────────────────
   124	   4. CONVENIENCE: CLASSIFY + ROUTE
   125	----------------------------------------------------------------*/
   126	
   127	/**
   128	 * Classify a query's complexity and route it to the appropriate channel subset
   129	 * in a single call.
   130	 *
   131	 * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled, returns all 5 channels
   132	 * (full pipeline) regardless of classification result.
   133	 *
   134	 * @param query - The search query to classify and route
   135	 * @param triggerPhrases - Optional trigger phrases for simple-tier classification
   136	 * @returns RouteResult with tier, channels, and full classification details
   137	 */
   138	function routeQuery(
   139	  query: string,
   140	  triggerPhrases?: string[],
   141	): RouteResult {
   142	  const classification = classifyQueryComplexity(query, triggerPhrases);
   143	
   144	  // When feature flag is disabled, classifier returns 'complex' with 'fallback' confidence.
   145	  // In that case, always return all channels (full pipeline — safe default).
   146	  if (!isComplexityRouterEnabled()) {
   147	    return {
   148	      tier: classification.tier,
   149	      channels: [...ALL_CHANNELS],
   150	      classification,
   151	    };
   152	  }
   153	
   154	  const channels = getChannelSubset(classification.tier);
   155	  const adjustedChannels = classification.tier === 'simple' && shouldPreserveBm25(query)
   156	    ? enforceMinimumChannels([...channels, 'bm25'])
   157	    : channels;
   158	
   159	  return {
   160	    tier: classification.tier,
   161	    channels: adjustedChannels,
   162	    classification,
   163	  };
   164	}
   165	
   166	/* ───────────────────────────────────────────────────────────────
   167	   5. EXPORTS
   168	----------------------------------------------------------------*/
   169	
   170	export {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '430,540p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   430	    return false;
   431	  }
   432	
   433	  try {
   434	    const result = (db.prepare(`
   435	      SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'
   436	    `) as Database.Statement).get() as { name: string } | undefined;
   437	    return !!result;
   438	  } catch (_err: unknown) {
   439	    // Swallow DB errors; caller treats absence as unavailable
   440	    return false;
   441	  }
   442	}
   443	
   444	/**
   445	 * Run FTS5 full-text search with weighted BM25 scoring and optional spec folder filtering.
   446	 * @param query - The search query string.
   447	 * @param options - Optional limit, specFolder filter, and includeArchived flag.
   448	 * @returns Array of FTS-scored results tagged with source 'fts'.
   449	 */
   450	function ftsSearch(
   451	  query: string,
   452	  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
   453	): HybridSearchResult[] {
   454	  if (!db || !isFtsAvailable()) {
   455	    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
   456	    return [];
   457	  }
   458	
   459	  const { limit = DEFAULT_LIMIT, specFolder, includeArchived = false } = options;
   460	
   461	  try {
   462	    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
   463	    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
   464	    // (title 10x, trigger_phrases 5x, file_path 2x, content 1x)
   465	    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
   466	    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
   467	
   468	    return bm25Results.map(row => ({
   469	      ...row,
   470	      id: row.id as number,
   471	      score: row.fts_score || 0,
   472	      source: 'fts',
   473	    }));
   474	  } catch (error: unknown) {
   475	    const msg = error instanceof Error ? error.message : String(error);
   476	    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
   477	    return [];
   478	  }
   479	}
   480	
   481	// 10. COMBINED LEXICAL SEARCH
   482	
   483	/**
   484	 * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
   485	 * @param query - The search query string.
   486	 * @param options - Optional limit, specFolder filter, and includeArchived flag.
   487	 * @returns Deduplicated array of merged results sorted by score descending.
   488	 */
   489	function combinedLexicalSearch(
   490	  query: string,
   491	  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
   492	): HybridSearchResult[] {
   493	  const ftsResults = ftsSearch(query, options);
   494	  const bm25Results = bm25Search(query, options);
   495	
   496	  // Merge by canonical ID, prefer FTS scores.
   497	  // CanonicalResultId() prevents duplicate rows when one channel emits
   498	  // Numeric IDs (42) and another emits string IDs ("42" or "mem:42").
   499	  const merged = new Map<string, HybridSearchResult>();
   500	
   501	  for (const r of ftsResults) {
   502	    merged.set(canonicalResultId(r.id), r);
   503	  }
   504	
   505	  for (const r of bm25Results) {
   506	    const canonicalId = canonicalResultId(r.id);
   507	    if (!merged.has(canonicalId)) {
   508	      merged.set(canonicalId, r);
   509	    }
   510	  }
   511	
   512	  return Array.from(merged.values())
   513	    .sort((a, b) => b.score - a.score)
   514	    .slice(0, options.limit || DEFAULT_LIMIT);
   515	}
   516	
   517	type RawChannelList = {
   518	  source: string;
   519	  results: Array<{ id: number | string; [key: string]: unknown }>;
   520	};
   521	
   522	function resolveRawCandidateScore(result: { score?: unknown; similarity?: unknown }): number {
   523	  if (typeof result.score === 'number' && Number.isFinite(result.score)) {
   524	    return result.score;
   525	  }
   526	  if (typeof result.similarity === 'number' && Number.isFinite(result.similarity)) {
   527	    return result.similarity / 100;
   528	  }
   529	  return 0;
   530	}
   531	
   532	function getCandidateSources(result: HybridSearchResult): string[] {
   533	  const sourceList = (result as { sources?: unknown }).sources;
   534	  if (Array.isArray(sourceList)) {
   535	    return sourceList.filter((value): value is string => typeof value === 'string');
   536	  }
   537	  return typeof result.source === 'string' && result.source.length > 0
   538	    ? [result.source]
   539	    : [];
   540	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '2100,2198p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1000,1285p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2100	/**
  2101	 * PI-A2: Quality-aware 3-tier search fallback chain.
  2102	 *
  2103	 * TIER 1: hybridSearchEnhanced at minSimilarity=30
  2104	 *   → Pass if quality signal is healthy AND count >= 3
  2105	 *
  2106	 * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
  2107	 *   → Merge with Tier 1, dedup by id
  2108	 *   → Pass if quality signal is healthy AND count >= 3
  2109	 *
  2110	 * TIER 3: structuralSearch (pure SQL last-resort)
  2111	 *   → Merge with Tier 1+2 results after score calibration
  2112	 *   → Return capped set
  2113	 *
  2114	 * @param query - The search query string.
  2115	 * @param embedding - Optional embedding vector for semantic search.
  2116	 * @param options - Hybrid search configuration options.
  2117	 * @returns Results with _degradation metadata attached as non-enumerable property.
  2118	 */
  2119	async function searchWithFallbackTiered(
  2120	  query: string,
  2121	  embedding: Float32Array | number[] | null,
  2122	  options: HybridSearchOptions = {}
  2123	): Promise<HybridSearchResult[]> {
  2124	  const degradationEvents: DegradationEvent[] = [];
  2125	  const { stages } = await executeFallbackPlan(query, embedding, options, 'tiered');
  2126	  const tier1Stage = stages[0];
  2127	  const tier2Stage = stages[1];
  2128	  let results = tier1Stage?.results ?? [];
  2129	
  2130	  const tier1Trigger = checkDegradation(results);
  2131	  if (!tier1Trigger) {
  2132	    const finalTier1 = tier1Stage?.execution
  2133	      ? await enrichFusedResults(query, tier1Stage.execution, tier1Stage.options, results)
  2134	      : applyResultLimit(results, options.limit);
  2135	    // Tier 1 passed quality thresholds — attach empty degradation metadata
  2136	    Object.defineProperty(finalTier1, '_degradation', {
  2137	      value: degradationEvents,
  2138	      enumerable: false,
  2139	      configurable: true,
  2140	    });
  2141	    return finalTier1;
  2142	  }
  2143	
  2144	  // TIER 2: Widen search — lower similarity, force all channels
  2145	  const tier1CountBefore = results.length;
  2146	
  2147	  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
  2148	
  2149	  const tier2Results = tier2Stage?.results ?? [];
  2150	  results = mergeResults(results, tier2Results);
  2151	  degradationEvents.push({
  2152	    tier: 1,
  2153	    trigger: tier1Trigger,
  2154	    resultCountBefore: tier1CountBefore,
  2155	    resultCountAfter: results.length,
  2156	  });
  2157	
  2158	  const tier2Trigger = checkDegradation(results);
  2159	  if (!tier2Trigger) {
  2160	    const finalTier2 = tier2Stage?.execution
  2161	      ? await enrichFusedResults(query, tier2Stage.execution, tier2Stage.options, results)
  2162	      : applyResultLimit(results, options.limit);
  2163	    Object.defineProperty(finalTier2, '_degradation', {
  2164	      value: degradationEvents,
  2165	      enumerable: false,
  2166	      configurable: true,
  2167	    });
  2168	    return finalTier2;
  2169	  }
  2170	
  2171	  // TIER 3: Structural search (pure SQL last-resort)
  2172	  const tier2CountBefore = results.length;
  2173	
  2174	  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
  2175	
  2176	  const tier3Results = structuralSearch({ specFolder: options.specFolder, limit: options.limit });
  2177	  const calibratedTier3 = calibrateTier3Scores(results, tier3Results);
  2178	  results = mergeResults(results, calibratedTier3);
  2179	  degradationEvents.push({
  2180	    tier: 2,
  2181	    trigger: tier2Trigger,
  2182	    resultCountBefore: tier2CountBefore,
  2183	    resultCountAfter: results.length,
  2184	  });
  2185	
  2186	  const finalResults = tier2Stage?.execution
  2187	    ? await enrichFusedResults(query, tier2Stage.execution, tier2Stage.options, results)
  2188	    : applyResultLimit(results, options.limit);
  2189	
  2190	  Object.defineProperty(finalResults, '_degradation', {
  2191	    value: degradationEvents,
  2192	    enumerable: false,
  2193	    configurable: true,
  2194	  });
  2195	
  2196	  return finalResults;
  2197	}
  2198	

 succeeded in 0ms:
  1000	    const evaluationMode = options.evaluationMode === true;
  1001	    const lists: HybridFusionExecution['lists'] = [];
  1002	
  1003	    // Pipeline metadata collector (populated by flag-gated stages)
  1004	    const s3meta: Sprint3PipelineMeta = {};
  1005	
  1006	    // -- Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
  1007	    // When enabled, classifies query complexity and restricts channels to a
  1008	    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
  1009	    const routeResult = routeQuery(query, options.triggerPhrases);
  1010	    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
  1011	    const activeChannels = options.forceAllChannels
  1012	      ? new Set<ChannelName>(allPossibleChannels)
  1013	      : new Set<ChannelName>(routeResult.channels);
  1014	
  1015	    // Respect explicit caller channel disables across both the primary route and
  1016	    // every fallback tier. useGraph=false also disables the dependent degree lane.
  1017	    const allowedChannels = getAllowedChannels(options);
  1018	    for (const channel of allPossibleChannels) {
  1019	      if (!allowedChannels.has(channel)) activeChannels.delete(channel);
  1020	    }
  1021	
  1022	    const skippedChannels = allPossibleChannels.filter(ch => !activeChannels.has(ch));
  1023	
  1024	    if (skippedChannels.length > 0) {
  1025	      s3meta.routing = {
  1026	        tier: routeResult.tier,
  1027	        channels: routeResult.channels,
  1028	        skippedChannels,
  1029	        featureFlagEnabled: isComplexityRouterEnabled(),
  1030	        confidence: routeResult.classification.confidence,
  1031	        features: routeResult.classification.features as Record<string, unknown>,
  1032	      };
  1033	    }
  1034	
  1035	    // -- Stage E: Dynamic Token Budget (SPECKIT_DYNAMIC_TOKEN_BUDGET) --
  1036	    // Compute tier-aware budget early so it's available for downstream truncation.
  1037	    // When disabled, getDynamicTokenBudget returns the default 4000 budget with applied=false.
  1038	    const budgetResult = getDynamicTokenBudget(routeResult.tier);
  1039	    if (budgetResult.applied && !evaluationMode) {
  1040	      s3meta.tokenBudget = {
  1041	        tier: budgetResult.tier,
  1042	        budget: budgetResult.budget,
  1043	        applied: budgetResult.applied,
  1044	        featureFlagEnabled: isDynamicTokenBudgetEnabled(),
  1045	        configValues: DEFAULT_TOKEN_BUDGET_CONFIG as unknown as Record<string, number>,
  1046	        // headerOverhead and adjustedBudget are patched in below after they are computed
  1047	        headerOverhead: 0,
  1048	        adjustedBudget: budgetResult.budget,
  1049	      };
  1050	    }
  1051	
  1052	    // Channel results collected independently, merged after all complete
  1053	    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
  1054	    let ftsChannelResults: HybridSearchResult[] = [];
  1055	    let bm25ChannelResults: HybridSearchResult[] = [];
  1056	    const vectorEmbeddingCache = new Map<number, Float32Array>();
  1057	
  1058	    // All channels use synchronous better-sqlite3; sequential execution
  1059	    // Is correct — Promise.all adds overhead without parallelism.
  1060	
  1061	    // Vector channel — gated by query-complexity routing
  1062	    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
  1063	      try {
  1064	        const vectorResults = vectorSearchFn(embedding, {
  1065	          limit: options.limit || DEFAULT_LIMIT,
  1066	          specFolder: options.specFolder,
  1067	          minSimilarity: options.minSimilarity || 0,
  1068	          includeConstitutional: false,
  1069	          includeArchived: options.includeArchived || false,
  1070	          includeEmbeddings: true,
  1071	        });
  1072	        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
  1073	          ...r,
  1074	          id: r.id as number | string,
  1075	          source: 'vector',
  1076	        }));
  1077	        for (const result of semanticResults) {
  1078	          if (typeof result.id !== 'number') continue;
  1079	          const embeddingCandidate = toEmbeddingBufferView(
  1080	            (result as Record<string, unknown>).embedding
  1081	            ?? (result as Record<string, unknown>).embeddingBuffer
  1082	          );
  1083	          if (embeddingCandidate) {
  1084	            vectorEmbeddingCache.set(result.id, embeddingCandidate);
  1085	          }
  1086	        }
  1087	        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
  1088	      } catch (_err: unknown) {
  1089	        // Non-critical — vector channel failure does not block pipeline
  1090	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1091	      }
  1092	    }
  1093	
  1094	    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
  1095	    if (activeChannels.has('fts')) {
  1096	      ftsChannelResults = ftsSearch(query, options);
  1097	      if (ftsChannelResults.length > 0) {
  1098	        // FTS weight reduced to 0.3 after ablation showed 0.8 was harmful,
  1099	        // flooding top-K with noisy lexical matches despite its exact-match value.
  1100	        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
  1101	      }
  1102	    }
  1103	
  1104	    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
  1105	    if (activeChannels.has('bm25')) {
  1106	      bm25ChannelResults = bm25Search(query, options);
  1107	      if (bm25ChannelResults.length > 0) {
  1108	        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
  1109	        // Has less precise scoring than SQLite FTS5 BM25; kept for coverage breadth.
  1110	        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
  1111	      }
  1112	    }
  1113	
  1114	    // Graph channel — gated by query-complexity routing
  1115	    const useGraph = (options.useGraph !== false) && activeChannels.has('graph');
  1116	    if (useGraph && graphSearchFn) {
  1117	      try {
  1118	        graphMetrics.totalQueries++; // counted only if channel executes
  1119	        const graphResults = graphSearchFn(query, {
  1120	          limit: options.limit || DEFAULT_LIMIT,
  1121	          specFolder: options.specFolder,
  1122	          intent: options.intent,
  1123	        });
  1124	        if (graphResults.length > 0) {
  1125	          graphMetrics.graphHits++;
  1126	          lists.push({ source: 'graph', results: graphResults.map((r: Record<string, unknown>) => ({
  1127	            ...r,
  1128	            id: r.id as number | string,
  1129	          })), weight: 0.5 });
  1130	        }
  1131	      } catch (_err: unknown) {
  1132	        // Non-critical — graph channel failure does not block pipeline
  1133	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1134	      }
  1135	    }
  1136	
  1137	    // Degree channel re-ranks based on causal-edge connectivity.
  1138	    // Graduated: default-ON. Set SPECKIT_DEGREE_BOOST=false to disable.
  1139	    // Degree channel — also gated by query-complexity routing
  1140	    if (activeChannels.has('degree') && db && isDegreeBoostEnabled()) {
  1141	      try {
  1142	        // Collect all numeric IDs from existing channels
  1143	        const allResultIds = new Set<number>();
  1144	        for (const list of lists) {
  1145	          for (const r of list.results) {
  1146	            const id = r.id;
  1147	            if (typeof id === 'number') allResultIds.add(id);
  1148	          }
  1149	        }
  1150	
  1151	        if (allResultIds.size > 0) {
  1152	          const degreeScores = computeDegreeScores(db, Array.from(allResultIds));
  1153	
  1154	          // Build a ranked list sorted by degree score (highest first)
  1155	          const degreeItems: Array<{ id: number; degreeScore: number }> = [];
  1156	          for (const [idStr, score] of degreeScores) {
  1157	            const numId = Number(idStr);
  1158	            if (score > 0 && !isNaN(numId)) {
  1159	              degreeItems.push({ id: numId, degreeScore: score });
  1160	            }
  1161	          }
  1162	          degreeItems.sort((a, b) => b.degreeScore - a.degreeScore);
  1163	
  1164	          if (degreeItems.length > 0) {
  1165	            lists.push({
  1166	              source: 'degree',
  1167	              results: degreeItems.map(item => ({
  1168	                id: item.id,
  1169	                degreeScore: item.degreeScore,
  1170	              })),
  1171	              weight: DEGREE_CHANNEL_WEIGHT,
  1172	            });
  1173	          }
  1174	        }
  1175	      } catch (_err: unknown) {
  1176	        // Non-critical — degree channel failure does not block pipeline
  1177	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1178	      }
  1179	    }
  1180	
  1181	    // Merge keyword results after all channels complete
  1182	    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
  1183	      ...ftsChannelResults,
  1184	      ...bm25ChannelResults,
  1185	    ];
  1186	
  1187	    if (options.skipFusion) {
  1188	      return {
  1189	        evaluationMode,
  1190	        intent: options.intent || classifyIntent(query).intent,
  1191	        lists,
  1192	        routeResult,
  1193	        budgetResult,
  1194	        s3meta,
  1195	        vectorEmbeddingCache,
  1196	        fusedResults: collectCandidatesFromLists(
  1197	          lists.filter((list) => list.source !== 'degree'),
  1198	          options.limit ?? DEFAULT_LIMIT
  1199	        ),
  1200	      };
  1201	    }
  1202	
  1203	    if (lists.length === 0) {
  1204	      return null;
  1205	    }
  1206	
  1207	    // Track multi-source and graph-only results
  1208	    const sourceMap = new Map<string, Set<string>>();
  1209	    for (const list of lists) {
  1210	      for (const r of list.results) {
  1211	        const key = canonicalResultId(r.id);
  1212	        if (!sourceMap.has(key)) sourceMap.set(key, new Set());
  1213	        sourceMap.get(key)!.add(list.source); // non-null safe: has() guard above guarantees entry exists
  1214	      }
  1215	    }
  1216	    for (const [, sources] of sourceMap) {
  1217	      if (sources.size > 1) graphMetrics.multiSourceResults++;
  1218	      if (sources.size === 1 && sources.has('graph')) graphMetrics.graphOnlyResults++;
  1219	    }
  1220	
  1221	    // C138/T315: Build weighted fusion lists once from lightweight adaptive
  1222	    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
  1223	    const intent = options.intent || classifyIntent(query).intent;
  1224	    const adaptiveEnabled = isAdaptiveFusionEnabled();
  1225	    const fusionWeights = adaptiveEnabled
  1226	      ? getAdaptiveWeights(intent)
  1227	      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
  1228	    const { semanticWeight, keywordWeight, graphWeight: adaptiveGraphWeight } = fusionWeights;
  1229	    const keywordFusionResults = keywordResults.map((result) => ({
  1230	      ...result,
  1231	      source: 'keyword',
  1232	    }));
  1233	    const fusionLists = lists
  1234	      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
  1235	      .map((list) => {
  1236	        if (list.source === 'vector') {
  1237	          return { ...list, weight: semanticWeight };
  1238	        }
  1239	        if (list.source === 'graph' && typeof adaptiveGraphWeight === 'number') {
  1240	          return { ...list, weight: adaptiveGraphWeight };
  1241	        }
  1242	        return { ...list };
  1243	      });
  1244	
  1245	    if (keywordFusionResults.length > 0 && keywordWeight > 0) {
  1246	      fusionLists.push({
  1247	        source: 'keyword',
  1248	        results: keywordFusionResults,
  1249	        weight: keywordWeight,
  1250	      });
  1251	    }
  1252	
  1253	    const fused = fuseResultsMulti(fusionLists);
  1254	
  1255	    const fusedResults = fused.map(toHybridResult).map((row) => {
  1256	      const rowRecord = row as Record<string, unknown>;
  1257	      if (rowRecord.parentMemoryId !== undefined) return row;
  1258	      const normalizedParentMemoryId = rowRecord.parent_id ?? rowRecord.parentId;
  1259	      if (normalizedParentMemoryId === undefined) return row;
  1260	      return {
  1261	        ...row,
  1262	        parentMemoryId: normalizedParentMemoryId,
  1263	      };
  1264	    });
  1265	
  1266	    return {
  1267	      evaluationMode,
  1268	      intent,
  1269	      lists,
  1270	      routeResult,
  1271	      budgetResult,
  1272	      s3meta,
  1273	      vectorEmbeddingCache,
  1274	      fusedResults,
  1275	    };
  1276	  } catch (error: unknown) {
  1277	    const msg = error instanceof Error ? error.message : String(error);
  1278	    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
  1279	    return null;
  1280	  }
  1281	}
  1282	
  1283	async function enrichFusedResults(
  1284	  query: string,
  1285	  execution: HybridFusionExecution,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Sqlite Fts
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Semantic and lexical search (memory_search)
     5	// Weighted BM25 scoring for FTS5 full-text search.
     6	// Extracted from hybrid-search.ts ftsSearch() for independent
     7	// Testing and future delegation.
     8	
     9	import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
    10	import type Database from 'better-sqlite3';
    11	
    12	// ───────────────────────────────────────────────────────────────
    13	// 2. INTERFACES
    14	
    15	// ───────────────────────────────────────────────────────────────
    16	interface FtsBm25Result {
    17	  id: number;
    18	  fts_score: number;
    19	  [key: string]: unknown;
    20	}
    21	
    22	interface FtsBm25Options {
    23	  limit?: number;
    24	  specFolder?: string;
    25	  includeArchived?: boolean;
    26	}
    27	
    28	type LexicalPath = 'fts5' | 'like' | 'unavailable';
    29	type FallbackState =
    30	  | 'ok'
    31	  | 'compile_probe_miss'
    32	  | 'missing_table'
    33	  | 'no_such_module_fts5'
    34	  | 'bm25_runtime_failure';
    35	
    36	interface LexicalCapabilitySnapshot {
    37	  lexicalPath: LexicalPath;
    38	  fallbackState: FallbackState;
    39	}
    40	
    41	let lastLexicalCapabilitySnapshot: LexicalCapabilitySnapshot | null = null;
    42	
    43	function cloneLexicalCapabilitySnapshot(
    44	  snapshot: LexicalCapabilitySnapshot | null
    45	): LexicalCapabilitySnapshot | null {
    46	  return snapshot ? { ...snapshot } : null;
    47	}
    48	
    49	function setLastLexicalCapabilitySnapshot(snapshot: LexicalCapabilitySnapshot): void {
    50	  lastLexicalCapabilitySnapshot = { ...snapshot };
    51	}
    52	
    53	function getLastLexicalCapabilitySnapshot(): LexicalCapabilitySnapshot | null {
    54	  return cloneLexicalCapabilitySnapshot(lastLexicalCapabilitySnapshot);
    55	}
    56	
    57	function resetLastLexicalCapabilitySnapshot(): void {
    58	  lastLexicalCapabilitySnapshot = null;
    59	}
    60	
    61	function toErrorMessage(error: unknown): string {
    62	  return error instanceof Error ? error.message : String(error);
    63	}
    64	
    65	function readCompileOptionValue(row: unknown): string | null {
    66	  if (typeof row === 'string') {
    67	    return row;
    68	  }
    69	  if (!row || typeof row !== 'object') {
    70	    return null;
    71	  }
    72	
    73	  const record = row as Record<string, unknown>;
    74	  const direct = record.compile_options;
    75	  if (typeof direct === 'string') {
    76	    return direct;
    77	  }
    78	
    79	  const firstString = Object.values(record).find((value) => typeof value === 'string');
    80	  return typeof firstString === 'string' ? firstString : null;
    81	}
    82	
    83	function isNoSuchModuleFts5Error(error: unknown): boolean {
    84	  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
    85	}
    86	
    87	function isBm25RuntimeFailure(error: unknown): boolean {
    88	  const message = toErrorMessage(error).toLowerCase();
    89	  return message.includes('bm25');
    90	}
    91	
    92	function probeFts5Capability(db: Database.Database): LexicalCapabilitySnapshot {
    93	  try {
    94	    const compileRows = (db.prepare('PRAGMA compile_options') as Database.Statement).all() as unknown[];
    95	    const hasFts5CompileFlag = compileRows
    96	      .map(readCompileOptionValue)
    97	      .some((value) => typeof value === 'string' && value.toUpperCase().includes('ENABLE_FTS5'));
    98	
    99	    if (!hasFts5CompileFlag) {
   100	      return {
   101	        lexicalPath: 'unavailable',
   102	        fallbackState: 'compile_probe_miss',
   103	      };
   104	    }
   105	  } catch {
   106	    return {
   107	      lexicalPath: 'unavailable',
   108	      fallbackState: 'compile_probe_miss',
   109	    };
   110	  }
   111	
   112	  try {
   113	    const result = (db.prepare(
   114	      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
   115	    ) as Database.Statement).get() as { name: string } | undefined;
   116	
   117	    if (!result) {
   118	      return {
   119	        lexicalPath: 'unavailable',
   120	        fallbackState: 'missing_table',
   121	      };
   122	    }
   123	  } catch (error: unknown) {
   124	    if (isNoSuchModuleFts5Error(error)) {
   125	      return {
   126	        lexicalPath: 'unavailable',
   127	        fallbackState: 'no_such_module_fts5',
   128	      };
   129	    }
   130	    return {
   131	      lexicalPath: 'unavailable',
   132	      fallbackState: 'missing_table',
   133	    };
   134	  }
   135	
   136	  return {
   137	    lexicalPath: 'fts5',
   138	    fallbackState: 'ok',
   139	  };
   140	}
   141	
   142	// ───────────────────────────────────────────────────────────────
   143	// 3. CORE FUNCTION
   144	
   145	// ───────────────────────────────────────────────────────────────
   146	/**
   147	 * Execute a weighted BM25 FTS5 search against memory_fts.
   148	 *
   149	 * Uses SQLite FTS5's built-in bm25() ranking function with
   150	 * per-column weights instead of the default `rank` pseudo-column.
   151	 * This gives title matches 10x weight, trigger_phrases 5x, etc.
   152	 *
   153	 * @param db - SQLite database connection
   154	 * @param query - Raw search query (will be sanitized)
   155	 * @param options - Search options (limit, specFolder, includeArchived)
   156	 * @returns Array of results with BM25 scores (higher = better)
   157	 * @example
   158	 * ```ts
   159	 * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
   160	 * ```
   161	 */
   162	function fts5Bm25Search(
   163	  db: Database.Database,
   164	  query: string,
   165	  options: FtsBm25Options = {}
   166	): FtsBm25Result[] {
   167	  const { limit = 20, specFolder, includeArchived = false } = options;
   168	
   169	  // Sanitize via shared tokenizer, then wrap each token in quotes and join with OR for recall
   170	  const tokens = normalizeLexicalQueryTokens(query).fts;
   171	  const sanitized = tokens
   172	    .map(t => (t.startsWith('"') && t.endsWith('"')) ? t : `"${t}"`)
   173	    .join(' OR ');
   174	
   175	  if (!sanitized) {
   176	    setLastLexicalCapabilitySnapshot(probeFts5Capability(db));
   177	    return [];
   178	  }
   179	
   180	  const folderFilter = specFolder
   181	    ? 'AND (m.spec_folder = ? OR m.spec_folder LIKE ? || "/%")'
   182	    : '';
   183	  const archivalFilter = !includeArchived
   184	    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
   185	    : '';
   186	  const deprecatedTierFilter =
   187	    "AND (m.importance_tier IS NULL OR m.importance_tier != 'deprecated')";
   188	
   189	  const params: (string | number)[] = specFolder
   190	    ? [sanitized, specFolder, specFolder, limit]
   191	    : [sanitized, limit];
   192	
   193	  // Bm25() returns negative scores (lower = better), so we negate
   194	  // To produce positive scores where higher = better match.
   195	  const [w0, w1, w2, w3] = BM25_FTS5_WEIGHTS;
   196	  const sql = `
   197	    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
   198	    FROM memory_fts
   199	    JOIN memory_index m ON m.id = memory_fts.rowid
   200	    WHERE memory_fts MATCH ?
   201	      ${folderFilter}
   202	      ${archivalFilter}
   203	      ${deprecatedTierFilter}
   204	    ORDER BY fts_score DESC
   205	    LIMIT ?
   206	  `;
   207	
   208	  const capability = probeFts5Capability(db);
   209	  setLastLexicalCapabilitySnapshot(capability);
   210	  if (capability.fallbackState !== 'ok') {
   211	    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
   212	    return [];
   213	  }
   214	
   215	  try {
   216	    const rows = (db.prepare(sql) as Database.Statement).all(
   217	      ...params
   218	    ) as Array<Record<string, unknown>>;
   219	
   220	    const normalizedRows = rows.map(row => ({
   221	      ...row,
   222	      id: row.id as number,
   223	      fts_score: (row.fts_score as number) || 0,
   224	    }));
   225	    setLastLexicalCapabilitySnapshot({
   226	      lexicalPath: 'fts5',
   227	      fallbackState: 'ok',
   228	    });
   229	    return normalizedRows;
   230	  } catch (error: unknown) {
   231	    const msg = error instanceof Error ? error.message : String(error);
   232	    const failureSnapshot: LexicalCapabilitySnapshot = isNoSuchModuleFts5Error(error)
   233	      ? {
   234	          lexicalPath: 'unavailable',
   235	          fallbackState: 'no_such_module_fts5',
   236	        }
   237	      : isBm25RuntimeFailure(error)
   238	        ? {
   239	            lexicalPath: 'unavailable',
   240	            fallbackState: 'bm25_runtime_failure',

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '640,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '300,530p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   331	    : [];
   332	  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;
   333	
   334	  if (!results || results.length === 0) {
   335	    const noMatchResponse = createMCPEmptyResponse({
   336	      tool: 'memory_match_triggers',
   337	      summary: 'No matching trigger phrases found',
   338	      data: {
   339	        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
   340	        degradedMatching: degradedTriggerMatching,
   341	        cognitive: useCognitive ? {
   342	          enabled: true,
   343	          sessionId,
   344	          turnNumber: turnNumber,
   345	          decayApplied: decayStats ? decayStats.decayedCount : 0
   346	        } : null
   347	      },
   348	      hints: [
   349	        'Ensure memories have trigger phrases defined',
   350	        'Try a different prompt or check memory content',
   351	        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
   352	      ],
   353	      startTime: startTime
   354	    });
   355	
   356	    logFinalTriggerEval([], Date.now() - startTime);
   357	    return noMatchResponse;
   358	  }
   359	
   360	  let formattedResults: FormattedResult[];
   361	  let cognitiveStats: CognitiveStats | null = null;
   362	
   363	  if (useCognitive) {
   364	    // Step 3: ACTIVATE (T209)
   365	    const activatedMemories: number[] = [];
   366	    for (const match of results) {
   367	      try {
   368	        attentionDecay.activateMemory(match.memoryId);
   369	        // T209: Persist max attention boost for matched memories.
   370	        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
   371	        activatedMemories.push(match.memoryId);
   372	      } catch (err: unknown) {
   373	        const message = toErrorMessage(err);
   374	        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
   375	      }
   376	    }
   377	
   378	    // Step 4: CO-ACTIVATE
   379	    const coActivatedMemories: CoActivatedMemory[] = [];
   380	    if (coActivation.isEnabled()) {
   381	      for (const memoryId of activatedMemories) {
   382	        try {
   383	          const boosted: CoActivatedMemory[] | null = coActivation.spreadActivation([memoryId])
   384	            .map(r => ({ memoryId: r.id }));
   385	          if (boosted && Array.isArray(boosted)) {
   386	            coActivatedMemories.push(...boosted);
   387	          }
   388	        } catch (err: unknown) {
   389	          const message = toErrorMessage(err);
   390	          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
   391	        }
   392	      }
   393	    }
   394	
   395	    const matchedIds = results.map((m: TriggerMatch) => m.memoryId);
   396	    const fullRecords = fetchMemoryRecords(matchedIds);
   397	
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
   431	
   432	      // Clamp to [0,1] — retrievability * decay or wmEntry scores
   433	      // Can drift outside the valid range due to floating-point arithmetic.
   434	      attentionScore = Math.max(0, Math.min(1, attentionScore));
   435	
   436	      return {
   437	        ...match,
   438	        attentionScore: attentionScore,
   439	        tier,
   440	        coActivated: coActivatedMemories.some(ca => ca.memoryId === match.memoryId)
   441	      };
   442	    });
   443	
   444	    const tieredResults = tierClassifier.filterAndLimitByState(enrichedResults, null, limit);
   445	
   446	    formattedResults = await Promise.all(tieredResults.map(async (r: EnrichedTriggerMatch) => {
   447	      const content: string = await getTieredContent({
   448	        filePath: r.filePath,
   449	        title: r.title,
   450	        triggerPhrases: r.matchedPhrases
   451	      }, r.tier);
   452	
   453	      return {
   454	        memoryId: r.memoryId,
   455	        specFolder: r.specFolder,
   456	        filePath: r.filePath,
   457	        title: r.title,
   458	        matchedPhrases: r.matchedPhrases,
   459	        importanceWeight: r.importanceWeight,
   460	        tier: r.tier,
   461	        attentionScore: r.attentionScore,
   462	        content: content,
   463	        coActivated: r.coActivated || false
   464	      };
   465	    }));
   466	
   467	    cognitiveStats = {
   468	      enabled: true,
   469	      sessionId: sessionId!,
   470	      turnNumber: turnNumber,
   471	      decayApplied: decayStats ? decayStats.decayedCount : 0,
   472	      memoriesActivated: activatedMemories.length,
   473	      coActivations: coActivatedMemories.length,
   474	      tierDistribution: tierClassifier.getStateStats(enrichedResults),
   475	      tokenMetrics: calculateTokenMetrics(results, formattedResults)
   476	    };
   477	
   478	  } else {
   479	    formattedResults = results.slice(0, limit).map((r: TriggerMatch) => ({
   480	      memoryId: r.memoryId,
   481	      specFolder: r.specFolder,
   482	      filePath: r.filePath,
   483	      title: r.title,
   484	      matchedPhrases: r.matchedPhrases,
   485	      importanceWeight: r.importanceWeight
   486	    }));
   487	  }
   488	
   489	  const latencyMs = Date.now() - startTime;
   490	  if (latencyMs > 100) {
   491	    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
   492	  }
   493	
   494	  const summary = useCognitive
   495	    ? `Matched ${formattedResults.length} memories with cognitive features`
   496	    : `Matched ${formattedResults.length} memories via trigger phrases`;
   497	
   498	  const hints: string[] = [];
   499	  if (!useCognitive && sessionId) {
   500	    hints.push('Enable cognitive features with include_cognitive: true');
   501	  }
   502	  const coldCount = cognitiveStats?.tierDistribution?.COLD;
   503	  if (coldCount !== undefined && coldCount > 0) {
   504	    hints.push(`${coldCount} COLD-tier memories excluded for token efficiency`);
   505	  }
   506	  if (detectedSignals.length > 0) {
   507	    hints.push(`Signal vocabulary applied (${detectedSignals.length} category matches)`);
   508	  }
   509	
   510	  const _triggersResponse = createMCPSuccessResponse({
   511	    tool: 'memory_match_triggers',
   512	    summary,
   513	    data: {
   514	      matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
   515	      count: formattedResults.length,
   516	      results: formattedResults,
   517	      degradedMatching: degradedTriggerMatching,
   518	      cognitive: cognitiveStats
   519	    },
   520	    hints,
   521	    startTime: startTime,
   522	    extraMeta: {
   523	      latencyMs: latencyMs,
   524	      triggerSignals: detectedSignals,
   525	      ...(degradedTriggerMatching ? { degradedMatching: degradedTriggerMatching } : {}),
   526	    }
   527	  });
   528	
   529	  // Consumption instrumentation — log triggers event (fail-safe, never throws)
   530	  try {

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts | sed -n '203,260p;619,684p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   203	function buildBoundaryRegex(phrase: string): RegExp {
   204	  const normalizedPhrase = normalizeTriggerText(phrase);
   205	  const escaped = escapeRegex(normalizedPhrase);
   206	
   207	  // CJK text often appears in continuous sentence flow without whitespace-delimited
   208	  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
   209	  // phrases are not rejected by boundary checks on neighboring CJK characters.
   210	  if (CJK_SCRIPT_PATTERN.test(normalizedPhrase) && !/\s/u.test(normalizedPhrase)) {
   211	    return new RegExp(escaped, 'iu');
   212	  }
   213	
   214	  return new RegExp(
   215	    `(?:^|[^${UNICODE_WORD_CHAR_CLASS}])${escaped}(?:[^${UNICODE_WORD_CHAR_CLASS}]|$)`,
   216	    'iu'
   217	  );
   218	}
   219	
   220	function getUnicodeTokens(text: string): string[] {
   221	  const normalized = normalizeTriggerText(text);
   222	  if (!normalized) {
   223	    return [];
   224	  }
   225	
   226	  return Array.from(normalized.matchAll(UNICODE_TOKEN_PATTERN), (match) => match[0]);
   227	}
   228	
   229	function isSignificantIndexToken(token: string): boolean {
   230	  if (!token) {
   231	    return false;
   232	  }
   233	
   234	  return token.length >= CONFIG.MIN_PHRASE_LENGTH && !COMMON_TRIGGER_STOPWORDS.has(token);
   235	}
   236	
   237	function extractTriggerIndexKeys(text: string): string[] {
   238	  const normalized = normalizeTriggerText(text);
   239	  if (!normalized) {
   240	    return [];
   241	  }
   242	
   243	  const rawTokens = getUnicodeTokens(normalized);
   244	  const tokens = rawTokens.filter(isSignificantIndexToken);
   245	  const basis = tokens.length > 0 ? tokens : rawTokens;
   246	  const keys = new Set<string>();
   247	
   248	  for (const token of basis) {
   249	    if (token) {
   250	      keys.add(token);
   251	    }
   252	  }
   253	
   254	  for (let size = MIN_INDEX_NGRAM_SIZE; size <= MAX_INDEX_NGRAM_SIZE; size += 1) {
   255	    if (basis.length < size) {
   256	      continue;
   257	    }
   258	
   259	    for (let index = 0; index <= basis.length - size; index += 1) {
   260	      keys.add(basis.slice(index, index + size).join(' '));
   619	/* --- 7. MAIN MATCHING FUNCTION --- */
   620	
   621	/** Match user prompt against trigger phrases using exact string matching */
   622	export function matchTriggerPhrases(userPrompt: string, limit: number = CONFIG.DEFAULT_LIMIT): TriggerMatch[] {
   623	  const startTime = Date.now();
   624	
   625	  // Validation
   626	  if (!userPrompt || typeof userPrompt !== 'string') {
   627	    return [];
   628	  }
   629	
   630	  // Truncate very long prompts
   631	  const prompt = userPrompt.length > CONFIG.MAX_PROMPT_LENGTH
   632	    ? userPrompt.substring(0, CONFIG.MAX_PROMPT_LENGTH)
   633	    : userPrompt;
   634	
   635	  const promptNormalized = normalizeUnicode(prompt, false);
   636	
   637	  // Load cache (fast if already loaded)
   638	  const cache = loadTriggerCache();
   639	
   640	  if (cache.length === 0) {
   641	    return [];
   642	  }
   643	
   644	  const candidateEntries = getTriggerCandidates(promptNormalized, cache);
   645	
   646	  // Match against all cached phrases
   647	  const matchesByMemory = new Map<number, TriggerMatch>();
   648	
   649	  for (const entry of candidateEntries) {
   650	    if (matchPhraseWithBoundary(promptNormalized, entry.phrase, entry.regex)) {
   651	      const key = entry.memoryId;
   652	
   653	      let match = matchesByMemory.get(key);
   654	      if (!match) {
   655	        match = {
   656	          memoryId: entry.memoryId,
   657	          specFolder: entry.specFolder,
   658	          filePath: entry.filePath,
   659	          title: entry.title,
   660	          importanceWeight: entry.importanceWeight,
   661	          matchedPhrases: [],
   662	        };
   663	        matchesByMemory.set(key, match);
   664	      }
   665	
   666	      match.matchedPhrases.push(entry.phrase);
   667	    }
   668	  }
   669	
   670	  // Sort by: 1) Number of matched phrases (desc), 2) Importance weight (desc)
   671	  const results = Array.from(matchesByMemory.values())
   672	    .sort((a, b) => {
   673	      const phraseDiff = b.matchedPhrases.length - a.matchedPhrases.length;
   674	      if (phraseDiff !== 0) {
   675	        return phraseDiff;
   676	      }
   677	      return b.importanceWeight - a.importanceWeight;
   678	    })
   679	    .slice(0, limit);
   680	
   681	  // Performance logging (CHK069)
   682	  const elapsed = Date.now() - startTime;
   683	  logExecutionTime('match_trigger_phrases', elapsed, {
   684	    promptLength: prompt.length,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '90,120p;470,520p;900,930p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   470	  };
   471	}
   472	
   473	// Sections 7–9 (applyCrossEncoderReranking, applyIntentWeightsToResults,
   474	// ShouldApplyPostSearchIntentWeighting, postSearchPipeline) removed in
   475	// These were only used by the legacy V1 pipeline
   476	// Path. The V2 4-stage pipeline handles all equivalent functionality.
   477	
   478	/* ───────────────────────────────────────────────────────────────
   479	   10. MAIN HANDLER
   480	──────────────────────────────────────────────────────────────── */
   481	
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
   900	        boostedCount: goalRefinement.metadata.boostedCount,
   901	      };
   902	    }
   903	
   904	    // Build extra data from pipeline metadata for response formatting
   905	    const lexicalCapability = getLastLexicalCapabilitySnapshot();
   906	    if (lexicalCapability) {
   907	      console.error(
   908	        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
   909	      );
   910	    }
   911	
   912	    const extraData: Record<string, unknown> = {
   913	      stateStats: pipelineResult.annotations.stateStats,
   914	      featureFlags: {
   915	        ...pipelineResult.annotations.featureFlags,
   916	      },
   917	      pipelineMetadata: pipelineResult.metadata,
   918	    };
   919	    if (lexicalCapability) {
   920	      extraData.lexicalPath = lexicalCapability.lexicalPath;
   921	      extraData.fallbackState = lexicalCapability.fallbackState;
   922	    }
   923	
   924	    if (pipelineResult.annotations.evidenceGapWarning) {
   925	      extraData.evidenceGapWarning = pipelineResult.annotations.evidenceGapWarning;
   926	    }
   927	
   928	    if (detectedIntent) {
   929	      extraData.intent = {
   930	        type: detectedIntent,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '288,304p;376,384p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   376	
   377	## Reusable knowledge
   378	
   379	- prompt authoring pattern for this packet family: keep the 13-section TIDD-EC structure, include ordered evidence reading, and force evidence tags (`source-confirmed`, `README-documented`, `benchmark-documented`) per finding [Task 1]
   380	- MemPalace-specific guardrails that proved useful: AAAK remains experimental/lossy, raw ChromaDB verbatim posture is baseline, and benchmark/README claims need code-backed verification before adoption [Task 1]
   381	- deep-research extension runbook: align `maxIterations` in config/state/strategy first, keep lineage/execution mode unchanged, run reducer after each iteration (`node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}`), then refresh synthesis/registry/dashboard artifacts [Task 2]
   382	- closeout integration for this packet should update `research-v2.md`, `recommendations-v2.md`, `findings-registry-v2.json`, and `deep-research-dashboard.md` while leaving historical `research/research.md` snapshot content intact [Task 2][Task 4]
   383	- Claudest continuation is now an execution-ready sequence to preserve in order: FTS helper and forced-degrade tests -> stop-hook metadata patch -> normalized analytics reader -> cached-summary fast path -> verifier/discoverer split -> token-insight contracts [Task 3]
   384	- Graphify closeout guidance is additive rather than replacement: enrich existing payload confidence/provenance and layered runtime hints (`session-prime`, `compact-inject`, `response-hints`), keep low-level invalidation as already covered by Public indexing, and defer clustering metadata to a later phase [Task 4]

codex
# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

## Findings
### Finding 1: MemPalace’s shipped retrieval is semantic-first; most lexical gains live in benchmark code, not the product path
- **Source**: [searcher.py:21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L21), [mcp_server.py:139](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L139), [longmemeval_bench.py:485](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py#L485), [longmemeval_bench.py:1339](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py#L1339)
- **What it does**: shipped MemPalace search calls Chroma `query()` with optional `wing`/`room` metadata filters; the lexical-style keyword overlap, quoted-phrase boosts, person-name boosts, and temporal boosts appear in benchmark retrieval functions rather than in the CLI/MCP search path.
- **Why it matters**: semantic retrieval is the real MemPalace runtime baseline, so its strong paraphrase/open-ended recall is credible; but the “hybrid” wins should not be treated as already-shipped architecture.
- **Recommendation**: `reject`
- **Impact**: high

### Finding 2: Lexical beats semantic on exact anchors: quoted phrases, names, slugs, and artifact lookups
- **Source**: [longmemeval_bench.py:1413](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py#L1413), [longmemeval_bench.py:1512](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py#L1512), [query-router.ts:48](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L48), [query-router.ts:113](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L113), [trigger-matcher.ts:621](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L621)
- **What it does**: MemPalace benchmark v4 rescues hard misses by exact quoted-phrase and person-name boosts. Public already preserves BM25 for `find_spec`/`find_decision` style artifact queries and has a separate exact trigger-phrase matcher with boundary-aware regex matching.
- **Why it matters**: identifiers are brittle in embedding space. Exact phrases like issue titles, file names, room slugs, person names, and quoted assistant wording are where lexical lanes consistently outperform pure semantic similarity.
- **Recommendation**: `adopt now`
- **Impact**: high

### Finding 3: Semantic beats lexical for paraphrase-heavy recall, open-ended continuity, and “why” questions
- **Source**: [BENCHMARKS.md:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md#L9), [memory-context.ts:657](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L657), [memory-context.ts:783](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L783), [searcher.py:43](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L43)
- **What it does**: MemPalace’s headline raw result is built on verbatim semantic retrieval; Public’s `deep`, `focused`, and `resume` context strategies all route through `memory_search`, not trigger matching, with resume also anchoring on `state`, `next-steps`, `summary`, and `blockers`.
- **Why it matters**: lexical matching is weak when users ask with different vocabulary than the stored memory. Resume, design rationale, and decision-history queries are usually paraphrase-heavy and need semantic recall first.
- **Recommendation**: `adopt now`
- **Impact**: high

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


hook: Stop
hook: Stop Completed
tokens used
194,764
# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

## Findings
### Finding 1: MemPalace’s shipped retrieval is semantic-first; most lexical gains live in benchmark code, not the product path
- **Source**: [searcher.py:21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L21), [mcp_server.py:139](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L139), [longmemeval_bench.py:485](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py#L485), [longmemeval_bench.py:1339](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py#L1339)
- **What it does**: shipped MemPalace search calls Chroma `query()` with optional `wing`/`room` metadata filters; the lexical-style keyword overlap, quoted-phrase boosts, person-name boosts, and temporal boosts appear in benchmark retrieval functions rather than in the CLI/MCP search path.
- **Why it matters**: semantic retrieval is the real MemPalace runtime baseline, so its strong paraphrase/open-ended recall is credible; but the “hybrid” wins should not be treated as already-shipped architecture.
- **Recommendation**: `reject`
- **Impact**: high

### Finding 2: Lexical beats semantic on exact anchors: quoted phrases, names, slugs, and artifact lookups
- **Source**: [longmemeval_bench.py:1413](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py#L1413), [longmemeval_bench.py:1512](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/longmemeval_bench.py#L1512), [query-router.ts:48](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L48), [query-router.ts:113](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L113), [trigger-matcher.ts:621](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L621)
- **What it does**: MemPalace benchmark v4 rescues hard misses by exact quoted-phrase and person-name boosts. Public already preserves BM25 for `find_spec`/`find_decision` style artifact queries and has a separate exact trigger-phrase matcher with boundary-aware regex matching.
- **Why it matters**: identifiers are brittle in embedding space. Exact phrases like issue titles, file names, room slugs, person names, and quoted assistant wording are where lexical lanes consistently outperform pure semantic similarity.
- **Recommendation**: `adopt now`
- **Impact**: high

### Finding 3: Semantic beats lexical for paraphrase-heavy recall, open-ended continuity, and “why” questions
- **Source**: [BENCHMARKS.md:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md#L9), [memory-context.ts:657](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L657), [memory-context.ts:783](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L783), [searcher.py:43](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L43)
- **What it does**: MemPalace’s headline raw result is built on verbatim semantic retrieval; Public’s `deep`, `focused`, and `resume` context strategies all route through `memory_search`, not trigger matching, with resume also anchoring on `state`, `next-steps`, `summary`, and `blockers`.
- **Why it matters**: lexical matching is weak when users ask with different vocabulary than the stored memory. Resume, design rationale, and decision-history queries are usually paraphrase-heavy and need semantic recall first.
- **Recommendation**: `adopt now`
- **Impact**: high

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
