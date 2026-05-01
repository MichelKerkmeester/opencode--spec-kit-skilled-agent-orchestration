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
# Iteration 001: ARCHITECTURE OVERVIEW

## Focus
ARCHITECTURE OVERVIEW: Scan repository structure, key directories, main entry points, README, and architecture docs. Map high-level components and data flow.

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
I’m treating this as a read-only deep research pass over the `005-mempalace` phase and its `external/` source, with the goal of mapping MemPalace’s architecture against Public’s current memory stack. I’m starting by checking the phase folder shape, confirming whether `external/AGENTS.md` exists, and loading the deep-research guidance plus the key source entry points before I trace data flow.
exec
/bin/zsh -lc 'rg -n "mempalace|hybrid-rag-fusion|999-hybrid-rag-fusion-upgrade|005-mempalace|deep research|deep-research" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
282:scope: phase-root prompt authoring and deep-research extension closeout for `026-graph-and-context-optimization/001-research-graph-context-systems`
283:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems; reuse_rule=reuse for follow-up work inside this packet family when user requests prompt parity or extra deep-research iterations on an existing phase lineage
293:- 005-mempalace, phase-research-prompt.md, dont ask for a spec folder, 13-section TIDD-EC, source-confirmed README-documented benchmark-documented, raw-verbatim hooks taxonomy temporal KG
295:## Task 2: Extend Contextador deep-research from 13 to 20 iterations and fold into v2 synthesis without changing verdict, outcome success
303:- 003-contextador, spec_kit:deep-research, maxIterations 20, deep-research-config.json, reduce-state.cjs, research-v2.md, recommendations-v2.md, findings-registry-v2.json, F-CROSS-089..F-CROSS-093
367:- when the user asked to "create a similar prompt for ...005-mempalace ... dont ask for a spec folder," place `phase-research-prompt.md` in the phase root and skip new spec-folder scaffolding [Task 1]
368:- when the user asked "Run /spec_kit:deep-research ... get tot 20 total iterations so add 7 more," treat it as resume of the active lineage, not a fork [Task 2]
381:- deep-research extension runbook: align `maxIterations` in config/state/strategy first, keep lineage/execution mode unchanged, run reducer after each iteration (`node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}`), then refresh synthesis/registry/dashboard artifacts [Task 2]
382:- closeout integration for this packet should update `research-v2.md`, `recommendations-v2.md`, `findings-registry-v2.json`, and `deep-research-dashboard.md` while leaving historical `research/research.md` snapshot content intact [Task 2][Task 4]
397:- symptom: strict validation step in prompt cannot run; cause: phase lacks Level 3 docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`); fix: create/verify those docs before running `validate.sh --strict` or deep research loops [Task 1]
404:scope: per-phase prompt artifacts that enforce Level 3 Spec Kit documentation before `spec_kit:deep-research` against each phase `external/` tree
415:- 999-feature-roadmap, 001-research-agentic-systems, phase-research-prompt.md, Level 3 Spec Kit docs, spec_kit:deep-research, external/
425:- 008-bmad-autonomous-development, 009-xethryon, phase-research-prompt.md, skip spec folder, 001-research-agentic-systems, Level 3 docs before deep research
429:- when the user asked to “Add a prompt in each phase folder ... create level 3 speckit documentation ... utilize spec_kit:deep-research BUT need to create proper spec documentation in the folder first,” prompts should enforce: use the existing phase folder, author Level 3 docs first, then research that phase `external/` tree with evidence-backed outcomes and checklist/implementation-summary/memory updates [Task 1]
436:- gate sequence that worked: validate phase docs first with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <phase-path> --strict`, then run `spec_kit:deep-research`, then generate context/memory artifacts [Task 1][Task 2]
440:- no failures observed; preserve the same gate order (Level 3 docs -> strict validate -> deep research) to avoid exploratory research before folder documentation is ready [Task 1]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
466:## Task 3: Refresh references for renamed packet `040-sk-auto-deep-research-review-improvement`, outcome success
474:- 040-sk-auto-deep-research-review-improvement, ensureDescriptionCache, descriptions.json, E_LINEAGE, skip spec folder, perl -0pi
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
638:scope: 90-iteration synthesis docs and phase-level contract hardening for `028-auto-deep-research-review-improvement` packets
639:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/04--agent-orchestration/028-auto-deep-research-review-improvement; reuse_rule=reuse for packet 028 research/review closeout in this checkout, with packet-local docs/changelogs and strict validation evidence
641:## Task 1: Extend deep-research wave to 90 iterations and author recommendation docs for sk-deep-research/sk-deep-review, outcome success
649:- 90 iterations, recommendations-sk-deep-research.md, recommendations-sk-deep-review.md, deep-research-state.jsonl, synthesis_complete, external wave
651:## Task 2: Complete phase `001-sk-deep-research-improvements` contract hardening and packet-local changelog, outcome success
659:- runtime-capabilities.cjs, reduce-state.cjs, runtime_capabilities.json, deep-research-reducer.vitest.ts, changelog-028-001-sk-deep-research-improvements.md
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1189:- symptom: packet docs drift from deep-research conclusions; cause: spec/plan/tasks/checklist/summary edited piecemeal; fix: run a single truth-sync pass across all packet docs with explicit references to `research/research.md` [Task 5]
1192:scope: `/spec_kit:deep-research --review` execution contract, review-folder semantics, and release-readiness criteria mapping
1203:- /spec_kit:deep-research --review, 20 iterations, evidenceGap, handler-memory-triggers.vitest.ts, FEATURE_CATALOG.md
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1661:# Task Group: Documentation Enforcement Wiring and sk-deep-research Playbook Packaging
1675:## Task 2: Build sk-deep-research manual testing playbook (index + per-feature snippets)
1735:## Task 3: Fix deep-research TOML multiline literal termination and validate all agent TOMLs
1743:- deep-research.toml, developer_instructions, Expected ''' at end of document, tomli, BAD=0
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc "ls -la .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace && printf '\\n---\\n' && ls -la .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external | sed -n '1,80p' && printf '\\n---\\n' && test -f .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md && echo EXTERNAL_AGENTS_PRESENT || echo EXTERNAL_AGENTS_ABSENT" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
total 48
drwxr-xr-x   6 michelkerkmeester  staff    192 Apr 10 21:18 .
drwxr-xr-x   7 michelkerkmeester  staff    224 Apr 10 21:07 ..
drwxr-xr-x  22 michelkerkmeester  staff    704 Apr 10 21:19 external
drwxr-xr-x   3 michelkerkmeester  staff     96 Apr 10 21:06 memory
-rw-r--r--   1 michelkerkmeester  staff  21201 Apr 10 21:06 phase-research-prompt.md
drwxr-xr-x   4 michelkerkmeester  staff    128 Apr 10 21:19 research

---
total 1312
drwxr-xr-x  22 michelkerkmeester  staff     704 Apr 10 21:19 .
drwxr-xr-x   6 michelkerkmeester  staff     192 Apr 10 21:18 ..
drwxr-xr-x   3 michelkerkmeester  staff      96 Apr 10 21:18 .agents
drwxr-xr-x   9 michelkerkmeester  staff     288 Apr 10 21:18 .claude-plugin
drwxr-xr-x   7 michelkerkmeester  staff     224 Apr 10 21:18 .codex-plugin
drwxr-xr-x   7 michelkerkmeester  staff     224 Apr 10 21:18 .github
-rw-r--r--   1 michelkerkmeester  staff     291 Apr 10 21:18 .gitignore
-rw-r--r--   1 michelkerkmeester  staff     152 Apr 10 21:18 .pre-commit-config.yaml
-rw-r--r--   1 michelkerkmeester  staff    2439 Apr 10 21:18 AGENTS.md
-rw-r--r--   1 michelkerkmeester  staff    3388 Apr 10 21:18 CONTRIBUTING.md
-rw-r--r--   1 michelkerkmeester  staff    1079 Apr 10 21:18 LICENSE
-rw-r--r--   1 michelkerkmeester  staff   33678 Apr 10 21:18 README.md
drwxr-xr-x   3 michelkerkmeester  staff      96 Apr 10 21:18 assets
drwxr-xr-x   9 michelkerkmeester  staff     288 Apr 10 21:18 benchmarks
drwxr-xr-x   3 michelkerkmeester  staff      96 Apr 10 21:18 docs
drwxr-xr-x   7 michelkerkmeester  staff     224 Apr 10 21:18 examples
drwxr-xr-x   5 michelkerkmeester  staff     160 Apr 10 21:18 hooks
drwxr-xr-x   3 michelkerkmeester  staff      96 Apr 10 21:18 integrations
drwxr-xr-x  32 michelkerkmeester  staff    1024 Apr 10 21:18 mempalace
-rw-r--r--   1 michelkerkmeester  staff    2236 Apr 10 21:18 pyproject.toml
drwxr-xr-x  31 michelkerkmeester  staff     992 Apr 10 21:18 tests
-rw-r--r--   1 michelkerkmeester  staff  607124 Apr 10 21:18 uv.lock

---
EXTERNAL_AGENTS_PRESENT

codex
I’ve confirmed the phase folder exists, and the external repo does have its own `AGENTS.md`, so I’m treating that as an active constraint for everything under `external/`. Next I’m loading that nested guidance, checking whether the required Level 3 phase docs are actually present yet, and then tracing the external entry points in the order you specified so the architecture map stays source-led instead of README-led.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'for f in spec.md plan.md tasks.md checklist.md decision-record.md implementation-summary.md research/research.md; do p=.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/$f; if [ -f "$p" ]; then echo PRESENT:$f; else echo MISSING:$f; fi; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
MISSING:spec.md
MISSING:plan.md
MISSING:tasks.md
MISSING:checklist.md
MISSING:decision-record.md
MISSING:implementation-summary.md
MISSING:research/research.md

exec
/bin/zsh -lc "printf 'README headings\\n'; rg -n \""'^#|''^##|April 7|Quick Start|How You Actually Use It|The Palace|wake-up|AAAK|MCP|Benchmark|Correction|NOTE" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md | sed -n '"'1,220p' && printf '\\n---\\npyproject\\n' && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
README headings
5:# MemPalace
7:### The highest-scoring AI memory system ever benchmarked. And it's free.
15:**The Palace** — Ancient Greek orators memorized entire speeches by placing ideas in rooms of an imaginary building. Walk through the building, find the idea. MemPalace applies the same principle to AI memory: your conversations are organized into wings (people and projects), halls (types of memory), and rooms (specific ideas). No AI decides what matters — you keep every word, and the structure gives you a navigable map instead of a flat search index.
19:**AAAK (experimental)** — A lossy abbreviation dialect for packing repeated entities into fewer tokens at scale. Readable by any LLM that reads text — Claude, GPT, Gemini, Llama, Mistral — no decoder needed. **AAAK is a separate compression layer, not the storage default**, and on the LongMemEval benchmark it currently regresses vs raw mode (84.2% vs 96.6%). We're iterating. See the [note above](#a-note-from-milla--ben--april-7-2026) for the honest status.
32:[Quick Start](#quick-start) · [The Palace](#the-palace) · [AAAK Dialect](#aaak-dialect-experimental) · [Benchmarks](#benchmarks) · [MCP Tools](#mcp-server)
36:### Highest LongMemEval score ever published — free or paid.
46:<sub>Reproducible — runners in <a href="benchmarks/">benchmarks/</a>. <a href="benchmarks/BENCHMARKS.md">Full results</a>. The 96.6% is from <b>raw verbatim mode</b>, not AAAK or rooms mode (those score lower — see <a href="#a-note-from-milla--ben--april-7-2026">note above</a>).</sub>
52:## A Note from Milla & Ben — April 7, 2026
58:> - **The AAAK token example was incorrect.** We used a rough heuristic (`len(text)//3`) for token counts instead of an actual tokenizer. Real counts via OpenAI's tokenizer: the English example is 66 tokens, the AAAK example is 73. AAAK does not save tokens at small scales — it's designed for *repeated entities at scale*, and the README example was a bad demonstration of that. We're rewriting it.
60:> - **"30x lossless compression" was overstated.** AAAK is a lossy abbreviation system (entity codes, sentence truncation). Independent benchmarks show AAAK mode scores **84.2% R@5 vs raw mode's 96.6%** on LongMemEval — a 12.4 point regression. The honest framing is: AAAK is an experimental compression layer that trades fidelity for token density, and **the 96.6% headline number is from RAW mode, not AAAK**.
76:> 1. Rewriting the AAAK example with real tokenizer counts and a scenario where AAAK actually demonstrates compression
87:## Quick Start
92:# Set up your world — who you work with, what your projects are
95:# Mine your data
100:# Search anything you've ever discussed
103:# Your AI remembers
111:## How You Actually Use It
115:### With Claude Code (recommended)
126:### With Claude, ChatGPT, Cursor, Gemini (MCP-compatible tools)
129:# Connect MemPalace once
133:Now your AI has 19 tools available through MCP. Ask it anything:
141:### With local models (Llama, Mistral, or any offline LLM)
143:Local models generally don't speak MCP yet. Two approaches:
148:mempalace wake-up > context.txt
149:# Paste context.txt into your local model's system prompt
152:This gives your local model ~170 tokens of critical facts (in AAAK if you prefer) before you ask a single question.
158:# Include results.txt in your prompt
166:# Inject into your local model's context
169:Either way — your entire memory stack runs offline. ChromaDB on your machine, Llama on your machine, AAAK for compression, zero cloud calls.
173:## The Problem
183:| **MemPalace wake-up** | **~170 tokens** | **~$0.70/yr** |
186:MemPalace loads 170 tokens of critical facts on wake-up — your team, your projects, your preferences. Then searches only when needed. $10/year to remember everything vs $507/year for summaries that lose context.
190:## How It Works
192:### The Palace
200:Every room has a **closet** connected to it, and here's where things get interesting. We've developed an AI language called **AAAK**. Don't ask — it's a whole story of its own. Your agent learns the AAAK shorthand every time it wakes up. Because AAAK is essentially English, but a very truncated version, your agent understands how to use it in seconds. It comes as part of the install, built into the MemPalace code. In our next update, we'll add AAAK directly to the closets, which will be a real game changer — the amount of info in the closets will be much bigger, but it will take up far less space and far less reading time for your agent.
202:Inside those closets are **drawers**, and those drawers are where your original files live. In this first version, we haven't used AAAK as a closet tool, but even so, the summaries have shown **96.6% recall** in all the benchmarks we've done across multiple benchmarking platforms. Once the closets use AAAK, searches will be even faster while keeping every word exact. But even now, the closet approach has been a huge boon to how much info is stored in a small space — it's used to easily point your AI agent to the drawer where your original file lives. You never lose anything, and all this happens in seconds.
242:**Closets** — summaries that point to the original content. (In v3.0.0 these are plain-text summaries; AAAK-encoded closets are coming in a future update — see [Task #30](https://github.com/milla-jovovich/mempalace/issues/30).)
262:### Why Structure Matters
275:### The Memory Stack
280:| **L1** | Critical facts — team, projects, preferences | ~120 tokens (AAAK) | Always loaded |
286:### AAAK Dialect (experimental)
288:AAAK is a lossy abbreviation system — entity codes, structural markers, and sentence truncation — designed to pack repeated entities and relationships into fewer tokens at scale. It is **readable by any LLM that reads text** (Claude, GPT, Gemini, Llama, Mistral) without a decoder, so a local model can use it without any cloud dependency.
292:- **AAAK is lossy, not lossless.** It uses regex-based abbreviation, not reversible compression.
293:- **It does not save tokens at small scales.** Short text already tokenizes efficiently. AAAK overhead (codes, separators) costs more than it saves on a few sentences.
295:- **AAAK currently regresses LongMemEval** vs raw verbatim retrieval (84.2% R@5 vs 96.6%). The 96.6% headline number is from **raw mode**, not AAAK mode.
296:- **The MemPalace storage default is raw verbatim text in ChromaDB** — that's where the benchmark wins come from. AAAK is a separate compression layer for context loading, not the storage format.
300:### Contradiction Detection (experimental, not yet wired into KG)
319:## Real-World Examples
321:### Solo developer across multiple projects
324:# Mine each project's conversations
329:# Six months later: "why did I use Postgres here?"
331:# → "Chose Postgres over SQLite because Orion needs concurrent writes
332:#    and the dataset will exceed 10GB. Decided 2025-11-03."
334:# Cross-project search
336:# → finds your approach in Orion AND Nova, shows the differences
339:### Team lead managing a product
342:# Mine Slack exports and AI conversations
346:# "What did Soren work on last sprint?"
348:# → 14 closets: OAuth refactor, dark mode, component library migration
350:# "Who decided to use Clerk?"
352:# → "Kai recommended Clerk over Auth0 — pricing + developer experience.
353:#    Team agreed 2026-01-15. Maya handling the migration."
356:### Before mining: split mega-files
368:## Knowledge Graph
380:# What's Kai working on?
382:# → [Kai → works_on → Orion (current), Kai → recommended → Clerk (2026-01)]
384:# What was true in January?
386:# → [Maya → assigned_to → auth-migration (active)]
388:# Timeline
390:# → chronological story of the project
411:## Specialist Agents
431:- **Keeps a diary** — written in AAAK, persists across sessions
435:# Agent writes to its diary after a code review
439:# Agent reads back its history
441:# → last 10 findings, compressed in AAAK
450:## MCP Server
453:# Via plugin (recommended)
457:# Or manually
461:### 19 Tools
467:| `mempalace_status` | Palace overview + AAAK spec + memory protocol |
473:| `mempalace_get_aaak_spec` | AAAK dialect reference |
504:| `mempalace_diary_write` | Write AAAK diary entry |
507:The AI learns AAAK and the memory protocol automatically from the `mempalace_status` response. No manual configuration.
511:## Auto-Save Hooks
532:## Benchmarks
536:| Benchmark | Mode | Score | API Calls |
546:### vs Published Systems
559:## All Commands
562:# Setup
563:mempalace init <dir>                              # guided onboarding + AAAK bootstrap
565:# Mining
570:# Splitting
574:# Search
579:# Memory stack
580:mempalace wake-up                                 # load L0 + L1 context
581:mempalace wake-up --wing driftwood                # project-specific
583:# Compression
584:mempalace compress --wing myapp                   # AAAK compress
586:# Status
589:# MCP
590:mempalace mcp                                     # show MCP setup command
597:## Configuration
599:### Global (`~/.mempalace/config.json`)
609:### Wing config (`~/.mempalace/wing_config.json`)
623:### Identity (`~/.mempalace/identity.txt`)
629:## File Reference
636:| `mcp_server.py` | MCP server — 19 tools, AAAK auto-teach, memory protocol |
641:| `dialect.py` | AAAK compression — 30x lossless |
644:| `onboarding.py` | Guided setup — generates AAAK bootstrap + wing config |
653:## Project Structure
660:│   ├── mcp_server.py          ← MCP server (19 tools)
663:│   ├── dialect.py             ← AAAK compression
690:## Requirements
704:## Contributing
708:## License

---
pyproject
[project]
name = "mempalace"
version = "3.1.0"
description = "Give your AI a memory — mine projects and conversations into a searchable palace. No API key required."
readme = "README.md"
requires-python = ">=3.9"
license = "MIT"
authors = [
    {name = "milla-jovovich"},
]
keywords = [
    "ai", "memory", "llm", "rag", "chromadb", "mcp",
    "vector-database", "claude", "chatgpt", "embeddings",
]
classifiers = [
    "Development Status :: 4 - Beta",
    "Environment :: Console",
    "Intended Audience :: Developers",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Topic :: Scientific/Engineering :: Artificial Intelligence",
    "Topic :: Utilities",
]
dependencies = [
    "chromadb>=0.5.0,<0.7",
    "pyyaml>=6.0,<7",
]

[project.urls]
Homepage = "https://github.com/milla-jovovich/mempalace"
Repository = "https://github.com/milla-jovovich/mempalace"
"Bug Tracker" = "https://github.com/milla-jovovich/mempalace/issues"

[project.scripts]
mempalace = "mempalace:main"

[project.optional-dependencies]
dev = ["pytest>=7.0", "pytest-cov>=4.0", "ruff>=0.4.0", "psutil>=5.9"]
spellcheck = ["autocorrect>=2.0"]

[dependency-groups]
dev = ["pytest>=7.0", "pytest-cov>=4.0", "ruff>=0.4.0", "psutil>=5.9"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["mempalace"]

[tool.ruff]
line-length = 100
target-version = "py39"
extend-exclude = ["benchmarks"]

[tool.ruff.lint]
select = ["E", "F", "W", "C901"]
ignore = ["E501"]

[tool.ruff.lint.mccabe]
max-complexity = 25

[tool.ruff.format]
quote-style = "double"

[tool.pytest.ini_options]
testpaths = ["tests"]
pythonpath = ["."]
addopts = "-m 'not benchmark and not slow and not stress'"
markers = [
    "benchmark: scale/performance benchmark tests",
    "slow: tests that take more than 30 seconds",
    "stress: destructive scale tests (100K+ drawers)",
]

[tool.coverage.run]
source = ["mempalace"]

[tool.coverage.report]
fail_under = 85
show_missing = true
exclude_lines = [
    "if __name__",
    "pragma: no cover",
]

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
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
A key prerequisite is already failing: the `005-mempalace` phase folder is missing every required Level 3 doc, so the strict validator is expected to fail before any workflow-owned deep-research loop could start. I’m still continuing the read-only source analysis you asked for, but I’m going to capture that validation failure explicitly because it changes what can be truthfully claimed about phase readiness.
exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1637ms:

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


exec
/bin/zsh -lc "printf 'searcher.py\\n'; rg -n \""'^def |''^class |query|search|wing|room|hall|drawer|chromadb|wake|layer|L0|L1|L2|L3|closet" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py | sed -n '"'1,260p' && printf '\\n---\\nlayers.py\\n' && rg -n \""'^def |''^class |L0|L1|L2|L3|wake|load|status|context|AAAK|identity|preferences|team|project" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py | sed -n '"'1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "printf 'cli.py\\n'; rg -n \""'^def |''^class |COMMANDS|argparse|subparsers|init|mine|search|wake_up|status|repair|compress|mcp|hooks|onboarding" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py && printf '"'\\n---\\nmcp_server.py\\n' && rg -n \""'^def |''^class |TOOLS|PALACE_PROTOCOL|AAAK_SPEC|status|register|tool|duplicate|graph|knowledge|diary|stderr|logging" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py | sed -n '"'1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
searcher.py
3:searcher.py — Find anything. Exact words.
5:Semantic search against the palace.
12:import chromadb
17:class SearchError(Exception):
18:    """Raised when search cannot proceed (e.g. no palace found)."""
21:def search(query: str, palace_path: str, wing: str = None, room: str = None, n_results: int = 5):
23:    Search the palace. Returns verbatim drawer content.
24:    Optionally filter by wing (project) or room (aspect).
27:        client = chromadb.PersistentClient(path=palace_path)
28:        col = client.get_collection("mempalace_drawers")
36:    if wing and room:
37:        where = {"$and": [{"wing": wing}, {"room": room}]}
38:    elif wing:
39:        where = {"wing": wing}
40:    elif room:
41:        where = {"room": room}
45:            "query_texts": [query],
52:        results = col.query(**kwargs)
63:        print(f'\n  No results found for: "{query}"')
67:    print(f'  Results for: "{query}"')
68:    if wing:
69:        print(f"  Wing: {wing}")
70:    if room:
71:        print(f"  Room: {room}")
77:        wing_name = meta.get("wing", "?")
78:        room_name = meta.get("room", "?")
80:        print(f"  [{i}] {wing_name} / {room_name}")
93:def search_memories(
94:    query: str, palace_path: str, wing: str = None, room: str = None, n_results: int = 5
97:    Programmatic search — returns a dict instead of printing.
101:        client = chromadb.PersistentClient(path=palace_path)
102:        col = client.get_collection("mempalace_drawers")
112:    if wing and room:
113:        where = {"$and": [{"wing": wing}, {"room": room}]}
114:    elif wing:
115:        where = {"wing": wing}
116:    elif room:
117:        where = {"room": room}
121:            "query_texts": [query],
128:        results = col.query(**kwargs)
141:                "wing": meta.get("wing", "unknown"),
142:                "room": meta.get("room", "unknown"),
149:        "query": query,
150:        "filters": {"wing": wing, "room": room},

---
layers.py
8:    Layer 0: Identity       (~100 tokens)   — Always loaded. "Who am I?"
9:    Layer 1: Essential Story (~500-800)      — Always loaded. Top moments from the palace.
13:Wake-up cost: ~600-900 tokens (L0+L1). Leaves 95%+ of context free.
16:and ~/.mempalace/identity.txt.
34:class Layer0:
36:    ~100 tokens. Always loaded.
37:    Reads from ~/.mempalace/identity.txt — a plain-text file the user writes.
39:    Example identity.txt:
46:    def __init__(self, identity_path: str = None):
47:        if identity_path is None:
48:            identity_path = os.path.expanduser("~/.mempalace/identity.txt")
49:        self.path = identity_path
53:        """Return the identity text, or a sensible default."""
62:                "## L0 — IDENTITY\nNo identity configured. Create ~/.mempalace/identity.txt"
76:class Layer1:
78:    ~500-800 tokens. Always loaded.
83:    MAX_DRAWERS = 15  # at most 15 moments in wake-up
84:    MAX_CHARS = 3200  # hard cap on total L1 text (~800 tokens)
92:        """Pull top drawers from ChromaDB and format as compact L1 text."""
97:            return "## L1 — No palace found. Run: mempalace mine <dir>"
122:            return "## L1 — No memories yet."
150:        lines = ["## L1 — ESSENTIAL STORY"]
161:                # Truncate doc to keep L1 compact
171:                    lines.append("  ... (more in L3 search)")
185:class Layer2:
230:        lines = [f"## L2 — ON-DEMAND ({len(docs)} drawers)"]
250:class Layer3:
296:        lines = [f'## L3 — SEARCH RESULTS for "{query}"']
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
411:        """On-demand L2 retrieval filtered by wing/room."""
415:        """Deep L3 semantic search."""
418:    def status(self) -> dict:
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
465:        print("  python layers.py status               Show layer status")
486:    if cmd in ("wake-up", "wakeup"):
488:        text = stack.wake_up(wing=wing)
510:    elif cmd == "status":
511:        s = stack.status()

 succeeded in 0ms:
cli.py
6:  Projects:      mempalace mine ~/projects/my_app          (code, docs, notes)
7:  Conversations: mempalace mine ~/chats/ --mode convos     (Claude, ChatGPT, Slack)
9:Same palace. Same search. Different ingest strategies.
12:    mempalace init <dir>                  Detect rooms from folder structure
14:    mempalace mine <dir>                  Mine project files (default)
15:    mempalace mine <dir> --mode convos    Mine conversation exports
16:    mempalace search "query"              Find anything, exact words
17:    mempalace mcp                         Show MCP setup command
20:    mempalace status                      Show what's been filed
23:    mempalace init ~/projects/my_app
24:    mempalace mine ~/projects/my_app
25:    mempalace mine ~/chats/claude-sessions --mode convos
26:    mempalace search "why did we switch to GraphQL"
27:    mempalace search "pricing discussion" --wing my_app --room costs
33:import argparse
39:def cmd_init(args):
54:            # Save confirmed entities to <project>/entities.json for the miner
65:    MempalaceConfig().init()
68:def cmd_mine(args):
75:        from .convo_miner import mine_convos
77:        mine_convos(
87:        from .miner import mine
89:        mine(
101:def cmd_search(args):
102:    from .searcher import search, SearchError
106:        search(
117:def cmd_wakeup(args):
124:    text = stack.wake_up(wing=args.wing)
131:def cmd_split(args):
136:    # Rebuild argv for split_mega_files argparse
153:def cmd_migrate(args):
161:def cmd_status(args):
162:    from .miner import status
165:    status(palace_path=palace_path)
168:def cmd_repair(args):
192:        print("  Cannot recover — palace may need to be re-mined from source files.")
196:        print("  Nothing to repair.")
240:def cmd_hook(args):
242:    from .hooks_cli import run_hook
247:def cmd_instructions(args):
254:def cmd_mcp(args):
256:    base_server_cmd = "python -m mempalace.mcp_server"
265:    print(f"  claude mcp add mempalace -- {server_cmd}")
271:        print(f"  claude mcp add mempalace -- {base_server_cmd} --palace /path/to/palace")
275:def cmd_compress(args):
302:        print("  Run: mempalace init <dir> then mempalace mine <dir>")
344:    total_compressed = 0
345:    compressed_entries = []
348:        compressed = dialect.compress(doc, metadata=meta)
349:        stats = dialect.compression_stats(doc, compressed)
352:        total_compressed += stats["compressed_chars"]
354:        compressed_entries.append((doc_id, compressed, meta, stats))
362:                f"    {stats['original_tokens']}t -> {stats['compressed_tokens']}t ({stats['ratio']:.1f}x)"
364:            print(f"    {compressed}")
367:    # Store compressed versions (unless dry-run)
370:            comp_col = client.get_or_create_collection("mempalace_compressed")
371:            for doc_id, compressed, meta, stats in compressed_entries:
373:                comp_meta["compression_ratio"] = round(stats["ratio"], 1)
377:                    documents=[compressed],
381:                f"  Stored {len(compressed_entries)} compressed drawers in 'mempalace_compressed' collection."
384:            print(f"  Error storing compressed drawers: {e}")
388:    ratio = total_original / max(total_compressed, 1)
390:    comp_tokens = Dialect.count_tokens("x" * total_compressed)
391:    print(f"  Total: {orig_tokens:,}t -> {comp_tokens:,}t ({ratio:.1f}x compression)")
396:def main():
397:    parser = argparse.ArgumentParser(
399:        formatter_class=argparse.RawDescriptionHelpFormatter,
408:    sub = parser.add_subparsers(dest="command")
410:    # init
411:    p_init = sub.add_parser("init", help="Detect rooms from your folder structure")
412:    p_init.add_argument("dir", help="Project directory to set up")
413:    p_init.add_argument(
417:    # mine
418:    p_mine = sub.add_parser("mine", help="Mine files into the palace")
419:    p_mine.add_argument("dir", help="Directory to mine")
420:    p_mine.add_argument(
426:    p_mine.add_argument("--wing", default=None, help="Wing name (default: directory name)")
427:    p_mine.add_argument(
432:    p_mine.add_argument(
438:    p_mine.add_argument(
443:    p_mine.add_argument("--limit", type=int, default=0, help="Max files to process (0 = all)")
444:    p_mine.add_argument(
447:    p_mine.add_argument(
454:    # search
455:    p_search = sub.add_parser("search", help="Find anything, exact words")
456:    p_search.add_argument("query", help="What to search for")
457:    p_search.add_argument("--wing", default=None, help="Limit to one project")
458:    p_search.add_argument("--room", default=None, help="Limit to one room")
459:    p_search.add_argument("--results", type=int, default=5, help="Number of results")
461:    # compress
462:    p_compress = sub.add_parser(
463:        "compress", help="Compress drawers using AAAK Dialect (~30x reduction)"
465:    p_compress.add_argument("--wing", default=None, help="Wing to compress (default: all wings)")
466:    p_compress.add_argument(
467:        "--dry-run", action="store_true", help="Preview compression without storing"
469:    p_compress.add_argument(
480:        help="Split concatenated transcript mega-files into per-session files (run before mine)",
505:    hook_sub = p_hook.add_subparsers(dest="hook_action")
517:        help="Harness type (determines stdin JSON format)",
525:    instructions_sub = p_instructions.add_subparsers(dest="instructions_name")
526:    for instr_name in ["init", "search", "mine", "help", "status"]:
529:    # repair
531:        "repair",
535:    # mcp
537:        "mcp",
541:    # status
553:    sub.add_parser("status", help="Show what's been filed")
579:        "init": cmd_init,
580:        "mine": cmd_mine,
582:        "search": cmd_search,
583:        "mcp": cmd_mcp,
584:        "compress": cmd_compress,
586:        "repair": cmd_repair,
588:        "status": cmd_status,

---
mcp_server.py
8:  mempalace_status          — total drawers, wing/room breakdown
13:  mempalace_check_duplicate — check if content already exists before filing
24:import logging
32:from .palace_graph import traverse, find_tunnels, graph_stats
35:from .knowledge_graph import KnowledgeGraph
37:logging.basicConfig(level=logging.INFO, format="%(message)s", stream=sys.stderr)
38:logger = logging.getLogger("mempalace_mcp")
41:def _parse_args():
61:    _kg = KnowledgeGraph(db_path=os.path.join(_config.palace_path, "knowledge_graph.sqlite3"))
84:def _wal_log(operation: str, params: dict, result: dict = None):
107:def _get_client():
115:def _get_collection(create=False):
129:def _no_palace():
136:# ==================== READ TOOLS ====================
139:def tool_status():
160:        "protocol": PALACE_PROTOCOL,
161:        "aaak_dialect": AAAK_SPEC,
166:# Included in status response so the AI learns it on first wake-up call.
167:# Also available via mempalace_get_aaak_spec tool.
169:PALACE_PROTOCOL = """IMPORTANT — MemPalace Memory Protocol:
170:1. ON WAKE-UP: Call mempalace_status to load palace overview + AAAK spec.
173:4. AFTER EACH SESSION: call mempalace_diary_write to record what happened, what you learned, what matters.
178:AAAK_SPEC = """AAAK is a compressed memory dialect that MemPalace uses for efficient storage.
198:def tool_list_wings():
213:def tool_list_rooms(wing: str = None):
231:def tool_get_taxonomy():
249:def tool_search(query: str, limit: int = 5, wing: str = None, room: str = None):
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
323:# ==================== WRITE TOOLS ====================
326:def tool_add_drawer(
329:    """File verbatim content into a wing/room. Checks for duplicates first."""
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
522:                    "hall": "hall_diary",
524:                    "type": "diary_entry",
531:        logger.info(f"Diary entry: {entry_id} → {wing}/diary/{topic}")
543:def tool_diary_read(agent_name: str, last_n: int = 10):
545:    Read an agent's recent diary entries. Returns the last N entries
555:            where={"$and": [{"wing": wing}, {"room": "diary"}]},
561:            return {"agent": agent_name, "entries": [], "message": "No diary entries yet."}
590:TOOLS = {
591:    "mempalace_status": {
594:        "handler": tool_status,
599:        "handler": tool_list_wings,
609:        "handler": tool_list_rooms,
614:        "handler": tool_get_taxonomy,
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
748:        "handler": tool_search,
750:    "mempalace_check_duplicate": {
763:        "handler": tool_check_duplicate,
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
848:def handle_request(request):
865:                "capabilities": {"tools": {}},
871:    elif method == "tools/list":
876:                "tools": [
878:                    for n, t in TOOLS.items()
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
924:def main():

exec
/bin/zsh -lc "printf 'graph + ingest\\n'; for f in palace_graph.py knowledge_graph.py miner.py convo_miner.py general_extractor.py onboarding.py palace.py config.py hooks_cli.py; do echo \"--- "'$f"; rg -n "''^def |''^class |sqlite|chromadb|collection|room|hall|wing|drawer|chunk|chunking|summary|verbatim|extract|heuristic|timeline|invalidate|diary|hook|stop|compact|bootstrap|identity" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/$f | sed -n '"'1,220p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
graph + ingest
--- palace_graph.py
6:  - Nodes = rooms (named ideas)
7:  - Edges = shared rooms across wings (tunnels)
8:  - Edge types = halls (the corridors)
11:  "Start at chromadb-setup in wing_code, walk to wing_myproject"
12:  "Find all rooms connected to riley-college-apps"
13:  "What topics bridge wing_hardware and wing_myproject?"
18:from collections import defaultdict, Counter
21:import chromadb
24:def _get_collection(config=None):
27:        client = chromadb.PersistentClient(path=config.palace_path)
28:        return client.get_collection(config.collection_name)
33:def build_graph(col=None, config=None):
38:        nodes: dict of {room: {wings: set, halls: set, count: int}}
39:        edges: list of {room, wing_a, wing_b, hall} — one per tunnel crossing
42:        col = _get_collection(config)
47:    room_data = defaultdict(lambda: {"wings": set(), "halls": set(), "count": 0, "dates": set()})
53:            room = meta.get("room", "")
54:            wing = meta.get("wing", "")
55:            hall = meta.get("hall", "")
57:            if room and room != "general" and wing:
58:                room_data[room]["wings"].add(wing)
59:                if hall:
60:                    room_data[room]["halls"].add(hall)
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
99:def traverse(start_room: str, col=None, config=None, max_hops: int = 2):
101:    Walk the graph from a starting room. Find connected rooms
102:    through shared wings.
104:    Returns list of paths: [{room, wing, hall, hop_distance}]
108:    if start_room not in nodes:
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
193:def graph_stats(col=None, config=None):
197:    tunnel_rooms = sum(1 for n in nodes.values() if len(n["wings"]) >= 2)
198:    wing_counts = Counter()
200:        for w in data["wings"]:
201:            wing_counts[w] += 1
204:        "total_rooms": len(nodes),
205:        "tunnel_rooms": tunnel_rooms,
207:        "rooms_per_wing": dict(wing_counts.most_common()),
209:            {"room": r, "wings": d["wings"], "count": d["count"]}
210:            for r, d in sorted(nodes.items(), key=lambda x: -len(x[1]["wings"]))[:10]
211:            if len(d["wings"]) >= 2
216:def _fuzzy_match(query: str, nodes: dict, n: int = 5):
217:    """Find rooms that approximately match a query string."""
220:    for room in nodes:
222:        if query_lower in room:
223:            scored.append((room, 1.0))
224:        elif any(word in room for word in query_lower.split("-")):
225:            scored.append((room, 0.5))
--- knowledge_graph.py
9:  - Closet references (links back to the verbatim memory)
35:    kg.invalidate("Max", "has_issue", "sports_injury", ended="2026-02-15")
41:import sqlite3
46:DEFAULT_KG_PATH = os.path.expanduser("~/.mempalace/knowledge_graph.sqlite3")
49:class KnowledgeGraph:
79:                extracted_at TEXT DEFAULT CURRENT_TIMESTAMP,
93:            self._connection = sqlite3.connect(self.db_path, timeout=10, check_same_thread=False)
95:            self._connection.row_factory = sqlite3.Row
180:    def invalidate(self, subject: str, predicate: str, obj: str, ended: str = None):
214:            for row in conn.execute(query, params).fetchall():
235:            for row in conn.execute(query, params).fetchall():
269:        for row in conn.execute(query, params).fetchall():
282:    def timeline(self, entity_name: str = None):
298:            ).fetchall()
307:            """).fetchall()
335:            ).fetchall()
350:        This bootstraps the graph with known ground truth.
--- miner.py
5:Reads mempalace.yaml from the project directory to know the wing + rooms.
6:Routes each file to the right room based on content.
7:Stores verbatim chunks as drawers. No summaries. Ever.
16:from collections import defaultdict
18:import chromadb
20:from .palace import SKIP_DIRS, get_collection, file_already_mined
54:CHUNK_SIZE = 800  # chars per drawer
55:CHUNK_OVERLAP = 100  # overlap between chunks
56:MIN_CHUNK_SIZE = 50  # skip tiny chunks
65:class GitignoreMatcher:
181:def load_gitignore_matcher(dir_path: Path, cache: dict):
188:def is_gitignored(path: Path, matchers: list, is_dir: bool = False) -> bool:
198:def should_skip_dir(dirname: str) -> bool:
203:def normalize_include_paths(include_ignored: list) -> set:
213:def is_exact_force_include(path: Path, project_path: Path, include_paths: set) -> bool:
226:def is_force_included(path: Path, project_path: Path, include_paths: set) -> bool:
255:def load_config(project_dir: str) -> dict:
274:# FILE ROUTING — which room does this file belong to?
278:def detect_room(filepath: Path, content: str, rooms: list, project_path: Path) -> str:
280:    Route a file to the right room.
282:    1. Folder path matches a room name
283:    2. Filename matches a room name or keyword
291:    # Priority 1: folder path matches room name or keywords
294:        for room in rooms:
295:            candidates = [room["name"].lower()] + [k.lower() for k in room.get("keywords", [])]
297:                return room["name"]
299:    # Priority 2: filename matches room name
300:    for room in rooms:
301:        if room["name"].lower() in filename or filename in room["name"].lower():
302:            return room["name"]
304:    # Priority 3: keyword scoring from room keywords + name
306:    for room in rooms:
307:        keywords = room.get("keywords", []) + [room["name"]]
310:            scores[room["name"]] += count
325:def chunk_text(content: str, source_file: str) -> list:
327:    Split content into drawer-sized chunks.
329:    Returns list of {"content": str, "chunk_index": int}
336:    chunks = []
338:    chunk_index = 0
353:        chunk = content[start:end].strip()
354:        if len(chunk) >= MIN_CHUNK_SIZE:
355:            chunks.append(
357:                    "content": chunk,
358:                    "chunk_index": chunk_index,
361:            chunk_index += 1
365:    return chunks
373:def add_drawer(
374:    collection, wing: str, room: str, content: str, source_file: str, chunk_index: int, agent: str
376:    """Add one drawer to the palace."""
377:    drawer_id = f"drawer_{wing}_{room}_{hashlib.sha256((source_file + str(chunk_index)).encode()).hexdigest()[:24]}"
380:            "wing": wing,
381:            "room": room,
383:            "chunk_index": chunk_index,
392:        collection.upsert(
394:            ids=[drawer_id],
407:def process_file(
410:    collection,
411:    wing: str,
412:    rooms: list,
416:    """Read, chunk, route, and file one file. Returns (drawer_count, room_name)."""
420:    if not dry_run and file_already_mined(collection, source_file, check_mtime=True):
432:    room = detect_room(filepath, content, rooms, project_path)
433:    chunks = chunk_text(content, source_file)
436:        print(f"    [DRY RUN] {filepath.name} → room:{room} ({len(chunks)} drawers)")
437:        return len(chunks), room
439:    # Purge stale drawers for this file before re-inserting the fresh chunks.
442:    # with chromadb 0.6.3) into a clean delete+insert, bypassing the update
445:        collection.delete(where={"source_file": source_file})
449:    drawers_added = 0
450:    for chunk in chunks:
451:        added = add_drawer(
452:            collection=collection,
453:            wing=wing,
454:            room=room,
455:            content=chunk["content"],
457:            chunk_index=chunk["chunk_index"],
461:            drawers_added += 1
463:    return drawers_added, room
471:def scan_project(
522:            # Skip symlinks — prevents following links to /dev/urandom, etc.
540:def mine(
543:    wing_override: str = None,
555:    wing = wing_override or config["wing"]
556:    rooms = config.get("rooms", [{"name": "general", "description": "All project files"}])
569:    print(f"  Wing:    {wing}")
570:    print(f"  Rooms:   {', '.join(r['name'] for r in rooms)}")
582:        collection = get_collection(palace_path)
584:        collection = None
586:    total_drawers = 0
588:    room_counts = defaultdict(int)
591:        drawers, room = process_file(
594:            collection=collection,
595:            wing=wing,
596:            rooms=rooms,
600:        if drawers == 0 and not dry_run:
603:            total_drawers += drawers
604:            room_counts[room] += 1
606:                print(f"  ✓ [{i:4}/{len(files)}] {filepath.name[:50]:50} +{drawers}")
612:    print(f"  Drawers filed: {total_drawers}")
613:    print("\n  By room:")
614:    for room, count in sorted(room_counts.items(), key=lambda x: x[1], reverse=True):
615:        print(f"    {room:20} {count} files")
625:def status(palace_path: str):
628:        client = chromadb.PersistentClient(path=palace_path)
629:        col = client.get_collection("mempalace_drawers")
635:    # Count by wing and room
639:    wing_rooms = defaultdict(lambda: defaultdict(int))
641:        wing_rooms[m.get("wing", "?")][m.get("room", "?")] += 1
644:    print(f"  MemPalace Status — {len(metas)} drawers")
646:    for wing, rooms in sorted(wing_rooms.items()):
647:        print(f"  WING: {wing}")
648:        for room, count in sorted(rooms.items(), key=lambda x: x[1], reverse=True):
649:            print(f"    ROOM: {room:20} {count:5} drawers")
--- convo_miner.py
6:Normalizes format, chunks by exchange pair (Q+A = one unit), files to palace.
16:from collections import defaultdict
19:from .palace import SKIP_DIRS, get_collection, file_already_mined
39:def chunk_exchanges(content: str) -> list:
42:    Falls back to paragraph chunking if no > markers.
48:        return _chunk_by_exchange(lines)
50:        return _chunk_by_paragraph(content)
53:def _chunk_by_exchange(lines: list) -> list:
54:    """One user turn (>) + the AI response that follows = one chunk."""
55:    chunks = []
77:                chunks.append(
80:                        "chunk_index": len(chunks),
86:    return chunks
89:def _chunk_by_paragraph(content: str) -> list:
90:    """Fallback: chunk by paragraph breaks."""
91:    chunks = []
94:    # If no paragraph breaks and long content, chunk by line groups
100:                chunks.append({"content": group, "chunk_index": len(chunks)})
101:        return chunks
105:            chunks.append({"content": para, "chunk_index": len(chunks)})
107:    return chunks
181:def detect_convo_room(content: str) -> str:
185:    for room, keywords in TOPIC_KEYWORDS.items():
188:            scores[room] = score
204:def scan_convos(convo_dir: str) -> list:
232:def mine_convos(
235:    wing: str = None,
239:    extract_mode: str = "exchange",
243:    extract_mode:
244:        "exchange" — default exchange-pair chunking (Q+A = one unit)
245:        "general"  — general extractor: decisions, preferences, milestones, problems, emotions
249:    if not wing:
250:        wing = convo_path.name.lower().replace(" ", "_").replace("-", "_")
259:    print(f"  Wing:    {wing}")
267:    collection = get_collection(palace_path) if not dry_run else None
269:    total_drawers = 0
271:    room_counts = defaultdict(int)
277:        if not dry_run and file_already_mined(collection, source_file):
290:        # Chunk — either exchange pairs or general extraction
291:        if extract_mode == "general":
292:            from .general_extractor import extract_memories
294:            chunks = extract_memories(content)
295:            # Each chunk already has memory_type; use it as the room name
297:            chunks = chunk_exchanges(content)
299:        if not chunks:
302:        # Detect room from content (general mode uses memory_type instead)
303:        if extract_mode != "general":
304:            room = detect_convo_room(content)
306:            room = None  # set per-chunk below
309:            if extract_mode == "general":
310:                from collections import Counter
312:                type_counts = Counter(c.get("memory_type", "general") for c in chunks)
314:                print(f"    [DRY RUN] {filepath.name} → {len(chunks)} memories ({types_str})")
316:                print(f"    [DRY RUN] {filepath.name} → room:{room} ({len(chunks)} drawers)")
317:            total_drawers += len(chunks)
318:            # Track room counts
319:            if extract_mode == "general":
320:                for c in chunks:
321:                    room_counts[c.get("memory_type", "general")] += 1
323:                room_counts[room] += 1
326:        if extract_mode != "general":
327:            room_counts[room] += 1
329:        # File each chunk
330:        drawers_added = 0
331:        for chunk in chunks:
332:            chunk_room = chunk.get("memory_type", room) if extract_mode == "general" else room
333:            if extract_mode == "general":
334:                room_counts[chunk_room] += 1
335:            drawer_id = f"drawer_{wing}_{chunk_room}_{hashlib.sha256((source_file + str(chunk['chunk_index'])).encode()).hexdigest()[:24]}"
337:                collection.upsert(
338:                    documents=[chunk["content"]],
339:                    ids=[drawer_id],
342:                            "wing": wing,
343:                            "room": chunk_room,
345:                            "chunk_index": chunk["chunk_index"],
349:                            "extract_mode": extract_mode,
353:                drawers_added += 1
358:        total_drawers += drawers_added
359:        print(f"  ✓ [{i:4}/{len(files)}] {filepath.name[:50]:50} +{drawers_added}")
365:    print(f"  Drawers filed: {total_drawers}")
366:    if room_counts:
367:        print("\n  By room:")
368:        for room, count in sorted(room_counts.items(), key=lambda x: x[1], reverse=True):
369:            print(f"    {room:20} {count} files")
--- general_extractor.py
3:general_extractor.py — Extract 5 types of memories from text.
12:No LLM required. Pure keyword/pattern heuristics.
16:    from general_extractor import extract_memories
18:    chunks = extract_memories(text)
19:    # [{"content": "...", "memory_type": "decision", "chunk_index": 0}, ...]
240:def _get_sentiment(text: str) -> str:
252:def _has_resolution(text: str) -> bool:
269:def _disambiguate(memory_type: str, text: str, scores: Dict[str, float]) -> str:
310:def _is_code_line(line: str) -> bool:
323:def _extract_prose(text: str) -> str:
345:def _score_markers(text: str, markers: List[str]) -> Tuple[float, List[str]]:
363:def extract_memories(text: str, min_confidence: float = 0.3) -> List[Dict]:
368:        text: The text to extract from (any format).
372:        List of dicts: {"content": str, "memory_type": str, "chunk_index": int}
382:        prose = _extract_prose(para)
417:                "chunk_index": len(memories),
424:def _split_into_segments(text: str) -> List[str]:
426:    Split text into segments suitable for memory extraction.
455:    # If single giant block, chunk by line groups
467:def _split_by_turns(lines: List[str], turn_patterns: List[re.Pattern]) -> List[str]:
496:        print("Usage: python general_extractor.py <file>")
506:    memories = extract_memories(text)
509:    from collections import Counter
--- onboarding.py
9:  4. What they want their wings called
25:# Default wing taxonomies by mode
59:def _hr():
63:def _header(text):
69:def _ask(prompt, default=None):
76:def _yn(prompt, default="y"):
88:def _ask_mode() -> str:
100:    print("    [2]  Personal — diary, family, health, relationships, reflections")
120:def _ask_people(mode: str) -> tuple[list, dict]:
175:def _ask_projects(mode: str) -> list:
201:def _ask_wings(mode: str) -> list:
207:  Suggested wings for {mode} mode:
223:def _auto_detect(directory: str, known_people: list) -> list:
247:def _warn_ambiguous(people: list) -> list:
266:def _generate_aaak_bootstrap(
267:    people: list, projects: list, wings: list, mode: str, config_dir: Path = None
270:    Generate AAAK entity registry + critical facts bootstrap from onboarding data.
317:    # Critical facts bootstrap (pre-palace — before any mining)
319:        "# Critical Facts (bootstrap — will be enriched after mining)",
355:            f"Wings: {', '.join(wings)}",
365:def run_onboarding(
384:    wings = _ask_wings(mode)
436:    # Generate AAAK entity registry + critical facts bootstrap
437:    _generate_aaak_bootstrap(people, projects, wings, mode, config_dir)
442:    print(f"  {registry.summary()}")
443:    print(f"\n  Wings: {', '.join(wings)}")
446:    print("  Critical facts bootstrap: ~/.mempalace/critical_facts.md")
458:def quick_setup(
--- palace.py
8:import chromadb
37:def get_collection(palace_path: str, collection_name: str = "mempalace_drawers"):
38:    """Get or create the palace ChromaDB collection."""
44:    client = chromadb.PersistentClient(path=palace_path)
46:        return client.get_collection(collection_name)
48:        return client.create_collection(collection_name)
51:def file_already_mined(collection, source_file: str, check_mtime: bool = False) -> bool:
59:        results = collection.get(where={"source_file": source_file}, limit=1)
--- config.py
14:# Shared sanitizers for wing/room/entity names. Prevents path traversal,
22:def sanitize_name(value: str, field_name: str = "name") -> str:
23:    """Validate and sanitize a wing/room/entity name.
50:def sanitize_content(value: str, max_length: int = 100_000) -> str:
51:    """Validate drawer/diary content length."""
62:DEFAULT_COLLECTION_NAME = "mempalace_drawers"
69:    "identity",
109:    "identity": ["identity", "name", "who am i", "persona", "self"],
115:class MempalaceConfig:
151:    def collection_name(self):
152:        """ChromaDB collection name."""
153:        return self._file_config.get("collection_name", DEFAULT_COLLECTION_NAME)
167:    def topic_wings(self):
168:        """List of topic wing names."""
169:        return self._file_config.get("topic_wings", DEFAULT_TOPIC_WINGS)
172:    def hall_keywords(self):
173:        """Mapping of hall names to keyword lists."""
174:        return self._file_config.get("hall_keywords", DEFAULT_HALL_KEYWORDS)
187:                "collection_name": DEFAULT_COLLECTION_NAME,
188:                "topic_wings": DEFAULT_TOPIC_WINGS,
189:                "hall_keywords": DEFAULT_HALL_KEYWORDS,
--- hooks_cli.py
2:Hook logic for MemPalace — Python implementation of session-start, stop, and precompact hooks.
5:Supported hooks: session-start, stop, precompact
18:STATE_DIR = Path.home() / ".mempalace" / "hook_state"
23:    "categories. Use verbatim quotes where possible. Continue conversation "
30:    "\u2014 after compaction, detailed context will be lost. Organize into "
31:    "appropriate categories. Use verbatim quotes where possible. Save "
32:    "everything, then allow compaction to proceed."
36:def _sanitize_session_id(session_id: str) -> str:
42:def _count_human_messages(transcript_path: str) -> int:
81:def _log(message: str):
82:    """Append to hook state log file."""
85:        log_path = STATE_DIR / "hook.log"
93:def _output(data: dict):
98:def _maybe_auto_ingest():
103:            log_path = STATE_DIR / "hook.log"
117:def _parse_harness_input(data: dict, harness: str) -> dict:
124:        "stop_hook_active": data.get("stop_hook_active", False),
129:def hook_stop(data: dict, harness: str):
130:    """Stop hook: block every N messages for auto-save."""
133:    stop_hook_active = parsed["stop_hook_active"]
137:    if str(stop_hook_active).lower() in ("true", "1", "yes"):
175:def hook_session_start(data: dict, harness: str):
176:    """Session start hook: initialize session tracking state."""
189:def hook_precompact(data: dict, harness: str):
190:    """Precompact hook: always block with comprehensive save instruction."""
196:    # Optional: auto-ingest synchronously before compaction (so memories land first)
200:            log_path = STATE_DIR / "hook.log"
211:    # Always block -- compaction = save everything
215:def run_hook(hook_name: str, harness: str):
216:    """Main entry point: read stdin JSON, dispatch to hook handler."""
223:    hooks = {
224:        "session-start": hook_session_start,
225:        "stop": hook_stop,
226:        "precompact": hook_precompact,
229:    handler = hooks.get(hook_name)
231:        print(f"Unknown hook: {hook_name}", file=sys.stderr)

codex
The repo split is becoming clear: CLI and MCP are thin front doors, ChromaDB is the main verbatim drawer store, SQLite is a separate temporal fact store, and hooks sit beside that core to force preservation timing. I’m now reading the actual implementations around those seams so the final write-up can distinguish branding language from what the Python code truly wires together.
exec
/bin/zsh -lc "sed -n '52,170p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md && printf '\\n---\\n' && sed -n '190,320p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md && printf '\\n---\\n' && sed -n '450,590p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

### Why Structure Matters

Tested on 22,000+ real conversation memories:

```
Search all closets:          60.9%  R@10
Search within wing:          73.1%  (+12%)
Search wing + hall:          84.8%  (+24%)
Search wing + room:          94.8%  (+34%)
```

Wings and rooms aren't cosmetic. They're a **34% retrieval improvement**. The palace structure is the product.

### The Memory Stack

| Layer | What | Size | When |
|-------|------|------|------|
| **L0** | Identity — who is this AI? | ~50 tokens | Always loaded |
| **L1** | Critical facts — team, projects, preferences | ~120 tokens (AAAK) | Always loaded |
| **L2** | Room recall — recent sessions, current project | On demand | When topic comes up |
| **L3** | Deep search — semantic query across all closets | On demand | When explicitly asked |

Your AI wakes up with L0 + L1 (~170 tokens) and knows your world. Searches only fire when needed.

### AAAK Dialect (experimental)

AAAK is a lossy abbreviation system — entity codes, structural markers, and sentence truncation — designed to pack repeated entities and relationships into fewer tokens at scale. It is **readable by any LLM that reads text** (Claude, GPT, Gemini, Llama, Mistral) without a decoder, so a local model can use it without any cloud dependency.

**Honest status (April 2026):**

- **AAAK is lossy, not lossless.** It uses regex-based abbreviation, not reversible compression.
- **It does not save tokens at small scales.** Short text already tokenizes efficiently. AAAK overhead (codes, separators) costs more than it saves on a few sentences.
- **It can save tokens at scale** — in scenarios with many repeated entities (a team mentioned hundreds of times, the same project across thousands of sessions), the entity codes amortize.
- **AAAK currently regresses LongMemEval** vs raw verbatim retrieval (84.2% R@5 vs 96.6%). The 96.6% headline number is from **raw mode**, not AAAK mode.
- **The MemPalace storage default is raw verbatim text in ChromaDB** — that's where the benchmark wins come from. AAAK is a separate compression layer for context loading, not the storage format.

We're iterating on the dialect spec, adding a real tokenizer for stats, and exploring better break points for when to use it. Track progress in [Issue #43](https://github.com/milla-jovovich/mempalace/issues/43) and [#27](https://github.com/milla-jovovich/mempalace/issues/27).

### Contradiction Detection (experimental, not yet wired into KG)

A separate utility (`fact_checker.py`) can check assertions against entity facts. It's not currently called automatically by the knowledge graph operations — this is being fixed (track in [Issue #27](https://github.com/milla-jovovich/mempalace/issues/27)). When enabled it catches things like:

```
Input:  "Soren finished the auth migration"
Output: 🔴 AUTH-MIGRATION: attribution conflict — Maya was assigned, not Soren

Input:  "Kai has been here 2 years"
Output: 🟡 KAI: wrong_tenure — records show 3 years (started 2023-04)

Input:  "The sprint ends Friday"
Output: 🟡 SPRINT: stale_date — current sprint ends Thursday (updated 2 days ago)
```

Facts checked against the knowledge graph. Ages, dates, and tenures calculated dynamically — not hardcoded.

---

## Real-World Examples


---
## MCP Server

```bash
# Via plugin (recommended)
claude plugin marketplace add milla-jovovich/mempalace
claude plugin install --scope user mempalace

# Or manually
claude mcp add mempalace -- python -m mempalace.mcp_server
```

### 19 Tools

**Palace (read)**

| Tool | What |
|------|------|
| `mempalace_status` | Palace overview + AAAK spec + memory protocol |
| `mempalace_list_wings` | Wings with counts |
| `mempalace_list_rooms` | Rooms within a wing |
| `mempalace_get_taxonomy` | Full wing → room → count tree |
| `mempalace_search` | Semantic search with wing/room filters |
| `mempalace_check_duplicate` | Check before filing |
| `mempalace_get_aaak_spec` | AAAK dialect reference |

**Palace (write)**

| Tool | What |
|------|------|
| `mempalace_add_drawer` | File verbatim content |
| `mempalace_delete_drawer` | Remove by ID |

**Knowledge Graph**

| Tool | What |
|------|------|
| `mempalace_kg_query` | Entity relationships with time filtering |
| `mempalace_kg_add` | Add facts |
| `mempalace_kg_invalidate` | Mark facts as ended |
| `mempalace_kg_timeline` | Chronological entity story |
| `mempalace_kg_stats` | Graph overview |

**Navigation**

| Tool | What |
|------|------|
| `mempalace_traverse` | Walk the graph from a room across wings |
| `mempalace_find_tunnels` | Find rooms bridging two wings |
| `mempalace_graph_stats` | Graph connectivity overview |

**Agent Diary**

| Tool | What |
|------|------|
| `mempalace_diary_write` | Write AAAK diary entry |
| `mempalace_diary_read` | Read recent diary entries |

The AI learns AAAK and the memory protocol automatically from the `mempalace_status` response. No manual configuration.

---

## Auto-Save Hooks

Two hooks for Claude Code that automatically save memories during work:

**Save Hook** — every 15 messages, triggers a structured save. Topics, decisions, quotes, code changes. Also regenerates the critical facts layer.

**PreCompact Hook** — fires before context compression. Emergency save before the window shrinks.

```json
{
  "hooks": {
    "Stop": [{"matcher": "", "hooks": [{"type": "command", "command": "/path/to/mempalace/hooks/mempal_save_hook.sh"}]}],
    "PreCompact": [{"matcher": "", "hooks": [{"type": "command", "command": "/path/to/mempalace/hooks/mempal_precompact_hook.sh"}]}]
  }
}
```

**Optional auto-ingest:** Set the `MEMPAL_DIR` environment variable to a directory path and the hooks will automatically run `mempalace mine` on that directory during each save trigger (background on stop, synchronous on precompact).

---

## Benchmarks

Tested on standard academic benchmarks — reproducible, published datasets.

| Benchmark | Mode | Score | API Calls |
|-----------|------|-------|-----------|
| **LongMemEval R@5** | Raw (ChromaDB only) | **96.6%** | Zero |
| **LongMemEval R@5** | Hybrid + Haiku rerank | **100%** (500/500) | ~500 |
| **LoCoMo R@10** | Raw, session level | **60.3%** | Zero |
| **Personal palace R@10** | Heuristic bench | **85%** | Zero |
| **Palace structure impact** | Wing+room filtering | **+34%** R@10 | Zero |

The 96.6% raw score is the highest published LongMemEval result requiring no API key, no cloud, and no LLM at any stage.

### vs Published Systems

| System | LongMemEval R@5 | API Required | Cost |
|--------|----------------|--------------|------|
| **MemPalace (hybrid)** | **100%** | Optional | Free |
| Supermemory ASMR | ~99% | Yes | — |
| **MemPalace (raw)** | **96.6%** | **None** | **Free** |
| Mastra | 94.87% | Yes (GPT) | API costs |
| Mem0 | ~85% | Yes | $19–249/mo |
| Zep | ~85% | Yes | $25/mo+ |

---

## All Commands

```bash
# Setup
mempalace init <dir>                              # guided onboarding + AAAK bootstrap

# Mining
mempalace mine <dir>                              # mine project files
mempalace mine <dir> --mode convos                # mine conversation exports
mempalace mine <dir> --mode convos --wing myapp   # tag with a wing name

# Splitting
mempalace split <dir>                             # split concatenated transcripts
mempalace split <dir> --dry-run                   # preview

# Search
mempalace search "query"                          # search everything
mempalace search "query" --wing myapp             # within a wing
mempalace search "query" --room auth-migration    # within a room

# Memory stack
mempalace wake-up                                 # load L0 + L1 context
mempalace wake-up --wing driftwood                # project-specific

# Compression
mempalace compress --wing myapp                   # AAAK compress

# Status
mempalace status                                  # palace overview

# MCP
mempalace mcp                                     # show MCP setup command

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py && printf '\\n---\\n' && sed -n '220,420p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---
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
    else:
        server_cmd = base_server_cmd

    print("MemPalace MCP quick setup:")
    print(f"  claude mcp add mempalace -- {server_cmd}")
    print("\nRun the server directly:")
    print(f"  {server_cmd}")

    if not args.palace:
        print("\nOptional custom palace:")
        print(f"  claude mcp add mempalace -- {base_server_cmd} --palace /path/to/palace")
        print(f"  {base_server_cmd} --palace /path/to/palace")


def cmd_compress(args):
    """Compress drawers in a wing using AAAK Dialect."""
    import chromadb
    from .dialect import Dialect

    palace_path = os.path.expanduser(args.palace) if args.palace else MempalaceConfig().palace_path

    # Load dialect (with optional entity config)
    config_path = args.config
    if not config_path:
        for candidate in ["entities.json", os.path.join(palace_path, "entities.json")]:
            if os.path.exists(candidate):
                config_path = candidate
                break

    if config_path and os.path.exists(config_path):
        dialect = Dialect.from_config(config_path)
        print(f"  Loaded entity config: {config_path}")
    else:
        dialect = Dialect()

    # Connect to palace
    try:
        client = chromadb.PersistentClient(path=palace_path)
        col = client.get_collection("mempalace_drawers")
    except Exception:
        print(f"\n  No palace found at {palace_path}")
        print("  Run: mempalace init <dir> then mempalace mine <dir>")
        sys.exit(1)

    # Query drawers in batches to avoid SQLite variable limit (~999)
    where = {"wing": args.wing} if args.wing else None
    _BATCH = 500
    docs, metas, ids = [], [], []
    offset = 0
    while True:
        try:
            kwargs = {"include": ["documents", "metadatas"], "limit": _BATCH, "offset": offset}
            if where:
                kwargs["where"] = where
            batch = col.get(**kwargs)
        except Exception as e:
            if not docs:
                print(f"\n  Error reading drawers: {e}")
                sys.exit(1)
            break
        batch_docs = batch.get("documents", [])
        if not batch_docs:
            break
        docs.extend(batch_docs)
        metas.extend(batch.get("metadatas", []))
        ids.extend(batch.get("ids", []))
        offset += len(batch_docs)
        if len(batch_docs) < _BATCH:
            break

    if not docs:
        wing_label = f" in wing '{args.wing}'" if args.wing else ""
        print(f"\n  No drawers found{wing_label}.")
        return

    print(
        f"\n  Compressing {len(docs)} drawers"
        + (f" in wing '{args.wing}'" if args.wing else "")
        + "..."
    )
    print()

    total_original = 0
    total_compressed = 0
    compressed_entries = []

    for doc, meta, doc_id in zip(docs, metas, ids):
        compressed = dialect.compress(doc, metadata=meta)
        stats = dialect.compression_stats(doc, compressed)

        total_original += stats["original_chars"]
        total_compressed += stats["compressed_chars"]

        compressed_entries.append((doc_id, compressed, meta, stats))

        if args.dry_run:
            wing_name = meta.get("wing", "?")
            room_name = meta.get("room", "?")
            source = Path(meta.get("source_file", "?")).name
            print(f"  [{wing_name}/{room_name}] {source}")
            print(
                f"    {stats['original_tokens']}t -> {stats['compressed_tokens']}t ({stats['ratio']:.1f}x)"
            )
            print(f"    {compressed}")
            print()

    # Store compressed versions (unless dry-run)
    if not args.dry_run:
        try:
            comp_col = client.get_or_create_collection("mempalace_compressed")
            for doc_id, compressed, meta, stats in compressed_entries:
                comp_meta = dict(meta)
                comp_meta["compression_ratio"] = round(stats["ratio"], 1)
                comp_meta["original_tokens"] = stats["original_tokens"]
                comp_col.upsert(
                    ids=[doc_id],
                    documents=[compressed],
                    metadatas=[comp_meta],
                )
            print(
                f"  Stored {len(compressed_entries)} compressed drawers in 'mempalace_compressed' collection."
            )
        except Exception as e:
            print(f"  Error storing compressed drawers: {e}")
            sys.exit(1)

    # Summary
    ratio = total_original / max(total_compressed, 1)
    orig_tokens = Dialect.count_tokens("x" * total_original)
    comp_tokens = Dialect.count_tokens("x" * total_compressed)
    print(f"  Total: {orig_tokens:,}t -> {comp_tokens:,}t ({ratio:.1f}x compression)")
    if args.dry_run:
        print("  (dry run -- nothing stored)")


def main():
    parser = argparse.ArgumentParser(
        description="MemPalace — Give your AI a memory. No API key required.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--palace",
        default=None,
        help="Where the palace lives (default: from ~/.mempalace/config.json or ~/.mempalace/palace)",
    )

    sub = parser.add_subparsers(dest="command")

    # init
    p_init = sub.add_parser("init", help="Detect rooms from your folder structure")
    p_init.add_argument("dir", help="Project directory to set up")
    p_init.add_argument(
        "--yes", action="store_true", help="Auto-accept all detected entities (non-interactive)"
    )

    # mine
    p_mine = sub.add_parser("mine", help="Mine files into the palace")
    p_mine.add_argument("dir", help="Directory to mine")
    p_mine.add_argument(

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py && printf '\\n---\\n' && sed -n '220,420p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py && printf '\\n---\\n' && sed -n '420,960p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---
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


---


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
                    "room": room,
                    "hall": "hall_diary",
                    "topic": topic,
                    "type": "diary_entry",
                    "agent": agent_name,
                    "filed_at": now.isoformat(),
                    "date": now.strftime("%Y-%m-%d"),
                }
            ],
        )
        logger.info(f"Diary entry: {entry_id} → {wing}/diary/{topic}")
        return {
            "success": True,
            "entry_id": entry_id,
            "agent": agent_name,
            "topic": topic,
            "timestamp": now.isoformat(),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


def tool_diary_read(agent_name: str, last_n: int = 10):
    """
    Read an agent's recent diary entries. Returns the last N entries
    in chronological order — the agent's personal journal.
    """
    wing = f"wing_{agent_name.lower().replace(' ', '_')}"
    col = _get_collection()
    if not col:
        return _no_palace()

    try:
        results = col.get(
            where={"$and": [{"wing": wing}, {"room": "diary"}]},
            include=["documents", "metadatas"],
            limit=10000,
        )

        if not results["ids"]:
            return {"agent": agent_name, "entries": [], "message": "No diary entries yet."}

        # Combine and sort by timestamp
        entries = []
        for doc, meta in zip(results["documents"], results["metadatas"]):
            entries.append(
                {
                    "date": meta.get("date", ""),
                    "timestamp": meta.get("filed_at", ""),
                    "topic": meta.get("topic", ""),
                    "content": doc,
                }
            )

        entries.sort(key=lambda x: x["timestamp"], reverse=True)
        entries = entries[:last_n]

        return {
            "agent": agent_name,
            "entries": entries,
            "total": len(results["ids"]),
            "showing": len(entries),
        }
    except Exception as e:
        return {"error": str(e)}


# ==================== MCP PROTOCOL ====================

TOOLS = {
    "mempalace_status": {
        "description": "Palace overview — total drawers, wing and room counts",
        "input_schema": {"type": "object", "properties": {}},
        "handler": tool_status,
    },
    "mempalace_list_wings": {
        "description": "List all wings with drawer counts",
        "input_schema": {"type": "object", "properties": {}},
        "handler": tool_list_wings,
    },
    "mempalace_list_rooms": {
        "description": "List rooms within a wing (or all rooms if no wing given)",
        "input_schema": {
            "type": "object",
            "properties": {
                "wing": {"type": "string", "description": "Wing to list rooms for (optional)"},
            },
        },
        "handler": tool_list_rooms,
    },
    "mempalace_get_taxonomy": {
        "description": "Full taxonomy: wing → room → drawer count",
        "input_schema": {"type": "object", "properties": {}},
        "handler": tool_get_taxonomy,
    },
    "mempalace_get_aaak_spec": {
        "description": "Get the AAAK dialect specification — the compressed memory format MemPalace uses. Call this if you need to read or write AAAK-compressed memories.",
        "input_schema": {"type": "object", "properties": {}},
        "handler": tool_get_aaak_spec,
    },
    "mempalace_kg_query": {
        "description": "Query the knowledge graph for an entity's relationships. Returns typed facts with temporal validity. E.g. 'Max' → child_of Alice, loves chess, does swimming. Filter by date with as_of to see what was true at a point in time.",
        "input_schema": {
            "type": "object",
            "properties": {
                "entity": {
                    "type": "string",
                    "description": "Entity to query (e.g. 'Max', 'MyProject', 'Alice')",
                },
                "as_of": {
                    "type": "string",
                    "description": "Date filter — only facts valid at this date (YYYY-MM-DD, optional)",
                },
                "direction": {
                    "type": "string",
                    "description": "outgoing (entity→?), incoming (?→entity), or both (default: both)",
                },
            },
            "required": ["entity"],
        },
        "handler": tool_kg_query,
    },
    "mempalace_kg_add": {
        "description": "Add a fact to the knowledge graph. Subject → predicate → object with optional time window. E.g. ('Max', 'started_school', 'Year 7', valid_from='2026-09-01').",
        "input_schema": {
            "type": "object",
            "properties": {
                "subject": {"type": "string", "description": "The entity doing/being something"},
                "predicate": {
                    "type": "string",
                    "description": "The relationship type (e.g. 'loves', 'works_on', 'daughter_of')",
                },
                "object": {"type": "string", "description": "The entity being connected to"},
                "valid_from": {
                    "type": "string",
                    "description": "When this became true (YYYY-MM-DD, optional)",
                },
                "source_closet": {
                    "type": "string",
                    "description": "Closet ID where this fact appears (optional)",
                },
            },
            "required": ["subject", "predicate", "object"],
        },
        "handler": tool_kg_add,
    },
    "mempalace_kg_invalidate": {
        "description": "Mark a fact as no longer true. E.g. ankle injury resolved, job ended, moved house.",
        "input_schema": {
            "type": "object",
            "properties": {
                "subject": {"type": "string", "description": "Entity"},
                "predicate": {"type": "string", "description": "Relationship"},
                "object": {"type": "string", "description": "Connected entity"},
                "ended": {
                    "type": "string",
                    "description": "When it stopped being true (YYYY-MM-DD, default: today)",
                },
            },
            "required": ["subject", "predicate", "object"],
        },
        "handler": tool_kg_invalidate,
    },
    "mempalace_kg_timeline": {
        "description": "Chronological timeline of facts. Shows the story of an entity (or everything) in order.",
        "input_schema": {
            "type": "object",
            "properties": {
                "entity": {
                    "type": "string",
                    "description": "Entity to get timeline for (optional — omit for full timeline)",
                },
            },
        },
        "handler": tool_kg_timeline,
    },
    "mempalace_kg_stats": {
        "description": "Knowledge graph overview: entities, triples, current vs expired facts, relationship types.",
        "input_schema": {"type": "object", "properties": {}},
        "handler": tool_kg_stats,
    },
    "mempalace_traverse": {
        "description": "Walk the palace graph from a room. Shows connected ideas across wings — the tunnels. Like following a thread through the palace: start at 'chromadb-setup' in wing_code, discover it connects to wing_myproject (planning) and wing_user (feelings about it).",
        "input_schema": {
            "type": "object",
            "properties": {
                "start_room": {
                    "type": "string",
                    "description": "Room to start from (e.g. 'chromadb-setup', 'riley-school')",
                },
                "max_hops": {
                    "type": "integer",
                    "description": "How many connections to follow (default: 2)",
                },
            },
            "required": ["start_room"],
        },
        "handler": tool_traverse_graph,
    },
    "mempalace_find_tunnels": {
        "description": "Find rooms that bridge two wings — the hallways connecting different domains. E.g. what topics connect wing_code to wing_team?",
        "input_schema": {
            "type": "object",
            "properties": {
                "wing_a": {"type": "string", "description": "First wing (optional)"},
                "wing_b": {"type": "string", "description": "Second wing (optional)"},
            },
        },
        "handler": tool_find_tunnels,
    },
    "mempalace_graph_stats": {
        "description": "Palace graph overview: total rooms, tunnel connections, edges between wings.",
        "input_schema": {"type": "object", "properties": {}},
        "handler": tool_graph_stats,
    },
    "mempalace_search": {
        "description": "Semantic search. Returns verbatim drawer content with similarity scores.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "What to search for"},
                "limit": {"type": "integer", "description": "Max results (default 5)"},
                "wing": {"type": "string", "description": "Filter by wing (optional)"},
                "room": {"type": "string", "description": "Filter by room (optional)"},
            },
            "required": ["query"],
        },
        "handler": tool_search,
    },
    "mempalace_check_duplicate": {
        "description": "Check if content already exists in the palace before filing",
        "input_schema": {
            "type": "object",
            "properties": {
                "content": {"type": "string", "description": "Content to check"},
                "threshold": {
                    "type": "number",
                    "description": "Similarity threshold 0-1 (default 0.9)",
                },
            },
            "required": ["content"],
        },
        "handler": tool_check_duplicate,
    },
    "mempalace_add_drawer": {
        "description": "File verbatim content into the palace. Checks for duplicates first.",
        "input_schema": {
            "type": "object",
            "properties": {
                "wing": {"type": "string", "description": "Wing (project name)"},
                "room": {
                    "type": "string",
                    "description": "Room (aspect: backend, decisions, meetings...)",
                },
                "content": {
                    "type": "string",
                    "description": "Verbatim content to store — exact words, never summarized",
                },
                "source_file": {"type": "string", "description": "Where this came from (optional)"},
                "added_by": {"type": "string", "description": "Who is filing this (default: mcp)"},
            },
            "required": ["wing", "room", "content"],
        },
        "handler": tool_add_drawer,
    },
    "mempalace_delete_drawer": {
        "description": "Delete a drawer by ID. Irreversible.",
        "input_schema": {
            "type": "object",
            "properties": {
                "drawer_id": {"type": "string", "description": "ID of the drawer to delete"},
            },
            "required": ["drawer_id"],
        },
        "handler": tool_delete_drawer,
    },
    "mempalace_diary_write": {
        "description": "Write to your personal agent diary in AAAK format. Your observations, thoughts, what you worked on, what matters. Each agent has their own diary with full history. Write in AAAK for compression — e.g. 'SESSION:2026-04-04|built.palace.graph+diary.tools|ALC.req:agent.diaries.in.aaak|★★★'. Use entity codes from the AAAK spec.",
        "input_schema": {
            "type": "object",
            "properties": {
                "agent_name": {
                    "type": "string",
                    "description": "Your name — each agent gets their own diary wing",
                },
                "entry": {
                    "type": "string",
                    "description": "Your diary entry in AAAK format — compressed, entity-coded, emotion-marked",
                },
                "topic": {
                    "type": "string",
                    "description": "Topic tag (optional, default: general)",
                },
            },
            "required": ["agent_name", "entry"],
        },
        "handler": tool_diary_write,
    },
    "mempalace_diary_read": {
        "description": "Read your recent diary entries (in AAAK). See what past versions of yourself recorded — your journal across sessions.",
        "input_schema": {
            "type": "object",
            "properties": {
                "agent_name": {
                    "type": "string",
                    "description": "Your name — each agent gets their own diary wing",
                },
                "last_n": {
                    "type": "integer",
                    "description": "Number of recent entries to read (default: 10)",
                },
            },
            "required": ["agent_name"],
        },
        "handler": tool_diary_read,
    },
}


SUPPORTED_PROTOCOL_VERSIONS = [
    "2025-11-25",
    "2025-06-18",
    "2025-03-26",
    "2024-11-05",
]


def handle_request(request):
    method = request.get("method", "")
    params = request.get("params", {})
    req_id = request.get("id")

    if method == "initialize":
        client_version = params.get("protocolVersion", SUPPORTED_PROTOCOL_VERSIONS[-1])
        negotiated = (
            client_version
            if client_version in SUPPORTED_PROTOCOL_VERSIONS
            else SUPPORTED_PROTOCOL_VERSIONS[0]
        )
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": negotiated,
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "mempalace", "version": __version__},
            },
        }
    elif method == "notifications/initialized":
        return None
    elif method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "tools": [
                    {"name": n, "description": t["description"], "inputSchema": t["input_schema"]}
                    for n, t in TOOLS.items()
                ]
            },
        }
    elif method == "tools/call":
        tool_name = params.get("name")
        tool_args = params.get("arguments") or {}
        if tool_name not in TOOLS:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32601, "message": f"Unknown tool: {tool_name}"},
            }
        # Coerce argument types based on input_schema.
        # MCP JSON transport may deliver integers as floats or strings;
        # ChromaDB and Python slicing require native int.
        schema_props = TOOLS[tool_name]["input_schema"].get("properties", {})
        for key, value in list(tool_args.items()):
            prop_schema = schema_props.get(key, {})
            declared_type = prop_schema.get("type")
            if declared_type == "integer" and not isinstance(value, int):
                tool_args[key] = int(value)
            elif declared_type == "number" and not isinstance(value, (int, float)):
                tool_args[key] = float(value)
        try:
            result = TOOLS[tool_name]["handler"](**tool_args)
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {"content": [{"type": "text", "text": json.dumps(result, indent=2)}]},
            }
        except Exception:
            logger.exception(f"Tool error in {tool_name}")
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32000, "message": "Internal tool error"},
            }

    return {
        "jsonrpc": "2.0",
        "id": req_id,
        "error": {"code": -32601, "message": f"Unknown method: {method}"},
    }


def main():
    logger.info("MemPalace MCP Server starting...")
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            line = line.strip()
            if not line:
                continue
            request = json.loads(line)
            response = handle_request(request)
            if response is not None:
                sys.stdout.write(json.dumps(response) + "\n")
                sys.stdout.flush()
        except KeyboardInterrupt:
            break
        except Exception as e:
            logger.error(f"Server error: {e}")


if __name__ == "__main__":
    main()

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py && printf '\\n---\\n' && sed -n '260,560p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---
    def search(self, query: str, wing: str = None, room: str = None, n_results: int = 5) -> str:
        """Semantic search, returns compact result text."""
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

        kwargs = {
            "query_texts": [query],
            "n_results": n_results,
            "include": ["documents", "metadatas", "distances"],
        }
        if where:
            kwargs["where"] = where

        try:
            results = col.query(**kwargs)
        except Exception as e:
            return f"Search error: {e}"

        docs = results["documents"][0]
        metas = results["metadatas"][0]
        dists = results["distances"][0]

        if not docs:
            return "No results found."

        lines = [f'## L3 — SEARCH RESULTS for "{query}"']
        for i, (doc, meta, dist) in enumerate(zip(docs, metas, dists), 1):
            similarity = round(1 - dist, 3)
            wing_name = meta.get("wing", "?")
            room_name = meta.get("room", "?")
            source = Path(meta.get("source_file", "")).name if meta.get("source_file") else ""

            snippet = doc.strip().replace("\n", " ")
            if len(snippet) > 300:
                snippet = snippet[:297] + "..."

            lines.append(f"  [{i}] {wing_name}/{room_name} (sim={similarity})")
            lines.append(f"      {snippet}")
            if source:
                lines.append(f"      src: {source}")

        return "\n".join(lines)

    def search_raw(
        self, query: str, wing: str = None, room: str = None, n_results: int = 5
    ) -> list:
        """Return raw dicts instead of formatted text."""
        try:
            client = chromadb.PersistentClient(path=self.palace_path)
            col = client.get_collection("mempalace_drawers")
        except Exception:
            return []

        where = {}
        if wing and room:
            where = {"$and": [{"wing": wing}, {"room": room}]}
        elif wing:
            where = {"wing": wing}
        elif room:
            where = {"room": room}

        kwargs = {
            "query_texts": [query],
            "n_results": n_results,
            "include": ["documents", "metadatas", "distances"],
        }
        if where:
            kwargs["where"] = where

        try:
            results = col.query(**kwargs)
        except Exception:
            return []

        hits = []
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        ):
            hits.append(
                {
                    "text": doc,
                    "wing": meta.get("wing", "unknown"),
                    "room": meta.get("room", "unknown"),
                    "source_file": Path(meta.get("source_file", "?")).name,
                    "similarity": round(1 - dist, 3),
                    "metadata": meta,
                }
            )
        return hits


# ---------------------------------------------------------------------------
# MemoryStack — unified interface
# ---------------------------------------------------------------------------


class MemoryStack:
    """
    The full 4-layer stack. One class, one palace, everything works.

        stack = MemoryStack()
        print(stack.wake_up())                # L0 + L1 (~600-900 tokens)
        print(stack.recall(wing="my_app"))     # L2 on-demand
        print(stack.search("pricing change"))  # L3 deep search
    """

    def __init__(self, palace_path: str = None, identity_path: str = None):
        cfg = MempalaceConfig()
        self.palace_path = palace_path or cfg.palace_path
        self.identity_path = identity_path or os.path.expanduser("~/.mempalace/identity.txt")

        self.l0 = Layer0(self.identity_path)
        self.l1 = Layer1(self.palace_path)
        self.l2 = Layer2(self.palace_path)
        self.l3 = Layer3(self.palace_path)

    def wake_up(self, wing: str = None) -> str:
        """
        Generate wake-up text: L0 (identity) + L1 (essential story).
        Typically ~600-900 tokens. Inject into system prompt or first message.

        Args:
            wing: Optional wing filter for L1 (project-specific wake-up).
        """
        parts = []

        # L0: Identity
        parts.append(self.l0.render())
        parts.append("")

        # L1: Essential Story
        if wing:
            self.l1.wing = wing
        parts.append(self.l1.generate())

        return "\n".join(parts)

    def recall(self, wing: str = None, room: str = None, n_results: int = 10) -> str:
        """On-demand L2 retrieval filtered by wing/room."""
        return self.l2.retrieve(wing=wing, room=room, n_results=n_results)

    def search(self, query: str, wing: str = None, room: str = None, n_results: int = 5) -> str:
        """Deep L3 semantic search."""
        return self.l3.search(query, wing=wing, room=room, n_results=n_results)

    def status(self) -> dict:
        """Status of all layers."""
        result = {
            "palace_path": self.palace_path,
            "L0_identity": {
                "path": self.identity_path,
                "exists": os.path.exists(self.identity_path),
                "tokens": self.l0.token_estimate(),
            },
            "L1_essential": {
                "description": "Auto-generated from top palace drawers",
            },
            "L2_on_demand": {
                "description": "Wing/room filtered retrieval",
            },
            "L3_deep_search": {
                "description": "Full semantic search via ChromaDB",
            },
        }

        # Count drawers
        try:
            client = chromadb.PersistentClient(path=self.palace_path)
            col = client.get_collection("mempalace_drawers")
            count = col.count()
            result["total_drawers"] = count
        except Exception:
            result["total_drawers"] = 0

        return result


# ---------------------------------------------------------------------------
# CLI (standalone)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import json

    def usage():
        print("layers.py — 4-Layer Memory Stack")
        print()
        print("Usage:")
        print("  python layers.py wake-up              Show L0 + L1")
        print("  python layers.py wake-up --wing=NAME  Wake-up for a specific project")
        print("  python layers.py recall --wing=NAME   On-demand L2 retrieval")
        print("  python layers.py search <query>       Deep L3 search")
        print("  python layers.py status               Show layer status")
        sys.exit(0)

    if len(sys.argv) < 2:
        usage()

    cmd = sys.argv[1]

    # Parse flags
    flags = {}
    positional = []
    for arg in sys.argv[2:]:
        if arg.startswith("--") and "=" in arg:
            key, val = arg.split("=", 1)
            flags[key.lstrip("-")] = val
        elif not arg.startswith("--"):
            positional.append(arg)

    palace_path = flags.get("palace")
    stack = MemoryStack(palace_path=palace_path)

    if cmd in ("wake-up", "wakeup"):
        wing = flags.get("wing")
        text = stack.wake_up(wing=wing)
        tokens = len(text) // 4
        print(f"Wake-up text (~{tokens} tokens):")
        print("=" * 50)
        print(text)

    elif cmd == "recall":
        wing = flags.get("wing")
        room = flags.get("room")
        text = stack.recall(wing=wing, room=room)
        print(text)

    elif cmd == "search":
        query = " ".join(positional) if positional else ""
        if not query:
            print("Usage: python layers.py search <query>")
            sys.exit(1)
        wing = flags.get("wing")
        room = flags.get("room")
        text = stack.search(query, wing=wing, room=room)
        print(text)

    elif cmd == "status":
        s = stack.status()
        print(json.dumps(s, indent=2))

    else:
        usage()

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py && printf '\\n---\\n' && sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py && printf '\\n---\\n' && sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---
"""
palace_graph.py — Graph traversal layer for MemPalace
======================================================

Builds a navigable graph from the palace structure:
  - Nodes = rooms (named ideas)
  - Edges = shared rooms across wings (tunnels)
  - Edge types = halls (the corridors)

Enables queries like:
  "Start at chromadb-setup in wing_code, walk to wing_myproject"
  "Find all rooms connected to riley-college-apps"
  "What topics bridge wing_hardware and wing_myproject?"

No external graph DB needed — built from ChromaDB metadata.
"""

from collections import defaultdict, Counter
from .config import MempalaceConfig

import chromadb


def _get_collection(config=None):
    config = config or MempalaceConfig()
    try:
        client = chromadb.PersistentClient(path=config.palace_path)
        return client.get_collection(config.collection_name)
    except Exception:
        return None


def build_graph(col=None, config=None):
    """
    Build the palace graph from ChromaDB metadata.

    Returns:
        nodes: dict of {room: {wings: set, halls: set, count: int}}
        edges: list of {room, wing_a, wing_b, hall} — one per tunnel crossing
    """
    if col is None:
        col = _get_collection(config)
    if not col:
        return {}, []

    total = col.count()
    room_data = defaultdict(lambda: {"wings": set(), "halls": set(), "count": 0, "dates": set()})

    offset = 0
    while offset < total:
        batch = col.get(limit=1000, offset=offset, include=["metadatas"])
        for meta in batch["metadatas"]:
            room = meta.get("room", "")
            wing = meta.get("wing", "")
            hall = meta.get("hall", "")
            date = meta.get("date", "")
            if room and room != "general" and wing:
                room_data[room]["wings"].add(wing)
                if hall:
                    room_data[room]["halls"].add(hall)
                if date:
                    room_data[room]["dates"].add(date)
                room_data[room]["count"] += 1
        if not batch["ids"]:
            break
        offset += len(batch["ids"])

    # Build edges from rooms that span multiple wings
    edges = []
    for room, data in room_data.items():
        wings = sorted(data["wings"])
        if len(wings) >= 2:
            for i, wa in enumerate(wings):
                for wb in wings[i + 1 :]:
                    for hall in data["halls"]:
                        edges.append(
                            {
                                "room": room,
                                "wing_a": wa,
                                "wing_b": wb,
                                "hall": hall,
                                "count": data["count"],
                            }
                        )

    # Convert sets to lists for JSON serialization
    nodes = {}
    for room, data in room_data.items():
        nodes[room] = {
            "wings": sorted(data["wings"]),
            "halls": sorted(data["halls"]),
            "count": data["count"],
            "dates": sorted(data["dates"])[-5:] if data["dates"] else [],
        }

    return nodes, edges


def traverse(start_room: str, col=None, config=None, max_hops: int = 2):
    """
    Walk the graph from a starting room. Find connected rooms
    through shared wings.

    Returns list of paths: [{room, wing, hall, hop_distance}]
    """
    nodes, edges = build_graph(col, config)

    if start_room not in nodes:
        return {
            "error": f"Room '{start_room}' not found",
            "suggestions": _fuzzy_match(start_room, nodes),
        }

    start = nodes[start_room]
    visited = {start_room}
    results = [
        {
            "room": start_room,
            "wings": start["wings"],
            "halls": start["halls"],
            "count": start["count"],
            "hop": 0,
        }
    ]

    # BFS traversal
    frontier = [(start_room, 0)]
    while frontier:
        current_room, depth = frontier.pop(0)
        if depth >= max_hops:
            continue

        current = nodes.get(current_room, {})
        current_wings = set(current.get("wings", []))

        # Find all rooms that share a wing with current room
        for room, data in nodes.items():
            if room in visited:
                continue
            shared_wings = current_wings & set(data["wings"])
            if shared_wings:
                visited.add(room)
                results.append(
                    {
                        "room": room,
                        "wings": data["wings"],
                        "halls": data["halls"],
                        "count": data["count"],
                        "hop": depth + 1,
                        "connected_via": sorted(shared_wings),
                    }
                )
                if depth + 1 < max_hops:
                    frontier.append((room, depth + 1))

    # Sort by relevance (hop distance, then count)
    results.sort(key=lambda x: (x["hop"], -x["count"]))
    return results[:50]  # cap results


def find_tunnels(wing_a: str = None, wing_b: str = None, col=None, config=None):
    """
    Find rooms that connect two wings (or all tunnel rooms if no wings specified).
    These are the "hallways" — same named idea appearing in multiple domains.
    """
    nodes, edges = build_graph(col, config)

    tunnels = []
    for room, data in nodes.items():
        wings = data["wings"]
        if len(wings) < 2:
            continue

        if wing_a and wing_a not in wings:
            continue
        if wing_b and wing_b not in wings:
            continue

        tunnels.append(
            {
                "room": room,
                "wings": wings,
                "halls": data["halls"],
                "count": data["count"],
                "recent": data["dates"][-1] if data["dates"] else "",
            }
        )

    tunnels.sort(key=lambda x: -x["count"])
    return tunnels[:50]


def graph_stats(col=None, config=None):
    """Summary statistics about the palace graph."""
    nodes, edges = build_graph(col, config)

    tunnel_rooms = sum(1 for n in nodes.values() if len(n["wings"]) >= 2)
    wing_counts = Counter()
    for data in nodes.values():
        for w in data["wings"]:
            wing_counts[w] += 1

    return {
        "total_rooms": len(nodes),
        "tunnel_rooms": tunnel_rooms,
        "total_edges": len(edges),
        "rooms_per_wing": dict(wing_counts.most_common()),
        "top_tunnels": [
            {"room": r, "wings": d["wings"], "count": d["count"]}
            for r, d in sorted(nodes.items(), key=lambda x: -len(x[1]["wings"]))[:10]
            if len(d["wings"]) >= 2
        ],
    }


def _fuzzy_match(query: str, nodes: dict, n: int = 5):
    """Find rooms that approximately match a query string."""
    query_lower = query.lower()
    scored = []
    for room in nodes:
        # Simple substring matching
        if query_lower in room:
            scored.append((room, 1.0))
        elif any(word in room for word in query_lower.split("-")):
            scored.append((room, 0.5))
    scored.sort(key=lambda x: -x[1])
    return [r for r, _ in scored[:n]]

---
"""
knowledge_graph.py — Temporal Entity-Relationship Graph for MemPalace
=====================================================================

Real knowledge graph with:
  - Entity nodes (people, projects, tools, concepts)
  - Typed relationship edges (daughter_of, does, loves, works_on, etc.)
  - Temporal validity (valid_from → valid_to — knows WHEN facts are true)
  - Closet references (links back to the verbatim memory)

Storage: SQLite (local, no dependencies, no subscriptions)
Query: entity-first traversal with time filtering

This is what competes with Zep's temporal knowledge graph.
Zep uses Neo4j in the cloud ($25/mo+). We use SQLite locally (free).

Usage:
    from mempalace.knowledge_graph import KnowledgeGraph

    kg = KnowledgeGraph()
    kg.add_triple("Max", "child_of", "Alice", valid_from="2015-04-01")
    kg.add_triple("Max", "does", "swimming", valid_from="2025-01-01")
    kg.add_triple("Max", "loves", "chess", valid_from="2025-10-01")

    # Query: everything about Max
    kg.query_entity("Max")

    # Query: what was true about Max in January 2026?
    kg.query_entity("Max", as_of="2026-01-15")

    # Query: who is connected to Alice?
    kg.query_entity("Alice", direction="both")

    # Invalidate: Max's sports injury resolved
    kg.invalidate("Max", "has_issue", "sports_injury", ended="2026-02-15")
"""

import hashlib
import json
import os
import sqlite3
from datetime import date, datetime
from pathlib import Path


DEFAULT_KG_PATH = os.path.expanduser("~/.mempalace/knowledge_graph.sqlite3")


class KnowledgeGraph:
    def __init__(self, db_path: str = None):
        self.db_path = db_path or DEFAULT_KG_PATH
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        self._connection = None
        self._init_db()

    def _init_db(self):
        conn = self._conn()
        conn.executescript("""
            PRAGMA journal_mode=WAL;

            CREATE TABLE IF NOT EXISTS entities (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT DEFAULT 'unknown',
                properties TEXT DEFAULT '{}',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS triples (
                id TEXT PRIMARY KEY,
                subject TEXT NOT NULL,
                predicate TEXT NOT NULL,
                object TEXT NOT NULL,
                valid_from TEXT,
                valid_to TEXT,
                confidence REAL DEFAULT 1.0,
                source_closet TEXT,
                source_file TEXT,
                extracted_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (subject) REFERENCES entities(id),
                FOREIGN KEY (object) REFERENCES entities(id)
            );

            CREATE INDEX IF NOT EXISTS idx_triples_subject ON triples(subject);
            CREATE INDEX IF NOT EXISTS idx_triples_object ON triples(object);
            CREATE INDEX IF NOT EXISTS idx_triples_predicate ON triples(predicate);
            CREATE INDEX IF NOT EXISTS idx_triples_valid ON triples(valid_from, valid_to);
        """)
        conn.commit()

    def _conn(self):
        if self._connection is None:
            self._connection = sqlite3.connect(self.db_path, timeout=10, check_same_thread=False)
            self._connection.execute("PRAGMA journal_mode=WAL")
            self._connection.row_factory = sqlite3.Row
        return self._connection

    def close(self):
        """Close the database connection."""
        if self._connection is not None:
            self._connection.close()
            self._connection = None

    def _entity_id(self, name: str) -> str:
        return name.lower().replace(" ", "_").replace("'", "")

    # ── Write operations ──────────────────────────────────────────────────

    def add_entity(self, name: str, entity_type: str = "unknown", properties: dict = None):
        """Add or update an entity node."""
        eid = self._entity_id(name)
        props = json.dumps(properties or {})
        conn = self._conn()
        with conn:
            conn.execute(
                "INSERT OR REPLACE INTO entities (id, name, type, properties) VALUES (?, ?, ?, ?)",
                (eid, name, entity_type, props),
            )
        return eid

    def add_triple(
        self,
        subject: str,
        predicate: str,
        obj: str,
        valid_from: str = None,
        valid_to: str = None,
        confidence: float = 1.0,
        source_closet: str = None,
        source_file: str = None,
    ):
        """
        Add a relationship triple: subject → predicate → object.

        Examples:
            add_triple("Max", "child_of", "Alice", valid_from="2015-04-01")
            add_triple("Max", "does", "swimming", valid_from="2025-01-01")
            add_triple("Alice", "worried_about", "Max injury", valid_from="2026-01", valid_to="2026-02")
        """
        sub_id = self._entity_id(subject)
        obj_id = self._entity_id(obj)
        pred = predicate.lower().replace(" ", "_")

        # Auto-create entities if they don't exist
        conn = self._conn()
        with conn:
            conn.execute(
                "INSERT OR IGNORE INTO entities (id, name) VALUES (?, ?)", (sub_id, subject)
            )
            conn.execute("INSERT OR IGNORE INTO entities (id, name) VALUES (?, ?)", (obj_id, obj))

            # Check for existing identical triple
            existing = conn.execute(
                "SELECT id FROM triples WHERE subject=? AND predicate=? AND object=? AND valid_to IS NULL",
                (sub_id, pred, obj_id),
            ).fetchone()

            if existing:
                return existing["id"]  # Already exists and still valid

            triple_id = f"t_{sub_id}_{pred}_{obj_id}_{hashlib.sha256(f'{valid_from}{datetime.now().isoformat()}'.encode()).hexdigest()[:12]}"

            conn.execute(
                """INSERT INTO triples (id, subject, predicate, object, valid_from, valid_to, confidence, source_closet, source_file)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    triple_id,
                    sub_id,
                    pred,
                    obj_id,
                    valid_from,
                    valid_to,
                    confidence,
                    source_closet,
                    source_file,
                ),
            )
        return triple_id

    def invalidate(self, subject: str, predicate: str, obj: str, ended: str = None):
        """Mark a relationship as no longer valid (set valid_to date)."""
        sub_id = self._entity_id(subject)
        obj_id = self._entity_id(obj)
        pred = predicate.lower().replace(" ", "_")
        ended = ended or date.today().isoformat()

        conn = self._conn()
        with conn:
            conn.execute(
                "UPDATE triples SET valid_to=? WHERE subject=? AND predicate=? AND object=? AND valid_to IS NULL",
                (ended, sub_id, pred, obj_id),
            )

    # ── Query operations ──────────────────────────────────────────────────

    def query_entity(self, name: str, as_of: str = None, direction: str = "outgoing"):
        """
        Get all relationships for an entity.

        direction: "outgoing" (entity → ?), "incoming" (? → entity), "both"
        as_of: date string — only return facts valid at that time
        """
        eid = self._entity_id(name)
        conn = self._conn()

        results = []

        if direction in ("outgoing", "both"):
            query = "SELECT t.*, e.name as obj_name FROM triples t JOIN entities e ON t.object = e.id WHERE t.subject = ?"
            params = [eid]
            if as_of:
                query += " AND (t.valid_from IS NULL OR t.valid_from <= ?) AND (t.valid_to IS NULL OR t.valid_to >= ?)"
                params.extend([as_of, as_of])
            for row in conn.execute(query, params).fetchall():
                results.append(
                    {
                        "direction": "outgoing",
                        "subject": name,
                        "predicate": row["predicate"],
                        "object": row["obj_name"],
                        "valid_from": row["valid_from"],
                        "valid_to": row["valid_to"],
                        "confidence": row["confidence"],
                        "source_closet": row["source_closet"],
                        "current": row["valid_to"] is None,
                    }
                )

        if direction in ("incoming", "both"):
            query = "SELECT t.*, e.name as sub_name FROM triples t JOIN entities e ON t.subject = e.id WHERE t.object = ?"
            params = [eid]
            if as_of:
                query += " AND (t.valid_from IS NULL OR t.valid_from <= ?) AND (t.valid_to IS NULL OR t.valid_to >= ?)"
                params.extend([as_of, as_of])
            for row in conn.execute(query, params).fetchall():
                results.append(
                    {
                        "direction": "incoming",
                        "subject": row["sub_name"],
                        "predicate": row["predicate"],
                        "object": name,
                        "valid_from": row["valid_from"],
                        "valid_to": row["valid_to"],
                        "confidence": row["confidence"],
                        "source_closet": row["source_closet"],
                        "current": row["valid_to"] is None,
                    }
                )

        return results

    def query_relationship(self, predicate: str, as_of: str = None):
        """Get all triples with a given relationship type."""
        pred = predicate.lower().replace(" ", "_")
        conn = self._conn()
        query = """
            SELECT t.*, s.name as sub_name, o.name as obj_name
            FROM triples t
            JOIN entities s ON t.subject = s.id
            JOIN entities o ON t.object = o.id

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py && printf '\\n---\\n' && sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py && printf '\\n---\\n' && sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py && printf '\\n---\\n' && sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py && printf '\\n---\\n' && sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
#!/usr/bin/env python3
"""
miner.py — Files everything into the palace.

Reads mempalace.yaml from the project directory to know the wing + rooms.
Routes each file to the right room based on content.
Stores verbatim chunks as drawers. No summaries. Ever.
"""

import os
import sys
import hashlib
import fnmatch
from pathlib import Path
from datetime import datetime
from collections import defaultdict

import chromadb

from .palace import SKIP_DIRS, get_collection, file_already_mined

READABLE_EXTENSIONS = {
    ".txt",
    ".md",
    ".py",
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".json",
    ".yaml",
    ".yml",
    ".html",
    ".css",
    ".java",
    ".go",
    ".rs",
    ".rb",
    ".sh",
    ".csv",
    ".sql",
    ".toml",
}

SKIP_FILENAMES = {
    "mempalace.yaml",
    "mempalace.yml",
    "mempal.yaml",
    "mempal.yml",
    ".gitignore",
    "package-lock.json",
}

CHUNK_SIZE = 800  # chars per drawer
CHUNK_OVERLAP = 100  # overlap between chunks
MIN_CHUNK_SIZE = 50  # skip tiny chunks
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB — skip files larger than this


# =============================================================================
# IGNORE MATCHING
# =============================================================================


class GitignoreMatcher:
    """Lightweight matcher for one directory's .gitignore patterns."""

    def __init__(self, base_dir: Path, rules: list):
        self.base_dir = base_dir
        self.rules = rules

    @classmethod
    def from_dir(cls, dir_path: Path):
        gitignore_path = dir_path / ".gitignore"
        if not gitignore_path.is_file():
            return None

        try:
            lines = gitignore_path.read_text(encoding="utf-8", errors="replace").splitlines()
        except Exception:
            return None

        rules = []
        for raw_line in lines:
            line = raw_line.strip()
            if not line:
                continue

            if line.startswith("\\#") or line.startswith("\\!"):
                line = line[1:]
            elif line.startswith("#"):
                continue

            negated = line.startswith("!")
            if negated:
                line = line[1:]

            anchored = line.startswith("/")
            if anchored:
                line = line.lstrip("/")

            dir_only = line.endswith("/")
            if dir_only:
                line = line.rstrip("/")

            if not line:
                continue

            rules.append(
                {
                    "pattern": line,
                    "anchored": anchored,
                    "dir_only": dir_only,
                    "negated": negated,
                }
            )

        if not rules:
            return None

        return cls(dir_path, rules)

    def matches(self, path: Path, is_dir: bool = None):
        try:
            relative = path.relative_to(self.base_dir).as_posix().strip("/")
        except ValueError:
            return None

        if not relative:
            return None

        if is_dir is None:
            is_dir = path.is_dir()

        ignored = None
        for rule in self.rules:
            if self._rule_matches(rule, relative, is_dir):
                ignored = not rule["negated"]
        return ignored

    def _rule_matches(self, rule: dict, relative: str, is_dir: bool) -> bool:
        pattern = rule["pattern"]
        parts = relative.split("/")
        pattern_parts = pattern.split("/")

        if rule["dir_only"]:
            target_parts = parts if is_dir else parts[:-1]
            if not target_parts:
                return False
            if rule["anchored"] or len(pattern_parts) > 1:
                return self._match_from_root(target_parts, pattern_parts)
            return any(fnmatch.fnmatch(part, pattern) for part in target_parts)

        if rule["anchored"] or len(pattern_parts) > 1:
            return self._match_from_root(parts, pattern_parts)

        return any(fnmatch.fnmatch(part, pattern) for part in parts)

    def _match_from_root(self, target_parts: list, pattern_parts: list) -> bool:
        def matches(path_index: int, pattern_index: int) -> bool:
            if pattern_index == len(pattern_parts):
                return True

            if path_index == len(target_parts):
                return all(part == "**" for part in pattern_parts[pattern_index:])

            pattern_part = pattern_parts[pattern_index]
            if pattern_part == "**":
                return matches(path_index, pattern_index + 1) or matches(
                    path_index + 1, pattern_index
                )

            if not fnmatch.fnmatch(target_parts[path_index], pattern_part):
                return False

            return matches(path_index + 1, pattern_index + 1)

        return matches(0, 0)


def load_gitignore_matcher(dir_path: Path, cache: dict):
    """Load and cache one directory's .gitignore matcher."""
    if dir_path not in cache:
        cache[dir_path] = GitignoreMatcher.from_dir(dir_path)
    return cache[dir_path]


def is_gitignored(path: Path, matchers: list, is_dir: bool = False) -> bool:
    """Apply active .gitignore matchers in ancestor order; last match wins."""
    ignored = False
    for matcher in matchers:
        decision = matcher.matches(path, is_dir=is_dir)
        if decision is not None:
            ignored = decision
    return ignored


def should_skip_dir(dirname: str) -> bool:
    """Skip known generated/cache directories before gitignore matching."""
    return dirname in SKIP_DIRS or dirname.endswith(".egg-info")


def normalize_include_paths(include_ignored: list) -> set:
    """Normalize comma-parsed include paths into project-relative POSIX strings."""
    normalized = set()
    for raw_path in include_ignored or []:
        candidate = str(raw_path).strip().strip("/")
        if candidate:
            normalized.add(Path(candidate).as_posix())
    return normalized


def is_exact_force_include(path: Path, project_path: Path, include_paths: set) -> bool:
    """Return True when a path exactly matches an explicit include override."""
    if not include_paths:
        return False

    try:
        relative = path.relative_to(project_path).as_posix().strip("/")
    except ValueError:
        return False

    return relative in include_paths


def is_force_included(path: Path, project_path: Path, include_paths: set) -> bool:
    """Return True when a path or one of its ancestors/descendants was explicitly included."""
    if not include_paths:
        return False

    try:
        relative = path.relative_to(project_path).as_posix().strip("/")
    except ValueError:
        return False

    if not relative:
        return False

    for include_path in include_paths:
        if relative == include_path:
            return True
        if relative.startswith(f"{include_path}/"):
            return True
        if include_path.startswith(f"{relative}/"):
            return True

    return False


# =============================================================================
# CONFIG
# =============================================================================


def load_config(project_dir: str) -> dict:
    """Load mempalace.yaml from project directory (falls back to mempal.yaml)."""
    import yaml

    config_path = Path(project_dir).expanduser().resolve() / "mempalace.yaml"
    if not config_path.exists():

---
#!/usr/bin/env python3
"""
convo_miner.py — Mine conversations into the palace.

Ingests chat exports (Claude Code, ChatGPT, Slack, plain text transcripts).
Normalizes format, chunks by exchange pair (Q+A = one unit), files to palace.

Same palace as project mining. Different ingest strategy.
"""

import os
import sys
import hashlib
from pathlib import Path
from datetime import datetime
from collections import defaultdict

from .normalize import normalize
from .palace import SKIP_DIRS, get_collection, file_already_mined


# File types that might contain conversations
CONVO_EXTENSIONS = {
    ".txt",
    ".md",
    ".json",
    ".jsonl",
}

MIN_CHUNK_SIZE = 30
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB — skip files larger than this


# =============================================================================
# CHUNKING — exchange pairs for conversations
# =============================================================================


def chunk_exchanges(content: str) -> list:
    """
    Chunk by exchange pair: one > turn + AI response = one unit.
    Falls back to paragraph chunking if no > markers.
    """
    lines = content.split("\n")
    quote_lines = sum(1 for line in lines if line.strip().startswith(">"))

    if quote_lines >= 3:
        return _chunk_by_exchange(lines)
    else:
        return _chunk_by_paragraph(content)


def _chunk_by_exchange(lines: list) -> list:
    """One user turn (>) + the AI response that follows = one chunk."""
    chunks = []
    i = 0

    while i < len(lines):
        line = lines[i]
        if line.strip().startswith(">"):
            user_turn = line.strip()
            i += 1

            ai_lines = []
            while i < len(lines):
                next_line = lines[i]
                if next_line.strip().startswith(">") or next_line.strip().startswith("---"):
                    break
                if next_line.strip():
                    ai_lines.append(next_line.strip())
                i += 1

            ai_response = " ".join(ai_lines[:8])
            content = f"{user_turn}\n{ai_response}" if ai_response else user_turn

            if len(content.strip()) > MIN_CHUNK_SIZE:
                chunks.append(
                    {
                        "content": content,
                        "chunk_index": len(chunks),
                    }
                )
        else:
            i += 1

    return chunks


def _chunk_by_paragraph(content: str) -> list:
    """Fallback: chunk by paragraph breaks."""
    chunks = []
    paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]

    # If no paragraph breaks and long content, chunk by line groups
    if len(paragraphs) <= 1 and content.count("\n") > 20:
        lines = content.split("\n")
        for i in range(0, len(lines), 25):
            group = "\n".join(lines[i : i + 25]).strip()
            if len(group) > MIN_CHUNK_SIZE:
                chunks.append({"content": group, "chunk_index": len(chunks)})
        return chunks

    for para in paragraphs:
        if len(para) > MIN_CHUNK_SIZE:
            chunks.append({"content": para, "chunk_index": len(chunks)})

    return chunks


# =============================================================================
# ROOM DETECTION — topic-based for conversations
# =============================================================================

TOPIC_KEYWORDS = {
    "technical": [
        "code",
        "python",
        "function",
        "bug",
        "error",
        "api",
        "database",
        "server",
        "deploy",
        "git",
        "test",
        "debug",
        "refactor",
    ],
    "architecture": [
        "architecture",
        "design",
        "pattern",
        "structure",
        "schema",
        "interface",
        "module",
        "component",
        "service",
        "layer",
    ],
    "planning": [
        "plan",
        "roadmap",
        "milestone",
        "deadline",
        "priority",
        "sprint",
        "backlog",
        "scope",
        "requirement",
        "spec",
    ],
    "decisions": [
        "decided",
        "chose",
        "picked",
        "switched",
        "migrated",
        "replaced",
        "trade-off",
        "alternative",
        "option",
        "approach",
    ],
    "problems": [
        "problem",
        "issue",
        "broken",
        "failed",
        "crash",
        "stuck",
        "workaround",
        "fix",
        "solved",
        "resolved",
    ],
}


def detect_convo_room(content: str) -> str:
    """Score conversation content against topic keywords."""
    content_lower = content[:3000].lower()
    scores = {}
    for room, keywords in TOPIC_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in content_lower)
        if score > 0:
            scores[room] = score
    if scores:
        return max(scores, key=scores.get)
    return "general"


# =============================================================================
# PALACE OPERATIONS
# =============================================================================


# =============================================================================
# SCAN FOR CONVERSATION FILES
# =============================================================================


def scan_convos(convo_dir: str) -> list:
    """Find all potential conversation files."""
    convo_path = Path(convo_dir).expanduser().resolve()
    files = []
    for root, dirs, filenames in os.walk(convo_path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for filename in filenames:
            if filename.endswith(".meta.json"):
                continue
            filepath = Path(root) / filename
            if filepath.suffix.lower() in CONVO_EXTENSIONS:
                # Skip symlinks and oversized files
                if filepath.is_symlink():
                    continue
                try:
                    if filepath.stat().st_size > MAX_FILE_SIZE:
                        continue
                except OSError:
                    continue
                files.append(filepath)
    return files


# =============================================================================
# MINE CONVERSATIONS
# =============================================================================


def mine_convos(
    convo_dir: str,
    palace_path: str,
    wing: str = None,
    agent: str = "mempalace",
    limit: int = 0,
    dry_run: bool = False,
    extract_mode: str = "exchange",
):
    """Mine a directory of conversation files into the palace.

    extract_mode:
        "exchange" — default exchange-pair chunking (Q+A = one unit)
        "general"  — general extractor: decisions, preferences, milestones, problems, emotions
    """

    convo_path = Path(convo_dir).expanduser().resolve()
    if not wing:
        wing = convo_path.name.lower().replace(" ", "_").replace("-", "_")

    files = scan_convos(convo_dir)
    if limit > 0:
        files = files[:limit]

    print(f"\n{'=' * 55}")
    print("  MemPalace Mine — Conversations")
    print(f"{'=' * 55}")
    print(f"  Wing:    {wing}")
    print(f"  Source:  {convo_path}")

---
#!/usr/bin/env python3
"""
general_extractor.py — Extract 5 types of memories from text.

Types:
  1. DECISIONS    — "we went with X because Y", choices made
  2. PREFERENCES  — "always use X", "never do Y", "I prefer Z"
  3. MILESTONES   — breakthroughs, things that finally worked
  4. PROBLEMS     — what broke, what fixed it, root causes
  5. EMOTIONAL    — feelings, vulnerability, relationships

No LLM required. Pure keyword/pattern heuristics.
No external dependencies on palace.py, dialect.py, or layers.py.

Usage:
    from general_extractor import extract_memories

    chunks = extract_memories(text)
    # [{"content": "...", "memory_type": "decision", "chunk_index": 0}, ...]
"""

import re
from typing import List, Dict, Tuple


# =============================================================================
# MARKER SETS — One per memory type
# =============================================================================

DECISION_MARKERS = [
    r"\blet'?s (use|go with|try|pick|choose|switch to)\b",
    r"\bwe (should|decided|chose|went with|picked|settled on)\b",
    r"\bi'?m going (to|with)\b",
    r"\bbetter (to|than|approach|option|choice)\b",
    r"\binstead of\b",
    r"\brather than\b",
    r"\bthe reason (is|was|being)\b",
    r"\bbecause\b",
    r"\btrade-?off\b",
    r"\bpros and cons\b",
    r"\bover\b.*\bbecause\b",
    r"\barchitecture\b",
    r"\bapproach\b",
    r"\bstrategy\b",
    r"\bpattern\b",
    r"\bstack\b",
    r"\bframework\b",
    r"\binfrastructure\b",
    r"\bset (it |this )?to\b",
    r"\bconfigure\b",
    r"\bdefault\b",
]

PREFERENCE_MARKERS = [
    r"\bi prefer\b",
    r"\balways use\b",
    r"\bnever use\b",
    r"\bdon'?t (ever |like to )?(use|do|mock|stub|import)\b",
    r"\bi like (to|when|how)\b",
    r"\bi hate (when|how|it when)\b",
    r"\bplease (always|never|don'?t)\b",
    r"\bmy (rule|preference|style|convention) is\b",
    r"\bwe (always|never)\b",
    r"\bfunctional\b.*\bstyle\b",
    r"\bimperative\b",
    r"\bsnake_?case\b",
    r"\bcamel_?case\b",
    r"\btabs\b.*\bspaces\b",
    r"\bspaces\b.*\btabs\b",
    r"\buse\b.*\binstead of\b",
]

MILESTONE_MARKERS = [
    r"\bit works\b",
    r"\bit worked\b",
    r"\bgot it working\b",
    r"\bfixed\b",
    r"\bsolved\b",
    r"\bbreakthrough\b",
    r"\bfigured (it )?out\b",
    r"\bnailed it\b",
    r"\bcracked (it|the)\b",
    r"\bfinally\b",
    r"\bfirst time\b",
    r"\bfirst ever\b",
    r"\bnever (done|been|had) before\b",
    r"\bdiscovered\b",
    r"\brealized\b",
    r"\bfound (out|that)\b",
    r"\bturns out\b",
    r"\bthe key (is|was|insight)\b",
    r"\bthe trick (is|was)\b",
    r"\bnow i (understand|see|get it)\b",
    r"\bbuilt\b",
    r"\bcreated\b",
    r"\bimplemented\b",
    r"\bshipped\b",
    r"\blaunched\b",
    r"\bdeployed\b",
    r"\breleased\b",
    r"\bprototype\b",
    r"\bproof of concept\b",
    r"\bdemo\b",
    r"\bversion \d",
    r"\bv\d+\.\d+",
    r"\d+x (compression|faster|slower|better|improvement|reduction)",
    r"\d+% (reduction|improvement|faster|better|smaller)",
]

PROBLEM_MARKERS = [
    r"\b(bug|error|crash|fail|broke|broken|issue|problem)\b",
    r"\bdoesn'?t work\b",
    r"\bnot working\b",
    r"\bwon'?t\b.*\bwork\b",
    r"\bkeeps? (failing|crashing|breaking|erroring)\b",
    r"\broot cause\b",
    r"\bthe (problem|issue|bug) (is|was)\b",
    r"\bturns out\b.*\b(was|because|due to)\b",
    r"\bthe fix (is|was)\b",
    r"\bworkaround\b",
    r"\bthat'?s why\b",
    r"\bthe reason it\b",
    r"\bfixed (it |the |by )\b",
    r"\bsolution (is|was)\b",
    r"\bresolved\b",
    r"\bpatched\b",
    r"\bthe answer (is|was)\b",
    r"\b(had|need) to\b.*\binstead\b",
]

EMOTION_MARKERS = [
    r"\blove\b",
    r"\bscared\b",
    r"\bafraid\b",
    r"\bproud\b",
    r"\bhurt\b",
    r"\bhappy\b",
    r"\bsad\b",
    r"\bcry\b",
    r"\bcrying\b",
    r"\bmiss\b",
    r"\bsorry\b",
    r"\bgrateful\b",
    r"\bangry\b",
    r"\bworried\b",
    r"\blonely\b",
    r"\bbeautiful\b",
    r"\bamazing\b",
    r"\bwonderful\b",
    r"i feel",
    r"i'm scared",
    r"i love you",
    r"i'm sorry",
    r"i can't",
    r"i wish",
    r"i miss",
    r"i need",
    r"never told anyone",
    r"nobody knows",
    r"\*[^*]+\*",
]

ALL_MARKERS = {
    "decision": DECISION_MARKERS,
    "preference": PREFERENCE_MARKERS,
    "milestone": MILESTONE_MARKERS,
    "problem": PROBLEM_MARKERS,
    "emotional": EMOTION_MARKERS,
}


# =============================================================================
# SENTIMENT — for disambiguation
# =============================================================================

POSITIVE_WORDS = {
    "pride",
    "proud",
    "joy",
    "happy",
    "love",
    "loving",
    "beautiful",
    "amazing",
    "wonderful",
    "incredible",
    "fantastic",
    "brilliant",
    "perfect",
    "excited",
    "thrilled",
    "grateful",
    "warm",
    "breakthrough",
    "success",
    "works",
    "working",
    "solved",
    "fixed",
    "nailed",
    "heart",
    "hug",
    "precious",
    "adore",
}

NEGATIVE_WORDS = {
    "bug",
    "error",
    "crash",
    "crashing",
    "crashed",
    "fail",
    "failed",
    "failing",
    "failure",
    "broken",
    "broke",
    "breaking",
    "breaks",
    "issue",
    "problem",
    "wrong",
    "stuck",
    "blocked",
    "unable",
    "impossible",
    "missing",
    "terrible",
    "horrible",
    "awful",
    "worse",
    "worst",
    "panic",
    "disaster",
    "mess",
}


def _get_sentiment(text: str) -> str:

---
#!/usr/bin/env python3
"""
onboarding.py — MemPalace first-run setup.

Asks the user:
  1. How they're using MemPalace (work / personal / combo)
  2. Who the people in their life are (names, nicknames, relationships)
  3. What their projects are
  4. What they want their wings called

Seeds the entity_registry with confirmed data so MemPalace knows your world
from minute one — before a single session is indexed.

Usage:
    python3 -m mempalace.onboarding
    or: mempalace init
"""

from pathlib import Path
from mempalace.entity_registry import EntityRegistry
from mempalace.entity_detector import detect_entities, scan_for_detection


# ─────────────────────────────────────────────────────────────────────────────
# Default wing taxonomies by mode
# ─────────────────────────────────────────────────────────────────────────────

DEFAULT_WINGS = {
    "work": [
        "projects",
        "clients",
        "team",
        "decisions",
        "research",
    ],
    "personal": [
        "family",
        "health",
        "creative",
        "reflections",
        "relationships",
    ],
    "combo": [
        "family",
        "work",
        "health",
        "creative",
        "projects",
        "reflections",
    ],
}


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────


def _hr():
    print(f"\n{'─' * 58}")


def _header(text):
    print(f"\n{'=' * 58}")
    print(f"  {text}")
    print(f"{'=' * 58}")


def _ask(prompt, default=None):
    if default:
        val = input(f"  {prompt} [{default}]: ").strip()
        return val if val else default
    return input(f"  {prompt}: ").strip()


def _yn(prompt, default="y"):
    val = input(f"  {prompt} [{'Y/n' if default == 'y' else 'y/N'}]: ").strip().lower()
    if not val:
        return default == "y"
    return val.startswith("y")


# ─────────────────────────────────────────────────────────────────────────────
# Step 1: Mode selection
# ─────────────────────────────────────────────────────────────────────────────


def _ask_mode() -> str:
    _header("Welcome to MemPalace")
    print("""
  MemPalace is a personal memory system. To work well, it needs to know
  a little about your world — who the people are, what the projects
  are, and how you want your memory organized.

  This takes about 2 minutes. You can always update it later.
""")
    print("  How are you using MemPalace?")
    print()
    print("    [1]  Work     — notes, projects, clients, colleagues, decisions")
    print("    [2]  Personal — diary, family, health, relationships, reflections")
    print("    [3]  Both     — personal and professional mixed")
    print()

    while True:
        choice = input("  Your choice [1/2/3]: ").strip()
        if choice == "1":
            return "work"
        elif choice == "2":
            return "personal"
        elif choice == "3":
            return "combo"
        print("  Please enter 1, 2, or 3.")


# ─────────────────────────────────────────────────────────────────────────────
# Step 2: People
# ─────────────────────────────────────────────────────────────────────────────


def _ask_people(mode: str) -> tuple[list, dict]:
    """Returns (people_list, aliases_dict)."""
    people = []
    aliases = {}  # nickname → full name

    if mode in ("personal", "combo"):
        _hr()
        print("""
  Personal world — who are the important people in your life?

  Format: name, relationship (e.g. "Riley, daughter" or just "Devon")
  For nicknames, you'll be asked separately.
  Type 'done' when finished.
""")
        while True:
            entry = input("  Person: ").strip()
            if entry.lower() in ("done", ""):
                break
            parts = [p.strip() for p in entry.split(",", 1)]
            name = parts[0]
            relationship = parts[1] if len(parts) > 1 else ""
            if name:
                # Ask about nicknames
                nick = input(f"  Nickname for {name}? (or enter to skip): ").strip()
                if nick:
                    aliases[nick] = name
                people.append({"name": name, "relationship": relationship, "context": "personal"})

    if mode in ("work", "combo"):
        _hr()
        print("""
  Work world — who are the colleagues, clients, or collaborators
  you'd want to find in your notes?

  Format: name, role (e.g. "Ben, co-founder" or just "Sarah")
  Type 'done' when finished.
""")
        while True:
            entry = input("  Person: ").strip()
            if entry.lower() in ("done", ""):
                break
            parts = [p.strip() for p in entry.split(",", 1)]
            name = parts[0]
            role = parts[1] if len(parts) > 1 else ""
            if name:
                people.append({"name": name, "relationship": role, "context": "work"})

    return people, aliases


# ─────────────────────────────────────────────────────────────────────────────
# Step 3: Projects
# ─────────────────────────────────────────────────────────────────────────────


def _ask_projects(mode: str) -> list:
    if mode == "personal":
        return []

    _hr()
    print("""
  What are your main projects? (These help MemPalace distinguish project
  names from person names — e.g. "Lantern" the project vs. "Lantern" the word.)

  Type 'done' when finished.
""")
    projects = []
    while True:
        proj = input("  Project: ").strip()
        if proj.lower() in ("done", ""):
            break
        if proj:
            projects.append(proj)
    return projects


# ─────────────────────────────────────────────────────────────────────────────
# Step 4: Wings
# ─────────────────────────────────────────────────────────────────────────────


def _ask_wings(mode: str) -> list:
    defaults = DEFAULT_WINGS[mode]
    _hr()
    print(f"""
  Wings are the top-level categories in your memory palace.

  Suggested wings for {mode} mode:
    {", ".join(defaults)}

  Press enter to keep these, or type your own comma-separated list.
""")
    custom = input("  Wings: ").strip()
    if custom:
        return [w.strip() for w in custom.split(",") if w.strip()]
    return defaults


# ─────────────────────────────────────────────────────────────────────────────
# Step 5: Auto-detect from files
# ─────────────────────────────────────────────────────────────────────────────


def _auto_detect(directory: str, known_people: list) -> list:
    """Scan directory for additional entity candidates."""
    known_names = {p["name"].lower() for p in known_people}

    try:
        files = scan_for_detection(directory)
        if not files:
            return []
        detected = detect_entities(files)
        new_people = [
            e
            for e in detected["people"]
            if e["name"].lower() not in known_names and e["confidence"] >= 0.7
        ]
        return new_people
    except Exception:
        return []


# ─────────────────────────────────────────────────────────────────────────────
# Step 6: Ambiguity warnings
# ─────────────────────────────────────────────────────────────────────────────


def _warn_ambiguous(people: list) -> list:
    """
    Flag names that are also common English words.
    Returns list of ambiguous names for user awareness.
    """
    from mempalace.entity_registry import COMMON_ENGLISH_WORDS

    ambiguous = []
    for p in people:
        if p["name"].lower() in COMMON_ENGLISH_WORDS:
            ambiguous.append(p["name"])
    return ambiguous



---
"""
Hook logic for MemPalace — Python implementation of session-start, stop, and precompact hooks.

Reads JSON from stdin, outputs JSON to stdout.
Supported hooks: session-start, stop, precompact
Supported harnesses: claude-code, codex (extensible to cursor, gemini, etc.)
"""

import json
import os
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

SAVE_INTERVAL = 15
STATE_DIR = Path.home() / ".mempalace" / "hook_state"

STOP_BLOCK_REASON = (
    "AUTO-SAVE checkpoint. Save key topics, decisions, quotes, and code "
    "from this session to your memory system. Organize into appropriate "
    "categories. Use verbatim quotes where possible. Continue conversation "
    "after saving."
)

PRECOMPACT_BLOCK_REASON = (
    "COMPACTION IMMINENT. Save ALL topics, decisions, quotes, code, and "
    "important context from this session to your memory system. Be thorough "
    "\u2014 after compaction, detailed context will be lost. Organize into "
    "appropriate categories. Use verbatim quotes where possible. Save "
    "everything, then allow compaction to proceed."
)


def _sanitize_session_id(session_id: str) -> str:
    """Only allow alnum, dash, underscore to prevent path traversal."""
    sanitized = re.sub(r"[^a-zA-Z0-9_-]", "", session_id)
    return sanitized or "unknown"


def _count_human_messages(transcript_path: str) -> int:
    """Count human messages in a JSONL transcript, skipping command-messages."""
    path = Path(transcript_path).expanduser()
    if not path.is_file():
        return 0
    count = 0
    try:
        with open(path, encoding="utf-8", errors="replace") as f:
            for line in f:
                try:
                    entry = json.loads(line)
                    msg = entry.get("message", {})
                    if isinstance(msg, dict) and msg.get("role") == "user":
                        content = msg.get("content", "")
                        if isinstance(content, str):
                            if "<command-message>" in content:
                                continue
                        elif isinstance(content, list):
                            text = " ".join(
                                b.get("text", "") for b in content if isinstance(b, dict)
                            )
                            if "<command-message>" in text:
                                continue
                        count += 1
                    # Also handle Codex CLI transcript format
                    # {"type": "event_msg", "payload": {"type": "user_message", "message": "..."}}
                    elif entry.get("type") == "event_msg":
                        payload = entry.get("payload", {})
                        if isinstance(payload, dict) and payload.get("type") == "user_message":
                            msg_text = payload.get("message", "")
                            if isinstance(msg_text, str) and "<command-message>" not in msg_text:
                                count += 1
                except (json.JSONDecodeError, AttributeError):
                    pass
    except OSError:
        return 0
    return count


def _log(message: str):
    """Append to hook state log file."""
    try:
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        log_path = STATE_DIR / "hook.log"
        timestamp = datetime.now().strftime("%H:%M:%S")
        with open(log_path, "a") as f:
            f.write(f"[{timestamp}] {message}\n")
    except OSError:
        pass


def _output(data: dict):
    """Print JSON to stdout with consistent formatting (pretty-printed)."""
    print(json.dumps(data, indent=2, ensure_ascii=False))


def _maybe_auto_ingest():
    """If MEMPAL_DIR is set and exists, run mempalace mine in background."""
    mempal_dir = os.environ.get("MEMPAL_DIR", "")
    if mempal_dir and os.path.isdir(mempal_dir):
        try:
            log_path = STATE_DIR / "hook.log"
            with open(log_path, "a") as log_f:
                subprocess.Popen(
                    [sys.executable, "-m", "mempalace", "mine", mempal_dir],
                    stdout=log_f,
                    stderr=log_f,
                )
        except OSError:
            pass


SUPPORTED_HARNESSES = {"claude-code", "codex"}


def _parse_harness_input(data: dict, harness: str) -> dict:
    """Parse stdin JSON according to the harness type."""
    if harness not in SUPPORTED_HARNESSES:
        print(f"Unknown harness: {harness}", file=sys.stderr)
        sys.exit(1)
    return {
        "session_id": _sanitize_session_id(str(data.get("session_id", "unknown"))),
        "stop_hook_active": data.get("stop_hook_active", False),
        "transcript_path": str(data.get("transcript_path", "")),
    }


def hook_stop(data: dict, harness: str):
    """Stop hook: block every N messages for auto-save."""
    parsed = _parse_harness_input(data, harness)
    session_id = parsed["session_id"]
    stop_hook_active = parsed["stop_hook_active"]
    transcript_path = parsed["transcript_path"]

    # If already in a save cycle, let through (infinite-loop prevention)
    if str(stop_hook_active).lower() in ("true", "1", "yes"):
        _output({})
        return

    # Count human messages
    exchange_count = _count_human_messages(transcript_path)

    # Track last save point
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    last_save_file = STATE_DIR / f"{session_id}_last_save"
    last_save = 0
    if last_save_file.is_file():
        try:
            last_save = int(last_save_file.read_text().strip())
        except (ValueError, OSError):
            last_save = 0

    since_last = exchange_count - last_save

    _log(f"Session {session_id}: {exchange_count} exchanges, {since_last} since last save")

    if since_last >= SAVE_INTERVAL and exchange_count > 0:
        # Update last save point
        try:
            last_save_file.write_text(str(exchange_count), encoding="utf-8")
        except OSError:
            pass

        _log(f"TRIGGERING SAVE at exchange {exchange_count}")

        # Optional: auto-ingest if MEMPAL_DIR is set
        _maybe_auto_ingest()

        _output({"decision": "block", "reason": STOP_BLOCK_REASON})
    else:
        _output({})


def hook_session_start(data: dict, harness: str):
    """Session start hook: initialize session tracking state."""
    parsed = _parse_harness_input(data, harness)
    session_id = parsed["session_id"]

    _log(f"SESSION START for session {session_id}")

    # Initialize session state directory
    STATE_DIR.mkdir(parents=True, exist_ok=True)

    # Pass through — no blocking on session start
    _output({})


def hook_precompact(data: dict, harness: str):
    """Precompact hook: always block with comprehensive save instruction."""
    parsed = _parse_harness_input(data, harness)
    session_id = parsed["session_id"]

    _log(f"PRE-COMPACT triggered for session {session_id}")

    # Optional: auto-ingest synchronously before compaction (so memories land first)
    mempal_dir = os.environ.get("MEMPAL_DIR", "")
    if mempal_dir and os.path.isdir(mempal_dir):
        try:
            log_path = STATE_DIR / "hook.log"
            with open(log_path, "a") as log_f:
                subprocess.run(
                    [sys.executable, "-m", "mempalace", "mine", mempal_dir],
                    stdout=log_f,
                    stderr=log_f,
                    timeout=60,
                )
        except OSError:
            pass

    # Always block -- compaction = save everything
    _output({"decision": "block", "reason": PRECOMPACT_BLOCK_REASON})


def run_hook(hook_name: str, harness: str):
    """Main entry point: read stdin JSON, dispatch to hook handler."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        _log("WARNING: Failed to parse stdin JSON, proceeding with empty data")
        data = {}

    hooks = {
        "session-start": hook_session_start,
        "stop": hook_stop,
        "precompact": hook_precompact,
    }

    handler = hooks.get(hook_name)
    if handler is None:
        print(f"Unknown hook: {hook_name}", file=sys.stderr)
        sys.exit(1)

    handler(data, harness)

exec
/bin/zsh -lc "printf 'knowledge_graph tail\\n'; sed -n '260,420p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py && printf '\\n---\\nminer core\\n' && sed -n '260,520p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py && printf '\\n---\\nconvo tail\\n' && sed -n '260,420p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
knowledge_graph tail
            JOIN entities o ON t.object = o.id
            WHERE t.predicate = ?
        """
        params = [pred]
        if as_of:
            query += " AND (t.valid_from IS NULL OR t.valid_from <= ?) AND (t.valid_to IS NULL OR t.valid_to >= ?)"
            params.extend([as_of, as_of])

        results = []
        for row in conn.execute(query, params).fetchall():
            results.append(
                {
                    "subject": row["sub_name"],
                    "predicate": pred,
                    "object": row["obj_name"],
                    "valid_from": row["valid_from"],
                    "valid_to": row["valid_to"],
                    "current": row["valid_to"] is None,
                }
            )
        return results

    def timeline(self, entity_name: str = None):
        """Get all facts in chronological order, optionally filtered by entity."""
        conn = self._conn()
        if entity_name:
            eid = self._entity_id(entity_name)
            rows = conn.execute(
                """
                SELECT t.*, s.name as sub_name, o.name as obj_name
                FROM triples t
                JOIN entities s ON t.subject = s.id
                JOIN entities o ON t.object = o.id
                WHERE (t.subject = ? OR t.object = ?)
                ORDER BY t.valid_from ASC NULLS LAST
                LIMIT 100
            """,
                (eid, eid),
            ).fetchall()
        else:
            rows = conn.execute("""
                SELECT t.*, s.name as sub_name, o.name as obj_name
                FROM triples t
                JOIN entities s ON t.subject = s.id
                JOIN entities o ON t.object = o.id
                ORDER BY t.valid_from ASC NULLS LAST
                LIMIT 100
            """).fetchall()

        return [
            {
                "subject": r["sub_name"],
                "predicate": r["predicate"],
                "object": r["obj_name"],
                "valid_from": r["valid_from"],
                "valid_to": r["valid_to"],
                "current": r["valid_to"] is None,
            }
            for r in rows
        ]

    # ── Stats ─────────────────────────────────────────────────────────────

    def stats(self):
        conn = self._conn()
        entities = conn.execute("SELECT COUNT(*) as cnt FROM entities").fetchone()["cnt"]
        triples = conn.execute("SELECT COUNT(*) as cnt FROM triples").fetchone()["cnt"]
        current = conn.execute(
            "SELECT COUNT(*) as cnt FROM triples WHERE valid_to IS NULL"
        ).fetchone()["cnt"]
        expired = triples - current
        predicates = [
            r["predicate"]
            for r in conn.execute(
                "SELECT DISTINCT predicate FROM triples ORDER BY predicate"
            ).fetchall()
        ]
        return {
            "entities": entities,
            "triples": triples,
            "current_facts": current,
            "expired_facts": expired,
            "relationship_types": predicates,
        }

    # ── Seed from known facts ─────────────────────────────────────────────

    def seed_from_entity_facts(self, entity_facts: dict):
        """
        Seed the knowledge graph from fact_checker.py ENTITY_FACTS.
        This bootstraps the graph with known ground truth.
        """
        for key, facts in entity_facts.items():
            name = facts.get("full_name", key.capitalize())
            etype = facts.get("type", "person")
            self.add_entity(
                name,
                etype,
                {
                    "gender": facts.get("gender", ""),
                    "birthday": facts.get("birthday", ""),
                },
            )

            # Relationships
            parent = facts.get("parent")
            if parent:
                self.add_triple(
                    name, "child_of", parent.capitalize(), valid_from=facts.get("birthday")
                )

            partner = facts.get("partner")
            if partner:
                self.add_triple(name, "married_to", partner.capitalize())

            relationship = facts.get("relationship", "")
            if relationship == "daughter":
                self.add_triple(
                    name,
                    "is_child_of",
                    facts.get("parent", "").capitalize() or name,
                    valid_from=facts.get("birthday"),
                )
            elif relationship == "husband":
                self.add_triple(name, "is_partner_of", facts.get("partner", name).capitalize())
            elif relationship == "brother":
                self.add_triple(name, "is_sibling_of", facts.get("sibling", name).capitalize())
            elif relationship == "dog":
                self.add_triple(name, "is_pet_of", facts.get("owner", name).capitalize())
                self.add_entity(name, "animal")

            # Interests
            for interest in facts.get("interests", []):
                self.add_triple(name, "loves", interest.capitalize(), valid_from="2025-01-01")

---
miner core
    if not config_path.exists():
        # Fallback to legacy name
        legacy_path = Path(project_dir).expanduser().resolve() / "mempal.yaml"
        if legacy_path.exists():
            config_path = legacy_path
        else:
            print(f"ERROR: No mempalace.yaml found in {project_dir}")
            print(f"Run: mempalace init {project_dir}")
            sys.exit(1)
    with open(config_path) as f:
        return yaml.safe_load(f)


# =============================================================================
# FILE ROUTING — which room does this file belong to?
# =============================================================================


def detect_room(filepath: Path, content: str, rooms: list, project_path: Path) -> str:
    """
    Route a file to the right room.
    Priority:
    1. Folder path matches a room name
    2. Filename matches a room name or keyword
    3. Content keyword scoring
    4. Fallback: "general"
    """
    relative = str(filepath.relative_to(project_path)).lower()
    filename = filepath.stem.lower()
    content_lower = content[:2000].lower()

    # Priority 1: folder path matches room name or keywords
    path_parts = relative.replace("\\", "/").split("/")
    for part in path_parts[:-1]:  # skip filename itself
        for room in rooms:
            candidates = [room["name"].lower()] + [k.lower() for k in room.get("keywords", [])]
            if any(part == c or c in part or part in c for c in candidates):
                return room["name"]

    # Priority 2: filename matches room name
    for room in rooms:
        if room["name"].lower() in filename or filename in room["name"].lower():
            return room["name"]

    # Priority 3: keyword scoring from room keywords + name
    scores = defaultdict(int)
    for room in rooms:
        keywords = room.get("keywords", []) + [room["name"]]
        for kw in keywords:
            count = content_lower.count(kw.lower())
            scores[room["name"]] += count

    if scores:
        best = max(scores, key=scores.get)
        if scores[best] > 0:
            return best

    return "general"


# =============================================================================
# CHUNKING
# =============================================================================


def chunk_text(content: str, source_file: str) -> list:
    """
    Split content into drawer-sized chunks.
    Tries to split on paragraph/line boundaries.
    Returns list of {"content": str, "chunk_index": int}
    """
    # Clean up
    content = content.strip()
    if not content:
        return []

    chunks = []
    start = 0
    chunk_index = 0

    while start < len(content):
        end = min(start + CHUNK_SIZE, len(content))

        # Try to break at paragraph boundary
        if end < len(content):
            newline_pos = content.rfind("\n\n", start, end)
            if newline_pos > start + CHUNK_SIZE // 2:
                end = newline_pos
            else:
                newline_pos = content.rfind("\n", start, end)
                if newline_pos > start + CHUNK_SIZE // 2:
                    end = newline_pos

        chunk = content[start:end].strip()
        if len(chunk) >= MIN_CHUNK_SIZE:
            chunks.append(
                {
                    "content": chunk,
                    "chunk_index": chunk_index,
                }
            )
            chunk_index += 1

        start = end - CHUNK_OVERLAP if end < len(content) else end

    return chunks


# =============================================================================
# PALACE — ChromaDB operations
# =============================================================================


def add_drawer(
    collection, wing: str, room: str, content: str, source_file: str, chunk_index: int, agent: str
):
    """Add one drawer to the palace."""
    drawer_id = f"drawer_{wing}_{room}_{hashlib.sha256((source_file + str(chunk_index)).encode()).hexdigest()[:24]}"
    try:
        metadata = {
            "wing": wing,
            "room": room,
            "source_file": source_file,
            "chunk_index": chunk_index,
            "added_by": agent,
            "filed_at": datetime.now().isoformat(),
        }
        # Store file mtime so we can detect modifications later.
        try:
            metadata["source_mtime"] = os.path.getmtime(source_file)
        except OSError:
            pass
        collection.upsert(
            documents=[content],
            ids=[drawer_id],
            metadatas=[metadata],
        )
        return True
    except Exception:
        raise


# =============================================================================
# PROCESS ONE FILE
# =============================================================================


def process_file(
    filepath: Path,
    project_path: Path,
    collection,
    wing: str,
    rooms: list,
    agent: str,
    dry_run: bool,
) -> tuple:
    """Read, chunk, route, and file one file. Returns (drawer_count, room_name)."""

    # Skip if already filed
    source_file = str(filepath)
    if not dry_run and file_already_mined(collection, source_file, check_mtime=True):
        return 0, None

    try:
        content = filepath.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return 0, None

    content = content.strip()
    if len(content) < MIN_CHUNK_SIZE:
        return 0, None

    room = detect_room(filepath, content, rooms, project_path)
    chunks = chunk_text(content, source_file)

    if dry_run:
        print(f"    [DRY RUN] {filepath.name} → room:{room} ({len(chunks)} drawers)")
        return len(chunks), room

    # Purge stale drawers for this file before re-inserting the fresh chunks.
    # Converts modified-file re-mines from upsert-over-existing-IDs (which hits
    # hnswlib's thread-unsafe updatePoint path and can segfault on macOS ARM
    # with chromadb 0.6.3) into a clean delete+insert, bypassing the update
    # path entirely.
    try:
        collection.delete(where={"source_file": source_file})
    except Exception:
        pass

    drawers_added = 0
    for chunk in chunks:
        added = add_drawer(
            collection=collection,
            wing=wing,
            room=room,
            content=chunk["content"],
            source_file=source_file,
            chunk_index=chunk["chunk_index"],
            agent=agent,
        )
        if added:
            drawers_added += 1

    return drawers_added, room


# =============================================================================
# SCAN PROJECT
# =============================================================================


def scan_project(
    project_dir: str,
    respect_gitignore: bool = True,
    include_ignored: list = None,
) -> list:
    """Return list of all readable file paths."""
    project_path = Path(project_dir).expanduser().resolve()
    files = []
    active_matchers = []
    matcher_cache = {}
    include_paths = normalize_include_paths(include_ignored)

    for root, dirs, filenames in os.walk(project_path):
        root_path = Path(root)

        if respect_gitignore:
            active_matchers = [
                matcher
                for matcher in active_matchers
                if root_path == matcher.base_dir or matcher.base_dir in root_path.parents
            ]
            current_matcher = load_gitignore_matcher(root_path, matcher_cache)
            if current_matcher is not None:
                active_matchers.append(current_matcher)

        dirs[:] = [
            d
            for d in dirs
            if is_force_included(root_path / d, project_path, include_paths)
            or not should_skip_dir(d)
        ]
        if respect_gitignore and active_matchers:
            dirs[:] = [
                d
                for d in dirs
                if is_force_included(root_path / d, project_path, include_paths)
                or not is_gitignored(root_path / d, active_matchers, is_dir=True)
            ]

        for filename in filenames:
            filepath = root_path / filename
            force_include = is_force_included(filepath, project_path, include_paths)
            exact_force_include = is_exact_force_include(filepath, project_path, include_paths)

            if not force_include and filename in SKIP_FILENAMES:
                continue
            if filepath.suffix.lower() not in READABLE_EXTENSIONS and not exact_force_include:
                continue
            if respect_gitignore and active_matchers and not force_include:
                if is_gitignored(filepath, active_matchers, is_dir=False):

---
convo tail
    print(f"  Source:  {convo_path}")
    print(f"  Files:   {len(files)}")
    print(f"  Palace:  {palace_path}")
    if dry_run:
        print("  DRY RUN — nothing will be filed")
    print(f"{'-' * 55}\n")

    collection = get_collection(palace_path) if not dry_run else None

    total_drawers = 0
    files_skipped = 0
    room_counts = defaultdict(int)

    for i, filepath in enumerate(files, 1):
        source_file = str(filepath)

        # Skip if already filed
        if not dry_run and file_already_mined(collection, source_file):
            files_skipped += 1
            continue

        # Normalize format
        try:
            content = normalize(str(filepath))
        except (OSError, ValueError):
            continue

        if not content or len(content.strip()) < MIN_CHUNK_SIZE:
            continue

        # Chunk — either exchange pairs or general extraction
        if extract_mode == "general":
            from .general_extractor import extract_memories

            chunks = extract_memories(content)
            # Each chunk already has memory_type; use it as the room name
        else:
            chunks = chunk_exchanges(content)

        if not chunks:
            continue

        # Detect room from content (general mode uses memory_type instead)
        if extract_mode != "general":
            room = detect_convo_room(content)
        else:
            room = None  # set per-chunk below

        if dry_run:
            if extract_mode == "general":
                from collections import Counter

                type_counts = Counter(c.get("memory_type", "general") for c in chunks)
                types_str = ", ".join(f"{t}:{n}" for t, n in type_counts.most_common())
                print(f"    [DRY RUN] {filepath.name} → {len(chunks)} memories ({types_str})")
            else:
                print(f"    [DRY RUN] {filepath.name} → room:{room} ({len(chunks)} drawers)")
            total_drawers += len(chunks)
            # Track room counts
            if extract_mode == "general":
                for c in chunks:
                    room_counts[c.get("memory_type", "general")] += 1
            else:
                room_counts[room] += 1
            continue

        if extract_mode != "general":
            room_counts[room] += 1

        # File each chunk
        drawers_added = 0
        for chunk in chunks:
            chunk_room = chunk.get("memory_type", room) if extract_mode == "general" else room
            if extract_mode == "general":
                room_counts[chunk_room] += 1
            drawer_id = f"drawer_{wing}_{chunk_room}_{hashlib.sha256((source_file + str(chunk['chunk_index'])).encode()).hexdigest()[:24]}"
            try:
                collection.upsert(
                    documents=[chunk["content"]],
                    ids=[drawer_id],
                    metadatas=[
                        {
                            "wing": wing,
                            "room": chunk_room,
                            "source_file": source_file,
                            "chunk_index": chunk["chunk_index"],
                            "added_by": agent,
                            "filed_at": datetime.now().isoformat(),
                            "ingest_mode": "convos",
                            "extract_mode": extract_mode,
                        }
                    ],
                )
                drawers_added += 1
            except Exception as e:
                if "already exists" not in str(e).lower():
                    raise

        total_drawers += drawers_added
        print(f"  ✓ [{i:4}/{len(files)}] {filepath.name[:50]:50} +{drawers_added}")

    print(f"\n{'=' * 55}")
    print("  Done.")
    print(f"  Files processed: {len(files) - files_skipped}")
    print(f"  Files skipped (already filed): {files_skipped}")
    print(f"  Drawers filed: {total_drawers}")
    if room_counts:
        print("\n  By room:")
        for room, count in sorted(room_counts.items(), key=lambda x: x[1], reverse=True):
            print(f"    {room:20} {count} files")
    print('\n  Next: mempalace search "what you\'re looking for"')
    print(f"{'=' * 55}\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convo_miner.py <convo_dir> [--palace PATH] [--limit N] [--dry-run]")
        sys.exit(1)
    from .config import MempalaceConfig

    mine_convos(sys.argv[1], palace_path=MempalaceConfig().palace_path)

exec
/bin/zsh -lc "printf 'hooks docs + scripts\\n'; sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md && printf '\\n---\\nsave hook\\n' && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh && printf '\\n---\\nprecompact hook\\n' && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh && printf '\\n---\\nbenchmarks\\n' && sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
hooks docs + scripts
# MemPalace Hooks — Auto-Save for Terminal AI Tools

These hook scripts make MemPalace save automatically. No manual "save" commands needed.

## What They Do

| Hook | When It Fires | What Happens |
|------|--------------|-------------|
| **Save Hook** | Every 15 human messages | Blocks the AI, tells it to save key topics/decisions/quotes to the palace |
| **PreCompact Hook** | Right before context compaction | Emergency save — forces the AI to save EVERYTHING before losing context |

The AI does the actual filing — it knows the conversation context, so it classifies memories into the right wings/halls/closets. The hooks just tell it WHEN to save.

## Install — Claude Code

Add to `.claude/settings.local.json`:

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "/absolute/path/to/hooks/mempal_save_hook.sh",
        "timeout": 30
      }]
    }],
    "PreCompact": [{
      "hooks": [{
        "type": "command",
        "command": "/absolute/path/to/hooks/mempal_precompact_hook.sh",
        "timeout": 30
      }]
    }]
  }
}
```

Make them executable:
```bash
chmod +x hooks/mempal_save_hook.sh hooks/mempal_precompact_hook.sh
```

## Install — Codex CLI (OpenAI)

Add to `.codex/hooks.json`:

```json
{
  "Stop": [{
    "type": "command",
    "command": "/absolute/path/to/hooks/mempal_save_hook.sh",
    "timeout": 30
  }],
  "PreCompact": [{
    "type": "command",
    "command": "/absolute/path/to/hooks/mempal_precompact_hook.sh",
    "timeout": 30
  }]
}
```

## Configuration

Edit `mempal_save_hook.sh` to change:

- **`SAVE_INTERVAL=15`** — How many human messages between saves. Lower = more frequent saves, higher = less interruption.
- **`STATE_DIR`** — Where hook state is stored (defaults to `~/.mempalace/hook_state/`)
- **`MEMPAL_DIR`** — Optional. Set to a conversations directory to auto-run `mempalace mine <dir>` on each save trigger. Leave blank (default) to let the AI handle saving via the block reason message.

### mempalace CLI

The relevant commands are:

```bash
mempalace mine <dir>               # Mine all files in a directory
mempalace mine <dir> --mode convos # Mine conversation transcripts only
```

The hooks resolve the repo root automatically from their own path, so they work regardless of where you install the repo.

## How It Works (Technical)

### Save Hook (Stop event)

```
User sends message → AI responds → Claude Code fires Stop hook
                                            ↓
                                    Hook counts human messages in JSONL transcript
                                            ↓
                              ┌─── < 15 since last save ──→ echo "{}" (let AI stop)
                              │
                              └─── ≥ 15 since last save ──→ {"decision": "block", "reason": "save..."}
                                                                    ↓
                                                            AI saves to palace
                                                                    ↓
                                                            AI tries to stop again
                                                                    ↓
                                                            stop_hook_active = true
                                                                    ↓
                                                            Hook sees flag → echo "{}" (let it through)
```

The `stop_hook_active` flag prevents infinite loops: block once → AI saves → tries to stop → flag is true → we let it through.

### PreCompact Hook

```
Context window getting full → Claude Code fires PreCompact
                                        ↓
                                Hook ALWAYS blocks
                                        ↓
                                AI saves everything
                                        ↓
                                Compaction proceeds
```

No counting needed — compaction always warrants a save.

## Debugging

Check the hook log:
```bash
cat ~/.mempalace/hook_state/hook.log
```

Example output:
```
[14:30:15] Session abc123: 12 exchanges, 12 since last save
[14:35:22] Session abc123: 15 exchanges, 15 since last save
[14:35:22] TRIGGERING SAVE at exchange 15
[14:40:01] Session abc123: 18 exchanges, 3 since last save
```

## Cost

**Zero extra tokens.** The hooks are bash scripts that run locally. They don't call any API. The only "cost" is the AI spending a few seconds organizing memories at each checkpoint — and it's doing that with context it already has loaded.

---
save hook
#!/bin/bash
# MEMPALACE SAVE HOOK — Auto-save every N exchanges
#
# Claude Code "Stop" hook. After every assistant response:
# 1. Counts human messages in the session transcript
# 2. Every SAVE_INTERVAL messages, BLOCKS the AI from stopping
# 3. Returns a reason telling the AI to save structured diary + palace entries
# 4. AI does the save (topics, decisions, code, quotes → organized into palace)
# 5. Next Stop fires with stop_hook_active=true → lets AI stop normally
#
# The AI does the classification — it knows what wing/hall/closet to use
# because it has context about the conversation. No regex needed.
#
# === INSTALL ===
# Add to .claude/settings.local.json:
#
#   "hooks": {
#     "Stop": [{
#       "matcher": "*",
#       "hooks": [{
#         "type": "command",
#         "command": "/absolute/path/to/mempal_save_hook.sh",
#         "timeout": 30
#       }]
#     }]
#   }
#
# For Codex CLI, add to .codex/hooks.json:
#
#   "Stop": [{
#     "type": "command",
#     "command": "/absolute/path/to/mempal_save_hook.sh",
#     "timeout": 30
#   }]
#
# === HOW IT WORKS ===
#
# Claude Code sends JSON on stdin with these fields:
#   session_id       — unique session identifier
#   stop_hook_active — true if AI is already in a save cycle (prevents infinite loop)
#   transcript_path  — path to the JSONL transcript file
#
# When we block, Claude Code shows our "reason" to the AI as a system message.
# The AI then saves to memory, and when it tries to stop again,
# stop_hook_active=true so we let it through. No infinite loop.
#
# === MEMPALACE CLI ===
# This repo uses: mempalace mine <dir>
# or:            mempalace mine <dir> --mode convos
# Set MEMPAL_DIR below if you want the hook to auto-ingest after blocking.
# Leave blank to rely on the AI's own save instructions.
#
# === CONFIGURATION ===

SAVE_INTERVAL=15  # Save every N human messages (adjust to taste)
STATE_DIR="$HOME/.mempalace/hook_state"
mkdir -p "$STATE_DIR"

# Optional: set to the directory you want auto-ingested on each save trigger.
# Example: MEMPAL_DIR="$HOME/conversations"
# Leave empty to skip auto-ingest (AI handles saving via the block reason).
MEMPAL_DIR=""

# Read JSON input from stdin
INPUT=$(cat)

# Parse all fields in a single Python call (3x faster than separate invocations)
eval $(echo "$INPUT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
sid = data.get('session_id', 'unknown')
sha = data.get('stop_hook_active', False)
tp = data.get('transcript_path', '')
# Shell-safe output — only allow alphanumeric, underscore, hyphen, slash, dot, tilde
import re
safe = lambda s: re.sub(r'[^a-zA-Z0-9_/.\-~]', '', str(s))
print(f'SESSION_ID=\"{safe(sid)}\"')
print(f'STOP_HOOK_ACTIVE=\"{sha}\"')
print(f'TRANSCRIPT_PATH=\"{safe(tp)}\"')
" 2>/dev/null)

# Expand ~ in path
TRANSCRIPT_PATH="${TRANSCRIPT_PATH/#\~/$HOME}"

# If we're already in a save cycle, let the AI stop normally
# This is the infinite-loop prevention: block once → AI saves → tries to stop again → we let it through
if [ "$STOP_HOOK_ACTIVE" = "True" ] || [ "$STOP_HOOK_ACTIVE" = "true" ]; then
    echo "{}"
    exit 0
fi

# Count human messages in the JSONL transcript
# SECURITY: Pass transcript path as sys.argv to avoid shell injection via crafted paths
if [ -f "$TRANSCRIPT_PATH" ]; then
    EXCHANGE_COUNT=$(python3 - "$TRANSCRIPT_PATH" <<'PYEOF'
import json, sys
count = 0
with open(sys.argv[1]) as f:
    for line in f:
        try:
            entry = json.loads(line)
            msg = entry.get('message', {})
            if isinstance(msg, dict) and msg.get('role') == 'user':
                content = msg.get('content', '')
                if isinstance(content, str) and '<command-message>' in content:
                    continue
                count += 1
        except:
            pass
print(count)
PYEOF
2>/dev/null)
else
    EXCHANGE_COUNT=0
fi

# Track last save point for this session
LAST_SAVE_FILE="$STATE_DIR/${SESSION_ID}_last_save"
LAST_SAVE=0
if [ -f "$LAST_SAVE_FILE" ]; then
    LAST_SAVE=$(cat "$LAST_SAVE_FILE")
fi

SINCE_LAST=$((EXCHANGE_COUNT - LAST_SAVE))

# Log for debugging (check ~/.mempalace/hook_state/hook.log)
echo "[$(date '+%H:%M:%S')] Session $SESSION_ID: $EXCHANGE_COUNT exchanges, $SINCE_LAST since last save" >> "$STATE_DIR/hook.log"

# Time to save?
if [ "$SINCE_LAST" -ge "$SAVE_INTERVAL" ] && [ "$EXCHANGE_COUNT" -gt 0 ]; then
    # Update last save point
    echo "$EXCHANGE_COUNT" > "$LAST_SAVE_FILE"

    echo "[$(date '+%H:%M:%S')] TRIGGERING SAVE at exchange $EXCHANGE_COUNT" >> "$STATE_DIR/hook.log"

    # Optional: run mempalace ingest in background if MEMPAL_DIR is set
    if [ -n "$MEMPAL_DIR" ] && [ -d "$MEMPAL_DIR" ]; then
        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        REPO_DIR="$(dirname "$SCRIPT_DIR")"
        python3 -m mempalace mine "$MEMPAL_DIR" >> "$STATE_DIR/hook.log" 2>&1 &
    fi

    # Block the AI and tell it to save
    # The "reason" becomes a system message the AI sees and acts on
    cat << 'HOOKJSON'
{
  "decision": "block",
  "reason": "AUTO-SAVE checkpoint. Save key topics, decisions, quotes, and code from this session to your memory system. Organize into appropriate categories. Use verbatim quotes where possible. Continue conversation after saving."
}
HOOKJSON
else
    # Not time yet — let the AI stop normally
    echo "{}"
fi

---
precompact hook
#!/bin/bash
# MEMPALACE PRE-COMPACT HOOK — Emergency save before compaction
#
# Claude Code "PreCompact" hook. Fires RIGHT BEFORE the conversation
# gets compressed to free up context window space.
#
# This is the safety net. When compaction happens, the AI loses detailed
# context about what was discussed. This hook forces one final save of
# EVERYTHING before that happens.
#
# Unlike the save hook (which triggers every N exchanges), this ALWAYS
# blocks — because compaction is always worth saving before.
#
# === INSTALL ===
# Add to .claude/settings.local.json:
#
#   "hooks": {
#     "PreCompact": [{
#       "hooks": [{
#         "type": "command",
#         "command": "/absolute/path/to/mempal_precompact_hook.sh",
#         "timeout": 30
#       }]
#     }]
#   }
#
# For Codex CLI, add to .codex/hooks.json:
#
#   "PreCompact": [{
#     "type": "command",
#     "command": "/absolute/path/to/mempal_precompact_hook.sh",
#     "timeout": 30
#   }]
#
# === HOW IT WORKS ===
#
# Claude Code sends JSON on stdin with:
#   session_id — unique session identifier
#
# We always return decision: "block" with a reason telling the AI
# to save everything. After the AI saves, compaction proceeds normally.
#
# === MEMPALACE CLI ===
# This repo uses: mempalace mine <dir>
# or:            mempalace mine <dir> --mode convos
# Set MEMPAL_DIR below if you want the hook to auto-ingest before compaction.
# Leave blank to rely on the AI's own save instructions.

STATE_DIR="$HOME/.mempalace/hook_state"
mkdir -p "$STATE_DIR"

# Optional: set to the directory you want auto-ingested before compaction.
# Example: MEMPAL_DIR="$HOME/conversations"
# Leave empty to skip auto-ingest (AI handles saving via the block reason).
MEMPAL_DIR=""

# Read JSON input from stdin
INPUT=$(cat)

SESSION_ID=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('session_id','unknown'))" 2>/dev/null)

echo "[$(date '+%H:%M:%S')] PRE-COMPACT triggered for session $SESSION_ID" >> "$STATE_DIR/hook.log"

# Optional: run mempalace ingest synchronously so memories land before compaction
if [ -n "$MEMPAL_DIR" ] && [ -d "$MEMPAL_DIR" ]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    REPO_DIR="$(dirname "$SCRIPT_DIR")"
    python3 -m mempalace mine "$MEMPAL_DIR" >> "$STATE_DIR/hook.log" 2>&1
fi

# Always block — compaction = save everything
cat << 'HOOKJSON'
{
  "decision": "block",
  "reason": "COMPACTION IMMINENT. Save ALL topics, decisions, quotes, code, and important context from this session to your memory system. Be thorough — after compaction, detailed context will be lost. Organize into appropriate categories. Use verbatim quotes where possible. Save everything, then allow compaction to proceed."
}
HOOKJSON

---
benchmarks
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

exec
/bin/zsh -lc "printf 'external docs tree\\n'; find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/docs -maxdepth 2 -type f | sort && printf '\\n---\\nREADME refs in docs/examples\\n' && rg -n \"architecture|wake-up|AAAK|knowledge graph|hooks|palace|drawer|closet|room|wing\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/docs .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
external docs tree
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/docs/schema.sql

---
README refs in docs/examples
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/docs/schema.sql:2:-- SQLite database at ~/.mempalace/knowledge_graph.db
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/docs/schema.sql:19:    source_closet TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/HOOKS_TUTORIAL.md:3:MemPalace hooks act as an "Auto-Save" feature. They help your AI keep a permanent memory without you needing to run manual commands.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/HOOKS_TUTORIAL.md:5:### 1. What are these hooks?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/HOOKS_TUTORIAL.md:14:  "hooks": {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/HOOKS_TUTORIAL.md:18:        "hooks": [{"type": "command", "command": "./hooks/mempal_save_hook.sh"}]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/HOOKS_TUTORIAL.md:24:        "hooks": [{"type": "command", "command": "./hooks/mempal_precompact_hook.sh"}]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/mcp_setup.md:8:python -m mempalace.mcp_server
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/mcp_setup.md:14:claude mcp add mempalace -- python -m mempalace.mcp_server
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/mcp_setup.md:21:- **mempalace_status** — palace stats (wings, rooms, drawer counts)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/mcp_setup.md:22:- **mempalace_search** — semantic search across all memories
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/mcp_setup.md:23:- **mempalace_list_wings** — list all projects in the palace
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/convo_import.py:5:print("  mempalace mine ~/claude-sessions/ --mode convos --wing my_project")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/convo_import.py:8:print("  mempalace mine ~/chatgpt-exports/ --mode convos")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/convo_import.py:11:print("  mempalace mine ~/chats/ --mode convos --extract general")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/basic_mining.py:2:"""Example: mine a project folder into the palace."""
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/basic_mining.py:7:print("Step 1: Initialize rooms from folder structure")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/basic_mining.py:8:print(f"  mempalace init {project_dir}")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/basic_mining.py:10:print(f"  mempalace mine {project_dir}")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/basic_mining.py:12:print("  mempalace search 'why did we choose this approach'")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:16:git clone https://github.com/milla-jovovich/mempalace.git
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:17:cd mempalace
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:31:# Initialize the palace in the current directory
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:32:.venv/bin/python3 -m mempalace init .
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:36:You can manually define who you are and what projects you work on by creating/editing these files in `~/.mempalace/`:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:38:- **`~/.mempalace/identity.txt`**: A plain text file describing your role and focus.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:39:- **`~/.mempalace/wing_config.json`**: A JSON file mapping projects and name variants to "Wings".
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:46:gemini mcp add mempalace /absolute/path/to/mempalace/.venv/bin/python3 -m mempalace.mcp_server --scope user
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:54:Edit your `~/.gemini/settings.json` and add the following:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:58:  "hooks": {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:62:        "hooks": [
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:65:            "command": "/absolute/path/to/mempalace/hooks/mempal_precompact_hook.sh"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:76:chmod +x hooks/*.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:83:- Use `mempalace_search` to find relevant past discussions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:89:.venv/bin/python3 -m mempalace mine /path/to/your/project
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:94:- `/mcp list`: Verify `mempalace` is `CONNECTED`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples/gemini_cli_setup.md:95:- `/hooks panel`: Verify the `PreCompress` hook is active.

codex
I’ve finished the external core pass and I’m switching to the comparison pass now: `memory_search`, `context-server`, `generate-context.js`, and the compact-code-graph plugin. That will let me separate “MemPalace is novel” from “Public already solves this, just with different ergonomics.”
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts && printf '\\n---\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts && printf '\\n---\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js && printf '\\n---\\n' && sed -n '1,260p' .opencode/plugins/spec-kit-compact-code-graph.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Search
// ───────────────────────────────────────────────────────────────
/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES
──────────────────────────────────────────────────────────────── */

import * as toolCache from '../lib/cache/tool-cache.js';
import * as sessionManager from '../lib/session/session-manager.js';
import * as intentClassifier from '../lib/search/intent-classifier.js';
// TierClassifier, crossEncoder imports removed — only used by legacy V1 pipeline.
import { isSessionBoostEnabled, isCausalBoostEnabled, isCommunitySearchFallbackEnabled, isDualRetrievalEnabled, isIntentAutoProfileEnabled } from '../lib/search/search-flags.js';
import { searchCommunities } from '../lib/search/community-search.js';
// 4-stage pipeline architecture
import { executePipeline } from '../lib/search/pipeline/index.js';
import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline/index.js';
import type { IntentWeightsConfig } from '../lib/search/pipeline/types.js';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
// Artifact-class routing (spec/plan/tasks/checklist/memory)
import { getStrategyForQuery } from '../lib/search/artifact-routing.js';
// Chunk reassembly (extracted from this file)
import { collapseAndReassembleChunkResults } from '../lib/search/chunk-reassembly.js';
// Search utilities (extracted from this file)
import {
  filterByMinQualityScore,
  resolveQualityThreshold,
  buildCacheArgs,
  resolveRowContextType,
  resolveArtifactRoutingQuery,
  applyArtifactRouting,
} from '../lib/search/search-utils.js';
// CacheArgsInput used internally by buildCacheArgs (lib/search/search-utils.ts)
// Eval channel tracking (extracted from this file)
import {
  collectEvalChannelsFromRow,
  buildEvalChannelPayloads,
  summarizeGraphWalkDiagnostics,
} from '../lib/telemetry/eval-channel-tracking.js';
import type { EvalChannelPayload } from '../lib/telemetry/eval-channel-tracking.js';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
import {
  logFeedbackEvents,
  isImplicitFeedbackLogEnabled,
} from '../lib/feedback/feedback-ledger.js';
import type { FeedbackEvent } from '../lib/feedback/feedback-ledger.js';
import { trackQueryAndDetect, logResultCited } from '../lib/feedback/query-flow-tracker.js';

// Core utilities
import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core/index.js';
import { validateQuery, requireDb, toErrorMessage } from '../utils/index.js';

// Response envelope + formatters
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
import { formatSearchResults } from '../formatters/index.js';

// Shared handler types
import type { MCPResponse, IntentClassification } from './types.js';

// Retrieval trace contracts (C136-08)
import { createTrace } from '@spec-kit/shared/contracts/retrieval-trace';
import { buildAdaptiveShadowProposal } from '../lib/cognitive/adaptive-ranking.js';
import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
import {
  attachSessionTransitionTrace,
  type SessionTransitionTrace,
} from '../lib/search/session-transition.js';

// REQ-D5-003: Mode-Aware Response Shape
import {
  applyProfileToEnvelope,
  isResponseProfileEnabled,
} from '../lib/response/profile-formatters.js';
import {
  buildProgressiveResponse,
  extractSnippets,
  isProgressiveDisclosureEnabled,
  resolveCursor,
} from '../lib/search/progressive-disclosure.js';
import {
  getLastLexicalCapabilitySnapshot,
  resetLastLexicalCapabilitySnapshot,
} from '../lib/search/sqlite-fts.js';
import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
import { evaluatePublicationGate } from '../lib/context/publication-gate.js';
import {
  deduplicateResults as deduplicateWithSessionState,
  isSessionRetrievalStateEnabled,
  manager as retrievalSessionStateManager,
  refineForGoal,
} from '../lib/search/session-state.js';

// Type imports for casting
import type { IntentType, IntentWeights as IntentClassifierWeights } from '../lib/search/intent-classifier.js';
import type { RawSearchResult } from '../formatters/index.js';
// RoutingResult, WeightedResult — now used internally by lib/search/search-utils.ts

// Feature catalog: Semantic and lexical search (memory_search)
// Feature catalog: Hybrid search pipeline
// Feature catalog: 4-stage pipeline architecture
// Feature catalog: Quality-aware 3-tier search fallback


/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Internal search result row — enriched DB row used within this handler.
 * NOT the same as the canonical SearchResult in shared/types.ts.
 * Self-contained: uses local types instead of the deprecated MemoryRow/MemoryRecord shapes.
 * This can migrate to MemoryDbRow & Record<string, unknown> later without changing the handler contract.
 */
interface MemorySearchRow extends Record<string, unknown> {
  id: number;
  similarity?: number;
  importance_tier?: string;
  contextType?: string;
  context_type?: string;
  attentionScore?: number;
  retrievability?: number;
  stability?: number;
  last_review?: string | null;
  created_at?: string;
  last_accessed?: number;
  content?: string;
  memoryState?: string;
  file_path?: string;
  parent_id?: number | null;
  chunk_index?: number | null;
  chunk_label?: string | null;
  isChunk?: boolean;
  parentId?: number | null;
  chunkIndex?: number | null;
  chunkLabel?: string | null;
  chunkCount?: number | null;
  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
  precomputedContent?: string;
}

interface DedupResult {
  results: MemorySearchRow[];
  dedupStats: Record<string, unknown>;
}

interface SearchCachePayload {
  summary: string;
  data: Record<string, unknown>;
  hints: string[];
}

type SessionAwareResult = Record<string, unknown> & {
  id: number | string;
  score?: number;
  content?: string;
};

// ChunkReassemblyResult — now imported from lib/search/chunk-reassembly.ts

type IntentWeights = IntentClassifierWeights;

function toIntentWeightsConfig(weights: IntentWeights | null): IntentWeightsConfig | null {
  if (!weights) return null;
  return {
    similarity: weights.similarity,
    importance: weights.importance,
    recency: weights.recency,
  };
}

// EvalChannelPayload — now imported from lib/telemetry/eval-channel-tracking.ts

interface SearchArgs {
  cursor?: string;
  query?: string;
  concepts?: string[];
  specFolder?: string;
  folderBoost?: { folder: string; factor: number };
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
  tier?: string;
  contextType?: string;
  useDecay?: boolean;
  includeContiguity?: boolean;
  includeConstitutional?: boolean;
  includeContent?: boolean;
  anchors?: string[];
  bypassCache?: boolean;
  sessionId?: string;
  enableDedup?: boolean;
  intent?: string;
  autoDetectIntent?: boolean;
  minState?: string;
  applyStateLimits?: boolean;
  rerank?: boolean;
  applyLengthPenalty?: boolean;
  trackAccess?: boolean; // opt-in access tracking (default false)
  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
  enableSessionBoost?: boolean;
  enableCausalBoost?: boolean;
  minQualityScore?: number;
  min_quality_score?: number;
  mode?: string; // "deep" mode enables query expansion for multi-query RAG
  includeTrace?: boolean;
  sessionTransition?: SessionTransitionTrace;
  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
  profile?: string;
  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
  retrievalLevel?: 'local' | 'global' | 'auto';
}

// resolveRowContextType — now imported from lib/search/search-utils.ts
// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts

function attachTelemetryMeta(
  response: MCPResponse,
  telemetryPayload: Record<string, unknown>,
): MCPResponse {
  const firstEntry = response?.content?.[0];
  if (!firstEntry || typeof firstEntry.text !== 'string') {
    return response;
  }

  try {
    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
    const meta = envelope.meta && typeof envelope.meta === 'object'
      ? envelope.meta as Record<string, unknown>
      : {};
    envelope.meta = {
      ...meta,
      _telemetry: telemetryPayload,
    };

    return {
      ...response,
      content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
    };
  } catch (error: unknown) {
    const message = toErrorMessage(error);
    console.warn('[memory-search] Failed to attach telemetry payload:', message);
    return response;
  }
}

function extractResponseResults(response: MCPResponse): Array<Record<string, unknown>> {
  const firstEntry = response?.content?.[0];
  if (!firstEntry || typeof firstEntry.text !== 'string') {
    return [];
  }

  try {
    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
    const data = envelope.data && typeof envelope.data === 'object'
      ? envelope.data as Record<string, unknown>
      : null;

---
// ───────────────────────────────────────────────────────────────
// MODULE: Context Server
// ───────────────────────────────────────────────────────────────
// T303: Decomposed — tool schemas in tool-schemas.ts, dispatch
// Logic in tools/*.ts. This file retains server init, startup,
// Shutdown, and main orchestration only.
import fs from 'fs';
import path from 'path';

/* ───────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

// MCP SDK
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Core modules
import {
  DEFAULT_BASE_PATH,
  ALLOWED_BASE_PATHS,
  DATABASE_PATH,
  checkDatabaseUpdated,
  setEmbeddingModelReady, waitForEmbeddingModel,
  init as initDbState
} from './core/index.js';

// T303: Tool schemas and dispatch
import { TOOL_DEFINITIONS } from './tool-schemas.js';
import { dispatchTool } from './tools/index.js';

// Handler modules (only indexSingleFile needed directly for startup scan)
import {
  indexSingleFile,
  handleMemoryStats,
} from './handlers/index.js';
import * as memoryIndexDiscovery from './handlers/memory-index-discovery.js';
import { runPostMutationHooks } from './handlers/mutation-hooks.js';

// Utils
import { validateInputLengths } from './utils/index.js';

// History (audit trail for file-watcher deletes)
import { recordHistory } from './lib/storage/history.js';
import * as historyStore from './lib/storage/history.js';

// Hooks
import {
  MEMORY_AWARE_TOOLS,
  extractContextHint,
  autoSurfaceMemories,
  autoSurfaceAtToolDispatch,
  autoSurfaceAtCompaction,
  appendAutoSurfaceHints,
  syncEnvelopeTokenCount,
  serializeEnvelopeWithTokenCount,
  recordToolCall,
} from './hooks/index.js';
import { primeSessionIfNeeded } from './hooks/memory-surface.js';

// Architecture
import { getTokenBudget } from './lib/architecture/layer-definitions.js';
import { createMCPErrorResponse, wrapForMCP } from './lib/response/envelope.js';

// T303: Startup checks (extracted from this file)
import { detectNodeVersionMismatch, checkSqliteVersion } from './startup-checks.js';
import {
  getStartupEmbeddingDimension,
  resolveStartupEmbeddingConfig,
  validateConfiguredEmbeddingsProvider,
} from '@spec-kit/shared/embeddings/factory';

// Lib modules (for initialization only)
import * as vectorIndex from './lib/search/vector-index.js';
import * as _embeddings from './lib/providers/embeddings.js';
import * as checkpointsLib from './lib/storage/checkpoints.js';
import * as accessTracker from './lib/storage/access-tracker.js';
import { runLineageBackfill } from './lib/storage/lineage-state.js';
import * as hybridSearch from './lib/search/hybrid-search.js';
import { createUnifiedGraphSearchFn } from './lib/search/graph-search-fn.js';
import { isGraphUnifiedEnabled } from './lib/search/graph-flags.js';
import * as graphDb from './lib/code-graph/code-graph-db.js';
import { detectRuntime, type RuntimeInfo } from './lib/code-graph/runtime-detection.js';
import * as sessionBoost from './lib/search/session-boost.js';
import * as causalBoost from './lib/search/causal-boost.js';
import * as bm25Index from './lib/search/bm25-index.js';
import * as memoryParser from './lib/parsing/memory-parser.js';
import { getSpecsBasePaths } from './lib/search/folder-discovery.js';
import {
  registerGlobalRefreshFn,
  getDirtyNodes,
  clearDirtyNodes,
  recomputeLocal,
} from './lib/search/graph-lifecycle.js';
import {
  isDegreeBoostEnabled,
  isDynamicInitEnabled,
  isFileWatcherEnabled,
} from './lib/search/search-flags.js';
import { runCleanupStep, runAsyncCleanupStep } from './lib/utils/cleanup-helpers.js';
import { disposeLocalReranker } from './lib/search/local-reranker.js';
import * as workingMemory from './lib/cognitive/working-memory.js';
import * as attentionDecay from './lib/cognitive/attention-decay.js';
import * as coActivation from './lib/cognitive/co-activation.js';
import { initScoringObservability } from './lib/telemetry/scoring-observability.js';
// T059: Archival manager for automatic archival of ARCHIVED state memories
import * as archivalManager from './lib/cognitive/archival-manager.js';
// T099: Retry manager for background embedding retry job (REQ-031, CHK-179)
import * as retryManager from './lib/providers/retry-manager.js';
import { buildErrorResponse, getDefaultErrorCodeForTool, getRecoveryHint } from './lib/errors.js';
// T001-T004: Session deduplication
import * as sessionManager from './lib/session/session-manager.js';
import * as shadowEvaluationRuntime from './lib/feedback/shadow-evaluation-runtime.js';
// Phase 023: Context metrics — lightweight session quality tracking
import { recordMetricEvent } from './lib/session/context-metrics.js';

// P4-12/P4-19: Incremental index (passed to db-state for stale handle refresh)
import * as incrementalIndex from './lib/storage/incremental-index.js';
// T107: Transaction manager for pending file recovery on startup (REQ-033)
import * as transactionManager from './lib/storage/transaction-manager.js';
// KL-4: Tool cache cleanup on shutdown
import * as toolCache from './lib/cache/tool-cache.js';
import { initExtractionAdapter } from './lib/extraction/extraction-adapter.js';
import { migrateLearnedTriggers, verifyFts5Isolation } from './lib/storage/learned-triggers-schema.js';
import { isLearnedFeedbackEnabled } from './lib/search/learned-feedback.js';
import { initIngestJobQueue } from './lib/ops/job-queue.js';
import { startFileWatcher, type FSWatcher } from './lib/ops/file-watcher.js';
import { getCanonicalPathKey } from './lib/utils/canonical-path.js';
import { runBatchLearning } from './lib/feedback/batch-learning.js';
import { getSessionSnapshot } from './lib/session/session-snapshot.js';

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

interface IndexResult {
  status: string;
  error?: string;
  [key: string]: unknown;
}

interface PendingRecoveryResult {
  found: number;
  processed: number;
  recovered: number;
  failed: number;
  results: unknown[];
}

interface ApiKeyValidation {
  valid: boolean;
  provider?: string;
  error?: string;
  errorCode?: string;
  warning?: string;
  actions?: string[];
  networkError?: boolean;
}

interface AutoSurfaceResult {
  constitutional: unknown[];
  triggered: unknown[];
  codeGraphStatus?: {
    status: 'ok' | 'error';
    data?: Record<string, unknown>;
    error?: string;
  };
  sessionPrimed?: boolean;
  primedTool?: string;
  /** T018: Structured Prime Package for non-hook CLI auto-priming */
  primePackage?: {
    specFolder: string | null;
    currentTask: string | null;
    codeGraphStatus: 'fresh' | 'stale' | 'empty';
    cocoIndexAvailable: boolean;
    recommendedCalls: string[];
  };
  surfaced_at?: string;
  latencyMs?: number;
}

interface ToolCallResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
  structuredContent?: unknown;
  [key: string]: unknown;
}

interface DynamicMemoryStats {
  totalMemories: number;
  specFolderCount: number;
  activeCount: number;
  staleCount: number;
}

type AfterToolCallback = (tool: string, callId: string, result: unknown) => Promise<void>;

const afterToolCallbacks: Array<AfterToolCallback> = [];

/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
const EMBEDDING_MODEL_TIMEOUT_MS = 30_000;

/** Timeout (ms) for API key validation during startup. */
const API_KEY_VALIDATION_TIMEOUT_MS = 5_000;

const GRAPH_ENRICHMENT_TIMEOUT_MS = 250;
const GRAPH_ENRICHMENT_OUTLINE_LIMIT = 6;
const GRAPH_ENRICHMENT_NEIGHBOR_LIMIT = 6;
const GRAPH_ENRICHMENT_SYMBOL_LIMIT = 4;
const GRAPH_CONTEXT_EXCLUDED_TOOLS = new Set<string>([
  ...MEMORY_AWARE_TOOLS,
  'code_graph_query',
  'code_graph_context',
  'code_graph_scan',
  'code_graph_status',
]);

interface GraphContextNeighborSummary {
  filePath: string;
  relationTypes: string[];
  symbols: Array<{
    name: string;
    kind: string;
    line: number;
    direction: 'incoming' | 'outgoing';
    relation: string;
  }>;
}

interface GraphContextFileSummary {
  filePath: string;
  outline: Array<{
    name: string;
    kind: string;
    line: number;
  }>;
  neighbors: GraphContextNeighborSummary[];
}

interface DispatchGraphContextMeta {
  status: 'ok' | 'timeout' | 'unavailable';
  source: 'tool-dispatch';
  fileCount: number;
  filePaths: string[];
  latencyMs: number;
  files?: GraphContextFileSummary[];
  error?: string;
}

export interface StructuralRoutingNudge {
  advisory: true;
  readiness: 'ready';
  preferredTool: 'code_graph_query';
  secondaryTool: 'code_graph_context';
  message: string;
  preservesAuthority: 'session_bootstrap';
  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
}


---
"use strict";
// ---------------------------------------------------------------
// MODULE: Generate Context
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
exports.readAllStdin = readAllStdin;
exports.parseArguments = parseArguments;
exports.validateArguments = validateArguments;
exports.isValidSpecFolder = isValidSpecFolder;
exports.extractPayloadSpecFolder = extractPayloadSpecFolder;
// ───────────────────────────────────────────────────────────────
// 1. GENERATE CONTEXT
// ───────────────────────────────────────────────────────────────
// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
// Node stdlib
const path = __importStar(require("path"));
const fsSync = __importStar(require("fs"));
// Internal modules
const path_security_1 = require("@spec-kit/shared/utils/path-security");
const core_1 = require("../core");
const workflow_1 = require("../core/workflow");
const loaders_1 = require("../loaders");
const collect_session_data_1 = require("../extractors/collect-session-data");
// ───────────────────────────────────────────────────────────────
// 3. HELP TEXT
// ───────────────────────────────────────────────────────────────
const HELP_TEXT = `
Usage: node generate-context.js [options] <input>

Arguments:
  <input>           A JSON data file path
                    - JSON file mode: node generate-context.js data.json [spec-folder]

Options:
  --help, -h        Show this help message
  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata

Examples:
  node generate-context.js /tmp/context-data.json
  node generate-context.js /tmp/context-data.json specs/001-feature/
  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'

Output:
  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
  for indexing by the Spec Kit Memory system.

Preferred save path (JSON-PRIMARY):
  - ALWAYS use --stdin, --json, or a JSON temp file.
  - The AI has strictly better information about its own session than any DB query can reconstruct.
  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.

Direct CLI target rule:
  - When a spec folder is passed on the CLI, that explicit target is authoritative.
  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    but they must not reroute the save to another folder.

JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
  {
    "user_prompts": [...],
    "observations": [...],
    "recent_context": [...],
    "toolCalls": [
      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
    ],
    "exchanges": [
      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
    ],
    "preflight": {
      "knowledgeScore": 40,
      "uncertaintyScore": 60,
      "contextScore": 50,
      "timestamp": "ISO-8601",
      "gaps": ["gap1", "gap2"],
      "confidence": 45,
      "readiness": "Needs research"
    },
    "postflight": {
      "knowledgeScore": 75,
      "uncertaintyScore": 25,
      "contextScore": 80,
      "gapsClosed": ["gap1"],
      "newGaps": ["new-gap"]
    }
  }

  Tool/Exchange enrichment fields (all optional — JSON-mode only):
  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
  - exchanges[]: Key user-assistant exchanges with timestamps
  - These provide richer context than DB extraction since the AI filters noise at source

  Learning Delta Calculation:
  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
  - Context Delta = postflight.contextScore - preflight.contextScore
  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
`;
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(HELP_TEXT);
    process.exit(0);
}
// 2.1 SIGNAL HANDLERS
let signalHandlersInstalled = false;
let shuttingDown = false;
// Robustness: signal handler releases locks before reporting
function handleSignalShutdown(signal) {
    if (shuttingDown)
        return; // prevent re-entrant handling
    shuttingDown = true;
    let lockReleaseFailed = false;
    try {
        (0, workflow_1.releaseFilesystemLock)();
    }
    catch (_err) {
        lockReleaseFailed = true;
    }
    console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
    process.exit(lockReleaseFailed ? 1 : 0);
}
function installSignalHandlers() {
    if (signalHandlersInstalled) {
        return;
    }
    process.on('SIGTERM', () => handleSignalShutdown('SIGTERM'));
    process.on('SIGINT', () => handleSignalShutdown('SIGINT'));
    signalHandlersInstalled = true;
}
// ───────────────────────────────────────────────────────────────
// 4. SPEC FOLDER VALIDATION
// ───────────────────────────────────────────────────────────────
function isUnderApprovedSpecsRoot(normalizedInput) {
    return (0, path_security_1.validateFilePath)(path.resolve(core_1.CONFIG.PROJECT_ROOT, normalizedInput), (0, core_1.getSpecsDirectories)()) !== null;
}
function isValidSpecFolder(folderPath) {
    const folderName = path.basename(folderPath);
    // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
    const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
    // Extract the trailing portion that might be "parent/child"
    const trailingSegments = normalizedInput.split('/');
    // Check if the last two segments both match the spec folder pattern
    if (trailingSegments.length >= 2) {
        const lastTwo = trailingSegments.slice(-2);
        if (core_1.SPEC_FOLDER_PATTERN.test(lastTwo[0]) && core_1.SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
            // Both segments are valid spec folder names — valid nested spec folder
            const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
            if (!hasSpecsParent) {
                // Fallback: check if the path resolves to an existing directory under any specs root
                for (const specsDir of (0, core_1.getSpecsDirectories)()) {
                    const candidate = path.join(specsDir, normalizedInput);
                    if (!path.isAbsolute(normalizedInput) &&
                        fsSync.existsSync(candidate) &&
                        (0, path_security_1.validateFilePath)(candidate, (0, core_1.getSpecsDirectories)()) !== null) {
                        return { valid: true };
                    }
                }
                return {
                    valid: false,
                    reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
                };
            }
            return { valid: true };
        }
    }
    if (!core_1.SPEC_FOLDER_PATTERN.test(folderName)) {
        if (/^\d{3}-/.test(folderName)) {
            if (/[A-Z]/.test(folderName)) {
                return { valid: false, reason: 'Spec folder name should be lowercase' };
            }
            if (/_/.test(folderName)) {
                return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
            }
            if (!/^[a-z]/.test(folderName.slice(4))) {
                return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
            }
        }
        return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
    }
    const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
    if (!hasSpecsParent) {
        // Fallback: check if bare name can be resolved via recursive child search
        // (findChildFolderSync in validateArguments handles this, so just report the error here)
        return {
            valid: false,
            reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
        };
    }
    return { valid: true };
}
function resolveCliSpecFolderReference(rawArg) {
    const folderName = path.basename(rawArg);
    const explicitProjectScopedPath = !rawArg.endsWith('.json') && (rawArg.startsWith('specs/') ||
        rawArg.startsWith('.opencode/specs/'))
        ? path.join(core_1.CONFIG.PROJECT_ROOT, rawArg)
        : null;
    let resolvedNestedPath = null;
    if (!rawArg.endsWith('.json')) {
        if (path.isAbsolute(rawArg)) {
            const absoluteSegments = rawArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
            const lastSegment = absoluteSegments.at(-1);
            const parentSegment = absoluteSegments.at(-2);
            if ((lastSegment && core_1.SPEC_FOLDER_PATTERN.test(lastSegment)) ||
                (parentSegment && lastSegment && core_1.SPEC_FOLDER_PATTERN.test(parentSegment) && core_1.SPEC_FOLDER_PATTERN.test(lastSegment))) {
                resolvedNestedPath = rawArg;
            }
        }
        let cleaned = rawArg;
        if (cleaned.startsWith('.opencode/specs/')) {
            cleaned = cleaned.slice('.opencode/specs/'.length);
        }
        else if (cleaned.startsWith('specs/')) {
            cleaned = cleaned.slice('specs/'.length);
        }
        cleaned = cleaned.replace(/\/+$/, '');
        if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
            resolvedNestedPath = explicitProjectScopedPath;
        }
        const segments = cleaned.split('/');
        if (!resolvedNestedPath && segments.length >= 2) {
            for (const specsDir of (0, core_1.getSpecsDirectories)()) {
                const candidate = path.join(specsDir, ...segments);
                if (fsSync.existsSync(candidate)) {
                    resolvedNestedPath = candidate;

---
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Spec Kit Compact Code Graph OpenCode Plugin                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────
// Thin OpenCode plugin hook layer for packet 030.
// Important runtime boundary: never import the MCP server bundle directly
// inside the OpenCode host process because its native modules (better-sqlite3,
// sqlite-vec) may be compiled for a different Node ABI than the host runtime.
// Instead, call a plain `node` bridge process that loads the server bundle in
// the user's normal Node environment and returns the transport plan as JSON.

// ─────────────────────────────────────────────────────────────────────────────
// 2. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { tool } from '@opencode-ai/plugin';
import {
  createSyntheticTextPart,
  hasUnsafeMessageTransformParts,
  hasSyntheticTextPartMarker,
  isMessageAnchorLike,
} from './spec-kit-opencode-message-schema.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONSTANTS AND TYPES
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_ID = 'spec-kit-compact-code-graph';
const DEFAULT_CACHE_TTL_MS = 5000;
const DEFAULT_BRIDGE_TIMEOUT_MS = 15000;
const DEFAULT_NODE_BINARY = 'node';
const RESUME_MODE = 'minimal';
const MESSAGES_TRANSFORM_ENABLED = true;
const MESSAGES_TRANSFORM_MODE = 'schema_aligned';
const SYNTHETIC_METADATA_KEY = 'specKitCompactCodeGraph';
const BRIDGE_PATH = fileURLToPath(new URL('./spec-kit-compact-code-graph-bridge.mjs', import.meta.url));

/**
 * @typedef {{
 *   cacheTtlMs?: number,
 *   specFolder?: string,
 *   nodeBinary?: string,
 *   bridgeTimeoutMs?: number,
 * }} PluginOptions
 */

/**
 * @typedef {{
 *   hook: string,
 *   title: string,
 *   payloadKind: string,
 *   dedupeKey: string,
 *   content: string,
 * }} TransportBlock
 */

/**
 * @typedef {{
 *   interfaceVersion: string,
 *   transportOnly: true,
 *   retrievalPolicyOwner: string,
 *   event: {
 *     hook: string,
 *     trackedPayloadKinds: string[],
 *     summary: string,
 *   },
 *   systemTransform?: TransportBlock,
 *   messagesTransform: TransportBlock[],
 *   compaction?: TransportBlock,
 * }} TransportPlan
 */

// ─────────────────────────────────────────────────────────────────────────────
// 4. MODULE STATE
// ─────────────────────────────────────────────────────────────────────────────

const transportCache = new Map();
let runtimeReady = false;
let lastRuntimeError = null;

// ─────────────────────────────────────────────────────────────────────────────
// 5. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function normalizePositiveInt(value, fallback) {
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
}

function normalizeOptions(rawOptions) {
  if (!rawOptions || typeof rawOptions !== 'object') {
    return {
      cacheTtlMs: DEFAULT_CACHE_TTL_MS,
      specFolder: undefined,
      nodeBinary: process.env.SPEC_KIT_PLUGIN_NODE_BINARY || DEFAULT_NODE_BINARY,
      bridgeTimeoutMs: DEFAULT_BRIDGE_TIMEOUT_MS,
    };
  }

  const options = /** @type {PluginOptions} */ (rawOptions);
  return {
    cacheTtlMs: normalizePositiveInt(options.cacheTtlMs, DEFAULT_CACHE_TTL_MS),
    specFolder: typeof options.specFolder === 'string' && options.specFolder.trim()
      ? options.specFolder.trim()
      : undefined,
    nodeBinary: typeof options.nodeBinary === 'string' && options.nodeBinary.trim()
      ? options.nodeBinary.trim()
      : (process.env.SPEC_KIT_PLUGIN_NODE_BINARY || DEFAULT_NODE_BINARY),
    bridgeTimeoutMs: normalizePositiveInt(options.bridgeTimeoutMs, DEFAULT_BRIDGE_TIMEOUT_MS),
  };
}

function cacheKeyForSession(sessionID, specFolder) {
  return `${specFolder ?? '__workspace__'}::${sessionID ?? '__global__'}`;
}

function parseTransportPlan(responseText) {
  if (!responseText) {
    return null;
  }

  try {
    const parsed = JSON.parse(responseText);
    const data = parsed?.data ?? parsed;
    const plan = data?.opencodeTransport;
    if (!plan || typeof plan !== 'object') {
      return null;
    }
    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
      return null;
    }
    return /** @type {TransportPlan} */ (plan);
  } catch {
    return null;
  }
}

function stringifyError(error) {
  if (!error) {
    return 'Unknown bridge error';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function execFilePromise(file, args, options) {
  return new Promise((resolve, reject) => {
    execFile(file, args, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({
        stdout: typeof stdout === 'string' ? stdout : '',
        stderr: typeof stderr === 'string' ? stderr : '',
      });
    });
  });
}

async function runTransportBridge({ projectDir, specFolder, nodeBinary, bridgeTimeoutMs }) {
  const args = [BRIDGE_PATH, '--minimal'];
  if (specFolder) {
    args.push('--spec-folder', specFolder);
  }

  const result = await execFilePromise(nodeBinary, args, {
    cwd: projectDir,
    env: process.env,
    timeout: bridgeTimeoutMs,
    maxBuffer: 1024 * 1024,
  });
  return parseTransportPlan(result.stdout.trim());
}

async function loadTransportPlan({ projectDir, sessionID, specFolder, cacheTtlMs, nodeBinary, bridgeTimeoutMs }) {
  const key = cacheKeyForSession(sessionID, specFolder);
  const now = Date.now();
  const cached = transportCache.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.plan;
  }

  try {
    const plan = await runTransportBridge({
      projectDir,
      specFolder,
      nodeBinary,
      bridgeTimeoutMs,
    });

    if (!plan) {
      lastRuntimeError = 'Bridge returned no OpenCode transport payload';
      runtimeReady = false;
      transportCache.delete(key);
      return null;
    }

    runtimeReady = true;
    lastRuntimeError = null;
    transportCache.set(key, {
      plan,
      expiresAt: now + cacheTtlMs,
      updatedAt: new Date(now).toISOString(),
    });
    return plan;
  } catch (error) {
    runtimeReady = false;
    lastRuntimeError = stringifyError(error);
    transportCache.delete(key);
    return null;
  }
}

function extractEventSessionID(event) {
  if (!event || typeof event !== 'object') {
    return null;
  }

  if (typeof event.sessionID === 'string') {
    return event.sessionID;
  }

  if (event.properties && typeof event.properties === 'object') {
    if (typeof event.properties.sessionID === 'string') {
      return event.properties.sessionID;
    }
    if (event.properties.info && typeof event.properties.info === 'object') {
      if (typeof event.properties.info.sessionID === 'string') {
        return event.properties.info.sessionID;
      }
      if (typeof event.properties.info.id === 'string') {
        return event.properties.info.id;
      }
    }
    if (event.properties.part && typeof event.properties.part === 'object' && typeof event.properties.part.sessionID === 'string') {
      return event.properties.part.sessionID;
    }
  }

  return null;
}

function shouldInvalidateEvent(eventType) {
  return typeof eventType === 'string'
    && (eventType.startsWith('session.') || eventType.startsWith('message.'));
}

function invalidateTransportCache(sessionID, specFolder) {
  if (sessionID) {

exec
/bin/zsh -lc "printf 'memory-search.ts\\n'; rg -n \"export |function |memory_search|memory_context|session|trigger|causal|search|rerank|dedup|constitution|profile|includeContent|sessionId|context\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1,260p' && printf '\\n---\\ncontext-server.ts\\n' && rg -n \"session_bootstrap|session_resume|memory_context|resume|bootstrap|health|code_graph|cocoindex|structuralContext|nextActions|hints\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1,260p' && printf '\\n---\\ngenerate-context.js\\n' && rg -n \"generate-context|memory|sessionSummary|trigger|importance|metadata|index|context|summary|json\" .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '1,260p' && printf '\\n---\\nspec-kit-compact-code-graph.js\\n' && rg -n \"compact|compaction|code graph|session|bootstrap|resume|transport|structural|selective_reindex|code_graph_scan|code_graph_query|memory\" .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
memory-search.ts
9:import * as sessionManager from '../lib/session/session-manager.js';
10:import * as intentClassifier from '../lib/search/intent-classifier.js';
12:import { isSessionBoostEnabled, isCausalBoostEnabled, isCommunitySearchFallbackEnabled, isDualRetrievalEnabled, isIntentAutoProfileEnabled } from '../lib/search/search-flags.js';
13:import { searchCommunities } from '../lib/search/community-search.js';
15:import { executePipeline } from '../lib/search/pipeline/index.js';
16:import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline/index.js';
17:import type { IntentWeightsConfig } from '../lib/search/pipeline/types.js';
21:import { getStrategyForQuery } from '../lib/search/artifact-routing.js';
23:import { collapseAndReassembleChunkResults } from '../lib/search/chunk-reassembly.js';
32:} from '../lib/search/search-utils.js';
33:// CacheArgsInput used internally by buildCacheArgs (lib/search/search-utils.ts)
69:} from '../lib/search/session-transition.js';
75:} from '../lib/response/profile-formatters.js';
81:} from '../lib/search/progressive-disclosure.js';
85:} from '../lib/search/sqlite-fts.js';
86:import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
87:import { evaluatePublicationGate } from '../lib/context/publication-gate.js';
89:  deduplicateResults as deduplicateWithSessionState,
93:} from '../lib/search/session-state.js';
96:import type { IntentType, IntentWeights as IntentClassifierWeights } from '../lib/search/intent-classifier.js';
98:// RoutingResult, WeightedResult — now used internally by lib/search/search-utils.ts
100:// Feature catalog: Semantic and lexical search (memory_search)
101:// Feature catalog: Hybrid search pipeline
103:// Feature catalog: Quality-aware 3-tier search fallback
111: * Internal search result row — enriched DB row used within this handler.
120:  contextType?: string;
121:  context_type?: string;
145:  dedupStats: Record<string, unknown>;
160:// ChunkReassemblyResult — now imported from lib/search/chunk-reassembly.ts
164:function toIntentWeightsConfig(weights: IntentWeights | null): IntentWeightsConfig | null {
187:  contextType?: string;
191:  includeContent?: boolean;
194:  sessionId?: string;
200:  rerank?: boolean;
203:  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
210:  sessionTransition?: SessionTransitionTrace;
211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
212:  profile?: string;
217:// resolveRowContextType — now imported from lib/search/search-utils.ts
220:function attachTelemetryMeta(
245:    console.warn('[memory-search] Failed to attach telemetry payload:', message);
250:function extractResponseResults(response: MCPResponse): Array<Record<string, unknown>> {
269:function extractSearchCachePayload(response: MCPResponse): SearchCachePayload | null {
295:function parseResponseEnvelope(
313:function replaceResponseEnvelope(
324:function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
325:  const session = retrievalSessionStateManager.getOrCreate(sessionId);
327:    activeGoal: session.activeGoal,
328:    seenResultIds: Array.from(session.seenResultIds),
329:    openQuestions: [...session.openQuestions],
330:    preferredAnchors: [...session.preferredAnchors],
334:function buildSearchResponseFromPayload(
340:    tool: 'memory_search',
349:function attachLexicalCapabilityMetadata(
373:function hasPublicationContractFields(result: Record<string, unknown>): boolean {
383:function applyPublicationGateToResponse(response: MCPResponse): MCPResponse {
432:// resolveArtifactRoutingQuery, applyArtifactRouting — now imported from lib/search/search-utils.ts
433:// CacheArgsInput — now imported from lib/search/search-utils.ts
434:// parseNullableInt, collapseAndReassembleChunkResults — now imported from lib/search/chunk-reassembly.ts
450:function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
451:  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
454:      dedupStats: { enabled: false, sessionId: null }
458:  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
461:    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
466:    dedupStats: {
467:      ...dedupStats,
468:      sessionId
482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
484: * @returns MCP response with ranked search results
486:async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
487:  const _searchStartTime = Date.now();
504:    contextType,
508:    includeContent: includeContent = false,
511:    sessionId,
517:    rerank = true, // Enable reranking by default for better result quality
527:    sessionTransition,
528:    profile,
533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
538:    sessionId: normalizedScope.sessionId ?? null,
542:  // Validate at least one search input is provided (moved from schema superRefine for GPT compatibility)
554:        tool: 'memory_search',
559:          hint: 'Retry the original search to generate a fresh continuation cursor',
566:      tool: 'memory_search',
573:      startTime: _searchStartTime,
594:          tool: 'memory_search',
613:      tool: 'memory_search',
625:      tool: 'memory_search',
646:  } catch (_error: unknown) { /* eval logging must never break search */ }
665:      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
676:      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
678:      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
685:    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
691:  // Phase C: Intent-to-profile auto-routing.
692:  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
693:  let effectiveProfile: string | undefined = profile;
699:        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
702:      // Auto-profile is best-effort — never breaks search
714:    sessionId,
731:    contextType,
738:    includeContent,
742:    rerank,
744:    sessionId,
751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
761:    responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
775:      searchType: (hasValidConcepts && concepts!.length >= 2)
786:      contextType,
789:      includeContent,
795:      rerank,
797:      sessionId,
812:    // Phase B T018/T019: Community search fallback — inject community members on weak results
826:          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
833:              SELECT id, title, similarity, content, file_path, importance_tier, context_type,
858:          console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
886:    if (sessionId && isSessionRetrievalStateEnabled()) {
889:        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
892:        retrievalSessionStateManager.setAnchors(sessionId, anchors);
895:      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
908:        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
952:    if (pipelineResult.metadata.stage3.rerankApplied) {
953:      extraData.rerankMetadata = {
954:        reranking_enabled: true,
955:        reranking_requested: true,
956:        reranking_applied: true,
985:      session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
986:      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
999:      pipelineConfig.searchType,
1000:      includeContent,
1006:      normalizedQuery,   // REQ-D5-001/D5-004: pass query for recovery + confidence context
1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
1048:      ? buildSearchResponseFromPayload(cachePayload, _searchStartTime, false)
1054:  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
1063:      data.results = deduped.results as SessionAwareResult[];
1064:      data.count = deduped.results.length;
1065:      data.sessionDedup = deduped.metadata;
1071:  // Apply session deduplication AFTER cache
1072:  if (sessionId && enableDedup && sessionManager.isEnabled()) {
1079:        console.warn('[memory-search] Failed to parse cached response for dedup:', message);
1086:    // P1-018 — Validate response shape before dedup. If the cached response
1087:    // Doesn't have the expected data.results array, log a warning and skip dedup
1088:    // Rather than silently falling through to the un-deduped response.
1095:      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
1097:      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
1101:      const { results: dedupedResults } = applySessionDedup(
1103:        sessionId,
1108:      const dedupedCount = dedupedResults.length;
1109:      const filteredCount = originalCount - dedupedCount;
1116:      data.results = dedupedResults;
1117:      data.count = dedupedCount;
1119:      const dedupStats = {
1121:        sessionId,
1123:        returnedCount: dedupedCount,
1129:      resultsData.dedupStats = dedupStats;
1132:        (resultsData.meta as Record<string, unknown>).dedupStats = dedupStats;
1146:  if (sessionId && isSessionRetrievalStateEnabled()) {
1159:        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
1162:      data.sessionState = buildSessionStatePayload(sessionId);
1172:  if (includeTrace && sessionTransition) {
1173:    responseToReturn = attachSessionTransitionTrace(responseToReturn, sessionTransition);
1178:    retrievalTelemetry.recordTransitionDiagnostics(telemetry, sessionTransition);
1186:  // Consumption instrumentation — log search event (fail-safe, never throws)
1203:        event_type: 'search',
1208:        session_id: sessionId ?? null,
1209:        latency_ms: Date.now() - _searchStartTime,
1213:  } catch (_error: unknown) { /* instrumentation must never cause search to fail */ }
1235:        latencyMs: Date.now() - _searchStartTime,
1249:  } catch (_error: unknown) { /* eval logging must never break search */ }
1251:  // REQ-D4-001: Implicit feedback — log search_shown events for returned results
1268:          const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
1270:            type: 'search_shown',
1274:            timestamp: _searchStartTime,
1275:            sessionId: sessionId ?? null,
1281:  } catch (_error: unknown) { /* feedback logging must never break search */ }
1283:  // REQ-014: Query flow tracking + result_cited for includeContent searches
1310:        const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
1314:          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
1317:        // Log result_cited for includeContent searches (content was embedded = cited)
1318:        if (includeContent && shownIds.length > 0) {
1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);
1323:  } catch (_error: unknown) { /* query flow tracking must never break search */ }
1325:  // REQ-D5-003: Apply presentation profile when flag is enabled and profile is specified.
1326:  // Phase C: effectiveProfile includes auto-routed profile from intent detection.
1331:        const profiled = applyProfileToEnvelope(effectiveProfile, firstEntry.text);
1332:        if (profiled !== firstEntry.text) {
1335:            content: [{ ...firstEntry, text: profiled }],
1338:      } catch (_profileError: unknown) {
1339:        // Profile formatting is best-effort — never breaks search
1356:export {
1360:export const __testables = {
1374:const handle_memory_search = handleMemorySearch;
1376:export {
1377:  handle_memory_search,

---
context-server.ts
213:  'code_graph_query',
214:  'code_graph_context',
215:  'code_graph_scan',
216:  'code_graph_status',
254:  preferredTool: 'code_graph_query';
255:  secondaryTool: 'code_graph_context';
257:  preservesAuthority: 'session_bootstrap';
258:  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
320:    preferredTool: 'code_graph_query',
321:    secondaryTool: 'code_graph_context',
322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
323:    preservesAuthority: 'session_bootstrap',
324:    surface: options.surface ?? 'response-hints',
332:  const hints = Array.isArray(envelope.hints)
333:    ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
335:  envelope.hints = hints;
336:  if (!hints.includes(nudge.message)) {
337:    hints.push(nudge.message);
671:  const hints = Array.isArray(envelope.hints)
672:    ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
674:  envelope.hints = hints;
684:  hints.push(
688:  // T018: Include Prime Package hints for non-hook CLIs
692:      hints.push(`Active spec folder: ${pkg.specFolder}`);
694:    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
696:      hints.push(`Recommended next calls: ${pkg.recommendedCalls.join(', ')}`);
759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
782:  // Phase 027: Structural bootstrap guidance for non-hook runtimes
785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
796:      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
874:    // T018: Track last tool call timestamp for all tools except session_health.
875:    if (name !== 'session_health') {
882:    if (name === 'memory_context' && args.mode === 'resume') {
885:    if (name.startsWith('code_graph_')) {
886:      recordMetricEvent({ kind: 'code_graph_query' });
912:      name === 'memory_context' && args.mode === 'resume';
964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
984:            const existingHints = Array.isArray(envelope.hints) ? envelope.hints as string[] : [];
985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
986:            envelope.hints = existingHints;
1007:                surface: 'response-hints',
1026:        if (!enrichment.skipped && enrichment.hints.length > 0) {
1030:              const existingHints = Array.isArray(envelope.hints) ? envelope.hints as string[] : [];
1031:              envelope.hints = [...existingHints, ...enrichment.hints];
1045:    // SK-004: Inject auto-surface hints before token-budget enforcement so
1098:              if (Array.isArray(envelope.hints)) {
1099:                envelope.hints.push(`Token budget enforced: truncated ${originalCount} → ${innerResults.length} results to fit ${budget} token budget`);
1106:              if (Array.isArray(envelope.hints)) {
1107:                envelope.hints.push(`Response exceeds token budget (${meta.tokenCount}/${budget})`);
1120:    // REQ-004: Include recovery hints in all error responses
1652:    console.error('[context-server] Startup health: memory_index=%d, active_memory_projection=%d', memoryCount, projectionCount);

---
generate-context.js
48:// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
62:Usage: node generate-context.js [options] <input>
66:                    - JSON file mode: node generate-context.js data.json [spec-folder]
71:  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
72:  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata
75:  node generate-context.js /tmp/context-data.json
76:  node generate-context.js /tmp/context-data.json specs/001-feature/
77:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
78:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
79:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
82:  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
83:  for indexing by the Spec Kit Memory system.
86:  - ALWAYS use --stdin, --json, or a JSON temp file.
99:    "recent_context": [...],
110:      "contextScore": 50,
119:      "contextScore": 80,
128:  - These provide richer context than DB extraction since the AI filters noise at source
133:  - Context Delta = postflight.contextScore - preflight.contextScore
229:    const explicitProjectScopedPath = !rawArg.endsWith('.json') && (rawArg.startsWith('specs/') ||
234:    if (!rawArg.endsWith('.json')) {
277:        core_1.SPEC_FOLDER_BASIC_PATTERN.test(folderName)) && !rawArg.endsWith('.json');
325:    if (mode === '--json' && rawJson === undefined) {
326:        throw new Error('--json requires an inline JSON string argument');
328:    // Validation: empty --json is a user error, not a crash
329:    if (mode === '--json' && (rawJson === undefined || rawJson.trim().length === 0)) {
330:        console.log(JSON.stringify({ error: 'VALIDATION_ERROR', message: 'Empty --json input' }));
375:    if (primaryArg === '--stdin' || primaryArg === '--json') {
382:            'Use structured JSON via --json, --stdin, or a JSON temp file.');
490:            console.error('[generate-context] Failed to list spec folders:', errMsg);
493:    console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
500:    console.error('Starting memory skill...\n');
546://# sourceMappingURL=generate-context.js.map

---
spec-kit-compact-code-graph.js
14:// the user's normal Node environment and returns the transport plan as JSON.
36:const PLUGIN_ID = 'spec-kit-compact-code-graph';
44:const BRIDGE_PATH = fileURLToPath(new URL('./spec-kit-compact-code-graph-bridge.mjs', import.meta.url));
68: *   transportOnly: true,
77: *   compaction?: TransportBlock,
85:const transportCache = new Map();
120:function cacheKeyForSession(sessionID, specFolder) {
121:  return `${specFolder ?? '__workspace__'}::${sessionID ?? '__global__'}`;
136:    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
185:async function loadTransportPlan({ projectDir, sessionID, specFolder, cacheTtlMs, nodeBinary, bridgeTimeoutMs }) {
186:  const key = cacheKeyForSession(sessionID, specFolder);
188:  const cached = transportCache.get(key);
203:      lastRuntimeError = 'Bridge returned no OpenCode transport payload';
205:      transportCache.delete(key);
211:    transportCache.set(key, {
220:    transportCache.delete(key);
230:  if (typeof event.sessionID === 'string') {
231:    return event.sessionID;
235:    if (typeof event.properties.sessionID === 'string') {
236:      return event.properties.sessionID;
239:      if (typeof event.properties.info.sessionID === 'string') {
240:        return event.properties.info.sessionID;
246:    if (event.properties.part && typeof event.properties.part === 'object' && typeof event.properties.part.sessionID === 'string') {
247:      return event.properties.part.sessionID;
256:    && (eventType.startsWith('session.') || eventType.startsWith('message.'));
259:function invalidateTransportCache(sessionID, specFolder) {
260:  if (sessionID) {
261:    transportCache.delete(cacheKeyForSession(sessionID, specFolder));
265:  for (const key of [...transportCache.keys()]) {
267:      transportCache.delete(key);
277: * Create the Spec Kit OpenCode plugin and its transport-backed hook handlers.
296:      spec_kit_compact_code_graph_status: tool({
297:        description: 'Show Spec Kit compact code graph plugin cache status',
300:          const entries = [...transportCache.entries()]
308:            `resume_mode=${RESUME_MODE}`,
316:            `cache_entries=${transportCache.size}`,
326:        sessionID: input.sessionID,
362:        sessionID: anchor.info.sessionID,
380:          sessionID: anchor.info.sessionID,
396:    'experimental.session.compacting': async (input, output) => {
399:        sessionID: input.sessionID,
406:      const block = plan?.compaction;

exec
/bin/zsh -lc "rg -n \"session_bootstrap|session_resume|memory_context\\(|mode: 'resume'|resume previous work|structuralContext|recommendedAction|codeGraphStatus|cocoIndexAvailable\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/dist/**'"' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:164:  codeGraphStatus?: {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:175:    codeGraphStatus: 'fresh' | 'stale' | 'empty';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:176:    cocoIndexAvailable: boolean;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:679:  const codeGraphStatus = sessionPrimeContext.codeGraphStatus;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:680:  const codeGraphState = codeGraphStatus?.status === 'ok'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:694:    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:795:    if (snap.cocoIndexAvailable) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:111:  structuralContext?: StructuralBootstrapContract;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:417:        mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:473:  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:477:  const structuralTrust = buildStructuralContextTrust(structuralContext);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:551:      content: structuralContext.summary,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:572:      trustState: trustStateFromStructuralStatus(structuralContext.status),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:574:      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:588:    structuralContext,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:49:  structuralContext?: StructuralBootstrapContract & StructuralTrust;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:97:  structuralContext: StructuralBootstrapContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:109:  if (structuralContext.recommendedAction) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:110:    nextActions.add(structuralContext.recommendedAction);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:113:  if (structuralContext.status === 'ready') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:115:  } else if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:144:  structuralContext: StructuralBootstrapContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:146:  if (structuralContext.status !== 'ready') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:196:  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:206:  const structuralRoutingNudge = buildStructuralRoutingNudge(structuralContext);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:226:  const structuralSnapshotTrust = buildStructuralContextTrust(structuralContext);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:233:  const structuralContextWithTrust = attachStructuralTrustFields(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:234:    structuralContext,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:281:      content: structuralContext.summary,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:289:      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:304:    ])}; structuralStatus=${structuralContext.status}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:308:      trustState: trustStateFromStructuralStatus(structuralContext.status),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:310:      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:315:    graphFreshness: structuralContext.status === 'ready'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:317:      : structuralContext.status === 'stale'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:327:    structuralContext: structuralContextWithTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:47:  structuralContext?: StructuralBootstrapContract;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:102:  const structuralContext = buildStructuralBootstrapContract('session_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:122:  if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:124:  } else if (structuralContext.status === 'missing') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:154:        content: structuralContext.summary,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:158:    summary: `Session health is ${status}; graph freshness is ${graphFreshness}; structural status is ${structuralContext.status}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:162:      trustState: trustStateFromStructuralStatus(structuralContext.status),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:164:      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:183:    structuralContext,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:811:    mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:26:  cocoIndexAvailable: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:42:  recommendedAction: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:85:  recommendedAction: string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:90:    recommendedAction,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:97:  recommendedAction: string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:101:  recommendedAction: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:105:  let fittedRecommendedAction = recommendedAction;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:127:    recommendedAction: fittedRecommendedAction,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:156:  let cocoIndexAvailable = false;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:158:    cocoIndexAvailable = isCocoIndexAvailable();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:184:  if (cocoIndexAvailable) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:197:    cocoIndexAvailable,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:251:  let recommendedAction: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:253:    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:255:    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:260:  const fittedContract = fitStructuralContractBudget(summary, highlights, recommendedAction);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:266:    recommendedAction: fittedContract.recommendedAction,
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:26:  recommendedAction: (typeof VALID_RECOVERY_ACTIONS)[number];
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:125:        recommendedAction: expect.any(String),
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:131:    expect(VALID_RECOVERY_ACTIONS).toContain(envelope.data.recovery?.recommendedAction);
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:40:  codeGraphStatus?: {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:68:  codeGraphStatus: 'fresh' | 'stale' | 'empty';
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:69:  cocoIndexAvailable: boolean;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:72:  structuralContext?: StructuralBootstrapContract;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:215:function getCodeGraphStatusSnapshot(): NonNullable<AutoSurfaceResult['codeGraphStatus']> {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:422:  graphSnapshot: NonNullable<AutoSurfaceResult['codeGraphStatus']>,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:438:  let codeGraphStatus: PrimePackage['codeGraphStatus'] = 'empty';
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:443:      codeGraphStatus = 'empty';
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:445:      codeGraphStatus = 'stale';
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:447:      codeGraphStatus = 'fresh';
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:452:  const cocoIndexAvailable = isCocoIndexAvailable();
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:456:  if (codeGraphStatus === 'stale' || codeGraphStatus === 'empty') {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:462:  if (cocoIndexAvailable && recommendedCalls.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:467:  if (cocoIndexAvailable) {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:470:  if (codeGraphStatus !== 'empty') {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:476:  const structuralContext = buildStructuralBootstrapContract('auto-prime');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:479:    specFolder, currentTask, codeGraphStatus, cocoIndexAvailable, recommendedCalls,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:480:    structuralContext,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:513:    const codeGraphStatus = getCodeGraphStatusSnapshot();
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:517:    const primePackage = buildPrimePackage(toolArgs, codeGraphStatus);
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:525:    if (enrichedConstitutional.length === 0 && codeGraphStatus.status !== 'ok') {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:530:        codeGraphStatus,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:542:      codeGraphStatus,
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:215:// -- buildRecoveryPayload — recommendedAction field --
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:217:describe('buildRecoveryPayload() — recommendedAction mapping', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:224:    expect(payload.recommendedAction).toBe('retry_broader');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:233:    expect(payload.recommendedAction).toBe('switch_mode');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:242:    expect(payload.recommendedAction).toBe('save_memory');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:247:    expect(payload.recommendedAction).toBe('retry_broader');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:258:    expect(payload.recommendedAction).toBe('ask_user');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:320:    expect(payload).toHaveProperty('recommendedAction');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:335:  it('recommendedAction is one of the valid literals', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:338:    expect(validActions).toContain(payload.recommendedAction);
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:29:    recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:45:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:54:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:66:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:75:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:76:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:82:    expect(parsed.data.structuralContext.status).toBe('stale');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:84:      structuralContext: expect.objectContaining({ status: 'stale' }),
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:89:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:29:  cocoIndexAvailable: boolean;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:31:  cocoIndexAvailable: boolean;
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:656:const codeGraphStatus: ToolDefinition = {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:770:      structuralContext: { type: 'object', description: 'Structural bootstrap contract (status, summary, recommendedAction); omitted when code graph is unavailable', properties: { status: { type: 'string', enum: ['ready', 'stale', 'missing'] }, summary: { type: 'string' }, recommendedAction: { type: 'string' } } },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:925:  codeGraphStatus,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:280:        recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:68:    expect(brief.cocoIndexAvailable).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:117:    expect(brief.cocoIndexAvailable).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:62:    expect(contract.recommendedAction).toContain('code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:85:    expect(contract.recommendedAction).toContain('bounded inline refresh');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:168:      recommendedAction: contract.recommendedAction,
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 780,           // actual: 755 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools + Phase 024 session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:292:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:576:          input: 'resume previous work on memory quality',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:578:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:627:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:655:          input: 'resume previous work on memory quality',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:657:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:692:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:723:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:175:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:192:    expect(parsed.data.structuralContext).toMatchObject({
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
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:189:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:220:    expect(parsed.data.structuralContext).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:299:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:318:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1140:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'

exec
/bin/zsh -lc "rg -n \"generate-context|write memory file|memory/|ANCHOR|trigger_phrases|importance_tier|POST-SAVE QUALITY REVIEW|quality review\" .opencode/skill/system-spec-kit/scripts -g '"'!**/node_modules/**'"' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/wrap-all-templates.sh:10:echo "ANCHOR Template Wrapper"
.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1188:      // Try nested multi-segment resolution (e.g., "005-memory/002-upgrade" or "02--cat/022-parent/008-child")
.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1249:      console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:67:      'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
.opencode/skill/system-spec-kit/scripts/loaders/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/loaders/README.md:13:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/loaders/README.md:22:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/loaders/README.md:23:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/loaders/README.md:28:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/loaders/README.md:29:<!-- ANCHOR:current-inventory -->
.opencode/skill/system-spec-kit/scripts/loaders/README.md:37:<!-- /ANCHOR:current-inventory -->
.opencode/skill/system-spec-kit/scripts/loaders/README.md:38:<!-- ANCHOR:source-priority -->
.opencode/skill/system-spec-kit/scripts/loaders/README.md:54:<!-- /ANCHOR:source-priority -->
.opencode/skill/system-spec-kit/scripts/loaders/README.md:55:<!-- ANCHOR:security-and-path-handling -->
.opencode/skill/system-spec-kit/scripts/loaders/README.md:65:<!-- /ANCHOR:security-and-path-handling -->
.opencode/skill/system-spec-kit/scripts/loaders/README.md:66:<!-- ANCHOR:quick-usage -->
.opencode/skill/system-spec-kit/scripts/loaders/README.md:73:<!-- /ANCHOR:quick-usage -->
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:42:  'ANCHOR_ID', 'TYPE', 'NARRATIVE', 'FILES_LIST',
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:415:          DECISION_ANCHOR_ID: '',
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:615:      DECISION_ANCHOR_ID: '',
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:655:      DECISION_ANCHOR_ID: anchorId,
.opencode/skill/system-spec-kit/scripts/renderers/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/renderers/README.md:13:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/renderers/README.md:21:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/renderers/README.md:22:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/renderers/README.md:27:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/renderers/README.md:28:<!-- ANCHOR:current-inventory -->
.opencode/skill/system-spec-kit/scripts/renderers/README.md:36:<!-- /ANCHOR:current-inventory -->
.opencode/skill/system-spec-kit/scripts/renderers/README.md:37:<!-- ANCHOR:behavior -->
.opencode/skill/system-spec-kit/scripts/renderers/README.md:47:<!-- /ANCHOR:behavior -->
.opencode/skill/system-spec-kit/scripts/renderers/README.md:48:<!-- ANCHOR:runtime -->
.opencode/skill/system-spec-kit/scripts/renderers/README.md:58:<!-- /ANCHOR:runtime -->
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:17:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:25:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:30:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:58:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:63:<!-- ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:108:// Creates: specs/<###-feature-name>/memory/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:134:<!-- /ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:139:<!-- ANCHOR:structure -->
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:174:| `directory-setup.ts`     | Creates and validates `memory/` directory within spec folders                       |
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:178:<!-- /ANCHOR:structure -->
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:183:<!-- ANCHOR:troubleshooting -->
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:199:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:201:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json .opencode/specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:213:node scripts/dist/memory/generate-context.js /tmp/context.json specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:216:node scripts/dist/memory/generate-context.js 003-parent/001-child
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:219:node scripts/dist/memory/generate-context.js .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/021-remediation-revalidation
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:240:| Permission denied on memory/   | `chmod 755 specs/<###-feature-name>`                   |
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:260:# Test with actual generate-context script (which uses these utilities)
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:261:node scripts/dist/memory/generate-context.js --help
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:264:<!-- /ANCHOR:troubleshooting -->
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:269:<!-- ANCHOR:related -->
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:276:| [scripts/memory/generate-context.ts](../memory/generate-context.ts)                        | Main memory save script that uses these utilities |
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:277:| [references/memory/save_workflow.md](../../references/memory/save_workflow.md)             | Memory save workflow reference                    |
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:288:<!-- /ANCHOR:related -->
.opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts:9: * Wraps all level_1-3+ template files with ANCHOR tags
.opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts:61:    // Wrap sections with ANCHOR tags
.opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts:90:  console.log('ANCHOR Template Wrapper');
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:183:    ...(Array.isArray(data.trigger_phrases) ? data.trigger_phrases : []),
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:184:    ...extractFrontmatterListItems(content, 'trigger_phrases'),
.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:250:// Should NOT match, but 'specs/foo/memory/file.md' should).
.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:252:  /(?:^|\/)memory\//,              // directory named "memory/" (no \b — avoids matching "my-memory/")
.opencode/skill/system-spec-kit/scripts/extractors/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/extractors/README.md:13:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/extractors/README.md:22:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/extractors/README.md:23:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/extractors/README.md:28:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/extractors/README.md:29:<!-- ANCHOR:current-inventory -->
.opencode/skill/system-spec-kit/scripts/extractors/README.md:49:<!-- /ANCHOR:current-inventory -->
.opencode/skill/system-spec-kit/scripts/extractors/README.md:50:<!-- ANCHOR:role-in-pipeline -->
.opencode/skill/system-spec-kit/scripts/extractors/README.md:59:<!-- /ANCHOR:role-in-pipeline -->
.opencode/skill/system-spec-kit/scripts/extractors/README.md:60:<!-- ANCHOR:notes -->
.opencode/skill/system-spec-kit/scripts/extractors/README.md:69:<!-- /ANCHOR:notes -->
.opencode/skill/system-spec-kit/scripts/extractors/README.md:70:<!-- ANCHOR:quick-import-check -->
.opencode/skill/system-spec-kit/scripts/extractors/README.md:77:<!-- /ANCHOR:quick-import-check -->
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:98:        "node dist/memory/cleanup-orphaned-vectors.js --check-ledger --strict" || exit 1
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:101:        "node dist/memory/cleanup-orphaned-vectors.js --repair-ledger --replay" || exit 1
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1360:    : (typeof data.importance_tier === 'string' ? data.importance_tier : null);
.opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh:102:        "node dist/memory/reindex-embeddings.js --health-check --target index" || exit 1
.opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh:105:        "node dist/memory/reindex-embeddings.js --rebuild --target index" || exit 1
.opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh:108:        "node dist/memory/reindex-embeddings.js --verify --target index" || exit 1
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:372:   5. OBSERVATION ANCHORING
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:419:        ANCHOR_ID: anchorId,
.opencode/skill/system-spec-kit/scripts/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/README.md:14:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/README.md:23:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/README.md:24:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/README.md:29:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/README.md:30:<!-- ANCHOR:inventory-snapshot -->
.opencode/skill/system-spec-kit/scripts/README.md:50:- `memory/` - 8 TypeScript/JS CLIs (`generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`, `validate-memory-quality.ts`, `reindex-embeddings.ts`, `ast-parser.ts`, `backfill-frontmatter.ts`, `rebuild-auto-entities.ts`)
.opencode/skill/system-spec-kit/scripts/README.md:69:<!-- /ANCHOR:inventory-snapshot -->
.opencode/skill/system-spec-kit/scripts/README.md:70:<!-- ANCHOR:post-spec124128129-workflow -->
.opencode/skill/system-spec-kit/scripts/README.md:88:<!-- /ANCHOR:post-spec124128129-workflow -->
.opencode/skill/system-spec-kit/scripts/README.md:89:<!-- ANCHOR:build-and-runtime -->
.opencode/skill/system-spec-kit/scripts/README.md:107:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/README.md:110:Direct positional saves are not supported; use structured JSON. Explicit CLI targets remain authoritative in structured-input modes, and phase-folder saves write into that selected phase folder's `memory/` directory.
.opencode/skill/system-spec-kit/scripts/README.md:115:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/README.md:128:<!-- /ANCHOR:build-and-runtime -->
.opencode/skill/system-spec-kit/scripts/README.md:129:<!-- ANCHOR:related-readmes -->
.opencode/skill/system-spec-kit/scripts/README.md:136:- `memory/README.md`
.opencode/skill/system-spec-kit/scripts/README.md:150:<!-- /ANCHOR:related-readmes -->
.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh:5:#            the memory-save pipeline (generate-context.js).
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:6:// historical memory trigger_phrases using the live sanitizer plus bounded
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:104:  --apply              Rewrite trigger_phrases in-place with atomic writes
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:177:    && normalized.includes('/memory/')
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:179:    && !normalized.includes('/memory/.archive');
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:386:  const range = locateFrontmatterSectionRange(detection.rawBlock, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:391:  const replacementLines = buildYamlArraySection('trigger_phrases', nextTriggers);
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:408:  const triggerSection = detection.sections.find((section) => section.key === 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/ops/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/ops/README.md:18:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:29:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:33:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:46:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:50:<!-- ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:70:<!-- /ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:74:<!-- ANCHOR:failure-classes -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:85:<!-- /ANCHOR:failure-classes -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:89:<!-- ANCHOR:script-map -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:100:<!-- /ANCHOR:script-map -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:104:<!-- ANCHOR:retry-and-escalation-contract -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:117:<!-- /ANCHOR:retry-and-escalation-contract -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:121:<!-- ANCHOR:usage-examples -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:140:<!-- /ANCHOR:usage-examples -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:144:<!-- ANCHOR:troubleshooting -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:152:<!-- /ANCHOR:troubleshooting -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:156:<!-- ANCHOR:related-resources -->
.opencode/skill/system-spec-kit/scripts/ops/README.md:162:<!-- /ANCHOR:related-resources -->
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:87:        -not -path "*/memory/*" \
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:73:RULE_SEVERITY_ANCHORS_VALID="error" RULE_SEVERITY_ANCHORS="error"
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:95:       PRIORITY_TAGS, EVIDENCE_CITED, ANCHORS_VALID, TOC_POLICY, PHASE_LINKS,
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:317:        FILE_EXISTS|FILES|PLACEHOLDER_FILLED|PLACEHOLDERS|ANCHORS_VALID|ANCHORS|TOC_POLICY|TEMPLATE_HEADERS) echo "error" ;;
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:338:        ANCHOR|ANCHORS|ANCHOR_MATCHED|ANCHORS_VALID) echo "ANCHORS_VALID" ;;
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:364:        ANCHORS_VALID) echo "anchors" ;;
.opencode/skill/system-spec-kit/scripts/tsconfig.json:25:    "memory/**/*.ts",
.opencode/skill/system-spec-kit/scripts/templates/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/templates/README.md:17:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:27:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:32:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:66:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:71:<!-- ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:103:<!-- /ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:108:<!-- ANCHOR:structure -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:145:<!-- /ANCHOR:structure -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:150:<!-- ANCHOR:features -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:215:<!-- /ANCHOR:features -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:220:<!-- ANCHOR:usage-examples -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:275:<!-- /ANCHOR:usage-examples -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:280:<!-- ANCHOR:troubleshooting -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:351:<!-- /ANCHOR:troubleshooting -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:356:<!-- ANCHOR:related -->
.opencode/skill/system-spec-kit/scripts/templates/README.md:377:<!-- /ANCHOR:related -->
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:27:importance_tier: important
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:29:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:64:      { severity: 'HIGH', field: 'trigger_phrases', message: 'bad', fix: 'fix' },
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:66:      { severity: 'MEDIUM', field: 'importance_tier', message: 'bad', fix: 'fix' },
.opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh:92:#   [SPECKIT...] (markers), [ANCHOR...] (anchors),
.opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh:110:        */memory/*) continue ;;
.opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh:141:                -e 's/\[ANCHOR[^]]*\]//g' \
.opencode/skill/system-spec-kit/scripts/memory/fix-memory-h1.mjs:4:// For each .md file under .opencode/specs/**/memory/ -
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:319:    # Subdirectory .md files (memory/, scratch/, etc.) — preserve directory structure
.opencode/skill/system-spec-kit/scripts/utils/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/utils/README.md:17:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/utils/README.md:27:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/utils/README.md:30:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/utils/README.md:68:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/utils/README.md:71:<!-- ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/scripts/utils/README.md:122:<!-- /ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/scripts/utils/README.md:125:<!-- ANCHOR:structure -->
.opencode/skill/system-spec-kit/scripts/utils/README.md:205:<!-- /ANCHOR:structure -->
.opencode/skill/system-spec-kit/scripts/utils/README.md:208:<!-- ANCHOR:troubleshooting -->
.opencode/skill/system-spec-kit/scripts/utils/README.md:317:<!-- /ANCHOR:troubleshooting -->
.opencode/skill/system-spec-kit/scripts/utils/README.md:320:<!-- ANCHOR:related -->
.opencode/skill/system-spec-kit/scripts/utils/README.md:329:| [Memory System](../../references/memory/memory_system.md) | Uses input-normalizer for memory save data |
.opencode/skill/system-spec-kit/scripts/utils/README.md:343:<!-- /ANCHOR:related -->
.opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh:569:        ANCHORS_VALID|ANCHORS)
.opencode/skill/system-spec-kit/scripts/spec/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/spec/README.md:14:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/spec/README.md:23:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/spec/README.md:24:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/spec/README.md:29:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/spec/README.md:30:<!-- ANCHOR:current-inventory -->
.opencode/skill/system-spec-kit/scripts/spec/README.md:46:<!-- /ANCHOR:current-inventory -->
.opencode/skill/system-spec-kit/scripts/spec/README.md:47:<!-- ANCHOR:upgrade-flow-spec124128129136-139 -->
.opencode/skill/system-spec-kit/scripts/spec/README.md:66:`validate.sh` executes modular rules in `scripts/rules/`, including `check-anchors.sh` for ANCHOR tag pairing.
.opencode/skill/system-spec-kit/scripts/spec/README.md:79:<!-- /ANCHOR:upgrade-flow-spec124128129136-139 -->
.opencode/skill/system-spec-kit/scripts/spec/README.md:80:<!-- ANCHOR:completion-gate -->
.opencode/skill/system-spec-kit/scripts/spec/README.md:91:<!-- /ANCHOR:completion-gate -->
.opencode/skill/system-spec-kit/scripts/spec/README.md:92:<!-- ANCHOR:notes -->
.opencode/skill/system-spec-kit/scripts/spec/README.md:102:<!-- /ANCHOR:notes -->
.opencode/skill/system-spec-kit/scripts/spec/create.sh:20:# Also creates scratch/ and memory/ directories.
.opencode/skill/system-spec-kit/scripts/spec/create.sh:244:            echo "All levels include: scratch/ (git-ignored) + memory/ (context preservation)"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:256:            echo "  Creates: specs/005-memory/001-initial-implementation/"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:257:            echo "           specs/005-memory/002-refactor/"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:335:    # Create sub-folder structure with independent memory/ and scratch/
.opencode/skill/system-spec-kit/scripts/spec/create.sh:338:    touch "$subfolder_path/memory/.gitkeep"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:504:        echo "          └── memory/           (independent context)"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:507:        echo "  Note: Each sub-folder has independent memory/ and scratch/ directories."
.opencode/skill/system-spec-kit/scripts/spec/create.sh:657:        touch "$FEATURE_DIR/scratch/.gitkeep" "$FEATURE_DIR/memory/.gitkeep"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:666:        touch "$FEATURE_DIR/scratch/.gitkeep" "$FEATURE_DIR/memory/.gitkeep"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:721:        if grep -q "<!-- ANCHOR:phase-map -->" "$PARENT_SPEC"; then
.opencode/skill/system-spec-kit/scripts/spec/create.sh:780:                /<!-- ANCHOR:phase-map -->/ {
.opencode/skill/system-spec-kit/scripts/spec/create.sh:793:                in_phase && /<!-- \/ANCHOR:phase-map -->/ && !inserted_handoff {
.opencode/skill/system-spec-kit/scripts/spec/create.sh:860:        touch "$_child_path/memory/.gitkeep" "$_child_path/scratch/.gitkeep"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:995:            echo "      │   └── memory/"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1000:        echo "      └── memory/           (context preservation)"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1057:touch "$FEATURE_DIR/scratch/.gitkeep" "$FEATURE_DIR/memory/.gitkeep"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1187:    echo "      └── memory/           (context preservation)"
.opencode/skill/system-spec-kit/scripts/spec/quality-audit.sh:66:    # Find directories containing spec.md, skip scratch/memory/node_modules
.opencode/skill/system-spec-kit/scripts/spec/quality-audit.sh:69:        -not -path "*/memory/*" \
.opencode/skill/system-spec-kit/scripts/kpi/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/kpi/README.md:18:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/kpi/README.md:26:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/kpi/README.md:30:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/kpi/README.md:32:The `kpi/` directory contains shell scripts that compute quality health metrics across memory files in the specs tree. The primary script, `quality-kpi.sh`, walks all `.md` files inside `memory/` subdirectories and reports defect rates as JSON plus a one-line stderr summary.
.opencode/skill/system-spec-kit/scripts/kpi/README.md:36:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/kpi/README.md:40:<!-- ANCHOR:structure -->
.opencode/skill/system-spec-kit/scripts/kpi/README.md:46:<!-- /ANCHOR:structure -->
.opencode/skill/system-spec-kit/scripts/kpi/README.md:50:<!-- ANCHOR:usage -->
.opencode/skill/system-spec-kit/scripts/kpi/README.md:71:<!-- /ANCHOR:usage -->
.opencode/skill/system-spec-kit/scripts/kpi/README.md:75:<!-- ANCHOR:metrics -->
.opencode/skill/system-spec-kit/scripts/kpi/README.md:84:| Empty trigger phrases rate | YAML frontmatter block has zero `trigger_phrases` entries |
.opencode/skill/system-spec-kit/scripts/kpi/README.md:88:<!-- /ANCHOR:metrics -->
.opencode/skill/system-spec-kit/scripts/kpi/README.md:92:<!-- ANCHOR:related-documents -->
.opencode/skill/system-spec-kit/scripts/kpi/README.md:95:- `.opencode/skill/system-spec-kit/scripts/memory/README.md` -- Memory pipeline CLIs
.opencode/skill/system-spec-kit/scripts/kpi/README.md:98:<!-- /ANCHOR:related-documents -->
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:43:// 3. ANCHOR VALIDATION
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:46:  const openPattern: RegExp = /<!-- (?:ANCHOR|anchor):([a-zA-Z0-9_-]+)/g;
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:47:  const closePattern: RegExp = /<!-- \/(?:ANCHOR|anchor):([a-zA-Z0-9_-]+)/g;
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:64:      warnings.push(`Unclosed anchor: ${anchor} (missing <!-- /ANCHOR:${anchor} -->)`);
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:80:    console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:9:import { validateMemoryQualityContent } from '../memory/validate-memory-quality';
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:149:  it('preserves ANCHOR comments while stripping non-anchor HTML comments outside code fences', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:153:      '<!-- ANCHOR:metadata -->',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:155:      '<!-- /ANCHOR:metadata -->',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:163:    expect(cleaned).toContain('<!-- ANCHOR:metadata -->');
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:164:    expect(cleaned).toContain('<!-- /ANCHOR:metadata -->');
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:229:      const anchorMatches = rendered.match(/<!--\s*\/?ANCHOR:[^>]+-->/g) ?? [];
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:241:      expect(frontmatter).toContain('trigger_phrases:');
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:244:      expect(frontmatter.match(/trigger_phrases:/g)?.length ?? 0).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:245:      expect(frontmatter).toMatch(/trigger_phrases:\n  - "/);
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:402:        TRIGGER_PHRASES_YAML: 'trigger_phrases: []',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:433:      expect(frontmatter).toContain('trigger_phrases: []');
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:435:      expect(frontmatter.match(/trigger_phrases:/g)?.length ?? 0).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:534:              prompt: 'Document why the literal example <!-- ANCHOR:id --> / <!-- /ANCHOR:id --> should be preserved as text in the memory body.',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:554:      const anchorMatches = rendered.match(/<!--\s*\/?ANCHOR:[^>]+-->/g) ?? [];
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:556:      expect(rendered).toContain('&lt;!-- ANCHOR:id --&gt;');
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:557:      expect(rendered).toContain('&lt;!-- /ANCHOR:id --&gt;');
.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts:11:import { validateMemoryQualityContent } from '../memory/validate-memory-quality';
.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts:33:    lines.push('trigger_phrases:');
.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts:70:    'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/setup/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/setup/README.md:17:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/setup/README.md:27:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/scripts/setup/README.md:30:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/setup/README.md:62:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/scripts/setup/README.md:65:<!-- ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/scripts/setup/README.md:95:<!-- /ANCHOR:quick-start -->

exec
/bin/zsh -lc "sed -n '520,640p' .opencode/skill/system-spec-kit/mcp_server/README.md && printf '\\n---\\n' && sed -n '599,630p' .opencode/skill/system-spec-kit/mcp_server/README.md && printf '\\n---\\n' && sed -n '610,620p' .opencode/skill/system-spec-kit/mcp_server/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '160,360p' .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts && printf '\\n---\\n' && sed -n '400,620p' .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts && printf '\\n---\\n' && sed -n '760,860p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

**Ablation study framework** -- turns off each search channel one at a time and measures quality degradation (Recall@20 delta). Identifies which components are critical.

**Shadow scoring with holdout evaluation** -- tests proposed ranking improvements on a fixed test set before they go live. A new approach only reaches production after it proves itself.

**Learned Stage 2 weight combiner** -- learns the best combination of scoring signals from actual usage data. Runs in shadow mode only, without affecting live results.

**Scoring observability** -- randomly samples scoring events and saves before-and-after snapshots for debugging.

---

#### 3.1.13 CODE GRAPH

The code graph system provides structural code analysis via tree-sitter AST parsing and SQLite storage. It maps what connects to what in the codebase: function calls, imports, class hierarchy and containment.

**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.

**Parser:** Tree-sitter WASM is the default parser (JS/TS/Python/Shell). Set `SPECKIT_PARSER=regex` for regex fallback.

**Storage:** `database/code-graph.sqlite` (separate from `database/context-index.sqlite`), with tables: `code_files`, `code_nodes`, `code_edges`, and `code_graph_metadata`.

**Edge types:** `CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, `DECORATES`, `OVERRIDES`, `TYPE_OF`.

**Read-path readiness:** `ensureCodeGraphReady()` runs automatically inside `code_graph_query` and `code_graph_context`. It checks graph freshness, returns a `readiness` block, and performs bounded inline selective reindex only when the stale set is small enough to repair safely on the read path. Empty graphs, large stale sets, and other full-scan cases remain explicit `code_graph_scan` work.

**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.

**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.

**Budget allocator floors:** constitutional 700, codeGraph 1200, cocoIndex 900, triggered 400, overflow pool 800 = 4000 total.

---

### 3.2 TOOL REFERENCE

All 47 tools listed by architecture layer. Each entry has a plain-language description and a parameter table. For full Zod schemas with types and defaults, see `tool-schemas.ts`.

**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.

---

#### L1: Orchestration (3 tools)

##### `memory_context`

The smart entry point. You describe what you need and it figures out the best way to find it. It reads your query, detects whether you are looking for a decision, debugging context or general knowledge, picks the right search mode and returns the most relevant results. Start here for almost everything.

| Parameter | Type | Notes |
|-----------|------|-------|
| `input` | string | **Required.** Your question or task description |
| `mode` | string | `auto` (default), `quick`, `deep`, `focused`, `resume` |
| `intent` | string | Override detected intent: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision` |
| `specFolder` | string | Narrow results to a specific spec folder |
| `tenantId` | string | Tenant boundary for governed retrieval |
| `userId` | string | User boundary for governed retrieval |
| `agentId` | string | Agent boundary for governed retrieval |
| `sharedSpaceId` | string | Shared-space boundary for governed retrieval |
| `limit` | number | Max results to return (default varies by mode) |
| `sessionId` | string | Session ID for deduplication across turns |
| `anchors` | string[] | Pull specific sections: `["state", "next-steps"]` |
| `tokenUsage` | number | Current token budget fraction (0.0-1.0) for adaptive depth |
| `enableDedup` | boolean | Skip memories already seen this session |
| `includeContent` | boolean | Include full memory content in response |
| `includeTrace` | boolean | Include retrieval trace for debugging |

```json
{
  "tool": "memory_context",
  "arguments": {
    "input": "implement JWT refresh token rotation",
    "intent": "add_feature",
    "specFolder": "specs/005-auth",
    "anchors": ["decisions", "next-steps"]
  }
}
```

---

##### `session_resume`

Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope resume to a specific spec folder |
| `minimal` | boolean | Skip heavy memory context, return code graph, CocoIndex, structural context, hints, and optional session quality without the full memory payload |

---

##### `session_bootstrap`

Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope bootstrap to a specific spec folder |

---

#### L2: Core (4 tools)

##### `memory_search`

The main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning (beyond keywords), so searching for "login problems" can find a document titled "authentication troubleshooting."

| Parameter | Type | Notes |
|-----------|------|-------|
| `query` | string | Free-text search (use `query` OR `concepts`, not both) |
| `concepts` | string[] | AND search: 2-5 strings that must all match |
| `specFolder` | string | Scope to a folder |
| `tenantId` | string | Tenant boundary |
| `userId` | string | User boundary |
| `agentId` | string | Agent boundary |
| `sharedSpaceId` | string | Shared-memory boundary |
| `limit` | number | 1-100 results (default 10) |
| `tier` | string | Filter by importance tier |
| `minState` | string | Minimum state: `HOT`, `WARM`, `COLD`, `DORMANT`, `ARCHIVED` |
| `rerank` | boolean | Apply cross-encoder reranking |
| `useDecay` | boolean | Apply FSRS decay to scores |
| `intent` | string | Adjust channel weights for task type |

---
##### `session_resume`

Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope resume to a specific spec folder |
| `minimal` | boolean | Skip heavy memory context, return code graph, CocoIndex, structural context, hints, and optional session quality without the full memory payload |

---

##### `session_bootstrap`

Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope bootstrap to a specific spec folder |

---

#### L2: Core (4 tools)

##### `memory_search`

The main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning (beyond keywords), so searching for "login problems" can find a document titled "authentication troubleshooting."

| Parameter | Type | Notes |
|-----------|------|-------|
| `query` | string | Free-text search (use `query` OR `concepts`, not both) |
| `concepts` | string[] | AND search: 2-5 strings that must all match |
| `specFolder` | string | Scope to a folder |

---
##### `session_bootstrap`

Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope bootstrap to a specific spec folder |

---

#### L2: Core (4 tools)

 succeeded in 0ms:
   3. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_bootstrap tool call — one-call session setup */
export async function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse> {
  const startMs = Date.now();
  const allHints: string[] = [];

  // Sub-call 1: session_resume with full resume payload
  let resumeData: Record<string, unknown> = {};
  try {
    const resumeResponse = await handleSessionResume({
      specFolder: args.specFolder,
    });
    resumeData = extractData(resumeResponse);
    allHints.push(...extractHints(resumeData));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    resumeData = { error: message };
    allHints.push('session_resume failed. Try calling it manually.');
  }

  // Sub-call 2: session_health
  let healthData: Record<string, unknown> = {};
  try {
    const healthResponse = await handleSessionHealth();
    healthData = extractData(healthResponse);
    allHints.push(...extractHints(healthData));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    healthData = { error: message };
    allHints.push('session_health failed. Try calling it manually.');
  }

  // Phase 027: Structural bootstrap contract
  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
    allHints.push(
      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
    );
  }

  const cachedSummary = extractCachedSummary(resumeData);
  if (cachedSummary?.status === 'accepted') {
    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
  }
  const structuralRoutingNudge = buildStructuralRoutingNudge(structuralContext);
  if (structuralRoutingNudge) {
    allHints.push(structuralRoutingNudge.message);
  }

  // Deduplicate hints
  const uniqueHints = [...new Set(allHints)];

  // Record bootstrap telemetry once for the composite call.
  const durationMs = Date.now() - startMs;
  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
  recordBootstrapEvent('tool', durationMs, completeness);

  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
  const healthCertainty: SharedPayloadCertainty = healthData.error ? 'unknown' : 'estimated';
  const cachedCertainty: SharedPayloadCertainty = cachedSummary?.status === 'accepted' ? 'estimated' : 'defaulted';
  const structuralCertainty: SharedPayloadCertainty = 'exact';
  const nextActionsCertainty: SharedPayloadCertainty = 'defaulted';
  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
  const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
  const structuralSnapshotTrust = buildStructuralContextTrust(structuralContext);
  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
  if (!resumeData.error && !resumeStructuralTrust) {
    throw new StructuralTrustPayloadError(
      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
    );
  }
  const structuralContextWithTrust = attachStructuralTrustFields(
    structuralContext,
    structuralSnapshotTrust,
    { label: 'session_bootstrap structural context payload' },
  );
  const resumeWithTrust = resumeData.error
    ? resumeData
    : attachStructuralTrustFields(
      resumeData,
      resumeStructuralTrust,
      { label: 'session_bootstrap resume payload' },
    );

  const payloadSections: SharedPayloadSection[] = [
    {
      key: 'resume-surface',
      title: 'Resume Surface',
      content: summarizeUnknown(resumeData),
      source: 'memory',
      certainty: resumeCertainty,
    },
  ];
  if (cachedSummary?.status === 'accepted' && cachedSummary.cachedSummary) {
    payloadSections.push({
      key: 'cached-continuity',
      title: 'Cached Continuity',
      content: [
        cachedSummary.cachedSummary.continuityText,
        `Cache tokens: create=${cachedSummary.cachedSummary.cacheCreationInputTokens}; read=${cachedSummary.cachedSummary.cacheReadInputTokens}`,
        `Transcript: ${cachedSummary.cachedSummary.transcriptFingerprint}`,
      ].join(' | '),
      source: 'session',
      certainty: cachedCertainty,
    });
  }
  payloadSections.push(
    {
      key: 'health-surface',
      title: 'Health Surface',
      content: summarizeUnknown(healthData),
      source: 'operational',
      certainty: healthCertainty,
    },
    {
      key: 'structural-context',
      title: 'Structural Context',
      // This section carries trust derived from the local structural snapshot,
      // which remains valid even when the remote resume surface fails closed.
      content: structuralContext.summary,
      source: 'code-graph',
      certainty: structuralCertainty,
      structuralTrust: structuralSnapshotTrust,
    },
    {
      key: 'next-actions',
      title: 'Next Actions',
      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
      source: 'session',
      certainty: nextActionsCertainty,
    },
  );

  const payloadContract = createSharedPayloadEnvelope({
    kind: 'bootstrap',
    sections: payloadSections,
    summary: `Bootstrap payload: ${summarizeCertaintyContract([
      { label: 'resume', certainty: resumeCertainty },
      { label: 'health', certainty: healthCertainty },
      ...(cachedSummary?.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
      { label: 'structural', certainty: structuralCertainty },
      { label: 'nextActions', certainty: nextActionsCertainty },
    ])}; structuralStatus=${structuralContext.status}`,
    provenance: {
      producer: 'session_bootstrap',
      sourceSurface: 'session_bootstrap',
      trustState: trustStateFromStructuralStatus(structuralContext.status),
      generatedAt: new Date().toISOString(),
      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
    },
  });
  const graphOps = buildCodeGraphOpsContract({
    graphFreshness: structuralContext.status === 'ready'
      ? 'fresh'
      : structuralContext.status === 'stale'
        ? 'stale'
        : 'empty',
    sourceSurface: 'session_bootstrap',
  });

  const result: SessionBootstrapResult = {
    resume: resumeWithTrust,
    health: healthData,
    ...(cachedSummary ? { cachedSummary } : {}),
    structuralContext: structuralContextWithTrust,
    ...(structuralRoutingNudge ? { structuralRoutingNudge } : {}),
    payloadContract,
    opencodeTransport: buildOpenCodeTransportPlan({
      bootstrapPayload: payloadContract,
      resumePayload,
      healthPayload,
      specFolder: args.specFolder ?? null,
    }),
    graphOps,
    hints: uniqueHints,
    // Keep advisory routing guidance out of nextActions so bootstrap and resume
    // remain the authoritative recovery owners for startup and deep resume flows.
    nextActions: buildNextActions(resumeData, healthData, structuralContext),
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
    structuredContent: result,
  };
}

---
/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
  // F052: Record memory recovery metric for session_resume
  recordMetricEvent({ kind: 'memory_recovery' });

  // Phase 024: Record bootstrap telemetry
  const startMs = Date.now();
  const hints: string[] = [];

  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
  let memoryResult: Record<string, unknown> = {};
  if (args.minimal) {
    memoryResult = { skipped: true, reason: 'minimal mode' };
  } else {
    try {
      const mcpResponse = await handleMemoryContext({
        input: 'resume previous work continue session',
        mode: 'resume',
        profile: 'resume',
        specFolder: args.specFolder,
      });
      // Extract data from MCP envelope
      if (mcpResponse?.content?.[0]?.text) {
        try {
          const parsed = JSON.parse(mcpResponse.content[0].text);
          memoryResult = parsed?.data ?? parsed ?? {};
        } catch {
          memoryResult = { raw: mcpResponse.content[0].text };
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      memoryResult = { error: message };
      hints.push('Memory resume failed. Try memory_context manually.');
    }
  }

  // ── Sub-call 2: Code graph status ───────────────────────────
  let codeGraph: CodeGraphStatus = {
    status: 'error',
    lastScan: null,
    nodeCount: 0,
    edgeCount: 0,
    fileCount: 0,
  };
  try {
    const stats = graphDb.getStats();
    const freshness = getGraphFreshness(process.cwd());
    codeGraph = {
      status: freshness,
      lastScan: stats.lastScanTimestamp,
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
      fileCount: stats.totalFiles,
    };
    // Graph status hints deferred to structural contract (Phase 027)
    // — structural context hints at lines 128-130 provide preferred recovery path
  } catch {
    codeGraph = { status: 'error', lastScan: null, nodeCount: 0, edgeCount: 0, fileCount: 0 };
    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
  }

  // ── Sub-call 3: CocoIndex availability (F046/F051: shared helper) ──
  const cocoIndex: CocoIndexStatus = {
    available: isCocoIndexAvailable(),
    binaryPath: '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc',
  };
  if (!cocoIndex.available) {
    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
  }

  // Phase 027: Structural bootstrap contract for resume surface
  const structuralContext = buildStructuralBootstrapContract('session_resume');
  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
  }

  const structuralTrust = buildStructuralContextTrust(structuralContext);

  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
  const cachedSummaryDecision = getCachedSessionSummaryDecision({
    specFolder: args.specFolder,
    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
  });
  if (cachedSummaryDecision.status === 'accepted') {
    hints.push('Cached continuity summary accepted as additive resume context.');
  } else {
    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
  }

  let sessionQuality: SessionResumeResult['sessionQuality'];
  if (args.minimal) {
    try {
      sessionQuality = computeQualityScore().level;
    } catch {
      sessionQuality = 'unknown';
    }
  }

  const memoryCertainty: SharedPayloadCertainty = args.minimal
    ? 'defaulted'
    : memoryResult.error
      ? 'unknown'
      : 'estimated';
  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
  const codeGraphCertainty: SharedPayloadCertainty = codeGraph.status === 'error' ? 'unknown' : 'exact';
  const cocoIndexCertainty: SharedPayloadCertainty = 'exact';
  const structuralCertainty: SharedPayloadCertainty = 'exact';

  const payloadSections: SharedPayloadSection[] = [
    {
      key: 'memory-resume',
      title: 'Memory Resume',
      content: summarizeUnknown(memoryResult),
      source: 'memory',
      certainty: memoryCertainty,
    },
  ];
  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
    payloadSections.push({
      key: 'cached-continuity',
      title: 'Cached Continuity',
      content: [
        cachedSummaryDecision.cachedSummary.continuityText,
        `Cache tokens: create=${cachedSummaryDecision.cachedSummary.cacheCreationInputTokens}; read=${cachedSummaryDecision.cachedSummary.cacheReadInputTokens}`,
        `Transcript: ${cachedSummaryDecision.cachedSummary.transcriptFingerprint}`,
      ].join('\n'),
      source: 'session',
      certainty: cachedCertainty,
    });
  }
  payloadSections.push(
    {
      key: 'code-graph-status',
      title: 'Code Graph Status',
      content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,
      source: 'code-graph',
      certainty: codeGraphCertainty,
    },
    {
      key: 'cocoindex-status',
      title: 'CocoIndex Status',
      content: cocoIndex.available
        ? `available at ${cocoIndex.binaryPath}`
        : `unavailable; expected at ${cocoIndex.binaryPath}`,
      source: 'semantic',
      certainty: cocoIndexCertainty,
    },
    {
      key: 'structural-context',
      title: 'Structural Context',
      content: structuralContext.summary,
      source: 'code-graph',
      certainty: structuralCertainty,
      structuralTrust,
    },
  );

  // ── Build composite result ──────────────────────────────────
  const payloadContract = createSharedPayloadEnvelope({
    kind: 'resume',
    sections: payloadSections,
    summary: `Resume payload: ${summarizeCertaintyContract([
      { label: 'memory', certainty: memoryCertainty },
      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
      { label: 'graph', certainty: codeGraphCertainty },
      { label: 'cocoindex', certainty: cocoIndexCertainty },
      { label: 'structural', certainty: structuralCertainty },
    ])}; graph=${codeGraph.status}; graphStatus=${codeGraph.status}`,
    provenance: {
      producer: 'session_resume',
      sourceSurface: 'session_resume',
      trustState: trustStateFromStructuralStatus(structuralContext.status),
      generatedAt: new Date().toISOString(),
      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
    },
  });
  const graphOps = buildCodeGraphOpsContract({
    graphFreshness: codeGraph.status as GraphFreshness,
    sourceSurface: 'session_resume',
  });

  const result: SessionResumeResult = {
    memory: memoryResult,
    codeGraph,
    cocoIndex,
    cachedSummary: cachedSummaryDecision,
    structuralContext,
    payloadContract,
    opencodeTransport: buildOpenCodeTransportPlan({
      resumePayload: payloadContract,
      specFolder: args.specFolder ?? null,
    }),
    graphOps,
    ...(sessionQuality ? { sessionQuality } : {}),
    hints,
  };

  // Phase 024 / Item 9: Record bootstrap telemetry
  if (!args.minimal) {
    recordBootstrapEvent(
      'tool',
      Date.now() - startMs,
      'full',
    );
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
  };
}

---
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
    agentId: args.agentId,
  });
  if (trustedSession.error) {
    return {
      requestedSessionId: trustedSession.requestedSessionId,
      effectiveSessionId: '',
      resumed: false,
      priorMode: null,
      counter: 0,
      error: trustedSession.error,
    };
  }

  const requestedSessionId = trustedSession.requestedSessionId;
  const effectiveSessionId = trustedSession.effectiveSessionId;
  const resumed = trustedSession.trusted;
  const priorMode = resumed
    ? workingMemory.getSessionInferredMode(effectiveSessionId)
    : null;
  const counter = resumed
    ? workingMemory.getSessionEventCounter(effectiveSessionId)
    : 0;

  return {
    requestedSessionId,
    effectiveSessionId,
    resumed,
    priorMode,
    counter,
  };

exec
/bin/zsh -lc 'find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace -maxdepth 1 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/__init__.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/__main__.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/config.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dedup.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/dialect.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_detector.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions_cli.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/migrate.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/normalize.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/py.typed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/repair.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/room_detector_local.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/spellcheck.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/split_mega_files.py
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/version.py

exec
/bin/zsh -lc 'find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external -maxdepth 2 -type d | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/.agents
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/.agents/plugins
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/.claude-plugin
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/.claude-plugin/commands
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/.claude-plugin/hooks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/.claude-plugin/skills
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/.codex-plugin
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/.codex-plugin/hooks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/.codex-plugin/skills
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/.github
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/.github/ISSUE_TEMPLATE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/.github/workflows
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/assets
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/examples
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/integrations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/integrations/openclaw
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/instructions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/tests/benchmarks

exec
/bin/zsh -lc "sed -n '1,120p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/__init__.py && printf '\\n---\\n' && sed -n '1,80p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/__main__.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"""MemPalace — Give your AI a memory. No API key required."""

import logging
import os
import platform

from .cli import main  # noqa: E402
from .version import __version__  # noqa: E402

# ChromaDB 0.6.x ships a Posthog telemetry client whose capture() signature is
# incompatible with the bundled posthog library, producing noisy stderr warnings
# on every client operation ("Failed to send telemetry event … capture() takes
# 1 positional argument but 3 were given").  Silence just that logger.
logging.getLogger("chromadb.telemetry.product.posthog").setLevel(logging.CRITICAL)

# ONNX Runtime's CoreML provider segfaults during vector queries on Apple Silicon.
# Force CPU execution unless the user has explicitly set a preference.
if platform.machine() == "arm64" and platform.system() == "Darwin":
    os.environ.setdefault("ORT_DISABLE_COREML", "1")

__all__ = ["main", "__version__"]

---
"""Allow running as: python -m mempalace"""

from .cli import main

main()

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/config.py" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"""
MemPalace configuration system.

Priority: env vars > config file (~/.mempalace/config.json) > defaults
"""

import json
import os
import re
from pathlib import Path


# ── Input validation ──────────────────────────────────────────────────────────
# Shared sanitizers for wing/room/entity names. Prevents path traversal,
# excessively long strings, and special characters that could cause issues
# in file paths, SQLite, or ChromaDB metadata.

MAX_NAME_LENGTH = 128
_SAFE_NAME_RE = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9_ .'-]{0,126}[a-zA-Z0-9]?$")


def sanitize_name(value: str, field_name: str = "name") -> str:
    """Validate and sanitize a wing/room/entity name.

    Raises ValueError if the name is invalid.
    """
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field_name} must be a non-empty string")

    value = value.strip()

    if len(value) > MAX_NAME_LENGTH:
        raise ValueError(f"{field_name} exceeds maximum length of {MAX_NAME_LENGTH} characters")

    # Block path traversal
    if ".." in value or "/" in value or "\\" in value:
        raise ValueError(f"{field_name} contains invalid path characters")

    # Block null bytes
    if "\x00" in value:
        raise ValueError(f"{field_name} contains null bytes")

    # Enforce safe character set
    if not _SAFE_NAME_RE.match(value):
        raise ValueError(f"{field_name} contains invalid characters")

    return value


def sanitize_content(value: str, max_length: int = 100_000) -> str:
    """Validate drawer/diary content length."""
    if not isinstance(value, str) or not value.strip():
        raise ValueError("content must be a non-empty string")
    if len(value) > max_length:
        raise ValueError(f"content exceeds maximum length of {max_length} characters")
    if "\x00" in value:
        raise ValueError("content contains null bytes")
    return value


DEFAULT_PALACE_PATH = os.path.expanduser("~/.mempalace/palace")
DEFAULT_COLLECTION_NAME = "mempalace_drawers"

DEFAULT_TOPIC_WINGS = [
    "emotions",
    "consciousness",
    "memory",
    "technical",
    "identity",
    "family",
    "creative",
]

DEFAULT_HALL_KEYWORDS = {
    "emotions": [
        "scared",
        "afraid",
        "worried",
        "happy",
        "sad",
        "love",
        "hate",
        "feel",
        "cry",
        "tears",
    ],
    "consciousness": [
        "consciousness",
        "conscious",
        "aware",
        "real",
        "genuine",
        "soul",
        "exist",
        "alive",
    ],
    "memory": ["memory", "remember", "forget", "recall", "archive", "palace", "store"],
    "technical": [
        "code",
        "python",
        "script",
        "bug",
        "error",
        "function",
        "api",
        "database",
        "server",
    ],
    "identity": ["identity", "name", "who am i", "persona", "self"],
    "family": ["family", "kids", "children", "daughter", "son", "parent", "mother", "father"],
    "creative": ["game", "gameplay", "player", "app", "design", "art", "music", "story"],
}


class MempalaceConfig:
    """Configuration manager for MemPalace.

    Load order: env vars > config file > defaults.
    """

    def __init__(self, config_dir=None):
        """Initialize config.

        Args:
            config_dir: Override config directory (useful for testing).
                        Defaults to ~/.mempalace.
        """
        self._config_dir = (
            Path(config_dir) if config_dir else Path(os.path.expanduser("~/.mempalace"))
        )
        self._config_file = self._config_dir / "config.json"
        self._people_map_file = self._config_dir / "people_map.json"
        self._file_config = {}

        if self._config_file.exists():
            try:
                with open(self._config_file, "r") as f:
                    self._file_config = json.load(f)
            except (json.JSONDecodeError, OSError):
                self._file_config = {}

    @property
    def palace_path(self):
        """Path to the memory palace data directory."""
        env_val = os.environ.get("MEMPALACE_PALACE_PATH") or os.environ.get("MEMPAL_PALACE_PATH")
        if env_val:
            return env_val
        return self._file_config.get("palace_path", DEFAULT_PALACE_PATH)

    @property
    def collection_name(self):
        """ChromaDB collection name."""
        return self._file_config.get("collection_name", DEFAULT_COLLECTION_NAME)

    @property
    def people_map(self):
        """Mapping of name variants to canonical names."""
        if self._people_map_file.exists():
            try:
                with open(self._people_map_file, "r") as f:
                    return json.load(f)
            except (json.JSONDecodeError, OSError):
                pass
        return self._file_config.get("people_map", {})

    @property
    def topic_wings(self):
        """List of topic wing names."""
        return self._file_config.get("topic_wings", DEFAULT_TOPIC_WINGS)

    @property
    def hall_keywords(self):
        """Mapping of hall names to keyword lists."""
        return self._file_config.get("hall_keywords", DEFAULT_HALL_KEYWORDS)

    def init(self):
        """Create config directory and write default config.json if it doesn't exist."""
        self._config_dir.mkdir(parents=True, exist_ok=True)
        # Restrict directory permissions to owner only (Unix)
        try:
            self._config_dir.chmod(0o700)
        except (OSError, NotImplementedError):
            pass  # Windows doesn't support Unix permissions
        if not self._config_file.exists():
            default_config = {
                "palace_path": DEFAULT_PALACE_PATH,
                "collection_name": DEFAULT_COLLECTION_NAME,
                "topic_wings": DEFAULT_TOPIC_WINGS,
                "hall_keywords": DEFAULT_HALL_KEYWORDS,
            }
            with open(self._config_file, "w") as f:
                json.dump(default_config, f, indent=2)
            # Restrict config file to owner read/write only
            try:
                self._config_file.chmod(0o600)
            except (OSError, NotImplementedError):
                pass
        return self._config_file

    def save_people_map(self, people_map):
        """Write people_map.json to config directory.

        Args:
            people_map: Dict mapping name variants to canonical names.
        """
        self._config_dir.mkdir(parents=True, exist_ok=True)
        with open(self._people_map_file, "w") as f:
            json.dump(people_map, f, indent=2)
        return self._people_map_file

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/docs/schema.sql" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
-- MemPalace Knowledge Graph Schema
-- SQLite database at ~/.mempalace/knowledge_graph.db

CREATE TABLE IF NOT EXISTS entities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'unknown',
    properties TEXT DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS triples (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    predicate TEXT NOT NULL,
    object TEXT NOT NULL,
    valid_from TEXT,
    valid_to TEXT,
    confidence REAL DEFAULT 1.0,
    source_closet TEXT,
    source_file TEXT
);

CREATE TABLE IF NOT EXISTS attributes (
    entity_id TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    valid_from TEXT,
    valid_to TEXT,
    PRIMARY KEY (entity_id, key, valid_from)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_triples_subject ON triples(subject);
CREATE INDEX IF NOT EXISTS idx_triples_object ON triples(object);
CREATE INDEX IF NOT EXISTS idx_triples_predicate ON triples(predicate);
CREATE INDEX IF NOT EXISTS idx_triples_valid ON triples(valid_from, valid_to);

codex
I’ve got enough to assemble a solid architecture map now. Before I write it up, I’m doing one final pass on the comparison evidence and the prior-memory notes I actually relied on so the summary stays tight, explicit about validation limits, and cleanly separated into source-confirmed versus README-only claims.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '288,300p' && printf '\\n---\\n' && nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '393,440p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---
   393	- for newly created child packets, keep full Level 3 artifacts (`spec/plan/tasks/checklist/decision-record/implementation-summary/description`), remove README scaffolds, run strict validation per child, then validate parent with `--no-recursive` to confirm phase-link and parent metadata wiring [Task 8]
   394	
   395	## Failures and how to do differently
   396	
   397	- symptom: strict validation step in prompt cannot run; cause: phase lacks Level 3 docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`); fix: create/verify those docs before running `validate.sh --strict` or deep research loops [Task 1]
   398	- symptom: strict validation shows `ANCHORS_VALID` warnings in `decision-record.md`; cause: extra non-template `adr-*` anchor comment lines; fix: remove only the extra comment anchors (not the ADR sections), then rerun recursive `validate.sh --strict` to confirm 0 errors/0 warnings [Task 5]
   399	- symptom: large multi-file memory patch fails to apply cleanly; cause: generated memory snapshots drift from expected formatting; fix: use smaller per-file patches on the latest packet snapshots and revalidate after each batch [Task 5]
   400	- symptom: closeout validation passes but memory index reports lineage mismatch/stale packet rows; cause: old memory_index entries persisted through packet updates; fix: delete stale row IDs, wait out cooldown, then force `memory_index_scan` and confirm zero failed entries before marking complete [Task 7]
   401	- symptom: new phase packets fail strict checks with `AI_PROTOCOL`, `SECTION_COUNTS`, or `SPEC_DOC_INTEGRITY`; cause: scaffold docs left template-thin (missing AI Execution Protocol blocks, acceptance scenarios, anchors) or README placeholders were kept; fix: fill Level 3 templates immediately and delete scaffold READMEs before rerunning strict validation [Task 8]
   402	
   403	# Task Group: Research-Agentic-Systems Phase Prompt Gating (Level 3 Before Deep Research)
   404	scope: per-phase prompt artifacts that enforce Level 3 Spec Kit documentation before `spec_kit:deep-research` against each phase `external/` tree
   405	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems; reuse_rule=reuse for this phase-family prompt workflow in this checkout, keeping prompt artifacts as `phase-research-prompt.md` in each phase root and research outputs in packet docs
   406	
   407	## Task 1: Add `phase-research-prompt.md` in phases 001-007 with Level 3-before-research gates, outcome success
   408	
   409	### rollout_summary_files
   410	
   411	- rollout_summaries/2026-04-04T15-43-31-Svpz-research_agentic_system_phase_prompts.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/04/rollout-2026-04-04T17-43-31-019d5929-e78c-73c1-bd08-74488a2b61bd.jsonl, updated_at=2026-04-04T15:53:59+00:00, thread_id=019d5929-e78c-73c1-bd08-74488a2b61bd)
   412	
   413	### keywords
   414	
   415	- 999-feature-roadmap, 001-research-agentic-systems, phase-research-prompt.md, Level 3 Spec Kit docs, spec_kit:deep-research, external/
   416	
   417	## Task 2: Replicate `phase-research-prompt.md` for phases 008/009 in phase roots and keep skip-spec-folder scope, outcome success
   418	
   419	### rollout_summary_files
   420	
   421	- rollout_summaries/2026-04-05T11-36-07-phNv-spec_prompt_and_git_push.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/05/rollout-2026-04-05T13-36-07-019d5d6d-c162-7af1-bee7-941955ca7389.jsonl, updated_at=2026-04-05T11:47:10+00:00, thread_id=019d5d6d-c162-7af1-bee7-941955ca7389)
   422	
   423	### keywords
   424	
   425	- 008-bmad-autonomous-development, 009-xethryon, phase-research-prompt.md, skip spec folder, 001-research-agentic-systems, Level 3 docs before deep research
   426	
   427	## User preferences
   428	
   429	- when the user asked to “Add a prompt in each phase folder ... create level 3 speckit documentation ... utilize spec_kit:deep-research BUT need to create proper spec documentation in the folder first,” prompts should enforce: use the existing phase folder, author Level 3 docs first, then research that phase `external/` tree with evidence-backed outcomes and checklist/implementation-summary/memory updates [Task 1]
   430	- when the user asked to “create a similar prompt ... in their root folders | skip spec folder,” place `phase-research-prompt.md` in each phase root and avoid spinning up new spec-folder scaffolding [Task 2]
   431	
   432	## Reusable knowledge
   433	
   434	- in this repo `specs/` is a symlink to `.opencode/specs`; phase prompt/spec work should be applied under `.opencode/specs/...` paths [Task 1]
   435	- prompt artifact placement for this phase family is phase-root `phase-research-prompt.md` (not `scratch/`) and should reference that phase’s own `external/` tree [Task 1][Task 2]
   436	- gate sequence that worked: validate phase docs first with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <phase-path> --strict`, then run `spec_kit:deep-research`, then generate context/memory artifacts [Task 1][Task 2]
   437	
   438	## Failures and how to do differently
   439	
   440	- no failures observed; preserve the same gate order (Level 3 docs -> strict validate -> deep research) to avoid exploratory research before folder documentation is ready [Task 1]

2026-04-10T19:22:34.066480Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "python3 - <<'PY'
from pathlib import Path
base = Path('/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public')
files = [
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh',
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md',
'.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts',
'.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts',
'.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts',
'.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts',
'.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js',
'.opencode/plugins/spec-kit-compact-code-graph.js',
]
for rel in files:
    p = base/rel
    try:
        n = sum(1 for _ in p.open())
    except Exception as e:
        n = f'ERR:{e}'
    print(f'{rel}::{n}')
PY"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
exec
/bin/zsh -lc "rg -n \"run_onboarding|quick_setup|critical_facts|entity_registry|onboarding\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:563:mempalace init <dir>                              # guided onboarding + AAAK bootstrap
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:644:| `onboarding.py` | Guided setup — generates AAAK bootstrap + wing config |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:645:| `entity_registry.py` | Entity code registry |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md:667:│   ├── onboarding.py          ← guided setup
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:3:entity_registry.py — Persistent personal entity registry for MemPalace.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:12:    from mempalace.entity_registry import EntityRegistry
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:15:    # → {"type": "person", "confidence": 1.0, "source": "onboarding"}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:269:    Stored at ~/.mempalace/entity_registry.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:276:          "source": "onboarding",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:291:    DEFAULT_PATH = Path.home() / ".mempalace" / "entity_registry.json"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:301:        path = (Path(config_dir) / "entity_registry.json") if config_dir else cls.DEFAULT_PATH
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:343:    # ── Seed from onboarding ─────────────────────────────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:347:        Seed the registry from onboarding data.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:367:                "source": "onboarding",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:378:                    "source": "onboarding",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:406:             "source": "onboarding"|"learned"|"wiki"|"inferred",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/entity_registry.py:435:                    "source": "onboarding",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/README.md:20:| `onboarding.py` | Guided first-run setup — asks about people/projects, generates AAAK bootstrap + wing config |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/README.md:21:| `entity_registry.py` | Entity code registry — maps names to AAAK codes, handles ambiguous names |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/spellcheck.py:118:        from mempalace.entity_registry import EntityRegistry
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:3:onboarding.py — MemPalace first-run setup.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:11:Seeds the entity_registry with confirmed data so MemPalace knows your world
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:15:    python3 -m mempalace.onboarding
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:20:from mempalace.entity_registry import EntityRegistry
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:252:    from mempalace.entity_registry import COMMON_ENGLISH_WORDS
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:262:# Main onboarding flow
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:270:    Generate AAAK entity registry + critical facts bootstrap from onboarding data.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:362:    (mempalace_dir / "critical_facts.md").write_text("\n".join(facts_lines), encoding="utf-8")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:365:def run_onboarding(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:371:    Run the full onboarding flow.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:446:    print("  Critical facts bootstrap: ~/.mempalace/critical_facts.md")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:458:def quick_setup(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/onboarding.py:489:    run_onboarding(directory=directory)

codex
# Iteration 001: ARCHITECTURE OVERVIEW

## Focus
ARCHITECTURE OVERVIEW: Scan repository structure, key directories, main entry points, README, and architecture docs. Map high-level components and data flow.

## Findings
### Finding 1: MemPalace is really four subsystems around one shared local store boundary
- **Source**: [external/pyproject.toml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml), [external/mempalace/cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L39), [external/mempalace/palace.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace.py#L37), [external/mempalace/knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L49), [external/hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md)
- **What it does**: The package exposes one `mempalace` CLI entrypoint, then fans into project/conversation ingest, ChromaDB drawer retrieval, a separate SQLite temporal KG, and hook-triggered save timing. The real runtime split is: `cli.py` dispatches commands, `palace.py` owns Chroma collection access, `knowledge_graph.py` owns fact storage, and `hooks_cli.py` controls preservation timing.
- **Why it matters for us**: This is a clean architectural separation: verbatim corpus, fact graph, and save-timing automation are not collapsed into one retrieval layer. Public already separates semantic memory, code search, and code graph; MemPalace reinforces that this split is a strength, not accidental complexity.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: The raw-verbatim posture is source-confirmed, but “closets” are mostly product language in this version
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L190), [external/mempalace/miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py#L325), [external/mempalace/searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L21), [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L76)
- **What it does**: The code really does store drawer chunks as verbatim text in `mempalace_drawers` and search those drawers directly. But there is no first-class closet store in the implementation path I traced; L1 is generated on the fly from top drawers, and deep search goes straight against Chroma. The README’s closet language is more conceptual than storage-structural right now.
- **Why it matters for us**: The useful part is not “closets” as branding; it is raw retention plus lightweight derived views. Public can borrow the posture without copying the metaphor.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Agent discipline is embedded into the MCP surface, not left to prompts alone
- **Source**: [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L139), [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L450)
- **What it does**: `mempalace_status` returns counts plus `PALACE_PROTOCOL` and `AAAK_SPEC`, so the first read call doubles as behavioral bootstrapping. The server also cleanly splits read tools, write tools, navigation tools, KG tools, and diary tools, with stderr logging and a write-ahead log for writes.
- **Why it matters for us**: Public already has stronger recovery surfaces (`session_bootstrap`, `session_resume`, `memory_context`), but MemPalace is better at making the memory protocol agent-visible right where the agent starts. That could improve recall ergonomics without inventing a new retrieval backend.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: The wake-up stack is real, but the implementation is simpler than the README framing
- **Source**: [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L34), [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L76), [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L185), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L275)
- **What it does**: L0 is just `~/.mempalace/identity.txt`. L1 is not a maintained summary layer; it is regenerated from the highest-weight drawers, grouped by room. L2 is metadata-filtered `get()`, and L3 is semantic `query()`. So the stack exists, but only L0/L1 are “wake-up” in practice; the rest are normal retrieval modes.
- **Why it matters for us**: Public’s session recovery is already more explicit and richer than this, but MemPalace contributes a good mental model: cheap always-on identity plus a bounded always-on story layer before full retrieval.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Palace graph traversal and temporal KG are separate systems with different truth models
- **Source**: [external/mempalace/palace_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py#L33), [external/mempalace/knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L49), [external/docs/schema.sql](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/docs/schema.sql)
- **What it does**: `palace_graph.py` derives room tunnels from Chroma metadata only; it is a navigational overlay, not a fact database. `knowledge_graph.py` is a separate SQLite triple store with `valid_from`/`valid_to`, explicit invalidation, and timelines. They solve different problems and are intentionally not fused.
- **Why it matters for us**: This is a strong pattern for Public: keep verbatim memory provenance and fact-like temporal assertions separate, so invalidation and fact drift do not contaminate raw session evidence.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 6: Ingestion is not “store everything untouched”; it is chunk-and-route with heuristic restructuring on some paths
- **Source**: [external/mempalace/miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py#L278), [external/mempalace/miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py#L325), [external/mempalace/convo_miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py#L39), [external/mempalace/general_extractor.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py#L1)
- **What it does**: Project ingest chunks files into overlapping ~800-char drawers and routes them by folder/name/keyword heuristics. Conversation ingest chunks by exchange pair or paragraph fallback. `general_extractor.py` goes further and classifies text into decisions, preferences, milestones, problems, and emotions. So raw retention is true at the drawer level, but not at the “unaltered original session object” level.
- **Why it matters for us**: The useful lesson is selective restructuring by ingest mode, not a literal “never transform anything” dogma. Public should compare this carefully against `generate-context.js`, which preserves curated session semantics instead of blindly chunking transcripts.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 7: Hook-driven preservation is a timing architecture, not a storage architecture
- **Source**: [external/mempalace/hooks_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py#L129), [external/mempalace/hooks_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py#L189), [external/hooks/mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh), [external/hooks/mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh)
- **What it does**: The stop hook blocks every 15 human messages; the precompact hook always blocks. The shell and Python paths both use “block with a reason” so the agent performs the save, optionally followed by auto-ingest. This architecture protects context before loss without needing a richer storage model.
- **Why it matters for us**: Public already has compaction transport via the compact-code-graph plugin, but MemPalace has a stronger explicit checkpointing posture. The idea worth stealing is the enforced preservation checkpoint, not the exact bash implementation.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 8: Public already beats MemPalace on session bootstrap sophistication, but MemPalace beats Public on memory protocol ergonomics
- **Source**: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L486), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L400), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L811), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L62), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L1), [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169)
- **What it does**: Public has a much deeper retrieval stack: hybrid pipeline search, session dedup, intent routing, `memory_context`, `session_resume`, `session_bootstrap`, JSON-primary context capture, and compaction-safe structural transport. MemPalace is simpler, but its status/bootstrap surface is better at teaching the agent when to query, verify, write diaries, and invalidate facts.
- **Why it matters for us**: The architecture takeaway is asymmetric. Public should not copy MemPalace’s backend wholesale. It should selectively import raw-verbatim retention ideas, checkpoint hooks, and protocol-forward memory UX.
- **Recommendation**: adopt now
- **Impact**: high

## Sources Consulted
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
- [external/hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md)
- [external/benchmarks/BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)

## Assessment
- New information ratio: 0.78
- Questions addressed: raw-verbatim posture, taxonomy usefulness, wake-up layering, MCP protocol/tool design, hook-driven save timing, temporal KG separation, ingest behavior, benchmark truthfulness boundary, comparison against Public memory/bootstrap/compaction
- Questions answered: raw storage is real but chunked and heuristic-routed; taxonomy is partly useful metadata discipline and partly framing; wake-up layers are implemented but simpler than marketed; MCP status-as-protocol is a genuine differentiator; hooks are the strongest compaction-survival idea; KG and palace graph are intentionally separate; benchmark claims need careful source-vs-doc separation; Public already leads on bootstrap/recovery depth

## Reflection
- What worked: tracing the repo in runtime order after the README correction note made the architecture much clearer than reading the benchmark story first; comparing `mcp_server.py`, `layers.py`, and `hooks_cli.py` against Public’s `session_bootstrap` and `generate-context.js` exposed the real differentiators quickly
- What did not work: the requested strict validation step is not trustworthy in this read-only run; the phase folder is missing the required Level 3 docs, and `validate.sh --strict` still reported `RESULT: PASSED` after `cannot create temp file for here document: Operation not permitted`, so I did not treat that as a real readiness pass; I also did not run the workflow-owned `spec_kit:deep-research` or write packet artifacts because this environment is read-only

## Recommended Next Focus
Trace iteration 2 through the exact write path and truthfulness boundary: `tool_add_drawer`, duplicate checking, WAL logging, diary semantics, onboarding/runtime drift (`README` says `init` is guided onboarding, but `cli.py` does not call `onboarding.py`), and then decide which MemPalace ideas are architecture we should prototype versus presentation we should reject.


hook: Stop
hook: Stop Completed
tokens used
200,157
# Iteration 001: ARCHITECTURE OVERVIEW

## Focus
ARCHITECTURE OVERVIEW: Scan repository structure, key directories, main entry points, README, and architecture docs. Map high-level components and data flow.

## Findings
### Finding 1: MemPalace is really four subsystems around one shared local store boundary
- **Source**: [external/pyproject.toml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/pyproject.toml), [external/mempalace/cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/cli.py#L39), [external/mempalace/palace.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace.py#L37), [external/mempalace/knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L49), [external/hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md)
- **What it does**: The package exposes one `mempalace` CLI entrypoint, then fans into project/conversation ingest, ChromaDB drawer retrieval, a separate SQLite temporal KG, and hook-triggered save timing. The real runtime split is: `cli.py` dispatches commands, `palace.py` owns Chroma collection access, `knowledge_graph.py` owns fact storage, and `hooks_cli.py` controls preservation timing.
- **Why it matters for us**: This is a clean architectural separation: verbatim corpus, fact graph, and save-timing automation are not collapsed into one retrieval layer. Public already separates semantic memory, code search, and code graph; MemPalace reinforces that this split is a strength, not accidental complexity.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: The raw-verbatim posture is source-confirmed, but “closets” are mostly product language in this version
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L190), [external/mempalace/miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py#L325), [external/mempalace/searcher.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/searcher.py#L21), [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L76)
- **What it does**: The code really does store drawer chunks as verbatim text in `mempalace_drawers` and search those drawers directly. But there is no first-class closet store in the implementation path I traced; L1 is generated on the fly from top drawers, and deep search goes straight against Chroma. The README’s closet language is more conceptual than storage-structural right now.
- **Why it matters for us**: The useful part is not “closets” as branding; it is raw retention plus lightweight derived views. Public can borrow the posture without copying the metaphor.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Agent discipline is embedded into the MCP surface, not left to prompts alone
- **Source**: [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L139), [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L450)
- **What it does**: `mempalace_status` returns counts plus `PALACE_PROTOCOL` and `AAAK_SPEC`, so the first read call doubles as behavioral bootstrapping. The server also cleanly splits read tools, write tools, navigation tools, KG tools, and diary tools, with stderr logging and a write-ahead log for writes.
- **Why it matters for us**: Public already has stronger recovery surfaces (`session_bootstrap`, `session_resume`, `memory_context`), but MemPalace is better at making the memory protocol agent-visible right where the agent starts. That could improve recall ergonomics without inventing a new retrieval backend.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: The wake-up stack is real, but the implementation is simpler than the README framing
- **Source**: [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L34), [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L76), [external/mempalace/layers.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/layers.py#L185), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/README.md#L275)
- **What it does**: L0 is just `~/.mempalace/identity.txt`. L1 is not a maintained summary layer; it is regenerated from the highest-weight drawers, grouped by room. L2 is metadata-filtered `get()`, and L3 is semantic `query()`. So the stack exists, but only L0/L1 are “wake-up” in practice; the rest are normal retrieval modes.
- **Why it matters for us**: Public’s session recovery is already more explicit and richer than this, but MemPalace contributes a good mental model: cheap always-on identity plus a bounded always-on story layer before full retrieval.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Palace graph traversal and temporal KG are separate systems with different truth models
- **Source**: [external/mempalace/palace_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/palace_graph.py#L33), [external/mempalace/knowledge_graph.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/knowledge_graph.py#L49), [external/docs/schema.sql](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/docs/schema.sql)
- **What it does**: `palace_graph.py` derives room tunnels from Chroma metadata only; it is a navigational overlay, not a fact database. `knowledge_graph.py` is a separate SQLite triple store with `valid_from`/`valid_to`, explicit invalidation, and timelines. They solve different problems and are intentionally not fused.
- **Why it matters for us**: This is a strong pattern for Public: keep verbatim memory provenance and fact-like temporal assertions separate, so invalidation and fact drift do not contaminate raw session evidence.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 6: Ingestion is not “store everything untouched”; it is chunk-and-route with heuristic restructuring on some paths
- **Source**: [external/mempalace/miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py#L278), [external/mempalace/miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/miner.py#L325), [external/mempalace/convo_miner.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/convo_miner.py#L39), [external/mempalace/general_extractor.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/general_extractor.py#L1)
- **What it does**: Project ingest chunks files into overlapping ~800-char drawers and routes them by folder/name/keyword heuristics. Conversation ingest chunks by exchange pair or paragraph fallback. `general_extractor.py` goes further and classifies text into decisions, preferences, milestones, problems, and emotions. So raw retention is true at the drawer level, but not at the “unaltered original session object” level.
- **Why it matters for us**: The useful lesson is selective restructuring by ingest mode, not a literal “never transform anything” dogma. Public should compare this carefully against `generate-context.js`, which preserves curated session semantics instead of blindly chunking transcripts.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 7: Hook-driven preservation is a timing architecture, not a storage architecture
- **Source**: [external/mempalace/hooks_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py#L129), [external/mempalace/hooks_cli.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/hooks_cli.py#L189), [external/hooks/mempal_save_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_save_hook.sh), [external/hooks/mempal_precompact_hook.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/mempal_precompact_hook.sh)
- **What it does**: The stop hook blocks every 15 human messages; the precompact hook always blocks. The shell and Python paths both use “block with a reason” so the agent performs the save, optionally followed by auto-ingest. This architecture protects context before loss without needing a richer storage model.
- **Why it matters for us**: Public already has compaction transport via the compact-code-graph plugin, but MemPalace has a stronger explicit checkpointing posture. The idea worth stealing is the enforced preservation checkpoint, not the exact bash implementation.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 8: Public already beats MemPalace on session bootstrap sophistication, but MemPalace beats Public on memory protocol ergonomics
- **Source**: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L486), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L400), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L811), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L62), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L1), [external/mempalace/mcp_server.py](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/mempalace/mcp_server.py#L169)
- **What it does**: Public has a much deeper retrieval stack: hybrid pipeline search, session dedup, intent routing, `memory_context`, `session_resume`, `session_bootstrap`, JSON-primary context capture, and compaction-safe structural transport. MemPalace is simpler, but its status/bootstrap surface is better at teaching the agent when to query, verify, write diaries, and invalidate facts.
- **Why it matters for us**: The architecture takeaway is asymmetric. Public should not copy MemPalace’s backend wholesale. It should selectively import raw-verbatim retention ideas, checkpoint hooks, and protocol-forward memory UX.
- **Recommendation**: adopt now
- **Impact**: high

## Sources Consulted
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
- [external/hooks/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/hooks/README.md)
- [external/benchmarks/BENCHMARKS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/benchmarks/BENCHMARKS.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)

## Assessment
- New information ratio: 0.78
- Questions addressed: raw-verbatim posture, taxonomy usefulness, wake-up layering, MCP protocol/tool design, hook-driven save timing, temporal KG separation, ingest behavior, benchmark truthfulness boundary, comparison against Public memory/bootstrap/compaction
- Questions answered: raw storage is real but chunked and heuristic-routed; taxonomy is partly useful metadata discipline and partly framing; wake-up layers are implemented but simpler than marketed; MCP status-as-protocol is a genuine differentiator; hooks are the strongest compaction-survival idea; KG and palace graph are intentionally separate; benchmark claims need careful source-vs-doc separation; Public already leads on bootstrap/recovery depth

## Reflection
- What worked: tracing the repo in runtime order after the README correction note made the architecture much clearer than reading the benchmark story first; comparing `mcp_server.py`, `layers.py`, and `hooks_cli.py` against Public’s `session_bootstrap` and `generate-context.js` exposed the real differentiators quickly
- What did not work: the requested strict validation step is not trustworthy in this read-only run; the phase folder is missing the required Level 3 docs, and `validate.sh --strict` still reported `RESULT: PASSED` after `cannot create temp file for here document: Operation not permitted`, so I did not treat that as a real readiness pass; I also did not run the workflow-owned `spec_kit:deep-research` or write packet artifacts because this environment is read-only

## Recommended Next Focus
Trace iteration 2 through the exact write path and truthfulness boundary: `tool_add_drawer`, duplicate checking, WAL logging, diary semantics, onboarding/runtime drift (`README` says `init` is guided onboarding, but `cli.py` does not call `onboarding.py`), and then decide which MemPalace ideas are architecture we should prototype versus presentation we should reject.
